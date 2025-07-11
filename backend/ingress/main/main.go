package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/go-redis/redis/v8"
)

type DagRequest struct {
	DagID    string          `json:"dag_id"`
	TenantID string          `json:"tenant_id"`
	Nodes    map[string]Node `json:"nodes"`
	Edges    []Edge          `json:"edges"`
}

type Node struct {
	Prompt  string `json:"prompt"`
	Service string `json:"service"`
}

type Edge struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Prompt string `json:"prompt"`
}

type ReadyRequest struct {
	DagID    string `json:"dag_id"`
	TenantID string `json:"tenant_id"`
}

type MessageRequest struct {
	DagID    string `json:"dag_id"`
	TenantID string `json:"tenant_id"`
	NodeID   string `json:"node_id"`
}

var (
	rdb      *redis.ClusterClient
	s3Client *s3.S3
	bucket   string
)

func initRedisCluster() *redis.ClusterClient {
	return redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:    []string{os.Getenv("REDIS_ADDR")},
		PoolSize: 100,
	})
}

func initS3() *s3.S3 {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
		Credentials: credentials.NewStaticCredentials(
			os.Getenv("AWS_ACCESS_KEY_ID"),
			os.Getenv("AWS_SECRET_ACCESS_KEY"),
			os.Getenv("AWS_SESSION_TOKEN"),
		),
	}))
	return s3.New(sess)
}

func setLifecycle(svc *s3.S3, bucket string) error {
	s := os.Getenv("S3_LIFECYCLE_DAYS")
	days, err1 := strconv.ParseInt(s, 10, 64)
	if err1 != nil {
		days = 30
	}
	input := &s3.PutBucketLifecycleConfigurationInput{
		Bucket: aws.String(bucket),
		LifecycleConfiguration: &s3.BucketLifecycleConfiguration{
			Rules: []*s3.LifecycleRule{
				{
					ID:     aws.String("ExpireOldDags"),
					Status: aws.String(os.Getenv("S3_LIFECYCLE_ENABLE")),
					Filter: &s3.LifecycleRuleFilter{
						Prefix: aws.String("tenant/"),
					},
					Expiration: &s3.LifecycleExpiration{
						Days: aws.Int64(days),
					},
				},
			},
		},
	}
	_, err := svc.PutBucketLifecycleConfiguration(input)
	return err
}

func handleSubmitDAG(w http.ResponseWriter, r *http.Request) {
	var req DagRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	//check the DAG in req is valid
	if err := validateDAG(req); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	//put the DAG into the s3
	data, e := json.Marshal(req)
	if e != nil {
		log.Printf("Error marshalling dag request: %v", e)
	}
	S3key := fmt.Sprintf("tenant/%s/dagRequest/%s", req.TenantID, req.DagID)
	input := &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(S3key),
		Body:        bytes.NewReader(data),
		ContentType: aws.String("application/json"),
	}
	_, err := s3Client.PutObjectWithContext(r.Context(), input)
	if err != nil {
		log.Printf("Failed to upload to S3: %v", err)
	}

	//the url of user input files, return this url to the frontend
	presignURLs := make(map[string]string)
	for nodeID := range req.Nodes {
		key := fmt.Sprintf("tenant/%s/dag/%s/input/%s", req.TenantID, req.DagID, nodeID)
		s3req, _ := s3Client.PutObjectRequest(&s3.PutObjectInput{
			Bucket:      aws.String(bucket),
			Key:         aws.String(key),
			ContentType: aws.String("application/octet-stream"),
		})
		urlStr, err := s3req.Presign(15 * time.Minute)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "Failed to generate presigned URL")
			return
		}
		presignURLs[nodeID] = urlStr
	}

	dagKey := fmt.Sprintf("dag:%s", req.DagID)
	ctx := context.Background()
	pipe := rdb.Pipeline()
	pipe.HSet(ctx, dagKey, "tenant", req.TenantID)
	pipe.HSet(ctx, dagKey, "status", "pending")
	pipe.Publish(ctx, fmt.Sprintf("dag:%s:status", req.DagID), "pending")
	nodesJSON, _ := json.Marshal(req.Nodes)
	pipe.HSet(ctx, dagKey, "nodes", string(nodesJSON))
	edgesJSON, _ := json.Marshal(req.Edges)
	pipe.HSet(ctx, dagKey, "edges", string(edgesJSON))

	//calculate the indegree
	inDegree := make(map[string]int)
	for _, edge := range req.Edges {
		inDegree[edge.To]++
	}

	//put the indegree and status of every node into the redis
	for nodeID := range req.Nodes {
		deg := inDegree[nodeID]
		pipe.HSet(ctx, dagKey, fmt.Sprintf("indegree:%s", nodeID), deg)
		pipe.HSet(ctx, dagKey, fmt.Sprintf("node:%s:status", nodeID), "pending")
	}

	if _, err := pipe.Exec(ctx); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to initialize DAG metadata")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	errJson := json.NewEncoder(w).Encode(map[string]interface{}{
		"dag_id":         req.DagID,
		"tenant_id":      req.TenantID,
		"presigned_urls": presignURLs,
	})
	if errJson != nil {
		respondError(w, http.StatusInternalServerError, "Failed to initialize DAG metadata")
		return
	}
}

func handleReady(w http.ResponseWriter, r *http.Request) {
	var readyReq ReadyRequest
	if err := json.NewDecoder(r.Body).Decode(&readyReq); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if readyReq.DagID == "" || readyReq.TenantID == "" {
		respondError(w, http.StatusBadRequest, "dag_id and tenant_id are required")
		return
	}

	ctx := context.Background()
	// Fetch metadata（weight）
	weight, _ := rdb.HGet(ctx, "weight", readyReq.TenantID).Float64()
	if weight <= 0 {
		weight = 1.0
		log.Printf("%s:Invalid tenant weight", readyReq.TenantID)
		return
	}

	// Fetch global virtual time for every service
	globVtLlm, _ := rdb.Get(ctx, "globalVT_LLM").Float64()
	globVtStt, _ := rdb.Get(ctx, "globalVT_STT").Float64()
	globVtTts, _ := rdb.Get(ctx, "globalVT_TTS").Float64()
	globVtPic2text, _ := rdb.Get(ctx, "globalVT_pic2text").Float64()
	globVtText2pic, _ := rdb.Get(ctx, "globalVT_text2pic").Float64()

	// Fetch user virtual time for every service
	tenVtLlm, _ := rdb.Get(ctx, fmt.Sprintf("tenVT_LLM:%s", readyReq.TenantID)).Float64()
	tenVtStt, _ := rdb.Get(ctx, fmt.Sprintf("tenVT_STT:%s", readyReq.TenantID)).Float64()
	tenVtTts, _ := rdb.Get(ctx, fmt.Sprintf("tenVT_TTS:%s", readyReq.TenantID)).Float64()
	tenVtPic2text, _ := rdb.Get(ctx, fmt.Sprintf("tenVT_pic2text:%s", readyReq.TenantID)).Float64()
	tenVtText2pic, _ := rdb.Get(ctx, fmt.Sprintf("tenVT_text2pic:%s", readyReq.TenantID)).Float64()

	// load nodes
	var nodes map[string]Node
	dagKey := fmt.Sprintf("dag:%s", readyReq.DagID)
	nodesJSON, _ := rdb.HGet(ctx, dagKey, "nodes").Result()
	err := json.Unmarshal([]byte(nodesJSON), &nodes)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to decode dag nodes")
		return
	}

	// find the node with indegree = 0
	pipe := rdb.Pipeline()
	for nodeID, node := range nodes {
		deg, _ := rdb.HGet(ctx, dagKey, fmt.Sprintf("indegree:%s", nodeID)).Int()
		if deg == 0 {
			//calculate the VFT (WFQ algorithm)
			var vft float64
			switch node.Service {
			case "LLM":
				vft = math.Max(globVtLlm, tenVtLlm) + (1.0 / weight)
			case "STT":
				vft = math.Max(globVtStt, tenVtStt) + (1.0 / weight)
			case "TTS":
				vft = math.Max(globVtTts, tenVtTts) + (1.0 / weight)
			case "pic2text":
				vft = math.Max(globVtPic2text, tenVtPic2text) + (1.0 / weight)
			case "text2pic":
				vft = math.Max(globVtText2pic, tenVtText2pic) + (1.0 / weight)
			default:
				respondError(w, http.StatusInternalServerError, "Unknown node service")
			}

			//push the node into the queue
			queueKey := fmt.Sprintf("queue:%s", node.Service)
			pipe.ZAdd(ctx, queueKey, &redis.Z{
				Score:  vft,
				Member: fmt.Sprintf("%s:%s:%s", readyReq.TenantID, readyReq.DagID, nodeID),
			})
		}
	}

	if _, err := pipe.Exec(ctx); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to schedule tasks")
		return
	}

	w.WriteHeader(http.StatusOK)
}

// use SSE
func handleStatusRequest(w http.ResponseWriter, r *http.Request) {
	dagID := strings.TrimPrefix(r.URL.Path, "/status/")
	if dagID == "" {
		respondError(w, http.StatusBadRequest, "Missing dag ID")
		log.Printf("ERR: Missing dag ID in path")
		return
	}
	ctx := r.Context()

	// SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		log.Printf("ERR: Streaming not supported")
		return
	}

	dagKey := fmt.Sprintf("dag:%s", dagID)
	channel := fmt.Sprintf("dag:%s:status", dagID)

	// Check existence
	if exists, err := rdb.Exists(ctx, dagKey).Result(); err != nil {
		log.Printf("ERR: Exists check failed: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if exists == 0 {
		http.Error(w, "DAG not found", http.StatusNotFound)
		log.Printf("ERR: DAG not found: %s", dagID)
		return
	}

	// Subscribe before fetching initial status
	pubSub := rdb.Subscribe(ctx, channel)
	if _, err := pubSub.ReceiveTimeout(ctx, 10*time.Minute); err != nil {
		log.Printf("ERR: Receive timeout: %v", err)
	}
	defer func(pubSub *redis.PubSub) {
		err := pubSub.Close()
		if err != nil {
			log.Printf("ERR: Failed to close pubsub: %v", err)
			return
		}
	}(pubSub)
	if _, err := pubSub.Receive(ctx); err != nil {
		log.Printf("ERR: Subscribe failed: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Send initial status
	if status, err := rdb.HGet(ctx, dagKey, "status").Result(); err == nil {
		_, err := fmt.Fprintf(w, "data: %s\n\n", status)
		if err != nil {
			log.Printf("ERR: Write status failed: %v", err)
			return
		}
		flusher.Flush()
	}

	// Derive Redis context from request (so client disconnect cancels it)
	redisCtx, cancel := context.WithTimeout(ctx, 10*time.Minute)
	defer cancel()

	ch := pubSub.Channel()

	// Event loop
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Printf("INFO: Client disconnected")
			return

		case <-redisCtx.Done():
			log.Printf("WARN: Redis timeout expired")
			return

		case <-ticker.C:
			// keep‑alive ping
			_, err := fmt.Fprintf(w, ": ping\n\n")
			if err != nil {
				log.Printf("ERR: Write failed: %v", err)
				return
			}
			flusher.Flush()

		case msg, ok := <-ch:
			if !ok {
				log.Printf("INFO: PubSub channel closed")
				return
			}
			if msg == nil {
				continue
			}
			_, err := fmt.Fprintf(w, "data: %s\n\n", msg.Payload)
			if err != nil {
				log.Printf("ERR: Redis write failed: %v", err)
				return
			}
			flusher.Flush()

			if isFinalStatus(msg.Payload) {
				log.Printf("INFO: Final status reached: %s", msg.Payload)
				return
			}
		}
	}
}

func isFinalStatus(status string) bool {
	finalStatuses := map[string]bool{
		"completed": true,
		"failed":    true,
	}
	return finalStatuses[status]
}

func handleMessageRequest(w http.ResponseWriter, r *http.Request) {
	var messageRequest MessageRequest
	if err := json.NewDecoder(r.Body).Decode(&messageRequest); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	dagKey := fmt.Sprintf("dag:%s", messageRequest.DagID)
	NodeStatus := fmt.Sprintf("node:%s:status", messageRequest.NodeID)
	ctx := context.Background()
	//check the status of service
	status, err := rdb.HGet(ctx, dagKey, NodeStatus).Result()
	if err != nil {
		respondError(w, http.StatusNotFound, "DAG not found")
		return
	}
	//response error if service is not ok
	if status == "failed" {
		respondError(w, http.StatusNotFound, "This service is failed")
		return
	}
	if status != "ok" {
		respondError(w, http.StatusNotFound, "This result of this service is currently unavailable")
		return
	}
	//get url of output
	key := fmt.Sprintf("tenant/%s/dag/%s/output/%s", messageRequest.TenantID, messageRequest.DagID, messageRequest.NodeID)
	getReq, _ := s3Client.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})
	downloadURL, err := getReq.Presign(15 * time.Minute)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to generate presigned URL")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	errJson := json.NewEncoder(w).Encode(map[string]string{"url": downloadURL})
	if errJson != nil {
		respondError(w, http.StatusInternalServerError, "Failed to encode response")
		return
	}
}

func handleAllDagRequest(w http.ResponseWriter, r *http.Request) {
	tenantID := strings.TrimPrefix(r.URL.Path, "/AllDag/")
	if tenantID == "" {
		http.Error(w, "missing tenantID", http.StatusBadRequest)
		return
	}

	prefix := fmt.Sprintf("tenant/%s/dagRequest/", tenantID)

	var (
		continuationToken *string
		allJSONs          []json.RawMessage
	)
	//get dags from s3
	for {
		out, err := s3Client.ListObjectsV2(&s3.ListObjectsV2Input{
			Bucket:            aws.String(bucket),
			Prefix:            aws.String(prefix),
			ContinuationToken: continuationToken,
		})
		if err != nil {
			log.Printf("ListObjectsV2 error: %v", err)
			http.Error(w, "failed to list S3 objects", http.StatusInternalServerError)
			return
		}

		for _, obj := range out.Contents {
			getOut, err := s3Client.GetObject(&s3.GetObjectInput{
				Bucket: aws.String(bucket),
				Key:    obj.Key,
			})
			if err != nil {
				log.Printf("GetObject %s error: %v", *obj.Key, err)
				continue
			}

			data, err2 := io.ReadAll(getOut.Body)
			if err2 != nil {
				log.Printf("read body %s error: %v", *obj.Key, err2)
				continue
			}
			errClose := getOut.Body.Close()
			if errClose != nil {
				log.Printf("read body %s error: %v", *obj.Key, errClose)
				return
			}

			allJSONs = append(allJSONs, data)
		}

		if aws.BoolValue(out.IsTruncated) {
			continuationToken = out.NextContinuationToken
		} else {
			break
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(allJSONs); err != nil {
		log.Printf("response encode error: %v", err)
	}
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func handleReadiness(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 200*time.Millisecond)
	defer cancel()

	// Redis ping
	if err := rdb.Ping(ctx).Err(); err != nil {
		respondError(w, http.StatusServiceUnavailable, "Redis unavailable")
		return
	}

	// S3 list buckets
	if _, err := s3Client.ListBucketsWithContext(ctx, &s3.ListBucketsInput{}); err != nil {
		respondError(w, http.StatusServiceUnavailable, "S3 unavailable")
		return
	}

	w.WriteHeader(http.StatusOK)
}

func respondError(w http.ResponseWriter, code int, message string) {
	w.WriteHeader(code)
	err := json.NewEncoder(w).Encode(map[string]string{"error": message})
	if err != nil {
		return
	}
}

func validateDAG(req DagRequest) error {
	if req.DagID == "" || req.TenantID == "" {
		return fmt.Errorf("dag_id and tenant_id are required")
	}
	return nil
}

func main() {
	rdb = initRedisCluster()
	s3Client = initS3()
	bucket = os.Getenv("S3_BUCKET")
	if err := setLifecycle(s3Client, bucket); err != nil {
		log.Printf("ERR: Failed to set lifecycle: %v", err)
	}

	http.HandleFunc("/submit", handleSubmitDAG)
	http.HandleFunc("/ready", handleReady)
	http.HandleFunc("/status/", handleStatusRequest)
	http.HandleFunc("/AllDag/", handleAllDagRequest)
	http.HandleFunc("/message", handleMessageRequest)

	http.HandleFunc("/healthz", healthCheck)
	http.HandleFunc("/readyz", handleReadiness)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

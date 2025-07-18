package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/redis/go-redis/v9"
)

type Scheduler struct {
	serviceName string
	rdb         *redis.ClusterClient
	bucket      string
	workerURL   string
	limiter     *DualTokenBucket
}

type DualTokenBucket struct {
	concurrency chan struct{}
	qps         *time.Ticker
}

type DAGNode struct {
	Prompt  string `json:"prompt"`
	Service string `json:"service"`
}

type DAGEdge struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Prompt string `json:"prompt"`
}

type edgeInput struct {
	Prompt string `json:"prompt"`
	URL    string `json:"url"`
}

type nodeCompletionEvent struct {
	TenantID string `json:"tenant_id"`
	DagID    string `json:"dag_id"`
	NodeID   string `json:"node_id"`
	Service  string `json:"service"`
	Status   int    `json:"status"`
}

func NewDualTokenBucket(concurrency, qps int) *DualTokenBucket {
	return &DualTokenBucket{
		concurrency: make(chan struct{}, concurrency),
		qps:         time.NewTicker(time.Second / time.Duration(qps)),
	}
}

func (dtb *DualTokenBucket) Acquire() {
	dtb.concurrency <- struct{}{}
	<-dtb.qps.C
}

func (dtb *DualTokenBucket) Release() {
	<-dtb.concurrency
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

func NewScheduler(serviceName string) *Scheduler {
	workerURL := fmt.Sprintf("http://%s%s", os.Getenv("WORKER_SERVICE"), os.Getenv("WORKER_API"))
	concurrency, _ := strconv.Atoi(os.Getenv("CONCURRENCY_LIMIT"))
	qps, _ := strconv.Atoi(os.Getenv("QPS_LIMIT"))

	addrs := strings.Split(os.Getenv("REDIS_ADDRS"), ",")
	var resolvedAddrs []string
    for i := 0; i < 30; i++ {
        for _, addr := range addrs {
            host, port, _ := net.SplitHostPort(addr)
            ips, err := net.LookupHost(host)
            if err == nil && len(ips) > 0 {
                resolvedAddrs = append(resolvedAddrs, net.JoinHostPort(ips[0], port))
            }
        }
        if len(resolvedAddrs) == len(addrs) {
            break
        }
        time.Sleep(2 * time.Second)
    }
    
    if len(resolvedAddrs) == 0 {
        resolvedAddrs = addrs 
    }

	return &Scheduler{
		serviceName: serviceName,
		rdb: redis.NewClusterClient(&redis.ClusterOptions{
			Addrs:    resolvedAddrs,
			PoolSize: 100,
			DialTimeout:  10 * time.Second,
			ReadTimeout:  5 * time.Second,
			WriteTimeout: 5 * time.Second,
		}),
		bucket:    os.Getenv("S3_BUCKET"),
		workerURL: workerURL,
		limiter:   NewDualTokenBucket(concurrency, qps),
	}
}

func (s *Scheduler) Run() {
	queueKey := fmt.Sprintf("queue:%s", s.serviceName)
	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		task, vft, err := s.getNextTask(queueKey)
		if err != nil || task == "" {
			continue
		}
		log.Printf("Get the next task")
		s.limiter.Acquire()
		go s.dispatchTask(task, vft)
	}
}

func (s *Scheduler) getNextTask(queueKey string) (string, float64, error) {
	ctx := context.Background()

	items, err := s.rdb.ZPopMin(ctx, queueKey, 1).Result()

	if err != nil {
		return "", 0, err
	}
	if len(items) == 0 {
		return "", 0, nil
	}

	task := items[0].Member.(string)
	vft := items[0].Score

	return task, vft, nil
}

func (s *Scheduler) dispatchTask(task string, vft float64) {
	defer s.limiter.Release()

	parts := strings.Split(task, ":")
	if len(parts) != 3 {
		log.Printf("Invalid task format: %s", task)
		return
	}
	tenantID, dagID, nodeID := parts[0], parts[1], parts[2]

	// Update VFT and status
	ctx := context.Background()
	dagKey := fmt.Sprintf("dag:%s", dagID)
	pipe := s.rdb.Pipeline()
	// global and tenant  VFT
	pipe.Set(ctx, fmt.Sprintf("globalVT_%s", os.Getenv("SERVICE_NAME")), vft, 0)
	pipe.Set(ctx, fmt.Sprintf("tenVT_%s:%s", os.Getenv("SERVICE_NAME"), tenantID), vft, 0)
	// mark node as running
	pipe.HSet(ctx, dagKey, fmt.Sprintf("node:%s:status", nodeID), "running")
	pipe.HSet(ctx, dagKey, "status", fmt.Sprintf("running:%s", nodeID))
	pipe.Publish(ctx, fmt.Sprintf("dag:%s:status", dagID), fmt.Sprintf("running:%s", nodeID))
	if _, err := pipe.Exec(ctx); err != nil {
		log.Printf("pipeline exec failed: %v", err)
	}

	// Load DAG nodes and edges
	results, err := s.rdb.HMGet(ctx, dagKey, "nodes", "edges").Result()
	if err != nil {
		log.Printf("Redis HMGet failed: %v", err)
		// publish failure event
		publishCompletion(ctx, s.rdb, tenantID, dagID, nodeID, os.Getenv("SERVICE_NAME"), http.StatusInternalServerError)
		return
	}

	nodesJSON, _ := results[0].(string)
	edgesJSON, _ := results[1].(string)
	var nodes map[string]DAGNode
	var edges []DAGEdge
	if err := json.Unmarshal([]byte(nodesJSON), &nodes); err != nil {
		log.Printf("Unmarshal nodes failed: %v", err)
	}
	if err := json.Unmarshal([]byte(edgesJSON), &edges); err != nil {
		log.Printf("Unmarshal edges failed: %v", err)
	}

	// Build input URLs from upstream nodes
	sourceInputs := make(map[string]edgeInput)
	s3Client := initS3()
	for _, edge := range edges {
		if edge.To == nodeID {
			key := fmt.Sprintf("tenant/%s/dag/%s/output/%s", tenantID, dagID, edge.From)
			req, _ := s3Client.GetObjectRequest(&s3.GetObjectInput{
				Bucket: aws.String(s.bucket),
				Key:    aws.String(key),
			})
			url, err := req.Presign(15 * time.Minute)
			if err != nil {
				log.Printf("Failed to presign source URL: %v", err)
			}

			sourceInputs[edge.From] = edgeInput{Prompt: edge.Prompt, URL: url}
		}
	}

	// Get node prompt and URLs
	nodePrompt := nodes[nodeID].Prompt

	//input url
	inKey := fmt.Sprintf("tenant/%s/dag/%s/input/%s", tenantID, dagID, nodeID)
	inReq, _ := s3Client.GetObjectRequest(&s3.GetObjectInput{Bucket: aws.String(s.bucket), Key: aws.String(inKey)})
	inputURL, err := inReq.Presign(15 * time.Minute)
	if err != nil {
		log.Printf("Failed to presign input URL: %v", err)
	}

	//output url
	outKey := fmt.Sprintf("tenant/%s/dag/%s/output/%s", tenantID, dagID, nodeID)
	
	targetURL:=fmt.Sprintf("s3://%s/%s",s.bucket,outKey)

	// Prepare request to worker
	reqBody, err := json.Marshal(map[string]interface{}{
		"prompt":     nodePrompt,
		"input_url":  inputURL,
		"edge_url":   sourceInputs,
		"target_url": targetURL,
	})
	if err != nil {
		log.Printf("Failed to marshal request body: %v", err)
		publishCompletion(ctx, s.rdb, tenantID, dagID, nodeID, os.Getenv("SERVICE_NAME"), http.StatusInternalServerError)
		return
	}

	req, err := http.NewRequest("POST", s.workerURL, bytes.NewBuffer(reqBody))
	if err != nil {
		log.Printf("Failed to create HTTP request: %v", err)
		publishCompletion(ctx, s.rdb, tenantID, dagID, nodeID, os.Getenv("SERVICE_NAME"), http.StatusInternalServerError)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// Send request
	timeoutMs, _ := strconv.Atoi(os.Getenv("HTTP_TIMEOUT_MS"))
	client := &http.Client{Timeout: time.Duration(timeoutMs) * time.Millisecond}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("HTTP request error: %v", err)
		publishCompletion(ctx, s.rdb, tenantID, dagID, nodeID, os.Getenv("SERVICE_NAME"), http.StatusInternalServerError)
		return
	}
	
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
    	log.Fatalf("读取响应 Body 失败: %v", err)
	}
	bodyString := string(bodyBytes)
	log.Printf("Response body: %s", bodyString)

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Printf("Failed to close response body: %v", err)
		}
	}(resp.Body)

	// Handle response and publish completion event
	status := resp.StatusCode
	publishCompletion(ctx, s.rdb, tenantID, dagID, nodeID, os.Getenv("SERVICE_NAME"), status)
}

func publishCompletion(ctx context.Context, rdb redis.UniversalClient, tenantID, dagID, nodeID, service string, status int) {
	event := nodeCompletionEvent{
		TenantID: tenantID,
		DagID:    dagID,
		NodeID:   nodeID,
		Service:  service,
		Status:   status,
	}
	payload, err := json.Marshal(event)
	if err != nil {
		log.Printf("Failed to marshal node_done event: %v", err)
		return
	}
	if subs, err := rdb.Publish(ctx, "node_done", payload).Result(); err != nil {
		log.Printf("Failed to publish node_done: %v", err)
	} else {
		log.Printf("Published node_done for %s:%s with status %d to %d subscribers", dagID, nodeID, status, subs)
	}
}

func main() {
	serviceName := os.Getenv("SERVICE_NAME")
	scheduler := NewScheduler(serviceName)
	scheduler.Run()
}

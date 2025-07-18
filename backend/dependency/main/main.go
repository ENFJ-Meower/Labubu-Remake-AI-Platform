package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type DependencyController struct {
	rdb *redis.ClusterClient
}

type NodeCompletionEvent struct {
	TenantID string `json:"tenant_id"`
	DagID    string `json:"dag_id"`
	NodeID   string `json:"node_id"`
	Service  string `json:"service"`
	Status   int    `json:"status"`
}

func NewDependencyController() *DependencyController {
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
	
	return &DependencyController{
		rdb: redis.NewClusterClient(&redis.ClusterOptions{
			Addrs:    resolvedAddrs,
			PoolSize: 100,
			DialTimeout:  10 * time.Second,
			ReadTimeout:  5 * time.Second,
			WriteTimeout: 5 * time.Second,
		}),
	}
}

func (c *DependencyController) Run() {
	ctx := context.Background()
	pubSub := c.rdb.Subscribe(ctx, "node_done")
	defer func(pubSub *redis.PubSub) {
		err := pubSub.Close()
		if err != nil {
			log.Printf("Failed to close Redis PubSub: %v", err)
		}
	}(pubSub)

	for msg := range pubSub.Channel() {
		var event NodeCompletionEvent
		if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
			log.Printf("Error decoding event: %v", err)
			continue
		}
		go c.handleNodeCompletion(event)
	}
}

func (c *DependencyController) handleNodeCompletion(event NodeCompletionEvent) {
	dagKey := fmt.Sprintf("dag:%s", event.DagID)
	ctx := context.Background()

	if event.Status == http.StatusOK {
		c.rdb.HSet(ctx, dagKey, fmt.Sprintf("node:%s:status", event.NodeID), "ok")
	} else {
		c.rdb.HSet(ctx, dagKey, fmt.Sprintf("node:%s:status", event.NodeID), "failed")
		c.rdb.HSet(ctx, dagKey, "status", "failed")
		c.rdb.Publish(ctx, fmt.Sprintf("dag:%s:status", event.DagID), "failed")

		//set expire time
		_, err := c.rdb.Expire(ctx, dagKey, 5*time.Minute).Result()
		if err != nil {
			log.Printf("Failed to set dependencies: %v", err)
		}
		return
	}

	edgesJSON, _ := c.rdb.HGet(ctx, dagKey, "edges").Result()
	var edges []struct{ From, To string }
	err := json.Unmarshal([]byte(edgesJSON), &edges)
	if err != nil {
		log.Printf("Error decoding edges: %v", err)
		return
	}

	nodesJSON, _ := c.rdb.HGet(ctx, dagKey, "nodes").Result()
	var nodes map[string]struct{ Service string }
	err = json.Unmarshal([]byte(nodesJSON), &nodes)
	if err != nil {
		log.Printf("Error decoding nodes: %v", err)
		return
	}

	// Fetch metadata（weight）
	weight, _ := c.rdb.HGet(ctx, "weight", event.TenantID).Float64()
	if weight <= 0 {
		log.Printf("Error decoding weight: %v", weight)
		weight = 1
	}
	// Fetch global virtual time for every service
	globVtLlm, _ := c.rdb.Get(ctx, "globalVT_LLM").Float64()
	globVtStt, _ := c.rdb.Get(ctx, "globalVT_STT").Float64()
	globVtTts, _ := c.rdb.Get(ctx, "globalVT_TTS").Float64()
	globVtPic2text, _ := c.rdb.Get(ctx, "globalVT_pic2text").Float64()
	globVtText2pic, _ := c.rdb.Get(ctx, "globalVT_text2pic").Float64()

	// Fetch user virtual time for every service
	tenVtLlm, _ := c.rdb.Get(ctx, fmt.Sprintf("tenVT_LLM:%s", event.TenantID)).Float64()
	tenVtStt, _ := c.rdb.Get(ctx, fmt.Sprintf("tenVT_STT:%s", event.TenantID)).Float64()
	tenVtTts, _ := c.rdb.Get(ctx, fmt.Sprintf("tenVT_TTS:%s", event.TenantID)).Float64()
	tenVtPic2text, _ := c.rdb.Get(ctx, fmt.Sprintf("tenVT_pic2text:%s", event.TenantID)).Float64()
	tenVtText2pic, _ := c.rdb.Get(ctx, fmt.Sprintf("tenVT_text2pic:%s", event.TenantID)).Float64()

	pipe := c.rdb.Pipeline()
	for _, edge := range edges {
		if edge.From == event.NodeID {
			newDeg, _ := pipe.HIncrBy(ctx, dagKey, fmt.Sprintf("indegree:%s", edge.To), -1).Result()
			if newDeg == 0 {
				//calculate the VFT (WFQ algorithm)
				var vft float64
				switch nodes[edge.To].Service {
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
					log.Printf("Error decoding nodes: %v", nodes[edge.To].Service)
				}
				queueKey := fmt.Sprintf("queue:%s", nodes[edge.To].Service)
				pipe.ZAdd(ctx, queueKey, redis.Z{
					Score:  vft,
					Member: fmt.Sprintf("%s:%s:%s", event.TenantID, event.DagID, edge.To),
				})
			}
		}
	}

	nodeStatuses, _ := c.rdb.HGetAll(ctx, dagKey).Result()
	completed := true
	for key, val := range nodeStatuses {
		if strings.HasPrefix(key, "node:") && strings.HasSuffix(key, ":status") && val != "ok" {
			completed = false
			break
		}
	}
	if completed {
		pipe.HSet(ctx, dagKey, "status", "completed")
		pipe.Publish(ctx, fmt.Sprintf("dag:%s:status", event.DagID), "completed")
	}

	if _, err := pipe.Exec(ctx); err != nil {
		log.Printf("Failed to process dependencies: %v", err)
	}

	//set expire time
	_, err = c.rdb.Expire(ctx, dagKey, 5*time.Minute).Result()
	if err != nil {
		log.Printf("Failed to set dependencies: %v", err)
		return
	}
}

func main() {
	controller := NewDependencyController()
	controller.Run()
}

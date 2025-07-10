# API 文档 - AI Agent

## 概述
本文档详细说明了 DAG 管理系统的 API 接口，供前端开发使用。系统基于 Go 实现，使用 Redis 管理状态，S3 存储文件，支持 DAG 提交、状态跟踪、结果获取等功能。

---

## 目录
1. [提交 DAG](#提交-dag)
2. [通知 DAG 就绪](#通知-dag-就绪)
3. [获取 DAG 状态](#获取-dag-状态)
4. [获取节点结果](#获取节点结果)
5. [获取租户所有 DAG](#获取租户所有-dag)
6. [健康检查](#健康检查)
7. [就绪检查](#就绪检查)

---

## 提交 DAG
### 请求
- **方法**: POST
- **路径**: `/submit`
- **Content-Type**: `application/json`
- **请求体**:
  ```json
  {
    "dag_id": "string",       // DAG 唯一标识
    "tenant_id": "string",    // 租户 ID
    "nodes": {
      "node_id1": {
        "service": "string"   // 服务类型: LLM/STT/TTS/pic2text/text2pic
      },
      "node_id2": {
        "service": "string"
      }
    },
    "edges": [
      {
        "from": "node_id1",   // 起始节点
        "to": "node_id2",     // 目标节点
        "prompt": "string"    // 提示信息
      }
    ]
  }
  ```

### 成功响应 (200 OK)
```json
{
  "dag_id": "string",
  "tenant_id": "string",
  "presigned_urls": {
    "node_id1": "string",    // S3 预签名上传 URL
    "node_id2": "string"     // 15 分钟内有效
  }
}
```

### 错误响应
- `400 Bad Request`: 请求体无效或 DAG 验证失败
- `500 Internal Server Error`: 服务器内部错误

### 功能描述
提交一个新的 DAG 定义，后端会：
1. 验证 DAG 结构
2. 在 Redis 初始化 DAG 元数据
3. 在 S3 存储 DAG 定义
4. 为每个节点生成预签名上传 URL

---

## 通知 DAG 就绪
### 请求
- **方法**: POST
- **路径**: `/ready`
- **Content-Type**: `application/json`
- **请求体**:
  ```json
  {
    "dag_id": "string",    // DAG ID
    "tenant_id": "string"  // 租户 ID
  }
  ```

### 成功响应
- `200 OK`: 空响应体

### 错误响应
- `400 Bad Request`: 缺少必要字段
- `500 Internal Server Error`: 调度任务失败

### 功能描述
通知系统 DAG 的输入文件已上传完毕，系统将：
1. 检查租户权重
2. 计算虚拟完成时间(VFT)
3. 将入度为 0 的节点加入服务队列
4. 开始调度执行

---

## 获取 DAG 状态
### 请求
- **方法**: GET
- **路径**: `/status/{dag_id}`
- **Accept**: `text/event-stream`
- **示例**: `GET /status/dag-123`

### 响应 (SSE 流)
```
data: pending

data: running {nodeID}

data: completed
```

### 状态说明
- `pending`: 等待处理
- `running`: 正在执行{nodeID}
- `completed`: 完成
- `failed`: 失败

### 特性
1. **Server-Sent Events (SSE)** 协议
2. 30 秒发送一次保持连接的心跳 (`: ping`)
3. 最终状态 (`completed`/`failed`) 后自动关闭连接

### 错误响应
- `400 Bad Request`: 缺少 DAG ID
- `404 Not Found`: DAG 不存在
- `500 Internal Server Error`: 内部错误

### 功能描述
实时推送 DAG 状态变化，前端可用于进度跟踪。

---

## 获取节点结果
### 请求
- **方法**: POST
- **路径**: `/message`
- **Content-Type**: `application/json`
- **请求体**:
  ```json
  {
    "dag_id": "string",    // DAG ID
    "tenant_id": "string", // 租户 ID
    "node_id": "string"    // 节点 ID
  }
  ```

### 成功响应 (200 OK)
```json
{
  "url": "string"  // 结果文件下载 URL (15 分钟有效)
}
```

### 错误响应
- `400 Bad Request`: 请求体无效
- `404 Not Found`: DAG 不存在或结果不可用
- `500 Internal Server Error`: 生成 URL 失败

### 功能描述
获取指定节点处理完成后的结果文件下载 URL。

---

## 获取租户所有 DAG
### 请求
- **方法**: GET
- **路径**: `/AllDag/{tenantID}`
- **示例**: `GET /AllDag/tenant-123`

### 成功响应 (200 OK)
```json
[
  {
    "dag_id": "string",
    "tenant_id": "string",
    "nodes": {
      // 节点数据
    },
    "edges": [
      // 边数据
    ]
  },
  // 其他 DAG...
]
```

### 错误响应
- `400 Bad Request`: 缺少租户 ID
- `500 Internal Server Error`: S3 访问失败

### 功能描述
获取指定租户的所有 DAG 的历史提交记录。消息记录默认最长保持30天，超过30天的历史对话会被自动清除。

---

## 健康检查
### 请求
- **方法**: GET
- **路径**: `/healthz`

### 响应
- `200 OK`: 服务正常运行

### 功能描述
验证服务是否正在运行。该接口不供前端直接调用，为Kubernetes探针接口，用于kubernetes检测服务状态。

---

## 就绪检查
### 请求
- **方法**: GET
- **路径**: `/readyz`

### 响应
- `200 OK`: 所有依赖服务正常
- `503 Service Unavailable`: Redis 或 S3 不可用

### 功能描述
验证服务依赖（Redis 和 S3）是否可用。该接口不供前端直接调用，为Kubernetes探针接口，用于kubernetes检测服务状态。

---

## 环境变量
| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `REDIS_ADDR` | Redis 集群地址 | 无 |
| `AWS_REGION` | AWS 区域 | 无 |
| `AWS_ACCESS_KEY_ID` | AWS 访问密钥 | 无 |
| `AWS_SECRET_ACCESS_KEY` | AWS 密钥 | 无 |
| `AWS_SESSION_TOKEN` | AWS 会话令牌 | 无 |
| `S3_BUCKET` | S3 存储桶 | 无 |
| `S3_LIFECYCLE_DAYS` | 文件生命周期天数 | 30 |
| `S3_LIFECYCLE_ENABLE` | 生命周期规则状态 | "Enabled" |

---

## 使用示例
### 完整工作流程
1. **提交 DAG**
   ```bash
   POST /submit
   {
     "dag_id": "dag-2023",
     "tenant_id": "tenant-abc",
     "nodes": {
       "node1": {"service": "STT"},
       "node2": {"service": "LLM"}
     },
     "edges": [
       {"from": "node1", "to": "node2", "prompt": "处理语音转文本"}
     ]
   }
   ```

2. **上传文件**
   ```bash
   # 使用返回的 presigned_urls 上传文件
   curl -X PUT -T "audio.mp3" "https://presigned-url-for-node1"
   ```

3. **通知就绪**
   ```bash
   POST /ready
   {
     "dag_id": "dag-2023",
     "tenant_id": "tenant-abc"
   }
   ```

4. **跟踪状态**
   ```javascript
   // 前端使用 EventSource
   const eventSource = new EventSource("/status/dag-2023");
   eventSource.onmessage = (event) => {
     console.log("状态更新:", event.data);
   };
   ```

5. **获取结果**
   ```bash
   POST /message
   {
     "dag_id": "dag-2023",
     "tenant_id": "tenant-abc",
     "node_id": "node2"
   }
   ```

---

> 提示：所有文件存储生命周期由 `S3_LIFECYCLE_DAYS` 控制，默认为 30 天
```markdown
# Cloud-native Labubu AI Project

[English](#english) | [中文](#chinese)

---

<a id="english"></a>
## Project Overview
Modern microservices architecture leveraging Kubernetes for AI-powered applications. Includes core components for speech/text processing, image generation, and LLM integration. Designed for horizontal scaling and secure secret management.

### Core Features
- 🚀 Kubernetes-native deployments with HPA autoscaling
- 🔒 Centralized secret management for cloud services
- 🧠 AI service modules (LLM, TTS, STT, image/text conversion)
- 🌐 Nginx-based ingress routing

---

## Deployment
### Prerequisites
- Kubernetes cluster (v1.25+)
- Helm v3
- Cloud provider credentials (AWS/Google/OpenAI)

### Steps
```bash
# 1. Apply secrets
kubectl apply -f Backend/secret/

# 2. Deploy core services
kubectl apply -f Backend/redis/
kubectl apply -f Backend/ingress/

# 3. Deploy AI microservices
kubectl apply -f Backend/microservice-LLM/
kubectl apply -f Backend/microservice-STT/

# 4. Deploy frontend
kubectl apply -f Frontend/
```

---

## Architecture Modules
| Module | Purpose | K8s Components |
|--------|---------|----------------|
| **Ingress Controller** | API gateway & traffic routing | Deployment, Service, HPA |
| **LLM Service** | Large Language Model integration | Deployment, Service |
| **TTS/STT** | Text-to-Speech/Speech-to-Text | Deployment, Service |
| **Pic2Text/Text2Pic** | Image/text conversion | Deployment, Service |
| **Secret Manager** | Cloud credential management | Secret manifests |
| **Redis** | Caching & session storage | StatefulSet, Service |
| **Frontend** | User interface | Deployment, Service |
| **Scheduler** | Background task processing | CronJob |

---

## Scaling
```yaml
# Sample HPA configuration (Backend/ingress/ingress-hpa.yaml)
minReplicas: 3
maxReplicas: 10
targetCPUUtilizationPercentage: 80
```

---

<a id="chinese"></a>
## 项目概述
基于 Kubernetes 的现代化微服务架构，支持 AI 应用开发。包含语音/文本处理、图像生成和大语言模型集成等核心组件，设计支持水平扩展和安全密钥管理。

### 核心功能
- 🚀 Kubernetes 原生部署+HPA自动扩展
- 🔒 集中式云服务密钥管理
- 🧠 AI 服务模块 (LLM, TTS, STT, 图像文本转换)
- 🌐 Nginx 入口路由

---

## 部署指南
### 环境要求
- Kubernetes 集群 (v1.25+)
- Helm v3
- 云服务凭证 (AWS/Google/OpenAI)

### 步骤
```bash
# 1. 创建密钥
kubectl apply -f Backend/secret/

# 2. 部署核心服务
kubectl apply -f Backend/redis/
kubectl apply -f Backend/ingress/

# 3. 部署AI微服务
kubectl apply -f Backend/microservice-LLM/
kubectl apply -f Backend/microservice-STT/

# 4. 部署前端
kubectl apply -f Frontend/
```

---

## 架构模块
| 模块 | 功能 | K8s 组件 |
|------|------|----------|
| **Ingress Controller** | API 网关 & 流量路由 | Deployment, Service, HPA |
| **LLM 服务** | 大语言模型集成 | Deployment, Service |
| **TTS/STT** | 语音合成/语音识别 | Deployment, Service |
| **Pic2Text/Text2Pic** | 图像文本互转 | Deployment, Service |
| **密钥管理** | 云凭证管理 | Secret 配置文件 |
| **Redis** | 缓存 & 会话存储 | StatefulSet, Service |
| **前端** | 用户界面 | Deployment, Service |
| **调度器** | 后台任务处理 | CronJob |

---

## 扩展配置
```yaml
# HPA 示例配置 (Backend/ingress/ingress-hpa.yaml)
minReplicas: 3
maxReplicas: 10
targetCPUUtilizationPercentage: 80
```

---
> ℹ️ **Note**: Add environment-specific configurations in `main/` directories  
> ⚠️ **Security Tip**: Rotate secrets quarterly using KMS integrations
```

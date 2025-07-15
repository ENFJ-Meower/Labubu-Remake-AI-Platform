# 🚀 Labubu AI Platform Frontend - Kubernetes 部署指南

## 📋 文件说明

### Kubernetes YAML 文件
- `frontend-deployment.yaml` - 前端应用部署配置
- `frontend-service.yaml` - 前端服务配置
- `frontend-ingress.yaml` - 外部访问配置
- `frontend-configmap.yaml` - 环境变量配置

### 部署脚本
- `build-and-deploy.sh` - 自动构建和部署脚本

## 🛠️ 部署步骤

### 1. 构建 Docker 镜像
```bash
# 构建镜像
docker build -t labubu/frontend:latest .

# 推送到镜像仓库（如果需要）
docker push labubu/frontend:latest
```

### 2. 部署到 Kubernetes
```bash
# 创建命名空间
kubectl create namespace dag-system

# 部署应用
kubectl apply -f frontend-configmap.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-ingress.yaml
```

### 3. 使用自动化脚本
```bash
# 给脚本执行权限
chmod +x build-and-deploy.sh

# 运行部署脚本
./build-and-deploy.sh
```

## 🔧 配置说明

### 环境变量配置
在 `frontend-configmap.yaml` 中配置：
- `VITE_API_BASE_URL` - 后端API地址
- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本
- `VITE_NODE_ENV` - 环境标识

### 资源配置
- **CPU请求**: 100m
- **内存请求**: 128Mi
- **CPU限制**: 250m
- **内存限制**: 256Mi
- **副本数**: 3

### 网络配置
- **容器端口**: 80
- **服务端口**: 80
- **服务类型**: ClusterIP
- **Ingress**: 支持外部访问

## 🌐 访问应用

### 本地访问
```bash
# 端口转发
kubectl port-forward svc/frontend-service 8080:80 -n dag-system

# 访问地址
http://localhost:8080
```

### 通过 Ingress 访问
1. 配置本地 hosts 文件：
   ```
   127.0.0.1 labubu-ai-platform.local
   ```

2. 访问地址：
   ```
   http://labubu-ai-platform.local
   ```

## 📊 监控和调试

### 查看部署状态
```bash
# 查看 Pod 状态
kubectl get pods -n dag-system -l app=frontend

# 查看服务状态
kubectl get svc -n dag-system -l app=frontend

# 查看 Ingress 状态
kubectl get ingress -n dag-system
```

### 查看日志
```bash
# 查看 Pod 日志
kubectl logs -n dag-system -l app=frontend

# 实时查看日志
kubectl logs -n dag-system -l app=frontend -f
```

### 调试 Pod
```bash
# 进入 Pod 内部
kubectl exec -it -n dag-system <pod-name> -- /bin/sh

# 查看 Pod 详细信息
kubectl describe pod -n dag-system <pod-name>
```

## 🔄 更新部署

### 更新镜像
```bash
# 构建新镜像
docker build -t labubu/frontend:v2 .

# 更新 deployment
kubectl set image deployment/frontend-deployment frontend=labubu/frontend:v2 -n dag-system

# 查看更新状态
kubectl rollout status deployment/frontend-deployment -n dag-system
```

### 回滚部署
```bash
# 查看历史版本
kubectl rollout history deployment/frontend-deployment -n dag-system

# 回滚到上一个版本
kubectl rollout undo deployment/frontend-deployment -n dag-system
```

## 🗑️ 清理资源

```bash
# 删除应用
kubectl delete -f frontend-ingress.yaml
kubectl delete -f frontend-service.yaml
kubectl delete -f frontend-deployment.yaml
kubectl delete -f frontend-configmap.yaml

# 或者删除整个命名空间
kubectl delete namespace dag-system
```

## 🔧 故障排除

### 常见问题

1. **Pod 无法启动**
   - 检查镜像是否存在
   - 查看 Pod 事件：`kubectl describe pod <pod-name> -n dag-system`

2. **服务无法访问**
   - 检查服务配置：`kubectl get svc -n dag-system`
   - 检查端口映射是否正确

3. **Ingress 无法访问**
   - 检查 Ingress Controller 是否安装
   - 检查 hosts 文件配置

4. **环境变量问题**
   - 检查 ConfigMap：`kubectl get configmap frontend-config -n dag-system -o yaml`
   - 确认环境变量是否正确加载

### 有用的命令

```bash
# 查看所有资源
kubectl get all -n dag-system

# 查看事件
kubectl get events -n dag-system --sort-by=.metadata.creationTimestamp

# 查看资源使用情况
kubectl top pods -n dag-system
``` 
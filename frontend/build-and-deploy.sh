#!/bin/bash

# Labubu AI Platform Frontend - 构建和部署脚本
# Frontend Build and Deploy Script

set -e

# 配置变量
IMAGE_NAME="labubu/frontend"
IMAGE_TAG="latest"
NAMESPACE="dag-system"

echo "🚀 开始构建 Labubu AI Platform Frontend..."

# 1. 构建 Docker 镜像
echo "📦 构建 Docker 镜像..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# 2. 推送镜像到镜像仓库（如果需要）
echo "📤 推送镜像到仓库..."
# docker push ${IMAGE_NAME}:${IMAGE_TAG}

# 3. 创建命名空间（如果不存在）
echo "🏗️ 创建命名空间..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# 4. 部署到 Kubernetes
echo "🚀 部署到 Kubernetes..."
kubectl apply -f frontend-configmap.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-ingress.yaml

# 5. 检查部署状态
echo "✅ 检查部署状态..."
kubectl get pods -n ${NAMESPACE} -l app=frontend
kubectl get svc -n ${NAMESPACE} -l app=frontend

echo "🎉 部署完成！"
echo "🌐 访问地址: http://labubu-ai-platform.local"
echo "📊 查看状态: kubectl get pods -n ${NAMESPACE} -l app=frontend" 
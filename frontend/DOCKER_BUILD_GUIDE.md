# Labubu Frontend Docker 构建指南

## 📋 概述

本指南介绍如何将Labubu AI Platform前端应用打包成Docker镜像，供Kubernetes部署使用。

## 🛠️ 准备工作

### 1. 确保环境准备就绪

- ✅ Node.js 18+ 已安装
- ✅ Docker Desktop 已安装并运行
- ✅ npm 依赖已安装 (`npm install`)

### 2. 检查Docker服务状态

```bash
# 检查Docker版本
docker --version

# 检查Docker服务是否运行
docker info
```

## 🏗️ 构建流程

### 方法一：使用自动化脚本

#### Windows用户：
```cmd
# 双击运行或在命令行执行
build-docker.bat
```

#### Linux/Mac用户：
```bash
# 添加执行权限
chmod +x build-docker.sh

# 运行构建脚本
./build-docker.sh
```

### 方法二：手动构建

#### 1. 构建前端项目
```bash
npm run build
```

#### 2. 构建Docker镜像
```bash
docker build -t labubu-frontend:latest .
```

#### 3. 验证镜像构建成功
```bash
docker images labubu-frontend
```

## 🧪 测试镜像

### 1. 本地运行测试
```bash
# 启动容器
docker run -p 8080:80 labubu-frontend:latest

# 浏览器访问
http://localhost:8080
```

### 2. 健康检查
```bash
# 检查健康状态
curl http://localhost:8080/health
```

## 📦 文件结构

构建完成后，您将得到以下文件：

```
frontend/
├── Dockerfile              # Docker构建文件
├── nginx.conf              # Nginx配置文件
├── .dockerignore           # Docker忽略文件
├── build-docker.bat        # Windows构建脚本
├── build-docker.sh         # Linux/Mac构建脚本
├── dist/                   # 构建输出目录
│   ├── index.html
│   └── assets/
└── DOCKER_BUILD_GUIDE.md   # 本指南
```

## 🚀 Kubernetes部署准备

### 1. 镜像信息
- **镜像名称**: `labubu-frontend:latest`
- **端口**: 80 (容器内部)
- **协议**: HTTP

### 2. 推送到容器仓库

```bash
# 标记镜像（替换为您的仓库地址）
docker tag labubu-frontend:latest your-registry/labubu-frontend:latest

# 推送到仓库
docker push your-registry/labubu-frontend:latest
```

### 3. Kubernetes部署配置

创建 `frontend-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: labubu-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: labubu-frontend
  template:
    metadata:
      labels:
        app: labubu-frontend
    spec:
      containers:
      - name: labubu-frontend
        image: your-registry/labubu-frontend:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: labubu-frontend-service
spec:
  selector:
    app: labubu-frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

## 🔧 配置说明

### Nginx配置特性

- ✅ **Vue路由支持**: 所有路由都正确重定向到index.html
- ✅ **静态资源缓存**: 优化加载性能
- ✅ **Gzip压缩**: 减少传输大小
- ✅ **API代理**: 自动代理/api请求到后端服务
- ✅ **健康检查**: 提供/health端点

### 多阶段构建优势

- 🔹 **构建阶段**: 使用Node.js镜像构建应用
- 🔹 **运行阶段**: 使用轻量级Nginx镜像运行
- 🔹 **镜像大小**: 最终镜像仅包含必要的静态文件
- 🔹 **安全性**: 不包含源代码和开发依赖

## 📊 镜像信息

- **基础镜像**: nginx:alpine
- **预估大小**: ~50MB
- **暴露端口**: 80
- **运行用户**: nginx
- **入口点**: nginx

## 🔍 故障排除

### 常见问题

1. **Docker守护进程未运行**
   ```
   解决方案: 启动Docker Desktop
   ```

2. **构建失败**
   ```bash
   # 清理并重新构建
   npm run build
   docker build --no-cache -t labubu-frontend:latest .
   ```

3. **端口冲突**
   ```bash
   # 使用不同端口
   docker run -p 8081:80 labubu-frontend:latest
   ```

4. **镜像过大**
   ```bash
   # 检查镜像大小
   docker images labubu-frontend
   # 清理不必要的层
   docker system prune
   ```

## 📞 支持

如果在构建过程中遇到问题，请检查：

1. Docker服务是否正常运行
2. 网络连接是否正常
3. 磁盘空间是否充足
4. Node.js版本是否兼容

---

**构建完成后，请将镜像信息提供给Kubernetes部署团队！** 🎉 
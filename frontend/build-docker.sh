#!/bin/bash

echo "==================================="
echo "    Labubu Frontend Docker Build"
echo "==================================="

echo
echo "1. 检查Docker服务状态..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker未安装或未找到"
    exit 1
fi

docker --version

echo
echo "2. 检查Docker守护进程..."
if ! docker info &> /dev/null; then
    echo "ERROR: Docker守护进程未运行"
    echo "请启动Docker服务并重试"
    exit 1
fi

echo
echo "3. 清理旧的构建文件..."
rm -rf dist

echo
echo "4. 构建前端项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: 前端构建失败"
    exit 1
fi

echo
echo "5. 构建Docker镜像..."
docker build --platform=linux/amd64 -t weimengze/cloud-computing-frontend:v27 .
if [ $? -ne 0 ]; then
    echo "ERROR: Docker镜像构建失败"
    exit 1
fi

echo
echo "6. 显示构建的镜像..."
docker images weimengze/cloud-computing-frontend

echo
echo "==================================="
echo "    构建完成！"
echo "==================================="
echo
echo "镜像名称: weimengze/cloud-computing-frontend:v1"
echo "测试命令: docker run -p 8080:80 weimengze/cloud-computing-frontend:v1"
echo 
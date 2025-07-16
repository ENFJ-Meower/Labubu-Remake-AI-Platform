@echo off
echo ===================================
echo     Labubu Frontend Docker Build
echo ===================================

echo.
echo 1. 检查Docker服务状态...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker未安装或未找到
    pause
    exit /b 1
)

echo.
echo 2. 检查Docker守护进程...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker守护进程未运行
    echo 请启动Docker Desktop并重试
    pause
    exit /b 1
)

echo.
echo 3. 清理旧的构建文件...
if exist dist rmdir /s /q dist

echo.
echo 4. 构建前端项目...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: 前端构建失败
    pause
    exit /b 1
)

echo.
echo 5. 构建Docker镜像...
docker build --platform=linux/amd64 -t weimengze/cloud-computing-frontend:v1 .
if %errorlevel% neq 0 (
    echo ERROR: Docker镜像构建失败
    pause
    exit /b 1
)

echo.
echo 6. 显示构建的镜像...
docker images weimengze/cloud-computing-frontend

echo.
echo ===================================
echo     构建完成！
echo ===================================
echo.
echo 镜像名称: weimengze/cloud-computing-frontend:v1
echo 测试命令: docker run -p 8080:80 weimengze/cloud-computing-frontend:v1
echo.
pause 
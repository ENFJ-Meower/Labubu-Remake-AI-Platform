# 多阶段构建 - 第一阶段：构建应用
FROM node:current-alpine3.22 AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

RUN npm install

# 构建应用
RUN npm run build

# 第二阶段：生产环境
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 
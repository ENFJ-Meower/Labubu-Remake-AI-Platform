# Labubu AI Platform - 路由指南

## 📋 项目路由架构

本项目采用清晰的路由分离架构：
- **前端路由**: `/frontend/xxx` - 所有页面访问
- **后端API**: `/backend/xxx` - 所有API调用

## 🎯 前端页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/frontend/` | Home.vue | 首页 |
| `/frontend/ai-agent` | AIAgent.vue | AI智能体工作流设计 |
| `/frontend/community` | Community.vue | 社区交流平台 |
| `/frontend/marketplace` | Marketplace.vue | 创意作品市场 |
| `/frontend/about` | About.vue | 关于我们 |
| `/frontend/login` | Login.vue | 用户登录 |
| `/frontend/register` | Register.vue | 用户注册 |

### 📝 页面访问方式

#### 开发环境 (localhost:3000)
```
首页: http://localhost:3000/frontend/
AI智能体: http://localhost:3000/frontend/ai-agent
社区: http://localhost:3000/frontend/community
市场: http://localhost:3000/frontend/marketplace
关于我们: http://localhost:3000/frontend/about
登录: http://localhost:3000/frontend/login
注册: http://localhost:3000/frontend/register
```

#### 生产环境 (labubu.me)
```
首页: https://labubu.me/frontend/
AI智能体: https://labubu.me/frontend/ai-agent
社区: https://labubu.me/frontend/community
市场: https://labubu.me/frontend/marketplace
关于我们: https://labubu.me/frontend/about
登录: https://labubu.me/frontend/login
注册: https://labubu.me/frontend/register
```

## 🔌 后端API路由

### 用户认证API

| API路由 | 方法 | 说明 |
|---------|------|------|
| `/backend/user/login` | POST | 用户登录 |
| `/backend/user/register` | POST | 用户注册 |
| `/backend/user/sendCode` | POST | 发送验证码 |

### AI工作流API

| API路由 | 方法 | 说明 |
|---------|------|------|
| `/backend/api/v1/submit` | POST | 提交DAG工作流 |
| `/backend/api/v1/ready` | POST | 通知工作流就绪 |
| `/backend/api/v1/status/{dag_id}` | GET | 获取DAG状态 |
| `/backend/api/v1/message` | GET | 获取处理结果 |
| `/backend/api/v1/AllDag/{tenantID}` | GET | 获取所有DAG |
| `/backend/api/v1/status/stream/{dag_id}` | GET | SSE状态推送 |

### 📝 API调用示例

#### 用户登录
```javascript
fetch('/backend/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password'
  })
})
```

#### 获取DAG列表
```javascript
fetch('/backend/api/v1/AllDag/tenant_id', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_token'
  }
})
```

## 🔧 开发配置

### API基础配置 (api.js)
```javascript
const baseURL = 'http://localhost:8081/backend/api/v1'
```

### Vite代理配置 (vite.config.js)
```javascript
proxy: {
  '/backend': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false
  }
}
```

## 🚀 部署架构

### 开发环境
- 前端服务: `localhost:3000`
- 后端服务: `localhost:8080`
- 通过Vite代理处理 `/backend` 请求

### 生产环境
- 通过Nginx处理路由分发
- `/frontend/` 路径提供静态文件
- `/backend/` 路径代理到后端服务
- 根路径 `/` 自动重定向到 `/frontend/`

## ✅ 快速验证

### 前端页面验证
```bash
# 访问首页
curl https://labubu.me/frontend/

# 访问AI智能体页面
curl https://labubu.me/frontend/ai-agent
```

### 后端API验证
```bash
# 测试工作流API
curl https://labubu.me/backend/api/v1/AllDag/test_tenant
```

---

**文档版本**: 2024年12月  
**项目团队**: Labubu AI Platform 开发组 
# Labubu AI Platform - 路由指南

## 📋 项目路由架构

本项目采用清晰的路由分离架构：
- **前端路由**: 首页为 `/`，其他页面为 `/frontend/xxx`
- **后端API**: `/backend/ai-agent/xxx` - 所有AI智能体相关API
- **用户认证**: `/backend/user/xxx` - 登录注册相关API

## 🔐 JWT认证机制

### 认证流程
1. **用户登录/注册** → 后端返回JWT令牌
2. **访问AI智能体API** → 自动携带JWT认证头
3. **后端验证** → 确认用户身份后提供服务

### 认证规则
| API类型 | JWT认证 | 说明 |
|---------|---------|------|
| 用户登录 `/backend/user/login` | ❌ 不需要 | 登录时用户还没有令牌 |
| 用户注册 `/backend/user/register` | ❌ 不需要 | 注册时用户还没有令牌 |
| 发送验证码 `/backend/user/sendCode` | ❌ 不需要 | 发送验证码不需要登录 |
| AI智能体API `/backend/ai-agent/xxx` | ✅ 必须 | 保护用户数据和AI服务 |

### JWT令牌格式
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 前端页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/frontend/ai-agent` | AIAgent.vue | AI智能体工作流设计 |
| `/frontend/community` | Community.vue | 社区交流平台 |
| `/frontend/marketplace` | Marketplace.vue | 创意作品市场 |
| `/frontend/about` | About.vue | 关于我们 |
| `/frontend/login` | Login.vue | 用户登录 |
| `/frontend/register` | Register.vue | 用户注册 |

### 📝 页面访问方式

#### 开发环境 (localhost:3000)
```
首页: http://localhost:3000/
AI智能体: http://localhost:3000/frontend/ai-agent
社区: http://localhost:3000/frontend/community
市场: http://localhost:3000/frontend/marketplace
关于我们: http://localhost:3000/frontend/about
登录: http://localhost:3000/frontend/login
注册: http://localhost:3000/frontend/register
```

#### 生产环境 (labubu.me)
```
首页: https://labubu.me/
AI智能体: https://labubu.me/frontend/ai-agent
社区: https://labubu.me/frontend/community
市场: https://labubu.me/frontend/marketplace
关于我们: https://labubu.me/frontend/about
登录: https://labubu.me/frontend/login
注册: https://labubu.me/frontend/register
```

## 🔌 后端API路由

### 用户认证API（无需JWT）

| API路由 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/backend/user/login` | POST | 用户登录 | ❌ 无需 |
| `/backend/user/register` | POST | 用户注册 | ❌ 无需 |
| `/backend/user/sendCode` | POST | 发送验证码 | ❌ 无需 |

### AI智能体工作流API（需要JWT）

| API路由 | 方法 | 说明 | 认证 | 使用场景 |
|---------|------|------|------|----------|
| `/backend/ai-agent/submit` | POST | 提交DAG工作流 | ✅ 需要 | 创建新工作流 |
| `/backend/ai-agent/ready` | POST | 通知工作流就绪 | ✅ 需要 | 启动工作流执行 |
| `/backend/ai-agent/status/{dag_id}` | GET | 获取DAG状态 | ✅ 需要 | **状态查询和监控** |
| `/backend/ai-agent/message` | GET | 获取处理结果 | ✅ 需要 | 获取工作流输出结果 |
| `/backend/ai-agent/AllDag/{tenantID}` | GET | 获取所有DAG | ✅ 需要 | 工作流列表管理 |

#### 状态监控说明

**工作流状态监控**
- **实现方式**：前端轮询 `/backend/ai-agent/status/{dag_id}` 接口
- **轮询频率**：每2秒查询一次状态
- **监控时长**：最长10分钟（300次轮询）
- **状态类型**：running（运行中）、completed（已完成）、failed（失败）
- **自动停止**：工作流完成或失败时自动停止轮询

### 📝 API调用示例

#### 用户登录（无需JWT）
```javascript
import { userAuthAPI } from '@/config/api.js'

const data = await userAuthAPI.login('username', 'password')
// 自动保存JWT令牌到localStorage
```

#### AI智能体API（自动携带JWT）
```javascript
import { workflowAPI } from '@/config/api.js'

// 自动从localStorage获取JWT令牌并添加到请求头
const dags = await workflowAPI.getAllDAGs()
```

#### 手动API调用示例
```javascript
// 用户认证API - 不携带JWT
fetch('/backend/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // 注意：这里不需要Authorization头
  },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password'
  })
})

// AI智能体API - 必须携带JWT
const token = localStorage.getItem('labubu_token')
fetch('/backend/ai-agent/AllDag/tenant_id', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // 必须携带JWT令牌
  }
})
```

## 🔧 开发配置

### API基础配置 (api.js)
```javascript
// AI智能体API配置 - 自动携带JWT
const baseURL = 'http://localhost:8081/backend/ai-agent'

// 用户认证API配置 - 不携带JWT
const userAuthURL = 'http://localhost:8081/backend/user'
```

### JWT令牌存储
```javascript
// 登录成功后自动保存
localStorage.setItem('labubu_token', 'your_jwt_token')

// API调用时自动获取
const token = localStorage.getItem('labubu_token')
```

### Vite代理配置 (vite.config.js)
```javascript
proxy: {
  '/backend': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false
  }
}
```

## 🚀 部署架构

### 开发环境
- 前端服务: `localhost:3000`
- 后端服务: `localhost:8081`
- 通过Vite代理处理 `/backend` 请求
- JWT令牌存储在浏览器localStorage中

### 生产环境
- 通过Nginx处理路由分发
- `/` 首页直接访问，其他页面 `/frontend/` 路径提供静态文件
- `/backend/` 路径代理到后端服务
- JWT令牌在HTTPS环境中安全传输

## ✅ 快速验证

### 前端页面验证
```bash
# 访问首页
curl https://labubu.me/

# 访问AI智能体页面
curl https://labubu.me/frontend/ai-agent
```

### 后端API验证
```bash
# 测试登录API（无需JWT）
curl -X POST https://labubu.me/backend/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# 测试AI智能体API（需要JWT）
curl https://labubu.me/backend/ai-agent/AllDag/test_tenant \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 安全注意事项

1. **JWT令牌保护**: 令牌存储在localStorage中，请确保HTTPS传输
2. **令牌过期**: 后端应设置合理的令牌过期时间
3. **自动刷新**: 建议实现令牌自动刷新机制
4. **登出清理**: 用户登出时清除localStorage中的令牌

---

**文档版本**: 2024年12月  
**项目团队**: Labubu AI Platform 开发组

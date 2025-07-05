# Labubu AI Creative Platform - Backend API Documentation

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境配置](#环境配置)
- [安装与运行](#安装与运行)
- [API接口文档](#api接口文档)
- [数据模型](#数据模型)
- [中间件](#中间件)
- [错误处理](#错误处理)
- [安全措施](#安全措施)
- [部署指南](#部署指南)

## 📖 项目简介

Labubu AI Creative Platform 后端API提供了一个完整的创意AI平台所需的所有后端功能，包括用户认证、AI代理管理、社区交互、市场交易等核心功能。

### 主要功能模块

- **用户认证系统** - 注册、登录、权限管理
- **AI代理管理** - 创建、配置、使用AI代理
- **社区功能** - 帖子发布、评论、点赞、关注
- **市场平台** - 商品发布、购买、评价
- **实时通讯** - WebSocket支持的即时消息
- **文件上传** - 图片、视频等媒体文件管理
- **通知系统** - 多渠道通知推送
- **数据分析** - 用户行为和平台统计

## 🛠 技术栈

### 核心技术
- **Node.js** - 运行环境
- **Express.js** - Web框架
- **MongoDB** - 数据库
- **Mongoose** - ODM工具

### 认证与安全
- **JWT** - 身份验证
- **bcryptjs** - 密码加密
- **helmet** - 安全头设置
- **express-rate-limit** - 请求限制

### 文件处理
- **multer** - 文件上传
- **cloudinary** - 云存储
- **sharp** - 图片处理

### 实时通讯
- **socket.io** - WebSocket支持

### 验证与日志
- **joi** - 数据验证
- **express-validator** - 请求验证
- **winston** - 日志记录

## 📁 项目结构

```
backend/
├── config/                 # 配置文件
│   ├── database.js         # 数据库配置
│   ├── cloudinary.js       # 云存储配置
│   └── env.example         # 环境变量示例
├── middleware/             # 中间件
│   ├── auth.js            # 认证中间件
│   ├── errorHandler.js    # 错误处理
│   ├── logger.js          # 日志记录
│   ├── upload.js          # 文件上传
│   └── validation.js      # 数据验证
├── models/                # 数据模型
│   ├── User.js           # 用户模型
│   ├── AIAgent.js        # AI代理模型
│   ├── Post.js           # 帖子模型
│   ├── Product.js        # 商品模型
│   ├── Conversation.js   # 对话模型
│   ├── Notification.js   # 通知模型
│   └── Order.js          # 订单模型
├── routes/               # 路由定义
│   ├── auth.js          # 认证路由
│   ├── users.js         # 用户路由
│   ├── aiAgents.js      # AI代理路由
│   ├── community.js     # 社区路由
│   ├── marketplace.js   # 市场路由
│   ├── upload.js        # 上传路由
│   └── analytics.js     # 分析路由
├── services/            # 业务逻辑服务
│   ├── aiService.js     # AI服务
│   ├── emailService.js  # 邮件服务
│   ├── paymentService.js # 支付服务
│   └── notificationService.js # 通知服务
├── utils/              # 工具函数
│   ├── helpers.js      # 通用工具
│   ├── constants.js    # 常量定义
│   └── validators.js   # 验证器
├── logs/              # 日志文件
├── uploads/           # 上传文件临时目录
├── server.js          # 服务器入口文件
└── package.json       # 项目依赖
```

## ⚙️ 环境配置

### 环境变量

复制 `config/env.example` 为 `.env` 并配置以下变量：

```env
# 服务器配置
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/labubu-ai

# JWT配置
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# 邮件配置
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# 云存储配置
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# 支付配置
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 🚀 安装与运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp config/env.example .env
# 编辑 .env 文件，填入你的配置信息
```

### 3. 启动数据库

确保MongoDB服务正在运行：

```bash
# 本地MongoDB
mongod

# 或使用Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 运行服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# 运行测试
npm test
```

## 📡 API接口文档

### 基础信息

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

### 响应格式

所有API响应都遵循统一格式：

```json
{
  "success": true|false,
  "message": "响应消息",
  "data": {
    // 响应数据
  },
  "error": {
    // 错误信息 (仅在success为false时存在)
    "message": "错误消息",
    "statusCode": 400,
    "details": []
  }
}
```

### 认证接口 (Authentication)

#### 用户注册
```
POST /auth/register
```

**请求体:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "profile": {
    "firstName": "Test",
    "lastName": "User",
    "bio": "AI enthusiast"
  }
}
```

**响应:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "profile": {...},
      "role": "user",
      "emailVerified": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### 用户登录
```
POST /auth/login
```

**请求体:**
```json
{
  "email": "test@example.com",
  "password": "Password123"
}
```

#### 刷新Token
```
POST /auth/refresh
```

**请求体:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### 获取当前用户信息
```
GET /auth/me
Headers: Authorization: Bearer {token}
```

#### 更新用户资料
```
PUT /auth/profile
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "profile": {
    "displayName": "New Display Name",
    "bio": "Updated bio",
    "location": "New York",
    "website": "https://example.com"
  },
  "preferences": {
    "language": "zh-CN",
    "theme": "dark"
  }
}
```

#### 修改密码
```
POST /auth/change-password
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123",
  "confirmNewPassword": "newPassword123"
}
```

#### 忘记密码
```
POST /auth/forgot-password
```

**请求体:**
```json
{
  "email": "test@example.com"
}
```

#### 重置密码
```
POST /auth/reset-password
```

**请求体:**
```json
{
  "token": "reset_token",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

#### 验证邮箱
```
POST /auth/verify-email
```

**请求体:**
```json
{
  "token": "verification_token"
}
```

### 用户管理接口 (Users)

#### 获取用户列表
```
GET /users?page=1&limit=20&search=keyword&role=user
Headers: Authorization: Bearer {token}
```

#### 获取用户详情
```
GET /users/:userId
Headers: Authorization: Bearer {token}
```

#### 关注用户
```
POST /users/:userId/follow
Headers: Authorization: Bearer {token}
```

#### 取消关注
```
DELETE /users/:userId/follow
Headers: Authorization: Bearer {token}
```

#### 获取用户统计
```
GET /users/:userId/stats
Headers: Authorization: Bearer {token}
```

### AI代理接口 (AI Agents)

#### 创建AI代理
```
POST /ai-agents
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "name": "Creative Writer",
  "description": "AI assistant for creative writing",
  "type": "creative",
  "category": "writing",
  "config": {
    "systemPrompt": "You are a creative writing assistant",
    "model": "gpt-3.5-turbo",
    "temperature": 0.8,
    "maxTokens": 1000
  },
  "capabilities": ["text-generation", "creative-writing"],
  "tags": ["writing", "creative", "storytelling"]
}
```

#### 获取AI代理列表
```
GET /ai-agents?page=1&limit=20&category=writing&type=creative
Headers: Authorization: Bearer {token}
```

#### 获取AI代理详情
```
GET /ai-agents/:agentId
Headers: Authorization: Bearer {token}
```

#### 更新AI代理
```
PUT /ai-agents/:agentId
Headers: Authorization: Bearer {token}
```

#### 删除AI代理
```
DELETE /ai-agents/:agentId
Headers: Authorization: Bearer {token}
```

#### 与AI代理对话
```
POST /ai-agents/:agentId/chat
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "message": "Write a short story about AI",
  "conversationId": "conversation_id", // 可选，用于继续对话
  "options": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

### 社区接口 (Community)

#### 创建帖子
```
POST /community/posts
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "title": "My AI Creation",
  "content": "Check out my latest AI-generated artwork",
  "type": "image",
  "category": "art",
  "tags": ["ai-art", "digital", "creative"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "caption": "AI-generated artwork"
    }
  ]
}
```

#### 获取帖子列表
```
GET /community/posts?page=1&limit=20&category=art&sort=latest
Headers: Authorization: Bearer {token} (可选)
```

#### 获取帖子详情
```
GET /community/posts/:postId
Headers: Authorization: Bearer {token} (可选)
```

#### 点赞帖子
```
POST /community/posts/:postId/like
Headers: Authorization: Bearer {token}
```

#### 评论帖子
```
POST /community/posts/:postId/comments
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "content": "Amazing artwork!",
  "parentComment": "comment_id" // 可选，用于回复评论
}
```

#### 分享帖子
```
POST /community/posts/:postId/share
Headers: Authorization: Bearer {token}
```

### 市场接口 (Marketplace)

#### 发布商品
```
POST /marketplace/products
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "name": "AI Art Template",
  "description": "Professional AI art generation template",
  "shortDescription": "Create stunning AI artwork with this template",
  "type": "digital",
  "category": "templates",
  "pricing": {
    "type": "paid",
    "price": 29.99,
    "currency": "USD"
  },
  "images": [
    {
      "url": "https://example.com/product-image.jpg",
      "alt": "Product preview",
      "isPrimary": true
    }
  ],
  "digitalContent": {
    "files": [
      {
        "filename": "ai-art-template.psd",
        "url": "https://example.com/template.psd",
        "format": "psd"
      }
    ]
  },
  "tags": ["ai-art", "template", "photoshop"]
}
```

#### 获取商品列表
```
GET /marketplace/products?page=1&limit=20&category=templates&minPrice=0&maxPrice=100
Headers: Authorization: Bearer {token} (可选)
```

#### 获取商品详情
```
GET /marketplace/products/:productId
Headers: Authorization: Bearer {token} (可选)
```

#### 购买商品
```
POST /marketplace/products/:productId/purchase
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "paymentMethod": "stripe",
  "paymentToken": "stripe_token"
}
```

#### 商品评价
```
POST /marketplace/products/:productId/reviews
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "rating": 5,
  "title": "Excellent template",
  "content": "This template helped me create amazing AI art"
}
```

### 对话接口 (Conversations)

#### 创建对话
```
POST /conversations
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "aiAgent": "agent_id",
  "title": "Creative Writing Session",
  "type": "creation"
}
```

#### 获取对话列表
```
GET /conversations?page=1&limit=20&type=creation
Headers: Authorization: Bearer {token}
```

#### 获取对话详情
```
GET /conversations/:conversationId
Headers: Authorization: Bearer {token}
```

#### 发送消息
```
POST /conversations/:conversationId/messages
Headers: Authorization: Bearer {token}
```

**请求体:**
```json
{
  "content": "Write a story about robots",
  "type": "text"
}
```

#### 删除对话
```
DELETE /conversations/:conversationId
Headers: Authorization: Bearer {token}
```

### 通知接口 (Notifications)

#### 获取通知列表
```
GET /notifications?page=1&limit=20&unreadOnly=true
Headers: Authorization: Bearer {token}
```

#### 标记通知已读
```
PUT /notifications/:notificationId/read
Headers: Authorization: Bearer {token}
```

#### 删除通知
```
DELETE /notifications/:notificationId
Headers: Authorization: Bearer {token}
```

#### 获取未读通知数量
```
GET /notifications/unread-count
Headers: Authorization: Bearer {token}
```

### 文件上传接口 (Upload)

#### 上传图片
```
POST /upload/image
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体 (FormData):**
```
file: [图片文件]
category: "avatar" | "post" | "product" | "general"
```

#### 上传视频
```
POST /upload/video
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

#### 上传文件
```
POST /upload/file
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### 分析统计接口 (Analytics)

#### 获取平台统计
```
GET /analytics/platform-stats
Headers: Authorization: Bearer {token}
```

#### 获取用户统计
```
GET /analytics/user-stats
Headers: Authorization: Bearer {token}
```

#### 获取内容统计
```
GET /analytics/content-stats?timeframe=week
Headers: Authorization: Bearer {token}
```

## 🗃 数据模型

### User (用户模型)

```javascript
{
  username: String,        // 用户名
  email: String,          // 邮箱
  password: String,       // 密码(加密)
  profile: {
    displayName: String,  // 显示名称
    firstName: String,    // 名字
    lastName: String,     // 姓氏
    avatar: String,       // 头像URL
    bio: String,         // 个人简介
    location: String,    // 位置
    website: String,     // 网站
    dateOfBirth: Date,   // 生日
    gender: String       // 性别
  },
  role: String,           // 角色: user, creator, moderator, admin
  status: String,         // 状态: active, inactive, banned, pending
  emailVerified: Boolean, // 邮箱验证状态
  stats: {
    followers: Number,    // 粉丝数
    following: Number,    // 关注数
    posts: Number,       // 帖子数
    likes: Number,       // 获赞数
    createdAgents: Number // 创建的AI代理数
  },
  preferences: {
    language: String,     // 语言偏好
    theme: String,       // 主题偏好
    notifications: Object // 通知设置
  },
  privacy: {
    profileVisibility: String, // 资料可见性
    allowMessages: Boolean,    // 允许私信
    showActivity: Boolean      // 显示活动
  }
}
```

### AIAgent (AI代理模型)

```javascript
{
  name: String,           // 代理名称
  description: String,    // 描述
  creator: ObjectId,      // 创建者ID
  type: String,          // 类型: creative, assistant, educational
  category: String,      // 分类: art, writing, music, coding
  avatar: String,        // 头像URL
  config: {
    model: String,       // AI模型
    systemPrompt: String, // 系统提示
    temperature: Number,  // 创意度
    maxTokens: Number,   // 最大令牌数
    topP: Number,        // 核采样
    frequencyPenalty: Number // 频率惩罚
  },
  capabilities: [String], // 能力列表
  usage: {
    totalConversations: Number, // 总对话数
    totalMessages: Number,      // 总消息数
    totalTokens: Number,        // 总令牌数
    averageRating: Number       // 平均评分
  },
  featured: Boolean,      // 是否推荐
  public: Boolean,       // 是否公开
  tags: [String],        // 标签
  status: String         // 状态: active, inactive, under_review
}
```

### Post (帖子模型)

```javascript
{
  title: String,         // 标题
  content: String,       // 内容
  author: ObjectId,      // 作者ID
  type: String,          // 类型: text, image, video, ai-creation
  category: String,      // 分类: general, art, tutorials
  media: [{
    type: String,        // 媒体类型
    url: String,         // URL
    thumbnail: String,   // 缩略图
    caption: String      // 说明
  }],
  stats: {
    views: Number,       // 浏览数
    likes: Number,       // 点赞数
    comments: Number,    // 评论数
    shares: Number       // 分享数
  },
  tags: [String],        // 标签
  visibility: String,    // 可见性: public, private, followers
  featured: Boolean,     // 是否推荐
  status: String         // 状态: published, draft, archived
}
```

### Product (商品模型)

```javascript
{
  name: String,          // 商品名称
  description: String,   // 描述
  seller: ObjectId,      // 卖家ID
  type: String,          // 类型: digital, physical, service
  category: String,      // 分类: art, templates, courses
  pricing: {
    type: String,        // 定价类型: free, paid, subscription
    price: Number,       // 价格
    currency: String,    // 货币
    discount: Object     // 折扣信息
  },
  images: [{
    url: String,         // 图片URL
    alt: String,         // 替代文本
    isPrimary: Boolean   // 是否主图
  }],
  digitalContent: {
    files: [Object],     // 数字文件
    downloadLimit: Number // 下载限制
  },
  stats: {
    views: Number,       // 浏览数
    purchases: Number,   // 购买数
    averageRating: Number, // 平均评分
    revenue: Number      // 收入
  },
  reviews: [{
    buyer: ObjectId,     // 买家ID
    rating: Number,      // 评分
    content: String,     // 评价内容
    verified: Boolean    // 是否验证购买
  }],
  status: String,        // 状态: published, draft, sold
  featured: Boolean      // 是否推荐
}
```

### Conversation (对话模型)

```javascript
{
  user: ObjectId,        // 用户ID
  aiAgent: ObjectId,     // AI代理ID
  title: String,         // 对话标题
  type: String,          // 类型: chat, creation, assistant
  messages: [{
    content: String,     // 消息内容
    sender: {
      type: String,      // 发送者类型: user, ai, system
      id: ObjectId       // 发送者ID
    },
    type: String,        // 消息类型: text, image, file
    aiGeneration: {
      model: String,     // 使用的AI模型
      tokens: Number,    // 消耗的令牌
      cost: Number       // 成本
    },
    createdAt: Date      // 创建时间
  }],
  stats: {
    totalMessages: Number, // 总消息数
    totalTokens: Number,   // 总令牌数
    totalCost: Number      // 总成本
  },
  settings: {
    aiConfig: Object,    // AI配置
    privacy: Object      // 隐私设置
  },
  status: String         // 状态: active, archived, deleted
}
```

### Notification (通知模型)

```javascript
{
  recipient: ObjectId,   // 接收者ID
  type: String,          // 通知类型
  title: String,         // 标题
  message: String,       // 消息
  source: {
    type: String,        // 来源类型
    id: ObjectId,        // 来源ID
    name: String         // 来源名称
  },
  relatedObjects: [{
    type: String,        // 相关对象类型
    id: ObjectId,        // 相关对象ID
    title: String        // 相关对象标题
  }],
  channels: {
    inApp: {
      delivered: Boolean, // 应用内推送状态
      readAt: Date       // 阅读时间
    },
    email: {
      delivered: Boolean, // 邮件推送状态
      openedAt: Date     // 打开时间
    },
    push: {
      delivered: Boolean, // 推送通知状态
      clickedAt: Date    // 点击时间
    }
  },
  priority: String,      // 优先级: low, normal, high, urgent
  status: String,        // 状态: pending, sent, delivered, read
  scheduledFor: Date,    // 计划发送时间
  expiresAt: Date       // 过期时间
}
```

## 🔧 中间件

### 认证中间件 (auth.js)

- `authenticate` - 验证JWT令牌
- `authorize` - 角色权限检查
- `optionalAuth` - 可选认证
- `requireEmailVerification` - 要求邮箱验证
- `requireAccountNotLocked` - 要求账户未锁定

### 错误处理中间件 (errorHandler.js)

- `errorHandler` - 统一错误处理
- `notFound` - 404错误处理
- `asyncHandler` - 异步错误捕获
- `handleValidationErrors` - 验证错误处理

### 日志中间件 (logger.js)

- `logger` - 请求日志记录
- `performanceLogger` - 性能监控
- `securityLogger` - 安全日志
- `errorLogger` - 错误日志

### 文件上传中间件 (upload.js)

- `uploadImage` - 图片上传
- `uploadVideo` - 视频上传
- `uploadFile` - 文件上传
- `resizeImage` - 图片处理

## ⚠️ 错误处理

### 错误码说明

| 状态码 | 说明 | 示例 |
|--------|------|------|
| 200 | 成功 | 请求成功处理 |
| 201 | 创建成功 | 资源创建成功 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未认证 | Token无效或过期 |
| 403 | 无权限 | 权限不足 |
| 404 | 未找到 | 资源不存在 |
| 409 | 冲突 | 资源已存在 |
| 422 | 验证失败 | 数据验证不通过 |
| 429 | 请求过多 | 超出限流阈值 |
| 500 | 服务器错误 | 内部服务器错误 |

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "message": "具体错误信息",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确",
        "value": "invalid-email"
      }
    ],
    "requestId": "req-123456789"
  }
}
```

## 🔒 安全措施

### 1. 认证安全
- JWT令牌认证
- 令牌自动过期
- 刷新令牌机制
- 密码强度要求
- 邮箱验证

### 2. 请求限制
- IP限流
- 用户限流
- 认证端点特殊限制
- 文件上传大小限制

### 3. 数据保护
- 密码加密存储
- 敏感信息过滤
- SQL注入防护
- XSS攻击防护
- CSRF保护

### 4. 安全头设置
```javascript
// helmet 安全头配置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 5. 输入验证
- 请求参数验证
- 文件类型检查
- 文件大小限制
- 恶意内容检测

## 🚀 部署指南

### 1. 环境准备

#### 生产环境要求
- Node.js 16+
- MongoDB 5.0+
- Redis (可选，用于缓存)
- SSL证书

#### 系统配置
```bash
# 创建部署用户
sudo useradd -m -s /bin/bash labubu
sudo usermod -aG sudo labubu

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装MongoDB
sudo apt-get install -y mongodb

# 安装PM2
sudo npm install -g pm2
```

### 2. 代码部署

```bash
# 克隆代码
git clone <repository-url>
cd labubu-ai-platform/backend

# 安装依赖
npm ci --production

# 复制配置文件
cp config/env.example .env
# 编辑生产环境配置

# 构建项目 (如果需要)
npm run build
```

### 3. 数据库设置

```bash
# 启动MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 创建数据库用户
mongo
use labubu-ai
db.createUser({
  user: "labubu_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

### 4. PM2配置

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'labubu-ai-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 5. 启动服务

```bash
# 使用PM2启动
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 6. Nginx配置

```nginx
server {
    listen 80;
    server_name api.labubu-ai.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL配置

```bash
# 安装Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d api.labubu-ai.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. 监控设置

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 监控资源
pm2 monit

# 重启服务
pm2 restart labubu-ai-backend
```

### 9. 备份策略

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --host localhost --port 27017 --db labubu-ai --out /backup/mongodb_$DATE
tar -czf /backup/files_$DATE.tar.gz /path/to/uploads
```

### 10. 性能优化

#### 数据库优化
```javascript
// 创建索引
db.users.createIndex({ email: 1 }, { unique: true })
db.posts.createIndex({ author: 1, createdAt: -1 })
db.products.createIndex({ category: 1, "pricing.price": 1 })
```

#### 缓存配置
```javascript
// Redis缓存配置
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});
```

## 📞 技术支持

### 开发团队联系方式
- **项目负责人**: [联系邮箱]
- **技术支持**: [技术支持邮箱]
- **问题反馈**: [GitHub Issues]

### 文档更新
- **最后更新**: 2024年1月
- **文档版本**: v1.0.0
- **API版本**: v1.0.0

### 许可证
本项目采用 MIT 许可证，详见 LICENSE 文件。

---

© 2024 Labubu AI Creative Platform. All rights reserved. 
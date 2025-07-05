# Labubu AI Creative Platform

<p align="center">
  <img src="src/assets/images/bg.png" alt="Labubu AI Platform" width="600" style="border-radius: 20px; margin-bottom: 20px;" />
</p>

<p align="center">
  <strong>🎨 A Creative Community Platform Combining AI Generation Technology with Labubu IP Image Recreation</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.3.4-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vite-4.4.9-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express.js-4.18+-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## 📖 English Documentation

### 🌟 Project Overview

Labubu AI Creative Platform is an innovative community platform that combines AI generation technology with Labubu IP character recreation. It provides users with a comprehensive creative space featuring AI agent customization, interactive community engagement, and a marketplace for creative works and modifications.

### 🎯 Core Features

- **🤖 AI Agent Studio**: Custom AI agent building tools with intuitive visual configuration interface
- **👥 Interactive Community**: Vibrant creator community with real-time chat, artwork sharing, and creative challenges
- **🛍️ Creative Marketplace**: Secure marketplace for trading Labubu peripherals and custom artworks
- **📚 Learning Hub**: Comprehensive AI creation tutorials and prompt libraries

---

### 📁 Complete Project Structure

```
labubu-ai-platform/
├── 📁 Frontend (Vue.js Application)
│   ├── 📁 public/                     # Static public assets
│   ├── 📁 src/                       # Source code directory
│   │   ├── 📁 assets/                # Resource files
│   │   │   ├── 📁 css/
│   │   │   │   └── 📄 global.css     # Global CSS styles
│   │   │   └── 📁 images/            # Image resources
│   │   │       ├── 🖼️ bg.png         # Main background image (552KB)
│   │   │       ├── 🖼️ home1.jpg      # AI Agent showcase image (57KB)
│   │   │       ├── 🖼️ home2.png      # Community feature image (2.0MB)
│   │   │       ├── 🖼️ home3.png      # Marketplace showcase image (2.4MB)
│   │   │       └── 🖼️ labubu-logo.png # Platform logo
│   │   ├── 📁 components/            # Vue.js components
│   │   │   ├── 📄 Home.vue           # Homepage component (20KB, 796 lines)
│   │   │   ├── 📄 AIAgent.vue        # AI Agent studio page (14KB, 587 lines)
│   │   │   ├── 📄 Community.vue      # Community interaction page (12KB, 430 lines)
│   │   │   ├── 📄 Marketplace.vue    # Marketplace page (20KB, 863 lines)
│   │   │   └── 📄 About.vue          # About us page (16KB, 644 lines)
│   │   ├── 📄 App.vue               # Root Vue component (6.0KB, 280 lines)
│   │   └── 📄 main.js               # Application entry point (1.1KB, 41 lines)
│   ├── 📄 index.html                # HTML template (756B, 16 lines)
│   ├── 📄 package.json              # Frontend dependencies & scripts (710B, 30 lines)
│   ├── 📄 package-lock.json         # Dependency lock file (37KB, 1111 lines)
│   └── 📄 vite.config.js            # Vite build configuration (332B, 17 lines)
│
├── 📁 Backend (Node.js/Express.js API)
│   ├── 📁 config/                   # Configuration files
│   │   └── 📄 env.example           # Environment variables template
│   ├── 📁 middleware/               # Express middleware
│   │   ├── 📄 auth.js              # Authentication middleware (8.3KB, 354 lines)
│   │   ├── 📄 errorHandler.js      # Error handling middleware (8.4KB, 342 lines)
│   │   └── 📄 logger.js            # Logging middleware (9.9KB, 375 lines)
│   ├── 📁 models/                  # Database models (MongoDB/Mongoose)
│   │   ├── 📄 User.js              # User data model (8.2KB, 364 lines)
│   │   ├── 📄 AIAgent.js           # AI Agent model (10KB, 481 lines)
│   │   ├── 📄 Post.js              # Community post model (14KB, 593 lines)
│   │   ├── 📄 Product.js           # Marketplace product model (17KB, 713 lines)
│   │   ├── 📄 Conversation.js      # Chat conversation model (16KB, 678 lines)
│   │   └── 📄 Notification.js      # Notification system model (16KB, 642 lines)
│   ├── 📁 routes/                  # API route handlers
│   │   └── 📄 auth.js              # Authentication routes (16KB, 596 lines)
│   ├── 📄 server.js                # Express server setup (9.5KB, 322 lines)
│   ├── 📄 package.json             # Backend dependencies (1.1KB, 48 lines)
│   ├── 📄 package-lock.json        # Backend dependency lock file (242KB, 6629 lines)
│   └── 📄 README.md                # Backend documentation (27KB, 1261 lines)
│
├── 📄 .gitignore                   # Git ignore rules (1.2KB, 95 lines)
└── 📄 README.md                    # Main project documentation
```

### 🗂️ Detailed File Descriptions

#### Frontend Components

| File | Purpose | Key Features |
|------|---------|--------------|
| `Home.vue` | Main landing page | Hero section, feature showcase, statistics, CTA buttons |
| `AIAgent.vue` | AI Agent creation studio | Drag-drop interface, parameter controls, template library |
| `Community.vue` | Social interaction hub | Post feed, real-time chat, user profiles, activity timeline |
| `Marketplace.vue` | E-commerce platform | Product listings, search/filter, payment integration |
| `About.vue` | Company information | Team profiles, mission statement, contact details |

#### Backend Data Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User.js` | User management | Authentication, profiles, preferences, activity history |
| `AIAgent.js` | AI Agent definitions | Templates, parameters, configurations, usage statistics |
| `Post.js` | Community content | Text posts, images, comments, likes, sharing |
| `Product.js` | Marketplace items | Listings, pricing, inventory, reviews, categories |
| `Conversation.js` | Chat system | Messages, participants, timestamps, thread management |
| `Notification.js` | Alert system | User notifications, system alerts, email triggers |

#### Middleware Components

| Middleware | Purpose | Functionality |
|------------|---------|---------------|
| `auth.js` | Security layer | JWT token validation, role-based access control |
| `errorHandler.js` | Error management | Global error catching, logging, user-friendly responses |
| `logger.js` | Activity tracking | Request logging, performance monitoring, audit trails |

### 🚀 Quick Start Guide

#### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v6.0 or higher)
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

#### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform.git
   cd Labubu-Remake-AI-Platform
   git checkout W  # Switch to W branch
   ```

2. **Frontend Setup**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Start development server
   npm run dev
   # Access at http://localhost:3000
   ```

3. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install backend dependencies
   npm install
   
   # Configure environment variables
   cp config/env.example .env
   # Edit .env file with your MongoDB connection and other settings
   
   # Start backend server
   npm start
   # API available at http://localhost:5000
   ```

#### Production Build
```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

### 🛠️ Technology Stack

#### Frontend Architecture
- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **Vue Router 4**: Client-side routing for single-page application
- **Vite**: Next-generation build tool with hot module replacement
- **CSS3**: Modern styling with Grid, Flexbox, custom properties
- **Responsive Design**: Mobile-first approach with adaptive layouts

#### Backend Architecture
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for RESTful APIs
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM library for MongoDB object modeling
- **JWT**: JSON Web Tokens for secure authentication

#### Development Tools
- **ESLint**: Code quality and style enforcement
- **Prettier**: Automatic code formatting
- **Git**: Version control with branch-based workflow

---

## 📖 中文文档

### 🌟 项目概述

Labubu AI 云创平台是一个创新的社区平台，结合AI生成技术与Labubu IP形象再创作，为用户提供集AI代理定制、互动社区交流和创作作品交易于一体的综合性创作空间。

### 🎯 核心功能

- **🤖 AI Agent Studio**: 自定义AI代理搭建工具，提供直观的可视化配置界面
- **👥 互动社区**: 活跃的创作者社区，支持实时聊天、作品分享和创意挑战
- **🛍️ 创意市场**: 安全的交易平台，支持Labubu周边和定制作品交易
- **📚 学习中心**: 系统化的AI创作教程和提示词库

---

### 📁 完整项目结构说明

```
labubu-ai-platform/
├── 📁 前端 (Vue.js 应用程序)
│   ├── 📁 public/                     # 静态公共资源
│   ├── 📁 src/                       # 源代码目录
│   │   ├── 📁 assets/                # 资源文件
│   │   │   ├── 📁 css/
│   │   │   │   └── 📄 global.css     # 全局CSS样式
│   │   │   └── 📁 images/            # 图片资源
│   │   │       ├── 🖼️ bg.png         # 主背景图片 (552KB)
│   │   │       ├── 🖼️ home1.jpg      # AI代理展示图 (57KB)
│   │   │       ├── 🖼️ home2.png      # 社区功能图 (2.0MB)
│   │   │       ├── 🖼️ home3.png      # 市场展示图 (2.4MB)
│   │   │       └── 🖼️ labubu-logo.png # 平台Logo
│   │   ├── 📁 components/            # Vue.js 组件
│   │   │   ├── 📄 Home.vue           # 主页组件 (20KB, 796行)
│   │   │   ├── 📄 AIAgent.vue        # AI代理工作室页面 (14KB, 587行)
│   │   │   ├── 📄 Community.vue      # 社区互动页面 (12KB, 430行)
│   │   │   ├── 📄 Marketplace.vue    # 市场页面 (20KB, 863行)
│   │   │   └── 📄 About.vue          # 关于我们页面 (16KB, 644行)
│   │   ├── 📄 App.vue               # 根Vue组件 (6.0KB, 280行)
│   │   └── 📄 main.js               # 应用程序入口 (1.1KB, 41行)
│   ├── 📄 index.html                # HTML模板 (756B, 16行)
│   ├── 📄 package.json              # 前端依赖和脚本 (710B, 30行)
│   ├── 📄 package-lock.json         # 依赖锁定文件 (37KB, 1111行)
│   └── 📄 vite.config.js            # Vite构建配置 (332B, 17行)
│
├── 📁 后端 (Node.js/Express.js API)
│   ├── 📁 config/                   # 配置文件
│   │   └── 📄 env.example           # 环境变量模板
│   ├── 📁 middleware/               # Express中间件
│   │   ├── 📄 auth.js              # 身份验证中间件 (8.3KB, 354行)
│   │   ├── 📄 errorHandler.js      # 错误处理中间件 (8.4KB, 342行)
│   │   └── 📄 logger.js            # 日志记录中间件 (9.9KB, 375行)
│   ├── 📁 models/                  # 数据库模型 (MongoDB/Mongoose)
│   │   ├── 📄 User.js              # 用户数据模型 (8.2KB, 364行)
│   │   ├── 📄 AIAgent.js           # AI代理模型 (10KB, 481行)
│   │   ├── 📄 Post.js              # 社区帖子模型 (14KB, 593行)
│   │   ├── 📄 Product.js           # 市场商品模型 (17KB, 713行)
│   │   ├── 📄 Conversation.js      # 聊天会话模型 (16KB, 678行)
│   │   └── 📄 Notification.js      # 通知系统模型 (16KB, 642行)
│   ├── 📁 routes/                  # API路由处理器
│   │   └── 📄 auth.js              # 身份验证路由 (16KB, 596行)
│   ├── 📄 server.js                # Express服务器设置 (9.5KB, 322行)
│   ├── 📄 package.json             # 后端依赖 (1.1KB, 48行)
│   ├── 📄 package-lock.json        # 后端依赖锁定文件 (242KB, 6629行)
│   └── 📄 README.md                # 后端文档 (27KB, 1261行)
│
├── 📄 .gitignore                   # Git忽略规则 (1.2KB, 95行)
└── 📄 README.md                    # 主项目文档
```

### 🗂️ 详细文件说明

#### 前端组件

| 文件 | 用途 | 主要功能 |
|------|------|----------|
| `Home.vue` | 主页landing页面 | 英雄区、功能展示、统计数据、行动号召按钮 |
| `AIAgent.vue` | AI代理创建工作室 | 拖拽界面、参数控制、模板库 |
| `Community.vue` | 社交互动中心 | 帖子动态、实时聊天、用户档案、活动时间线 |
| `Marketplace.vue` | 电商平台 | 商品列表、搜索筛选、支付集成 |
| `About.vue` | 公司信息 | 团队介绍、使命宣言、联系方式 |

#### 后端数据模型

| 模型 | 用途 | 关键字段 |
|------|------|----------|
| `User.js` | 用户管理 | 身份验证、个人资料、偏好设置、活动历史 |
| `AIAgent.js` | AI代理定义 | 模板、参数、配置、使用统计 |
| `Post.js` | 社区内容 | 文本帖子、图片、评论、点赞、分享 |
| `Product.js` | 市场商品 | 商品列表、定价、库存、评价、分类 |
| `Conversation.js` | 聊天系统 | 消息、参与者、时间戳、话题管理 |
| `Notification.js` | 通知系统 | 用户通知、系统警告、邮件触发 |

#### 中间件组件

| 中间件 | 用途 | 功能 |
|--------|------|------|
| `auth.js` | 安全层 | JWT令牌验证、基于角色的访问控制 |
| `errorHandler.js` | 错误管理 | 全局错误捕获、日志记录、用户友好响应 |
| `logger.js` | 活动跟踪 | 请求日志、性能监控、审计跟踪 |

### 🚀 快速开始指南

#### 环境要求
- **Node.js** (v18.0 或更高版本)
- **npm** 或 **yarn** 包管理器
- **MongoDB** (v6.0 或更高版本)
- 现代网络浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

#### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform.git
   cd Labubu-Remake-AI-Platform
   git checkout W  # 切换到W分支
   ```

2. **前端设置**
   ```bash
   # 安装前端依赖
   npm install
   
   # 启动开发服务器
   npm run dev
   # 访问地址：http://localhost:3000
   ```

3. **后端设置**
   ```bash
   # 进入后端目录
   cd backend
   
   # 安装后端依赖
   npm install
   
   # 配置环境变量
   cp config/env.example .env
   # 编辑.env文件，设置MongoDB连接和其他配置
   
   # 启动后端服务器
   npm start
   # API地址：http://localhost:5000
   ```

#### 生产构建
```bash
# 构建前端生产版本
npm run build

# 预览生产构建
npm run preview
```

### 🛠️ 技术栈

#### 前端架构
- **Vue.js 3**: 渐进式JavaScript框架，使用Composition API
- **Vue Router 4**: 单页应用的客户端路由
- **Vite**: 下一代构建工具，支持热模块替换
- **CSS3**: 现代样式设计，使用Grid、Flexbox、自定义属性
- **响应式设计**: 移动端优先的自适应布局

#### 后端架构
- **Node.js**: 服务器端JavaScript运行环境
- **Express.js**: RESTful API的Web应用框架
- **MongoDB**: 灵活数据存储的NoSQL数据库
- **Mongoose**: MongoDB对象建模的ODM库
- **JWT**: 安全身份验证的JSON Web令牌

#### 开发工具
- **ESLint**: 代码质量和风格强制执行
- **Prettier**: 自动代码格式化
- **Git**: 基于分支工作流的版本控制

---

## 📝 Development Notes

### Latest Updates (Branch W)
- ✅ **Image Organization**: Created dedicated `src/assets/images/` folder
- ✅ **Homepage Enhancement**: Added three showcase images for different platform features
- ✅ **Responsive Design**: Optimized image display for mobile devices
- ✅ **Visual Effects**: Added hover animations and shadow effects
- ✅ **Documentation**: Comprehensive file structure documentation

### Contributing
Please ensure you're working on the **W branch** for development. All contributions should maintain the existing code structure and follow the established coding conventions.

---

**Repository**: https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform  
**Branch**: W  
**License**: MIT  
**Version**: 1.0.0 
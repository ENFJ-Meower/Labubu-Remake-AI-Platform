# Labubu AI Creative Platform | Labubu AI 云创平台

**[English](#english) | [中文](#chinese)**

---

## English

### 🎨 Project Overview

**Labubu AI Creative Platform** is a Vue.js-based frontend application that provides an interactive creative community platform centered around the Labubu IP. This project focuses on AI-generated content, community interaction, and creative marketplace features.

### 🏗️ Project Structure

```
Labubu-Remake-AI-Platform/
├── public/                     # Static public assets
├── src/                        # Source code
│   ├── assets/                 # Static assets
│   │   ├── css/               # Global styles
│   │   │   └── global.css     # Global CSS styles (316 lines)
│   │   └── images/            # Image resources
│   │       ├── bg.png         # Background image (552KB)
│   │       ├── home1.jpg      # Home page image 1 (57KB)
│   │       ├── home2.png      # Home page image 2 (2.0MB)
│   │       ├── home3.png      # Home page image 3 (2.4MB)
│   │       └── logo.png       # Brand logo image (376KB)
│   ├── components/            # Vue components
│   │   ├── About.vue          # About page (644 lines)
│   │   ├── AIAgent.vue        # AI Agent page (1486 lines)
│   │   ├── Community.vue      # Community page (430 lines)
│   │   ├── Home.vue           # Home page (796 lines)
│   │   └── Marketplace.vue    # Marketplace page (863 lines)
│   ├── App.vue                # Main application component (280 lines)
│   └── main.js                # Application entry point (41 lines)
├── index.html                 # HTML template (16 lines)
├── package.json               # Dependencies and scripts (30 lines)
├── vite.config.js            # Vite configuration (17 lines)
└── README.md                 # This file (390 lines)
```

### 📁 File Details

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| `src/App.vue` | 6.0KB | 280 | Main application component with routing |
| `src/main.js` | 1.1KB | 41 | Vue application entry point |
| `src/components/Home.vue` | 20KB | 796 | Landing page with hero section and features |
| `src/components/AIAgent.vue` | 47KB | 1486 | AI agent creation and management interface - Professional AI Agent building platform like Coze |
| `src/components/Community.vue` | 12KB | 430 | Community interaction and social features |
| `src/components/Marketplace.vue` | 20KB | 863 | Product showcase and marketplace features |
| `src/components/About.vue` | 16KB | 644 | About page with project information |
| `src/assets/css/global.css` | 5.1KB | 316 | Global styles and design system |
| `vite.config.js` | 332B | 17 | Vite build configuration |
| `index.html` | 756B | 16 | HTML template |
| `package.json` | 710B | 30 | Project dependencies and scripts |

### 🎯 Key Features

1. **🏠 Home Page**: Welcome interface with feature highlights
2. **🤖 AI Agent Studio**: Professional AI Agent building platform with:
   - Basic configuration (name, description, avatar)
   - Prompt builder (system prompts, few-shot examples)
   - Knowledge base integration (document upload, API connections)
   - Workflow editor (visual conversation flow design)
   - Multimodal capabilities (TTS, STT, Vision, etc.)
   - Model configuration (GPT-4, Claude, custom models)
   - Testing and deployment (real-time chat testing, one-click deployment)
3. **👥 Community Hub**: Social interaction and content sharing
4. **🛒 Creative Marketplace**: Product showcase and trading platform
5. **ℹ️ About Section**: Project information and team details

### 🎨 Design System

- **Color Scheme**: Consistent gradient system using `#ff6b6b` to `#4ecdc4`
- **Typography**: Poppins font family for modern appearance
- **Layout**: Responsive design with mobile-first approach
- **Animations**: CSS transitions and hover effects
- **Gradients**: Unique gradient angles for each page (45°, 90°, 135°, 180°, 225°)

### 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

### 🤖 AI Agent Studio Features

The AI Agent Studio is a comprehensive platform for building and managing AI agents, similar to Coze. It includes:

#### Core Modules
- **Basic Information**: Configure agent name, description, avatar, and type
- **Prompt Builder**: Design system prompts and few-shot examples
- **Knowledge Base**: Upload documents and integrate external APIs
- **Workflow Editor**: Visual conversation flow design with drag-and-drop nodes
- **Multimodal Setup**: Enable TTS, STT, Vision, and image generation capabilities
- **Model Configuration**: Choose between GPT-4, Claude, or custom models with parameter tuning
- **Testing & Deployment**: Real-time chat testing and one-click deployment

#### Interface Design
- **Left Navigation**: Tab-based module selection with icons and descriptions
- **Right Editor**: Dynamic content area that changes based on selected module
- **Top Toolbar**: Quick actions for save, test, and deploy
- **Test Chat**: Modal overlay for real-time agent testing

#### Technical Implementation
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Modern UI**: Dark theme with gradient accents and smooth animations
- **State Management**: Reactive data binding for agent configuration
- **Form Validation**: Real-time validation and error handling

### 🛠️ Tech Stack

- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **Styling**: CSS3 with custom properties
- **Routing**: Vue Router
- **Animation**: CSS animations and transitions
- **Icons**: Custom SVG icons

### 🌐 Development

The application runs on `http://localhost:3000/` by default. The development server supports hot module replacement for real-time updates.

### 📦 Dependencies

- Vue.js 3.x
- Vite 4.x
- Vue Router
- Additional utilities for build process

---

## Chinese

### 🎨 项目概述

**Labubu AI 云创平台** 是一个基于 Vue.js 的前端应用程序，提供以 Labubu IP 为核心的交互式创意社区平台。该项目专注于 AI 生成内容、社区互动和创意市场功能。

### 🏗️ 项目结构

```
Labubu-Remake-AI-Platform/
├── public/                     # 静态公共资源
├── src/                        # 源代码
│   ├── assets/                 # 静态资源
│   │   ├── css/               # 全局样式
│   │   │   └── global.css     # 全局CSS样式 (316行)
│   │   └── images/            # 图像资源
│   │       ├── bg.png         # 背景图片 (552KB)
│   │       ├── home1.jpg      # 首页图片1 (57KB)
│   │       ├── home2.png      # 首页图片2 (2.0MB)
│   │       ├── home3.png      # 首页图片3 (2.4MB)
│   │       └── logo.png       # 品牌Logo图片 (376KB)
│   ├── components/            # Vue组件
│   │   ├── About.vue          # 关于页面 (644行)
│   │   ├── AIAgent.vue        # AI智能体页面 (1486行)
│   │   ├── Community.vue      # 社区页面 (430行)
│   │   ├── Home.vue           # 首页 (796行)
│   │   └── Marketplace.vue    # 市场页面 (863行)
│   ├── App.vue                # 主应用组件 (280行)
│   └── main.js                # 应用入口点 (41行)
├── index.html                 # HTML模板 (16行)
├── package.json               # 依赖和脚本 (30行)
├── vite.config.js            # Vite配置 (17行)
└── README.md                 # 本文件 (390行)
```

### 📁 文件详情

| 文件 | 大小 | 行数 | 用途 |
|------|------|-------|---------|
| `src/App.vue` | 6.0KB | 280 | 主应用组件，包含路由配置 |
| `src/main.js` | 1.1KB | 41 | Vue应用程序入口点 |
| `src/components/Home.vue` | 20KB | 796 | 首页，包含英雄区和功能展示 |
| `src/components/AIAgent.vue` | 47KB | 1486 | AI智能体创建和管理界面 - 类似Coze的专业AI Agent搭建平台 |
| `src/components/Community.vue` | 12KB | 430 | 社区互动和社交功能 |
| `src/components/Marketplace.vue` | 20KB | 863 | 产品展示和市场功能 |
| `src/components/About.vue` | 16KB | 644 | 关于页面，包含项目信息 |
| `src/assets/css/global.css` | 5.1KB | 316 | 全局样式和设计系统 |
| `vite.config.js` | 332B | 17 | Vite构建配置 |
| `index.html` | 756B | 16 | HTML模板 |
| `package.json` | 710B | 30 | 项目依赖和脚本 |

### 🎯 核心功能

1. **🏠 首页**: 欢迎界面，展示功能亮点
2. **🤖 AI智能体工作室**: 专业的AI Agent搭建平台，包含：
   - 基本配置（名称、描述、头像等）
   - Prompt构建器（系统提示词、Few-shot示例）
   - 知识库集成（文档上传、API连接）
   - 工作流编辑器（可视化对话流程设计）
   - 多模态能力（TTS、STT、视觉识别等）
   - 模型配置（GPT-4、Claude、自定义模型）
   - 测试与部署（实时对话测试、一键部署）
3. **👥 社区中心**: 社交互动和内容分享
4. **🛒 创意市场**: 产品展示和交易平台
5. **ℹ️ 关于部分**: 项目信息和团队详情

### 🎨 设计系统

- **配色方案**: 使用 `#ff6b6b` 到 `#4ecdc4` 的统一渐变系统
- **字体**: Poppins 字体家族，现代感十足
- **布局**: 响应式设计，移动优先
- **动画**: CSS过渡和悬停效果
- **渐变**: 每个页面使用独特的渐变角度 (45°, 90°, 135°, 180°, 225°)

### 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

4. **预览生产构建**
   ```bash
   npm run preview
   ```

### 🤖 AI智能体工作室功能详解

AI智能体工作室是一个全面的AI代理构建和管理平台，类似于Coze。它包含：

#### 核心模块
- **基本信息**: 配置代理名称、描述、头像和类型
- **Prompt构建器**: 设计系统提示词和Few-shot示例
- **知识库**: 上传文档并集成外部API
- **工作流编辑器**: 可视化对话流程设计，支持拖拽节点
- **多模态设置**: 启用TTS、STT、视觉识别和图像生成能力
- **模型配置**: 选择GPT-4、Claude或自定义模型，支持参数调优
- **测试与部署**: 实时对话测试和一键部署

#### 界面设计
- **左侧导航**: 基于标签的模块选择，带图标和描述
- **右侧编辑器**: 根据选中模块动态变化的内容区域
- **顶部工具栏**: 保存、测试、部署的快捷操作
- **测试对话**: 模态弹窗进行实时代理测试

#### 技术实现
- **响应式设计**: 移动优先，支持平板和桌面端优化
- **现代界面**: 深色主题配合渐变色彩和流畅动画
- **状态管理**: 响应式数据绑定管理代理配置
- **表单验证**: 实时验证和错误处理

### 🛠️ 技术栈

- **框架**: Vue.js 3
- **构建工具**: Vite
- **样式**: CSS3 和自定义属性
- **路由**: Vue Router
- **动画**: CSS动画和过渡
- **图标**: 自定义SVG图标

### 🌐 开发

应用程序默认运行在 `http://localhost:3000/`。开发服务器支持热模块替换，实现实时更新。

### 📦 依赖项

- Vue.js 3.x
- Vite 4.x
- Vue Router
- 构建过程的其他工具

---

### 📝 Project Notes | 项目说明

**English**: This is a frontend-only project. The backend API integration is planned for future development phases.

**中文**: 这是一个纯前端项目。后端API集成计划在未来的开发阶段进行。

### 🔗 Repository | 仓库链接

GitHub: [https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform](https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform)

### 📄 License | 许可证

MIT License - see LICENSE file for details.

---

**Last Updated**: 2024-12-30 | **最后更新**: 2024-12-30 
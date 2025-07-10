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
│   │   ├── Community.vue      # Community page (950 lines)
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
| `src/components/Community.vue` | 28KB | 950 | Modern community interaction and social features with no-popup design |
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
3. **👥 Community Hub**: Modern social platform with:
   - Dynamic feed with post creation and interaction
   - Art gallery with hover effects and likes
   - Event calendar with join functionality
   - Group management system
   - Trending topics and suggested users
   - Real-time commenting and engagement
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
- **Visual Workflow Editor**: Modern node-based workflow designer with drag-and-drop interface, similar to professional workflow tools like n8n or Zapier
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
- **Dot Grid Background**: Professional dot grid pattern for easy node alignment
- **Smooth Curves**: Bezier curve connections for natural flow visualization
- **English Interface**: Complete English localization for global accessibility
- **State Management**: Reactive data binding for agent configuration
- **Form Validation**: Real-time validation and error handling

#### Visual Workflow Editor Features

The Visual Workflow Editor is a modern, drag-and-drop interface for building AI agent workflows:

**Core Features:**
- **Drag-and-Drop Interface**: Intuitive node-based editor with visual connection system
- **Multiple Node Types**: 
  - **Start Node**: Workflow initialization and trigger setup
  - **Browse Node**: Web scraping and content extraction capabilities
  - **LLM Node**: Large language model processing with customizable prompts
  - **Process Node**: Data transformation and processing operations
  - **Condition Node**: Conditional logic and branching workflows
  - **End Node**: Workflow completion and result handling
- **Visual Connections**: Curved connection lines with automatic routing
- **Real-time Configuration**: Right-side panel for node parameter setup
- **Canvas Navigation**: Zoomable, pannable workspace with grid background
- **Node Management**: Easy node creation, deletion, and modification
- **Workflow Testing**: Built-in test runner with execution visualization
- **Export/Import**: Save and load workflow configurations

**Technical Implementation:**
- **Modern UI**: Light theme with professional styling and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Efficient rendering for complex workflows
- **State Management**: Reactive data binding for real-time updates
- **Error Handling**: Comprehensive validation and error reporting

### 👥 Community Hub Features

The Community Hub has been completely redesigned to provide a modern, no-popup social platform experience:

#### Main Features
- **Pinterest-style Masonry Layout**: Waterfall grid layout with varying card sizes
- **Creative Post Cards**: Gradient-styled publishing interface with multimedia support
- **Trending Topics Card**: Real-time trending hashtags with ranking system
- **Interactive Posts**: Like, comment, share functionality with real-time updates
- **Art Gallery**: Multi-size artwork showcase (small/medium/large) with hover overlays
- **Event Management**: Calendar view with join functionality and event details
- **Group System**: Join/leave groups with member count tracking
- **Social Features**: User suggestions, trending topics, and latest events integrated as cards

#### Interface Design
- **Masonry Grid System**: CSS Grid-based waterfall layout for dynamic content sizing
- **Card-Based UI**: Each content type is presented as a beautifully designed card
- **Tabbed Navigation**: Clean tab system for Feed, Gallery, Events, and Groups
- **Two-Column Layout**: Main masonry content area with sidebar for quick access features
- **No Popups**: All interactions are inline without modal overlays
- **Hero Section**: Eye-catching header with community statistics
- **Responsive Grid**: Adaptive layouts that scale from mobile to desktop

#### User Experience
- **Visual Hierarchy**: Different card sizes create natural content prioritization
- **Instant Feedback**: Real-time like/unlike with visual feedback
- **Expandable Comments**: Click to show/hide comment sections
- **Inline Editing**: Add comments directly without popups
- **Smooth Animations**: Enhanced hover effects and transitions for better engagement
- **Mobile-First Design**: Touch-friendly interface optimized for all devices

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
│   │   ├── Community.vue      # 社区页面 (950行)
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
| `src/components/Community.vue` | 28KB | 950 | 现代化社区互动和社交功能，无弹窗设计 |
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
   - 可视化工作流编辑器（支持点阵网格背景对齐、柔和贝塞尔曲线连接、英文界面）
   - 多模态能力（TTS、STT、视觉识别等）
   - 模型配置（GPT-4、Claude、自定义模型）
   - 测试与部署（实时对话测试、一键部署）
3. **👥 社区中心**: 现代化社交平台，包含：
   - 动态信息流，支持发布和互动
   - 艺术画廊，带悬停效果和点赞功能
   - 活动日历，支持参与功能
   - 群组管理系统
   - 热门话题和推荐用户
   - 实时评论和互动功能
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

#### 可视化工作流编辑器功能详解

可视化工作流编辑器是一个现代化的拖拽式界面，用于构建AI智能体工作流：

**核心功能:**
- **拖拽界面**: 直观的节点式编辑器，支持可视化连接系统
- **多种节点类型**: 
  - **开始节点**: 工作流初始化和触发器设置
  - **浏览节点**: 网页抓取和内容提取功能
  - **LLM节点**: 大语言模型处理，支持自定义提示词
  - **处理节点**: 数据转换和处理操作
  - **条件节点**: 条件逻辑和分支工作流
  - **结束节点**: 工作流完成和结果处理
- **可视化连接**: 弯曲连接线，自动路径规划
- **实时配置**: 右侧面板进行节点参数设置
- **画布导航**: 支持缩放、平移的工作区，带网格背景
- **节点管理**: 轻松创建、删除和修改节点
- **工作流测试**: 内置测试运行器，支持执行可视化
- **导出/导入**: 保存和加载工作流配置

**技术实现:**
- **现代化界面**: 深色主题，专业样式和流畅动画
- **点阵网格背景**: 便于节点对齐的专业网格系统
- **柔和连接线**: 贝塞尔曲线连接，自然流畅的视觉效果
- **英文界面**: 完整的英文本地化，提升全球可访问性
- **响应式设计**: 在桌面、平板和移动设备上无缝工作
- **性能优化**: 复杂工作流的高效渲染
- **状态管理**: 响应式数据绑定，实时更新
- **错误处理**: 全面的验证和错误报告

### 👥 社区中心功能详解

社区中心已完全重新设计，提供现代化、无弹窗的社交平台体验：

#### 主要功能
- **Pinterest风格瀑布流布局**: 不同卡片尺寸的瀑布流网格布局
- **创意发布卡片**: 渐变风格的发布界面，支持多媒体内容
- **热门话题卡片**: 实时热门标签排行系统
- **互动式帖子**: 点赞、评论、分享功能，实时更新
- **艺术画廊**: 多尺寸作品展示（小/中/大），悬停叠加层
- **活动管理**: 日历视图，支持参与功能和活动详情
- **群组系统**: 加入/离开群组，成员数量追踪
- **社交功能**: 用户推荐、热门话题和最新活动以卡片形式集成

#### 界面设计
- **瀑布流网格系统**: 基于CSS Grid的瀑布流布局，支持动态内容尺寸
- **卡片化界面**: 每种内容类型都以精美设计的卡片呈现
- **标签导航**: 清晰的标签系统，包含动态、画廊、活动和群组
- **双栏布局**: 主瀑布流内容区域配侧边栏，便于快速访问功能
- **无弹窗设计**: 所有交互均为内联，无模态弹窗
- **英雄区域**: 吸引眼球的头部区域，包含社区统计信息
- **响应式网格**: 从移动端到桌面端的自适应布局

#### 用户体验
- **视觉层次**: 不同卡片尺寸创造自然的内容优先级
- **即时反馈**: 实时点赞/取消点赞，带视觉反馈
- **可展开评论**: 点击显示/隐藏评论区域
- **内联编辑**: 直接添加评论，无需弹窗
- **流畅动画**: 增强的悬停效果和过渡动画，提升互动体验
- **移动优先设计**: 为所有设备优化的触摸友好界面

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

---

### 📋 Change Log | 更新日志

**2024-12-19 v4.0 - API Integration & Enhanced Workflow Editor**
- **🔗 Backend API Integration**: Complete DAG management system API configuration
  - Workflow submission, status monitoring, result retrieval
  - SSE real-time status streaming
  - S3 file upload support with pre-signed URLs
  - Tenant management and authentication mechanism
- **🧠 AI Service Node Expansion**: Support for all backend API required service types
  - **LLM**: Large Language Model processing
  - **STT**: Speech to Text conversion
  - **TTS**: Text to Speech synthesis
  - **pic2text**: Image to Text recognition
  - **text2pic**: Text to Image generation
- **📝 Node Prompt Configuration**: Added prompt parameter support for all nodes
  - Smart prompt input fields with service-specific templates
  - Real-time prompt preview and validation
  - Context-aware prompt suggestions
- **🎨 Workflow Editor Enhancement**:
  - Categorized node palette (Control Nodes, AI Services, Tool Nodes)
  - Complete node configuration panel with validation
  - Visual node status indicators with pulse animations
  - Input/output port management with type validation
- **🌐 Complete Language System**: Seamless Chinese-English switching covering all page content
- **👤 Login/Register System**: Complete user authentication interface with form validation and local storage
- **🎨 UI Optimization**: Desktop-focused design with mobile responsiveness removed
- **📱 Navigation Optimization**: Fixed layout wrapping issues in English mode
- **🔧 Homepage Enhancement**: Detailed module feature descriptions and visual feature tags

**2024-12-19 v4.0 - API接入与工作流编辑器增强**
- **🔗 后端API完整接入**: 完整的DAG管理系统API配置
  - 工作流提交、状态监控、结果获取
  - SSE实时状态推送
  - S3文件上传支持，预签名URL
  - 租户管理和认证机制
- **🧠 AI服务节点扩展**: 支持所有后端API要求的服务类型
  - **LLM**: 大语言模型处理
  - **STT**: 语音转文字
  - **TTS**: 文字转语音
  - **pic2text**: 图片转文字
  - **text2pic**: 文字转图片
- **📝 节点Prompt配置**: 为所有节点添加prompt参数支持
  - 智能提示词输入框，针对不同服务类型的模板
  - 实时提示词预览和验证
  - 上下文感知的提示词建议
- **🎨 工作流编辑器增强**:
  - 分类节点调色板（控制节点、AI服务、工具节点）
  - 完整的节点配置面板和验证
  - 可视化节点状态指示器，带脉冲动画
  - 输入输出端口管理，支持类型验证
- **🌐 完整语言切换系统**: 支持中英文无缝切换，覆盖所有页面内容
- **👤 登录注册功能**: 完整的用户认证界面，支持表单验证和本地存储
- **🎨 界面优化**: 专注桌面端设计，删除移动端响应式代码
- **📱 导航栏优化**: 解决英文状态下的布局换行问题
- **🔧 首页内容增强**: 详细的模块功能介绍和视觉特性标签

**2024-12-30 v3.0**
- **Visual Workflow Editor**: Implemented modern drag-and-drop node-based workflow designer
- **Node System**: Added multiple node types (Start, Browse, LLM, Process, Condition, End) with visual connections
- **Professional Interface**: Modern dark theme with dot grid canvas, smooth bezier connection lines, and parameter panels
- **English Interface**: Complete English interface for global accessibility
- **Connection System**: Enhanced with prominent side-center connection points, smooth bezier curves, pulse animations, and visual connection markers
- **Real-time Configuration**: Right-side panel for node parameter setup and workflow testing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts

**2024-12-30 v2.0**
- **Pinterest-style Masonry Layout**: Implemented waterfall/masonry grid layout for Community module
- **Enhanced Card System**: Added creative post cards, trending topics, suggested users, and event previews
- **Dynamic Content Sizing**: Artwork cards now have small/medium/large sizes for varied visual hierarchy
- **Improved Interactivity**: Enhanced hover effects, smooth transitions, and modern card designs
- **Mobile-First Responsive**: Optimized for all screen sizes with adaptive grid layouts

**2024-12-30 v1.0**
- **Community Module Optimization**: Completely redesigned Community Hub with modern, no-popup interface
- **Enhanced User Experience**: Added dynamic feed, art gallery, event management, and group system
- **Improved Navigation**: Implemented tabbed navigation with inline interactions
- **Mobile Optimization**: Enhanced responsive design for better mobile experience

**2024-12-30 v3.0**
- **可视化工作流编辑器**: 实现现代化拖拽式节点工作流设计器
- **节点系统**: 添加多种节点类型（开始、浏览、LLM、处理、条件、结束）和可视化连接
- **专业界面**: 现代化浅色主题，网格画布、连接线和参数面板
- **实时配置**: 右侧面板进行节点参数设置和工作流测试
- **响应式设计**: 优化桌面、平板和移动设备的自适应布局

**2024-12-30 v2.0**
- **Pinterest风格瀑布流布局**: 为社区模块实现瀑布流/砖石布局
- **增强卡片系统**: 添加创意发布卡片、热门话题、推荐用户和活动预览
- **动态内容尺寸**: 艺术作品卡片现在有小/中/大尺寸，形成多样化视觉层次
- **改进交互体验**: 增强悬停效果、流畅过渡和现代卡片设计
- **移动优先响应式**: 优化所有屏幕尺寸，采用自适应网格布局

**2024-12-30 v1.0**
- **社区模块优化**: 全新设计的社区中心，采用现代化无弹窗界面
- **用户体验提升**: 添加动态信息流、艺术画廊、活动管理和群组系统
- **改进导航**: 实现标签导航和内联交互
- **移动端优化**: 增强响应式设计，改善移动设备体验 
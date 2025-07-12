# Labubu Remake AI Platform

## 项目概述

Labubu Remake AI Platform 是一个基于AI的智能体平台，提供可视化的工作流设计、管理和执行功能。该平台采用前后端分离架构，支持拖拽式节点编辑、实时预览、多语言支持等功能。

## 🏗️ 项目结构

```
Labubu Remake AI Platform/
├── frontend/                 # 前端代码
│   ├── src/                 # 源代码
│   │   ├── components/      # Vue组件
│   │   ├── assets/          # 静态资源
│   │   ├── config/          # 配置文件
│   │   ├── i18n/            # 国际化
│   │   ├── utils/           # 工具函数
│   │   ├── main.js          # 入口文件
│   │   └── App.vue          # 根组件
│   ├── public/              # 公共资源
│   ├── package.json         # 前端依赖
│   ├── package-lock.json    # 依赖锁定
│   ├── index.html           # HTML入口
│   └── vite.config.js       # Vite配置
├── backend/                 # 后端代码
│   └── labubu-backend/      # Spring Boot后端
│       ├── src/             # Java源代码
│       ├── build.gradle     # Gradle构建配置
│       └── ...
├── api.md                   # API文档
├── README.md               # 项目说明
└── .gitignore              # Git忽略文件
```

## 🚀 快速启动

### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:3001` 启动

### 后端启动

```bash
# 进入后端目录
cd backend/labubu-backend

# 启动Spring Boot应用
./gradlew bootRun
```

后端服务将在 `http://localhost:8080` 启动

## 🔧 技术栈

### 前端技术
- **Vue.js 3** - 渐进式JavaScript框架
- **Vite** - 快速构建工具
- **Vue I18n** - 国际化支持
- **Canvas API** - 图形绘制
- **CSS3** - 现代样式

### 后端技术
- **Spring Boot** - Java企业级开发框架
- **Spring Security** - 安全认证
- **JWT** - 令牌认证
- **Gradle** - 构建工具

## 📱 功能特性

### 🎨 前端功能
- **可视化工作流编辑器** - 拖拽式节点编辑
- **实时预览** - 即时查看工作流效果
- **多语言支持** - 中文/英文界面
- **响应式设计** - 适配不同屏幕尺寸
- **现代UI** - 深色主题，渐变效果

### 🔧 AI节点类型
- **LLM节点** - 大语言模型处理
- **STT节点** - 语音转文字
- **TTS节点** - 文字转语音
- **图像处理节点** - 图片转文字/文字转图片
- **条件节点** - 逻辑判断
- **数据处理节点** - 数据转换和处理

### 🛠️ 工作流特性
- **拖拽编辑** - 直观的节点拖拽
- **连线管理** - 智能连接系统
- **缩放控制** - 灵活的画布缩放
- **快捷键支持** - 提高编辑效率
- **保存/加载** - 工作流持久化

## 📊 开发进度

### ✅ 已完成
- [x] 前端Vue3项目搭建
- [x] 可视化工作流编辑器
- [x] 多种AI节点类型
- [x] 拖拽和连线功能
- [x] 国际化支持
- [x] 响应式设计
- [x] 后端Spring Boot框架
- [x] 用户认证系统
- [x] JWT令牌机制

### 🔄 进行中
- [ ] 前后端API集成
- [ ] 工作流执行引擎
- [ ] 用户管理系统
- [ ] 部署配置

### 📋 待开发
- [ ] 更多AI节点类型
- [ ] 工作流模板库
- [ ] 社区功能
- [ ] 市场功能
- [ ] 高级分析

## 🤝 团队协作

### 分支管理
- `main` - 主分支，用于团队合并
- `W` - 前端开发分支
- `frontend-restructure` - 前端重构分支

### 代码合并
1. 确保代码在相应目录中：
   - 前端代码：`frontend/`
   - 后端代码：`backend/`
2. 提交到对应的功能分支
3. 通过Pull Request合并到main分支

## 🔗 相关链接

- [API文档](./api.md)
- [GitHub仓库](https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform)

## 📞 联系我们

如有问题或建议，请通过GitHub Issues联系我们。

---

*Labubu Remake AI Platform v2.1.2 - 让AI工作流设计更简单* 
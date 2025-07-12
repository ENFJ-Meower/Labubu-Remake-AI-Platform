# Labubu Remake AI Platform - Frontend

## 📱 前端项目概述

这是Labubu Remake AI Platform的前端部分，基于Vue.js 3和Vite构建的现代化单页应用程序。

## 🚀 快速启动

### 环境要求
- Node.js 16.0+
- npm 8.0+

### 安装和运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🏗️ 项目结构

```
frontend/
├── src/
│   ├── components/          # Vue组件
│   │   ├── AIAgent.vue     # AI工作流编辑器
│   │   ├── Home.vue        # 首页组件
│   │   ├── Login.vue       # 登录组件
│   │   ├── Register.vue    # 注册组件
│   │   ├── About.vue       # 关于页面
│   │   ├── Community.vue   # 社区功能
│   │   └── Marketplace.vue # 市场功能
│   ├── assets/             # 静态资源
│   │   ├── css/           # 样式文件
│   │   └── images/        # 图片资源
│   ├── config/            # 配置文件
│   │   └── api.js         # API配置
│   ├── i18n/              # 国际化
│   │   └── index.js       # 语言配置
│   ├── utils/             # 工具函数
│   │   └── i18nMixin.js   # 国际化混入
│   ├── main.js            # 应用入口
│   └── App.vue            # 根组件
├── public/                # 公共资源
├── package.json           # 项目依赖
├── vite.config.js         # Vite配置
└── index.html             # HTML入口
```

## 🎨 主要功能

### 🔧 AI工作流编辑器
- **拖拽式节点编辑** - 直观的节点操作
- **可视化连线** - 智能连接系统
- **实时预览** - 即时查看工作流效果
- **缩放控制** - 灵活的画布缩放
- **快捷键支持** - 提高编辑效率

### 🌐 用户界面
- **响应式设计** - 适配移动端和桌面端
- **深色主题** - 现代化的视觉效果
- **多语言支持** - 中文/英文界面切换
- **渐变动画** - 流畅的交互体验

### 🔌 AI节点类型
- **LLM节点** - 大语言模型处理
- **STT节点** - 语音转文字
- **TTS节点** - 文字转语音
- **图像处理节点** - 图片转文字/文字转图片
- **条件节点** - 逻辑判断
- **数据处理节点** - 数据转换和处理

## 🛠️ 技术栈

### 核心技术
- **Vue.js 3** - 渐进式JavaScript框架
- **Vite** - 快速构建工具
- **Vue I18n** - 国际化支持
- **Canvas API** - 图形绘制

### 样式和动画
- **CSS3** - 现代样式特性
- **CSS Grid & Flexbox** - 响应式布局
- **CSS Transitions** - 平滑动画效果
- **CSS Gradients** - 渐变视觉效果

### 开发工具
- **ES6+** - 现代JavaScript特性
- **Vue DevTools** - Vue开发调试
- **Hot Module Replacement** - 热更新
- **Source Maps** - 调试映射

## 📊 性能优化

### 构建优化
- **代码分割** - 按需加载
- **Tree Shaking** - 移除未使用代码
- **资源压缩** - 减少文件大小
- **缓存策略** - 提高加载速度

### 运行时优化
- **组件懒加载** - 按需加载组件
- **虚拟滚动** - 处理大量数据
- **防抖节流** - 优化用户交互
- **内存管理** - 避免内存泄漏

## 🔧 配置说明

### API配置
```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:8080'
export const API_ENDPOINTS = {
  AUTH: '/auth',
  WORKFLOWS: '/workflows',
  NODES: '/nodes'
}
```

### 国际化配置
```javascript
// src/i18n/index.js
export const messages = {
  zh: { /* 中文翻译 */ },
  en: { /* English translations */ }
}
```

## 🎯 开发指南

### 代码规范
- 使用Vue 3 Composition API
- 遵循Vue官方风格指南
- 使用ES6+语法特性
- 保持代码整洁和注释

### 组件开发
- 单文件组件(.vue)
- 组件名使用PascalCase
- Props使用camelCase
- 事件名使用kebab-case

### 样式规范
- 使用scoped样式
- 避免内联样式
- 使用CSS变量
- 保持响应式设计

## 🚀 部署说明

### 开发环境
```bash
npm run dev
```
服务运行在 `http://localhost:3001`

### 生产环境
```bash
npm run build
npm run preview
```

### 构建输出
构建后的文件位于`dist/`目录，包含：
- 静态HTML、CSS、JS文件
- 压缩和优化的资源
- 生产环境配置

## 🤝 贡献指南

### 开发流程
1. 克隆项目并进入frontend目录
2. 安装依赖：`npm install`
3. 创建功能分支
4. 开发和测试
5. 提交Pull Request

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 样式修改
- refactor: 代码重构

## 📞 技术支持

如有前端相关问题，请通过以下方式联系：
- GitHub Issues
- 项目文档
- 技术讨论区

---

*Labubu Remake AI Platform Frontend - 现代化的AI工作流前端界面* 
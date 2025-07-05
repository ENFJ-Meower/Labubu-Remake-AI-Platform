# Labubu AI Creative Platform

<p align="center">
  <img src="src/assets/images/bg.png" alt="Labubu AI Platform" width="600" style="border-radius: 20px; margin-bottom: 20px;" />
</p>

<p align="center">
  <strong>🎨 A Creative Community Platform Combining AI Generation Technology with Labubu IP Image Recreation</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.3.4-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Vite-4.4.9-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

---

## 🌟 项目简介

Labubu AI 云创平台是一个结合AI生成技术与Labubu IP形象再创作的创意型社区平台，旨在为用户提供一个集AI agent自定义搭建、互动社区交流与二手改造展示于一体的多功能创作空间。

### 🎯 核心功能

- **🤖 AI Agent Studio**: 自定义AI代理搭建工具，提供直观的可视化配置界面
- **👥 Interactive Community**: 活跃的创作者社区，支持实时聊天、作品分享和创意挑战
- **🛍️ Creative Marketplace**: 安全的二手交易平台，支持Labubu周边和定制作品交易
- **📚 Learning Hub**: 系统化的AI创作教程和提示词库

---

## 🔄 最新更新

### 📁 项目结构优化 (2024年)
- **🖼️ 图片文件夹整理**: 新增 `src/assets/images/` 专用图片文件夹
- **🏠 主页视觉优化**: 添加了三张home系列图片，分别展示AI创作、社区互动和市场功能
- **📱 响应式增强**: 优化了所有图片在移动端的显示效果
- **🎨 视觉效果升级**: 新增图片悬停动画和阴影效果

### 图片资源
- `home1.jpg` - AI Agent Studio功能展示图
- `home2.png` - 社区互动功能展示图  
- `home3.png` - 创意市场功能展示图
- `bg.png` - 主页背景图片
- `labubu-logo.png` - 平台Logo

---

## 🚀 快速开始

### 前置要求

确保您的开发环境已安装以下工具：

- **Node.js** (版本 >= 16.0.0)
- **npm** 或 **yarn** 包管理器
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 安装步骤

1. **克隆项目仓库**
   ```bash
   git clone https://github.com/your-username/labubu-ai-platform.git
   cd labubu-ai-platform
   ```

2. **安装项目依赖**
   ```bash
   npm install
   # 或者使用 yarn
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或者使用 yarn
   yarn dev
   ```

4. **访问应用**
   
   打开浏览器访问 `http://localhost:3000`

### 构建部署

```bash
# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

---

## 📁 项目结构

```
labubu-ai-platform/
├── public/                     # 静态资源文件
├── src/                       # 源代码目录
│   ├── assets/                # 资源文件
│   │   ├── css/
│   │   │   └── global.css     # 全局样式文件
│   │   └── images/            # 图片资源文件夹 🆕
│   │       ├── bg.png         # 主背景图片
│   │       ├── home1.jpg      # AI功能展示图 🆕
│   │       ├── home2.png      # 社区展示图 🆕
│   │       ├── home3.png      # 市场展示图 🆕
│   │       └── labubu-logo.png # 平台Logo
│   ├── components/            # Vue 组件
│   │   ├── Home.vue           # 主页组件 ✨优化
│   │   ├── AIAgent.vue        # AI代理页面
│   │   ├── Community.vue      # 社区页面
│   │   ├── Marketplace.vue    # 市场页面
│   │   └── About.vue          # 关于页面
│   ├── App.vue               # 根组件
│   └── main.js               # 应用入口文件
├── backend/                  # 后端代码目录
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── README.md               # 项目说明文档
```

---

## 🎨 功能特色

### 1. AI Agent Studio
- **📊 可视化配置界面**: 拖拽式组件配置，无需编程基础
- **⚙️ 参数调节**: 创意水平、响应速度、质量焦点等可调节参数
- **📋 模板库**: 预置多种AI代理模板（艺术生成器、内容写手、音乐创作等）
- **💾 项目管理**: 支持保存、导入和导出AI代理配置

### 2. Interactive Community
- **💬 实时聊天**: WebSocket实现的即时通讯功能
- **🎨 作品画廊**: 美观的网格布局展示用户创作
- **🏆 创意挑战**: 定期举办主题创作比赛
- **👥 兴趣小组**: 基于兴趣分类的专业社群

### 3. Creative Marketplace
- **🛡️ 安全交易**: 内置支付保护和质量认证
- **🔍 智能搜索**: 基于AI的商品推荐和搜索
- **📊 数据分析**: 为卖家提供详细的销售分析
- **⭐ 评价系统**: 完善的买家评价和信誉体系

### 4. 响应式设计
- **📱 移动端优化**: 完美适配手机和平板设备
- **🎯 用户体验**: 流畅的动画效果和交互设计
- **⚡ 性能优化**: 懒加载、代码分割等性能优化技术

---

## 🛠️ 技术栈

### 前端框架
- **Vue.js 3**: 渐进式JavaScript框架，提供响应式数据绑定
- **Vue Router 4**: 官方路由管理器，支持单页应用导航
- **Vite**: 下一代前端构建工具，快速的开发服务器

### 样式方案
- **原生CSS3**: 使用现代CSS特性，包括Grid、Flexbox、自定义属性
- **响应式设计**: 移动端优先的响应式布局
- **动画效果**: CSS动画和过渡效果，提升用户体验

### 开发工具
- **ESLint**: 代码质量检查工具
- **Prettier**: 代码格式化工具
- **Git**: 版本控制系统

---

## 🎯 页面介绍

### 🏠 主页 (Home)
- **英雄区域**: 大屏背景展示，包含主要行动号召按钮
- **功能展示**: AI Agent、社区、市场功能的卡片式介绍
- **统计数据**: 动态显示平台用户数、作品数等关键指标
- **关于我们**: 平台愿景、团队介绍和联系方式

### 🤖 AI Agent Studio
- **工作区界面**: 分屏设计，左侧模板选择，右侧配置面板
- **参数控制**: 滑块控制创意水平、速度、质量等参数
- **实时预览**: 配置更改的即时效果预览
- **示例展示**: 其他用户创建的优秀AI代理案例

### 👥 社区 (Community)
- **动态信息流**: 类似社交媒体的用户动态展示
- **话题标签**: 热门话题和标签云
- **活动日历**: 即将举行的比赛和活动
- **用户统计**: 社区活跃度和参与度数据

### 🛍️ 市场 (Marketplace)
- **商品网格**: 响应式商品展示网格
- **筛选搜索**: 多维度筛选和搜索功能
- **特色推荐**: 精选商品和热门商品展示
- **卖家工具**: 为卖家提供的分析和营销工具

### ℹ️ 关于我们 (About)
- **企业介绍**: 公司历史、使命和愿景
- **团队展示**: 核心团队成员介绍
- **价值观**: 企业核心价值观和文化
- **联系方式**: 多渠道联系方式和社交媒体

---

## 🎨 设计系统

### 色彩方案
- **主色调**: `#ff6b6b` (珊瑚红) - 活力与创造力
- **辅助色**: `#4ecdc4` (青绿色) - 科技与创新
- **中性色**: `#333333` (深灰) - 文本主色
- **背景色**: `#f8f9fa` (浅灰) - 页面背景

### 字体系统
- **主字体**: `Poppins` - 现代无衬线字体，英文界面专用
- **字体大小**: 响应式字体系统，移动端自动缩放
- **字重**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### 动画效果
- **入场动画**: `fadeInUp`, `fadeInLeft`, `fadeInRight`
- **悬停效果**: 卡片阴影变化、位移效果
- **过渡动画**: 0.3s 缓动过渡，提升用户体验

---

## 🚀 性能优化

### 前端优化
- **代码分割**: 路由级别的懒加载
- **图片优化**: 响应式图片和懒加载
- **CSS优化**: 关键CSS内联，非关键CSS异步加载
- **JavaScript优化**: Tree shaking，去除未使用代码

### 用户体验优化
- **加载动画**: 优雅的加载状态提示
- **错误处理**: 友好的错误页面和提示
- **离线支持**: 基础的离线缓存策略
- **无障碍访问**: 符合WCAG 2.1标准的无障碍设计

---

## 🔧 开发指南

### 添加新页面
1. 在 `src/components/` 中创建新的Vue组件
2. 在 `src/main.js` 中添加路由配置
3. 更新导航组件链接

### 自定义样式
1. 全局样式请修改 `src/assets/css/global.css`
2. 组件样式使用scoped CSS
3. 遵循BEM命名规范

### 组件开发规范
- 使用Vue 3 Composition API
- 保持组件单一职责
- 添加适当的注释和文档
- 确保响应式兼容性

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. **Fork** 项目仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 **Pull Request**

### 代码规范
- 使用ESLint进行代码检查
- 遵循Vue.js官方风格指南
- 编写清晰的提交信息
- 添加必要的测试用例

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🌐 相关链接

- **项目主页**: [https://labubu-ai.com](https://labubu-ai.com)
- **文档中心**: [https://docs.labubu-ai.com](https://docs.labubu-ai.com)
- **社区论坛**: [https://community.labubu-ai.com](https://community.labubu-ai.com)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/labubu-ai-platform/issues)

---

## 📞 联系我们

- **邮箱**: hello@labubu-ai.com
- **技术支持**: support@labubu-ai.com
- **社交媒体**: [@LabubuAI](https://twitter.com/LabubuAI)
- **Discord**: [LabubuAI Community](https://discord.gg/labubuai)

---

<p align="center">
  <strong>🎨 让创意无界，让AI赋能艺术！</strong>
</p>

<p align="center">
  Made with ❤️ by the Labubu AI Team
</p> 
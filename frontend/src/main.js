// Import Vue core library for creating reactive applications导入Vue核心库用于创建响应式应用
import { createApp } from 'vue'
// Import Vue Router for client-side routing导入Vue Router用于客户端路由
import { createRouter, createWebHistory } from 'vue-router'
// Import main App component导入主应用组件
import App from './App.vue'
// Import page components导入页面组件
import Home from './components/Home.vue'
import AIAgent from './components/AIAgent.vue'
import Community from './components/Community.vue'
import Marketplace from './components/Marketplace.vue'
import About from './components/About.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
// Import Animate.css for animations导入Animate.css动画库
import 'animate.css'
// Import global CSS styles导入全局CSS样式
import './assets/css/global.css'
// Import i18n mixin for internationalization导入国际化混入
import i18nMixin from './utils/i18nMixin.js'
// Import message utility for notifications导入消息提示工具
import message from './utils/message.js'

// Route configuration - defines all application routes路由配置 - 定义所有应用路由
const routes = [
  { path: '/frontend/', name: 'Home', component: Home }, // Home page route首页路由
  { path: '/frontend/ai-agent', name: 'AIAgent', component: AIAgent }, // AI Agent page route AI智能体页面路由
  { path: '/frontend/community', name: 'Community', component: Community }, // Community page route社区页面路由
  { path: '/frontend/marketplace', name: 'Marketplace', component: Marketplace }, // Marketplace page route市场页面路由
  { path: '/frontend/about', name: 'About', component: About }, // About page route关于页面路由
  { path: '/frontend/login', name: 'Login', component: Login }, // Login page route登录页面路由
  { path: '/frontend/register', name: 'Register', component: Register } // Register page route注册页面路由
]

// Create router instance with HTML5 history mode创建路由实例并使用HTML5历史模式
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history API使用HTML5历史API
  routes, // Route definitions路由定义
  // Scroll behavior configuration - handles page scrolling when navigating滚动行为配置 - 处理导航时的页面滚动
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition // Restore saved scroll position if available如果有保存的滚动位置则恢复
    } else {
      return { top: 0 } // Scroll to top for new routes新路由滚动到顶部
    }
  }
})

// Create Vue application instance创建Vue应用实例
const app = createApp(App)

// Apply i18n mixin globally for internationalization support全局应用国际化混入以支持多语言
app.mixin(i18nMixin)

// Register global message utility for notifications注册全局消息工具用于通知提示
app.config.globalProperties.$message = message

// Install router plugin安装路由插件
app.use(router)

// Mount the application to DOM element with id 'app'将应用挂载到DOM元素id为'app'的节点上
app.mount('#app') 
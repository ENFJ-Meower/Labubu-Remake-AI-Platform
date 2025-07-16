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
// Import authentication utilities导入认证工具
import { isAuthenticated, requiresAuth, redirectToLogin } from './utils/auth.js'

// Route configuration - defines all application routes路由配置 - 定义所有应用路由
const routes = [
  { path: '/', name: 'Home', component: Home }, // Home page route首页路由
  { path: '/frontend/ai-agent', name: 'AIAgent', component: AIAgent, meta: { requiresAuth: true } }, // AI Agent page route AI智能体页面路由
  { path: '/frontend/community', name: 'Community', component: Community, meta: { requiresAuth: true } }, // Community page route社区页面路由
  { path: '/frontend/marketplace', name: 'Marketplace', component: Marketplace, meta: { requiresAuth: true } }, // Marketplace page route市场页面路由
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

// Add navigation guard for authentication添加导航守卫进行认证检查
router.beforeEach((to, from, next) => {
  // 临时禁用认证检查，直接允许所有路由访问
  console.log('开发模式：跳过认证检查，直接访问', to.path)
  next()
  
  // 原始认证逻辑（已注释）
  /*
  // Check if route requires authentication检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // Check if user is authenticated检查用户是否已认证
    if (!isAuthenticated()) {
      console.log('用户未登录，重定向到登录页面')
      // Save the original path for redirect after login保存原始路径以便登录后重定向
      localStorage.setItem('redirect_after_login', to.fullPath)
      // Redirect to login page重定向到登录页面
      next('/frontend/login')
      return
    }
  }
  
  // If user is authenticated and trying to access login/register page
  // 如果用户已登录且试图访问登录/注册页面
  if (isAuthenticated() && (to.path === '/frontend/login' || to.path === '/frontend/register')) {
    console.log('用户已登录，重定向到首页')
    next('/')
    return
  }
  
  // Allow navigation继续导航
  next()
  */
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
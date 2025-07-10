import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import AIAgent from './components/AIAgent.vue'
import Community from './components/Community.vue'
import Marketplace from './components/Marketplace.vue'
import About from './components/About.vue'
import 'animate.css'
import './assets/css/global.css'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/ai-agent', name: 'AIAgent', component: AIAgent },
  { path: '/community', name: 'Community', component: Community },
  { path: '/marketplace', name: 'Marketplace', component: Marketplace },
  { path: '/about', name: 'About', component: About }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app') 
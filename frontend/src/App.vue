<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="nav-container">
        <!-- Logo -->
        <div class="nav-logo">
          <router-link to="/" class="logo-link">
            <img src="./assets/images/logo.png" alt="Labubu AI" class="logo-img" />
            <span class="logo-text">Labubu AI</span>
          </router-link>
        </div>
        
        <!-- 导航菜单 -->
        <div class="nav-menu">
          <router-link to="/" class="nav-link">
            <i class="icon-home"></i>
            <span>{{ $t('nav.home') || '首页' }}</span>
          </router-link>
          <router-link to="/frontend/ai-agent" class="nav-link">
            <i class="icon-robot"></i>
            <span>{{ $t('nav.aiAgent') || 'AI智能体' }}</span>
          </router-link>
          <router-link to="/frontend/community" class="nav-link">
            <i class="icon-community"></i>
            <span>{{ $t('nav.community') || '社区' }}</span>
          </router-link>
          <router-link to="/frontend/marketplace" class="nav-link">
            <i class="icon-marketplace"></i>
            <span>{{ $t('nav.marketplace') || '市场' }}</span>
          </router-link>
          <!-- 只有登录后才显示个人中心 -->
          <router-link v-if="isUserAuthenticated" to="/frontend/profile" class="nav-link">
            <i class="icon-profile"></i>
            <span>{{ $t('nav.profile') || '个人中心' }}</span>
          </router-link>
        </div>
        
        <!-- 用户操作区域 -->
        <div class="nav-actions">
          <!-- 语言切换按钮 -->
          <div class="language-switcher" @click="toggleLanguage">
            <div class="language-btn">
              <span class="language-flag">{{ currentLanguageFlag }}</span>
              <span class="language-name">{{ currentLanguageName }}</span>
            </div>
          </div>
          
          <!-- 未登录状态显示登录/注册按钮 -->
          <template v-if="!isUserAuthenticated">
            <router-link to="/frontend/login" class="login-btn">
              <i class="icon-login"></i>
              <span>{{ $t('nav.login') || '登录' }}</span>
            </router-link>
            <router-link to="/frontend/register" class="register-btn">
              <i class="icon-register"></i>
              <span>{{ $t('nav.register') || '注册' }}</span>
            </router-link>
          </template>
          
          <!-- 已登录状态显示用户信息和登出按钮 -->
          <template v-else>
            <div class="user-info">
              <span class="user-name">{{ currentUser?.username || '用户' }}</span>
              <button class="logout-btn" @click="handleLogout">
                <i class="icon-logout"></i>
                <span>{{ $t('nav.logout') || '登出' }}</span>
              </button>
            </div>
          </template>
        </div>
        

      </div>
    </nav>
    
    <!-- 路由视图 -->
    <router-view />
    
    <!-- 返回顶部按钮 -->
    <div class="scroll-to-top" :class="{ 'show': showScrollTop }" @click="scrollToTop">
      <i class="icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import languageManager, { currentLanguage } from './i18n/index.js'
import { isAuthenticated, getCurrentUser, logout } from './utils/auth.js'

export default {
  name: 'App',
  data() {
    return {
      isScrolled: false,
      showScrollTop: false,
      isUserAuthenticated: false,
      currentUser: null
    }
  },
  computed: {
    currentLanguage() {
      return currentLanguage.value
    },
    currentLanguageFlag() {
      return this.currentLanguage === 'zh' ? '🇨🇳' : '🇺🇸'
    },
    currentLanguageName() {
      return this.currentLanguage === 'zh' ? '中文' : 'EN'
    }
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
    
    // 初始化语言系统
    languageManager.init()
    
    // 检查用户认证状态
    this.checkAuthStatus()
    
    // 监听路由变化以更新认证状态
    this.$router.afterEach(() => {
      this.checkAuthStatus()
    })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 处理滚动事件
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      this.isScrolled = scrollTop > 50
      this.showScrollTop = scrollTop > 300
    },
    

    
    // 滚动到顶部
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    
    // 切换语言
    toggleLanguage() {
      const newLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh'
      languageManager.setLanguage(newLanguage)
      
      // 显示切换提示
      const message = newLanguage === 'zh' ? '已切换到中文' : 'Switched to English'
      this.showLanguageToast(message)
    },
    
    // 显示语言切换提示
    showLanguageToast(message) {
      // 创建临时提示元素
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideInFromRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
      `
      
      // 添加动画样式
      const style = document.createElement('style')
      style.textContent = `
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `
      document.head.appendChild(style)
      
      // 显示提示
      document.body.appendChild(toast)
      
      // 3秒后移除
      setTimeout(() => {
        toast.style.animation = 'slideInFromRight 0.3s ease-out reverse'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
          if (style.parentNode) {
            style.parentNode.removeChild(style)
          }
        }, 300)
      }, 2000)
    },
    
    // 检查用户认证状态
    checkAuthStatus() {
      this.isUserAuthenticated = isAuthenticated()
      this.currentUser = getCurrentUser()
    },
    
    // 处理用户登出
    handleLogout() {
      if (confirm(this.$t('nav.logoutConfirm') || '确定要登出吗？')) {
        logout()
        this.checkAuthStatus()
        // 如果当前在需要认证的页面，跳转到首页
        if (this.$route.meta.requiresAuth) {
          this.$router.push('/')
        }
        // 显示登出成功提示
        this.showLanguageToast(this.$t('nav.logoutSuccess') || '已成功登出')
      }
    }
  }
}
</script>

<style scoped>
/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  padding: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  min-width: 1000px;
}

.navbar-scrolled {
  background: rgba(26, 26, 26, 0.98);
  box-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  min-width: 1000px;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #e0e0e0;
  font-weight: 700;
  font-size: 1.4rem;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 0.6rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-shrink: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #b0b0b0;
  font-weight: 500;
  padding: 0.7rem 1.2rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  min-width: 140px;
  width: auto;
  font-size: 0.95rem;
  text-align: center;
}

.nav-link:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

/* 图标样式 */
.icon-home::before { content: "🏠"; }
.icon-robot::before { content: "🤖"; }
.icon-community::before { content: "👥"; }
.icon-marketplace::before { content: "🛍️"; }
.icon-profile::before { content: "👤"; }
.icon-login::before { content: "🔑"; }
.icon-register::before { content: "📝"; }
.icon-logout::before { content: "🚪"; }

/* 用户操作区域 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

/* 语言切换按钮 */
.language-switcher {
  cursor: pointer;
  user-select: none;
}

.language-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  min-width: 80px;
  width: 80px;
  font-size: 0.85rem;
  text-align: center;
}

.language-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  background: linear-gradient(45deg, #764ba2, #667eea);
}

.language-flag {
  font-size: 1.1rem;
  line-height: 1;
}

.language-name {
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.login-btn, .register-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 100px;
  width: 100px;
  white-space: nowrap;
  font-size: 0.9rem;
  text-align: center;
}

.login-btn {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

.register-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-name {
  color: #4ecdc4;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(78, 205, 196, 0.3);
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  min-width: 100px;
  width: 100px;
  white-space: nowrap;
  font-size: 0.9rem;
  text-align: center;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  background: linear-gradient(45deg, #ee5a52, #ff6b6b);
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-container {
    min-width: 900px;
    padding: 1rem 1rem;
  }
  
  .nav-menu {
    gap: 2rem;
  }
  
  .nav-link {
    min-width: 110px;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .login-btn, .register-btn, .logout-btn {
    min-width: 90px;
    width: 90px;
    font-size: 0.85rem;
  }
  
  .language-btn {
    min-width: 75px;
    width: 75px;
    font-size: 0.8rem;
  }
}

@media (max-width: 1000px) {
  .navbar {
    min-width: 100%;
  }
  
  .nav-container {
    min-width: 100%;
    padding: 1rem 0.5rem;
  }
  
  .nav-menu {
    gap: 1.5rem;
  }
  
  .nav-link {
    min-width: 90px;
    font-size: 0.85rem;
    padding: 0.6rem 0.6rem;
  }
  
  .login-btn, .register-btn, .logout-btn {
    min-width: 80px;
    width: 80px;
    font-size: 0.8rem;
    padding: 0.5rem 0.5rem;
  }
  
  .language-btn {
    min-width: 70px;
    width: 70px;
    font-size: 0.75rem;
    padding: 0.5rem 0.5rem;
  }
}

/* 返回顶部按钮 */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-to-top.show {
  opacity: 1;
  visibility: visible;
}

.scroll-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.icon-arrow-up::before {
  content: "↑";
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}


</style> 
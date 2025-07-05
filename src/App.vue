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
        <div class="nav-menu" :class="{ 'nav-menu-active': isMobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <i class="icon-home"></i>
            <span>Home</span>
          </router-link>
          <router-link to="/ai-agent" class="nav-link" @click="closeMobileMenu">
            <i class="icon-robot"></i>
            <span>AI Agent</span>
          </router-link>
          <router-link to="/community" class="nav-link" @click="closeMobileMenu">
            <i class="icon-community"></i>
            <span>Community</span>
          </router-link>
          <router-link to="/marketplace" class="nav-link" @click="closeMobileMenu">
            <i class="icon-marketplace"></i>
            <span>Marketplace</span>
          </router-link>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-toggle" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
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
export default {
  name: 'App',
  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false,
      showScrollTop: false
    }
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
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
    
    // 切换移动端菜单
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    
    // 关闭移动端菜单
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    
    // 滚动到顶部
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
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
}

.navbar-scrolled {
  background: rgba(26, 26, 26, 0.98);
  box-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
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
  font-size: 1.5rem;
}

.logo-img {
  width: 45px;
  height: 45px;
  margin-right: 0.8rem;
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
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #b0b0b0;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
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

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background: #e0e0e0;
  margin: 3px 0;
  transition: 0.3s;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background: #1a1a1a;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2rem;
    transition: left 0.3s ease;
    gap: 1rem;
  }
  
  .nav-menu-active {
    left: 0;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav-link {
    width: 200px;
    justify-content: center;
    padding: 1rem;
    font-size: 1.1rem;
  }
}
</style> 
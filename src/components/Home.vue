<template>
  <div class="home">
    <!-- 背景粒子效果 -->
    <div class="particles-container">
      <div class="particle" v-for="i in 100" :key="i" :class="`particle-${i}`"></div>
    </div>
    
    <!-- 全页面浮动表情符号 -->
    <div class="floating-elements-global">
      <div class="floating-element floating-global-1">✨</div>
      <div class="floating-element floating-global-2">🎨</div>
      <div class="floating-element floating-global-3">🤖</div>
      <div class="floating-element floating-global-4">💫</div>
      <div class="floating-element floating-global-5">🎯</div>
      <div class="floating-element floating-global-6">🌟</div>
      <div class="floating-element floating-global-7">🚀</div>
      <div class="floating-element floating-global-8">💡</div>
    </div>

    <!-- 英雄区 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text animate-fade-in-up">
            <h1 class="hero-title typewriter">
              Welcome to <span class="text-primary gradient-text">Labubu AI</span>
              <br />Creative Platform
            </h1>
            <p class="hero-subtitle slide-in-text">
              Unleash your creativity with AI-powered tools and join our vibrant community
              of artists, creators, and Labubu enthusiasts.
            </p>
            <div class="hero-buttons">
              <router-link to="/ai-agent" class="btn btn-primary btn-large ripple-effect">
                Start Creating
              </router-link>
              <router-link to="/community" class="btn btn-secondary btn-large ripple-effect">
                Join Community
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <div class="scroll-arrow-container" @click="scrollToContent">
          <div class="scroll-arrow-wrapper">
            <div class="scroll-arrow-circle">
              <div class="scroll-arrow-chevron"></div>
            </div>
            <div class="scroll-text">Scroll Down</div>
          </div>
          <div class="scroll-animation-line"></div>
        </div>
      </div>
    </section>

    <!-- AI Agent 功能展示 - 滚动驱动动画布局 -->
    <section class="scroll-animated-section" id="ai-agent" data-direction="left">
      <div class="scroll-container">
        <div class="scroll-image-wrapper">
          <img src="../assets/images/home1.jpg" alt="AI Agent Studio" class="scroll-image" />
        </div>
        <div class="scroll-content-wrapper">
          <div class="scroll-text-content">
            <h2 class="scroll-title">AI Agent Studio</h2>
            <p class="scroll-description">
              Build and customize your own AI agents with our intuitive platform. 
              Experience the power of AI-assisted creativity with advanced tools and templates 
              tailored to your specific creative vision. Create personalized AI agents, 
              access powerful creative tools, and learn from comprehensive tutorials.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 社区展示 - 滚动驱动动画布局 -->
    <section class="scroll-animated-section" id="community" data-direction="right">
      <div class="scroll-container">
        <div class="scroll-image-wrapper">
          <img src="../assets/images/home2.png" alt="Community Showcase" class="scroll-image" />
        </div>
        <div class="scroll-content-wrapper">
          <div class="scroll-text-content">
            <h2 class="scroll-title">Interactive Community</h2>
            <p class="scroll-description">
              Connect with fellow creators and share your amazing works in our vibrant community. 
              Engage in real-time conversations, participate in creative contests, and showcase your 
              creations in our beautiful gallery. Join over 10,000 active creators, explore 50,000+ 
              artworks, and enjoy 1,000+ daily interactions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 二手平台展示 - 滚动驱动动画布局 -->
    <section class="scroll-animated-section" id="marketplace" data-direction="left">
      <div class="scroll-container">
        <div class="scroll-image-wrapper">
          <img src="../assets/images/home3.png" alt="Marketplace Preview" class="scroll-image" />
        </div>
        <div class="scroll-content-wrapper">
          <div class="scroll-text-content">
            <h2 class="scroll-title">Creative Marketplace</h2>
            <p class="scroll-description">
              Discover, buy, and sell unique Labubu creations and customizations. 
              Browse through hundreds of unique items from talented artists and find your perfect match 
              in our secure and verified marketplace. Buy and sell custom items, commission unique designs, 
              and enjoy quality assured products.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 - 滚动驱动动画布局 -->
    <section class="scroll-animated-section" id="about" data-direction="right">
      <div class="scroll-container">
        <div class="scroll-image-wrapper">
          <img src="../assets/images/home1.jpg" alt="About Us" class="scroll-image" />
        </div>
        <div class="scroll-content-wrapper">
          <div class="scroll-text-content">
            <h2 class="scroll-title">About Labubu AI Platform</h2>
            <p class="scroll-description">
              Empowering creativity through AI technology and community collaboration. 
              We believe in the power of AI to enhance human creativity, providing artists 
              and creators with cutting-edge tools to bring their visions to life. 
              Innovation in AI-powered creativity, community-driven development, 
              user-focused design, and continuous improvement.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="section contact">
      <div class="container">
        <div class="contact-content">
          <h2 class="section-title animate-fade-in-up gradient-text">Get in Touch</h2>
          <p class="section-subtitle animate-fade-in-up">
            Ready to start your creative journey? We're here to help!
          </p>
          <div class="contact-buttons animate-fade-in-up">
            <a href="#" class="btn btn-primary ripple-effect">
              Contact Support
            </a>
            <a href="#" class="btn btn-secondary ripple-effect">
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    // 添加滚动动画观察者
    this.observeAnimations()
    // 启动数字计数动画
    this.animateCounters()
    // 启动文字打字机效果
    this.typewriterEffect()
    // 启动滚动驱动动画
    this.initScrollAnimations()
  },
  methods: {
    observeAnimations() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up')
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      )

      // 观察所有需要动画的元素
      const animateElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right')
      animateElements.forEach((el) => {
        observer.observe(el)
      })
    },
    
    animateCounters() {
      const counters = document.querySelectorAll('.counter')
      
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const counter = entry.target
              const target = +counter.getAttribute('data-target')
              const increment = target / 100
              
              const updateCounter = () => {
                const current = +counter.innerText
                if (current < target) {
                  counter.innerText = Math.ceil(current + increment)
                  requestAnimationFrame(updateCounter)
                } else {
                  counter.innerText = target.toLocaleString() + '+'
                }
              }
              updateCounter()
              counterObserver.unobserve(counter)
            }
          })
        },
        { threshold: 0.5 }
      )
      
      counters.forEach(counter => {
        counterObserver.observe(counter)
      })
    },
    
    typewriterEffect() {
      setTimeout(() => {
        const title = document.querySelector('.hero-title')
        if (title) {
          title.classList.add('typewriter-active')
        }
      }, 1000)
    },
    
    scrollToContent() {
      const firstScrollSection = document.querySelector('.scroll-animated-section')
      if (firstScrollSection) {
        firstScrollSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    
    initScrollAnimations() {
      // 只在非移动设备上启用滚动动画
      if (window.innerWidth <= 768) {
        return
      }
      
      const scrollSections = document.querySelectorAll('.scroll-animated-section')
      
      // 为每个section添加滚动监听器
      const handleScroll = () => {
        scrollSections.forEach(section => {
          const direction = section.getAttribute('data-direction')
          this.updateScrollAnimation(section, direction)
        })
      }
      
      // 添加滚动事件监听器
      window.addEventListener('scroll', handleScroll)
      
      // 初始化时就检查一次
      setTimeout(() => {
        handleScroll()
      }, 100)
    },
    
    updateScrollAnimation(section, direction) {
      if (window.innerWidth <= 768) {
        return
      }
      
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // 计算section在视口中的位置
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      const sectionHeight = rect.height
      
      // 只有当section在视口中时才进行动画
      if (sectionTop < viewportHeight && sectionBottom > 0) {
        // 计算模块在视野中的可见比例
        let progress = 0
        
        // 计算section在视口中的可见高度
        const visibleTop = Math.max(0, -sectionTop)
        const visibleBottom = Math.min(sectionHeight, viewportHeight - sectionTop)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        
        // 进度 = 可见高度 / section总高度
        progress = visibleHeight / sectionHeight
        
        // 当进度超过30%时开始动画，小于30%时缩回
        if (progress > 0.3) {
          if (direction === 'left') {
            section.classList.add('animate-left')
            section.classList.remove('animate-right')
          } else {
            section.classList.add('animate-right')
            section.classList.remove('animate-left')
          }
        } else {
          // 进度小于30%时，移除动画类，重置为初始状态
          section.classList.remove('animate-left', 'animate-right')
        }
      } else {
        // 当section完全离开视口时，重置动画状态
        section.classList.remove('animate-left', 'animate-right')
      }
    }
  }
}
</script>

<style scoped>
/* 主容器样式 */
.home {
  position: relative;
  min-height: 100vh;
  background: #1a1a1a;
}
/* 背景粒子效果 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500vh;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .particles-container {
    z-index: 1;
  }
  
  .particle {
    width: 3px !important;
    height: 3px !important;
    box-shadow: 0 0 4px rgba(255, 107, 107, 0.6) !important;
  }
  
  .particle:nth-child(3n) {
    animation: float-slow 20s ease-in-out infinite !important;
  }
  
  .particle:nth-child(5n) {
    animation: float 12s ease-in-out infinite !important;
  }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.8);
}

/* 不同大小和动画的粒子 */
.particle:nth-child(3n) {
  width: 2px;
  height: 2px;
  background: rgba(78, 205, 196, 0.9);
  box-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
  animation: float-slow 15s ease-in-out infinite;
}

.particle:nth-child(5n) {
  width: 5px;
  height: 5px;
  background: rgba(255, 107, 107, 0.7);
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
  animation: float-fast 8s ease-in-out infinite;
}

.particle:nth-child(7n) {
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 7px rgba(255, 255, 255, 0.6);
  animation: float-spiral 12s ease-in-out infinite;
}

.particle:nth-child(11n) {
  animation: float-bounce 9s ease-in-out infinite;
}

.particle:nth-child(13n) {
  animation: float-wave 11s ease-in-out infinite;
}

/* 为每个粒子创建随机位置和延迟，分布在整个页面中 */
/* 第一层：顶部区域 (0-20%) */
.particle-1 { left: 5%; top: 3%; animation-delay: 0s; }
.particle-2 { left: 15%; top: 8%; animation-delay: 0.5s; }
.particle-3 { left: 25%; top: 12%; animation-delay: 1s; }
.particle-4 { left: 35%; top: 6%; animation-delay: 1.5s; }
.particle-5 { left: 45%; top: 15%; animation-delay: 2s; }
.particle-6 { left: 55%; top: 9%; animation-delay: 2.5s; }
.particle-7 { left: 65%; top: 18%; animation-delay: 3s; }
.particle-8 { left: 75%; top: 4%; animation-delay: 3.5s; }
.particle-9 { left: 85%; top: 11%; animation-delay: 4s; }
.particle-10 { left: 95%; top: 16%; animation-delay: 4.5s; }

/* 第二层：上中部区域 (20-40%) */
.particle-11 { left: 8%; top: 22%; animation-delay: 5s; }
.particle-12 { left: 18%; top: 28%; animation-delay: 5.5s; }
.particle-13 { left: 28%; top: 35%; animation-delay: 6s; }
.particle-14 { left: 38%; top: 25%; animation-delay: 6.5s; }
.particle-15 { left: 48%; top: 32%; animation-delay: 7s; }
.particle-16 { left: 58%; top: 38%; animation-delay: 7.5s; }
.particle-17 { left: 68%; top: 29%; animation-delay: 8s; }
.particle-18 { left: 78%; top: 36%; animation-delay: 8.5s; }
.particle-19 { left: 88%; top: 23%; animation-delay: 9s; }
.particle-20 { left: 98%; top: 31%; animation-delay: 9.5s; }

/* 第三层：中部区域 (40-60%) */
.particle-21 { left: 3%; top: 42%; animation-delay: 10s; }
.particle-22 { left: 13%; top: 48%; animation-delay: 10.5s; }
.particle-23 { left: 23%; top: 55%; animation-delay: 11s; }
.particle-24 { left: 33%; top: 45%; animation-delay: 11.5s; }
.particle-25 { left: 43%; top: 52%; animation-delay: 12s; }
.particle-26 { left: 53%; top: 58%; animation-delay: 12.5s; }
.particle-27 { left: 63%; top: 49%; animation-delay: 13s; }
.particle-28 { left: 73%; top: 56%; animation-delay: 13.5s; }
.particle-29 { left: 83%; top: 43%; animation-delay: 14s; }
.particle-30 { left: 93%; top: 51%; animation-delay: 14.5s; }

/* 第四层：下中部区域 (60-80%) */
.particle-31 { left: 6%; top: 62%; animation-delay: 15s; }
.particle-32 { left: 16%; top: 68%; animation-delay: 15.5s; }
.particle-33 { left: 26%; top: 75%; animation-delay: 16s; }
.particle-34 { left: 36%; top: 65%; animation-delay: 16.5s; }
.particle-35 { left: 46%; top: 72%; animation-delay: 17s; }
.particle-36 { left: 56%; top: 78%; animation-delay: 17.5s; }
.particle-37 { left: 66%; top: 69%; animation-delay: 18s; }
.particle-38 { left: 76%; top: 76%; animation-delay: 18.5s; }
.particle-39 { left: 86%; top: 63%; animation-delay: 19s; }
.particle-40 { left: 96%; top: 71%; animation-delay: 19.5s; }

/* 第五层：底部区域 (80-100%) */
.particle-41 { left: 9%; top: 82%; animation-delay: 20s; }
.particle-42 { left: 19%; top: 88%; animation-delay: 20.5s; }
.particle-43 { left: 29%; top: 95%; animation-delay: 21s; }
.particle-44 { left: 39%; top: 85%; animation-delay: 21.5s; }
.particle-45 { left: 49%; top: 92%; animation-delay: 22s; }
.particle-46 { left: 59%; top: 98%; animation-delay: 22.5s; }
.particle-47 { left: 69%; top: 89%; animation-delay: 23s; }
.particle-48 { left: 79%; top: 96%; animation-delay: 23.5s; }
.particle-49 { left: 89%; top: 83%; animation-delay: 24s; }
.particle-50 { left: 99%; top: 91%; animation-delay: 24.5s; }

/* 第六层：额外的粒子，更密集分布 */
.particle-51 { left: 7%; top: 5%; animation-delay: 25s; }
.particle-52 { left: 17%; top: 13%; animation-delay: 25.5s; }
.particle-53 { left: 27%; top: 7%; animation-delay: 26s; }
.particle-54 { left: 37%; top: 19%; animation-delay: 26.5s; }
.particle-55 { left: 47%; top: 11%; animation-delay: 27s; }
.particle-56 { left: 57%; top: 21%; animation-delay: 27.5s; }
.particle-57 { left: 67%; top: 14%; animation-delay: 28s; }
.particle-58 { left: 77%; top: 8%; animation-delay: 28.5s; }
.particle-59 { left: 87%; top: 17%; animation-delay: 29s; }
.particle-60 { left: 97%; top: 12%; animation-delay: 29.5s; }

.particle-61 { left: 2%; top: 26%; animation-delay: 30s; }
.particle-62 { left: 12%; top: 34%; animation-delay: 30.5s; }
.particle-63 { left: 22%; top: 31%; animation-delay: 31s; }
.particle-64 { left: 32%; top: 27%; animation-delay: 31.5s; }
.particle-65 { left: 42%; top: 39%; animation-delay: 32s; }
.particle-66 { left: 52%; top: 33%; animation-delay: 32.5s; }
.particle-67 { left: 62%; top: 41%; animation-delay: 33s; }
.particle-68 { left: 72%; top: 37%; animation-delay: 33.5s; }
.particle-69 { left: 82%; top: 28%; animation-delay: 34s; }
.particle-70 { left: 92%; top: 39%; animation-delay: 34.5s; }

.particle-71 { left: 4%; top: 47%; animation-delay: 35s; }
.particle-72 { left: 14%; top: 54%; animation-delay: 35.5s; }
.particle-73 { left: 24%; top: 59%; animation-delay: 36s; }
.particle-74 { left: 34%; top: 51%; animation-delay: 36.5s; }
.particle-75 { left: 44%; top: 57%; animation-delay: 37s; }
.particle-76 { left: 54%; top: 53%; animation-delay: 37.5s; }
.particle-77 { left: 64%; top: 47%; animation-delay: 38s; }
.particle-78 { left: 74%; top: 61%; animation-delay: 38.5s; }
.particle-79 { left: 84%; top: 54%; animation-delay: 39s; }
.particle-80 { left: 94%; top: 48%; animation-delay: 39.5s; }

.particle-81 { left: 1%; top: 67%; animation-delay: 40s; }
.particle-82 { left: 11%; top: 73%; animation-delay: 40.5s; }
.particle-83 { left: 21%; top: 79%; animation-delay: 41s; }
.particle-84 { left: 31%; top: 71%; animation-delay: 41.5s; }
.particle-85 { left: 41%; top: 77%; animation-delay: 42s; }
.particle-86 { left: 51%; top: 73%; animation-delay: 42.5s; }
.particle-87 { left: 61%; top: 67%; animation-delay: 43s; }
.particle-88 { left: 71%; top: 81%; animation-delay: 43.5s; }
.particle-89 { left: 81%; top: 74%; animation-delay: 44s; }
.particle-90 { left: 91%; top: 68%; animation-delay: 44.5s; }

.particle-91 { left: 5%; top: 87%; animation-delay: 45s; }
.particle-92 { left: 15%; top: 93%; animation-delay: 45.5s; }
.particle-93 { left: 25%; top: 99%; animation-delay: 46s; }
.particle-94 { left: 35%; top: 91%; animation-delay: 46.5s; }
.particle-95 { left: 45%; top: 97%; animation-delay: 47s; }
.particle-96 { left: 55%; top: 93%; animation-delay: 47.5s; }
.particle-97 { left: 65%; top: 87%; animation-delay: 48s; }
.particle-98 { left: 75%; top: 99%; animation-delay: 48.5s; }
.particle-99 { left: 85%; top: 94%; animation-delay: 49s; }
.particle-100 { left: 95%; top: 88%; animation-delay: 49.5s; }

/* 主要浮动动画 */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
    opacity: 0.9; 
  }
  25% { 
    transform: translateY(-20px) translateX(15px) rotate(90deg) scale(1.1); 
    opacity: 0.8; 
  }
  50% { 
    transform: translateY(-35px) translateX(-10px) rotate(180deg) scale(0.9); 
    opacity: 0.6; 
  }
  75% { 
    transform: translateY(-20px) translateX(-15px) rotate(270deg) scale(1.2); 
    opacity: 0.8; 
  }
}

/* 慢速浮动动画 */
@keyframes float-slow {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.8; 
  }
  50% { 
    transform: translateY(-25px) translateX(20px) rotate(180deg); 
    opacity: 0.4; 
  }
}

/* 快速浮动动画 */
@keyframes float-fast {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
    opacity: 1; 
  }
  25% { 
    transform: translateY(-15px) translateX(25px) rotate(180deg) scale(1.3); 
    opacity: 0.7; 
  }
  50% { 
    transform: translateY(-40px) translateX(-20px) rotate(360deg) scale(0.8); 
    opacity: 0.5; 
  }
  75% { 
    transform: translateY(-15px) translateX(-25px) rotate(540deg) scale(1.1); 
    opacity: 0.7; 
  }
}

/* 螺旋浮动动画 */
@keyframes float-spiral {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
    opacity: 0.9; 
  }
  25% { 
    transform: translateY(-30px) translateX(30px) rotate(90deg) scale(1.2); 
    opacity: 0.7; 
  }
  50% { 
    transform: translateY(-60px) translateX(0px) rotate(180deg) scale(0.9); 
    opacity: 0.5; 
  }
  75% { 
    transform: translateY(-30px) translateX(-30px) rotate(270deg) scale(1.1); 
    opacity: 0.7; 
  }
}

/* 弹跳浮动动画 */
@keyframes float-bounce {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) scale(1); 
    opacity: 0.8; 
  }
  20% { 
    transform: translateY(-45px) translateX(5px) scale(1.1); 
    opacity: 0.9; 
  }
  40% { 
    transform: translateY(-20px) translateX(-5px) scale(0.9); 
    opacity: 0.6; 
  }
  60% { 
    transform: translateY(-35px) translateX(10px) scale(1.2); 
    opacity: 0.8; 
  }
  80% { 
    transform: translateY(-10px) translateX(-8px) scale(0.8); 
    opacity: 0.7; 
  }
}

/* 波浪浮动动画 */
@keyframes float-wave {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.9; 
  }
  12.5% { 
    transform: translateY(-15px) translateX(10px) rotate(45deg); 
    opacity: 0.8; 
  }
  25% { 
    transform: translateY(-25px) translateX(20px) rotate(90deg); 
    opacity: 0.7; 
  }
  37.5% { 
    transform: translateY(-15px) translateX(10px) rotate(135deg); 
    opacity: 0.8; 
  }
  50% { 
    transform: translateY(0px) translateX(0px) rotate(180deg); 
    opacity: 0.6; 
  }
  62.5% { 
    transform: translateY(-15px) translateX(-10px) rotate(225deg); 
    opacity: 0.8; 
  }
  75% { 
    transform: translateY(-25px) translateX(-20px) rotate(270deg); 
    opacity: 0.7; 
  }
  87.5% { 
    transform: translateY(-15px) translateX(-10px) rotate(315deg); 
    opacity: 0.8; 
  }
}

/* 浮动元素 */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  animation: floating 4s ease-in-out infinite;
}

/* 全页面浮动表情符号样式 */
.floating-elements-global {
  position: absolute;
  width: 100%;
  height: 500vh;
  pointer-events: none;
  z-index: 1;
}

/* 分布在整个页面的浮动表情符号 */
.floating-global-1 { left: 8%; top: 5%; animation-delay: 0s; }
.floating-global-2 { right: 12%; top: 15%; animation-delay: 1s; }
.floating-global-3 { left: 15%; top: 35%; animation-delay: 2s; }
.floating-global-4 { right: 18%; top: 45%; animation-delay: 3s; }
.floating-global-5 { left: 25%; top: 65%; animation-delay: 4s; }
.floating-global-6 { right: 8%; top: 75%; animation-delay: 5s; }
.floating-global-7 { left: 18%; top: 85%; animation-delay: 6s; }
.floating-global-8 { right: 25%; top: 95%; animation-delay: 7s; }

/* 保留原有的局部浮动元素样式以防兼容性问题 */
.floating-1 { left: 10%; top: 20%; animation-delay: 0s; }
.floating-2 { right: 15%; top: 30%; animation-delay: 1s; }
.floating-3 { left: 20%; bottom: 25%; animation-delay: 2s; }
.floating-4 { right: 25%; bottom: 20%; animation-delay: 3s; }

@keyframes floating {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 文字打字机效果 */
.typewriter {
  overflow: hidden;
  border-right: 3px solid #ff6b6b;
  white-space: nowrap;
  animation: typing 4s steps(40, end), blink-caret 0.75s step-end infinite;
}

.typewriter-active {
  animation: typing 4s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #ff6b6b; }
}

/* 滑入文字效果 */
.slide-in-text {
  opacity: 0;
  transform: translateX(-50px);
  animation: slide-in 1s ease-out 2s forwards;
}

@keyframes slide-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 从右侧滑入 */
.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  animation: slide-in-right 0.8s ease-out forwards;
}

@keyframes slide-in-right {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 波纹效果 */
.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple-effect:hover::before {
  width: 300px;
  height: 300px;
}

/* 脉冲按钮 */
.pulse-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
}

/* 弹跳动画 */
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* 英雄区样式 */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: url('../assets/images/home1.jpg') center center/cover no-repeat;
  background-attachment: fixed;
}





.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), 
              linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2));
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  opacity: 0;
  animation: fadeInUp 1s ease-out 3s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.scroll-arrow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-arrow-container:hover {
  transform: translateY(-5px);
}

.scroll-arrow-container:active {
  transform: translateY(-2px) scale(0.95);
}

.scroll-arrow-container:active .scroll-arrow-circle {
  transform: scale(0.9);
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
}

.scroll-arrow-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.scroll-arrow-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(78, 205, 196, 0.9));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: pulse-glow 2s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
}

.scroll-arrow-circle::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s linear infinite;
}

.scroll-arrow-circle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 60%);
  pointer-events: none;
}

.scroll-arrow-chevron {
  width: 16px;
  height: 16px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
  margin-top: -5px;
  animation: bounce-arrow 2s ease-in-out infinite;
}

.scroll-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.8;
  transition: all 0.3s ease;
  transform: translateY(0);
  letter-spacing: 0.5px;
}

.scroll-arrow-container:hover .scroll-text {
  opacity: 1;
  transform: translateY(-2px);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.scroll-animation-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.scroll-animation-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: line-flow 2s ease-in-out infinite;
}

/* 箭头动画效果 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 8px 40px rgba(255, 107, 107, 0.5);
    transform: scale(1.05);
  }
}

@keyframes bounce-arrow {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
  }
  50% {
    transform: rotate(45deg) translateY(3px);
  }
}

@keyframes shimmer {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

@keyframes line-flow {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* 功能展示样式 */
.features {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.feature-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #2d2d2d;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.showcase-image {
  text-align: center;
}

.showcase-img {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.showcase-img:hover {
  transform: scale(1.05);
}

.showcase-content {
  padding: 2rem;
}

.showcase-content h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.showcase-content p {
  font-size: 1.1rem;
  color: #b0b0b0;
  line-height: 1.8;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* 社区展示样式 */
.community-showcase {
  background: #2d2d2d;
}

.community-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.community-image {
  margin-bottom: 2rem;
  text-align: center;
}

.community-img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.community-img:hover {
  transform: translateY(-5px);
}

.community-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 20px;
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 500;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #3a3a3a;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon-small {
  font-size: 2rem;
  min-width: 60px;
}

.feature-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.feature-content p {
  color: #b0b0b0;
  margin: 0;
}

/* 市场展示样式 */
.marketplace-showcase {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.marketplace-showcase .section-title,
.marketplace-showcase .section-subtitle {
  color: white;
}

.marketplace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.marketplace-img {
  width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.marketplace-img:hover {
  transform: scale(1.02);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.feature-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-box:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.feature-box .feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-box h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-box p {
  font-size: 0.9rem;
  opacity: 0.8;
}

.preview-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.preview-image {
  text-align: center;
  margin-bottom: 1.5rem;
}

.preview-stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.stat {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 关于我们样式 */
.about-us {
  background: #2d2d2d;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.about-text p {
  color: #b0b0b0;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.about-text ul {
  list-style: none;
  padding: 0;
}

.about-text li {
  padding: 0.5rem 0;
  color: #b0b0b0;
}

.vision-card {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 2rem;
}

.vision-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.vision-card h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.value-item {
  background: #3a3a3a;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.value-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.value-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.value-text {
  font-weight: 600;
  color: #e0e0e0;
}

/* 滚动驱动动画布局样式 */
.scroll-animated-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 60px 0;
  background: #1a1a1a;
  position: relative;
  overflow: visible;
  margin: 20px 0;
  border-top: 2px solid #2d2d2d;
  border-bottom: 2px solid #2d2d2d;
  z-index: 0;
}

.scroll-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.scroll-image-wrapper {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  z-index: 1;
  transition: all 0.8s ease;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.scroll-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.8);
  transition: all 0.8s ease;
}

.scroll-content-wrapper {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s ease;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(15px);
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.scroll-text-content {
  max-width: 400px;
  text-align: left;
  padding: 3rem 2rem;
  position: relative;
  z-index: 10;
}

.scroll-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.scroll-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin: 0;
}

/* 左侧动画配置 */
.scroll-animated-section[data-direction="left"] .scroll-content-wrapper {
  right: 0;
  left: auto;
}

/* 右侧动画配置 */
.scroll-animated-section[data-direction="right"] .scroll-content-wrapper {
  left: 0;
  right: auto;
  clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
}

/* 动画激活状态 */
.scroll-animated-section.animate-left .scroll-image-wrapper {
  width: 55% !important;
  left: 5%;
  clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
  transform: translateX(0);
}

.scroll-animated-section.animate-right .scroll-image-wrapper {
  width: 55% !important;
  right: 5%;
  left: auto;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
  transform: translateX(0);
}

.scroll-animated-section.animate-left .scroll-content-wrapper {
  opacity: 1 !important;
  transform: translateX(0);
}

.scroll-animated-section.animate-right .scroll-content-wrapper {
  opacity: 1 !important;
  transform: translateX(0);
}

/* 初始状态 - 确保文字内容是隐藏的 */
.scroll-animated-section .scroll-content-wrapper {
  opacity: 0;
  transform: translateX(60px);
}

.scroll-animated-section[data-direction="right"] .scroll-content-wrapper {
  transform: translateX(-60px);
}

/* 特色亮点 */
.feature-highlights {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateX(10px);
  background: #3a3a3a;
}

.highlight-icon {
  font-size: 2rem;
  min-width: 60px;
  text-align: center;
}

.highlight-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e0e0;
}

/* 统计数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: white;
  font-weight: 500;
}

/* 市场功能列表 */
.marketplace-features {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #2d2d2d;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.feature-row:hover {
  transform: translateX(10px);
  background: #3a3a3a;
}

.feature-icon {
  font-size: 2.5rem;
  min-width: 70px;
  text-align: center;
}

.feature-info h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
}

.feature-info p {
  color: #b0b0b0;
  font-size: 1rem;
  line-height: 1.6;
}

/* 使命要点 */
.mission-points {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.point-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #3a3a3a;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.point-item:hover {
  transform: translateX(10px);
  background: #4a4a4a;
}

.point-icon {
  font-size: 2rem;
  min-width: 60px;
  text-align: center;
}

.point-text {
  font-size: 1.1rem;
  color: #e0e0e0;
  font-weight: 500;
}

/* 滚动动画效果 */
.scroll-section {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-out;
}

.scroll-section.fade-in {
  animation: scrollFadeIn 0.8s ease-out forwards;
}

@keyframes scrollFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图片视差效果 */
.large-image {
  transition: transform 0.3s ease-out;
}

.scroll-section:hover .large-image {
  transform: scale(1.1);
}

/* 内容动画 */
.content-wrapper > * {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-out;
}

.content-wrapper.animate > * {
  opacity: 0;
  transform: translateY(30px);
  animation: contentFadeIn 0.8s ease-out forwards;
}

.content-wrapper.animate > *:nth-child(1) { animation-delay: 0.1s; }
.content-wrapper.animate > *:nth-child(2) { animation-delay: 0.2s; }
.content-wrapper.animate > *:nth-child(3) { animation-delay: 0.3s; }

@keyframes contentFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 联系我们样式 */
.contact {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.contact {
  position: relative;
  z-index: 5;
}

.contact-content {
  text-align: center;
}

.contact-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 3D卡片悬停效果 */
.card-hover-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.card-hover-3d:hover {
  transform: rotateY(10deg) rotateX(10deg) scale(1.05);
}

/* 图片动画效果 */
.zoom-on-hover {
  transition: transform 0.3s ease;
}

.zoom-on-hover:hover {
  transform: scale(1.1);
}

.tilt-on-hover {
  transition: transform 0.3s ease;
}

.tilt-on-hover:hover {
  transform: rotate(3deg) scale(1.05);
}

.scale-on-hover {
  transition: transform 0.3s ease;
}

.scale-on-hover:hover {
  transform: scale(1.08);
}

/* 悬停上浮效果 */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* 发光效果 */
.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

/* 旋转图标 */
.rotating-icon {
  transition: transform 0.3s ease;
}

.rotating-icon:hover {
  transform: rotate(360deg);
}

/* 摇摆图标 */
.wiggle-icon {
  transition: transform 0.3s ease;
}

.wiggle-icon:hover {
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}

/* 弹跳图标 */
.bounce-icon {
  transition: transform 0.3s ease;
}

.bounce-icon:hover {
  animation: bounce-icon 0.6s ease-in-out;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 滑入项目效果 */
.slide-in-item {
  opacity: 0;
  transform: translateX(-30px);
  animation: slide-in-item 0.6s ease-out forwards;
}

.slide-in-item:nth-child(1) { animation-delay: 0.1s; }
.slide-in-item:nth-child(2) { animation-delay: 0.2s; }
.slide-in-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes slide-in-item {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 浮动卡片 */
.floating-card {
  animation: float-card 4s ease-in-out infinite;
}

@keyframes float-card {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 数字计数器样式 */
.counter {
  font-weight: 700;
  color: #ff6b6b;
  transition: color 0.3s ease;
}

/* 更多动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out forwards;
}

/* 背景渐变动画 */
.gradient-bg {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-size: 400% 400%;
  animation: gradient-animate 4s ease infinite;
}

@keyframes gradient-animate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 加载动画 */
.loading-spinner {
  border: 4px solid #2d2d2d;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  /* 移动端动画优化 */
  .particle {
    display: none;
  }
  
  .floating-element {
    display: none;
  }
  
  .typewriter {
    border-right: none;
    white-space: normal;
  }
  
  .card-hover-3d:hover {
    transform: scale(1.02);
  }
  
  /* 美化箭头响应式 */
  .hero-scroll-indicator {
    bottom: 2rem;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  .scroll-arrow-circle {
    width: 50px;
    height: 50px;
  }
  
  .scroll-arrow-chevron {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }
  
  .scroll-text {
    font-size: 0.8rem;
  }
  
  .scroll-animation-line {
    height: 20px;
    margin-top: 0.8rem;
  }
  
  /* 滚动动画布局响应式 */
  .scroll-animated-section {
    min-height: auto;
    padding: 2rem 0;
    margin: 10px 0;
    background: #1a1a1a;
  }
  
  .scroll-container {
    flex-direction: column;
    height: auto;
  }
  
  .scroll-image-wrapper {
    position: relative !important;
    width: 90% !important;
    height: 300px;
    left: 5% !important;
    right: auto !important;
    top: 0 !important;
    clip-path: none !important;
  }
  
  .scroll-content-wrapper {
    position: relative !important;
    width: 100% !important;
    height: auto;
    opacity: 1 !important;
    left: 0 !important;
    right: auto !important;
    background: #1a1a1a;
    backdrop-filter: none;
  }
  
  .scroll-text-content {
    max-width: 100%;
    padding: 1rem;
  }
  
  .scroll-title {
    font-size: 2rem;
  }
  
  .scroll-description {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.5rem 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .feature-highlights,
  .marketplace-features,
  .mission-points {
    gap: 1rem;
  }
  
  .highlight-item,
  .feature-row,
  .point-item {
    padding: 1rem;
  }
  
  .highlight-item:hover,
  .feature-row:hover,
  .point-item:hover {
    transform: translateX(0);
  }
  
  .feature-icon {
    font-size: 2rem;
    min-width: 60px;
  }
  
  .feature-info h4 {
    font-size: 1.1rem;
  }
  
  .feature-info p {
    font-size: 0.9rem;
  }
}

/* 平板设备适配 */
@media (max-width: 1024px) and (min-width: 769px) {
  .scroll-text-content {
    padding: 3rem;
  }
  
  .scroll-title {
    font-size: 2.5rem;
  }
  
  .scroll-description {
    font-size: 1.2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  .stat-item {
    padding: 1.5rem 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

/* 超大屏幕适配 */
@media (min-width: 1440px) {
  .scroll-text-content {
    padding: 6rem;
    max-width: 600px;
  }
  
  .scroll-title {
    font-size: 3.5rem;
  }
  
  .scroll-description {
    font-size: 1.4rem;
  }
}
</style> 
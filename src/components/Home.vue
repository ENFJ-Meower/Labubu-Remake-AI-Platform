<template>
  <div class="home">
    <!-- 英雄区 -->
    <section class="hero">
      <div class="hero-bg">
        <img src="../assets/images/bg.png" alt="Labubu Background" class="hero-bg-img" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text animate-fade-in-up">
            <h1 class="hero-title">
              Welcome to <span class="text-primary">Labubu AI</span>
              <br />Creative Platform
            </h1>
            <p class="hero-subtitle">
              Unleash your creativity with AI-powered tools and join our vibrant community
              of artists, creators, and Labubu enthusiasts.
            </p>
            <div class="hero-buttons">
              <router-link to="/ai-agent" class="btn btn-primary btn-large">
                Start Creating
              </router-link>
              <router-link to="/community" class="btn btn-secondary btn-large">
                Join Community
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <div class="scroll-arrow animate-pulse">
          <span>↓</span>
        </div>
      </div>
    </section>

    <!-- AI Agent 功能展示 -->
    <section class="section features" id="ai-agent">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">AI Agent Studio</h2>
        <p class="section-subtitle animate-fade-in-up">
          Build and customize your own AI agents with our intuitive platform
        </p>
        
        <!-- 添加展示图片 -->
        <div class="feature-showcase animate-fade-in-up">
          <div class="showcase-image">
            <img src="../assets/images/home1.jpg" alt="AI Agent Studio" class="showcase-img" />
          </div>
          <div class="showcase-content">
            <h3>Create Amazing AI Artworks</h3>
            <p>Experience the power of AI-assisted creativity with our advanced tools and templates.</p>
          </div>
        </div>
        
        <div class="grid grid-3">
          <div class="card animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="feature-icon">🤖</div>
            <h3 class="card-title">Custom AI Agents</h3>
            <p class="card-text">
              Create personalized AI agents tailored to your specific needs and creative vision.
            </p>
          </div>
          <div class="card animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="feature-icon">🎨</div>
            <h3 class="card-title">Creative Tools</h3>
            <p class="card-text">
              Access powerful AI-driven creative tools for art generation, design, and content creation.
            </p>
          </div>
          <div class="card animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="feature-icon">📚</div>
            <h3 class="card-title">Tutorial Library</h3>
            <p class="card-text">
              Learn from comprehensive tutorials and prompt templates to enhance your skills.
            </p>
          </div>
        </div>
        <div class="text-center mt-5">
          <router-link to="/ai-agent" class="btn btn-primary">
            Explore AI Agent Studio
          </router-link>
        </div>
      </div>
    </section>

    <!-- 社区展示 -->
    <section class="section community-showcase" id="community">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">Interactive Community</h2>
        <p class="section-subtitle animate-fade-in-up">
          Connect with fellow creators and share your amazing works
        </p>
        <div class="community-grid">
          <div class="community-stats animate-fade-in-left">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Active Creators</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Artworks Created</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1K+</div>
              <div class="stat-label">Daily Interactions</div>
            </div>
          </div>
          <div class="community-features animate-fade-in-right">
            <!-- 添加社区展示图片 -->
            <div class="community-image">
              <img src="../assets/images/home2.png" alt="Community Showcase" class="community-img" />
            </div>
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon-small">💬</div>
                <div class="feature-content">
                  <h4>Real-time Chat</h4>
                  <p>Engage in real-time conversations with other creators</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon-small">🏆</div>
                <div class="feature-content">
                  <h4>Contests & Challenges</h4>
                  <p>Participate in exciting creative contests and challenges</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon-small">📢</div>
                <div class="feature-content">
                  <h4>Showcase Gallery</h4>
                  <p>Display your creations in our beautiful gallery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-5">
          <router-link to="/community" class="btn btn-primary">
            Join Our Community
          </router-link>
        </div>
      </div>
    </section>

    <!-- 二手平台展示 -->
    <section class="section marketplace-showcase" id="marketplace">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">Creative Marketplace</h2>
        <p class="section-subtitle animate-fade-in-up">
          Discover, buy, and sell unique Labubu creations and customizations
        </p>
        <div class="marketplace-grid">
          <div class="marketplace-features animate-fade-in-left">
            <div class="feature-grid">
              <div class="feature-box">
                <div class="feature-icon">🛍️</div>
                <h4>Buy & Sell</h4>
                <p>Trade custom Labubu items and accessories</p>
              </div>
              <div class="feature-box">
                <div class="feature-icon">🎭</div>
                <h4>Custom Designs</h4>
                <p>Commission unique designs from talented artists</p>
              </div>
              <div class="feature-box">
                <div class="feature-icon">🔧</div>
                <h4>DIY Tutorials</h4>
                <p>Learn to customize your own Labubu collectibles</p>
              </div>
              <div class="feature-box">
                <div class="feature-icon">⭐</div>
                <h4>Quality Assured</h4>
                <p>All items verified for authenticity and quality</p>
              </div>
            </div>
          </div>
          <div class="marketplace-preview animate-fade-in-right">
            <div class="preview-card">
              <div class="preview-image">
                <img src="../assets/images/home3.png" alt="Marketplace Preview" class="marketplace-img" />
              </div>
              <div class="preview-content">
                <h4>Marketplace Preview</h4>
                <p>Browse through hundreds of unique Labubu items and find your perfect match</p>
                <div class="preview-stats">
                  <span class="stat">500+ Items</span>
                  <span class="stat">100+ Sellers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-5">
          <router-link to="/marketplace" class="btn btn-primary">
            Browse Marketplace
          </router-link>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section class="section about-us" id="about">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">About Labubu AI Platform</h2>
        <p class="section-subtitle animate-fade-in-up">
          Bridging creativity and technology to empower the next generation of digital artists
        </p>
        <div class="about-content">
          <div class="about-text animate-fade-in-left">
            <h3>Our Mission</h3>
            <p>
              We believe that everyone deserves access to powerful creative tools. Our platform
              combines cutting-edge AI technology with the beloved Labubu IP to create an
              ecosystem where creativity knows no bounds.
            </p>
            <h3>What We Offer</h3>
            <ul class="feature-list">
              <li>✨ Advanced AI-powered creative tools</li>
              <li>🎨 Comprehensive tutorial library</li>
              <li>👥 Vibrant community of creators</li>
              <li>🛍️ Secure marketplace for trading</li>
              <li>🔧 DIY customization guides</li>
            </ul>
          </div>
          <div class="about-visual animate-fade-in-right">
            <div class="vision-card">
              <div class="vision-icon">🚀</div>
              <h4>Our Vision</h4>
              <p>
                To become the world's leading platform for AI-assisted creative expression,
                fostering innovation and community in the digital art space.
              </p>
            </div>
            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon">💡</div>
                <div class="value-text">Innovation</div>
              </div>
              <div class="value-item">
                <div class="value-icon">🤝</div>
                <div class="value-text">Community</div>
              </div>
              <div class="value-item">
                <div class="value-icon">🎯</div>
                <div class="value-text">Quality</div>
              </div>
              <div class="value-item">
                <div class="value-icon">🌟</div>
                <div class="value-text">Creativity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="section contact">
      <div class="container">
        <div class="contact-content">
          <h2 class="section-title animate-fade-in-up">Get in Touch</h2>
          <p class="section-subtitle animate-fade-in-up">
            Ready to start your creative journey? Join thousands of creators today!
          </p>
          <div class="contact-buttons animate-fade-in-up">
            <router-link to="/ai-agent" class="btn btn-primary btn-large">
              Start Creating Now
            </router-link>
            <a href="mailto:hello@labubu-ai.com" class="btn btn-secondary btn-large">
              Contact Support
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
    }
  }
}
</script>

<style scoped>
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
  z-index: -2;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 107, 107, 0.3), rgba(78, 205, 196, 0.3));
  z-index: -1;
}

.hero-content {
  position: relative;
  z-index: 1;
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
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.scroll-arrow {
  font-size: 2rem;
  cursor: pointer;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* 联系我们样式 */
.contact {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
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
  
  .feature-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .showcase-img {
    max-width: 350px;
  }
  
  .showcase-content {
    padding: 1rem;
  }
  
  .showcase-content h3 {
    font-size: 1.5rem;
  }
  
  .community-grid,
  .marketplace-grid,
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .community-img {
    max-width: 300px;
  }
  
  .marketplace-img {
    max-width: 100%;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style> 
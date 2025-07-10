<template>
  <div class="marketplace">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title animate-fade-in-up">Creative Marketplace</h1>
        <p class="page-subtitle animate-fade-in-up">
          Discover, buy, and sell unique Labubu creations and customizations
        </p>
      </div>
    </section>

    <!-- 市场统计 -->
    <section class="section stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card animate-fade-in-up">
            <div class="stat-number">2K+</div>
            <div class="stat-label">Items Available</div>
          </div>
          <div class="stat-card animate-fade-in-up">
            <div class="stat-number">500+</div>
            <div class="stat-label">Active Sellers</div>
          </div>
          <div class="stat-card animate-fade-in-up">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Happy Buyers</div>
          </div>
          <div class="stat-card animate-fade-in-up">
            <div class="stat-number">95%</div>
            <div class="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 搜索和筛选 -->
    <section class="section search-filter">
      <div class="container">
        <div class="search-bar">
          <input type="text" placeholder="Search for items, creators, or categories..." />
          <button class="search-btn">🔍</button>
        </div>
        <div class="filter-tabs">
          <button class="filter-tab active">All Items</button>
          <button class="filter-tab">Figurines</button>
          <button class="filter-tab">Accessories</button>
          <button class="filter-tab">Custom Art</button>
          <button class="filter-tab">DIY Kits</button>
        </div>
      </div>
    </section>

    <!-- 特色商品 -->
    <section class="section featured">
      <div class="container">
        <h2 class="section-title">Featured Items</h2>
        <div class="featured-grid">
          <div class="featured-item animate-fade-in-up">
            <div class="item-image">
              <div class="placeholder-image">🧸</div>
              <div class="item-badge">Featured</div>
            </div>
            <div class="item-info">
              <h3>Custom Labubu Rainbow Edition</h3>
              <p class="item-creator">by @CreativeDesigner</p>
              <div class="item-price">$89.99</div>
              <div class="item-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(24 reviews)</span>
              </div>
            </div>
          </div>
          <div class="featured-item animate-fade-in-up">
            <div class="item-image">
              <div class="placeholder-image">🎨</div>
              <div class="item-badge">New</div>
            </div>
            <div class="item-info">
              <h3>Labubu Art Print Collection</h3>
              <p class="item-creator">by @ArtMaster</p>
              <div class="item-price">$24.99</div>
              <div class="item-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(18 reviews)</span>
              </div>
            </div>
          </div>
          <div class="featured-item animate-fade-in-up">
            <div class="item-image">
              <div class="placeholder-image">🎭</div>
              <div class="item-badge">Limited</div>
            </div>
            <div class="item-info">
              <h3>Vintage Labubu Restoration</h3>
              <p class="item-creator">by @RetroCollector</p>
              <div class="item-price">$156.00</div>
              <div class="item-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(31 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 商品网格 -->
    <section class="section products">
      <div class="container">
        <div class="products-layout">
          <div class="products-sidebar">
            <div class="sidebar-section">
              <h3>Categories</h3>
              <div class="category-list">
                <div class="category-item active">
                  <span>All Items</span>
                  <span class="count">2,543</span>
                </div>
                <div class="category-item">
                  <span>Figurines</span>
                  <span class="count">856</span>
                </div>
                <div class="category-item">
                  <span>Accessories</span>
                  <span class="count">432</span>
                </div>
                <div class="category-item">
                  <span>Custom Art</span>
                  <span class="count">678</span>
                </div>
                <div class="category-item">
                  <span>DIY Kits</span>
                  <span class="count">234</span>
                </div>
              </div>
            </div>
            <div class="sidebar-section">
              <h3>Price Range</h3>
              <div class="price-range">
                <input type="range" min="0" max="500" value="250" />
                <div class="range-labels">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>
            <div class="sidebar-section">
              <h3>Condition</h3>
              <div class="condition-list">
                <label class="checkbox-item">
                  <input type="checkbox" />
                  <span>New</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" />
                  <span>Like New</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" />
                  <span>Good</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" />
                  <span>Fair</span>
                </label>
              </div>
            </div>
          </div>
          <div class="products-main">
            <div class="products-header">
              <div class="results-count">Showing 1-12 of 2,543 items</div>
              <div class="sort-options">
                <select>
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                  <option>Best Rating</option>
                </select>
              </div>
            </div>
            <div class="products-grid">
              <div class="product-card" v-for="i in 12" :key="i">
                <div class="product-image">
                  <div class="placeholder-image">🎁</div>
                </div>
                <div class="product-info">
                  <h4>Custom Labubu Design {{i}}</h4>
                  <p class="product-creator">by @Creator{{i}}</p>
                  <div class="product-price">${{(Math.random() * 100 + 20).toFixed(2)}}</div>
                  <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-count">({{Math.floor(Math.random() * 50 + 5)}})</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pagination">
              <button class="page-btn">Previous</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 卖家工具 -->
    <section class="section seller-tools">
      <div class="container">
        <h2 class="section-title">Become a Seller</h2>
        <p class="section-subtitle">Join our marketplace and start selling your creations</p>
        <div class="tools-grid">
          <div class="tool-card animate-fade-in-up">
            <div class="tool-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track your sales, views, and earnings with detailed analytics</p>
          </div>
          <div class="tool-card animate-fade-in-up">
            <div class="tool-icon">🛡️</div>
            <h3>Secure Payments</h3>
            <p>Safe and secure payment processing for all transactions</p>
          </div>
          <div class="tool-card animate-fade-in-up">
            <div class="tool-icon">🎯</div>
            <h3>Marketing Tools</h3>
            <p>Promote your items with our built-in marketing features</p>
          </div>
          <div class="tool-card animate-fade-in-up">
            <div class="tool-icon">🤝</div>
            <h3>Community Support</h3>
            <p>Get help from our seller community and support team</p>
          </div>
        </div>
        <div class="text-center mt-5">
          <button class="btn btn-primary btn-large">Start Selling Today</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Marketplace',
  mounted() {
    this.initializeAnimations()
  },
  methods: {
    initializeAnimations() {
      const elements = document.querySelectorAll('.animate-fade-in-up')
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-fade-in-up')
        }, index * 100)
      })
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.page-header {
  background: linear-gradient(180deg, #ff6b6b 0%, #4ecdc4 100%);
  color: white;
  padding: 8rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8));
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 统计样式 */
.stats {
  background: #2d2d2d;
  padding: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 搜索和筛选样式 */
.search-filter {
  background: #3a3a3a;
  padding: 3rem 0;
}

.search-bar {
  display: flex;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  overflow: hidden;
}

.search-bar input {
  flex: 1;
  padding: 1.2rem 2rem;
  border: none;
  font-size: 1rem;
  outline: none;
  background: #2d2d2d;
  color: #e0e0e0;
}

.search-bar input::placeholder {
  color: #b0b0b0;
}

.search-btn {
  padding: 1.2rem 2rem;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  min-width: 60px;
}

.search-btn:hover {
  transform: scale(1.05);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 1rem 2rem;
  background: #2d2d2d;
  border: 2px solid #404040;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #e0e0e0;
}

.filter-tab.active {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

.filter-tab:hover {
  border-color: #ff6b6b;
  transform: translateY(-2px);
}

/* 特色商品样式 */
.featured {
  background: #2d2d2d;
  padding: 4rem 0;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.featured-item {
  background: #3a3a3a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.featured-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.item-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.item-image .placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}

.item-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

.item-info {
  padding: 2rem;
}

.item-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.item-creator {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.item-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
}

.rating-count {
  color: #666;
  font-size: 0.9rem;
}

/* 商品布局样式 */
.products {
  background: #3a3a3a;
  padding: 4rem 0;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
}

.products-sidebar {
  background: #2d2d2d;
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #4a4a4a;
}

.category-item.active {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
}

.count {
  font-size: 0.9rem;
  opacity: 0.8;
}

.price-range {
  margin-bottom: 1rem;
}

.price-range input[type="range"] {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
  margin-bottom: 1rem;
}

.price-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  cursor: pointer;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.condition-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #ff6b6b;
}

.products-main {
  background: #2d2d2d;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #404040;
}

.results-count {
  color: #b0b0b0;
  font-size: 0.9rem;
}

.sort-options select {
  padding: 0.5rem 1rem;
  border: 1px solid #555;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  background: #3a3a3a;
  color: #e0e0e0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: #3a3a3a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image .placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
}

.product-info {
  padding: 1.5rem;
}

.product-info h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.product-creator {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.8rem 1.2rem;
  background: #2d2d2d;
  border: 2px solid #404040;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #e0e0e0;
}

.page-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.page-btn.active {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 卖家工具样式 */
.seller-tools {
  background: #2d2d2d;
  padding: 4rem 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tool-card {
  background: #3a3a3a;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 1px solid #404040;
}

.tool-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.tool-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.tool-card p {
  color: #b0b0b0;
  line-height: 1.6;
}

/* 按钮样式 */
.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.btn-large {
  padding: 1.5rem 3rem;
  font-size: 1.1rem;
}

.text-center {
  text-align: center;
}

.mt-5 {
  margin-top: 3rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.2rem;
  }
  
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .products-sidebar {
    order: 2;
  }
  
  .search-bar {
    flex-direction: column;
    border-radius: 15px;
  }
  
  .search-bar input {
    border-radius: 15px 15px 0 0;
  }
  
  .search-btn {
    border-radius: 0 0 15px 15px;
  }
  
  .products-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
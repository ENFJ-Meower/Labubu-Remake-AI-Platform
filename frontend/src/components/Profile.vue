<template>
  <div class="profile">
    <!-- 个人信息头部 -->
    <section class="profile-header">
      <div class="container">
        <div class="profile-banner">
          <div class="banner-bg"></div>
          <div class="profile-info">
            <div class="avatar-section">
              <div class="user-avatar">
                <img :src="currentUserAvatar" :alt="userInfo.username" />
              </div>
            </div>
            <div class="user-details">
              <h1 class="username">{{ userInfo.username || 'User' }}</h1>
              <p class="user-email">{{ userInfo.email || 'user@example.com' }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.aiAgents }}</span>
                  <span class="stat-label">{{ $t('profile.aiAgents', 'AI Agents') }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.communityPosts }}</span>
                  <span class="stat-label">{{ $t('profile.posts', 'Posts') }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.transactions }}</span>
                  <span class="stat-label">{{ $t('profile.transactions', 'Transactions') }}</span>
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn btn-primary" @click="editProfile">
                <i class="btn-icon">✏️</i>
                {{ $t('profile.editProfile', 'Edit Profile') }}
              </button>
              <button class="btn btn-secondary" @click="shareProfile">
                <i class="btn-icon">🔗</i>
                {{ $t('profile.share', 'Share') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 导航标签 -->
    <section class="profile-nav">
      <div class="container">
        <div class="nav-tabs">
          <button 
            v-for="tab in profileTabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-text">{{ tab.title }}</span>
            <span class="tab-count">{{ getTabCount(tab.id) }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- AI Agent 管理 -->
          <div v-if="activeTab === 'aiagents'" class="tab-content">
            <div class="section-header">
              <h2>{{ $t('profile.myAIAgents', 'My AI Agents') }}</h2>
              <button class="btn btn-primary" @click="createNewAgent">
                <i class="btn-icon">➕</i>
                {{ $t('profile.createAgent', 'Create New Agent') }}
              </button>
            </div>
            <div class="agents-grid">
              <div v-for="agent in userAIAgents" :key="agent.id" class="agent-card">
                <div class="agent-header">
                  <div class="agent-avatar">
                    <img :src="agent.avatar || '/src/assets/images/logo.png'" :alt="agent.name" />
                  </div>
                  <div class="agent-info">
                    <h3 class="agent-name">{{ agent.name }}</h3>
                    <p class="agent-description">{{ agent.description }}</p>
                    <div class="agent-meta">
                      <span class="agent-status" :class="agent.status">{{ $t(`profile.status.${agent.status}`, agent.status) }}</span>
                      <span class="agent-created">{{ formatDate(agent.createdAt) }}</span>
                    </div>
                  </div>
                </div>
                <div class="agent-stats">
                  <div class="stat">
                    <span class="stat-label">{{ $t('profile.runs', 'Runs') }}</span>
                    <span class="stat-value">{{ agent.runs || 0 }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">{{ $t('profile.success', 'Success Rate') }}</span>
                    <span class="stat-value">{{ agent.successRate || 0 }}%</span>
                  </div>
                </div>
                <div class="agent-actions">
                  <button class="action-btn" @click="editAgent(agent)">
                    <i class="action-icon">✏️</i>
                    {{ $t('profile.edit', 'Edit') }}
                  </button>
                  <button class="action-btn" @click="runAgent(agent)">
                    <i class="action-icon">▶️</i>
                    {{ $t('profile.run', 'Run') }}
                  </button>
                  <button class="action-btn danger" @click="deleteAgent(agent)">
                    <i class="action-icon">🗑️</i>
                    {{ $t('profile.delete', 'Delete') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 社区内容 -->
          <div v-else-if="activeTab === 'community'" class="tab-content">
            <div class="section-header">
              <h2>{{ $t('profile.myCommunityContent', 'My Community Content') }}</h2>
              <button class="btn btn-primary" @click="createNewPost">
                <i class="btn-icon">✍️</i>
                {{ $t('profile.createPost', 'Create Post') }}
              </button>
            </div>
            <div class="posts-list">
              <div v-for="post in userPosts" :key="post.id" class="post-card">
                <div class="post-header">
                  <div class="post-type">
                    <span class="type-icon">{{ getPostTypeIcon(post.type) }}</span>
                    <span class="type-text">{{ $t(`profile.postType.${post.type}`, post.type) }}</span>
                  </div>
                  <div class="post-date">{{ formatDate(post.createdAt) }}</div>
                </div>
                <div class="post-content">
                  <h3 class="post-title">{{ post.title || post.content.substring(0, 50) + '...' }}</h3>
                  <p class="post-excerpt">{{ post.content.substring(0, 150) }}{{ post.content.length > 150 ? '...' : '' }}</p>
                  <div v-if="post.images && post.images.length" class="post-images">
                    <img v-for="(image, index) in post.images.slice(0, 3)" :key="index" :src="image" :alt="`Post image ${index + 1}`" />
                    <div v-if="post.images.length > 3" class="more-images">+{{ post.images.length - 3 }}</div>
                  </div>
                </div>
                <div class="post-stats">
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-count">{{ post.likes || 0 }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💬</span>
                    <span class="stat-count">{{ post.comments || 0 }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-count">{{ post.views || 0 }}</span>
                  </div>
                </div>
                <div class="post-actions">
                  <button class="action-btn" @click="viewPost(post)">
                    <i class="action-icon">👁️</i>
                    {{ $t('profile.view', 'View') }}
                  </button>
                  <button class="action-btn" @click="editPost(post)">
                    <i class="action-icon">✏️</i>
                    {{ $t('profile.edit', 'Edit') }}
                  </button>
                  <button class="action-btn danger" @click="deletePost(post)">
                    <i class="action-icon">🗑️</i>
                    {{ $t('profile.delete', 'Delete') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 交易记录 -->
          <div v-else-if="activeTab === 'marketplace'" class="tab-content">
            <div class="marketplace-tabs">
              <button 
                v-for="marketTab in marketplaceTabs" 
                :key="marketTab.id"
                class="market-tab"
                :class="{ active: activeMarketTab === marketTab.id }"
                @click="setActiveMarketTab(marketTab.id)"
              >
                <span class="tab-icon">{{ marketTab.icon }}</span>
                <span class="tab-text">{{ marketTab.title }}</span>
              </button>
            </div>

            <!-- 我的商品 -->
            <div v-if="activeMarketTab === 'selling'" class="market-content">
              <div class="section-header">
                <h3>{{ $t('profile.myProducts', 'My Products') }}</h3>
                <button class="btn btn-primary" @click="addNewProduct">
                  <i class="btn-icon">➕</i>
                  {{ $t('profile.addProduct', 'Add Product') }}
                </button>
              </div>
              <div class="products-grid">
                <div v-for="product in userProducts" :key="product.id" class="product-card">
                  <div class="product-image">
                    <img :src="product.image || '/src/assets/images/logo.png'" :alt="product.name" />
                    <div class="product-status" :class="product.status">{{ $t(`profile.productStatus.${product.status}`, product.status) }}</div>
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ product.name }}</h4>
                    <p class="product-price">${{ product.price }}</p>
                    <div class="product-stats">
                      <span class="stat-item">👁️ {{ product.views || 0 }}</span>
                      <span class="stat-item">❤️ {{ product.likes || 0 }}</span>
                      <span class="stat-item">🛒 {{ product.sales || 0 }}</span>
                    </div>
                  </div>
                  <div class="product-actions">
                    <button class="action-btn" @click="editProduct(product)">{{ $t('profile.edit', 'Edit') }}</button>
                    <button class="action-btn" @click="viewProductStats(product)">{{ $t('profile.stats', 'Stats') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 购买记录 -->
            <div v-else-if="activeMarketTab === 'purchases'" class="market-content">
              <div class="section-header">
                <h3>{{ $t('profile.purchaseHistory', 'Purchase History') }}</h3>
              </div>
              <div class="transactions-list">
                <div v-for="purchase in userPurchases" :key="purchase.id" class="transaction-card">
                  <div class="transaction-image">
                    <img :src="purchase.productImage" :alt="purchase.productName" />
                  </div>
                  <div class="transaction-info">
                    <h4 class="transaction-title">{{ purchase.productName }}</h4>
                    <p class="transaction-seller">{{ $t('profile.seller', 'Seller') }}: {{ purchase.sellerName }}</p>
                    <p class="transaction-date">{{ formatDate(purchase.purchaseDate) }}</p>
                  </div>
                  <div class="transaction-details">
                    <div class="transaction-price">${{ purchase.price }}</div>
                    <div class="transaction-status" :class="purchase.status">{{ $t(`profile.transactionStatus.${purchase.status}`, purchase.status) }}</div>
                  </div>
                  <div class="transaction-actions">
                    <button class="action-btn" @click="viewOrder(purchase)">{{ $t('profile.viewOrder', 'View Order') }}</button>
                    <button v-if="purchase.status === 'delivered'" class="action-btn" @click="leaveReview(purchase)">{{ $t('profile.review', 'Review') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 销售记录 -->
            <div v-else-if="activeMarketTab === 'sales'" class="market-content">
              <div class="section-header">
                <h3>{{ $t('profile.salesHistory', 'Sales History') }}</h3>
              </div>
              <div class="transactions-list">
                <div v-for="sale in userSales" :key="sale.id" class="transaction-card">
                  <div class="transaction-image">
                    <img :src="sale.productImage" :alt="sale.productName" />
                  </div>
                  <div class="transaction-info">
                    <h4 class="transaction-title">{{ sale.productName }}</h4>
                    <p class="transaction-buyer">{{ $t('profile.buyer', 'Buyer') }}: {{ sale.buyerName }}</p>
                    <p class="transaction-date">{{ formatDate(sale.saleDate) }}</p>
                  </div>
                  <div class="transaction-details">
                    <div class="transaction-price">${{ sale.price }}</div>
                    <div class="transaction-status" :class="sale.status">{{ $t(`profile.transactionStatus.${sale.status}`, sale.status) }}</div>
                  </div>
                  <div class="transaction-actions">
                    <button class="action-btn" @click="viewSaleOrder(sale)">{{ $t('profile.viewOrder', 'View Order') }}</button>
                    <button v-if="sale.status === 'pending'" class="action-btn" @click="processOrder(sale)">{{ $t('profile.process', 'Process') }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 设置 -->
          <div v-else-if="activeTab === 'settings'" class="tab-content">
            <div class="settings-sections">
              <div class="settings-section">
                <h3>{{ $t('profile.accountSettings', 'Account Settings') }}</h3>
                <div class="settings-form">
                  <div class="form-group">
                    <label>{{ $t('profile.username', 'Username') }}</label>
                    <input type="text" v-model="userInfo.username" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('profile.email', 'Email') }}</label>
                    <input type="email" v-model="userInfo.email" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('profile.bio', 'Bio') }}</label>
                    <textarea v-model="userInfo.bio" rows="3" :placeholder="$t('profile.bioPlaceholder', 'Tell us about yourself...')"></textarea>
                  </div>
                </div>
              </div>
              
              <div class="settings-section">
                <h3>{{ $t('profile.privacy', 'Privacy Settings') }}</h3>
                <div class="settings-form">
                  <div class="setting-item">
                    <label class="switch">
                      <input type="checkbox" v-model="settings.publicProfile" />
                      <span class="slider"></span>
                    </label>
                    <div class="setting-info">
                      <span class="setting-title">{{ $t('profile.publicProfile', 'Public Profile') }}</span>
                      <span class="setting-desc">{{ $t('profile.publicProfileDesc', 'Allow others to view your profile') }}</span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label class="switch">
                      <input type="checkbox" v-model="settings.showActivity" />
                      <span class="slider"></span>
                    </label>
                    <div class="setting-info">
                      <span class="setting-title">{{ $t('profile.showActivity', 'Show Activity') }}</span>
                      <span class="setting-desc">{{ $t('profile.showActivityDesc', 'Display your recent activities') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <h3>{{ $t('profile.notifications', 'Notification Settings') }}</h3>
                <div class="settings-form">
                  <div class="setting-item">
                    <label class="switch">
                      <input type="checkbox" v-model="settings.emailNotifications" />
                      <span class="slider"></span>
                    </label>
                    <div class="setting-info">
                      <span class="setting-title">{{ $t('profile.emailNotifications', 'Email Notifications') }}</span>
                      <span class="setting-desc">{{ $t('profile.emailNotificationsDesc', 'Receive notifications via email') }}</span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label class="switch">
                      <input type="checkbox" v-model="settings.marketingEmails" />
                      <span class="slider"></span>
                    </label>
                    <div class="setting-info">
                      <span class="setting-title">{{ $t('profile.marketingEmails', 'Marketing Emails') }}</span>
                      <span class="setting-desc">{{ $t('profile.marketingEmailsDesc', 'Receive promotional content') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-actions">
                <button class="btn btn-primary" @click="saveSettings">
                  <i class="btn-icon">💾</i>
                  {{ $t('profile.saveChanges', 'Save Changes') }}
                </button>
                <button class="btn btn-danger" @click="deleteAccount">
                  <i class="btn-icon">⚠️</i>
                  {{ $t('profile.deleteAccount', 'Delete Account') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      activeTab: 'aiagents',
      activeMarketTab: 'selling',
      userInfo: {
        userId: '', // 新增：用户ID
        username: '',
        email: '',
        tenant_id: '', // 新增：租户ID
        avatar: '',
        bio: ''
      },
      userStats: {
        aiAgents: 0,
        communityPosts: 0,
        transactions: 0
      },
      settings: {
        publicProfile: true,
        showActivity: true,
        emailNotifications: true,
        marketingEmails: false
      },
      profileTabs: [
        { id: 'aiagents', icon: '🤖', title: this.$t('profile.aiAgents', 'AI Agents') },
        { id: 'community', icon: '👥', title: this.$t('profile.community', 'Community') },
        { id: 'marketplace', icon: '🛍️', title: this.$t('profile.marketplace', 'Marketplace') },
        { id: 'settings', icon: '⚙️', title: this.$t('profile.settings', 'Settings') }
      ],
      marketplaceTabs: [
        { id: 'selling', icon: '🏪', title: this.$t('profile.mySelling', 'My Products') },
        { id: 'purchases', icon: '🛒', title: this.$t('profile.purchases', 'Purchases') },
        { id: 'sales', icon: '💰', title: this.$t('profile.sales', 'Sales') }
      ],
      userAIAgents: [],
      userPosts: [],
      userProducts: [],
      userPurchases: [],
      userSales: []
    }
  },
  async mounted() {
    this.loadUserInfo()
    this.loadUserData()
  },
  computed: {
    currentUserAvatar() {
      // 根据用户名实时计算头像
      try {
        const { getUserAvatar } = require('@/utils/avatarManager.js')
        return getUserAvatar(this.userInfo.username)
      } catch (error) {
        console.error('获取用户头像失败:', error)
        return '/src/assets/images/avatar1.jpg'
      }
    }
  },
  methods: {
    loadUserInfo() {
      try {
        // 导入auth工具函数获取完整用户信息
        const { getCompleteUserInfo } = require('@/utils/auth.js')
        const completeUserInfo = getCompleteUserInfo()
        
        if (completeUserInfo) {
          this.userInfo = { ...this.userInfo, ...completeUserInfo }
          console.log('加载完整用户信息:', this.userInfo)
        } else {
          // 降级方案：从localStorage获取基础信息
          const userInfoStr = localStorage.getItem('userInfo')
          if (userInfoStr) {
            this.userInfo = { ...this.userInfo, ...JSON.parse(userInfoStr) }
          }
        }
      } catch (error) {
        console.error('Failed to load user info:', error)
        // 降级方案：从localStorage获取基础信息
        try {
          const userInfoStr = localStorage.getItem('userInfo')
          if (userInfoStr) {
            this.userInfo = { ...this.userInfo, ...JSON.parse(userInfoStr) }
          }
        } catch (fallbackError) {
          console.error('降级方案也失败:', fallbackError)
        }
      }
    },
    
    loadUserData() {
      // 模拟加载用户数据
      this.loadAIAgents()
      this.loadCommunityPosts()
      this.loadMarketplaceData()
      this.updateUserStats()
    },
    
    loadAIAgents() {
      // 模拟AI Agent数据
      this.userAIAgents = [
        {
          id: 1,
          name: 'Creative Assistant',
          description: 'Helps with creative writing and brainstorming',
          status: 'active',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          runs: 156,
          successRate: 94
        },
        {
          id: 2,
          name: 'Data Analyzer',
          description: 'Analyzes and visualizes data patterns',
          status: 'draft',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          runs: 23,
          successRate: 87
        }
      ]
    },
    
    loadCommunityPosts() {
      // 模拟社区帖子数据
      this.userPosts = [
        {
          id: 1,
          type: 'artwork',
          title: 'AI Generated Landscape',
          content: 'Just created this amazing landscape using our AI tools. The detail and color combination turned out better than expected!',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          likes: 45,
          comments: 12,
          views: 234,
          images: ['/src/assets/images/home1.jpg']
        },
        {
          id: 2,
          type: 'tutorial',
          title: 'How to Create Better AI Prompts',
          content: 'Here are some tips I learned for creating more effective AI prompts that generate better results...',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          likes: 78,
          comments: 23,
          views: 456
        }
      ]
    },
    
    loadMarketplaceData() {
      // 模拟市场数据
      this.userProducts = [
        {
          id: 1,
          name: 'Custom Labubu Design #1',
          price: 29.99,
          status: 'active',
          views: 234,
          likes: 45,
          sales: 8,
          image: '/src/assets/images/logo.png'
        },
        {
          id: 2,
          name: 'AI Art Collection',
          price: 49.99,
          status: 'sold_out',
          views: 567,
          likes: 89,
          sales: 25,
          image: '/src/assets/images/logo.png'
        }
      ]
      
      this.userPurchases = [
        {
          id: 1,
          productName: 'Premium AI Template Pack',
          sellerName: 'CreativeStudio',
          price: 19.99,
          purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'delivered',
          productImage: '/src/assets/images/logo.png'
        }
      ]
      
      this.userSales = [
        {
          id: 1,
          productName: 'Custom Labubu Design #1',
          buyerName: 'ArtCollector',
          price: 29.99,
          saleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'completed',
          productImage: '/src/assets/images/logo.png'
        }
      ]
    },
    
    updateUserStats() {
      this.userStats = {
        aiAgents: this.userAIAgents.length,
        communityPosts: this.userPosts.length,
        transactions: this.userPurchases.length + this.userSales.length
      }
    },
    
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    
    setActiveMarketTab(tabId) {
      this.activeMarketTab = tabId
    },
    
    getTabCount(tabId) {
      switch (tabId) {
        case 'aiagents': return this.userAIAgents.length
        case 'community': return this.userPosts.length
        case 'marketplace': return this.userProducts.length + this.userPurchases.length + this.userSales.length
        case 'settings': return ''
        default: return 0
      }
    },
    
    getPostTypeIcon(type) {
      const icons = {
        artwork: '🎨',
        tutorial: '📚',
        discussion: '💬',
        showcase: '✨'
      }
      return icons[type] || '📄'
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    
    formatTime(date) {
      const now = new Date()
      const diff = now - date
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      const weeks = Math.floor(diff / (86400000 * 7))
      const months = Math.floor(diff / (86400000 * 30))
      const years = Math.floor(diff / (86400000 * 365))
      
      // 刚刚（小于1分钟）
      if (seconds < 60) return this.$t('community.timeAgo.justNow', '刚刚')
      
      // 分钟前
      if (minutes < 60) {
        if (minutes === 1) {
          return this.$t('community.timeAgo.minuteAgo', '1分钟前')
        }
        return this.$t('community.timeAgo.minutesAgo', '{count}分钟前').replace('{count}', minutes)
      }
      
      // 小时前
      if (hours < 24) {
        if (hours === 1) {
          return this.$t('community.timeAgo.hourAgo', '1小时前')
        }
        return this.$t('community.timeAgo.hoursAgo', '{count}小时前').replace('{count}', hours)
      }
      
      // 天前
      if (days < 7) {
        if (days === 1) {
          return this.$t('community.timeAgo.dayAgo', '1天前')
        }
        return this.$t('community.timeAgo.daysAgo', '{count}天前').replace('{count}', days)
      }
      
      // 周前
      if (weeks < 4) {
        if (weeks === 1) {
          return this.$t('community.timeAgo.weekAgo', '1周前')
        }
        return this.$t('community.timeAgo.weeksAgo', '{count}周前').replace('{count}', weeks)
      }
      
      // 月前
      if (months < 12) {
        if (months === 1) {
          return this.$t('community.timeAgo.monthAgo', '1个月前')
        }
        return this.$t('community.timeAgo.monthsAgo', '{count}个月前').replace('{count}', months)
      }
      
      // 年前
      if (years === 1) {
        return this.$t('community.timeAgo.yearAgo', '1年前')
      }
      return this.$t('community.timeAgo.yearsAgo', '{count}年前').replace('{count}', years)
    },
    
    // 用户操作方法
    
    editProfile() {
      alert(this.$t('profile.profileEditMsg', '个人资料编辑功能即将推出'))
    },
    
    shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: `${this.userInfo.username}'s Profile`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert(this.$t('profile.linkCopied', '链接已复制到剪贴板'))
      }
    },
    
    // AI Agent 操作
    createNewAgent() {
      this.$router.push('/frontend/ai-agent')
    },
    
    editAgent(agent) {
      alert(`编辑 AI Agent: ${agent.name}`)
    },
    
    runAgent(agent) {
      alert(`运行 AI Agent: ${agent.name}`)
    },
    
    deleteAgent(agent) {
      if (confirm(`确定要删除 "${agent.name}" 吗？`)) {
        this.userAIAgents = this.userAIAgents.filter(a => a.id !== agent.id)
        this.updateUserStats()
      }
    },
    
    // 社区操作
    createNewPost() {
      this.$router.push('/frontend/community')
    },
    
    viewPost(post) {
      alert(`查看帖子: ${post.title || post.content.substring(0, 30)}`)
    },
    
    editPost(post) {
      alert(`编辑帖子: ${post.title || post.content.substring(0, 30)}`)
    },
    
    deletePost(post) {
      if (confirm('确定要删除这个帖子吗？')) {
        this.userPosts = this.userPosts.filter(p => p.id !== post.id)
        this.updateUserStats()
      }
    },
    
    // 市场操作
    addNewProduct() {
      this.$router.push('/frontend/marketplace')
    },
    
    editProduct(product) {
      alert(`编辑商品: ${product.name}`)
    },
    
    viewProductStats(product) {
      alert(`查看商品统计: ${product.name}`)
    },
    
    viewOrder(purchase) {
      alert(`查看订单: ${purchase.productName}`)
    },
    
    leaveReview(purchase) {
      alert(`评价商品: ${purchase.productName}`)
    },
    
    viewSaleOrder(sale) {
      alert(`查看销售订单: ${sale.productName}`)
    },
    
    processOrder(sale) {
      alert(`处理订单: ${sale.productName}`)
    },
    
    // 设置操作
    saveSettings() {
      // 保存设置到后端
      alert(this.$t('profile.settingsSaved', '设置已保存'))
    },
    
    deleteAccount() {
      if (confirm(this.$t('profile.deleteAccountConfirm', '确定要删除账户吗？此操作不可恢复！'))) {
        alert(this.$t('profile.deleteAccountMsg', '账户删除功能需要联系客服'))
      }
    }
  }
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: #1a1a1a;
  color: #e0e0e0;
}

/* 个人信息头部 */
.profile-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.profile-banner {
  position: relative;
  z-index: 2;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;
  color: white;
}

.avatar-section {
  position: relative;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-email {
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
  opacity: 0.9;
}

.user-id {
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.7;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 导航标签 */
.profile-nav {
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
  position: sticky;
  top: 80px;
  z-index: 100;
}

.nav-tabs {
  display: flex;
  gap: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.nav-tab:hover {
  background: #3a3a3a;
  color: #e0e0e0;
}

.nav-tab.active {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
  background: #3a3a3a;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-text {
  font-weight: 500;
}

.tab-count {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* 主要内容 */
.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2,
.section-header h3 {
  margin: 0;
  color: #e0e0e0;
}

/* AI Agents 网格 */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.agent-card {
  background: #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: #ff6b6b;
}

.agent-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.agent-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agent-info {
  flex: 1;
}

.agent-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e0e0;
}

.agent-description {
  margin: 0 0 0.5rem 0;
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.agent-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.agent-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.agent-status.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.agent-status.draft {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.agent-created {
  font-size: 0.8rem;
  color: #888;
}

.agent-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #3a3a3a;
  border-radius: 8px;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #b0b0b0;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e0e0;
}

.agent-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #404040;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #4a4a4a;
  transform: translateY(-1px);
}

.action-btn.danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-btn.danger:hover {
  background: rgba(244, 67, 54, 0.3);
}

/* 社区帖子列表 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

.post-card:hover {
  border-color: #ff6b6b;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-icon {
  font-size: 1.2rem;
}

.type-text {
  font-size: 0.9rem;
  color: #b0b0b0;
  text-transform: capitalize;
}

.post-date {
  font-size: 0.8rem;
  color: #888;
}

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #e0e0e0;
}

.post-excerpt {
  margin: 0 0 1rem 0;
  color: #b0b0b0;
  line-height: 1.5;
}

.post-images {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-images img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #404040;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #b0b0b0;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.post-stats .stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

/* 市场标签 */
.marketplace-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #404040;
}

.market-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.market-tab:hover {
  color: #e0e0e0;
}

.market-tab.active {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: #ff6b6b;
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.product-status.active {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.product-status.sold_out {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.product-price {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff6b6b;
}

.product-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  font-size: 0.8rem;
  color: #b0b0b0;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #404040;
}

/* 交易列表 */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

.transaction-card:hover {
  border-color: #ff6b6b;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.transaction-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.transaction-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.transaction-seller,
.transaction-buyer,
.transaction-date {
  margin: 0;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.transaction-details {
  text-align: center;
  margin-right: 1rem;
}

.transaction-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
}

.transaction-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.transaction-status.completed,
.transaction-status.delivered {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.transaction-status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.transaction-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 设置页面 */
.settings-sections {
  max-width: 800px;
}

.settings-section {
  background: #2d2d2d;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #404040;
}

.settings-section h3 {
  margin: 0 0 1.5rem 0;
  color: #e0e0e0;
  font-size: 1.3rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #e0e0e0;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 8px;
  background: #3a3a3a;
  color: #e0e0e0;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #404040;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-title {
  display: block;
  font-weight: 500;
  color: #e0e0e0;
  margin-bottom: 0.25rem;
}

.setting-desc {
  display: block;
  font-size: 0.9rem;
  color: #b0b0b0;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #404040;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #ff6b6b;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  padding: 2rem 0;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
  background: #404040;
  color: #e0e0e0;
  border: 1px solid #555;
}

.btn-secondary:hover {
  background: #4a4a4a;
  border-color: #ff6b6b;
}

.btn-danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.btn-danger:hover {
  background: rgba(244, 67, 54, 0.3);
  border-color: #f44336;
}

.btn-icon {
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .nav-tabs {
    overflow-x: auto;
    gap: 0;
  }
  
  .nav-tab {
    min-width: 120px;
    flex-shrink: 0;
  }
  
  .agents-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .transaction-card {
    flex-direction: column;
    text-align: center;
  }
  
  .transaction-details {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .transaction-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .settings-actions {
    flex-direction: column;
  }
}
</style> 
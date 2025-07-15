<template>
  <div class="community">
    <!-- 页面头部 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('community.title', 'Creative Community') }}</h1>
          <p class="hero-subtitle">{{ $t('community.subtitle', 'Share your creativity with the world') }}</p>
          <div class="community-stats">
            <div class="stat-item">
              <span class="stat-number">15K+</span>
              <span class="stat-label">Active Creators</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50K+</span>
              <span class="stat-label">Artworks</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2K+</span>
              <span class="stat-label">Daily Posts</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 社区导航 -->
    <section class="community-nav">
      <div class="container">
        <div class="nav-tabs">
          <button 
            v-for="tab in navTabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-text">{{ tab.title }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- 左侧内容 -->
          <div class="content-main">


            <!-- 动态内容切换 -->
            <div class="tab-content">
              <!-- 动态信息流 - 瀑布流布局 -->
              <div v-if="activeTab === 'feed'" class="feed-section">
                <div class="masonry-grid">
                  <!-- 发布创意卡片 -->
                  <div class="masonry-item creative-card">
                    <div class="card-header">
                      <span class="card-icon">✨</span>
                      <h3>Share Your Creation</h3>
                    </div>
                    <div class="card-content">
                      <textarea 
                        v-model="newPost"
                        placeholder="What's on your creative mind?"
                        rows="3"
                      ></textarea>
                      <div class="quick-actions">
                        <button class="quick-btn">📷</button>
                        <button class="quick-btn">🎨</button>
                        <button class="quick-btn">🎵</button>
                        <button class="share-btn" @click="publishPost">Share</button>
                      </div>
                    </div>
                  </div>

                  <!-- 热门话题卡片 -->
                  <div class="masonry-item trending-card">
                    <div class="card-header">
                      <span class="card-icon">🔥</span>
                      <h3>Trending Topics</h3>
                    </div>
                    <div class="card-content">
                      <div class="trending-list">
                        <div v-for="(tag, index) in trendingTags" :key="tag" class="trending-item">
                          <span class="trend-rank">#{{ index + 1 }}</span>
                          <span class="trend-tag">{{ tag }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 社区动态卡片 -->
                  <div v-for="post in communityPosts" :key="post.id" class="masonry-item post-card" :class="{ 'has-image': post.image }">
                    <div class="card-header">
                      <div class="user-info">
                        <div class="user-avatar">
                          <img :src="post.userAvatar" :alt="post.userName" />
                        </div>
                        <div class="user-details">
                          <h4 class="user-name">{{ post.userName }}</h4>
                          <span class="post-time">{{ post.timestamp }}</span>
                        </div>
                      </div>
                      <button class="post-menu">⋯</button>
                    </div>
                    
                    <div class="card-content">
                      <p class="post-text">{{ post.content }}</p>
                      <div v-if="post.image" class="post-media">
                        <img :src="post.image" :alt="post.imageAlt" />
                      </div>
                    </div>
                    
                    <div class="card-actions">
                      <button class="action-btn" :class="{ liked: post.liked }" @click="toggleLike(post)">
                        <span class="action-icon">❤️</span>
                        <span class="action-count">{{ post.likes }}</span>
                      </button>
                      <button class="action-btn" @click="toggleComments(post)">
                        <span class="action-icon">💬</span>
                        <span class="action-count">{{ post.comments.length }}</span>
                      </button>
                      <button class="action-btn">
                        <span class="action-icon">🔄</span>
                        <span class="action-count">{{ post.shares }}</span>
                      </button>
                    </div>

                    <!-- 评论区 -->
                    <div v-if="post.showComments" class="comments-section">
                      <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                        <div class="comment-avatar">
                          <img :src="comment.userAvatar" :alt="comment.userName" />
                        </div>
                        <div class="comment-content">
                          <span class="comment-user">{{ comment.userName }}</span>
                          <p class="comment-text">{{ comment.text }}</p>
                          <span class="comment-time">{{ comment.timestamp }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 推荐用户卡片 -->
                  <div class="masonry-item users-card">
                    <div class="card-header">
                      <span class="card-icon">👥</span>
                      <h3>Suggested Creators</h3>
                    </div>
                    <div class="card-content">
                      <div v-for="user in suggestedUsers" :key="user.id" class="user-suggestion">
                        <div class="user-avatar">
                          <img :src="user.avatar" :alt="user.name" />
                        </div>
                        <div class="user-info">
                          <h4 class="user-name">{{ user.name }}</h4>
                          <p class="user-specialty">{{ user.specialty }}</p>
                        </div>
                        <button class="follow-btn">Follow</button>
                      </div>
                    </div>
                  </div>

                  <!-- 最新活动卡片 -->
                  <div class="masonry-item events-card">
                    <div class="card-header">
                      <span class="card-icon">📅</span>
                      <h3>Upcoming Events</h3>
                    </div>
                    <div class="card-content">
                      <div v-for="event in recentEvents" :key="event.id" class="event-preview">
                        <div class="event-date">{{ event.date }}</div>
                        <div class="event-name">{{ event.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 艺术画廊 - 瀑布流布局 -->
              <div v-else-if="activeTab === 'gallery'" class="gallery-section">
                <div class="masonry-grid">
                  <div v-for="artwork in artworks" :key="artwork.id" class="masonry-item artwork-card" :class="getArtworkClass(artwork)">
                    <div class="artwork-image">
                      <img :src="artwork.image" :alt="artwork.title" />
                      <div class="artwork-overlay">
                        <button class="overlay-btn">👁️ View</button>
                        <button class="overlay-btn">❤️ {{ artwork.likes }}</button>
                      </div>
                    </div>
                    <div class="artwork-info">
                      <h3 class="artwork-title">{{ artwork.title }}</h3>
                      <p class="artwork-artist">by {{ artwork.artist }}</p>
                      <div class="artwork-stats">
                        <span class="stat-item">❤️ {{ artwork.likes }}</span>
                        <span class="stat-item">👁️ {{ artwork.views || Math.floor(artwork.likes * 5) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 活动页面 -->
              <div v-else-if="activeTab === 'events'" class="events-section">
                <div class="events-grid">
                  <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
                    <div class="event-date">
                      <span class="event-day">{{ event.day }}</span>
                      <span class="event-month">{{ event.month }}</span>
                    </div>
                    <div class="event-content">
                      <h3 class="event-title">{{ event.title }}</h3>
                      <p class="event-description">{{ event.description }}</p>
                      <div class="event-meta">
                        <span class="event-time">🕐 {{ event.time }}</span>
                        <span class="event-participants">👥 {{ event.participants }}</span>
                      </div>
                      <button class="event-join-btn">Join Event</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 群组页面 -->
              <div v-else-if="activeTab === 'groups'" class="groups-section">
                <div class="groups-grid">
                  <div v-for="group in communityGroups" :key="group.id" class="group-card">
                    <div class="group-header">
                      <div class="group-icon">{{ group.icon }}</div>
                      <div class="group-info">
                        <h3 class="group-name">{{ group.name }}</h3>
                        <p class="group-members">{{ group.members }} members</p>
                      </div>
                    </div>
                    <p class="group-description">{{ group.description }}</p>
                    <div class="group-actions">
                      <button class="group-btn" :class="{ joined: group.joined }" @click="toggleGroupJoin(group)">
                        {{ group.joined ? 'Joined' : 'Join Group' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="sidebar">
            <!-- 热门标签 -->
            <div class="sidebar-widget">
              <h3 class="widget-title">Trending Topics</h3>
              <div class="trending-tags">
                <span v-for="tag in trendingTags" :key="tag" class="trending-tag">#{{ tag }}</span>
              </div>
            </div>

            <!-- 推荐用户 -->
            <div class="sidebar-widget">
              <h3 class="widget-title">Suggested Creators</h3>
              <div class="suggested-users">
                <div v-for="user in suggestedUsers" :key="user.id" class="suggested-user">
                  <div class="user-avatar">
                    <img :src="user.avatar" :alt="user.name" />
                  </div>
                  <div class="user-info">
                    <h4 class="user-name">{{ user.name }}</h4>
                    <p class="user-specialty">{{ user.specialty }}</p>
                  </div>
                  <button class="follow-btn">Follow</button>
                </div>
              </div>
            </div>

            <!-- 最新活动 -->
            <div class="sidebar-widget">
              <h3 class="widget-title">Latest Events</h3>
              <div class="latest-events">
                <div v-for="event in recentEvents" :key="event.id" class="event-item">
                  <div class="event-info">
                    <h4 class="event-name">{{ event.name }}</h4>
                    <p class="event-date">{{ event.date }}</p>
                  </div>
                </div>
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
  name: 'Community',
  data() {
    return {
      activeTab: 'feed',
      newPost: '',
      navTabs: [
        { id: 'feed', icon: '🏠', title: 'Feed' },
        { id: 'gallery', icon: '🎨', title: 'Gallery' },
        { id: 'events', icon: '📅', title: 'Events' },
        { id: 'groups', icon: '👥', title: 'Groups' }
      ],
      communityPosts: [
        {
          id: 1,
          userName: 'CreativeArtist',
          userAvatar: '/src/assets/images/logo.png',
          timestamp: '2 hours ago',
          content: 'Just finished my latest Labubu AI artwork! The new generation tools are incredible 🎨',
          image: '/src/assets/images/home1.jpg',
          imageAlt: 'AI Generated Artwork',
          likes: 24,
          liked: false,
          shares: 5,
          showComments: false,
          comments: [
            {
              id: 1,
              userName: 'ArtLover',
              userAvatar: '/src/assets/images/logo.png',
              text: 'Amazing work! The colors are so vibrant.',
              timestamp: '1 hour ago'
            }
          ]
        },
        {
          id: 2,
          userName: 'AIEnthusiast',
          userAvatar: '/src/assets/images/logo.png',
          timestamp: '4 hours ago',
          content: 'New tutorial series on advanced AI agent configuration is now live! Check it out 📚',
          image: null,
          likes: 42,
          liked: true,
          shares: 12,
          showComments: false,
          comments: []
        },
        {
          id: 3,
          userName: 'DesignMaster',
          userAvatar: '/src/assets/images/logo.png',
          timestamp: '6 hours ago',
          content: 'Hosting a live design session tomorrow at 3 PM! Join us for some creative inspiration ✨',
          image: '/src/assets/images/home2.png',
          imageAlt: 'Design Session Preview',
          likes: 67,
          liked: false,
          shares: 18,
          showComments: false,
          comments: []
        }
      ],
      artworks: [
        { id: 1, title: 'Digital Dreams', artist: 'CreativeAI', image: '/src/assets/images/home1.jpg', likes: 156, size: 'large' },
        { id: 2, title: 'Neon Fantasy', artist: 'PixelMaster', image: '/src/assets/images/home2.png', likes: 203, size: 'medium' },
        { id: 3, title: 'Abstract Reality', artist: 'VisionArt', image: '/src/assets/images/home3.png', likes: 89, size: 'small' },
        { id: 4, title: 'FutureScape', artist: 'TechArtist', image: '/src/assets/images/home1.jpg', likes: 134, size: 'medium' },
        { id: 5, title: 'Color Burst', artist: 'ChromaCreator', image: '/src/assets/images/home2.png', likes: 267, size: 'large' },
        { id: 6, title: 'Digital Nature', artist: 'EcoDesigner', image: '/src/assets/images/home3.png', likes: 98, size: 'small' },
        { id: 7, title: 'Cyber Punk', artist: 'NeonArtist', image: '/src/assets/images/home1.jpg', likes: 178, size: 'medium' },
        { id: 8, title: 'Minimal Flow', artist: 'SimpleDesign', image: '/src/assets/images/home2.png', likes: 145, size: 'small' },
        { id: 9, title: 'Ocean Waves', artist: 'WaterPainter', image: '/src/assets/images/home3.png', likes: 189, size: 'large' }
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'AI Art Workshop',
          description: 'Learn advanced techniques for creating stunning AI artwork',
          day: '15',
          month: 'DEC',
          time: '2:00 PM',
          participants: '50 slots'
        },
        {
          id: 2,
          title: 'Creative Challenge',
          description: 'Monthly theme-based creative challenge with amazing prizes',
          day: '20',
          month: 'DEC',
          time: 'All Day',
          participants: 'Open'
        },
        {
          id: 3,
          title: 'Community Meetup',
          description: 'Virtual meetup for creators to share ideas and network',
          day: '25',
          month: 'DEC',
          time: '7:00 PM',
          participants: 'Unlimited'
        }
      ],
      communityGroups: [
        {
          id: 1,
          name: 'AI Artists',
          icon: '🎨',
          members: '1.2K',
          description: 'A community for artists exploring AI-generated art',
          joined: false
        },
        {
          id: 2,
          name: 'Labubu Fans',
          icon: '🌟',
          members: '2.5K',
          description: 'Everything about Labubu culture and creativity',
          joined: true
        },
        {
          id: 3,
          name: 'Creative Challenges',
          icon: '🔥',
          members: '800',
          description: 'Weekly challenges to boost your creativity',
          joined: false
        },
        {
          id: 4,
          name: 'Tech Innovators',
          icon: '⚡',
          members: '950',
          description: 'Discussing the latest in AI and creative technology',
          joined: false
        }
      ],
      trendingTags: ['LabubuArt', 'AIGenerated', 'Creative', 'Digital', 'Innovation', 'Community'],
      suggestedUsers: [
        { id: 1, name: 'ArtMaster', specialty: 'Digital Artist', avatar: '/src/assets/images/logo.png' },
        { id: 2, name: 'CreativeMind', specialty: 'AI Specialist', avatar: '/src/assets/images/logo.png' },
        { id: 3, name: 'DesignGuru', specialty: 'UX Designer', avatar: '/src/assets/images/logo.png' }
      ],
      recentEvents: [
        { id: 1, name: 'Digital Art Expo', date: 'Dec 18' },
        { id: 2, name: 'AI Workshop', date: 'Dec 22' },
        { id: 3, name: 'Creator Meetup', date: 'Dec 28' }
      ]
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    publishPost() {
      if (!this.newPost.trim()) return
      
      const newPost = {
        id: Date.now(),
        userName: 'You',
        userAvatar: '/src/assets/images/logo.png',
        timestamp: 'Just now',
        content: this.newPost,
        image: null,
        likes: 0,
        liked: false,
        shares: 0,
        showComments: false,
        comments: []
      }
      
      this.communityPosts.unshift(newPost)
      this.newPost = ''
    },
    toggleLike(post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    },
    toggleComments(post) {
      post.showComments = !post.showComments
    },
    addComment(post, event) {
      const commentText = event.target.value.trim()
      if (!commentText) return
      
      const newComment = {
        id: Date.now(),
        userName: 'You',
        userAvatar: '/src/assets/images/logo.png',
        text: commentText,
        timestamp: 'Just now'
      }
      
      post.comments.push(newComment)
      event.target.value = ''
    },
    toggleGroupJoin(group) {
      group.joined = !group.joined
      const memberCount = parseInt(group.members.replace('K', '000').replace('.', ''))
      group.members = group.joined 
        ? `${((memberCount + 1) / 1000).toFixed(1)}K`
        : `${((memberCount - 1) / 1000).toFixed(1)}K`
    },
    getArtworkClass(artwork) {
      return `size-${artwork.size}`
    }
  }
}
</script>

<style scoped>
.community {
  min-height: 100vh;
  background: #1a1a1a;
  color: #e0e0e0;
}

/* 英雄区样式 */
.hero-section {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  padding: 6rem 0 4rem;
  color: white;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.community-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 导航标签样式 */
.community-nav {
  background: #2d2d2d;
  padding: 0;
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

/* 主要内容布局 */
.main-content {
  padding: 2rem 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.content-main {
  background: transparent;
  border-radius: 12px;
  overflow: visible;
}

/* 瀑布流布局 */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.masonry-item {
  background: #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid #404040;
}

.masonry-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #404040;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  font-size: 1.2rem;
}

.card-content {
  padding: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #404040;
}

/* 创意发布卡片 */
.creative-card {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
}

.creative-card .card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.creative-card textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1rem;
}

.creative-card textarea::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.quick-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.share-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b6b;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  margin-left: auto;
  transition: all 0.3s ease;
}

.share-btn:hover {
  background: white;
  transform: translateY(-2px);
}

/* 热门话题卡片 */
.trending-card {
  background: #3a3a3a;
}

.trending-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.trend-rank {
  font-weight: 700;
  color: #ff6b6b;
  font-size: 1.1rem;
  min-width: 30px;
}

.trend-tag {
  color: #e0e0e0;
  font-weight: 500;
}

/* 用户头像通用样式 */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 动态卡片样式 */
.post-card {
  background: #3a3a3a;
  border: 1px solid #404040;
}

.post-card.has-image {
  grid-row: span 2;
}

.post-card .card-header {
  padding: 1rem;
  border-bottom: 1px solid #404040;
}

.post-card .user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.post-card .user-details h4 {
  margin: 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.post-time {
  font-size: 0.8rem;
  color: #b0b0b0;
}

.post-menu {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.post-menu:hover {
  background: #2d2d2d;
  color: #e0e0e0;
}

.post-card .card-content {
  padding: 1rem;
}

.post-text {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.post-media {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
}

.post-media img {
  width: 100%;
  height: auto;
  display: block;
}

.post-card .card-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #404040;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #2d2d2d;
  color: #e0e0e0;
}

.action-btn.liked {
  color: #ff6b6b;
}

/* 推荐用户卡片 */
.users-card {
  background: #3a3a3a;
}

.user-suggestion {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #404040;
}

.user-suggestion:last-child {
  border-bottom: none;
}

.user-suggestion .user-info {
  flex: 1;
}

.user-suggestion .user-name {
  margin: 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.user-suggestion .user-specialty {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.8rem;
}

.user-suggestion .follow-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.3rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.user-suggestion .follow-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

/* 活动预览卡片 */
.events-card {
  background: #3a3a3a;
}

.event-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #404040;
}

.event-preview:last-child {
  border-bottom: none;
}

.event-date {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.event-name {
  color: #e0e0e0;
  font-weight: 500;
  font-size: 0.9rem;
}

/* 评论样式 */
.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #404040;
}

.comment-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 600;
  color: #e0e0e0;
  margin-right: 0.5rem;
}

.comment-text {
  margin: 0.2rem 0;
  line-height: 1.4;
}

.comment-time {
  font-size: 0.8rem;
  color: #b0b0b0;
}

.comment-composer {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.comment-composer input {
  flex: 1;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #e0e0e0;
}

/* 画廊样式 - 瀑布流布局 */
.gallery-section .masonry-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.artwork-card {
  background: #3a3a3a;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 不同尺寸的艺术作品卡片 */
.artwork-card.size-small {
  grid-row: span 1;
}

.artwork-card.size-medium {
  grid-row: span 2;
}

.artwork-card.size-large {
  grid-row: span 3;
}

.artwork-image {
  position: relative;
  overflow: hidden;
}

.artwork-card.size-small .artwork-image {
  aspect-ratio: 1;
}

.artwork-card.size-medium .artwork-image {
  aspect-ratio: 3/4;
}

.artwork-card.size-large .artwork-image {
  aspect-ratio: 2/3;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.artwork-card:hover .artwork-image img {
  transform: scale(1.05);
}

.artwork-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.artwork-card:hover .artwork-overlay {
  opacity: 1;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.artwork-info {
  padding: 1rem;
}

.artwork-title {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 1rem;
}

.artwork-artist {
  margin: 0 0 0.8rem 0;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.artwork-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #b0b0b0;
  font-size: 0.8rem;
}

/* 活动样式 */
.events-grid {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.event-card {
  display: flex;
  background: #3a3a3a;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-right: 1.5rem;
  min-width: 80px;
}

.event-day {
  font-size: 1.5rem;
  font-weight: 700;
}

.event-month {
  font-size: 0.9rem;
}

.event-content {
  flex: 1;
}

.event-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #e0e0e0;
}

.event-description {
  margin: 0 0 1rem 0;
  color: #b0b0b0;
  line-height: 1.5;
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.event-join-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.event-join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

/* 群组样式 */
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.group-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.group-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 12px;
}

.group-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e0e0;
}

.group-members {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.group-description {
  margin: 0 0 1.5rem 0;
  color: #b0b0b0;
  line-height: 1.5;
}

.group-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.group-btn.joined {
  background: #4caf50;
}

.group-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-widget {
  background: #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #404040;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.widget-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.trending-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trending-tag {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trending-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

.suggested-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.suggested-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.suggested-user .user-avatar {
  width: 40px;
  height: 40px;
}

.suggested-user .user-info {
  flex: 1;
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.user-specialty {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.8rem;
}

.follow-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.3rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.follow-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

.latest-events {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.event-item {
  padding: 0.8rem;
  background: #3a3a3a;
  border-radius: 8px;
}

.event-name {
  margin: 0 0 0.3rem 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.event-date {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .gallery-section .masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .sidebar {
    order: -1;
  }
  
  .community-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .nav-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .nav-tab {
    white-space: nowrap;
    min-width: 120px;
  }
  
  .masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .gallery-section .masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .masonry-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-section .masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .community-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .stat-item {
    min-width: 100px;
  }
  
  .nav-tab {
    min-width: 100px;
    padding: 0.8rem 1rem;
  }
  
  .tab-icon {
    font-size: 1rem;
  }
  
  .tab-text {
    font-size: 0.9rem;
  }
}
</style> 
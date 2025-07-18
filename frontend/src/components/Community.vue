<template>
  <div class="community">
    <!-- 页面头部 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('community.heroTitle', '创意笔记社区') }}</h1>
          <p class="hero-subtitle">{{ $t('community.heroSubtitle', '分享你的创意想法，发现更多灵感') }}</p>
          <div class="community-stats">
            <div class="stat-item">
              <span class="stat-number">{{ noteStats.total }}+</span>
              <span class="stat-label">{{ $t('community.totalNotes', '总笔记数') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ noteStats.today }}+</span>
              <span class="stat-label">{{ $t('community.todayNotes', '今日新增') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ noteStats.tags }}+</span>
              <span class="stat-label">{{ $t('community.activeTags', '活跃标签') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 搜索和筛选区域 -->
    <section class="search-section">
      <div class="container">
        <div class="search-container">
          <!-- 搜索框 -->
          <div class="search-box">
            <i class="search-icon">🔍</i>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="$t('community.searchPlaceholder', '搜索笔记内容、标签或作者...')"
              @input="handleSearch"
              @keydown.enter="performSearch"
            />
            <button v-if="searchQuery" class="clear-search" @click="clearSearch">✕</button>
          </div>
          
          <!-- 筛选器 -->
          <div class="filter-tabs">
            <button 
              v-for="filter in filterOptions" 
              :key="filter.id"
              class="filter-tab"
              :class="{ active: activeFilter === filter.id }"
              @click="setActiveFilter(filter.id)"
            >
              <span class="filter-icon">{{ filter.icon }}</span>
              <span class="filter-text">{{ $t(`community.filter.${filter.id}`, filter.label) }}</span>
            </button>
          </div>
          
          <!-- 热门标签 -->
          <div class="trending-tags">
            <span class="tags-label">{{ $t('community.trendingTags', '热门标签') }}:</span>
            <div class="tags-list">
              <button 
                v-for="tag in trendingTags" 
                :key="tag"
                class="trending-tag"
                :class="{ active: selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- 发布笔记按钮 -->
          <div class="publish-trigger">
            <button class="publish-trigger-btn" @click="showPublishModal = true">
              <div class="trigger-content">
                <div class="trigger-avatar">
                  <img :src="currentUserAvatar" alt="用户头像" />
                </div>
                <div class="trigger-text">{{ $t('community.shareNote', '分享你的创意笔记...') }}</div>
                <div class="trigger-icon">✨</div>
              </div>
            </button>
          </div>
          
          <!-- 笔记列表区域 -->
          <div class="notes-section">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>{{ $t('community.loading', '加载中...') }}</p>
            </div>
            
            <!-- 空状态 -->
            <div v-else-if="filteredNotes.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>{{ $t('community.noNotes', '暂无笔记') }}</h3>
              <p>{{ $t('community.noNotesDesc', '快来发布第一篇笔记吧！') }}</p>
            </div>
            
            <!-- 笔记瀑布流 -->
            <div v-else class="notes-grid">
              <div 
                v-for="note in filteredNotes" 
                :key="note.id"
                class="note-card"
                :class="[`note-${note.type}`, { 'has-media': note.media && note.media.length > 0 }]"
              >
                <!-- 笔记头部 -->
                <div class="note-header">
                  <div class="author-info">
                    <div class="author-avatar">
                      <img :src="note.author.avatar" :alt="note.author.name" />
                    </div>
                    <div class="author-details">
                      <h4 class="author-name">{{ note.author.name }}</h4>
                      <span class="publish-time">{{ formatTime(note.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="note-type-badge">
                    <span class="type-icon">{{ getNoteTypeIcon(note.type) }}</span>
                  </div>
                </div>
                
                <!-- 笔记内容 -->
                <div class="note-content">
                  <p class="note-text">{{ note.content }}</p>
                  
                  <!-- 媒体内容 -->
                  <div v-if="note.media && note.media.length > 0" class="note-media">
                    <div v-if="note.type === 'image'" class="image-gallery">
                      <img 
                        v-for="(image, index) in note.media" 
                        :key="index"
                        :src="image.url" 
                        :alt="image.alt"
                        @click="openImageViewer(note.media, index)"
                      />
                    </div>
                    <video v-else-if="note.type === 'video'" :src="note.media[0].url" controls></video>
                  </div>
                  
                  <!-- 工作流内容 -->
                  <div v-if="note.type === 'workflow' && note.workflow" class="workflow-content">
                    <div class="workflow-preview">
                      <div class="workflow-icon">{{ note.workflow.icon || '🤖' }}</div>
                      <div class="workflow-info">
                        <h5>{{ note.workflow.name }}</h5>
                        <p>{{ note.workflow.description }}</p>
                      </div>
                      <button class="try-workflow-btn">{{ $t('community.tryWorkflow', '试用') }}</button>
                    </div>
                  </div>
                </div>
                
                <!-- 标签 -->
                <div v-if="note.tags && note.tags.length > 0" class="note-tags">
                  <span 
                    v-for="tag in note.tags" 
                    :key="tag"
                    class="note-tag"
                    @click="searchByTag(tag)"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <!-- 笔记操作 -->
                <div class="note-actions">
                  <button 
                    class="action-btn like-btn"
                    :class="{ liked: note.isLiked }"
                    @click="toggleLike(note)"
                  >
                    <span class="action-icon">❤️</span>
                    <span class="action-count">{{ note.likes }}</span>
                  </button>
                  <button class="action-btn comment-btn" @click="toggleComments(note)">
                    <span class="action-icon">💬</span>
                    <span class="action-count">{{ note.comments.length }}</span>
                  </button>
                  <button class="action-btn share-btn" @click="shareNote(note)">
                    <span class="action-icon">🔄</span>
                    <span class="action-count">{{ note.shares || 0 }}</span>
                  </button>
                </div>
                
                <!-- 评论区域 -->
                <div v-if="note.showComments" class="comments-section">
                  <div class="comment-input">
                    <input 
                      v-model="note.newComment"
                      type="text" 
                      :placeholder="$t('community.addComment', '添加评论...')"
                      @keydown.enter="addComment(note)"
                    />
                    <button @click="addComment(note)">{{ $t('community.send', '发送') }}</button>
                  </div>
                  <div class="comments-list">
                    <div v-for="comment in note.comments" :key="comment.id" class="comment-item">
                      <div class="comment-avatar">
                        <img :src="comment.author.avatar" :alt="comment.author.name" />
                      </div>
                      <div class="comment-content">
                        <span class="comment-author">{{ comment.author.name }}</span>
                        <p class="comment-text">{{ comment.content }}</p>
                        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多 -->
            <div v-if="hasMore && !loading" class="load-more">
              <button class="load-more-btn" @click="loadMoreNotes">
                {{ $t('community.loadMore', '加载更多') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 发布笔记弹窗 -->
    <div v-if="showPublishModal" class="publish-modal" @click="closePublishModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('community.shareNote', '分享你的创意笔记') }}</h3>
          <button class="modal-close" @click="closePublishModal">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- 笔记类型选择 -->
          <div class="note-type-selector">
            <button 
              v-for="type in noteTypes" 
              :key="type.id"
              class="type-btn"
              :class="{ active: selectedNoteType === type.id }"
              @click="selectNoteType(type.id)"
            >
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-label">{{ $t(`community.noteType.${type.id}`, type.label) }}</span>
            </button>
          </div>
          
          <!-- 内容输入区域 -->
          <div class="content-input">
            <textarea 
              v-model="newNote.content"
              :placeholder="getContentPlaceholder()"
              rows="4"
              maxlength="2000"
            ></textarea>
            <div class="input-counter">{{ newNote.content.length }}/2000</div>
          </div>
          
          <!-- 媒体上传区域 -->
          <div v-if="selectedNoteType !== 'text'" class="media-upload">
            <div class="upload-area" @click="triggerFileUpload" @drop="handleFileDrop" @dragover.prevent>
              <input 
                ref="fileInput" 
                type="file" 
                :accept="getFileAccept()"
                @change="handleFileSelect"
                multiple
                hidden
              />
              <div v-if="newNote.media.length === 0" class="upload-placeholder">
                <i class="upload-icon">📁</i>
                <p>{{ getUploadText() }}</p>
                <small>{{ getUploadHint() }}</small>
              </div>
              <div v-else class="media-preview">
                <div v-for="(media, index) in newNote.media" :key="index" class="media-item">
                  <img v-if="media.type === 'image'" :src="media.url" :alt="media.name" />
                  <video v-else-if="media.type === 'video'" :src="media.url" controls></video>
                  <div v-else class="file-preview">
                    <i class="file-icon">📄</i>
                    <span class="file-name">{{ media.name }}</span>
                  </div>
                  <button class="remove-media" @click="removeMedia(index)">✕</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Agent工作流选择器 -->
          <div v-if="selectedNoteType === 'workflow'" class="workflow-selector">
            <h4>{{ $t('community.selectWorkflow', '选择AI Agent工作流') }}</h4>
            <div class="workflow-list">
              <div 
                v-for="workflow in userWorkflows" 
                :key="workflow.id"
                class="workflow-item"
                :class="{ selected: newNote.workflowId === workflow.id }"
                @click="selectWorkflow(workflow.id)"
              >
                <div class="workflow-icon">{{ workflow.icon || '🤖' }}</div>
                <div class="workflow-info">
                  <h5>{{ workflow.name }}</h5>
                  <p>{{ workflow.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 标签输入 -->
          <div class="tags-input">
            <label>{{ $t('community.addTags', '添加标签') }}</label>
            <div class="tags-container">
              <div class="selected-tags">
                <span 
                  v-for="tag in newNote.tags" 
                  :key="tag"
                  class="selected-tag"
                >
                  #{{ tag }}
                  <button @click="removeTag(tag)">✕</button>
                </span>
              </div>
              <input 
                v-model="tagInput"
                type="text" 
                :placeholder="$t('community.tagsPlaceholder', '输入标签后按回车添加')"
                @keydown.enter.prevent="addTag"
                @keydown.space.prevent="addTag"
              />
            </div>
            <div class="tags-suggestions">
              <button 
                v-for="suggestion in tagSuggestions" 
                :key="suggestion"
                class="tag-suggestion"
                @click="addSuggestedTag(suggestion)"
              >
                #{{ suggestion }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 发布按钮 -->
        <div class="modal-footer">
          <button class="cancel-btn" @click="resetForm(); closePublishModal()">{{ $t('community.cancel', '取消') }}</button>
          <button 
            class="publish-btn" 
            :disabled="!canPublish"
            @click="publishNote"
          >
            {{ $t('community.publish', '发布笔记') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片查看器 -->
    <div v-if="imageViewer.show" class="image-viewer" @click="closeImageViewer">
      <div class="viewer-content" @click.stop>
        <img :src="imageViewer.images[imageViewer.currentIndex].url" :alt="imageViewer.images[imageViewer.currentIndex].alt" />
        <button class="viewer-close" @click="closeImageViewer">✕</button>
        <button v-if="imageViewer.currentIndex > 0" class="viewer-prev" @click="prevImage">‹</button>
        <button v-if="imageViewer.currentIndex < imageViewer.images.length - 1" class="viewer-next" @click="nextImage">›</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'Community',
  setup() {
    // 响应式数据
    const loading = ref(false)
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const selectedTags = ref([])
    const selectedNoteType = ref('text')
    const tagInput = ref('')
    const hasMore = ref(true)
    const showPublishModal = ref(false)
    
    // 笔记统计
    const noteStats = reactive({
      total: 1248,
      today: 56,
      tags: 234
    })
    
    // 新笔记数据
    const newNote = reactive({
      content: '',
      type: 'text',
      media: [],
      workflowId: null,
      tags: []
    })
    
    // 图片查看器
    const imageViewer = reactive({
      show: false,
      images: [],
      currentIndex: 0
    })
    
    // 筛选选项
    const filterOptions = [
      { id: 'all', label: '全部', icon: '📋' },
      { id: 'text', label: '文字', icon: '📝' },
      { id: 'image', label: '图片', icon: '🖼️' },
      { id: 'video', label: '视频', icon: '🎥' },
      { id: 'workflow', label: '工作流', icon: '🤖' }
    ]
    
    // 笔记类型
    const noteTypes = [
      { id: 'text', label: '文字笔记', icon: '📝' },
      { id: 'image', label: '图片分享', icon: '🖼️' },
      { id: 'video', label: '视频分享', icon: '🎥' },
      { id: 'workflow', label: 'AI工作流', icon: '🤖' }
    ]
    
    // 热门标签
    const trendingTags = ref([
      'AI创作', 'Labubu', '设计灵感', '摄影技巧', '编程笔记', 
      '生活记录', '学习心得', '工作流程', '创意想法', '技术分享'
    ])
    
    // 标签建议
    const tagSuggestions = computed(() => {
      if (!tagInput.value) return []
      return trendingTags.value.filter(tag => 
        tag.includes(tagInput.value) && !newNote.tags.includes(tag)
      ).slice(0, 5)
    })
    
    // 模拟笔记数据
    const notes = ref([
      {
        id: 1,
        type: 'text',
        content: '今天学习了Vue 3的Composition API，感觉比之前的Options API更加灵活，特别是在复杂组件的状态管理方面。分享一些学习心得...',
        author: {
          id: 1,
          name: '前端小白',
          avatar: '/src/assets/images/logo.png'
        },
        tags: ['Vue3', '前端开发', '学习笔记'],
        likes: 24,
        isLiked: false,
        shares: 5,
        comments: [
          {
            id: 1,
            author: { name: '代码爱好者', avatar: '/src/assets/images/logo.png' },
            content: '写得很好，我也在学习Vue3',
            createdAt: new Date(Date.now() - 3600000)
          }
        ],
        createdAt: new Date(Date.now() - 7200000),
        showComments: false,
        newComment: ''
      },
      {
        id: 2,
        type: 'image',
        content: '分享一些用AI生成的Labubu创意图片，这些小家伙真的太可爱了！',
        media: [
          { url: '/src/assets/images/home1.jpg', alt: 'Labubu创意图1' },
          { url: '/src/assets/images/home2.png', alt: 'Labubu创意图2' }
        ],
        author: {
          id: 2,
          name: 'AI艺术家',
          avatar: '/src/assets/images/logo.png'
        },
        tags: ['Labubu', 'AI创作', '可爱'],
        likes: 67,
        isLiked: true,
        shares: 12,
        comments: [],
        createdAt: new Date(Date.now() - 14400000),
        showComments: false,
        newComment: ''
      },
      {
        id: 3,
        type: 'workflow',
        content: '分享我创建的AI图像生成工作流，可以快速生成高质量的插画作品',
        workflow: {
          id: 'workflow_1',
          name: '智能插画生成器',
          description: '基于文本描述生成精美插画',
          icon: '🎨'
        },
        author: {
          id: 3,
          name: '工作流大师',
          avatar: '/src/assets/images/logo.png'
        },
        tags: ['AI工作流', '插画生成', '自动化'],
        likes: 89,
        isLiked: false,
        shares: 23,
        comments: [],
        createdAt: new Date(Date.now() - 21600000),
        showComments: false,
        newComment: ''
      }
    ])
    
    // 用户工作流（模拟数据）
    const userWorkflows = ref([
      {
        id: 'workflow_1',
        name: '智能插画生成器',
        description: '基于文本描述生成精美插画',
        icon: '🎨'
      },
      {
        id: 'workflow_2',
        name: '文章摘要生成器',
        description: '快速生成文章摘要和关键词',
        icon: '📄'
      }
    ])
    
    // 计算属性
    const filteredNotes = computed(() => {
      let filtered = notes.value
      
      // 按类型筛选
      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(note => note.type === activeFilter.value)
      }
      
      // 按标签筛选
      if (selectedTags.value.length > 0) {
        filtered = filtered.filter(note => 
          note.tags && note.tags.some(tag => selectedTags.value.includes(tag))
        )
      }
      
      // 按搜索词筛选
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(note => 
          note.content.toLowerCase().includes(query) ||
          note.author.name.toLowerCase().includes(query) ||
          (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }
      
      return filtered
    })
    
    const canPublish = computed(() => {
      return newNote.content.trim().length > 0 && (
        selectedNoteType.value === 'text' ||
        (selectedNoteType.value === 'workflow' && newNote.workflowId) ||
        newNote.media.length > 0
      )
    })
    
    const currentUserAvatar = computed(() => '/src/assets/images/logo.png')
    
    // 方法
    const setActiveFilter = (filterId) => {
      activeFilter.value = filterId
    }
    
    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag)
      if (index > -1) {
        selectedTags.value.splice(index, 1)
      } else {
        selectedTags.value.push(tag)
      }
    }
    
    const selectNoteType = (type) => {
      selectedNoteType.value = type
      newNote.type = type
      newNote.media = []
      newNote.workflowId = null
    }
    
    const addTag = () => {
      const tag = tagInput.value.trim()
      if (tag && !newNote.tags.includes(tag) && newNote.tags.length < 10) {
        newNote.tags.push(tag)
        tagInput.value = ''
      }
    }
    
    const addSuggestedTag = (tag) => {
      if (!newNote.tags.includes(tag) && newNote.tags.length < 10) {
        newNote.tags.push(tag)
      }
    }
    
    const removeTag = (tag) => {
      const index = newNote.tags.indexOf(tag)
      if (index > -1) {
        newNote.tags.splice(index, 1)
      }
    }
    
    const selectWorkflow = (workflowId) => {
      newNote.workflowId = workflowId
    }
    
    const publishNote = async () => {
      if (!canPublish.value) return
      
      loading.value = true
      try {
        // 这里会调用API发布笔记
        const noteData = {
          content: newNote.content,
          type: newNote.type,
          media: newNote.media,
          workflowId: newNote.workflowId,
          tags: newNote.tags
        }
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 添加到本地列表（实际应该从API返回）
        const publishedNote = {
          id: Date.now(),
          ...noteData,
          author: {
            id: 'current_user',
            name: '我',
            avatar: currentUserAvatar.value
          },
          likes: 0,
          isLiked: false,
          shares: 0,
          comments: [],
          createdAt: new Date(),
          showComments: false,
          newComment: ''
        }
        
        notes.value.unshift(publishedNote)
        resetForm()
        showPublishModal.value = false
        
        // 显示成功消息
        console.log('笔记发布成功')
      } catch (error) {
        console.error('发布失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const closePublishModal = () => {
      showPublishModal.value = false
      // 注意：这里不调用resetForm，因为用户可能只是暂时关闭弹窗
      // resetForm只在发布成功或用户明确取消时调用
    }
    
    const resetForm = () => {
      newNote.content = ''
      newNote.type = 'text'
      newNote.media = []
      newNote.workflowId = null
      newNote.tags = []
      selectedNoteType.value = 'text'
      tagInput.value = ''
    }
    
    const toggleLike = (note) => {
      note.isLiked = !note.isLiked
      note.likes += note.isLiked ? 1 : -1
    }
    
    const toggleComments = (note) => {
      note.showComments = !note.showComments
    }
    
    const addComment = (note) => {
      if (!note.newComment.trim()) return
      
      const comment = {
        id: Date.now(),
        author: { name: '我', avatar: currentUserAvatar.value },
        content: note.newComment,
        createdAt: new Date()
      }
      
      note.comments.push(comment)
      note.newComment = ''
    }
    
    const shareNote = (note) => {
      // 实现分享功能
      console.log('分享笔记:', note.id)
    }
    
    const searchByTag = (tag) => {
      if (!selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag)
      }
    }
    
    const handleSearch = () => {
      // 实时搜索逻辑
    }
    
    const performSearch = () => {
      // 执行搜索
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
    }
    
    const loadMoreNotes = async () => {
      loading.value = true
      try {
        // 模拟加载更多
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 实际应该调用API加载更多笔记
      } finally {
        loading.value = false
      }
    }
    
    const openImageViewer = (images, index) => {
      imageViewer.images = images
      imageViewer.currentIndex = index
      imageViewer.show = true
    }
    
    const closeImageViewer = () => {
      imageViewer.show = false
    }
    
    const prevImage = () => {
      if (imageViewer.currentIndex > 0) {
        imageViewer.currentIndex--
      }
    }
    
    const nextImage = () => {
      if (imageViewer.currentIndex < imageViewer.images.length - 1) {
        imageViewer.currentIndex++
      }
    }
    
    const formatTime = (date) => {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      return date.toLocaleDateString()
    }
    
    const getNoteTypeIcon = (type) => {
      const icons = {
        text: '📝',
        image: '🖼️',
        video: '🎥',
        workflow: '🤖'
      }
      return icons[type] || '📝'
    }
    
    const getContentPlaceholder = () => {
      const placeholders = {
        text: '分享你的想法、经验或灵感...',
        image: '为你的图片添加描述...',
        video: '为你的视频添加说明...',
        workflow: '介绍你的AI工作流功能和用途...'
      }
      return placeholders[selectedNoteType.value] || '写点什么...'
    }
    
    const getFileAccept = () => {
      if (selectedNoteType.value === 'image') return 'image/*'
      if (selectedNoteType.value === 'video') return 'video/*'
      return '*/*'
    }
    
    const getUploadText = () => {
      if (selectedNoteType.value === 'image') return '点击或拖拽上传图片'
      if (selectedNoteType.value === 'video') return '点击或拖拽上传视频'
      return '点击或拖拽上传文件'
    }
    
    const getUploadHint = () => {
      if (selectedNoteType.value === 'image') return '支持 JPG、PNG、GIF 格式，单个文件不超过10MB'
      if (selectedNoteType.value === 'video') return '支持 MP4、MOV、AVI 格式，单个文件不超过100MB'
      return '请选择合适的文件格式'
    }
    
    // 文件处理方法
    const triggerFileUpload = () => {
      // 实现文件上传触发
    }
    
    const handleFileDrop = (event) => {
      // 实现拖拽上传
    }
    
    const handleFileSelect = (event) => {
      // 实现文件选择处理
    }
    
    const removeMedia = (index) => {
      newNote.media.splice(index, 1)
    }
    
    // 生命周期
    onMounted(() => {
      // 组件挂载后的初始化操作
    })
    
    return {
      // 响应式数据
      loading,
      searchQuery,
      activeFilter,
      selectedTags,
      selectedNoteType,
      tagInput,
      hasMore,
      showPublishModal,
      noteStats,
      newNote,
      imageViewer,
      
      // 选项数据
      filterOptions,
      noteTypes,
      trendingTags,
      userWorkflows,
      
      // 计算属性
      filteredNotes,
      canPublish,
      currentUserAvatar,
      tagSuggestions,
      
      // 方法
      setActiveFilter,
      toggleTag,
      selectNoteType,
      addTag,
      addSuggestedTag,
      removeTag,
      selectWorkflow,
      publishNote,
      resetForm,
      closePublishModal,
      toggleLike,
      toggleComments,
      addComment,
      shareNote,
      searchByTag,
      handleSearch,
      performSearch,
      clearSearch,
      loadMoreNotes,
      openImageViewer,
      closeImageViewer,
      prevImage,
      nextImage,
      formatTime,
      getNoteTypeIcon,
      getContentPlaceholder,
      getFileAccept,
      getUploadText,
      getUploadHint,
      triggerFileUpload,
      handleFileDrop,
      handleFileSelect,
      removeMedia
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
  padding: 4rem 0 3rem;
  color: white;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
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
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 搜索区域样式 */
.search-section {
  background: #2d2d2d;
  padding: 2rem 0;
  border-bottom: 1px solid #404040;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #b0b0b0;
}

.search-box input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 25px;
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 1.2rem;
}

/* 筛选标签样式 */
.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 20px;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover,
.filter-tab.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 热门标签样式 */
.trending-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tags-label {
  font-weight: 600;
  color: #e0e0e0;
  margin-right: 0.5rem;
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.trending-tag {
  background: #3a3a3a;
  border: 1px solid #404040;
  color: #b0b0b0;
  padding: 0.4rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.trending-tag:hover,
.trending-tag.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 主要内容样式 */
.main-content {
  padding: 2rem 0;
}

.content-layout {
  max-width: 800px;
  margin: 0 auto;
}

/* 发布触发按钮样式 */
.publish-trigger {
  margin-bottom: 2rem;
}

.publish-trigger-btn {
  width: 100%;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 16px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-trigger-btn:hover {
  background: #3a3a3a;
  border-color: #ff6b6b;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.trigger-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.trigger-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.trigger-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trigger-text {
  flex: 1;
  text-align: left;
  color: #b0b0b0;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.publish-trigger-btn:hover .trigger-text {
  color: #e0e0e0;
}

.trigger-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.publish-trigger-btn:hover .trigger-icon {
  transform: scale(1.2);
}

/* 笔记类型选择器 */
.note-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 12px;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover,
.type-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 内容输入区域 */
.content-input {
  position: relative;
  margin-bottom: 1.5rem;
}

.content-input textarea {
  width: 100%;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 1rem;
  color: #e0e0e0;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.content-input textarea:focus {
  outline: none;
  border-color: #ff6b6b;
}

.input-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  font-size: 0.8rem;
  color: #b0b0b0;
}

/* 媒体上传区域 */
.media-upload {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed #404040;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.upload-placeholder .upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.media-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.media-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.remove-media {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* 工作流选择器 */
.workflow-selector {
  margin-bottom: 1.5rem;
}

.workflow-selector h4 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
}

.workflow-list {
  display: grid;
  gap: 1rem;
}

.workflow-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workflow-item:hover,
.workflow-item.selected {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.workflow-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
}

.workflow-info h5 {
  margin: 0 0 0.3rem 0;
  color: #e0e0e0;
}

.workflow-info p {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.9rem;
}

/* 标签输入样式 */
.tags-input {
  margin-bottom: 1.5rem;
}

.tags-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #e0e0e0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.8rem;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 8px;
  min-height: 45px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.selected-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 0.3rem;
}

.tags-container input {
  flex: 1;
  background: none;
  border: none;
  color: #e0e0e0;
  outline: none;
  min-width: 150px;
}

.tags-suggestions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.tag-suggestion {
  background: #3a3a3a;
  border: 1px solid #404040;
  color: #b0b0b0;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.tag-suggestion:hover {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 发布按钮样式 */
.publish-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn,
.publish-btn {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #3a3a3a;
  border: 1px solid #404040;
  color: #b0b0b0;
}

.cancel-btn:hover {
  background: #2d2d2d;
  color: #e0e0e0;
}

.publish-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.publish-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 笔记列表样式 */
.notes-section {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #b0b0b0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #404040;
  border-top: 3px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 0;
}

/* 笔记卡片样式 */
.note-card {
  background: #2d2d2d;
  border-radius: 12px;
  border: 1px solid #404040;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  border-bottom: 1px solid #404040;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  margin: 0;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.85rem;
}

.publish-time {
  font-size: 0.75rem;
  color: #b0b0b0;
}

.note-type-badge {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

.note-content {
  padding: 0.8rem;
  flex: 1;
}

.note-text {
  line-height: 1.5;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-media {
  margin-top: 0.8rem;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem;
  border-radius: 6px;
  overflow: hidden;
  max-height: 180px;
}

.image-gallery img {
  width: 100%;
  height: 85px;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.image-gallery img:hover {
  transform: scale(1.02);
}

/* 单张图片时占满宽度 */
.image-gallery:has(img:only-child) {
  grid-template-columns: 1fr;
}

.image-gallery:has(img:only-child) img {
  height: 120px;
}

.note-media video {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.workflow-content {
  margin-top: 0.8rem;
}

.workflow-preview {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: #3a3a3a;
  border-radius: 6px;
  border: 1px solid #404040;
}

.workflow-preview .workflow-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 6px;
}

.workflow-preview .workflow-info {
  flex: 1;
}

.workflow-preview h5 {
  margin: 0 0 0.2rem 0;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.workflow-preview p {
  margin: 0;
  color: #b0b0b0;
  font-size: 0.8rem;
}

.try-workflow-btn {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.try-workflow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

/* 标签样式 */
.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0 0.8rem 0.8rem;
}

.note-tag {
  background: #3a3a3a;
  color: #b0b0b0;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #404040;
}

.note-tag:hover {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 笔记操作样式 */
.note-actions {
  display: flex;
  gap: 0.8rem;
  padding: 0.8rem;
  border-top: 1px solid #404040;
  margin-top: auto;
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
  background: #3a3a3a;
  color: #e0e0e0;
}

.action-btn.liked {
  color: #ff6b6b;
}

/* 评论区域样式 */
.comments-section {
  padding: 1rem;
  border-top: 1px solid #404040;
  background: #252525;
}

.comment-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.comment-input input {
  flex: 1;
  background: #3a3a3a;
  border: 1px solid #404040;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #e0e0e0;
}

.comment-input button {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.comment-item {
  display: flex;
  gap: 0.8rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-weight: 600;
  color: #e0e0e0;
  margin-right: 0.5rem;
}

.comment-text {
  margin: 0.2rem 0;
  line-height: 1.4;
  color: #e0e0e0;
}

.comment-time {
  font-size: 0.8rem;
  color: #b0b0b0;
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
  padding: 2rem;
}

.load-more-btn {
  background: #3a3a3a;
  border: 1px solid #404040;
  color: #e0e0e0;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: transparent;
}

/* 图片查看器样式 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.viewer-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.viewer-close,
.viewer-prev,
.viewer-next {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.viewer-close {
  top: 1rem;
  right: 1rem;
}

.viewer-prev {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.viewer-next {
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.viewer-close:hover,
.viewer-prev:hover,
.viewer-next:hover {
  background: rgba(0, 0, 0, 0.9);
}

/* 发布笔记弹窗样式 */
.publish-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #2d2d2d;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #404040;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #404040;
}

.modal-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.2rem;
}

.modal-close {
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #3a3a3a;
  color: #e0e0e0;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #404040;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
  }
  
  .content-layout {
    padding: 0 1rem;
  }
}

@media (max-width: 900px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .community-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .trending-tags {
    flex-direction: column;
    align-items: center;
  }
  
  .note-type-selector {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .image-gallery {
    grid-template-columns: 1fr;
  }
  
  .workflow-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .note-actions {
    justify-content: space-between;
  }
  
  /* 弹窗在移动端的优化 */
  .publish-modal {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .search-box {
    margin: 0 1rem 1.5rem;
  }
  
  .publish-card {
    margin: 0 1rem;
    padding: 1rem;
  }
  
  .note-card {
    margin: 0 1rem;
  }
}

/* 容器样式 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 社区专用容器 - 更宽的布局 */
.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0.5rem;
}
</style> 
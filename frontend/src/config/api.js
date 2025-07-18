// API配置文件 - API Configuration file
// 定义所有后端接口的基础URL和具体接口路径

// 移除axios导入，改用fetch API

// 基础配置 - Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://labubuai.me/backend/ai-agent'

// 统一API基础路径 (无版本前缀) - Unified API base path (no version prefix)
const BASE_URL = API_BASE_URL

// 获取用户认证API基础URL
const getUserApiBaseUrl = () => {
  return import.meta.env.VITE_USER_API_BASE_URL || 'https://labubuai.me'
}



// 用户认证API类 - 基于api(2).js的正确实现
class UserAuthAPI {
  constructor() {
    this.baseURL = `${getUserApiBaseUrl()}/backend/user` // 使用正确的用户认证API基础URL
  }

  // Generic request method for user auth APIs用户认证API的通用请求方法
  async request(endpoint, options = {}) {
    const fullUrl = `${this.baseURL}${endpoint}` // Construct full URL构造完整URL
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json', // Default content type默认内容类型
        // Note: No Authorization header for auth APIs注意：认证API不需要Authorization头
      },
      timeout: 30000 // Request timeout请求超时时间
    }
    
    try {
      const response = await fetch(fullUrl, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      let data
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
      
      // 检查后端业务状态码 - 后端所有响应都是HTTP 200，需要检查响应体中的code字段
      if (data && typeof data === 'object' && data.code !== undefined) {
        if (data.code !== 200) {
          // 抛出业务异常，包含后端返回的错误信息
          const error = new Error(data.msg || 'API调用失败')
          error.code = data.code
          error.data = data.data
          throw error
        }
      }
      
      return data
    } catch (error) {
      console.error('User auth API request failed用户认证API请求失败:', error)
      throw error
    }
  }

  // User login API用户登录API - 只支持用户名登录
  async login(username, password) {
    return await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
  }

  // User registration API用户注册API
  async register(username, email, password, code) {
    return await this.request('/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        verificationCode: code  // 后端接口需要verificationCode字段
      })
    })
  }

  // Send verification code API发送验证码API
  async sendVerificationCode(email) {
    return await this.request('/sendCode', {
      method: 'POST',
      body: JSON.stringify({
        email: email
      })
    })
  }
}

// Export user auth API instance导出用户认证API实例
export const userAuthAPI = new UserAuthAPI()

// AI Agent相关接口 - AI Agent APIs (严格按照api.md后端接口)
export const AI_AGENT_API = {
  // === api.md中实际存在的接口 ===
  
  // 提交DAG (创建AI Agent工作流) - POST /submit
  CREATE: `${BASE_URL}/submit`,
  
  // 通知DAG就绪 (部署AI Agent) - POST /ready
  DEPLOY: `${BASE_URL}/ready`,
  
  // 获取DAG状态 (AI Agent执行状态) - GET /status/{dag_id}
  STATUS: (dagId) => `${BASE_URL}/status/${dagId}`,
  
  // 获取节点结果 (AI Agent执行结果) - POST /message
  RESULT: `${BASE_URL}/message`,
  
  // 获取租户所有DAG (用户的AI Agent列表) - GET /AllDag/{tenantID}
  LIST: (tenantId) => `${BASE_URL}/AllDag/${tenantId}`,
  
  // 健康检查 - GET /healthz
  HEALTH: `${BASE_URL}/healthz`,
  
  // 就绪检查 - GET /readyz
  READY_CHECK: `${BASE_URL}/readyz`,
}

// AI Agent API类 - 提供DAG操作的具体方法 (基于api.md文档)
class AIAgentAPI {
  constructor() {
    this.baseURL = BASE_URL
  }

  // 获取所有DAGs - 对应后端 GET /AllDag/{tenantID}
  async getAllDAGs(tenantId) {
    const response = await fetch(`${this.baseURL}/AllDag/${tenantId}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // 提交DAG - 对应后端 POST /submit
  async submitDAG(dagData) {
    const response = await fetch(`${this.baseURL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dagData)
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // 通知就绪 - 对应后端 POST /ready
  async notifyReady(dagId, tenantId = 'default_tenant') {
    const response = await fetch(`${this.baseURL}/ready`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dag_id: dagId, tenant_id: tenantId })
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // 获取DAG状态 - 对应后端 GET /status/{dag_id} (SSE)
  getDAGStatusStream(dagId) {
    return new EventSource(`${this.baseURL}/status/${dagId}`)
  }

  // 获取DAG状态 (非SSE) - 对应后端 GET /status/{dag_id}
  async getDAGStatus(dagId) {
    const response = await fetch(`${this.baseURL}/status/${dagId}`)
    return response
  }

  // 获取结果 - 对应后端 POST /message
  async getResult(dagId, tenantId, nodeId) {
    const response = await fetch(`${this.baseURL}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dag_id: dagId,
        tenant_id: tenantId, 
        node_id: nodeId
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // 健康检查 - 对应后端 GET /healthz
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/healthz`)
    return response.ok
  }

  // 就绪检查 - 对应后端 GET /readyz
  async readyCheck() {
    const response = await fetch(`${this.baseURL}/readyz`)
    return response.ok
  }

  // 生成DAG ID
  generateDAGId(workflowName) {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `${workflowName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${timestamp}_${randomSuffix}`
  }

  // 获取租户ID - 从用户信息动态获取
  getTenantId() {
    // 根据api(1).md，后端没有tenant概念，所有用户都是default
    return 'default'
  }
}

// 导出AI Agent API实例
export const aiAgentAPI = new AIAgentAPI()

// 社区笔记相关接口 - Community Notes APIs (无版本前缀)
export const COMMUNITY_API = {
  // 笔记管理 - Note management
  NOTES: {
    // 获取笔记列表 - Get notes list
    LIST: `${BASE_URL}/community/notes`,
    
    // 创建新笔记 - Create new note
    CREATE: `${BASE_URL}/community/notes`,
    
    // 获取笔记详情 - Get note details
    DETAIL: (id) => `${BASE_URL}/community/notes/${id}`,
    
    // 更新笔记 - Update note
    UPDATE: (id) => `${BASE_URL}/community/notes/${id}`,
    
    // 删除笔记 - Delete note
    DELETE: (id) => `${BASE_URL}/community/notes/${id}`,
    
    // 点赞/取消点赞笔记 - Like/unlike note
    LIKE: (id) => `${BASE_URL}/community/notes/${id}/like`,
    
    // 分享笔记 - Share note
    SHARE: (id) => `${BASE_URL}/community/notes/${id}/share`,
    
    // 举报笔记 - Report note
    REPORT: (id) => `${BASE_URL}/community/notes/${id}/report`,
  },
  
  // 搜索相关 - Search related
  SEARCH: {
    // 搜索笔记 - Search notes
    NOTES: `${BASE_URL}/community/search/notes`,
    
    // 搜索用户 - Search users
    USERS: `${BASE_URL}/community/search/users`,
    
    // 搜索标签 - Search tags
    TAGS: `${BASE_URL}/community/search/tags`,
    
    // 热门搜索 - Trending searches
    TRENDING: `${BASE_URL}/community/search/trending`,
    
    // 搜索建议 - Search suggestions
    SUGGESTIONS: `${BASE_URL}/community/search/suggestions`,
  },
  
  // 标签管理 - Tag management
  TAGS: {
    // 获取所有标签 - Get all tags
    LIST: `${BASE_URL}/community/tags`,
    
    // 获取热门标签 - Get trending tags
    TRENDING: `${BASE_URL}/community/tags/trending`,
    
    // 获取标签详情 - Get tag details
    DETAIL: (tag) => `${BASE_URL}/community/tags/${encodeURIComponent(tag)}`,
    
    // 获取标签下的笔记 - Get notes by tag
    NOTES: (tag) => `${BASE_URL}/community/tags/${encodeURIComponent(tag)}/notes`,
    
    // 创建新标签 - Create new tag
    CREATE: `${BASE_URL}/community/tags`,
    
    // 关注/取消关注标签 - Follow/unfollow tag
    FOLLOW: (tag) => `${BASE_URL}/community/tags/${encodeURIComponent(tag)}/follow`,
  },
  
  // 评论管理 - Comment management
  COMMENTS: {
    // 获取笔记的评论列表 - Get comments for note
    LIST: (noteId) => `${BASE_URL}/community/notes/${noteId}/comments`,
    
    // 添加评论 - Add comment
    CREATE: (noteId) => `${BASE_URL}/community/notes/${noteId}/comments`,
    
    // 更新评论 - Update comment
    UPDATE: (noteId, commentId) => `${BASE_URL}/community/notes/${noteId}/comments/${commentId}`,
    
    // 删除评论 - Delete comment
    DELETE: (noteId, commentId) => `${BASE_URL}/community/notes/${noteId}/comments/${commentId}`,
    
    // 点赞/取消点赞评论 - Like/unlike comment
    LIKE: (noteId, commentId) => `${BASE_URL}/community/notes/${noteId}/comments/${commentId}/like`,
    
    // 举报评论 - Report comment
    REPORT: (noteId, commentId) => `${BASE_URL}/community/notes/${noteId}/comments/${commentId}/report`,
  },
  
  // 媒体文件上传 - Media file upload
  MEDIA: {
    // 上传图片 - Upload image
    UPLOAD_IMAGE: `${BASE_URL}/community/media/upload/image`,
    
    // 上传视频 - Upload video
    UPLOAD_VIDEO: `${BASE_URL}/community/media/upload/video`,
    
    // 上传文件 - Upload file
    UPLOAD_FILE: `${BASE_URL}/community/media/upload/file`,
    
    // 删除媒体文件 - Delete media file
    DELETE: (mediaId) => `${BASE_URL}/community/media/${mediaId}`,
    
    // 获取媒体文件信息 - Get media file info
    INFO: (mediaId) => `${BASE_URL}/community/media/${mediaId}`,
  },
  
  // 用户相关 - User related
  USERS: {
    // 获取用户资料 - Get user profile
    PROFILE: (userId) => `${BASE_URL}/community/users/${userId}`,
    
    // 获取用户的笔记 - Get user's notes
    NOTES: (userId) => `${BASE_URL}/community/users/${userId}/notes`,
    
    // 获取用户的关注列表 - Get user's following list
    FOLLOWING: (userId) => `${BASE_URL}/community/users/${userId}/following`,
    
    // 获取用户的粉丝列表 - Get user's followers list
    FOLLOWERS: (userId) => `${BASE_URL}/community/users/${userId}/followers`,
    
    // 关注/取消关注用户 - Follow/unfollow user
    FOLLOW: (userId) => `${BASE_URL}/community/users/${userId}/follow`,
    
    // 获取推荐用户 - Get recommended users
    RECOMMENDED: `${BASE_URL}/community/users/recommended`,
  },
  
  // 统计数据 - Statistics
  STATS: {
    // 获取社区统计 - Get community stats
    COMMUNITY: `${BASE_URL}/community/stats`,
    
    // 获取用户统计 - Get user stats
    USER: (userId) => `${BASE_URL}/community/stats/users/${userId}`,
    
    // 获取笔记统计 - Get note stats
    NOTE: (noteId) => `${BASE_URL}/community/stats/notes/${noteId}`,
    
    // 获取标签统计 - Get tag stats
    TAG: (tag) => `${BASE_URL}/community/stats/tags/${encodeURIComponent(tag)}`,
  },
}



// 市场相关接口 - Marketplace APIs
export const MARKETPLACE_API = {
  // 获取市场商品列表 - Get marketplace items
  LIST: `${BASE_URL}/marketplace/items`,
  
  // 获取商品详情 - Get item details
  DETAIL: (id) => `${BASE_URL}/marketplace/items/${id}`,
  
  // 购买商品 - Purchase item
  PURCHASE: (id) => `${BASE_URL}/marketplace/items/${id}/purchase`,
  
  // 获取用户购买历史 - Get user's purchase history
  PURCHASES: `${BASE_URL}/marketplace/purchases`,
  
  // 获取商品分类 - Get item categories
  CATEGORIES: `${BASE_URL}/marketplace/categories`,
  
  // 搜索商品 - Search items
  SEARCH: `${BASE_URL}/marketplace/search`,
}

// 文件上传相关接口 - File upload APIs
export const UPLOAD_API = {
  // 通用文件上传 - General file upload
  UPLOAD: `${BASE_URL}/upload`,
  
  // 头像上传 - Avatar upload
  AVATAR: `${BASE_URL}/upload/avatar`,
  
  // 图片上传 - Image upload
  IMAGE: `${BASE_URL}/upload/image`,
  
  // 视频上传 - Video upload
  VIDEO: `${BASE_URL}/upload/video`,
  
  // 文档上传 - Document upload
  DOCUMENT: `${BASE_URL}/upload/document`,
  
  // 获取上传进度 - Get upload progress
  PROGRESS: (uploadId) => `${BASE_URL}/upload/progress/${uploadId}`,
  
  // 取消上传 - Cancel upload
  CANCEL: (uploadId) => `${BASE_URL}/upload/cancel/${uploadId}`,
}

// 通知相关接口 - Notification APIs
export const NOTIFICATION_API = {
  // 获取通知列表 - Get notifications
  LIST: `${BASE_URL}/notifications`,
  
  // 标记通知为已读 - Mark notification as read
  READ: (id) => `${BASE_URL}/notifications/${id}/read`,
  
  // 标记所有通知为已读 - Mark all notifications as read
  READ_ALL: `${BASE_URL}/notifications/read-all`,
  
  // 删除通知 - Delete notification
  DELETE: (id) => `${BASE_URL}/notifications/${id}`,
  
  // 获取未读通知数量 - Get unread notification count
  UNREAD_COUNT: `${BASE_URL}/notifications/unread-count`,
}

// 系统配置相关接口 - System configuration APIs
export const SYSTEM_API = {
  // 获取系统配置 - Get system configuration
  CONFIG: `${BASE_URL}/system/config`,
  
  // 获取系统状态 - Get system status
  STATUS: `${BASE_URL}/system/status`,
  
  // 获取系统版本信息 - Get system version info
  VERSION: `${BASE_URL}/system/version`,
  
  // 健康检查 - Health check
  HEALTH: `${BASE_URL}/system/health`,
}

// WebSocket连接配置 - WebSocket configuration
export const WEBSOCKET_CONFIG = {
  // WebSocket基础URL - WebSocket base URL
  BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'wss://labubuai.me',
  
  // 实时通知 - Real-time notifications
  NOTIFICATIONS: '/ws/notifications',
  
  // 实时聊天 - Real-time chat
  CHAT: '/ws/chat',
  
  // 实时协作 - Real-time collaboration
  COLLABORATION: '/ws/collaboration',
}

// 请求配置 - Request configuration
export const REQUEST_CONFIG = {
  // 请求超时时间 - Request timeout
  TIMEOUT: 30000,
  
  // 重试次数 - Retry times
  RETRY_TIMES: 3,
  
  // 重试延迟 - Retry delay
  RETRY_DELAY: 1000,
}

// 分页配置 - Pagination configuration
export const PAGINATION_CONFIG = {
  // 默认页大小 - Default page size
  DEFAULT_PAGE_SIZE: 20,
  
  // 最大页大小 - Maximum page size
  MAX_PAGE_SIZE: 100,
  
  // 默认页码 - Default page number
  DEFAULT_PAGE: 1,
}

// 导出默认配置 - Export default configuration
export default {
  BASE_URL,
  userAuthAPI,
  aiAgentAPI,
  AI_AGENT_API,
  COMMUNITY_API,
  MARKETPLACE_API,
  UPLOAD_API,
  NOTIFICATION_API,
  SYSTEM_API,
  WEBSOCKET_CONFIG,
  REQUEST_CONFIG,
  PAGINATION_CONFIG,
} 
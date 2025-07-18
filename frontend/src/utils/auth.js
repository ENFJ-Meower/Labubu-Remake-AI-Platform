// 认证工具函数 - Authentication utility functions
// 用于检查用户登录状态和管理JWT token

/**
 * 检查用户是否已登录
 * Check if user is logged in
 * @returns {boolean} 是否已登录
 */
export function isAuthenticated() {
  const token = localStorage.getItem('labubu_token')
  const user = localStorage.getItem('userInfo')
  
  // 检查token和用户信息是否存在
  if (!token || !user) {
    return false
  }
  
  // 检查token是否过期（简单的JWT过期检查）
  try {
    const payload = parseJWT(token)
    const currentTime = Date.now() / 1000
    
    // 如果token有过期时间且已过期，返回false
    if (payload.exp && payload.exp < currentTime) {
      console.log('JWT token已过期')
      clearAuthData()
      return false
    }
    
    return true
  } catch (error) {
    console.error('JWT token解析失败:', error)
    clearAuthData()
    return false
  }
}

/**
 * 获取当前用户信息
 * Get current user information
 * @returns {Object|null} 用户信息对象或null
 */
export function getCurrentUser() {
  if (!isAuthenticated()) {
    return null
  }
  
  try {
    const userStr = localStorage.getItem('userInfo')
    return JSON.parse(userStr)
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}

/**
 * 获取JWT token
 * Get JWT token
 * @returns {string|null} JWT token或null
 */
export function getAuthToken() {
  return localStorage.getItem('labubu_token')
}

/**
 * 清除认证数据
 * Clear authentication data
 */
export function clearAuthData() {
  localStorage.removeItem('labubu_token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('labubu_remember')
}

/**
 * 登出用户
 * Logout user
 */
export function logout() {
  clearAuthData()
  // 可以在这里添加额外的登出逻辑，比如调用后端登出API
  console.log('用户已登出')
}

/**
 * 解析JWT token（简单版本）
 * Parse JWT token (simple version)
 * @param {string} token JWT token
 * @returns {Object} 解析后的payload
 */
function parseJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    throw new Error('Failed to parse JWT token')
  }
}

/**
 * 检查是否需要登录验证的路由
 * Check if route requires authentication
 * @param {string} path 路由路径
 * @returns {boolean} 是否需要登录
 */
export function requiresAuth(path) {
  // 需要登录的路由列表
  const protectedRoutes = [
    '/frontend/ai-agent',
    '/frontend/marketplace'
  ]
  
  return protectedRoutes.includes(path)
}

/**
 * 重定向到登录页面
 * Redirect to login page
 * @param {Object} router Vue Router实例
 * @param {string} from 来源路径，用于登录后重定向
 */
export function redirectToLogin(router, from = '/') {
  // 保存原始路径，登录后可以重定向回来
  localStorage.setItem('redirect_after_login', from)
  
  // 跳转到登录页面
  router.push('/frontend/login')
}

/**
 * 登录成功后的重定向
 * Redirect after successful login
 * @param {Object} router Vue Router实例
 */
export function redirectAfterLogin(router) {
  // 获取保存的重定向路径
  const redirectPath = localStorage.getItem('redirect_after_login')
  localStorage.removeItem('redirect_after_login')
  
  // 重定向到原始路径或首页
  router.push(redirectPath || '/')
} 

/**
 * 获取当前用户ID（从JWT token解析）
 * Get current user ID from JWT token
 * @returns {string|null} 用户ID或null
 */
export function getCurrentUserId() {
  if (!isAuthenticated()) {
    return null
  }
  
  try {
    const token = getAuthToken()
    const payload = parseJWT(token)
    return payload.user_id || null
  } catch (error) {
    console.error('获取用户ID失败:', error)
    return null
  }
}

/**
 * 获取当前用户的tenant_id
 * Get current user's tenant_id
 * @returns {string|null} tenant_id或null
 */
export function getCurrentTenantId() {
  // 优先从localStorage的userInfo获取
  const user = getCurrentUser()
  if (user && user.tenant_id) {
    return user.tenant_id
  }
  
  // 如果localStorage没有，尝试从JWT token解析
  try {
    const token = getAuthToken()
    const payload = parseJWT(token)
    return payload.tenant_id || 'default'
  } catch (error) {
    console.error('获取tenant_id失败:', error)
    return 'default'
  }
}

/**
 * 获取完整的用户信息（包含从JWT解析的字段）
 * Get complete user information including JWT fields
 * @returns {Object|null} 完整用户信息或null
 */
export function getCompleteUserInfo() {
  if (!isAuthenticated()) {
    return null
  }
  
  try {
    // 获取localStorage中存储的用户信息
    const storedUser = getCurrentUser()
    
    // 从JWT token解析补充信息
    const token = getAuthToken()
    const payload = parseJWT(token)
    
    return {
      userId: payload.user_id,
      username: storedUser?.username || payload.username,
      email: storedUser?.email || payload.email,
      tenant_id: storedUser?.tenant_id || payload.tenant_id || 'default'
    }
  } catch (error) {
    console.error('获取完整用户信息失败:', error)
    return getCurrentUser() // 降级返回基础信息
  }
} 
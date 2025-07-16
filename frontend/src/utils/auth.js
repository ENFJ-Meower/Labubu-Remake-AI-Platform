// 认证工具函数 - Authentication utility functions
// 用于检查用户登录状态和管理JWT token

/**
 * 检查用户是否已登录
 * Check if user is logged in
 * @returns {boolean} 是否已登录
 */
export function isAuthenticated() {
  const token = localStorage.getItem('labubu_token')
  const user = localStorage.getItem('labubu_user')
  
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
    '/frontend/community', 
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
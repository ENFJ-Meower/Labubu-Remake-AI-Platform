// API configuration file - Backend DAG management system integration API配置文件 - 后端DAG管理系统接入
const API_CONFIG = {
  // Basic API configuration基础API配置
  baseURL: 'http://localhost:8081/backend/api/v1', // Adjust according to actual backend address根据实际后端地址调整
  timeout: 30000, // Request timeout in milliseconds请求超时时间（毫秒）
  
  // Request headers configuration请求头配置
  headers: {
    'Content-Type': 'application/json', // Content type for JSON requests JSON请求的内容类型
    'Accept': 'application/json' // Accept JSON responses接受JSON响应
  },
  
  // Tenant ID - needs to be obtained from authentication system租户ID - 需要从认证系统获取
  getTenantId() {
    // Get tenant_id from localStorage or authentication token从localStorage或认证token中获取tenant_id
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    
    // Generate a default tenant_id if not configured如果没有配置tenant_id，生成一个默认的
    if (!userInfo.tenant_id) {
      const defaultTenant = `tenant_${Date.now()}` // Generate unique tenant ID生成唯一租户ID
      userInfo.tenant_id = defaultTenant
      localStorage.setItem('userInfo', JSON.stringify(userInfo)) // Save to localStorage保存到本地存储
      console.log('Generated default tenant ID生成默认租户ID:', defaultTenant)
    }
    
    return userInfo.tenant_id
  },
  
  // API endpoint definitions API端点定义
  endpoints: {
    // Submit DAG workflow提交DAG工作流
    submitDAG: '/submit',
    
    // Notify workflow ready通知工作流就绪
    notifyReady: '/ready',
    
    // Get DAG status获取DAG状态
    getDAGStatus: '/status/{dag_id}',
    
    // Get processing result获取处理结果
    getResult: '/message',
    
    // Get all user DAGs获取用户所有DAG
    getAllDAGs: '/AllDag/{tenantID}',
    
    // SSE status push SSE状态推送
    statusStream: '/status/stream/{dag_id}'
  }
}

// HTTP请求封装类
// WorkflowAPI class for handling all DAG workflow operations WorkflowAPI类用于处理所有DAG工作流操作
class WorkflowAPI {
  constructor() {
    this.config = API_CONFIG // Store API configuration存储API配置
  }

  // Generic request method for all API calls通用请求方法用于所有API调用
  async request(url, options = {}) {
    const fullUrl = this.config.baseURL + url // Construct full URL构造完整URL
    const defaultOptions = {
      headers: {
        ...this.config.headers, // Spread default headers展开默认请求头
        // Add authentication headers if available添加认证头（如果有的话）
        ...this.getAuthHeaders()
      },
      timeout: this.config.timeout // Set request timeout设置请求超时时间
    }
    
    try {
      const response = await fetch(fullUrl, { ...defaultOptions, ...options }) // Make HTTP request发起HTTP请求
      
      // Check if response is successful检查响应是否成功
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Parse response based on content type根据内容类型解析响应
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json() // Parse JSON response解析JSON响应
      }
      
      return await response.text() // Parse text response解析文本响应
    } catch (error) {
      console.error('API request failed API请求失败:', error)
      throw error // Re-throw error for handling重新抛出错误以供处理
    }
  }

  // Get authentication headers获取认证头
  getAuthHeaders() {
    const token = localStorage.getItem('authToken') // Get auth token from localStorage从本地存储获取认证令牌
    return token ? { 'Authorization': `Bearer ${token}` } : {} // Return Bearer token or empty object返回Bearer令牌或空对象
  }

  // Submit DAG workflow to backend提交DAG工作流到后端
  async submitDAG(dagData) {
    const payload = {
      dag_id: dagData.dag_id, // Unique DAG identifier唯一DAG标识符
      tenant_id: this.config.getTenantId(), // Tenant ID for multi-tenancy多租户的租户ID
      nodes: dagData.nodes, // DAG nodes configuration DAG节点配置
      edges: dagData.edges // DAG edges configuration DAG边配置
    }
    
    // Send POST request to submit DAG发送POST请求提交DAG
    return await this.request(this.config.endpoints.submitDAG, {
      method: 'POST',
      body: JSON.stringify(payload) // Serialize payload as JSON将负载序列化为JSON
    })
  }

  // Notify DAG is ready for execution通知DAG就绪可执行
  async notifyReady(dagId) {
    return await this.request(this.config.endpoints.notifyReady, {
      method: 'POST',
      body: JSON.stringify({
        dag_id: dagId, // DAG identifier DAG标识符
        tenant_id: this.config.getTenantId() // Current tenant ID当前租户ID
      })
    })
  }

  // Get DAG execution status获取DAG执行状态
  async getDAGStatus(dagId) {
    const url = this.config.endpoints.getDAGStatus.replace('{dag_id}', dagId) // Replace URL parameter替换URL参数
    return await this.request(url, { method: 'GET' })
  }

  // Get processing result获取处理结果
  async getResult(dagId) {
    return await this.request(this.config.endpoints.getResult, {
      method: 'GET'
    })
  }

  // Get all DAGs for current user获取当前用户的所有DAG
  async getAllDAGs() {
    const tenantId = this.config.getTenantId() // Get current tenant ID获取当前租户ID
    const url = this.config.endpoints.getAllDAGs.replace('{tenantID}', tenantId) // Replace URL parameter替换URL参数
    return await this.request(url, { method: 'GET' })
  }

  // Create SSE connection to monitor status changes创建SSE连接监听状态变化
  createStatusStream(dagId, onMessage, onError) {
    const tenantId = this.config.getTenantId() // Get current tenant ID获取当前租户ID
    const url = `${this.config.baseURL}${this.config.endpoints.statusStream.replace('{dag_id}', dagId)}?tenant_id=${tenantId}` // Construct SSE URL构造SSE URL
    
    const eventSource = new EventSource(url) // Create EventSource instance创建EventSource实例
    
    // Handle incoming messages处理传入消息
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) // Parse JSON message解析JSON消息
        onMessage(data) // Call message handler调用消息处理器
      } catch (error) {
        console.error('Failed to parse SSE message解析SSE消息失败:', error)
      }
    }
    
    // Handle connection errors处理连接错误
    eventSource.onerror = (error) => {
      console.error('SSE connection error SSE连接错误:', error)
      if (onError) onError(error) // Call error handler if provided如果提供了错误处理器则调用
    }
    
    return eventSource // Return EventSource instance返回EventSource实例
  }

  // Upload file to S3 using pre-signed URL使用预签名URL上传文件到S3
  async uploadFile(file, preSignedUrl) {
    try {
      const response = await fetch(preSignedUrl, {
        method: 'PUT', // Use PUT method for S3 upload使用PUT方法上传到S3
        body: file, // File content as body文件内容作为请求体
        headers: {
          'Content-Type': file.type // Set content type设置内容类型
        }
      })
      
      if (!response.ok) {
        throw new Error(`File upload failed文件上传失败: ${response.statusText}`)
      }
      
      return { success: true, url: preSignedUrl.split('?')[0] } // Return success with clean URL返回成功状态和清洁的URL
    } catch (error) {
      console.error('File upload failed文件上传失败:', error)
      throw error // Re-throw for handling重新抛出错误以供处理
    }
  }

  // Generate unique DAG ID生成唯一的DAG ID
  generateDAGId(prefix = 'dag') {
    const timestamp = Date.now() // Current timestamp当前时间戳
    const random = Math.random().toString(36).substr(2, 5) // Random string随机字符串
    return `${prefix}_${timestamp}_${random}` // Combine prefix, timestamp and random组合前缀、时间戳和随机字符串
  }
}

// Export API instance导出API实例
export const workflowAPI = new WorkflowAPI()
export default workflowAPI

// 导出配置供其他模块使用
export { API_CONFIG } 
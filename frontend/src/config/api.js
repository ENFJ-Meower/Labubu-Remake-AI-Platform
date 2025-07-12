// API配置文件 - 后端DAG管理系统接入
const API_CONFIG = {
  // API基础配置
  baseURL: 'http://localhost:8080/api/v1', // 根据实际后端地址调整
  timeout: 30000,
  
  // 请求头配置
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // 租户ID - 需要从认证系统获取
  getTenantId() {
    // 从localStorage或认证token中获取tenant_id
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    
    // 如果没有配置tenant_id，生成一个默认的
    if (!userInfo.tenant_id) {
      const defaultTenant = `tenant_${Date.now()}`
      userInfo.tenant_id = defaultTenant
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      console.log('生成默认租户ID:', defaultTenant)
    }
    
    return userInfo.tenant_id
  },
  
  // API端点定义
  endpoints: {
    // 提交DAG工作流
    submitDAG: '/submit',
    
    // 通知工作流就绪
    notifyReady: '/ready',
    
    // 获取DAG状态
    getDAGStatus: '/status/{dag_id}',
    
    // 获取处理结果
    getResult: '/message',
    
    // 获取用户所有DAG
    getAllDAGs: '/AllDag/{tenantID}',
    
    // SSE状态推送
    statusStream: '/status/stream/{dag_id}'
  }
}

// HTTP请求封装类
class WorkflowAPI {
  constructor() {
    this.config = API_CONFIG
  }

  // 通用请求方法
  async request(url, options = {}) {
    const fullUrl = this.config.baseURL + url
    const defaultOptions = {
      headers: {
        ...this.config.headers,
        // 添加认证头（如果有的话）
        ...this.getAuthHeaders()
      },
      timeout: this.config.timeout
    }
    
    try {
      const response = await fetch(fullUrl, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  // 获取认证头
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  // 提交DAG工作流
  async submitDAG(dagData) {
    const payload = {
      dag_id: dagData.dag_id,
      tenant_id: this.config.getTenantId(),
      nodes: dagData.nodes,
      edges: dagData.edges
    }
    
    return await this.request(this.config.endpoints.submitDAG, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // 通知DAG就绪
  async notifyReady(dagId) {
    return await this.request(this.config.endpoints.notifyReady, {
      method: 'POST',
      body: JSON.stringify({
        dag_id: dagId,
        tenant_id: this.config.getTenantId()
      })
    })
  }

  // 获取DAG状态
  async getDAGStatus(dagId) {
    const url = this.config.endpoints.getDAGStatus.replace('{dag_id}', dagId)
    return await this.request(url, { method: 'GET' })
  }

  // 获取处理结果
  async getResult(dagId) {
    return await this.request(this.config.endpoints.getResult, {
      method: 'GET'
    })
  }

  // 获取用户所有DAG
  async getAllDAGs() {
    const tenantId = this.config.getTenantId()
    const url = this.config.endpoints.getAllDAGs.replace('{tenantID}', tenantId)
    return await this.request(url, { method: 'GET' })
  }

  // 创建SSE连接监听状态变化
  createStatusStream(dagId, onMessage, onError) {
    const tenantId = this.config.getTenantId()
    const url = `${this.config.baseURL}${this.config.endpoints.statusStream.replace('{dag_id}', dagId)}?tenant_id=${tenantId}`
    
    const eventSource = new EventSource(url)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('解析SSE消息失败:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error)
      if (onError) onError(error)
    }
    
    return eventSource
  }

  // 上传文件到S3（使用预签名URL）
  async uploadFile(file, preSignedUrl) {
    try {
      const response = await fetch(preSignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })
      
      if (!response.ok) {
        throw new Error(`文件上传失败: ${response.statusText}`)
      }
      
      return { success: true, url: preSignedUrl.split('?')[0] }
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    }
  }

  // 生成唯一的DAG ID
  generateDAGId(prefix = 'dag') {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5)
    return `${prefix}_${timestamp}_${random}`
  }
}

// 导出API实例
export const workflowAPI = new WorkflowAPI()
export default workflowAPI

// 导出配置供其他模块使用
export { API_CONFIG } 
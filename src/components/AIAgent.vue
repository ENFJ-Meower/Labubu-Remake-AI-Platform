<template>
  <div class="ai-agent-builder">
    <!-- 顶部工具栏 -->
    <div class="top-toolbar">
      <div class="toolbar-left">
        <div class="agent-info">
          <div class="agent-avatar">
            <img :src="currentAgent.avatar || '/logo.png'" alt="Agent Avatar" />
          </div>
          <div class="agent-meta">
            <h2 class="agent-name">{{ currentAgent.name || '未命名Agent' }}</h2>
            <p class="agent-status">{{ getAgentStatus() }}</p>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="saveAgent">
          <i class="icon">💾</i> 保存
        </button>
        <button class="btn btn-primary" @click="testAgent">
          <i class="icon">🧪</i> 测试
        </button>
        <button class="btn btn-success" @click="deployAgent">
          <i class="icon">🚀</i> 发布
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 左侧导航面板 -->
      <div class="sidebar">
        <div class="nav-tabs">
          <div 
            v-for="tab in navigationTabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <div class="tab-icon">{{ tab.icon }}</div>
            <div class="tab-content">
              <div class="tab-title">{{ tab.title }}</div>
              <div class="tab-description">{{ tab.description }}</div>
            </div>
            <div class="tab-indicator" v-if="tab.hasContent"></div>
          </div>
        </div>
      </div>

      <!-- 右侧编辑区域 -->
      <div class="editor-area">
        <!-- 基本信息编辑 -->
        <div v-if="activeTab === 'basic'" class="editor-content">
          <div class="section-header">
            <h3>基本信息</h3>
            <p>设置Agent的基本属性和身份信息</p>
          </div>
          
          <div class="form-section">
            <div class="form-group">
              <label>Agent名称</label>
              <input 
                v-model="currentAgent.name" 
                type="text" 
                placeholder="为你的Agent起个名字"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>Agent描述</label>
              <textarea 
                v-model="currentAgent.description" 
                placeholder="简要描述这个Agent的功能和用途"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Agent头像</label>
              <div class="avatar-upload">
                <div class="avatar-preview">
                  <img :src="currentAgent.avatar || '/logo.png'" alt="Avatar" />
                </div>
                <div class="upload-actions">
                  <button class="btn btn-outline">上传图片</button>
                  <button class="btn btn-outline">选择模板</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Agent类型</label>
              <select v-model="currentAgent.type" class="form-select">
                <option value="chat">对话助手</option>
                <option value="task">任务执行</option>
                <option value="creative">创意生成</option>
                <option value="analysis">数据分析</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Prompt编辑器 -->
        <div v-else-if="activeTab === 'prompt'" class="editor-content">
          <div class="section-header">
            <h3>Prompt构建器</h3>
            <p>设计Agent的核心提示词和行为模式</p>
          </div>
          
          <div class="prompt-editor">
            <div class="prompt-toolbar">
              <button class="btn btn-sm">系统Prompt</button>
              <button class="btn btn-sm btn-outline">Few-shot示例</button>
              <button class="btn btn-sm btn-outline">变量插入</button>
            </div>
            
            <div class="prompt-content">
              <textarea 
                v-model="currentAgent.systemPrompt"
                placeholder="在这里编写系统提示词，定义Agent的角色、能力和行为规范..."
                class="prompt-textarea"
                rows="12"
              ></textarea>
            </div>
            
            <div class="prompt-examples">
              <h4>Few-shot示例</h4>
              <div v-for="(example, index) in currentAgent.examples" :key="index" class="example-item">
                <div class="example-header">
                  <span>示例 {{ index + 1 }}</span>
                  <button @click="removeExample(index)" class="btn-remove">×</button>
                </div>
                <div class="example-pair">
                  <div class="example-input">
                    <label>用户输入</label>
                    <input v-model="example.input" placeholder="用户会这样问..." />
                  </div>
                  <div class="example-output">
                    <label>期望回复</label>
                    <input v-model="example.output" placeholder="Agent应该这样回答..." />
                  </div>
                </div>
              </div>
              <button @click="addExample" class="btn btn-outline btn-sm">+ 添加示例</button>
            </div>
          </div>
        </div>

        <!-- 知识库配置 -->
        <div v-else-if="activeTab === 'knowledge'" class="editor-content">
          <div class="section-header">
            <h3>知识库配置</h3>
            <p>上传文档、配置外部API，为Agent提供专业知识</p>
          </div>
          
          <div class="knowledge-sections">
            <div class="knowledge-section">
              <h4>📄 文档上传</h4>
              <div class="upload-area">
                <div class="upload-zone" @click="uploadDocument">
                  <div class="upload-icon">📁</div>
                  <p>点击上传文档</p>
                  <small>支持 PDF, TXT, DOCX, MD 格式</small>
                </div>
              </div>
              <div class="document-list">
                <div v-for="doc in currentAgent.documents" :key="doc.id" class="document-item">
                  <div class="doc-icon">📄</div>
                  <div class="doc-info">
                    <div class="doc-name">{{ doc.name }}</div>
                    <div class="doc-meta">{{ doc.size }} · {{ doc.uploadTime }}</div>
                  </div>
                  <div class="doc-actions">
                    <button class="btn-icon">✏️</button>
                    <button class="btn-icon">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="knowledge-section">
              <h4>🔗 API集成</h4>
              <div class="api-config">
                <div class="form-group">
                  <label>API名称</label>
                  <input type="text" placeholder="给API起个名字" class="form-input" />
                </div>
                <div class="form-group">
                  <label>API端点</label>
                  <input type="url" placeholder="https://api.example.com/v1" class="form-input" />
                </div>
                <div class="form-group">
                  <label>认证方式</label>
                  <select class="form-select">
                    <option>API Key</option>
                    <option>Bearer Token</option>
                    <option>Basic Auth</option>
                  </select>
                </div>
                <button class="btn btn-primary btn-sm">测试连接</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 对话流程编辑 -->
        <div v-else-if="activeTab === 'workflow'" class="editor-content">
          <div class="section-header">
            <h3>对话流程</h3>
            <p>设计复杂的对话逻辑和条件分支</p>
          </div>
          
          <div class="workflow-editor">
            <div class="workflow-toolbar">
              <button class="btn btn-sm">+ 添加节点</button>
              <button class="btn btn-sm btn-outline">条件判断</button>
              <button class="btn btn-sm btn-outline">API调用</button>
              <button class="btn btn-sm btn-outline">数据处理</button>
            </div>
            
            <div class="workflow-canvas">
              <div class="workflow-node start-node">
                <div class="node-header">🚀 开始</div>
                <div class="node-content">对话开始</div>
              </div>
              
              <div class="workflow-connection"></div>
              
              <div class="workflow-node processing-node">
                <div class="node-header">🤖 处理</div>
                <div class="node-content">分析用户输入</div>
              </div>
              
              <div class="workflow-connection"></div>
              
              <div class="workflow-node end-node">
                <div class="node-header">✅ 响应</div>
                <div class="node-content">生成回复</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多模态设置 -->
        <div v-else-if="activeTab === 'multimodal'" class="editor-content">
          <div class="section-header">
            <h3>多模态能力</h3>
            <p>配置语音、图像、视频等多媒体处理能力</p>
          </div>
          
          <div class="multimodal-config">
            <div class="capability-grid">
              <div class="capability-card">
                <div class="capability-icon">🗣️</div>
                <h4>文字转语音 (TTS)</h4>
                <p>让Agent能够语音回复</p>
                <div class="capability-toggle">
                  <label class="switch">
                    <input type="checkbox" v-model="currentAgent.capabilities.tts" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="capability-card">
                <div class="capability-icon">🎤</div>
                <h4>语音识别 (STT)</h4>
                <p>理解用户的语音输入</p>
                <div class="capability-toggle">
                  <label class="switch">
                    <input type="checkbox" v-model="currentAgent.capabilities.stt" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="capability-card">
                <div class="capability-icon">👁️</div>
                <h4>图像识别</h4>
                <p>分析和理解图片内容</p>
                <div class="capability-toggle">
                  <label class="switch">
                    <input type="checkbox" v-model="currentAgent.capabilities.vision" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="capability-card">
                <div class="capability-icon">🎨</div>
                <h4>图像生成</h4>
                <p>根据描述生成图片</p>
                <div class="capability-toggle">
                  <label class="switch">
                    <input type="checkbox" v-model="currentAgent.capabilities.imageGen" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 模型配置 -->
        <div v-else-if="activeTab === 'model'" class="editor-content">
          <div class="section-header">
            <h3>模型配置</h3>
            <p>选择和配置AI模型参数</p>
          </div>
          
          <div class="model-config">
            <div class="form-group">
              <label>基础模型</label>
              <select v-model="currentAgent.model" class="form-select">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="custom">自定义模型</option>
              </select>
            </div>
            
            <div class="model-params">
              <div class="param-group">
                <label>Temperature: {{ currentAgent.temperature }}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  v-model="currentAgent.temperature"
                  class="param-slider"
                />
                <small>控制回复的创造性和随机性</small>
              </div>
              
              <div class="param-group">
                <label>Max Tokens: {{ currentAgent.maxTokens }}</label>
                <input 
                  type="range" 
                  min="100" 
                  max="4000" 
                  step="100" 
                  v-model="currentAgent.maxTokens"
                  class="param-slider"
                />
                <small>单次回复的最大长度</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 测试与部署 -->
        <div v-else-if="activeTab === 'deploy'" class="editor-content">
          <div class="section-header">
            <h3>测试与部署</h3>
            <p>测试Agent功能并发布到生产环境</p>
          </div>
          
          <div class="deploy-sections">
            <div class="deploy-section">
              <h4>🧪 功能测试</h4>
              <div class="test-area">
                <button class="btn btn-primary">启动测试对话</button>
                <button class="btn btn-outline">批量测试</button>
                <button class="btn btn-outline">性能测试</button>
              </div>
            </div>
            
            <div class="deploy-section">
              <h4>🚀 部署配置</h4>
              <div class="deploy-config">
                <div class="form-group">
                  <label>访问权限</label>
                  <select class="form-select">
                    <option>公开访问</option>
                    <option>仅团队成员</option>
                    <option>密码保护</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>部署环境</label>
                  <select class="form-select">
                    <option>开发环境</option>
                    <option>测试环境</option>
                    <option>生产环境</option>
                  </select>
                </div>
                <button class="btn btn-success">发布Agent</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试对话框 -->
    <div v-if="showTestChat" class="test-chat-overlay" @click.self="closeTestChat">
      <div class="test-chat-container">
        <div class="chat-header">
          <h3>🧪 测试对话</h3>
          <button @click="closeTestChat" class="btn-close">×</button>
        </div>
        <div class="chat-messages">
          <div v-for="message in testMessages" :key="message.id" class="message" :class="message.type">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input 
            v-model="testInput" 
            @keyup.enter="sendTestMessage"
            placeholder="输入消息测试Agent..."
            class="chat-input-field"
          />
          <button @click="sendTestMessage" class="btn btn-primary">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAgent',
  data() {
    return {
      activeTab: 'basic',
      showTestChat: false,
      testInput: '',
      testMessages: [
        {
          id: 1,
          type: 'system',
          content: '测试环境已准备就绪，您可以开始测试Agent功能',
          time: '10:00'
        }
      ],
      currentAgent: {
        name: '',
        description: '',
        avatar: '',
        type: 'chat',
        systemPrompt: '',
        examples: [],
        documents: [
          {
            id: 1,
            name: 'API文档.pdf',
            size: '2.3MB',
            uploadTime: '2024-01-15'
          }
        ],
        capabilities: {
          tts: false,
          stt: false,
          vision: false,
          imageGen: false
        },
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000
      },
      navigationTabs: [
        {
          id: 'basic',
          icon: '🤖',
          title: '基本信息',
          description: 'Agent名称、描述、头像',
          hasContent: false
        },
        {
          id: 'prompt',
          icon: '📝',
          title: 'Prompt构建器',
          description: '系统prompt、Few-shot示例',
          hasContent: false
        },
        {
          id: 'knowledge',
          icon: '📚',
          title: '知识库/插件',
          description: 'RAG、API工具对接',
          hasContent: true
        },
        {
          id: 'workflow',
          icon: '🔄',
          title: '对话流',
          description: 'Workflow/Flowchart构建',
          hasContent: false
        },
        {
          id: 'multimodal',
          icon: '🎭',
          title: '多模态设置',
          description: 'TTS、STT、Vision、工具接入',
          hasContent: false
        },
        {
          id: 'model',
          icon: '⚙️',
          title: '模型配置',
          description: '模型选择、参数调优',
          hasContent: false
        },
        {
          id: 'deploy',
          icon: '🚀',
          title: '发布与部署',
          description: '测试、部署、权限管理',
          hasContent: false
        }
      ]
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    getAgentStatus() {
      if (!this.currentAgent.name) return '未配置'
      if (!this.currentAgent.systemPrompt) return '配置中'
      return '已配置'
    },
    saveAgent() {
      // 保存Agent配置
      console.log('保存Agent配置')
    },
    testAgent() {
      this.showTestChat = true
    },
    deployAgent() {
      // 部署Agent
      console.log('部署Agent')
    },
    closeTestChat() {
      this.showTestChat = false
    },
    sendTestMessage() {
      if (!this.testInput.trim()) return
      
      // 添加用户消息
      this.testMessages.push({
        id: Date.now(),
        type: 'user',
        content: this.testInput,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
      
      const userInput = this.testInput
      this.testInput = ''
      
      // 模拟Agent回复
      setTimeout(() => {
        this.testMessages.push({
          id: Date.now(),
          type: 'assistant',
          content: `这是对"${userInput}"的模拟回复。Agent正在根据您的配置进行响应。`,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        })
      }, 1000)
    },
    addExample() {
      this.currentAgent.examples.push({
        input: '',
        output: ''
      })
    },
    removeExample(index) {
      this.currentAgent.examples.splice(index, 1)
    },
    uploadDocument() {
      // 文档上传逻辑
      console.log('上传文档')
    }
  }
}
</script>

<style scoped>
.ai-agent-builder {
  min-height: 100vh;
  background: #1a1a1a;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
}

/* 顶部工具栏 */
.top-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
  position: sticky;
  top: 0;
  z-index: 100;
}

.toolbar-left .agent-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agent-meta .agent-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.agent-meta .agent-status {
  margin: 0;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.toolbar-right .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

/* 主容器 */
.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
}

/* 左侧边栏 */
.sidebar {
  width: 300px;
  background: #2d2d2d;
  border-right: 1px solid #404040;
  overflow-y: auto;
}

.nav-tabs {
  padding: 1rem 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
}

.nav-tab:hover {
  background: #3a3a3a;
}

.nav-tab.active {
  background: #3a3a3a;
  border-left-color: #ff6b6b;
}

.tab-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  min-width: 30px;
}

.tab-content {
  flex: 1;
}

.tab-title {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.tab-description {
  font-size: 0.8rem;
  color: #b0b0b0;
}

.tab-indicator {
  width: 6px;
  height: 6px;
  background: #4ecdc4;
  border-radius: 50%;
  margin-left: 0.5rem;
}

/* 右侧编辑区域 */
.editor-area {
  flex: 1;
  overflow-y: auto;
  background: #1a1a1a;
}

.editor-content {
  padding: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h3 {
  margin: 0 0 0.5rem 0;
  color: #ff6b6b;
  font-size: 1.5rem;
}

.section-header p {
  margin: 0;
  color: #b0b0b0;
}

/* 表单样式 */
.form-section {
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
  font-weight: 600;
  color: #e0e0e0;
}

.form-input, .form-textarea, .form-select {
  padding: 0.75rem;
  border: 1px solid #404040;
  border-radius: 8px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-size: 0.95rem;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #ff6b6b;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 头像上传 */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #404040;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-actions {
  display: flex;
  gap: 0.5rem;
}

/* Prompt编辑器 */
.prompt-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prompt-toolbar {
  display: flex;
  gap: 0.5rem;
}

.prompt-content {
  flex: 1;
}

.prompt-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #404040;
  border-radius: 8px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #ff6b6b;
}

.prompt-examples {
  margin-top: 2rem;
}

.prompt-examples h4 {
  margin-bottom: 1rem;
  color: #4ecdc4;
}

.example-item {
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #2d2d2d;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.btn-remove {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: rgba(255, 107, 107, 0.1);
}

.example-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.example-input, .example-output {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-input label, .example-output label {
  font-size: 0.9rem;
  color: #b0b0b0;
}

.example-input input, .example-output input {
  padding: 0.5rem;
  border: 1px solid #404040;
  border-radius: 4px;
  background: #1a1a1a;
  color: #e0e0e0;
}

/* 知识库配置 */
.knowledge-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.knowledge-section {
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 1.5rem;
  background: #2d2d2d;
}

.knowledge-section h4 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-area {
  margin-bottom: 1rem;
}

.upload-zone {
  border: 2px dashed #404040;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #404040;
}

.doc-icon {
  font-size: 1.5rem;
}

.doc-info {
  flex: 1;
}

.doc-name {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.doc-meta {
  font-size: 0.8rem;
  color: #b0b0b0;
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.btn-icon:hover {
  background: #404040;
}

/* API配置 */
.api-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 工作流编辑器 */
.workflow-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-toolbar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.workflow-canvas {
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.workflow-node {
  background: #1a1a1a;
  border: 2px solid #404040;
  border-radius: 12px;
  padding: 1rem;
  min-width: 200px;
  text-align: center;
  position: relative;
}

.workflow-node.start-node {
  border-color: #4ecdc4;
}

.workflow-node.end-node {
  border-color: #ff6b6b;
}

.node-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
}

.workflow-connection {
  width: 2px;
  height: 30px;
  background: #404040;
  position: relative;
}

.workflow-connection::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: -3px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #404040;
}

/* 多模态配置 */
.multimodal-config {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.capability-card {
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
}

.capability-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.capability-card h4 {
  margin: 0 0 0.5rem 0;
  color: #ff6b6b;
}

.capability-card p {
  margin: 0 0 1rem 0;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.capability-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
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
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
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

/* 模型配置 */
.model-config {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.model-params {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #404040;
  outline: none;
  -webkit-appearance: none;
}

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
}

.param-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  border: none;
}

.param-group small {
  color: #b0b0b0;
  font-size: 0.8rem;
}

/* 部署配置 */
.deploy-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.deploy-section {
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 1.5rem;
  background: #2d2d2d;
}

.deploy-section h4 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.test-area {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.deploy-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 测试对话框 */
.test-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.test-chat-container {
  background: #2d2d2d;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #404040;
}

.chat-header h3 {
  margin: 0;
  color: #ff6b6b;
}

.btn-close {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: #1a1a1a;
  border: 1px solid #404040;
}

.message.system {
  align-self: center;
  background: #404040;
  color: #b0b0b0;
  font-size: 0.9rem;
  max-width: 90%;
}

.message-content {
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #404040;
}

.chat-input-field {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #404040;
  border-radius: 8px;
  background: #1a1a1a;
  color: #e0e0e0;
}

.chat-input-field:focus {
  outline: none;
  border-color: #ff6b6b;
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
  background: #404040;
  color: #e0e0e0;
}

.btn-secondary:hover {
  background: #4a4a4a;
}

.btn-success {
  background: #4ecdc4;
  color: white;
}

.btn-success:hover {
  background: #45b7aa;
}

.btn-outline {
  background: transparent;
  border: 1px solid #404040;
  color: #e0e0e0;
}

.btn-outline:hover {
  background: #404040;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .nav-tabs {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-tab {
    min-width: 200px;
    flex-shrink: 0;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-tab.active {
    border-left: none;
    border-bottom-color: #ff6b6b;
  }
  
  .editor-content {
    padding: 1rem;
  }
  
  .capability-grid {
    grid-template-columns: 1fr;
  }
  
  .example-pair {
    grid-template-columns: 1fr;
  }
  
  .toolbar-right {
    flex-wrap: wrap;
  }
  
  .test-chat-container {
    width: 95%;
    height: 90%;
  }
}
</style> 
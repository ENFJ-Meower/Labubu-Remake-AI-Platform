<template>
  <div class="ai-agent-builder">
    <!-- Top toolbar -->
    <div class="top-toolbar">
      <div class="toolbar-left">
        <div class="agent-info">
          <div class="agent-meta">
            <h2 class="agent-name">{{ currentAgent.name || 'Unnamed Agent' }}</h2>
            <p class="agent-status">{{ getAgentStatus() }}</p>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="saveAgent">
          <i class="icon">💾</i> {{ $t('aiAgent.actions.saveAgent', 'Save Agent') }}
        </button>
        <button class="btn btn-primary" @click="testAgent">
          <i class="icon">🧪</i> {{ $t('aiAgent.actions.testAgent', 'Test Agent') }}
        </button>
        <button class="btn btn-success" @click="deployAgent">
          <i class="icon">🚀</i> {{ $t('aiAgent.actions.deployAgent', 'Deploy Agent') }}
        </button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="main-container">
      <!-- Left navigation panel -->
      <div class="sidebar">
        <div class="nav-tabs">
          <div 
            v-for="tab in navigationTabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            :data-tab="tab.id"
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

      <!-- Right editing area -->
      <div class="editor-area">
        <!-- Basic information editing -->
        <div v-if="activeTab === 'basic'" class="editor-content">
          <div class="section-header">
            <h3>Basic Information</h3>
            <p>Configure Agent's basic properties and identity information</p>
          </div>
          
          <div class="form-section">
            <div class="form-group">
              <label>Agent Name</label>
              <input 
                v-model="currentAgent.name" 
                type="text" 
                placeholder="Give your Agent a name"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>Agent Description</label>
              <textarea 
                v-model="currentAgent.description" 
                placeholder="Briefly describe your Agent's features and purpose"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Prompt editor -->
        <div v-else-if="activeTab === 'prompt'" class="editor-content">
          <div class="section-header">
            <h3>Prompt Builder</h3>
            <p>Design Agent's core prompts and behavior patterns</p>
          </div>
          
          <div class="prompt-editor">
            <div class="prompt-toolbar">
              <button class="btn btn-sm">System Prompt</button>
              <button class="btn btn-sm btn-outline">Few-shot Examples</button>
              <button class="btn btn-sm btn-outline">Insert Variables</button>
            </div>
            
            <div class="prompt-content">
              <textarea 
                v-model="currentAgent.systemPrompt"
                placeholder="Write system prompt here to define Agent's role, capabilities and behavior guidelines..."
                class="prompt-textarea"
                rows="12"
              ></textarea>
            </div>
            
            <div class="prompt-examples">
              <h4>Few-shot Examples</h4>
              <div v-for="(example, index) in currentAgent.examples" :key="index" class="example-item">
                <div class="example-header">
                  <span>Example {{ index + 1 }}</span>
                  <button @click="removeExample(index)" class="btn-remove">×</button>
                </div>
                <div class="example-pair">
                  <div class="example-input">
                    <label>User Input</label>
                    <input v-model="example.input" placeholder="User might ask this..." />
                  </div>
                  <div class="example-output">
                    <label>Expected Response</label>
                    <input v-model="example.output" placeholder="Agent should respond like this..." />
                  </div>
                </div>
              </div>
              <button @click="addExample" class="btn btn-outline btn-sm">+ Add Example</button>
            </div>
          </div>
        </div>

        <!-- Knowledge base configuration -->
        <div v-else-if="activeTab === 'knowledge'" class="editor-content">
          <div class="section-header">
            <h3>Knowledge Base Configuration</h3>
            <p>Upload documents and configure external APIs to provide professional knowledge for Agent</p>
          </div>
          
          <div class="knowledge-sections">
            <div class="knowledge-section">
              <h4>📄 Document Upload</h4>
              <div class="upload-area">
                <div class="upload-zone" @click="uploadDocument">
                  <div class="upload-icon">📁</div>
                  <p>Click to upload documents</p>
                  <small>Supports PDF, TXT, DOCX, MD formats</small>
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
              <h4>🔗 API Integration</h4>
              <div class="api-config">
                <div class="form-group">
                  <label>API Name</label>
                  <input type="text" placeholder="Give API a name" class="form-input" />
                </div>
                <div class="form-group">
                  <label>API Endpoint</label>
                  <input type="url" placeholder="https://api.example.com/v1" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Authentication</label>
                  <select class="form-select">
                    <option>API Key</option>
                    <option>Bearer Token</option>
                    <option>Basic Auth</option>
                  </select>
                </div>
                <button class="btn btn-primary btn-sm">Test Connection</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation flow editing -->
        <div v-else-if="activeTab === 'workflow'" class="editor-content workflow-container">
          <div class="workflow-main">
            <!-- 左侧工具栏 -->
            <div class="workflow-sidebar">
              <div class="node-palette">
                <h4>节点类型</h4>
                <div class="palette-nodes">
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'start')">
                    <div class="node-icon">🚀</div>
                    <span>Start</span>
                  </div>
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'browse')">
                    <div class="node-icon">🌐</div>
                    <span>Browse</span>
                  </div>
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'llm')">
                    <div class="node-icon">🧠</div>
                    <span>LLM</span>
                  </div>
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'process')">
                    <div class="node-icon">⚙️</div>
                    <span>Process</span>
                  </div>
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'condition')">
                    <div class="node-icon">❓</div>
                    <span>Condition</span>
                  </div>
                  <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'end')">
                    <div class="node-icon">✅</div>
                    <span>End</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 中央画布区域 -->
            <div class="workflow-canvas-container">
              <div class="canvas-header">
                <h3>{{ currentAgent.name || 'AI Agent' }} - Workflow Designer</h3>
                <div class="canvas-actions">
                  <button class="btn btn-sm btn-outline" @click="clearCanvas">
                    <i class="icon">🗑️</i> Clear
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="saveWorkflow">
                    <i class="icon">💾</i> Save
                  </button>
                </div>
              </div>
              
              <div class="workflow-canvas" 
                   @drop="onDrop" 
                   @dragover="onDragOver"
                   @click="deselectNode"
                   ref="canvas">
                
                <!-- 连接线 -->
                <svg class="connection-lines" :width="canvasWidth" :height="canvasHeight">
                  <defs>
                    <!-- 简洁箭头 -->
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" 
                            refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 7 3, 0 6" fill="#3b82f6" />
                    </marker>
                    
                    <!-- 悬停状态箭头 -->
                    <marker id="arrowhead-hover" markerWidth="8" markerHeight="6" 
                            refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 7 3, 0 6" fill="#1d4ed8" />
                    </marker>
                    
                    <!-- 连接点标记 -->
                    <marker id="connection-dot" markerWidth="6" markerHeight="6" 
                            refX="3" refY="3" orient="auto">
                      <circle cx="3" cy="3" r="2" fill="#3b82f6" />
                    </marker>
                  </defs>
                  
                  <path v-for="connection in connections" 
                        :key="connection.id"
                        :data-connection-id="connection.id"
                        :d="getConnectionPath(connection)"
                        stroke="#3b82f6"
                        stroke-width="2"
                        fill="none"
                        marker-end="url(#arrowhead)"
                        class="connection-line"
                        @mouseenter="setConnectionHover(connection, true)"
                        @mouseleave="setConnectionHover(connection, false)"/>
                </svg>
                
                <!-- 工作流节点 -->
                                  <div v-for="node in workflowNodes" 
                     :key="node.id" 
                     :data-node-id="node.id"
                     class="workflow-node"
                     :class="[
                       `node-${node.type}`, 
                       { 'node-selected': selectedNode === node.id }
                     ]"
                     :style="{ left: node.x + 'px', top: node.y + 'px' }"
                     @click="selectNode(node)"
                     @mousedown="startDrag(node, $event)"
                     draggable="false">
                  
                  <!-- 节点头部 -->
                  <div class="node-header">
                    <div class="node-icon">{{ getNodeIcon(node.type) }}</div>
                    <span class="node-title">{{ node.title }}</span>
                    <div class="node-actions">
                      <button class="node-btn" @click.stop="editNode(node)">⚙️</button>
                      <button class="node-btn" @click.stop="deleteNode(node)">🗑️</button>
                    </div>
                  </div>
                  
                  <!-- 节点内容 -->
                  <div class="node-body">
                    <div class="node-description">{{ node.description }}</div>
                    
                    <!-- 输入参数 -->
                    <div v-if="node.inputs && node.inputs.length > 0" class="node-inputs">
                      <div class="input-label">Input:</div>
                      <div v-for="input in node.inputs" :key="input.name" class="input-item">
                        <span class="input-name">{{ input.name }}</span>
                        <span class="input-type">{{ input.type }}</span>
                      </div>
                    </div>
                    
                    <!-- 输出参数 -->
                    <div v-if="node.outputs && node.outputs.length > 0" class="node-outputs">
                      <div class="output-label">Output:</div>
                      <div v-for="output in node.outputs" :key="output.name" class="output-item">
                        <span class="output-name">{{ output.name }}</span>
                        <span class="output-type">{{ output.type }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 连接点 -->
                  <div class="connection-points">
                    <div v-if="node.type !== 'start'" 
                         class="connection-point input-point"
                         @click.stop="startConnection(node, 'input')"
                         title="Input connection point">
                    </div>
                    <div v-if="node.type !== 'end'" 
                         class="connection-point output-point"
                         @click.stop="startConnection(node, 'output')"
                         title="Output connection point - click to connect">
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 底部工具栏 -->
              <div class="canvas-footer">
                <div class="canvas-stats">
                  <span>Nodes: {{ workflowNodes.length }}</span>
                  <span>Connections: {{ connections.length }}</span>
                  <span>Status: {{ workflowStatus }}</span>
                </div>
                <div class="canvas-controls">
                  <button class="btn btn-success" @click="testWorkflow">
                    <i class="icon">🧪</i> Test Run
                  </button>
                  <button class="btn btn-primary" @click="deployWorkflow">
                    <i class="icon">🚀</i> Deploy
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 右侧配置面板 -->
            <div class="workflow-config-panel" v-if="selectedNode">
              <div class="config-header">
                <h4>Node Configuration</h4>
                <button class="btn-close" @click="deselectNode">×</button>
              </div>
              
              <div class="config-content">
                <div class="config-section">
                  <label>Node Name</label>
                  <input v-model="selectedNodeData.title" type="text" class="form-input">
                </div>
                
                <div class="config-section">
                  <label>Description</label>
                  <textarea v-model="selectedNodeData.description" class="form-textarea" rows="3"></textarea>
                </div>
                
                <!-- 根据节点类型显示不同的配置 -->
                <div v-if="selectedNodeData.type === 'llm'" class="config-section">
                  <label>Model Type</label>
                  <select v-model="selectedNodeData.model" class="form-select">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5</option>
                    <option value="claude">Claude</option>
                  </select>
                </div>
                
                <div v-if="selectedNodeData.type === 'browse'" class="config-section">
                  <label>Browser Configuration</label>
                  <input v-model="selectedNodeData.url" type="url" placeholder="Target URL" class="form-input">
                </div>
                
                <div class="config-section">
                  <button class="btn btn-primary" @click="saveNodeConfig">Save Configuration</button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Testing and deployment -->
        <div v-else-if="activeTab === 'deploy'" class="editor-content">
          <div class="section-header">
            <h3>Testing & Deployment</h3>
            <p>Test Agent functionality and publish to production environment</p>
          </div>
          
          <div class="deploy-sections">
            <div class="deploy-section">
              <h4>🧪 Function Testing</h4>
              <div class="test-area">
                <button class="btn btn-primary">Start Test Chat</button>
                <button class="btn btn-outline">Batch Testing</button>
                <button class="btn btn-outline">Performance Test</button>
              </div>
            </div>
            
            <div class="deploy-section">
              <h4>🚀 Deployment Configuration</h4>
              <div class="deploy-config">
                <div class="form-group">
                  <label>Access Permissions</label>
                  <select class="form-select">
                    <option>Public Access</option>
                    <option>Team Members Only</option>
                    <option>Password Protected</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Deployment Environment</label>
                  <select class="form-select">
                    <option>Development</option>
                    <option>Testing</option>
                    <option>Production</option>
                  </select>
                </div>
                <button class="btn btn-success">Publish Agent</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Test dialog -->
    <div v-if="showTestChat" class="test-chat-overlay" @click.self="closeTestChat">
      <div class="test-chat-container">
        <div class="chat-header">
          <h3>🧪 Test Chat</h3>
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
            placeholder="Enter message to test Agent..."
            class="chat-input-field"
          />
          <button @click="sendTestMessage" class="btn btn-primary">Send</button>
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
      activeTab: 'workflow',
      showTestChat: false,
      testInput: '',
      testMessages: [
        {
          id: 1,
          type: 'system',
          content: 'Test environment is ready, you can start testing Agent functionality',
          time: '10:00'
        }
      ],
      currentAgent: {
        name: '',
        description: '',
        systemPrompt: '',
        examples: [],
        documents: [
          {
            id: 1,
            name: 'API Documentation.pdf',
            size: '2.3MB',
            uploadTime: '2024-01-15'
          }
        ]
      },
      navigationTabs: [
        {
          id: 'basic',
          icon: '🤖',
          title: 'Basic Info',
          description: 'Agent name and description',
          hasContent: false
        },
        {
          id: 'prompt',
          icon: '📝',
          title: 'Prompt Builder',
          description: 'System prompt, Few-shot examples',
          hasContent: false
        },
        {
          id: 'knowledge',
          icon: '📚',
          title: 'Knowledge Base',
          description: 'RAG, API tool integration',
          hasContent: true
        },
        {
          id: 'workflow',
          icon: '🔄',
          title: 'Conversation Flow',
          description: 'Main workflow design - Core feature',
          hasContent: true
        },

        {
          id: 'deploy',
          icon: '🚀',
          title: 'Deploy & Publish',
          description: 'Testing, deployment, permissions',
          hasContent: false
        }
      ],
      // 工作流相关数据
      workflowNodes: [
        {
          id: 'start-1',
          type: 'start',
          title: 'Start',
          description: 'Workflow start',
          x: 100,
          y: 100,
          inputs: [],
          outputs: [{ name: 'trigger', type: 'event' }]
        },
        {
          id: 'browse-1',
          type: 'browse',
          title: 'Browse',
          description: 'Browse web content',
          x: 350,
          y: 100,
          inputs: [{ name: 'url', type: 'string' }],
          outputs: [{ name: 'content', type: 'text' }]
        },
        {
          id: 'llm-1',
          type: 'llm',
          title: 'LLM',
          description: 'Large language model processing',
          x: 600,
          y: 100,
          inputs: [{ name: 'prompt', type: 'text' }],
          outputs: [{ name: 'response', type: 'text' }],
          model: 'gpt-4'
        },
        {
          id: 'end-1',
          type: 'end',
          title: 'End',
          description: 'Workflow end',
          x: 850,
          y: 100,
          inputs: [{ name: 'result', type: 'any' }],
          outputs: []
        }
      ],
      connections: [
        {
          id: 'conn-1',
          from: 'start-1',
          to: 'browse-1',
          fromPort: 'trigger',
          toPort: 'url'
        },
        {
          id: 'conn-2',
          from: 'browse-1',
          to: 'llm-1',
          fromPort: 'content',
          toPort: 'prompt'
        },
        {
          id: 'conn-3',
          from: 'llm-1',
          to: 'end-1',
          fromPort: 'response',
          toPort: 'result'
        }
      ],
      selectedNode: null,
      selectedNodeData: {},
      draggedNode: null,
      dragOffset: { x: 0, y: 0 },
      canvasWidth: 1200,
      canvasHeight: 800,
      workflowStatus: 'Ready',
      nodeIdCounter: 1
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    getAgentStatus() {
      if (!this.currentAgent.name) return 'Not Configured'
      if (!this.currentAgent.systemPrompt) return 'In Progress'
      return 'Configured'
    },
    saveAgent() {
      // Save Agent configuration
      console.log('Save Agent configuration')
    },
    testAgent() {
      this.showTestChat = true
    },
    deployAgent() {
      // Deploy Agent
      console.log('Deploy Agent')
    },
    closeTestChat() {
      this.showTestChat = false
    },
    sendTestMessage() {
      if (!this.testInput.trim()) return
      
      // Add user message
      this.testMessages.push({
        id: Date.now(),
        type: 'user',
        content: this.testInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      })
      
      const userInput = this.testInput
      this.testInput = ''
      
      // Simulate Agent response
      setTimeout(() => {
        this.testMessages.push({
          id: Date.now(),
          type: 'assistant',
          content: `This is a simulated response to "${userInput}". Agent is responding based on your configuration.`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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
      // Document upload logic
      console.log('Upload document')
    },
    // Workflow methods
    getNodeIcon(nodeType) {
      const icons = {
        start: '🚀',
        browse: '🌐',
        llm: '🧠',
        process: '⚙️',
        condition: '❓',
        end: '✅'
      }
      return icons[nodeType] || '📦'
    },
    getNodeTypeLabel(type) {
      const labels = {
        start: 'Start',
        browse: 'Browse',
        llm: 'LLM',
        process: 'Process',
        condition: 'Condition',
        end: 'End'
      }
      return labels[type] || type
    },
    onDragStart(event, nodeType) {
      event.dataTransfer.setData('nodeType', nodeType)
      event.dataTransfer.effectAllowed = 'copy'
    },
    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    onDrop(event) {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData('nodeType')
      if (!nodeType) return
      
      const canvasRect = this.$refs.canvas.getBoundingClientRect()
      const x = event.clientX - canvasRect.left
      const y = event.clientY - canvasRect.top
      
      this.createNode(nodeType, x, y)
    },
    createNode(nodeType, x, y) {
      const nodeId = `${nodeType}-${++this.nodeIdCounter}`
      const nodeTemplates = {
        start: {
          title: 'Start',
          description: 'Workflow start',
          inputs: [],
          outputs: [{ name: 'trigger', type: 'event' }]
        },
        browse: {
          title: 'Browse',
          description: 'Browse web content',
          inputs: [{ name: 'url', type: 'string' }],
          outputs: [{ name: 'content', type: 'text' }]
        },
        llm: {
          title: 'LLM',
          description: 'Large language model processing',
          inputs: [{ name: 'prompt', type: 'text' }],
          outputs: [{ name: 'response', type: 'text' }],
          model: 'gpt-4'
        },
        process: {
          title: 'Process',
          description: 'Data processing',
          inputs: [{ name: 'input', type: 'any' }],
          outputs: [{ name: 'output', type: 'any' }]
        },
        condition: {
          title: 'Condition',
          description: 'Condition judgment',
          inputs: [{ name: 'condition', type: 'boolean' }],
          outputs: [{ name: 'true', type: 'any' }, { name: 'false', type: 'any' }]
        },
        end: {
          title: 'End',
          description: 'Workflow end',
          inputs: [{ name: 'result', type: 'any' }],
          outputs: []
        }
      }
      
      const template = nodeTemplates[nodeType] || nodeTemplates.process
      const newNode = {
        id: nodeId,
        type: nodeType,
        ...template,
        x: x - 75, // 调整节点位置，使其居中
        y: y - 50
      }
      
      this.workflowNodes.push(newNode)
    },
    selectNode(node) {
      this.selectedNode = node.id
      this.selectedNodeData = { ...node }
    },
    deselectNode() {
      this.selectedNode = null
      this.selectedNodeData = {}
    },
    editNode(node) {
      this.selectNode(node)
    },
    deleteNode(node) {
      // Delete node
      this.workflowNodes = this.workflowNodes.filter(n => n.id !== node.id)
              // Delete related connections
      this.connections = this.connections.filter(conn => 
        conn.from !== node.id && conn.to !== node.id
      )
              // If it's the currently selected node, deselect it
      if (this.selectedNode === node.id) {
        this.deselectNode()
      }
    },
    startDrag(node, event) {
      this.draggedNode = node
      this.dragOffset = {
        x: event.clientX - node.x,
        y: event.clientY - node.y
      }
      
      const handleMouseMove = (e) => {
        if (this.draggedNode) {
          this.draggedNode.x = e.clientX - this.dragOffset.x
          this.draggedNode.y = e.clientY - this.dragOffset.y
        }
      }
      
      const handleMouseUp = () => {
        this.draggedNode = null
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    startConnection(node, portType) {
      console.log('Start connection:', node.id, portType)
              // Connection logic to be implemented
    },
        getConnectionPath(connection) {
      const fromNode = this.workflowNodes.find(n => n.id === connection.from)
      const toNode = this.workflowNodes.find(n => n.id === connection.to)
      
      if (!fromNode || !toNode) return ''
      
      // 直接获取连接点元素的实际位置
      const fromOutputPoint = document.querySelector(`[data-node-id="${fromNode.id}"] .output-point`)
      const toInputPoint = document.querySelector(`[data-node-id="${toNode.id}"] .input-point`)
      const canvas = document.querySelector('.workflow-canvas')
      
      if (!fromOutputPoint || !toInputPoint || !canvas) {
        return ''
      }
      
      // 获取canvas的偏移量
      const canvasRect = canvas.getBoundingClientRect()
      const fromRect = fromOutputPoint.getBoundingClientRect()
      const toRect = toInputPoint.getBoundingClientRect()
      
      // 计算连接点在canvas内的相对位置（连接点中心）
      const fromX = fromRect.left - canvasRect.left + fromRect.width / 2
      const fromY = fromRect.top - canvasRect.top + fromRect.height / 2
      const toX = toRect.left - canvasRect.left + toRect.width / 2
      const toY = toRect.top - canvasRect.top + toRect.height / 2
      
      // 柔和的贝塞尔曲线连接
      const deltaX = toX - fromX
      const deltaY = toY - fromY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // 根据距离动态调整曲线弯曲度，使曲线更自然
      const curvature = Math.min(distance * 0.3, 100)
      
      const cp1X = fromX + curvature
      const cp1Y = fromY
      const cp2X = toX - curvature
      const cp2Y = toY
      
            return `M ${fromX} ${fromY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${toX} ${toY}`
    },
 
              setConnectionHover(connection, isHover) {
        // Connection hover effect
        if (isHover) {
          // Can add special hover styles
          console.log('Connection hover:', connection.id)
        }
      },
    clearCanvas() {
      this.workflowNodes = []
      this.connections = []
      this.deselectNode()
    },
    saveWorkflow() {
      const workflow = {
        nodes: this.workflowNodes,
        connections: this.connections
      }
              console.log('Save workflow:', workflow)
              // Backend save logic can be added here
    },
    testWorkflow() {
      this.workflowStatus = 'Testing...'
      // Simulate test process
      setTimeout(() => {
        this.workflowStatus = 'Test Complete'
        alert('Workflow test completed!')
      }, 2000)
    },
    deployWorkflow() {
      this.workflowStatus = 'Deploying...'
      // Simulate deployment process
      setTimeout(() => {
        this.workflowStatus = 'Deployed'
        alert('Workflow deployed successfully!')
      }, 3000)
    },
    saveNodeConfig() {
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1) {
        this.workflowNodes[nodeIndex] = { ...this.selectedNodeData }
      }
    },
    setConnectionHover(connection, isHover) {
      // Dynamic arrow style change
      const connectionElements = document.querySelectorAll(`path[data-connection-id="${connection.id}"]`)
      connectionElements.forEach(element => {
        if (isHover) {
          element.setAttribute('marker-end', 'url(#arrowhead-hover)')
          element.setAttribute('stroke-width', '3')
        } else {
          element.setAttribute('marker-end', 'url(#arrowhead)')
          element.setAttribute('stroke-width', '2')
        }
      })
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

/* Top toolbar */
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

/* Main container */
.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
}

/* Left sidebar */
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

/* Highlight workflow tab as main feature */
.nav-tab[data-tab="workflow"] {
  border: 2px solid #ff6b6b;
  position: relative;
}

.nav-tab[data-tab="workflow"]:before {
  content: "⭐";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #ff6b6b;
  font-size: 1rem;
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

/* Right editing area */
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

/* Form styles */
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

/* Avatar upload */
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

/* Prompt editor */
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

/* Knowledge base configuration */
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

/* API configuration */
.api-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Workflow editor */
.workflow-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 700px;
}

.workflow-toolbar {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 8px;
  border: 1px solid #404040;
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toolbar-section h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #4ecdc4;
}

.toolbar-section .btn {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.workflow-canvas {
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
  overflow: auto;
}

.workflow-node {
  background: #2d2d2d;
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

.workflow-node.message-node {
  border-color: #ff6b6b;
}

.workflow-node.condition-node {
  border-color: #ffd93d;
}

.workflow-node.processing-node {
  border-color: #45b7d1;
}

.workflow-node.api-node {
  border-color: #a8e6cf;
}

.workflow-node.end-node {
  border-color: #96ceb4;
}

.node-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
}

.node-content {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-bottom: 0.5rem;
}

.node-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.node-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #b0b0b0;
  transition: all 0.2s ease;
}

.node-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
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

.workflow-branches {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin: 2rem 0;
  width: 100%;
}

.branch-left, .branch-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.workflow-panel {
  background: #2d2d2d;
  border-radius: 8px;
  border: 1px solid #404040;
  padding: 1rem;
  height: 200px;
}

.workflow-panel h4 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
}

.node-config {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.config-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.placeholder-icon {
  font-size: 2rem;
}

/* Deployment configuration */
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

/* Test dialog */
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

/* 工作流编辑器样式 */
.workflow-container {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.workflow-main {
  flex: 1;
  display: flex;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

/* 左侧工具栏 */
.workflow-sidebar {
  width: 250px;
  background: #2d2d2d;
  border-right: 1px solid #404040;
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

.node-palette h4 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
}

.palette-nodes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palette-node {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #404040;
  border: 1px solid #555555;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.palette-node:hover {
  background: #4a4a4a;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.palette-node:active {
  cursor: grabbing;
}

.palette-node .node-icon {
  font-size: 1.2rem;
}

.palette-node span {
  color: #e0e0e0;
  font-weight: 500;
}

/* 画布容器 */
.workflow-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
}

.canvas-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
}

.canvas-actions {
  display: flex;
  gap: 0.5rem;
}

/* 工作流画布 */
.workflow-canvas {
  flex: 1;
  position: relative;
  background: #1a1a1a;
  background-image: 
    radial-gradient(circle at 1px 1px, #404040 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.connection-line {
  opacity: 1;
  transition: all 0.2s ease;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.connection-line:hover {
  stroke: #1d4ed8 !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

/* 工作流节点 */
.workflow-node {
  position: absolute;
  width: 200px;
  background: #2d2d2d;
  border: 2px solid #404040;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: move;
  transition: all 0.2s ease;
  z-index: 10;
}

.workflow-node:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.workflow-node:hover .connection-point {
  animation: none;
  background: #1d4ed8;
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.7),
    0 0 16px rgba(59, 130, 246, 0.6);
  transform: scale(1.2);
}

.workflow-node.node-selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* 不同类型节点的颜色 */
.node-start {
  border-color: #28a745;
}

.node-start .node-header {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.node-browse {
  border-color: #007bff;
}

.node-browse .node-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.node-llm {
  border-color: #6f42c1;
}

.node-llm .node-header {
  background: linear-gradient(135deg, #6f42c1, #563d7c);
  color: white;
}

.node-process {
  border-color: #fd7e14;
}

.node-process .node-header {
  background: linear-gradient(135deg, #fd7e14, #e8590c);
  color: white;
}

.node-condition {
  border-color: #ffc107;
}

.node-condition .node-header {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: #333;
}

.node-end {
  border-color: #dc3545;
}

.node-end .node-header {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 10px 10px 0 0;
  background: #404040;
  border-bottom: 1px solid #555555;
}

.node-header .node-icon {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.node-title {
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
}

.node-actions {
  display: flex;
  gap: 0.25rem;
}

.node-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.node-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.node-body {
  padding: 1rem;
}

.node-description {
  color: #b0b0b0;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.node-inputs, .node-outputs {
  margin-bottom: 0.5rem;
}

.input-label, .output-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 0.25rem;
}

.input-item, .output-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.8rem;
}

.input-name, .output-name {
  color: #b0b0b0;
}

.input-type, .output-type {
  color: #909090;
  font-size: 0.7rem;
  background: #404040;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  border: 1px solid #555555;
}

/* 连接点 */
.connection-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  pointer-events: all;
  cursor: crosshair;
  transition: all 0.2s ease;
  opacity: 1;
  z-index: 15;
  box-shadow: 
    0 0 0 2px rgba(59, 130, 246, 0.3),
    0 0 8px rgba(59, 130, 246, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 
      0 0 0 2px rgba(59, 130, 246, 0.3),
      0 0 8px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 
      0 0 0 4px rgba(59, 130, 246, 0.6),
      0 0 12px rgba(59, 130, 246, 0.4);
  }
}

.connection-point:hover {
  background: #1d4ed8;
  transform: scale(1.4);
  opacity: 1;
  border-color: #ffffff;
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.7),
    0 0 20px rgba(59, 130, 246, 0.8);
  animation: none;
}

.input-point {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.output-point {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

/* 底部工具栏 */
.canvas-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #2d2d2d;
  border-top: 1px solid #404040;
}

.canvas-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.canvas-controls {
  display: flex;
  gap: 0.5rem;
}

/* 右侧配置面板 */
.workflow-config-panel {
  width: 300px;
  background: #2d2d2d;
  border-left: 1px solid #404040;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #404040;
  border-bottom: 1px solid #555555;
}

.config-header h4 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
}

.config-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 1.5rem;
}

.config-section label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
  font-weight: 500;
  font-size: 0.9rem;
}

.config-section .form-input,
.config-section .form-textarea,
.config-section .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555555;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #404040;
  color: #e0e0e0;
}

.config-section .form-input:focus,
.config-section .form-textarea:focus,
.config-section .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .workflow-sidebar {
    width: 200px;
  }
  
  .workflow-config-panel {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .workflow-main {
    flex-direction: column;
  }
  
  .workflow-sidebar {
    width: 100%;
    height: 120px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .palette-nodes {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.5rem;
  }
  
  .palette-node {
    min-width: 100px;
    flex-direction: column;
    text-align: center;
    padding: 0.5rem;
  }
  
  .workflow-config-panel {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }
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

/* Button styles */
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

/* Responsive design */
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
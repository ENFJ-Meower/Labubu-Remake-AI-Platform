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
                <h4>{{ $t('aiAgent.workflow.nodeTypes', '节点类型') }}</h4>
                <div class="palette-categories">
                  <!-- 控制节点 -->
                  <div class="palette-category">
                    <h5 class="category-title">{{ $t('aiAgent.workflow.controlNodes', '控制节点') }}</h5>
                    <div class="palette-nodes">
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'start')">
                        <div class="node-icon">🚀</div>
                        <div class="node-info">
                          <span class="node-name">Start</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.startDesc', '工作流开始') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'end')">
                        <div class="node-icon">✅</div>
                        <div class="node-info">
                          <span class="node-name">End</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.endDesc', '工作流结束') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'condition')">
                        <div class="node-icon">❓</div>
                        <div class="node-info">
                          <span class="node-name">Condition</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.conditionDesc', '条件判断') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- AI服务节点 -->
                  <div class="palette-category">
                    <h5 class="category-title">{{ $t('aiAgent.workflow.aiServices', 'AI服务') }}</h5>
                    <div class="palette-nodes">
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'LLM')">
                        <div class="node-icon">🧠</div>
                        <div class="node-info">
                          <span class="node-name">LLM</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.llmDesc', '大语言模型') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'STT')">
                        <div class="node-icon">🎤</div>
                        <div class="node-info">
                          <span class="node-name">STT</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.sttDesc', '语音转文字') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'TTS')">
                        <div class="node-icon">🔊</div>
                        <div class="node-info">
                          <span class="node-name">TTS</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.ttsDesc', '文字转语音') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'pic2text')">
                        <div class="node-icon">🖼️</div>
                        <div class="node-info">
                          <span class="node-name">Pic2Text</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.pic2textDesc', '图片转文字') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'text2pic')">
                        <div class="node-icon">🎨</div>
                        <div class="node-info">
                          <span class="node-name">Text2Pic</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.text2picDesc', '文字转图片') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'browse')">
                        <div class="node-icon">🌐</div>
                        <div class="node-info">
                          <span class="node-name">Browse</span>
                          <span class="node-desc">网页浏览与内容提取</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 工具节点 -->
                  <div class="palette-category">
                    <h5 class="category-title">{{ $t('aiAgent.workflow.toolNodes', '工具节点') }}</h5>
                    <div class="palette-nodes">
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'process')">
                        <div class="node-icon">⚙️</div>
                        <div class="node-info">
                          <span class="node-name">Process</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.processDesc', '数据处理') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'transform')">
                        <div class="node-icon">🔄</div>
                        <div class="node-info">
                          <span class="node-name">Transform</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.transformDesc', '数据转换') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 中央画布区域 -->
            <div class="workflow-canvas-container">
              <div class="canvas-header">
                <h3>{{ currentAgent.name || 'AI Agent' }} - Workflow Designer</h3>
                <div class="canvas-toolbar">
                  <!-- 缩放控制 -->
                  <div class="zoom-controls">
                    <button class="btn btn-icon" @click="zoomOut" :disabled="canvasScale <= 0.25" title="缩小">
                      <i class="icon">🔍-</i>
                    </button>
                    <span class="zoom-level">{{ Math.round(canvasScale * 100) }}%</span>
                    <button class="btn btn-icon" @click="zoomIn" :disabled="canvasScale >= 3" title="放大">
                      <i class="icon">🔍+</i>
                    </button>
                    <button class="btn btn-icon" @click="resetZoom" title="重置缩放">
                      <i class="icon">⌂</i>
                    </button>
                    <button class="btn btn-icon" @click="fitToScreen" title="适合屏幕">
                      <i class="icon">📐</i>
                    </button>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div class="canvas-actions">
                    <button class="btn btn-sm btn-outline" @click="clearCanvas">
                      <i class="icon">🗑️</i> Clear
                    </button>
                    <button class="btn btn-sm btn-secondary" @click="saveWorkflow">
                      <i class="icon">💾</i> Save
                    </button>
                    <button class="btn btn-sm btn-info" @click="showKeyboardShortcuts">
                      <i class="icon">⌨️</i> 快捷键
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="workflow-canvas" 
                   @drop="onDrop" 
                   @dragover="onDragOver"
                   @click="deselectNode"
                   @wheel="onCanvasWheel"
                   @mousedown="onCanvasMouseDown"
                   @mousemove="onCanvasMouseMove"
                   @mouseup="onCanvasMouseUp"
                   @mouseleave="onCanvasMouseUp"
                   ref="canvas">
                
                <!-- 网格背景 -->
                <div class="canvas-grid" 
                     :style="{ 
                       transform: `scale(${canvasScale}) translate(${canvasOffsetX}px, ${canvasOffsetY}px)`,
                       transformOrigin: '0 0'
                     }">
                </div>
                
                <!-- 可缩放的画布内容容器 -->
                <div class="canvas-viewport" 
                     :style="{ 
                       transform: `scale(${canvasScale}) translate(${canvasOffsetX}px, ${canvasOffsetY}px)`,
                       transformOrigin: '0 0'
                     }"
                     ref="viewport">
                  
                  <!-- 连接线 -->
                  <svg class="connection-layer" 
                       v-if="connections.length > 0 || tempConnection">
                    <defs>
                      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
                      </marker>
                      <marker id="arrowhead-hover" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
                      </marker>
                      <marker id="arrowhead-temp" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#ffd93d" />
                      </marker>
                    </defs>
                    
                    <!-- 正常连接线 -->
                    <path
                      v-for="connection in connections"
                      :key="connection.id"
                      :data-connection-id="connection.id"
                      :d="getConnectionPath(connection)"
                      stroke="#6366f1"
                      stroke-width="2"
                      fill="none"
                      marker-end="url(#arrowhead)"
                      class="connection-line"
                      @mouseover="setConnectionHover(connection, true)"
                      @mouseleave="setConnectionHover(connection, false)"
                      @click="selectConnection(connection)"
                      :class="{ 'selected': selectedConnection && selectedConnection.id === connection.id }"
                    />
                    
                    <!-- 临时连接线 -->
                    <path
                      v-if="tempConnection"
                      :d="getTempConnectionPath()"
                      stroke="#ffd93d"
                      stroke-width="3"
                      fill="none"
                      stroke-dasharray="8,4"
                      marker-end="url(#arrowhead-temp)"
                      class="temp-connection-line"
                    />
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
                       @mousedown="startNodeDrag(node, $event)"
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
                    
                    <!-- 服务类型标签 -->
                    <div v-if="node.service" class="node-service">{{ node.service }}</div>
                    
                    <!-- 提示词预览 -->
                    <div v-if="node.prompt" class="node-prompt" :title="node.prompt">
                      {{ node.prompt.length > 50 ? node.prompt.substring(0, 50) + '...' : node.prompt }}
                    </div>
                    
                    <!-- 输入端口 -->
                    <div v-if="node.inputs && node.inputs.length > 0" class="node-inputs">
                      <div class="port-label">🔽 输入:</div>
                      <div v-for="input in node.inputs" :key="input.name" class="input-port">
                        <span class="port-name">{{ input.name }}</span>
                        <span class="port-type">{{ input.type }}</span>
                      </div>
                    </div>
                    
                    <!-- 输出端口 -->
                    <div v-if="node.outputs && node.outputs.length > 0" class="node-outputs">
                      <div class="port-label">🔼 输出:</div>
                      <div v-for="output in node.outputs" :key="output.name" class="output-port">
                        <span class="port-name">{{ output.name }}</span>
                        <span class="port-type">{{ output.type }}</span>
                      </div>
                    </div>
                    
                    <!-- 节点状态 -->
                    <div v-if="node.status" class="node-status">
                      <span class="status-indicator" :class="node.status.toLowerCase()"></span>
                      <span class="status-text">{{ node.status }}</span>
                    </div>
                  </div>
                  
                  <!-- 连接点 -->
                  <div class="connection-points">
                    <div v-if="node.type !== 'start'" 
                         class="connection-point input-point"
                         @mousedown.stop="startConnectionDrag(node, 'input', $event)"
                         @mouseup.stop="endConnectionDrag(node, 'input', $event)"
                         @mouseover="highlightConnectionPoint(node, 'input')"
                         @mouseleave="clearConnectionPointHighlight(node, 'input')"
                         title="按住拖拽创建连接">
                      <span class="connection-point-label">IN</span>
                    </div>
                    <div v-if="node.type !== 'end'" 
                         class="connection-point output-point"
                         @mousedown.stop="startConnectionDrag(node, 'output', $event)"
                         @mouseup.stop="endConnectionDrag(node, 'output', $event)"
                         @mouseover="highlightConnectionPoint(node, 'output')"
                         @mouseleave="clearConnectionPointHighlight(node, 'output')"
                         title="按住拖拽创建连接">
                      <span class="connection-point-label">OUT</span>
                    </div>
                  </div>
                </div>
                
                </div> <!-- 关闭 canvas-viewport -->
              </div>
              


              <!-- 底部工具栏 -->
              <div class="canvas-footer">
                <div class="canvas-stats">
                  <span>{{ $t('aiAgent.workflow.nodes', '节点') }}: {{ workflowNodes.length }}</span>
                  <span>{{ $t('aiAgent.workflow.connections', '连接') }}: {{ connections.length }}</span>
                  <span>{{ $t('aiAgent.workflow.status', '状态') }}: {{ workflowStatus }}</span>
                </div>
                <div class="canvas-controls">
                  <button class="btn btn-outline btn-sm" @click="clearCanvas">
                    <i class="icon">🗑️</i> {{ $t('aiAgent.workflow.clearCanvas', '清空画布') }}
                  </button>
                  <button class="btn btn-secondary btn-sm" @click="saveWorkflow">
                    <i class="icon">💾</i> {{ $t('aiAgent.workflow.saveWorkflow', '保存工作流') }}
                  </button>
                  <button class="btn btn-success btn-sm" @click="testWorkflow">
                    <i class="icon">🧪</i> {{ $t('aiAgent.workflow.testWorkflow', '测试运行') }}
                  </button>
                  <button class="btn btn-primary btn-sm" @click="deployWorkflow">
                    <i class="icon">🚀</i> {{ $t('aiAgent.workflow.deployWorkflow', '部署') }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 右侧配置面板 -->
            <!-- 节点配置面板 -->
            <div class="workflow-config-panel" v-if="selectedNode">
              <div class="config-header">
                <h4>{{ $t('aiAgent.workflow.nodeConfiguration', '节点配置') }}</h4>
                <button class="btn-close" @click="deselectNode">×</button>
              </div>
              
              <div class="config-content">
                <!-- 基础配置 -->
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.nodeName', '节点名称') }}</label>
                  <input v-model="selectedNodeData.title" type="text" class="form-input" :placeholder="$t('aiAgent.workflow.nodeNamePlaceholder', '输入节点名称')">
                </div>
                
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.nodeDescription', '节点描述') }}</label>
                  <textarea v-model="selectedNodeData.description" class="form-textarea" rows="3" :placeholder="$t('aiAgent.workflow.nodeDescPlaceholder', '描述节点功能')"></textarea>
                </div>

                <!-- 服务类型配置（AI服务节点必须配置） -->
                <div v-if="isAIServiceNode(selectedNodeData.type)" class="config-section">
                  <label>{{ $t('aiAgent.workflow.serviceType', '服务类型') }}</label>
                  <select v-model="selectedNodeData.service" class="form-select">
                    <option value="">{{ $t('aiAgent.workflow.selectServiceType', '选择服务类型') }}</option>
                    <option value="LLM">LLM - {{ $t('aiAgent.workflow.llmService', '大语言模型') }}</option>
                    <option value="STT">STT - {{ $t('aiAgent.workflow.sttService', '语音转文字') }}</option>
                    <option value="TTS">TTS - {{ $t('aiAgent.workflow.ttsService', '文字转语音') }}</option>
                    <option value="pic2text">Pic2Text - {{ $t('aiAgent.workflow.pic2textService', '图片转文字') }}</option>
                    <option value="text2pic">Text2Pic - {{ $t('aiAgent.workflow.text2picService', '文字转图片') }}</option>
                  </select>
                </div>

                <!-- Prompt配置（所有AI服务节点必须配置） -->
                <div v-if="isAIServiceNode(selectedNodeData.type)" class="config-section">
                  <label>{{ $t('aiAgent.workflow.nodePrompt', '节点提示词') }}</label>
                  <textarea 
                    v-model="selectedNodeData.prompt" 
                    class="form-textarea prompt-textarea" 
                    rows="8" 
                    :placeholder="getPromptPlaceholder(selectedNodeData.service)"
                  ></textarea>
                  <div class="prompt-tips">
                    <small>{{ getPromptTips(selectedNodeData.service) }}</small>
                  </div>
                </div>
                
                <!-- LLM特有配置 -->
                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.llmModel', 'LLM模型') }}</label>
                  <select v-model="selectedNodeData.model" class="form-select">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude-3</option>
                    <option value="llama-2">Llama-2</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.temperature', '温度值') }}</label>
                  <input 
                    v-model.number="selectedNodeData.temperature" 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>{{ $t('aiAgent.workflow.conservative', '保守') }} (0)</span>
                    <span>{{ selectedNodeData.temperature }}</span>
                    <span>{{ $t('aiAgent.workflow.creative', '创造') }} (2)</span>
                  </div>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>最大Token数</label>
                  <input 
                    v-model.number="selectedNodeData.max_tokens" 
                    type="number" 
                    min="1" 
                    max="4000" 
                    class="form-input"
                    placeholder="2000"
                  >
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>Top P</label>
                  <input 
                    v-model.number="selectedNodeData.top_p" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>确定 (0)</span>
                    <span>{{ selectedNodeData.top_p }}</span>
                    <span>随机 (1)</span>
                  </div>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>频率惩罚</label>
                  <input 
                    v-model.number="selectedNodeData.frequency_penalty" 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>无 (0)</span>
                    <span>{{ selectedNodeData.frequency_penalty }}</span>
                    <span>强 (2)</span>
                  </div>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>存在惩罚</label>
                  <input 
                    v-model.number="selectedNodeData.presence_penalty" 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>无 (0)</span>
                    <span>{{ selectedNodeData.presence_penalty }}</span>
                    <span>强 (2)</span>
                  </div>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>停止序列</label>
                  <textarea 
                    v-model="selectedNodeData.stop" 
                    class="form-textarea" 
                    rows="2" 
                    placeholder="输入停止序列，用换行分隔，例如：&#10;###&#10;---"
                  ></textarea>
                  <small class="config-help">LLM遇到这些序列时将停止生成，每行一个序列</small>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>用户标识</label>
                  <input 
                    v-model="selectedNodeData.user" 
                    type="text" 
                    class="form-input"
                    placeholder="用于识别用户的唯一标识"
                  >
                  <small class="config-help">用于监控和防滥用，建议使用UUID</small>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>流式输出</label>
                  <input 
                    v-model="selectedNodeData.stream" 
                    type="checkbox" 
                    class="form-checkbox"
                  >
                  <span class="checkbox-label">启用流式输出</span>
                  <small class="config-help">启用后将实时返回生成的内容</small>
                </div>

                <div v-if="selectedNodeData.service === 'LLM'" class="config-section">
                  <label>令牌偏差</label>
                  <textarea 
                    v-model="selectedNodeData.logit_bias" 
                    class="form-textarea" 
                    rows="3" 
                    placeholder="JSON格式，例如：{&quot;1234&quot;: 10, &quot;5678&quot;: -10}"
                  ></textarea>
                  <small class="config-help">调整特定令牌的出现概率，格式为JSON对象</small>
                </div>

                <!-- TTS特有配置 -->
                <div v-if="selectedNodeData.service === 'TTS'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.voiceType', '语音类型') }}</label>
                  <select v-model="selectedNodeData.voice" class="form-select">
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'TTS'" class="config-section">
                  <label>TTS模型</label>
                  <select v-model="selectedNodeData.model" class="form-select">
                    <option value="tts-1">TTS-1</option>
                    <option value="tts-1-hd">TTS-1-HD</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'TTS'" class="config-section">
                  <label>音频格式</label>
                  <select v-model="selectedNodeData.response_format" class="form-select">
                    <option value="mp3">MP3</option>
                    <option value="opus">Opus</option>
                    <option value="aac">AAC</option>
                    <option value="flac">FLAC</option>
                    <option value="wav">WAV</option>
                    <option value="pcm">PCM</option>
                  </select>
                  <small class="config-help">选择音频输出格式，影响文件大小和质量</small>
                </div>

                <div v-if="selectedNodeData.service === 'TTS'" class="config-section">
                  <label>语速</label>
                  <input 
                    v-model.number="selectedNodeData.speed" 
                    type="range" 
                    min="0.25" 
                    max="4.0" 
                    step="0.25" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>慢 (0.25)</span>
                    <span>{{ selectedNodeData.speed }}</span>
                    <span>快 (4.0)</span>
                  </div>
                </div>

                <!-- STT特有配置 -->
                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.language', '语言') }}</label>
                  <select v-model="selectedNodeData.language" class="form-select">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>STT模型</label>
                  <select v-model="selectedNodeData.model" class="form-select">
                    <option value="whisper-1">Whisper-1</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>响应格式</label>
                  <select v-model="selectedNodeData.response_format" class="form-select">
                    <option value="json">JSON</option>
                    <option value="text">Text</option>
                    <option value="srt">SRT</option>
                    <option value="verbose_json">详细JSON</option>
                    <option value="vtt">VTT</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>温度值</label>
                  <input 
                    v-model.number="selectedNodeData.temperature" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    class="form-range"
                  >
                  <div class="range-labels">
                    <span>确定 (0)</span>
                    <span>{{ selectedNodeData.temperature }}</span>
                    <span>随机 (1)</span>
                  </div>
                </div>

                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>转录提示词</label>
                  <textarea 
                    v-model="selectedNodeData.stt_prompt" 
                    class="form-textarea" 
                    rows="3" 
                    placeholder="用于引导转录的提示词，例如：请转录这段医疗对话..."
                  ></textarea>
                  <small class="config-help">可选的提示词用于引导转录风格和专业术语</small>
                </div>

                <div v-if="selectedNodeData.service === 'STT'" class="config-section">
                  <label>时间戳粒度</label>
                  <select v-model="selectedNodeData.timestamp_granularities" class="form-select">
                    <option value="segment">段落级</option>
                    <option value="word">词级</option>
                  </select>
                  <small class="config-help">选择时间戳的精细程度</small>
                </div>

                <!-- pic2text特有配置 -->
                <div v-if="selectedNodeData.service === 'pic2text'" class="config-section">
                  <label>识别语言</label>
                  <select v-model="selectedNodeData.language" class="form-select">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'pic2text'" class="config-section">
                  <label>输出格式</label>
                  <select v-model="selectedNodeData.format" class="form-select">
                    <option value="plain">纯文本</option>
                    <option value="markdown">Markdown</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'pic2text'" class="config-section">
                  <label>最大Token数</label>
                  <input 
                    v-model.number="selectedNodeData.max_tokens" 
                    type="number" 
                    min="1" 
                    max="2000" 
                    class="form-input"
                    placeholder="1000"
                  >
                  <small class="config-help">限制输出文本的最大长度</small>
                </div>

                <div v-if="selectedNodeData.service === 'pic2text'" class="config-section">
                  <label>详细程度</label>
                  <select v-model="selectedNodeData.detail" class="form-select">
                    <option value="low">低 - 快速处理</option>
                    <option value="high">高 - 详细分析</option>
                    <option value="auto">自动 - 智能选择</option>
                  </select>
                  <small class="config-help">选择图片分析的详细程度</small>
                </div>

                <div v-if="selectedNodeData.service === 'pic2text'" class="config-section">
                  <label>图片质量</label>
                  <select v-model="selectedNodeData.quality" class="form-select">
                    <option value="standard">标准质量</option>
                    <option value="hd">高清质量</option>
                  </select>
                  <small class="config-help">选择图片处理质量</small>
                </div>

                <!-- 图片生成特有配置 -->
                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>图片模型</label>
                  <select v-model="selectedNodeData.model" class="form-select">
                    <option value="dall-e-3">DALL-E 3</option>
                    <option value="dall-e-2">DALL-E 2</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.imageSize', '图片尺寸') }}</label>
                  <select v-model="selectedNodeData.size" class="form-select">
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1792x1024">1792x1024 (横向)</option>
                    <option value="1024x1792">1024x1792 (纵向)</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.imageStyle', '图片风格') }}</label>
                  <select v-model="selectedNodeData.style" class="form-select">
                    <option value="natural">自然</option>
                    <option value="vivid">生动</option>
                    <option value="artistic">艺术</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>图片质量</label>
                  <select v-model="selectedNodeData.quality" class="form-select">
                    <option value="standard">标准</option>
                    <option value="hd">高清</option>
                  </select>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>生成数量</label>
                  <input 
                    v-model.number="selectedNodeData.n" 
                    type="number" 
                    min="1" 
                    max="4" 
                    class="form-input"
                    placeholder="1"
                  >
                  <small class="config-help">一次生成的图片数量，DALL-E 3最多支持1张</small>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>用户标识</label>
                  <input 
                    v-model="selectedNodeData.user" 
                    type="text" 
                    class="form-input"
                    placeholder="用于识别用户的唯一标识"
                  >
                  <small class="config-help">用于监控和防滥用，建议使用UUID</small>
                </div>

                <div v-if="selectedNodeData.service === 'text2pic'" class="config-section">
                  <label>响应格式</label>
                  <select v-model="selectedNodeData.response_format" class="form-select">
                    <option value="url">URL链接</option>
                    <option value="b64_json">Base64编码</option>
                  </select>
                  <small class="config-help">选择图片返回格式</small>
                </div>

                <!-- Browse特有配置 -->
                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>强制爬取</label>
                  <input 
                    v-model="selectedNodeData.enforce_crawl" 
                    type="checkbox" 
                    class="form-checkbox"
                  >
                </div>

                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>插件名称</label>
                  <input 
                    v-model="selectedNodeData.plugin_name" 
                    type="text" 
                    class="form-input"
                    placeholder="plugin_observation"
                  >
                </div>

                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>超时时间(ms)</label>
                  <input 
                    v-model.number="selectedNodeData.timeout" 
                    type="number" 
                    min="1000" 
                    max="60000" 
                    class="form-input"
                    placeholder="30000"
                  >
                  <small class="config-help">网页加载的最大等待时间</small>
                </div>

                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>用户代理</label>
                  <select v-model="selectedNodeData.user_agent" class="form-select">
                    <option value="default">默认浏览器</option>
                    <option value="chrome">Chrome浏览器</option>
                    <option value="firefox">Firefox浏览器</option>
                    <option value="safari">Safari浏览器</option>
                    <option value="mobile">移动设备</option>
                  </select>
                  <small class="config-help">模拟不同浏览器访问网页</small>
                </div>

                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>等待加载</label>
                  <input 
                    v-model.number="selectedNodeData.wait_for_load" 
                    type="number" 
                    min="0" 
                    max="10000" 
                    class="form-input"
                    placeholder="2000"
                  >
                  <small class="config-help">等待页面完全加载的时间(ms)</small>
                </div>

                <div v-if="selectedNodeData.service === 'browse'" class="config-section">
                  <label>提取模式</label>
                  <select v-model="selectedNodeData.extract_mode" class="form-select">
                    <option value="text">纯文本</option>
                    <option value="html">HTML源码</option>
                    <option value="markdown">Markdown格式</option>
                    <option value="structured">结构化数据</option>
                  </select>
                  <small class="config-help">选择内容提取的格式</small>
                </div>

                <!-- 条件节点配置 -->
                <div v-if="selectedNodeData.type === 'condition'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.conditionExpression', '条件表达式') }}</label>
                  <input v-model="selectedNodeData.condition" type="text" class="form-input" :placeholder="$t('aiAgent.workflow.conditionPlaceholder', '例如：result.length > 0')">
                  <small class="config-help">支持JavaScript表达式，可使用变量名引用输入数据</small>
                </div>

                <!-- 通用节点配置 -->
                <div v-if="selectedNodeData.type !== 'start' && selectedNodeData.type !== 'end'" class="config-section">
                  <h5>通用配置</h5>
                  
                  <div class="config-subsection">
                    <label>重试次数</label>
                    <input 
                      v-model.number="selectedNodeData.retry_count" 
                      type="number" 
                      min="0" 
                      max="5" 
                      class="form-input"
                      placeholder="3"
                    >
                    <small class="config-help">节点执行失败时的重试次数</small>
                  </div>

                  <div class="config-subsection">
                    <label>重试间隔(ms)</label>
                    <input 
                      v-model.number="selectedNodeData.retry_delay" 
                      type="number" 
                      min="100" 
                      max="10000" 
                      class="form-input"
                      placeholder="1000"
                    >
                    <small class="config-help">每次重试之间的等待时间</small>
                  </div>

                  <div class="config-subsection">
                    <label>超时时间(s)</label>
                    <input 
                      v-model.number="selectedNodeData.execution_timeout" 
                      type="number" 
                      min="1" 
                      max="300" 
                      class="form-input"
                      placeholder="30"
                    >
                    <small class="config-help">节点执行的最大等待时间</small>
                  </div>

                  <div class="config-subsection">
                    <label>错误处理</label>
                    <select v-model="selectedNodeData.error_handling" class="form-select">
                      <option value="stop">停止工作流</option>
                      <option value="continue">继续执行</option>
                      <option value="retry">重试执行</option>
                      <option value="fallback">使用备用值</option>
                    </select>
                    <small class="config-help">选择错误发生时的处理方式</small>
                  </div>

                  <div v-if="selectedNodeData.error_handling === 'fallback'" class="config-subsection">
                    <label>备用值</label>
                    <textarea 
                      v-model="selectedNodeData.fallback_value" 
                      class="form-textarea" 
                      rows="2" 
                      placeholder="错误时使用的默认值"
                    ></textarea>
                    <small class="config-help">当节点执行失败时使用的备用值</small>
                  </div>
                </div>

                <!-- 输入输出配置 -->
                <div class="config-section">
                  <h5>{{ $t('aiAgent.workflow.inputOutput', '输入输出') }}</h5>
                  
                  <div class="io-config">
                    <div class="io-section">
                      <label>{{ $t('aiAgent.workflow.inputPorts', '输入端口') }}</label>
                      <div v-for="(input, index) in selectedNodeData.inputs" :key="index" class="io-item">
                        <input v-model="input.name" type="text" placeholder="端口名称" class="form-input-sm">
                        <select v-model="input.type" class="form-select-sm">
                          <option value="text">文本</option>
                          <option value="image">图片</option>
                          <option value="audio">音频</option>
                          <option value="file">文件</option>
                          <option value="json">JSON</option>
                        </select>
                        <button @click="removeInput(index)" class="btn-remove">×</button>
                      </div>
                      <button @click="addInput" class="btn btn-sm btn-outline">+ {{ $t('aiAgent.workflow.addInput', '添加输入') }}</button>
                    </div>

                    <div class="io-section">
                      <label>{{ $t('aiAgent.workflow.outputPorts', '输出端口') }}</label>
                      <div v-for="(output, index) in selectedNodeData.outputs" :key="index" class="io-item">
                        <input v-model="output.name" type="text" placeholder="端口名称" class="form-input-sm">
                        <select v-model="output.type" class="form-select-sm">
                          <option value="text">文本</option>
                          <option value="image">图片</option>
                          <option value="audio">音频</option>
                          <option value="file">文件</option>
                          <option value="json">JSON</option>
                        </select>
                        <button @click="removeOutput(index)" class="btn-remove">×</button>
                      </div>
                      <button @click="addOutput" class="btn btn-sm btn-outline">+ {{ $t('aiAgent.workflow.addOutput', '添加输出') }}</button>
                    </div>
                  </div>
                </div>
                
                <div class="config-actions">
                  <button class="btn btn-primary" @click="saveNodeConfig">{{ $t('aiAgent.workflow.saveConfig', '保存配置') }}</button>
                  <button class="btn btn-outline" @click="validateNodeConfig">{{ $t('aiAgent.workflow.validateConfig', '验证配置') }}</button>
                </div>
              </div>
            </div>
            
            <!-- 连接配置面板 -->
            <div class="workflow-config-panel" v-else-if="selectedConnection">
              <div class="config-header">
                <h4>{{ $t('aiAgent.workflow.connectionConfiguration', '连接配置') }}</h4>
                <button class="btn-close" @click="deselectConnection">×</button>
              </div>
              
              <div class="config-content">
                <div class="connection-info">
                  <div class="connection-nodes">
                    <div class="connection-node">
                      <strong>{{ $t('aiAgent.workflow.fromNode', '源节点') }}:</strong>
                      <span>{{ getNodeById(selectedConnection.from)?.title || 'Unknown' }}</span>
                    </div>
                    <div class="connection-arrow">→</div>
                    <div class="connection-node">
                      <strong>{{ $t('aiAgent.workflow.toNode', '目标节点') }}:</strong>
                      <span>{{ getNodeById(selectedConnection.to)?.title || 'Unknown' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.connectionPrompt', '连接提示词') }}</label>
                  <textarea 
                    v-model="selectedConnection.prompt" 
                    class="form-textarea prompt-textarea" 
                    rows="8" 
                    :placeholder="$t('aiAgent.workflow.connectionPromptPlaceholder', '输入连接提示词，用于在数据传递时进行转换或处理...')"
                  ></textarea>
                  <div class="prompt-tips">
                    <small>{{ $t('aiAgent.workflow.connectionPromptTips', '连接提示词用于定义数据在节点间传递时的转换逻辑，可以包含变量如 {input_data}') }}</small>
                  </div>
                </div>
                
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.connectionDescription', '连接描述') }}</label>
                  <textarea 
                    v-model="selectedConnection.description" 
                    class="form-textarea" 
                    rows="3" 
                    :placeholder="$t('aiAgent.workflow.connectionDescPlaceholder', '描述此连接的作用...')"
                  ></textarea>
                </div>
                
                <div class="config-actions">
                  <button class="btn btn-primary" @click="saveConnectionConfig">
                    <i class="icon">💾</i> {{ $t('aiAgent.workflow.saveConnection', '保存连接') }}
                  </button>
                  <button class="btn btn-danger" @click="deleteConnection">
                    <i class="icon">🗑️</i> {{ $t('aiAgent.workflow.deleteConnection', '删除连接') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Workflow Management -->
        <div v-else-if="activeTab === 'workflows'" class="editor-content workflows-management">
          <div class="section-header">
            <h3>📋 工作流管理</h3>
            <p>查看和管理您的所有DAG工作流</p>
          </div>

          <!-- 工作流统计面板 -->
          <div class="workflow-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.total }}</div>
                <div class="stat-label">总工作流</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">▶️</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.running }}</div>
                <div class="stat-label">运行中</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.completed }}</div>
                <div class="stat-label">已完成</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❌</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.failed }}</div>
                <div class="stat-label">失败</div>
              </div>
            </div>
          </div>

          <!-- 搜索和筛选 -->
          <div class="workflow-filters">
            <div class="search-box">
              <input 
                v-model="workflowSearch" 
                type="text" 
                placeholder="搜索工作流..." 
                class="search-input"
              />
              <button class="search-btn">🔍</button>
            </div>
            <div class="filter-buttons">
              <button 
                v-for="status in workflowStatusOptions" 
                :key="status.value"
                :class="['filter-btn', { active: selectedWorkflowStatus === status.value }]"
                @click="selectedWorkflowStatus = status.value"
              >
                {{ status.label }}
              </button>
            </div>
            <button class="btn btn-primary" @click="refreshWorkflowList">
              <i class="icon">🔄</i> 刷新
            </button>
          </div>

          <!-- 工作流列表 -->
          <div class="workflow-list" v-if="!loadingWorkflows">
            <div v-if="filteredWorkflows.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h4>暂无工作流</h4>
              <p>您还没有创建任何工作流，现在就开始设计您的第一个工作流吧！</p>
              <button class="btn btn-primary" @click="setActiveTab('workflow')">
                创建工作流
              </button>
            </div>
            <div v-else class="workflow-grid">
              <div 
                v-for="workflow in filteredWorkflows" 
                :key="workflow.dag_id"
                class="workflow-card"
                @click="viewWorkflow(workflow)"
              >
                <div class="workflow-header">
                  <div class="workflow-title">{{ workflow.name || workflow.dag_id }}</div>
                  <div class="workflow-status" :class="workflow.status">
                    {{ getStatusLabel(workflow.status) }}
                  </div>
                </div>
                <div class="workflow-meta">
                  <div class="meta-item">
                    <span class="meta-label">节点数:</span>
                    <span class="meta-value">{{ workflow.node_count || 0 }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">创建时间:</span>
                    <span class="meta-value">{{ formatDate(workflow.created_at) }}</span>
                  </div>
                </div>
                <div class="workflow-actions" @click.stop>
                  <button class="action-btn" @click="viewWorkflowStatus(workflow)" title="查看状态">
                    📊
                  </button>
                  <button class="action-btn" @click="viewWorkflowResults(workflow)" title="查看结果">
                    📋
                  </button>
                  <button class="action-btn" @click="cloneWorkflow(workflow)" title="复制">
                    📄
                  </button>
                  <button class="action-btn danger" @click="deleteWorkflow(workflow)" title="删除">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loadingWorkflows" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载工作流列表...</p>
          </div>

          <!-- 错误状态 -->
          <div v-if="workflowListError" class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>加载失败</h4>
            <p>{{ workflowListError }}</p>
            <div class="error-actions">
              <button class="btn btn-primary" @click="retryLoadWorkflows">
                🔄 重试
              </button>
              <button class="btn btn-secondary" @click="clearWorkflowError">
                关闭
              </button>
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



    <!-- 快捷键帮助弹窗 -->
    <div v-if="showShortcutsHelp" class="shortcuts-overlay" @click.self="closeShortcutsHelp">
      <div class="shortcuts-dialog">
        <div class="shortcuts-header">
          <h3>⌨️ 快捷键指南</h3>
          <button @click="closeShortcutsHelp" class="btn-close">×</button>
        </div>
        <div class="shortcuts-content">
          <div class="shortcuts-section">
            <h4>编辑操作</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Z</kbd>
              <span>撤销</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Y</kbd>
              <span>重做</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>C</kbd>
              <span>复制选中节点</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>V</kbd>
              <span>粘贴节点</span>
            </div>
            <div class="shortcut-item">
              <kbd>Delete</kbd>
              <span>删除选中节点</span>
            </div>
          </div>
          <div class="shortcuts-section">
            <h4>工作流操作</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>S</kbd>
              <span>保存工作流</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>A</kbd>
              <span>选择所有节点</span>
            </div>
          </div>
          <div class="shortcuts-section">
            <h4>画布操作</h4>
            <div class="shortcut-item">
              <span class="mouse-action">鼠标滚轮</span>
              <span>缩放画布</span>
            </div>
            <div class="shortcut-item">
              <span class="mouse-action">拖拽空白区域</span>
              <span>移动画布</span>
            </div>
            <div class="shortcut-item">
              <span class="mouse-action">点击节点</span>
              <span>选择节点</span>
            </div>
            <div class="shortcut-item">
              <span class="mouse-action">拖拽节点</span>
              <span>移动节点</span>
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

    <!-- 状态监控弹窗 -->
    <div v-if="showStatusMonitor" class="modal-overlay" @click="closeStatusMonitor">
      <div class="status-monitor-modal" @click.stop>
        <div class="modal-header">
          <h3>📊 工作流状态监控</h3>
          <div class="connection-status">
            <div class="connection-indicator" :class="sseConnectionStatus">
              <div class="indicator-dot"></div>
              <span class="indicator-text">{{ getConnectionStatusText(sseConnectionStatus) }}</span>
            </div>
          </div>
          <button class="close-btn" @click="closeStatusMonitor">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 工作流基本信息 -->
          <div class="workflow-info-section">
            <h4>工作流信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">工作流ID:</span>
                <span class="info-value">{{ monitoringWorkflowId }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">状态:</span>
                <span class="info-value status-badge" :class="currentWorkflowStatus?.status">
                  {{ getStatusLabel(currentWorkflowStatus?.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">开始时间:</span>
                <span class="info-value">{{ formatDate(currentWorkflowStatus?.start_time) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">持续时间:</span>
                <span class="info-value">{{ formatDuration(currentWorkflowStatus?.duration) }}</span>
              </div>
            </div>
          </div>

          <!-- 节点状态列表 -->
          <div class="nodes-status-section">
            <h4>节点状态</h4>
            <div class="nodes-list">
              <div v-if="!currentWorkflowStatus?.nodes || currentWorkflowStatus.nodes.length === 0" 
                   class="empty-nodes">
                <div class="empty-icon">📄</div>
                <p>暂无节点状态信息</p>
              </div>
              <div v-else 
                   v-for="node in currentWorkflowStatus.nodes" 
                   :key="node.node_id"
                   class="node-status-item">
                <div class="node-status-header">
                  <div class="node-info">
                    <div class="node-icon">{{ getNodeIcon(node.node_type) }}</div>
                    <div class="node-details">
                      <div class="node-name">{{ node.node_name || node.node_id }}</div>
                      <div class="node-type">{{ node.node_type }}</div>
                    </div>
                  </div>
                  <div class="node-status-badge" :class="node.status">
                    {{ getStatusLabel(node.status) }}
                  </div>
                </div>
                <div class="node-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: node.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ node.progress || 0 }}%</span>
                </div>
                <div v-if="node.error" class="node-error">
                  <div class="error-icon">⚠️</div>
                  <div class="error-message">{{ node.error }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 执行日志 -->
          <div class="execution-logs-section">
            <h4>执行日志</h4>
            <div class="logs-container">
              <div v-if="!currentWorkflowStatus?.logs || currentWorkflowStatus.logs.length === 0" 
                   class="empty-logs">
                <div class="empty-icon">📝</div>
                <p>暂无执行日志</p>
              </div>
              <div v-else class="logs-list">
                <div v-for="log in currentWorkflowStatus.logs" 
                     :key="log.timestamp"
                     class="log-item" 
                     :class="log.level">
                  <div class="log-time">{{ formatTime(log.timestamp) }}</div>
                  <div class="log-level">{{ log.level }}</div>
                  <div class="log-message">{{ log.message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeStatusMonitor">关闭</button>
          <button class="btn btn-primary" @click="refreshWorkflowStatus">刷新状态</button>
        </div>
      </div>
    </div>

    <!-- 执行结果查看器 -->
    <div v-if="showResultsViewer" class="modal-overlay" @click="closeResultsViewer">
      <div class="results-viewer-modal" @click.stop>
        <div class="modal-header">
          <h3>📋 执行结果查看器</h3>
          <button class="close-btn" @click="closeResultsViewer">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 结果概览 -->
          <div class="results-overview">
            <h4>结果概览</h4>
            <div class="overview-stats">
              <div class="overview-item">
                <div class="overview-label">总计消息</div>
                <div class="overview-value">{{ workflowResults?.total_messages || 0 }}</div>
              </div>
              <div class="overview-item">
                <div class="overview-label">成功处理</div>
                <div class="overview-value">{{ workflowResults?.successful_messages || 0 }}</div>
              </div>
              <div class="overview-item">
                <div class="overview-label">处理失败</div>
                <div class="overview-value">{{ workflowResults?.failed_messages || 0 }}</div>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="messages-section">
            <h4>消息列表</h4>
            <div class="messages-filters">
              <select v-model="selectedMessageType" class="filter-select">
                <option value="all">所有消息</option>
                <option value="input">输入消息</option>
                <option value="output">输出消息</option>
                <option value="error">错误消息</option>
              </select>
              <button class="btn btn-sm" @click="exportResults">导出结果</button>
            </div>
            <div class="messages-list">
              <div v-if="!filteredMessages || filteredMessages.length === 0" 
                   class="empty-messages">
                <div class="empty-icon">💬</div>
                <p>暂无消息记录</p>
              </div>
              <div v-else class="messages-grid">
                <div v-for="message in filteredMessages" 
                     :key="message.id"
                     class="message-item"
                     :class="message.type">
                  <div class="message-header">
                    <div class="message-type">{{ message.type }}</div>
                    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                  </div>
                  <div class="message-content">
                    <pre v-if="message.content">{{ formatMessageContent(message.content) }}</pre>
                    <div v-if="message.error" class="message-error">
                      <div class="error-icon">❌</div>
                      <div class="error-text">{{ message.error }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeResultsViewer">关闭</button>
          <button class="btn btn-primary" @click="refreshWorkflowResults">刷新结果</button>
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
          id: 'workflows',
          icon: '📋',
          title: 'Workflow Management',
          description: 'View and manage all workflows',
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
        }
      ],
      connections: [],
      selectedNode: null,
      selectedNodeData: {},
      
      // 选中连接
      selectedConnection: null,
      
      // 画布相关
      canvasScale: 1,
      canvasOffsetX: 0,
      canvasOffsetY: 0,
      virtualCanvasWidth: 2000,
      virtualCanvasHeight: 1500,
      
      // 连接相关
      isConnecting: false,
      connectionStart: null,
      tempConnection: null,
      
      // 交互相关
      draggedNode: null,
      dragOffset: { x: 0, y: 0 },
      isPanning: false,
      panStart: { x: 0, y: 0 },
      
      // 编辑历史
      history: [],
      historyIndex: -1,
      
      // 其他状态
      nodeIdCounter: 0,
      workflowStatus: 'Ready',
      statusEventSource: null,
      
      // 快捷键映射
      keyboardShortcuts: {
        'ctrl+z': 'undo',
        'ctrl+y': 'redo',
        'ctrl+c': 'copy',
        'ctrl+v': 'paste',
        'delete': 'delete',
        'ctrl+s': 'save',
        'ctrl+a': 'selectAll'
      },
      
      // UI状态
      showShortcutsHelp: false,
      copiedNode: null,

      // 工作流管理相关
      workflowList: [],
      workflowStats: {
        total: 0,
        running: 0,
        completed: 0,
        failed: 0
      },
      workflowSearch: '',
      selectedWorkflowStatus: 'all',
      loadingWorkflows: false,
      workflowListError: null,
      workflowStatusOptions: [
        { value: 'all', label: '全部' },
        { value: 'running', label: '运行中' },
        { value: 'completed', label: '已完成' },
        { value: 'failed', label: '失败' },
        { value: 'pending', label: '待运行' }
      ],

      // 状态监控相关
      currentWorkflowStatus: null,
      workflowResults: null,
      monitoringWorkflowId: null,
      showStatusMonitor: false,
      showResultsViewer: false,
      selectedMessageType: 'all',
      
      // SSE连接状态
      sseConnectionStatus: 'disconnected', // disconnected, connecting, connected, error
      sseReconnectAttempts: 0,
      sseMaxReconnectAttempts: 5,
      sseReconnectDelay: 1000,
      sseHeartbeatInterval: null,
      sseLastHeartbeat: null,
      
      // UI响应优化
      statusUpdateQueue: [],
      statusUpdateTimer: null,
      batchUpdateInterval: 100
    }
  },
  
  computed: {
    selectedNodeData() {
      if (!this.selectedNode) return {}
      return this.workflowNodes.find(node => node.id === this.selectedNode) || {}
    },

    filteredWorkflows() {
      let filtered = this.workflowList

      // 状态筛选
      if (this.selectedWorkflowStatus !== 'all') {
        filtered = filtered.filter(workflow => workflow.status === this.selectedWorkflowStatus)
      }

      // 搜索筛选
      if (this.workflowSearch.trim()) {
        const searchTerm = this.workflowSearch.toLowerCase()
        filtered = filtered.filter(workflow => 
          (workflow.name || workflow.dag_id).toLowerCase().includes(searchTerm) ||
          workflow.dag_id.toLowerCase().includes(searchTerm)
        )
      }

      return filtered
    },

    filteredMessages() {
      if (!this.workflowResults?.messages) return []
      
      if (this.selectedMessageType === 'all') {
        return this.workflowResults.messages
      }
      
      return this.workflowResults.messages.filter(message => 
        message.type === this.selectedMessageType
      )
    }
  },
  
  mounted() {
    this.initializeCanvas()
    this.setupKeyboardShortcuts()
    this.saveToHistory()
    this.loadWorkflowList()
  },
  
  beforeUnmount() {
    this.cleanup()
    this.stopStatusMonitoring()
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
        end: '✅',
        condition: '❓',
        LLM: '🧠',
        STT: '🎤',
        TTS: '🔊',
        pic2text: '🖼️',
        text2pic: '🎨',
        process: '⚙️',
        transform: '🔄'
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
          outputs: [{ name: 'trigger', type: 'event' }],
          prompt: '',
          service: ''
        },
        end: {
          title: 'End',
          description: 'Workflow end',
          inputs: [{ name: 'result', type: 'text' }],
          outputs: [],
          prompt: '',
          service: ''
        },
        condition: {
          title: 'Condition',
          description: 'Condition judgment',
          inputs: [{ name: 'input', type: 'text' }],
          outputs: [{ name: 'true', type: 'text' }, { name: 'false', type: 'text' }],
          condition: '',
          prompt: '',
          service: ''
        },
        LLM: {
          title: 'LLM',
          description: 'Large language model processing',
          inputs: [{ name: 'prompt', type: 'text' }],
          outputs: [{ name: 'response', type: 'text' }],
          service: 'LLM',
          prompt: '',
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: '',
          user: '',
          stream: false,
          logit_bias: '',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 30,
          error_handling: 'retry'
        },
        STT: {
          title: 'STT',
          description: 'Speech to text conversion',
          inputs: [{ name: 'audio', type: 'audio' }],
          outputs: [{ name: 'text', type: 'text' }],
          service: 'STT',
          prompt: '',
          language: 'zh',
          model: 'whisper-1',
          response_format: 'json',
          temperature: 0.0,
          stt_prompt: '',
          timestamp_granularities: 'segment',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 60,
          error_handling: 'retry'
        },
        TTS: {
          title: 'TTS',
          description: 'Text to speech conversion',
          inputs: [{ name: 'text', type: 'text' }],
          outputs: [{ name: 'audio', type: 'audio' }],
          service: 'TTS',
          prompt: '',
          voice: 'alloy',
          model: 'tts-1',
          response_format: 'mp3',
          speed: 1.0,
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 30,
          error_handling: 'retry'
        },
        pic2text: {
          title: 'Pic2Text',
          description: 'Image to text conversion',
          inputs: [{ name: 'image', type: 'image' }],
          outputs: [{ name: 'text', type: 'text' }],
          service: 'pic2text',
          prompt: '',
          language: 'zh',
          format: 'markdown',
          max_tokens: 1000,
          detail: 'auto',
          quality: 'standard',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 30,
          error_handling: 'retry'
        },
        text2pic: {
          title: 'Text2Pic',
          description: 'Text to image generation',
          inputs: [{ name: 'prompt', type: 'text' }],
          outputs: [{ name: 'image', type: 'image' }],
          service: 'text2pic',
          prompt: '',
          model: 'dall-e-3',
          size: '1024x1024',
          style: 'natural',
          quality: 'standard',
          n: 1,
          user: '',
          response_format: 'url',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 60,
          error_handling: 'retry'
        },
        browse: {
          title: 'Browse',
          description: 'Web browsing and content extraction',
          inputs: [
            { name: 'url', type: 'string' },
            { name: 'enforce_crawl', type: 'boolean' },
            { name: 'plugin_name', type: 'string' }
          ],
          outputs: [
            { name: 'code', type: 'string' },
            { name: 'message', type: 'string' },
            { name: 'plugin_name', type: 'string' }
          ],
          service: 'browse',
          prompt: '',
          enforce_crawl: false,
          plugin_name: 'plugin_observation',
          timeout: 30000,
          user_agent: 'default',
          wait_for_load: 2000,
          extract_mode: 'markdown',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 60,
          error_handling: 'retry'
        },
        process: {
          title: 'Process',
          description: 'Data processing',
          inputs: [{ name: 'input', type: 'text' }],
          outputs: [{ name: 'output', type: 'text' }],
          prompt: '',
          service: '',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 30,
          error_handling: 'retry'
        },
        transform: {
          title: 'Transform',
          description: 'Data transformation',
          inputs: [{ name: 'input', type: 'text' }],
          outputs: [{ name: 'output', type: 'text' }],
          prompt: '',
          service: '',
          retry_count: 3,
          retry_delay: 1000,
          execution_timeout: 30,
          error_handling: 'retry'
        }
      }
      
      const template = nodeTemplates[nodeType] || nodeTemplates.process
      const newNode = {
        id: nodeId,
        type: nodeType,
        ...template,
        x: x - 75,
        y: y - 50
      }
      
      this.workflowNodes.push(newNode)
      this.saveToHistory()
    },
    selectNode(node) {
      this.selectedNode = node.id
      this.selectedNodeData = { ...node }
    },
    deselectNode() {
      this.selectedNode = null
      this.selectedNodeData = {}
      this.selectedConnection = null
    },
    
    // 连接配置相关方法
    selectConnection(connection) {
      this.selectedConnection = connection
      this.selectedNode = null
      this.selectedNodeData = {}
    },
    
    deselectConnection() {
      this.selectedConnection = null
    },
    
    getNodeById(nodeId) {
      return this.workflowNodes.find(node => node.id === nodeId)
    },
    
    saveConnectionConfig() {
      // 连接配置已经通过v-model双向绑定自动保存
      this.$message?.success?.(this.$t('aiAgent.workflow.connectionSaved', '连接配置已保存'))
    },
    
    deleteConnection() {
      if (!this.selectedConnection) return
      
      const connectionIndex = this.connections.findIndex(conn => conn.id === this.selectedConnection.id)
      if (connectionIndex !== -1) {
        this.connections.splice(connectionIndex, 1)
        this.selectedConnection = null
        this.saveToHistory()
        this.$message?.success?.(this.$t('aiAgent.workflow.connectionDeleted', '连接已删除'))
      }
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
    // 节点拖拽方法重命名以区分画布拖拽
    startNodeDrag(node, event) {
      event.stopPropagation() // 防止触发画布拖拽
      this.draggedNode = node
      
      // 将鼠标坐标转换为画布坐标
      const rect = this.$refs.canvas.getBoundingClientRect()
      const canvasX = (event.clientX - rect.left) / this.canvasScale - this.canvasOffsetX
      const canvasY = (event.clientY - rect.top) / this.canvasScale - this.canvasOffsetY
      
      this.dragOffset = {
        x: canvasX - node.x,
        y: canvasY - node.y
      }
      
      const handleMouseMove = (e) => {
        if (this.draggedNode) {
          const rect = this.$refs.canvas.getBoundingClientRect()
          const canvasX = (e.clientX - rect.left) / this.canvasScale - this.canvasOffsetX
          const canvasY = (e.clientY - rect.top) / this.canvasScale - this.canvasOffsetY
          
          this.draggedNode.x = canvasX - this.dragOffset.x
          this.draggedNode.y = canvasY - this.dragOffset.y
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
    
    // 画布缩放和拖拽方法
    onCanvasWheel(event) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.max(0.25, Math.min(3, this.canvasScale + delta))
      
      if (newScale !== this.canvasScale) {
        const rect = this.$refs.canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        
        // 计算缩放中心点
        const canvasMouseX = (mouseX / this.canvasScale) - this.canvasOffsetX
        const canvasMouseY = (mouseY / this.canvasScale) - this.canvasOffsetY
        
        this.canvasScale = newScale
        
        // 调整偏移量，保持鼠标位置不变
        this.canvasOffsetX = (mouseX / this.canvasScale) - canvasMouseX
        this.canvasOffsetY = (mouseY / this.canvasScale) - canvasMouseY
      }
    },
    
    onCanvasMouseDown(event) {
      // 只有在空白区域点击时才开始画布拖拽
      if (event.target === this.$refs.canvas || event.target === this.$refs.viewport) {
        this.isDraggingCanvas = true
        this.lastMousePos = { x: event.clientX, y: event.clientY }
        event.preventDefault()
      }
    },
    
    onCanvasMouseMove(event) {
      if (this.isDraggingCanvas) {
        const deltaX = event.clientX - this.lastMousePos.x
        const deltaY = event.clientY - this.lastMousePos.y
        
        this.canvasOffsetX += deltaX / this.canvasScale
        this.canvasOffsetY += deltaY / this.canvasScale
        
        this.lastMousePos = { x: event.clientX, y: event.clientY }
      }
    },
    
    onCanvasMouseUp() {
      this.isDraggingCanvas = false
    },
    
    // 缩放控制方法
    zoomIn() {
      const newScale = Math.min(3, this.canvasScale + 0.25)
      this.setCanvasScale(newScale)
    },
    
    zoomOut() {
      const newScale = Math.max(0.25, this.canvasScale - 0.25)
      this.setCanvasScale(newScale)
    },
    
    resetZoom() {
      this.setCanvasScale(1)
      this.canvasOffsetX = 0
      this.canvasOffsetY = 0
    },
    
    fitToScreen() {
      if (this.workflowNodes.length === 0) return
      
      // 计算所有节点的边界
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      
      this.workflowNodes.forEach(node => {
        minX = Math.min(minX, node.x)
        minY = Math.min(minY, node.y)
        maxX = Math.max(maxX, node.x + 280) // 节点宽度
        maxY = Math.max(maxY, node.y + 150) // 节点高度
      })
      
      const contentWidth = maxX - minX
      const contentHeight = maxY - minY
      const padding = 50
      
      const rect = this.$refs.canvas.getBoundingClientRect()
      const canvasWidth = rect.width - padding * 2
      const canvasHeight = rect.height - padding * 2
      
      const scaleX = canvasWidth / contentWidth
      const scaleY = canvasHeight / contentHeight
      const newScale = Math.min(scaleX, scaleY, 1) // 不超过100%
      
      this.canvasScale = newScale
      this.canvasOffsetX = (canvasWidth / newScale - contentWidth) / 2 - minX + padding / newScale
      this.canvasOffsetY = (canvasHeight / newScale - contentHeight) / 2 - minY + padding / newScale
    },
    
    setCanvasScale(scale) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const canvasCenterX = (centerX / this.canvasScale) - this.canvasOffsetX
      const canvasCenterY = (centerY / this.canvasScale) - this.canvasOffsetY
      
      this.canvasScale = scale
      
      this.canvasOffsetX = (centerX / this.canvasScale) - canvasCenterX
      this.canvasOffsetY = (centerY / this.canvasScale) - canvasCenterY
    },
    
    // 初始化画布
    initializeCanvas() {
      // 添加键盘事件监听
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('keyup', this.handleKeyUp)
      
      // 添加画布事件监听
      if (this.$refs.canvas) {
        this.$refs.canvas.addEventListener('contextmenu', this.handleContextMenu)
      }
    },
    
    // 设置键盘快捷键
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        const key = this.getKeyCombo(e)
        const action = this.keyboardShortcuts[key]
        
        if (action) {
          e.preventDefault()
          this.executeShortcut(action)
        }
      })
    },
    
    // 获取按键组合
    getKeyCombo(e) {
      const keys = []
      if (e.ctrlKey) keys.push('ctrl')
      if (e.shiftKey) keys.push('shift')
      if (e.altKey) keys.push('alt')
      keys.push(e.key.toLowerCase())
      return keys.join('+')
    },
    
    // 执行快捷键操作
    executeShortcut(action) {
      switch (action) {
        case 'undo':
          this.undo()
          break
        case 'redo':
          this.redo()
          break
        case 'copy':
          this.copySelectedNode()
          break
        case 'paste':
          this.pasteNode()
          break
        case 'delete':
          this.deleteSelectedNode()
          break
        case 'save':
          this.saveWorkflow()
          break
        case 'selectAll':
          this.selectAllNodes()
          break
      }
    },
    

    
    highlightConnectionPoint(node, portType) {
      if (this.isConnecting && this.connectionStart) {
        const sourcePortType = this.connectionStart.portType
        // 只高亮可以连接的端口
        if ((sourcePortType === 'output' && portType === 'input') || 
            (sourcePortType === 'input' && portType === 'output')) {
          const element = document.querySelector(`[data-node-id="${node.id}"] .${portType}-point`)
          if (element) {
            element.classList.add('connectable-highlight')
          }
        }
      }
    },
    
    clearConnectionPointHighlight(node, portType) {
      const element = document.querySelector(`[data-node-id="${node.id}"] .${portType}-point`)
      if (element) {
        element.classList.remove('connectable-highlight')
      }
    },
    

    
          showMessage(message) {
        // 静默处理，不显示任何通知
      },
      

      
      // 拖拽连接功能
      startConnectionDrag(node, portType, event) {

        
        // 防止节点被拖拽
        event.stopPropagation()
        
        this.isConnecting = true
        this.connectionStart = {
          nodeId: node.id,
          portType: portType,
          node: node
        }
        
        // 为当前连接点添加拖拽样式
        const currentElement = document.querySelector(`[data-node-id="${node.id}"] .${portType}-point`)
        if (currentElement) {
          currentElement.classList.add('dragging')
        }
        
        // 获取连接点的真实DOM位置
        const canvas = this.$refs.canvas
        
        if (currentElement && canvas) {
          const scale = this.canvasScale || 1
          const offsetX = this.canvasOffsetX || 0
          const offsetY = this.canvasOffsetY || 0
          
          const canvasRect = canvas.getBoundingClientRect()
          const elementRect = currentElement.getBoundingClientRect()
          
          // 计算连接点中心在画布内的屏幕坐标
          const screenX = (elementRect.left + elementRect.width / 2) - canvasRect.left
          const screenY = (elementRect.top + elementRect.height / 2) - canvasRect.top
          
          // 将屏幕坐标转换为SVG坐标（考虑缩放和偏移）
          const startX = screenX / scale - offsetX
          const startY = screenY / scale - offsetY
          
          // 创建临时连接线
          this.tempConnection = {
            id: 'temp',
            startX: startX,
            startY: startY,
            endX: startX,
            endY: startY,
            sourcePortType: portType,
            sourceNode: node
          }
        } else {
          // 备用计算
          const nodeWidth = 200
          const nodeHeight = 120
          
          let startX, startY
          if (portType === 'output') {
            // 输出点在节点右侧中心
            startX = node.x + nodeWidth
            startY = node.y + nodeHeight / 2
          } else {
            // 输入点在节点左侧中心
            startX = node.x
            startY = node.y + nodeHeight / 2
          }
          
          // 创建临时连接线
          this.tempConnection = {
            id: 'temp',
            startX: startX,
            startY: startY,
            endX: startX,
            endY: startY,
            sourcePortType: portType,
            sourceNode: node
          }
        }
        

        
        // 添加全局鼠标移动和释放监听
        document.addEventListener('mousemove', this.updateTempConnection)
        document.addEventListener('mouseup', this.cancelConnection)
        
        // 高亮可连接的节点
        this.highlightConnectableNodes(node, portType)
      },
      
      endConnectionDrag(targetNode, targetPortType, event) {

        
        if (!this.isConnecting || !this.connectionStart) return
        
        event.stopPropagation()
        
        const sourceNode = this.connectionStart.node
        const sourcePortType = this.connectionStart.portType
        
        // 验证连接的有效性
        if (this.isValidConnection(sourceNode, sourcePortType, targetNode, targetPortType)) {
          // 创建连接
          const connection = {
            id: `conn-${Date.now()}`,
            from: sourcePortType === 'output' ? sourceNode.id : targetNode.id,
            to: sourcePortType === 'output' ? targetNode.id : sourceNode.id,
            prompt: '请将上游节点的输出数据传递给下游节点。可以在此处添加数据转换或处理指令。',
            description: ''
          }
          
          this.connections.push(connection)
          this.saveToHistory()
          
        }
        
        this.cancelConnection()
      },
      
      updateTempConnection(event) {
        if (!this.tempConnection) return
        
        const canvas = this.$refs.canvas
        if (!canvas) return
        
        const scale = this.canvasScale || 1
        const offsetX = this.canvasOffsetX || 0
        const offsetY = this.canvasOffsetY || 0
        
        const rect = canvas.getBoundingClientRect()
        
        // 计算鼠标在画布内的屏幕坐标
        const screenX = event.clientX - rect.left
        const screenY = event.clientY - rect.top
        
        // 将屏幕坐标转换为SVG坐标（考虑缩放和偏移）
        const x = screenX / scale - offsetX
        const y = screenY / scale - offsetY
        

        
        // 更新临时连接线的终点
        this.tempConnection.endX = x
        this.tempConnection.endY = y
      },
      
      getTempConnectionPath() {
        if (!this.tempConnection) return ''
        
        const startX = this.tempConnection.startX
        const startY = this.tempConnection.startY
        const endX = this.tempConnection.endX
        const endY = this.tempConnection.endY
        
        // 创建贝塞尔曲线路径
        const deltaX = endX - startX
        const distance = Math.sqrt(deltaX * deltaX + (endY - startY) * (endY - startY))
        const curvature = Math.min(distance * 0.3, 100)
        
        const cp1X = startX + curvature
        const cp1Y = startY
        const cp2X = endX - curvature
        const cp2Y = endY
        
        return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
      },


    
    cancelConnection() {
      
      // 清除拖拽状态的样式
      if (this.connectionStart) {
        const sourceElement = document.querySelector(`[data-node-id="${this.connectionStart.nodeId}"] .${this.connectionStart.portType}-point`)
        if (sourceElement) {
          sourceElement.classList.remove('dragging')
        }
      }
      
      this.isConnecting = false
      this.connectionStart = null
      this.tempConnection = null
      
      // 移除全局事件监听
      document.removeEventListener('mousemove', this.updateTempConnection)
      document.removeEventListener('mouseup', this.cancelConnection)
      
      // 清除所有高亮
      this.clearHighlight()
      this.clearAllConnectionPointHighlights()
      
      // 连接已取消，不显示弹窗通知
    },
    
    clearAllConnectionPointHighlights() {
      // 清除所有连接点的高亮样式
      document.querySelectorAll('.connection-point').forEach(element => {
        element.classList.remove('connectable-highlight', 'dragging')
      })
    },
    

    
    // 验证连接的有效性
    isValidConnection(sourceNode, sourcePortType, targetNode, targetPortType) {
      // 不能连接到自身
      if (sourceNode.id === targetNode.id) {
        this.showError('不能连接到自身')
        return false
      }
      
      // 必须是输出连接到输入
      if (sourcePortType === targetPortType) {
        this.showError('必须连接输出端口到输入端口')
        return false
      }
      
      // 检查端口类型是否正确
      if (sourcePortType === 'output' && targetPortType !== 'input') {
        this.showError('输出端口只能连接到输入端口')
        return false
      }
      
      if (sourcePortType === 'input' && targetPortType !== 'output') {
        this.showError('输入端口只能接受输出端口的连接')
        return false
      }
      
      // 检查是否已经存在连接
      const fromNodeId = sourcePortType === 'output' ? sourceNode.id : targetNode.id
      const toNodeId = sourcePortType === 'output' ? targetNode.id : sourceNode.id
      
      const existingConnection = this.connections.find(conn => 
        conn.from === fromNodeId && conn.to === toNodeId
      )
      
      if (existingConnection) {
        this.showError('节点之间已经存在连接')
        return false
      }
      
      // 检查是否会形成循环
      if (this.wouldCreateCycle(fromNodeId, toNodeId)) {
        this.showError('不能创建循环连接')
        return false
      }
      
      return true
    },
    
    showError(message) {
      // 静默处理连接错误，不显示弹窗
    },
    
    // 检查是否会形成循环
    wouldCreateCycle(fromNodeId, toNodeId) {
      const visited = new Set()
      const stack = [fromNodeId]
      
      while (stack.length > 0) {
        const currentId = stack.pop()
        if (currentId === toNodeId) return true
        
        if (visited.has(currentId)) continue
        visited.add(currentId)
        
        // 找到所有从当前节点出发的连接
        const outgoingConnections = this.connections.filter(conn => conn.from === currentId)
        outgoingConnections.forEach(conn => {
          if (!visited.has(conn.to)) {
            stack.push(conn.to)
          }
        })
      }
      
      return false
    },
    
    // 高亮可连接的节点
    highlightConnectableNodes(sourceNode, sourcePortType) {
      this.workflowNodes.forEach(node => {
        if (node.id === sourceNode.id) return
        
        // 高亮可连接的连接点
        if (sourcePortType === 'output' && node.type !== 'start') {
          // 输出端口可以连接到其他节点的输入端口
          const inputPoint = document.querySelector(`[data-node-id="${node.id}"] .input-point`)
          if (inputPoint) {
            inputPoint.classList.add('connectable-highlight')
          }
        } else if (sourcePortType === 'input' && node.type !== 'end') {
          // 输入端口可以接收其他节点的输出端口
          const outputPoint = document.querySelector(`[data-node-id="${node.id}"] .output-point`)
          if (outputPoint) {
            outputPoint.classList.add('connectable-highlight')
          }
        }
      })
    },
    
    // 清除高亮
    clearHighlight() {
      document.querySelectorAll('.connectable').forEach(element => {
        element.classList.remove('connectable')
      })
      // 清除连接点高亮
      document.querySelectorAll('.connectable-highlight').forEach(element => {
        element.classList.remove('connectable-highlight')
      })
    },
    
    // 历史记录管理
    saveToHistory() {
      const state = {
        nodes: JSON.parse(JSON.stringify(this.workflowNodes)),
        connections: JSON.parse(JSON.stringify(this.connections))
      }
      
      // 移除当前位置之后的历史记录
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(state)
      this.historyIndex = this.history.length - 1
      
      // 限制历史记录数量
      if (this.history.length > 50) {
        this.history.shift()
        this.historyIndex--
      }
    },
    
    // 撤销
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--
        this.restoreFromHistory()
      }
    },
    
    // 重做
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
        this.restoreFromHistory()
      }
    },
    
    // 从历史记录恢复
    restoreFromHistory() {
      const state = this.history[this.historyIndex]
      this.workflowNodes = JSON.parse(JSON.stringify(state.nodes))
      this.connections = JSON.parse(JSON.stringify(state.connections))
      this.selectedNode = null
      this.selectedNodeData = {}
    },
    
    // 复制节点
    copySelectedNode() {
      if (this.selectedNode) {
        const node = this.workflowNodes.find(n => n.id === this.selectedNode)
        if (node) {
          this.copiedNode = JSON.parse(JSON.stringify(node))
        }
      }
    },
    
    // 粘贴节点
    pasteNode() {
      if (this.copiedNode) {
        const newNode = {
          ...this.copiedNode,
          id: `${this.copiedNode.type}-${++this.nodeIdCounter}`,
          x: this.copiedNode.x + 50,
          y: this.copiedNode.y + 50
        }
        this.workflowNodes.push(newNode)
        this.saveToHistory()
      }
    },
    
    // 删除选中节点
    deleteSelectedNode() {
      if (this.selectedNode) {
        this.deleteNode(this.workflowNodes.find(n => n.id === this.selectedNode))
      }
    },
    
    // 选择所有节点
    selectAllNodes() {
      // 为所有节点添加选中状态
      this.workflowNodes.forEach(node => {
        const element = document.querySelector(`[data-node-id="${node.id}"]`)
        if (element) {
          element.classList.add('node-selected')
        }
      })
    },
    
    // 显示错误信息
    showError(message) {
      if (this.$message && this.$message.error) {
        this.$message.error(message)
      } else {
        console.error(message)
      }
    },
    
    // 清理资源
    cleanup() {
      document.removeEventListener('keydown', this.handleKeyDown)
      document.removeEventListener('keyup', this.handleKeyUp)
      
      document.removeEventListener('click', this.cancelConnection)
      
      if (this.statusEventSource) {
        this.statusEventSource.close()
      }
    },
    
    // 快捷键帮助
    showKeyboardShortcuts() {
      this.showShortcutsHelp = true
    },
    
    closeShortcutsHelp() {
      this.showShortcutsHelp = false
    },
    
    // 节点配置相关方法
    isAIServiceNode(nodeType) {
      return ['LLM', 'STT', 'TTS', 'pic2text', 'text2pic'].includes(nodeType)
    },
    getPromptPlaceholder(serviceType) {
      const placeholders = {
        'LLM': '请输入LLM处理提示词，例如：你是一个专业的助手，请根据输入内容提供有价值的回复...',
        'STT': '请输入语音转文字的处理指令，例如：将以下音频转换为文字，并标注时间戳...',
        'TTS': '请输入文字转语音的处理指令，例如：以自然流畅的语调朗读以下文字...',
        'pic2text': '请输入图片转文字的处理指令，例如：分析图片内容并提取所有文字信息...',
        'text2pic': '请输入文字转图片的处理指令，例如：根据描述生成高质量的图片，注意细节和色彩搭配...'
      }
      return placeholders[serviceType] || '请输入节点处理提示词...'
    },
    getPromptTips(serviceType) {
      const tips = {
        'LLM': '提示词将影响AI的回复质量，建议明确指定角色、任务和输出格式',
        'STT': '可以指定转换精度、语言识别偏好等参数',
        'TTS': '可以指定语音风格、语速、情感等参数',
        'pic2text': '可以指定提取内容类型，如只提取文字、包含图表描述等',
        'text2pic': '详细的描述有助于生成更准确的图片，建议包含风格、颜色、构图等要素'
      }
      return tips[serviceType] || '根据节点功能配置相应的提示词'
    },
    addInput() {
      if (!this.selectedNodeData.inputs) {
        this.selectedNodeData.inputs = []
      }
      this.selectedNodeData.inputs.push({ name: 'input', type: 'text' })
    },
    removeInput(index) {
      this.selectedNodeData.inputs.splice(index, 1)
    },
    addOutput() {
      if (!this.selectedNodeData.outputs) {
        this.selectedNodeData.outputs = []
      }
      this.selectedNodeData.outputs.push({ name: 'output', type: 'text' })
    },
    removeOutput(index) {
      this.selectedNodeData.outputs.splice(index, 1)
    },
    saveNodeConfig() {
      // 找到原始节点并更新
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1) {
        // 验证配置
        if (this.validateNodeConfig()) {
          this.workflowNodes[nodeIndex] = { ...this.selectedNodeData }
          this.$message?.success?.(this.$t('aiAgent.workflow.configSaved', '节点配置已保存'))
        }
      }
    },
    validateNodeConfig() {
      const node = this.selectedNodeData
      
      // 基础验证
      if (!node.title || !node.title.trim()) {
        this.$message?.error?.(this.$t('aiAgent.workflow.nameRequired', '节点名称不能为空'))
        return false
      }
      
      // AI服务节点必须配置service和prompt
      if (this.isAIServiceNode(node.type)) {
        if (!node.service) {
          this.$message?.error?.(this.$t('aiAgent.workflow.serviceRequired', '请选择服务类型'))
          return false
        }
        
        if (!node.prompt || !node.prompt.trim()) {
          this.$message?.error?.(this.$t('aiAgent.workflow.promptRequired', '请配置节点提示词'))
          return false
        }
      }
      
      // 条件节点必须配置条件表达式
      if (node.type === 'condition' && (!node.condition || !node.condition.trim())) {
        this.$message?.error?.(this.$t('aiAgent.workflow.conditionRequired', '请配置条件表达式'))
        return false
      }
      
      return true
    },
    // 工作流操作方法
    async saveWorkflow() {
      try {
        // 验证工作流
        if (!this.validateWorkflow()) {
          return
        }
        
        // 生成DAG数据
        const dagData = this.generateDAGData()
        
        // 调用API保存
        const workflowAPI = (await import('@/config/api.js')).default
        await workflowAPI.submitDAG(dagData)
        
        this.$message?.success?.(this.$t('aiAgent.workflow.workflowSaved', '工作流已保存'))
      } catch (error) {
        console.error('保存工作流失败:', error)
        this.$message?.error?.(this.$t('aiAgent.workflow.saveFailed', '保存工作流失败') + ': ' + error.message)
      }
    },
    async testWorkflow() {
      try {
        // 验证工作流
        if (!this.validateWorkflow()) {
          return
        }
        
        // 生成DAG数据并提交测试
        const dagData = this.generateDAGData()
        
        const workflowAPI = (await import('@/config/api.js')).default
        const result = await workflowAPI.submitDAG(dagData)
        
        // 通知就绪
        await workflowAPI.notifyReady(dagData.dag_id)
        
        // 监听状态变化
        await this.monitorWorkflowExecution(dagData.dag_id)
        
        this.$message?.success?.(this.$t('aiAgent.workflow.testStarted', '工作流测试已启动'))
      } catch (error) {
        console.error('测试工作流失败:', error)
        this.$message?.error?.(this.$t('aiAgent.workflow.testFailed', '测试工作流失败') + ': ' + error.message)
      }
    },
    async deployWorkflow() {
      try {
        // 验证工作流
        if (!this.validateWorkflow()) {
          return
        }
        
        // 生成并部署DAG
        const dagData = this.generateDAGData()
        
        const workflowAPI = (await import('@/config/api.js')).default
        await workflowAPI.submitDAG(dagData)
        await workflowAPI.notifyReady(dagData.dag_id)
        
        // 更新状态
        this.workflowStatus = 'Deployed'
        
        this.$message?.success?.(this.$t('aiAgent.workflow.deploySuccess', '工作流部署成功'))
      } catch (error) {
        console.error('部署工作流失败:', error)
        this.$message?.error?.(this.$t('aiAgent.workflow.deployFailed', '部署工作流失败') + ': ' + error.message)
      }
    },
    validateWorkflow() {
      // 检查是否有start和end节点
      const hasStart = this.workflowNodes.some(node => node.type === 'start')
      const hasEnd = this.workflowNodes.some(node => node.type === 'end')
      
      if (!hasStart) {
        this.$message?.error?.(this.$t('aiAgent.workflow.startNodeRequired', '工作流必须包含开始节点'))
        return false
      }
      
      if (!hasEnd) {
        this.$message?.error?.(this.$t('aiAgent.workflow.endNodeRequired', '工作流必须包含结束节点'))
        return false
      }
      
      // 检查所有AI服务节点是否正确配置
      for (const node of this.workflowNodes) {
        if (this.isAIServiceNode(node.type)) {
          if (!node.service || !node.prompt) {
            this.$message?.error?.(this.$t('aiAgent.workflow.nodeConfigIncomplete', `节点 ${node.title} 配置不完整`))
            return false
          }
        }
      }
      
      return true
    },
    async generateDAGData() {
      const workflowAPI = (await import('@/config/api.js')).default
      
      const dagData = {
        dag_id: workflowAPI.generateDAGId(this.currentAgent.name || 'agent'),
        tenant_id: workflowAPI.config.getTenantId(),
        nodes: {},
        edges: []
      }
      
      // 转换节点数据
      this.workflowNodes.forEach(node => {
        dagData.nodes[node.id] = {
          prompt: node.prompt || '',
          service: node.service || node.type,
          // 添加完整的节点配置信息
          title: node.title || '',
          description: node.description || '',
          // 添加服务特定参数
          ...(node.service === 'LLM' && {
            model: node.model || 'gpt-3.5-turbo',
            temperature: node.temperature || 0.7,
            max_tokens: node.max_tokens || 2000,
            top_p: node.top_p || 1.0,
            frequency_penalty: node.frequency_penalty || 0,
            presence_penalty: node.presence_penalty || 0,
            stop: node.stop || '',
            user: node.user || '',
            stream: node.stream || false,
            logit_bias: node.logit_bias || {}
          }),
          ...(node.service === 'STT' && {
            language: node.language || 'zh',
            model: node.model || 'whisper-1',
            response_format: node.response_format || 'text',
            temperature: node.temperature || 0,
            prompt: node.prompt || '',
            timestamp_granularities: node.timestamp_granularities || ['word']
          }),
          ...(node.service === 'TTS' && {
            voice: node.voice || 'alloy',
            response_format: node.response_format || 'mp3',
            speed: node.speed || 1.0,
            model: node.model || 'tts-1'
          }),
          ...(node.service === 'pic2text' && {
            language: node.language || 'zh',
            format: node.format || 'plain',
            max_tokens: node.max_tokens || 300,
            detail: node.detail || 'auto',
            quality: node.quality || 'auto'
          }),
          ...(node.service === 'text2pic' && {
            model: node.model || 'dall-e-3',
            size: node.size || '1024x1024',
            style: node.style || 'vivid',
            quality: node.quality || 'standard',
            n: node.n || 1,
            user: node.user || '',
            response_format: node.response_format || 'url'
          }),
          ...(node.service === 'browse' && {
            method: node.method || 'GET',
            headers: node.headers || {},
            timeout: node.timeout || 30000,
            retry_count: node.retry_count || 3,
            retry_delay: node.retry_delay || 1000,
            user_agent: node.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            load_timeout: node.load_timeout || 10000,
            extract_mode: node.extract_mode || 'text',
            fallback_value: node.fallback_value || ''
          })
        }
      })
      
      // 转换连接数据
      this.connections.forEach(connection => {
        dagData.edges.push({
          from: connection.from,
          to: connection.to,
          prompt: connection.prompt || ''
        })
      })
      
      return dagData
    },
    async monitorWorkflowExecution(dagId) {
      const workflowAPI = (await import('@/config/api.js')).default
      
      const eventSource = workflowAPI.createStatusStream(
        dagId,
        (statusData) => {
          console.log('工作流状态更新:', statusData)
          this.workflowStatus = statusData.status || 'Running'
          
          // 更新节点状态
          if (statusData.node_id && statusData.node_status) {
            const node = this.workflowNodes.find(n => n.id === statusData.node_id)
            if (node) {
              node.status = statusData.node_status
            }
          }
        },
        (error) => {
          console.error('监听工作流状态失败:', error)
          this.$message?.error?.('监听工作流状态失败')
        }
      )
      
      // 保存EventSource引用用于清理
      this.statusEventSource = eventSource
    },
    clearCanvas() {
      this.workflowNodes = []
      this.connections = []
      this.selectedNode = null
      this.selectedNodeData = {}
      this.workflowStatus = 'Ready'
    },
                getConnectionPath(connection) {
      const fromNode = this.workflowNodes.find(n => n.id === connection.from)
      const toNode = this.workflowNodes.find(n => n.id === connection.to)
      
      if (!fromNode || !toNode) {
        return ''
      }
      
      // 获取连接点的真实DOM位置
      const fromOutputPoint = document.querySelector(`[data-node-id="${fromNode.id}"] .output-point`)
      const toInputPoint = document.querySelector(`[data-node-id="${toNode.id}"] .input-point`)
      const canvas = this.$refs.canvas
      
      if (!fromOutputPoint || !toInputPoint || !canvas) {
        // 如果无法获取DOM元素，使用备用计算
        const nodeWidth = 200
        const nodeHeight = 120
        const fromX = fromNode.x + nodeWidth
        const fromY = fromNode.y + nodeHeight / 2
        const toX = toNode.x
        const toY = toNode.y + nodeHeight / 2
        
        const deltaX = toX - fromX
        const curvature = Math.min(Math.abs(deltaX) * 0.5, 120)
        const cp1X = fromX + curvature
        const cp1Y = fromY
        const cp2X = toX - curvature
        const cp2Y = toY
        
        return `M ${fromX} ${fromY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${toX} ${toY}`
      }
      
      // 获取画布的位置和变换信息
      const scale = this.canvasScale || 1
      const offsetX = this.canvasOffsetX || 0
      const offsetY = this.canvasOffsetY || 0
      
      const canvasRect = canvas.getBoundingClientRect()
      const fromRect = fromOutputPoint.getBoundingClientRect()
      const toRect = toInputPoint.getBoundingClientRect()
      
      // 计算连接点中心在画布内的屏幕坐标
      const fromScreenX = (fromRect.left + fromRect.width / 2) - canvasRect.left
      const fromScreenY = (fromRect.top + fromRect.height / 2) - canvasRect.top
      const toScreenX = (toRect.left + toRect.width / 2) - canvasRect.left
      const toScreenY = (toRect.top + toRect.height / 2) - canvasRect.top
      
      // 将屏幕坐标转换为SVG坐标（考虑缩放和偏移）
      const fromX = fromScreenX / scale - offsetX
      const fromY = fromScreenY / scale - offsetY
      const toX = toScreenX / scale - offsetX
      const toY = toScreenY / scale - offsetY
      

      
      // 创建优雅的贝塞尔曲线路径
      const deltaX = toX - fromX
      const deltaY = toY - fromY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // 根据距离和方向动态调整曲线弯曲度
      const curvature = Math.min(Math.abs(deltaX) * 0.5, 120)
      
      // 控制点计算，让曲线更自然
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
      
      getTempConnectionPath() {
        if (!this.tempConnection) return ''
        
        const startX = this.tempConnection.startX || 0
        const startY = this.tempConnection.startY || 0
        const endX = this.tempConnection.endX || 0
        const endY = this.tempConnection.endY || 0
        
        // 创建贝塞尔曲线路径
        const deltaX = endX - startX
        const distance = Math.sqrt(deltaX * deltaX + (endY - startY) * (endY - startY))
        const curvature = Math.min(distance * 0.3, 100)
        
        const cp1X = startX + curvature
        const cp1Y = startY
        const cp2X = endX - curvature
        const cp2Y = endY
        
        return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
      },
    clearCanvas() {
      this.workflowNodes = []
      this.connections = []
      this.deselectNode()
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
    },
    selectConnection(connection) {
      this.selectedConnection = connection
    },

    // ==================== 工作流管理方法 ====================
    
    // 加载工作流列表
    async loadWorkflowList() {
      try {
        this.loadingWorkflows = true
        this.workflowListError = null
        
        const workflowAPI = (await import('@/config/api.js')).default
        
        const response = await workflowAPI.getAllDAGs()
        this.workflowList = response.dags || []
        
        // 更新统计信息
        this.updateWorkflowStats()
        
      } catch (error) {
        console.error('加载工作流列表失败:', error)
        this.workflowListError = error.message || '加载工作流列表失败'
        this.$message?.error?.('加载工作流列表失败: ' + error.message)
      } finally {
        this.loadingWorkflows = false
      }
    },

    // 刷新工作流列表
    async refreshWorkflowList() {
      await this.loadWorkflowList()
      if (!this.workflowListError) {
        this.$message?.success?.('工作流列表已刷新')
      }
    },

    // 重试加载工作流列表
    async retryLoadWorkflows() {
      await this.loadWorkflowList()
    },

    // 清除工作流错误
    clearWorkflowError() {
      this.workflowListError = null
    },

    // 更新工作流统计
    updateWorkflowStats() {
      const stats = {
        total: this.workflowList.length,
        running: 0,
        completed: 0,
        failed: 0,
        pending: 0
      }

      this.workflowList.forEach(workflow => {
        if (stats.hasOwnProperty(workflow.status)) {
          stats[workflow.status]++
        }
      })

      this.workflowStats = stats
    },

    // 查看工作流详情
    viewWorkflow(workflow) {
      // 切换到工作流设计页面并加载该工作流
      this.setActiveTab('workflow')
      this.loadWorkflowData(workflow.dag_id)
    },

    // 查看工作流状态
    async viewWorkflowStatus(workflow) {
      try {
        const workflowAPI = (await import('@/config/api.js')).default
        const status = await workflowAPI.getDAGStatus(workflow.dag_id)
        
        this.currentWorkflowStatus = status
        this.monitoringWorkflowId = workflow.dag_id
        
        // 显示状态监控弹窗
        this.showStatusMonitor = true
        
        // 开始实时监控
        this.startStatusMonitoring(workflow.dag_id)
        
      } catch (error) {
        console.error('获取工作流状态失败:', error)
        this.$message?.error?.('获取工作流状态失败: ' + error.message)
      }
    },

    // 查看工作流结果
    async viewWorkflowResults(workflow) {
      try {
        const workflowAPI = (await import('@/config/api.js')).default
        const results = await workflowAPI.getResult(workflow.dag_id)
        
        this.workflowResults = results
        this.showResultsViewer = true
        
      } catch (error) {
        console.error('获取工作流结果失败:', error)
        this.$message?.error?.('获取工作流结果失败: ' + error.message)
      }
    },

    // 复制工作流
    async cloneWorkflow(workflow) {
      try {
        // 加载原工作流数据
        await this.loadWorkflowData(workflow.dag_id)
        
        // 生成新的DAG数据
        const workflowAPI = (await import('@/config/api.js')).default
        const newDagData = await this.generateDAGData()
        newDagData.dag_id = workflowAPI.generateDAGId('cloned')
        
        // 提交新工作流
        await workflowAPI.submitDAG(newDagData)
        
        // 刷新列表
        await this.refreshWorkflowList()
        
        this.$message?.success?.(`工作流已复制为: ${newDagData.dag_id}`)
        
      } catch (error) {
        console.error('复制工作流失败:', error)
        this.$message?.error?.('复制工作流失败: ' + error.message)
      }
    },

    // 删除工作流
    async deleteWorkflow(workflow) {
      if (!confirm(`确定要删除工作流 "${workflow.name || workflow.dag_id}" 吗？此操作不可撤销。`)) {
        return
      }

      try {
        // 注意：API文档中没有删除接口，这里只从本地列表移除
        // 在实际项目中需要调用删除API
        const index = this.workflowList.findIndex(w => w.dag_id === workflow.dag_id)
        if (index !== -1) {
          this.workflowList.splice(index, 1)
          this.updateWorkflowStats()
        }
        
        this.$message?.success?.('工作流已删除')
        
      } catch (error) {
        console.error('删除工作流失败:', error)
        this.$message?.error?.('删除工作流失败: ' + error.message)
      }
    },

    // 加载工作流数据
    async loadWorkflowData(dagId) {
      try {
        // 这里需要根据实际API实现加载工作流的节点和连接数据
        // 目前API文档中没有获取工作流详情的接口，这里暂时用空实现
        console.log('加载工作流数据:', dagId)
        
      } catch (error) {
        console.error('加载工作流数据失败:', error)
        this.$message?.error?.('加载工作流数据失败: ' + error.message)
      }
    },

    // 开始状态监控（优化版）
    startStatusMonitoring(dagId) {
      this.stopStatusMonitoring()
      this.sseReconnectAttempts = 0
      this.connectSSE(dagId)
    },

    // SSE连接处理
    async connectSSE(dagId) {
      try {
        this.sseConnectionStatus = 'connecting'
        
        const workflowAPI = (await import('@/config/api.js')).default
        
        // 创建SSE连接
        this.statusEventSource = workflowAPI.createStatusStream(
          dagId,
          (statusData) => {
            this.onSSEMessage(statusData)
          },
          (error) => {
            this.onSSEError(error)
          }
        )

        // 设置连接超时
        const connectionTimeout = setTimeout(() => {
          if (this.sseConnectionStatus === 'connecting') {
            this.onSSEError(new Error('连接超时'))
          }
        }, 10000)

        // 模拟连接成功（实际应该通过第一个消息或连接事件确认）
        setTimeout(() => {
          if (this.sseConnectionStatus === 'connecting') {
            this.sseConnectionStatus = 'connected'
            this.sseReconnectAttempts = 0
            this.sseLastHeartbeat = Date.now()
            this.startHeartbeatMonitoring()
            clearTimeout(connectionTimeout)
          }
        }, 2000)

      } catch (error) {
        console.error('创建SSE连接失败:', error)
        this.onSSEError(error)
      }
    },

    // SSE消息处理
    onSSEMessage(statusData) {
      this.sseConnectionStatus = 'connected'
      this.sseLastHeartbeat = Date.now()
      
      // 将状态更新加入队列以批量处理
      this.statusUpdateQueue.push(statusData)
      
      // 启动批量更新定时器
      if (!this.statusUpdateTimer) {
        this.statusUpdateTimer = setTimeout(() => {
          this.processBatchStatusUpdates()
        }, this.batchUpdateInterval)
      }
    },

    // SSE错误处理
    onSSEError(error) {
      console.error('SSE连接错误:', error)
      this.sseConnectionStatus = 'error'
      
      // 自动重连机制
      if (this.sseReconnectAttempts < this.sseMaxReconnectAttempts) {
        this.sseReconnectAttempts++
        const delay = this.sseReconnectDelay * Math.pow(2, this.sseReconnectAttempts - 1)
        
        console.log(`尝试重连... (${this.sseReconnectAttempts}/${this.sseMaxReconnectAttempts})`)
        
        setTimeout(() => {
          if (this.monitoringWorkflowId) {
            this.connectSSE(this.monitoringWorkflowId)
          }
        }, delay)
      } else {
        this.$message?.error?.('连接失败，已达到最大重连次数')
      }
    },

    // 批量处理状态更新
    processBatchStatusUpdates() {
      if (this.statusUpdateQueue.length === 0) return
      
      // 处理所有队列中的状态更新
      const updates = [...this.statusUpdateQueue]
      this.statusUpdateQueue = []
      
      // 合并更新，只保留最新的状态
      const latestUpdate = updates[updates.length - 1]
      this.currentWorkflowStatus = latestUpdate
      
      // 更新UI显示
      this.updateStatusDisplay(latestUpdate)
      
      // 清理定时器
      if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer)
        this.statusUpdateTimer = null
      }
    },

    // 停止状态监控
    stopStatusMonitoring() {
      if (this.statusEventSource) {
        this.statusEventSource.close()
        this.statusEventSource = null
      }
      
      if (this.sseHeartbeatInterval) {
        clearInterval(this.sseHeartbeatInterval)
        this.sseHeartbeatInterval = null
      }
      
      if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer)
        this.statusUpdateTimer = null
      }
      
      this.sseConnectionStatus = 'disconnected'
      this.statusUpdateQueue = []
    },

    // 心跳监控
    startHeartbeatMonitoring() {
      if (this.sseHeartbeatInterval) {
        clearInterval(this.sseHeartbeatInterval)
      }
      
      this.sseHeartbeatInterval = setInterval(() => {
        const now = Date.now()
        const timeSinceLastHeartbeat = now - (this.sseLastHeartbeat || 0)
        
        // 如果超过30秒没有收到消息，认为连接异常
        if (timeSinceLastHeartbeat > 30000) {
          console.warn('心跳超时，尝试重连...')
          this.onSSEError(new Error('心跳超时'))
        }
      }, 5000)
    },

    // 获取连接状态文本
    getConnectionStatusText(status) {
      const statusMap = {
        'disconnected': '未连接',
        'connecting': '连接中...',
        'connected': '已连接',
        'error': '连接错误'
      }
      return statusMap[status] || '未知状态'
    },

    // 更新状态显示
    updateStatusDisplay(statusData) {
      // 更新工作流列表中的状态
      const workflow = this.workflowList.find(w => w.dag_id === statusData.dag_id)
      if (workflow) {
        workflow.status = statusData.status
        this.updateWorkflowStats()
      }

      // 如果正在监控当前工作流，更新节点状态
      if (statusData.node_id && statusData.node_status) {
        const node = this.workflowNodes.find(n => n.id === statusData.node_id)
        if (node) {
          node.status = statusData.node_status
        }
      }
    },

    // 工具方法
    getStatusLabel(status) {
      const labels = {
        running: '运行中',
        completed: '已完成', 
        failed: '失败',
        pending: '待运行'
      }
      return labels[status] || status
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    deselectConnection() {
      this.selectedConnection = null
    },

    // ==================== 状态监控弹窗方法 ====================
    
    // 关闭状态监控弹窗
    closeStatusMonitor() {
      this.showStatusMonitor = false
      this.stopStatusMonitoring()
      this.monitoringWorkflowId = null
      this.currentWorkflowStatus = null
    },

    // 刷新工作流状态
    async refreshWorkflowStatus() {
      if (!this.monitoringWorkflowId) return
      
      try {
        const workflowAPI = (await import('@/config/api.js')).default
        const status = await workflowAPI.getDAGStatus(this.monitoringWorkflowId)
        this.currentWorkflowStatus = status
        
        this.$message?.success?.('状态已刷新')
      } catch (error) {
        console.error('刷新工作流状态失败:', error)
        this.$message?.error?.('刷新状态失败: ' + error.message)
      }
    },

    // 关闭结果查看器
    closeResultsViewer() {
      this.showResultsViewer = false
      this.workflowResults = null
      this.selectedMessageType = 'all'
    },

    // 刷新工作流结果
    async refreshWorkflowResults() {
      if (!this.monitoringWorkflowId) return
      
      try {
        const workflowAPI = (await import('@/config/api.js')).default
        const results = await workflowAPI.getResult(this.monitoringWorkflowId)
        this.workflowResults = results
        
        this.$message?.success?.('结果已刷新')
      } catch (error) {
        console.error('刷新工作流结果失败:', error)
        this.$message?.error?.('刷新结果失败: ' + error.message)
      }
    },

    // 导出结果
    async exportResults() {
      if (!this.workflowResults) return
      
      try {
        const data = {
          workflow_id: this.monitoringWorkflowId,
          export_time: new Date().toISOString(),
          summary: {
            total_messages: this.workflowResults.total_messages,
            successful_messages: this.workflowResults.successful_messages,
            failed_messages: this.workflowResults.failed_messages
          },
          messages: this.filteredMessages
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `workflow_results_${this.monitoringWorkflowId}_${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        this.$message?.success?.('结果已导出')
      } catch (error) {
        console.error('导出结果失败:', error)
        this.$message?.error?.('导出失败: ' + error.message)
      }
    },

    // 工具方法
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    formatDuration(duration) {
      if (!duration) return '-'
      
      const seconds = Math.floor(duration % 60)
      const minutes = Math.floor((duration / 60) % 60)
      const hours = Math.floor(duration / 3600)
      
      if (hours > 0) {
        return `${hours}小时${minutes}分${seconds}秒`
      } else if (minutes > 0) {
        return `${minutes}分${seconds}秒`
      } else {
        return `${seconds}秒`
      }
    },

    formatMessageContent(content) {
      if (typeof content === 'string') {
        return content
      }
      return JSON.stringify(content, null, 2)
    },

    // 重试加载工作流列表
    async retryLoadWorkflows() {
      await this.loadWorkflowList()
    },

    // 清除工作流错误
    clearWorkflowError() {
      this.workflowListError = null
    },

    // 显示错误消息
    showErrorToast(message, duration = 5000) {
      // 创建错误消息元素
      const toast = document.createElement('div')
      toast.className = 'error-message-toast'
      toast.innerHTML = `
        <div class="toast-header">
          <span>⚠️</span>
          <span>错误提示</span>
        </div>
        <div class="toast-body">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      `
      
      // 添加到页面
      document.body.appendChild(toast)
      
      // 自动移除
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast)
        }
      }, duration)
    },

    // 处理网络错误
    handleNetworkError(error) {
      console.error('网络错误:', error)
      
      // 显示网络错误横幅
      this.showNetworkErrorBanner()
      
      // 记录错误
      this.logError('network', error)
    },

    // 显示网络错误横幅
    showNetworkErrorBanner() {
      // 检查是否已经有横幅
      if (document.querySelector('.network-error-banner')) {
        return
      }
      
      const banner = document.createElement('div')
      banner.className = 'network-error-banner'
      banner.innerHTML = `
        <div class="banner-content">
          <span>⚠️ 网络连接异常</span>
          <button class="retry-btn" onclick="location.reload()">重试</button>
        </div>
      `
      
      document.body.appendChild(banner)
      
      // 5秒后自动隐藏
      setTimeout(() => {
        if (banner.parentElement) {
          banner.parentElement.removeChild(banner)
        }
      }, 5000)
    },

    // 记录错误
    logError(type, error) {
      const errorLog = {
        type,
        message: error.message || error,
        timestamp: new Date().toISOString(),
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      // 存储到本地存储
      try {
        const logs = JSON.parse(localStorage.getItem('ai-agent-error-logs') || '[]')
        logs.push(errorLog)
        
        // 只保留最近的100条错误日志
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100)
        }
        
        localStorage.setItem('ai-agent-error-logs', JSON.stringify(logs))
      } catch (e) {
        console.error('无法保存错误日志:', e)
      }
    },

    // 获取错误日志
    getErrorLogs() {
      try {
        return JSON.parse(localStorage.getItem('ai-agent-error-logs') || '[]')
      } catch (e) {
        console.error('无法读取错误日志:', e)
        return []
      }
    },

    // 清除错误日志
    clearErrorLogs() {
      localStorage.removeItem('ai-agent-error-logs')
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

/* 工作流容器不需要padding */
.editor-content.workflow-container {
  padding: 0;
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
  margin: 0;
  padding: 0;
}

.workflow-main {
  flex: 1;
  display: flex;
  background: #1a1a1a;
  overflow: hidden;
}

/* 左侧工具栏 */
.workflow-sidebar {
  width: 250px;
  background: #2d2d2d;
  border-right: 1px solid #404040;
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.node-palette h4 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #4ecdc4;
  padding-bottom: 0.5rem;
}

.palette-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-category {
  background: #323232;
  border-radius: 8px;
  padding: 0.75rem;
  border-left: 3px solid #ff6b6b;
}

.category-title {
  margin: 0 0 0.75rem 0;
  color: #ff6b6b;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  min-width: 30px;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.node-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e0e0e0;
}

.node-desc {
  font-size: 0.75rem;
  color: #b0b0b0;
  line-height: 1.2;
}

/* 画布容器 */
.workflow-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  margin: 0;
  padding: 0;
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

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: space-between;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  min-width: 40px;
  text-align: center;
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
  cursor: grab;
}

.workflow-canvas:active {
  cursor: grabbing;
}

.canvas-viewport {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
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

.node-LLM {
  border-color: #6f42c1;
}

.node-LLM .node-header {
  background: linear-gradient(135deg, #6f42c1, #563d7c);
  color: white;
}

.node-STT {
  border-color: #20c997;
}

.node-STT .node-header {
  background: linear-gradient(135deg, #20c997, #17a2b8);
  color: white;
}

.node-TTS {
  border-color: #fd7e14;
}

.node-TTS .node-header {
  background: linear-gradient(135deg, #fd7e14, #e8590c);
  color: white;
}

.node-pic2text {
  border-color: #6610f2;
}

.node-pic2text .node-header {
  background: linear-gradient(135deg, #6610f2, #520dc2);
  color: white;
}

.node-text2pic {
  border-color: #e83e8c;
}

.node-text2pic .node-header {
  background: linear-gradient(135deg, #e83e8c, #d91a72);
  color: white;
}

.node-transform {
  border-color: #17a2b8;
}

.node-transform .node-header {
  background: linear-gradient(135deg, #17a2b8, #138496);
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
  z-index: 20;
}

.connection-point {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: 3px solid #ffffff;
  border-radius: 50%;
  pointer-events: all;
  cursor: crosshair;
  transition: all 0.2s ease;
  opacity: 1;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 0 2px rgba(59, 130, 246, 0.3),
    0 0 8px rgba(59, 130, 246, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

.connection-point-label {
  font-size: 6px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  pointer-events: none;
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
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
}

.output-point {
  right: -10px;
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

/* 网格背景 */
.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.1;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
}

/* 连接状态样式 */
.connectable {
  border: 2px solid #4ecdc4 !important;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.5) !important;
  animation: pulse-green 1s infinite;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(78, 205, 196, 0.8);
  }
}

/* 节点连接状态 */
.workflow-node.connecting {
  border-color: #ff6b6b;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.workflow-node.connected {
  border-color: #4ecdc4;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
}

/* 临时连接线 */
.temp-connection {
  stroke: #ff6b6b;
  stroke-width: 2;
  stroke-dasharray: 5,5;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

/* 表单控件样式 */
.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #4ecdc4;
  margin-right: 8px;
}

.form-range {
  width: 100%;
  height: 6px;
  background: #404040;
  outline: none;
  border-radius: 3px;
  margin: 8px 0;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #4ecdc4;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #1a1a1a;
}

.form-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4ecdc4;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #1a1a1a;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #b0b0b0;
  margin-top: 4px;
}

/* 输入输出端口样式 */
.io-config {
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 1rem;
  background: #2a2a2a;
}

.io-section {
  margin-bottom: 1rem;
}

.io-section:last-child {
  margin-bottom: 0;
}

.io-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.io-item:last-child {
  margin-bottom: 0;
}

.form-input-sm {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #404040;
  color: #e0e0e0;
  font-size: 0.8rem;
}

.form-select-sm {
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #404040;
  color: #e0e0e0;
  font-size: 0.8rem;
}

.btn-remove {
  width: 24px;
  height: 24px;
  border: none;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #ff5252;
  transform: scale(1.1);
}

/* 配置面板动作按钮 */
.config-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #2a2a2a;
  border-top: 1px solid #404040;
  margin-top: auto;
}

.config-actions .btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.config-actions .btn-primary {
  background: #4ecdc4;
  color: #1a1a1a;
}

.config-actions .btn-primary:hover {
  background: #45b7b8;
}

.config-actions .btn-outline {
  background: transparent;
  color: #e0e0e0;
  border: 1px solid #555;
}

.config-actions .btn-outline:hover {
  background: #404040;
}

/* 节点端口可视化 */
.workflow-node .node-inputs,
.workflow-node .node-outputs {
  font-size: 0.7rem;
  color: #b0b0b0;
  margin-top: 0.5rem;
}

.workflow-node .node-inputs .input-port,
.workflow-node .node-outputs .output-port {
  display: inline-block;
  background: #404040;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin: 0.1rem;
  border: 1px solid #555;
}

.workflow-node .node-inputs .input-port {
  border-left: 3px solid #4ecdc4;
}

.workflow-node .node-outputs .output-port {
  border-right: 3px solid #ff6b6b;
}

/* 提示词编辑器增强 */
.prompt-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: 'Consolas', 'Monaco', monospace;
  line-height: 1.5;
}

.prompt-tips {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  border-left: 3px solid #4ecdc4;
}

.prompt-tips small {
  color: #b0b0b0;
  font-style: italic;
}

/* 节点状态指示器 */
.node-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.3rem 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.ready {
  background: #4ecdc4;
  box-shadow: 0 0 4px rgba(78, 205, 196, 0.5);
}

.status-indicator.running {
  background: #feca57;
  box-shadow: 0 0 4px rgba(254, 202, 87, 0.5);
  animation: pulse 1s infinite;
}

.status-indicator.completed {
  background: #55a3ff;
  box-shadow: 0 0 4px rgba(85, 163, 255, 0.5);
}

.status-indicator.failed {
  background: #ff6b6b;
  box-shadow: 0 0 4px rgba(255, 107, 107, 0.5);
}

.status-text {
  color: #b0b0b0;
  font-size: 0.8rem;
}

/* 快捷键帮助弹窗 */
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.shortcuts-dialog {
  background: #2d2d2d;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #404040;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.shortcuts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #404040;
}

.shortcuts-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.3rem;
}

.shortcuts-content {
  padding: 2rem;
}

.shortcuts-section {
  margin-bottom: 2rem;
}

.shortcuts-section:last-child {
  margin-bottom: 0;
}

.shortcuts-section h4 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
  font-size: 1.1rem;
  border-bottom: 1px solid #404040;
  padding-bottom: 0.5rem;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #333;
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-item kbd {
  background: #404040;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: #e0e0e0;
  margin: 0 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.shortcut-item .mouse-action {
  background: #45b7b8;
  color: #1a1a1a;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.shortcut-item span:last-child {
  color: #b0b0b0;
  font-size: 0.9rem;
}

/* 端口标签样式 */
.port-label {
  font-size: 0.7rem;
  color: #b0b0b0;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.port-name {
  font-size: 0.8rem;
  color: #e0e0e0;
  margin-right: 0.5rem;
}

.port-type {
  font-size: 0.7rem;
  color: #b0b0b0;
  background: #404040;
  padding: 0.1rem 0.3rem;
  border-radius: 8px;
  border: 1px solid #555;
}

/* 按钮样式增强 */
.btn-info {
  background: #4ecdc4;
  color: #1a1a1a;
  border: 1px solid #4ecdc4;
}

.btn-info:hover {
  background: #45b7b8;
  border-color: #45b7b8;
}

.btn-close {
  background: transparent;
  border: none;
  color: #b0b0b0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #404040;
  color: #e0e0e0;
}

/* 配置帮助文本样式 */
.config-help {
  display: block;
  margin-top: 0.3rem;
  color: #909090;
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.4;
}

/* 子配置区域样式 */
.config-subsection {
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: #262626;
  border-radius: 6px;
  border: 1px solid #404040;
}

.config-subsection:last-child {
  margin-bottom: 0;
}

.config-subsection label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
  font-weight: 500;
  font-size: 0.85rem;
}

.config-subsection .form-input,
.config-subsection .form-textarea,
.config-subsection .form-select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #555555;
  border-radius: 4px;
  font-size: 0.85rem;
  background: #404040;
  color: #e0e0e0;
}

.config-subsection .form-input:focus,
.config-subsection .form-textarea:focus,
.config-subsection .form-select:focus {
  outline: none;
  border-color: #4ecdc4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
}

/* 复选框标签样式 */
.checkbox-label {
  margin-left: 0.5rem;
  color: #e0e0e0;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 配置区域标题样式 */
.config-section h5 {
  margin: 0 0 1rem 0;
  color: #4ecdc4;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #404040;
  padding-bottom: 0.5rem;
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

/* 节点配置面板样式 */
.prompt-textarea {
  font-family: 'Consolas', 'Monaco', monospace !important;
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
  background: #2a2a2a !important;
  border: 1px solid #555555 !important;
  color: #e0e0e0 !important;
}

.prompt-tips {
  margin-top: 0.5rem;
}

.prompt-tips small {
  color: #4ecdc4;
  font-style: italic;
}

.form-range {
  width: 100%;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #b0b0b0;
}

.range-labels span:nth-child(2) {
  color: #4ecdc4;
  font-weight: 600;
}

.io-config {
  background: #323232;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.io-section {
  margin-bottom: 1rem;
}

.io-section:last-child {
  margin-bottom: 0;
}

.io-section label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
  font-weight: 600;
  font-size: 0.9rem;
}

.io-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-input-sm {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #555555;
  border-radius: 4px;
  background: #404040;
  color: #e0e0e0;
  font-size: 0.85rem;
}

.form-select-sm {
  padding: 0.5rem;
  border: 1px solid #555555;
  border-radius: 4px;
  background: #404040;
  color: #e0e0e0;
  font-size: 0.85rem;
  min-width: 80px;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #c82333;
  transform: scale(1.1);
}

.config-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #404040;
}

.config-actions .btn {
  flex: 1;
}

/* 节点状态指示器 */
.workflow-node.node-status-running {
  border-color: #ffc107;
  animation: pulse 2s infinite;
}

.workflow-node.node-status-completed {
  border-color: #28a745;
}

.workflow-node.node-status-failed {
  border-color: #dc3545;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

/* 工作流状态指示器 */
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
  font-size: 0.85rem;
  color: #b0b0b0;
}

.canvas-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.canvas-controls {
  display: flex;
  gap: 0.5rem;
}

/* 节点在画布中的提示词显示 */
.node-body .node-prompt {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #3a3a3a;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #b0b0b0;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-body .node-service {
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #4ecdc4;
  color: #1a1a1a;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-block;
}

.connection-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}

.connection-line {
  opacity: 1;
  transition: all 0.2s ease;
  cursor: pointer;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.connection-line:hover {
  stroke: #8b5cf6 !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3));
}

.connection-line.selected {
  stroke: #ffd93d !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 0 8px rgba(255, 217, 61, 0.6));
}

.temp-connection-line {
  stroke: #ffd93d;
  stroke-width: 2;
  stroke-dasharray: 6,3;
  animation: dash 1s linear infinite;
  filter: drop-shadow(0 0 6px rgba(255, 217, 61, 0.6));
  pointer-events: none;
  opacity: 0.9;
}

/* 连接配置面板样式 */
.connection-info {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.connection-nodes {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.connection-node {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.connection-node strong {
  font-size: 0.9rem;
  color: #00d4ff;
}

.connection-node span {
  font-size: 0.95rem;
  color: #e0e0e0;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.connection-arrow {
  font-size: 1.2rem;
  color: #00d4ff;
  margin: 0 0.5rem;
}

/* 连接点状态样式 */
.connection-point.connectable-highlight {
  background: #00d4ff !important;
  border-color: #ffffff !important;
  box-shadow: 
    0 0 0 4px rgba(0, 212, 255, 0.5),
    0 0 20px rgba(0, 212, 255, 1);
  transform: scale(1.3);
}

.connection-point.dragging {
  background: #ffd93d !important;
  border-color: #ffffff !important;
  box-shadow: 
    0 0 0 4px rgba(255, 217, 61, 0.5),
    0 0 25px rgba(255, 217, 61, 0.8);
  transform: scale(1.4);
}



@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

.selected {
  border: 2px dashed #ff6b6b !important;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5) !important;
  animation: pulse-red 1s infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
  }
}

/* ==================== 工作流管理页面样式 ==================== */
.workflows-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
  text-align: center;
}

.section-header h3 {
  font-size: 24px;
  color: #e0e0e0;
  margin-bottom: 10px;
}

.section-header p {
  color: #b0b0b0;
  font-size: 16px;
}

/* 工作流统计卡片 */
.workflow-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #323232;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  border: 1px solid #404040;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.stat-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 5px;
}

.stat-label {
  color: #b0b0b0;
  font-size: 14px;
}

/* 搜索和筛选区域 */
.workflow-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #323232;
  border-radius: 12px;
  border: 1px solid #404040;
}

.search-box {
  display: flex;
  flex: 1;
  min-width: 200px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #555555;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  background: #404040;
  color: #e0e0e0;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #555555;
  background: #404040;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  color: #e0e0e0;
}

.filter-btn:hover {
  background: #555555;
  border-color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* 工作流列表 */
.workflow-list {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #b0b0b0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h4 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #e0e0e0;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 20px;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.workflow-card {
  background: #323232;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #404040;
  position: relative;
  overflow: hidden;
}

.workflow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: #667eea;
}

.workflow-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.workflow-card:hover::before {
  opacity: 1;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.workflow-title {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.workflow-status.running {
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
  color: white;
}

.workflow-status.completed {
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
}

.workflow-status.failed {
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
  color: white;
}

.workflow-status.pending {
  background: linear-gradient(135deg, #ff9800 0%, #ffc107 100%);
  color: white;
}

.workflow-meta {
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.meta-label {
  color: #b0b0b0;
}

.meta-value {
  color: #e0e0e0;
  font-weight: 500;
}

.workflow-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #404040;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
}

.action-btn:hover {
  background: #555555;
  transform: scale(1.1);
}

.action-btn.danger:hover {
  background: #f44336;
  color: white;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #b0b0b0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #404040;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 工作流管理页面响应式适配 */
@media (max-width: 768px) {
  .workflows-management {
    padding: 10px;
  }

  .workflow-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .stat-number {
    font-size: 20px;
  }

  .workflow-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .workflow-grid {
    grid-template-columns: 1fr;
  }
}

/* ==================== 状态监控弹窗样式 ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.status-monitor-modal,
.results-viewer-modal {
  background: #2a2a2a;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid #404040;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #404040;
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
}

.modal-header h3 {
  color: #e0e0e0;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

/* 连接状态指示器 */
.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.connection-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.connection-indicator.connected {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #4caf50;
}

.connection-indicator.connecting {
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid #ff9800;
}

.connection-indicator.disconnected {
  background: rgba(158, 158, 158, 0.2);
  border: 1px solid #9e9e9e;
}

.connection-indicator.error {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.connected .indicator-dot {
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
}

.connecting .indicator-dot {
  background: #ff9800;
  animation: pulse-orange 2s infinite;
}

.disconnected .indicator-dot {
  background: #9e9e9e;
}

.error .indicator-dot {
  background: #f44336;
  animation: pulse-red 2s infinite;
}

.indicator-text {
  color: #e0e0e0;
  font-size: 11px;
}

@keyframes pulse-orange {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #404040;
  color: #e0e0e0;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #404040;
  background: #333333;
}

/* 工作流信息区域 */
.workflow-info-section {
  margin-bottom: 24px;
}

.workflow-info-section h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #323232;
  border-radius: 8px;
  border: 1px solid #404040;
}

.info-label {
  color: #b0b0b0;
  font-size: 14px;
}

.info-value {
  color: #e0e0e0;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

/* 节点状态区域 */
.nodes-status-section {
  margin-bottom: 24px;
}

.nodes-status-section h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.nodes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-nodes,
.empty-logs,
.empty-messages {
  text-align: center;
  padding: 40px 20px;
  color: #b0b0b0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.node-status-item {
  background: #323232;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #404040;
  transition: all 0.2s ease;
}

.node-status-item:hover {
  border-color: #667eea;
}

.node-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.node-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #404040;
  border-radius: 8px;
}

.node-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-name {
  color: #e0e0e0;
  font-weight: 500;
}

.node-type {
  color: #b0b0b0;
  font-size: 12px;
}

.node-status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.node-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  color: #e0e0e0;
  font-size: 12px;
  font-weight: 500;
  min-width: 40px;
}

.node-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #4a2c2c;
  border-radius: 6px;
  border: 1px solid #8b4444;
}

.error-icon {
  font-size: 16px;
}

.error-message {
  color: #ff9999;
  font-size: 14px;
}

/* 执行日志区域 */
.execution-logs-section {
  margin-bottom: 24px;
}

.execution-logs-section h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.logs-container {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #404040;
  max-height: 300px;
  overflow-y: auto;
}

.logs-list {
  display: flex;
  flex-direction: column;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid #2a2a2a;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item.info {
  background: rgba(33, 150, 243, 0.1);
}

.log-item.warning {
  background: rgba(255, 152, 0, 0.1);
}

.log-item.error {
  background: rgba(244, 67, 54, 0.1);
}

.log-time {
  color: #b0b0b0;
  min-width: 80px;
}

.log-level {
  color: #667eea;
  font-weight: 500;
  min-width: 60px;
  text-transform: uppercase;
}

.log-message {
  color: #e0e0e0;
  flex: 1;
}

/* 结果查看器样式 */
.results-overview {
  margin-bottom: 24px;
}

.results-overview h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.overview-item {
  text-align: center;
  padding: 16px;
  background: #323232;
  border-radius: 8px;
  border: 1px solid #404040;
}

.overview-label {
  color: #b0b0b0;
  font-size: 14px;
  margin-bottom: 8px;
}

.overview-value {
  color: #e0e0e0;
  font-size: 24px;
  font-weight: bold;
}

.messages-section h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.messages-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.filter-select {
  padding: 8px 12px;
  background: #404040;
  border: 1px solid #555555;
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 14px;
}

.messages-list {
  max-height: 400px;
  overflow-y: auto;
}

.messages-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  background: #323232;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #404040;
}

.message-item.input {
  border-left: 4px solid #2196f3;
}

.message-item.output {
  border-left: 4px solid #4caf50;
}

.message-item.error {
  border-left: 4px solid #f44336;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-type {
  color: #667eea;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
}

.message-time {
  color: #b0b0b0;
  font-size: 12px;
}

.message-content {
  color: #e0e0e0;
}

.message-content pre {
  background: #1a1a1a;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.message-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #4a2c2c;
  border-radius: 6px;
  border: 1px solid #8b4444;
}

.error-text {
  color: #ff9999;
  font-size: 14px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 20px;
  }

  .status-monitor-modal,
  .results-viewer-modal {
    width: 100%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .node-status-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .overview-stats {
    grid-template-columns: 1fr;
  }

  .messages-filters {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #ff9999;
  background: #4a2c2c;
  border-radius: 12px;
  border: 1px solid #8b4444;
  margin: 20px 0;
}

.error-state .error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-state h4 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #ff9999;
}

.error-state p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #ffcccc;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .btn {
  min-width: 100px;
}

/* 节点错误指示器 */
.workflow-node.has-error {
  border: 2px solid #f44336;
  background: linear-gradient(145deg, #4a2c2c 0%, #3d2525 100%);
}

.workflow-node.has-error::before {
  content: '⚠️';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  z-index: 10;
}

.node-error-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: #ff9999;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #8b4444;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.node-error-tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #8b4444;
}

/* 全局错误消息样式 */
.error-message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4a2c2c;
  color: #ff9999;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #8b4444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  animation: slideInRight 0.3s ease;
  max-width: 400px;
}

.error-message-toast .toast-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
}

.error-message-toast .toast-body {
  font-size: 14px;
  line-height: 1.4;
}

.error-message-toast .toast-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #ff9999;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.error-message-toast .toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 网络错误指示器 */
.network-error-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  padding: 12px;
  text-align: center;
  z-index: 10000;
  font-size: 14px;
  font-weight: 500;
}

.network-error-banner .banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.network-error-banner .retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.network-error-banner .retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .error-state {
    padding: 40px 10px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-message-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style> 
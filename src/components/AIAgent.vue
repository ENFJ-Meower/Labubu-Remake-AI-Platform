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
                
                <!-- 可缩放的画布内容容器 -->
                <div class="canvas-viewport" 
                     :style="{ 
                       transform: `scale(${canvasScale}) translate(${canvasOffsetX}px, ${canvasOffsetY}px)`,
                       transformOrigin: '0 0'
                     }"
                     ref="viewport">
                  
                  <!-- 连接线 -->
                  <svg class="connection-lines" :width="virtualCanvasWidth" :height="virtualCanvasHeight">
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

                <!-- 图片生成特有配置 -->
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

                <!-- 条件节点配置 -->
                <div v-if="selectedNodeData.type === 'condition'" class="config-section">
                  <label>{{ $t('aiAgent.workflow.conditionExpression', '条件表达式') }}</label>
                  <input v-model="selectedNodeData.condition" type="text" class="form-input" :placeholder="$t('aiAgent.workflow.conditionPlaceholder', '例如：result.length > 0')">
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
      nodeIdCounter: 1,
      // 画布缩放和拖拽相关
      canvasScale: 1,
      canvasOffsetX: 0,
      canvasOffsetY: 0,
      isDraggingCanvas: false,
      lastMousePos: { x: 0, y: 0 },
      virtualCanvasWidth: 3000,  // 虚拟画布更大，提供更多空间
      virtualCanvasHeight: 2000
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
          temperature: 0.7
        },
        STT: {
          title: 'STT',
          description: 'Speech to text conversion',
          inputs: [{ name: 'audio', type: 'audio' }],
          outputs: [{ name: 'text', type: 'text' }],
          service: 'STT',
          prompt: '',
          language: 'zh'
        },
        TTS: {
          title: 'TTS',
          description: 'Text to speech conversion',
          inputs: [{ name: 'text', type: 'text' }],
          outputs: [{ name: 'audio', type: 'audio' }],
          service: 'TTS',
          prompt: '',
          voice: 'alloy'
        },
        pic2text: {
          title: 'Pic2Text',
          description: 'Image to text conversion',
          inputs: [{ name: 'image', type: 'image' }],
          outputs: [{ name: 'text', type: 'text' }],
          service: 'pic2text',
          prompt: ''
        },
        text2pic: {
          title: 'Text2Pic',
          description: 'Text to image generation',
          inputs: [{ name: 'prompt', type: 'text' }],
          outputs: [{ name: 'image', type: 'image' }],
          service: 'text2pic',
          prompt: '',
          size: '1024x1024',
          style: 'natural'
        },
        process: {
          title: 'Process',
          description: 'Data processing',
          inputs: [{ name: 'input', type: 'text' }],
          outputs: [{ name: 'output', type: 'text' }],
          prompt: '',
          service: ''
        },
        transform: {
          title: 'Transform',
          description: 'Data transformation',
          inputs: [{ name: 'input', type: 'text' }],
          outputs: [{ name: 'output', type: 'text' }],
          prompt: '',
          service: ''
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
  startConnection(node, portType) {
    console.log('Start connection:', node.id, portType)
          // Connection logic to be implemented
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
        service: node.service || node.type
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
</style> 
<template>
  <!-- Main AI Agent Builder Container AI智能体构建器主容器 -->
  <div class="ai-agent-builder">
    <!-- Global tooltip container 全局tooltip容器 -->
    <div 
      ref="globalTooltip"
      class="global-tooltip"
      :class="{ active: tooltipData.visible }"
      :style="{ left: tooltipData.x + 'px', top: tooltipData.y + 'px' }"
    >
      <div class="tooltip-title">{{ tooltipData.title }}</div>
      <div class="tooltip-description">{{ tooltipData.description }}</div>
    </div>
    <!-- Top toolbar with workflow actions顶部工具栏包含工作流操作 -->
    <div class="top-toolbar">
      <div class="toolbar-left">
        <!-- Workflow information display工作流信息显示 -->
        <div class="agent-info">
          <div class="agent-meta">
            <h2 class="agent-name">{{ currentWorkflow.name || $t('aiAgent.workflow.statusValues.unnamed', 'Unnamed Workflow') }}</h2>
            <p class="agent-status">{{ getWorkflowStatus() }}</p>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <!-- Deploy workflow button部署工作流按钮 -->
        <button class="btn btn-success" @click="deployWorkflow">
          <i class="icon">🚀</i> {{ $t('aiAgent.workflow.toolbar.deployWorkflow', 'Deploy Workflow') }}
        </button>
      </div>
    </div>

    <!-- Main content area主内容区域 -->
    <div class="main-container">
      <!-- Left navigation panel左侧导航面板 -->
      <div class="sidebar">
        <div class="nav-tabs">
          <!-- Navigation tabs循环渲染导航标签 -->
          <div 
            v-for="tab in navigationTabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            :data-tab="tab.id"
            @click="setActiveTab(tab.id)"
            @mouseenter="showTooltip(tab.id, $event)"
            @mouseleave="hideTooltip"
            :title="getTabTitle(tab.id) + ' - ' + getTabDescription(tab.id)"
          >
            <div class="tab-icon">{{ tab.icon }}</div>
            <div class="tab-indicator" v-if="tab.hasContent"></div>
          </div>
        </div>
      </div>

      <!-- Right editing area右侧编辑区域 -->
      <div class="editor-area">
        <!-- DAG workflow editing -->
        <div v-if="activeTab === 'workflow'" class="editor-content workflow-container">
          <div class="workflow-main">
            <!-- 左侧工具栏 -->
            <div class="workflow-sidebar">
              <div class="node-palette">
                <h4>{{ $t('aiAgent.workflow.nodeTypes', '节点类型') }}</h4>
                <div class="palette-categories">


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


                </div>
              </div>
            </div>
            
            <!-- 中央画布区域 -->
            <div class="workflow-canvas-container">
              <div class="canvas-header">
                <h3>{{ currentWorkflow.name || $t('aiAgent.workflow.toolbar.dagWorkflow', 'DAG Workflow') }} - {{ $t('aiAgent.workflow.toolbar.designer', 'Designer') }}</h3>
                <div class="canvas-toolbar">
                  <!-- 缩放控制 -->
                  <div class="zoom-controls-compact">
                    <button class="zoom-btn-mini" @click="zoomOut" :disabled="canvasScale <= 0.25" title="缩小">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 7h6v2H5V7z"/>
                      </svg>
                    </button>
                    
                    <div class="zoom-mini-display" @click="resetZoom" title="点击重置到100%">
                      <span class="zoom-mini-text">{{ Math.round(canvasScale * 100) }}%</span>
                    </div>
                    
                    <button class="zoom-btn-mini" @click="zoomIn" :disabled="canvasScale >= 3" title="放大">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 7h6v2H5V7z"/>
                        <path d="M7 5h2v6H7V5z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div class="canvas-actions-compact">
                    <button class="action-btn-mini" @click="clearCanvas" title="清空">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
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
                    
                    <!-- 提示词预览 -->
                    <div v-if="node.prompt" class="node-prompt" :title="node.prompt">
                      {{ node.prompt.length > 50 ? node.prompt.substring(0, 50) + '...' : node.prompt }}
                    </div>
                    
                    <!-- 输入端口 -->
                    <div v-if="node.inputs && node.inputs.length > 0" class="node-inputs">
                      <div class="port-label">{{ $t('aiAgent.workflow.inputPortsLabel', '🔽 输入:') }}</div>
                      <div v-for="input in node.inputs" :key="input.name" class="input-port">
                        <span class="port-name">{{ input.name }}</span>
                        <span class="port-type">{{ input.type }}</span>
                      </div>
                    </div>
                    
                    <!-- 输出端口 -->
                    <div v-if="node.outputs && node.outputs.length > 0" class="node-outputs">
                      <div class="port-label">{{ $t('aiAgent.workflow.outputPortsLabel', '🔼 输出:') }}</div>
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
                    <div class="connection-point input-point"
                         @mousedown.stop="startConnectionDrag(node, 'input', $event)"
                         @mouseup.stop="endConnectionDrag(node, 'input', $event)"
                         @mouseover="highlightConnectionPoint(node, 'input')"
                         @mouseleave="clearConnectionPointHighlight(node, 'input')"
                         :title="$t('aiAgent.workflow.shortcuts.dragToConnect', '按住拖拽创建连接')">
                      <span class="connection-point-label">{{ $t('aiAgent.workflow.inputPort', 'IN') }}</span>
                    </div>
                    <div class="connection-point output-point"
                         @mousedown.stop="startConnectionDrag(node, 'output', $event)"
                         @mouseup.stop="endConnectionDrag(node, 'output', $event)"
                         @mouseover="highlightConnectionPoint(node, 'output')"
                         @mouseleave="clearConnectionPointHighlight(node, 'output')"
                         :title="$t('aiAgent.workflow.shortcuts.dragToConnect', '按住拖拽创建连接')">
                      <span class="connection-point-label">{{ $t('aiAgent.workflow.outputPort', 'OUT') }}</span>
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
                  <span>{{ $t('aiAgent.workflow.status', '状态') }}: {{ getTranslatedStatus(workflowStatus) }}</span>
                </div>
                <div class="canvas-controls">
                  <button class="btn btn-outline btn-sm" @click="clearCanvas">
                    <i class="icon">🗑️</i> {{ $t('aiAgent.workflow.clearCanvas', '清空画布') }}
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
                <!-- 核心配置 -->
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.nodeName', '节点名称') }}</label>
                  <input v-model="selectedNodeData.title" type="text" class="form-input" :placeholder="$t('aiAgent.workflow.nodeNamePlaceholder', '输入节点名称')">
                </div>
                
                <!-- Prompt配置（核心配置） -->
                <div class="config-section">
                  <label>{{ $t('aiAgent.workflow.nodePrompt', '节点提示词') }}</label>
                  <textarea 
                    v-model="selectedNodeData.prompt" 
                    class="form-textarea prompt-textarea" 
                    rows="6" 
                    :placeholder="$t('aiAgent.workflow.nodePromptPlaceholder', '输入节点的提示词...')"
                  ></textarea>
                  <div class="prompt-tips">
                    <small>{{ $t('aiAgent.workflow.promptTipsSimple', '提示词用于指导AI如何处理输入数据') }}</small>
                  </div>
                </div>
                





                <!-- 端口数据配置 -->
                <div class="config-section" v-if="selectedNodeData.inputs && selectedNodeData.inputs.length > 0">
                  <h5>{{ $t('aiAgent.workflow.inputData', '输入数据配置') }}</h5>
                  
                  <div class="input-data-config">
                    <div v-for="(input, index) in selectedNodeData.inputs" :key="`input-data-${index}`" class="input-data-item">
                      <div class="input-data-header">
                        <span class="input-data-name">{{ input.name }}</span>
                        <span class="input-data-type">{{ getPortTypeLabel(input.type) }}</span>
                      </div>
                      
                      <!-- 文本输入 -->
                      <div v-if="input.type === 'text'" class="input-control">
                        <label>{{ $t('aiAgent.workflow.inputContent', '输入内容') }}</label>
                        <textarea 
                          v-model="input.value" 
                          class="form-textarea" 
                          rows="3" 
                          :placeholder="$t('aiAgent.workflow.inputTextPlaceholder', '输入文本内容...')"
                        ></textarea>
                      </div>
                      
                      <!-- 图片上传 -->
                      <div v-else-if="input.type === 'image'" class="input-control">
                        <label>{{ $t('aiAgent.workflow.uploadImage', '上传图片') }}</label>
                        <div class="image-upload-area">
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="handleImageUpload($event, input, index)"
                            class="file-input"
                            :id="`image-upload-${index}`"
                          >
                          <label :for="`image-upload-${index}`" class="upload-label">
                            <div v-if="!input.value" class="upload-placeholder">
                              <div class="upload-icon">📷</div>
                              <div class="upload-text">{{ $t('aiAgent.workflow.clickToUpload', '点击上传图片') }}</div>
                              <div class="upload-hint">{{ $t('aiAgent.workflow.supportedFormats', '支持 JPG、PNG、GIF、BMP、WEBP、SVG 格式，自动转换为JPEG') }}</div>
                            </div>
                            <div v-else class="uploaded-image">
                              <img :src="input.value" alt="Uploaded" class="preview-image">
                              <div class="image-overlay">
                                <button @click="removeImage(input, index)" class="remove-image-btn">×</button>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!-- 音频上传 -->
                      <div v-else-if="input.type === 'audio'" class="input-control">
                        <label>{{ $t('aiAgent.workflow.uploadAudio', '上传音频') }}</label>
                        <div class="audio-upload-area">
                          <input 
                            type="file" 
                            accept="audio/*" 
                            @change="handleAudioUpload($event, input, index)"
                            class="file-input"
                            :id="`audio-upload-${index}`"
                          >
                          <label :for="`audio-upload-${index}`" class="upload-label">
                            <div v-if="!input.value" class="upload-placeholder">
                              <div class="upload-icon">🎵</div>
                              <div class="upload-text">{{ $t('aiAgent.workflow.clickToUploadAudio', '点击上传音频') }}</div>
                              <div class="upload-hint">{{ $t('aiAgent.workflow.audioFormats', '支持 MP3、WAV、OGG 格式，自动设置为WAV格式') }}</div>
                            </div>
                            <div v-else class="uploaded-audio">
                              <div class="audio-info">
                                <span class="audio-name">{{ input.fileName || 'Audio File' }}</span>
                                <button @click="removeAudio(input, index)" class="remove-audio-btn">×</button>
                              </div>
                              <audio :src="input.value" controls class="audio-preview"></audio>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!-- 文件上传 -->
                      <div v-else-if="input.type === 'file'" class="input-control">
                        <label>{{ $t('aiAgent.workflow.uploadFile', '上传文件') }}</label>
                        <div class="file-upload-area">
                          <input 
                            type="file" 
                            @change="handleFileUpload($event, input, index)"
                            class="file-input"
                            :id="`file-upload-${index}`"
                          >
                          <label :for="`file-upload-${index}`" class="upload-label">
                            <div v-if="!input.value" class="upload-placeholder">
                              <div class="upload-icon">📄</div>
                              <div class="upload-text">{{ $t('aiAgent.workflow.clickToUploadFile', '点击上传文件') }}</div>
                            </div>
                            <div v-else class="uploaded-file">
                              <div class="file-info">
                                <span class="file-name">{{ input.fileName || '文件' }}</span>
                                <button @click="removeFile(input, index)" class="remove-file-btn">×</button>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!-- JSON输入 -->
                      <div v-else-if="input.type === 'json'" class="input-control">
                        <label>{{ $t('aiAgent.workflow.inputJson', 'JSON数据') }}</label>
                        <textarea 
                          v-model="input.value" 
                          class="form-textarea json-textarea" 
                          rows="4" 
                          :placeholder="$t('aiAgent.workflow.jsonPlaceholder', '输入JSON格式数据...')"
                        ></textarea>
                        <small class="json-hint">{{ $t('aiAgent.workflow.jsonHint', '请输入有效的JSON格式数据') }}</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="config-actions">
                  <button class="btn btn-save" @click="saveNodeConfig">
                    <span class="btn-icon">💾</span>
                    {{ $t('aiAgent.workflow.saveConfig', 'Save') }}
                  </button>
                  <button class="btn btn-validate" @click="validateNodeConfig">
                    <span class="btn-icon">✅</span>
                    {{ $t('aiAgent.workflow.validateConfig', 'Validate') }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 连接配置面板 -->
            <div class="workflow-config-panel" v-if="selectedConnection">
              <div class="config-header">
                <h4>{{ $t('aiAgent.workflow.connectionConfiguration', '连接配置') }}</h4>
                <button class="btn-close" @click="deselectConnection">×</button>
              </div>
              
              <div class="config-content">
                <div class="connection-info">
                  <div class="connection-nodes">
                    <div class="connection-node">
                      <strong>{{ $t('aiAgent.workflow.fromNode', '源节点') }}:</strong>
                      <span>{{ getNodeById(selectedConnection.from)?.title || $t('aiAgent.workflow.unknown', 'Unknown') }}</span>
                    </div>
                    <div class="connection-arrow">→</div>
                    <div class="connection-node">
                      <strong>{{ $t('aiAgent.workflow.toNode', '目标节点') }}:</strong>
                      <span>{{ getNodeById(selectedConnection.to)?.title || $t('aiAgent.workflow.unknown', 'Unknown') }}</span>
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
                  <button class="btn btn-save" @click="saveConnectionConfig">
                    <span class="btn-icon">💾</span>
                    {{ $t('aiAgent.workflow.saveConnection', '保存连接') }}
                  </button>
                  <button class="btn btn-danger" @click="deleteConnection">
                    <span class="btn-icon">🗑️</span>
                    {{ $t('aiAgent.workflow.deleteConnection', '删除连接') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Workflow Management -->
        <div v-else-if="activeTab === 'workflows'" class="editor-content workflows-management">
          <div class="section-header">
            <h3>📋 {{ $t('aiAgent.workflow.workflowManagement.title', '工作流管理') }}</h3>
            <p>{{ $t('aiAgent.workflow.workflowManagement.description', '查看和管理您的所有DAG工作流') }}</p>
          </div>

          <!-- 工作流统计面板 -->
          <div class="workflow-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.total }}</div>
                <div class="stat-label">{{ $t('aiAgent.workflow.workflowManagement.totalWorkflows', '总工作流') }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">▶️</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.running }}</div>
                <div class="stat-label">{{ $t('aiAgent.workflow.workflowManagement.runningWorkflows', '运行中') }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.completed }}</div>
                <div class="stat-label">{{ $t('aiAgent.workflow.workflowManagement.completedWorkflows', '已完成') }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❌</div>
              <div class="stat-info">
                <div class="stat-number">{{ workflowStats.failed }}</div>
                <div class="stat-label">{{ $t('aiAgent.workflow.workflowManagement.failedWorkflows', '失败') }}</div>
              </div>
            </div>
          </div>

          <!-- 搜索和筛选 -->
          <div class="workflow-filters">
            <div class="search-box">
              <input 
                v-model="workflowSearch" 
                type="text" 
                :placeholder="$t('aiAgent.workflow.workflowManagement.searchPlaceholder', '搜索工作流...')" 
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
              <i class="icon">🔄</i> {{ $t('aiAgent.workflow.workflowManagement.refresh', '刷新') }}
            </button>
          </div>

          <!-- 工作流列表 -->
          <div class="workflow-list" v-if="!loadingWorkflows">
            <div v-if="filteredWorkflows.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h4>{{ $t('aiAgent.workflow.workflowManagement.noWorkflows', '暂无工作流') }}</h4>
              <p>{{ $t('aiAgent.workflow.workflowManagement.noWorkflowsDescription', '您还没有创建任何工作流，现在就开始设计您的第一个工作流吧！') }}</p>
              <button class="btn btn-primary" @click="setActiveTab('workflow')">
                {{ $t('aiAgent.workflow.workflowManagement.createWorkflow', '创建工作流') }}
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
                <div class="workflow-description" v-if="workflow.description">
                  {{ workflow.description }}
                </div>
                <div class="workflow-tags" v-if="workflow.tags && workflow.tags.length > 0">
                  <span v-for="tag in workflow.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="workflow-meta">
                  <div class="meta-item">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.nodeCount', '节点数:') }}</span>
                    <span class="meta-value">{{ workflow.node_count || 0 }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.createdAt', '创建时间:') }}</span>
                    <span class="meta-value">{{ formatDate(workflow.created_at) }}</span>
                  </div>
                  <div class="meta-item" v-if="workflow.execution_time">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.executionTime', '执行时长:') }}</span>
                    <span class="meta-value">{{ workflow.execution_time }}</span>
                  </div>
                  <div class="meta-item" v-if="workflow.success_rate">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.successRate', '成功率:') }}</span>
                    <span class="meta-value">{{ workflow.success_rate }}%</span>
                  </div>
                </div>
                <div class="workflow-actions" @click.stop>
                  <button class="action-btn" @click="viewWorkflowStatus(workflow)" :title="$t('aiAgent.workflow.workflowManagement.viewStatus', '查看状态')">
                    📊
                  </button>
                  <button class="action-btn" @click="viewWorkflowResults(workflow)" :title="$t('aiAgent.workflow.workflowManagement.viewResults', '查看结果')">
                    📋
                  </button>
                  <button class="action-btn" @click="cloneWorkflow(workflow)" :title="$t('aiAgent.workflow.workflowManagement.clone', '复制')">
                    📄
                  </button>
                  <button class="action-btn danger" @click="deleteWorkflow(workflow)" :title="$t('aiAgent.workflow.workflowManagement.deleteWorkflow', '删除')">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loadingWorkflows" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ $t('aiAgent.workflow.workflowManagement.loading', '正在加载工作流列表...') }}</p>
          </div>

          <!-- 错误状态 -->
          <div v-if="workflowListError" class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>{{ $t('aiAgent.workflow.workflowManagement.loadError', '加载失败') }}</h4>
            <p>{{ workflowListError }}</p>
            <div class="error-actions">
              <button class="btn btn-primary" @click="retryLoadWorkflows">
                🔄 {{ $t('aiAgent.workflow.workflowManagement.retry', '重试') }}
              </button>
              <button class="btn btn-secondary" @click="clearWorkflowError">
                {{ $t('aiAgent.workflow.workflowManagement.close', '关闭') }}
              </button>
            </div>
          </div>
        </div>


              </div>
            </div>
            






    <!-- 状态监控弹窗 -->
    <div v-if="showStatusMonitor" class="modal-overlay" @click="closeStatusMonitor">
      <div class="status-monitor-modal" @click.stop>
        <div class="modal-header">
          <h3>📊 Workflow Status Monitor</h3>
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
            <h4>Workflow Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Workflow ID:</span>
                <span class="info-value">{{ monitoringWorkflowId }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value status-badge" :class="currentWorkflowStatus?.status">
                  {{ getStatusLabel(currentWorkflowStatus?.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Start Time:</span>
                <span class="info-value">{{ formatDate(currentWorkflowStatus?.start_time) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Duration:</span>
                <span class="info-value">{{ formatDuration(currentWorkflowStatus?.duration) }}</span>
              </div>
            </div>
          </div>

          <!-- 节点状态列表 -->
          <div class="nodes-status-section">
            <h4>Node Status</h4>
            <div class="nodes-list">
              <div v-if="!currentWorkflowStatus?.nodes || currentWorkflowStatus.nodes.length === 0" 
                   class="empty-nodes">
                <div class="empty-icon">📄</div>
                <p>No node status information</p>
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
            <h4>Execution Logs</h4>
            <div class="logs-container">
              <div v-if="!currentWorkflowStatus?.logs || currentWorkflowStatus.logs.length === 0" 
                   class="empty-logs">
                <div class="empty-icon">📝</div>
                <p>No execution logs</p>
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
                      <button class="btn btn-secondary" @click="closeStatusMonitor">{{ $t('aiAgent.workflow.workflowManagement.close', '关闭') }}</button>
                          <button class="btn btn-primary" @click="refreshWorkflowStatus">
                  <i class="icon">🔄</i> {{ $t('aiAgent.workflow.workflowManagement.refreshStatus', '刷新状态') }}
                </button>
        </div>
      </div>
    </div>

    <!-- 执行结果查看器 -->
    <div v-if="showResultsViewer" class="modal-overlay" @click="closeResultsViewer">
      <div class="results-viewer-modal" @click.stop>
        <div class="modal-header">
          <h3>📋 Workflow Execution Results - {{ currentWorkflow.name || monitoringWorkflowId }}</h3>
          <button class="close-btn" @click="closeResultsViewer">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 🎯 最终输出区域 -->
          <div class="final-output-section" :class="{ 'focused': focusOnFinalOutput }">
            <div class="final-output-header">
              <h4>🎯 Final Output</h4>
              <div class="output-node-info" v-if="finalOutputNode">
                <span class="node-type">{{ finalOutputNode.service || finalOutputNode.type }}</span>
                <span class="node-name">{{ finalOutputNode.name || finalOutputNode.id }}</span>
              </div>
              </div>
            
            <div class="final-output-content">
              <div v-if="!finalOutputData" class="no-final-output">
                <div class="empty-icon">🎯</div>
                <p>No final output available</p>
                <small>Workflow may not be complete or has no output nodes</small>
              </div>
              
              <div v-else class="final-output-display" :class="finalOutputData.type">
                <!-- 文本输出 -->
                <div v-if="finalOutputData.type === 'text'" class="output-text">
                  <div class="markdown-container" v-html="renderMarkdown(finalOutputData.displayContent)"></div>
            </div>
                
                <!-- JSON输出 -->
                <div v-else-if="finalOutputData.type === 'json'" class="output-json">
                  <pre>{{ finalOutputData.displayContent }}</pre>
          </div>

                <!-- 图片输出 -->
                <div v-else-if="finalOutputData.type === 'image'" class="output-image">
                  <img :src="finalOutputData.content" alt="Output Image" @error="handleImageError" />
                </div>
                
                <!-- 音频输出 -->
                <div v-else-if="finalOutputData.type === 'audio'" class="output-audio">
                  <audio controls :src="finalOutputData.content" @error="handleAudioError">
                    Your browser does not support audio playback
                  </audio>
                </div>
                
                <!-- 视频输出 -->
                <div v-else-if="finalOutputData.type === 'video'" class="output-video">
                  <video controls :src="finalOutputData.content" @error="handleVideoError">
                    Your browser does not support video playback
                  </video>
                </div>
                
                <!-- 其他类型 -->
                <div v-else class="output-other">
                  <pre>{{ finalOutputData.displayContent }}</pre>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div v-if="finalOutputData" class="output-actions">
                <button class="action-btn primary" @click="copyFinalOutput" title="Copy">
                  <i class="icon">📋</i> Copy
                </button>
                <button class="action-btn secondary" @click="downloadFinalOutput" :title="getDownloadButtonText()">
                  <i class="icon">💾</i> {{ getDownloadButtonText() }}
                </button>
                <button class="action-btn secondary" @click="shareFinalOutput" title="Share">
                  <i class="icon">🔗</i> Share
                </button>
                <button class="action-btn secondary" @click="viewFinalOutputFullscreen" title="Fullscreen">
                  <i class="icon">⛶</i> Fullscreen
                </button>
              </div>
            </div>
          </div>

          <!-- 📊 执行摘要 -->
          <div class="execution-summary-section">
            <h4>📊 执行摘要</h4>
            <div class="summary-stats">
              <div class="summary-item">
                <div class="summary-label">总耗时</div>
                <div class="summary-value">{{ formatDuration(calculateExecutionSummary().totalTime) }}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Successful Nodes</div>
                <div class="summary-value">{{ calculateExecutionSummary().successfulNodes }}/{{ calculateExecutionSummary().totalNodes }}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">执行状态</div>
                <div class="summary-value status-badge" :class="calculateExecutionSummary().status">
                  {{ getStatusLabel(calculateExecutionSummary().status) }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">完成时间</div>
                <div class="summary-value">{{ formatDate(currentWorkflowStatus?.end_time) }}</div>
              </div>
            </div>
          </div>

          <!-- 🔄 节点执行详情 -->
          <div class="node-execution-details">
            <h4>🔄 Node Execution Details</h4>
            <div class="execution-flow">
              <div v-if="!currentWorkflowStatus?.nodes || currentWorkflowStatus.nodes.length === 0" 
                   class="empty-nodes">
                <div class="empty-icon">🔄</div>
                <p>No node execution details</p>
              </div>
              <div v-else class="nodes-flow">
                <div v-for="(node, index) in currentWorkflowStatus.nodes" 
                     :key="node.node_id"
                     class="flow-node"
                     :class="{ 'final-node': node.node_id === finalOutputNode?.id }">
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
                  <div class="node-time">{{ formatTime(node.execution_time) }}</div>
                  
                  <!-- 连接箭头 -->
                  <div v-if="index < currentWorkflowStatus.nodes.length - 1" class="flow-arrow">
                    ➜
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 📋 完整日志 (可折叠) -->
          <div class="full-logs-section">
            <div class="logs-header" @click="toggleLogsExpanded">
              <h4>📋 Complete Logs</h4>
              <button class="expand-btn" :class="{ 'expanded': logsExpanded }">
                                  {{ logsExpanded ? 'Collapse' : 'Expand' }}
              </button>
            </div>
            
            <div v-if="logsExpanded" class="logs-content">
              <!-- 消息筛选 -->
            <div class="messages-filters">
              <select v-model="selectedMessageType" class="filter-select">
                <option value="all">All Messages</option>
                <option value="input">Input Messages</option>
                <option value="output">Output Messages</option>
                <option value="error">Error Messages</option>
              </select>
                <button class="btn btn-sm" @click="exportResults">Export Logs</button>
            </div>
              
              <!-- 消息列表 -->
            <div class="messages-list">
              <div v-if="!filteredMessages || filteredMessages.length === 0" 
                   class="empty-messages">
                <div class="empty-icon">💬</div>
                <p>No message records</p>
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
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeResultsViewer">Close</button>
          <button class="btn btn-primary" @click="refreshWorkflowResults">Refresh Results</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { AI_AGENT_API } from '@/config/api.js'
import { marked } from 'marked'

// AI Agent Builder Component - Main workflow design interface AI智能体构建器组件 - 主要工作流设计界面
export default {
  name: 'AIAgent', // Component name组件名称
  data() {
    return {
      // Active tab state当前激活的标签页状态
      activeTab: 'workflow',
      // Global tooltip data全局tooltip数据
      tooltipData: {
        visible: false,
        x: 0,
        y: 0,
        title: '',
        description: ''
      },
      // Current workflow data当前工作流数据
      currentWorkflow: {
        name: '', // Workflow name工作流名称
        description: '' // Workflow description工作流描述
      },
      
      // Navigation tabs configuration导航标签页配置
      navigationTabs: [
        {
          id: 'workflow',
          icon: '🔄',
          title: 'Workflow Design',
          description: 'Visual DAG workflow editor - Core feature',
          hasContent: true
        },
        {
          id: 'workflows',
          icon: '📋',
          title: 'Workflow Management',
          description: 'View and manage all DAG workflows',
          hasContent: true
        }
      ],
      // Workflow related data工作流相关数据
      workflowNodes: [], // Array of workflow nodes工作流节点数组
      connections: [], // Array of node connections节点连接数组
      selectedNode: null, // Currently selected node当前选中的节点
      
      // Selected connection选中的连接
      selectedConnection: null,
      
      // Canvas related data画布相关数据
      canvasScale: 1, // Canvas zoom scale画布缩放比例
      canvasOffsetX: 0, // Canvas X offset画布X偏移量
      canvasOffsetY: 0, // Canvas Y offset画布Y偏移量
      virtualCanvasWidth: 2000, // Virtual canvas width虚拟画布宽度
      virtualCanvasHeight: 1500, // Virtual canvas height虚拟画布高度
      
      // Connection related data连接相关数据
      isConnecting: false, // Whether user is connecting nodes是否正在连接节点
      connectionStart: null, // Connection start point连接起始点
      tempConnection: null, // Temporary connection for preview临时连接用于预览
      
      // Interaction related data交互相关数据
      draggedNode: null, // Currently dragged node当前拖拽的节点
      dragOffset: { x: 0, y: 0 }, // Drag offset拖拽偏移量
      isPanning: false, // Whether user is panning canvas是否正在平移画布
      panStart: { x: 0, y: 0 }, // Pan start position平移起始位置
      
      // Edit history编辑历史
      history: [], // History stack历史堆栈
      historyIndex: -1, // Current history index当前历史索引
      
      // 其他状态
      nodeIdCounter: 0,
      workflowStatus: 'Ready', // 始终使用英文key，通过getTranslatedStatus方法进行翻译

      
      // UI状态
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
        { value: 'all', label: this.$t ? this.$t('aiAgent.workflow.statusFilters.all', '全部') : '全部' },
        { value: 'running', label: this.$t ? this.$t('aiAgent.workflow.statusFilters.running', '运行中') : '运行中' },
        { value: 'completed', label: this.$t ? this.$t('aiAgent.workflow.statusFilters.completed', '已完成') : '已完成' },
        { value: 'failed', label: this.$t ? this.$t('aiAgent.workflow.statusFilters.failed', '失败') : '失败' },
        { value: 'pending', label: this.$t ? this.$t('aiAgent.workflow.statusFilters.pending', '待运行') : '待运行' }
      ],

      // 状态监控相关
      currentWorkflowStatus: null,
      workflowResults: null,
      monitoringWorkflowId: null,
      showStatusMonitor: false,
      showResultsViewer: false,
      selectedMessageType: 'all',
      
      // 最终输出相关
      finalOutputNode: null,
      finalOutputData: null,
      finalOutputType: 'text',
      focusOnFinalOutput: false,
      logsExpanded: false,
      
      // SSE监控状态
      eventSource: null, // EventSource实例
      sseConnectionStatus: 'stopped', // stopped, connecting, connected, error
      sseReconnectAttempts: 0, // 重连尝试次数
      maxReconnectAttempts: 5, // 最大重连次数
      reconnectDelay: 2000, // 重连延迟(ms)
      sseHeartbeatTimeout: null, // 心跳超时定时器
      
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
    // 配置markdown渲染器
    this.configureMarkdownRenderer()
    
    // 检查用户身份验证状态
    // 暂时注释身份验证，方便前端布局调试
    // this.checkAuthentication()
    
    this.initializeCanvas()
    
    this.saveToHistory()
    this.loadWorkflowList()
    
    // 检查是否有要加载的工作流数据
    this.checkAndLoadWorkflowFromRoute()
  },
  
  beforeUnmount() {
    this.cleanup()
    this.stopSSEMonitoring()
    // 清理tooltip
    this.hideTooltip()
  },
  
  methods: {
    // 配置markdown渲染器
    configureMarkdownRenderer() {
      // 创建自定义renderer
      const renderer = new marked.Renderer()
      
      // 自定义链接渲染 - 在新窗口打开并添加安全属性
      renderer.link = function(href, title, text) {
        const titleAttr = title ? ` title="${title}"` : ''
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
      }
      
      marked.setOptions({
        renderer: renderer,
        breaks: true,
        gfm: true,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        highlight: function(code, lang) {
          // 简单的代码高亮，可以后续集成更复杂的高亮库
          return `<pre class="code-block"><code class="language-${lang}">${code}</code></pre>`
        }
      })
    },

    // 渲染markdown内容
    renderMarkdown(content) {
      try {
        return marked(content)
      } catch (error) {
        console.error('Markdown渲染失败:', error)
        return `<pre>${content}</pre>`
      }
    },

    // 获取下载按钮文本
    getDownloadButtonText() {
      if (!this.finalOutputData) return '下载'
      
      switch (this.finalOutputData.type) {
        case 'image':
          return '下载图片'
        case 'audio':
          return '下载音频'
        case 'video':
          return '下载视频'
        case 'json':
          return '下载JSON'
        default:
          return '下载文档'
      }
    },

    // 检查并加载来自路由的工作流数据
    checkAndLoadWorkflowFromRoute() {
      try {
        const loadWorkflowData = this.$route.query.loadWorkflow
        if (loadWorkflowData) {
          const workflowData = JSON.parse(loadWorkflowData)
          this.loadWorkflowToCanvas(workflowData)
          
          // 清除路由查询参数以避免重复加载
          this.$router.replace({
            name: this.$route.name,
            params: this.$route.params
          })
        }
      } catch (error) {
        console.error('加载工作流数据失败:', error)
        this.showError('加载工作流数据失败')
      }
    },
    
    // 将工作流数据加载到画布
    loadWorkflowToCanvas(workflowData) {
      try {
        // 设置工作流基本信息
        this.currentWorkflow = {
          ...this.currentWorkflow,
          name: workflowData.name || 'Imported Workflow',
          description: workflowData.description || '',
          dag_id: workflowData.id || this.generateDAGId(workflowData.name || 'imported')
        }
        
        // 清空当前画布
        this.workflowNodes = []
        this.connections = []
        
        // 加载节点数据
        if (workflowData.nodes && workflowData.nodes.length > 0) {
          this.workflowNodes = workflowData.nodes.map(node => ({
            id: node.id || this.generateNodeId(),
            type: node.type || 'LLM',
            title: node.title || node.name || 'Node',
            description: node.description || '',
            prompt: node.prompt || '',
            x: node.x || Math.random() * 400 + 100,
            y: node.y || Math.random() * 300 + 100,
            inputs: node.inputs || [{ name: 'input', type: 'text' }],
            outputs: node.outputs || [{ name: 'output', type: 'text' }],
            status: 'idle',
            ...node
          }))
        } else {
          // 如果没有节点数据，创建一个基本的工作流示例
          this.createSampleWorkflow(workflowData)
        }
        
        // 加载连接数据
        if (workflowData.connections && workflowData.connections.length > 0) {
          this.connections = workflowData.connections.map(conn => ({
            id: conn.id || this.generateConnectionId(),
            source: conn.source,
            target: conn.target,
            ...conn
          }))
        }
        
        // 切换到工作流设计标签
        this.setActiveTab('workflow')
        
        // 显示成功消息
        this.showSuccess(`工作流 "${workflowData.name}" 已成功加载到设计台`)
        
      } catch (error) {
        console.error('加载工作流到画布失败:', error)
        this.showError('加载工作流到画布失败')
      }
    },
    
    // 创建示例工作流
    createSampleWorkflow(workflowData) {
      // 根据工作流类型创建相应的节点
      if (workflowData.name && workflowData.name.toLowerCase().includes('voice')) {
        // 语音相关工作流
        this.workflowNodes = [
          {
            id: this.generateNodeId(),
            type: 'STT',
            title: '语音转文字',
            description: '将语音输入转换为文字',
            x: 100,
            y: 100,
            inputs: [{ name: 'audio', type: 'audio' }],
            outputs: [{ name: 'text', type: 'text' }],
            status: 'idle'
          },
          {
            id: this.generateNodeId(),
            type: 'LLM',
            title: '文字处理',
            description: '处理转换后的文字',
            x: 300,
            y: 100,
            inputs: [{ name: 'text', type: 'text' }],
            outputs: [{ name: 'processed_text', type: 'text' }],
            status: 'idle'
          }
        ]
      } else if (workflowData.name && workflowData.name.toLowerCase().includes('image')) {
        // 图像相关工作流
        this.workflowNodes = [
          {
            id: this.generateNodeId(),
            type: 'pic2text',
            title: '图像识别',
            description: '识别图像内容',
            x: 100,
            y: 100,
            inputs: [{ name: 'image', type: 'image' }],
            outputs: [{ name: 'description', type: 'text' }],
            status: 'idle'
          },
          {
            id: this.generateNodeId(),
            type: 'text2pic',
            title: '图像生成',
            description: '基于描述生成图像',
            x: 300,
            y: 100,
            inputs: [{ name: 'prompt', type: 'text' }],
            outputs: [{ name: 'image', type: 'image' }],
            status: 'idle'
          }
        ]
      } else {
        // 默认工作流
        this.workflowNodes = [
          {
            id: this.generateNodeId(),
            type: 'LLM',
            title: workflowData.name || 'AI处理',
            description: workflowData.description || '智能处理节点',
            x: 200,
            y: 150,
            inputs: [{ name: 'input', type: 'text' }],
            outputs: [{ name: 'output', type: 'text' }],
            status: 'idle'
          }
        ]
      }
    },
    
    // 生成DAG ID
    generateDAGId(workflowName) {
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      return `${workflowName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${timestamp}_${randomSuffix}`
    },
    
    // 获取租户ID
    getTenantId() {
      // 根据api(1).md，后端没有tenant概念，所有用户都是default
      var jsonString = localStorage.getItem("userInfo")
      var jsonObject = JSON.parse(jsonString)
      return jsonObject.tenant_id.toString()
    },
    
    // 检查用户身份验证状态 - 暂时注释掉，方便调试
    // async checkAuthentication() {
    //   try {
    //     const { isAuthenticated } = await import('@/utils/auth.js')
    //     if (!isAuthenticated()) {
    //       // 如果用户未登录，重定向到登录页面
    //       this.$router.push('/frontend/login')
    //       return false
    //     }
    //     return true
    //   } catch (error) {
    //     console.error('身份验证检查失败:', error)
    //     this.$router.push('/frontend/login')
    //     return false
    //   }
    // },
    
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    showTooltip(tabId, event) {
      const rect = event.currentTarget.getBoundingClientRect()
      let x = rect.right + 10 // 10px offset from the right of the tab
      let y = rect.top + rect.height / 2 - 20 // center vertically
      
      // 确保tooltip不会超出屏幕边界
      const tooltipWidth = 200 // 预估tooltip宽度
      const tooltipHeight = 80 // 预估tooltip高度
      
      if (x + tooltipWidth > window.innerWidth) {
        x = rect.left - tooltipWidth - 10 // 显示在左侧
      }
      
      if (y + tooltipHeight > window.innerHeight) {
        y = window.innerHeight - tooltipHeight - 10
      }
      
      if (y < 0) {
        y = 10
      }
      
      this.tooltipData = {
        visible: true,
        x: x,
        y: y,
        title: this.getTabTitle(tabId),
        description: this.getTabDescription(tabId)
      }
    },
    hideTooltip() {
      this.tooltipData.visible = false
    },
    getTabTitle(tabId) {
      const titleMap = {
        'workflow': this.$t('aiAgent.tabs.workflowDesign', 'Workflow Design'),
        'workflows': this.$t('aiAgent.tabs.workflowManagement', 'Workflow Management')
      }
      return titleMap[tabId] || tabId
    },
    getTabDescription(tabId) {
      const descriptionMap = {
        'workflow': this.$t('aiAgent.tabs.workflowDesignDesc', 'Visual DAG workflow editor - Core feature'),
        'workflows': this.$t('aiAgent.tabs.workflowManagementDesc', 'View and manage all DAG workflows')
      }
      return descriptionMap[tabId] || ''
    },
    getWorkflowStatus() {
      if (!this.currentWorkflow.name) return this.$t('aiAgent.workflow.statusValues.unnamed', 'Unnamed')
      if (this.workflowNodes.length <= 1) return this.$t('aiAgent.workflow.statusValues.empty', 'Empty')
      return this.$t('aiAgent.workflow.statusValues.ready', 'Ready')
    },
    getTranslatedStatus(status) {
      if (!status) return ''
      
      // 将状态值标准化为英文key，然后进行翻译
      const statusKeyMap = {
        'Ready': 'ready',
        'Running': 'running', 
        'Completed': 'completed',
        'Failed': 'failed',
        'Deployed': 'deployed',
        'Empty': 'empty',
        'Unnamed': 'unnamed',
        'Pending': 'pending',
        // 中文状态值也映射到相应的key
        '就绪': 'ready',
        '运行中': 'running',
        '已完成': 'completed',
        '失败': 'failed',
        '已部署': 'deployed',
        '空白': 'empty',
        '未命名工作流': 'unnamed',
        '待运行': 'pending'
      }
      
      const statusKey = statusKeyMap[status] || status.toLowerCase()
      return this.$t(`aiAgent.workflow.statusValues.${statusKey}`, status)
    },
    // 部署工作流 - 使用现有后端API
    async deployWorkflow() {
      try {
        // 验证工作流
        if (!this.validateWorkflow()) {
          return
        }
        
        // 为工作流生成名称（如果没有）
        if (!this.currentWorkflow.name || this.currentWorkflow.name.trim() === '') {
          this.currentWorkflow.name = `工作流_${new Date().toLocaleString()}`
        }
        
        // 验证上传数据完整性
        const validation = this.validateUploadData()
        if (validation.errors.length > 0) {
          this.showError('数据验证失败：\n' + validation.errors.join('\n'))
          return
        }
        if (validation.warnings.length > 0) {
          console.warn('数据验证警告:', validation.warnings)
          validation.warnings.forEach(warning => this.showWarning(warning))
        }
        
        // 预处理文件数据 - 确保所有输入数据准备就绪
        await this.preprocessWorkflowFiles()
        
        // 生成DAG数据 - 按照后端API文档格式
        const dagData = await this.generateDAGData()
        
        // 显示需要上传的文件列表（用于调试）
        const uploadsList = this.getRequiredUploadsList()
        console.log('需要上传的文件:', uploadsList)
        this.showSuccess(`检测到 ${uploadsList.length} 个文件需要上传`)
        
        this.showSuccess('正在部署工作流...')
        
        // 第一步：提交DAG到后端存储，获取预签名上传URL
        const submitResponse = await fetch(AI_AGENT_API.CREATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dagData)
        })
        
        if (!submitResponse.ok) {
          throw new Error(`HTTP ${submitResponse.status}: ${submitResponse.statusText}`)
        }
        
        const submitData = await submitResponse.json()
        console.log('DAG提交成功，后端响应:', submitData)
        
        const { dag_id, tenant_id, presigned_urls } = submitData
        
        // 第二步：使用预签名URL上传文件到S3
        if (presigned_urls && Object.keys(presigned_urls).length > 0) {
          this.showSuccess('正在上传文件到云端存储...')
          await this.uploadFilesToS3(presigned_urls)
        }
        
        // 第三步：通知后端文件已上传完毕，开始执行工作流
        const deployResponse = await fetch(AI_AGENT_API.DEPLOY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            dag_id: dag_id, 
            tenant_id: tenant_id 
          })
        })
        
        if (!deployResponse.ok) {
          throw new Error(`HTTP ${deployResponse.status}: ${deployResponse.statusText}`)
        }
        
        console.log('DAG就绪通知成功，开始执行')
        
        // 更新当前工作流信息
        this.currentWorkflow = {
          dag_id: dag_id,
          name: this.currentWorkflow.name,
          description: this.currentWorkflow.description || '',
          status: 'deployed'
        }
        
        // 更新工作流状态
        this.workflowStatus = 'Deployed'
        
        // 开始监控工作流执行
        await this.monitorWorkflowExecution(dag_id)
        
        // 刷新工作流列表，显示新部署的工作流
        await this.loadWorkflowList()
        
        this.showSuccess(`工作流 "${this.currentWorkflow.name}" 部署成功并已保存到记录中！DAG ID: ${dag_id}`)
        
      } catch (error) {
        console.error('部署工作流失败:', error)
        this.showError(`部署工作流失败: ${error.message || '未知错误'}`)
      }
    },
    // Workflow methods
    getNodeIcon(nodeType) {
      const icons = {
        LLM: '🧠',
        STT: '🎤',
        TTS: '🔊',
        pic2text: '🖼️',
        text2pic: '🎨'
      }
      return icons[nodeType] || '📦'
    },
    getNodeTypeLabel(type) {
      const labels = {
        llm: 'LLM'
      }
      return labels[type] || type
    },
    getPortTypeLabel(type) {
      const typeMap = {
        'text': this.$t('aiAgent.workflow.portTypes.text', '文本'),
        'image': this.$t('aiAgent.workflow.portTypes.image', '图片'),
        'audio': this.$t('aiAgent.workflow.portTypes.audio', '音频'),
        'file': this.$t('aiAgent.workflow.portTypes.file', '文件'),
        'json': this.$t('aiAgent.workflow.portTypes.json', 'JSON')
      }
      return typeMap[type] || type
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
    // 获取节点模板 - 提取为独立方法供恢复工作流时复用
    getNodeTemplate(nodeType) {
      const nodeTemplates = {
        LLM: {
          title: 'LLM',
          description: this.$t('aiAgent.workflow.llmDesc', '大语言模型文本处理'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.prompt', '提示'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.response', '响应'), type: 'text' }],
          service: 'LLM',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.llm', '请根据输入内容提供有用的回答，保持回答准确、简洁、有帮助。'),
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 2000
        },
        STT: {
          title: 'STT',
          description: this.$t('aiAgent.workflow.sttDesc', '语音转文字'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.audio', '音频'), type: 'audio', value: null }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text' }],
          service: 'STT',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.stt', '请将音频准确转换为文字，保持自然的句子结构和正确的标点符号。'),
          language: 'zh',
          model: 'whisper-1'
        },
        TTS: {
          title: 'TTS',
          description: this.$t('aiAgent.workflow.ttsDesc', '文字转语音'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.audio', '音频'), type: 'audio' }],
          service: 'TTS',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.tts', '请以自然、清晰的语调朗读文字，注意语速适中，语音自然。'),
          voice: 'alloy',
          speed: 1.0
        },
        pic2text: {
          title: 'Pic2Text',
          description: this.$t('aiAgent.workflow.pic2textDesc', '图片转文字'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.image', '图片'), type: 'image', value: null }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text' }],
          service: 'pic2text',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.pic2text', '请识别图片中的所有文字内容，保持原有的排版结构，准确提取文字信息。'),
          language: 'zh',
          format: 'markdown'
        },
        text2pic: {
          title: 'Text2Pic',
          description: this.$t('aiAgent.workflow.text2picDesc', '文字转图片'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.prompt', '提示'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.image', '图片'), type: 'image' }],
          service: 'text2pic',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.text2pic', '根据描述生成高质量图片，画面构图合理，色彩和谐，细节丰富。'),
          size: '1024x1024',
          style: 'natural'
        }
      }
      
      return nodeTemplates[nodeType] || nodeTemplates.LLM
    },

    createNode(nodeType, x, y) {
      const nodeId = `${nodeType}-${++this.nodeIdCounter}`
      const template = this.getNodeTemplate(nodeType)
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
      this.selectedConnection = null
    },
    deselectNode() {
      this.selectedNode = null
      this.selectedConnection = null
    },
    
    // 连接配置相关方法
    selectConnection(connection) {
      this.selectedConnection = connection
      this.selectedNode = null
    },
    
    deselectConnection() {
      this.selectedConnection = null
    },
    
    getNodeById(nodeId) {
      return this.workflowNodes.find(node => node.id === nodeId)
    },
    
    saveConnectionConfig() {
      // 连接配置已经通过v-model双向绑定自动保存
      this.showSuccess(this.$t('aiAgent.workflow.connectionSaved', '连接配置已保存'))
    },
    
    deleteConnection() {
      if (!this.selectedConnection) return
      
      const connectionIndex = this.connections.findIndex(conn => conn.id === this.selectedConnection.id)
      if (connectionIndex !== -1) {
        this.connections.splice(connectionIndex, 1)
        this.selectedConnection = null
        this.saveToHistory()
        this.showSuccess(this.$t('aiAgent.workflow.connectionDeleted', '连接已删除'))
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

      document.addEventListener('keyup', this.handleKeyUp)
      
      // 添加画布事件监听
      if (this.$refs.canvas) {
        this.$refs.canvas.addEventListener('contextmenu', this.handleContextMenu)
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
        element.classList.remove('connectable-highlight', 'incompatible-highlight', 'dragging')
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
      
      // 检查数据类型兼容性
      if (!this.isDataTypeCompatible(sourceNode, sourcePortType, targetNode, targetPortType)) {
        return false
      }
      
      return true
    },
    
    showError(message) {
      // 显示连接错误提示
      console.warn('连接验证失败:', message)
      // 可以在这里添加用户友好的提示，比如toast通知
      if (message && message.trim()) {
        alert(message)
      }
    },
    
    // 获取节点的输出数据类型
    getNodeOutputTypes(node) {
      const nodeTypes = {
        'LLM': ['text'],
        'STT': ['text'], 
        'TTS': ['audio'],
        'pic2text': ['text'],
        'text2pic': ['image']
      }
      return nodeTypes[node.type] || []
    },
    
    // 获取节点的输入数据类型
    getNodeInputTypes(node) {
      const nodeTypes = {
        'LLM': ['text'],
        'STT': ['audio'],
        'TTS': ['text'], 
        'pic2text': ['image'],
        'text2pic': ['text']
      }
      return nodeTypes[node.type] || []
    },
    
    // 检查数据类型兼容性
    isDataTypeCompatible(sourceNode, sourcePortType, targetNode, targetPortType) {
      // 确定连接方向
      let outputNode, inputNode
      if (sourcePortType === 'output') {
        outputNode = sourceNode
        inputNode = targetNode
      } else {
        outputNode = targetNode
        inputNode = sourceNode
      }
      
      // 获取输出节点的输出类型和输入节点的输入类型
      const outputTypes = this.getNodeOutputTypes(outputNode)
      const inputTypes = this.getNodeInputTypes(inputNode)
      
      // 检查是否有兼容的类型
      const hasCompatibleType = outputTypes.some(outputType => 
        inputTypes.includes(outputType)
      )
      
      if (!hasCompatibleType) {
        const outputTypeStr = outputTypes.join('/')
        const inputTypeStr = inputTypes.join('/')
        const errorMessage = this.$t('aiAgent.workflow.errors.dataTypeIncompatible')
          .replace('{outputNode}', outputNode.title || outputNode.type)
          .replace('{outputType}', outputTypeStr)
          .replace('{inputNode}', inputNode.title || inputNode.type)
          .replace('{inputType}', inputTypeStr)
        this.showError(errorMessage)
        return false
      }
      
      return true
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
    
    // 高亮可连接的节点（只高亮数据类型兼容的节点）
    highlightConnectableNodes(sourceNode, sourcePortType) {
      this.workflowNodes.forEach(node => {
        if (node.id === sourceNode.id) return
        
        // 检查基本连接可能性和数据类型兼容性
        let targetPortType, connectionElement
        if (sourcePortType === 'output') {
          targetPortType = 'input'
          connectionElement = document.querySelector(`[data-node-id="${node.id}"] .input-point`)
        } else if (sourcePortType === 'input') {
          targetPortType = 'output'
          connectionElement = document.querySelector(`[data-node-id="${node.id}"] .output-point`)
        }
        
        if (connectionElement) {
          // 检查数据类型兼容性
          if (this.isDataTypeCompatible(sourceNode, sourcePortType, node, targetPortType)) {
            connectionElement.classList.add('connectable-highlight')
          } else {
            // 为不兼容的节点添加不同的样式
            connectionElement.classList.add('incompatible-highlight')
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
      // 清除不兼容连接点高亮
      document.querySelectorAll('.incompatible-highlight').forEach(element => {
        element.classList.remove('incompatible-highlight')
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
    
    // 统一错误处理
    showError(message) {
      console.error('错误:', message)
      if (this.$message && this.$message.error) {
        this.$message.error(message)
      } else {
        // 降级处理：使用alert
        alert('错误: ' + message)
      }
    },
    
    // 统一成功消息处理
    showSuccess(message) {
      console.log('成功:', message)
      if (this.$message && this.$message.success) {
        this.$message.success(message)
      } else {
        // 降级处理：使用alert
        alert('成功: ' + message)
      }
    },
    
    // 统一警告消息处理
    showWarning(message) {
      console.warn('警告:', message)
      if (this.$message && this.$message.warning) {
        this.$message.warning(message)
      } else {
        // 降级处理：使用alert
        alert('警告: ' + message)
      }
    },
    
    // 清理资源
    cleanup() {

      document.removeEventListener('keyup', this.handleKeyUp)
      
      document.removeEventListener('click', this.cancelConnection)
      
      // 停止SSE监控
      this.stopSSEMonitoring()
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
        'pic2text': 'Enter image-to-text processing instructions, for example: Analyze image content and extract all text information...',
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
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1) {
        if (!this.workflowNodes[nodeIndex].inputs) {
          this.workflowNodes[nodeIndex].inputs = []
        }
        
        // LLM节点只能添加文本类型的输入端口，符合API规范
        const inputType = this.workflowNodes[nodeIndex].service === 'LLM' ? 'text' : 'text'
        this.workflowNodes[nodeIndex].inputs.push({ name: 'input', type: inputType, value: '' })
      }
    },
    removeInput(index) {
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1 && this.workflowNodes[nodeIndex].inputs) {
        this.workflowNodes[nodeIndex].inputs.splice(index, 1)
      }
    },
    addOutput() {
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1) {
        if (!this.workflowNodes[nodeIndex].outputs) {
          this.workflowNodes[nodeIndex].outputs = []
        }
        this.workflowNodes[nodeIndex].outputs.push({ name: 'output', type: 'text' })
      }
    },
    removeOutput(index) {
      const nodeIndex = this.workflowNodes.findIndex(n => n.id === this.selectedNode)
      if (nodeIndex !== -1 && this.workflowNodes[nodeIndex].outputs) {
        this.workflowNodes[nodeIndex].outputs.splice(index, 1)
      }
    },
    saveNodeConfig() {
      // 节点配置已经通过双向绑定自动保存到workflowNodes数组中
      this.showSuccess(this.$t('aiAgent.workflow.configSaved', '节点配置已保存'))
    },
    validateNodeConfig() {
      if (!this.selectedNode) {
        this.showWarning(this.$t('aiAgent.workflow.noNodeSelected', '请先选择一个节点'))
        return false
      }
      
      const node = this.selectedNodeData
      
      // 基础验证
      if (!node.title || !node.title.trim()) {
        this.showError(this.$t('aiAgent.workflow.nameRequired', '节点名称不能为空'))
        return false
      }
      
      // AI服务节点必须配置service和prompt
      if (this.isAIServiceNode(node.type)) {
        if (!node.service) {
          this.showError(this.$t('aiAgent.workflow.serviceRequired', '请选择服务类型'))
          return false
        }
        
        if (!node.prompt || !node.prompt.trim()) {
          this.showError(this.$t('aiAgent.workflow.promptRequired', '请配置节点提示词'))
          return false
        }
      }
      

      
      // Validation passed验证通过
      this.showSuccess(this.$t('aiAgent.workflow.configValid', '节点配置验证通过！'))
      return true
    },
    // Workflow operation methods工作流操作方法
    
    // 获取当前用户信息
    getCurrentUser() {
      try {
        const userInfo = localStorage.getItem('userInfo')
        return userInfo ? JSON.parse(userInfo) : null
      } catch (error) {
        console.error('Failed to get user information:', error)
        return null
      }
    },

    validateWorkflow() {
      // 检查工作流是否为空
      if (this.workflowNodes.length === 0) {
        this.showError(this.$t('aiAgent.workflow.emptyWorkflow', '工作流不能为空，请添加至少一个节点'))
        return false
      }
      
      // 检查所有AI服务节点是否正确配置
      for (const node of this.workflowNodes) {
        if (this.isAIServiceNode(node.type)) {
          if (!node.service || !node.prompt) {
            this.showError(this.$t('aiAgent.workflow.nodeConfigIncomplete', `节点 ${node.title} 配置不完整`))
            return false
          }
        }
      }
      
      // 检查是否有孤立节点（没有连接的节点）
      const connectedNodes = new Set()
      this.connections.forEach(conn => {
        connectedNodes.add(conn.from)
        connectedNodes.add(conn.to)
      })
      
      const isolatedNodes = this.workflowNodes.filter(node => 
        !connectedNodes.has(node.id) && this.workflowNodes.length > 1
      )
      
      if (isolatedNodes.length > 0) {
        this.showWarning(this.$t('aiAgent.workflow.isolatedNodes', `发现孤立节点: ${isolatedNodes.map(n => n.title).join(', ')}`))
      }
      
      return true
    },
    async generateDAGData() {
      // 根据后端API文档生成简化的DAG数据
      const dagData = {
        dag_id: this.generateDAGId(this.currentWorkflow.name || 'workflow'),
        tenant_id: this.getTenantId(),
        nodes: {},
        edges: []
      }
      
      // 转换节点数据 - 包含服务类型和处理指令
      this.workflowNodes.forEach(node => {
        dagData.nodes[node.id] = {
          service: node.service || node.type,
          prompt: node.prompt || ''  // 添加prompt字段，告诉后端"如何处理"数据
        }
      })
      
      // 转换连接数据 - 按照后端API文档的简化格式
      this.connections.forEach(connection => {
        dagData.edges.push({
          from: connection.from,
          to: connection.to,
          prompt: connection.prompt || ''
        })
      })
      
      console.log('生成简化的DAG数据:', dagData)
      
      return dagData
    },
    
    // 检测工作流中是否有循环
    detectCycles() {
      // 简单的环路检测实现
      const visited = new Set()
      const recStack = new Set()
      
      const hasCycle = (nodeId) => {
        if (recStack.has(nodeId)) return true
        if (visited.has(nodeId)) return false
        
        visited.add(nodeId)
        recStack.add(nodeId)
        
        const outgoingConnections = this.connections.filter(conn => conn.from === nodeId)
        for (const conn of outgoingConnections) {
          if (hasCycle(conn.to)) return true
        }
        
        recStack.delete(nodeId)
        return false
      }
      
      for (const node of this.workflowNodes) {
        if (hasCycle(node.id)) return true
      }
      
      return false
    },
    
    // 计算工作流复杂度分数
    calculateComplexityScore() {
      let score = 0
      score += this.workflowNodes.length * 2 // 每个节点+2分
      score += this.connections.length * 1 // 每个连接+1分
      score += this.workflowNodes.filter(node => this.isAIServiceNode(node.type)).length * 3 // AI服务节点+3分
      return score
    },
    
    // 获取工作流验证错误
    getWorkflowValidationErrors() {
      const errors = []
      
      // 检查是否有孤立节点
      const connectedNodes = new Set()
      this.connections.forEach(conn => {
        connectedNodes.add(conn.from)
        connectedNodes.add(conn.to)
      })
      
      this.workflowNodes.forEach(node => {
        if (!connectedNodes.has(node.id) && this.workflowNodes.length > 1) {
          errors.push(`节点 ${node.title || node.id} 未连接到其他节点`)
        }
        
        // 检查AI服务节点配置
        if (this.isAIServiceNode(node.type)) {
          if (!node.service) {
            errors.push(`节点 ${node.title || node.id} 未配置服务类型`)
          }
          if (!node.prompt) {
            errors.push(`节点 ${node.title || node.id} 未配置提示词`)
          }
        }
      })
      
      return errors
    },
    
    // 获取工作流验证警告
    getWorkflowValidationWarnings() {
      const warnings = []
      
      // 检查是否有输入/输出节点
      const hasInput = this.workflowNodes.some(node => node.type === 'input')
      const hasOutput = this.workflowNodes.some(node => node.type === 'output')
      
      if (!hasInput) {
        warnings.push('工作流没有输入节点，可能无法正常接收数据')
      }
      if (!hasOutput) {
        warnings.push('工作流没有输出节点，可能无法返回结果')
      }
      
      // 检查循环依赖
      if (this.detectCycles()) {
        warnings.push('工作流中存在循环依赖，可能导致执行问题')
      }
      
      return warnings
    },
    
    // 使用预签名URL上传文件到S3 - 适配后端API格式（每个节点一个预签名URL）
    async uploadFilesToS3(presignedUrls) {
      try {
        console.log('🚀 开始批量上传到S3');
        console.log('📋 预签名URL信息:', {
          总数: Object.keys(presignedUrls).length,
          节点列表: Object.keys(presignedUrls),
          URL预览: Object.keys(presignedUrls).reduce((acc, key) => {
            acc[key] = presignedUrls[key].substring(0, 50) + '...';
            return acc;
          }, {})
        });
        
        const uploadPromises = []
        
        // 1. 预处理连接prompt，将其分配到目标节点
        const nodeConnectionPrompts = this.getNodeConnectionPrompts()
        console.log('📝 节点连接Prompt信息:', nodeConnectionPrompts);
        
        // 2. 为每个节点准备实际文件数据并上传
        let processedNodes = 0;
        let skippedNodes = 0;
        
        for (const node of this.workflowNodes) {
          console.log(`🔄 处理节点: ${node.id} (${node.title || '未命名'})`);
          
          if (presignedUrls[node.id]) {
            // 获取节点的实际文件数据
            const fileData = await this.getNodeFileData(node, nodeConnectionPrompts);
            
            if (fileData) {
              console.log(`📦 节点 ${node.id} 文件数据:`, {
                文件类型: fileData.contentType,
                文件大小: fileData.blob.size + ' bytes',
                数据来源: fileData.source
              });
              
              // 获取节点的AI服务类型
              const serviceType = node.service || node.type
              const correctContentType = this.getContentTypeByService(serviceType)
              
              console.log(`📤 准备上传节点 ${node.id}，文件大小: ${fileData.blob.size} bytes，服务类型: ${serviceType}，Content-Type: ${correctContentType}`);
              
              uploadPromises.push(
                this.uploadFileToS3(presignedUrls[node.id], fileData.blob, fileData.contentType, serviceType)
                  .then(() => {
                    console.log(`✅ 节点 ${node.id} 上传成功`);
                    this.showUploadProgress(uploadPromises.length, this.workflowNodes.length, `节点 ${node.id} 完成`);
                  })
                  .catch((error) => {
                    console.error(`❌ 节点 ${node.id} 上传失败:`, error);
                    throw new Error(`节点 ${node.id} 上传失败: ${error.message}`);
                  })
              )
              processedNodes++;
            } else {
              console.warn(`⚠️ 节点 ${node.id} 没有可上传的文件数据`);
              skippedNodes++;
            }
          } else {
            console.warn(`⚠️ 节点 ${node.id} 没有对应的预签名URL`);
            skippedNodes++;
          }
        }
        
        console.log('📊 节点处理统计:', {
          总节点数: this.workflowNodes.length,
          处理成功: processedNodes,
          跳过节点: skippedNodes,
          上传任务: uploadPromises.length
        });
        
        // 3. 并行上传所有文件
        if (uploadPromises.length > 0) {
          console.log(`🔄 开始并行上传 ${uploadPromises.length} 个文件...`);
          this.showUploadProgress(0, uploadPromises.length, '开始上传节点数据...')
          
          // 使用Promise.allSettled以获取每个上传的详细结果
          const results = await Promise.allSettled(uploadPromises);
          
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          const failureCount = results.filter(r => r.status === 'rejected').length;
          
          console.log('📈 上传结果统计:', {
            成功: successCount,
            失败: failureCount,
            总计: results.length
          });
          
          if (failureCount > 0) {
            const failedReasons = results
              .filter(r => r.status === 'rejected')
              .map(r => r.reason.message);
            console.error('❌ 失败的上传任务:', failedReasons);
            throw new Error(`${failureCount} 个文件上传失败: ${failedReasons.join('; ')}`);
          }
          
          console.log(`✅ 成功上传 ${successCount} 个节点数据包到S3`);
          this.showUploadProgress(uploadPromises.length, uploadPromises.length, '上传完成')
          this.showSuccess(`已成功上传 ${successCount} 个节点数据包！`);
        } else {
          console.warn('⚠️ 没有需要上传的文件');
          console.log('🔍 可能的原因:', {
            节点数量: this.workflowNodes.length,
            预签名URL数量: Object.keys(presignedUrls).length,
            节点ID列表: this.workflowNodes.map(n => n.id),
            预签名URL节点列表: Object.keys(presignedUrls)
          });
          this.showWarning('没有检测到需要上传的文件，请检查工作流配置');
        }
        
      } catch (error) {
        console.error('❌ 批量文件上传失败:', {
          错误信息: error.message,
          错误堆栈: error.stack,
          预签名URL: Object.keys(presignedUrls || {}),
          节点数量: this.workflowNodes.length,
          时间戳: new Date().toISOString()
        });
        throw new Error(`文件上传失败: ${error.message}`)
      }
    },

    // 获取每个节点的连接prompt信息
    getNodeConnectionPrompts() {
      const nodePrompts = {}
      
      // 遍历所有连接，将prompt分配到目标节点
      this.connections.forEach((connection, index) => {
        const targetNodeId = connection.to
        if (!nodePrompts[targetNodeId]) {
          nodePrompts[targetNodeId] = []
        }
        
        nodePrompts[targetNodeId].push({
          from: connection.from,
          prompt: connection.prompt || '默认处理指令',
          connectionIndex: index
        })
      })
      
      return nodePrompts
    },

    // 获取节点的实际文件数据 - 修复：优先处理用户上传的文件
    async getNodeFileData(node, nodeConnectionPrompts) {
      try {
        // 1. 优先上传用户实际上传的文件（图片、音频、文件）
        if (node.inputs && node.inputs.length > 0) {
          for (const input of node.inputs) {
            // 图片文件 - 用户上传的实际图片数据
            if (input.type === 'image' && input.fileData) {
              const blob = this.base64ToBlob(input.fileData, input.fileType || 'image/jpeg');
              console.log(`✅ 节点 ${node.id} 使用图片文件 (prompt已在submit中发送)`);
              return {
                blob: blob,
                contentType: input.fileType || 'image/jpeg',
                source: `图片文件: ${input.fileName || 'image'}`
              };
            }
            
            // 音频文件 - 用户上传的实际音频数据  
            if (input.type === 'audio' && input.fileData) {
              const blob = this.base64ToBlob(input.fileData, input.fileType || 'audio/wav');
              console.log(`✅ 节点 ${node.id} 使用音频文件 (prompt已在submit中发送)`);
              return {
                blob: blob,
                contentType: input.fileType || 'audio/wav',
                source: `音频文件: ${input.fileName || 'audio'}`
              };
            }
            
            // 其他文件 - 用户上传的实际文件数据
            if (input.type === 'file' && input.fileData) {
              const blob = this.base64ToBlob(input.fileData, input.fileType || 'application/octet-stream');
              console.log(`✅ 节点 ${node.id} 使用文件 (prompt已在submit中发送)`);
              return {
                blob: blob,
                contentType: input.fileType || 'application/octet-stream',
                source: `文件: ${input.fileName || 'file'}`
              };
            }
            
            // 文本输入 - 用户输入的文本数据
            if (input.type === 'text' && input.value && input.value.trim()) {
              const blob = new Blob([input.value], { type: 'text/plain' });
              console.log(`✅ 节点 ${node.id} 使用文本输入 (prompt已在submit中发送)`);
              return {
                blob: blob,
                contentType: 'text/plain',
                source: `文本输入: ${input.name}`
              };
            }
          }
        }
        
        // 2. 如果没有用户文件，为纯prompt节点创建占位符文件
        // 注意：prompt已经在submit请求中发送，这里只是为了满足API要求每个节点都有文件
        if (node.prompt && node.prompt.trim()) {
          const placeholderText = `系统提示：请忽略节点信息,只响应用户要求:节点ID: ${node.id}\n服务类型: ${node.service || node.type}\n说明: 此节点的处理指令已在DAG提交中发送\n时间: ${new Date().toISOString()}`;
          const blob = new Blob([placeholderText], { type: 'text/plain' });
          console.log(`✅ 节点 ${node.id} 创建占位符文件 (prompt已在submit中发送)`);
          return {
            blob: blob,
            contentType: 'text/plain',
            source: '占位符文件 (prompt已在submit中发送)'
          };
        }
        
        // 3. 检查连接prompt并创建占位符
        const connectionPrompts = nodeConnectionPrompts[node.id];
        if (connectionPrompts && connectionPrompts.length > 0) {
          const placeholderText = `系统提示：请忽略节点信息,只响应用户要求:节点ID: ${node.id}\n服务类型: ${node.service || node.type}\n连接数: ${connectionPrompts.length}\n说明: 此节点的连接指令已在DAG提交中发送\n时间: ${new Date().toISOString()}`;
          const blob = new Blob([placeholderText], { type: 'text/plain' });
          console.log(`✅ 节点 ${node.id} 创建连接占位符文件`);
          return {
            blob: blob,
            contentType: 'text/plain',
            source: '连接占位符文件'
          };
        }
        
        // 4. 最后的默认占位符
        const defaultText = `系统提示：请忽略节点信息,只响应用户要求:节点ID: ${node.id}\n服务类型: ${node.service || node.type}\n状态: 默认占位符\n时间: ${new Date().toISOString()}`;
        const blob = new Blob([defaultText], { type: 'text/plain' });
        console.log(`✅ 节点 ${node.id} 创建默认占位符文件`);
        return {
          blob: blob,
          contentType: 'text/plain',
          source: '默认占位符文件'
        };
        
      } catch (error) {
        console.error(`Failed to get file data for node ${node.id}:`, error);
        return null;
      }
    },

    // 准备节点完整数据包
    async prepareNodeDataPackage(node, nodeConnectionPrompts) {
      try {
        const dataPackage = {
          // 节点基本信息
          nodeId: node.id,
          service: node.service || node.type,
          title: node.title,
          description: node.description,
          
          // 节点配置
          config: {
            model: node.model,
            temperature: node.temperature,
            max_tokens: node.max_tokens,
            language: node.language,
            voice: node.voice,
            speed: node.speed,
            size: node.size,
            style: node.style,
            format: node.format
          },
          
          // 节点自身的prompt
          nodePrompt: node.prompt || '请处理输入数据',
          
          // 连接prompt（来自其他节点的处理指令）
          connectionPrompts: nodeConnectionPrompts[node.id] || [],
          
          // 输入数据
          inputs: [],
          
          // 元数据
          metadata: {
            uploadTime: new Date().toISOString(),
            version: '1.0'
          }
        }
        
        // 处理节点输入数据
        if (node.inputs && node.inputs.length > 0) {
          for (let i = 0; i < node.inputs.length; i++) {
            const input = node.inputs[i]
            const processedInput = await this.processNodeInput(input, node)
            if (processedInput) {
              dataPackage.inputs.push(processedInput)
            }
          }
        }
        
        return dataPackage
        
      } catch (error) {
        console.error('准备节点数据包失败:', error)
        throw error
      }
    },

    // 处理单个节点输入数据
    async processNodeInput(input, node) {
      try {
        const processedInput = {
          name: input.name,
          type: input.type,
          value: null,
          contentType: 'text/plain',
          encoding: 'utf8'
        }
        
        switch (input.type) {
          case 'text':
            processedInput.value = input.value || ''
            processedInput.contentType = 'text/plain'
            break
            
          case 'audio':
            if (input.fileData) {
              processedInput.value = input.fileData // base64数据
              processedInput.contentType = input.fileType || 'audio/wav'
              processedInput.encoding = 'base64'
            } else if (input.value && input.value instanceof File) {
              processedInput.value = await this.fileToBase64(input.value)
              processedInput.contentType = input.value.type || 'audio/wav'
              processedInput.encoding = 'base64'
            }
            break
            
          case 'image':
            if (input.fileData) {
              processedInput.value = input.fileData // base64数据
              processedInput.contentType = input.fileType || 'image/jpeg'
              processedInput.encoding = 'base64'
            } else if (input.value && input.value instanceof File) {
              processedInput.value = await this.fileToBase64(input.value)
              processedInput.contentType = input.value.type || 'image/jpeg'
              processedInput.encoding = 'base64'
            }
            break
            
          case 'file':
            if (input.fileData) {
              processedInput.value = input.fileData
              processedInput.contentType = input.fileType || 'application/octet-stream'
              processedInput.encoding = 'base64'
            } else if (input.value && input.value instanceof File) {
              processedInput.value = await this.fileToBase64(input.value)
              processedInput.contentType = input.value.type || 'application/octet-stream'
              processedInput.encoding = 'base64'
            }
            break
            
          case 'json':
            if (input.value) {
              processedInput.value = typeof input.value === 'string' ? input.value : JSON.stringify(input.value)
              processedInput.contentType = 'application/json'
            }
            break
            
          default:
            processedInput.value = String(input.value || '')
            break
        }
        
        return processedInput
        
      } catch (error) {
        console.error('Failed to process node input:', error)
        return null
      }
    },

    // 根据AI服务类型获取正确的Content-Type（与后端保持一致）
    getContentTypeByService(serviceType) {
      const contentTypeMap = {
        'LLM': 'application/x-www-form-urlencoded',
        'STT': 'audio/wav',
        'TTS': 'application/x-www-form-urlencoded', 
        'pic2text': 'image/jpeg',
        'text2pic': 'application/x-www-form-urlencoded'
      }
      
      return contentTypeMap[serviceType] || 'application/octet-stream'
    },

    // 单个文件上传到S3 - 支持Blob对象和base64字符串
    async uploadFileToS3(presignedUrl, fileData, originalContentType, serviceType) {
      try {
        // 根据AI服务类型获取正确的Content-Type
        const correctContentType = this.getContentTypeByService(serviceType)
        
        console.log('📤 开始S3上传:', {
          url: presignedUrl.substring(0, 100) + '...',
          serviceType: serviceType,
          originalContentType: originalContentType,
          correctContentType: correctContentType,
          dataType: fileData instanceof Blob ? 'Blob' : typeof fileData,
          dataSize: fileData instanceof Blob ? fileData.size : 'unknown'
        });

        let blob
        
        // 判断fileData类型并相应处理
        if (fileData instanceof Blob) {
          // 如果已经是Blob对象，直接使用
          blob = fileData
          console.log('✅ 使用Blob对象，大小:', blob.size, 'bytes');
        } else if (typeof fileData === 'string') {
          // 如果是base64字符串，转换为Blob
          blob = this.base64ToBlob(fileData, originalContentType)
          console.log('✅ Base64转换为Blob，大小:', blob.size, 'bytes');
        } else {
          throw new Error(`不支持的文件数据类型: ${typeof fileData}`)
        }

        // 验证blob有效性
        if (!blob || blob.size === 0) {
          throw new Error('文件数据为空或无效');
        }
        
        // 使用PUT方法上传到S3预签名URL，使用正确的Content-Type
        console.log('🔄 正在向S3发送请求，Content-Type:', correctContentType);
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': correctContentType
          },
          redirect: 'follow'
        })
        
        console.log('📡 S3响应状态:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          // 尝试解析S3的错误响应
          let errorDetails = '';
          try {
            const errorText = await response.text();
            console.error('❌ S3错误响应内容:', errorText);
            
            // 尝试解析XML错误格式（S3常用格式）
            if (errorText.includes('<Error>')) {
              const codeMatch = errorText.match(/<Code>(.*?)<\/Code>/);
              const messageMatch = errorText.match(/<Message>(.*?)<\/Message>/);
              if (codeMatch && messageMatch) {
                errorDetails = `${codeMatch[1]}: ${messageMatch[1]}`;
              } else {
                errorDetails = errorText;
              }
            } else {
              errorDetails = errorText;
            }
          } catch (parseError) {
            console.warn('⚠️ 无法解析S3错误响应:', parseError);
            errorDetails = '无法获取详细错误信息';
          }
          
          const errorMessage = `S3上传失败 [${response.status}]: ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`;
          throw new Error(errorMessage);
        }
        
        console.log('✅ 节点数据包上传到S3成功');
        return response
        
      } catch (error) {
        console.error('❌ S3上传失败 - 详细信息:', {
          error: error.message,
          stack: error.stack,
          presignedUrl: presignedUrl.substring(0, 100) + '...',
          serviceType: serviceType,
          originalContentType: originalContentType,
          correctContentType: this.getContentTypeByService(serviceType),
          timestamp: new Date().toISOString()
        });
        throw error
      }
    },

    // 准备输入数据的文件格式 - 根据api.md要求转换所有输入为文件
    async prepareInputFileData(input, node) {
      try {
        switch (input.type) {
          case 'text':
            // 文本输入转换为文本文件
            if (input.value && typeof input.value === 'string') {
              return {
                blob: new Blob([input.value], { type: 'text/plain' }),
                contentType: 'text/plain'
              }
            }
            break
            
          case 'audio':
            // 音频文件处理
            if (input.fileData) {
              return {
                blob: this.base64ToBlob(input.fileData, input.fileType || 'audio/wav'),
                contentType: input.fileType || 'audio/wav'
              }
            } else if (input.value && input.value instanceof File) {
              return {
                blob: input.value,
                contentType: input.value.type || 'audio/wav'
              }
            }
            break
            
          case 'image':
            // 图片文件处理
            if (input.fileData) {
              return {
                blob: this.base64ToBlob(input.fileData, input.fileType || 'image/jpeg'),
                contentType: input.fileType || 'image/jpeg'
              }
            } else if (input.value && input.value instanceof File) {
              return {
                blob: input.value,
                contentType: input.value.type || 'image/jpeg'
              }
            }
            break
            
          case 'file':
            // 通用文件处理
            if (input.fileData) {
              return {
                blob: this.base64ToBlob(input.fileData, input.fileType || 'application/octet-stream'),
                contentType: input.fileType || 'application/octet-stream'
              }
            } else if (input.value && input.value instanceof File) {
              return {
                blob: input.value,
                contentType: input.value.type || 'application/octet-stream'
              }
            }
            break
            
          case 'json':
            // JSON数据转换为文本文件
            if (input.value) {
              const jsonString = typeof input.value === 'string' ? input.value : JSON.stringify(input.value, null, 2)
              return {
                blob: new Blob([jsonString], { type: 'application/json' }),
                contentType: 'application/json'
              }
            }
            break
            
          default:
            console.warn(`未知的输入类型: ${input.type}`)
            return null
        }
        
        return null
      } catch (error) {
        console.error(`准备输入文件数据失败: ${input.type}`, error)
        return null
      }
    },

    // 将File对象转换为base64字符串（用于兼容性）
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },

    // Base64转Blob工具方法
    base64ToBlob(base64Data, contentType) {
      // 移除data:前缀
      const base64 = base64Data.replace(/^data:[^;]+;base64,/, '')
      
      // 解码base64
      const byteCharacters = atob(base64)
      const byteNumbers = new Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: contentType })
    },

    // 预处理所有需要上传的节点数据包 - 在调用uploadFilesToS3之前准备数据
    async preprocessWorkflowFiles() {
      try {
        // 1. 预处理节点数据
        for (const node of this.workflowNodes) {
          // 确保节点有基本的服务类型
          if (!node.service && node.type) {
            node.service = node.type
          }
          
          // 预处理节点输入数据
          if (node.inputs) {
            for (let i = 0; i < node.inputs.length; i++) {
              const input = node.inputs[i]
              
              // 确保文本输入有值（如果用户没有输入，给默认值）
              if (input.type === 'text' && !input.value) {
                input.value = '' // 空字符串也需要处理
              }
              
              // 为输入数据准备元数据
              if (!input.metadata) {
                input.metadata = {
                  nodeId: node.id,
                  inputIndex: i,
                  type: input.type,
                  processedAt: new Date().toISOString()
                }
              }
            }
          }
          
          // 确保节点有prompt（如果没有，给默认值）
          if (!node.prompt) {
            node.prompt = '请处理输入数据' // 默认prompt
          }
          
          // 为节点准备数据包元数据
          if (!node.packageMetadata) {
            node.packageMetadata = {
              nodeId: node.id,
              service: node.service || node.type,
              uploadKey: node.id,
              processedAt: new Date().toISOString()
            }
          }
        }
        
        // 2. 预处理连接数据
        for (let i = 0; i < this.connections.length; i++) {
          const connection = this.connections[i]
          
          // 确保连接prompt有值（如果没有，给默认值）
          if (!connection.prompt) {
            connection.prompt = '请处理输入数据' // 默认prompt
          }
          
          // 为连接准备元数据
          if (!connection.metadata) {
            connection.metadata = {
              connectionIndex: i,
              from: connection.from,
              to: connection.to,
              type: 'connection_prompt',
              processedAt: new Date().toISOString()
            }
          }
        }
        
        // 3. 验证预处理结果
        const nodeConnectionPrompts = this.getNodeConnectionPrompts()
        let processedNodes = 0
        
        for (const node of this.workflowNodes) {
          const hasInputs = node.inputs && node.inputs.some(input => 
            input.value !== undefined && input.value !== null
          )
          const hasPrompt = !!(node.prompt && node.prompt.trim())
          const hasConnectionPrompts = nodeConnectionPrompts[node.id] && nodeConnectionPrompts[node.id].length > 0
          
          if (hasInputs || hasPrompt || hasConnectionPrompts) {
            processedNodes++
          }
        }
        
        console.log(`节点数据预处理完成: ${processedNodes}/${this.workflowNodes.length} 个节点包含数据`)
        return true
        
      } catch (error) {
        console.error('Failed to preprocess node data:', error)
        throw new Error(`Failed to preprocess node data: ${error.message}`)
      }
    },

    // 获取工作流中所有需要上传的节点数据包列表
    getRequiredUploadsList() {
      const uploads = []
      
      // 获取连接prompt信息
      const nodeConnectionPrompts = this.getNodeConnectionPrompts()
      
      // 遍历所有节点，生成数据包上传信息
      this.workflowNodes.forEach(node => {
        const hasInputs = node.inputs && node.inputs.some(input => 
          input.value !== undefined && input.value !== null && input.value !== ''
        )
        const hasPrompt = !!(node.prompt && node.prompt.trim())
        const hasConnectionPrompts = nodeConnectionPrompts[node.id] && nodeConnectionPrompts[node.id].length > 0
        
        uploads.push({
          type: 'node_data_package',
          nodeId: node.id,
          service: node.service || node.type,
          title: node.title,
          uploadKey: node.id,
          hasInputs: hasInputs,
          hasPrompt: hasPrompt,
          hasConnectionPrompts: hasConnectionPrompts,
          inputsCount: node.inputs ? node.inputs.length : 0,
          connectionPromptsCount: nodeConnectionPrompts[node.id] ? nodeConnectionPrompts[node.id].length : 0,
          hasData: hasInputs || hasPrompt || hasConnectionPrompts
        })
      })
      
      return uploads
    },

    // 验证节点数据包上传前的数据完整性
    validateUploadData() {
      const errors = []
      const warnings = []
      
      // 1. 验证节点数据完整性
      for (const node of this.workflowNodes) {
        // 检查节点基本信息
        if (!node.service && !node.type) {
          errors.push(`节点 ${node.title || node.id} 缺少服务类型配置`)
        }
        
        // 检查节点输入数据
        if (node.inputs) {
          for (let i = 0; i < node.inputs.length; i++) {
            const input = node.inputs[i]
            
            // 检查必需的输入是否有值
            if (input.type === 'audio' && !input.value && !input.fileData) {
              errors.push(`节点 ${node.title} 的音频输入 ${input.name} 没有数据`)
            }
            if (input.type === 'image' && !input.value && !input.fileData) {
              errors.push(`节点 ${node.title} 的图片输入 ${input.name} 没有数据`)
            }
            
            // 检查文件大小限制
            if (input.fileData && input.fileSize) {
              const maxSize = 10 * 1024 * 1024 // 10MB 限制
              if (input.fileSize > maxSize) {
                errors.push(`节点 ${node.title} 的文件 ${input.name} 超过大小限制 (${Math.round(input.fileSize / 1024 / 1024)}MB > 10MB)`)
              }
            }
          }
        }
        
        // 检查AI服务节点是否有prompt
        if (this.isAIServiceNode(node.type) && !node.prompt) {
          warnings.push(`AI服务节点 ${node.title} 没有配置prompt，将使用默认处理指令`)
        }
      }
      
      // 2. 验证连接数据
      for (let i = 0; i < this.connections.length; i++) {
        const connection = this.connections[i]
        if (!connection.prompt) {
          warnings.push(`连接 ${connection.from} → ${connection.to} 没有配置prompt，将使用默认指令`)
        }
      }
      
      // 3. 验证工作流完整性
      const nodeConnectionPrompts = this.getNodeConnectionPrompts()
      let totalDataPackages = 0
      let packagesWithData = 0
      
      for (const node of this.workflowNodes) {
        totalDataPackages++
        const hasInputs = node.inputs && node.inputs.some(input => 
          input.value !== undefined && input.value !== null && input.value !== ''
        )
        const hasPrompt = !!(node.prompt && node.prompt.trim())
        const hasConnectionPrompts = nodeConnectionPrompts[node.id] && nodeConnectionPrompts[node.id].length > 0
        
        if (hasInputs || hasPrompt || hasConnectionPrompts) {
          packagesWithData++
        }
      }
      
      if (packagesWithData === 0) {
        warnings.push('工作流中没有任何节点包含数据，可能无法正常执行')
      }
      
      return { 
        errors, 
        warnings,
        summary: {
          totalNodes: this.workflowNodes.length,
          totalDataPackages,
          packagesWithData,
          totalConnections: this.connections.length
        }
      }
    },

    // 显示上传进度信息
    showUploadProgress(current, total, currentFile) {
      const percent = Math.round((current / total) * 100)
      this.showSuccess(`上传进度: ${current}/${total} (${percent}%) - 正在上传: ${currentFile}`)
    },

    // 测试和验证完整的文件上传流程
    async testUploadFlow() {
      try {
        console.log('=== 开始测试文件上传流程 ===')
        
        // 1. 检查工作流状态
        if (this.workflowNodes.length === 0) {
          throw new Error('没有工作流节点可供测试')
        }
        
        // 2. 预处理文件
        await this.preprocessWorkflowFiles()
        console.log('✅ 文件预处理完成')
        
        // 3. 验证数据
        const validation = this.validateUploadData()
        if (validation.errors.length > 0) {
          console.error('❌ 数据验证失败:', validation.errors)
          return false
        }
        console.log('✅ 数据验证通过')
        
        // 4. 生成上传列表
        const uploadsList = this.getRequiredUploadsList()
        console.log('✅ 生成上传列表:', uploadsList)
        
        // 5. 测试文件数据准备
        let fileDataCount = 0
        for (const node of this.workflowNodes) {
          if (node.inputs) {
            for (const input of node.inputs) {
              if (input.value) {
                const fileData = await this.prepareInputFileData(input, node)
                if (fileData) {
                  fileDataCount++
                  console.log(`✅ 节点 ${node.id} 输入 ${input.type} 文件数据准备完成`)
                }
              }
            }
          }
        }
        
        console.log(`✅ 总计准备了 ${fileDataCount} 个文件的数据`)
        console.log('=== 文件上传流程测试完成 ===')
        
        return true
        
      } catch (error) {
        console.error('❌ 文件上传流程测试失败:', error)
        return false
      }
    },
    
    async monitorWorkflowExecution(dagId) {
      console.log('开始SSE监控工作流:', dagId)
      this.startSSEMonitoring(dagId)
    },

    // 调试上传问题的专用方法
    debugUploadProcess() {
      console.log('🔍 ===== 上传问题调试报告 =====');
      console.log('📅 调试时间:', new Date().toISOString());
      
      // 1. 检查工作流状态
      console.log('📋 工作流基本信息:', {
        节点数量: this.workflowNodes.length,
        连接数量: this.connections.length,
        当前工作流: this.currentWorkflow,
        租户ID: this.getTenantId()
      });
      
      // 2. 检查节点详情
      console.log('🔍 节点详细信息:');
      this.workflowNodes.forEach((node, index) => {
        console.log(`节点 ${index + 1}:`, {
          ID: node.id,
          类型: node.type,
          服务: node.service,
          标题: node.title,
          输入数量: node.inputs ? node.inputs.length : 0,
          有输入数据: node.inputs ? node.inputs.some(input => input.value) : false,
          提示词: node.prompt ? '已设置' : '未设置'
        });
        
        if (node.inputs) {
          node.inputs.forEach((input, idx) => {
            console.log(`  输入 ${idx + 1}:`, {
              名称: input.name,
              类型: input.type,
              有值: !!input.value,
              有文件数据: !!input.fileData,
              值预览: input.value ? input.value.substring(0, 50) + '...' : '无'
            });
          });
        }
      });
      
      // 3. 检查连接信息
      console.log('🔗 连接信息:');
      this.connections.forEach((conn, index) => {
        console.log(`连接 ${index + 1}:`, {
          从: conn.from,
          到: conn.to,
          提示词: conn.prompt ? '已设置' : '未设置'
        });
      });
      
      // 4. 模拟数据包准备过程
      console.log('📦 模拟数据包准备:');
      const nodeConnectionPrompts = this.getNodeConnectionPrompts();
      this.workflowNodes.forEach(async (node) => {
        try {
          const dataPackage = await this.prepareNodeDataPackage(node, nodeConnectionPrompts);
          console.log(`节点 ${node.id} 数据包:`, dataPackage);
        } catch (error) {
          console.error(`节点 ${node.id} 数据包准备失败:`, error);
        }
      });
      
      // 5. 检查上传列表
      const uploadsList = this.getRequiredUploadsList();
      console.log('📤 上传列表:', uploadsList);
      
      // 6. 检查API配置
      console.log('⚙️ API配置:', {
        基础URL: AI_AGENT_API.CREATE,
        部署URL: AI_AGENT_API.DEPLOY,
        列表URL: AI_AGENT_API.LIST(this.getTenantId()),
        状态URL: AI_AGENT_API.STATUS('test-dag-id')
      });
      
      console.log('✅ 调试报告完成，请查看上述信息定位问题');
      console.log('💡 提示: 如果节点没有输入数据，上传列表可能为空');
      
      return {
        节点数量: this.workflowNodes.length,
        上传任务数量: uploadsList.length,
        有数据的节点: uploadsList.filter(item => item.hasData).length
      };
    },
    clearCanvas() {
      this.workflowNodes = []
      this.connections = []
      this.selectedNode = null
      this.workflowStatus = 'Ready' // 使用英文key，通过getTranslatedStatus方法进行翻译
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
        
        const tenantId = this.getTenantId();
        console.log('🔄 开始加载工作流列表 - 租户ID:', tenantId);
        console.log('📡 请求URL:', AI_AGENT_API.LIST(tenantId));
        
        const response = await fetch(AI_AGENT_API.LIST(tenantId))
        
        if (!response.ok) {
          console.error('❌ API响应失败:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        // 增强响应解析和验证
        let data;
        try {
          const responseText = await response.text();
          console.log('📄 原始响应内容:', responseText);
          
          if (!responseText.trim()) {
            console.warn('⚠️ 收到空响应，使用空数组');
            data = [];
          } else {
            data = JSON.parse(responseText);
            console.log('✅ 成功解析JSON响应:', data);
          }
        } catch (parseError) {
          console.error('❌ JSON解析失败:', parseError);
          throw new Error(`响应解析失败: ${parseError.message}`);
        }
        
        // 详细的响应格式验证
        let workflowList = [];
        
        if (Array.isArray(data)) {
          // 直接是数组格式（符合API文档）
          workflowList = data;
          console.log('✅ 响应格式正确 - 直接数组格式，包含', data.length, '个工作流');
        } else if (data && typeof data === 'object') {
          // 对象格式，尝试提取数组
          if (Array.isArray(data.dags)) {
            workflowList = data.dags;
            console.log('✅ 响应格式 - 对象包装格式，从data.dags提取', data.dags.length, '个工作流');
          } else if (Array.isArray(data.data)) {
            workflowList = data.data;
            console.log('✅ 响应格式 - 对象包装格式，从data.data提取', data.data.length, '个工作流');
          } else if (Array.isArray(data.workflows)) {
            workflowList = data.workflows;
            console.log('✅ 响应格式 - 对象包装格式，从data.workflows提取', data.workflows.length, '个工作流');
          } else {
            console.warn('⚠️ 未知响应格式，尝试将整个对象作为单个工作流处理');
            console.log('🔍 响应对象结构:', Object.keys(data));
            workflowList = [data]; // 将整个对象作为单个工作流
          }
        } else {
          console.warn('⚠️ 响应数据类型异常:', typeof data);
          workflowList = [];
        }
        
        this.workflowList = workflowList;
        console.log('📋 最终工作流列表:', this.workflowList);
        
        // 工作流列表为空时显示空状态，不添加示例数据
        
        // 更新统计信息
        this.updateWorkflowStats()
        
      } catch (error) {
        console.error('加载工作流列表失败:', error)
        this.workflowListError = error.message || '加载工作流列表失败'
        this.showError('加载工作流列表失败: ' + error.message)
      } finally {
        this.loadingWorkflows = false
      }
    },

    // 刷新工作流列表
    async refreshWorkflowList() {
      await this.loadWorkflowList()
      if (!this.workflowListError) {
        this.showSuccess('工作流列表已刷新')
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

    // 编辑工作流 - 加载到设计台进行编辑
    viewWorkflow(workflow) {
      // 切换到工作流设计页面并加载该工作流数据
      this.setActiveTab('workflow')
      // 从记录中加载工作流数据到设计台，可以在此基础上修改并重新部署
      this.loadWorkflowData(workflow.dag_id)
    },

    // 查看工作流状态
    async viewWorkflowStatus(workflow) {
      try {
        // 使用SSE监控状态
        this.startSSEMonitoring(workflow.dag_id)
        
        // 显示状态监控弹窗
        this.showStatusMonitor = true
        
      } catch (error) {
        console.error('Failed to get workflow status:', error)
        this.showError('Failed to get workflow status: ' + error.message)
      }
    },

    // 查看工作流结果
    async viewWorkflowResults(workflow) {
      try {
        // 获取最终输出节点的结果
        const finalNode = this.identifyFinalOutputNode()
        if (finalNode) {
          const response = await fetch(AI_AGENT_API.RESULT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dag_id: workflow.dag_id,
              tenant_id: this.getTenantId(),
              node_id: finalNode.id
            })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const results = await response.json()
          
          this.workflowResults = {
            dag_id: workflow.dag_id,
            final_output: results,
            node_id: finalNode.id
          }
        
        // 识别和处理最终输出
          await this.processFinalOutput(this.workflowResults)
        } else {
          this.showWarning('Final output node not found')
        }
        
        this.monitoringWorkflowId = workflow.dag_id
        this.showResultsViewer = true
        
      } catch (error) {
        console.error('Failed to get workflow results:', error)
        this.showError('Failed to get workflow results: ' + error.message)
      }
    },

    // ==================== 最终输出处理方法 ====================
    
    // 识别最终输出节点
    identifyFinalOutputNode() {
      if (!this.workflowNodes || this.workflowNodes.length === 0) {
        return null
      }
      
      // 找出没有输出连接的节点（终端节点）
      const terminalNodes = this.workflowNodes.filter(node => {
        return !this.connections.some(conn => conn.from === node.id)
      })
      
      // 如果有多个终端节点，选择最后创建的那个
      if (terminalNodes.length > 1) {
        return terminalNodes.reduce((latest, current) => {
          return current.id > latest.id ? current : latest
        })
      }
      
      return terminalNodes.length > 0 ? terminalNodes[0] : null
    },

    // 处理最终输出数据
    async processFinalOutput(results) {
      try {
        // 识别最终输出节点
        this.finalOutputNode = this.identifyFinalOutputNode()
        
        if (!this.finalOutputNode) {
          this.finalOutputData = null
          return
        }
        
        // 从结果中提取最终输出数据
        const finalOutput = this.extractFinalOutputFromResults(results, this.finalOutputNode.id)
        
        if (finalOutput) {
          this.finalOutputData = this.formatFinalOutput(finalOutput)
        } else {
          this.finalOutputData = null
        }
        
      } catch (error) {
        console.error('Failed to process final output:', error)
        this.finalOutputData = null
      }
    },

    // 从结果中提取最终输出
    extractFinalOutputFromResults(results, nodeId) {
      // 尝试从results中找到对应节点的输出
      if (results?.results && results.results[nodeId]) {
        return results.results[nodeId].output
      }
      
      // 尝试从final_output字段获取
      if (results?.final_output) {
        return results.final_output
      }
      
      // 尝试从messages中找到最后一个输出消息
      if (results?.messages && results.messages.length > 0) {
        const outputMessages = results.messages.filter(msg => msg.type === 'output')
        if (outputMessages.length > 0) {
          return outputMessages[outputMessages.length - 1].content
        }
      }
      
      return null
    },

    // 从JSON响应中智能提取实际内容
    extractActualContent(jsonResponse) {
      if (!jsonResponse || typeof jsonResponse !== 'object') {
        return jsonResponse
      }

      // 内容提取优先级列表
      const contentKeys = [
        // 专业字段（最高优先级）
        'audio_url', 'image_url', 'video_url', 'file_url',
        'voice', 'speech', 'audio', 'sound',
        'image', 'picture', 'photo',
        'video', 'movie', 'clip',
        
        // 通用输出字段
        'output', 'result', 'data', 'content', 
        'message', 'text', 'response',
        
        // URL字段
        'url', 'link', 'href',
        
        // 嵌套数据字段
        'payload', 'body', 'value'
      ]

      // 按优先级查找内容
      for (const key of contentKeys) {
        if (jsonResponse.hasOwnProperty(key) && jsonResponse[key] != null) {
          const value = jsonResponse[key]
          
          // 如果是嵌套对象，递归提取（最多递归2层）
          if (typeof value === 'object' && !Array.isArray(value)) {
            const nestedContent = this.extractActualContent(value)
            if (nestedContent !== value) {
              return nestedContent
            }
          }
          
          // 如果是有效的非空值，返回
          if (value !== '' && value !== null && value !== undefined) {
            return value
          }
        }
      }

      // 如果没有找到特定字段，检查是否是错误响应
      if (jsonResponse.error || jsonResponse.message) {
        return jsonResponse.error || jsonResponse.message
      }

      // 都没找到，返回原始对象
      return jsonResponse
    },

    // 格式化最终输出
    formatFinalOutput(output) {
      if (!output) return null
      
      // 检测输出类型
      const outputType = this.detectOutputType(output)
      
      return {
        type: outputType,
        content: output,
        displayContent: this.formatDisplayContent(output, outputType),
        timestamp: new Date().toISOString()
      }
    },

    // 检测输出类型
    detectOutputType(output) {
      if (typeof output === 'string') {
        // 先尝试检测是否是JSON，如果是则提取内容后重新检测
        try {
          const parsed = JSON.parse(output)
          const actualContent = this.extractActualContent(parsed)
          
          // 如果提取到了不同的内容，对提取的内容重新检测
          if (actualContent !== parsed) {
            return this.detectOutputType(actualContent)
          }
          // 如果提取不到有用内容，才标记为json
          return 'json'
        } catch (e) {
          // 不是JSON，继续检测媒体类型
          return this.detectMediaType(output)
        }
      }
      
      if (typeof output === 'object') {
        // 对象类型，尝试提取内容
        const actualContent = this.extractActualContent(output)
        if (actualContent !== output) {
          return this.detectOutputType(actualContent)
        }
        return 'json'
      }
      
      return 'text'
    },

    // 检测媒体类型（增强版）
    detectMediaType(content) {
      if (typeof content !== 'string') {
        return 'text'
      }

      // 1. Data URL检测
      if (content.startsWith('data:image/')) return 'image'
      if (content.startsWith('data:audio/')) return 'audio'
      if (content.startsWith('data:video/')) return 'video'

      // 2. Blob URL检测
      if (content.startsWith('blob:')) {
        // 根据当前节点类型推断
        if (this.finalOutputNode) {
          const nodeType = this.finalOutputNode.service || this.finalOutputNode.type
          if (nodeType === 'STT') return 'text'
          if (nodeType === 'TTS') return 'audio'
          if (nodeType === 'pic2text') return 'text'
          if (nodeType === 'text2pic') return 'image'
        }
        return 'audio' // blob默认假设为音频
      }

      // 3. 智能文件扩展名检测
      const getFileExtension = (url) => {
        try {
          const urlObj = new URL(url)
          const pathname = urlObj.pathname
          const match = pathname.match(/\.([^.]+)$/)
          return match ? match[1].toLowerCase() : null
        } catch (e) {
          const match = url.match(/\.([^.?#]+)/)
          return match ? match[1].toLowerCase() : null
        }
      }

      const extension = getFileExtension(content)

      // 图片扩展名
      if (extension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'].includes(extension)) {
          return 'image'
        }
        
      // 音频扩展名
      if (extension && ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'opus', 'webm', '3gp', 'amr'].includes(extension)) {
          return 'audio'
        }
        
      // 视频扩展名
      if (extension && ['mp4', 'webm', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'f4v', '3gp', 'ogv'].includes(extension)) {
          return 'video'
        }
        
      // 4. URL路径特征检测
      if (content.includes('/tts/') || content.includes('/synthesize/') || content.includes('/speech/')) {
        return 'audio'
      }

      if (content.includes('/images/') || content.includes('/generate/') || content.includes('/img/')) {
        return 'image'
      }

      // 5. 根据节点类型推断
      if (this.finalOutputNode) {
        const nodeType = this.finalOutputNode.service || this.finalOutputNode.type
        if (nodeType === 'TTS' && this.looksLikeAudioData(content)) {
          return 'audio'
        }
        if (nodeType === 'text2pic' && this.looksLikeImageData(content)) {
          return 'image'
        }
      }

      // 6. 内容特征检测
      if (this.looksLikeAudioData(content)) return 'audio'
      if (this.looksLikeImageData(content)) return 'image'

      // 默认为文本
      return 'text'
    },

    // 检测是否像音频数据
    looksLikeAudioData(content) {
      return (
        content.startsWith('data:audio/') ||
        content.startsWith('blob:') ||
        content.includes('audio') ||
        content.includes('tts') ||
        content.includes('synthesize') ||
        content.includes('speech') ||
        content.includes('voice') ||
        /\.(mp3|wav|ogg|m4a|aac|flac|wma|opus|webm|3gp|amr)(\?|$)/i.test(content)
      )
    },

    // 检测是否像图片数据
    looksLikeImageData(content) {
      return (
        content.startsWith('data:image/') ||
        content.includes('image') ||
        content.includes('photo') ||
        content.includes('picture') ||
        content.includes('generate') ||
        /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico)(\?|$)/i.test(content)
      )
    },

    // 格式化显示内容
    formatDisplayContent(content, type) {
      switch (type) {
        case 'json':
          // 先尝试提取内容，再格式化
          if (typeof content === 'string') {
            try {
              const parsed = JSON.parse(content)
              const extracted = this.extractActualContent(parsed)
              if (extracted !== parsed) {
                // 提取到内容，使用提取的内容重新格式化
                const extractedType = this.detectOutputType(extracted)
                return this.formatDisplayContent(extracted, extractedType)
              }
              // 提取不到，格式化显示JSON
              return JSON.stringify(parsed, null, 2)
            } catch (e) {
              return content
            }
          }
          return typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content)
        case 'text':
          return String(content)
        case 'image':
        case 'audio':
        case 'video':
          return content // URL或base64数据
        default:
          return String(content)
      }
    },

    // 工作流完成时自动显示结果
    async onWorkflowCompleted(dagId) {
      try {
        // 获取工作流信息
        const workflow = this.workflowList.find(w => w.dag_id === dagId) || { dag_id: dagId }
        
        // 获取并显示结果
        await this.viewWorkflowResults(workflow)
        
        // 聚焦到最终输出
        this.focusOnFinalOutput = true
        
        // 3秒后取消聚焦效果
        setTimeout(() => {
          this.focusOnFinalOutput = false
        }, 3000)
        
      } catch (error) {
        console.error('Failed to auto-show results:', error)
      }
    },

    // ==================== 最终输出交互功能 ====================

    // 复制最终输出到剪贴板
    async copyFinalOutput() {
      if (!this.finalOutputData) {
        this.showError('No content available for copying')
        return
      }

      try {
        let textContent = ''
        
        // 根据类型选择合适的复制内容
        if (this.finalOutputData.type === 'text') {
          textContent = this.finalOutputData.displayContent
        } else if (this.finalOutputData.type === 'json') {
          textContent = this.finalOutputData.displayContent
        } else if (['image', 'audio', 'video'].includes(this.finalOutputData.type)) {
          // 媒体文件复制URL
          textContent = this.finalOutputData.content
        } else {
          textContent = String(this.finalOutputData.content)
        }

        await navigator.clipboard.writeText(textContent)
        
        // 根据类型显示不同的成功消息
        const typeMessages = {
          'text': 'Text content copied to clipboard',
          'json': 'JSON data copied to clipboard', 
          'image': 'Image URL copied to clipboard',
          'audio': 'Audio URL copied to clipboard',
          'video': 'Video URL copied to clipboard'
        }
        
        this.showSuccess(typeMessages[this.finalOutputData.type] || 'Content copied to clipboard')
      } catch (error) {
        console.error('Copy failed:', error)
        this.showError('Copy failed: ' + error.message)
      }
    },

    // 下载最终输出
    downloadFinalOutput() {
      if (!this.finalOutputData) {
        this.showError('No content available for download')
        return
      }

      try {
        const { type, content, displayContent } = this.finalOutputData
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const nodeType = this.finalOutputNode?.service || this.finalOutputNode?.type || 'output'
        const baseFilename = `${nodeType}_output_${this.monitoringWorkflowId}_${timestamp}`
        
        if (type === 'image') {
          // 智能检测图片格式
          const format = this.detectImageFormat(content)
          this.downloadMediaFile(content, `${baseFilename}.${format}`, `image/${format}`)
        } else if (type === 'audio') {
          // 智能检测音频格式
          const format = this.detectAudioFormat(content)
          this.downloadMediaFile(content, `${baseFilename}.${format}`, `audio/${format}`)
        } else if (type === 'video') {
          // 智能检测视频格式
          const format = this.detectVideoFormat(content)
          this.downloadMediaFile(content, `${baseFilename}.${format}`, `video/${format}`)
        } else if (type === 'json') {
          this.downloadTextFile(displayContent, `${baseFilename}.json`, 'application/json')
        } else {
          // 文本内容，根据内容长度和格式智能选择扩展名
          const extension = this.detectTextFormat(displayContent)
          this.downloadTextFile(displayContent, `${baseFilename}.${extension}`, this.getTextMimeType(extension))
        }
        
        this.showSuccess('Download started successfully')
      } catch (error) {
        console.error('Download failed:', error)
        this.showError('Download failed: ' + error.message)
      }
    },

    // 检测图片格式
    detectImageFormat(content) {
      if (content.startsWith('data:image/')) {
        const match = content.match(/data:image\/([^;]+)/)
        if (match) return match[1]
      }
      
      // 从URL中提取扩展名
      const urlMatch = content.match(/\.([^.?#]+)(\?|#|$)/)
      if (urlMatch) {
        const ext = urlMatch[1].toLowerCase()
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
          return ext === 'jpg' ? 'jpeg' : ext
        }
      }
      
      return 'png' // 默认PNG格式
    },

    // 检测音频格式
    detectAudioFormat(content) {
      if (content.startsWith('data:audio/')) {
        const match = content.match(/data:audio\/([^;]+)/)
        if (match) return match[1]
      }
      
      const urlMatch = content.match(/\.([^.?#]+)(\?|#|$)/)
      if (urlMatch) {
        const ext = urlMatch[1].toLowerCase()
        if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
          return ext
        }
      }
      
      return 'mp3' // 默认MP3格式
    },

    // 检测视频格式
    detectVideoFormat(content) {
      if (content.startsWith('data:video/')) {
        const match = content.match(/data:video\/([^;]+)/)
        if (match) return match[1]
      }
      
      const urlMatch = content.match(/\.([^.?#]+)(\?|#|$)/)
      if (urlMatch) {
        const ext = urlMatch[1].toLowerCase()
        if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(ext)) {
          return ext
        }
      }
      
      return 'mp4' // 默认MP4格式
    },

    // 检测文本格式
    detectTextFormat(content) {
      // 检测是否包含markdown语法
      const markdownPattern = /[#*`\[\]]/
      if (markdownPattern.test(content) || content.includes('##') || content.includes('**')) {
        return 'md'
      }
      
      // 检测是否是代码
      if (content.includes('function') || content.includes('class') || content.includes('import')) {
        return 'txt'
      }
      
      // 检测是否是HTML
      if (content.includes('<html>') || content.includes('<!DOCTYPE')) {
        return 'html'
      }
      
      // 默认为文本
      return 'txt'
    },

    // 获取文本MIME类型
    getTextMimeType(extension) {
      const mimeTypes = {
        'md': 'text/markdown',
        'txt': 'text/plain',
        'html': 'text/html',
        'json': 'application/json'
      }
      return mimeTypes[extension] || 'text/plain'
    },

    // 分享最终输出
    async shareFinalOutput() {
      if (!this.finalOutputData) {
        this.showError('No content available for sharing')
        return
      }

      try {
        const nodeType = this.finalOutputNode?.service || this.finalOutputNode?.type || 'AI'
        const { type, content, displayContent } = this.finalOutputData
        
        let shareText = ''
        if (type === 'text') {
          shareText = `${nodeType} AI Result:\n${displayContent.substring(0, 200)}${displayContent.length > 200 ? '...' : ''}`
        } else if (['image', 'audio', 'video'].includes(type)) {
          shareText = `${nodeType} AI generated ${type}: ${content}`
        } else {
          shareText = `${nodeType} AI Result:\n${displayContent.substring(0, 200)}${displayContent.length > 200 ? '...' : ''}`
        }

        const shareData = {
          title: `${nodeType} AI Workflow Result - ${this.monitoringWorkflowId}`,
          text: shareText,
          url: window.location.href
        }

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          this.showSuccess('Content shared successfully')
        } else {
          // 降级方案：复制到剪贴板
          const fallbackText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
          await navigator.clipboard.writeText(fallbackText)
          this.showSuccess('Share content copied to clipboard')
        }
      } catch (error) {
        console.error('Share failed:', error)
        this.showError('Share failed: ' + error.message)
      }
    },

    // 全屏查看最终输出
    viewFinalOutputFullscreen() {
      if (!this.finalOutputData) {
        this.showError('No content available for fullscreen view')
        return
      }

      const nodeType = this.finalOutputNode?.service || this.finalOutputNode?.type || 'Output'
      const { type } = this.finalOutputData

      // 创建全屏模态窗口
      const modal = document.createElement('div')
      modal.className = 'fullscreen-output-modal'
      modal.innerHTML = `
        <div class="fullscreen-content">
          <div class="fullscreen-header">
            <h3>🎯 ${nodeType} ${type.charAt(0).toUpperCase() + type.slice(1)} Output - Fullscreen View</h3>
            <div class="fullscreen-controls">
              <button class="fullscreen-btn" onclick="navigator.clipboard.writeText('${this.finalOutputData.content.replace(/'/g, "\\'")}').then(() => alert('Copied to clipboard'))" title="Copy">📋</button>
              <button class="fullscreen-close" onclick="this.parentElement.parentElement.parentElement.remove()" title="Close">×</button>
            </div>
          </div>
          <div class="fullscreen-body">
            ${this.generateOutputHTML(this.finalOutputData)}
          </div>
          <div class="fullscreen-footer">
            <span class="output-info">Type: ${type.toUpperCase()} | Node: ${nodeType} | Workflow: ${this.monitoringWorkflowId}</span>
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      // 添加键盘快捷键
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          modal.remove()
          document.removeEventListener('keydown', handleKeydown)
        } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
          // Ctrl+C 或 Cmd+C 复制
          e.preventDefault()
          navigator.clipboard.writeText(this.finalOutputData.content).then(() => {
            // 显示临时提示
            const toast = document.createElement('div')
            toast.className = 'copy-toast'
            toast.textContent = 'Copied to clipboard!'
            toast.style.cssText = `
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
              background: #4CAF50; color: white; padding: 12px 24px; border-radius: 8px;
              z-index: 10001; opacity: 0; transition: opacity 0.3s ease;
            `
            document.body.appendChild(toast)
            setTimeout(() => toast.style.opacity = '1', 10)
            setTimeout(() => {
              toast.style.opacity = '0'
              setTimeout(() => document.body.removeChild(toast), 300)
            }, 2000)
          })
        }
      }
      document.addEventListener('keydown', handleKeydown)
      
      // 点击模态背景关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove()
          document.removeEventListener('keydown', handleKeydown)
        }
      })
    },

    // 生成输出HTML
    generateOutputHTML(outputData) {
      const { type, content, displayContent } = outputData
      
      switch (type) {
        case 'image':
          return `<img src="${content}" alt="输出图片" style="max-width: 100%; height: auto;" />`
        case 'audio':
          return `<audio controls style="width: 100%;"><source src="${content}" type="audio/mpeg"></audio>`
        case 'video':
          return `<video controls style="max-width: 100%; height: auto;"><source src="${content}" type="video/mp4"></video>`
        case 'json':
          return `<pre style="background: #1a1a1a; color: #e0e0e0; padding: 20px; border-radius: 8px; overflow: auto; font-family: 'Consolas', monospace; font-size: 14px; line-height: 1.5;">${displayContent}</pre>`
        case 'text':
          // 文本类型使用markdown渲染，保持链接功能
          return `<div class="fullscreen-markdown-container">${this.renderMarkdown(displayContent)}</div>`
        default:
          // 其他类型降级为纯文本显示
          return `<pre style="background: #1a1a1a; color: #e0e0e0; padding: 20px; border-radius: 8px; overflow: auto; font-family: 'Consolas', monospace; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${displayContent}</pre>`
      }
    },

    // 工具方法：下载文件
    downloadFile(url, filename, mimeType) {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },

    // 工具方法：下载媒体文件（处理URL和base64）
    async downloadMediaFile(url, filename, mimeType) {
      try {
        if (url.startsWith('data:')) {
          // Base64数据，直接下载
          this.downloadFile(url, filename, mimeType)
        } else {
          // URL资源，需要先获取数据
          const response = await fetch(url)
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          this.downloadFile(blobUrl, filename, mimeType)
          URL.revokeObjectURL(blobUrl)
        }
      } catch (error) {
        console.error('媒体文件下载失败:', error)
        // 降级方案：直接使用URL
        this.downloadFile(url, filename, mimeType)
      }
    },

    // 工具方法：下载文本文件
    downloadTextFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      this.downloadFile(url, filename, mimeType)
      URL.revokeObjectURL(url)
    },

    // 计算执行摘要
    calculateExecutionSummary() {
      if (!this.workflowResults || !this.currentWorkflowStatus) {
        return {
          totalTime: 0,
          successfulNodes: 0,
          totalNodes: 0,
          status: 'unknown'
        }
      }

      const totalNodes = this.workflowNodes.length
      const successfulNodes = this.currentWorkflowStatus.nodes 
        ? this.currentWorkflowStatus.nodes.filter(node => node.status === 'completed').length
        : 0
      
      const totalTime = this.currentWorkflowStatus.duration || 0
      const status = this.currentWorkflowStatus.status || 'unknown'

      return {
        totalTime,
        successfulNodes,
        totalNodes,
        status
      }
    },

    // 复制工作流 - 加载到设计台进行编辑
    async cloneWorkflow(workflow) {
      try {
        // 切换到设计页面
        this.setActiveTab('workflow')
        
        // 加载工作流数据到设计台
        await this.loadWorkflowData(workflow.dag_id)
        
        // 修改名称表示这是副本
        this.currentWorkflow.name = `${this.currentWorkflow.name}_副本`
        
        this.showSuccess(`工作流 "${workflow.name || workflow.dag_id}" 已复制到设计台，您可以修改后重新部署`)
        
      } catch (error) {
        console.error('复制工作流失败:', error)
        this.showError(`复制工作流失败: ${error.message}`)
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
        
        this.showSuccess('工作流已删除')
        
      } catch (error) {
        console.error('删除工作流失败:', error)
        this.showError('删除工作流失败: ' + error.message)
      }
    },

    // 从后端加载工作流数据到编辑器
    async loadWorkflowData(dagId) {
      try {
        console.log('Starting to load workflow data:', dagId)
        
        // 获取租户所有DAG列表
        const response = await fetch(AI_AGENT_API.LIST(this.getTenantId()))
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        const allDAGs = Array.isArray(data) ? data : (data.dags || [])
        
        // 查找指定的DAG
        const targetDAG = allDAGs.find(dag => dag.dag_id === dagId)
        
        if (!targetDAG) {
          throw new Error(`Workflow with DAG ID ${dagId} not found`)
        }
        
        console.log('Found target workflow:', targetDAG)
        
        // 重置当前画布
        this.clearCanvas()
        
        // 恢复工作流基本信息 - 重置为新的工作流状态，可以正常编辑和部署
        this.currentWorkflow = {
          name: targetDAG.name || targetDAG.workflow_metadata?.name || '已加载工作流',
          description: targetDAG.description || targetDAG.workflow_metadata?.description || '',
          version: targetDAG.version || targetDAG.workflow_metadata?.version || '1.0.0'
        }
        
        // 恢复节点数据
        if (targetDAG.nodes) {
          this.workflowNodes = []
          Object.keys(targetDAG.nodes).forEach(nodeId => {
            const nodeData = targetDAG.nodes[nodeId]
            
            // 获取节点类型和模板
            const nodeType = nodeData.service || nodeData.type || 'LLM'
            const template = this.getNodeTemplate(nodeType)
            
            // 获取节点位置信息
            const position = targetDAG.nodes_positions?.[nodeId] || nodeData.position || { x: 100, y: 100 }
            
            // 使用模板重建完整节点对象，然后用保存的数据覆盖
            const restoredNode = {
              // 从模板开始，确保有完整的inputs和outputs结构
              ...template,
              
              // 基本节点信息
              id: nodeId,
              type: nodeType,
              title: nodeData.title || template.title || nodeId,
              description: nodeData.description || template.description || '',
              service: nodeData.service || template.service,
              
              // 保留用户配置的prompt，如果没有则使用模板默认值
              prompt: nodeData.prompt || template.prompt,
              
              // 位置信息
              x: position.x || 100,
              y: position.y || 100,
              width: position.width || 200,
              height: position.height || 120,
              
              // 状态信息
              status: nodeData.status || 'ready',
              enabled: nodeData.enabled !== false,
              
              // 用保存的服务特定配置覆盖模板默认值
              ...(nodeData.service === 'LLM' && {
                model: nodeData.model || template.model,
                temperature: nodeData.temperature !== undefined ? nodeData.temperature : template.temperature,
                max_tokens: nodeData.max_tokens || template.max_tokens,
                top_p: nodeData.top_p || 1.0,
                frequency_penalty: nodeData.frequency_penalty || 0,
                presence_penalty: nodeData.presence_penalty || 0,
                stop: nodeData.stop || '',
                user: nodeData.user || '',
                stream: nodeData.stream || false,
                logit_bias: nodeData.logit_bias || {}
              }),
              ...(nodeData.service === 'STT' && {
                language: nodeData.language || template.language,
                model: nodeData.model || template.model,
                response_format: nodeData.response_format || 'text',
                temperature: nodeData.temperature !== undefined ? nodeData.temperature : 0,
                timestamp_granularities: nodeData.timestamp_granularities || ['word']
              }),
              ...(nodeData.service === 'TTS' && {
                voice: nodeData.voice || template.voice,
                response_format: nodeData.response_format || 'mp3',
                speed: nodeData.speed !== undefined ? nodeData.speed : template.speed,
                model: nodeData.model || 'tts-1'
              }),
              ...(nodeData.service === 'pic2text' && {
                language: nodeData.language || template.language,
                format: nodeData.format || template.format,
                max_tokens: nodeData.max_tokens || 300,
                detail: nodeData.detail || 'auto',
                quality: nodeData.quality || 'auto'
              }),
              ...(nodeData.service === 'text2pic' && {
                model: nodeData.model || 'dall-e-3',
                size: nodeData.size || template.size,
                style: nodeData.style || template.style,
                quality: nodeData.quality || 'standard',
                n: nodeData.n || 1,
                user: nodeData.user || '',
                response_format: nodeData.response_format || 'url'
              })
            }
            
            // 恢复用户输入的数据到inputs中
            if (template.inputs && template.inputs.length > 0) {
              restoredNode.inputs = template.inputs.map(inputTemplate => {
                // 创建输入副本，保持模板结构但清空用户数据
                const restoredInput = {
                  ...inputTemplate,
                  value: inputTemplate.type === 'text' ? '' : null,
                  fileData: null,
                  fileName: null,
                  fileSize: null,
                  fileType: null
                }
                
                // 如果有保存的输入数据，尝试恢复（通常工作流记录不包含用户输入数据）
                // 这里预留扩展空间，以后可以保存和恢复用户输入
                
                return restoredInput
              })
            }
            
            this.workflowNodes.push(restoredNode)
          })
        }
        
        // 恢复连接数据
        if (targetDAG.edges) {
          this.connections = targetDAG.edges.map(edge => ({
            id: edge.id || `${edge.from}-${edge.to}`,
            from: edge.from,
            to: edge.to,
            prompt: edge.prompt || '',
            type: edge.type || 'default',
            label: edge.label || '',
            enabled: edge.enabled !== false,
            
            // 连接样式
            color: edge.style?.color || '#333',
            width: edge.style?.width || 2,
            dashArray: edge.style?.dashArray || '',
            
            // 数据映射
            data_mapping: edge.data_mapping || {},
            created_at: edge.created_at || new Date().toISOString()
          }))
        }
        
        // 恢复画布设置
        if (targetDAG.canvas_settings) {
          this.canvasScale = targetDAG.canvas_settings.zoom || 1.0
          this.canvasOffsetX = targetDAG.canvas_settings.pan_x || 0
          this.canvasOffsetY = targetDAG.canvas_settings.pan_y || 0
        }
        
        // 保存历史记录
        this.saveToHistory()
        
        // 重置选择状态
        this.selectedNode = null
        this.selectedConnection = null
        
        console.log('Workflow loading completed:', {
          nodes: this.workflowNodes.length,
          connections: this.connections.length,
          workflow: this.currentWorkflow
        })
        
        this.showSuccess(`Workflow "${this.currentWorkflow.name}" loaded successfully! Ready for editing and redeployment.`)
        
      } catch (error) {
        console.error('Failed to load workflow data:', error)
        this.showError(`Failed to load workflow data: ${error.message}`)
      }
    },

    // 开始SSE监控
    startSSEMonitoring(dagId) {
      this.stopSSEMonitoring()
      this.monitoringWorkflowId = dagId
      this.sseReconnectAttempts = 0
      this.sseConnectionStatus = 'connecting'
      
      console.log(`开始SSE监控工作流 ${dagId}`)
      
      this.createSSEConnection(dagId)
    },

    // 创建SSE连接
    createSSEConnection(dagId) {
      try {
        // 创建EventSource连接
        this.eventSource = new EventSource(AI_AGENT_API.STATUS(dagId))
        
        // 连接打开事件
        this.eventSource.onopen = () => {
          console.log('SSE连接已建立')
          this.sseConnectionStatus = 'connected'
          this.sseReconnectAttempts = 0
          this.resetHeartbeatTimeout()
        }
        
        // 接收消息事件
        this.eventSource.onmessage = (event) => {
          console.log('SSE消息:', event.data)
          this.handleSSEMessage(event.data)
          this.resetHeartbeatTimeout()
        }
        
        // 连接错误事件
        this.eventSource.onerror = (error) => {
          console.error('SSE连接错误:', error)
          this.sseConnectionStatus = 'error'
          
          // 如果EventSource还在连接状态，它会自动重试
          // 但如果连接已关闭，我们需要手动重连
          if (this.eventSource.readyState === EventSource.CLOSED) {
            this.handleSSEReconnect(dagId)
          }
        }
        
      } catch (error) {
        console.error('创建SSE连接失败:', error)
        this.sseConnectionStatus = 'error'
        this.handleSSEReconnect(dagId)
      }
    },

    // 处理SSE消息
    handleSSEMessage(data) {
      try {
        // 忽略心跳消息
        if (data.trim() === 'ping' || data.trim() === '') {
        return
      }
      
        // 解析状态数据 - 根据api.md格式
        let status, nodeId = null
        
        if (data.includes('running')) {
          // 格式: "running {nodeID}"
          const match = data.match(/running\s+(.+)/)
          status = 'running'
          nodeId = match ? match[1].trim() : null
        } else {
          // 其他状态: pending, completed, failed
          status = data.trim()
        }
        
        console.log('解析的状态:', { status, nodeId, originalData: data })
        
        // 构造状态数据对象
        const statusData = {
          dag_id: this.monitoringWorkflowId,
          status: status,
          current_node_id: nodeId,
          timestamp: new Date().toISOString()
        }
        
        // 更新状态
        this.updateWorkflowStatus(statusData)
        
        // 检查是否完成
        if (status === 'completed' || status === 'failed') {
          console.log('工作流执行完成，关闭SSE连接')
          this.stopSSEMonitoring()
          
          // 如果工作流完成，自动显示结果
          if (status === 'completed') {
            setTimeout(() => {
              this.onWorkflowCompleted(this.monitoringWorkflowId)
            }, 1000)
          }
        }
        
      } catch (error) {
        console.error('Failed to handle SSE message:', error, 'data:', data)
      }
    },

    // 处理SSE重连
    handleSSEReconnect(dagId) {
      if (this.sseReconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('达到最大重连次数，停止监控')
        this.stopSSEMonitoring()
        this.showError('连接失败次数过多，已停止监控')
        return
      }
      
      this.sseReconnectAttempts++
      console.log(`SSE重连尝试 ${this.sseReconnectAttempts}/${this.maxReconnectAttempts}`)
      
      setTimeout(() => {
        if (this.monitoringWorkflowId === dagId) {
          this.createSSEConnection(dagId)
        }
      }, this.reconnectDelay * this.sseReconnectAttempts) // 指数退避
    },

    // 重置心跳超时
    resetHeartbeatTimeout() {
      if (this.sseHeartbeatTimeout) {
        clearTimeout(this.sseHeartbeatTimeout)
      }
      
      // 40秒无消息则认为连接可能有问题（后端30秒发一次心跳）
      this.sseHeartbeatTimeout = setTimeout(() => {
        console.warn('SSE心跳超时，可能连接有问题')
        if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) {
          // 主动关闭连接以触发重连
          this.eventSource.close()
        }
      }, 40000)
    },

    // 更新工作流状态
    updateWorkflowStatus(statusData) {
      // 更新当前监控的工作流状态
      this.currentWorkflowStatus = statusData
      this.workflowStatus = statusData.status || 'Running'
      
      // 更新当前运行节点的状态（SSE格式）
      if (statusData.current_node_id && statusData.status === 'running') {
        const node = this.workflowNodes.find(n => n.id === statusData.current_node_id)
        if (node) {
          node.status = 'running'
        }
        
        // 将之前的节点标记为已完成
        this.workflowNodes.forEach(n => {
          if (n.id !== statusData.current_node_id && n.status === 'running') {
            n.status = 'completed'
          }
        })
      }
      
      // 如果工作流完成或失败，更新所有节点状态
      if (statusData.status === 'completed') {
        this.workflowNodes.forEach(n => {
          if (n.status === 'running') {
            n.status = 'completed'
          }
        })
      } else if (statusData.status === 'failed') {
        this.workflowNodes.forEach(n => {
          if (n.status === 'running') {
            n.status = 'failed'
          }
        })
      }
      
      // 兼容处理：如果是旧格式的数据（有nodes数组）
      if (statusData.nodes && Array.isArray(statusData.nodes)) {
        statusData.nodes.forEach(nodeStatus => {
          const node = this.workflowNodes.find(n => n.id === nodeStatus.node_id)
          if (node) {
            node.status = nodeStatus.status
          }
        })
      }
      
      // 更新工作流列表中的状态
      this.updateStatusDisplay(statusData)
    },

    // 停止SSE监控
    stopSSEMonitoring() {
      // 关闭EventSource连接
      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }
      
      // 清除心跳超时
      if (this.sseHeartbeatTimeout) {
        clearTimeout(this.sseHeartbeatTimeout)
        this.sseHeartbeatTimeout = null
      }
      
      this.sseConnectionStatus = 'stopped'
      console.log('SSE监控已停止')
    },

    // 获取连接状态文本
    getConnectionStatusText(status) {
      const statusMap = {
        'stopped': '未连接',
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

      // 兼容处理：如果是旧格式的数据（有node_id和node_status）
      if (statusData.node_id && statusData.node_status) {
        const node = this.workflowNodes.find(n => n.id === statusData.node_id)
        if (node) {
          node.status = statusData.node_status
        }
      }
      
      // SSE格式：如果有当前节点ID
      if (statusData.current_node_id && statusData.status === 'running') {
        const node = this.workflowNodes.find(n => n.id === statusData.current_node_id)
        if (node) {
          node.status = 'running'
        }
      }
    },

    // 工具方法
    getStatusLabel(status) {
      const labels = {
        running: this.$t('aiAgent.workflow.statusValues.running', 'Running'),
        completed: this.$t('aiAgent.workflow.statusValues.completed', 'Completed'),
        failed: this.$t('aiAgent.workflow.statusValues.failed', 'Failed'),
        pending: this.$t('aiAgent.workflow.statusValues.pending', 'Pending')
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
      this.stopSSEMonitoring()
      this.monitoringWorkflowId = null
      this.currentWorkflowStatus = null
    },

    // 刷新工作流状态 - 重新建立SSE连接
    async refreshWorkflowStatus() {
      if (!this.monitoringWorkflowId) return
      
      try {
        // 重新建立SSE连接来获取最新状态
        this.stopSSEMonitoring()
        await new Promise(resolve => setTimeout(resolve, 500)) // 短暂延迟
        this.startSSEMonitoring(this.monitoringWorkflowId)
        
        this.showSuccess('正在重新连接获取最新状态...')
      } catch (error) {
        console.error('刷新工作流状态失败:', error)
        this.showError(this.$t('aiAgent.workflow.workflowManagement.refreshStatusFailed', '刷新状态失败') + ': ' + error.message)
      }
    },

    // 关闭结果查看器
    closeResultsViewer() {
      this.showResultsViewer = false
      this.workflowResults = null
      this.selectedMessageType = 'all'
      this.finalOutputData = null
      this.finalOutputNode = null
      this.focusOnFinalOutput = false
      this.logsExpanded = false
    },

    // 切换日志展开状态
    toggleLogsExpanded() {
      this.logsExpanded = !this.logsExpanded
    },

    // 处理图片加载错误
    handleImageError(event) {
      console.error('Image loading failed:', event)
      event.target.alt = 'Image loading failed'
      event.target.style.display = 'none'
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">🖼️</div>
        <div class="error-text">Image loading failed</div>
      `
      event.target.parentNode.appendChild(errorDiv)
    },

    // 处理音频加载错误
    handleAudioError(event) {
      console.error('Audio loading failed:', event)
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">🎵</div>
        <div class="error-text">Audio loading failed</div>
      `
      event.target.parentNode.appendChild(errorDiv)
    },

    // 处理视频加载错误
    handleVideoError(event) {
      console.error('Video loading failed:', event)
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">📹</div>
        <div class="error-text">Video loading failed</div>
      `
      event.target.parentNode.appendChild(errorDiv)
    },

    // 刷新工作流结果
    async refreshWorkflowResults() {
      if (!this.monitoringWorkflowId) return
      
      try {
        // 获取最终输出节点的结果
        const finalNode = this.identifyFinalOutputNode()
        if (finalNode) {
          const response = await fetch(AI_AGENT_API.RESULT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dag_id: this.monitoringWorkflowId,
              tenant_id: this.getTenantId(),
              node_id: finalNode.id
            })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          this.workflowResults = await response.json()
        } else {
          this.showWarning('Final output node not found')
          return
        }
        
        this.showSuccess('Results refreshed successfully')
      } catch (error) {
        console.error('Failed to refresh workflow results:', error)
        this.showError('Failed to refresh results: ' + error.message)
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
        
        this.showSuccess('Results exported successfully')
      } catch (error) {
        console.error('Failed to export results:', error)
        this.showError('Export failed: ' + error.message)
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
        return `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
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
    },

    // 获取端口类型标签
    getPortTypeLabel(type) {
      const labels = {
        'text': this.$t('aiAgent.workflow.portTypes.text', '文本'),
        'image': this.$t('aiAgent.workflow.portTypes.image', '图片'),
        'audio': this.$t('aiAgent.workflow.portTypes.audio', '音频'),
        'file': this.$t('aiAgent.workflow.portTypes.file', '文件'),
        'json': this.$t('aiAgent.workflow.portTypes.json', 'JSON')
      }
      return labels[type] || type
    },

    // 处理图片上传
    async handleImageUpload(event, input, index) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        this.showError('只支持图片格式的文件')
        return
      }
      
      // 验证文件大小（10MB限制）
      if (file.size > 10 * 1024 * 1024) {
        this.showError('图片大小不能超过10MB')
        return
      }
      
      try {
        // 将所有图片格式统一转换为JPEG
        const jpegData = await this.convertImageToJPEG(file)
        
        input.value = jpegData.previewUrl // 用于预览显示
        input.fileName = this.changeFileExtensionToJPEG(file.name) // 更改文件名扩展名为.jpg
        input.fileSize = jpegData.size
        input.fileType = 'image/jpeg' // 统一设置为JPEG
        input.fileData = jpegData.base64 // 存储JPEG格式的base64数据
        
        this.showSuccess(`图片已转换为JPEG格式 (${Math.round(jpegData.size / 1024)}KB)`)
        
      } catch (error) {
        console.error('图片上传失败:', error)
        this.showError('图片上传失败: ' + error.message)
      }
    },

    // 处理音频上传
    async handleAudioUpload(event, input, index) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('audio/')) {
        this.showError('只支持音频格式的文件')
        return
      }
      
      // 验证文件大小（50MB限制）
      if (file.size > 50 * 1024 * 1024) {
        this.showError('音频大小不能超过50MB')
        return
      }
      
      try {
        // 将文件转换为base64用于预览和上传
        const reader = new FileReader()
        reader.onload = (e) => {
          input.value = e.target.result // 用于预览播放
          input.fileName = file.name
          input.fileSize = file.size
          
          // 对于STT服务，统一设置为audio/wav格式
          // 其他情况保持原格式
          input.fileType = 'audio/wav' // 与后端STT服务期望的Content-Type一致
          input.fileData = e.target.result // 存储完整的base64数据用于后续上传
          
          console.log(`音频文件已处理: ${file.name} (${Math.round(file.size / 1024)}KB) -> audio/wav`)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('音频上传失败:', error)
        this.showError('音频上传失败: ' + error.message)
      }
    },

    // 处理文件上传
    async handleFileUpload(event, input, index) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件大小（100MB限制）
      if (file.size > 100 * 1024 * 1024) {
        this.showError('文件大小不能超过100MB')
        return
      }
      
      try {
        // 将文件转换为base64用于上传
        const reader = new FileReader()
        reader.onload = (e) => {
          input.value = file.name // 显示文件名
          input.fileName = file.name
          input.fileSize = file.size
          input.fileType = file.type
          input.fileData = e.target.result // 存储完整的base64数据用于后续上传
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('文件上传失败:', error)
        this.showError('文件上传失败: ' + error.message)
      }
    },

    // 将图片转换为JPEG格式
    async convertImageToJPEG(file, quality = 0.8) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        img.onload = () => {
          try {
            // 设置画布尺寸与图片相同
            canvas.width = img.width
            canvas.height = img.height
            
            // 如果原图很大，适当缩放以优化性能和文件大小
            const maxWidth = 2048 // 最大宽度
            const maxHeight = 2048 // 最大高度
            
            let { width, height } = img
            
            // 计算缩放比例
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height)
              width = Math.round(width * ratio)
              height = Math.round(height * ratio)
              canvas.width = width
              canvas.height = height
            }
            
            // 填充白色背景（JPEG不支持透明度）
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // 绘制图片到画布
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            
            // 转换为JPEG格式的base64
            const jpegBase64 = canvas.toDataURL('image/jpeg', quality)
            
            // 计算转换后的文件大小
            const base64Data = jpegBase64.split(',')[1]
            const binaryString = atob(base64Data)
            const size = binaryString.length
            
            resolve({
              base64: jpegBase64,
              previewUrl: jpegBase64,
              size: size,
              width: canvas.width,
              height: canvas.height,
              compressed: size < file.size,
              compressionRatio: file.size > 0 ? (1 - size / file.size) : 0
            })
            
          } catch (error) {
            reject(new Error('图片转换失败: ' + error.message))
          }
        }
        
        img.onerror = () => {
          reject(new Error('Image loading failed, please check file format'))
        }
        
        // 加载图片
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
        }
        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }
        reader.readAsDataURL(file)
      })
    },

    // 更改文件名扩展名为JPEG
    changeFileExtensionToJPEG(fileName) {
      if (!fileName) return 'image.jpg'
      
      // 移除现有扩展名并添加.jpg
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
      return nameWithoutExt + '.jpg'
    },

    // 移除图片
    removeImage(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
      input.fileData = null
    },

    // 移除音频
    removeAudio(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
      input.fileData = null
    },

    // 移除文件
    removeFile(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
      input.fileData = null
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
  position: relative;
  z-index: 1;
}

/* Left sidebar */
.sidebar {
  width: 80px;
  background: rgba(45, 45, 45, 0.3);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(64, 64, 64, 0.4);
  overflow-y: auto;
  overflow-x: visible;
  position: relative;
  z-index: 2;
}

.nav-tabs {
  padding: 1rem 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  z-index: 2;
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
  top: 0.3rem;
  right: 0.3rem;
  color: #ff6b6b;
  font-size: 0.8rem;
}

.tab-icon {
  font-size: 1.8rem;
  min-width: 30px;
  transition: transform 0.2s ease;
}

.nav-tab:hover .tab-icon {
  transform: scale(1.1);
}

/* Global tooltip styles - 可爱气泡设计（顶层显示）*/
.global-tooltip {
  position: fixed !important;
  transform: translateY(-50%) scale(0.8);
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%) !important;
  backdrop-filter: blur(15px) !important;
  color: #ffffff !important;
  padding: 1rem 1.25rem !important;
  border-radius: 20px !important;
  font-size: 0.9rem !important;
  white-space: nowrap !important;
  box-shadow: 
    0 8px 32px rgba(78, 205, 196, 0.3),
    0 4px 16px rgba(255, 107, 107, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  z-index: 2147483647 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  pointer-events: none !important;
  min-width: 200px !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

.global-tooltip.active {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(-50%) scale(1) !important;
  animation: bubble-bounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), glow-pulse 2s ease-in-out infinite !important;
}

.global-tooltip::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #ff6b6b;
  filter: drop-shadow(-2px 0 4px rgba(255, 107, 107, 0.3));
}

.global-tooltip::after {
  content: '✨';
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 0.8rem;
  animation: sparkle 2s ease-in-out infinite;
}

.global-tooltip .tooltip-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.global-tooltip .tooltip-title::before {
  content: '⭐';
  font-size: 0.8rem;
}

.global-tooltip .tooltip-description {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-tooltip::after {
    display: none;
  }
  
  .global-tooltip {
    font-size: 0.8rem !important;
    padding: 0.75rem 1rem !important;
    min-width: 150px !important;
  }
}


/* 可爱的动画效果 */
@keyframes sparkle {
  0%, 100% { 
    transform: scale(1) rotate(0deg); 
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.2) rotate(180deg); 
    opacity: 1;
  }
}

@keyframes bubble-bounce {
  0% { 
    transform: translateY(-50%) scale(0.8); 
    opacity: 0;
  }
  50% { 
    transform: translateY(-50%) scale(1.1); 
    opacity: 0.8;
  }
  100% { 
    transform: translateY(-50%) scale(1); 
    opacity: 1;
  }
}

@keyframes glow-pulse {
  0%, 100% { 
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 8px 32px rgba(78, 205, 196, 0.3),
      0 4px 16px rgba(255, 107, 107, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% { 
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 
      0 12px 40px rgba(78, 205, 196, 0.5),
      0 6px 20px rgba(255, 107, 107, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
}

.tooltip-title {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #ffffff;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tooltip-title::before {
  content: '🌟';
  font-size: 0.9rem;
  animation: sparkle 2s ease-in-out infinite;
}

.tooltip-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.tab-indicator {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 6px;
  height: 6px;
  background: #4ecdc4;
  border-radius: 50%;
}

/* Right editing area */
.editor-area {
  flex: 1;
  overflow-y: auto;
  background: #1a1a1a;
  position: relative;
  z-index: 5;
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

.workflow-node.message-node {
  border-color: #ff6b6b;
}



.workflow-node.api-node {
  border-color: #a8e6cf;
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
  width: 320px;
  background: rgba(45, 45, 45, 0.4);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(64, 64, 64, 0.4);
  padding: 1rem;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  height: calc(100vh - 80px);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* 自定义滚动条样式 */
.workflow-sidebar::-webkit-scrollbar {
  width: 8px;
}

.workflow-sidebar::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 4px;
}

.workflow-sidebar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.workflow-sidebar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #26d0ce, #3ba99c);
  box-shadow: 0 0 8px rgba(78, 205, 196, 0.4);
}

.node-palette h4 {
  margin: 0 0 1.5rem 0;
  color: #4ecdc4;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  border-bottom: 3px solid #4ecdc4;
  padding-bottom: 0.75rem;
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(78, 205, 196, 0.3);
}

.palette-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-category {
  background: linear-gradient(135deg, rgba(50, 50, 50, 0.3), rgba(42, 42, 42, 0.3));
  backdrop-filter: blur(3px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(64, 64, 64, 0.3);
  border-left: 4px solid #ff6b6b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.palette-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border-left-color: #4ecdc4;
}

.category-title {
  margin: 0 0 1rem 0;
  color: #ff6b6b;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-title::before {
  content: "✦";
  color: #4ecdc4;
  font-size: 1.2rem;
}

.palette-nodes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.palette-node {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(64, 64, 64, 0.3), rgba(74, 74, 74, 0.3));
  backdrop-filter: blur(3px);
  border: 2px solid rgba(85, 85, 85, 0.3);
  border-radius: 10px;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.palette-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(78, 205, 196, 0.1) 50%, transparent 51%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.palette-node:hover {
  background: linear-gradient(135deg, rgba(74, 74, 74, 0.5), rgba(85, 85, 85, 0.5));
  border-color: #4ecdc4;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
}

.palette-node:hover::before {
  opacity: 1;
}

.palette-node:active {
  cursor: grabbing;
  transform: translateY(-1px) scale(0.98);
}

.palette-node .node-icon {
  font-size: 1.4rem;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.4);
  transition: all 0.3s ease;
}

.palette-node:hover .node-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.6);
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.node-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #e0e0e0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.node-desc {
  font-size: 0.7rem;
  color: #b0b0b0;
  line-height: 1.3;
  font-weight: 400;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

/* 画布容器 */
.workflow-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  margin: 0;
  padding: 0;
  min-width: 800px;
  min-height: 600px;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #2d2d2d, #323232);
  border-bottom: 1px solid #404040;
  min-height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.canvas-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 450px;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
  min-height: 40px;
  flex-shrink: 0;
}

/* 紧凑版缩放控件 */
.zoom-controls-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #323232, #2a2a2a);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.zoom-controls-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(78, 205, 196, 0.5);
}

.zoom-btn-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(78, 205, 196, 0.4);
}

.zoom-btn-mini:hover:not(:disabled) {
  background: linear-gradient(135deg, #26d0ce, #3ba99c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.6);
}

.zoom-btn-mini:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.zoom-mini-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 28px;
  background: linear-gradient(135deg, #404040, #4a4a4a);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.zoom-mini-display:hover {
  background: linear-gradient(135deg, #4a4a4a, #555555);
  border-color: rgba(78, 205, 196, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
}

.zoom-mini-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: #4ecdc4;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(78, 205, 196, 0.15);
  color: #4ecdc4;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(78, 205, 196, 0.3);
}

.zoom-btn:hover:not(:disabled) {
  background: rgba(78, 205, 196, 0.25);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.zoom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.zoom-slider-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
}

.zoom-slider {
  width: 100%;
  height: 3px;
  background: rgba(78, 205, 196, 0.2);
  border-radius: 1.5px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: all 0.2s ease;
}

.zoom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(78, 205, 196, 0.4);
  transition: all 0.2s ease;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.6);
}

.zoom-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 4px rgba(78, 205, 196, 0.4);
}

.zoom-level-display {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-percentage {
  font-size: 12px;
  font-weight: 700;
  color: #4ecdc4;
  background: rgba(78, 205, 196, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  min-width: 48px;
  text-align: center;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.3px;
}

.zoom-scale-marks {
  position: absolute;
  top: -6px;
  left: 0;
  right: 0;
  height: 2px;
  pointer-events: none;
}

.scale-mark {
  position: absolute;
  width: 1.5px;
  height: 1.5px;
  background: rgba(78, 205, 196, 0.4);
  border-radius: 50%;
  transform: translateX(-0.75px);
  transition: all 0.2s ease;
}

.scale-mark.active {
  background: #4ecdc4;
  width: 3px;
  height: 3px;
  transform: translateX(-1.5px);
  box-shadow: 0 0 4px rgba(78, 205, 196, 0.8);
}

.zoom-actions {
  display: flex;
  gap: 4px;
}

.zoom-action-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border: none;
  border-radius: 6px;
  background: rgba(78, 205, 196, 0.1);
  color: #4ecdc4;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(78, 205, 196, 0.2);
}

.zoom-action-btn:hover {
  background: rgba(78, 205, 196, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(78, 205, 196, 0.3);
}

.zoom-action-btn span {
  font-size: 9px;
  font-weight: 600;
}

/* 紧凑版响应式设计 */
@media (max-width: 1200px) {
  .canvas-header {
    padding: 6px 12px;
    min-height: 44px;
  }
  
  .canvas-header h3 {
    font-size: 0.9rem;
    max-width: 150px;
  }
  
  .canvas-toolbar {
    gap: 6px;
  }
}

@media (max-width: 1024px) {
  .zoom-controls-compact {
    gap: 2px;
    padding: 2px 4px;
  }
  
  .zoom-btn-mini {
    width: 20px;
    height: 20px;
  }
  
  .zoom-mini-display {
    min-width: 32px;
    height: 20px;
  }
  
  .zoom-mini-text {
    font-size: 9px;
  }
  
  .action-btn-mini {
    width: 24px;
    height: 24px;
  }
  
  .canvas-actions-compact {
    gap: 3px;
  }
}

@media (max-width: 768px) {
  .zoom-controls {
    gap: 6px;
    padding: 6px 8px;
    border-radius: 12px;
  }
  
  .zoom-btn {
    width: 32px;
    height: 32px;
  }
  
  .zoom-slider-container {
    min-width: 100px;
  }
  
  .zoom-percentage {
    font-size: 12px;
    padding: 2px 8px;
    min-width: 45px;
  }
  
  .zoom-actions {
    display: none; /* 在小屏幕上隐藏快捷操作按钮 */
  }
}

/* 缩放控件动画效果 */
.zoom-controls {
  transition: all 0.3s ease;
}

.zoom-controls:hover {
  transform: translateY(-0.5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(78, 205, 196, 0.3);
}

/* 缩放滑块轨道高亮效果 */
.zoom-slider:hover {
  background: rgba(78, 205, 196, 0.3);
}

.zoom-slider:focus {
  background: rgba(78, 205, 196, 0.4);
}

/* 缩放百分比数字动画 */
.zoom-percentage {
  transition: all 0.2s ease;
}

.zoom-percentage:hover {
  transform: scale(1.05);
  background: rgba(78, 205, 196, 0.2);
  border-color: rgba(78, 205, 196, 0.5);
}

/* 紧凑版操作按钮 */
.canvas-actions-compact {
  display: flex;
  gap: 0.5rem;
}

.action-btn-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #404040, #4a4a4a);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(78, 205, 196, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.action-btn-mini:hover {
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  color: white;
  border-color: rgba(78, 205, 196, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

.action-btn-mini:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(78, 205, 196, 0.3);
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
    radial-gradient(circle at 1px 1px, rgba(78, 205, 196, 0.2) 1px, transparent 1px);
  background-size: 30px 30px;
  overflow: hidden;
  cursor: grab;
  transition: background-size 0.3s ease;
  min-width: 800px;
  min-height: 600px;
}

.workflow-canvas:hover {
  background-size: 25px 25px;
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
  padding: 0;
  overflow: visible;
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



.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 10px 10px 0 0;
  background: #404040;
  border-bottom: 1px solid #555555;
  margin: 0;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  left: 0;
  overflow: hidden;
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
  background: linear-gradient(135deg, #2d2d2d, #323232);
  border-top: 1px solid #404040;
  min-height: 70px;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.canvas-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #b0b0b0;
  white-space: nowrap;
  flex-shrink: 0;
}

.canvas-stats span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(69, 183, 170, 0.1));
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.canvas-stats span:hover {
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(69, 183, 170, 0.2));
  border-color: rgba(78, 205, 196, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
}

.canvas-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.canvas-controls .btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.canvas-controls .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.canvas-controls .btn-outline {
  background: linear-gradient(135deg, #404040, #4a4a4a);
  color: #e0e0e0;
  border: 1px solid #555555;
}

.canvas-controls .btn-outline:hover {
  background: linear-gradient(135deg, #4a4a4a, #555555);
  border-color: #4ecdc4;
}

.canvas-controls .btn-secondary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.canvas-controls .btn-secondary:hover {
  background: linear-gradient(135deg, #5a67d8, #6b4190);
}

.canvas-controls .btn-success {
  background: linear-gradient(135deg, #4ecdc4, #45b7aa);
  color: white;
}

.canvas-controls .btn-success:hover {
  background: linear-gradient(135deg, #26d0ce, #3ba99c);
}

.canvas-controls .btn-primary {
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  color: white;
}

.canvas-controls .btn-primary:hover {
  background: linear-gradient(135deg, #ff5252, #ff3d3d);
}

.canvas-controls .btn .icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.canvas-controls .btn:hover .icon {
  transform: scale(1.1);
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .canvas-footer {
    flex-wrap: wrap;
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  
  .canvas-stats {
    gap: 1rem;
    font-size: 0.75rem;
  }
  
  .canvas-controls {
    gap: 0.3rem;
  }
  
  .canvas-controls .btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .canvas-footer {
    flex-direction: column;
    align-items: stretch;
  gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .canvas-stats {
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.7rem;
  }
  
  .canvas-controls {
    justify-content: center;
    gap: 0.25rem;
  }
  
  .canvas-controls .btn {
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.4rem;
    font-size: 0.7rem;
  }
}

/* 右侧配置面板 */
.workflow-config-panel {
  width: 380px;
  background: rgba(45, 45, 45, 0.4);
  backdrop-filter: blur(5px);
  border-left: 1px solid rgba(64, 64, 64, 0.4);
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.2);
  position: relative;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: rgba(64, 64, 64, 0.3);
  backdrop-filter: blur(3px);
  border-bottom: 1px solid rgba(85, 85, 85, 0.3);
}

.config-header h4 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 600;
}

.config-content {
  flex: 1;
  padding: 1.75rem;
  overflow-y: auto;
  font-size: 1rem;
  background: rgba(45, 45, 45, 0.7);
  backdrop-filter: blur(3px);
}

.config-section {
  margin-bottom: 1.75rem;
}

.config-section label {
  display: block;
  margin-bottom: 0.75rem;
  color: #e0e0e0;
  font-weight: 600;
  font-size: 1rem;
}

.config-section .form-input,
.config-section .form-textarea,
.config-section .form-select {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #555555;
  border-radius: 6px;
  font-size: 1rem;
  background: #404040;
  color: #e0e0e0;
  line-height: 1.5;
}

.config-section .form-input:focus,
.config-section .form-textarea:focus,
.config-section .form-select:focus {
  outline: none;
  border-color: #4ecdc4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
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
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;
  min-width: 0;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}

.config-actions .btn-icon {
  font-size: 1rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  display: inline-block;
}

.config-actions .btn:hover {
  transform: translateY(-2px);
}

.config-actions .btn:hover .btn-icon {
  transform: scale(1.2) rotate(-5deg);
}

.config-actions .btn:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

.config-actions .btn-save {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  position: relative;
  overflow: hidden;
}

.config-actions .btn-save::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.config-actions .btn-save:hover::before {
  left: 100%;
}

.config-actions .btn-save:hover {
  background: linear-gradient(45deg, #ff5252, #26d0ce);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  transform: translateY(-2px);
}

.config-actions .btn-validate {
  background: linear-gradient(45deg, #4ecdc4, #ff6b6b);
  color: white;
  position: relative;
  overflow: hidden;
}

.config-actions .btn-validate::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.config-actions .btn-validate:hover::before {
  left: 100%;
}

.config-actions .btn-validate:hover {
  background: linear-gradient(45deg, #26d0ce, #ff5252);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
  transform: translateY(-2px);
}

.config-actions .btn-danger {
  background: linear-gradient(45deg, #ff6b6b, #e53e3e);
  color: white;
  position: relative;
  overflow: hidden;
}

.config-actions .btn-danger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.config-actions .btn-danger:hover::before {
  left: 100%;
}

.config-actions .btn-danger:hover {
  background: linear-gradient(45deg, #e53e3e, #c53030);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-actions {
    padding: 0.75rem 1rem;
    gap: 0.4rem;
  }
  
  .config-actions .btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }
  
  .config-actions .btn-icon {
    font-size: 0.9rem;
  }
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

/* 响应式设计优化 */
@media (max-width: 1400px) {
  .workflow-sidebar {
    width: 280px;
  }
  
  .workflow-config-panel {
    width: 340px;
  }
}

@media (max-width: 1200px) {
  .workflow-sidebar {
    width: 260px;
  }
  
  .workflow-config-panel {
    width: 300px;
  }
  
  .palette-node {
    padding: 0.6rem 0.8rem;
  }
  
  .palette-node .node-icon {
    font-size: 1.25rem;
    min-width: 28px;
    height: 28px;
  }
  
  .node-name {
    font-size: 1rem;
    font-weight: 800;
  }
  
  .node-desc {
    font-size: 0.65rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
    max-width: 100%;
  }
  
  .config-content {
    padding: 1.25rem;
    font-size: 0.85rem;
  }
  
  .config-section {
    padding: 0.75rem;
  }
  
  .config-section label {
    font-size: 0.85rem;
  }
  
  .config-section .form-input,
  .config-section .form-textarea,
  .config-section .form-select {
    font-size: 0.85rem;
    padding: 0.6rem;
  }
}

@media (max-width: 768px) {
  .workflow-main {
    flex-direction: column;
  }
  
  .workflow-sidebar {
    width: 100%;
    height: 140px;
    border-right: none;
    border-bottom: 1px solid #404040;
  }
  
  .palette-nodes {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .palette-node {
    min-width: 120px;
    flex-direction: column;
    text-align: center;
    padding: 0.6rem 0.4rem;
  }
  
  .workflow-config-panel {
    width: 100%;
    height: auto;
    max-height: 300px;
    border-left: none;
    border-top: 1px solid #404040;
  }
  
  .config-header {
    padding: 1rem 1.25rem;
  }
  
  .config-header h4 {
    font-size: 1.1rem;
  }
  
  .config-content {
    padding: 1.25rem;
    font-size: 0.9rem;
  }
  
  .empty-config-state {
    padding: 1.5rem 1rem;
  }
  
  .empty-config-icon {
    font-size: 3.5rem;
  }
  
  .empty-config-state h4 {
    font-size: 1.25rem;
  }
  
  .empty-config-state p {
    font-size: 1rem;
  }
  
  .config-steps {
    padding: 1rem 1rem 1rem 2rem;
  }
  
  .config-steps li {
    font-size: 0.9rem;
  }
  
  .tip-item span:last-child {
    font-size: 0.9rem;
  }
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
    max-height: 80px;
  }
  
  .nav-tabs {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-tab {
    min-width: 60px;
    flex-shrink: 0;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 0.75rem 0;
  }
  
  .tab-tooltip {
    display: none !important;
  }
  
  .tooltip-title::before {
    display: none;
  }
  
  .tab-tooltip::after {
    display: none;
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

.connection-point.incompatible-highlight {
  background: #ff6b6b !important;
  border-color: #ffffff !important;
  box-shadow: 
    0 0 0 3px rgba(255, 107, 107, 0.4),
    0 0 15px rgba(255, 107, 107, 0.6);
  transform: scale(1.1);
  opacity: 0.7;
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
  column-count: 3;
  column-gap: 20px;
  column-fill: balance;
}

@media (max-width: 1400px) {
  .workflow-grid {
    column-count: 2;
    column-gap: 16px;
  }
}

@media (max-width: 768px) {
  .workflow-grid {
    column-count: 1;
    column-gap: 0;
  }
  
  .workflow-card {
    margin-bottom: 16px;
  }
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
  break-inside: avoid;
  margin-bottom: 20px;
  width: 100%;
  display: inline-block;
}

.workflow-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
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

.workflow-description {
  font-size: 14px;
  color: #b0b0b0;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.workflow-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.tag {
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.3);
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



.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #404040;
  color: #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
}

.tag-remove {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.tag-remove:hover {
  background: rgba(255, 107, 107, 0.2);
}

.save-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #ff6b6b;
}

.checkbox-text {
  color: #e0e0e0;
  font-size: 0.95rem;
}

.btn-loading {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

/* ==================== 全屏输出模态样式 ==================== */
.fullscreen-output-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.fullscreen-content {
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid #404040;
}

.fullscreen-header {
  background: linear-gradient(135deg, #2a2a2a 0%, #323232 100%);
  padding: 20px 24px;
  border-bottom: 1px solid #404040;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fullscreen-header h3 {
  color: #e0e0e0;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.fullscreen-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.fullscreen-btn {
  background: #404040;
  color: #e0e0e0;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.fullscreen-btn:hover {
  background: #555555;
  transform: translateY(-1px);
}

.fullscreen-close {
  background: #ff4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.fullscreen-close:hover {
  background: #ff6666;
  transform: scale(1.05);
}

.fullscreen-body {
  flex: 1;
  padding: 24px;
  overflow: auto;
  background: #1a1a1a;
}

.fullscreen-footer {
  background: #2a2a2a;
  padding: 16px 24px;
  border-top: 1px solid #404040;
  text-align: center;
}

.output-info {
  color: #b0b0b0;
  font-size: 14px;
  font-family: 'Consolas', monospace;
}

.copy-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 10001;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 全屏模式下的内容样式优化 */
.fullscreen-body img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.fullscreen-body audio,
.fullscreen-body video {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.fullscreen-body pre {
  background: #0f0f0f;
  color: #e0e0e0;
  padding: 24px;
  border-radius: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  border: 1px solid #404040;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.fullscreen-markdown-container {
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  max-width: none;
}

.fullscreen-markdown-container h1,
.fullscreen-markdown-container h2,
.fullscreen-markdown-container h3 {
  color: #ffffff;
  margin-top: 32px;
  margin-bottom: 20px;
  border-bottom: 2px solid #404040;
  padding-bottom: 12px;
}

.fullscreen-markdown-container p {
  margin-bottom: 20px;
  text-align: justify;
}

.fullscreen-markdown-container a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.fullscreen-markdown-container a:hover {
  color: #ffffff;
  background: #667eea;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ==================== 最终输出样式 ==================== */
.final-output-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #323232 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid #404040;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.final-output-section.focused {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  transform: scale(1.02);
}

.final-output-section.focused::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(102, 126, 234, 0.1) 50%, transparent 51%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.final-output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.final-output-header h4 {
  color: #e0e0e0;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.output-node-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #404040;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #555555;
}

.node-type {
  color: #667eea;
  font-weight: 500;
  font-size: 14px;
}

.node-name {
  color: #b0b0b0;
  font-size: 14px;
}

.final-output-content {
  position: relative;
  z-index: 1;
}

.no-final-output {
  text-align: center;
  padding: 40px 20px;
  color: #b0b0b0;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px dashed #404040;
}

.no-final-output .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-final-output p {
  font-size: 18px;
  margin-bottom: 8px;
  color: #e0e0e0;
}

.no-final-output small {
  font-size: 14px;
  color: #808080;
}

.final-output-display {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #404040;
  margin-bottom: 20px;
}

.final-output-display.text pre,
.final-output-display.json pre {
  background: transparent;
  color: #e0e0e0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Markdown渲染样式 */
.markdown-container {
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-container h1,
.markdown-container h2,
.markdown-container h3,
.markdown-container h4,
.markdown-container h5,
.markdown-container h6 {
  color: #ffffff;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  border-bottom: 1px solid #404040;
  padding-bottom: 8px;
}

.markdown-container h1 {
  font-size: 24px;
}

.markdown-container h2 {
  font-size: 20px;
}

.markdown-container h3 {
  font-size: 16px;
}

.markdown-container p {
  margin-bottom: 16px;
  color: #e0e0e0;
}

.markdown-container ul,
.markdown-container ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.markdown-container li {
  margin-bottom: 8px;
}

.markdown-container blockquote {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #b0b0b0;
  font-style: italic;
  background: #2a2a2a;
  border-radius: 4px;
}

.markdown-container code {
  background: #404040;
  color: #98d982;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.markdown-container .code-block {
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.markdown-container .code-block code {
  background: transparent;
  color: #98d982;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 0;
}

.markdown-container table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  border: 1px solid #404040;
}

.markdown-container th,
.markdown-container td {
  border: 1px solid #404040;
  padding: 8px 12px;
  text-align: left;
}

.markdown-container th {
  background: #333333;
  font-weight: 600;
  color: #ffffff;
}

/* 🔗 常规模式下的链接样式 - 增强美观性和可用性 */
.markdown-container a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.markdown-container a:hover {
  color: #ffffff;
  background: #667eea;
  border-bottom-color: #667eea;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.markdown-container a:active {
  transform: translateY(0);
}

.markdown-container hr {
  border: none;
  border-top: 1px solid #404040;
  margin: 24px 0;
}

.markdown-container strong {
  color: #ffffff;
  font-weight: 600;
}

.markdown-container em {
  color: #b0b0b0;
  font-style: italic;
}

.final-output-display.json pre {
  color: #98d982;
}

.final-output-display.image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.final-output-display.image img:hover {
  transform: scale(1.05);
}

.final-output-display.audio audio {
  width: 100%;
  border-radius: 8px;
}

.final-output-display.video video {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.output-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b4190 100%);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 100%);
}

.action-btn.secondary:hover {
  background: linear-gradient(135deg, #5a5a5a 0%, #6a6a6a 100%);
}

.action-btn .icon {
  font-size: 16px;
}

.media-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #4a2c2c;
  border-radius: 8px;
  border: 1px solid #8b4444;
  color: #ff9999;
}

.media-error .error-icon {
  font-size: 24px;
}

/* 📊 执行摘要样式 */
.execution-summary-section {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #404040;
}

.execution-summary-section h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  text-align: center;
  padding: 16px;
  background: #323232;
  border-radius: 8px;
  border: 1px solid #404040;
}

.summary-label {
  color: #b0b0b0;
  font-size: 14px;
  margin-bottom: 8px;
}

.summary-value {
  color: #e0e0e0;
  font-size: 18px;
  font-weight: 600;
}

.summary-value.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  display: inline-block;
}

/* 🔄 节点执行详情样式 */
.node-execution-details {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #404040;
}

.node-execution-details h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 16px;
}

.execution-flow {
  overflow-x: auto;
  padding: 10px 0;
}

.nodes-flow {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: max-content;
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #323232;
  border-radius: 12px;
  border: 1px solid #404040;
  min-width: 120px;
  transition: all 0.2s ease;
}

.flow-node:hover {
  background: #3a3a3a;
  transform: translateY(-2px);
}

.flow-node.final-node {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.flow-node .node-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.flow-node .node-icon {
  font-size: 24px;
}

.flow-node .node-details {
  text-align: center;
}

.flow-node .node-name {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
}

.flow-node .node-type {
  color: #b0b0b0;
  font-size: 12px;
}

.flow-node .node-time {
  color: #808080;
  font-size: 11px;
}

.flow-arrow {
  font-size: 20px;
  color: #667eea;
  align-self: center;
}

/* 📋 完整日志样式 */
.full-logs-section {
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #404040;
  overflow: hidden;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #323232;
  border-bottom: 1px solid #404040;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logs-header:hover {
  background: #3a3a3a;
}

.logs-header h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin: 0;
}

.expand-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expand-btn:hover {
  background: #5a67d8;
}

.logs-content {
  padding: 20px;
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

/* 全屏输出模态窗口 */
.fullscreen-output-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
}

.fullscreen-content {
  background: #2a2a2a;
  border-radius: 16px;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  max-height: 800px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid #404040;
  display: flex;
  flex-direction: column;
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #404040;
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
}

.fullscreen-header h3 {
  color: #e0e0e0;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.fullscreen-close {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.fullscreen-close:hover {
  background: #404040;
}

.fullscreen-body {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.fullscreen-body img,
.fullscreen-body video {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.fullscreen-body audio {
  width: 100%;
  border-radius: 12px;
}

.fullscreen-body pre {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #404040;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* 全屏模式下的Markdown容器样式 */
.fullscreen-markdown-container {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #404040;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* 全屏模式下的Markdown元素样式 */
.fullscreen-markdown-container h1,
.fullscreen-markdown-container h2,
.fullscreen-markdown-container h3,
.fullscreen-markdown-container h4,
.fullscreen-markdown-container h5,
.fullscreen-markdown-container h6 {
  color: #ffffff;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  border-bottom: 1px solid #404040;
  padding-bottom: 8px;
}

.fullscreen-markdown-container h1 {
  font-size: 28px;
}

.fullscreen-markdown-container h2 {
  font-size: 24px;
}

.fullscreen-markdown-container h3 {
  font-size: 20px;
}

.fullscreen-markdown-container p {
  margin-bottom: 16px;
  color: #e0e0e0;
}

.fullscreen-markdown-container ul,
.fullscreen-markdown-container ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.fullscreen-markdown-container li {
  margin-bottom: 8px;
}

.fullscreen-markdown-container blockquote {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #b0b0b0;
  font-style: italic;
  background: #2a2a2a;
  border-radius: 4px;
  padding: 16px;
}

.fullscreen-markdown-container code {
  background: #404040;
  color: #98d982;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 15px;
}

.fullscreen-markdown-container .code-block {
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
}

.fullscreen-markdown-container .code-block code {
  background: transparent;
  color: #98d982;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 16px;
  line-height: 1.5;
  padding: 0;
}

.fullscreen-markdown-container table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
  border: 1px solid #404040;
}

.fullscreen-markdown-container th,
.fullscreen-markdown-container td {
  border: 1px solid #404040;
  padding: 12px 16px;
  text-align: left;
}

.fullscreen-markdown-container th {
  background: #333333;
  font-weight: 600;
  color: #ffffff;
}

/* 🔗 全屏模式下的链接样式 - 增强美观性和可用性 */
.fullscreen-markdown-container a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.fullscreen-markdown-container a:hover {
  color: #ffffff;
  background: #667eea;
  border-bottom-color: #667eea;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.fullscreen-markdown-container a:active {
  transform: translateY(0);
}

.fullscreen-markdown-container hr {
  border: none;
  border-top: 1px solid #404040;
  margin: 24px 0;
}

.fullscreen-markdown-container strong {
  color: #ffffff;
  font-weight: 600;
}

.fullscreen-markdown-container em {
  color: #b0b0b0;
  font-style: italic;
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

/* 端口数据配置样式 */
.input-data-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-data-item {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 1rem;
}

.input-data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.input-data-name {
  font-weight: 600;
  color: #e0e0e0;
}

.input-data-type {
  padding: 0.25rem 0.5rem;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
}

.input-control label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #ccc;
}

/* 文件上传样式 */
.file-input {
  display: none;
}

.upload-label {
  display: block;
  cursor: pointer;
  border: 2px dashed #666;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  background: #2d2d2d;
}

.upload-label:hover {
  border-color: #ff6b6b;
  background-color: #3a3a3a;
}

.upload-placeholder {
  text-align: center;
  color: #ccc;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #e0e0e0;
}

.upload-hint {
  font-size: 0.875rem;
  color: #999;
}

/* 图片上传样式 */
.image-upload-area {
  position: relative;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #666;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0 8px 0 8px;
}

.remove-image-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 音频上传样式 */
.audio-upload-area {
  position: relative;
}

.uploaded-audio {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 1rem;
}

.audio-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.audio-name {
  font-weight: 500;
  color: #e0e0e0;
}

.remove-audio-btn {
  background: #dc3545;
  border: none;
  color: white;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.remove-audio-btn:hover {
  background: #c82333;
}

.audio-preview {
  width: 100%;
  max-width: 300px;
  filter: invert(1);
  opacity: 0.8;
}

/* 文件上传样式 */
.file-upload-area {
  position: relative;
}

.uploaded-file {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 1rem;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-weight: 500;
  color: #e0e0e0;
}

.remove-file-btn {
  background: #dc3545;
  border: none;
  color: white;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: #c82333;
}

/* JSON输入样式 */
.json-textarea {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  resize: vertical;
  background: #2d2d2d;
  color: #e0e0e0;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  padding: 0.5rem;
}

.json-hint {
  color: #999;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* 空状态配置面板样式 */
.empty-config-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: #ccc;
}

.empty-config-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  color: #4ecdc4;
}

.empty-config-state h4 {
  color: #e0e0e0;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-config-state p {
  margin-bottom: 2rem;
  color: #b0b0b0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.config-steps {
  text-align: left;
  margin: 2rem 0;
  padding-left: 1.5rem;
  background: rgba(78, 205, 196, 0.05);
  border-radius: 8px;
  padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  border-left: 4px solid #4ecdc4;
}

.config-steps li {
  margin-bottom: 1rem;
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 1rem;
}

.config-steps li strong {
  color: #4ecdc4;
  font-weight: 600;
}

.config-tips {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #3a3a3a;
  border-radius: 12px;
  border: 1px solid #4a4a4a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  text-align: left;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  transition: background 0.2s ease;
}

.tip-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.tip-item span:last-child {
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .input-data-config {
    gap: 0.75rem;
  }
  
  .input-data-item {
    padding: 0.75rem;
  }
  
  .input-data-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .preview-image {
    max-height: 150px;
  }
  
  .upload-label {
    padding: 0.75rem;
  }
  
  .upload-icon {
    font-size: 1.5rem;
  }
  
  .empty-config-state {
    padding: 1.5rem;
  }
  
  .empty-config-icon {
    font-size: 3rem;
  }
  
  .config-steps {
    padding-left: 1rem;
  }
  
  .tip-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .tip-icon {
    align-self: flex-start;
  }
}
</style> 
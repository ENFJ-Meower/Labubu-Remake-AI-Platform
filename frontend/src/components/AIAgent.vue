<template>
  <div class="ai-agent-builder">
    <!-- Top toolbar -->
    <div class="top-toolbar">
      <div class="toolbar-left">
        <div class="agent-info">
          <div class="agent-meta">
            <h2 class="agent-name">{{ currentWorkflow.name || $t('aiAgent.workflow.statusValues.unnamed', 'Unnamed Workflow') }}</h2>
            <p class="agent-status">{{ getWorkflowStatus() }}</p>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="saveWorkflow">
          <i class="icon">💾</i> {{ $t('aiAgent.workflow.toolbar.saveWorkflow', 'Save Workflow') }}
        </button>
                  <button class="btn btn-primary" @click="testWorkflow">
            <i class="icon">🧪</i> {{ $t('aiAgent.workflow.toolbar.testWorkflow', 'Test Workflow') }}
          </button>
          <button class="btn btn-success" @click="deployWorkflow">
            <i class="icon">🚀</i> {{ $t('aiAgent.workflow.toolbar.deployWorkflow', 'Deploy Workflow') }}
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
              <div class="tab-title">{{ getTabTitle(tab.id) }}</div>
              <div class="tab-description">{{ getTabDescription(tab.id) }}</div>
            </div>
            <div class="tab-indicator" v-if="tab.hasContent"></div>
          </div>
        </div>
      </div>

      <!-- Right editing area -->
      <div class="editor-area">
        <!-- DAG workflow editing -->
        <div v-if="activeTab === 'workflow'" class="editor-content workflow-container">
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
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'condition')">
                        <div class="node-icon">❓</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.conditionNode', 'Condition') }}</span>
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
                          <span class="node-name">{{ $t('aiAgent.workflow.llmNode', 'LLM') }}</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.llmDesc', '大语言模型') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'STT')">
                        <div class="node-icon">🎤</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.sttNode', 'STT') }}</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.sttDesc', '语音转文字') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'TTS')">
                        <div class="node-icon">🔊</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.ttsNode', 'TTS') }}</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.ttsDesc', '文字转语音') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'pic2text')">
                        <div class="node-icon">🖼️</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.pic2textNode', 'Pic2Text') }}</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.pic2textDesc', '图片转文字') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'text2pic')">
                        <div class="node-icon">🎨</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.text2picNode', 'Text2Pic') }}</span>
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
                          <span class="node-name">{{ $t('aiAgent.workflow.processNode', 'Process') }}</span>
                          <span class="node-desc">{{ $t('aiAgent.workflow.processDesc', '数据处理') }}</span>
                        </div>
                      </div>
                      <div class="palette-node" draggable="true" @dragstart="onDragStart($event, 'transform')">
                        <div class="node-icon">🔄</div>
                        <div class="node-info">
                          <span class="node-name">{{ $t('aiAgent.workflow.transformNode', 'Transform') }}</span>
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
                    <button class="action-btn-mini" @click="saveWorkflow" title="保存">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
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
            <!-- 空状态提示 -->
            <div class="workflow-config-panel" v-if="!selectedNode && !selectedConnection">
              <div class="config-header">
                <h4>{{ $t('aiAgent.workflow.configurationPanel', '配置面板') }}</h4>
              </div>
              
              <div class="config-content">
                <div class="empty-config-state">
                  <div class="empty-config-icon">⚙️</div>
                  <h4>{{ $t('aiAgent.workflow.selectNodeToConfig', '选择节点进行配置') }}</h4>
                  <p>{{ $t('aiAgent.workflow.configInstructions', '请按照以下步骤操作：') }}</p>
                  <ol class="config-steps">
                    <li>{{ $t('aiAgent.workflow.step1', '从左侧拖拽节点到画布') }}</li>
                    <li><strong>{{ $t('aiAgent.workflow.step2', '点击节点进行选择') }}</strong> - {{ $t('aiAgent.workflow.step2Detail', '点击节点本身，不是连接点') }}</li>
                    <li>{{ $t('aiAgent.workflow.step3', '在此处配置节点参数') }}</li>
                    <li><strong>{{ $t('aiAgent.workflow.step4', '设置输入数据（文字、图片等）') }}</strong> - {{ $t('aiAgent.workflow.step4Detail', '在下方"输入数据配置"中输入') }}</li>
                  </ol>
                  <div class="config-tips">
                    <div class="tip-item">
                      <span class="tip-icon">💡</span>
                      <span>{{ $t('aiAgent.workflow.tip1', 'LLM节点支持直接输入文字或上传图片') }}</span>
                    </div>
                    <div class="tip-item">
                      <span class="tip-icon">📝</span>
                      <span>{{ $t('aiAgent.workflow.tipInputLocation', '输入文字位置：选择节点后，向下滚动找到"输入数据配置"部分') }}</span>
                    </div>
                    <div class="tip-item">
                      <span class="tip-icon">🔗</span>
                      <span>{{ $t('aiAgent.workflow.tip2', '拖拽节点连接点可以创建数据流') }}</span>
                    </div>
                    <div class="tip-item">
                      <span class="tip-icon">⚡</span>
                      <span>{{ $t('aiAgent.workflow.tip3', '配置完成后可以测试和部署工作流') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 节点配置面板 -->
            <div class="workflow-config-panel" v-else-if="selectedNode">
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
                              <div class="upload-hint">{{ $t('aiAgent.workflow.supportedFormats', '支持 JPG、PNG、GIF 格式') }}</div>
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
                              <div class="upload-hint">{{ $t('aiAgent.workflow.audioFormats', '支持 MP3、WAV、OGG 格式') }}</div>
                            </div>
                            <div v-else class="uploaded-audio">
                              <div class="audio-info">
                                <span class="audio-name">{{ input.fileName || '音频文件' }}</span>
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
                <div class="workflow-meta">
                  <div class="meta-item">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.nodeCount', '节点数:') }}</span>
                    <span class="meta-value">{{ workflow.node_count || 0 }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">{{ $t('aiAgent.workflow.workflowManagement.createdAt', '创建时间:') }}</span>
                    <span class="meta-value">{{ formatDate(workflow.created_at) }}</span>
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

        <!-- Testing and deployment -->
        <div v-else-if="activeTab === 'deploy'" class="editor-content">
          <div class="section-header">
            <h3>{{ $t('aiAgent.workflow.testDeploy.title', 'Test & Deploy') }}</h3>
            <p>{{ $t('aiAgent.workflow.testDeploy.description', 'Test workflow functionality and deploy to production') }}</p>
          </div>
          
          <div class="deploy-sections">
            <div class="deploy-section">
                              <h4>🧪 {{ $t('aiAgent.workflow.testDeploy.workflowTesting', 'Workflow Testing') }}</h4>
                <div class="test-area">
                  <button class="btn btn-primary" @click="testWorkflow">{{ $t('aiAgent.workflow.testDeploy.testWorkflow', 'Test Workflow') }}</button>
                  <button class="btn btn-outline" @click="validateWorkflow">{{ $t('aiAgent.workflow.testDeploy.validateDAG', 'Validate DAG') }}</button>
                  <button class="btn btn-outline">{{ $t('aiAgent.workflow.testDeploy.performanceTest', 'Performance Test') }}</button>
              </div>
            </div>
            
            <div class="deploy-section">
                              <h4>🚀 {{ $t('aiAgent.workflow.testDeploy.deployment', 'Deployment') }}</h4>
                <div class="deploy-config">
                  <div class="form-group">
                    <label>{{ $t('aiAgent.workflow.testDeploy.deploymentEnvironment', 'Deployment Environment') }}</label>
                    <select class="form-select">
                      <option>{{ $t('aiAgent.workflow.environments.development', 'Development') }}</option>
                      <option>{{ $t('aiAgent.workflow.environments.testing', 'Testing') }}</option>
                      <option>{{ $t('aiAgent.workflow.environments.production', 'Production') }}</option>
                    </select>
                  </div>
                  <button class="btn btn-success" @click="deployWorkflow">{{ $t('aiAgent.workflow.testDeploy.deployWorkflow', 'Deploy Workflow') }}</button>
              </div>
            </div>
          </div>
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
          <h3>📋 工作流执行结果 - {{ currentWorkflow.name || monitoringWorkflowId }}</h3>
          <button class="close-btn" @click="closeResultsViewer">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 🎯 最终输出区域 -->
          <div class="final-output-section" :class="{ 'focused': focusOnFinalOutput }">
            <div class="final-output-header">
              <h4>🎯 最终输出</h4>
              <div class="output-node-info" v-if="finalOutputNode">
                <span class="node-type">{{ finalOutputNode.service || finalOutputNode.type }}</span>
                <span class="node-name">{{ finalOutputNode.name || finalOutputNode.id }}</span>
              </div>
            </div>
            
            <div class="final-output-content">
              <div v-if="!finalOutputData" class="no-final-output">
                <div class="empty-icon">🎯</div>
                <p>暂无最终输出结果</p>
                <small>工作流可能未完成或没有输出节点</small>
              </div>
              
              <div v-else class="final-output-display" :class="finalOutputData.type">
                <!-- 文本输出 -->
                <div v-if="finalOutputData.type === 'text'" class="output-text">
                  <pre>{{ finalOutputData.displayContent }}</pre>
                </div>
                
                <!-- JSON输出 -->
                <div v-else-if="finalOutputData.type === 'json'" class="output-json">
                  <pre>{{ finalOutputData.displayContent }}</pre>
                </div>
                
                <!-- 图片输出 -->
                <div v-else-if="finalOutputData.type === 'image'" class="output-image">
                  <img :src="finalOutputData.content" alt="输出图片" @error="handleImageError" />
                </div>
                
                <!-- 音频输出 -->
                <div v-else-if="finalOutputData.type === 'audio'" class="output-audio">
                  <audio controls :src="finalOutputData.content" @error="handleAudioError">
                    您的浏览器不支持音频播放
                  </audio>
                </div>
                
                <!-- 视频输出 -->
                <div v-else-if="finalOutputData.type === 'video'" class="output-video">
                  <video controls :src="finalOutputData.content" @error="handleVideoError">
                    您的浏览器不支持视频播放
                  </video>
                </div>
                
                <!-- 其他类型 -->
                <div v-else class="output-other">
                  <pre>{{ finalOutputData.displayContent }}</pre>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div v-if="finalOutputData" class="output-actions">
                <button class="action-btn primary" @click="copyFinalOutput" title="复制">
                  <i class="icon">📋</i> 复制
                </button>
                <button class="action-btn secondary" @click="downloadFinalOutput" title="下载">
                  <i class="icon">💾</i> 下载
                </button>
                <button class="action-btn secondary" @click="shareFinalOutput" title="分享">
                  <i class="icon">🔗</i> 分享
                </button>
                <button class="action-btn secondary" @click="viewFinalOutputFullscreen" title="全屏">
                  <i class="icon">⛶</i> 全屏
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
                <div class="summary-label">成功节点</div>
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
            <h4>🔄 节点执行详情</h4>
            <div class="execution-flow">
              <div v-if="!currentWorkflowStatus?.nodes || currentWorkflowStatus.nodes.length === 0" 
                   class="empty-nodes">
                <div class="empty-icon">🔄</div>
                <p>暂无节点执行详情</p>
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
              <h4>📋 完整日志</h4>
              <button class="expand-btn" :class="{ 'expanded': logsExpanded }">
                {{ logsExpanded ? '收起' : '展开' }}
              </button>
            </div>
            
            <div v-if="logsExpanded" class="logs-content">
              <!-- 消息筛选 -->
              <div class="messages-filters">
                <select v-model="selectedMessageType" class="filter-select">
                  <option value="all">所有消息</option>
                  <option value="input">输入消息</option>
                  <option value="output">输出消息</option>
                  <option value="error">错误消息</option>
                </select>
                <button class="btn btn-sm" @click="exportResults">导出日志</button>
              </div>
              
              <!-- 消息列表 -->
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
      currentWorkflow: {
        name: '',
        description: ''
      },
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
        },
        {
          id: 'deploy',
          icon: '🚀',
          title: 'Test & Deploy',
          description: 'Testing and deployment',
          hasContent: false
        }
      ],
      // 工作流相关数据
      workflowNodes: [],
      connections: [],
      selectedNode: null,
      
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
      workflowStatus: 'Ready', // 始终使用英文key，通过getTranslatedStatus方法进行翻译
      statusEventSource: null,
      
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
    getTabTitle(tabId) {
      const titleMap = {
        'workflow': this.$t('aiAgent.tabs.workflowDesign', 'Workflow Design'),
        'workflows': this.$t('aiAgent.tabs.workflowManagement', 'Workflow Management'),
        'deploy': this.$t('aiAgent.tabs.testDeploy', 'Test & Deploy')
      }
      return titleMap[tabId] || tabId
    },
    getTabDescription(tabId) {
      const descriptionMap = {
        'workflow': this.$t('aiAgent.tabs.workflowDesignDesc', 'Visual DAG workflow editor - Core feature'),
        'workflows': this.$t('aiAgent.tabs.workflowManagementDesc', 'View and manage all DAG workflows'),
        'deploy': this.$t('aiAgent.tabs.testDeployDesc', 'Testing and deployment')
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
    saveWorkflow() {
      // Save current workflow
      console.log('Save Workflow')
    },
    testWorkflow() {
      // Test workflow functionality
      console.log('Test Workflow')
    },
    deployWorkflow() {
      // Deploy workflow
      console.log('Deploy Workflow')
    },
    // Workflow methods
    getNodeIcon(nodeType) {
      const icons = {
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
        llm: 'LLM',
        process: 'Process',
        condition: 'Condition'
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
    createNode(nodeType, x, y) {
      const nodeId = `${nodeType}-${++this.nodeIdCounter}`
      const nodeTemplates = {
        condition: {
          title: this.$t('aiAgent.workflow.conditionNode', '条件'),
          description: this.$t('aiAgent.workflow.conditionDesc', '条件判断'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.input', '输入'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.true', '真'), type: 'text' }, { name: this.$t('aiAgent.workflow.ports.false', '假'), type: 'text' }],
          condition: '',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.condition', '根据输入内容进行条件判断，返回true或false。'),
          service: ''
        },
        LLM: {
          title: this.$t('aiAgent.workflow.llmNode', 'LLM'),
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
          title: this.$t('aiAgent.workflow.sttNode', 'STT'),
          description: this.$t('aiAgent.workflow.sttDesc', '语音转文字'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.audio', '音频'), type: 'audio', value: null }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text' }],
          service: 'STT',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.stt', '请将音频准确转换为文字，保持自然的句子结构和正确的标点符号。'),
          language: 'zh',
          model: 'whisper-1'
        },
        TTS: {
          title: this.$t('aiAgent.workflow.ttsNode', 'TTS'),
          description: this.$t('aiAgent.workflow.ttsDesc', '文字转语音'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.audio', '音频'), type: 'audio' }],
          service: 'TTS',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.tts', '请以自然、清晰的语调朗读文字，注意语速适中，语音自然。'),
          voice: 'alloy',
          speed: 1.0
        },
        pic2text: {
          title: this.$t('aiAgent.workflow.pic2textNode', '图片转文字'),
          description: this.$t('aiAgent.workflow.pic2textDesc', '图片转文字'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.image', '图片'), type: 'image', value: null }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.text', '文本'), type: 'text' }],
          service: 'pic2text',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.pic2text', '请识别图片中的所有文字内容，保持原有的排版结构，准确提取文字信息。'),
          language: 'zh',
          format: 'markdown'
        },
        text2pic: {
          title: this.$t('aiAgent.workflow.text2picNode', '文字转图片'),
          description: this.$t('aiAgent.workflow.text2picDesc', '文字转图片'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.prompt', '提示'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.image', '图片'), type: 'image' }],
          service: 'text2pic',
          prompt: this.$t('aiAgent.workflow.defaultPrompts.text2pic', '根据描述生成高质量图片，画面构图合理，色彩和谐，细节丰富。'),
          size: '1024x1024',
          style: 'natural'
        },

        process: {
          title: this.$t('aiAgent.workflow.processNode', '处理'),
          description: this.$t('aiAgent.workflow.processDesc', '数据处理'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.input', '输入'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.output', '输出'), type: 'text' }],
          prompt: this.$t('aiAgent.workflow.defaultPrompts.process', '对输入数据进行处理和分析，提取有用信息并整理输出。'),
          service: ''
        },
        transform: {
          title: this.$t('aiAgent.workflow.transformNode', '转换'),
          description: this.$t('aiAgent.workflow.transformDesc', '数据转换'),
          inputs: [{ name: this.$t('aiAgent.workflow.ports.input', '输入'), type: 'text', value: '' }],
          outputs: [{ name: this.$t('aiAgent.workflow.ports.output', '输出'), type: 'text' }],
          prompt: this.$t('aiAgent.workflow.defaultPrompts.transform', '将输入数据转换为指定格式，保持数据的完整性和准确性。'),
          service: ''
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
        if (sourcePortType === 'output') {
          // 输出端口可以连接到其他节点的输入端口
          const inputPoint = document.querySelector(`[data-node-id="${node.id}"] .input-point`)
          if (inputPoint) {
            inputPoint.classList.add('connectable-highlight')
          }
        } else if (sourcePortType === 'input') {
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

      document.removeEventListener('keyup', this.handleKeyUp)
      
      document.removeEventListener('click', this.cancelConnection)
      
      if (this.statusEventSource) {
        this.statusEventSource.close()
      }
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
      this.$message?.success?.(this.$t('aiAgent.workflow.configSaved', '节点配置已保存'))
    },
    validateNodeConfig() {
      if (!this.selectedNode) return false
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
        dag_id: workflowAPI.generateDAGId(this.currentWorkflow.name || 'workflow'),
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
          
          // 如果工作流完成，自动显示结果
          if (statusData.status === 'completed') {
            setTimeout(() => {
              this.onWorkflowCompleted(dagId)
            }, 1000) // 延迟1秒确保结果已保存
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
        this.monitoringWorkflowId = workflow.dag_id
        
        // 识别和处理最终输出
        await this.processFinalOutput(results)
        
        this.showResultsViewer = true
        
      } catch (error) {
        console.error('获取工作流结果失败:', error)
        this.$message?.error?.('获取工作流结果失败: ' + error.message)
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
        console.error('处理最终输出失败:', error)
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
        // 检查是否是图片URL
        if (output.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) || 
            output.startsWith('data:image/') || 
            output.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
          return 'image'
        }
        
        // 检查是否是音频URL
        if (output.match(/\.(mp3|wav|ogg|m4a)$/i) || 
            output.startsWith('data:audio/') ||
            output.match(/^https?:\/\/.*\.(mp3|wav|ogg|m4a)$/i)) {
          return 'audio'
        }
        
        // 检查是否是视频URL
        if (output.match(/\.(mp4|webm|avi|mov)$/i) || 
            output.startsWith('data:video/') ||
            output.match(/^https?:\/\/.*\.(mp4|webm|avi|mov)$/i)) {
          return 'video'
        }
        
        // 检查是否是JSON字符串
        try {
          JSON.parse(output)
          return 'json'
        } catch (e) {
          return 'text'
        }
      }
      
      if (typeof output === 'object') {
        return 'json'
      }
      
      return 'text'
    },

    // 格式化显示内容
    formatDisplayContent(content, type) {
      switch (type) {
        case 'json':
          return typeof content === 'string' ? content : JSON.stringify(content, null, 2)
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
        console.error('自动显示结果失败:', error)
      }
    },

    // ==================== 最终输出交互功能 ====================

    // 复制最终输出到剪贴板
    async copyFinalOutput() {
      if (!this.finalOutputData) {
        this.$message?.error?.('没有可复制的内容')
        return
      }

      try {
        const textContent = this.finalOutputData.type === 'json' 
          ? this.finalOutputData.displayContent 
          : this.finalOutputData.content

        await navigator.clipboard.writeText(textContent)
        this.$message?.success?.('内容已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        this.$message?.error?.('复制失败: ' + error.message)
      }
    },

    // 下载最终输出
    downloadFinalOutput() {
      if (!this.finalOutputData) {
        this.$message?.error?.('没有可下载的内容')
        return
      }

      try {
        const { type, content, displayContent } = this.finalOutputData
        const filename = `workflow_output_${this.monitoringWorkflowId}_${Date.now()}`
        
        if (type === 'image') {
          this.downloadFile(content, `${filename}.png`, 'image/png')
        } else if (type === 'audio') {
          this.downloadFile(content, `${filename}.mp3`, 'audio/mpeg')
        } else if (type === 'video') {
          this.downloadFile(content, `${filename}.mp4`, 'video/mp4')
        } else if (type === 'json') {
          this.downloadTextFile(displayContent, `${filename}.json`, 'application/json')
        } else {
          this.downloadTextFile(content, `${filename}.txt`, 'text/plain')
        }
        
        this.$message?.success?.('下载已开始')
      } catch (error) {
        console.error('下载失败:', error)
        this.$message?.error?.('下载失败: ' + error.message)
      }
    },

    // 分享最终输出
    async shareFinalOutput() {
      if (!this.finalOutputData) {
        this.$message?.error?.('没有可分享的内容')
        return
      }

      try {
        const shareData = {
          title: `工作流执行结果 - ${this.monitoringWorkflowId}`,
          text: `工作流执行结果：\n${this.finalOutputData.displayContent}`,
          url: window.location.href
        }

        if (navigator.share) {
          await navigator.share(shareData)
          this.$message?.success?.('分享成功')
        } else {
          // 降级方案：复制到剪贴板
          await navigator.clipboard.writeText(shareData.text)
          this.$message?.success?.('分享内容已复制到剪贴板')
        }
      } catch (error) {
        console.error('分享失败:', error)
        this.$message?.error?.('分享失败: ' + error.message)
      }
    },

    // 全屏查看最终输出
    viewFinalOutputFullscreen() {
      if (!this.finalOutputData) {
        this.$message?.error?.('没有可查看的内容')
        return
      }

      // 创建全屏模态窗口
      const modal = document.createElement('div')
      modal.className = 'fullscreen-output-modal'
      modal.innerHTML = `
        <div class="fullscreen-content">
          <div class="fullscreen-header">
            <h3>🎯 最终输出 - 全屏查看</h3>
            <button class="fullscreen-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
          </div>
          <div class="fullscreen-body">
            ${this.generateOutputHTML(this.finalOutputData)}
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      // 添加ESC键关闭功能
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          modal.remove()
          document.removeEventListener('keydown', handleEscape)
        }
      }
      document.addEventListener('keydown', handleEscape)
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
        default:
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
        this.$message?.error?.(this.$t('aiAgent.workflow.workflowManagement.refreshStatusFailed', '刷新状态失败') + ': ' + error.message)
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
      console.error('图片加载失败:', event)
      event.target.alt = '图片加载失败'
      event.target.style.display = 'none'
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">🖼️</div>
        <div class="error-text">图片加载失败</div>
      `
      event.target.parentNode.appendChild(errorDiv)
    },

    // 处理音频加载错误
    handleAudioError(event) {
      console.error('音频加载失败:', event)
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">🎵</div>
        <div class="error-text">音频加载失败</div>
      `
      event.target.parentNode.appendChild(errorDiv)
    },

    // 处理视频加载错误
    handleVideoError(event) {
      console.error('视频加载失败:', event)
      
      // 显示错误提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'media-error'
      errorDiv.innerHTML = `
        <div class="error-icon">📹</div>
        <div class="error-text">视频加载失败</div>
      `
      event.target.parentNode.appendChild(errorDiv)
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
        this.$message?.error?.('只支持图片格式的文件')
        return
      }
      
      // 验证文件大小（10MB限制）
      if (file.size > 10 * 1024 * 1024) {
        this.$message?.error?.('图片大小不能超过10MB')
        return
      }
      
      try {
        // 将文件转换为base64
        const reader = new FileReader()
        reader.onload = (e) => {
          input.value = e.target.result
          input.fileName = file.name
          input.fileSize = file.size
          input.fileType = file.type
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('图片上传失败:', error)
        this.$message?.error?.('图片上传失败: ' + error.message)
      }
    },

    // 处理音频上传
    async handleAudioUpload(event, input, index) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('audio/')) {
        this.$message?.error?.('只支持音频格式的文件')
        return
      }
      
      // 验证文件大小（50MB限制）
      if (file.size > 50 * 1024 * 1024) {
        this.$message?.error?.('音频大小不能超过50MB')
        return
      }
      
      try {
        // 将文件转换为base64
        const reader = new FileReader()
        reader.onload = (e) => {
          input.value = e.target.result
          input.fileName = file.name
          input.fileSize = file.size
          input.fileType = file.type
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('音频上传失败:', error)
        this.$message?.error?.('音频上传失败: ' + error.message)
      }
    },

    // 处理文件上传
    async handleFileUpload(event, input, index) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件大小（100MB限制）
      if (file.size > 100 * 1024 * 1024) {
        this.$message?.error?.('文件大小不能超过100MB')
        return
      }
      
      try {
        // 将文件转换为base64
        const reader = new FileReader()
        reader.onload = (e) => {
          input.value = e.target.result
          input.fileName = file.name
          input.fileSize = file.size
          input.fileType = file.type
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('文件上传失败:', error)
        this.$message?.error?.('文件上传失败: ' + error.message)
      }
    },

    // 移除图片
    removeImage(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
    },

    // 移除音频
    removeAudio(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
    },

    // 移除文件
    removeFile(input, index) {
      input.value = null
      input.fileName = null
      input.fileSize = null
      input.fileType = null
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
  width: 250px;
  background: #2d2d2d;
  border-right: 1px solid #404040;
  padding: 0.75rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.workflow-sidebar::-webkit-scrollbar {
  width: 6px;
}

.workflow-sidebar::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.workflow-sidebar::-webkit-scrollbar-thumb {
  background: #555555;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.workflow-sidebar::-webkit-scrollbar-thumb:hover {
  background: #666666;
}

.node-palette h4 {
  margin: 0 0 0.75rem 0;
  color: #4ecdc4;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #4ecdc4;
  padding-bottom: 0.4rem;
}

.palette-categories {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.palette-category {
  background: #323232;
  border-radius: 6px;
  padding: 0.5rem;
  border-left: 3px solid #ff6b6b;
}

.category-title {
  margin: 0 0 0.5rem 0;
  color: #ff6b6b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.palette-nodes {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.palette-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: #404040;
  border: 1px solid #555555;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
}

.palette-node:hover {
  background: #4a4a4a;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.palette-node:active {
  cursor: grabbing;
}

.palette-node .node-icon {
  font-size: 1rem;
  min-width: 24px;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.node-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e0e0e0;
}

.node-desc {
  font-size: 0.7rem;
  color: #b0b0b0;
  line-height: 1.1;
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
  padding: 8px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
  min-height: 48px;
}

.canvas-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  flex: 1;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  min-height: 32px;
  flex-shrink: 0;
}

/* 紧凑版缩放控件 */
.zoom-controls-compact {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(30, 35, 48, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 3px 6px;
  border: 1px solid rgba(78, 205, 196, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.zoom-btn-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: rgba(78, 205, 196, 0.1);
  color: #4ecdc4;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(78, 205, 196, 0.2);
}

.zoom-btn-mini:hover:not(:disabled) {
  background: rgba(78, 205, 196, 0.2);
  color: #ffffff;
  transform: translateY(-0.5px);
  box-shadow: 0 2px 6px rgba(78, 205, 196, 0.3);
}

.zoom-btn-mini:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.zoom-mini-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 22px;
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-mini-display:hover {
  background: rgba(78, 205, 196, 0.15);
  border-color: rgba(78, 205, 196, 0.3);
  transform: translateY(-0.5px);
}

.zoom-mini-text {
  font-size: 10px;
  font-weight: 700;
  color: #4ecdc4;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.2px;
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
  gap: 4px;
}

.action-btn-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(30, 35, 48, 0.8);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(78, 205, 196, 0.1);
  backdrop-filter: blur(5px);
}

.action-btn-mini:hover {
  background: rgba(78, 205, 196, 0.15);
  color: #4ecdc4;
  border-color: rgba(78, 205, 196, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.2);
}

.action-btn-mini:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(78, 205, 196, 0.2);
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
  margin: -2px -2px 0 -2px;
  position: relative;
  box-sizing: border-box;
  width: calc(100% + 4px);
  left: -2px;
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
  padding: 0.75rem 1rem;
  background: #2d2d2d;
  border-top: 1px solid #404040;
  min-height: 60px;
  flex-wrap: wrap;
  gap: 1rem;
}

.canvas-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: #b0b0b0;
  white-space: nowrap;
  flex-shrink: 0;
}

.canvas-stats span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.canvas-controls {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
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
  padding: 1.25rem 1.75rem;
  background: #404040;
  border-bottom: 1px solid #555555;
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

/* 响应式设计 */
@media (max-width: 1400px) {
  .workflow-config-panel {
    width: 320px;
  }
}

@media (max-width: 1200px) {
  .workflow-sidebar {
    width: 200px;
  }
  
  .workflow-config-panel {
    width: 280px;
  }
  
  .config-content {
    padding: 1.5rem;
    font-size: 0.95rem;
  }
  
  .config-section label {
    font-size: 0.95rem;
  }
  
  .config-section .form-input,
  .config-section .form-textarea,
  .config-section .form-select {
    font-size: 0.95rem;
    padding: 0.75rem;
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
    padding: 0.75rem 0.5rem;
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
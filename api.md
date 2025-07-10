# API配置与使用说明

## 📖 概述

本文档详细说明了Labubu AI平台的后端API接入配置和工作流系统的使用方法。

## 🔧 API配置

### 基础配置

API配置文件位于 `src/config/api.js`，包含以下核心配置：

```javascript
// API基础配置
const API_CONFIG = {
  baseURL: 'http://localhost:8080/api/v1',  // 后端API地址
  timeout: 30000,                          // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}
```

### 环境配置

根据部署环境修改API基础地址：

- **开发环境**: `http://localhost:8080/api/v1`
- **测试环境**: `https://test-api.labubu.com/api/v1`
- **生产环境**: `https://api.labubu.com/api/v1`

### 认证配置

系统支持以下认证方式：

1. **Bearer Token认证**（推荐）
2. **API Key认证**
3. **Basic认证**

```javascript
// 在localStorage中设置认证token
localStorage.setItem('authToken', 'your-jwt-token');

// 或设置API Key
localStorage.setItem('apiKey', 'your-api-key');
```

### 租户配置

系统需要配置租户ID，用于多租户数据隔离：

```javascript
// 设置用户信息（包含tenant_id）
const userInfo = {
  user_id: 'user123',
  tenant_id: 'tenant_abc',
  username: 'demo_user'
};
localStorage.setItem('userInfo', JSON.stringify(userInfo));
```

## 🚀 API端点说明

### 1. 提交DAG工作流

**接口**: `POST /submit`

**功能**: 提交完整的DAG工作流配置

**请求格式**:
```json
{
  "dag_id": "string",
  "tenant_id": "string", 
  "nodes": {
    "node_id1": {
      "prompt": "处理提示词",
      "service": "LLM"
    },
    "node_id2": {
      "prompt": "转换提示词", 
      "service": "STT"
    }
  },
  "edges": [
    {
      "from": "node_id1",
      "to": "node_id2", 
      "prompt": "连接提示词"
    }
  ]
}
```

**响应**:
```json
{
  "success": true,
  "dag_id": "generated_dag_id",
  "message": "DAG submitted successfully"
}
```

### 2. 通知就绪

**接口**: `POST /ready`

**功能**: 通知后端工作流已准备好执行

**请求格式**:
```json
{
  "dag_id": "string",
  "tenant_id": "string"
}
```

### 3. 获取DAG状态

**接口**: `GET /status/{dag_id}`

**功能**: 获取指定DAG的执行状态

**响应**:
```json
{
  "dag_id": "string",
  "status": "running|completed|failed|pending",
  "progress": 75,
  "current_node": "node_id2",
  "start_time": "2024-12-19T10:00:00Z",
  "end_time": null
}
```

### 4. 获取处理结果

**接口**: `GET /message`

**功能**: 获取工作流执行结果

**响应**:
```json
{
  "dag_id": "string",
  "results": {
    "node_id1": {
      "status": "completed",
      "output": "处理结果数据",
      "execution_time": 1.5
    }
  },
  "final_output": "最终结果"
}
```

### 5. 获取所有DAG

**接口**: `GET /AllDag/{tenantID}`

**功能**: 获取租户下所有DAG列表

**响应**:
```json
{
  "dags": [
    {
      "dag_id": "dag_001",
      "name": "文本处理工作流",
      "status": "completed",
      "created_at": "2024-12-19T10:00:00Z",
      "node_count": 5
    }
  ],
  "total": 1
}
```

### 6. SSE状态流

**接口**: `GET /status/stream/{dag_id}`

**功能**: 建立SSE连接，实时接收状态更新

**事件格式**:
```json
{
  "event": "status_update",
  "data": {
    "dag_id": "string",
    "status": "running",
    "node_id": "current_node",
    "node_status": "processing",
    "progress": 60,
    "timestamp": "2024-12-19T10:05:00Z"
  }
}
```

## 🎯 支持的服务类型

### 1. LLM (Large Language Model)

**用途**: 大语言模型文本处理

**配置参数**:
- `model`: 模型类型 (gpt-4, gpt-3.5-turbo, claude-3)
- `temperature`: 温度值 (0-2)
- `max_tokens`: 最大token数
- `prompt`: 处理提示词

**示例提示词**:
```
你是一个专业的文本分析师。请分析以下文本的情感倾向，并给出详细的理由。

输入文本：{input_text}

请按以下格式回复：
情感：[正面/负面/中性]
置信度：[0-100]
理由：[详细分析]
```

### 2. STT (Speech to Text)

**用途**: 语音转文字

**配置参数**:
- `language`: 语言代码 (zh, en, ja, ko)
- `model`: 识别模型 (whisper-1)
- `prompt`: 识别指导提示

**示例提示词**:
```
请将音频转换为文字，注意以下要求：
1. 保持原始语言的表达习惯
2. 正确识别专业术语
3. 标注不确定的词汇为 [?]
```

### 3. TTS (Text to Speech)

**用途**: 文字转语音

**配置参数**:
- `voice`: 语音类型 (alloy, echo, fable, onyx, nova, shimmer)
- `speed`: 语速 (0.25-4.0)
- `prompt`: 语音风格指导

**示例提示词**:
```
请以自然、友好的语调朗读以下文字：
- 语速适中，吐字清晰
- 在标点符处适当停顿
- 情感表达自然
```

### 4. pic2text (Image to Text)

**用途**: 图片文字识别

**配置参数**:
- `language`: 识别语言
- `format`: 输出格式 (plain, markdown, json)
- `prompt`: 识别指导

**示例提示词**:
```
请提取图片中的所有文字信息，要求：
1. 保持原始排版结构
2. 识别表格和列表格式
3. 标注图片中的非文字元素
4. 输出为Markdown格式
```

### 5. text2pic (Text to Image)

**用途**: 文字生成图片

**配置参数**:
- `size`: 图片尺寸 (256x256, 512x512, 1024x1024, 1792x1024, 1024x1792)
- `style`: 图片风格 (natural, vivid, artistic)
- `quality`: 质量 (standard, hd)
- `prompt`: 生成指导

**示例提示词**:
```
根据用户描述生成高质量图片，要求：
1. 画面构图合理，主体突出
2. 色彩搭配和谐，光影自然
3. 风格与描述相符
4. 细节丰富，质感逼真

用户描述：{user_input}
```

## 🛠️ 工作流编辑器使用指南

### 1. 节点创建

1. 从左侧节点调色板拖拽节点到画布
2. 节点类型包括：
   - **控制节点**: Start, End, Condition
   - **AI服务**: LLM, STT, TTS, pic2text, text2pic
   - **工具节点**: Process, Transform

### 2. 节点配置

1. 点击节点选中
2. 在右侧配置面板设置：
   - 节点名称和描述
   - 服务类型（AI服务节点必需）
   - 提示词配置（AI服务节点必需）
   - 特定服务参数
   - 输入输出端口

### 3. 连接创建

1. 点击源节点的输出端口
2. 拖拽到目标节点的输入端口
3. 可在连接上设置传递提示词

### 4. 工作流验证

系统会自动验证：
- 必须包含开始和结束节点
- AI服务节点必须配置服务类型和提示词
- 节点连接的有效性

### 5. 测试与部署

1. **保存工作流**: 提交到后端保存
2. **测试运行**: 启动测试执行并监控状态
3. **部署**: 发布为可用的工作流服务

## 🔍 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 401 | 认证失败 | 检查token是否有效 |
| 403 | 权限不足 | 确认租户权限配置 |
| 404 | DAG不存在 | 检查dag_id是否正确 |
| 422 | 数据格式错误 | 验证请求数据格式 |
| 500 | 服务器错误 | 联系技术支持 |

### 调试技巧

1. **开启浏览器开发者工具**查看网络请求
2. **检查控制台日志**了解详细错误信息
3. **验证API配置**确认baseURL和认证信息
4. **测试网络连接**确保能访问后端服务

## 📋 最佳实践

### 1. 提示词设计

- **明确角色定义**: 为AI指定清晰的角色和职责
- **详细任务描述**: 说明具体要完成的任务
- **输出格式规范**: 指定期望的输出格式
- **示例演示**: 提供Few-shot示例
- **错误处理**: 说明异常情况的处理方式

### 2. 工作流设计

- **模块化设计**: 将复杂任务拆分为简单节点
- **错误处理**: 添加条件节点处理异常情况
- **数据流清晰**: 确保数据在节点间正确传递
- **性能优化**: 避免不必要的串行处理

### 3. 安全考虑

- **敏感信息保护**: 不在提示词中包含敏感数据
- **输入验证**: 对用户输入进行验证和过滤
- **权限控制**: 确保租户数据隔离
- **日志记录**: 记录关键操作用于审计

## 🚀 部署指南

### 1. 环境准备

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 2. 环境变量配置

创建 `.env.production` 文件：

```bash
# API配置
VITE_API_BASE_URL=https://api.labubu.com/api/v1
VITE_API_TIMEOUT=30000

# 认证配置
VITE_AUTH_TYPE=bearer
VITE_DEFAULT_TENANT=production_tenant

# 功能开关
VITE_ENABLE_SSE=true
VITE_ENABLE_FILE_UPLOAD=true
```

### 3. 服务器配置

#### Nginx配置示例

```nginx
server {
    listen 80;
    server_name labubu.com;
    
    location / {
        root /var/www/labubu-ai-platform/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📞 技术支持

如有问题请联系：

- **技术文档**: [GitHub Wiki](https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform/wiki)
- **问题反馈**: [GitHub Issues](https://github.com/ENFJ-Meower/Labubu-Remake-AI-Platform/issues)
- **邮件支持**: support@labubu.com

---

**最后更新**: 2024-12-19
**版本**: v4.0
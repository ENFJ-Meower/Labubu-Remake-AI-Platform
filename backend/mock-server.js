// Simple mock backend server for testing frontend简单的模拟后端服务用于测试前端
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8081;

// Enable CORS for all routes启用所有路由的CORS
app.use(cors());
app.use(express.json());

// Mock API endpoints模拟API端点
console.log('Starting Labubu Mock Backend Server...');

// Submit DAG workflow提交DAG工作流
app.post('/api/v1/submit', (req, res) => {
  console.log('Received DAG submission:', req.body);
  const dagId = `dag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  res.json({
    success: true,
    message: 'DAG submitted successfully',
    dag_id: dagId,
    status: 'submitted'
  });
});

// Notify DAG ready通知DAG就绪
app.post('/api/v1/ready', (req, res) => {
  console.log('DAG ready notification:', req.body);
  
  res.json({
    success: true,
    message: 'DAG is ready for execution',
    status: 'ready'
  });
});

// Get DAG status获取DAG状态
app.get('/api/v1/status/:dag_id', (req, res) => {
  const dagId = req.params.dag_id;
  console.log('Status request for DAG:', dagId);
  
  res.json({
    dag_id: dagId,
    status: 'completed',
    progress: 100,
    result: 'Mock execution completed successfully'
  });
});

// Get processing result获取处理结果
app.get('/api/v1/message', (req, res) => {
  res.json({
    success: true,
    message: 'Mock processing completed',
    result: 'This is a mock result from the backend service'
  });
});

// Get all DAGs获取所有DAG
app.get('/api/v1/AllDag/:tenantID', (req, res) => {
  const tenantId = req.params.tenantID;
  console.log('Get all DAGs for tenant:', tenantId);
  
  res.json({
    success: true,
    data: [
      {
        dag_id: 'dag_example_1',
        name: 'Example Workflow 1',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        dag_id: 'dag_example_2', 
        name: 'Example Workflow 2',
        status: 'running',
        created_at: new Date().toISOString()
      }
    ]
  });
});

// SSE status stream for workflow monitoring工作流监控的SSE状态流
app.get('/api/v1/status/stream/:dag_id', (req, res) => {
  const dagId = req.params.dag_id;
  const tenantId = req.query.tenant_id;
  
  console.log(`SSE connection established for DAG: ${dagId}, Tenant: ${tenantId}`);
  
  // Set SSE headers设置SSE头部
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Send initial status发送初始状态
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Simulate workflow execution progress模拟工作流执行进度
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    
    if (progress <= 100) {
      sendEvent({
        dag_id: dagId,
        status: progress < 100 ? 'running' : 'completed',
        progress: progress,
        message: progress < 100 ? `Processing... ${progress}%` : 'Workflow completed successfully!',
        timestamp: new Date().toISOString()
      });
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      // Keep connection open for a bit longer保持连接开放一段时间
      setTimeout(() => {
        res.end();
      }, 2000);
    }
  }, 1000); // Send update every second每秒发送更新
  
  // Handle client disconnect处理客户端断开连接
  req.on('close', () => {
    console.log(`SSE connection closed for DAG: ${dagId}`);
    clearInterval(interval);
  });
});

// Health check endpoint健康检查端点
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Mock backend server is running',
    timestamp: new Date().toISOString()
  });
});

// User authentication endpoints用户认证端点
// Send email verification code发送邮箱验证码
app.post('/user/sendCode', (req, res) => {
  const { email } = req.body;
  console.log('Send verification code request:', { email });
  
  // Validate email format验证邮箱格式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email || !emailRegex.test(email)) {
    return res.json({
      code: 500,
      msg: 'Please enter a valid email address.',
      data: null
    });
  }
  
  // Mock successful response模拟成功响应
  res.json({
    code: 200,
    msg: 'success',
    data: 'Verification code sent successfully'
  });
});

// User registration用户注册
app.post('/user/register', (req, res) => {
  const { username, email, password, verificationCode } = req.body;
  console.log('Register request:', { username, email, password: '***', verificationCode });
  
  // Basic validation基础验证
  if (!username || username.length < 2) {
    return res.json({
      code: 500,
      msg: 'The username length must be longer than 2 characters.',
      data: null
    });
  }
  
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
    return res.json({
      code: 500,
      msg: 'Please enter a valid email address.',
      data: null
    });
  }
  
  if (!password || password.length < 8 || password.length > 16) {
    return res.json({
      code: 500,
      msg: 'The password length must be between 8 and 16 characters.',
      data: null
    });
  }
  
  if (!verificationCode || verificationCode.length !== 6) {
    return res.json({
      code: 500,
      msg: 'The length of verificationCode must be 6',
      data: null
    });
  }
  
  // Mock successful registration模拟成功注册
  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    code: 200,
    msg: 'success',
    data: {
      token: mockToken,
      username: username,
      email: email
    }
  });
});

// User login用户登录
app.post('/user/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', { username, password: '***' });
  
  // Basic validation基础验证
  if (!username || username.length < 2) {
    return res.json({
      code: 500,
      msg: 'The username cannot be empty.',
      data: null
    });
  }
  
  if (!password) {
    return res.json({
      code: 500,
      msg: 'The password cannot be empty.',
      data: null
    });
  }
  
  // Mock successful login (accept any valid credentials)模拟成功登录（接受任何有效凭据）
  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    code: 200,
    msg: 'success',
    data: {
      token: mockToken,
      username: username,
      email: `${username}@example.com`
    }
  });
});

// Start server启动服务器
app.listen(port, () => {
  console.log(`🚀 Labubu Mock Backend Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`🔧 Ready to handle frontend requests!`);
});

// Handle graceful shutdown优雅关闭处理
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock backend server...');
  process.exit(0);
}); 
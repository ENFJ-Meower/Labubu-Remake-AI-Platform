# 🔐 认证功能使用指南

## 功能概述

我们为Labubu AI平台添加了完整的用户认证系统，包括：
- **路由守卫**：自动检测用户登录状态
- **自动跳转**：未登录用户访问受保护页面时自动跳转到登录页
- **登录后重定向**：登录成功后自动跳转回原始页面
- **用户状态显示**：导航栏根据登录状态显示不同内容

## 🛡️ 受保护的页面

以下页面需要用户登录后才能访问：
- `/frontend/ai-agent` - AI智能体工作室
- `/frontend/community` - 社区页面
- `/frontend/marketplace` - 创意市场

## 🔄 工作流程

### 1. 访问受保护页面
```
用户访问 /frontend/ai-agent
↓
检查登录状态
↓
未登录 → 自动跳转到 /frontend/login
↓
保存原始路径到 localStorage
```

### 2. 登录流程
```
用户在登录页面输入凭据
↓
登录成功后获取JWT token
↓
自动跳转回原始页面（/frontend/ai-agent）
```

### 3. 导航栏状态
```
未登录状态：显示 [登录] [注册] 按钮
已登录状态：显示 [用户名] [登出] 按钮
```

## 🔧 技术实现

### 认证工具函数 (`utils/auth.js`)
```javascript
// 检查用户是否已登录
isAuthenticated() → boolean

// 获取当前用户信息
getCurrentUser() → Object|null

// 清除认证数据
clearAuthData()

// 用户登出
logout()
```

### 路由守卫 (`main.js`)
```javascript
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      // 保存原始路径
      localStorage.setItem('redirect_after_login', to.fullPath)
      // 跳转到登录页
      next('/frontend/login')
      return
    }
  }
  next()
})
```

### 受保护路由配置
```javascript
const routes = [
  {
    path: '/frontend/ai-agent',
    name: 'AIAgent',
    component: AIAgent,
    meta: { requiresAuth: true }  // 标记需要认证
  },
  // ... 其他路由
]
```

## 🎯 用户体验

### 场景1：直接访问受保护页面
1. 用户在浏览器地址栏输入 `http://localhost:3000/frontend/ai-agent`
2. 系统检测到用户未登录
3. 自动跳转到登录页面
4. 用户登录成功后，自动跳转回AI智能体页面

### 场景2：从导航菜单访问
1. 用户点击导航栏的"AI智能体"链接
2. 系统检测到用户未登录
3. 自动跳转到登录页面
4. 登录成功后回到AI智能体页面

### 场景3：已登录用户
1. 已登录用户可以正常访问所有页面
2. 导航栏显示用户名和登出按钮
3. 点击登出按钮确认后清除认证信息

## 🔒 安全特性

### JWT Token验证
- 检查token是否存在
- 验证token格式是否正确
- 检查token是否过期
- 过期token自动清除

### 自动清理
- 无效token自动清除
- 登出时清除所有认证数据
- 页面刷新时重新验证状态

## 🚀 测试步骤

### 1. 测试未登录访问
```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问
http://localhost:3000/frontend/ai-agent
```
**预期结果**：自动跳转到登录页面

### 2. 测试登录重定向
```bash
# 在登录页面输入凭据
用户名: test@example.com
密码: password123

# 点击登录
```
**预期结果**：登录成功后自动跳转回AI智能体页面

### 3. 测试导航栏状态
```bash
# 未登录状态
导航栏显示: [登录] [注册]

# 已登录状态  
导航栏显示: [用户名] [登出]
```

### 4. 测试登出功能
```bash
# 点击登出按钮
# 确认登出
```
**预期结果**：清除认证信息，如果在受保护页面则跳转到首页

## 📝 开发注意事项

### 添加新的受保护路由
```javascript
// 在 main.js 中添加 meta.requiresAuth
{
  path: '/frontend/new-protected-page',
  name: 'NewProtectedPage', 
  component: NewProtectedPage,
  meta: { requiresAuth: true }  // 添加这行
}
```

### 在组件中检查登录状态
```javascript
import { isAuthenticated, getCurrentUser } from '@/utils/auth.js'

export default {
  mounted() {
    if (isAuthenticated()) {
      const user = getCurrentUser()
      console.log('当前用户:', user)
    }
  }
}
```

### 手动触发登录检查
```javascript
// 在需要时手动检查认证状态
this.$parent.checkAuthStatus()
```

## 🌐 国际化支持

认证功能完全支持中英文切换：
- 登出确认提示
- 成功/失败消息
- 导航按钮文本

## 📊 状态管理

认证状态存储在以下位置：
- `localStorage.labubu_token` - JWT认证令牌
- `localStorage.labubu_user` - 用户信息
- `localStorage.redirect_after_login` - 登录后重定向路径（临时）

## 🔄 与现有功能的集成

### API调用
现有的API调用会自动使用JWT token：
```javascript
// config/api.js 中的 getAuthHeaders() 方法
// 自动从 localStorage 获取 token 并添加到请求头
```

### 工作流管理
AI智能体页面的所有功能都需要用户登录后才能使用，包括：
- 创建和编辑工作流
- 提交DAG任务
- 查看执行结果

这样就完成了完整的用户认证系统，提供了安全、流畅的用户体验！ 
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1>{{ $t('login.title', 'LABUBU AI') }}</h1>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">{{ $t('login.username', '用户名') }}</label>
          <input type="text" id="username" v-model="username" required :placeholder="$t('login.usernamePlaceholder', '请输入用户名')" />
        </div>
        <div class="form-group">
          <label for="password">{{ $t('login.password', '密码') }}</label>
          <input type="password" id="password" v-model="password" required :placeholder="$t('login.passwordPlaceholder', '请输入密码')" />
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" /> {{ $t('login.rememberMe', '记住我') }}
          </label>
          <a href="#" class="forgot-link" @click.prevent="onForgot">{{ $t('login.forgotPassword', '忘记密码？') }}</a>
        </div>
        <!-- 加载状态提示 -->
        <div v-if="isLoading" class="loading-message">
          <div class="loading-dots">
            <span>{{ $t('login.loggingIn', '正在登录') }}</span>
            <span class="dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
          <p class="loading-tip">{{ $t('login.loadingTip', '登录验证需要一些时间，请耐心等待...') }}</p>
        </div>
        <button 
          class="login-btn" 
          type="submit" 
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <span>{{ isLoading ? $t('login.loggingIn', '正在登录') : $t('login.loginButton', '登录') }}</span>
        </button>
        <div class="register-link">
          {{ $t('login.noAccount', '还没有账号？') }}<router-link to="/frontend/register">{{ $t('login.registerNow', '注册新账号') }}</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// User login component用户登录组件
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      isLoading: false // 新增：登录加载状态
    };
  },
  methods: {
    async handleLogin() {
      // Validate input fields验证输入字段
      if (!this.username.trim()) {
        alert(this.$t('login.usernameRequired', '请输入用户名'));
        return;
      }
      if (!this.password.trim()) {
        alert(this.$t('login.passwordRequired', '请输入密码'));
        return;
      }
      
      // 防止重复提交：开始加载状态
      if (this.isLoading) {
        return; // 如果正在加载中，直接返回
      }
      this.isLoading = true;
      
      // Call backend login API using userAuthAPI调用后端登录API使用userAuthAPI
      try {
        // Import userAuthAPI for authentication导入userAuthAPI进行认证
        const { userAuthAPI } = await import('@/config/api.js')
        
        // Call login API调用登录API - 现在API层会自动检查code并抛异常
        const data = await userAuthAPI.login(this.username, this.password)
        
        // 如果能到这里，说明登录成功(code=200)，API层已经过滤了错误
          // Remember me logic记住我逻辑
          if (this.rememberMe) {
            localStorage.setItem('labubu_remember', this.username);
          } else {
            localStorage.removeItem('labubu_remember');
          }
          
          // Save JWT token and user info保存JWT令牌和用户信息
          localStorage.setItem('labubu_token', data.data.token);
          localStorage.setItem('userInfo', JSON.stringify({
            username: data.data.username,
            email: data.data.email,
            tenant_id: data.data.tenant_id || 'default' // 新增：存储tenant_id
          }));
          
          console.log('Login successful, JWT token saved登录成功，JWT令牌已保存:', data.data.token.substring(0, 20) + '...')
          
          // Show success message显示成功消息
          alert(this.$t('login.loginSuccess', '登录成功'));
          
          // Redirect to original page or home page跳转到原始页面或首页
          const redirectPath = localStorage.getItem('redirect_after_login') || '/'
          localStorage.removeItem('redirect_after_login')
          this.$router.push(redirectPath);
      } catch (error) {
        console.error('Login error登录错误:', error);
        alert(this.$t('login.loginFailed', '登录失败') + '：' + error.message);
      } finally {
        // 结束加载状态
        this.isLoading = false;
      }
    },
    onForgot() {
      alert(this.$t('login.forgotMessage', '请联系管理员重置密码。'));
    },
    onRegister() {
      alert(this.$t('login.registerMessage', '注册功能暂未开放。'));
    }
  },
  mounted() {
    // 自动填充记住的用户名
    const remembered = localStorage.getItem('labubu_remember');
    if (remembered) {
      this.username = remembered;
      this.rememberMe = true;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #232526 0%, #1a1a1a 100%);
  font-family: 'Poppins', sans-serif;
}
.login-container {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 12px 48px 0 rgba(255, 107, 107, 0.25),
    0 8px 32px 0 rgba(78, 205, 196, 0.25),
    0 0 60px 0 rgba(255, 107, 107, 0.2),
    0 0 120px 0 rgba(78, 205, 196, 0.2),
    inset 0 1px 0 rgba(255, 107, 107, 0.1),
    inset 0 -1px 0 rgba(78, 205, 196, 0.1);
  padding: 48px 36px 32px 36px;
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 107, 107, 0.2);
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ff6b6b, #4ecdc4);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.6;
  filter: blur(8px);
  animation: glow-pulse 3s ease-in-out infinite alternate;
}

@keyframes glow-pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.98);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}
.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.login-logo img {
  width: 90px;
  height: 90px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  padding: 6px;
}
.login-logo h1 {
  font-size: 2rem;
  font-weight: 600;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 2px;
  text-align: center;
  position: relative;
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.5)) 
          drop-shadow(0 0 40px rgba(78, 205, 196, 0.3));
  animation: text-glow 4s ease-in-out infinite alternate;
}

@keyframes text-glow {
  0% {
    filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.4)) 
            drop-shadow(0 0 30px rgba(78, 205, 196, 0.2));
  }
  100% {
    filter: drop-shadow(0 0 25px rgba(255, 107, 107, 0.6)) 
            drop-shadow(0 0 50px rgba(78, 205, 196, 0.4));
  }
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 6px;
  display: block;
}
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: #232526;
  color: #fff;
  font-size: 1rem;
  outline: none;
  margin-top: 4px;
  transition: box-shadow 0.2s;
}
.form-group input:focus {
  box-shadow: 0 0 0 2px #4ecdc4;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.remember-me {
  color: #bdbdbd;
  font-size: 0.95rem;
}
.forgot-link {
  color: #4ecdc4;
  font-size: 0.95rem;
  text-decoration: underline;
  cursor: pointer;
}

/* 加载状态提示消息 */
.loading-message {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: #4ecdc4;
  text-align: center;
  width: 100%;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #4ecdc4;
  border-radius: 50%;
  animation: bounce 1.5s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: -0.3s; }
.dot:nth-child(2) { animation-delay: -0.15s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-tip {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}

.login-btn {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
}

.login-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 加载动画样式 */
.login-btn.loading {
  background: linear-gradient(90deg, #4ecdc4 0%, #4ecdc4 100%);
  opacity: 0.8;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  color: #bdbdbd;
  font-size: 0.95rem;
}
.register-link a {
  color: #ff6b6b;
  text-decoration: underline;
  cursor: pointer;
}
</style>
<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1>{{ $t('register.title', '注册新账号') }}</h1>
      </div>
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">{{ $t('register.username', '用户名') }}</label>
          <input type="text" id="username" v-model="username" required :placeholder="$t('register.usernamePlaceholder', '请输入用户名')" />
        </div>
        <div class="form-group">
          <label for="email">{{ $t('register.email', '邮箱') }}</label>
          <input type="email" id="email" v-model="email" required :placeholder="$t('register.emailPlaceholder', '请输入邮箱')" />
        </div>
        <div class="form-group">
          <label for="password">{{ $t('register.password', '密码') }}</label>
          <input type="password" id="password" v-model="password" required :placeholder="$t('register.passwordPlaceholder', '请输入密码')" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">{{ $t('register.confirmPassword', '确认密码') }}</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required :placeholder="$t('register.confirmPasswordPlaceholder', '请再次输入密码')" />
        </div>
        <div class="form-group">
          <label for="code">{{ $t('register.verificationCode', '验证码') }}</label>
          <div class="code-input-group">
            <input type="text" id="code" v-model="code" :placeholder="$t('register.codePlaceholder', '请输入验证码')" class="code-input" />
            <button 
              type="button" 
              class="code-btn" 
              :class="{ 'loading': isLoadingCode }"
              :disabled="codeBtnDisabled || isLoadingCode" 
              @click="sendCode"
            >
              <span v-if="isLoadingCode" class="loading-spinner"></span>
              <span>{{ codeBtnText }}</span>
            </button>
          </div>
        </div>
        <!-- 加载状态提示 -->
        <div v-if="isLoadingCode" class="loading-message">
          <div class="loading-dots">
            <span>{{ $t('register.sendingCode', '正在发送验证码') }}</span>
            <span class="dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
          <p class="loading-tip">{{ $t('register.loadingTip', '邮箱验证码发送需要一些时间，请耐心等待...') }}</p>
        </div>
        <button class="register-btn" type="submit" :disabled="isLoadingCode">{{ $t('register.registerButton', '注册') }}</button>
        <div class="login-link">
          {{ $t('register.hasAccount', '已有账号？') }}<router-link to="/frontend/login">{{ $t('register.goLogin', '去登录') }}</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { currentLanguage } from '../i18n/index.js'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      codeBtnText: '获取验证码', // 临时占位，会在mounted中更新
      codeBtnDisabled: false,
      isLoadingCode: false, // 新增：验证码发送加载状态
      codeTimer: null,
      codeCountdown: 60,
      currentLanguage // 引入全局语言状态
    };
  },
  mounted() {
    // 组件挂载后正确设置国际化文字
    this.updateButtonText();
  },
  watch: {
    // 监听全局语言变化，更新按钮文字
    currentLanguage: {
      handler() {
        this.updateButtonText();
      },
      immediate: false
    }
  },
  methods: {
    updateButtonText() {
      // 更新按钮文字，除非正在倒计时
      if (!this.codeBtnDisabled && !this.isLoadingCode) {
        this.codeBtnText = this.$t('register.getCode', '获取验证码');
      }
    },
    async sendCode() {
      // Validate email format验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert(this.$t('register.emailFormatError', '邮箱格式不正确'));
        return;
      }
      
      // 开始加载状态
      this.isLoadingCode = true;
      this.codeBtnDisabled = true;
      this.codeBtnText = this.$t('register.sending', '发送中...');
      
      try {
        // Import userAuthAPI for authentication导入userAuthAPI进行认证
        const { userAuthAPI } = await import('@/config/api.js')
        
        // Call send verification code API调用发送验证码API
        const data = await userAuthAPI.sendVerificationCode(this.email)
        
        // Handle response based on API documentation根据API文档处理响应
        if (data.code === 200) {
          // 成功发送后显示成功提示
          alert(this.$t('register.codeSuccess', '验证码已发送到您的邮箱，请查收！'));
          
          this.codeBtnText = this.$t('register.sentCountdown', '已发送(180s)'); // 3 minutes as per API doc按API文档3分钟
          this.codeCountdown = 180;
          this.codeTimer = setInterval(() => {
            this.codeCountdown--;
            const sentText = this.$t('register.sentTime', `已发送({time}s)`);
            this.codeBtnText = sentText.replace('{time}', this.codeCountdown);
            if (this.codeCountdown <= 0) {
              clearInterval(this.codeTimer);
              this.codeBtnText = this.$t('register.getCode', '获取验证码');
              this.codeBtnDisabled = false;
            }
          }, 1000);
        } else {
          // Handle error response处理错误响应
          let errorMessage = data.msg || '验证码发送失败';
          if (data.code === 500) {
            errorMessage = data.msg || this.$t('register.sendCodeError', '验证码发送失败');
          }
          throw new Error(errorMessage);
        }
      } catch (e) {
        console.error('Send verification code error发送验证码错误:', e);
        alert('验证码发送失败：' + e.message);
        this.codeBtnText = this.$t('register.getCode', '获取验证码');
        this.codeBtnDisabled = false;
      } finally {
        // 结束加载状态
        this.isLoadingCode = false;
      }
    },
    async handleRegister() {
      // Validate all input fields验证所有输入字段
      if (!this.username.trim()) {
        alert(this.$t('register.usernameRequired', '请输入用户名'));
        return;
      }
      
      // Username length validation用户名长度验证
      if (this.username.length < 3 || this.username.length > 20) {
        alert(this.$t('register.usernameLength', '用户名长度应为3-20个字符'));
        return;
      }
      
      // Email format validation邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert(this.$t('register.emailError', '请输入有效的邮箱地址'));
        return;
      }
      
      // Password validation密码验证
      if (this.password.length < 8) {
        alert(this.$t('register.passwordLength', '密码长度不能少于8位'));
        return;
      }
      
      // Password confirmation验证密码确认
      if (this.password !== this.confirmPassword) {
        alert(this.$t('register.passwordMismatch', '两次输入的密码不一致'));
        return;
      }
      
      // Verification code validation验证码验证
      if (!this.code || this.code.length !== 6) {
        alert(this.$t('register.codeError', '请输入6位验证码'));
        return;
      }
      
      // Call backend register API using userAuthAPI调用后端注册API使用userAuthAPI
      try {
        // Import userAuthAPI for authentication导入userAuthAPI进行认证
        const { userAuthAPI } = await import('@/config/api.js')
        
        // Call register API调用注册API
        const data = await userAuthAPI.register(this.username, this.email, this.password, this.code)
        
        // Handle response based on API documentation根据API文档处理响应
        if (data.code === 200) {
          // Save JWT token and user info保存JWT令牌和用户信息
          localStorage.setItem('labubu_token', data.data.token);
          localStorage.setItem('labubu_user', JSON.stringify({
            username: data.data.username,
            email: data.data.email
          }));
          
          console.log('Registration successful, JWT token saved注册成功，JWT令牌已保存:', data.data.token.substring(0, 20) + '...')
          
          alert(this.$t('register.registerSuccess', '注册成功！'));
          this.$router.push('/');
        } else {
          // Handle different error codes处理不同的错误代码
          let errorMessage = data.msg || '注册失败';
          if (data.code === 409) {
            errorMessage = data.msg; // Username/email already exists
          } else if (data.code === 400) {
            errorMessage = this.$t('register.invalidCode', '验证码错误或已过期');
          } else if (data.code === 500) {
            errorMessage = data.msg || this.$t('register.serverError', '服务器错误，请稍后重试');
          }
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Registration error注册错误:', error);
        alert('注册失败：' + error.message);
      }
    }
  },
  beforeDestroy() {
    if (this.codeTimer) clearInterval(this.codeTimer);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #232526 0%, #1a1a1a 100%);
  font-family: 'Poppins', sans-serif;
}
.register-container {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px 0 rgba(255, 107, 107, 0.15),
    0 4px 16px 0 rgba(78, 205, 196, 0.15),
    0 0 40px 0 rgba(255, 107, 107, 0.1),
    0 0 80px 0 rgba(78, 205, 196, 0.1);
  padding: 48px 36px 32px 36px;
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 107, 107, 0.1);
}
.register-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.register-logo img {
  width: 90px;
  height: 90px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  padding: 6px;
}
.register-logo h1 {
  font-size: 2rem;
  font-weight: 600;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 2px;
}
.register-form {
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
/* 验证码输入组合样式 */
.code-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
  margin-top: 4px;
}
.code-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: #232526;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.code-input:focus {
  box-shadow: 0 0 0 2px #4ecdc4;
}
.code-btn {
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 110px;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.9rem;
}
.code-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.code-btn:not(:disabled):hover {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
}

/* 加载动画样式 */
.code-btn.loading {
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

/* 加载状态提示消息 */
.loading-message {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: #4ecdc4;
  text-align: center;
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

.register-btn {
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
  transition: background 0.2s;
}
.register-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
}
.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.login-link {
  text-align: center;
  color: #bdbdbd;
  font-size: 0.95rem;
}
.login-link a {
  color: #ff6b6b;
  text-decoration: underline;
  cursor: pointer;
}
</style> 
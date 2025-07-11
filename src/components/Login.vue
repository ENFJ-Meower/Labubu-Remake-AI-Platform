<template>
  <main class="login-page">
    <section class="login-container" role="main" aria-labelledby="login-title">
      <header class="login-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1 id="login-title">{{ $t('login.title', 'LABUBU AI') }}</h1>
      </header>
      <form class="login-form" @submit.prevent="handleLogin" novalidate aria-label="用户登录表单">
        <fieldset class="form-group">
          <label for="username">{{ $t('login.username', '用户名') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            :placeholder="$t('login.usernamePlaceholder', '请输入用户名')"
            aria-describedby="username-help"
            autocomplete="username"
          />
          <small id="username-help" class="form-help">请输入您的用户名</small>
        </fieldset>
        <fieldset class="form-group">
          <label for="password">{{ $t('login.password', '密码') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            :placeholder="$t('login.passwordPlaceholder', '请输入密码')"
            aria-describedby="password-help"
            autocomplete="current-password"
          />
          <small id="password-help" class="form-help">至少8位，包含英文和特殊字符</small>
        </fieldset>
        <fieldset class="form-options">
          <legend class="sr-only">登录选项</legend>
          <label class="remember-me">
            <input 
              type="checkbox" 
              v-model="rememberMe" 
              aria-describedby="remember-help"
            /> 
            {{ $t('login.rememberMe', '记住我') }}
          </label>
          <small id="remember-help" class="sr-only">下次自动登录</small>
          <a 
            href="#" 
            class="forgot-link" 
            @click.prevent="onForgot"
            aria-label="忘记密码帮助"
          >
            {{ $t('login.forgotPassword', '忘记密码？') }}
          </a>
        </fieldset>
        <button 
          class="login-btn" 
          type="submit"
          aria-label="提交登录表单"
        >
          {{ $t('login.loginButton', '登录') }}
        </button>
        <nav class="register-link" aria-label="注册导航">
          <p>
            {{ $t('login.noAccount', '还没有账号？') }}
            <router-link to="/register" aria-label="前往注册页面">
              {{ $t('login.registerNow', '注册新账号') }}
            </router-link>
          </p>
        </nav>
      </form>
    </section>
  </main>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    handleLogin() {
      // 密码校验：8位以上，包含英文和特殊字符
      const pwd = this.password;
      const valid = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
      if (!valid) {
        alert(this.$t('login.passwordError', '密码需至少8位，且包含英文和特殊字符'));
        return;
      }
      // 前端哈希加密
      const hashedPwd = CryptoJS.SHA256(pwd).toString();
      // 模拟登录逻辑
      if (this.username && hashedPwd) {
        // 记住我逻辑
        if (this.rememberMe) {
          localStorage.setItem('labubu_remember', this.username);
        } else {
          localStorage.removeItem('labubu_remember');
        }
        // 跳转到首页
        this.$router.push('/');
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
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 48px 36px 32px 36px;
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
  border: none;
  padding: 0;
  position: relative;
}

.form-group label {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
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

.form-group input:invalid {
  box-shadow: 0 0 0 2px #ff6b6b;
}

.form-help {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-top: 4px;
  font-style: italic;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border: none;
  padding: 0;
}

.form-options legend {
  display: none;
}

.remember-me {
  color: #bdbdbd;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remember-me input[type="checkbox"] {
  width: auto;
  margin: 0;
  accent-color: #4ecdc4;
}

.forgot-link {
  color: #4ecdc4;
  font-size: 0.95rem;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #ff6b6b;
}

.forgot-link:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
  border-radius: 2px;
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
  transition: background 0.2s;
}

.login-btn:hover {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
}

.login-btn:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}

.register-link {
  text-align: center;
  margin-top: 8px;
}

.register-link p {
  color: #bdbdbd;
  font-size: 0.95rem;
  margin: 0;
}

.register-link a {
  color: #ff6b6b;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #4ecdc4;
}

.register-link a:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
  border-radius: 2px;
}

/* 屏幕阅读器专用样式 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 增强可访问性的样式 */
@media (prefers-reduced-motion: reduce) {
  .form-group input,
  .login-btn,
  .forgot-link,
  .register-link a {
    transition: none;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .form-group input {
    border: 1px solid #fff;
  }
  
  .form-group input:focus {
    border: 2px solid #4ecdc4;
  }
}
</style>
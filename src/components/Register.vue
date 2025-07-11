<template>
  <main class="register-page">
    <section class="register-container" role="main" aria-labelledby="register-title">
      <header class="register-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1 id="register-title">{{ $t('register.title', '注册新账号') }}</h1>
      </header>
      <form class="register-form" @submit.prevent="handleRegister" novalidate aria-label="用户注册表单">
        <fieldset class="form-group">
          <label for="username">{{ $t('register.username', '用户名') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            :placeholder="$t('register.usernamePlaceholder', '请输入用户名')"
            aria-describedby="username-help"
            autocomplete="username"
          />
          <small id="username-help" class="form-help">4-20位字母、数字或下划线</small>
        </fieldset>
        <fieldset class="form-group">
          <label for="email">{{ $t('register.email', '邮箱') }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            :placeholder="$t('register.emailPlaceholder', '请输入邮箱')"
            aria-describedby="email-help"
            autocomplete="email"
          />
          <small id="email-help" class="form-help">请输入有效的邮箱地址</small>
        </fieldset>
        <fieldset class="form-group">
          <label for="password">{{ $t('register.password', '密码') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            :placeholder="$t('register.passwordPlaceholder', '请输入密码')"
            aria-describedby="password-help"
            autocomplete="new-password"
          />
          <small id="password-help" class="form-help">至少8位，包含英文和特殊字符</small>
        </fieldset>
        <fieldset class="form-group">
          <label for="confirmPassword">{{ $t('register.confirmPassword', '确认密码') }}</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            :placeholder="$t('register.confirmPasswordPlaceholder', '请再次输入密码')"
            aria-describedby="confirm-password-help"
            autocomplete="new-password"
          />
          <small id="confirm-password-help" class="form-help">请再次输入相同的密码</small>
        </fieldset>
        <fieldset class="form-group form-group-inline">
          <label for="code">{{ $t('register.verificationCode', '验证码') }}</label>
          <input 
            type="text" 
            id="code" 
            v-model="code" 
            :placeholder="$t('register.codePlaceholder', '请输入验证码')" 
            style="width: 120px;"
            aria-describedby="code-help"
            autocomplete="one-time-code"
          />
          <button 
            type="button" 
            class="code-btn" 
            disabled 
            aria-label="获取验证码"
            title="验证码功能暂未开放"
          >
            {{ $t('register.getCode', '获取验证码') }}
          </button>
          <small id="code-help" class="form-help">6位数字验证码</small>
        </fieldset>
        <button 
          class="register-btn" 
          type="submit"
          aria-label="提交注册表单"
        >
          {{ $t('register.registerButton', '注册') }}
        </button>
        <nav class="login-link" aria-label="登录导航">
          <p>
            {{ $t('register.hasAccount', '已有账号？') }}
            <router-link to="/login" aria-label="前往登录页面">
              {{ $t('register.goLogin', '去登录') }}
            </router-link>
          </p>
        </nav>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      code: ''
    };
  },
  methods: {
    handleRegister() {
      // 简单前端校验
      if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        alert(this.$t('register.completeInfo', '请填写完整信息'));
        return;
      }
      if (!/^\w{4,20}$/.test(this.username)) {
        alert(this.$t('register.usernameError', '用户名需为4-20位字母、数字或下划线'));
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        alert(this.$t('register.emailError', '请输入有效的邮箱地址'));
        return;
      }
      if (!/^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(this.password)) {
        alert(this.$t('register.passwordError', '密码需至少8位，且包含英文和特殊字符'));
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert(this.$t('register.confirmError', '两次输入的密码不一致'));
        return;
      }
      // 预留验证码校验
      // if (!this.code) {
      //   alert(this.$t('register.codeError', '请输入验证码'));
      //   return;
      // }
      // 这里后续对接后端API
      alert(this.$t('register.registerSuccess', '注册功能待接入后端，表单校验通过！'));
    }
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
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 48px 36px 32px 36px;
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.form-group-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.form-group-inline label {
  margin-bottom: 0;
}

.form-group-inline .form-help {
  width: 100%;
  margin-top: 8px;
}

.code-btn {
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: not-allowed;
  margin-left: 0.5rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.code-btn:not(:disabled) {
  opacity: 1;
  cursor: pointer;
}

.code-btn:not(:disabled):hover {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
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

.register-btn:hover {
  background: linear-gradient(90deg, #4ecdc4 0%, #ff6b6b 100%);
}

.register-btn:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}

.login-link {
  text-align: center;
  margin-top: 8px;
}

.login-link p {
  color: #bdbdbd;
  font-size: 0.95rem;
  margin: 0;
}

.login-link a {
  color: #ff6b6b;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #4ecdc4;
}

.login-link a:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
  border-radius: 2px;
}

/* 增强可访问性的样式 */
@media (prefers-reduced-motion: reduce) {
  .form-group input,
  .code-btn,
  .register-btn,
  .login-link a {
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
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
        <div class="form-group form-group-inline">
          <label for="code">{{ $t('register.verificationCode', '验证码') }}</label>
          <input type="text" id="code" v-model="code" :placeholder="$t('register.codePlaceholder', '请输入验证码')" style="width: 120px;" />
          <button type="button" class="code-btn" :disabled="codeBtnDisabled" @click="getCode">{{ codeBtnText }}</button>
        </div>
        <button class="register-btn" type="submit">{{ $t('register.registerButton', '注册') }}</button>
        <div class="login-link">
          {{ $t('register.hasAccount', '已有账号？') }}<router-link to="/login">{{ $t('register.goLogin', '去登录') }}</router-link>
        </div>
      </form>
    </div>
  </div>
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
      code: '',
      codeBtnText: '获取验证码',
      codeBtnDisabled: false,
      codeTimer: null,
      codeCountdown: 60
    };
  },
  methods: {
    async getCode() {
      // Validate email format验证邮箱格式
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.email)) {
        alert(this.$t('register.emailError', '请输入有效的邮箱地址'));
        return;
      }
      
      this.codeBtnDisabled = true;
      this.codeBtnText = '发送中...';
      
      try {
        const res = await fetch('/user/sendCode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        });
        const data = await res.json();
        
        // Handle response based on API documentation根据API文档处理响应
        if (data.code === 200) {
          this.codeBtnText = '已发送(180s)'; // 3 minutes as per API doc按API文档3分钟
          this.codeCountdown = 180;
          this.codeTimer = setInterval(() => {
            this.codeCountdown--;
            this.codeBtnText = `已发送(${this.codeCountdown}s)`;
            if (this.codeCountdown <= 0) {
              clearInterval(this.codeTimer);
              this.codeBtnText = '获取验证码';
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
        this.codeBtnText = '获取验证码';
        this.codeBtnDisabled = false;
      }
    },
    async handleRegister() {
      // Frontend validation前端验证
      if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
        alert(this.$t('register.completeInfo', '请填写完整信息'));
        return;
      }
      
      // Username validation (2+ characters as per API doc)用户名验证（按API文档2位以上）
      if (this.username.length < 2) {
        alert(this.$t('register.usernameError', '用户名长度必须大于2位'));
        return;
      }
      
      // Email validation (use API doc regex)邮箱验证（使用API文档正则）
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.email)) {
        alert(this.$t('register.emailError', '请输入有效的邮箱地址'));
        return;
      }
      
      // Password validation (8-16 chars, at least 2 types: uppercase, lowercase, digits)密码验证（8-16位，至少包含大写字母、小写字母、数字中的两类）
      if (this.password.length < 8 || this.password.length > 16) {
        alert(this.$t('register.passwordLengthError', '密码长度必须在8-16位之间'));
        return;
      }
      
      const hasUpper = /[A-Z]/.test(this.password);
      const hasLower = /[a-z]/.test(this.password);
      const hasDigit = /\d/.test(this.password);
      const typeCount = [hasUpper, hasLower, hasDigit].filter(Boolean).length;
      
      if (typeCount < 2) {
        alert(this.$t('register.passwordError', '密码必须包含大写字母、小写字母、数字中的至少两类'));
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        alert(this.$t('register.confirmError', '两次输入的密码不一致'));
        return;
      }
      
      // Verification code validation (6 digits)验证码验证（6位数字）
      if (!this.code || this.code.length !== 6) {
        alert(this.$t('register.codeError', '请输入6位验证码'));
        return;
      }
      
      // Call backend register API调用后端注册API
      try {
        const res = await fetch('/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password, // Send password as plain text按后端要求发送明文密码
            verificationCode: this.code // Use correct field name使用正确的字段名
          })
        });
        const data = await res.json();
        
        // Handle response based on API documentation根据API文档处理响应
        if (data.code === 200) {
          // Save token and user info保存token和用户信息
          localStorage.setItem('labubu_token', data.data.token);
          localStorage.setItem('labubu_user', JSON.stringify({
            username: data.data.username,
            email: data.data.email
          }));
          
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
        console.error('Register error注册错误:', error);
        alert(this.$t('register.networkError', '网络错误，请稍后重试'));
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
.form-group-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.code-btn {
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.2s;
}
.code-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
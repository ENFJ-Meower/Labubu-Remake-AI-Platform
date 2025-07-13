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
      if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        alert(this.$t('register.emailError', '请输入有效的邮箱地址'));
        return;
      }
      this.codeBtnDisabled = true;
      this.codeBtnText = '发送中...';
      try {
        const res = await fetch('/api/sendCode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        });
        const data = await res.json();
        if (res.ok) {
          this.codeBtnText = '已发送(60s)';
          this.codeCountdown = 60;
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
          throw new Error(data.msg || '验证码发送失败');
        }
      } catch (e) {
        console.error('发送验证码错误:', e);
        alert('验证码发送失败：' + e.message);
        this.codeBtnText = '获取验证码';
        this.codeBtnDisabled = false;
      }
    },
    async handleRegister() {
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
      if (!this.code) {
        alert(this.$t('register.codeError', '请输入验证码'));
        return;
      }
      // 调用后端注册API
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
            code: this.code
          })
        });
        const data = await res.json();
        if (data.msg === '注册成功') {
          alert(this.$t('register.registerSuccess', '注册成功！'));
          this.$router.push('/login');
        } else {
          alert(data.msg || '注册失败');
        }
      } catch (error) {
        console.error('注册错误:', error);
        alert('网络错误，请稍后重试');
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
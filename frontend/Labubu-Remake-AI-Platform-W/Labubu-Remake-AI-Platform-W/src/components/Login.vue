<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1>LABUBU AI</h1>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" required placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" required placeholder="请输入密码" />
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" /> 记住我
          </label>
          <a href="#" class="forgot-link" @click.prevent="onForgot">忘记密码？</a>
        </div>
        <button class="login-btn" type="submit">登录</button>
        <div class="register-link">
          还没有账号？<a href="#" @click.prevent="onRegister">注册新账号</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import sha256 from 'crypto-js/sha256';

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
        alert('密码需至少8位，且包含英文和特殊字符');
        return;
      }
      // 前端哈希加密
      const hashedPwd = sha256(pwd).toString();
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
      alert('请联系管理员重置密码。');
    },
    onRegister() {
      alert('注册功能暂未开放。');
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
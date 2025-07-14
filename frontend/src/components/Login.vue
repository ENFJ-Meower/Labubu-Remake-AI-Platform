<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-logo">
        <img src="../assets/images/logo.png" alt="Labubu AI Logo" />
        <h1>{{ $t('login.title', 'LABUBU AI') }}</h1>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="usernameOrEmail">{{ $t('login.username', '用户名/邮箱') }}</label>
          <input type="text" id="usernameOrEmail" v-model="usernameOrEmail" required :placeholder="$t('login.usernamePlaceholder', '请输入用户名或邮箱')" />
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
        <button class="login-btn" type="submit">{{ $t('login.loginButton', '登录') }}</button>
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
      usernameOrEmail: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    async handleLogin() {
      // Validate input fields验证输入字段
      if (!this.usernameOrEmail.trim()) {
        alert(this.$t('login.usernameRequired', '请输入用户名或邮箱'));
        return;
      }
      if (!this.password.trim()) {
        alert(this.$t('login.passwordRequired', '请输入密码'));
        return;
      }
      
      // Call backend login API using userAuthAPI调用后端登录API使用userAuthAPI
      try {
        // Import userAuthAPI for authentication导入userAuthAPI进行认证
        const { userAuthAPI } = await import('@/config/api.js')
        
        // Call login API调用登录API
        const data = await userAuthAPI.login(this.usernameOrEmail, this.password)
        
        // Handle response based on API documentation根据API文档处理响应
        if (data.code === 200) {
          // Remember me logic记住我逻辑
          if (this.rememberMe) {
            localStorage.setItem('labubu_remember', this.usernameOrEmail);
          } else {
            localStorage.removeItem('labubu_remember');
          }
          
          // Save JWT token and user info保存JWT令牌和用户信息
          localStorage.setItem('labubu_token', data.data.token);
          localStorage.setItem('labubu_user', JSON.stringify({
            username: data.data.username,
            email: data.data.email
          }));
          
          console.log('Login successful, JWT token saved登录成功，JWT令牌已保存:', data.data.token.substring(0, 20) + '...')
          
          // Show success message显示成功消息
          alert(this.$t('login.loginSuccess', '登录成功'));
          
          // Redirect to home page跳转到首页
          this.$router.push('/');
        } else {
          // Handle different error codes处理不同的错误代码
          let errorMessage = data.msg || '登录失败';
          if (data.code === 401) {
            errorMessage = this.$t('login.invalidCredentials', '用户名或密码错误');
          } else if (data.code === 500) {
            errorMessage = data.msg || this.$t('login.serverError', '服务器错误，请稍后重试');
          }
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Login error登录错误:', error);
        alert('登录失败：' + error.message);
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
      this.usernameOrEmail = remembered;
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
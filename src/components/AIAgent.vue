<template>
  <div class="ai-agent">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title animate-fade-in-up">AI Agent Studio</h1>
        <p class="page-subtitle animate-fade-in-up">
          Create, customize, and deploy your own AI agents with our powerful tools
        </p>
      </div>
    </section>

    <!-- 功能特色 -->
    <section class="section features">
      <div class="container">
        <div class="grid grid-3">
          <div class="card animate-fade-in-up">
            <div class="feature-icon">🤖</div>
            <h3 class="card-title">Custom AI Agents</h3>
            <p class="card-text">
              Build AI agents tailored to your specific creative needs with our intuitive builder.
            </p>
          </div>
          <div class="card animate-fade-in-up">
            <div class="feature-icon">🎨</div>
            <h3 class="card-title">Creative Tools</h3>
            <p class="card-text">
              Access advanced AI tools for image generation, text creation, and artistic enhancement.
            </p>
          </div>
          <div class="card animate-fade-in-up">
            <div class="feature-icon">📚</div>
            <h3 class="card-title">Learning Resources</h3>
            <p class="card-text">
              Comprehensive tutorials and templates to help you master AI-powered creativity.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 工作区域 -->
    <section class="section workspace">
      <div class="container">
        <h2 class="section-title">AI Agent Workspace</h2>
        <div class="workspace-grid">
          <div class="workspace-sidebar">
            <div class="sidebar-section">
              <h3>Agent Templates</h3>
              <div class="template-list">
                <div class="template-item active">
                  <div class="template-icon">🎭</div>
                  <span>Art Generator</span>
                </div>
                <div class="template-item">
                  <div class="template-icon">📝</div>
                  <span>Content Writer</span>
                </div>
                <div class="template-item">
                  <div class="template-icon">🎵</div>
                  <span>Music Creator</span>
                </div>
                <div class="template-item">
                  <div class="template-icon">🎬</div>
                  <span>Video Editor</span>
                </div>
              </div>
            </div>
            <div class="sidebar-section">
              <h3>Quick Actions</h3>
              <div class="action-buttons">
                <button class="action-btn">New Agent</button>
                <button class="action-btn">Import Template</button>
                <button class="action-btn">Save Project</button>
              </div>
            </div>
          </div>
          <div class="workspace-main">
            <div class="workspace-header">
              <h3>Agent Configuration</h3>
              <div class="header-actions">
                <button class="btn btn-secondary">Preview</button>
                <button class="btn btn-primary">Deploy</button>
              </div>
            </div>
            <div class="workspace-content">
              <div class="config-section">
                <h4>Agent Settings</h4>
                <div class="form-group">
                  <label>Agent Name</label>
                  <input type="text" placeholder="Enter agent name" />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea placeholder="Describe your agent's purpose"></textarea>
                </div>
                <div class="form-group">
                  <label>Agent Type</label>
                  <select>
                    <option>Art Generator</option>
                    <option>Content Writer</option>
                    <option>Music Creator</option>
                    <option>Video Editor</option>
                  </select>
                </div>
              </div>
              <div class="config-section">
                <h4>AI Parameters</h4>
                <div class="parameter-grid">
                  <div class="parameter-item">
                    <label>Creativity Level</label>
                    <input type="range" min="0" max="100" value="70" />
                    <span>70%</span>
                  </div>
                  <div class="parameter-item">
                    <label>Response Speed</label>
                    <input type="range" min="0" max="100" value="85" />
                    <span>85%</span>
                  </div>
                  <div class="parameter-item">
                    <label>Quality Focus</label>
                    <input type="range" min="0" max="100" value="90" />
                    <span>90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 示例展示 -->
    <section class="section examples">
      <div class="container">
        <h2 class="section-title">AI Agent Examples</h2>
        <p class="section-subtitle">See what others have created with our platform</p>
        <div class="grid grid-2">
          <div class="example-card">
            <div class="example-image">
              <div class="placeholder-image">🎨</div>
            </div>
            <div class="example-content">
              <h3>Labubu Art Generator</h3>
              <p>Creates unique Labubu-style artwork with custom themes and colors</p>
              <div class="example-stats">
                <span class="stat">⚡ Fast</span>
                <span class="stat">🎯 Accurate</span>
                <span class="stat">🎨 Creative</span>
              </div>
            </div>
          </div>
          <div class="example-card">
            <div class="example-image">
              <div class="placeholder-image">📝</div>
            </div>
            <div class="example-content">
              <h3>Story Writer Agent</h3>
              <p>Generates engaging stories and narratives featuring Labubu characters</p>
              <div class="example-stats">
                <span class="stat">📚 Rich</span>
                <span class="stat">💫 Imaginative</span>
                <span class="stat">🎭 Engaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AIAgent',
  data() {
    return {
      // 组件数据
    }
  },
  mounted() {
    // 页面加载时的初始化
    this.initializeAnimations()
  },
  methods: {
    initializeAnimations() {
      // 初始化动画效果
      const elements = document.querySelectorAll('.animate-fade-in-up')
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-fade-in-up')
        }, index * 100)
      })
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.page-header {
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  color: white;
  padding: 8rem 0 4rem;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8));
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 1.5rem;
  text-align: center;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 特色功能样式 */
.features {
  padding: 4rem 0;
  background: #3a3a3a;
}

.features .card {
  background: #2d2d2d;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #404040;
}

.features .card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

/* 工作区域样式 */
.workspace {
  padding: 4rem 0;
  background: #2d2d2d;
}

.workspace-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.workspace-sidebar {
  background: #3a3a3a;
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  background: #4a4a4a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.template-item.active {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  color: white;
}

.template-icon {
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.workspace-main {
  background: #2d2d2d;
  border-radius: 20px;
  border: 1px solid #404040;
  overflow: hidden;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #3a3a3a;
  border-bottom: 1px solid #404040;
}

.workspace-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #e0e0e0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.workspace-content {
  padding: 2rem;
}

.config-section {
  margin-bottom: 2rem;
}

.config-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #b0b0b0;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #555;
  border-radius: 10px;
  font-size: 1rem;
  background: #3a3a3a;
  color: #e0e0e0;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff6b6b;
}

.parameter-grid {
  display: grid;
  gap: 1.5rem;
}

.parameter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.parameter-item label {
  flex: 1;
  font-weight: 500;
  color: #b0b0b0;
}

.parameter-item input[type="range"] {
  flex: 2;
  height: 6px;
  background: #555;
  border-radius: 3px;
  outline: none;
}

.parameter-item input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  cursor: pointer;
}

.parameter-item span {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #e0e0e0;
}

/* 示例展示样式 */
.examples {
  padding: 4rem 0;
  background: #3a3a3a;
}

.example-card {
  background: #2d2d2d;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.example-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.example-image {
  text-align: center;
  margin-bottom: 1.5rem;
}

.placeholder-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}

.example-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.example-content p {
  color: #b0b0b0;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.example-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 按钮样式 */
.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.btn-secondary:hover {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  color: white;
  transform: translateY(-3px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.2rem;
  }
  
  .workspace-grid {
    grid-template-columns: 1fr;
  }
  
  .workspace-sidebar {
    order: 2;
  }
  
  .parameter-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .parameter-item input[type="range"] {
    width: 100%;
  }
}
</style> 
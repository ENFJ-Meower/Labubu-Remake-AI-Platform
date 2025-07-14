// Message notification utility class消息提示工具类
class MessageUtil {
  constructor() {
    this.container = null // Container DOM element容器DOM元素
    this.messageQueue = [] // Queue for pending messages待处理消息队列
    this.isProcessing = false // Processing flag处理标志
    this.init() // Initialize the utility初始化工具
  }

  // Initialize message container初始化消息容器
  init() {
    // Create message container DOM element创建消息容器DOM元素
    this.container = document.createElement('div')
    this.container.id = 'message-container'
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `
    document.body.appendChild(this.container) // Append to body添加到body
  }

  // Show message with specified type and duration显示指定类型和持续时间的消息
  show(message, type = 'info', duration = 3000) {
    const messageElement = this.createMessage(message, type) // Create message element创建消息元素
    this.container.appendChild(messageElement) // Add to container添加到容器

    // Show animation显示动画
    setTimeout(() => {
      messageElement.style.transform = 'translateX(0)' // Slide in from right从右侧滑入
      messageElement.style.opacity = '1' // Fade in淡入
    }, 10)

    // Auto hide after duration持续时间后自动隐藏
    setTimeout(() => {
      this.hideMessage(messageElement)
    }, duration)

    return messageElement // Return element for further manipulation返回元素以便进一步操作
  }

  // Create message DOM element创建消息DOM元素
  createMessage(message, type) {
    const messageElement = document.createElement('div') // Create div element创建div元素
    messageElement.className = `message-toast message-${type}` // Set CSS classes设置CSS类
    
    // Color schemes for different message types不同消息类型的颜色方案
    const colors = {
      success: { bg: 'linear-gradient(45deg, #4caf50, #8bc34a)', icon: '✅' }, // Green gradient绿色渐变
      error: { bg: 'linear-gradient(45deg, #f44336, #e91e63)', icon: '❌' }, // Red gradient红色渐变
      warning: { bg: 'linear-gradient(45deg, #ff9800, #ffc107)', icon: '⚠️' }, // Orange gradient橙色渐变
      info: { bg: 'linear-gradient(45deg, #2196f3, #03a9f4)', icon: 'ℹ️' } // Blue gradient蓝色渐变
    }

    const config = colors[type] || colors.info // Get color config or default to info获取颜色配置或默认为info

    // Apply styles to message element为消息元素应用样式
    messageElement.style.cssText = `
      background: ${config.bg};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: auto;
      font-size: 14px;
      font-weight: 500;
      max-width: 350px;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      gap: 8px;
    `

    // Set message content设置消息内容
    messageElement.innerHTML = `
      <span class="message-icon">${config.icon}</span>
      <span class="message-text">${message}</span>
      <button class="message-close" onclick="this.parentElement.style.transform='translateX(100%)'; setTimeout(() => this.parentElement.remove(), 300)">×</button>
    `

    // Style the close button设置关闭按钮样式
    const closeBtn = messageElement.querySelector('.message-close')
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin-left: auto;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    `

    // Add hover effects for close button为关闭按钮添加悬停效果
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)' // Lighten on hover悬停时变亮
    })

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none' // Reset background重置背景
    })

    return messageElement // Return configured element返回配置好的元素
  }

  // Hide message with animation隐藏消息并播放动画
  hideMessage(messageElement) {
    messageElement.style.transform = 'translateX(100%)' // Slide out to right滑出到右侧
    messageElement.style.opacity = '0' // Fade out淡出
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement) // Remove from DOM从DOM中移除
      }
    }, 300) // Wait for animation to complete等待动画完成
  }

  // Show success message显示成功消息
  success(message, duration = 3000) {
    return this.show(message, 'success', duration)
  }

  // Show error message显示错误消息
  error(message, duration = 5000) {
    return this.show(message, 'error', duration)
  }

  // Show warning message显示警告消息
  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration)
  }

  // Show info message显示信息消息
  info(message, duration = 3000) {
    return this.show(message, 'info', duration)
  }

  // Clear all messages清除所有消息
  clear() {
    const messages = this.container.querySelectorAll('.message-toast') // Get all message elements获取所有消息元素
    messages.forEach(msg => this.hideMessage(msg)) // Hide each message隐藏每个消息
  }
}

// Create global instance创建全局实例
const messageUtil = new MessageUtil()

// Export methods导出方法
export default {
  success: (message, duration) => messageUtil.success(message, duration), // Export success method导出成功方法
  error: (message, duration) => messageUtil.error(message, duration), // Export error method导出错误方法
  warning: (message, duration) => messageUtil.warning(message, duration), // Export warning method导出警告方法
  info: (message, duration) => messageUtil.info(message, duration), // Export info method导出信息方法
  clear: () => messageUtil.clear() // Export clear method导出清除方法
} 
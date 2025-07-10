import { reactive, ref } from 'vue'

// 语言配置
const LANGUAGES = {
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸'
  },
  zh: {
    name: '中文',
    code: 'zh',
    flag: '🇨🇳'
  }
}

// 默认语言
const DEFAULT_LANGUAGE = 'en'

// 当前语言状态
const currentLanguage = ref(DEFAULT_LANGUAGE)

// 翻译资源
const translations = reactive({
  en: {
    // 导航
    nav: {
      home: 'Home',
      aiAgent: 'AI Agent',
      community: 'Community',
      marketplace: 'Marketplace',
      about: 'About',
      login: 'Login',
      register: 'Register'
    },
    // 通用
    common: {
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      close: 'Close',
      copy: 'Copy',
      regenerate: 'Regenerate',
      upload: 'Upload',
      download: 'Download',
      preview: 'Preview',
      send: 'Send',
      clear: 'Clear',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language'
    },
    // 首页
    home: {
      title: 'Welcome to Labubu AI Platform',
      subtitle: 'Create, Share, and Explore AI-Generated Content',
      startChat: 'Start Chat',
      learnMore: 'Learn More',
      features: {
        aiAgent: 'AI Agent Studio',
        community: 'Creative Community',
        marketplace: 'Digital Marketplace'
      },
      descriptions: {
        aiAgent: 'Build and customize intelligent AI agents with our intuitive drag-and-drop workflow editor. Create personalized chatbots, automate complex tasks, and integrate multiple AI services including LLM, image generation, speech synthesis, and more. Perfect for businesses, creators, and developers.',
        community: 'Join a vibrant community of creators, artists, and AI enthusiasts. Share your creations, discover amazing works, participate in challenges, collaborate on projects, and learn from fellow creators. Connect, inspire, and be inspired in our creative ecosystem.',
        marketplace: 'Discover and trade unique digital creations, custom AI agents, templates, and creative assets. Buy professional tools, sell your innovations, commission custom work, and find everything you need to enhance your creative projects in our secure marketplace.',
        about: 'Labubu AI Platform is the ultimate creative ecosystem that combines cutting-edge AI technology with community collaboration. We empower creators to build, share, and monetize their innovations while fostering a supportive environment for learning and growth.'
      },
      contact: {
        title: 'Get in Touch',
        subtitle: 'Ready to start your creative journey? We\'re here to help!',
        support: 'Contact Support',
        discord: 'Join Discord'
      }
    },
    // 聊天系统
    chat: {
      title: 'AI Chat',
      placeholder: 'Enter your message...',
      welcomeMessage: 'Hello! I am your AI assistant, happy to serve you.',
      aiThinking: 'AI is thinking...',
      regeneratingResponse: 'Regenerating response...',
      failedToRegenerate: 'Failed to regenerate. Please try again.',
      uploadFile: 'Upload File',
      voiceInput: 'Voice Input',
      fileUpload: {
        image: 'Image',
        audio: 'Audio',
        document: 'Document',
        uploading: 'Uploading',
        uploadFailed: 'Upload failed',
        fileSizeExceeds: 'File size exceeds limit',
        fileTypeNotSupported: 'File type not supported'
      },
      status: {
        online: 'Online',
        offline: 'Offline',
        connecting: 'Connecting...'
      },
      suggestions: [
        'Hello, can you introduce your features?',
        'Help me analyze this problem',
        'What can you help me with?',
        'Give me some suggestions'
      ]
    },
    // AI Agent
    aiAgent: {
      title: 'AI Agent Studio',
      subtitle: 'Professional AI Agent Building Platform',
      tabs: {
        basic: 'Basic Info',
        prompt: 'Prompt Builder',
        knowledge: 'Knowledge Base',
        workflow: 'Workflow',
        multimodal: 'Multimodal',
        model: 'Model Config',
        test: 'Test & Deploy'
      },
      actions: {
        saveAgent: 'Save Agent',
        testAgent: 'Test Agent',
        deployAgent: 'Deploy Agent',
        createNew: 'Create New Agent'
      },
      features: {
        workflow: 'Visual Workflow Editor',
        multimodal: 'Multi-AI Integration',
        automation: 'Task Automation'
      },
      workflow: {
        nodeTypes: 'Node Types',
        controlNodes: 'Control Nodes',
        aiServices: 'AI Services',
        toolNodes: 'Tool Nodes',
        startDesc: 'Workflow Start',
        endDesc: 'Workflow End',
        conditionDesc: 'Condition Logic',
        llmDesc: 'Large Language Model',
        sttDesc: 'Speech to Text',
        ttsDesc: 'Text to Speech',
        pic2textDesc: 'Image to Text',
        text2picDesc: 'Text to Image',
        processDesc: 'Data Processing',
        transformDesc: 'Data Transform',
        nodeConfiguration: 'Node Configuration',
        nodeName: 'Node Name',
        nodeNamePlaceholder: 'Enter node name',
        nodeDescription: 'Node Description',
        nodeDescPlaceholder: 'Describe node function',
        serviceType: 'Service Type',
        selectServiceType: 'Select Service Type',
        llmService: 'Large Language Model',
        sttService: 'Speech to Text',
        ttsService: 'Text to Speech',
        pic2textService: 'Image to Text',
        text2picService: 'Text to Image',
        nodePrompt: 'Node Prompt',
        llmModel: 'LLM Model',
        temperature: 'Temperature',
        conservative: 'Conservative',
        creative: 'Creative',
        voiceType: 'Voice Type',
        language: 'Language',
        imageSize: 'Image Size',
        imageStyle: 'Image Style',
        conditionExpression: 'Condition Expression',
        conditionPlaceholder: 'e.g. result.length > 0',
        inputOutput: 'Input/Output',
        inputPorts: 'Input Ports',
        outputPorts: 'Output Ports',
        addInput: 'Add Input',
        addOutput: 'Add Output',
        saveConfig: 'Save Config',
        validateConfig: 'Validate Config',
        nameRequired: 'Node name is required',
        serviceRequired: 'Please select service type',
        promptRequired: 'Please configure node prompt',
        conditionRequired: 'Please configure condition expression',
        configSaved: 'Node configuration saved',
        workflowSaved: 'Workflow saved',
        saveFailed: 'Failed to save workflow',
        testStarted: 'Workflow test started',
        testFailed: 'Failed to test workflow',
        deploySuccess: 'Workflow deployed successfully',
        deployFailed: 'Failed to deploy workflow',
        startNodeRequired: 'Workflow must contain start node',
        endNodeRequired: 'Workflow must contain end node',
        nodeConfigIncomplete: 'Node configuration incomplete',
        nodes: 'Nodes',
        connections: 'Connections',
        status: 'Status',
        clearCanvas: 'Clear Canvas',
        saveWorkflow: 'Save Workflow',
        testWorkflow: 'Test Workflow',
        deployWorkflow: 'Deploy',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        resetZoom: 'Reset Zoom',
        fitToScreen: 'Fit to Screen'
      }
    },
    // 社区
    community: {
      title: 'Creative Community',
      subtitle: 'Share your creativity with the world',
      tabs: {
        feed: 'Feed',
        gallery: 'Gallery',
        events: 'Events',
        groups: 'Groups'
      },
      actions: {
        createPost: 'Create Post',
        like: 'Like',
        comment: 'Comment',
        share: 'Share',
        follow: 'Follow',
        joinGroup: 'Join Group',
        leaveGroup: 'Leave Group'
      },
      features: {
        connect: 'Creator Network',
        challenges: 'Creative Challenges',
        showcase: 'Portfolio Showcase'
      }
    },
    // 市场
    marketplace: {
      title: 'Creative Marketplace',
      subtitle: 'Discover and trade digital creations',
      categories: {
        artworks: 'Artworks',
        music: 'Music',
        videos: 'Videos',
        tools: 'Tools'
      },
      actions: {
        buy: 'Buy',
        sell: 'Sell',
        addToCart: 'Add to Cart',
        checkout: 'Checkout'
      },
      features: {
        assets: 'Digital Assets',
        secure: 'Secure Trading',
        monetize: 'Monetize Creations'
      }
    },
    // 关于
    about: {
      title: 'About Labubu AI Platform',
      subtitle: 'Learn more about our platform and mission',
      sections: {
        mission: 'Our Mission',
        features: 'Key Features',
        technology: 'Technology Stack',
        team: 'Our Team'
      },
      features: {
        innovation: 'AI Innovation',
        collaboration: 'Community Spirit',
        growth: 'Creator Growth'
      }
    },
    // 登录
    login: {
      title: 'LABUBU AI',
      username: 'Username',
      password: 'Password',
      usernamePlaceholder: 'Enter username',
      passwordPlaceholder: 'Enter password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginButton: 'Login',
      noAccount: 'Don\'t have an account?',
      registerNow: 'Register now',
      passwordError: 'Password must be at least 8 characters with letters and special characters',
      forgotMessage: 'Please contact admin to reset password.',
      registerMessage: 'Registration feature is not yet open.'
    },
    // 注册
    register: {
      title: 'Create New Account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      verificationCode: 'Verification Code',
      usernamePlaceholder: 'Enter username',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Enter password again',
      codePlaceholder: 'Enter verification code',
      getCode: 'Get Code',
      registerButton: 'Register',
      hasAccount: 'Already have an account?',
      goLogin: 'Go to login',
      completeInfo: 'Please fill in complete information',
      usernameError: 'Username must be 4-20 characters (letters, numbers, or underscores)',
      emailError: 'Please enter a valid email address',
      passwordError: 'Password must be at least 8 characters with letters and special characters',
      confirmError: 'The two passwords do not match',
      codeError: 'Please enter verification code',
      registerSuccess: 'Registration feature is pending backend integration, form validation passed!'
    }
  },
  zh: {
    // 导航
    nav: {
      home: '首页',
      aiAgent: 'AI智能体',
      community: '社区',
      marketplace: '市场',
      about: '关于',
      login: '登录',
      register: '注册'
    },
    // 通用
    common: {
      back: '返回',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      submit: '提交',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
      close: '关闭',
      copy: '复制',
      regenerate: '重新生成',
      upload: '上传',
      download: '下载',
      preview: '预览',
      send: '发送',
      clear: '清除',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      language: '语言'
    },
    // 首页
    home: {
      title: '欢迎来到Labubu AI平台',
      subtitle: '创造、分享和探索AI生成内容',
      startChat: '开始对话',
      learnMore: '了解更多',
      features: {
        aiAgent: 'AI智能体工作室',
        community: '创意社区',
        marketplace: '数字市场'
      },
      descriptions: {
        aiAgent: '使用我们直观的拖拽式工作流编辑器构建和定制智能AI代理。创建个性化聊天机器人，自动化复杂任务，整合多种AI服务包括大语言模型、图像生成、语音合成等。适合企业、创作者和开发者使用。',
        community: '加入由创作者、艺术家和AI爱好者组成的活跃社区。分享您的创作，发现精彩作品，参与挑战赛，协作项目，向同行学习。在我们的创意生态系统中连接、启发并获得灵感。',
        marketplace: '探索和交易独特的数字创作、定制AI代理、模板和创意资产。购买专业工具，出售您的创新作品，委托定制工作，在我们安全的市场中找到增强创意项目所需的一切。',
        about: 'Labubu AI平台是结合前沿AI技术与社区协作的终极创意生态系统。我们赋能创作者构建、分享和变现他们的创新，同时营造支持学习和成长的环境。'
      },
      contact: {
        title: '联系我们',
        subtitle: '准备开始您的创意之旅了吗？我们随时为您提供帮助！',
        support: '联系支持',
        discord: '加入Discord'
      }
    },
    // 聊天系统
    chat: {
      title: 'AI对话',
      placeholder: '输入您的消息...',
      welcomeMessage: '您好！我是您的AI助手，很高兴为您服务。',
      aiThinking: 'AI正在思考...',
      regeneratingResponse: '正在重新生成回复...',
      failedToRegenerate: '重新生成失败，请重试。',
      uploadFile: '上传文件',
      voiceInput: '语音输入',
      fileUpload: {
        image: '图片',
        audio: '音频',
        document: '文档',
        uploading: '上传中',
        uploadFailed: '上传失败',
        fileSizeExceeds: '文件大小超出限制',
        fileTypeNotSupported: '不支持的文件类型'
      },
      status: {
        online: '在线',
        offline: '离线',
        connecting: '连接中...'
      },
      suggestions: [
        '您好，可以介绍一下您的功能吗？',
        '帮我分析这个问题',
        '您能帮我做什么？',
        '给我一些建议'
      ]
    },
    // AI Agent
    aiAgent: {
      title: 'AI智能体工作室',
      subtitle: '专业的AI智能体构建平台',
      tabs: {
        basic: '基础信息',
        prompt: '提示词构建',
        knowledge: '知识库',
        workflow: '工作流',
        multimodal: '多模态',
        model: '模型配置',
        test: '测试与部署'
      },
      actions: {
        saveAgent: '保存智能体',
        testAgent: '测试智能体',
        deployAgent: '部署智能体',
        createNew: '创建新智能体'
      },
      features: {
        workflow: '可视化工作流编辑',
        multimodal: '多AI服务集成',
        automation: '任务自动化'
      },
      workflow: {
        nodeTypes: '节点类型',
        controlNodes: '控制节点',
        aiServices: 'AI服务',
        toolNodes: '工具节点',
        startDesc: '工作流开始',
        endDesc: '工作流结束',
        conditionDesc: '条件判断',
        llmDesc: '大语言模型',
        sttDesc: '语音转文字',
        ttsDesc: '文字转语音',
        pic2textDesc: '图片转文字',
        text2picDesc: '文字转图片',
        processDesc: '数据处理',
        transformDesc: '数据转换',
        nodeConfiguration: '节点配置',
        nodeName: '节点名称',
        nodeNamePlaceholder: '输入节点名称',
        nodeDescription: '节点描述',
        nodeDescPlaceholder: '描述节点功能',
        serviceType: '服务类型',
        selectServiceType: '选择服务类型',
        llmService: '大语言模型',
        sttService: '语音转文字',
        ttsService: '文字转语音',
        pic2textService: '图片转文字',
        text2picService: '文字转图片',
        nodePrompt: '节点提示词',
        llmModel: 'LLM模型',
        temperature: '温度值',
        conservative: '保守',
        creative: '创造',
        voiceType: '语音类型',
        language: '语言',
        imageSize: '图片尺寸',
        imageStyle: '图片风格',
        conditionExpression: '条件表达式',
        conditionPlaceholder: '例如：result.length > 0',
        inputOutput: '输入输出',
        inputPorts: '输入端口',
        outputPorts: '输出端口',
        addInput: '添加输入',
        addOutput: '添加输出',
        saveConfig: '保存配置',
        validateConfig: '验证配置',
        nameRequired: '节点名称不能为空',
        serviceRequired: '请选择服务类型',
        promptRequired: '请配置节点提示词',
        conditionRequired: '请配置条件表达式',
        configSaved: '节点配置已保存',
        workflowSaved: '工作流已保存',
        saveFailed: '保存工作流失败',
        testStarted: '工作流测试已启动',
        testFailed: '测试工作流失败',
        deploySuccess: '工作流部署成功',
        deployFailed: '部署工作流失败',
        startNodeRequired: '工作流必须包含开始节点',
        endNodeRequired: '工作流必须包含结束节点',
        nodeConfigIncomplete: '节点配置不完整',
        nodes: '节点',
        connections: '连接',
        status: '状态',
        clearCanvas: '清空画布',
        saveWorkflow: '保存工作流',
        testWorkflow: '测试运行',
        deployWorkflow: '部署',
        zoomIn: '放大',
        zoomOut: '缩小',
        resetZoom: '重置缩放',
        fitToScreen: '适合屏幕'
      }
    },
    // 社区
    community: {
      title: '创意社区',
      subtitle: '与世界分享您的创意',
      tabs: {
        feed: '动态',
        gallery: '作品集',
        events: '活动',
        groups: '群组'
      },
      actions: {
        createPost: '发布动态',
        like: '点赞',
        comment: '评论',
        share: '分享',
        follow: '关注',
        joinGroup: '加入群组',
        leaveGroup: '退出群组'
      },
      features: {
        connect: '创作者网络',
        challenges: '创意挑战赛',
        showcase: '作品展示'
      }
    },
    // 市场
    marketplace: {
      title: '创意市场',
      subtitle: '发现和交易数字创作',
      categories: {
        artworks: '艺术作品',
        music: '音乐',
        videos: '视频',
        tools: '工具'
      },
      actions: {
        buy: '购买',
        sell: '出售',
        addToCart: '加入购物车',
        checkout: '结算'
      },
      features: {
        assets: '数字资产',
        secure: '安全交易',
        monetize: '作品变现'
      }
    },
    // 关于
    about: {
      title: '关于Labubu AI平台',
      subtitle: '了解我们的平台和使命',
      sections: {
        mission: '我们的使命',
        features: '核心功能',
        technology: '技术栈',
        team: '我们的团队'
      },
      features: {
        innovation: 'AI创新技术',
        collaboration: '社区协作',
        growth: '创作者成长'
      }
    },
    // 登录
    login: {
      title: 'LABUBU AI',
      username: '用户名',
      password: '密码',
      usernamePlaceholder: '请输入用户名',
      passwordPlaceholder: '请输入密码',
      rememberMe: '记住我',
      forgotPassword: '忘记密码？',
      loginButton: '登录',
      noAccount: '还没有账号？',
      registerNow: '注册新账号',
      passwordError: '密码需至少8位，且包含英文和特殊字符',
      forgotMessage: '请联系管理员重置密码。',
      registerMessage: '注册功能暂未开放。'
    },
    // 注册
    register: {
      title: '注册新账号',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      verificationCode: '验证码',
      usernamePlaceholder: '请输入用户名',
      emailPlaceholder: '请输入邮箱',
      passwordPlaceholder: '请输入密码',
      confirmPasswordPlaceholder: '请再次输入密码',
      codePlaceholder: '请输入验证码',
      getCode: '获取验证码',
      registerButton: '注册',
      hasAccount: '已有账号？',
      goLogin: '去登录',
      completeInfo: '请填写完整信息',
      usernameError: '用户名需为4-20位字母、数字或下划线',
      emailError: '请输入有效的邮箱地址',
      passwordError: '密码需至少8位，且包含英文和特殊字符',
      confirmError: '两次输入的密码不一致',
      codeError: '请输入验证码',
      registerSuccess: '注册功能待接入后端，表单校验通过！'
    }
  }
})

// 语言管理类
class LanguageManager {
  constructor() {
    this.translations = translations
    this.init()
  }

  init() {
    // 从本地存储加载语言设置
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      currentLanguage.value = savedLanguage
    } else {
      // 检测浏览器语言
      const browserLanguage = navigator.language || navigator.userLanguage
      if (browserLanguage.startsWith('zh')) {
        currentLanguage.value = 'zh'
      } else {
        currentLanguage.value = 'en'
      }
    }
  }

  getCurrentLanguage() {
    return currentLanguage.value
  }

  setLanguage(lang) {
    if (LANGUAGES[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }

  getLanguages() {
    return LANGUAGES
  }

  t(key, defaultValue = '') {
    const keys = key.split('.')
    let value = translations[currentLanguage.value]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    return value || defaultValue || key
  }

  // 检查是否为中文
  isZh() {
    return currentLanguage.value === 'zh'
  }

  // 检查是否为英文
  isEn() {
    return currentLanguage.value === 'en'
  }
}

// 创建全局语言管理实例
const languageManager = new LanguageManager()

// 导出
export { languageManager, currentLanguage, LANGUAGES }
export default languageManager 
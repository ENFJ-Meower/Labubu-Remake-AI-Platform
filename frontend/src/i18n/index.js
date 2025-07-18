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
      profile: 'Profile',
      about: 'About',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      logoutSuccess: 'Successfully logged out'
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
      buildAgent: 'Build Agent',
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
      },
      team: {
        title: 'Our Team',
        subtitle: 'A passionate innovation team dedicated to building the best AI creative platform',
        photoPlaceholder: 'Team photo coming soon...',
        descriptionTitle: 'About Us',
        descriptionPlaceholder: 'We are a team of 5 innovative members focused on the perfect combination of AI technology and creativity. Each member brings unique professional skills and innovative perspectives, working together to create a revolutionary AI creative platform. Team description coming soon...',
        membersTitle: 'Team Members',
        rolePlaceholder: 'Role to be updated',
        memberPlaceholder: 'Personal introduction coming soon...'
      }
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
        test: 'Test & Deploy',
        workflowDesign: 'Workflow Design',
        workflowDesignDesc: 'Visual DAG workflow editor - Core feature',
        workflowManagement: 'Workflow Management',
        workflowManagementDesc: 'View and manage all DAG workflows'
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

        conditionDesc: 'Condition Logic',
        llmDesc: 'Large Language Model Text Processing',
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
        nodePromptPlaceholder: 'Enter node prompt...',
        promptTipsSimple: 'Prompt guides AI on how to process input data',
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
        saveConfig: 'Save',
        validateConfig: 'Validate',
        nameRequired: 'Node name is required',
        serviceRequired: 'Please select service type',
        promptRequired: 'Please configure node prompt',
        conditionRequired: 'Please configure condition expression',
        configSaved: 'Node configuration saved',
        configValid: 'Configuration validation passed!',
        noNodeSelected: 'Please select a node first',
        workflowSaved: 'Workflow saved',
        saveFailed: 'Failed to save workflow',
        testStarted: 'Workflow test started',
        testFailed: 'Failed to test workflow',
        deploySuccess: 'Workflow deployed and saved to records successfully',
        deployFailed: 'Failed to deploy workflow',

        // 默认提示词
        defaultPrompts: {
          condition: 'Evaluate the input content and return true or false based on the condition.',
          llm: 'Please provide a helpful response based on the input content, keeping it accurate, concise, and useful.',
          stt: 'Please accurately convert the audio to text, maintaining natural sentence structure and proper punctuation.',
          tts: 'Please read the text in a natural, clear voice with appropriate speed and natural intonation.',
          pic2text: 'Please recognize all text content in the image, maintaining the original layout structure and accurately extracting text information.',
          text2pic: 'Generate a high-quality image based on the description with reasonable composition, harmonious colors, and rich details.',
          process: 'Process and analyze the input data, extract useful information and organize the output.',
          transform: 'Transform the input data to the specified format while maintaining data integrity and accuracy.'
        },

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
        fitToScreen: 'Fit to Screen',
        // 节点名称
        conditionNode: 'Condition',
        llmNode: 'LLM',
        sttNode: 'STT',
        ttsNode: 'TTS',
        pic2textNode: 'Pic2Text',
        text2picNode: 'Text2Pic',
        processNode: 'Process',
        transformNode: 'Transform',
        // 连接点
        inputPort: 'IN',
        outputPort: 'OUT',
        // 模型选项
        models: {
          gpt4: 'GPT-4',
          gpt35turbo: 'GPT-3.5 Turbo',
          claude3: 'Claude-3',
          llama2: 'Llama-2',
          whisper1: 'Whisper-1',
          tts1: 'TTS-1',
          tts1hd: 'TTS-1-HD',
          dalle3: 'DALL-E 3',
          dalle2: 'DALL-E 2'
        },
        // 语音选项
        voices: {
          alloy: 'Alloy',
          echo: 'Echo',
          fable: 'Fable',
          onyx: 'Onyx',
          nova: 'Nova',
          shimmer: 'Shimmer'
        },
        // 语言选项
        languages: {
          chinese: 'Chinese',
          english: 'English',
          japanese: 'Japanese',
          korean: 'Korean'
        },
        // 格式选项
        formats: {
          mp3: 'MP3',
          opus: 'Opus',
          aac: 'AAC',
          flac: 'FLAC',
          wav: 'WAV',
          pcm: 'PCM',
          json: 'JSON',
          text: 'Text',
          srt: 'SRT',
          verboseJson: 'Verbose JSON',
          vtt: 'VTT',
          plainText: 'Plain Text',
          markdown: 'Markdown',
          url: 'URL Link',
          base64: 'Base64 Encoded'
        },
        // 配置标签
        labels: {
          maxTokens: 'Max Tokens',
          topP: 'Top P',
          ttsModel: 'TTS Model',
          audioFormat: 'Audio Format',
          speechSpeed: 'Speech Speed',
          sttModel: 'STT Model',
          responseFormat: 'Response Format',
          recognitionLanguage: 'Recognition Language',
          outputFormat: 'Output Format',
          detailLevel: 'Detail Level',
          imageModel: 'Image Model',
          imageCount: 'Image Count',
          userIdentifier: 'User Identifier',
          conditionExpression: 'Condition Expression',
          retryCount: 'Retry Count',
          retryInterval: 'Retry Interval (ms)',
          timeoutSeconds: 'Timeout (s)',
          errorHandling: 'Error Handling',
          fallbackValue: 'Fallback Value',
          portName: 'Port Name',
          dataType: 'Data Type'
        },
        // 帮助文本
        helpTexts: {
          stopSequences: 'LLM will stop generating when encountering these sequences, one per line',
          userIdForMonitoring: 'For monitoring and abuse prevention, recommend using UUID',
          logitBias: 'Adjust probability of specific tokens, JSON object format',
          audioFormatHelp: 'Choose audio output format, affects file size and quality',
          maxTokensHelp: 'Limit maximum length of output text',
          conditionHelp: 'Supports JavaScript expressions, can reference input data using variable names',
          retryHelp: 'Number of retries when node execution fails',
          retryIntervalHelp: 'Wait time between retries',
          timeoutHelp: 'Maximum wait time for node execution',
          errorHandlingHelp: 'Choose how to handle errors',
          fallbackHelp: 'Default value to use when node execution fails',
          imageCountHelp: 'Number of images to generate at once, DALL-E 3 supports max 1',
          userIdImageHelp: 'For monitoring and abuse prevention, recommend using UUID'
        },
        // 尺寸选项
        imageSizes: {
          size256: '256x256',
          size512: '512x512',
          size1024: '1024x1024',
          size1792x1024: '1792x1024 (Landscape)',
          size1024x1792: '1024x1792 (Portrait)'
        },
        // 数据类型
        dataTypes: {
          text: 'Text',
          image: 'Image',
          audio: 'Audio',
          file: 'File',
          json: 'JSON'
        },
        // 错误处理选项
        errorHandlingOptions: {
          stop: 'Stop Workflow',
          continue: 'Continue Execution',
          retry: 'Retry Execution',
          fallback: 'Use Fallback Value'
        },
        // 详细程度选项
        detailLevels: {
          low: 'Low - Fast Processing',
          high: 'High - Detailed Analysis',
          auto: 'Auto - Smart Selection'
        },
        // 环境选项
        environments: {
          development: 'Development',
          testing: 'Testing',
          production: 'Production'
        },
        // 页面标题和描述
        workflowManagement: {
          title: 'Workflow Management',
          description: 'View and manage all your DAG workflows',
          runningLabel: 'Running',
          totalWorkflows: 'Total Workflows',
          runningWorkflows: 'Running',
          completedWorkflows: 'Completed',
          failedWorkflows: 'Failed',
          searchPlaceholder: 'Search workflows...',
          refresh: 'Refresh',
          noWorkflows: 'No Workflows',
          noWorkflowsDescription: 'You haven\'t created any workflows yet. Start designing your first workflow!',
          createWorkflow: 'Create Workflow',
          nodeCount: 'Node Count:',
          createdAt: 'Created At:',
          viewStatus: 'View Status',
          viewResults: 'View Results',
          clone: 'Clone',
          deleteWorkflow: 'Delete',
          loading: 'Loading workflow list...',
          loadError: 'Load Failed',
          retry: 'Retry',
          close: 'Close',
          refreshStatus: 'Refresh Status',
          refreshStatusFailed: 'Failed to refresh status'
        },
        inputData: 'Input Data Configuration',
        inputContent: 'Input Content',
        inputTextPlaceholder: 'Enter text content...',
        uploadImage: 'Upload Image',
        uploadAudio: 'Upload Audio',
        uploadFile: 'Upload File',
        clickToUpload: 'Click to upload image',
        clickToUploadAudio: 'Click to upload audio',
        clickToUploadFile: 'Click to upload file',
        supportedFormats: 'Supports JPG, PNG, GIF, BMP, WEBP, SVG formats, auto-converted to JPEG',
        audioFormats: 'Supports MP3, WAV, OGG formats, auto-set to WAV format',
        inputJson: 'JSON Data',
        jsonPlaceholder: 'Enter JSON format data...',
        jsonHint: 'Please enter valid JSON format data',
        configurationPanel: 'Configuration Panel',
        selectNodeToConfig: 'Select Node to Configure',
        configInstructions: 'Please follow these steps:',
        step1: 'Drag nodes from left sidebar to canvas',
        step2: 'Click on a node to select it',
        step2Detail: 'Click the node itself, not the connection points',
        step3: 'Configure node parameters here',
        step4: 'Set input data (text, images, etc.)',
        step4Detail: 'Input in the "Input Data Configuration" section below',
        tipInputLocation: 'Input Text Location: After selecting a node, scroll down to find the "Input Data Configuration" section',
        tip1: 'LLM nodes accept text input, can process other formats through workflow connections',
        tip2: 'Drag connection points to create data flows',
        tip3: 'Test and deploy workflow after configuration',

        // 快捷键
        shortcuts: {
          keyboardGuide: 'Keyboard Shortcuts Guide',
          editOperations: 'Edit Operations',
          workflowOperations: 'Workflow Operations',
          canvasOperations: 'Canvas Operations',
          undo: 'Undo',
          redo: 'Redo',
          copySelectedNode: 'Copy Selected Node',
          pasteNode: 'Paste Node',
          deleteSelectedNode: 'Delete Selected Node',
          saveWorkflow: 'Save Workflow',
          selectAllNodes: 'Select All Nodes',
          zoomCanvas: 'Zoom Canvas',
          moveCanvas: 'Move Canvas',
          selectNode: 'Select Node',
          dragNode: 'Drag Node',
          mouseWheel: 'Mouse Wheel',
          dragBlankArea: 'Drag Blank Area',
          clickNode: 'Click Node',
          dragToConnect: 'Drag to create connection'
        },
        // 状态值
        statusValues: {
          ready: 'Ready',
          running: 'Running',
          completed: 'Completed',
          failed: 'Failed',
          empty: 'Empty',
          unnamed: 'Unnamed Workflow',
          deployed: 'Deployed',
          pending: 'Pending'
        },
        // 工具栏按钮
        toolbar: {
          clear: 'Clear',
          save: 'Save',
          saveWorkflow: 'Save Workflow',
          testWorkflow: 'Test Workflow',
          deployWorkflow: 'Deploy Workflow',
          redeployWorkflow: 'Redeploy',
          designer: 'Designer',
          dagWorkflow: 'DAG Workflow'
        },
        // 状态筛选器
        statusFilters: {
          all: 'All',
          running: 'Running',
          completed: 'Completed',
          failed: 'Failed',
          pending: 'Pending'
        },
        // 节点描述
        nodeDescriptions: {
          workflowStart: 'Workflow start',
          workflowEnd: 'Workflow end',
          conditionJudgment: 'Condition judgment',
          dataProcessing: 'Data processing',
          dataTransformation: 'Data transformation'
        },
        // 端口配置
        ports: {
          trigger: 'trigger',
          result: 'result',
          input: 'input',
          output: 'output',
          true: 'true',
          false: 'false',
          prompt: 'prompt',
          response: 'response',
          audio: 'audio',
          text: 'text',
          image: 'image'
        },
        // 额外的翻译项
        inputPortsLabel: '🔽 Input:',
        outputPortsLabel: '🔼 Output:',
        generalConfig: 'General Configuration',
        retryCount: 'Retry Count',
        retryCountPlaceholder: '3',
        retryCountHelp: 'Number of retries when node execution fails',
        retryInterval: 'Retry Interval(ms)',
        retryIntervalPlaceholder: '1000',
        retryIntervalHelp: 'Wait time between each retry',
        executionTimeout: 'Execution Timeout(s)',
        executionTimeoutPlaceholder: '30',
        executionTimeoutHelp: 'Maximum wait time for node execution',
        errorHandling: 'Error Handling',
        errorHandlingHelp: 'Choose how to handle errors',
        fallbackValue: 'Fallback Value',
        fallbackValuePlaceholder: 'Default value to use on error',
        fallbackValueHelp: 'Fallback value when node execution fails',
        portNamePlaceholder: 'Port Name',
        portTypes: {
          text: 'Text',
          image: 'Image',
          audio: 'Audio',
          file: 'File',
          json: 'JSON'
        },
        unknown: 'Unknown',
        jsExpressionHelp: 'Supports JavaScript expressions, can reference input data using variable names',
        fromNode: 'From Node',
        toNode: 'To Node',
        connectionConfiguration: 'Connection Configuration',
        connectionPrompt: 'Connection Prompt',
        connectionPromptPlaceholder: 'Enter connection prompt for data transformation during passing...',
        connectionPromptTips: 'Connection prompt defines transformation logic for data passing between nodes, can include variables like {input_data}',
        connectionDescription: 'Connection Description',
        connectionDescPlaceholder: 'Describe this connection\'s purpose...',
        saveConnection: 'Save Connection',
        deleteConnection: 'Delete Connection',
        // 错误消息
        errors: {
          dataTypeIncompatible: 'Data type incompatible: {outputNode} outputs {outputType} type, but {inputNode} only accepts {inputType} type input'
        }
      }
    },
    // 社区
    community: {
      title: 'Creative Community',
      subtitle: 'Share your creativity with the world',
      heroTitle: 'Creative Notes Community',
      heroSubtitle: 'Share your creative ideas and discover more inspiration',
      totalNotes: 'Total Notes',
      todayNotes: 'Today',
      activeTags: 'Active Tags',
      searchPlaceholder: 'Search note content, tags, or authors...',
      trendingTags: 'Trending Tags',
      shareNote: 'Share your creative note...',
      noNotes: 'No Notes',
      noNotesDesc: 'Come and publish your first note!',
      loading: 'Loading...',
      publish: 'Publish Note',
      selectWorkflow: 'Select AI Agent Workflow',
      addComment: 'Add comment...',
      send: 'Send',
      tryWorkflow: 'Try',
      loadMore: 'Load More',
      // Labubu介绍
      labubu: {
        welcomeTitle: 'Welcome to Labubu\'s Creative World!',
        welcomeText: 'Here, every creative idea is as charming and surprising as Labubu. Let\'s explore the infinite possibilities of AI together and light up every corner of the digital world with warm creativity.',
        features: {
          creativity: 'Unlimited Creativity',
          sharing: 'Inspiration Sharing',
          ai: 'AI Powered',
          community: 'Warm Community'
        }
      },
      // 时间显示
      timeAgo: {
        minutesAgo: '{count} minutes ago',
        minuteAgo: '1 minute ago',
        hoursAgo: '{count} hours ago',
        hourAgo: '1 hour ago',
        daysAgo: '{count} days ago',
        dayAgo: '1 day ago',
        weeksAgo: '{count} weeks ago',
        weekAgo: '1 week ago',
        monthsAgo: '{count} months ago',
        monthAgo: '1 month ago',
        yearsAgo: '{count} years ago',
        yearAgo: '1 year ago',
        justNow: 'Just now'
      },
      filters: {
        all: 'All',
        text: 'Text',
        image: 'Image', 
        video: 'Video',
        workflow: 'Workflow'
      },
      noteTypes: {
        text: 'Text Note',
        image: 'Image Share',
        video: 'Video Share',
        workflow: 'AI Workflow'
      },
      tags: {
        aiCreation: 'AI Creation',
        labubu: 'Labubu',
        designInspiration: 'Design Inspiration',
        photographyTips: 'Photography Tips',
        programmingNotes: 'Programming Notes',
        lifeRecords: 'Life Records',
        learningInsights: 'Learning Insights',
        workflows: 'Workflows',
        creativeIdeas: 'Creative Ideas',
        techSharing: 'Tech Sharing'
      },
      placeholders: {
        text: 'Share your thoughts, experiences, or inspiration...',
        image: 'Add description for your images...',
        video: 'Add description for your video...',
        workflow: 'Introduce your AI workflow functions and uses...'
      },
      uploadTexts: {
        image: 'Click or drag to upload images',
        video: 'Click or drag to upload video'
      },
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
      loggingIn: 'Logging In',
      loadingTip: 'Login verification may take some time, please wait patiently...',
      noAccount: 'Don\'t have an account?',
      registerNow: 'Register now',
      passwordError: 'Password must be at least 8 characters with letters and special characters',
      forgotMessage: 'Please contact admin to reset password.',
      registerMessage: 'Registration feature is not yet open.',
      loginFailed: 'Login failed',
      loginSuccess: 'Login successful',
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password'
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
      passwordHint: 'Password requirements: 8-16 characters, including at least two of: uppercase letters, lowercase letters, digits',
      confirmPasswordPlaceholder: 'Enter password again',
      codePlaceholder: 'Enter verification code',
      getCode: 'Get Code',
      registerButton: 'Register',
      registering: 'Registering',
      registeringTip: 'Account registration verification may take some time, please wait patiently...',
      hasAccount: 'Already have an account?',
      goLogin: 'Go to login',
      completeInfo: 'Please fill in complete information',
      usernameError: 'Username must be 4-20 characters (letters, numbers, or underscores)',
      emailError: 'Please enter a valid email address',
      passwordError: 'Password must be at least 8 characters with letters and special characters',
      confirmError: 'The two passwords do not match',
      codeError: 'Please enter verification code',
      registerSuccess: 'Registration successful!',
      getCode: 'Get Code',
      sending: 'Sending...',
      sentCountdown: 'Sent (180s)',
      sentTime: 'Sent ({time}s)',
      sendingCode: 'Sending verification code',
      loadingTip: 'Email verification may take some time, please wait patiently...',
      codeSuccess: 'Verification code has been sent to your email, please check!',
      emailFormatError: 'Invalid email format',
      usernameRequired: 'Please enter username',
      usernameLength: 'Username must be longer than 2 characters',
      passwordLength: 'Password length must be 8-16 characters',
      passwordComplexity: 'Password must include at least two of: uppercase letters, lowercase letters, digits',
      passwordMismatch: 'The two passwords do not match',
      invalidCode: 'Verification code is invalid or expired',
      serverError: 'Server error, please try again later',
      sendCodeError: 'Failed to send verification code',
      sendCodeFailed: 'Failed to send verification code',
      registerFailed: 'Registration failed'
    },
    // 个人中心
    profile: {
      aiAgents: 'AI Agents',
      posts: 'Posts',
      transactions: 'Transactions',
      editProfile: 'Edit Profile',
      share: 'Share',
      myAIAgents: 'My AI Agents',
      createAgent: 'Create New Agent',
      myCommunityContent: 'My Community Content',
      createPost: 'Create Post',
      marketplace: 'Marketplace',
      settings: 'Settings',
      community: 'Community',
      mySelling: 'My Products',
      purchases: 'Purchases',
      sales: 'Sales',
      myProducts: 'My Products',
      addProduct: 'Add Product',
      purchaseHistory: 'Purchase History',
      salesHistory: 'Sales History',
      accountSettings: 'Account Settings',
      privacy: 'Privacy Settings',
      notifications: 'Notification Settings',
      username: 'Username',
      email: 'Email',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      publicProfile: 'Public Profile',
      publicProfileDesc: 'Allow others to view your profile',
      showActivity: 'Show Activity',
      showActivityDesc: 'Display your recent activities',
      emailNotifications: 'Email Notifications',
      emailNotificationsDesc: 'Receive notifications via email',
      marketingEmails: 'Marketing Emails',
      marketingEmailsDesc: 'Receive promotional content',
      saveChanges: 'Save Changes',
      deleteAccount: 'Delete Account',
      deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone!',
      runs: 'Runs',
      success: 'Success Rate',
      edit: 'Edit',
      run: 'Run',
      delete: 'Delete',
      view: 'View',
      stats: 'Stats',
      seller: 'Seller',
      buyer: 'Buyer',
      viewOrder: 'View Order',
      review: 'Review',
      process: 'Process',
      selectAvatar: 'Select Avatar',
      avatarTip: 'Choose a favorite avatar as your personal image',
      cancel: 'Cancel',
      confirm: 'Confirm',
      avatarUpdated: 'Avatar updated successfully!',
      avatarUpdateFailed: 'Failed to update avatar, please try again',
      avatarEditMsg: 'Avatar editing feature coming soon',
      profileEditMsg: 'Profile editing feature coming soon',
      linkCopied: 'Link copied to clipboard',
      settingsSaved: 'Settings saved',
      deleteAccountMsg: 'Account deletion requires contacting customer service',
      status: {
        active: 'Active',
        draft: 'Draft',
        inactive: 'Inactive'
      },
      postType: {
        artwork: 'Artwork',
        tutorial: 'Tutorial',
        discussion: 'Discussion',
        showcase: 'Showcase'
      },
      productStatus: {
        active: 'Active',
        sold_out: 'Sold Out',
        draft: 'Draft'
      },
      transactionStatus: {
        pending: 'Pending',
        completed: 'Completed',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    }
  },
  zh: {
    // 导航
    nav: {
      home: '首页',
      aiAgent: 'AI智能体',
      community: '社区',
      marketplace: '市场',
      profile: '个人中心',
      about: '关于',
      login: '登录',
      register: '注册',
      logout: '登出',
      logoutConfirm: '确定要登出吗？',
      logoutSuccess: '已成功登出'
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
      buildAgent: '构建智能体',
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
      },
      team: {
        title: '我们的团队',
        subtitle: '充满激情的创新团队，致力于打造最优秀的AI创作平台',
        photoPlaceholder: '团队照片即将上传...',
        descriptionTitle: '关于我们',
        descriptionPlaceholder: '我们是一支由5名充满创新精神的成员组成的团队，专注于AI技术与创意的完美结合。每个成员都带来了独特的专业技能和创新视角，共同致力于打造革命性的AI创作平台。团队介绍内容即将更新...',
        membersTitle: '团队成员',
        rolePlaceholder: '职位待更新',
        memberPlaceholder: '个人介绍即将更新...'
      }
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
        test: '测试与部署',
        workflowDesign: '工作流设计',
        workflowDesignDesc: '可视化DAG工作流编辑器 - 核心功能',
        workflowManagement: '工作流管理',
        workflowManagementDesc: '查看和管理您的所有DAG工作流'
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

        conditionDesc: '条件判断',
        llmDesc: '大语言模型文本处理',
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
        nodePromptPlaceholder: '输入节点的提示词...',
        promptTipsSimple: '提示词用于指导AI如何处理输入数据',
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
        saveConfig: '保存',
        validateConfig: '验证',
        nameRequired: '节点名称不能为空',
        serviceRequired: '请选择服务类型',
        promptRequired: '请配置节点提示词',
        conditionRequired: '请配置条件表达式',
        configSaved: '节点配置已保存',
        configValid: '节点配置验证通过！',
        noNodeSelected: '请先选择一个节点',
        workflowSaved: '工作流已保存',
        saveFailed: '保存工作流失败',
        testStarted: '工作流测试已启动',
        testFailed: '测试工作流失败',
        deploySuccess: '工作流部署成功并已保存到记录中',
        deployFailed: '部署工作流失败',

        // 默认提示词
        defaultPrompts: {
          condition: '根据输入内容进行条件判断，返回true或false。',
          llm: '请根据输入内容提供有用的回答，保持回答准确、简洁、有帮助。',
          stt: '请将音频准确转换为文字，保持自然的句子结构和正确的标点符号。',
          tts: '请以自然、清晰的语调朗读文字，注意语速适中，语音自然。',
          pic2text: '请识别图片中的所有文字内容，保持原有的排版结构，准确提取文字信息。',
          text2pic: '根据描述生成高质量图片，画面构图合理，色彩和谐，细节丰富。',
          process: '对输入数据进行处理和分析，提取有用信息并整理输出。',
          transform: '将输入数据转换为指定格式，保持数据的完整性和准确性。'
        },

        nodeConfigIncomplete: '节点配置不完整',
        nodes: '节点',
        connections: '连接',
        status: '状态',
        clearCanvas: '清空画布',
        saveWorkflow: '保存工作流',
        testWorkflow: '测试运行',
        deployWorkflow: '部署',
        redeployWorkflow: '重新部署',
        zoomIn: '放大',
        zoomOut: '缩小',
        resetZoom: '重置缩放',
        fitToScreen: '适合屏幕',
        // 节点名称
        conditionNode: '条件',
        llmNode: '大语言模型',
        sttNode: '语音转文字',
        ttsNode: '文字转语音',
        pic2textNode: '图片转文字',
        text2picNode: '文字转图片',
        processNode: '处理',
        transformNode: '转换',
        // 连接点
        inputPort: '入',
        outputPort: '出',
        // 模型选项
        models: {
          gpt4: 'GPT-4',
          gpt35turbo: 'GPT-3.5 Turbo',
          claude3: 'Claude-3',
          llama2: 'Llama-2',
          whisper1: 'Whisper-1',
          tts1: 'TTS-1',
          tts1hd: 'TTS-1-HD',
          dalle3: 'DALL-E 3',
          dalle2: 'DALL-E 2'
        },
        // 语音选项
        voices: {
          alloy: 'Alloy',
          echo: 'Echo',
          fable: 'Fable',
          onyx: 'Onyx',
          nova: 'Nova',
          shimmer: 'Shimmer'
        },
        // 语言选项
        languages: {
          chinese: '中文',
          english: '英文',
          japanese: '日文',
          korean: '韩文'
        },
        // 格式选项
        formats: {
          mp3: 'MP3',
          opus: 'Opus',
          aac: 'AAC',
          flac: 'FLAC',
          wav: 'WAV',
          pcm: 'PCM',
          json: 'JSON',
          text: '文本',
          srt: 'SRT',
          verboseJson: '详细JSON',
          vtt: 'VTT',
          plainText: '纯文本',
          markdown: 'Markdown',
          url: 'URL链接',
          base64: 'Base64编码'
        },
        // 配置标签
        labels: {
          maxTokens: '最大Token数',
          topP: 'Top P',
          ttsModel: 'TTS模型',
          audioFormat: '音频格式',
          speechSpeed: '语速',
          sttModel: 'STT模型',
          responseFormat: '响应格式',
          recognitionLanguage: '识别语言',
          outputFormat: '输出格式',
          detailLevel: '详细程度',
          imageModel: '图片模型',
          imageCount: '图片数量',
          userIdentifier: '用户标识',
          conditionExpression: '条件表达式',
          retryCount: '重试次数',
          retryInterval: '重试间隔(ms)',
          timeoutSeconds: '超时时间(s)',
          errorHandling: '错误处理',
          fallbackValue: '备用值',
          portName: '端口名称',
          dataType: '数据类型'
        },
        // 帮助文本
        helpTexts: {
          stopSequences: 'LLM遇到这些序列时将停止生成，每行一个序列',
          userIdForMonitoring: '用于监控和防滥用，建议使用UUID',
          logitBias: '调整特定令牌的出现概率，格式为JSON对象',
          audioFormatHelp: '选择音频输出格式，影响文件大小和质量',
          maxTokensHelp: '限制输出文本的最大长度',
          conditionHelp: '支持JavaScript表达式，可使用变量名引用输入数据',
          retryHelp: '节点执行失败时的重试次数',
          retryIntervalHelp: '每次重试之间的等待时间',
          timeoutHelp: '节点执行的最大等待时间',
          errorHandlingHelp: '选择错误发生时的处理方式',
          fallbackHelp: '当节点执行失败时使用的备用值',
          imageCountHelp: '一次生成的图片数量，DALL-E 3最多支持1张',
          userIdImageHelp: '用于监控和防滥用，建议使用UUID'
        },
        // 尺寸选项
        imageSizes: {
          size256: '256x256',
          size512: '512x512',
          size1024: '1024x1024',
          size1792x1024: '1792x1024 (横向)',
          size1024x1792: '1024x1792 (纵向)'
        },
        // 数据类型
        dataTypes: {
          text: '文本',
          image: '图片',
          audio: '音频',
          file: '文件',
          json: 'JSON'
        },
        // 错误处理选项
        errorHandlingOptions: {
          stop: '停止工作流',
          continue: '继续执行',
          retry: '重试执行',
          fallback: '使用备用值'
        },
        // 详细程度选项
        detailLevels: {
          low: '低 - 快速处理',
          high: '高 - 详细分析',
          auto: '自动 - 智能选择'
        },
        // 环境选项
        environments: {
          development: '开发环境',
          testing: '测试环境',
          production: '生产环境'
        },
        // 页面标题和描述
        workflowManagement: {
          title: '工作流管理',
          description: '查看和管理您的所有DAG工作流',
          runningLabel: '运行中',
          totalWorkflows: '总工作流',
          runningWorkflows: '运行中',
          completedWorkflows: '已完成',
          failedWorkflows: '失败',
          searchPlaceholder: '搜索工作流...',
          refresh: '刷新',
          noWorkflows: '暂无工作流',
          noWorkflowsDescription: '您还没有创建任何工作流，现在就开始设计您的第一个工作流吧！',
          createWorkflow: '创建工作流',
          nodeCount: '节点数:',
          createdAt: '创建时间:',
          viewStatus: '查看状态',
          viewResults: '查看结果',
          clone: '复制',
          deleteWorkflow: '删除',
          loading: '正在加载工作流列表...',
          loadError: '加载失败',
          retry: '重试',
          close: '关闭',
          refreshStatus: '刷新状态',
          refreshStatusFailed: '刷新状态失败'
        },
        inputData: '输入数据配置',
        inputContent: '输入内容',
        inputTextPlaceholder: '输入文本内容...',
        uploadImage: '上传图片',
        uploadAudio: '上传音频',
        uploadFile: '上传文件',
        clickToUpload: '点击上传图片',
        clickToUploadAudio: '点击上传音频',
        clickToUploadFile: '点击上传文件',
        supportedFormats: '支持 JPG、PNG、GIF、BMP、WEBP、SVG 格式，自动转换为JPEG',
        audioFormats: '支持 MP3、WAV、OGG 格式，自动设置为WAV格式',
        inputJson: 'JSON数据',
        jsonPlaceholder: '输入JSON格式数据...',
        jsonHint: '请输入有效的JSON格式数据',
        configurationPanel: '配置面板',
        selectNodeToConfig: '选择节点进行配置',
        configInstructions: '请按照以下步骤操作：',
        step1: '从左侧拖拽节点到画布',
        step2: '点击节点进行选择',
        step2Detail: '点击节点本身，不是连接点',
        step3: '在此处配置节点参数',
        step4: '设置输入数据（文字、图片等）',
        step4Detail: '在下方"输入数据配置"中输入',
        tipInputLocation: '输入文字位置：选择节点后，向下滚动找到"输入数据配置"部分',
        tip1: 'LLM节点接受文本输入，可通过工作流连接处理其他格式',
        tip2: '拖拽节点连接点可以创建数据流',
        tip3: '配置完成后可以测试和部署工作流',

        // 快捷键
        shortcuts: {
          keyboardGuide: '快捷键指南',
          editOperations: '编辑操作',
          workflowOperations: '工作流操作',
          canvasOperations: '画布操作',
          undo: '撤销',
          redo: '重做',
          copySelectedNode: '复制选中节点',
          pasteNode: '粘贴节点',
          deleteSelectedNode: '删除选中节点',
          saveWorkflow: '保存工作流',
          selectAllNodes: '选择所有节点',
          zoomCanvas: '缩放画布',
          moveCanvas: '移动画布',
          selectNode: '选择节点',
          dragNode: '拖拽节点',
          mouseWheel: '鼠标滚轮',
          dragBlankArea: '拖拽空白区域',
          clickNode: '点击节点',
          dragToConnect: '按住拖拽创建连接'
        },
        // 状态值
        statusValues: {
          ready: '就绪',
          running: '运行中',
          completed: '已完成',
          failed: '失败',
          empty: '空白',
          unnamed: '未命名工作流',
          deployed: '已部署',
          pending: '待运行'
        },
        // 工具栏按钮
        toolbar: {
          clear: '清空',
          save: '保存',
          saveWorkflow: '保存工作流',
          testWorkflow: '测试工作流',
          deployWorkflow: '部署工作流',
          redeployWorkflow: '重新部署',
          designer: '设计器',
          dagWorkflow: 'DAG工作流'
        },
        // 状态筛选器
        statusFilters: {
          all: '全部',
          running: '运行中',
          completed: '已完成',
          failed: '失败',
          pending: '待运行'
        },
        // 节点描述
        nodeDescriptions: {
          workflowStart: '工作流开始',
          workflowEnd: '工作流结束',
          conditionJudgment: '条件判断',
          dataProcessing: '数据处理',
          dataTransformation: '数据转换'
        },
        // 端口配置
        ports: {
          trigger: '触发器',
          result: '结果',
          input: '输入',
          output: '输出',
          true: '真',
          false: '假',
          prompt: '提示',
          response: '响应',
          audio: '音频',
          text: '文本',
          image: '图片'
        },
        // 额外的翻译项
        inputPortsLabel: '🔽 输入:',
        outputPortsLabel: '🔼 输出:',
        generalConfig: '通用配置',
        retryCount: '重试次数',
        retryCountPlaceholder: '3',
        retryCountHelp: '节点执行失败时的重试次数',
        retryInterval: '重试间隔(ms)',
        retryIntervalPlaceholder: '1000',
        retryIntervalHelp: '每次重试之间的等待时间',
        executionTimeout: '超时时间(s)',
        executionTimeoutPlaceholder: '30',
        executionTimeoutHelp: '节点执行的最大等待时间',
        errorHandling: '错误处理',
        errorHandlingHelp: '选择错误发生时的处理方式',
        fallbackValue: '备用值',
        fallbackValuePlaceholder: '错误时使用的默认值',
        fallbackValueHelp: '当节点执行失败时使用的备用值',
        portNamePlaceholder: '端口名称',
        portTypes: {
          text: '文本',
          image: '图片',
          audio: '音频',
          file: '文件',
          json: 'JSON'
        },
        unknown: '未知',
        jsExpressionHelp: '支持JavaScript表达式，可使用变量名引用输入数据',
        fromNode: '源节点',
        toNode: '目标节点',
        connectionConfiguration: '连接配置',
        connectionPrompt: '连接提示词',
        connectionPromptPlaceholder: '输入连接提示词，用于在数据传递时进行转换或处理...',
        connectionPromptTips: '连接提示词用于定义数据在节点间传递时的转换逻辑，可以包含变量如 {input_data}',
        connectionDescription: '连接描述',
        connectionDescPlaceholder: '描述此连接的作用...',
        saveConnection: '保存连接',
        deleteConnection: '删除连接',
        // 错误消息
        errors: {
          dataTypeIncompatible: '数据类型不兼容：{outputNode} 输出 {outputType} 类型，但 {inputNode} 只接受 {inputType} 类型输入'
        }
      }
    },
    // 社区
    community: {
      title: '创意社区',
      subtitle: '与世界分享您的创意',
      heroTitle: '创意笔记社区',
      heroSubtitle: '分享你的创意想法，发现更多灵感',
      totalNotes: '总笔记数',
      todayNotes: '今日新增',
      activeTags: '活跃标签',
      searchPlaceholder: '搜索笔记内容、标签或作者...',
      trendingTags: '热门标签',
      shareNote: '分享你的创意笔记...',
      noNotes: '暂无笔记',
      noNotesDesc: '快来发布第一篇笔记吧！',
      loading: '加载中...',
      publish: '发布笔记',
      selectWorkflow: '选择AI Agent工作流',
      addComment: '添加评论...',
      send: '发送',
      tryWorkflow: '试用',
      loadMore: '加载更多',
      // Labubu介绍
      labubu: {
        welcomeTitle: '欢迎来到Labubu的创意世界！',
        welcomeText: '在这里，每一个创意都像Labubu一样充满魅力和惊喜。让我们一起探索AI的无限可能，用温暖的创意点亮数字世界的每一个角落。',
        features: {
          creativity: '创意无限',
          sharing: '灵感共享',
          ai: 'AI驱动',
          community: '温暖社区'
        }
      },
      // 时间显示
      timeAgo: {
        minutesAgo: '{count}分钟前',
        minuteAgo: '1分钟前',
        hoursAgo: '{count}小时前',
        hourAgo: '1小时前',
        daysAgo: '{count}天前',
        dayAgo: '1天前',
        weeksAgo: '{count}周前',
        weekAgo: '1周前',
        monthsAgo: '{count}个月前',
        monthAgo: '1个月前',
        yearsAgo: '{count}年前',
        yearAgo: '1年前',
        justNow: '刚刚'
      },
      filters: {
        all: '全部',
        text: '文字',
        image: '图片',
        video: '视频',
        workflow: '工作流'
      },
      noteTypes: {
        text: '文字笔记',
        image: '图片分享',
        video: '视频分享',
        workflow: 'AI工作流'
      },
      tags: {
        aiCreation: 'AI创作',
        labubu: 'Labubu',
        designInspiration: '设计灵感',
        photographyTips: '摄影技巧',
        programmingNotes: '编程笔记',
        lifeRecords: '生活记录',
        learningInsights: '学习心得',
        workflows: '工作流程',
        creativeIdeas: '创意想法',
        techSharing: '技术分享'
      },
      placeholders: {
        text: '分享你的想法、经验或灵感...',
        image: '为你的图片添加描述...',
        video: '为你的视频添加说明...',
        workflow: '介绍你的AI工作流功能和用途...'
      },
      uploadTexts: {
        image: '点击或拖拽上传图片',
        video: '点击或拖拽上传视频'
      },
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
      loggingIn: '登录中',
      loadingTip: '登录验证可能需要一些时间，请耐心等待...',
      noAccount: '还没有账号？',
      registerNow: '注册新账号',
      passwordError: '密码需至少8位，且包含英文和特殊字符',
      forgotMessage: '请联系管理员重置密码。',
      registerMessage: '注册功能暂未开放。',
      loginFailed: '登录失败',
      loginSuccess: '登录成功',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码'
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
      passwordHint: '密码要求：8-16位，至少包含大写字母、小写字母、数字中的两种',
      confirmPasswordPlaceholder: '请再次输入密码',
      codePlaceholder: '请输入验证码',
      getCode: '获取验证码',
      registerButton: '注册',
      registering: '注册中',
      registeringTip: '账户注册验证可能需要一些时间，请耐心等待...',
      hasAccount: '已有账号？',
      goLogin: '去登录',
      completeInfo: '请填写完整信息',
      usernameError: '用户名需为4-20位字母、数字或下划线',
      emailError: '请输入有效的邮箱地址',
      passwordError: '密码需至少8位，且包含英文和特殊字符',
      confirmError: '两次输入的密码不一致',
      codeError: '请输入验证码',
      registerSuccess: '注册成功！',
      getCode: '获取验证码',
      sending: '发送中...',
      sentCountdown: '已发送(180s)',
      sentTime: '已发送({time}s)',
      sendingCode: '正在发送验证码',
      loadingTip: '邮箱验证码发送需要一些时间，请耐心等待...',
      codeSuccess: '验证码已发送到您的邮箱，请查收！',
      emailFormatError: '邮箱格式不正确',
      usernameRequired: '请输入用户名',
      usernameLength: '用户名长度必须大于2个字符',
      passwordLength: '密码长度必须为8-16位',
      passwordComplexity: '密码必须包含大写字母、小写字母、数字中至少两类',
      passwordMismatch: '两次输入的密码不一致',
      invalidCode: '验证码错误或已过期',
      serverError: '服务器错误，请稍后重试',
      sendCodeError: '验证码发送失败',
      sendCodeFailed: '验证码发送失败',
      registerFailed: '注册失败'
    },
    // 个人中心
    profile: {
      aiAgents: 'AI智能体',
      posts: '帖子',
      transactions: '交易',
      editProfile: '编辑资料',
      share: '分享',
      myAIAgents: '我的AI智能体',
      createAgent: '创建新智能体',
      myCommunityContent: '我的社区内容',
      createPost: '创建帖子',
      marketplace: '市场',
      settings: '设置',
      community: '社区',
      mySelling: '我的商品',
      purchases: '购买记录',
      sales: '销售记录',
      myProducts: '我的商品',
      addProduct: '添加商品',
      purchaseHistory: '购买历史',
      salesHistory: '销售历史',
      accountSettings: '账户设置',
      privacy: '隐私设置',
      notifications: '通知设置',
      username: '用户名',
      email: '邮箱',
      bio: '个人简介',
      bioPlaceholder: '介绍一下自己...',
      publicProfile: '公开资料',
      publicProfileDesc: '允许他人查看你的资料',
      showActivity: '显示活动',
      showActivityDesc: '显示你的最近活动',
      emailNotifications: '邮件通知',
      emailNotificationsDesc: '通过邮件接收通知',
      marketingEmails: '营销邮件',
      marketingEmailsDesc: '接收推广内容',
      saveChanges: '保存更改',
      deleteAccount: '删除账户',
      deleteAccountConfirm: '确定要删除账户吗？此操作无法撤销！',
      runs: '运行次数',
      success: '成功率',
      edit: '编辑',
      run: '运行',
      delete: '删除',
      view: '查看',
      stats: '统计',
      seller: '卖家',
      buyer: '买家',
      viewOrder: '查看订单',
      review: '评价',
      process: '处理',
      selectAvatar: '选择头像',
      avatarTip: '选择一个你喜欢的头像作为你的个人形象',
      cancel: '取消',
      confirm: '确认',
      avatarUpdated: '头像更新成功！',
      avatarUpdateFailed: '头像更新失败，请重试',
      avatarEditMsg: '头像编辑功能即将推出',
      profileEditMsg: '个人资料编辑功能即将推出',
      linkCopied: '链接已复制到剪贴板',
      settingsSaved: '设置已保存',
      deleteAccountMsg: '账户删除需要联系客服',
      status: {
        active: '活跃',
        draft: '草稿',
        inactive: '未激活'
      },
      postType: {
        artwork: '艺术作品',
        tutorial: '教程',
        discussion: '讨论',
        showcase: '展示'
      },
      productStatus: {
        active: '在售',
        sold_out: '售罄',
        draft: '草稿'
      },
      transactionStatus: {
        pending: '待处理',
        completed: '已完成',
        delivered: '已送达',
        cancelled: '已取消'
      }
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
    // 检查用户是否已经主动选择过语言
    const userSelectedLanguage = localStorage.getItem('user_selected_language')
    const savedLanguage = localStorage.getItem('language')
    
    if (userSelectedLanguage === 'true' && savedLanguage && LANGUAGES[savedLanguage]) {
      // 如果用户已经选择过语言，使用保存的语言
      currentLanguage.value = savedLanguage
    } else {
      // 首次访问或用户未选择过语言，默认使用英语
      currentLanguage.value = DEFAULT_LANGUAGE
      // 保存默认语言到本地存储
      localStorage.setItem('language', DEFAULT_LANGUAGE)
    }
  }

  getCurrentLanguage() {
    return currentLanguage.value
  }

  setLanguage(lang) {
    if (LANGUAGES[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
      // 标记用户已经主动选择过语言
      localStorage.setItem('user_selected_language', 'true')
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
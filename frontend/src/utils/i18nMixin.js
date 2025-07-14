// Import language manager and current language reactive reference导入语言管理器和当前语言响应式引用
import languageManager, { currentLanguage } from '../i18n/index.js'

// Vue mixin for internationalization internationalization的Vue混入
export default {
  computed: {
    // Computed property for current language当前语言的计算属性
    $currentLanguage() {
      return currentLanguage.value // Return reactive language value返回响应式语言值
    }
  },
  methods: {
    // Translation method翻译方法
    $t(key, defaultValue = '') {
      // Ensure reactive updates - access reactive current language确保响应式更新 - 访问响应式的当前语言
      this.$currentLanguage
      return languageManager.t(key, defaultValue) // Call language manager translation method调用语言管理器翻译方法
    }
  }
} 
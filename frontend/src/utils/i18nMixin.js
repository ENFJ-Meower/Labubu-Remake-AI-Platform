import languageManager, { currentLanguage } from '../i18n/index.js'

// Vue mixin for internationalization
export default {
  computed: {
    $currentLanguage() {
      return currentLanguage.value
    }
  },
  methods: {
    $t(key, defaultValue = '') {
      // 确保响应式更新 - 访问响应式的当前语言
      this.$currentLanguage
      return languageManager.t(key, defaultValue)
    }
  }
} 
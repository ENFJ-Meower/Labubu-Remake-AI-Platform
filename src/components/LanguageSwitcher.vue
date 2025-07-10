<template>
  <div class="language-switcher">
    <div class="language-selector" @click="toggleDropdown" :class="{ active: isDropdownOpen }">
      <div class="current-language">
        <span class="flag">{{ currentLanguageInfo.flag }}</span>
        <span class="name">{{ currentLanguageInfo.name }}</span>
        <span class="arrow" :class="{ rotate: isDropdownOpen }">▼</span>
      </div>
      
      <div class="dropdown" v-show="isDropdownOpen">
        <div 
          v-for="(language, code) in availableLanguages" 
          :key="code"
          class="dropdown-item"
          :class="{ active: code === currentLanguage }"
          @click="selectLanguage(code)"
        >
          <span class="flag">{{ language.flag }}</span>
          <span class="name">{{ language.name }}</span>
          <span v-if="code === currentLanguage" class="check">✓</span>
        </div>
      </div>
    </div>
    
    <!-- 点击外部关闭下拉菜单 -->
    <div 
      v-if="isDropdownOpen" 
      class="overlay" 
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import languageManager, { currentLanguage, LANGUAGES } from '../i18n/index.js'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const isDropdownOpen = ref(false)
    
    const currentLanguageInfo = computed(() => {
      return LANGUAGES[currentLanguage.value] || LANGUAGES.en
    })
    
    const availableLanguages = computed(() => {
      return LANGUAGES
    })
    
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }
    
    const closeDropdown = () => {
      isDropdownOpen.value = false
    }
    
    const selectLanguage = (code) => {
      if (code !== currentLanguage.value) {
        languageManager.setLanguage(code)
      }
      closeDropdown()
    }
    
    // 键盘事件处理
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDropdown()
      }
    }
    
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })
    
    return {
      isDropdownOpen,
      currentLanguage,
      currentLanguageInfo,
      availableLanguages,
      toggleDropdown,
      closeDropdown,
      selectLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-selector {
  position: relative;
  cursor: pointer;
  user-select: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.language-selector.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.current-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.flag {
  font-size: 1.2rem;
  line-height: 1;
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
}

.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  color: #ffffff;
  margin-left: auto;
}

.arrow.rotate {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  z-index: 1000;
  animation: dropdownFadeIn 0.3s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item.active {
  background: rgba(78, 205, 196, 0.2);
  color: #4ecdc4;
}

.dropdown-item .flag {
  font-size: 1.1rem;
}

.dropdown-item .name {
  font-size: 0.9rem;
  font-weight: 500;
}

.check {
  margin-left: auto;
  color: #4ecdc4;
  font-weight: bold;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-selector {
    padding: 0.4rem 0.8rem;
  }
  
  .current-language {
    min-width: 70px;
  }
  
  .name {
    font-size: 0.8rem;
  }
  
  .dropdown-item {
    padding: 0.6rem 0.8rem;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .language-selector {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .language-selector:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  
  .dropdown {
    background: rgba(20, 20, 20, 0.95);
  }
}
</style> 
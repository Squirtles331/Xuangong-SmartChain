<template>
  <el-button type="text" circle class="icon-btn" @click="open = true">
    <el-icon><Setting /></el-icon>
  </el-button>
  <el-drawer v-model="open" title="设置" direction="rtl" size="600px">
    <div class="drawer-section">
      <div class="drawer-row">主题</div>
      <el-space>
        <el-button size="small" @click="setTheme('light')">浅色</el-button>
        <el-button size="small" @click="setTheme('dark')">深色</el-button>
      </el-space>
    </div>
    <div class="drawer-section">
      <div class="drawer-row">语言</div>
      <el-space>
        <el-button size="small" @click="setLang('zh')">中文</el-button>
        <el-button size="small" @click="setLang('en')">English</el-button>
      </el-space>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'

const open = ref(false)

const setTheme = (val: 'light' | 'dark') => {
  const cls = val === 'dark' ? 'theme-dark' : 'theme-light'
  document.documentElement.classList.remove('theme-dark', 'theme-light')
  document.documentElement.classList.add(cls)
}

const setLang = (val: 'zh' | 'en') => {
  localStorage.setItem('app-lang', val)
}
</script>

<style scoped>
.icon-btn {
  padding: 4px;
}
.drawer-section {
  padding: 8px 0;
}
.drawer-row {
  margin-bottom: 6px;
  font-weight: 600;
}
</style>

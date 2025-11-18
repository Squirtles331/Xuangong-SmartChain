<template>
  <el-button type="text" circle @click="toggleTheme">
    <el-icon v-if="theme === 'light'"><Sunny /></el-icon>
    <el-icon v-else><Moon /></el-icon>
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const theme = ref<'light' | 'dark'>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  const cls = theme.value === 'dark' ? 'theme-dark' : 'theme-light'
  document.documentElement.classList.remove('theme-dark', 'theme-light')
  document.documentElement.classList.add(cls)
}
</script>

<style scoped></style>

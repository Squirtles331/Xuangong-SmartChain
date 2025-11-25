<template>
  <el-button type="text" circle class="icon-btn" @click="toggleTheme">
    <el-icon v-if="isDark"><Moon /></el-icon>
    <el-icon v-else><Sunny /></el-icon>
  </el-button>
</template>

<script lang="ts" setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'

type AppTheme = 'light' | 'dark-blue' | 'dark-deep' | 'dark-midnight' | 'dark-neutral' | 'corporate-blue'
const root = document.documentElement
const hasDarkClass = () =>
  root.classList.contains('dark-blue') ||
  root.classList.contains('dark-deep') ||
  root.classList.contains('dark-midnight') ||
  root.classList.contains('dark-neutral') ||
  root.classList.contains('corporate-blue')
const isDark = ref<boolean>(hasDarkClass())

const applyTheme = (val: AppTheme) => {
  root.classList.remove('dark-blue', 'dark-deep', 'dark-midnight', 'dark-neutral', 'corporate-blue')
  if (val !== 'light') root.classList.add(val)
  localStorage.setItem('app-theme', val)
  isDark.value = val !== 'light'
}

const toggleTheme = () => {
  applyTheme(isDark.value ? 'light' : 'dark-deep')
}

const savedTheme = localStorage.getItem('app-theme') as AppTheme | null
if (savedTheme) applyTheme(savedTheme)

let observer: MutationObserver | null = null
onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = hasDarkClass()
  })
  observer.observe(root, { attributes: true, attributeFilter: ['class'] })
})
onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.icon-btn {
  color: var(--el-text-color-regular);
}
</style>

<template>
  <el-button class="icon-btn" circle @click="toggleFull">
    <el-icon><FullScreen /></el-icon>
  </el-button>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue'

const toggleFull = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}
</script>

<style scoped>
.icon-btn {
  width: 36px;
  min-width: 36px;
  height: 36px;
  color: var(--el-text-color-regular);
  background: transparent;
  border: none;
}

.icon-btn:hover,
.icon-btn:focus {
  color: var(--el-color-primary);
  background: rgba(255, 255, 255, 0.9);
}
</style>

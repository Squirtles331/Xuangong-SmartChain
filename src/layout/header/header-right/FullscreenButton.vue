<template>
  <el-button type="text" circle @click="toggleFull">
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

<style scoped></style>

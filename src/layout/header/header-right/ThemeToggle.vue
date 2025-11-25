<template>
  <el-button circle type="text" @click="toggleTheme()">
    {{ isDark ? 'Dark' : 'Light' }}
  </el-button>
</template>

<script lang="ts" setup>
const isDark = () => document.documentElement.classList.contains('dark-deep')
const toggleTheme = () => {
  const root = document.documentElement
  const current = isDark()
  root.classList.remove('dark-blue', 'dark-deep', 'dark-midnight', 'dark-neutral', 'corporate-blue')
  if (!current) root.classList.add('dark-deep')
}
</script>

<style scoped></style>

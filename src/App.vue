<template>
  <RouterView />
</template>

<script setup lang="ts"></script>

<style>
#app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  color: var(--el-text-color-primary);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

html.night-shift-dark body {
  background:
    radial-gradient(circle at top left, rgba(75, 138, 168, 0.08), transparent 20%), linear-gradient(180deg, #101926 0%, var(--el-bg-color-page) 100%);
}
</style>

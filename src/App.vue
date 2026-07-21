<template>
  <RouterView />
</template>

<script setup lang="ts"></script>

<style>
#app {
  height: 100vh;
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
  background: var(--page-ambient);
  font-family: var(--app-font-body);
}

html.night-shift-dark body {
  background: var(--page-ambient);
}
</style>

<template>
  <div class="main-content">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-content {
  padding: var(--layout-content-padding, 16px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>

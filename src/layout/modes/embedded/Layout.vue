<template>
  <div class="embedded-layout">
    <MainContent :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
  </div>
</template>

<script setup lang="ts">
import MainContent from './MainContent.vue'

interface Tab {
  title: string
  path: string
}

defineProps<{ tabs: Tab[]; activeTab: string }>()

defineEmits<{
  (e: 'remove-tab', path: string): void
  (e: 'tab-click', path: string): void
}>()
</script>

<style scoped>
.embedded-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-main-bg);
}
</style>

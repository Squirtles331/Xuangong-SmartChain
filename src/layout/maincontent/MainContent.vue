<template>
  <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="onRemoveTab" @tab-click="onTabClick" />

  <div class="app-content">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AffixTabs from './AffixTabs.vue'
const props = defineProps<{ tabs: { title: string; path: string }[]; activeTab: string }>()
const emit = defineEmits<{
  (e: 'remove-tab', targetPath: string): void
  (e: 'tab-click', path: string): void
}>()

const onRemoveTab = (targetPath: string) => emit('remove-tab', targetPath)
const onTabClick = (path: string) => emit('tab-click', path)
</script>

<style scoped>
.app-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #fff;
  margin: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  min-height: 0;
}
@media (max-width: 768px) {
  .app-content {
    margin: 8px;
    padding: 12px;
  }
}
</style>

<template>
  <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="onRemoveTab" @tab-click="onTabClick" />

  <router-view />
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

<style scoped></style>

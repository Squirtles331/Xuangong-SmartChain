<template>
  <div class="app-layout horizontal">
    <Header :breadcrumbs="breadcrumbs" />
    <main class="app-main">
      <MainContent :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import MainContent from './MainContent.vue'

interface Tab {
  title: string
  path: string
}
interface Breadcrumb {
  title: string
  path: string
}

defineProps<{
  breadcrumbs: Breadcrumb[]
  tabs: Tab[]
  activeTab: string
}>()

defineEmits<{
  (e: 'remove-tab', path: string): void
  (e: 'tab-click', path: string): void
}>()
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-main-bg);
}
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

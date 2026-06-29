<template>
  <div class="embedded-layout">
    <Sidebar
      :active-menu="activeMenu"
      :collapsed="sidebarCollapsed"
      :show="sidebarShow"
      @select="$emit('select-menu')"
      @toggle-collapse="$emit('toggle-sidebar')"
    />
    <div class="right-pane">
      <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import AffixTabs from '@/layout/common/AffixTabs.vue'

interface Tab {
  title: string
  path: string
}
interface Breadcrumb {
  title: string
  path: string
}

defineProps<{
  breadcrumbs?: Breadcrumb[]
  activeMenu: string
  sidebarCollapsed: boolean
  sidebarShow: boolean
  isMobile: boolean
  tabs: Tab[]
  activeTab: string
}>()

defineEmits<{
  (e: 'select-menu'): void
  (e: 'toggle-sidebar'): void
  (e: 'remove-tab', path: string): void
  (e: 'tab-click', path: string): void
}>()
</script>

<style scoped>
.embedded-layout {
  height: 100vh;
  display: flex;
  background-color: var(--layout-main-bg);
  overflow: hidden;
}
.right-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

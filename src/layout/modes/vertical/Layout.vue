<template>
  <div class="vertical-layout">
    <Sidebar
      :active-menu="activeMenu"
      :collapsed="sidebarCollapsed"
      :show="sidebarShow"
      @select="$emit('select-menu')"
      @toggle-collapse="$emit('toggle-sidebar')"
    />
    <div class="right-pane">
      <Header :breadcrumbs="breadcrumbs" @toggle-sidebar="$emit('toggle-sidebar')" />
      <main class="app-main">
        <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
        <router-view />
      </main>
    </div>
    <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="$emit('toggle-sidebar')"></div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
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
  breadcrumbs: Breadcrumb[]
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
.vertical-layout {
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
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (max-width: 768px) {
  .sidebar-mask {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--layout-overlay);
    z-index: 999;
  }
}
</style>

<template>
  <div class="app-layout">
    <Header :breadcrumbs="breadcrumbs" />
    <div class="app-body">
      <Sidebar
        :active-menu="activeMenu"
        :collapsed="sidebarCollapsed"
        :show="sidebarShow"
        @select="$emit('select-menu')"
        @toggle-collapse="$emit('toggle-sidebar')"
      />
      <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="$emit('toggle-sidebar')"></div>
      <main class="app-main">
        <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
        <div class="app-content-shell">
          <div class="app-content">
            <router-view />
          </div>
        </div>
      </main>
    </div>
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
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gradient-page);
  color: var(--layout-main-text);
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.app-content-shell {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background:
    radial-gradient(circle at top right, rgba(139, 124, 255, 0.1), transparent 20%),
    radial-gradient(circle at top left, rgba(76, 111, 255, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, transparent 100%);
}

.app-content {
  min-height: 100%;
  padding: var(--layout-content-padding);
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .sidebar-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--layout-overlay);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  .app-content {
    padding: 12px;
  }
}
</style>

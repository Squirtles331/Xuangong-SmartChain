<template>
  <div class="embedded-layout">
    <Sidebar
      :active-menu="activeMenu"
      :collapsed="sidebarCollapsed"
      :show="sidebarShow"
      @select="$emit('select-menu')"
      @toggle-collapse="$emit('toggle-sidebar')"
    />
    <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="$emit('toggle-sidebar')"></div>
    <div class="right-pane">
      <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
      <div class="app-content-shell">
        <div class="app-content">
          <router-view />
        </div>
      </div>
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
  color: var(--layout-main-text);
  overflow: hidden;
}

.right-pane {
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
    radial-gradient(circle at top right, rgba(31, 94, 122, 0.08), transparent 26%),
    linear-gradient(180deg, color-mix(in srgb, var(--layout-main-bg) 72%, #ffffff 28%) 0%, var(--layout-main-bg) 100%);
}

.app-content {
  min-height: 100%;
  padding: var(--layout-content-padding);
}

@media (max-width: 768px) {
  .sidebar-mask {
    position: fixed;
    inset: 0;
    background-color: var(--layout-overlay);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  .app-content {
    padding: 12px;
  }
}
</style>

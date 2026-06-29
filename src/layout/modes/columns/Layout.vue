<template>
  <div class="columns-layout">
    <MainSidebar
      :active-menu="activeMenu"
      :collapsed="sidebarCollapsed"
      :show="sidebarShow"
      @select="$emit('select-menu')"
      @toggle-collapse="$emit('toggle-sidebar')"
    />
    <SecondarySidebar v-if="hasSecondary" :collapsed="subCollapsed" />
    <div class="right-pane">
      <Header :breadcrumbs="breadcrumbs" @toggle-sub="subCollapsed = !subCollapsed" />
      <main class="app-main">
        <AffixTabs :tabs="tabs" :active-tab="activeTab" @remove-tab="$emit('remove-tab', $event)" @tab-click="$emit('tab-click', $event)" />
        <router-view />
      </main>
    </div>
    <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="$emit('toggle-sidebar')"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import MainSidebar from './MainSidebar.vue'
import SecondarySidebar from './SecondarySidebar.vue'
import AffixTabs from '@/layout/common/AffixTabs.vue'

interface Tab {
  title: string
  path: string
}
interface Breadcrumb {
  title: string
  path: string
}

const props = defineProps<{
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

const subCollapsed = ref(false)
const router = useRouter()
const hasSecondary = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  const seg = (props.activeMenu || '/').replace(/^\/+/, '').split('/')[0] || ''
  const parent = Array.isArray(layout?.children) ? layout.children.find((r: any) => r.path === seg) : null
  const children = Array.isArray(parent?.children) ? parent.children : []
  return children.filter((c: any) => !(c.meta && c.meta.hidden)).length > 0
})
</script>

<style scoped>
.columns-layout {
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

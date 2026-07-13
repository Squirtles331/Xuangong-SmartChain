<template>
  <div class="double-column-layout">
    <Header :breadcrumbs="breadcrumbs" />

    <div class="layout-body">
      <div class="dual-sidebar" :class="{ show: sidebarShow && isMobile }">
        <PrimaryRail :top-level-items="topLevelItems" :active-top-level-path="activeTopLevelPath" @select-top-level="handleTopLevelSelect" />
        <SecondarySidebar
          v-if="shouldShowSidebar"
          :items="currentSidebarItems"
          :active-menu="activeMenu"
          :collapsed="sidebarCollapsed"
          :show="sidebarShow"
          :section-title="activeSectionTitle"
          :section-hint="activeSectionHint"
          @select="$emit('select-menu')"
          @toggle-collapse="$emit('toggle-sidebar')"
        />
      </div>

      <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="$emit('toggle-sidebar')"></div>

      <main class="layout-main">
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AffixTabs from '@/layout/common/AffixTabs.vue'
import { useSidebarMenu } from '@/layout/common/useSidebarMenu'
import Header from './Header.vue'
import PrimaryRail from './PrimaryRail.vue'
import SecondarySidebar from './SecondarySidebar.vue'

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

const router = useRouter()
const { topLevelItems, activeTopLevelPath, activeTopLevelItem, currentSidebarItems, resolveFirstPath } = useSidebarMenu()

const shouldShowSidebar = computed(() => currentSidebarItems.value.length > 0)
const activeSectionTitle = computed(() => activeTopLevelItem.value?.title || '导航目录')
const activeSectionHint = computed(() => {
  if (!currentSidebarItems.value.length) return ''
  return `当前一级域下共 ${currentSidebarItems.value.length} 项菜单`
})

function handleTopLevelSelect(path: string) {
  const target = topLevelItems.value.find((item) => item.path === path)
  if (!target) return
  router.push(target.kind === 'group' ? resolveFirstPath(target) : target.path)
}
</script>

<style scoped>
.double-column-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-main-bg);
  color: var(--layout-main-text);
}

.layout-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.dual-sidebar {
  display: flex;
  flex: 0 0 auto;
  min-height: 0;
}

.layout-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  .dual-sidebar {
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .dual-sidebar.show {
    transform: translateX(0);
  }

  .sidebar-mask {
    position: fixed;
    inset: 60px 0 0 0;
    background-color: var(--layout-overlay);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  .app-content {
    padding: 12px;
  }
}
</style>

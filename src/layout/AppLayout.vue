<template>
  <div class="app-layout">
    <Header :breadcrumbs="breadcrumbs" />

    <div class="app-body">
      <Sidebar
        :active-menu="activeMenu"
        :collapsed="sidebarCollapsed"
        :show="sidebarShow"
        @select="handleMenuSelect"
        @toggle-collapse="toggleSidebar"
      />

      <div v-if="sidebarShow && isMobile" class="sidebar-mask" @click="toggleSidebar"></div>

      <main class="app-main">
        <MainContent :tabs="tabs" :active-tab="activeTab" @remove-tab="removeTab" @tab-click="handleTabClick" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './sidebar/Sidebar.vue'
import MainContent from './maincontent/MainContent.vue'
import Header from './header/Header.vue'

interface Tab {
  title: string
  path: string
}

interface Breadcrumb {
  title: string
  path: string
}

const route = useRoute()
const router = useRouter()

const getRouteTitle = (path: string): string => {
  const record = router.getRoutes().find((r) => r.path === path)
  return (record?.meta?.title as string) || '未知页面'
}

const sidebarCollapsed = ref(false)
const sidebarShow = ref(false)
const isMobile = ref(false)

const tabs = ref<Tab[]>([{ title: '首页', path: '/' }])
const activeTab = ref('/')

watch(
  () => route.path,
  (newPath) => {
    const tabTitle = getRouteTitle(newPath)
    const existingTab = tabs.value.find((tab) => tab.path === newPath)

    if (!existingTab && newPath !== '/') {
      tabs.value.push({ title: tabTitle, path: newPath })
    }

    activeTab.value = newPath
  },
  { immediate: true }
)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({ title: item.meta.title as string, path: item.path }))
})

const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarShow.value = !sidebarShow.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const handleMenuSelect = () => {
  if (isMobile.value) {
    sidebarShow.value = false
  }
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    sidebarShow.value = false
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const removeTab = (targetPath: string) => {
  if (targetPath === '/') return
  const index = tabs.value.findIndex((tab) => tab.path === targetPath)
  if (index > -1) {
    tabs.value.splice(index, 1)
    if (activeTab.value === targetPath) {
      const prevTab = tabs.value[index - 1] || tabs.value[0]
      if (prevTab) router.push(prevTab.path)
    }
  }
}

const handleTabClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-main-bg);
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

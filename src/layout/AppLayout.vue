<template>
  <StandardLayout
    :breadcrumbs="breadcrumbs"
    :active-menu="activeMenu"
    :sidebar-collapsed="sidebarCollapsed"
    :sidebar-show="sidebarShow"
    :is-mobile="isMobile"
    :tabs="tabs"
    :active-tab="activeTab"
    @select-menu="handleMenuSelect"
    @toggle-sidebar="toggleSidebar"
    @remove-tab="removeTab"
    @tab-click="handleTabClick"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StandardLayout from '@/layout/modes/double-column/Layout.vue'

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
  if (path === route.path && route.meta?.title) return route.meta.title as string
  const record = router.getRoutes().find((item) => item.path === path)
  return (record?.meta?.title as string) || '未知页面'
}

const sidebarCollapsed = ref(false)
const sidebarShow = ref(false)
const isMobile = ref(false)

const tabs = ref<Tab[]>([{ title: '工作台', path: '/' }])
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

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    title: item.meta.title as string,
    path: item.path
  }))
})

const activeMenu = computed(() => (route.meta?.activeMenu as string) || route.path)

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarShow.value = !sidebarShow.value
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
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
  if (index === -1) return

  tabs.value.splice(index, 1)

  if (activeTab.value === targetPath) {
    const fallbackTab = tabs.value[index - 1] || tabs.value[0]
    if (fallbackTab) {
      router.push(fallbackTab.path)
    }
  }
}

const handleTabClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped></style>

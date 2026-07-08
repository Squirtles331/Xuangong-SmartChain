<template>
  <component
    :is="currentLayoutComp"
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
import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

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
const layoutStore = useLayoutStore()

const getRouteTitle = (path: string): string => {
  // 优先用当前路由已解析的标题（含带参数的动态路由）；否则回退到按路径匹配路由记录
  if (path === route.path && route.meta?.title) return route.meta.title as string
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

const activeMenu = computed(() => (route.meta?.activeMenu as string) || route.path)

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

const currentLayoutComp = computed(() => {
  switch (layoutStore.mode) {
    // 纵向布局：左侧侧栏 + 顶部头部 + 内容
    case 'vertical':
      return defineAsyncComponent(() => import('@/layout/modes/vertical/Layout.vue'))
    // 横向布局：无侧栏，仅头部 + 内容（面包屑隐藏）
    case 'horizontal':
      return defineAsyncComponent(() => import('@/layout/modes/horizontal/Layout.vue'))
    // 分栏布局：主侧栏 + 次侧栏 + 内容
    case 'columns':
      return defineAsyncComponent(() => import('@/layout/modes/columns/Layout.vue'))
    // 混合布局：头部 + 侧栏组合，灵活扩展
    case 'mixed':
      return defineAsyncComponent(() => import('@/layout/modes/mixed/Layout.vue'))
    // 嵌入布局：仅内容区域（无头部、无侧栏）
    case 'embedded':
      return defineAsyncComponent(() => import('@/layout/modes/embedded/Layout.vue'))
    // 经典布局：标准头部 + 左侧侧栏 + 内容
    case 'classic':
    default:
      return defineAsyncComponent(() => import('@/layout/modes/classic/Layout.vue'))
  }
})
</script>

<style scoped></style>

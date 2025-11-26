<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/icons/demo.svg" alt="Logo" />
        <span class="logo-text">玄工智链 · XIC</span>
      </div>
    </div>
    <div class="header-center">
      <el-menu mode="horizontal" :default-active="activeMenu" router class="top-menu" ellipsis :ellipsis-icon="MoreFilled">
        <el-menu-item v-for="item in topItems" :key="item.path" :index="item.path">{{ item.title }}</el-menu-item>
      </el-menu>
    </div>
    <HeaderRight />
  </header>
</template>

<script setup lang="ts">
import HeaderRight from '@/layout/common/HeaderRight.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
const props = defineProps<{ breadcrumbs: { title: string; path: string }[] }>()
const router = useRouter()
const activeMenu = computed(() => {
  const r: any = router as any
  const current = r.currentRoute?.value?.path || '/'
  return current
})
const singleItems = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  let children = Array.isArray(layout?.children) ? layout.children : []
  children = children.slice().sort((a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
  return children
    .filter((r: any) => !(r.meta && r.meta.hidden) && !Array.isArray(r.children))
    .map((r: any) => ({ path: r.path ? `/${r.path}` : '/', title: r.meta?.title ?? r.name ?? r.path }))
})
const groups = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  let children = Array.isArray(layout?.children) ? layout.children : []
  children = children.slice().sort((a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
  return children
    .filter((r: any) => Array.isArray(r.children))
    .map((r: any) => ({
      path: r.path ? `/${r.path}` : '/',
      title: r.meta?.title ?? r.name ?? r.path,
      firstChildPath: (() => {
        const first = (r.children || [])
          .filter((c: any) => !(c.meta && c.meta.hidden))
          .sort((a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))[0]
        return first ? `${r.path ? `/${r.path}` : '/'}/${first.path}`.replace(/\/+/g, '/').replace(/\/+$/, '') : r.path ? `/${r.path}` : '/'
      })()
    }))
})
const topItems = computed(() => {
  return [...singleItems.value, ...groups.value.map((g: any) => ({ path: g.firstChildPath, title: g.title }))]
})
</script>

<style scoped>
.app-header {
  height: 60px;
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px var(--layout-header-shadow);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo img {
  width: 32px;
  height: 32px;
}
.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.header-center {
  flex: 1;
  margin: 0 20px;
  max-width: 960px;
  overflow: hidden;
}
.top-menu {
  border-bottom: none;
}
@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }
  .header-center {
    display: none;
  }
}
</style>

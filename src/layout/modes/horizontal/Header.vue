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
        <el-menu-item v-for="item in singleItems" :key="item.path" :index="item.path">{{ item.title }}</el-menu-item>
        <el-sub-menu v-for="group in groups" :key="group.path" :index="group.path">
          <template #title>{{ group.title }}</template>
          <el-menu-item v-for="child in group.children" :key="child.path" :index="child.path">{{ child.title }}</el-menu-item>
        </el-sub-menu>
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
      children: (r.children || [])
        .filter((c: any) => !(c.meta && c.meta.hidden))
        .sort((a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
        .map((c: any) => ({
          path: `${r.path ? `/${r.path}` : '/'}/${c.path}`.replace(/\/+/g, '/').replace(/\/+$/, ''),
          title: c.meta?.title ?? c.name ?? c.path
        }))
    }))
})
</script>

<style scoped>
.app-header {
  height: 60px;
  background-color: var(--layout-header-bg);
  border-bottom: none;
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

<template>
  <aside class="sub-sidebar" :class="{ collapsed }">
    <div v-if="!collapsed" class="sub-top"><span class="logo-text">玄工智链 · XIC</span></div>
    <el-menu
      class="sub-menu"
      :default-active="activeChild"
      router
      :collapse="collapsed"
      background-color="var(--layout-sidebar-bg)"
      text-color="var(--layout-sidebar-text)"
      active-text-color="var(--layout-sidebar-active-text)"
    >
      <el-menu-item v-for="item in items" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="getIcon(item.icon || 'Document')" />
        </el-icon>
        <span class="menu-title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'
const props = defineProps<{ collapsed?: boolean }>()
const router = useRouter()
const route = useRoute()
const activeChild = computed(() => route.path)
const seg = computed(() => route.path.replace(/^\/+/, '').split('/')[0] || '')
const items = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  const parent = Array.isArray(layout?.children) ? layout.children.find((r: any) => r.path === seg.value) : null
  const children = Array.isArray(parent?.children) ? parent.children : []
  return children
    .filter((c: any) => !(c.meta && c.meta.hidden))
    .sort((a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
    .map((c: any) => ({
      path: `/${seg.value}/${c.path}`.replace(/\/+/g, '/').replace(/\/+$/, ''),
      title: c.meta?.title ?? c.name ?? c.path,
      icon: c.meta?.icon as string | undefined
    }))
})
const getIcon = (name?: string) => {
  const icons: any = Icons as any
  return (name && icons[name]) || (icons['Document'] as any)
}
// fixed top title for secondary sidebar
</script>

<style scoped>
.sub-sidebar {
  width: 200px;
  border-right: 1px solid var(--layout-header-border);
  background-color: var(--layout-sidebar-bg);
  display: flex;
  flex-direction: column;
}
.sub-top {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background-color: var(--layout-sidebar-bg);
  color: var(--el-text-color-primary);
  font-weight: 600;
}
.sub-menu {
  flex: 1;
  border-right: none;
}
.sub-sidebar :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  color: var(--layout-sidebar-text);
}
.sub-sidebar :deep(.el-menu-item:hover) {
  background-color: var(--layout-sidebar-hover-bg);
}
.sub-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: var(--layout-sidebar-active-bg);
  border-radius: 8px;
}
.collapsed {
  width: 64px;
}
.collapsed .sub-top {
  display: none;
}
.collapsed .menu-title {
  display: none;
}
.collapsed .logo-text {
  display: none;
}
@media (max-width: 768px) {
  .sub-sidebar {
    display: none;
  }
}
</style>

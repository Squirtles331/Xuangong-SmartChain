<template>
  <aside class="sub-sidebar" :class="{ collapsed }">
    <div class="sub-top">
      <div class="sub-top-copy">
        <div class="sub-top-title">{{ parentTitle }}</div>
        <div class="sub-top-subtitle">功能目录</div>
      </div>
    </div>

    <el-menu
      class="sub-menu"
      :default-active="activeChild"
      :collapse="collapsed"
      router
      background-color="var(--layout-sidebar-bg)"
      text-color="var(--layout-sidebar-text)"
      active-text-color="var(--layout-sidebar-active-text)"
    >
      <SidebarMenuItem v-for="item in items" :key="item.path" :item="item" :leaf-icon="true" />
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarMenuItem from '@/layout/common/SidebarMenuItem.vue'

defineProps<{ collapsed?: boolean }>()

const router = useRouter()
const route = useRoute()

const activeChild = computed(() => route.path)
const seg = computed(() => route.path.replace(/^\/+/, '').split('/')[0] || '')

const stripParams = (path: string) => path.replace(/\/:[^/]+/g, '')
const normalize = (path: string) => stripParams(path).replace(/\/+/g, '/').replace(/\/+$/, '')
const orderByMeta = (a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)

const layoutChildren = computed<any[]>(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((item: any) => item.path === '/')
  return Array.isArray(layout?.children) ? layout.children : []
})

const parentRoute = computed(() => layoutChildren.value.find((item: any) => item.path === seg.value) ?? null)

const parentTitle = computed(() => parentRoute.value?.meta?.title ?? parentRoute.value?.name ?? '当前模块')

const mapChild = (child: any, parentPath: string): any => {
  const childPath = normalize(`${parentPath}/${child.path}`)
  const base = {
    path: childPath,
    title: child.meta?.title ?? child.name ?? child.path,
    icon: child.meta?.icon as string | undefined,
    menuTag: child.meta?.menuTag as string | undefined
  }

  if (Array.isArray(child.children) && child.children.length) {
    return {
      ...base,
      children: child.children
        .filter((item: any) => !item.meta?.hidden)
        .sort(orderByMeta)
        .map((item: any) => mapChild(item, childPath))
    }
  }

  return base
}

const items = computed(() => {
  const children = Array.isArray(parentRoute.value?.children) ? parentRoute.value.children : []
  return children
    .filter((item: any) => !item.meta?.hidden)
    .sort(orderByMeta)
    .map((item: any) => mapChild(item, `/${seg.value}`))
})
</script>

<style scoped>
.sub-sidebar {
  width: 248px;
  border-right: 1px solid var(--layout-sidebar-border);
  background-color: color-mix(in srgb, var(--layout-sidebar-bg) 92%, #132131 8%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.sub-top {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--layout-sidebar-border);
}

.sub-top-copy {
  min-width: 0;
}

.sub-top-title {
  font-size: 15px;
  line-height: 1.2;
  font-weight: 700;
  color: #f4f7fb;
}

.sub-top-subtitle {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.2;
  color: rgba(208, 220, 236, 0.72);
}

.sub-menu {
  flex: 1;
  border-right: none;
  padding: 12px 10px 14px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sub-menu::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.sub-sidebar :deep(.el-menu) {
  border-right: none;
}

.sub-sidebar :deep(.el-menu-item),
.sub-sidebar :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin-bottom: 6px;
  border-radius: 10px;
  color: var(--layout-sidebar-text);
}

.sub-sidebar :deep(.el-menu-item:hover),
.sub-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--layout-sidebar-hover-bg);
}

.sub-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: var(--layout-sidebar-active-bg);
  box-shadow: inset 0 0 0 1px rgba(94, 155, 229, 0.2);
}

.sub-sidebar :deep(.el-menu-item .el-icon),
.sub-sidebar :deep(.el-sub-menu__title .el-icon) {
  margin-right: 10px;
}

.sub-sidebar :deep(.el-sub-menu .el-menu-item) {
  min-width: 0;
  padding-left: 46px !important;
}

.sub-sidebar.collapsed {
  width: 80px;
}

.sub-sidebar.collapsed .sub-top {
  padding: 12px 0;
  display: flex;
  justify-content: center;
}

.sub-sidebar.collapsed .sub-top-copy {
  display: none;
}

.sub-sidebar.collapsed .sub-menu {
  padding: 12px 8px 14px;
}

.sub-sidebar.collapsed :deep(.el-menu-item),
.sub-sidebar.collapsed :deep(.el-sub-menu__title) {
  justify-content: center;
  padding: 0 !important;
}

.sub-sidebar.collapsed :deep(.el-menu-item .el-icon),
.sub-sidebar.collapsed :deep(.el-sub-menu__title .el-icon) {
  margin-right: 0;
}

.sub-sidebar.collapsed :deep(.menu-title),
.sub-sidebar.collapsed :deep(.menu-tag) {
  display: none;
}

@media (max-width: 768px) {
  .sub-sidebar {
    display: none;
  }
}
</style>

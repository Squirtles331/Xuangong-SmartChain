<template>
  <aside class="app-sidebar" :class="{ collapsed: collapsed, show: show }">
    <div class="sidebar-top">
      <el-avatar class="avatar" size="small" />
      <span class="system-name">玄工智链 · XIC</span>
    </div>
    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      :collapse="collapsed"
      router
      background-color="var(--layout-sidebar-bg)"
      text-color="var(--layout-sidebar-text)"
      active-text-color="var(--layout-sidebar-active-text)"
      @select="onSelect"
    >
      <el-menu-item v-for="item in singleItems" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="getIcon(item.icon || (item.path === '/' ? 'House' : 'Document'))" />
        </el-icon>
        <span class="menu-title">{{ item.title }}</span>
      </el-menu-item>
      <el-sub-menu v-for="group in groups" :key="group.path" :index="group.path">
        <template #title>
          <el-icon><component :is="getIcon(group.icon || 'Menu')" /></el-icon>
          <span class="menu-title">{{ group.title }}</span>
        </template>
        <el-menu-item v-for="child in group.children" :key="child.path" :index="child.path">{{ child.title }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="sidebar-bottom">
      <UserDropdown />
      <el-button type="text" class="collapse-toggle" @click="emit('toggle-collapse')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Fold } from '@element-plus/icons-vue'
import UserDropdown from '@/layout/common/header-right/UserDropdown.vue'
import * as Icons from '@element-plus/icons-vue'
import { useSidebarMenu } from '@/layout/common/useSidebarMenu'
const props = defineProps<{ activeMenu: string; collapsed: boolean; show: boolean }>()
const emit = defineEmits<{ (e: 'select'): void; (e: 'toggle-collapse'): void }>()

const { singleItems, groups } = useSidebarMenu()
const onSelect = () => emit('select')
const getIcon = (name?: string) => {
  const icons: any = Icons as any
  return (name && icons[name]) || (icons['Document'] as any)
}
</script>

<style scoped>
.app-sidebar {
  width: 200px;
  background-color: var(--layout-sidebar-bg);
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.app-sidebar.collapsed {
  width: 64px;
}
.sidebar-top {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-bottom: 1px solid var(--layout-header-border);
  background-color: var(--layout-sidebar-bg);
}
.system-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.app-sidebar.collapsed .system-name {
  display: none;
}
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}
.sidebar-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.sidebar-menu::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.app-sidebar :deep(.el-menu) {
  border-right: none;
}
.app-sidebar :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  color: var(--layout-sidebar-text);
}
.app-sidebar :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  color: var(--layout-sidebar-text);
}
.app-sidebar :deep(.el-menu-item:hover),
.app-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--layout-sidebar-hover-bg);
}
.app-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: var(--layout-sidebar-active-bg);
  border-radius: 8px;
}
.app-sidebar.collapsed .menu-title {
  display: none;
}
.sidebar-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid var(--layout-sidebar-border);
  background-color: var(--layout-sidebar-bg);
}
.collapse-toggle {
  color: var(--layout-sidebar-text);
}
</style>

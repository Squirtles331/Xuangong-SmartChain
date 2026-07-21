<template>
  <aside class="app-sidebar" :class="{ collapsed, show }">
    <div class="sidebar-top">
      <div class="sidebar-brand">
        <img class="sidebar-brand-logo" :src="logoUrl" alt="玄工智链" />
        <div class="sidebar-brand-copy">
          <div class="sidebar-brand-title">玄工智链</div>
          <div class="sidebar-brand-subtitle">业务导航</div>
        </div>
      </div>
    </div>

    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      :collapse="collapsed"
      :unique-opened="true"
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
        <span class="menu-title-wrap">
          <span class="menu-title">{{ item.title }}</span>
          <span v-if="item.menuTag" class="menu-tag">{{ item.menuTag }}</span>
        </span>
      </el-menu-item>

      <el-sub-menu v-for="group in groups" :key="group.path" :index="group.path">
        <template #title>
          <el-icon><component :is="getIcon(group.icon || 'Menu')" /></el-icon>
          <span class="menu-title-wrap">
            <span class="menu-title">{{ group.title }}</span>
            <span v-if="group.menuTag" class="menu-tag">{{ group.menuTag }}</span>
          </span>
        </template>
        <SidebarMenuItem v-for="child in group.children" :key="child.path" :item="child" />
      </el-sub-menu>
    </el-menu>

    <div class="sidebar-footer">
      <span v-if="!collapsed" class="sidebar-footer-text">收起导航</span>
      <el-button text class="collapse-toggle" @click="emit('toggle-collapse')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import { Fold } from '@element-plus/icons-vue'
import logoUrl from '@/assets/images/logo.png'
import SidebarMenuItem from '@/layout/common/SidebarMenuItem.vue'
import { useSidebarMenu } from '@/layout/common/useSidebarMenu'

defineProps<{ activeMenu: string; collapsed: boolean; show: boolean }>()

const emit = defineEmits<{ (e: 'select'): void; (e: 'toggle-collapse'): void }>()
const { singleItems, groups } = useSidebarMenu()

const onSelect = () => emit('select')

const getIcon = (name?: string) => {
  const icons = Icons as Record<string, unknown>
  return (name && icons[name]) || icons.Document
}
</script>

<style scoped>
.app-sidebar {
  width: 248px;
  background: var(--layout-sidebar-gradient);
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--layout-sidebar-border);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.04);
}

.app-sidebar.collapsed {
  width: 80px;
}

.sidebar-top {
  padding: 20px 18px 14px;
  border-bottom: 1px solid var(--layout-sidebar-border);
}

.sidebar-brand {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0;
  border: none;
  background: transparent;
  backdrop-filter: none;
}

.sidebar-brand-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex: 0 0 auto;
  padding: 5px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 20px -16px rgba(4, 18, 68, 0.65);
}

.sidebar-brand-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 1px;
}

.sidebar-brand-title {
  font-size: 19px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--layout-sidebar-active-text);
  font-family: var(--app-font-display);
  letter-spacing: 0;
}

.sidebar-brand-subtitle {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 11px;
  line-height: 1;
  color: rgba(243, 246, 255, 0.78);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.app-sidebar.collapsed .sidebar-top {
  padding: 16px 0 12px;
}

.app-sidebar.collapsed .sidebar-brand {
  justify-content: center;
  align-items: center;
}

.app-sidebar.collapsed .sidebar-brand-copy {
  display: none;
}

.app-sidebar.collapsed .sidebar-brand-logo {
  width: 32px;
  height: 32px;
  padding: 4px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 16px 10px 14px;
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

.app-sidebar :deep(.el-menu-item),
.app-sidebar :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin-bottom: 6px;
  border-radius: 12px;
  color: var(--layout-sidebar-text);
  border: 1px solid transparent;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.app-sidebar :deep(.el-menu-item:hover),
.app-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--layout-sidebar-hover-bg);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(2px);
}

.app-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: var(--layout-sidebar-active-bg);
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(10, 42, 148, 0.14);
}

.app-sidebar :deep(.el-menu-item .el-icon),
.app-sidebar :deep(.el-sub-menu__title .el-icon) {
  margin-right: 10px;
}

.app-sidebar :deep(.el-sub-menu .el-menu-item) {
  min-width: 0;
  padding-left: 46px !important;
}

.menu-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.menu-tag {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #f3f6ff;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
}

.app-sidebar.collapsed .menu-title,
.app-sidebar.collapsed .menu-tag {
  display: none;
}

.app-sidebar.collapsed .sidebar-menu {
  padding: 12px 8px 14px;
}

.app-sidebar.collapsed :deep(.el-menu-item),
.app-sidebar.collapsed :deep(.el-sub-menu__title) {
  justify-content: center;
  padding: 0 !important;
}

.app-sidebar.collapsed :deep(.el-menu-item .el-icon),
.app-sidebar.collapsed :deep(.el-sub-menu__title .el-icon) {
  margin-right: 0;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.06) 100%);
  border-top: 1px solid var(--layout-sidebar-border);
}

.sidebar-footer-text {
  font-size: 12px;
  color: var(--layout-sidebar-muted-text);
}

.collapse-toggle {
  color: var(--layout-sidebar-text);
}

.app-sidebar.collapsed .sidebar-footer {
  justify-content: center;
  padding: 12px 0;
}

.app-sidebar.collapsed .sidebar-footer-text {
  display: none;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .app-sidebar.show {
    transform: translateX(0);
  }
}
</style>

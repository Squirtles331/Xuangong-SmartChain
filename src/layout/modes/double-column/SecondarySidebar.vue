<template>
  <aside class="secondary-sidebar" :class="{ collapsed, show }">
    <div class="sidebar-head">
      <div class="sidebar-title">{{ sectionTitle || '导航目录' }}</div>
      <div v-if="sectionHint" class="sidebar-hint">{{ sectionHint }}</div>
    </div>

    <div v-if="items.length" class="sidebar-menu-wrap">
      <el-menu
        class="sidebar-menu"
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        router
        background-color="transparent"
        text-color="var(--layout-sub-sidebar-text)"
        active-text-color="var(--layout-sub-sidebar-active-text)"
        @select="emit('select')"
      >
        <SidebarMenuItem v-for="item in items" :key="item.path" :item="item" :leaf-icon="true" />
      </el-menu>
    </div>

    <div v-else class="sidebar-empty">当前一级菜单下没有二级导航，可以直接在内容区操作。</div>

    <div class="sidebar-footer">
      <span v-if="!collapsed" class="sidebar-footer-text">收起目录</span>
      <el-button text class="collapse-toggle" @click="emit('toggle-collapse')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Fold } from '@element-plus/icons-vue'
import SidebarMenuItem from '@/layout/common/SidebarMenuItem.vue'
import type { SidebarItem } from '@/layout/common/useSidebarMenu'

defineProps<{
  items: SidebarItem[]
  activeMenu: string
  collapsed: boolean
  show: boolean
  sectionTitle: string
  sectionHint?: string
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'toggle-collapse'): void
}>()
</script>

<style scoped>
.secondary-sidebar {
  width: 272px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--layout-sub-sidebar-border);
  background: var(--layout-sub-sidebar-bg);
  box-shadow: var(--layout-sub-sidebar-shadow);
  transition: width 0.3s ease;
  overflow: hidden;
}

.secondary-sidebar.collapsed {
  width: 84px;
}

.sidebar-head {
  padding: 22px 18px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--layout-sub-sidebar-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color) 96%, transparent) 0%, transparent 100%),
    radial-gradient(circle at top left, color-mix(in srgb, var(--el-color-primary) 8%, transparent) 0%, transparent 48%);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--layout-sub-sidebar-title);
  letter-spacing: 0.01em;
}

.sidebar-hint {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--layout-sub-sidebar-hint);
}

.secondary-sidebar.collapsed .sidebar-head {
  padding: 20px 8px 12px;
}

.secondary-sidebar.collapsed .sidebar-title,
.secondary-sidebar.collapsed .sidebar-hint {
  display: none;
}

.sidebar-menu-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 12px 18px;
  scrollbar-width: none;
}

.sidebar-menu-wrap::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.secondary-sidebar :deep(.el-menu) {
  border-right: none;
  background: transparent;
}

.secondary-sidebar :deep(.el-menu-item),
.secondary-sidebar :deep(.el-sub-menu__title) {
  height: 46px;
  line-height: 46px;
  margin-bottom: 8px;
  padding-right: 14px !important;
  border-radius: 12px;
  color: var(--layout-sub-sidebar-text);
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.secondary-sidebar :deep(.el-menu-item .el-icon),
.secondary-sidebar :deep(.el-sub-menu__title .el-icon) {
  color: var(--layout-sub-sidebar-muted-text);
  transition: color 0.2s ease;
}

.secondary-sidebar :deep(.el-sub-menu__icon-arrow) {
  color: var(--layout-sub-sidebar-muted-text);
}

.secondary-sidebar :deep(.el-menu-item:hover),
.secondary-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--layout-sub-sidebar-hover-bg);
  color: var(--layout-sub-sidebar-title);
  transform: translateX(2px);
}

.secondary-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sub-sidebar-active-text);
  background: var(--layout-sub-sidebar-active-bg);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 20%, transparent),
    0 10px 18px color-mix(in srgb, var(--el-color-primary) 14%, transparent);
}

.secondary-sidebar :deep(.el-menu-item:hover .el-icon),
.secondary-sidebar :deep(.el-sub-menu__title:hover .el-icon),
.secondary-sidebar :deep(.el-menu-item.is-active .el-icon),
.secondary-sidebar :deep(.el-sub-menu.is-active > .el-sub-menu__title .el-icon),
.secondary-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-icon),
.secondary-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  color: inherit;
}

.secondary-sidebar :deep(.el-sub-menu.is-active > .el-sub-menu__title),
.secondary-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: var(--layout-sub-sidebar-title);
  background-color: color-mix(in srgb, var(--layout-sub-sidebar-hover-bg) 92%, transparent);
}

.secondary-sidebar :deep(.el-sub-menu .el-menu-item) {
  min-width: 0;
  padding-left: 48px !important;
  font-size: 13px;
}

.secondary-sidebar.collapsed .sidebar-menu-wrap {
  padding: 14px 8px 18px;
}

.secondary-sidebar.collapsed :deep(.el-menu-item),
.secondary-sidebar.collapsed :deep(.el-sub-menu__title) {
  justify-content: center;
  padding: 0 !important;
}

.secondary-sidebar.collapsed :deep(.el-menu-item .el-icon),
.secondary-sidebar.collapsed :deep(.el-sub-menu__title .el-icon) {
  margin-right: 0;
}

.sidebar-empty {
  flex: 1;
  min-height: 0;
  padding: 20px 18px;
  color: var(--layout-sub-sidebar-hint);
  font-size: 13px;
  line-height: 1.7;
}

.secondary-sidebar.collapsed .sidebar-empty {
  display: none;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-top: 1px solid color-mix(in srgb, var(--layout-sub-sidebar-border) 88%, transparent);
  background: var(--layout-sub-sidebar-footer-bg);
  backdrop-filter: blur(12px);
}

.sidebar-footer-text {
  font-size: 12px;
  color: var(--layout-sub-sidebar-hint);
}

.collapse-toggle {
  color: var(--layout-sub-sidebar-text);
}

.secondary-sidebar.collapsed .sidebar-footer {
  justify-content: center;
  padding: 12px 0;
}

.secondary-sidebar.collapsed .sidebar-footer-text {
  display: none;
}
</style>

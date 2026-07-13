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
        text-color="var(--layout-sidebar-text)"
        active-text-color="var(--layout-sidebar-active-text)"
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
  width: 248px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--layout-sidebar-border);
  background: linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color) 94%, #f7fbff 6%) 0%, var(--el-bg-color) 100%);
  transition: width 0.3s ease;
  overflow: hidden;
}

.secondary-sidebar.collapsed {
  width: 84px;
}

.sidebar-head {
  padding: 18px 16px 12px;
  border-bottom: 1px solid rgba(124, 146, 170, 0.14);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.sidebar-hint {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

.secondary-sidebar.collapsed .sidebar-head {
  padding: 18px 8px 12px;
}

.secondary-sidebar.collapsed .sidebar-title,
.secondary-sidebar.collapsed .sidebar-hint {
  display: none;
}

.sidebar-menu-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 10px 14px;
  scrollbar-width: none;
}

.sidebar-menu-wrap::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.secondary-sidebar :deep(.el-menu) {
  border-right: none;
}

.secondary-sidebar :deep(.el-menu-item),
.secondary-sidebar :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin-bottom: 6px;
  border-radius: 10px;
  color: var(--layout-sidebar-text);
}

.secondary-sidebar :deep(.el-menu-item:hover),
.secondary-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: rgba(39, 108, 185, 0.08);
}

.secondary-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: color-mix(in srgb, var(--layout-sidebar-active-bg) 72%, #ffffff 28%);
  box-shadow: inset 0 0 0 1px rgba(94, 155, 229, 0.16);
}

.secondary-sidebar :deep(.el-sub-menu .el-menu-item) {
  min-width: 0;
  padding-left: 46px !important;
}

.secondary-sidebar.collapsed .sidebar-menu-wrap {
  padding: 12px 8px 14px;
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
  padding: 18px 16px;
  color: var(--el-text-color-secondary);
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
  padding: 12px 14px;
  border-top: 1px solid rgba(124, 146, 170, 0.14);
  background: rgba(255, 255, 255, 0.76);
}

.sidebar-footer-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.collapse-toggle {
  color: var(--layout-sidebar-text);
}

.secondary-sidebar.collapsed .sidebar-footer {
  justify-content: center;
  padding: 12px 0;
}

.secondary-sidebar.collapsed .sidebar-footer-text {
  display: none;
}
</style>

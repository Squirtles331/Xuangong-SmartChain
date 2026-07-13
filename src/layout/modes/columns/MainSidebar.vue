<template>
  <aside class="app-sidebar" :class="{ collapsed, show }">
    <div class="sidebar-top">
      <div class="sidebar-brand">
        <img class="sidebar-brand-logo" :src="logoUrl" alt="玄工智链" />
        <div class="sidebar-brand-copy">
          <div class="sidebar-brand-title">玄工智链</div>
          <div class="sidebar-brand-subtitle">业务域导航</div>
        </div>
      </div>
    </div>

    <el-menu
      class="sidebar-menu"
      :default-active="activeIndex"
      :collapse="collapsed"
      router
      background-color="var(--layout-sidebar-bg)"
      text-color="var(--layout-sidebar-text)"
      active-text-color="var(--layout-sidebar-active-text)"
      @select="onSelect"
    >
      <el-menu-item v-for="entry in mainEntries" :key="entry.path" :index="entry.path">
        <el-icon>
          <component :is="getIcon(entry.icon || (entry.path === '/' ? 'House' : 'Document'))" />
        </el-icon>
        <span class="menu-title-wrap">
          <span class="menu-title">{{ entry.title }}</span>
          <span v-if="entry.menuTag" class="menu-tag">{{ entry.menuTag }}</span>
        </span>
      </el-menu-item>
    </el-menu>

    <div class="sidebar-footer">
      <span v-if="!collapsed" class="sidebar-footer-text">收起主导航</span>
      <el-button text class="collapse-toggle" @click="emit('toggle-collapse')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'
import { Fold } from '@element-plus/icons-vue'
import logoUrl from '@/assets/images/logo.png'
import { useSidebarMenu } from '@/layout/common/useSidebarMenu'

defineProps<{ activeMenu: string; collapsed: boolean; show: boolean }>()

const emit = defineEmits<{ (e: 'select'): void; (e: 'toggle-collapse'): void }>()
const { singleItems, groups } = useSidebarMenu()
const route = useRoute()

const onSelect = () => emit('select')

const getIcon = (name?: string) => {
  const icons = Icons as Record<string, unknown>
  return (name && icons[name]) || icons.Document
}

type MainEntry = {
  title: string
  icon?: string
  path: string
  seg?: string
  menuTag?: string
}

const mainEntries = computed(() => {
  const groupEntries = groups.value.map((group) => {
    const groupSeg = group.path.replace(/^\/+/, '').split('/')[0] || ''
    return {
      title: group.title,
      icon: group.icon,
      path: group.path,
      seg: groupSeg,
      menuTag: group.menuTag
    }
  })

  return [...singleItems.value, ...groupEntries] as MainEntry[]
})

const activeIndex = computed(() => {
  const seg = route.path.replace(/^\/+/, '').split('/')[0] || ''
  const match = mainEntries.value.find((entry) => (entry.seg ?? entry.path.replace(/^\/+/, '').split('/')[0]) === seg)
  return match ? match.path : route.path
})
</script>

<style scoped>
.app-sidebar {
  width: 248px;
  background-color: var(--layout-sidebar-bg);
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--layout-sidebar-border);
}

.app-sidebar.collapsed {
  width: 80px;
}

.sidebar-top {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--layout-sidebar-border);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex: 0 0 auto;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px;
}

.sidebar-brand-copy {
  min-width: 0;
}

.sidebar-brand-title {
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  color: #f4f7fb;
}

.sidebar-brand-subtitle {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.2;
  color: rgba(208, 220, 236, 0.72);
}

.app-sidebar.collapsed .sidebar-top {
  padding: 16px 0 12px;
}

.app-sidebar.collapsed .sidebar-brand {
  justify-content: center;
}

.app-sidebar.collapsed .sidebar-brand-copy {
  display: none;
}

.app-sidebar.collapsed .sidebar-brand-logo {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 10px;
  background: transparent;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px 14px;
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
  border-radius: 10px;
  color: var(--layout-sidebar-text);
}

.app-sidebar :deep(.el-menu-item:hover),
.app-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--layout-sidebar-hover-bg);
}

.app-sidebar :deep(.el-menu-item.is-active) {
  color: var(--layout-sidebar-active-text);
  background-color: var(--layout-sidebar-active-bg);
  box-shadow: inset 0 0 0 1px rgba(94, 155, 229, 0.2);
}

.app-sidebar :deep(.el-menu-item .el-icon),
.app-sidebar :deep(.el-sub-menu__title .el-icon) {
  margin-right: 10px;
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
  background: rgba(155, 196, 245, 0.12);
  color: #b8d6fb;
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
  border-top: 1px solid var(--layout-sidebar-border);
  background-color: var(--layout-sidebar-bg);
}

.sidebar-footer-text {
  font-size: 12px;
  color: rgba(208, 220, 236, 0.72);
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

<template>
  <aside class="app-sidebar" :class="{ collapsed: collapsed, show: show }">
    <div class="sidebar-top">
      <img src="@/assets/icons/demo.svg" alt="Logo" class="logo-img" />
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
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
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

const route = useRoute()

const mainEntries = computed(() => {
  const groupEntries = groups.value.map((group: any) => {
    const groupSeg = group.path.replace(/^\/+/, '').split('/')[0] || ''
    return {
      title: group.title,
      icon: group.icon,
      path: group.path,
      seg: groupSeg,
      menuTag: group.menuTag
    }
  })

  return [...singleItems.value, ...groupEntries]
})

const activeIndex = computed(() => {
  const seg = route.path.replace(/^\/+/, '').split('/')[0] || ''
  const match = mainEntries.value.find((entry: any) => (entry.seg ?? entry.path.replace(/^\/+/, '').split('/')[0]) === seg)
  return match ? match.path : route.path
})
</script>

<style scoped>
.app-sidebar {
  width: 200px;
  background-color: var(--layout-sidebar-bg);
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--layout-header-border);
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  background-color: var(--layout-sidebar-bg);
}

.logo-img {
  width: 24px;
  height: 24px;
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
  background: rgba(17, 94, 166, 0.08);
  color: #115ea6;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
}

.app-sidebar.collapsed .menu-title {
  display: none;
}

.app-sidebar.collapsed .menu-tag {
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

  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
  }

  .app-sidebar.show {
    transform: translateX(0);
  }
}
</style>

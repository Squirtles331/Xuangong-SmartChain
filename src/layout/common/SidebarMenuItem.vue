<template>
  <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
    <template #title>
      <el-icon><component :is="getIcon(item.icon || 'Menu')" /></el-icon>
      <span class="menu-title-wrap">
        <span class="menu-title">{{ item.title }}</span>
        <span v-if="item.menuTag" class="menu-tag">{{ item.menuTag }}</span>
      </span>
    </template>
    <SidebarMenuItem v-for="child in item.children" :key="child.path" :item="child" :leaf-icon="leafIcon" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path">
    <el-icon v-if="leafIcon"><component :is="getIcon(item.icon || 'Document')" /></el-icon>
    <span class="menu-title-wrap">
      <span class="menu-title">{{ item.title }}</span>
      <span v-if="item.menuTag" class="menu-tag">{{ item.menuTag }}</span>
    </span>
  </el-menu-item>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import type { SidebarItem } from '@/layout/common/useSidebarMenu'

withDefaults(defineProps<{ item: SidebarItem; leafIcon?: boolean }>(), { leafIcon: false })

const getIcon = (name?: string) => {
  const icons: any = Icons as any
  return (name && icons[name]) || (icons['Document'] as any)
}
</script>

<style scoped>
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
</style>

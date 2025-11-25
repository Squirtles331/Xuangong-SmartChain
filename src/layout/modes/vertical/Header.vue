<template>
  <header class="app-header">
    <div class="header-left">
      <el-button type="text" class="collapse-btn" @click="$emit('toggle-sidebar')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
    <div class="header-center" v-if="showBreadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">{{ item.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <HeaderRight />
  </header>
</template>

<script setup lang="ts">
import HeaderRight from '@/layout/common/HeaderRight.vue'
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'
import { Fold } from '@element-plus/icons-vue'
interface Breadcrumb {
  title: string
  path: string
}
const props = defineProps<{ breadcrumbs: Breadcrumb[] }>()
defineEmits<{ (e: 'toggle-sidebar'): void }>()
const layoutStore = useLayoutStore()
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb)
</script>

<style scoped>
.app-header {
  height: 60px;
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
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
.collapse-btn {
  color: var(--el-text-color-regular);
}
.header-center {
  flex: 1;
  margin: 0 20px;
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

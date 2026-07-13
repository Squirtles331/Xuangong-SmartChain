<template>
  <header class="app-header">
    <div class="header-left">
      <div class="brand">
        <img class="brand-logo" :src="logoUrl" alt="玄工智链" />
        <div class="brand-copy">
          <span class="brand-title">玄工智链</span>
          <span class="brand-subtitle">制造运营协同平台</span>
        </div>
      </div>
    </div>

    <div v-if="showBreadcrumb" class="header-center">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">工作台</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">{{ item.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <HeaderRight />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeaderRight from '@/layout/common/HeaderRight.vue'
import { useLayoutStore } from '@/stores/layout'
import logoUrl from '@/assets/images/logo.png'

interface Breadcrumb {
  title: string
  path: string
}

defineProps<{ breadcrumbs: Breadcrumb[] }>()

const layoutStore = useLayoutStore()
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb)
</script>

<style scoped>
.app-header {
  height: 72px;
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 24px;
  box-shadow: 0 1px 4px var(--layout-header-shadow);
}

.header-left {
  flex: 0 0 auto;
  min-width: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex: 0 0 auto;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  font-size: 20px;
  line-height: 1.1;
  font-weight: 700;
  color: var(--el-text-color-primary);
  letter-spacing: 0.01em;
}

.brand-subtitle {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.2;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.header-center {
  flex: 1;
  min-width: 0;
}

.header-center :deep(.el-breadcrumb) {
  font-size: 14px;
}

.header-center :deep(.el-breadcrumb__inner.is-link),
.header-center :deep(.el-breadcrumb__inner) {
  font-weight: 600;
}

@media (max-width: 1280px) {
  .brand-subtitle {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 60px;
    gap: 12px;
    padding: 0 12px;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
  }

  .brand-title {
    font-size: 16px;
  }

  .header-center {
    display: none;
  }
}
</style>

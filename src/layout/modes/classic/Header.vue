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

      <div class="header-context">
        <div class="header-context__meta">
          <span class="header-context__eyebrow">Current Page</span>
          <span class="header-context__separator"></span>
          <span class="header-context__path">{{ contextPath }}</span>
        </div>
        <div class="header-context__main">
          <h1 class="header-context__title">{{ currentTitle }}</h1>
          <span class="header-context__badge">{{ contextTag }}</span>
        </div>

        <div v-if="showBreadcrumb" class="header-context__breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">工作台</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">{{ item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
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

const props = defineProps<{ breadcrumbs: Breadcrumb[] }>()

const layoutStore = useLayoutStore()
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb)

const currentTitle = computed(() => props.breadcrumbs.at(-1)?.title || '工作台')
const contextPath = computed(() => {
  if (!props.breadcrumbs.length) return '业务总览'
  const parentTitles = props.breadcrumbs.slice(0, -1).map((item) => item.title)
  return parentTitles.length ? parentTitles.join(' / ') : '工作台'
})
const contextTag = computed(() => (props.breadcrumbs.length > 1 ? props.breadcrumbs[0].title : '导航页'))
</script>

<style scoped>
.app-header {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 24px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--layout-header-bg) 92%, #ffffff 8%) 0%, var(--layout-header-bg) 100%);
  border-bottom: 1px solid var(--layout-header-border);
  box-shadow: 0 12px 28px -24px var(--layout-header-shadow);
  backdrop-filter: blur(16px);
}

.header-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 8px;
  border-radius: 16px;
  background: var(--layout-header-brand-bg);
  border: 1px solid color-mix(in srgb, var(--layout-header-border) 84%, transparent);
  box-shadow: 0 10px 24px -24px rgba(37, 56, 101, 0.42);
}

.brand-logo {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  object-fit: contain;
  padding: 6px;
  border-radius: 14px;
  background: var(--gradient-soft);
  border: 1px solid rgba(76, 111, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.brand-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 18px;
  line-height: 1.1;
  font-weight: 700;
  color: var(--el-text-color-primary);
  font-family: var(--app-font-display);
  letter-spacing: 0.01em;
}

.brand-subtitle {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.2;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.header-context {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.header-context__meta {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-context__eyebrow {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--el-color-primary);
}

.header-context__separator {
  width: 4px;
  height: 4px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: color-mix(in srgb, var(--el-color-primary) 30%, transparent);
}

.header-context__path {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

.header-context__main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-context__title {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--el-text-color-primary);
  font-family: var(--app-font-display);
}

.header-context__badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 600;
}

.header-context__breadcrumb {
  min-width: 0;
}

.header-context__breadcrumb :deep(.el-breadcrumb) {
  font-size: 12px;
}

.header-context__breadcrumb :deep(.el-breadcrumb__inner.is-link),
.header-context__breadcrumb :deep(.el-breadcrumb__inner) {
  font-weight: 600;
  color: var(--el-text-color-tertiary);
}

.header-context__breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--el-color-primary);
}

@media (max-width: 1280px) {
  .brand-subtitle,
  .header-context__badge {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 60px;
    gap: 12px;
    padding: 0 12px;
  }

  .header-left {
    gap: 10px;
  }

  .brand {
    padding: 6px 8px 6px 6px;
    border-radius: 14px;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
  }

  .brand-copy,
  .header-context__meta,
  .header-context__breadcrumb {
    display: none;
  }

  .header-context__title {
    font-size: 16px;
  }
}
</style>

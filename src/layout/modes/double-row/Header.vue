<template>
  <header class="double-row-header">
    <div class="header-main">
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
    </div>

    <div class="header-nav-row">
      <button
        v-if="showScrollControls"
        type="button"
        class="scroll-arrow"
        :class="{ 'is-disabled': !canScrollPrev }"
        :disabled="!canScrollPrev"
        aria-label="向左查看一级菜单"
        @click="scrollTopNav('prev')"
      >
        <el-icon><ArrowLeft /></el-icon>
      </button>

      <div ref="navScrollRef" class="nav-scroll" @wheel="handleHorizontalWheel">
        <button
          v-for="item in topLevelItems"
          :key="item.path"
          type="button"
          class="top-nav-item"
          :class="{ 'is-active': item.path === activeTopLevelPath }"
          @click="emit('select-top-level', item.path)"
        >
          <el-icon class="top-nav-icon">
            <component :is="getIcon(item.icon || (item.path === '/' ? 'House' : 'Menu'))" />
          </el-icon>
          <span class="top-nav-title">{{ item.title }}</span>
          <span v-if="item.menuTag" class="top-nav-tag">{{ item.menuTag }}</span>
        </button>
      </div>

      <button
        v-if="showScrollControls"
        type="button"
        class="scroll-arrow"
        :class="{ 'is-disabled': !canScrollNext }"
        :disabled="!canScrollNext"
        aria-label="向右查看一级菜单"
        @click="scrollTopNav('next')"
      >
        <el-icon><ArrowRight /></el-icon>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import * as Icons from '@element-plus/icons-vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HeaderRight from '@/layout/common/HeaderRight.vue'
import type { TopLevelNavItem } from '@/layout/common/useSidebarMenu'
import logoUrl from '@/assets/images/logo.png'
import { useLayoutStore } from '@/stores/layout'

interface Breadcrumb {
  title: string
  path: string
}

const props = defineProps<{
  breadcrumbs: Breadcrumb[]
  topLevelItems: TopLevelNavItem[]
  activeTopLevelPath: string
}>()

const emit = defineEmits<{
  (e: 'select-top-level', path: string): void
}>()

const layoutStore = useLayoutStore()
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb)
const navScrollRef = ref<HTMLDivElement | null>(null)
const showScrollControls = ref(false)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

let resizeObserver: ResizeObserver | null = null

const getIcon = (name?: string) => {
  const icons = Icons as Record<string, unknown>
  return (name && icons[name]) || icons.Document
}

const updateScrollState = () => {
  const container = navScrollRef.value
  if (!container) return

  const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0)
  showScrollControls.value = maxScrollLeft > 4
  canScrollPrev.value = container.scrollLeft > 4
  canScrollNext.value = container.scrollLeft < maxScrollLeft - 4
}

const scrollTopNav = (direction: 'prev' | 'next') => {
  const container = navScrollRef.value
  if (!container) return

  const delta = direction === 'next' ? 240 : -240
  container.scrollBy({ left: delta, behavior: 'smooth' })
}

const handleHorizontalWheel = (event: WheelEvent) => {
  const container = navScrollRef.value
  if (!container) return

  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
  if (container.scrollWidth <= container.clientWidth) return

  container.scrollLeft += event.deltaY
  updateScrollState()
  event.preventDefault()
}

onMounted(() => {
  nextTick(updateScrollState)

  const container = navScrollRef.value
  container?.addEventListener('scroll', updateScrollState, { passive: true })

  if ('ResizeObserver' in window && container) {
    resizeObserver = new ResizeObserver(() => updateScrollState())
    resizeObserver.observe(container)
  } else {
    window.addEventListener('resize', updateScrollState)
  }
})

onBeforeUnmount(() => {
  navScrollRef.value?.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', updateScrollState)
})

watch(
  () => [props.topLevelItems.length, props.activeTopLevelPath],
  () => {
    nextTick(updateScrollState)
  },
  { immediate: true }
)
</script>

<style scoped>
.double-row-header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--layout-header-border);
  background: linear-gradient(180deg, color-mix(in srgb, var(--layout-header-bg) 94%, #ffffff 6%) 0%, var(--layout-header-bg) 100%);
  box-shadow: 0 1px 4px var(--layout-header-shadow);
}

.header-main {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 24px;
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

.header-nav-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 16px 12px;
}

.nav-scroll {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.nav-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.scroll-arrow {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--layout-scroll-control-border);
  border-radius: 999px;
  background: var(--layout-scroll-control-bg);
  color: var(--layout-scroll-control-color);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.scroll-arrow:hover:not(.is-disabled) {
  border-color: var(--layout-scroll-control-hover-border);
  background: var(--layout-scroll-control-hover-bg);
  color: var(--layout-scroll-control-hover-color);
}

.scroll-arrow.is-disabled {
  opacity: var(--layout-scroll-control-disabled-opacity);
  cursor: not-allowed;
}

.top-nav-item {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(124, 146, 170, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.68);
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.top-nav-item:hover {
  border-color: rgba(32, 104, 182, 0.28);
  color: var(--el-color-primary);
}

.top-nav-item.is-active {
  border-color: rgba(32, 104, 182, 0.34);
  background: linear-gradient(180deg, rgba(233, 242, 252, 0.96) 0%, rgba(221, 236, 250, 0.88) 100%);
  color: var(--el-color-primary);
  box-shadow: inset 0 0 0 1px rgba(32, 104, 182, 0.08);
}

.top-nav-icon {
  font-size: 16px;
}

.top-nav-title {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.top-nav-tag {
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

@media (max-width: 1280px) {
  .brand-subtitle {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-main {
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

  .header-nav-row {
    padding: 0 12px 10px;
  }

  .top-nav-item {
    height: 36px;
    padding: 0 12px;
  }
}
</style>

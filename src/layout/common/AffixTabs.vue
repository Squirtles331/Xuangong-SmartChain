<template>
  <div class="route-tabs">
    <button
      v-if="showScrollControls"
      type="button"
      class="scroll-arrow"
      :class="{ 'is-disabled': !canScrollPrev }"
      :disabled="!canScrollPrev"
      aria-label="向左查看页签"
      @click="scrollTabs('prev')"
    >
      <el-icon><ArrowLeft /></el-icon>
    </button>

    <div ref="tabsBarRef" class="route-tabs__bar" @wheel="handleHorizontalWheel">
      <div v-for="tab in tabs" :key="tab.path" class="route-tab" :class="{ active: tab.path === activeTab }" @click="onTabClick(tab.path)">
        <span class="tab-title">{{ tab.title }}</span>
        <span v-if="isAffix(tab)" class="tab-affix"></span>
        <button v-else type="button" class="tab-close" @click.stop="onRemoveTab(tab.path)">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>

    <button
      v-if="showScrollControls"
      type="button"
      class="scroll-arrow"
      :class="{ 'is-disabled': !canScrollNext }"
      :disabled="!canScrollNext"
      aria-label="向右查看页签"
      @click="scrollTabs('next')"
    >
      <el-icon><ArrowRight /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TabItem {
  title: string
  path: string
}

const props = defineProps<{ tabs: TabItem[]; activeTab: string; homePath?: string }>()

const emit = defineEmits<{
  (e: 'remove-tab', targetPath: string): void
  (e: 'tab-click', path: string): void
}>()

const tabsBarRef = ref<HTMLDivElement | null>(null)
const showScrollControls = ref(false)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

let resizeObserver: ResizeObserver | null = null

const isAffix = (tab: TabItem) => tab.path === (props.homePath ?? '/')
const onRemoveTab = (targetPath: string) => emit('remove-tab', targetPath)
const onTabClick = (path: string) => emit('tab-click', path)

const updateScrollState = () => {
  const container = tabsBarRef.value
  if (!container) return

  const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0)
  showScrollControls.value = maxScrollLeft > 4
  canScrollPrev.value = container.scrollLeft > 4
  canScrollNext.value = container.scrollLeft < maxScrollLeft - 4
}

const scrollTabs = (direction: 'prev' | 'next') => {
  const container = tabsBarRef.value
  if (!container) return

  const delta = direction === 'next' ? 240 : -240
  container.scrollBy({ left: delta, behavior: 'smooth' })
}

const handleHorizontalWheel = (event: WheelEvent) => {
  const container = tabsBarRef.value
  if (!container) return

  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
  if (container.scrollWidth <= container.clientWidth) return

  container.scrollLeft += event.deltaY
  updateScrollState()
  event.preventDefault()
}

onMounted(() => {
  nextTick(updateScrollState)

  const container = tabsBarRef.value
  container?.addEventListener('scroll', updateScrollState, { passive: true })

  if ('ResizeObserver' in window && container) {
    resizeObserver = new ResizeObserver(() => updateScrollState())
    resizeObserver.observe(container)
  } else {
    window.addEventListener('resize', updateScrollState)
  }
})

onBeforeUnmount(() => {
  tabsBarRef.value?.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', updateScrollState)
})

watch(
  () => [props.tabs.length, props.activeTab],
  () => {
    nextTick(updateScrollState)
  },
  { immediate: true }
)
</script>

<style scoped>
.route-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 52px;
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
  padding: 0 12px;
}

.route-tabs__bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 52px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  padding: 0;
}

.route-tabs__bar::-webkit-scrollbar {
  display: none;
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

.route-tab {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background-color: var(--tab-bg);
  color: var(--tab-color);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.route-tab.active {
  color: var(--tab-active-color);
  background-color: var(--tab-active-bg);
  border-color: var(--tab-active-border);
  box-shadow: 0 4px 12px var(--tab-active-shadow);
}

.tab-title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.tab-affix {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  opacity: 0.85;
}

.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}

.tab-close:hover {
  background-color: var(--tab-hover-bg);
  color: var(--el-text-color-primary);
}
</style>

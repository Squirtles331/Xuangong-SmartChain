<template>
  <div class="route-tabs">
    <div class="route-tabs__bar">
      <div v-for="tab in tabs" :key="tab.path" class="route-tab" :class="{ active: tab.path === activeTab }" @click="onTabClick(tab.path)">
        <span class="tab-title">{{ tab.title }}</span>
        <span v-if="isAffix(tab)" class="tab-affix"></span>
        <button v-else type="button" class="tab-close" @click.stop="onRemoveTab(tab.path)">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabItem {
  title: string
  path: string
}

const props = defineProps<{ tabs: TabItem[]; activeTab: string; homePath?: string }>()

const emit = defineEmits<{
  (e: 'remove-tab', targetPath: string): void
  (e: 'tab-click', path: string): void
}>()

const isAffix = (tab: TabItem) => tab.path === (props.homePath ?? '/')
const onRemoveTab = (targetPath: string) => emit('remove-tab', targetPath)
const onTabClick = (path: string) => emit('tab-click', path)
</script>

<style scoped>
.route-tabs {
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
  padding: 0 20px;
}

.route-tabs__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.route-tabs__bar::-webkit-scrollbar {
  display: none;
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

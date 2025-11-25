<template>
  <div class="chrome-tabs">
    <div class="chrome-tabs__bar">
      <div v-for="tab in tabs" :key="tab.path" class="chrome-tab" :class="{ active: tab.path === activeTab }" @click="onTabClick(tab.path)">
        <span class="tab-label">
          <span class="tab-title">{{ tab.title }}</span>
          <span v-if="isAffix(tab)" class="tab-pin">📌</span>
          <span v-else class="tab-close" @click.stop="onRemoveTab(tab.path)">×</span>
        </span>
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
.chrome-tabs {
  background-color: var(--layout-header-bg);
  border-bottom: 1px solid var(--layout-header-border);
  padding: 0 16px;
}
.chrome-tabs__bar {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 3px 0 0 28px;
  position: relative;
  background-color: var(--layout-header-bg);
}
.chrome-tab {
  position: relative;
  background-color: var(--tab-bg);
  color: var(--tab-color);
  padding: 8px 16px;
  border-radius: 0;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  z-index: 1;
  border-bottom: none;
}

.chrome-tab + .chrome-tab {
  border-left: none;
}

.chrome-tab.active::before,
.chrome-tab.active::after {
  position: absolute;
  bottom: 0;
  content: '';
  width: 28px;
  height: 28px;
  border-radius: 100%;
  box-shadow: 0 0 0 40px var(--tab-bg);
  transition: 0.2s;
}
.chrome-tab.active::before {
  left: -28px;
  clip-path: inset(50% -14px 0 50%);
}
.chrome-tab.active::after {
  right: -28px;
  clip-path: inset(50% 50% 0 -14px);
}
.chrome-tab.active {
  --tab-bg: var(--tab-active-bg);
  --tab-color: var(--tab-active-color);
  z-index: 2;
  border-color: var(--tab-active-border);
  box-shadow: 0 1px 3px var(--tab-active-shadow);
  border-radius: 16px 16px 0 0;
}
.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tab-title {
  font-size: 14px;
  font-weight: 500;
}
.tab-pin {
  font-size: 14px;
  color: var(--el-text-color-tertiary);
}
.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 12px;
  color: var(--el-text-color-primary);
  margin-left: 4px;
}
.tab-close:hover {
  background-color: var(--tab-hover-bg);
  color: var(--el-text-color-primary);
}
</style>

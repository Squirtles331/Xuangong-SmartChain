<template>
  <div class="global-search-shell">
    <el-input
      v-model="search"
      class="global-search"
      :placeholder="'搜索页面、菜单或功能'"
      readonly
      :prefix-icon="Search"
      @click="openSearchDialog"
      @keydown.stop.prevent
    >
      <template #suffix>
        <span class="global-search__shortcut">{{ shortcut }}</span>
      </template>
    </el-input>

    <el-dialog
      v-model="searchDialog"
      title="全局搜索"
      width="640px"
      append-to-body
      :lock-scroll="false"
      align-center
      destroy-on-close
      class="global-search-dialog"
      @opened="handleSearchDialogOpened"
      @closed="handleSearchDialogClosed"
    >
      <div class="global-search-panel">
        <el-input ref="searchInputRef" v-model="searchQuery" :prefix-icon="Search" size="large" placeholder="输入菜单名称、功能名称或关键字" />
        <div class="search-result">当前为静态搜索入口，后续可接入菜单索引与全局命令。</div>
        <div class="search-tip">
          <span>快捷键</span>
          <span>{{ shortcut }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { InputInstance } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const search = ref('')
const searchDialog = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<InputInstance>()
const shortcut = computed(() => (navigator.userAgent.includes('Mac') ? 'Cmd + K' : 'Ctrl + K'))

const openSearchDialog = () => {
  searchDialog.value = true
}

const handleSearchDialogOpened = () => {
  searchInputRef.value?.focus?.()
}

const handleSearchDialogClosed = () => {
  searchQuery.value = ''
}

const handleGlobalSearchShortcut = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
    return
  }

  event.preventDefault()
  openSearchDialog()
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalSearchShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalSearchShortcut)
})
</script>

<style scoped>
.global-search-shell {
  width: 100%;
}

.global-search {
  width: 100%;
  cursor: pointer;
}

.global-search :deep(.el-input__wrapper) {
  height: 42px;
  cursor: pointer;
  border-radius: 14px;
  background: color-mix(in srgb, var(--layout-header-bg) 72%, #f4f7fb 28%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--layout-header-border) 86%, transparent),
    0 10px 24px -24px rgba(32, 49, 93, 0.28);
}

.global-search :deep(.el-input__wrapper:hover) {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 24%, var(--layout-header-border) 76%),
    0 12px 28px -24px rgba(52, 84, 185, 0.3);
}

.global-search :deep(.el-input__inner) {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.global-search :deep(.el-input__prefix-inner) {
  color: var(--el-color-primary);
}

.global-search__shortcut {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--el-text-color-tertiary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.global-search-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-result {
  color: var(--el-text-color-tertiary);
  line-height: 1.7;
}

.search-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--el-fill-color-light) 74%, transparent);
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

:deep(.global-search-dialog) {
  overflow: hidden;
  border-radius: 24px;
}

:deep(.global-search-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 24px 24px 0;
}

:deep(.global-search-dialog .el-dialog__body) {
  padding: 18px 24px 24px;
}
</style>

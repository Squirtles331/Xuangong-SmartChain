<template>
  <div>
    <el-input
      v-model="search"
      size="small"
      class="global-search"
      :placeholder="'搜索页面 / 菜单  ' + shortcut"
      readonly
      :prefix-icon="Search"
      @click="openSearchDialog"
      @keydown.stop.prevent
    />
    <el-dialog v-model="searchDialog" title="全局搜索" width="600px">
      <el-input v-model="searchQuery" :prefix-icon="Search" placeholder="输入菜单名称、功能名称或关键词" />
      <div class="search-result">静态阶段暂未接入搜索索引</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const search = ref('')
const searchDialog = ref(false)
const searchQuery = ref('')
const shortcut = computed(() => 'Ctrl + K')

const openSearchDialog = () => {
  searchDialog.value = true
}
</script>

<style scoped>
.global-search {
  width: 196px;
  cursor: pointer;
}

.global-search:hover {
  cursor: pointer;
}

.global-search :deep(.el-input__wrapper) {
  cursor: pointer;
  border-radius: 10px;
  background: color-mix(in srgb, var(--el-bg-color) 78%, var(--el-fill-color-light) 22%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--el-border-color) 78%, transparent);
}

.global-search :deep(.el-input__wrapper:hover) {
  cursor: pointer;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 22%, var(--el-border-color) 78%);
}

.global-search :deep(.el-input__inner) {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.global-search :deep(.el-input__prefix-inner) {
  color: var(--el-text-color-secondary);
}

.search-result {
  margin-top: 12px;
  color: var(--el-text-color-tertiary);
}
</style>

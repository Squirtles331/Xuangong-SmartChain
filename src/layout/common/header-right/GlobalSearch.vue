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
  width: 180px;
  cursor: pointer;
}

.global-search:hover {
  cursor: pointer;
}

.global-search :deep(.el-input__wrapper) {
  cursor: pointer;
  border-radius: 10px;
}

.global-search :deep(.el-input__wrapper:hover) {
  cursor: pointer;
}

.search-result {
  margin-top: 12px;
  color: var(--el-text-color-tertiary);
}
</style>

<template>
  <div>
    <el-input
      v-model="search"
      size="small"
      class="global-search"
      :placeholder="'搜索 ' + shortcut"
      prefix-icon="Search"
      readonly
      @click="openSearchDialog"
      @keydown.stop.prevent
    />
    <el-dialog v-model="searchDialog" title="全局搜索" width="600px">
      <el-input v-model="searchQuery" placeholder="请输入关键词" prefix-icon="Search" />
      <div class="search-result">暂无数据</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search = ref('')
const searchDialog = ref(false)
const searchQuery = ref('')
const shortcut = computed(() => 'Ctrl K')

const openSearchDialog = () => {
  searchDialog.value = true
}
</script>

<style scoped>
.global-search {
  width: 100px;
  cursor: pointer;
}
.global-search:hover {
  cursor: pointer;
}
.global-search :deep(.el-input__wrapper) {
  cursor: pointer;
}
.global-search :deep(.el-input__wrapper:hover) {
  cursor: pointer;
}
.search-result {
  margin-top: 12px;
  color: #909399;
}
</style>

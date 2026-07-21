<template>
  <div class="crud-toolbar-actions">
    <el-button v-if="showAddButton" type="primary" class="crud-toolbar-actions__add" @click="emit('add')">
      <el-icon><Plus /></el-icon>
      <span>{{ addText }}</span>
    </el-button>
    <el-button v-if="showRefreshButton" class="crud-toolbar-actions__refresh" @click="emit('refresh')">
      <el-icon><RefreshRight /></el-icon>
      <span>{{ refreshText }}</span>
    </el-button>
    <el-button
      v-for="action in actions"
      :key="action.key"
      :type="toolbarButtonType(action.tone)"
      :disabled="action.disabled"
      @click="emit('action', action.key)"
    >
      {{ action.label }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Plus, RefreshRight } from '@element-plus/icons-vue'
import type { CrudToolbarActionItem } from '../types'

defineOptions({
  name: 'CrudToolbarActions'
})

interface CrudToolbarActionsProps {
  actions?: CrudToolbarActionItem[]
  showAddButton?: boolean
  showRefreshButton?: boolean
  addText?: string
  refreshText?: string
}

withDefaults(defineProps<CrudToolbarActionsProps>(), {
  actions: () => [],
  showAddButton: true,
  showRefreshButton: true,
  addText: '新增',
  refreshText: '刷新'
})

const emit = defineEmits<{
  add: []
  refresh: []
  action: [key: string]
}>()

function toolbarButtonType(tone?: CrudToolbarActionItem['tone']) {
  if (!tone || tone === 'default') return undefined
  return tone
}
</script>

<style scoped>
.crud-toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.crud-toolbar-actions :deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.crud-toolbar-actions__refresh {
  color: var(--el-text-color-regular);
}
</style>

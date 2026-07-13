<template>
  <div class="crud-toolbar-actions">
    <gi-button v-if="showAddButton" type="add" @click="emit('add')">{{ addText }}</gi-button>
    <gi-button v-if="showRefreshButton" type="reset" @click="emit('refresh')">{{ refreshText }}</gi-button>
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
</style>

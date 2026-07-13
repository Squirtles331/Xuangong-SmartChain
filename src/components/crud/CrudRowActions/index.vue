<template>
  <div class="crud-row-actions">
    <el-button
      v-for="action in visibleActions"
      :key="action.key"
      link
      size="small"
      :type="rowButtonType(action.tone)"
      :disabled="action.disabled"
      @click="emit('action', action.key)"
    >
      {{ action.label }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CrudRowActionItem } from '../types'

defineOptions({
  name: 'CrudRowActions'
})

interface CrudRowActionsProps {
  actions?: CrudRowActionItem[]
}

const props = withDefaults(defineProps<CrudRowActionsProps>(), {
  actions: () => []
})

const emit = defineEmits<{
  action: [key: string]
}>()

const visibleActions = computed(() => props.actions.filter((item) => !item.hidden))

function rowButtonType(tone?: CrudRowActionItem['tone']) {
  if (!tone || tone === 'secondary') return 'primary'
  return tone
}
</script>

<style scoped>
.crud-row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 0;
}

.crud-row-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.crud-row-actions :deep(.el-button) {
  padding-inline: 2px;
}
</style>

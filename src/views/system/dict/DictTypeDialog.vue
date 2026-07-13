<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增字典类型' : '编辑字典类型'"
    :columns="formColumns"
    :label-width="100"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface DictTypeFormModel {
  id: string
  code: string
  name: string
  description: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<DictTypeFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '字典编码', field: 'code', required: true, props: { placeholder: '如：work_order_priority' } as any },
  { type: 'input', label: '字典名称', field: 'name', required: true, props: { placeholder: '如：工单优先级' } as any },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } as any }
]

function beforeSubmit() {
  if (!formData.value.code || !formData.value.name) {
    ElMessage.warning('请填写字典编码和字典名称')
    return false
  }

  return true
}
</script>

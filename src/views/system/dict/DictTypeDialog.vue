<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增字典类型' : '编辑字典类型'"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface DictTypeFormModel {
  id: string
  code: string
  name: string
  description: string
}

interface Props {
  mode: 'add' | 'edit'
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

async function handleSubmit() {
  if (!formData.value.code || !formData.value.name) {
    ElMessage.warning('请填写字典编码和字典名称')
    return false
  }
  emit('submit')
  return false
}
</script>

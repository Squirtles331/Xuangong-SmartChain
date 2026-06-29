<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增倒冲规则' : '编辑倒冲规则'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface BackflushFormModel {
  id: string
  material: string
  wo_code: string
  bom_qty: number
  actual_qty: number
  diff: number
  status: string
  backflush_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<BackflushFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'wo_code', required: true },
  { type: 'input-number', label: 'BOM用量', field: 'bom_qty', required: true },
  { type: 'input-number', label: '实际用量', field: 'actual_qty', required: true },
  { type: 'date-picker', label: '冲销日期', field: 'backflush_date' }
]

async function handleSubmit() {
  if (!formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  formData.value.diff = formData.value.actual_qty - formData.value.bom_qty
  emit('submit')
  return false
}
</script>

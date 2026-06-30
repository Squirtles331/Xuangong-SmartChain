<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增倒冲记录' : '编辑倒冲记录'"
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
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'wo_code', required: true },
  { type: 'input-number', label: 'BOM用量', field: 'bom_qty', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '实际用量', field: 'actual_qty', required: true, props: { min: 0 } as any },
  { type: 'date-picker', label: '倒冲日期', field: 'backflush_date', props: { valueFormat: 'YYYY-MM-DD' } as any }
]

async function handleSubmit() {
  if (!formData.value.material || !formData.value.wo_code) {
    ElMessage.warning('请填写必填项')
    return false
  }
  formData.value.diff = Number(formData.value.actual_qty || 0) - Number(formData.value.bom_qty || 0)
  emit('submit')
  return false
}
</script>

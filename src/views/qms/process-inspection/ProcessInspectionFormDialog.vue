<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增过程检验' : '编辑过程检验'"
    width="680px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { InspectionTask } from '@/types/qms'

export type ProcessInspectionFormModel = InspectionTask

defineProps<{
  mode: 'add' | 'edit'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ProcessInspectionFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '检验单号', field: 'code', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'workOrderCode', required: true },
  { type: 'input', label: '工序', field: 'operationName', required: true },
  { type: 'input', label: '批号', field: 'lot', required: true },
  { type: 'input-number', label: '数量', field: 'qty', props: { min: 1 } as any },
  { type: 'input', label: '工序任务号', field: 'sourceCode', required: true },
  { type: 'input', label: '来源说明', field: 'sourceName', required: true },
  { type: 'input', label: '检验模板', field: 'templateName', required: true }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

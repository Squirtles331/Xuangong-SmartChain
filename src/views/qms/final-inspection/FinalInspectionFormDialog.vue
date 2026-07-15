<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增完工检验' : '编辑完工检验'"
    width="680px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { InspectionTask } from '@/types/qms'

export type FinalInspectionFormModel = InspectionTask

defineProps<{
  mode: 'add' | 'edit'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<FinalInspectionFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '检验单号', field: 'code', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'workOrderCode', required: true },
  { type: 'input', label: '仓库', field: 'warehouse', required: true },
  { type: 'input', label: '批号', field: 'lot', required: true },
  { type: 'input-number', label: '数量', field: 'qty', props: { min: 1 } as any },
  { type: 'input', label: '完工单号', field: 'sourceCode', required: true },
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

<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增作业票' : '编辑作业票'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface PermitFormModel {
  id: string
  code: string
  type: string
  location: string
  applicant: string
  apply_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PermitFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '作业票编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '动火', value: 'hot' },
        { label: '高处', value: 'height' },
        { label: '受限空间', value: 'confined' },
        { label: '临时用电', value: 'electric' }
      ]
    } as any
  },
  { type: 'input', label: '作业位置', field: 'location', required: true },
  { type: 'input', label: '申请人', field: 'applicant' },
  { type: 'date-picker', label: '申请日期', field: 'apply_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待审批', value: 'pending' },
        { label: '已批准', value: 'approved' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

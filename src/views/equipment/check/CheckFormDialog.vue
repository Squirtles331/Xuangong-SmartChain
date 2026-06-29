<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增点检计划' : '编辑点检计划'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface CheckFormModel {
  id: string
  code: string
  equipment: string
  check_type: string
  plan_date: string
  executor: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<CheckFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '计划编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '设备',
    field: 'equipment',
    required: true,
    props: {
      options: [
        { label: '数控车床 CK6150', value: '数控车床 CK6150' },
        { label: '钻床 Z3050', value: '钻床 Z3050' },
        { label: '磨床 M1432', value: '磨床 M1432' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '点检类型',
    field: 'check_type',
    props: {
      options: [
        { label: '日点检', value: '日点检' },
        { label: '周点检', value: '周点检' },
        { label: '月点检', value: '月点检' }
      ]
    } as any
  },
  { type: 'date-picker', label: '计划日期', field: 'plan_date' },
  { type: 'input', label: '执行人', field: 'executor' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

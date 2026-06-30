<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增隐患' : '编辑隐患'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface EhsHazardFormModel {
  id: string
  code: string
  location: string
  desc: string
  level: string
  status: string
  finder: string
  found_at: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EhsHazardFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '隐患编号', field: 'code', required: true },
  { type: 'input', label: '位置', field: 'location', required: true },
  { type: 'input', label: '隐患描述', field: 'desc', required: true },
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: '重大', value: 'major' },
        { label: '一般', value: 'moderate' },
        { label: '低风险', value: 'minor' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待整改', value: 'open' },
        { label: '整改中', value: 'processing' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  },
  { type: 'input', label: '发现人', field: 'finder' },
  { type: 'date-picker', label: '发现日期', field: 'found_at' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

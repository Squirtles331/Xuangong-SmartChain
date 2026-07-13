<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新建变更单' : '编辑变更单'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ECNFormModel {
  id: string
  code: string
  change_type: string
  material: string
  current_version: string
  status: string
  urgency: string
  applicant: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ECNFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '变更单号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '变更类型',
    field: 'change_type',
    required: true,
    props: {
      options: [
        { label: 'BOM变更', value: 'BOM变更' },
        { label: '工艺变更', value: '工艺变更' },
        { label: 'BOM+工艺变更', value: 'BOM+工艺变更' }
      ]
    } as any
  },
  { type: 'input', label: '变更对象', field: 'material', required: true },
  { type: 'input', label: '当前版本', field: 'current_version' },
  {
    type: 'select-v2',
    label: '紧急程度',
    field: 'urgency',
    required: true,
    props: {
      options: [
        { label: '紧急', value: 'urgent' },
        { label: '普通', value: 'normal' },
        { label: '计划', value: 'planned' }
      ]
    } as any
  },
  { type: 'input', label: '申请人', field: 'applicant' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

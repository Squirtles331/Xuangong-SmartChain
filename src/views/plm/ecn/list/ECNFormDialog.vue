<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新建工程变更单' : '编辑工程变更单'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
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
  target_version: string
  status: string
  urgency: string
  applicant: string
  plan_effective_date: string
  reason: string
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
    } as never
  },
  { type: 'input', label: '变更对象', field: 'material', required: true },
  { type: 'input', label: '当前版本', field: 'current_version' },
  { type: 'input', label: '目标版本', field: 'target_version', required: true },
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
    } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '待审批', value: 'pending_approval' },
        { label: '已批准', value: 'approved' },
        { label: '执行中', value: 'executing' },
        { label: '已验证', value: 'verified' },
        { label: '已关闭', value: 'closed' }
      ]
    } as never
  },
  { type: 'input', label: '申请人', field: 'applicant' },
  { type: 'input', label: '计划切换日期', field: 'plan_effective_date' },
  { type: 'textarea', label: '变更原因', field: 'reason', props: { rows: 4, placeholder: '请说明版本切换原因与预期收益' } as never }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

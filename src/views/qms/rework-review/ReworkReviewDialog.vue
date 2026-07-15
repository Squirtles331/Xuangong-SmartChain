<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增返工裁决' : '编辑返工裁决'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { ReworkReviewRecord } from '@/types/qms'

defineProps<{ mode: 'add' | 'edit' }>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReworkReviewRecord>('form', { required: true })
const emit = defineEmits<{ submit: [] }>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '裁决单号', field: 'code', required: true },
  { type: 'input', label: '不合格单号', field: 'ncrCode', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'workOrderCode', required: true },
  { type: 'input', label: '来源单号', field: 'sourceCode', required: true },
  { type: 'input', label: '返工路径', field: 'reviewRoute', required: true },
  { type: 'input', label: '复检规则', field: 'reinspectionRule', required: true, props: { type: 'textarea', rows: 3 } as any },
  { type: 'input', label: '责任人', field: 'owner', required: true },
  {
    type: 'select-v2',
    label: '裁决结果',
    field: 'decision',
    required: true,
    props: {
      options: [
        { label: '待裁决', value: 'pending' },
        { label: '允许返工', value: 'approved' },
        { label: '不允许返工', value: 'rejected' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '待处理', value: 'open' },
        { label: '评审中', value: 'reviewing' },
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

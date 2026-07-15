<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增报废裁决' : '编辑报废裁决'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { ScrapReviewRecord } from '@/types/qms'

defineProps<{ mode: 'add' | 'edit' }>()
const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ScrapReviewRecord>('form', { required: true })
const emit = defineEmits<{ submit: [] }>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '裁决单号', field: 'code', required: true },
  { type: 'input', label: '不合格单号', field: 'ncrCode', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '来源单号', field: 'sourceCode', required: true },
  { type: 'input', label: '报废原因', field: 'reason', required: true, props: { type: 'textarea', rows: 3 } as any },
  { type: 'input-number', label: '报废数量', field: 'qty', props: { min: 1 } as any },
  { type: 'input-number', label: '损失金额', field: 'lossAmount', props: { min: 0 } as any },
  { type: 'input', label: '责任人', field: 'owner', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
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

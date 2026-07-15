<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增复检关闭' : '编辑复检关闭'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { ReInspectionRecord } from '@/types/qms'

defineProps<{ mode: 'add' | 'edit' }>()
const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReInspectionRecord>('form', { required: true })
const emit = defineEmits<{ submit: [] }>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '关闭单号', field: 'code', required: true },
  { type: 'input', label: '检验单号', field: 'inspectionCode', required: true },
  { type: 'input', label: '来源单号', field: 'sourceCode', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '前序裁决', field: 'previousDecision', required: true },
  { type: 'input', label: '解锁动作', field: 'unlockAction', required: true, props: { type: 'textarea', rows: 3 } as any },
  { type: 'input', label: '责任人', field: 'owner', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '待复检', value: 'pending' },
        { label: '处理中', value: 'executing' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '结果',
    field: 'result',
    required: true,
    props: {
      options: [
        { label: '待确认', value: 'pending' },
        { label: '通过', value: 'pass' },
        { label: '失败', value: 'fail' }
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

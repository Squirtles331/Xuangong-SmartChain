<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增特采放行' : '编辑特采放行'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { ConcessionRecord } from '@/types/qms'

defineProps<{
  mode: 'add' | 'edit'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ConcessionRecord>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '放行单号', field: 'code', required: true },
  { type: 'input', label: '检验单号', field: 'inspectionCode', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '来源单号', field: 'sourceCode', required: true },
  { type: 'input', label: '放行范围', field: 'scope', required: true },
  { type: 'input', label: '风险说明', field: 'riskNote', required: true, props: { type: 'textarea', rows: 3 } as any },
  { type: 'input', label: '责任人', field: 'owner', required: true },
  { type: 'input', label: '有效期至', field: 'validUntil', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '草拟', value: 'draft' },
        { label: '评审中', value: 'reviewing' },
        { label: '已放行', value: 'released' },
        { label: '已拒绝', value: 'rejected' }
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

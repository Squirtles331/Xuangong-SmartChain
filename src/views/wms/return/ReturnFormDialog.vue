<template>
  <gi-dialog v-model="visible" :footer="true" :lock-scroll="false" :on-before-ok="handleSubmit" title="新建退料/退货单" width="500px">
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface ReturnFormModel {
  type: string
  source: string
  material: string
  qty: number
  reason: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReturnFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '生产退料', value: 'return' },
        { label: '采购退货', value: 'refund' }
      ]
    } as any
  },
  { type: 'input', label: '来源单号', field: 'source', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '原因', field: 'reason' }
]

async function handleSubmit() {
  if (!formData.value.source || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  emit('submit')
  return false
}
</script>

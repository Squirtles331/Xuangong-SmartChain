<template>
  <gi-dialog v-model="visible" :footer="true" :lock-scroll="false" :on-before-ok="handleSubmit" title="新建调拨单" width="550px">
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface TransferFormModel {
  material: string
  qty: number
  from_wh: string
  to_wh: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<TransferFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '调出仓库',
    field: 'from_wh',
    required: true,
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '成品仓', value: '成品仓' },
        { label: '备件仓', value: '备件仓' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '调入仓库',
    field: 'to_wh',
    required: true,
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '成品仓', value: '成品仓' },
        { label: '车间线边仓', value: '车间线边仓' }
      ]
    } as any
  }
]

async function handleSubmit() {
  if (!formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  emit('submit')
  return false
}
</script>

<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增入库单' : '编辑入库单'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface ReceiptFormModel {
  id: string
  code: string
  type: string
  material: string
  qty: number
  warehouse: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReceiptFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '采购入库', value: 'purchase' },
        { label: '生产入库', value: 'production' }
      ]
    } as any
  },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '标准件仓', value: '标准件仓' },
        { label: '半成品仓', value: '半成品仓' },
        { label: '成品仓', value: '成品仓' }
      ]
    } as any
  }
]

async function handleSubmit() {
  if (!formData.value.code || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  emit('submit')
  return false
}
</script>

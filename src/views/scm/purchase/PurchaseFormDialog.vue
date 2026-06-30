<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增采购订单' : '编辑采购订单'"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="640px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface PurchaseFormModel {
  id: string
  code: string
  supplier: string
  material: string
  qty: number
  received: number
  delivery: string
  status: 'sent' | 'partial' | 'received' | 'closed'
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PurchaseFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '采购数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input-number', label: '已收货数量', field: 'received', props: { min: 0 } as any },
  { type: 'date-picker', label: '交付日期', field: 'delivery', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '已下发', value: 'sent' },
        { label: '部分收货', value: 'partial' },
        { label: '已收货', value: 'received' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.code || !formData.value.supplier || !formData.value.material) {
    ElMessage.warning('请填写订单编号、供应商和物料名称')
    return false
  }
  emit('submit')
  return false
}
</script>

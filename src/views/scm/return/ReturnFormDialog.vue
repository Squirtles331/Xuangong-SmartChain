<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增退货单' : '编辑退货单'"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="620px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface ReturnFormModel {
  id: string
  code: string
  po_code: string
  supplier: string
  material: string
  qty: number
  reason: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReturnFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code', required: true },
  { type: 'input', label: '采购订单', field: 'po_code', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '退货数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '退货原因', field: 'reason', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待退货', value: 'pending' },
        { label: '已退货', value: 'done' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.code || !formData.value.po_code || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  emit('submit')
  return false
}
</script>

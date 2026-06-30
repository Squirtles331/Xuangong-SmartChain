<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增报价单' : '编辑报价单'"
    :footer="true"
    :lock-scroll="false"
    width="600px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface QuotationFormModel {
  id: string
  code: string
  customer: string
  product: string
  qty: number
  price: number
  amount: number
  valid_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<QuotationFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '报价单号', field: 'code', required: true },
  { type: 'input', label: '客户名称', field: 'customer', required: true },
  { type: 'input', label: '产品名称', field: 'product', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input-number', label: '单价(元)', field: 'price', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '总价(元)', field: 'amount', props: { disabled: true } as any },
  { type: 'date-picker', label: '有效期', field: 'valid_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发送', value: 'sent' },
        { label: '已中标', value: 'approved' },
        { label: '已丢单', value: 'lost' }
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

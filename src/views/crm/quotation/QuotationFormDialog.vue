<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增报价单' : '编辑报价单'"
    :footer="true"
    :lock-scroll="false"
    width="680px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { QuotationStatus } from '@/static/services/crm'

export interface QuotationFormModel {
  id: string
  code: string
  customer_code: string
  opportunity_code: string
  product_name: string
  qty: number
  price: number
  amount: number
  valid_date: string
  status: QuotationStatus
}

interface Props {
  mode: 'add' | 'edit'
  customerOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<QuotationFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '报价单号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customer_code',
    required: true,
    props: { options: props.customerOptions, clearable: false } as never
  },
  { type: 'input', label: '来源商机', field: 'opportunity_code' },
  { type: 'input', label: '产品名称', field: 'product_name', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as never },
  { type: 'input-number', label: '单价(元)', field: 'price', required: true, props: { min: 0 } as never },
  { type: 'input-number', label: '总价(元)', field: 'amount', props: { disabled: true } as never },
  { type: 'date-picker', label: '有效期', field: 'valid_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
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
    } as never
  }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

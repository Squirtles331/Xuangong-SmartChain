<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增发票协同单' : '编辑发票协同单'"
    :footer="true"
    :lock-scroll="false"
    width="700px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { InvoiceStatus } from '@/static/services/crm'

export interface InvoiceFormModel {
  id: string
  code: string
  customer_code: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  status: InvoiceStatus
}

interface Props {
  mode: 'add' | 'edit'
  customerOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<InvoiceFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '发票号码', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customer_code',
    required: true,
    props: { options: props.customerOptions, clearable: false } as never
  },
  { type: 'input', label: '来源订单', field: 'order_code' },
  {
    type: 'input-number',
    label: '不含税金额',
    field: 'amount',
    required: true,
    props: { min: 0, precision: 2 } as never
  },
  {
    type: 'input-number',
    label: '税率(%)',
    field: 'tax_rate',
    required: true,
    props: { min: 0, max: 100 } as never
  },
  { type: 'input-number', label: '税额', field: 'tax_amount', props: { disabled: true } as never },
  { type: 'input-number', label: '价税合计', field: 'total', props: { disabled: true } as never },
  { type: 'date-picker', label: '开票日期', field: 'issue_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已开具', value: 'issued' },
        { label: '已作废', value: 'voided' },
        { label: '已红冲', value: 'red' }
      ]
    } as never
  }
])

watch(
  () => [formData.value.amount, formData.value.tax_rate],
  () => {
    formData.value.tax_amount = Math.round(((formData.value.amount * formData.value.tax_rate) / 100) * 100) / 100
    formData.value.total = Math.round((formData.value.amount + formData.value.tax_amount) * 100) / 100
  }
)

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

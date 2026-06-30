<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增发票' : '编辑发票'"
    :footer="true"
    :lock-scroll="false"
    width="650px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface InvoiceFormModel {
  id: string
  code: string
  customer: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<InvoiceFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '发票号码', field: 'code', required: true },
  { type: 'input', label: '客户名称', field: 'customer', required: true },
  { type: 'input', label: '销售订单', field: 'order_code' },
  { type: 'input-number', label: '不含税金额', field: 'amount', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input-number', label: '税率(%)', field: 'tax_rate', required: true, props: { min: 0, max: 100 } as any },
  { type: 'input-number', label: '税额', field: 'tax_amount', props: { disabled: true } as any },
  { type: 'input-number', label: '价税合计', field: 'total', props: { disabled: true } as any },
  { type: 'date-picker', label: '开票日期', field: 'issue_date' },
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
    } as any
  }
]

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

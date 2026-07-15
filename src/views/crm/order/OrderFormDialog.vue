<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增销售订单' : '编辑销售订单'"
    :footer="true"
    :lock-scroll="false"
    width="720px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { SalesOrderStatus } from '@/static/services/crm'

export interface OrderFormModel {
  id: string
  code: string
  customer_code: string
  product_name: string
  qty: number
  delivered_qty: number
  amount: number
  promised_date: string
  source_contract_code: string
  status: SalesOrderStatus
}

interface Props {
  mode: 'add' | 'edit'
  customerOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<OrderFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '订单编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customer_code',
    required: true,
    props: { options: props.customerOptions, clearable: false } as never
  },
  { type: 'input', label: '产品名称', field: 'product_name', required: true },
  { type: 'input', label: '关联合同', field: 'source_contract_code' },
  { type: 'input-number', label: '订单数量', field: 'qty', required: true, props: { min: 1 } as never },
  { type: 'input-number', label: '已发运数量', field: 'delivered_qty', props: { min: 0 } as never },
  { type: 'input-number', label: '订单金额', field: 'amount', props: { min: 0 } as never },
  { type: 'date-picker', label: '承诺交期', field: 'promised_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  {
    type: 'select-v2',
    label: '协同状态',
    field: 'status',
    props: {
      options: [
        { label: '已确认', value: 'confirmed' },
        { label: '承接协同中', value: 'coordinating' },
        { label: '发运推进中', value: 'delivering' },
        { label: '协同完成', value: 'completed' }
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

<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增合同' : '编辑合同'"
    :footer="true"
    :lock-scroll="false"
    width="720px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { ContractStatus } from '@/static/services/crm'

export interface ContractFormModel {
  id: string
  code: string
  customer_code: string
  order_code: string
  amount: number
  payment_terms: string
  sign_date: string
  start_date: string
  end_date: string
  status: ContractStatus
}

interface Props {
  mode: 'add' | 'edit'
  customerOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ContractFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '合同编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customer_code',
    required: true,
    props: { options: props.customerOptions, clearable: false } as never
  },
  { type: 'input', label: '关联订单', field: 'order_code' },
  { type: 'input-number', label: '合同金额', field: 'amount', props: { min: 0 } as never },
  { type: 'input', label: '付款条款', field: 'payment_terms' },
  { type: 'date-picker', label: '签订日期', field: 'sign_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  { type: 'date-picker', label: '生效日期', field: 'start_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  { type: 'date-picker', label: '到期日期', field: 'end_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '生效中', value: 'active' },
        { label: '临近到期', value: 'expiring' },
        { label: '已关闭', value: 'closed' }
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

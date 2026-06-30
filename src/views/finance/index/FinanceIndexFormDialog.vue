<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="title"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { FinancePayable, FinancePayableStatus } from '@/api/finance'

export interface FinancePayableFormModel extends FinancePayable {}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<FinancePayableFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const statusOptions: Array<{ label: string; value: FinancePayableStatus }> = [
  { label: '未付款', value: 'open' },
  { label: '已付款', value: 'paid' },
  { label: '部分付款', value: 'partial' }
]

const title = computed(() => (props.mode === 'add' ? '新增应付单' : '编辑应付单'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code', props: { disabled: true } as any },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '应付金额', field: 'amount', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '已付金额', field: 'paid', props: { min: 0 } as any },
  { type: 'input-number', label: '未付余额', field: 'balance', props: { min: 0, disabled: true } as any },
  { type: 'date-picker', label: '到期日期', field: 'due_date', props: { valueFormat: 'YYYY-MM-DD' } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
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

<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增合同' : '编辑合同'"
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
import type { FormColumnItem } from 'gi-component'

export interface ContractFormModel {
  id: string
  code: string
  customer: string
  amount: number
  sign_date: string
  start_date: string
  end_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ContractFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '合同编号', field: 'code', required: true },
  { type: 'input', label: '客户名称', field: 'customer', required: true },
  { type: 'input-number', label: '合同金额', field: 'amount', props: { min: 0 } as any },
  { type: 'date-picker', label: '签订日期', field: 'sign_date' },
  { type: 'date-picker', label: '生效日期', field: 'start_date' },
  { type: 'date-picker', label: '到期日期', field: 'end_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '生效中', value: 'active' },
        { label: '已过期', value: 'expired' },
        { label: '已终止', value: 'terminated' }
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

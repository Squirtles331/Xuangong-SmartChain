<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增商机' : '编辑商机'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface OpportunityFormModel {
  id: string
  customer: string
  product: string
  amount: number
  stage: string
  probability: number
  owner: string
  close_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<OpportunityFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '客户', field: 'customer', required: true },
  { type: 'input', label: '商机描述', field: 'product', required: true },
  { type: 'input-number', label: '预计金额', field: 'amount', props: { min: 0, step: 10000 } as any },
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      options: [
        { label: '初步接触', value: 'initial' },
        { label: '方案制定', value: 'solution' },
        { label: '报价中', value: 'quotation' },
        { label: '成交', value: 'won' }
      ]
    } as any
  },
  { type: 'input-number', label: '赢单率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '负责人', field: 'owner' },
  { type: 'date-picker', label: '预计成交', field: 'close_date' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

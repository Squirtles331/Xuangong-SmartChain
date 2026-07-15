<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增商机' : '编辑商机'"
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
import type { OpportunityStage } from '@/static/services/crm'

export interface OpportunityFormModel {
  id: string
  code: string
  customer_code: string
  topic: string
  amount: number
  stage: OpportunityStage
  probability: number
  owner: string
  close_date: string
  next_step: string
}

interface Props {
  mode: 'add' | 'edit'
  customerOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<OpportunityFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '商机编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customer_code',
    required: true,
    props: { options: props.customerOptions, clearable: false } as never
  },
  { type: 'input', label: '商机主题', field: 'topic', required: true },
  { type: 'input-number', label: '预计金额', field: 'amount', props: { min: 0, step: 10000 } as never },
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      options: [
        { label: '初步接触', value: 'initial' },
        { label: '方案制定', value: 'solution' },
        { label: '报价中', value: 'quotation' },
        { label: '已成交', value: 'won' },
        { label: '已丢单', value: 'lost' }
      ]
    } as never
  },
  { type: 'input-number', label: '赢单率(%)', field: 'probability', props: { min: 0, max: 100 } as never },
  { type: 'input', label: '负责人', field: 'owner' },
  { type: 'date-picker', label: '预计成交日期', field: 'close_date', props: { valueFormat: 'YYYY-MM-DD' } as never },
  { type: 'textarea', label: '下一步动作', field: 'next_step' }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

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

export interface FinancePayableFormModel {
  id: string
  code: string
  supplier: string
  amount: number
  paid: number
  balance: number
  due_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<FinancePayableFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => props.mode === 'add' ? '新增应付' : '编辑应付')

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '金额', field: 'amount', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '已付', field: 'paid', props: { min: 0 } as any },
  { type: 'date-picker', label: '到期日', field: 'due_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '未付', value: 'open' },
        { label: '已付', value: 'paid' },
        { label: '部分付', value: 'partial' }
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

<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增明细' : '编辑明细'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface EnergyDetailFormModel {
  id: string
  period: string
  type: 'electricity' | 'water' | 'gas'
  workshop: string
  usage: number
  unit: string
  rate: number
  cost: number
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EnergyDetailFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '期间', field: 'period', required: true, props: { placeholder: '例如 2026-01' } as any },
  {
    type: 'select-v2',
    label: '能源类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '电', value: 'electricity' },
        { label: '水', value: 'water' },
        { label: '气', value: 'gas' }
      ]
    } as any
  },
  { type: 'input', label: '车间', field: 'workshop', required: true },
  { type: 'input-number', label: '用量', field: 'usage', required: true, props: { min: 0 } as any },
  { type: 'input', label: '单位', field: 'unit' },
  { type: 'input-number', label: '单价', field: 'rate', props: { min: 0, precision: 2, step: 0.1 } as any },
  { type: 'input-number', label: '成本', field: 'cost', props: { disabled: true, precision: 2 } as any }
]

watch(
  () => [formData.value.usage, formData.value.rate],
  () => {
    formData.value.cost = Number((formData.value.usage * formData.value.rate).toFixed(2))
  }
)

watch(
  () => formData.value.type,
  (type) => {
    if (type === 'electricity') formData.value.unit = 'kWh'
    if (type === 'water') formData.value.unit = '吨'
    if (type === 'gas') formData.value.unit = 'm3'
  },
  { immediate: true }
)

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

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

export interface EnergyDetailFormModel {
  id: string
  date: string
  type: string
  workshop: string
  qty: number
  unit: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EnergyDetailFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => (props.mode === 'add' ? 'Add Record' : 'Edit Record'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: 'Period', field: 'date', required: true },
  {
    type: 'select-v2',
    label: 'Type',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: 'electricity', value: 'electricity' },
        { label: 'water', value: 'water' },
        { label: 'gas', value: 'gas' }
      ]
    } as any
  },
  { type: 'input', label: 'Workshop', field: 'workshop' },
  { type: 'input-number', label: 'Usage', field: 'qty', required: true, props: { min: 0 } as any },
  { type: 'input', label: 'Unit', field: 'unit' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

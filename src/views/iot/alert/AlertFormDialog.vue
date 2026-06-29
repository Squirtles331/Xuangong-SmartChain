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

export interface AlertRuleFormModel {
  id: string
  device: string
  metric: string
  operator: string
  threshold: number
  level: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
  deviceOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<AlertRuleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => props.mode === 'add' ? 'Add Rule' : 'Edit Rule')

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: 'Device',
    field: 'device',
    required: true,
    props: {
      options: props.deviceOptions
    } as any
  },
  {
    type: 'select-v2',
    label: 'Metric',
    field: 'metric',
    required: true,
    props: {
      options: [
        { label: 'Temperature', value: 'temp' },
        { label: 'RPM', value: 'rpm' },
        { label: 'Vibration', value: 'vibration' },
        { label: 'Current', value: 'current' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: 'Operator',
    field: 'operator',
    required: true,
    props: {
      options: [
        { label: '>', value: '>' },
        { label: '<', value: '<' },
        { label: '>=', value: '>=' },
        { label: '<=', value: '<=' }
      ]
    } as any
  },
  { type: 'input-number', label: 'Threshold', field: 'threshold', required: true },
  {
    type: 'select-v2',
    label: 'Level',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: 'critical', value: 'critical' },
        { label: 'warning', value: 'warning' },
        { label: 'info', value: 'info' }
      ]
    } as any
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

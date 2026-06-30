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

const title = computed(() => (props.mode === 'add' ? '新增规则' : '编辑规则'))

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '设备',
    field: 'device',
    required: true,
    props: {
      options: props.deviceOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '监测项',
    field: 'metric',
    required: true,
    props: {
      options: [
        { label: '温度', value: 'temp' },
        { label: 'RPM', value: 'rpm' },
        { label: '振动', value: 'vibration' },
        { label: '电流', value: 'current' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '运算符',
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
  { type: 'input-number', label: '阈值', field: 'threshold', required: true },
  {
    type: 'select-v2',
    label: '等级',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: '严重', value: 'critical' },
        { label: '预警', value: 'warning' },
        { label: '提示', value: 'info' }
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

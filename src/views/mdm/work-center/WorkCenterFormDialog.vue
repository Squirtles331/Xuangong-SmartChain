<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增工作中心' : '编辑工作中心'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface WorkCenterFormModel {
  id: string
  code: string
  name: string
  workshop: string
  shift: string
  people: number
  efficiency: number
  costPerHour: number
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<WorkCenterFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '车间', field: 'workshop', required: true },
  {
    type: 'select-v2',
    label: '班次',
    field: 'shift',
    required: true,
    props: {
      options: [
        { label: '白班', value: '白班' },
        { label: '两班倒', value: '两班倒' },
        { label: '三班倒', value: '三班倒' }
      ]
    } as any
  },
  { type: 'input-number', label: '人数', field: 'people', props: { min: 0 } as any },
  { type: 'input-number', label: '效率(%)', field: 'efficiency', props: { min: 0, max: 100 } as any },
  { type: 'input-number', label: '工时费率(元/h)', field: 'costPerHour', props: { min: 0 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '维修', value: 'repair' }
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

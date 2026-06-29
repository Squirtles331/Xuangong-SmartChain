<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增设备' : '编辑设备'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface EquipmentFormModel {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: string
  purchase_date: string
  commission_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EquipmentFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '设备编码', field: 'code', required: true },
  { type: 'input', label: '设备名称', field: 'name', required: true },
  { type: 'input', label: '型号', field: 'model' },
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    required: true,
    props: {
      options: [
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '保养', value: 'maintenance' },
        { label: '维修', value: 'repair' }
      ]
    } as any
  },
  { type: 'date-picker', label: '购置日期', field: 'purchase_date' },
  { type: 'date-picker', label: '投产日期', field: 'commission_date' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

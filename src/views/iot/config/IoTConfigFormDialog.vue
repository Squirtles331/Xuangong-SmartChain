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
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import { iotConnectionStatusOptions, iotProtocolOptions, type IotConnectionRecord, type IotConnectionStatus } from '@/static/services/iot'

export interface IoTConfigFormModel extends IotConnectionRecord {}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<IoTConfigFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const statusOptions: Array<{ label: string; value: IotConnectionStatus }> = iotConnectionStatusOptions.map((item) => ({
  label: item.label,
  value: item.value as IotConnectionStatus
}))

const title = computed(() => (props.mode === 'add' ? '新增设备连接' : '编辑设备连接'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '连接编码', field: 'code', required: true },
  { type: 'input', label: '设备编码', field: 'equipment_code', required: true },
  { type: 'input', label: '设备名称', field: 'equipment_name', required: true },
  { type: 'input', label: '所属车间', field: 'workshop', required: true },
  { type: 'input', label: '产线/单元', field: 'line' },
  {
    type: 'select-v2',
    label: '通信协议',
    field: 'protocol',
    required: true,
    props: {
      options: iotProtocolOptions
    } as any
  },
  { type: 'input', label: '边缘网关', field: 'gateway', required: true },
  { type: 'input', label: '连接端点', field: 'endpoint', required: true },
  { type: 'input-number', label: '采集周期(秒)', field: 'collect_interval', required: true, props: { min: 1, max: 3600 } as any },
  {
    type: 'select-v2',
    label: '连接状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  },
  { type: 'input', label: '最近心跳', field: 'last_heartbeat' },
  { type: 'input', label: '责任人', field: 'owner' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

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
import type { IoTConfig, IoTConnectionStatus } from '@/api/iot'

export interface IoTConfigFormModel extends IoTConfig {}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<IoTConfigFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const statusOptions: Array<{ label: string; value: IoTConnectionStatus }> = [
  { label: '已连接', value: 'connected' },
  { label: '已断开', value: 'disconnected' }
]

const title = computed(() => (props.mode === 'add' ? '新增连接配置' : '编辑连接配置'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '通信协议',
    field: 'protocol',
    required: true,
    props: {
      options: [
        { label: 'OPC UA', value: 'OPC UA' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'Modbus', value: 'Modbus' }
      ]
    } as any
  },
  { type: 'input', label: '连接地址', field: 'address', required: true },
  { type: 'input-number', label: '端口', field: 'port', required: true, props: { min: 1, max: 65535 } as any },
  { type: 'input', label: '采集间隔', field: 'interval' },
  {
    type: 'select-v2',
    label: '连接状态',
    field: 'status',
    props: {
      options: statusOptions
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

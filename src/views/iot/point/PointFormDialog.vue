<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="title"
    width="620px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import { iotPointMetricOptions, iotPointStatusOptions, type IotPointRecord } from '@/static/services/iot'

export interface PointFormModel extends IotPointRecord {}

interface Props {
  mode: 'add' | 'edit'
  connectionOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PointFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => (props.mode === 'add' ? '新增采集点位' : '编辑采集点位'))

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '点位编码', field: 'code', required: true },
  { type: 'input', label: '点位名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '绑定连接',
    field: 'connection_id',
    required: true,
    props: { options: props.connectionOptions } as never
  },
  {
    type: 'select-v2',
    label: '采集指标',
    field: 'metric',
    required: true,
    props: { options: iotPointMetricOptions } as never
  },
  { type: 'input', label: '单位', field: 'unit' },
  { type: 'input', label: '点位地址', field: 'address', required: true },
  { type: 'input-number', label: '采集周期(秒)', field: 'collect_interval', required: true, props: { min: 1, max: 3600 } as never },
  { type: 'input-number', label: '下限', field: 'lower_limit' },
  { type: 'input-number', label: '上限', field: 'upper_limit' },
  {
    type: 'select-v2',
    label: '点位状态',
    field: 'status',
    required: true,
    props: {
      options: iotPointStatusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as never
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

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
import type { IoTAutoReportRule, IoTRuleStatus, IoTTriggerType } from '@/api/iot'

export interface AutoReportFormModel extends IoTAutoReportRule {}

interface Props {
  mode: 'add' | 'edit'
  equipmentOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<AutoReportFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const triggerOptions: Array<{ label: string; value: IoTTriggerType }> = [
  { label: '周期完成', value: 'cycle_complete' },
  { label: '计数到达', value: 'count_reached' },
  { label: '设备停机', value: 'power_off' },
  { label: '连续运行', value: 'continuous' }
]

const statusOptions: Array<{ label: string; value: IoTRuleStatus }> = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'disabled' }
]

const title = computed(() => (props.mode === 'add' ? '新增规则' : '编辑规则'))

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '设备',
    field: 'equipment',
    required: true,
    props: {
      options: props.equipmentOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '触发条件',
    field: 'trigger',
    required: true,
    props: {
      options: triggerOptions
    } as any
  },
  { type: 'input-number', label: '阈值', field: 'threshold', props: { min: 0 } as any },
  {
    type: 'select-v2',
    label: '报工字段',
    field: 'wo_field',
    props: {
      options: [
        { label: '合格数量', value: 'qualified_qty' },
        { label: '不良数量', value: 'defective_qty' },
        { label: '总数量', value: 'total_qty' }
      ]
    } as any
  },
  { type: 'input-number', label: '默认数量', field: 'default_qty', props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
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

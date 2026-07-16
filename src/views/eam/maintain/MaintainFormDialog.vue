<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增保养计划' : '编辑保养计划'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface MaintainFormModel {
  id: string
  code: string
  equipment_code: string
  type: string
  plan_date: string
  executor: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
  equipmentOptions?: Array<{ label: string; value: string }>
  maintainTypeOptions?: Array<{ label: string; value: string }>
}

const props = withDefaults(defineProps<Props>(), {
  equipmentOptions: () => [],
  maintainTypeOptions: () => []
})

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<MaintainFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '计划编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '设备',
    field: 'equipment_code',
    required: true,
    props: {
      options: props.equipmentOptions
    } as never
  },
  {
    type: 'select-v2',
    label: '保养类型',
    field: 'type',
    props: {
      options: props.maintainTypeOptions
    } as never
  },
  { type: 'date-picker', label: '计划日期', field: 'plan_date' },
  { type: 'input', label: '执行人', field: 'executor' }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

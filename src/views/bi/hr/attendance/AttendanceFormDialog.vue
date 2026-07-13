<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="title"
    width="500px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { HrAttendanceRecord, HrAttendanceResult } from '@/api/hr'

export interface AttendanceFormModel extends HrAttendanceRecord {}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<AttendanceFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const resultOptions: Array<{ label: string; value: HrAttendanceResult }> = [
  { label: '正常', value: 'normal' },
  { label: '迟到', value: 'late' },
  { label: '缺勤', value: 'absent' }
]

const title = computed(() => (props.mode === 'add' ? '新增考勤' : '编辑考勤'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '员工姓名', field: 'employee', required: true },
  { type: 'date-picker', label: '日期', field: 'date', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'input', label: '上班打卡', field: 'clock_in' },
  { type: 'input', label: '下班打卡', field: 'clock_out' },
  {
    type: 'select-v2',
    label: '考勤结果',
    field: 'result',
    props: {
      options: resultOptions
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

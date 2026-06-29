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

export interface TrainingFormModel {
  id: string
  title: string
  trainer: string
  trainees: string
  plan_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<TrainingFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => props.mode === 'add' ? '新增培训记录' : '编辑培训记录')

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '培训主题', field: 'title', required: true },
  { type: 'input', label: '培训人', field: 'trainer', required: true },
  { type: 'input', label: '参训人员', field: 'trainees', props: { placeholder: '多人用逗号分隔' } as any },
  { type: 'date-picker', label: '计划日期', field: 'plan_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待培训', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已过期', value: 'expired' }
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

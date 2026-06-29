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

export interface ScheduleFormModel {
  id: string
  team: string
  shift: string
  members: string
  leader: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ScheduleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => props.mode === 'add' ? '新增排班' : '编辑排班')

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '班组', field: 'team', required: true },
  {
    type: 'select-v2',
    label: '班次',
    field: 'shift',
    props: {
      options: [
        { label: '白班', value: 'day' },
        { label: '夜班', value: 'night' },
        { label: '中班', value: 'middle' }
      ]
    } as any
  },
  { type: 'input', label: '成员', field: 'members', props: { placeholder: '多人用逗号分隔' } as any },
  { type: 'input', label: '班组长', field: 'leader' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? 'Add Skill' : 'Edit Skill'"
    width="500px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface SkillMatrixFormModel {
  id: string
  skill_name: string
  level: number
  cert_number: string
  expire_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<SkillMatrixFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: 'Skill', field: 'skill_name', required: true },
  {
    type: 'input-number',
    label: 'Level',
    field: 'level',
    required: true,
    props: { min: 1, max: 5 } as any
  },
  { type: 'input', label: 'Certificate', field: 'cert_number' },
  { type: 'date-picker', label: 'Expire Date', field: 'expire_date' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

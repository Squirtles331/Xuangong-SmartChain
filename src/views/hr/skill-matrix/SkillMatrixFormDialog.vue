<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增技能' : '编辑技能'"
    width="500px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { HrSkillItem } from '@/api/hr'

export interface SkillMatrixFormModel extends HrSkillItem {}

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
  { type: 'input', label: '技能名称', field: 'skill_name', required: true },
  {
    type: 'input-number',
    label: '技能等级',
    field: 'level',
    required: true,
    props: { min: 1, max: 5 } as any
  },
  { type: 'input', label: '证书编号', field: 'cert_number' },
  { type: 'date-picker', label: '到期日期', field: 'expire_date', props: { valueFormat: 'YYYY-MM-DD' } as any }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

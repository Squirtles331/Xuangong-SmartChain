<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增约束' : '编辑约束'"
    width="550px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ConstraintFormModel {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  operation?: string
  skill?: string
  min_level?: number
  workers_count?: number
  available?: boolean
}

interface Props {
  mode: 'add' | 'edit'
  constraintType: 'mold' | 'tool' | 'skill'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ConstraintFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const moldToolColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '适用对象', field: 'applicable' },
  { type: 'input', label: '寿命/数量', field: 'life' }
]

const skillColumns: FormColumnItem[] = [
  { type: 'input', label: '工序', field: 'operation', required: true },
  { type: 'input', label: '技能要求', field: 'skill', required: true },
  { type: 'input-number', label: '最低等级', field: 'min_level', props: { min: 1, max: 5 } as any },
  { type: 'input-number', label: '具备人数', field: 'workers_count', props: { min: 1 } as any }
]

const formColumns: FormColumnItem[] = props.constraintType === 'skill' ? skillColumns : moldToolColumns

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.name && !formData.value.operation) {
    return false
  }
  emit('submit')
  return false
}
</script>

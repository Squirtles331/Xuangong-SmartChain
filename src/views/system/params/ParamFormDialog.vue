<template>
  <gi-dialog v-model="visible" :footer="true" :lock-scroll="false" :on-before-ok="handleSubmit" :title="mode === 'add' ? '新增参数' : '编辑参数'">
    <gi-form v-model="formData" :columns="formColumns" :label-width="120" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ParamFormModel {
  id: string
  code: string
  name: string
  value: string
  description: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ParamFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '参数编码', field: 'code', required: true },
  { type: 'input', label: '参数名称', field: 'name', required: true },
  { type: 'input', label: '参数值', field: 'value', required: true },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } as any }
]

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

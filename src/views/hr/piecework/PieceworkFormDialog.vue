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

export interface PieceworkFormModel {
  id: string
  operation: string
  unit_price: number
  unit: string
  qualified_bonus: number
  defective_penalty: number
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PieceworkFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => props.mode === 'add' ? '新增计件单价' : '编辑计件单价')

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '工序名称', field: 'operation', required: true },
  { type: 'input-number', label: '计件单价(元)', field: 'unit_price', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input', label: '单位', field: 'unit' },
  { type: 'input-number', label: '合格奖励(元)', field: 'qualified_bonus', props: { min: 0, precision: 2 } as any },
  { type: 'input-number', label: '不良扣款(元)', field: 'defective_penalty', props: { min: 0, precision: 2 } as any }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

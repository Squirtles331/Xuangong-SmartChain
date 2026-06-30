<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增检验任务' : '编辑检验任务'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface InspectionFormModel {
  id: string
  code: string
  type: string
  material: string
  lot: string
  qty: number
  status: string
  verdict?: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<InspectionFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '任务编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '检验类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '来料检验', value: '来料检验' },
        { label: '过程检验', value: '过程检验' },
        { label: '最终检验', value: '最终检验' }
      ]
    } as any
  },
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input', label: '批号', field: 'lot' },
  { type: 'input-number', label: '数量', field: 'qty', props: { min: 1 } as any }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

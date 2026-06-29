<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增模具' : '编辑模具'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface MoldFormModel {
  id: string
  code: string
  name: string
  type: string
  lifeDesign: number
  used: number
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<MoldFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '铸模', value: '铸模' },
        { label: '锻模', value: '锻模' },
        { label: '冲模', value: '冲模' },
        { label: '注塑模', value: '注塑模' }
      ]
    } as any
  },
  { type: 'input-number', label: '设计寿命', field: 'lifeDesign', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '已用次数', field: 'used', props: { min: 0 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '使用中', value: 'using' },
        { label: '空闲', value: 'idle' },
        { label: '维护中', value: 'maintain' }
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

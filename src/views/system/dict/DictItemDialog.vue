<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增字典项' : '编辑字典项'"
    width="500px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface DictItemFormModel {
  id: string
  code: string
  name: string
  sortOrder: number
  cssClass: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<DictItemFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input-number', label: '排序', field: 'sortOrder', props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '标签样式',
    field: 'cssClass',
    props: {
      options: [
        { label: '默认', value: '' },
        { label: '红色(danger)', value: 'danger' },
        { label: '橙色(warning)', value: 'warning' },
        { label: '绿色(success)', value: 'success' },
        { label: '灰色(info)', value: 'info' }
      ]
    } as any
  }
]

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

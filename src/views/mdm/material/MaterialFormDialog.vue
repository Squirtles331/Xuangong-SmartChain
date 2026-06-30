<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增物料' : '编辑物料'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface MaterialFormModel {
  id: string
  code: string
  name: string
  spec: string
  type: 'purchased' | 'manufactured' | 'outsourced'
  unit: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<MaterialFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料编码', field: 'code', required: true },
  { type: 'input', label: '物料名称', field: 'name', required: true },
  { type: 'input', label: '规格型号', field: 'spec' },
  {
    type: 'select-v2',
    label: '物料类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '外购', value: 'purchased' },
        { label: '自制', value: 'manufactured' },
        { label: '委外', value: 'outsourced' }
      ]
    } as any
  },
  { type: 'input', label: '单位', field: 'unit', required: true }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

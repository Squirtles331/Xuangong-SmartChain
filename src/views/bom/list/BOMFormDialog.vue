<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新建BOM' : '编辑BOM'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface BOMFormModel {
  id: string
  material_code: string
  material_name: string
  bom_type: string
  version: string
  status: string
  effective_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<BOMFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料编码', field: 'material_code', required: true },
  { type: 'input', label: '物料名称', field: 'material_name', required: true },
  {
    type: 'select-v2',
    label: 'BOM类型',
    field: 'bom_type',
    required: true,
    props: {
      options: [
        { label: 'EBOM', value: 'EBOM' },
        { label: 'PBOM', value: 'PBOM' },
        { label: 'MBOM', value: 'MBOM' }
      ]
    } as any
  },
  { type: 'input', label: '版本', field: 'version', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '生效中', value: 'active' },
        { label: '已归档', value: 'archived' }
      ]
    } as any
  },
  { type: 'date-picker', label: '生效日期', field: 'effective_date' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

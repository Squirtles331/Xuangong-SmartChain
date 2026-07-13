<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增备件' : '编辑备件'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface SpareFormModel {
  id: string
  code: string
  name: string
  spec: string
  applicable_equipment: string
  qty: number
  safety: number
  unit: string
  location: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<SpareFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '备件编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '规格', field: 'spec' },
  { type: 'input', label: '适用设备', field: 'applicable_equipment' },
  { type: 'input-number', label: '库存数量', field: 'qty', props: { min: 0 } as any },
  { type: 'input-number', label: '安全库存', field: 'safety', props: { min: 1 } as any },
  { type: 'input', label: '单位', field: 'unit' },
  { type: 'input', label: '库位', field: 'location' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

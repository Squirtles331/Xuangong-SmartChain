<template>
  <gi-dialog v-model="visible" :footer="true" :lock-scroll="false" :on-before-ok="handleSubmit" :title="mode === 'add' ? '新增角色' : '编辑角色'">
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface RoleFormModel {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
  permissionIds: string[]
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<RoleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '角色编码', field: 'code', required: true },
  { type: 'input', label: '角色名称', field: 'name', required: true },
  { type: 'input', label: '描述', field: 'description', props: { type: 'textarea', rows: 2 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ]
    } as any
  }
]

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增角色' : '编辑角色'"
    :columns="formColumns"
    :label-width="100"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'
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
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<RoleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
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
])
</script>

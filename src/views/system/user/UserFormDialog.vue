<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增用户' : '编辑用户'"
    :columns="formColumns"
    :label-width="100"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface UserFormModel {
  id: string
  username: string
  realName: string
  roles: string[]
  department: string
  status: 0 | 1
}

interface Props {
  mode: CrudDialogMode
  roleOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: 0 | 1 }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<UserFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '账号', field: 'username', required: true },
  { type: 'input', label: '姓名', field: 'realName', required: true },
  { type: 'input', label: '归属部门', field: 'department', props: { placeholder: '如：制造执行部' } as never },
  {
    type: 'select-v2',
    label: '角色',
    field: 'roles',
    required: true,
    props: {
      multiple: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      options: props.roleOptions
    } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: props.statusOptions
    } as never
  }
])
</script>

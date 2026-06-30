<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增用户' : '编辑用户'"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { SysUser } from '@/api/system'

export interface UserFormModel {
  id: string
  username: string
  realName: string
  roles: string[]
  status: SysUser['status']
}

interface Props {
  mode: 'add' | 'edit'
  roleOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: SysUser['status'] }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<UserFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '用户名', field: 'username', required: true },
  { type: 'input', label: '姓名', field: 'realName' },
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
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: props.statusOptions
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

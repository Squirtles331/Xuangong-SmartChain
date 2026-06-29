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

export type UserStatus = '启用' | '禁用'

export interface UserFormModel {
  id: string
  username: string
  nickname: string
  role: string
  status: UserStatus
}

interface Props {
  mode: 'add' | 'edit'
  roleOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: UserStatus }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<UserFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '用户名', field: 'username', required: true },
  { type: 'input', label: '昵称', field: 'nickname' },
  {
    type: 'select-v2',
    label: '角色',
    field: 'role',
    required: true,
    props: {
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

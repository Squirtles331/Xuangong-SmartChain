<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form
        ref="searchFormRef"
        v-model="searchForm"
        :columns="searchColumns"
        :grid-item-props="{
          span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
        }"
        search
        @reset="handleReset"
        @search="handleSearch"
      />
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <TableSetting title="表格工具栏" :columns="columns" :disabled-column-keys="disabledColumnKeys" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" v-bind="tableProps" :data="pagedUsers" :pagination="pagination" border style="height: 100%">
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="remove(row.id)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <gi-dialog
      v-model="dialogVisible"
      :footer="true"
      :on-before-ok="submitDialog"
      :on-cancel="closeDialog"
      :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
    >
      <gi-form v-model="formModel" :columns="formColumns" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import BaseTableSetting from '@/components/TableSetting.vue'
type UserStatus = '启用' | '禁用'
interface User {
  id: number
  username: string
  nickname: string
  role: string
  status: UserStatus
  createdAt: string
}

type TableSettingSlotProps = {
  settingColumns: TableColumnItem<User>[]
  isFullscreen: boolean
  tableProps: Record<string, unknown>
}

const TableSetting = BaseTableSetting as typeof BaseTableSetting & {
  new (): {
    $slots: {
      default?: (props: TableSettingSlotProps) => any
      'toolbar-left'?: () => any
    }
  }
}

const users = ref<User[]>([
  { id: 1, username: 'alice', nickname: '爱丽丝', role: '管理员', status: '启用', createdAt: '2024-06-01' },
  { id: 2, username: 'bob', nickname: '鲍勃', role: '运营', status: '启用', createdAt: '2024-07-12' },
  { id: 3, username: 'carol', nickname: '卡萝', role: '审核', status: '禁用', createdAt: '2024-08-23' },
  { id: 4, username: 'dave', nickname: '大卫', role: '管理员', status: '启用', createdAt: '2024-09-10' },
  { id: 5, username: 'erin', nickname: '艾琳', role: '运营', status: '启用', createdAt: '2024-10-03' },
  { id: 6, username: 'frank', nickname: '法兰克', role: '审核', status: '禁用', createdAt: '2024-10-21' },
  { id: 7, username: 'grace', nickname: '格蕾丝', role: '运营', status: '启用', createdAt: '2024-11-05' },
  { id: 8, username: 'heidi', nickname: '海蒂', role: '审核', status: '启用', createdAt: '2024-11-16' },
  { id: 9, username: 'ivan', nickname: '伊万', role: '管理员', status: '启用', createdAt: '2024-11-20' },
  { id: 10, username: 'judy', nickname: '朱迪', role: '运营', status: '禁用', createdAt: '2024-11-22' },
  { id: 11, username: 'mallory', nickname: '马洛里', role: '审核', status: '启用', createdAt: '2024-11-25' },
  { id: 12, username: 'trent', nickname: '特伦特', role: '管理员', status: '启用', createdAt: '2024-12-01' }
])

const searchForm = ref({
  username: '',
  role: '',
  status: ''
})
const disabledColumnKeys = ['__type_index_1__', 'name']
const searchFormRef = ref<FormInstance | null>()
const searchColumns = computed(() => {
  return [
    { type: 'input', label: '用户名', field: 'username' },
    {
      type: 'select-v2',
      label: '角色',
      field: 'role',
      props: {
        options: [
          { label: '管理员', value: '管理员' },
          { label: '运营', value: '运营' },
          { label: '审核', value: '审核' }
        ]
      } as any
    },
    {
      type: 'select-v2',
      label: '状态',
      field: 'status',
      props: {
        style: { width: '200px' },
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' }
        ]
      } as any
    }
  ] as FormColumnItem[]
})

const filteredUsers = computed(() => {
  return users.value.filter(
    (u) =>
      (!searchForm.value.username || u.username.includes(searchForm.value.username)) &&
      (!searchForm.value.role || u.role === searchForm.value.role) &&
      (!searchForm.value.status || u.status === searchForm.value.status)
  )
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredUsers.value.length)
}) as any

const pagedUsers = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredUsers.value.slice(start, end)
})

const columns: TableColumnItem<User>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 100 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
  { prop: 'createdAt', label: '创建时间', minWidth: 140 },
  { label: '操作', minWidth: 300, fixed: 'right', slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<any>({ id: 0, username: '', nickname: '', role: '', status: '启用' as UserStatus })

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '用户名', field: 'username', required: true },
  { type: 'input', label: '昵称', field: 'nickname' },
  {
    type: 'select-v2',
    label: '角色',
    field: 'role',
    required: true,
    props: {
      options: [
        { label: '管理员', value: '管理员' },
        { label: '运营', value: '运营' },
        { label: '审核', value: '审核' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '启用', value: '启用' },
        { label: '禁用', value: '禁用' }
      ]
    } as any
  }
]

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { username: '', role: '', status: '' }
  pagination.value.currentPage = 1
}

function refresh() {
  pagination.value.currentPage = 1
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = { id: Date.now(), username: '', nickname: '', role: '', status: '启用' }
  dialogVisible.value = true
}

function openEdit(row: User) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function submitDialog() {
  if (!formModel.value.username || !formModel.value.role) {
    ElMessage.warning('请填写用户名和角色')
    return false
  }
  if (dialogMode.value === 'add') {
    users.value.unshift({
      id: formModel.value.id || Date.now(),
      username: formModel.value.username,
      nickname: formModel.value.nickname,
      role: formModel.value.role,
      status: formModel.value.status as UserStatus,
      createdAt: new Date().toISOString().slice(0, 10)
    })
  } else {
    const idx = users.value.findIndex((u) => u.id === formModel.value.id)
    if (idx > -1) users.value[idx] = { ...users.value[idx], ...formModel.value }
  }
  return true
}

function remove(id: number) {
  users.value = users.value.filter((u) => u.id !== id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= users.value.length) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

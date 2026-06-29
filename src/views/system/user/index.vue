<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" :required-fields="['username']" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @reset="handleReset"
          @search="handleSearch"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="表格工具栏" :columns="columns" :disabled-column-keys="disabledColumnKeys" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          v-bind="tableProps"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          border
          style="height: 100%"
        >
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
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
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import BaseTableSetting from '@/components/TableSetting.vue'
import { createUser, deleteUser, getUserList, updateUser, type SysUser, type UserQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'

type UserStatus = '启用' | '禁用'

interface UserRow {
  id: string
  username: string
  nickname: string
  role: string
  status: UserStatus
  createdAt: string
}

interface UserFormModel {
  id: string
  username: string
  nickname: string
  role: string
  status: UserStatus
}

type TableSettingSlotProps = {
  settingColumns: TableColumnItem<UserRow>[]
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

const roleOptions = [
  { label: '超级管理员', value: '超级管理员' },
  { label: '生产计划员', value: '生产计划员' },
  { label: '车间主任', value: '车间主任' },
  { label: '班组长', value: '班组长' },
  { label: '操作工', value: '操作工' },
  { label: '质检员', value: '质检员' },
  { label: '仓管员', value: '仓管员' },
  { label: '采购员', value: '采购员' },
  { label: '销售员', value: '销售员' },
  { label: '财务', value: '财务' }
]

const statusOptions = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' }
]

const disabledColumnKeys = ['__type_index_1__', 'name']
const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  username: '',
  role: '',
  status: ''
})

const searchColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '用户名', field: 'username' },
  {
    type: 'select-v2',
    label: '角色',
    field: 'role',
    props: {
      options: roleOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      style: { width: '200px' },
      options: statusOptions
    } as any
  }
])

const allSearchColumns = computed(() => searchColumns.value)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function createDefaultFormModel(): UserFormModel {
  return {
    id: '',
    username: '',
    nickname: '',
    role: '',
    status: '启用'
  }
}

function mapStatusToApi(status: UserStatus): SysUser['status'] {
  return status === '启用' ? 'active' : 'disabled'
}

function mapStatusToLabel(status: SysUser['status']): UserStatus {
  return status === 'active' ? '启用' : '禁用'
}

function formatDateTime(value?: string) {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 19)
}

function mapUserRow(user: SysUser): UserRow {
  return {
    id: String(user.id),
    username: user.username,
    nickname: user.real_name || '-',
    role: user.roles?.[0] || '-',
    status: mapStatusToLabel(user.status),
    createdAt: formatDateTime(user.created_at)
  }
}

function buildUserPayload(model: UserFormModel): Partial<SysUser> {
  return {
    username: model.username,
    real_name: model.nickname,
    status: mapStatusToApi(model.status),
    roles: model.role ? [model.role] : []
  }
}

const formModel = ref<UserFormModel>(createDefaultFormModel())

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '用户名', field: 'username', required: true },
  { type: 'input', label: '昵称', field: 'nickname' },
  {
    type: 'select-v2',
    label: '角色',
    field: 'role',
    required: true,
    props: {
      options: roleOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<UserRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: UserQuery = {
      page,
      page_size: size,
      username: searchForm.value.username || undefined,
      role: searchForm.value.role || undefined,
      status: searchForm.value.status ? mapStatusToApi(searchForm.value.status as UserStatus) : undefined
    }
    const response = await getUserList(params)

    return {
      list: response.data.items.map(mapUserRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteUser(id)))
})

const columns: TableColumnItem<UserRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 120 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
  { prop: 'createdAt', label: '创建时间', minWidth: 180 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = {
    username: '',
    role: '',
    status: ''
  }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: UserRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    username: row.username,
    nickname: row.nickname === '-' ? '' : row.nickname,
    role: row.role === '-' ? '' : row.role,
    status: row.status
  }
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

  const payload = buildUserPayload(formModel.value)

  if (dialogMode.value === 'add') {
    await createUser(payload)
  } else {
    await updateUser(formModel.value.id, payload)
  }

  await refresh()
  return true
}

function remove(row: UserRow) {
  onDelete(row)
}
</script>

<style scoped></style>

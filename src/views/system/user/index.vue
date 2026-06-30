<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="表格工具栏" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>

          <template #roles="{ row }">
            {{ row.roles.length ? row.roles.join(' / ') : '-' }}
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <UserFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :role-options="roleOptions"
      :status-options="statusOptions"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createUser, deleteUser, getUserList, updateUser, type SysUser, type UserQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import UserFormDialog, { type UserFormModel } from './UserFormDialog.vue'

const roleOptions = [
  { label: '超级管理员', value: '超级管理员' },
  { label: '生产计划员', value: '生产计划员' },
  { label: '车间主任', value: '车间主任' },
  { label: '班组长', value: '班组长' },
  { label: '操作工', value: '操作工' },
  { label: '质检员', value: '质检员' },
  { label: '库管员', value: '库管员' },
  { label: '采购员', value: '采购员' },
  { label: '销售员', value: '销售员' },
  { label: '财务', value: '财务' }
]

const statusOptions: Array<{ label: string; value: SysUser['status'] }> = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const searchColumns: FormColumnItem[] = [
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
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SysUser>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'realName', label: '姓名', minWidth: 120 },
  { prop: 'roles', label: '角色', minWidth: 160, slotName: 'roles' },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
  { prop: 'createdAt', label: '创建时间', minWidth: 180 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  username: string
  role: string
  status: '' | SysUser['status']
}>({
  username: '',
  role: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<UserFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SysUser>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: UserQuery = {
      pageNum: page,
      pageSize: size,
      username: queryParams.username || undefined,
      role: queryParams.role || undefined,
      status: queryParams.status === '' ? undefined : queryParams.status
    }

    const response = await getUserList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteUser(id)))
})

function createDefaultFormModel(): UserFormModel {
  return {
    id: '',
    username: '',
    realName: '',
    roles: [],
    status: 1
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    username: '',
    role: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SysUser) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    username: row.username,
    realName: row.realName,
    roles: [...row.roles],
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.username || !formModel.value.roles.length) {
    ElMessage.warning('请填写用户名和角色')
    return
  }

  const { id, ...payload } = formModel.value

  if (dialogMode.value === 'add') {
    await createUser(payload)
  } else {
    await updateUser(id, payload)
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

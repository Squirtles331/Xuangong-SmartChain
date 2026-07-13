<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="用户管理"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #index="{ $index }">
      {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
    </template>

    <template #roles="{ row }">
      {{ formatRoles(row) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <UserFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :role-options="roleOptions"
        :status-options="statusOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import UserFormDialog, { type UserFormModel } from './UserFormDialog.vue'

interface UserRecord {
  id: string
  username: string
  realName: string
  roles: string[]
  department: string
  status: 0 | 1
  createdAt: string
}

const roleOptions = [
  { label: '平台管理员', value: '平台管理员' },
  { label: '计划专员', value: '计划专员' },
  { label: '生产主管', value: '生产主管' },
  { label: '班组长', value: '班组长' },
  { label: '质量工程师', value: '质量工程师' },
  { label: '仓储专员', value: '仓储专员' },
  { label: '采购专员', value: '采购专员' },
  { label: '销售经理', value: '销售经理' }
]

const statusOptions: Array<{ label: string; value: UserRecord['status']; type: 'success' | 'info' }> = [
  { label: '启用', value: 1, type: 'success' },
  { label: '停用', value: 0, type: 'info' }
]

const userRecords = ref<UserRecord[]>([
  {
    id: 'U-001',
    username: 'admin',
    realName: '系统管理员',
    roles: ['平台管理员'],
    department: '系统平台部',
    status: 1,
    createdAt: '2026-07-01 09:12'
  },
  {
    id: 'U-002',
    username: 'plan.zhang',
    realName: '张计划',
    roles: ['计划专员'],
    department: '计划管理部',
    status: 1,
    createdAt: '2026-07-03 10:36'
  },
  {
    id: 'U-003',
    username: 'mes.li',
    realName: '李生产',
    roles: ['生产主管', '班组长'],
    department: '制造执行部',
    status: 1,
    createdAt: '2026-07-04 14:20'
  },
  {
    id: 'U-004',
    username: 'qms.wang',
    realName: '王质量',
    roles: ['质量工程师'],
    department: '质量管理部',
    status: 0,
    createdAt: '2026-07-05 16:05'
  },
  {
    id: 'U-005',
    username: 'wms.zhao',
    realName: '赵仓储',
    roles: ['仓储专员'],
    department: '仓储物流部',
    status: 1,
    createdAt: '2026-07-06 08:48'
  },
  {
    id: 'U-006',
    username: 'srm.sun',
    realName: '孙采购',
    roles: ['采购专员'],
    department: '供应协同部',
    status: 1,
    createdAt: '2026-07-07 11:13'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '账号', field: 'username', props: { placeholder: '请输入账号或姓名' } as never },
  {
    type: 'select-v2',
    label: '角色',
    field: 'role',
    props: { options: roleOptions, clearable: true } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: statusOptions, clearable: true } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<UserRecord>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'username', label: '账号', minWidth: 140 },
  { prop: 'realName', label: '姓名', minWidth: 120 },
  { prop: 'department', label: '归属部门', minWidth: 150 },
  { prop: 'roles', label: '角色', minWidth: 200, slotName: 'roles' },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  username: string
  role: string
  status: '' | UserRecord['status']
}>({
  username: '',
  role: '',
  status: ''
})

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<UserFormModel>(createDefaultFormModel())

const filteredRecords = computed(() => {
  return userRecords.value.filter((item) => {
    const matchKeyword =
      !queryParams.username ||
      item.username.toLowerCase().includes(queryParams.username.toLowerCase()) ||
      item.realName.includes(queryParams.username)

    const matchRole = !queryParams.role || item.roles.includes(queryParams.role)
    const matchStatus = queryParams.status === '' || item.status === queryParams.status

    return matchKeyword && matchRole && matchStatus
  })
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<UserRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    userRecords.value = userRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): UserFormModel {
  return {
    id: '',
    username: '',
    realName: '',
    roles: [],
    department: '',
    status: 1
  }
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

function openEdit(row: UserRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    username: row.username,
    realName: row.realName,
    roles: Array.isArray(row.roles) ? [...row.roles] : [],
    department: row.department,
    status: row.status
  }
  dialogVisible.value = true
}

function formatRoles(row?: Partial<UserRecord>) {
  if (!Array.isArray(row?.roles) || row.roles.length === 0) {
    return '-'
  }

  return row.roles.join(' / ')
}

function handleRowAction(action: string, row: UserRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.username || !formModel.value.realName || !formModel.value.roles.length) {
    ElMessage.warning('请完整填写账号、姓名和角色')
    return
  }

  if (dialogMode.value === 'add') {
    userRecords.value.unshift({
      id: `U-${String(userRecords.value.length + 1).padStart(3, '0')}`,
      username: formModel.value.username,
      realName: formModel.value.realName,
      roles: [...formModel.value.roles],
      department: formModel.value.department || '待分配部门',
      status: formModel.value.status,
      createdAt: '2026-07-13 10:00'
    })
    ElMessage.success('已新增静态用户数据')
  } else {
    userRecords.value = userRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            username: formModel.value.username,
            realName: formModel.value.realName,
            roles: [...formModel.value.roles],
            department: formModel.value.department || '待分配部门',
            status: formModel.value.status
          }
        : item
    )
    ElMessage.success('已更新静态用户数据')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

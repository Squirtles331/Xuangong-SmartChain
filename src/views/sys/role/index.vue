<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="角色列表"
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
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <RoleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import type { SysRole } from '@/api/system'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { sysRoleRecords } from '../static-data'
import RoleFormDialog, { type RoleFormModel } from './RoleFormDialog.vue'

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '角色名称', field: 'name', props: { placeholder: '角色编码/角色名称' } as any }]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SysRole>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '角色编码', minWidth: 140 },
  { prop: 'name', label: '角色名称', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 220 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'userCount', label: '用户数', minWidth: 90, align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  name: ''
})

const statusOptions = [
  { label: '启用', value: 'active', type: 'success' as const },
  { label: '禁用', value: 'disabled', type: 'info' as const }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<RoleFormModel>(createDefaultFormModel())
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const filteredRecords = computed(() => {
  const keyword = queryParams.name.trim().toLowerCase()

  if (!keyword) {
    return sysRoleRecords.value
  }

  return sysRoleRecords.value.filter((item) => item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword))
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SysRole>({
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
    sysRoleRecords.value = sysRoleRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): RoleFormModel {
  return {
    id: '',
    code: '',
    name: '',
    description: '',
    status: 'active',
    permissionIds: []
  }
}

function handleReset() {
  queryParams.name = ''
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SysRole) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    status: row.status,
    permissionIds: row.permissionIds ? [...row.permissionIds] : []
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: SysRole) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写角色编码和角色名称')
    return
  }

  const payload = {
    code: formModel.value.code,
    name: formModel.value.name,
    description: formModel.value.description,
    status: formModel.value.status,
    permissionIds: formModel.value.permissionIds
  }

  if (dialogMode.value === 'add') {
    sysRoleRecords.value.unshift({
      id: `ROLE-${String(sysRoleRecords.value.length + 1).padStart(3, '0')}`,
      ...payload,
      userCount: 0
    })
  } else {
    sysRoleRecords.value = sysRoleRecords.value.map((item) => (item.id === formModel.value.id ? { ...item, ...payload } : item))
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态角色数据' : '已更新静态角色数据')
}
</script>

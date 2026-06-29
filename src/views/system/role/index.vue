<template>
  <gi-page-layout :auto-collapse="false">
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      style="height: 100%"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <RoleFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getRoleList, createRole, updateRole, deleteRole, type SysRole } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import RoleFormDialog, { type RoleFormModel } from './RoleFormDialog.vue'

interface RoleRow {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
  user_count: number
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ name: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '角色名称', field: 'name' }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<RoleRow>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '角色编码', minWidth: 140 },
  { prop: 'name', label: '角色名称', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'user_count', label: '用户数', width: 80, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<RoleRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params = {
      page,
      page_size: size,
      name: searchForm.value.name || undefined
    }
    const response = await getRoleList(params)
    return {
      list: (response.data.items as SysRole[]).map(mapRoleRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteRole(id)))
})

function mapRoleRow(role: SysRole): RoleRow {
  return {
    id: role.id,
    code: role.code,
    name: role.name,
    description: role.description,
    status: role.status,
    user_count: role.user_count
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.name = ''
  search()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<RoleFormModel>(createDefaultFormModel())

function createDefaultFormModel(): RoleFormModel {
  return { id: '', code: '', name: '', description: '', status: 'active', permission_ids: [] }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: RoleRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    status: row.status,
    permission_ids: []
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }
  if (dialogMode.value === 'add') {
    await createRole({
      code: formModel.value.code,
      name: formModel.value.name,
      description: formModel.value.description,
      status: formModel.value.status
    })
    ElMessage.success('新增成功')
  } else {
    await updateRole(formModel.value.id, {
      code: formModel.value.code,
      name: formModel.value.name,
      description: formModel.value.description,
      status: formModel.value.status
    })
    ElMessage.success('保存成功')
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

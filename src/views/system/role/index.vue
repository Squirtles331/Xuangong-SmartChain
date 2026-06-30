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
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="角色列表" :columns="columns" @refresh="refresh">
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
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <RoleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createRole, deleteRole, getRoleList, updateRole, type RoleQuery, type SysRole } from '@/api/system'
import { useTable } from '@/hooks/useTable'
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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<RoleFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SysRole>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: RoleQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.name || undefined
    }

    const response = await getRoleList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteRole(id)))
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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
    await createRole(payload)
  } else {
    await updateRole(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

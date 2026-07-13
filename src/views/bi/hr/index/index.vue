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

    <TableSetting title="员工档案" :columns="columns" @refresh="refresh">
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
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <HrIndexFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :department-options="departmentOptions"
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
import {
  createHrEmployee,
  deleteHrEmployee,
  getHrEmployeeList,
  updateHrEmployee,
  type HrEmployee,
  type HrEmployeeQuery,
  type HrEmployeeStatus
} from '@/api/hr'
import { useTable } from '@/hooks/useTable'
import HrIndexFormDialog, { type HrEmployeeFormModel } from './HrIndexFormDialog.vue'

const departmentOptions = [
  { label: '机加工一车间', value: '机加工一车间' },
  { label: '机加工二车间', value: '机加工二车间' },
  { label: '装配车间', value: '装配车间' },
  { label: '品质部', value: '品质部' }
]

const statusOptions: Array<{ label: string; value: '' | HrEmployeeStatus }> = [
  { label: '全部', value: '' },
  { label: '在职', value: 'active' },
  { label: '离职', value: 'inactive' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword' },
  {
    type: 'select-v2',
    label: '部门',
    field: 'department',
    props: {
      options: [{ label: '全部', value: '' }, ...departmentOptions]
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

const columns: TableColumnItem<HrEmployee>[] = [
  { prop: 'code', label: '工号', minWidth: 130 },
  { prop: 'name', label: '姓名', minWidth: 100 },
  { prop: 'department', label: '部门', minWidth: 140 },
  { prop: 'position', label: '岗位', minWidth: 140 },
  { prop: 'phone', label: '电话', minWidth: 130 },
  { prop: 'hire_date', label: '入职日期', minWidth: 120, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  department: string
  status: '' | HrEmployeeStatus
}>({
  keyword: '',
  department: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<HrEmployeeFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<HrEmployee>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: HrEmployeeQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      department: queryParams.department || undefined,
      status: queryParams.status || undefined
    }

    const response = await getHrEmployeeList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteHrEmployee(id)))
})

function createDefaultFormModel(): HrEmployeeFormModel {
  return {
    id: '',
    code: '',
    name: '',
    department: '机加工一车间',
    position: '',
    phone: '',
    hire_date: '',
    status: 'active'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    department: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: HrEmployee) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.position) {
    ElMessage.warning('请填写姓名和岗位')
    return
  }

  if (dialogMode.value === 'add') {
    await createHrEmployee(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateHrEmployee(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
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

<template>
  <gi-page-layout>
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
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '在职' : '离职' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

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
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import HrIndexFormDialog, { type HrEmployeeFormModel } from './HrIndexFormDialog.vue'

interface EmployeeRow {
  id: string
  code: string
  name: string
  department: string
  position: string
  phone: string
  hire_date: string
  status: string
}

const departmentOptions = [
  { label: '机加工一车间', value: '机加工一车间' },
  { label: '机加工二车间', value: '机加工二车间' },
  { label: '装配车间', value: '装配车间' }
]

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', department: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<HrEmployeeFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '部门',
    field: 'department',
    props: {
      options: [
        { label: '全部', value: '' },
        ...departmentOptions
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<EmployeeRow>[] = [
  { prop: 'code', label: '工号', width: 120 },
  { prop: 'name', label: '姓名', width: 80 },
  { prop: 'department', label: '部门', width: 140 },
  { prop: 'position', label: '岗位', width: 140 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'hire_date', label: '入职日期', width: 110 },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

// Inline mock data
const mockEmployees = ref<EmployeeRow[]>([
  { id: '1', code: 'E00000001', name: '李四', department: '机加工一车间', position: '数控操作工', phone: '13800000001', hire_date: '2022-03-01', status: 'active' },
  { id: '2', code: 'E00000002', name: '王五', department: '机加工一车间', position: '钻床操作工', phone: '13800000002', hire_date: '2023-06-15', status: 'active' },
  { id: '3', code: 'E00000003', name: '赵六', department: '装配车间', position: '装配钳工', phone: '13800000003', hire_date: '2021-09-01', status: 'active' },
  { id: '4', code: 'E00000004', name: '孙八', department: '机加工二车间', position: '加工中心操作工', phone: '13800000004', hire_date: '2024-01-10', status: 'active' }
])

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EmployeeRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = mockEmployees.value
    if (searchForm.value.keyword) {
      filtered = filtered.filter((e) => e.name.includes(searchForm.value.keyword) || e.code.includes(searchForm.value.keyword))
    }
    if (searchForm.value.department) {
      filtered = filtered.filter((e) => e.department === searchForm.value.department)
    }
    const start = (page - 1) * size
    return { list: filtered.slice(start, start + size), total: filtered.length }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => {
    mockEmployees.value = mockEmployees.value.filter((e) => e.id !== id)
  }))
})

function createDefaultFormModel(): HrEmployeeFormModel {
  return { id: '', code: '', name: '', department: '机加工一车间', position: '', phone: '', hire_date: '', status: 'active' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', department: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EmployeeRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.position) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    const code = 'E' + String(mockEmployees.value.length + 1).padStart(8, '0')
    mockEmployees.value.unshift({ ...formModel.value, id: Date.now().toString(), code } as EmployeeRow)
  } else {
    const i = mockEmployees.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(mockEmployees.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: EmployeeRow) {
  onDelete(row)
}
</script>

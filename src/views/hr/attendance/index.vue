<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #result="{ row }">
        <StatusTag :value="row.result" :options="ATTENDANCE_RESULT" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <AttendanceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import AttendanceFormDialog, { type AttendanceFormModel } from './AttendanceFormDialog.vue'

const ATTENDANCE_RESULT = [
  { value: 'normal', label: '正常', type: 'success' as const },
  { value: 'late', label: '迟到', type: 'warning' as const },
  { value: 'absent', label: '旷工', type: 'danger' as const }
]

interface AttendanceRow {
  id: string
  employee: string
  date: string
  clock_in: string
  clock_out: string
  result: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ employee: '', date: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<AttendanceFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '员工', field: 'employee' } as any,
  { type: 'date-picker', label: '日期', field: 'date' } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<AttendanceRow>[] = [
  { prop: 'employee', label: '员工', width: 80 },
  { prop: 'date', label: '日期', width: 110 },
  { prop: 'clock_in', label: '上班打卡', width: 100 },
  { prop: 'clock_out', label: '下班打卡', width: 100 },
  { label: '结果', minWidth: 60, slotName: 'result', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const mockData = ref<AttendanceRow[]>([
  { id: '1', employee: '李四', date: '2025-01-15', clock_in: '07:50', clock_out: '17:05', result: 'normal' },
  { id: '2', employee: '王五', date: '2025-01-15', clock_in: '08:15', clock_out: '17:00', result: 'late' },
  { id: '3', employee: '赵六', date: '2025-01-15', clock_in: '07:55', clock_out: '17:10', result: 'normal' }
])

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<AttendanceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = mockData.value
    if (searchForm.value.employee) filtered = filtered.filter((e) => e.employee.includes(searchForm.value.employee))
    if (searchForm.value.date) filtered = filtered.filter((e) => e.date === searchForm.value.date)
    const start = (page - 1) * size
    return { list: filtered.slice(start, start + size), total: filtered.length }
  },
  deleteAPI: (ids) =>
    Promise.all(
      ids.map((id) => {
        mockData.value = mockData.value.filter((e) => e.id !== id)
      })
    )
})

function createDefaultFormModel(): AttendanceFormModel {
  return { id: '', employee: '', date: '', clock_in: '08:00', clock_out: '17:00', result: 'normal' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { employee: '', date: '' }
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

function openEdit(row: AttendanceRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.employee) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    mockData.value.unshift({ ...formModel.value, id: Date.now().toString() } as AttendanceRow)
  } else {
    const i = mockData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(mockData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: AttendanceRow) {
  onDelete(row)
}
</script>

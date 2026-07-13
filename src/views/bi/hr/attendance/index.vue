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

    <TableSetting title="考勤记录" :columns="columns" @refresh="refresh">
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
          <template #result="{ row }">
            <StatusTag :value="row.result" :options="attendanceResultOptions" />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <AttendanceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createHrAttendance,
  deleteHrAttendance,
  getHrAttendanceList,
  updateHrAttendance,
  type HrAttendanceQuery,
  type HrAttendanceRecord,
  type HrAttendanceResult
} from '@/api/hr'
import { useTable } from '@/hooks/useTable'
import AttendanceFormDialog, { type AttendanceFormModel } from './AttendanceFormDialog.vue'

const attendanceResultOptions = [
  { value: 'normal', label: '正常', type: 'success' as const },
  { value: 'late', label: '迟到', type: 'warning' as const },
  { value: 'absent', label: '缺勤', type: 'danger' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '员工姓名', field: 'employee' },
  { type: 'date-picker', label: '日期', field: 'date', props: { valueFormat: 'YYYY-MM-DD' } as any },
  {
    type: 'select-v2',
    label: '考勤结果',
    field: 'result',
    props: {
      options: [{ label: '全部', value: '' }, ...attendanceResultOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<HrAttendanceRecord>[] = [
  { prop: 'employee', label: '员工姓名', minWidth: 120 },
  { prop: 'date', label: '日期', minWidth: 120, align: 'center' },
  { prop: 'clock_in', label: '上班打卡', minWidth: 110, align: 'center' },
  { prop: 'clock_out', label: '下班打卡', minWidth: 110, align: 'center' },
  { prop: 'result', label: '考勤结果', minWidth: 100, align: 'center', slotName: 'result' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  employee: string
  date: string
  result: '' | HrAttendanceResult
}>({
  employee: '',
  date: '',
  result: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<AttendanceFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<HrAttendanceRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: HrAttendanceQuery = {
      pageNum: page,
      pageSize: size,
      employee: queryParams.employee || undefined,
      date: queryParams.date || undefined,
      result: queryParams.result || undefined
    }

    const response = await getHrAttendanceList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteHrAttendance(id)))
})

function createDefaultFormModel(): AttendanceFormModel {
  return {
    id: '',
    employee: '',
    date: '',
    clock_in: '08:00',
    clock_out: '17:00',
    result: 'normal'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    employee: '',
    date: '',
    result: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: HrAttendanceRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.employee) {
    ElMessage.warning('请填写员工姓名')
    return
  }

  if (dialogMode.value === 'add') {
    await createHrAttendance(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateHrAttendance(formModel.value.id, formModel.value)
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

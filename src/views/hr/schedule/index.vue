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

    <TableSetting title="班组排班" :columns="columns" @refresh="refresh">
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
          <template #shift="{ row }">
            <el-tag :type="row.shift === 'day' ? 'warning' : row.shift === 'night' ? 'primary' : 'info'">
              {{ row.shift === 'day' ? '白班' : row.shift === 'night' ? '夜班' : '中班' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ScheduleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createHrSchedule,
  deleteHrSchedule,
  getHrScheduleList,
  updateHrSchedule,
  type HrScheduleQuery,
  type HrScheduleRecord,
  type HrShiftType
} from '@/api/hr'
import { useTable } from '@/hooks/useTable'
import ScheduleFormDialog, { type ScheduleFormModel } from './ScheduleFormDialog.vue'

const shiftOptions: Array<{ label: string; value: '' | HrShiftType }> = [
  { label: '全部', value: '' },
  { label: '白班', value: 'day' },
  { label: '夜班', value: 'night' },
  { label: '中班', value: 'middle' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '班组/负责人', field: 'team' },
  {
    type: 'select-v2',
    label: '班次',
    field: 'shift',
    props: {
      options: shiftOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<HrScheduleRecord>[] = [
  { prop: 'team', label: '班组', minWidth: 100 },
  { prop: 'shift', label: '班次', minWidth: 100, align: 'center', slotName: 'shift' },
  { prop: 'members', label: '成员', minWidth: 240 },
  { prop: 'leader', label: '班组长', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  team: string
  shift: '' | HrShiftType
}>({
  team: '',
  shift: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ScheduleFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<HrScheduleRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: HrScheduleQuery = {
      pageNum: page,
      pageSize: size,
      team: queryParams.team || undefined,
      shift: queryParams.shift || undefined
    }

    const response = await getHrScheduleList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteHrSchedule(id)))
})

function createDefaultFormModel(): ScheduleFormModel {
  return {
    id: '',
    team: '',
    shift: 'day',
    members: '',
    leader: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    team: '',
    shift: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: HrScheduleRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.team) {
    ElMessage.warning('请填写班组')
    return
  }

  if (dialogMode.value === 'add') {
    await createHrSchedule(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateHrSchedule(formModel.value.id, formModel.value)
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

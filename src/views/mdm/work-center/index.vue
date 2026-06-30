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

          <template #status="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <WorkCenterFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createWorkCenter, deleteWorkCenter, getWorkCenterList, updateWorkCenter, type WorkCenter, type WorkCenterQuery } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import WorkCenterFormDialog, { type WorkCenterFormModel } from './WorkCenterFormDialog.vue'

type WorkCenterRow = WorkCenter

const workshopOptions = [
  { label: '机加工一车间', value: '机加工一车间' },
  { label: '机加工二车间', value: '机加工二车间' },
  { label: '装配车间', value: '装配车间' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工作中心编码/名称/车间' } as any },
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    props: {
      options: workshopOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<WorkCenterRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '工作中心编码', minWidth: 140 },
  { prop: 'name', label: '工作中心名称', minWidth: 140 },
  { prop: 'workshop', label: '所属车间', minWidth: 140 },
  { prop: 'shift', label: '班次', minWidth: 100, align: 'center' },
  { prop: 'people', label: '人数', minWidth: 80, align: 'center' },
  { prop: 'efficiency', label: '效率(%)', minWidth: 100, align: 'center' },
  { prop: 'costPerHour', label: '工时费率(元/h)', minWidth: 120, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  workshop: string
}>({
  keyword: '',
  workshop: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<WorkCenterFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<WorkCenterRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: WorkCenterQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      workshop: queryParams.workshop || undefined
    }

    const response = await getWorkCenterList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteWorkCenter(id)))
})

function createDefaultFormModel(): WorkCenterFormModel {
  return {
    id: '',
    code: '',
    name: '',
    workshop: '',
    shift: '白班',
    people: 0,
    efficiency: 0,
    costPerHour: 0,
    status: 'running'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    workshop: ''
  })
  search()
}

function getStatusLabel(status: WorkCenter['status']) {
  const statusLabelMap: Record<WorkCenter['status'], string> = {
    running: '运行',
    idle: '空闲',
    repair: '维修'
  }
  return statusLabelMap[status]
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: WorkCenterRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    workshop: row.workshop,
    shift: row.shift,
    people: row.people,
    efficiency: row.efficiency,
    costPerHour: row.costPerHour,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.workshop) {
    ElMessage.warning('请填写工作中心编码、工作中心名称和所属车间')
    return
  }

  const { id, ...payload } = formModel.value

  if (dialogMode.value === 'add') {
    await createWorkCenter(payload)
  } else {
    await updateWorkCenter(id, payload)
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

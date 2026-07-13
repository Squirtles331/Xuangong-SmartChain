<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="维修工单" :columns="columns" @refresh="refresh">
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
          <template #priority="{ row }">
            <StatusTag :value="row.priority" :options="priorityOptions" />
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="repairStatusOptions" />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="dispatch(row)">派工</el-button>
            <el-button v-if="row.status === 'running'" type="success" link size="small" @click="complete(row)">完工</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <RepairFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { WORK_ORDER_PRIORITY as priorityOptions } from '@/common/status-maps'
import {
  getEquipmentRepairList,
  saveEquipmentRepair,
  updateEquipmentRepairStatus,
  type EquipmentRepair,
  type EquipmentRepairQuery
} from '@/api/equipment'
import { useTable } from '@/hooks/useTable'
import RepairFormDialog, { type RepairFormModel } from './RepairFormDialog.vue'

const repairStatusOptions = [
  { value: 'pending', label: '待派工', type: 'warning' as const },
  { value: 'running', label: '维修中', type: 'primary' as const },
  { value: 'done', label: '已完成', type: 'success' as const },
  { value: 'verified', label: '已验收', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待派工', value: 'pending' },
        { label: '维修中', value: 'running' },
        { label: '已完成', value: 'done' },
        { label: '已验收', value: 'verified' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentRepair>[] = [
  { prop: 'code', label: '维修单号', minWidth: 170 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { prop: 'fault_desc', label: '故障描述', minWidth: 220 },
  { label: '优先级', minWidth: 90, slotName: 'priority', align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'worker', label: '维修人', minWidth: 100 },
  { prop: 'created_at', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  status: '',
  priority: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<RepairFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<EquipmentRepair>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentRepairQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: (queryParams.status || undefined) as EquipmentRepair['status'] | undefined,
      priority: (queryParams.priority || undefined) as EquipmentRepair['priority'] | undefined
    }
    const response = await getEquipmentRepairList(params)
    return response.data
  }
})

function createDefaultFormModel(): RepairFormModel {
  return {
    id: '',
    code: '',
    equipment: '',
    fault_desc: '',
    priority: 'normal',
    status: 'pending',
    worker: '',
    created_at: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: '',
    priority: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentRepair) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveEquipmentRepair({
    ...formModel.value,
    priority: formModel.value.priority as EquipmentRepair['priority'],
    status: formModel.value.status as EquipmentRepair['status']
  })
  dialogVisible.value = false
  await refresh()
}

async function dispatch(row: EquipmentRepair) {
  await updateEquipmentRepairStatus(row.id, { status: 'running', worker: row.worker || '张维修' })
  ElMessage.success('已派工')
  await refresh()
}

async function complete(row: EquipmentRepair) {
  await updateEquipmentRepairStatus(row.id, { status: 'done' })
  ElMessage.success('维修完成，待验收')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

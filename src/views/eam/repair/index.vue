<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="维修"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #priority="{ row }">
      <StatusTag :value="row.priority" :options="priorityOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #downtime_minutes="{ row }"> {{ Number(row.downtime_minutes ?? 0).toLocaleString('zh-CN') }} 分钟 </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <RepairFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :equipment-options="equipmentOptions"
        :priority-options="prioritySelectOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  deleteEquipmentRepair,
  eamRepairPriorityOptions,
  eamRepairStatusOptions,
  getEquipmentAssetOptions,
  getEquipmentRepairList,
  saveEquipmentRepair,
  updateEquipmentRepairStatus,
  type EquipmentRepairQuery,
  type EquipmentRepairRecord
} from '@/static/services/eam'
import RepairFormDialog, { type RepairFormModel } from './RepairFormDialog.vue'

defineOptions({
  name: 'EamRepairPage'
})

const priorityOptions = [...eamRepairPriorityOptions]
const prioritySelectOptions = priorityOptions.map((item) => ({ label: item.label, value: item.value }))
const statusOptions = [...eamRepairStatusOptions]
const equipmentOptions = ref(getEquipmentAssetOptions())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '维修关键字', field: 'keyword', props: { clearable: true, placeholder: '维修单号 / 设备 / 故障描述 / 来源' } as never },
  {
    type: 'select-v2',
    label: '维修状态',
    field: 'status',
    props: {
      clearable: true,
      options: statusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as never
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: { clearable: true, options: prioritySelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentRepairRecord>[] = [
  { prop: 'code', label: '维修单号', minWidth: 150 },
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { prop: 'fault_desc', label: '故障描述', minWidth: 220 },
  { prop: 'source', label: '来源上下文', minWidth: 130 },
  { label: '优先级', minWidth: 90, align: 'center', slotName: 'priority' },
  { label: '维修状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'worker', label: '维修人', minWidth: 110 },
  { label: '停机影响', minWidth: 110, align: 'right', slotName: 'downtime_minutes' },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  status: '' | EquipmentRepairRecord['status']
  priority: '' | EquipmentRepairRecord['priority']
}>({
  keyword: '',
  status: '',
  priority: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<RepairFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EquipmentRepairRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentRepairQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: queryParams.status || undefined,
      priority: queryParams.priority || undefined
    }
    const response = await getEquipmentRepairList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipmentRepair(id)))
})

function createDefaultFormModel(): RepairFormModel {
  return {
    id: '',
    code: '',
    equipment_code: equipmentOptions.value[0]?.value || '',
    fault_desc: '',
    priority: 'normal',
    status: 'pending',
    worker: '',
    created_at: ''
  }
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
  equipmentOptions.value = getEquipmentAssetOptions()
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentRepairRecord) {
  equipmentOptions.value = getEquipmentAssetOptions()
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    equipment_code: row.equipment_code,
    fault_desc: row.fault_desc,
    priority: row.priority,
    status: row.status,
    worker: row.worker,
    created_at: row.created_at
  }
  dialogVisible.value = true
}

function getRowActions(row: EquipmentRepairRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'dispatch', label: '派工', tone: 'warning', hidden: row.status !== 'pending' },
    { key: 'complete', label: '完工', tone: 'success', hidden: row.status !== 'running' },
    { key: 'verify', label: '验收', tone: 'primary', hidden: row.status !== 'done' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status !== 'pending' }
  ]
}

function handleRowAction(action: string, row: EquipmentRepairRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'dispatch') {
    void dispatch(row)
    return
  }

  if (action === 'complete') {
    void complete(row)
    return
  }

  if (action === 'verify') {
    void verify(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.equipment_code || !formModel.value.fault_desc) {
    ElMessage.warning('请填写维修单号、设备和故障描述')
    return
  }

  await saveEquipmentRepair({
    id: formModel.value.id,
    code: formModel.value.code,
    equipment_code: formModel.value.equipment_code,
    fault_desc: formModel.value.fault_desc,
    priority: formModel.value.priority as EquipmentRepairRecord['priority'],
    status: formModel.value.status as EquipmentRepairRecord['status'],
    worker: formModel.value.worker,
    created_at: formModel.value.created_at
  })

  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '维修工单已新增' : '维修工单已更新')
  await refresh()
}

async function dispatch(row: EquipmentRepairRecord) {
  await updateEquipmentRepairStatus(row.id, {
    status: 'running',
    worker: row.worker || '陈维修'
  })
  ElMessage.success('维修工单已派工')
  await refresh()
}

async function complete(row: EquipmentRepairRecord) {
  await updateEquipmentRepairStatus(row.id, { status: 'done' })
  ElMessage.success('维修工单已完工，待验收')
  await refresh()
}

async function verify(row: EquipmentRepairRecord) {
  await updateEquipmentRepairStatus(row.id, { status: 'verified' })
  ElMessage.success('维修工单已验收闭环')
  await refresh()
}
</script>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="保养"
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
    <template #type="{ row }">
      {{ resolveMaintainTypeLabel(row.type) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <MaintainFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :equipment-options="equipmentOptions"
        :maintain-type-options="maintainTypeOptions"
        @submit="submitDialog"
      />
      <MaintainExecuteDialog v-model:visible="execVisible" v-model:items="execItems" v-model:form="execForm" @submit="confirmExec" />
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
  deleteEquipmentMaintain,
  eamDefaultMaintainExecuteItems,
  eamMaintainStatusOptions,
  eamMaintainTypeOptions,
  executeEquipmentMaintain,
  getEquipmentAssetOptions,
  getEquipmentMaintainList,
  saveEquipmentMaintain,
  type EquipmentMaintainQuery,
  type EquipmentMaintainRecord
} from '@/static/services/eam'
import MaintainExecuteDialog, { type MaintainExecuteFormModel, type MaintainExecuteItem } from './MaintainExecuteDialog.vue'
import MaintainFormDialog, { type MaintainFormModel } from './MaintainFormDialog.vue'

defineOptions({
  name: 'EamMaintainPage'
})

const maintainTypeOptions = [...eamMaintainTypeOptions]
const statusOptions = [...eamMaintainStatusOptions]
const equipmentOptions = ref(getEquipmentAssetOptions())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '保养关键字', field: 'keyword', props: { clearable: true, placeholder: '计划编号 / 设备 / 执行人' } as never },
  {
    type: 'select-v2',
    label: '保养类型',
    field: 'type',
    props: { clearable: true, options: maintainTypeOptions } as never
  },
  {
    type: 'select-v2',
    label: '执行状态',
    field: 'status',
    props: {
      clearable: true,
      options: statusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentMaintainRecord>[] = [
  { prop: 'code', label: '计划编号', minWidth: 150 },
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { label: '保养类型', minWidth: 110, align: 'center', slotName: 'type' },
  { prop: 'plan_date', label: '计划日期', minWidth: 120, align: 'center' },
  { prop: 'executor', label: '执行人', minWidth: 110 },
  { prop: 'cycle_days', label: '周期(天)', minWidth: 90, align: 'right' },
  { prop: 'spare_plan', label: '备件/耗材', minWidth: 180 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  type: '' | EquipmentMaintainRecord['type']
  status: '' | EquipmentMaintainRecord['status']
}>({
  keyword: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<MaintainFormModel>(createDefaultFormModel())

const execVisible = ref(false)
const execPlanId = ref('')
const execForm = ref<MaintainExecuteFormModel>({ remark: '' })
const execItems = ref<MaintainExecuteItem[]>(eamDefaultMaintainExecuteItems.map((item) => ({ ...item })))

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EquipmentMaintainRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentMaintainQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: queryParams.type || undefined,
      status: queryParams.status || undefined
    }
    const response = await getEquipmentMaintainList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipmentMaintain(id)))
})

function createDefaultFormModel(): MaintainFormModel {
  return {
    id: '',
    code: '',
    equipment_code: equipmentOptions.value[0]?.value || '',
    type: 'daily',
    plan_date: '',
    executor: '',
    status: 'pending'
  }
}

function resolveMaintainTypeLabel(value: EquipmentMaintainRecord['type']) {
  return maintainTypeOptions.find((item) => item.value === value)?.label || value
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: '',
    status: ''
  })
  search()
}

function openAdd() {
  equipmentOptions.value = getEquipmentAssetOptions()
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentMaintainRecord) {
  equipmentOptions.value = getEquipmentAssetOptions()
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    equipment_code: row.equipment_code,
    type: row.type,
    plan_date: row.plan_date,
    executor: row.executor,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: EquipmentMaintainRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'execute', label: '执行', tone: 'warning', hidden: row.status === 'done' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'done' }
  ]
}

function handleRowAction(action: string, row: EquipmentMaintainRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'execute') {
    execute(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.equipment_code || !formModel.value.executor) {
    ElMessage.warning('请填写计划编号、设备和执行人')
    return
  }

  await saveEquipmentMaintain({
    id: formModel.value.id,
    code: formModel.value.code,
    equipment_code: formModel.value.equipment_code,
    type: formModel.value.type as EquipmentMaintainRecord['type'],
    plan_date: formModel.value.plan_date,
    executor: formModel.value.executor,
    status: formModel.value.status as EquipmentMaintainRecord['status']
  })

  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '保养计划已新增' : '保养计划已更新')
  await refresh()
}

function execute(row: EquipmentMaintainRecord) {
  execPlanId.value = row.id
  execForm.value = { remark: '' }
  execItems.value = eamDefaultMaintainExecuteItems.map((item) => ({ ...item }))
  execVisible.value = true
}

async function confirmExec() {
  await executeEquipmentMaintain(execPlanId.value, { remark: execForm.value.remark })
  execVisible.value = false
  ElMessage.success('保养已执行完成')
  await refresh()
}
</script>

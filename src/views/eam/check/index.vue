<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="点检"
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
    <template #check_type="{ row }">
      {{ resolveCheckTypeLabel(row.check_type) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <CheckFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :equipment-options="equipmentOptions"
        :check-type-options="checkTypeOptions"
        @submit="submitDialog"
      />
      <CheckExecuteDialog v-model:visible="execVisible" v-model:items="execItems" v-model:form="execForm" @submit="confirmExec" />
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
  deleteEquipmentCheck,
  eamCheckStatusOptions,
  eamCheckTypeOptions,
  eamDefaultCheckExecuteItems,
  executeEquipmentCheck,
  getEquipmentAssetOptions,
  getEquipmentCheckList,
  saveEquipmentCheck,
  type EquipmentCheckQuery,
  type EquipmentCheckRecord
} from '@/static/services/eam'
import CheckExecuteDialog, { type CheckExecuteFormModel, type CheckExecuteItem } from './CheckExecuteDialog.vue'
import CheckFormDialog, { type CheckFormModel } from './CheckFormDialog.vue'

defineOptions({
  name: 'EamCheckPage'
})

const checkTypeOptions = [...eamCheckTypeOptions]
const statusOptions = [...eamCheckStatusOptions]
const equipmentOptions = ref(getEquipmentAssetOptions())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '点检关键字', field: 'keyword', props: { clearable: true, placeholder: '计划编号 / 设备 / 执行人' } as never },
  {
    type: 'select-v2',
    label: '点检类型',
    field: 'check_type',
    props: { clearable: true, options: checkTypeOptions } as never
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

const columns: TableColumnItem<EquipmentCheckRecord>[] = [
  { prop: 'code', label: '计划编号', minWidth: 150 },
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { label: '点检类型', minWidth: 100, align: 'center', slotName: 'check_type' },
  { prop: 'plan_date', label: '计划日期', minWidth: 120, align: 'center' },
  { prop: 'executor', label: '执行人', minWidth: 110 },
  { prop: 'shift', label: '班次', minWidth: 90, align: 'center' },
  { prop: 'last_result', label: '最近结果', minWidth: 180 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  check_type: '' | EquipmentCheckRecord['check_type']
  status: '' | EquipmentCheckRecord['status']
}>({
  keyword: '',
  check_type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<CheckFormModel>(createDefaultFormModel())

const execVisible = ref(false)
const execPlanId = ref('')
const execForm = ref<CheckExecuteFormModel>({ remark: '' })
const execItems = ref<CheckExecuteItem[]>(eamDefaultCheckExecuteItems.map((item) => ({ ...item })))

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EquipmentCheckRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentCheckQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      check_type: queryParams.check_type || undefined,
      status: queryParams.status || undefined
    }
    const response = await getEquipmentCheckList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipmentCheck(id)))
})

function createDefaultFormModel(): CheckFormModel {
  return {
    id: '',
    code: '',
    equipment_code: equipmentOptions.value[0]?.value || '',
    check_type: 'daily',
    plan_date: '',
    executor: '',
    status: 'pending'
  }
}

function resolveCheckTypeLabel(value: EquipmentCheckRecord['check_type']) {
  return checkTypeOptions.find((item) => item.value === value)?.label || value
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    check_type: '',
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

function openEdit(row: EquipmentCheckRecord) {
  equipmentOptions.value = getEquipmentAssetOptions()
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    equipment_code: row.equipment_code,
    check_type: row.check_type,
    plan_date: row.plan_date,
    executor: row.executor,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: EquipmentCheckRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'execute', label: '执行', tone: 'warning', hidden: row.status === 'done' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'done' }
  ]
}

function handleRowAction(action: string, row: EquipmentCheckRecord) {
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

  await saveEquipmentCheck({
    id: formModel.value.id,
    code: formModel.value.code,
    equipment_code: formModel.value.equipment_code,
    check_type: formModel.value.check_type as EquipmentCheckRecord['check_type'],
    plan_date: formModel.value.plan_date,
    executor: formModel.value.executor,
    status: formModel.value.status as EquipmentCheckRecord['status']
  })

  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '点检计划已新增' : '点检计划已更新')
  await refresh()
}

function execute(row: EquipmentCheckRecord) {
  execPlanId.value = row.id
  execForm.value = { remark: '' }
  execItems.value = eamDefaultCheckExecuteItems.map((item) => ({ ...item }))
  execVisible.value = true
}

async function confirmExec() {
  await executeEquipmentCheck(execPlanId.value, { remark: execForm.value.remark })
  execVisible.value = false
  ElMessage.success('点检已执行完成')
  await refresh()
}
</script>

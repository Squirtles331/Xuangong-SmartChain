<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="设备台账"
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
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #runtime_hours="{ row }"> {{ Number(row.runtime_hours ?? 0).toLocaleString('zh-CN') }} h </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <EquipmentFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :workshop-options="workshopOptions"
        :status-options="statusSelectOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  createEquipment,
  deleteEquipment,
  eamEquipmentStatusOptions,
  eamWorkshopOptions,
  getEquipmentList,
  updateEquipment,
  type EquipmentAssetQuery,
  type EquipmentAssetRecord
} from '@/static/services/eam'
import EquipmentFormDialog, { type EquipmentFormModel } from './EquipmentFormDialog.vue'

defineOptions({
  name: 'EamAssetPage'
})

const router = useRouter()
const workshopOptions = [...eamWorkshopOptions]
const statusOptions = [...eamEquipmentStatusOptions]
const statusSelectOptions = statusOptions.map((item) => ({ label: item.label, value: item.value }))

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '设备关键字', field: 'keyword', props: { clearable: true, placeholder: '设备编码 / 设备名称 / 型号 / 产线' } as never },
  {
    type: 'select-v2',
    label: '所属车间',
    field: 'workshop',
    props: { clearable: true, options: workshopOptions } as never
  },
  {
    type: 'select-v2',
    label: '设备状态',
    field: 'status',
    props: { clearable: true, options: statusSelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentAssetRecord>[] = [
  { prop: 'code', label: '设备编码', minWidth: 140 },
  { prop: 'name', label: '设备名称', minWidth: 160 },
  { prop: 'model', label: '型号', minWidth: 120 },
  { prop: 'workshop', label: '所属车间', minWidth: 140 },
  { prop: 'line', label: '产线/单元', minWidth: 140 },
  { prop: 'owner', label: '责任人', minWidth: 110 },
  { label: '设备状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '累计工时', minWidth: 110, align: 'right', slotName: 'runtime_hours' },
  { prop: 'next_maintain_date', label: '下次保养', minWidth: 120, align: 'center' },
  { label: '操作', minWidth: 240, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  workshop: string
  status: '' | EquipmentAssetRecord['status']
}>({
  keyword: '',
  workshop: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<EquipmentFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EquipmentAssetRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentAssetQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      workshop: queryParams.workshop || undefined,
      status: queryParams.status || undefined
    }
    const response = await getEquipmentList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipment(id)))
})

function createDefaultFormModel(): EquipmentFormModel {
  return {
    id: '',
    code: '',
    name: '',
    model: '',
    workshop: workshopOptions[0]?.value || '',
    status: 'running',
    purchase_date: '',
    commission_date: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    workshop: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentAssetRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    model: row.model,
    workshop: row.workshop,
    status: row.status,
    purchase_date: row.purchase_date || '',
    commission_date: row.commission_date || ''
  }
  dialogVisible.value = true
}

function getRowActions(row: EquipmentAssetRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'check', label: '点检', tone: 'primary' },
    { key: 'maintain', label: '保养', tone: 'warning' },
    { key: 'repair', label: '报修', tone: 'warning', hidden: row.status === 'repair' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'repair' }
  ]
}

function handleRowAction(action: string, row: EquipmentAssetRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'check') {
    router.push({ name: 'equipmentCheck' })
    return
  }

  if (action === 'maintain') {
    router.push({ name: 'equipmentMaintain' })
    return
  }

  if (action === 'repair') {
    router.push({ name: 'equipmentRepair' })
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.workshop) {
    ElMessage.warning('请填写设备编码、设备名称和所属车间')
    return
  }

  const payload: Partial<EquipmentAssetRecord> = {
    code: formModel.value.code,
    name: formModel.value.name,
    model: formModel.value.model,
    workshop: formModel.value.workshop,
    status: formModel.value.status as EquipmentAssetRecord['status'],
    purchase_date: formModel.value.purchase_date,
    commission_date: formModel.value.commission_date
  }

  if (dialogMode.value === 'add') {
    await createEquipment(payload)
    ElMessage.success('设备资产已新增')
  } else {
    await updateEquipment(formModel.value.id, payload)
    ElMessage.success('设备资产已更新')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

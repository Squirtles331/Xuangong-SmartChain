<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="委外工单"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #dueDate="{ row }">
      <span :style="isOverdue(row) ? 'color: #f56c6c; font-weight: 600' : ''">
        {{ row.due_date }}
        <el-tag v-if="isOverdue(row)" type="danger" size="small" style="margin-left: 4px">逾期</el-tag>
      </span>
    </template>

    <template #status="{ row }">
      <el-tag :type="statusTagMap[row.status]">{{ statusLabelMap[row.status] }}</el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <OutsourceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import {
  createOutsourceOrder,
  getOutsourceOrders,
  updateOutsourceOrder,
  updateOutsourceOrderStatus,
  type OutsourceOrder,
  type OutsourceOrderQuery
} from '@/api/work-order'
import { useTable } from '@/hooks/useTable'
import OutsourceFormDialog, { type OutsourceFormModel } from './OutsourceFormDialog.vue'

const statusOptions = [
  { label: '已发出', value: 'sent' },
  { label: '加工中', value: 'processing' },
  { label: '已收回', value: 'received' },
  { label: '已结算', value: 'settled' }
]

const statusLabelMap: Record<OutsourceOrder['status'], string> = {
  sent: '已发出',
  processing: '加工中',
  received: '已收回',
  settled: '已结算'
}

const statusTagMap: Record<OutsourceOrder['status'], 'warning' | 'primary' | 'success' | 'info'> = {
  sent: 'warning',
  processing: 'primary',
  received: 'success',
  settled: 'info'
}

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { placeholder: '工单号、产品、供应商、工序', clearable: true } as any
  },
  { type: 'select-v2', label: '状态', field: 'status', props: { options: statusOptions, clearable: true } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<OutsourceOrder>[] = [
  { prop: 'code', label: '工单号', minWidth: 170 },
  { prop: 'material', label: '产品', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
  { prop: 'supplier', label: '委外供应商', minWidth: 160 },
  { prop: 'operation', label: '委外工序', minWidth: 140 },
  { prop: 'send_date', label: '发出日期', minWidth: 100 },
  { label: '交回日期', minWidth: 120, slotName: 'dueDate' },
  { prop: 'price', label: '加工费(元)', minWidth: 110, align: 'right' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  status: '' | OutsourceOrder['status']
}>({
  keyword: '',
  status: ''
})

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<OutsourceFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<OutsourceOrder>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: OutsourceOrderQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: queryParams.status || undefined
    }

    const response = await getOutsourceOrders(params)
    return response.data
  }
})

function createDefaultFormModel(): OutsourceFormModel {
  return {
    id: '',
    code: '',
    material: '',
    qty: 1,
    supplier: '',
    operation: '',
    send_date: '',
    due_date: '',
    price: 0,
    status: 'sent'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    handleExport()
  }
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: OutsourceOrder) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function getRowActions(row: OutsourceOrder): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'send', label: '确认发出', tone: 'secondary', hidden: row.status !== 'sent' },
    { key: 'receive', label: '确认收回', tone: 'success', hidden: row.status !== 'processing' }
  ]
}

function handleRowAction(action: string, row: OutsourceOrder) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'send') {
    confirmSend(row)
    return
  }

  if (action === 'receive') {
    confirmReceive(row)
  }
}

async function submitDialog() {
  const payload: Partial<OutsourceOrder> = {
    id: formModel.value.id,
    code: formModel.value.code,
    material: formModel.value.material,
    qty: formModel.value.qty,
    supplier: formModel.value.supplier,
    operation: formModel.value.operation,
    send_date: formModel.value.send_date,
    due_date: formModel.value.due_date,
    price: formModel.value.price,
    status: formModel.value.status as OutsourceOrder['status']
  }
  if (dialogMode.value === 'add') {
    await createOutsourceOrder(payload)
  } else {
    await updateOutsourceOrder(formModel.value.id, payload)
  }
  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function confirmSend(row: OutsourceOrder) {
  await updateOutsourceOrderStatus(row.id, 'processing')
  ElMessage.success('已确认发出')
  await refresh()
}

async function confirmReceive(row: OutsourceOrder) {
  await updateOutsourceOrderStatus(row.id, 'received')
  ElMessage.success('已确认收回')
  await refresh()
}

function isOverdue(row: OutsourceOrder): boolean {
  if (row.status === 'received' || row.status === 'settled') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(row.due_date) < today
}
</script>

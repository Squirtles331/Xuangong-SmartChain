<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="发货单列表"
    :search-columns="searchColumns"
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
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="deliveryStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <DeliveryFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getDeliveryList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import DeliveryFormDialog, { type DeliveryFormModel } from './DeliveryFormDialog.vue'

const deliveryStatusOptions = [
  { value: 'pending', label: '待发货', type: 'warning' as const },
  { value: 'completed', label: '已发货', type: 'success' as const }
]

interface DeliveryRow {
  id: string
  code: string
  orderCode: string
  customer: string
  material: string
  qty: number
  status: string
  createdAt: string
}

const queryParams = ref({
  code: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: deliveryStatusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<DeliveryRow>[] = [
  { prop: 'code', label: '发货单号', width: 160 },
  { prop: 'orderCode', label: '销售订单号', width: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { prop: 'material', label: '产品名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<DeliveryRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getDeliveryList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  }
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<DeliveryFormModel>(createDefaultForm())

function mapRow(item: any): DeliveryRow {
  return {
    id: String(item.id),
    code: item.code || '',
    orderCode: item.order_code || '',
    customer: item.customer || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    status: item.status || '',
    createdAt: item.created_at || ''
  }
}

function handleReset() {
  queryParams.value = {
    code: '',
    status: ''
  }
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

function createDefaultForm(): DeliveryFormModel {
  return {
    id: '',
    code: '',
    orderCode: '',
    customer: '',
    material: '',
    qty: 1,
    status: 'pending'
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: DeliveryRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    orderCode: row.orderCode,
    customer: row.customer,
    material: row.material,
    qty: row.qty,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: DeliveryRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    remove(row)
  }
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function remove(row: DeliveryRow) {
  onDelete(row)
}
</script>

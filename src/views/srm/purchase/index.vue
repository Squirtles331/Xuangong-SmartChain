<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="采购订单"
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
    <template #response_status="{ row }">
      <StatusTag :value="row.response_status" :options="responseStatusOptions" />
    </template>

    <template #progress="{ row }">
      <div class="progress-cell">
        <el-progress :percentage="row.qty > 0 ? Math.round((row.received / row.qty) * 100) : 0" :stroke-width="6" />
        <span class="progress-text">{{ row.received }}/{{ row.qty }}</span>
      </div>
    </template>

    <template #delivery="{ row }">
      <div class="delivery-cell">
        <span :class="{ overdue: isOverdue(row) }">{{ row.delivery }}</span>
        <el-tag v-if="isOverdue(row)" type="danger" size="small">已逾期</el-tag>
      </div>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PurchaseFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
      <PurchaseReceiveDialog v-model:visible="receiveVisible" v-model:form="receiveForm" :current-order="currentOrder" @submit="confirmReceive" />
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
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderList,
  updatePurchaseOrder,
  type PurchaseOrderQuery,
  type PurchaseOrderRecord
} from '@/static/services/srm'
import PurchaseFormDialog, { type PurchaseFormModel } from './PurchaseFormDialog.vue'
import PurchaseReceiveDialog, { type PurchaseReceiveFormModel } from './PurchaseReceiveDialog.vue'

defineOptions({
  name: 'SrmPurchaseOrderPage'
})

const responseStatusOptions = [
  { value: 'pending', label: '待响应', type: 'warning' as const },
  { value: 'confirmed', label: '已确认', type: 'success' as const },
  { value: 'delayed', label: '延期', type: 'danger' as const }
]

const statusOptions = [
  { value: 'sent', label: '已下发', type: 'warning' as const },
  { value: 'partial', label: '部分收货', type: 'primary' as const },
  { value: 'received', label: '已收齐', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code', props: { clearable: true, placeholder: '订单编号 / 申请编号 / 来源单号 / 物料' } as never },
  { type: 'input', label: '供应商', field: 'supplier', props: { clearable: true } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { clearable: true, options: statusOptions.map((item) => ({ label: item.label, value: item.value })) } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseOrderRecord>[] = [
  { prop: 'code', label: '订单编号', minWidth: 150 },
  { prop: 'request_code', label: '申请编号', minWidth: 140 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'material', label: '采购物料', minWidth: 160 },
  { prop: 'source_code', label: '来源单号', minWidth: 160 },
  { label: '供应商响应', minWidth: 100, slotName: 'response_status', align: 'center' },
  { label: '收货进度', minWidth: 180, slotName: 'progress' },
  { label: '交付承诺', minWidth: 150, slotName: 'delivery' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  code: string
  supplier: string
  status: '' | PurchaseOrderRecord['status']
}>({
  code: '',
  supplier: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<PurchaseFormModel>(createDefaultFormModel())
const currentOrder = ref<PurchaseOrderRecord | null>(null)
const receiveVisible = ref(false)
const receiveForm = ref<PurchaseReceiveFormModel>({ qty: 1, lot: '' })

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseOrderRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      supplier: queryParams.supplier || undefined,
      status: queryParams.status || undefined
    }
    const response = await getPurchaseOrderList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePurchaseOrder(id)))
})

function createDefaultFormModel(): PurchaseFormModel {
  return {
    id: '',
    code: '',
    supplier: '',
    material: '',
    qty: 1,
    received: 0,
    delivery: '',
    status: 'sent'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    supplier: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PurchaseOrderRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    supplier: row.supplier,
    material: row.material,
    qty: row.qty,
    received: row.received,
    delivery: row.delivery,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: PurchaseOrderRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'receive', label: '收货关联', tone: 'primary', hidden: row.status === 'received' || row.status === 'closed' },
    { key: 'close', label: '关闭协同', tone: 'warning', hidden: row.status !== 'sent' && row.status !== 'partial' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status !== 'closed' }
  ]
}

function handleRowAction(action: string, row: PurchaseOrderRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'receive') {
    openReceive(row)
    return
  }

  if (action === 'close') {
    void closeOrder(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.supplier || !formModel.value.material) {
    ElMessage.warning('请填写订单编号、供应商和采购物料')
    return
  }

  const qty = Number(formModel.value.qty || 0)
  const received = Number(formModel.value.received || 0)
  const remain = Math.max(qty - received, 0)
  const status = formModel.value.status === 'closed' ? 'closed' : remain === 0 ? 'received' : received > 0 ? 'partial' : 'sent'

  const payload: Partial<PurchaseOrderRecord> = {
    code: formModel.value.code,
    supplier: formModel.value.supplier,
    material: formModel.value.material,
    qty,
    received,
    remain,
    delivery: formModel.value.delivery,
    status,
    response_status: status === 'sent' ? 'pending' : 'confirmed'
  }

  if (dialogMode.value === 'add') {
    await createPurchaseOrder(payload)
    ElMessage.success('采购订单已新增')
  } else {
    await updatePurchaseOrder(formModel.value.id, payload)
    ElMessage.success('采购订单已更新')
  }

  dialogVisible.value = false
  await refresh()
}

function openReceive(row: PurchaseOrderRecord) {
  currentOrder.value = row
  receiveForm.value = {
    qty: row.remain > 0 ? row.remain : 1,
    lot: ''
  }
  receiveVisible.value = true
}

async function confirmReceive() {
  if (!currentOrder.value) return

  if (receiveForm.value.qty <= 0 || receiveForm.value.qty > currentOrder.value.remain) {
    ElMessage.warning('收货数量不合法')
    return
  }

  const received = currentOrder.value.received + receiveForm.value.qty
  const remain = currentOrder.value.qty - received
  const status = remain === 0 ? 'received' : 'partial'

  await updatePurchaseOrder(currentOrder.value.id, {
    received,
    remain,
    status,
    response_status: 'confirmed'
  })

  receiveVisible.value = false
  ElMessage.success('收货关联已更新')
  await refresh()
}

async function closeOrder(row: PurchaseOrderRecord) {
  await updatePurchaseOrder(row.id, { status: 'closed' })
  ElMessage.success('采购协同已关闭')
  await refresh()
}

function isOverdue(row: PurchaseOrderRecord) {
  if (row.status === 'received' || row.status === 'closed') return false
  return new Date(row.delivery).getTime() < Date.now()
}
</script>

<style scoped>
.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.delivery-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.overdue {
  color: var(--el-color-danger);
  font-weight: 600;
}
</style>

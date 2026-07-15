<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="销售订单"
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
    <template #amount="{ row }">
      {{ Number(row?.amount ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #progress="{ row }">
      <div class="progress-cell">
        <el-progress :percentage="row.qty > 0 ? Math.round((row.delivered_qty / row.qty) * 100) : 0" :stroke-width="6" />
        <span class="progress-text">{{ row.delivered_qty }}/{{ row.qty }}</span>
      </div>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <OrderFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :customer-options="customerOptions"
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
  createSalesOrder,
  crmCustomerOptions,
  deleteSalesOrder,
  getSalesOrderList,
  updateSalesOrder,
  type SalesOrderQuery,
  type SalesOrderRecord
} from '@/static/services/crm'
import OrderFormDialog, { type OrderFormModel } from './OrderFormDialog.vue'

defineOptions({
  name: 'CrmSalesOrderPage'
})

const router = useRouter()
const customerOptions = [...crmCustomerOptions]

const statusOptions = [
  { value: 'confirmed', label: '已确认', type: 'info' as const },
  { value: 'coordinating', label: '承接协同中', type: 'primary' as const },
  { value: 'delivering', label: '发运推进中', type: 'warning' as const },
  { value: 'completed', label: '协同完成', type: 'success' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单关键字', field: 'code', props: { clearable: true, placeholder: '订单号 / 产品 / 合同 / ERP 承接单' } as never },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customerCode',
    props: { clearable: true, options: customerOptions } as never
  },
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

const columns: TableColumnItem<SalesOrderRecord>[] = [
  { prop: 'code', label: '订单编号', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'product_name', label: '产品名称', minWidth: 160 },
  { prop: 'source_contract_code', label: '关联合同', minWidth: 150 },
  { prop: 'erp_order_code', label: 'ERP 承接单', minWidth: 150 },
  { prop: 'promised_date', label: '承诺交期', minWidth: 120, align: 'center' },
  { label: '订单金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { label: '发运进度', minWidth: 180, slotName: 'progress' },
  { label: '状态', minWidth: 110, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  code: string
  customerCode: string
  status: '' | SalesOrderRecord['status']
}>({
  code: '',
  customerCode: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<OrderFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SalesOrderRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SalesOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      customerCode: queryParams.customerCode || undefined,
      status: queryParams.status || undefined
    }
    const response = await getSalesOrderList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSalesOrder(id)))
})

function createDefaultFormModel(): OrderFormModel {
  return {
    id: '',
    code: '',
    customer_code: customerOptions[0]?.value || '',
    product_name: '',
    qty: 1,
    delivered_qty: 0,
    amount: 0,
    promised_date: '',
    source_contract_code: '',
    status: 'confirmed'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    customerCode: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SalesOrderRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    customer_code: row.customer_code,
    product_name: row.product_name,
    qty: row.qty,
    delivered_qty: row.delivered_qty,
    amount: row.amount,
    promised_date: row.promised_date,
    source_contract_code: row.source_contract_code,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: SalesOrderRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'change', label: '订单变更', tone: 'primary', hidden: row.status === 'completed' },
    { key: 'carry', label: '同步承接', tone: 'primary', hidden: row.status !== 'confirmed' },
    { key: 'deliver', label: '推进发运', tone: 'warning', hidden: row.status === 'completed' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status !== 'confirmed' }
  ]
}

function handleRowAction(action: string, row: SalesOrderRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'carry') {
    void syncCarry(row)
    return
  }

  if (action === 'change') {
    router.push(`/customer-business/crm/order-change?id=${row.id}`)
    return
  }

  if (action === 'deliver') {
    void pushDelivery(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer_code || !formModel.value.product_name) {
    ElMessage.warning('请填写订单编号、客户和产品名称')
    return
  }

  const payload: Partial<SalesOrderRecord> = {
    code: formModel.value.code,
    customer_code: formModel.value.customer_code,
    product_name: formModel.value.product_name,
    qty: Number(formModel.value.qty || 0),
    delivered_qty: Number(formModel.value.delivered_qty || 0),
    amount: Number(formModel.value.amount || 0),
    promised_date: formModel.value.promised_date,
    source_contract_code: formModel.value.source_contract_code,
    status: formModel.value.status
  }

  if (dialogMode.value === 'add') {
    await createSalesOrder(payload)
    ElMessage.success('销售订单已新增')
  } else {
    await updateSalesOrder(formModel.value.id, payload)
    ElMessage.success('销售订单已更新')
  }

  dialogVisible.value = false
  await refresh()
}

async function syncCarry(row: SalesOrderRecord) {
  await updateSalesOrder(row.id, { status: 'coordinating' })
  ElMessage.success('已同步为 ERP 承接协同中')
  await refresh()
}

async function pushDelivery(row: SalesOrderRecord) {
  const nextDelivered = row.delivered_qty === 0 ? Math.min(Math.ceil(row.qty / 2), row.qty) : row.qty
  await updateSalesOrder(row.id, {
    delivered_qty: nextDelivered,
    status: nextDelivered >= row.qty ? 'completed' : 'delivering'
  })
  ElMessage.success(nextDelivered >= row.qty ? '销售订单协同已完成' : '销售订单已推进到发运中')
  await refresh()
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
</style>

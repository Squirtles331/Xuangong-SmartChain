<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="应收"
    add-text="登记回款"
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
    @add="openReceipt()"
  >
    <template #amount="{ row }">
      {{ Number(row?.amount ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #settled="{ row }">
      {{ Number(row?.settled ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #balance="{ row }">
      {{ Number(row?.balance ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #aging="{ row }">
      <el-tag v-if="row.aging <= 0" type="success">未到期</el-tag>
      <el-tag v-else-if="row.aging <= 30" type="warning">逾期 {{ row.aging }} 天</el-tag>
      <el-tag v-else type="danger">逾期 {{ row.aging }} 天</el-tag>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ReceiptDialog v-model:visible="receiptVisible" v-model:form="receiptForm" :customer-options="customerOptions" @submit="submitReceipt" />
      <ReceivableSettleDialog
        v-model:visible="settleVisible"
        v-model:rows="settleList"
        v-model:selected-rows="selectedSettle"
        v-model:amount-map="settleAmountMap"
        :receipt-amount="currentReceipt?.unallocated_amount || 0"
        @submit="submitSettle"
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
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  createReceiptRecord,
  crmCustomerOptions,
  getReceivableList,
  settleReceivables,
  type ReceiptMethod,
  type ReceiptRecord,
  type ReceivableQuery,
  type ReceivableRecord
} from '@/static/services/crm'
import ReceiptDialog, { type ReceiptFormModel } from './ReceiptDialog.vue'
import ReceivableSettleDialog from './ReceivableSettleDialog.vue'

defineOptions({
  name: 'CrmReceivablePage'
})

const customerOptions = [...crmCustomerOptions]

const statusOptions = [
  { value: 'pending', label: '待跟进', type: 'info' as const },
  { value: 'partial', label: '部分核销', type: 'warning' as const },
  { value: 'overdue', label: '逾期未回款', type: 'danger' as const },
  { value: 'settled', label: '已结清', type: 'success' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'code', props: { clearable: true, placeholder: '应收单号 / 合同 / 订单 / 客户' } as never },
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
  },
  {
    type: 'select-v2',
    label: '账龄',
    field: 'agingRange',
    props: {
      clearable: true,
      options: [
        { label: '未到期', value: '0' },
        { label: '逾期 1-30 天', value: '1' },
        { label: '逾期 31-60 天', value: '2' },
        { label: '逾期 61-90 天', value: '3' },
        { label: '逾期 90 天以上', value: '4' }
      ]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ReceivableRecord>[] = [
  { prop: 'code', label: '应收单号', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'contract_code', label: '关联合同', minWidth: 150 },
  { prop: 'source_order_code', label: '来源订单', minWidth: 150 },
  { label: '应收金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { label: '已核销', minWidth: 120, align: 'right', slotName: 'settled' },
  { label: '余额', minWidth: 120, align: 'right', slotName: 'balance' },
  { prop: 'due_date', label: '到期日期', minWidth: 120, align: 'center' },
  { label: '账龄', minWidth: 120, align: 'center', slotName: 'aging' },
  { prop: 'last_follow_up', label: '最近跟进', minWidth: 220 },
  { label: '状态', minWidth: 110, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 120, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  code: string
  customerCode: string
  status: '' | ReceivableRecord['status']
  agingRange: '' | ReceivableQuery['agingRange']
}>({
  code: '',
  customerCode: '',
  status: '',
  agingRange: ''
})

const receiptVisible = ref(false)
const settleVisible = ref(false)
const settleList = ref<ReceivableRecord[]>([])
const selectedSettle = ref<ReceivableRecord[]>([])
const currentReceipt = ref<ReceiptRecord | null>(null)
const settleAmountMap = reactive<Record<string, number>>({})

const receiptForm = ref<ReceiptFormModel>(createDefaultReceiptForm())

const { tableData, pagination, loading, search, refresh } = useTable<ReceivableRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ReceivableQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      customerCode: queryParams.customerCode || undefined,
      status: queryParams.status || undefined,
      agingRange: queryParams.agingRange || undefined
    }
    const response = await getReceivableList(params)
    return response.data
  }
})

function createDefaultReceiptForm(customerCode?: string): ReceiptFormModel {
  return {
    customer: customerCode || customerOptions[0]?.value || '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    method: 'bank'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    customerCode: '',
    status: '',
    agingRange: ''
  })
  search()
}

function getRowActions(row: ReceivableRecord): CrudRowActionItem[] {
  return [{ key: 'receipt', label: '登记回款', tone: 'primary', hidden: row.balance <= 0 }]
}

function handleRowAction(action: string, row: ReceivableRecord) {
  if (action === 'receipt') {
    openReceipt(row.customer_code)
  }
}

function openReceipt(customerCode?: string) {
  receiptForm.value = createDefaultReceiptForm(customerCode)
  receiptVisible.value = true
}

async function submitReceipt() {
  if (!receiptForm.value.customer || receiptForm.value.amount <= 0) {
    ElMessage.warning('请填写客户和回款金额')
    return
  }

  const response = await createReceiptRecord({
    customer_code: receiptForm.value.customer,
    amount: receiptForm.value.amount,
    date: receiptForm.value.date,
    method: receiptForm.value.method as ReceiptMethod
  })

  receiptVisible.value = false
  currentReceipt.value = response.data
  ElMessage.success('回款已登记，请继续完成核销')
  await openSettleByCustomer(receiptForm.value.customer)
}

async function openSettleByCustomer(customerCode: string) {
  const response = await getReceivableList({
    pageNum: 1,
    pageSize: 100,
    customerCode
  })

  settleList.value = response.data.list.filter((item) => item.balance > 0)
  selectedSettle.value = []
  Object.keys(settleAmountMap).forEach((key) => delete settleAmountMap[key])
  settleList.value.forEach((item) => {
    settleAmountMap[item.id] = 0
  })
  settleVisible.value = true
}

async function submitSettle() {
  if (!currentReceipt.value) {
    ElMessage.warning('请先登记回款')
    return
  }

  if (!selectedSettle.value.length) {
    ElMessage.warning('请选择需要核销的应收记录')
    return
  }

  const items = selectedSettle.value
    .map((item) => ({
      id: item.id,
      amount: Number(settleAmountMap[item.id] || 0)
    }))
    .filter((item) => item.amount > 0)

  if (!items.length) {
    ElMessage.warning('请输入核销金额')
    return
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0)
  if (total > currentReceipt.value.unallocated_amount) {
    ElMessage.warning('核销金额不能超过当前回款余额')
    return
  }

  await settleReceivables({
    receiptId: currentReceipt.value.id,
    items
  })

  settleVisible.value = false
  currentReceipt.value = null
  ElMessage.success('应收核销成功')
  await refresh()
}
</script>

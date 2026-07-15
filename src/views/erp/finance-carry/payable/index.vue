<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="应付管理"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @add="openAdd"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @toolbar-action="handleToolbarAction"
  >
    <template #amount="{ row }">
      {{ formatAmount(row.amount) }}
    </template>

    <template #paid="{ row }">
      {{ formatAmount(row.paid) }}
    </template>

    <template #balance="{ row }">
      {{ formatAmount(row.balance) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PayableFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import {
  createErpPayable,
  deleteErpPayable,
  getErpPayableList,
  updateErpPayable,
  type ErpPayableRecord,
  type PayableStatus
} from '@/static/services/erp'
import PayableFormDialog, { type FinancePayableFormModel } from './PayableFormDialog.vue'

const router = useRouter()

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'ledger', label: '查看总账', tone: 'success' },
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const statusOptions = [
  { value: 'open', label: '未付款', type: 'warning' as const },
  { value: 'paid', label: '已付款', type: 'success' as const },
  { value: 'partial', label: '部分付款', type: 'info' as const }
]

const queryParams = reactive<{
  code: string
  supplier: string
  status: '' | PayableStatus
}>({
  code: '',
  supplier: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '应付单号',
    field: 'code',
    props: { clearable: true } as any
  },
  {
    type: 'input',
    label: '供应商',
    field: 'supplier',
    props: { clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ErpPayableRecord>[] = [
  { prop: 'code', label: '应付单号', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'sourceVoucher', label: '来源单据', minWidth: 130 },
  { prop: 'amount', label: '应付金额', width: 130, align: 'right', slotName: 'amount' },
  { prop: 'paid', label: '已付金额', width: 130, align: 'right', slotName: 'paid' },
  { prop: 'balance', label: '未付余额', width: 130, align: 'right', slotName: 'balance' },
  { prop: 'dueDate', label: '到期日期', width: 120, align: 'center' },
  { label: '状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, align: 'center', slotName: 'actions', fixed: 'right' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<FinancePayableFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, handleDelete } = useTable<ErpPayableRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getErpPayableList({
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      supplier: queryParams.supplier || undefined,
      status: queryParams.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteErpPayable(id)))
})

function createDefaultFormModel(): FinancePayableFormModel {
  return {
    id: '',
    code: '',
    supplier: '',
    amount: 0,
    paid: 0,
    balance: 0,
    dueDate: '',
    status: 'open',
    sourceVoucher: ''
  }
}

function formatAmount(value?: number | null) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0

  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
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

function openEdit(row: ErpPayableRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.supplier || !formModel.value.sourceVoucher) {
    ElMessage.warning('请填写供应商和来源单据')
    return
  }

  formModel.value.balance = Math.max(formModel.value.amount - formModel.value.paid, 0)

  if (dialogMode.value === 'add') {
    await createErpPayable(formModel.value)
    ElMessage.success('应付单据已新增')
  } else {
    await updateErpPayable(formModel.value.id, formModel.value)
    ElMessage.success('应付单据已更新')
  }

  dialogVisible.value = false
  await refresh()
}

async function handleRowAction(action: string, row: ErpPayableRecord) {
  if (action === 'ledger') {
    router.push('/erp/finance-carry/ledger')
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    await handleDelete(() => deleteErpPayable(row.id), {
      title: '删除应付单据',
      content: '确认删除当前应付单据吗？',
      successTip: '应付单据已删除'
    })
  }
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('应付管理静态数据已导出')
  }
}
</script>

<style scoped></style>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="发票"
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

    <template #taxAmount="{ row }">
      {{ Number(row?.tax_amount ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #total="{ row }">
      {{ Number(row?.total ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <InvoiceFormDialog
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
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { crmCustomerOptions, getInvoiceList, issueInvoice, saveInvoice, type InvoiceQuery, type InvoiceRecord } from '@/static/services/crm'
import InvoiceFormDialog, { type InvoiceFormModel } from './InvoiceFormDialog.vue'

defineOptions({
  name: 'CrmInvoicePage'
})

const customerOptions = [...crmCustomerOptions]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'issued', label: '已开具', type: 'success' as const },
  { value: 'voided', label: '已作废', type: 'danger' as const },
  { value: 'red', label: '已红冲', type: 'warning' as const }
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '发票号 / 客户 / 订单号' } as never
  },
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
    props: {
      clearable: true,
      options: statusOptions.map((item) => ({
        label: item.label,
        value: item.value
      }))
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<InvoiceRecord>[] = [
  { prop: 'code', label: '发票号码', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'order_code', label: '来源订单', minWidth: 150 },
  { label: '不含税金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'tax_rate', label: '税率(%)', minWidth: 90, align: 'center' },
  { label: '税额', minWidth: 120, align: 'right', slotName: 'taxAmount' },
  { label: '价税合计', minWidth: 120, align: 'right', slotName: 'total' },
  { prop: 'issue_date', label: '开票日期', minWidth: 120, align: 'center' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  customerCode: string
  status: '' | InvoiceRecord['status']
}>({
  keyword: '',
  customerCode: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<InvoiceFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<InvoiceRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: InvoiceQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      customerCode: queryParams.customerCode || undefined,
      status: queryParams.status || undefined
    }
    const response = await getInvoiceList(params)
    return response.data
  }
})

function createDefaultFormModel(): InvoiceFormModel {
  return {
    id: '',
    code: '',
    customer_code: customerOptions[0]?.value || '',
    order_code: '',
    amount: 0,
    tax_rate: 13,
    tax_amount: 0,
    total: 0,
    issue_date: '',
    status: 'draft'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
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

function openEdit(row: InvoiceRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    customer_code: row.customer_code,
    order_code: row.order_code,
    amount: row.amount,
    tax_rate: row.tax_rate,
    tax_amount: row.tax_amount,
    total: row.total,
    issue_date: row.issue_date,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: InvoiceRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'issue', label: '开具', tone: 'success', hidden: row.status !== 'draft' },
    { key: 'void', label: '作废', tone: 'danger', hidden: row.status !== 'issued' },
    { key: 'red', label: '红冲', tone: 'warning', hidden: row.status !== 'issued' }
  ]
}

function handleRowAction(action: string, row: InvoiceRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'issue') {
    void handleIssue(row)
    return
  }

  if (action === 'void') {
    void updateStatus(row, 'voided', '发票协同单已作废')
    return
  }

  if (action === 'red') {
    void updateStatus(row, 'red', '发票协同单已红冲')
  }
}

async function updateStatus(row: InvoiceRecord, status: InvoiceRecord['status'], message: string) {
  await saveInvoice({ ...row, status })
  ElMessage.success(message)
  await refresh()
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer_code) {
    ElMessage.warning('请填写发票号码和客户')
    return
  }

  await saveInvoice({
    ...formModel.value,
    amount: Number(formModel.value.amount || 0),
    tax_rate: Number(formModel.value.tax_rate || 0)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '发票协同单已新增' : '发票协同单已更新')
  await refresh()
}

async function handleIssue(row: InvoiceRecord) {
  await issueInvoice(row.id)
  ElMessage.success('发票协同单已开具')
  await refresh()
}
</script>

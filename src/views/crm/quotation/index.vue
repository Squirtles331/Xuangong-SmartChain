<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="报价"
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
    <template #price="{ row }">
      {{ Number(row?.price ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #amount="{ row }">
      {{ Number(row?.amount ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <QuotationFormDialog
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
import {
  crmCustomerOptions,
  deleteQuotation,
  getQuotationList,
  saveQuotation,
  type QuotationQuery,
  type QuotationRecord
} from '@/static/services/crm'
import QuotationFormDialog, { type QuotationFormModel } from './QuotationFormDialog.vue'

defineOptions({
  name: 'CrmQuotationPage'
})

const customerOptions = [...crmCustomerOptions]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'sent', label: '已发送', type: 'primary' as const },
  { value: 'approved', label: '已中标', type: 'success' as const },
  { value: 'lost', label: '已丢单', type: 'danger' as const }
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '报价关键字',
    field: 'code',
    props: { clearable: true, placeholder: '报价单号 / 客户 / 产品 / 商机' } as never
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

const columns: TableColumnItem<QuotationRecord>[] = [
  { prop: 'code', label: '报价单号', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'opportunity_code', label: '来源商机', minWidth: 150 },
  { prop: 'product_name', label: '产品名称', minWidth: 180 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '单价', minWidth: 100, align: 'right', slotName: 'price' },
  { label: '总价', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'valid_date', label: '有效期', minWidth: 120, align: 'center' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 200, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  code: string
  customerCode: string
  status: '' | QuotationRecord['status']
}>({
  code: '',
  customerCode: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<QuotationFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<QuotationRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: QuotationQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      customerCode: queryParams.customerCode || undefined,
      status: queryParams.status || undefined
    }
    const response = await getQuotationList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteQuotation(id)))
})

function createDefaultFormModel(): QuotationFormModel {
  return {
    id: '',
    code: '',
    customer_code: customerOptions[0]?.value || '',
    opportunity_code: '',
    product_name: '',
    qty: 1,
    price: 0,
    amount: 0,
    valid_date: '',
    status: 'draft'
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

function openEdit(row: QuotationRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    customer_code: row.customer_code,
    opportunity_code: row.opportunity_code,
    product_name: row.product_name,
    qty: row.qty,
    price: row.price,
    amount: row.amount,
    valid_date: row.valid_date,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: QuotationRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'send', label: '发送', tone: 'primary', hidden: row.status !== 'draft' },
    { key: 'approve', label: '中标', tone: 'success', hidden: row.status === 'approved' || row.status === 'lost' },
    { key: 'lose', label: '丢单', tone: 'warning', hidden: row.status === 'approved' || row.status === 'lost' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'approved' }
  ]
}

function handleRowAction(action: string, row: QuotationRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'send') {
    void updateStatus(row, 'sent', '报价单已发送')
    return
  }

  if (action === 'approve') {
    void updateStatus(row, 'approved', '报价单已标记为中标')
    return
  }

  if (action === 'lose') {
    void updateStatus(row, 'lost', '报价单已标记为丢单')
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function updateStatus(row: QuotationRecord, status: QuotationRecord['status'], message: string) {
  await saveQuotation({ ...row, status })
  ElMessage.success(message)
  await refresh()
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer_code || !formModel.value.product_name) {
    ElMessage.warning('请填写报价单号、客户和产品名称')
    return
  }

  await saveQuotation({
    ...formModel.value,
    qty: Number(formModel.value.qty || 0),
    price: Number(formModel.value.price || 0),
    amount: Number(formModel.value.qty || 0) * Number(formModel.value.price || 0)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '报价单已新增' : '报价单已更新')
  await refresh()
}
</script>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="合同"
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

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ContractFormDialog
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
import { crmCustomerOptions, deleteContract, getContractList, saveContract, type ContractQuery, type ContractRecord } from '@/static/services/crm'
import ContractFormDialog, { type ContractFormModel } from './ContractFormDialog.vue'

defineOptions({
  name: 'CrmContractPage'
})

const customerOptions = [...crmCustomerOptions]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'active', label: '生效中', type: 'success' as const },
  { value: 'expiring', label: '临近到期', type: 'warning' as const },
  { value: 'closed', label: '已关闭', type: 'danger' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { clearable: true, placeholder: '合同号 / 客户 / 订单 / 付款条款' } as never },
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

const columns: TableColumnItem<ContractRecord>[] = [
  { prop: 'code', label: '合同编号', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'order_code', label: '关联订单', minWidth: 150 },
  { label: '合同金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'payment_terms', label: '付款条款', minWidth: 150 },
  { prop: 'sign_date', label: '签订日期', minWidth: 120, align: 'center' },
  { prop: 'end_date', label: '到期日期', minWidth: 120, align: 'center' },
  { label: '状态', minWidth: 110, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 190, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  customerCode: string
  status: '' | ContractRecord['status']
}>({
  keyword: '',
  customerCode: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<ContractFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ContractRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ContractQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      customerCode: queryParams.customerCode || undefined,
      status: queryParams.status || undefined
    }
    const response = await getContractList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteContract(id)))
})

function createDefaultFormModel(): ContractFormModel {
  return {
    id: '',
    code: '',
    customer_code: customerOptions[0]?.value || '',
    order_code: '',
    amount: 0,
    payment_terms: '月结 30 天',
    sign_date: '',
    start_date: '',
    end_date: '',
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

function openEdit(row: ContractRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    customer_code: row.customer_code,
    order_code: row.order_code,
    amount: row.amount,
    payment_terms: row.payment_terms,
    sign_date: row.sign_date,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: ContractRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'activate', label: '生效', tone: 'success', hidden: row.status !== 'draft' },
    { key: 'close', label: '关闭', tone: 'warning', hidden: row.status === 'closed' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'active' }
  ]
}

function handleRowAction(action: string, row: ContractRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'activate') {
    void updateContractStatus(row, 'active', '合同已生效')
    return
  }

  if (action === 'close') {
    void updateContractStatus(row, 'closed', '合同协同已关闭')
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function updateContractStatus(row: ContractRecord, status: ContractRecord['status'], message: string) {
  await saveContract({ ...row, status })
  ElMessage.success(message)
  await refresh()
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer_code) {
    ElMessage.warning('请填写合同编号和客户')
    return
  }

  await saveContract({
    ...formModel.value,
    amount: Number(formModel.value.amount || 0)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '合同已新增' : '合同已更新')
  await refresh()
}
</script>

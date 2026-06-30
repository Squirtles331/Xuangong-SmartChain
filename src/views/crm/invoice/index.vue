<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="发票列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #amount="{ row }">
            {{ row.amount.toLocaleString('zh-CN') }}
          </template>

          <template #taxAmount="{ row }">
            {{ row.tax_amount.toLocaleString('zh-CN') }}
          </template>

          <template #total="{ row }">
            {{ row.total.toLocaleString('zh-CN') }}
          </template>

          <template #status="{ row }">
            <el-tag :type="statusTagType[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button v-if="row.status === 'draft'" type="success" link size="small" @click="handleIssue(row)">开具</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <InvoiceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getInvoiceList, issueInvoice, saveInvoice, type Invoice, type InvoiceQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import InvoiceFormDialog, { type InvoiceFormModel } from './InvoiceFormDialog.vue'

const statusTextMap: Record<Invoice['status'], string> = {
  draft: '草稿',
  issued: '已开具',
  voided: '已作废',
  red: '已红冲'
}

const statusTagType: Record<Invoice['status'], '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  draft: 'info',
  issued: 'success',
  voided: 'danger',
  red: 'warning'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '已开具', value: 'issued' },
        { label: '已作废', value: 'voided' },
        { label: '已红冲', value: 'red' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Invoice>[] = [
  { prop: 'code', label: '发票号码', minWidth: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { prop: 'order_code', label: '销售订单', minWidth: 160 },
  { label: '不含税金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
  { prop: 'tax_rate', label: '税率(%)', minWidth: 90, align: 'center' },
  { label: '税额(元)', minWidth: 120, align: 'right', slotName: 'taxAmount' },
  { label: '价税合计(元)', minWidth: 130, align: 'right', slotName: 'total' },
  { prop: 'issue_date', label: '开票日期', minWidth: 120 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 140, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<InvoiceFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<Invoice>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: InvoiceQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: (queryParams.status || undefined) as Invoice['status'] | undefined
    }
    const response = await getInvoiceList(params)
    return response.data
  }
})

function createDefaultFormModel(): InvoiceFormModel {
  return {
    id: '',
    code: '',
    customer: '',
    order_code: '',
    amount: 0,
    tax_rate: 13,
    tax_amount: 0,
    total: 0,
    issue_date: '',
    status: 'draft'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Invoice) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer) {
    ElMessage.warning('请填写发票号码和客户名称')
    return
  }

  formModel.value.tax_amount = Math.round(((formModel.value.amount * formModel.value.tax_rate) / 100) * 100) / 100
  formModel.value.total = Math.round((formModel.value.amount + formModel.value.tax_amount) * 100) / 100
  await saveInvoice({
    ...formModel.value,
    status: formModel.value.status as Invoice['status']
  })
  dialogVisible.value = false
  await refresh()
}

async function handleIssue(row: Invoice) {
  await issueInvoice(row.id)
  ElMessage.success('发票已开具')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

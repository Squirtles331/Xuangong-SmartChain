<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="sf"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
    >
      <template #status="{ row }">
        <el-tag
          :type="row.status === 'issued' ? 'success' : row.status === 'draft' ? 'warning' : row.status === 'voided' ? 'danger' : 'info'"
          size="small"
        >
          {{ row.status === 'issued' ? '已开具' : row.status === 'draft' ? '草稿' : row.status === 'voided' ? '已作废' : '已红冲' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="issue(row)">开具</el-button>
      </template>
    </gi-table>

    <InvoiceFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import InvoiceFormDialog, { type InvoiceFormModel } from './InvoiceFormDialog.vue'

interface InvoiceRow {
  id: string
  code: string
  customer: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  status: string
}

const localData = ref<InvoiceRow[]>([
  {
    id: '1',
    code: 'INV20250115001',
    customer: 'XX重工集团',
    order_code: 'SO202501150001',
    amount: 230000,
    tax_rate: 13,
    tax_amount: 29900,
    total: 259900,
    issue_date: '2025-01-15',
    status: 'issued'
  },
  {
    id: '2',
    code: 'INV20250110002',
    customer: 'YY机械设备',
    order_code: 'SO202501100002',
    amount: 180000,
    tax_rate: 13,
    tax_amount: 23400,
    total: 203400,
    issue_date: '2025-01-10',
    status: 'issued'
  },
  {
    id: '3',
    code: 'INV20250116003',
    customer: 'AA精密制造',
    order_code: '',
    amount: 80000,
    tax_rate: 13,
    tax_amount: 10400,
    total: 90400,
    issue_date: '',
    status: 'draft'
  }
])

const sf = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<InvoiceFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已开具', value: 'issued' },
        { label: '草稿', value: 'draft' },
        { label: '已作废', value: 'voided' },
        { label: '已红冲', value: 'red' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<InvoiceRow>[] = [
  { prop: 'code', label: '发票号码', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'order_code', label: '销售订单', minWidth: 170 },
  { prop: 'amount', label: '不含税金额', minWidth: 120, align: 'right' },
  { prop: 'tax_rate', label: '税率(%)', minWidth: 80, align: 'center' },
  { prop: 'tax_amount', label: '税额', minWidth: 100, align: 'right' },
  { prop: 'total', label: '价税合计', minWidth: 120, align: 'right' },
  { prop: 'issue_date', label: '开票日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<InvoiceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.keyword) {
      filtered = filtered.filter(
        (r) => r.customer.includes(s.keyword) || r.code.includes(s.keyword) || r.order_code.includes(s.keyword)
      )
    }
    if (s.status) filtered = filtered.filter((r) => r.status === s.status)
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
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

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: InvoiceRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer) {
    ElMessage.warning('请填写必填项')
    return
  }

  formModel.value.tax_amount = Math.round(((formModel.value.amount * formModel.value.tax_rate) / 100) * 100) / 100
  formModel.value.total = formModel.value.amount + formModel.value.tax_amount

  if (dialogMode.value === 'add') {
    const newItem: InvoiceRow = {
      id: Date.now().toString(),
      code: 'INV' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(localData.value.length + 1).padStart(4, '0'),
      ...formModel.value
    }
    localData.value.unshift(newItem)
  } else {
    const idx = localData.value.findIndex((r) => r.id === formModel.value.id)
    if (idx > -1) {
      localData.value[idx] = { ...formModel.value }
    }
  }

  dialogVisible.value = false
  await refresh()
}

function issue(row: InvoiceRow) {
  row.status = 'issued'
  row.issue_date = new Date().toISOString().slice(0, 10)
  ElMessage.success('发票已开具')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

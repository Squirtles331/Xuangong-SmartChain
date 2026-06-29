<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'open' ? 'warning' : row.status === 'paid' ? 'success' : 'info'" size="small">{{
          row.status === 'open' ? '未付' : row.status === 'paid' ? '已付' : '部分付'
        }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <FinanceIndexFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import FinanceIndexFormDialog, { type FinancePayableFormModel } from './FinanceIndexFormDialog.vue'

interface PayableRow {
  id: string
  code: string
  supplier: string
  amount: number
  paid: number
  balance: number
  due_date: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ code: '', supplier: '', status: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<FinancePayableFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code' } as any,
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '未付', value: 'open' },
        { label: '已付', value: 'paid' },
        { label: '部分付', value: 'partial' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<PayableRow>[] = [
  { prop: 'code', label: '应付单号', width: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'amount', label: '金额', minWidth: 100, align: 'right' },
  { prop: 'paid', label: '已付', minWidth: 100, align: 'right' },
  { prop: 'balance', label: '余额', minWidth: 100, align: 'right' },
  { prop: 'due_date', label: '到期日', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const mockData = ref<PayableRow[]>([
  {
    id: '1',
    code: 'AP20250115001',
    supplier: 'XX钢材有限公司',
    amount: 85000,
    paid: 50000,
    balance: 35000,
    due_date: '2025-02-15',
    status: 'partial'
  },
  { id: '2', code: 'AP20250110002', supplier: 'YY轴承制造厂', amount: 120000, paid: 0, balance: 120000, due_date: '2025-03-10', status: 'open' }
])

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PayableRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = mockData.value
    if (searchForm.value.code) filtered = filtered.filter((r) => r.code.includes(searchForm.value.code))
    if (searchForm.value.supplier) filtered = filtered.filter((r) => r.supplier.includes(searchForm.value.supplier))
    if (searchForm.value.status) filtered = filtered.filter((r) => r.status === searchForm.value.status)
    const start = (page - 1) * size
    return { list: filtered.slice(start, start + size), total: filtered.length }
  },
  deleteAPI: (ids) =>
    Promise.all(
      ids.map((id) => {
        mockData.value = mockData.value.filter((e) => e.id !== id)
      })
    )
})

function createDefaultFormModel(): FinancePayableFormModel {
  return { id: '', code: '', supplier: '', amount: 0, paid: 0, balance: 0, due_date: '', status: 'open' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', supplier: '', status: '' }
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

function openEdit(row: PayableRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.supplier) {
    ElMessage.warning('请填写必填项')
    return
  }
  formModel.value.balance = formModel.value.amount - formModel.value.paid

  if (dialogMode.value === 'add') {
    const code = 'AP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(mockData.value.length + 1).padStart(4, '0')
    mockData.value.unshift({ ...formModel.value, id: Date.now().toString(), code } as PayableRow)
  } else {
    const i = mockData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) {
      Object.assign(mockData.value[i], formModel.value)
      mockData.value[i].balance = mockData.value[i].amount - mockData.value[i].paid
    }
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: PayableRow) {
  onDelete(row)
}
</script>

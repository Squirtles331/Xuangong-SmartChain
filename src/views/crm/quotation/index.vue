<template>
  <gi-page-layout>
    <template #header>
      <gi-form
        ref="searchFormRef"
        v-model="searchForm"
        :columns="searchColumns"
        :grid-item-props="{
          span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
        }"
        search
        @reset="handleReset"
        @search="handleSearch"
      />
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
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
          :type="row.status === 'sent' ? 'primary' : row.status === 'approved' ? 'success' : row.status === 'lost' ? 'danger' : 'warning'"
          size="small"
        >
          {{ row.status === 'sent' ? '已发出' : row.status === 'approved' ? '已中标' : row.status === 'lost' ? '已丢单' : '草稿' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
      </template>
    </gi-table>

    <QuotationFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import QuotationFormDialog, { type QuotationFormModel } from './QuotationFormDialog.vue'

interface QuotationRow {
  id: string
  code: string
  customer: string
  product: string
  qty: number
  price: number
  amount: number
  valid_date: string
  status: string
}

// Local data store
const localData = ref<QuotationRow[]>([
  {
    id: '1',
    code: 'QT20250115001',
    customer: 'XX重工集团',
    product: '离心泵 XJP-100',
    qty: 50,
    price: 4600,
    amount: 230000,
    valid_date: '2025-02-15',
    status: 'sent'
  },
  {
    id: '2',
    code: 'QT20250110002',
    customer: 'AA精密制造',
    product: '齿轮箱 GBX-200',
    qty: 10,
    price: 9000,
    amount: 90000,
    valid_date: '2025-02-10',
    status: 'draft'
  }
])

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  customer: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<QuotationFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '报价单号', field: 'code' },
  { type: 'input', label: '客户名称', field: 'customer' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发出', value: 'sent' },
        { label: '已中标', value: 'approved' },
        { label: '已丢单', value: 'lost' }
      ]
    } as any
  }
]

const columns: TableColumnItem<QuotationRow>[] = [
  { prop: 'code', label: '报价单号', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'product', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
  { prop: 'price', label: '单价(元)', minWidth: 100, align: 'right' },
  { prop: 'amount', label: '总价(元)', minWidth: 110, align: 'right' },
  { prop: 'valid_date', label: '有效期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<QuotationRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.code) filtered = filtered.filter((r) => r.code.includes(s.code))
    if (s.customer) filtered = filtered.filter((r) => r.customer.includes(s.customer))
    if (s.status) filtered = filtered.filter((r) => r.status === s.status)
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
  }
})

function createDefaultFormModel(): QuotationFormModel {
  return {
    id: '',
    code: '',
    customer: '',
    product: '',
    qty: 1,
    price: 0,
    amount: 0,
    valid_date: '',
    status: 'draft'
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', customer: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: QuotationRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer) {
    ElMessage.warning('请填写必填项')
    return
  }

  formModel.value.amount = formModel.value.price * formModel.value.qty

  if (dialogMode.value === 'add') {
    const newItem: QuotationRow = {
      id: Date.now().toString(),
      code: 'QT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(localData.value.length + 1).padStart(4, '0'),
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
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

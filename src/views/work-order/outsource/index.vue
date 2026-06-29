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
      <template #due_date="{ row }">
        <span :style="isOverdue(row) ? 'color: #f56c6c; font-weight: 600' : ''">
          {{ row.due_date }}
          <el-tag v-if="isOverdue(row)" type="danger" size="small" style="margin-left: 4px">超期</el-tag>
        </span>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="row.status === 'sent' ? 'warning' : row.status === 'processing' ? 'primary' : row.status === 'received' ? 'success' : 'info'"
          size="small"
        >
          {{ row.status === 'sent' ? '已发出' : row.status === 'processing' ? '加工中' : row.status === 'received' ? '已收回' : '已结算' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button v-if="row.status === 'sent'" type="primary" link size="small" @click="confirmSend(row)">确认发出</el-button>
        <el-button v-if="row.status === 'processing'" type="success" link size="small" @click="confirmReceive(row)">确认收回</el-button>
      </template>
    </gi-table>

    <OutsourceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import OutsourceFormDialog, { type OutsourceFormModel } from './OutsourceFormDialog.vue'

interface OutsourceRow {
  id: string
  code: string
  material: string
  qty: number
  supplier: string
  operation: string
  send_date: string
  due_date: string
  price: number
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = reactive({ keyword: '', status: '', supplier: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<OutsourceFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已发出', value: 'sent' },
        { label: '加工中', value: 'processing' },
        { label: '已收回', value: 'received' },
        { label: '已结算', value: 'settled' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<OutsourceRow>[] = [
  { prop: 'code', label: '工单号', minWidth: 170 },
  { prop: 'material', label: '产品', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
  { prop: 'supplier', label: '委外供应商', minWidth: 160 },
  { prop: 'operation', label: '委外工序', minWidth: 140 },
  { prop: 'send_date', label: '发出日期', minWidth: 100 },
  { prop: 'due_date', label: '交回日期', minWidth: 120, slotName: 'due_date' },
  { prop: 'price', label: '加工费(元)', minWidth: 110, align: 'right' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

// Local data for outsource (no real API for this module)
const localData = ref<OutsourceRow[]>([
  {
    id: '1',
    code: 'WO20250115001',
    material: '离心泵 XJP-100',
    qty: 50,
    supplier: 'XX热处理有限公司',
    operation: '工序50:热处理',
    send_date: '2025-01-15',
    due_date: '2025-01-25',
    price: 15000,
    status: 'sent'
  },
  {
    id: '2',
    code: 'WO20250110002',
    material: '齿轮箱 GBX-200',
    qty: 30,
    supplier: 'YY表面处理厂',
    operation: '工序40:镀锌',
    send_date: '2025-01-10',
    due_date: '2025-01-20',
    price: 9000,
    status: 'processing'
  },
  {
    id: '3',
    code: 'WO20250105003',
    material: '传动轴 DS-50',
    qty: 100,
    supplier: 'ZZ精密加工',
    operation: '工序30:磨削',
    send_date: '2025-01-05',
    due_date: '2025-01-12',
    price: 25000,
    status: 'received'
  }
])

const { tableData, pagination, loading, search, refresh } = useTable<OutsourceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = localData.value
    if (searchForm.keyword) {
      filtered = filtered.filter((r) => r.material.includes(searchForm.keyword))
    }
    if (searchForm.status) {
      filtered = filtered.filter((r) => r.status === searchForm.status)
    }
    if (searchForm.supplier) {
      filtered = filtered.filter((r) => r.supplier.includes(searchForm.supplier))
    }
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function createDefaultFormModel(): OutsourceFormModel {
  return { id: '', code: '', material: '', qty: 1, supplier: '', operation: '', send_date: '', due_date: '', price: 0, status: 'sent' }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.supplier = ''
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

function openEdit(row: OutsourceRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    localData.value.unshift({ id: Date.now().toString(), ...formModel.value } as OutsourceRow)
  } else {
    const i = localData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(localData.value[i], formModel.value)
  }
  dialogVisible.value = false
  await refresh()
}

function confirmSend(row: OutsourceRow) {
  const i = localData.value.findIndex((e) => e.id === row.id)
  if (i > -1) localData.value[i].status = 'processing'
  ElMessage.success('已确认发出')
  refresh()
}

function confirmReceive(row: OutsourceRow) {
  const i = localData.value.findIndex((e) => e.id === row.id)
  if (i > -1) localData.value[i].status = 'received'
  ElMessage.success('已确认收回')
  refresh()
}

function isOverdue(row: OutsourceRow): boolean {
  if (row.status === 'received' || row.status === 'settled') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(row.due_date)
  return due < today
}
</script>

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

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #type="{ row }">
        <StatusTag :value="row.type" :options="RECEIPT_TYPE" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="RECEIPT_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <ReceiptFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getReceiptList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import ReceiptFormDialog, { type ReceiptFormModel } from './ReceiptFormDialog.vue'

const RECEIPT_TYPE = [
  { value: 'purchase', label: '采购入库', type: 'primary' as const },
  { value: 'production', label: '生产入库', type: 'success' as const },
  { value: 'other', label: '其他', type: 'info' as const }
]

const RECEIPT_STATUS = [
  { value: 'pending', label: '待入库', type: 'warning' as const },
  { value: 'completed', label: '已入库', type: 'success' as const }
]

interface ReceiptRow {
  id: string
  code: string
  type: string
  material: string
  qty: number
  warehouse: string
  status: string
  created_at: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ code: '', type: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '采购入库', value: 'purchase' },
        { label: '生产入库', value: 'production' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待入库', value: 'pending' },
        { label: '已入库', value: 'completed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<ReceiptRow>[] = [
  { prop: 'code', label: '入库单号', width: 160 },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'material', label: '物料', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'warehouse', label: '仓库', width: 100 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ReceiptRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getReceiptList({
      pageNum: page,
      pageSize: size,
      code: searchForm.value.code || undefined,
      supplier: searchForm.value.type || undefined,
      status: searchForm.value.status || undefined
    })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): ReceiptRow {
  return {
    id: String(item.id),
    code: item.code || '',
    type: item.type || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    warehouse: item.warehouse || '',
    status: item.status || '',
    created_at: item.created_at || ''
  }
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReceiptFormModel>(createDefaultForm())

function createDefaultForm(): ReceiptFormModel {
  return { id: '', code: '', type: 'purchase', material: '', qty: 1, warehouse: '原材料仓', status: 'pending' }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', type: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: ReceiptRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    type: row.type,
    material: row.material,
    qty: row.qty,
    warehouse: row.warehouse,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function remove(row: ReceiptRow) {
  onDelete(row)
}
</script>

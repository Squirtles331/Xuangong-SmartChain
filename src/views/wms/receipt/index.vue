<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form v-model="queryParams" :columns="visibleSearchColumns" search @search="search" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <TableSetting title="入库单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #type="{ row }">
            <StatusTag :value="row.type" :options="receiptTypeOptions" />
          </template>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="receiptStatusOptions" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ReceiptFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getReceiptList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import ReceiptFormDialog, { type ReceiptFormModel } from './ReceiptFormDialog.vue'

const receiptTypeOptions = [
  { value: 'purchase', label: '采购入库', type: 'primary' as const },
  { value: 'production', label: '生产入库', type: 'success' as const }
]

const receiptStatusOptions = [
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
  createdAt: string
}

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const queryParams = ref({
  code: '',
  type: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '入库类型',
    field: 'type',
    props: {
      options: receiptTypeOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: receiptStatusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<ReceiptRow>[] = [
  { prop: 'code', label: '入库单号', width: 160 },
  { label: '入库类型', minWidth: 110, slotName: 'type', align: 'center' },
  { prop: 'material', label: '物料名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'warehouse', label: '仓库', width: 110 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ReceiptRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getReceiptList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      type: queryParams.value.type || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
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
    createdAt: item.created_at || ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.value = {
    code: '',
    type: '',
    status: ''
  }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReceiptFormModel>(createDefaultForm())

function createDefaultForm(): ReceiptFormModel {
  return {
    id: '',
    code: '',
    type: 'purchase',
    material: '',
    qty: 1,
    warehouse: warehouseOptions[0].value,
    status: 'pending'
  }
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

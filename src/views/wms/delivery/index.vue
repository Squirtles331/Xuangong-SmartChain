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
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="DELIVERY_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <DeliveryFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getDeliveryList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import DeliveryFormDialog, { type DeliveryFormModel } from './DeliveryFormDialog.vue'

const DELIVERY_STATUS = [
  { value: 'pending', label: '待发货', type: 'warning' as const },
  { value: 'completed', label: '已发货', type: 'success' as const }
]

interface DeliveryRow {
  id: string
  code: string
  order_code: string
  customer: string
  material: string
  qty: number
  status: string
  created_at: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ code: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待发货', value: 'pending' },
        { label: '已发货', value: 'completed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<DeliveryRow>[] = [
  { prop: 'code', label: '发货单号', width: 160 },
  { prop: 'order_code', label: '销售订单', width: 160 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  { prop: 'material', label: '产品', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<DeliveryRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getDeliveryList({
      page,
      page_size: size,
      code: searchForm.value.code || undefined,
      customer: undefined,
      status: searchForm.value.status || undefined
    })
    return {
      list: (res.data.items || []).map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): DeliveryRow {
  return {
    id: String(item.id),
    code: item.code || '',
    order_code: item.order_code || '',
    customer: item.customer || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    status: item.status || '',
    created_at: item.created_at || ''
  }
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<DeliveryFormModel>(createDefaultForm())

function createDefaultForm(): DeliveryFormModel {
  return { id: '', code: '', order_code: '', customer: '', material: '', qty: 1, status: 'pending' }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', status: '' }
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

function openEdit(row: DeliveryRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    order_code: row.order_code,
    customer: row.customer,
    material: row.material,
    qty: row.qty,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function remove(row: DeliveryRow) {
  onDelete(row)
}
</script>

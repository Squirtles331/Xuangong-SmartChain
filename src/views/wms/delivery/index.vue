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

    <TableSetting title="发货单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="deliveryStatusOptions" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <DeliveryFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getDeliveryList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import DeliveryFormDialog, { type DeliveryFormModel } from './DeliveryFormDialog.vue'

const deliveryStatusOptions = [
  { value: 'pending', label: '待发货', type: 'warning' as const },
  { value: 'completed', label: '已发货', type: 'success' as const }
]

interface DeliveryRow {
  id: string
  code: string
  orderCode: string
  customer: string
  material: string
  qty: number
  status: string
  createdAt: string
}

const queryParams = ref({
  code: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: deliveryStatusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<DeliveryRow>[] = [
  { prop: 'code', label: '发货单号', width: 160 },
  { prop: 'orderCode', label: '销售订单号', width: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { prop: 'material', label: '产品名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<DeliveryRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getDeliveryList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  }
})

function mapRow(item: any): DeliveryRow {
  return {
    id: String(item.id),
    code: item.code || '',
    orderCode: item.order_code || '',
    customer: item.customer || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
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
    status: ''
  }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<DeliveryFormModel>(createDefaultForm())

function createDefaultForm(): DeliveryFormModel {
  return {
    id: '',
    code: '',
    orderCode: '',
    customer: '',
    material: '',
    qty: 1,
    status: 'pending'
  }
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
    orderCode: row.orderCode,
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

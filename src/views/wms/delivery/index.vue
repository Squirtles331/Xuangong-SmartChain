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
            <StatusTag :value="row.status" :options="DELIVERY_STATUS" />
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

const queryParams = ref({ code: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待发货', value: 'pending' },
        { label: '已发货', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<DeliveryRow>[] = [
  { prop: 'code', label: '发货单号', width: 160 },
  { prop: 'order_code', label: '销售订单号', width: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 140 },
  { prop: 'material', label: '产品名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<DeliveryRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getDeliveryList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined
    })
    return {
      list: res.data.list.map(mapRow),
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.value = { code: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<DeliveryFormModel>(createDefaultForm())

function createDefaultForm(): DeliveryFormModel {
  return { id: '', code: '', order_code: '', customer: '', material: '', qty: 1, status: 'pending' }
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

<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form v-model="queryParams" :columns="visibleSearchColumns" search @search="search" @reset="handleReset" />
      </SearchSetting>
    </template>

    <TableSetting title="库存台账" :columns="columns" @refresh="search">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #qty="{ row }">
            <div class="qty-cell">
              <span :class="{ 'qty-warn': row.qty < row.safety }">{{ row.qty }}</span>
              <el-tag v-if="row.qty < row.safety" type="danger" size="small" class="qty-tag">低于安全库存</el-tag>
            </div>
          </template>
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="trace(row)">追溯</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <InventoryTraceDialog v-model:visible="traceVisible" v-model:trace-data="traceData" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getInventoryList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import InventoryTraceDialog, { type InventoryTraceItem } from './InventoryTraceDialog.vue'

interface InvRow {
  id: string
  code: string
  name: string
  spec: string
  warehouse: string
  location: string
  lot: string
  qty: number
  reserved: number
  available: number
  safety: number
  unit: string
}

const queryParams = ref({ keyword: '', warehouse: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入物料编码/名称', clearable: true } as any },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '标准件仓', value: '标准件仓' },
        { label: '半成品仓', value: '半成品仓' },
        { label: '成品仓', value: '成品仓' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<InvRow>[] = [
  { prop: 'code', label: '物料编码', width: 170 },
  { prop: 'name', label: '物料名称', minWidth: 130 },
  { prop: 'spec', label: '规格', width: 120 },
  { prop: 'warehouse', label: '仓库', width: 100 },
  { prop: 'location', label: '库位', width: 100 },
  { prop: 'lot', label: '批号', width: 150 },
  { label: '当前库存', minWidth: 100, slotName: 'qty', align: 'center' },
  { prop: 'safety', label: '安全库存', minWidth: 90, align: 'center' },
  { prop: 'reserved', label: '已预留', minWidth: 80, align: 'center' },
  { prop: 'available', label: '可用库存', minWidth: 90, align: 'center' },
  { label: '操作', minWidth: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search } = useTable<InvRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getInventoryList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.keyword || undefined,
      name: queryParams.value.keyword || undefined,
      warehouse: queryParams.value.warehouse || undefined
    })
    return {
      list: res.data.list.map(mapInvRow),
      total: res.data.total
    }
  }
})

function mapInvRow(item: any): InvRow {
  return {
    id: String(item.id),
    code: item.code || '',
    name: item.name || '',
    spec: item.spec || '',
    warehouse: item.warehouse || '',
    location: item.location || '',
    lot: item.lot || '',
    qty: Number(item.qty ?? 0),
    reserved: Number(item.reserved ?? 0),
    available: Number(item.available ?? 0),
    safety: Number(item.safety ?? 0),
    unit: item.unit || ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.value = { keyword: '', warehouse: '' }
  search()
}

const traceVisible = ref(false)
const traceData = ref<InventoryTraceItem[]>([])

function trace(row: InvRow) {
  traceData.value = [
    { time: '2025-01-15 14:00', type: 'primary', desc: `成品入库：${row.name} 入库 ${row.qty}${row.unit}` },
    { time: '2025-01-14 10:00', type: 'success', desc: '工序报工：工单 WO202501150001 完工' },
    { time: '2025-01-05 08:00', type: 'warning', desc: `来料入库：批号 ${row.lot} 来源采购单 PO202501010005` }
  ]
  traceVisible.value = true
}
</script>

<style scoped>
.qty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.qty-warn {
  color: #f56c6c;
  font-weight: 700;
}

.qty-tag {
  flex-shrink: 0;
}
</style>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="库存台账"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="search"
  >
    <template #qty="{ row }">
      <div class="qty-cell">
        <span :class="{ 'qty-warn': row.qty < row.safety }">{{ row.qty }}</span>
        <el-tag v-if="row.qty < row.safety" type="danger" size="small" class="qty-tag">低于安全库存</el-tag>
      </div>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="traceActions" @action="trace(row)" />
    </template>

    <template #dialog>
      <InventoryTraceDialog v-model:visible="traceVisible" v-model:trace-data="traceData" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { getInventoryList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import InventoryTraceDialog, { type InventoryTraceItem } from './InventoryTraceDialog.vue'

interface InventoryRow {
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

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: {
      placeholder: '请输入物料编码或物料名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: warehouseOptions,
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<InventoryRow>[] = [
  { prop: 'code', label: '物料编码', width: 170 },
  { prop: 'name', label: '物料名称', minWidth: 140 },
  { prop: 'spec', label: '规格型号', width: 140 },
  { prop: 'warehouse', label: '仓库', width: 110 },
  { prop: 'location', label: '库位', width: 110 },
  { prop: 'lot', label: '批次号', width: 150 },
  { label: '当前库存', minWidth: 160, slotName: 'qty', align: 'center' },
  { prop: 'safety', label: '安全库存', minWidth: 100, align: 'center' },
  { prop: 'reserved', label: '已预留', minWidth: 90, align: 'center' },
  { prop: 'available', label: '可用库存', minWidth: 100, align: 'center' },
  { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
]

const traceActions = [{ key: 'trace', label: '批次追溯', tone: 'primary' as const }]

const queryParams = reactive({
  keyword: '',
  warehouse: ''
})

const traceVisible = ref(false)
const traceData = ref<InventoryTraceItem[]>([])

const { tableData, pagination, loading, search } = useTable<InventoryRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getInventoryList({
      pageNum: page,
      pageSize: size,
      code: queryParams.keyword || undefined,
      name: queryParams.keyword || undefined,
      warehouse: queryParams.warehouse || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  }
})

function mapRow(item: any): InventoryRow {
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

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    warehouse: ''
  })
  search()
}

function trace(row: InventoryRow) {
  traceData.value = [
    { time: '2025-01-15 14:00', type: 'primary', desc: `${row.name} 入库 ${row.qty}${row.unit}` },
    { time: '2025-01-14 10:00', type: 'success', desc: '工单 WO202501150001 完工入库' },
    { time: '2025-01-05 08:00', type: 'warning', desc: `批次 ${row.lot} 来源采购单 PO202501010005` }
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

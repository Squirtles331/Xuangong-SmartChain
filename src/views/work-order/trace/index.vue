<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
      </template>
    </gi-table>

    <TraceDetailDialog v-model:visible="detailVisible" :detail="currentDetail" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import TraceDetailDialog, { type TraceDetail } from './TraceDetailDialog.vue'

interface TraceRow {
  id: string
  wo_code: string
  op_name: string
  worker: string
  qualified: number
  defective: number
  reasons: string
  hours: number
  time: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = reactive({ wo_code: '', worker: '', date_range: [] as string[] })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code' } as any,
  { type: 'input', label: '操作人', field: 'worker' } as any,
  {
    type: 'date-picker',
    label: '日期范围',
    field: 'date_range',
    props: {
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      'value-format': 'YYYY-MM-DD'
    } as any
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<TraceRow>[] = [
  { prop: 'wo_code', label: '工单号', width: 170 },
  { prop: 'op_name', label: '工序', width: 130 },
  { prop: 'worker', label: '操作人', width: 80 },
  { prop: 'qualified', label: '合格数', minWidth: 80, align: 'center' },
  { prop: 'defective', label: '不良数', minWidth: 80, align: 'center' },
  { prop: 'hours', label: '工时(分)', minWidth: 90, align: 'center' },
  { prop: 'time', label: '时间', width: 150 },
  { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
]

// Local data for trace (no real API for this module)
const localData = ref<TraceRow[]>([
  { id: '1', wo_code: 'WO202501150001', op_name: '工序10:下料', worker: '李四', qualified: 100, defective: 2, reasons: '尺寸超差', hours: 510, time: '2025-01-11 17:00' },
  { id: '2', wo_code: 'WO202501150001', op_name: '工序20:粗车', worker: '王五', qualified: 98, defective: 1, reasons: '外观缺陷', hours: 960, time: '2025-01-14 12:00' },
  { id: '3', wo_code: 'WO202501150001', op_name: '工序30:精车', worker: '赵六', qualified: 45, defective: 3, reasons: '尺寸超差,设备精度', hours: 720, time: '2025-01-15 14:00' },
  { id: '4', wo_code: 'WO202501150005', op_name: '工序20:车削', worker: '孙八', qualified: 120, defective: 0, reasons: '', hours: 1440, time: '2025-01-15 10:00' }
])

function filterDateRange(time: string): boolean {
  if (!searchForm.date_range || searchForm.date_range.length < 2) return true
  const [start, end] = searchForm.date_range
  const t = time.substring(0, 10)
  return t >= start && t <= end
}

const { tableData, pagination, loading, search, refresh } = useTable<TraceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = localData.value.filter(
      (r) =>
        (!searchForm.wo_code || r.wo_code.includes(searchForm.wo_code)) &&
        (!searchForm.worker || r.worker.includes(searchForm.worker)) &&
        (!searchForm.date_range || searchForm.date_range.length < 2 || filterDateRange(r.time))
    )
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.wo_code = ''
  searchForm.worker = ''
  searchForm.date_range = []
  search()
}

const detailVisible = ref(false)
const currentDetail = ref<TraceDetail | null>(null)

function viewDetail(row: TraceRow) {
  currentDetail.value = row
  detailVisible.value = true
}
</script>

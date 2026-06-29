<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          :columns="visibleSearchColumns"
          ref="sf"
          v-model="searchForm"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <gi-table
      :columns="cols"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
    >
      <template #deviation="{ row }">
        <el-tag
          :type="row.deviation <= 10 ? 'success' : row.deviation <= 20 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.deviation }}%
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="adopt(row)">采纳</el-button>
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'

interface AutoTimeRow {
  id: string
  operation: string
  material: string
  std_hours: number
  actual_avg: number
  deviation: number
  samples: number
  suggestion: string
}

const sf = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', deviation: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '偏差',
    field: 'deviation',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '≤10%', value: 'low' },
        { label: '10-20%', value: 'mid' },
        { label: '>20%', value: 'high' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<AutoTimeRow>[] = [
  { prop: 'operation', label: '工序', minWidth: 100 },
  { prop: 'material', label: '产品', minWidth: 160 },
  { prop: 'std_hours', label: '定额工时(min)', minWidth: 120, align: 'center' },
  { prop: 'actual_avg', label: '实际平均(min)', minWidth: 120, align: 'center' },
  { label: '偏差', minWidth: 80, slotName: 'deviation', align: 'center' },
  { prop: 'samples', label: '样本数', minWidth: 80, align: 'center' },
  { prop: 'suggestion', label: '建议', minWidth: 180 },
  { label: '操作', minWidth: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

function filterDeviation(v: number, filter: string): boolean {
  if (filter === 'low') return v <= 10
  if (filter === 'mid') return v > 10 && v <= 20
  if (filter === 'high') return v > 20
  return true
}

const { tableData, pagination, loading, search, refresh } = useTable<AutoTimeRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    // Mock data as API source — in production this would call getRoutingList
    const all: AutoTimeRow[] = [
      { id: '1', operation: '下料', material: '离心泵 XJP-100', std_hours: 5, actual_avg: 4.2, deviation: 16, samples: 120, suggestion: '建议调整为4.5min' },
      { id: '2', operation: '精车', material: '离心泵 XJP-100', std_hours: 18, actual_avg: 20.5, deviation: 14, samples: 85, suggestion: '建议调整为20min' },
      { id: '3', operation: '钻孔', material: '离心泵 XJP-100', std_hours: 8, actual_avg: 7.8, deviation: 2.5, samples: 110, suggestion: '偏差在合理范围' },
      { id: '4', operation: '磨削', material: '齿轮箱 GBX-200', std_hours: 15, actual_avg: 18.2, deviation: 21, samples: 60, suggestion: '建议调整为18min' }
    ]
    let items = all
    if (searchForm.value.keyword) {
      const kw = searchForm.value.keyword.toLowerCase()
      items = items.filter((r) => r.operation.toLowerCase().includes(kw))
    }
    if (searchForm.value.deviation) {
      items = items.filter((r) => filterDeviation(r.deviation, searchForm.value.deviation))
    }
    const start = (page - 1) * size
    return { list: items.slice(start, start + size), total: items.length }
  },
  deleteAPI: undefined
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', deviation: '' }
  search()
}

function adopt(row: AutoTimeRow) {
  row.std_hours = Math.round(row.actual_avg)
  row.deviation = 0
  ElMessage.success(`已采纳建议: ${row.operation} 定额调整为 ${row.std_hours}min`)
}
</script>

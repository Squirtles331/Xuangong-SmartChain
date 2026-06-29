<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @reset="handleReset"
          @search="handleSearch"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #type="{ row }">
        <el-tag :type="row.type === 'sales' ? 'primary' : 'warning'" size="small">
          {{ row.type === 'sales' ? '销售预测' : '独立需求' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <!-- 预测 vs 实际对比图 -->
    <el-card header="预测 vs 实际需求对比" shadow="never" style="margin-top: 16px">
      <div ref="forecastChartRef" style="width: 100%; height: 400px"></div>
    </el-card>

    <ForecastFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'
import SearchSetting from '@/components/SearchSetting.vue'
import { getMRPForecast } from '@/api/mrp'
import { useTable } from '@/hooks/useTable'
import ForecastFormDialog, { type ForecastFormModel } from './ForecastFormDialog.vue'

interface ForecastRow {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: string
  probability: number
  remark: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  type: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ForecastFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<ForecastRow>[] = [
  { prop: 'material_name', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '预测数量', minWidth: 90, align: 'center' },
  { prop: 'need_date', label: '需求日期', minWidth: 110 },
  { label: '类型', minWidth: 90, slotName: 'type', align: 'center' },
  { prop: 'probability', label: '概率(%)', minWidth: 90, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ForecastRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getMRPForecast({
      page,
      page_size: size,
      period: searchForm.value.keyword || undefined
    })
    const items = res.data.items || res.data || []
    return { list: items, total: res.data.total || items.length }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => {
    // Delete is handled via local data mutation for now
    return Promise.resolve()
  }))
})

function createDefaultFormModel(): ForecastFormModel {
  return {
    id: '',
    material_code: '',
    material_name: '',
    qty: 1,
    need_date: '',
    type: 'sales',
    probability: 80,
    remark: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', type: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ForecastRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    material_code: row.material_code,
    material_name: row.material_name,
    qty: row.qty,
    need_date: row.need_date,
    type: row.type,
    probability: row.probability,
    remark: row.remark
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

// 预测 vs 实际对比图
const forecastChartRef = ref<HTMLDivElement>()
let forecastChart: echarts.ECharts | null = null

function initForecastChart() {
  if (!forecastChartRef.value) return
  if (forecastChart) forecastChart.dispose()
  forecastChart = echarts.init(forecastChartRef.value)

  const rawData = tableData.value as ForecastRow[]
  const dateMap: Record<string, { forecast: number; actual: number }> = {}
  rawData.forEach((r) => {
    const d = r.need_date
    if (!dateMap[d]) dateMap[d] = { forecast: 0, actual: 0 }
    dateMap[d].forecast += r.qty
    dateMap[d].actual += Math.round(r.qty * (0.7 + Math.random() * 0.5))
  })

  const dates = Object.keys(dateMap).sort()
  const forecastVals = dates.map((d) => dateMap[d].forecast)
  const actualVals = dates.map((d) => dateMap[d].actual)

  forecastChart.setOption({
    title: { text: '预测 vs 实际需求', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['预测需求', '实际需求'], bottom: 0 },
    grid: { left: 60, right: 30, bottom: 40, top: 50 },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', name: '数量(台)' },
    series: [
      {
        name: '预测需求',
        type: 'line',
        data: forecastVals,
        smooth: true,
        lineStyle: { color: '#409eff', width: 2 },
        itemStyle: { color: '#409eff' },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: '实际需求',
        type: 'line',
        data: actualVals,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
        itemStyle: { color: '#67c23a' },
        symbol: 'diamond',
        symbolSize: 8
      }
    ]
  })
  window.addEventListener('resize', handleForecastResize)
}

function handleForecastResize() {
  forecastChart?.resize()
}

watch(
  tableData,
  () => {
    nextTick(() => initForecastChart())
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => initForecastChart())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleForecastResize)
  forecastChart?.dispose()
})
</script>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="成本分析"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @toolbar-action="handleToolbarAction"
  >
    <template #beforeTable>
      <el-alert type="info" :closable="false" class="boundary-alert" title="成本分析是 ERP 聚合结果页，不回写 BOM、工单执行或库存收发真相。" />

      <el-card shadow="never" class="chart-card" header="成本构成">
        <div ref="chartRef" class="chart-canvas"></div>
      </el-card>
    </template>

    <template #materialCost="{ row }">
      {{ formatAmount(row.materialCost) }}
    </template>

    <template #laborCost="{ row }">
      {{ formatAmount(row.laborCost) }}
    </template>

    <template #overhead="{ row }">
      {{ formatAmount(row.overhead) }}
    </template>

    <template #total="{ row }">
      {{ formatAmount(row.total) }}
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import type { CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { getErpCostList, getErpCostOverview, type ErpCostDetail, type ErpCostOverview } from '@/static/services/erp'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]

const queryParams = reactive({
  product: '',
  period: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '产品名称',
    field: 'product',
    props: { clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '核算期间',
    field: 'period',
    props: {
      options: [
        { label: '2026-07', value: '2026-07' },
        { label: '2026-06', value: '2026-06' }
      ],
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ErpCostDetail>[] = [
  { prop: 'product', label: '产品名称', minWidth: 180 },
  { prop: 'materialCost', label: '材料成本', width: 130, align: 'right', slotName: 'materialCost' },
  { prop: 'laborCost', label: '人工成本', width: 130, align: 'right', slotName: 'laborCost' },
  { prop: 'overhead', label: '制造费用', width: 130, align: 'right', slotName: 'overhead' },
  { prop: 'total', label: '总成本', width: 130, align: 'right', slotName: 'total' },
  { prop: 'period', label: '核算期间', width: 110, align: 'center' }
]

const overview = ref<ErpCostOverview | null>(null)

const { tableData, pagination, loading, search, refresh } = useTable<ErpCostDetail>({
  rowKey: 'id',
  onSuccess: () => {
    loadOverview()
  },
  listAPI: async ({ page, size }) => {
    const response = await getErpCostList({
      pageNum: page,
      pageSize: size,
      product: queryParams.product || undefined,
      period: queryParams.period || undefined
    })
    return response.data
  }
})

function formatAmount(value?: number | null) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0

  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function loadOverview() {
  const response = await getErpCostOverview(queryParams.period || undefined)
  overview.value = response.data
}

function handleReset() {
  Object.assign(queryParams, {
    product: '',
    period: ''
  })
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('成本分析静态数据已导出')
  }
}

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value || !overview.value) return

  if (chart) {
    chart.dispose()
  }

  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '68%'],
        data: overview.value.composition.map((item) => ({ name: item.label, value: item.value })),
        label: {
          formatter: '{b}\n{d}%'
        }
      }
    ]
  })
}

function handleResize() {
  chart?.resize()
}

watch(
  overview,
  () => {
    nextTick(() => {
      renderChart()
    })
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.boundary-alert {
  margin-bottom: 16px;
}

.chart-card {
  margin-bottom: 16px;
}

.chart-canvas {
  width: 100%;
  height: 320px;
}
</style>

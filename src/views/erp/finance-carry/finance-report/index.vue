<template>
  <CrudPage
    v-model:search-model="searchModel"
    title="财务报表"
    :search-columns="[]"
    :columns="trendColumns"
    :data="overview?.trend || []"
    :loading="loading"
    :show-add-button="false"
    :show-refresh-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'period', style: 'height: 100%' }"
  >
    <template #tool>
      <el-space wrap>
        <el-button @click="loadData">刷新</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </el-space>
    </template>

    <template #beforeTable>
      <el-alert
        type="info"
        :closable="false"
        class="boundary-alert"
        title="财务报表只表达 ERP 聚合结果，不替代 BI 分析，也不回写资金、库存或执行源事实。"
      />

      <el-row :gutter="16" class="panel-row">
        <el-col :xs="24" :xl="12">
          <el-card shadow="never" header="本期与上期对比">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="营业收入">
                {{ formatAmount(overview?.currentMonth.revenue || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.revenue || 0, overview?.lastMonth.revenue || 0), true)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.revenue || 0, overview?.lastMonth.revenue || 0)) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="营业成本">
                {{ formatAmount(overview?.currentMonth.cost || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.cost || 0, overview?.lastMonth.cost || 0), false)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.cost || 0, overview?.lastMonth.cost || 0)) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="毛利">
                {{ formatAmount(overview?.currentMonth.gross || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.gross || 0, overview?.lastMonth.gross || 0), true)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.gross || 0, overview?.lastMonth.gross || 0)) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="应收余额">
                {{ formatAmount(overview?.currentMonth.receivable || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.receivable || 0, overview?.lastMonth.receivable || 0), false)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.receivable || 0, overview?.lastMonth.receivable || 0)) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="应付余额">
                {{ formatAmount(overview?.currentMonth.payable || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.payable || 0, overview?.lastMonth.payable || 0), false)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.payable || 0, overview?.lastMonth.payable || 0)) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="净利润">
                {{ formatAmount(overview?.currentMonth.profit || 0) }}
                <span :style="getTrendStyle(calcRawTrend(overview?.currentMonth.profit || 0, overview?.lastMonth.profit || 0), true)">
                  环比 {{ formatTrend(calcRawTrend(overview?.currentMonth.profit || 0, overview?.lastMonth.profit || 0)) }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="12">
          <el-card shadow="never" header="经营趋势">
            <div ref="chartRef" class="chart-canvas"></div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <template #revenue="{ row }">
      {{ formatAmount(row.revenue) }}
    </template>

    <template #cost="{ row }">
      {{ formatAmount(row.cost) }}
    </template>

    <template #profit="{ row }">
      {{ formatAmount(row.profit) }}
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import { getErpFinanceReportOverview, type ErpFinanceReportOverview, type ErpFinanceReportTrendPoint } from '@/static/services/erp'

defineOptions({
  name: 'ErpFinanceReportPage'
})

const searchModel = reactive({})
const overview = ref<ErpFinanceReportOverview | null>(null)
const loading = ref(false)

const trendColumns: TableColumnItem<ErpFinanceReportTrendPoint>[] = [
  { prop: 'period', label: '期间', width: 120, align: 'center' },
  { prop: 'revenue', label: '营业收入', minWidth: 160, align: 'right', slotName: 'revenue' },
  { prop: 'cost', label: '营业成本', minWidth: 160, align: 'right', slotName: 'cost' },
  { prop: 'profit', label: '净利润', minWidth: 160, align: 'right', slotName: 'profit' }
]

function formatAmount(value?: number | null) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0

  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function calcRawTrend(current: number, last: number) {
  if (!last) return 0
  return Number((((current - last) / last) * 100).toFixed(1))
}

function formatTrend(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`
}

function getTrendStyle(value: number, positiveBetter: boolean) {
  const effective = positiveBetter ? value : -value
  return {
    color: effective >= 0 ? '#059669' : '#dc2626',
    marginLeft: '8px',
    fontSize: '12px'
  }
}

async function loadData() {
  loading.value = true
  try {
    const response = await getErpFinanceReportOverview()
    overview.value = response.data
  } finally {
    loading.value = false
  }
}

function handleExport() {
  ElMessage.success('财务报表静态数据已导出')
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
    tooltip: { trigger: 'axis' },
    legend: { data: ['营业收入', '营业成本', '净利润'], bottom: 0 },
    grid: { left: 48, right: 24, top: 36, bottom: 40 },
    xAxis: {
      type: 'category',
      data: overview.value.trend.map((item) => item.period)
    },
    yAxis: {
      type: 'value',
      name: '金额'
    },
    series: [
      {
        name: '营业收入',
        type: 'line',
        smooth: true,
        data: overview.value.trend.map((item) => item.revenue),
        itemStyle: { color: '#2563eb' }
      },
      {
        name: '营业成本',
        type: 'line',
        smooth: true,
        data: overview.value.trend.map((item) => item.cost),
        itemStyle: { color: '#d97706' }
      },
      {
        name: '净利润',
        type: 'line',
        smooth: true,
        data: overview.value.trend.map((item) => item.profit),
        itemStyle: { color: '#059669' }
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
  loadData()
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

.panel-row {
  margin-top: 4px;
  margin-bottom: 16px;
}

.chart-canvas {
  width: 100%;
  height: 360px;
}
</style>

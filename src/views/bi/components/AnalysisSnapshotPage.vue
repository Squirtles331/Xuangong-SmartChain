<template>
  <gi-page-layout>
    <template #header>
      <gi-form
        v-model="queryParams"
        :columns="searchColumns"
        :grid-item-props="searchGridItemProps"
        search
        @reset="handleReset"
        @search="loadSnapshot"
      />
    </template>

    <div v-if="snapshot" class="analysis-page">
      <div class="metric-grid">
        <div v-for="metric in snapshot.metrics" :key="metric.key" class="metric-tile" :class="`metric-tile--${metric.tone}`">
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-value">
            {{ metric.value }}<span>{{ metric.unit }}</span>
          </div>
          <div class="metric-trend" :class="{ 'is-down': metric.trend < 0 }">{{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend }}%</div>
        </div>
      </div>

      <div class="analysis-grid">
        <section class="analysis-panel analysis-panel--wide">
          <div class="panel-title">{{ snapshot.trend.title }}</div>
          <div ref="trendChartRef" class="chart-box"></div>
        </section>

        <section class="analysis-panel">
          <div class="panel-title">{{ snapshot.distribution.title }}</div>
          <div ref="distributionChartRef" class="chart-box"></div>
        </section>
      </div>

      <section class="analysis-panel">
        <div class="panel-title">{{ snapshot.detailTitle }}</div>
        <gi-table :columns="detailColumns" :data="snapshot.detailRows" border stripe size="small" />
      </section>
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { biPeriodOptions, getBiAnalysisSnapshot, type BiAnalysisSnapshot, type BiDashboardKind } from '@/static/services/bi'

defineOptions({
  name: 'BiAnalysisSnapshotPage'
})

const props = defineProps<{
  kind: BiDashboardKind
}>()

const queryParams = reactive({
  period: 'month'
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '分析周期',
    field: 'period',
    props: { clearable: false, options: biPeriodOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 }
}

const snapshot = ref<BiAnalysisSnapshot | null>(null)
const detailColumns = ref<TableColumnItem<Record<string, string | number>>[]>([])
const trendChartRef = ref<HTMLDivElement>()
const distributionChartRef = ref<HTMLDivElement>()
let trendChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null

async function loadSnapshot() {
  const response = await getBiAnalysisSnapshot(props.kind, queryParams.period)
  snapshot.value = response.data
  detailColumns.value = response.data.detailColumns as unknown as TableColumnItem<Record<string, string | number>>[]
  await nextTick()
  renderCharts()
}

function renderCharts() {
  if (!snapshot.value) return

  if (trendChartRef.value) {
    trendChart ??= echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { top: 0 },
      grid: { left: 32, right: 24, top: 42, bottom: 28, containLabel: true },
      xAxis: { type: 'category', data: snapshot.value.trend.xAxis },
      yAxis: { type: 'value' },
      series: snapshot.value.trend.series.map((item) => ({
        name: item.name,
        type: 'line',
        smooth: true,
        data: item.data
      }))
    })
  }

  if (distributionChartRef.value) {
    distributionChart ??= echarts.init(distributionChartRef.value)
    distributionChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['44%', '70%'],
          center: ['50%', '44%'],
          data: snapshot.value.distribution.items,
          label: { formatter: '{b}\n{d}%' }
        }
      ]
    })
  }
}

function handleReset() {
  queryParams.period = 'month'
  void loadSnapshot()
}

function handleResize() {
  trendChart?.resize()
  distributionChart?.resize()
}

watch(
  () => props.kind,
  () => {
    void loadSnapshot()
  }
)

onMounted(() => {
  void loadSnapshot()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  distributionChart?.dispose()
})
</script>

<style scoped>
.analysis-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.metric-tile {
  min-height: 110px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-left: 4px solid var(--el-color-primary);
  border-radius: 6px;
  background: var(--el-bg-color);
}

.metric-tile--success {
  border-left-color: var(--el-color-success);
}

.metric-tile--warning {
  border-left-color: var(--el-color-warning);
}

.metric-tile--danger {
  border-left-color: var(--el-color-danger);
}

.metric-label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.metric-value {
  margin-top: 10px;
  color: var(--el-text-color-primary);
  font-size: 28px;
  font-weight: 700;
}

.metric-value span {
  margin-left: 4px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 400;
}

.metric-trend {
  margin-top: 8px;
  color: var(--el-color-success);
  font-size: 12px;
}

.metric-trend.is-down {
  color: var(--el-color-danger);
}

.analysis-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.analysis-panel {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  background: var(--el-bg-color);
}

.panel-title {
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
}

.chart-box {
  height: 320px;
}

@media (max-width: 1200px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <gi-page-layout>
    <template #header>
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="起始月"
            end-placeholder="结束月"
            format="YYYY-MM"
            value-format="YYYY-MM"
            @change="loadOverview"
          />
        </el-form-item>
      </el-form>
    </template>
    <el-row :gutter="16">
      <el-col v-for="card in cards" :key="card.title" :span="6">
        <el-card shadow="hover">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ card.value }}<span class="card-unit">%</span></div>
          <el-progress :percentage="card.value" :stroke-width="12" :color="card.value >= 85 ? '#67c23a' : card.value >= 70 ? '#e6a23c' : '#f56c6c'" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="OEE 趋势">
          <div ref="chartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="设备 OEE 排行">
          <gi-table :columns="rankCols" :data="rankData" border stripe size="small" />
        </el-card>
      </el-col>
    </el-row>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { TableColumnItem } from 'gi-component'
import { getEquipmentOeeOverview, type EquipmentOeeOverviewData } from '@/api/equipment'

const dateRange = ref<string[]>(['2026-01', '2026-06'])
const chartRef = ref<HTMLDivElement>()

const cards = ref<EquipmentOeeOverviewData['cards']>([
  { title: 'OEE综合', value: 0 },
  { title: '设备利用率', value: 0 },
  { title: '性能效率', value: 0 },
  { title: '合格品率', value: 0 }
])

const rankData = ref<EquipmentOeeOverviewData['rankData']>([])
const trendData = ref<EquipmentOeeOverviewData['trendData']>({
  months: ['1月', '2月', '3月', '4月', '5月', '6月'],
  oee: [75, 76, 78, 77, 79, 78.5],
  utilization: [82, 84, 85, 83, 86, 85.2],
  performance: [90, 91, 92, 91, 93, 92.1],
  quality: [97, 98, 97.5, 98.2, 98.5, 98.3]
})

const rankCols: TableColumnItem<any>[] = [
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { prop: 'oee', label: 'OEE', minWidth: 80, align: 'center' },
  { prop: 'utilization', label: '利用率', minWidth: 80, align: 'center' },
  { prop: 'performance', label: '性能', minWidth: 80, align: 'center' },
  { prop: 'quality', label: '质量', minWidth: 80, align: 'center' }
]

let chartInstance: EChartsType | null = null

function renderChart() {
  if (!chartRef.value) return

  chartInstance ??= echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['OEE', '利用率', '性能', '质量'] },
    xAxis: { type: 'category', data: trendData.value.months },
    yAxis: { type: 'value', max: 100 },
    series: [
      { name: 'OEE', type: 'line', data: trendData.value.oee, itemStyle: { color: '#409eff' } },
      { name: '利用率', type: 'line', data: trendData.value.utilization, itemStyle: { color: '#67c23a' } },
      { name: '性能', type: 'line', data: trendData.value.performance, itemStyle: { color: '#e6a23c' } },
      { name: '质量', type: 'line', data: trendData.value.quality, itemStyle: { color: '#f56c6c' } }
    ]
  })
}

async function loadOverview() {
  const response = await getEquipmentOeeOverview({
    start_month: dateRange.value?.[0],
    end_month: dateRange.value?.[1]
  })
  cards.value = response.data.cards
  rankData.value = response.data.rankData
  trendData.value = response.data.trendData
  renderChart()
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(async () => {
  await loadOverview()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.card-title {
  font-size: 13px;
  color: #909399;
}

.card-value {
  margin: 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.card-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}
</style>

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
          <div class="card-value">
            {{ card.value.toLocaleString('zh-CN') }}<span class="card-unit">{{ card.unit }}</span>
          </div>
          <div class="card-trend" :style="{ color: card.trend > 0 ? '#f56c6c' : '#67c23a' }">
            {{ card.trend > 0 ? '↑' : '↓' }}{{ Math.abs(card.trend) }}% 较上期
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card header="能耗趋势">
          <div ref="chartRef" style="height: 320px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="能耗结构">
          <div ref="pieRef" style="height: 320px"></div>
        </el-card>
      </el-col>
    </el-row>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import { getEnergyOverview, type EnergyOverviewCard, type EnergyOverviewData } from '@/api/energy'

const dateRange = ref<string[]>(['2026-01', '2026-12'])
const cards = ref<EnergyOverviewCard[]>([])
const chartRef = ref<HTMLDivElement>()
const pieRef = ref<HTMLDivElement>()

let chartInstance: EChartsType | null = null
let pieInstance: EChartsType | null = null

function renderCharts(data: EnergyOverviewData) {
  if (chartRef.value) {
    if (!chartInstance) chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['电', '水', '气'] },
      xAxis: { type: 'category', data: data.trend.map((item) => item.period) },
      yAxis: { type: 'value' },
      series: [
        { name: '电', type: 'bar', data: data.trend.map((item) => item.electricity), itemStyle: { color: '#e6a23c' } },
        { name: '水', type: 'line', data: data.trend.map((item) => item.water), itemStyle: { color: '#409eff' } },
        { name: '气', type: 'line', data: data.trend.map((item) => item.gas), itemStyle: { color: '#67c23a' } }
      ]
    })
  }

  if (pieRef.value) {
    if (!pieInstance) pieInstance = echarts.init(pieRef.value)
    pieInstance.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: data.structure.map((item) => ({
            ...item,
            itemStyle: {
              color: item.name === '电' ? '#e6a23c' : item.name === '水' ? '#409eff' : '#67c23a'
            }
          }))
        }
      ]
    })
  }
}

async function loadOverview() {
  const response = await getEnergyOverview({
    start: dateRange.value?.[0],
    end: dateRange.value?.[1]
  })
  cards.value = response.data.cards
  await nextTick()
  renderCharts(response.data)
}

function handleResize() {
  chartInstance?.resize()
  pieInstance?.resize()
}

onMounted(() => {
  loadOverview()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  pieInstance?.dispose()
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

.card-trend {
  font-size: 12px;
}
</style>

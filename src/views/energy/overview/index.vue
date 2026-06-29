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
            @change="handleDateChange"
          />
        </el-form-item>
      </el-form>
    </template>
    <el-row :gutter="16">
      <el-col :span="6" v-for="c in filteredCards" :key="c.title"
        ><el-card shadow="hover"
          ><div class="card-title">{{ c.title }}</div>
          <div class="card-value">
            {{ c.value }}<span class="card-unit">{{ c.unit }}</span>
          </div>
          <div class="card-trend" :style="{ color: c.trend > 0 ? '#f56c6c' : '#67c23a' }">
            {{ c.trend > 0 ? '↑' : '↓' }}{{ Math.abs(c.trend) }}% 较上月
          </div></el-card
        ></el-col
      >
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16"
        ><el-card header="能耗趋势"><div ref="chartRef" style="height: 300px"></div></el-card
      ></el-col>
      <el-col :span="8"
        ><el-card header="能耗占比"><div ref="pieRef" style="height: 300px"></div></el-card
      ></el-col>
    </el-row>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'

const dateRange = ref<string[]>(['2025-01', '2025-12'])
let chartInstance: EChartsType | null = null
let pieInstance: EChartsType | null = null

const allCards = [
  { title: '本月用电', value: 125800, unit: 'kWh', trend: 5.2, month: '2025-06' },
  { title: '本月用水', value: 3200, unit: '吨', trend: -3.1, month: '2025-06' },
  { title: '本月用气', value: 8500, unit: 'm³', trend: 8.7, month: '2025-06' },
  { title: '碳排放', value: 98.5, unit: '吨CO₂', trend: 5.2, month: '2025-06' }
]

const filteredCards = computed(() => {
  if (!dateRange.value || dateRange.value.length < 2) return allCards
  return allCards
})

function handleDateChange() {
  if (chartInstance) {
    updateChart()
  }
}

const chartRef = ref<HTMLDivElement>()
const pieRef = ref<HTMLDivElement>()

function getChartOption() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  let startIdx = 0
  let endIdx = 11
  if (dateRange.value && dateRange.value.length === 2) {
    startIdx = parseInt(dateRange.value[0].split('-')[1]) - 1
    endIdx = parseInt(dateRange.value[1].split('-')[1]) - 1
  }
  const xData = months.slice(startIdx, endIdx + 1)
  const allElectric = [120, 132, 101, 134, 90, 145, 156, 130, 125, 140, 135, 125]
  const allWater = [3.2, 3.5, 2.8, 3.0, 3.1, 3.3, 3.0, 3.2, 2.9, 3.1, 3.0, 3.2]
  const allGas = [8.5, 9.0, 7.8, 8.2, 8.8, 9.2, 8.5, 8.0, 8.5, 9.0, 8.5, 8.5]
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['电', '水', '气'] },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value' },
    series: [
      { name: '电', type: 'bar', data: allElectric.slice(startIdx, endIdx + 1), itemStyle: { color: '#e6a23c' } },
      { name: '水', type: 'line', data: allWater.slice(startIdx, endIdx + 1), itemStyle: { color: '#409eff' } },
      { name: '气', type: 'line', data: allGas.slice(startIdx, endIdx + 1), itemStyle: { color: '#67c23a' } }
    ]
  }
}

function updateChart() {
  if (chartInstance) {
    chartInstance.setOption(getChartOption())
  }
}

function handleResize() {
  chartInstance?.resize()
  pieInstance?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(getChartOption())
  }
  if (pieRef.value) {
    pieInstance = echarts.init(pieRef.value)
    pieInstance.setOption({
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: [
            { value: 5800, name: '电', itemStyle: { color: '#e6a23c' } },
            { value: 120, name: '水', itemStyle: { color: '#409eff' } },
            { value: 350, name: '气', itemStyle: { color: '#67c23a' } }
          ]
        }
      ]
    })
  }
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
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
}
.card-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
.card-trend {
  font-size: 12px;
}
</style>

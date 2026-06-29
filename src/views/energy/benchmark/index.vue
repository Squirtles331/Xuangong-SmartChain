<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="电耗对标" name="electric">
        <el-card header="电耗对标分析" style="margin-top: 16px"><div ref="electricChartRef" style="height: 350px"></div></el-card>
      </el-tab-pane>
      <el-tab-pane label="水耗对标" name="water">
        <el-card header="水耗对标分析" style="margin-top: 16px"><div ref="waterChartRef" style="height: 350px"></div></el-card>
      </el-tab-pane>
      <el-tab-pane label="气耗对标" name="gas">
        <el-card header="气耗对标分析" style="margin-top: 16px"><div ref="gasChartRef" style="height: 350px"></div></el-card>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'

const activeTab = ref('electric')
const electricChartRef = ref<HTMLDivElement>()
const waterChartRef = ref<HTMLDivElement>()
const gasChartRef = ref<HTMLDivElement>()

let electricChart: EChartsType | null = null
let waterChart: EChartsType | null = null
let gasChart: EChartsType | null = null

const baseOption = (title: string, actual: number[], benchmark: number[], advanced: number[], xLabels: string[]) => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['实际值', '行业标杆', '先进值'] },
  xAxis: { type: 'category', data: xLabels },
  yAxis: { type: 'value', name: title },
  series: [
    { name: '实际值', type: 'bar', data: actual, itemStyle: { color: '#409eff' } },
    { name: '行业标杆', type: 'bar', data: benchmark, itemStyle: { color: '#67c23a' } },
    { name: '先进值', type: 'bar', data: advanced, itemStyle: { color: '#e6a23c' } }
  ]
})

function initElectricChart() {
  if (!electricChartRef.value) return
  electricChart = echarts.init(electricChartRef.value)
  electricChart.setOption(baseOption('kWh/台', [12.5, 13.2, 11.8, 12.0], [10.0, 9.8, 9.5, 9.2], [8.0, 7.8, 7.5, 7.2], ['1月', '2月', '3月', '4月']))
}

function initWaterChart() {
  if (!waterChartRef.value) return
  waterChart = echarts.init(waterChartRef.value)
  waterChart.setOption(baseOption('吨/台', [3.2, 3.5, 2.9, 3.1], [2.8, 2.7, 2.5, 2.4], [2.2, 2.1, 2.0, 1.9], ['1月', '2月', '3月', '4月']))
}

function initGasChart() {
  if (!gasChartRef.value) return
  gasChart = echarts.init(gasChartRef.value)
  gasChart.setOption(baseOption('m³/台', [8.5, 9.0, 7.8, 8.2], [7.0, 6.8, 6.5, 6.3], [5.5, 5.3, 5.0, 4.8], ['1月', '2月', '3月', '4月']))
}

function handleResize() {
  electricChart?.resize()
  waterChart?.resize()
  gasChart?.resize()
}

onMounted(() => {
  initElectricChart()
  window.addEventListener('resize', handleResize)
})

watch(activeTab, (val) => {
  nextTick(() => {
    if (val === 'water' && !waterChart) initWaterChart()
    if (val === 'gas' && !gasChart) initGasChart()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  electricChart?.dispose()
  waterChart?.dispose()
  gasChart?.dispose()
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
.card-compare {
  font-size: 12px;
  margin-top: 4px;
}
</style>

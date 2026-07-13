<template>
  <gi-page-layout>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="电耗对标" name="electric">
        <el-card header="电耗对标分析" style="margin-top: 16px">
          <div ref="electricChartRef" style="height: 350px"></div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="水耗对标" name="water">
        <el-card header="水耗对标分析" style="margin-top: 16px">
          <div ref="waterChartRef" style="height: 350px"></div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="气耗对标" name="gas">
        <el-card header="气耗对标分析" style="margin-top: 16px">
          <div ref="gasChartRef" style="height: 350px"></div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import { getEnergyBenchmark, type EnergyBenchmarkData, type EnergyBenchmarkItem } from '@/api/energy'

const activeTab = ref('electric')
const electricChartRef = ref<HTMLDivElement>()
const waterChartRef = ref<HTMLDivElement>()
const gasChartRef = ref<HTMLDivElement>()

let electricChart: EChartsType | null = null
let waterChart: EChartsType | null = null
let gasChart: EChartsType | null = null

const benchmarkData = ref<EnergyBenchmarkData | null>(null)

function createOption(title: string, payload: EnergyBenchmarkItem) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['实际值', '行业标杆', '先进值'] },
    xAxis: { type: 'category', data: payload.xLabels },
    yAxis: { type: 'value', name: title },
    series: [
      { name: '实际值', type: 'bar', data: payload.actual, itemStyle: { color: '#409eff' } },
      { name: '行业标杆', type: 'bar', data: payload.benchmark, itemStyle: { color: '#67c23a' } },
      { name: '先进值', type: 'bar', data: payload.advanced, itemStyle: { color: '#e6a23c' } }
    ]
  }
}

function renderElectric() {
  if (!electricChartRef.value || !benchmarkData.value) return
  if (!electricChart) electricChart = echarts.init(electricChartRef.value)
  electricChart.setOption(createOption(benchmarkData.value.electric.unit, benchmarkData.value.electric))
}

function renderWater() {
  if (!waterChartRef.value || !benchmarkData.value) return
  if (!waterChart) waterChart = echarts.init(waterChartRef.value)
  waterChart.setOption(createOption(benchmarkData.value.water.unit, benchmarkData.value.water))
}

function renderGas() {
  if (!gasChartRef.value || !benchmarkData.value) return
  if (!gasChart) gasChart = echarts.init(gasChartRef.value)
  gasChart.setOption(createOption(benchmarkData.value.gas.unit, benchmarkData.value.gas))
}

function handleResize() {
  electricChart?.resize()
  waterChart?.resize()
  gasChart?.resize()
}

async function loadBenchmark() {
  const response = await getEnergyBenchmark()
  benchmarkData.value = response.data
  await nextTick()
  renderElectric()
}

onMounted(() => {
  loadBenchmark()
  window.addEventListener('resize', handleResize)
})

watch(activeTab, async (value) => {
  await nextTick()
  if (value === 'water') renderWater()
  if (value === 'gas') renderGas()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  electricChart?.dispose()
  waterChart?.dispose()
  gasChart?.dispose()
})
</script>

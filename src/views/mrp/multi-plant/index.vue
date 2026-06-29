<template>
  <gi-page-layout>
    <template #tool>
      <el-button type="primary" @click="reload">Run Multi-Plant MRP</el-button>
    </template>

    <el-card header="Plant Capacity Utilization" shadow="never" style="margin-bottom: 16px">
      <div ref="chartRef" style="width: 100%; height: 300px"></div>
    </el-card>

    <gi-table :columns="columns" :data="results" border stripe>
      <template #type="{ row }">
        <el-tag :type="row.type === 'transfer' ? 'warning' : row.type === 'purchase' ? 'primary' : 'success'" size="small">
          {{ row.type }}
        </el-tag>
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { TableColumnItem } from 'gi-component'
import { getMultiPlantMRP } from '@/api/mrp'

const chartRef = ref<HTMLElement | null>(null)
const results = ref<any[]>([])
const plantCapacity = ref<any[]>([])
let chart: EChartsType | null = null

const columns: TableColumnItem<any>[] = [
  { prop: 'material', label: 'Material', minWidth: 160 },
  { prop: 'from_plant', label: 'From Plant', minWidth: 120 },
  { prop: 'to_plant', label: 'To Plant', minWidth: 120 },
  { prop: 'qty', label: 'Qty', minWidth: 80, align: 'center' },
  { label: 'Type', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'suggestion', label: 'Suggestion', minWidth: 260 }
]

function renderChart() {
  if (!chartRef.value) return
  chart ??= echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['Capacity', 'Used'] },
    xAxis: { type: 'category', data: plantCapacity.value.map((item) => item.plant) },
    yAxis: { type: 'value', name: 'Capacity' },
    series: [
      { name: 'Capacity', type: 'bar', data: plantCapacity.value.map((item) => item.capacity), itemStyle: { color: '#409eff' }, barGap: '10%' },
      {
        name: 'Used',
        type: 'bar',
        data: plantCapacity.value.map((item) => item.used),
        itemStyle: { color: '#67c23a' },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${plantCapacity.value[params.dataIndex]?.utilization ?? 0}%`
        }
      }
    ]
  })
}

async function loadData() {
  const res = await getMultiPlantMRP({ page: 1, page_size: 100 })
  plantCapacity.value = res.data.plantCapacity || []
  results.value = res.data.results || []
  await nextTick()
  renderChart()
}

async function reload() {
  await loadData()
  ElMessage.success('Multi-plant MRP finished')
}

function handleResize() {
  chart?.resize()
}

onMounted(async () => {
  await loadData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<template>
  <gi-page-layout>
    <template #tool>
      <el-button type="primary" @click="reload">执行多工厂 MRP</el-button>
    </template>

    <el-card header="工厂产能利用率" shadow="never" style="margin-bottom: 16px">
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
  { prop: 'material', label: '物料', minWidth: 160 },
  { prop: 'from_plant', label: '调出工厂', minWidth: 120 },
  { prop: 'to_plant', label: '调入工厂', minWidth: 120 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'suggestion', label: '建议', minWidth: 260 }
]

function renderChart() {
  if (!chartRef.value) return
  chart ??= echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总产能', '已使用'] },
    xAxis: { type: 'category', data: plantCapacity.value.map((item) => item.plant) },
    yAxis: { type: 'value', name: '产能' },
    series: [
      { name: '总产能', type: 'bar', data: plantCapacity.value.map((item) => item.capacity), itemStyle: { color: '#409eff' }, barGap: '10%' },
      {
        name: '已使用',
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
  const res = await getMultiPlantMRP({ pageNum: 1, pageSize: 100 })
  plantCapacity.value = res.data.plantCapacity || []
  results.value = res.data.results || []
  await nextTick()
  renderChart()
}

async function reload() {
  await loadData()
  ElMessage.success('多工厂 MRP 已完成')
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

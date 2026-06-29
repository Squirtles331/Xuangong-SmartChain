<template>
  <gi-page-layout>
    <template #tool><el-button type="primary" @click="runMRP">运行多工厂MRP</el-button></template>

    <!-- 各工厂产能利用率柱状图对比 -->
    <el-card header="各工厂产能利用率" shadow="never" style="margin-bottom: 16px">
      <div ref="chartRef" style="width: 100%; height: 300px"></div>
    </el-card>

    <gi-table :columns="cols" :data="results" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'transfer' ? 'warning' : row.type === 'purchase' ? 'primary' : 'success'" size="small">{{
          row.type === 'transfer' ? '调拨' : row.type === 'purchase' ? '采购' : '生产'
        }}</el-tag></template
      >
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { TableColumnItem } from 'gi-component'

const chartRef = ref<HTMLElement | null>(null)

const plantCapacity = [
  { plant: '一工厂', utilization: 85, capacity: 1000, used: 850 },
  { plant: '二工厂', utilization: 62, capacity: 800, used: 496 },
  { plant: '三工厂', utilization: 94, capacity: 600, used: 564 }
]

function initChart() {
  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['产能', '已用'] },
    xAxis: { type: 'category', data: plantCapacity.map((p) => p.plant) },
    yAxis: { type: 'value', name: '产能' },
    series: [
      {
        name: '产能',
        type: 'bar',
        data: plantCapacity.map((p) => p.capacity),
        itemStyle: { color: '#409eff' },
        barGap: '10%'
      },
      {
        name: '已用',
        type: 'bar',
        data: plantCapacity.map((p) => p.used),
        itemStyle: { color: '#67c23a' },
        label: { show: true, position: 'top', formatter: (p: any) => `${((p.value / plantCapacity[p.dataIndex].capacity) * 100).toFixed(0)}%` }
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => initChart())
})
const results = ref([
  { id: '1', material: '泵体铸件', from_plant: '一工厂', to_plant: '二工厂', qty: 200, type: 'transfer', suggestion: '从一工厂调拨200件到二工厂' },
  { id: '2', material: '轴承 6308', from_plant: '二工厂', to_plant: '一工厂', qty: 50, type: 'transfer', suggestion: '从二工厂调拨50件到一工厂' },
  { id: '3', material: '45#圆钢 φ50', from_plant: '-', to_plant: '一工厂', qty: 300, type: 'purchase', suggestion: '一工厂采购300kg' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'from_plant', label: '来源工厂', minWidth: 100 },
  { prop: 'to_plant', label: '目标工厂', minWidth: 100 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '类型', minWidth: 70, slotName: 'type', align: 'center' },
  { prop: 'suggestion', label: '建议', minWidth: 250 }
]
function runMRP() {
  ElMessage.success('多工厂MRP运算完成')
}
</script>

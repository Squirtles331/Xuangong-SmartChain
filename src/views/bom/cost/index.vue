<template>
  <gi-page-layout>
    <template #header>
      <div class="cost-header">
        <el-select v-model="bom" placeholder="选择 BOM 版本" style="width: 280px">
          <el-option v-for="item in boms" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" @click="calc">计算成本</el-button>
      </div>
    </template>

    <gi-table v-if="costData.length" :columns="costColumns" :data="costData" border stripe>
      <template #material_cost="{ row }">{{ formatCost(row.material_cost) }}</template>
      <template #labor_cost="{ row }">{{ formatCost(row.labor_cost) }}</template>
      <template #overhead="{ row }">{{ formatCost(row.overhead) }}</template>
      <template #total="{ row }"
        ><strong>{{ formatCost(row.total) }}</strong></template
      >
    </gi-table>

    <el-empty v-else description="选择 BOM 版本并点击计算成本" />

    <el-card v-if="costData.length" header="成本构成分析" shadow="never" style="margin-top: 16px">
      <div ref="pieChartRef" style="width: 100%; height: 400px"></div>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'

interface CostItem {
  level: number | string
  material: string
  qty: number
  material_cost: number
  labor_cost: number
  overhead: number
  total: number
}

const boms = ['MBOM V1.2（生效中）', 'MBOM V1.1（已归档）']
const bom = ref('MBOM V1.2（生效中）')
const costData = ref<CostItem[]>([])

const costColumns: TableColumnItem<CostItem>[] = [
  { prop: 'level', label: '层级', minWidth: 70, align: 'center' },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'qty', label: '用量', minWidth: 90, align: 'center' },
  { prop: 'material_cost', label: '材料成本', minWidth: 120, align: 'right', slotName: 'material_cost' },
  { prop: 'labor_cost', label: '人工成本', minWidth: 120, align: 'right', slotName: 'labor_cost' },
  { prop: 'overhead', label: '制造费用', minWidth: 120, align: 'right', slotName: 'overhead' },
  { prop: 'total', label: '合计', minWidth: 120, align: 'right', slotName: 'total' }
]

function calc() {
  costData.value = [
    { level: 0, material: '泵体铸件', qty: 1, material_cost: 850, labor_cost: 0, overhead: 0, total: 850 },
    { level: 0, material: '耐磨环', qty: 2, material_cost: 120, labor_cost: 0, overhead: 0, total: 240 },
    { level: 0, material: '螺栓 M16×60', qty: 8, material_cost: 20, labor_cost: 0, overhead: 0, total: 20 },
    { level: 1, material: '泵体组件', qty: 1, material_cost: 1110, labor_cost: 180, overhead: 54, total: 1344 },
    { level: 1, material: '叶轮组件', qty: 1, material_cost: 580, labor_cost: 120, overhead: 36, total: 736 },
    { level: '汇总', material: '离心泵 XJP-100', qty: 1, material_cost: 3520, labor_cost: 820, overhead: 246, total: 4586 }
  ]
}

function formatCost(value: number) {
  if (!value) return '-'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const pieChartRef = ref<HTMLDivElement>()
let pieChart: echarts.ECharts | null = null

function handlePieResize() {
  pieChart?.resize()
}

function initPieChart() {
  if (!pieChartRef.value || !costData.value.length) return
  const totalItem = costData.value.find((item) => item.level === '汇总')
  if (!totalItem) return

  pieChart?.dispose()
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    title: { text: '成本构成分析', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        name: '成本构成',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['55%', '50%'],
        label: { formatter: '{b}\n{c} 元' },
        data: [
          { value: totalItem.material_cost, name: '材料成本' },
          { value: totalItem.labor_cost, name: '人工成本' },
          { value: totalItem.overhead, name: '制造费用' }
        ]
      }
    ]
  })

  window.addEventListener('resize', handlePieResize)
}

watch(costData, () => {
  nextTick(() => initPieChart())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handlePieResize)
  pieChart?.dispose()
})
</script>

<style scoped>
.cost-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

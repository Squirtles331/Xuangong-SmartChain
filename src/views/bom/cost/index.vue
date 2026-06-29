<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <el-select v-model="bom" placeholder="选择BOM版本" style="width: 300px">
        <el-option v-for="b in boms" :key="b" :label="b" :value="b" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="calc">计算成本</el-button>
    </template>
    <gi-table v-if="costData.length" :columns="costColumns" :data="pagedCost" :pagination="pagination" border stripe>
      <template #material_cost="{ row }">{{ formatCost(row.material_cost) }}</template>
      <template #labor_cost="{ row }">{{ formatCost(row.labor_cost) }}</template>
      <template #overhead="{ row }">{{ formatCost(row.overhead) }}</template>
      <template #total="{ row }">
        <strong>{{ formatCost(row.total) }}</strong>
      </template>
    </gi-table>
    <el-empty v-else description="选择BOM版本并点击计算" />

    <!-- 成本构成饼图 -->
    <el-card v-if="costData.length" header="成本构成分析" shadow="never" style="margin-top: 16px">
      <div ref="pieChartRef" style="width: 100%; height: 400px"></div>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
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

const boms = ['MBOM V1.2 (生效中)', 'MBOM V1.1 (已归档)']
const bom = ref('MBOM V1.2 (生效中)')
const costData = ref<CostItem[]>([])

function calc() {
  costData.value = [
    { level: 0, material: '泵体铸件', qty: 1, material_cost: 850, labor_cost: 0, overhead: 0, total: 850 },
    { level: 0, material: '耐磨环', qty: 2, material_cost: 120, labor_cost: 0, overhead: 0, total: 240 },
    { level: 0, material: '螺栓 M16×60', qty: 8, material_cost: 2.5, labor_cost: 0, overhead: 0, total: 20 },
    { level: 1, material: '泵体组件', qty: 1, material_cost: 1110, labor_cost: 180, overhead: 54, total: 1344 },
    { level: 1, material: '叶轮组件', qty: 1, material_cost: 580, labor_cost: 120, overhead: 36, total: 736 },
    { level: 'N', material: '离心泵 XJP-100', qty: 1, material_cost: 3520, labor_cost: 820, overhead: 246, total: 4586 }
  ]
}

const costColumns: TableColumnItem<CostItem>[] = [
  { prop: 'level', label: '层级', width: 60 },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'qty', label: '用量', width: 80, align: 'center' },
  { prop: 'material_cost', label: '材料成本', width: 120, align: 'right', slotName: 'material_cost' },
  { prop: 'labor_cost', label: '人工成本', width: 120, align: 'right', slotName: 'labor_cost' },
  { prop: 'overhead', label: '制造费用', width: 120, align: 'right', slotName: 'overhead' },
  { prop: 'total', label: '合计', width: 120, align: 'right', slotName: 'total' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
watch(
  costData,
  (val) => {
    pagination.total = val.length
  },
  { immediate: true }
)
const pagedCost = computed(() => {
  const s = (pagination.currentPage - 1) * pagination.pageSize
  return costData.value.slice(s, s + pagination.pageSize)
})

function formatCost(val: number): string {
  if (val === 0 || val == null) return '-'
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 成本构成饼图
const pieChartRef = ref<HTMLDivElement>()
let pieChart: echarts.ECharts | null = null

function initPieChart() {
  if (!pieChartRef.value || costData.value.length === 0) return
  if (pieChart) pieChart.dispose()
  pieChart = echarts.init(pieChartRef.value)

  const topLevel = costData.value.filter((r) => r.level === 'N')
  if (topLevel.length === 0) return
  const item = topLevel[0]

  pieChart.setOption({
    title: { text: '成本构成分析', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        name: '成本构成',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['55%', '50%'],
        label: { formatter: '{b}\n¥{c}' },
        data: [
          { value: item.material_cost, name: '材料成本' },
          { value: item.labor_cost, name: '人工成本' },
          { value: item.overhead, name: '制造费用' }
        ]
      }
    ]
  })
}

watch(costData, () => {
  nextTick(() => initPieChart())
})
</script>

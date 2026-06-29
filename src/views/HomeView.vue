<template>
  <div class="dashboard-v2">
    <el-row :gutter="16" class="top-row">
      <el-col :span="6" v-for="c in topCards" :key="c.title"
        ><el-card shadow="hover" class="top-card"
          ><div class="top-title">{{ c.title }}</div>
          <div class="top-value" :style="{ color: c.color }">
            {{ c.value }}<span class="top-unit">{{ c.unit }}</span>
          </div>
          <div class="top-trend">
            <span :style="{ color: c.trend > 0 ? '#f56c6c' : '#67c23a' }">{{ c.trend > 0 ? '↑' : '↓' }}{{ Math.abs(c.trend) }}%</span> 较上月
          </div></el-card
        ></el-col
      >
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16"
        ><el-card header="经营趋势"><div ref="chart1" style="height: 300px"></div></el-card
      ></el-col>
      <el-col :span="8"
        ><el-card header="工单状态分布"><div ref="chart2" style="height: 300px"></div></el-card
      ></el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12"
        ><el-card header="车间产能利用率"><div ref="chart3" style="height: 280px"></div></el-card
      ></el-col>
      <el-col :span="12"
        ><el-card header="本月Top10产品产量"><gi-table :columns="rankCols" :data="rankData" border stripe size="small" /></el-card
      ></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { TableColumnItem } from 'gi-component'
import { workOrders, salesOrders } from '@/mock'

// 从 mock 数据计算 topCards
const topCards = computed(() => {
  const completedOrders = salesOrders.filter((o: any) => o.status === 'completed')
  const revenue = completedOrders.reduce((sum: number, o: any) => sum + o.amount, 0) / 10000
  const activeWos = workOrders.filter((wo: any) => wo.status === 'in_progress' || wo.status === 'released').length
  const totalWos = workOrders.length
  const completedWos = workOrders.filter((wo: any) => wo.status === 'completed' || wo.status === 'closed').length
  const oee = totalWos > 0 ? Math.min(95, 65 + (completedWos / totalWos) * 25) : 0
  const deliveryRate = completedOrders.length > 0 ? 94.2 : 92.0

  return [
    { title: '本月营收', value: Math.round(revenue || 850), unit: '万元', trend: 12.5, color: '#409eff' },
    { title: '在制工单', value: activeWos || 28, unit: '单', trend: -5.2, color: '#67c23a' },
    { title: '设备OEE', value: Number(oee.toFixed(1)), unit: '%', trend: 3.1, color: '#e6a23c' },
    { title: '订单交付率', value: deliveryRate, unit: '%', trend: 1.8, color: '#f56c6c' }
  ]
})
const chart1 = ref()
const chart2 = ref()
const chart3 = ref()
let chart1Instance: echarts.ECharts | null = null
let chart2Instance: echarts.ECharts | null = null
let chart3Instance: echarts.ECharts | null = null

function handleResize() {
  chart1Instance?.resize()
  chart2Instance?.resize()
  chart3Instance?.resize()
}

onMounted(() => {
  if (chart1.value) {
    chart1Instance = echarts.init(chart1.value)
    chart1Instance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '成本', '利润'] },
      xAxis: { type: 'category', data: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '营收', type: 'bar', data: [680, 720, 780, 750, 820, 800, 850], itemStyle: { color: '#409eff' } },
        { name: '成本', type: 'bar', data: [520, 550, 580, 570, 600, 590, 620], itemStyle: { color: '#e6a23c' } },
        { name: '利润', type: 'line', data: [160, 170, 200, 180, 220, 210, 230], itemStyle: { color: '#67c23a' } }
      ]
    })
  }
  if (chart2.value) {
    const statusCount: Record<string, number> = { released: 0, in_progress: 0, completed: 0, draft: 0, closed: 0 }
    workOrders.forEach((wo: any) => {
      const s = wo.status
      if (s === 'released') statusCount.released++
      else if (s === 'in_progress') statusCount.in_progress++
      else if (s === 'completed') statusCount.completed++
      else if (s === 'draft' || s === 'approved') statusCount.draft++
      else if (s === 'closed') statusCount.closed++
    })
    chart2Instance = echarts.init(chart2.value)
    chart2Instance.setOption({
      series: [
        {
          type: 'pie',
          radius: ['55%', '80%'],
          data: [
            { value: statusCount.released || 12, name: '已下发' },
            { value: statusCount.in_progress || 28, name: '生产中' },
            { value: statusCount.completed || 8, name: '已完工' },
            { value: statusCount.draft || 5, name: '待审批' },
            { value: statusCount.closed || 3, name: '已关闭' }
          ],
          label: { formatter: '{b}\n{d}%' }
        }
      ]
    })
  }
  if (chart3.value) {
    chart3Instance = echarts.init(chart3.value)
    chart3Instance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['一车间', '二车间', '装配车间'] },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六'] },
      yAxis: { type: 'value', max: 100 },
      series: [
        { name: '一车间', type: 'line', data: [85, 88, 82, 90, 86, 45], itemStyle: { color: '#409eff' } },
        { name: '二车间', type: 'line', data: [78, 80, 75, 82, 79, 40], itemStyle: { color: '#67c23a' } },
        { name: '装配车间', type: 'line', data: [92, 90, 88, 95, 91, 50], itemStyle: { color: '#e6a23c' } }
      ]
    })
  }
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart1Instance?.dispose()
  chart2Instance?.dispose()
  chart3Instance?.dispose()
})
// Top10 产品产量：从工单数据聚合
const rankData = computed(() => {
  const map = new Map<string, number>()
  workOrders.forEach((wo: any) => {
    const name = wo.material_name
    map.set(name, (map.get(name) || 0) + (wo.completed_qty || 0))
  })
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([material, qty], i) => ({ rank: i + 1, material, qty }))
})
const rankCols: TableColumnItem<any>[] = [
  { type: 'index', label: '#', minWidth: 50 },
  { prop: 'material', label: '产品', minWidth: 180 },
  { prop: 'qty', label: '产量', minWidth: 80, align: 'center' }
]
</script>
<style scoped>
.dashboard-v2 {
  padding: 0;
}
.top-row {
  margin-bottom: 0;
}
.top-card :deep(.el-card__body) {
  padding: 20px;
}
.top-title {
  font-size: 13px;
  color: #909399;
}
.top-value {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
}
.top-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
.top-trend {
  font-size: 12px;
  color: #909399;
}

/* 设计规范统一 */
:deep(.el-card) {
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}
:deep(.el-card:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
</style>

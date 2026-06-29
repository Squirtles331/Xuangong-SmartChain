<template>
  <div class="dashboard-v2">
    <el-row :gutter="16" class="top-row">
      <el-col :span="6" v-for="card in topCards" :key="card.title">
        <el-card shadow="hover" class="top-card">
          <div class="top-title">{{ card.title }}</div>
          <div class="top-value" :style="{ color: card.color }">
            {{ card.value }}<span class="top-unit">{{ card.unit }}</span>
          </div>
          <div class="top-trend">
            <span :style="{ color: card.trend > 0 ? '#f56c6c' : '#67c23a' }">
              {{ card.trend > 0 ? '↑' : '↓' }}{{ Math.abs(card.trend) }}%
            </span>
            较上期
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card header="月度营收趋势">
          <div ref="revenueChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="工单状态分布">
          <div ref="orderStatusChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getHomeCharts } from '@/api/dashboard'

const topCards = ref([
  { title: '本月营收', value: 0, unit: '万元', trend: 0, color: '#409eff' },
  { title: '在制工单', value: 0, unit: '单', trend: 0, color: '#67c23a' },
  { title: '设备OEE', value: 0, unit: '%', trend: 0, color: '#e6a23c' },
  { title: '订单交付率', value: 0, unit: '%', trend: 0, color: '#f56c6c' }
])

const revenueChart = ref<HTMLDivElement>()
const orderStatusChart = ref<HTMLDivElement>()

let revenueInstance: echarts.ECharts | null = null
let orderStatusInstance: echarts.ECharts | null = null

const chartData = ref({
  trend: {
    months: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'],
    revenue: [680, 720, 780, 750, 820, 800, 850],
    cost: [520, 550, 580, 570, 600, 590, 620],
    profit: [160, 170, 200, 180, 220, 210, 230]
  },
  order_status: [
    { value: 12, name: '已下发' },
    { value: 28, name: '生产中' },
    { value: 8, name: '已完工' },
    { value: 5, name: '待审批' },
    { value: 3, name: '已关闭' }
  ]
})

function renderCharts() {
  if (revenueChart.value) {
    revenueInstance ??= echarts.init(revenueChart.value)
    revenueInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '成本', '利润'] },
      xAxis: { type: 'category', data: chartData.value.trend.months },
      yAxis: { type: 'value' },
      series: [
        { name: '营收', type: 'line', data: chartData.value.trend.revenue, smooth: true, itemStyle: { color: '#409eff' } },
        { name: '成本', type: 'line', data: chartData.value.trend.cost, smooth: true, itemStyle: { color: '#e6a23c' } },
        { name: '利润', type: 'line', data: chartData.value.trend.profit, smooth: true, itemStyle: { color: '#67c23a' } }
      ],
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
    })
  }

  if (orderStatusChart.value) {
    orderStatusInstance ??= echarts.init(orderStatusChart.value)
    orderStatusInstance.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', top: 'center' },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['55%', '50%'],
          data: chartData.value.order_status,
          label: { formatter: '{b}\n{d}%' }
        }
      ]
    })
  }
}

async function loadDashboard() {
  const [statsRes, chartsRes] = await Promise.all([getDashboardStats(), getHomeCharts()])

  topCards.value = [
    { title: '本月营收', value: statsRes.data.revenue ?? 850, unit: '万元', trend: statsRes.data.revenue_trend ?? 12.5, color: '#409eff' },
    { title: '在制工单', value: statsRes.data.active_orders ?? 28, unit: '单', trend: statsRes.data.orders_trend ?? -5.2, color: '#67c23a' },
    { title: '设备OEE', value: statsRes.data.oee ?? 78.5, unit: '%', trend: statsRes.data.oee_trend ?? 3.1, color: '#e6a23c' },
    { title: '订单交付率', value: statsRes.data.delivery_rate ?? 94.2, unit: '%', trend: statsRes.data.delivery_trend ?? 1.8, color: '#f56c6c' }
  ]

  chartData.value = {
    trend: chartsRes.data.trend || chartData.value.trend,
    order_status: chartsRes.data.order_status || chartData.value.order_status
  }

  renderCharts()
}

function handleResize() {
  revenueInstance?.resize()
  orderStatusInstance?.resize()
}

onMounted(async () => {
  await loadDashboard()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  revenueInstance?.dispose()
  orderStatusInstance?.dispose()
})
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

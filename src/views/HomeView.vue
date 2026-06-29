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
import { getDashboardStats, getHomeCharts } from '@/api/dashboard'

// 从 API 数据计算 topCards
const topCards = ref([
  { title: '本月营收', value: 0, unit: '万元', trend: 0, color: '#409eff' },
  { title: '在制工单', value: 0, unit: '单', trend: 0, color: '#67c23a' },
  { title: '设备OEE', value: 0, unit: '%', trend: 0, color: '#e6a23c' },
  { title: '订单交付率', value: 0, unit: '%', trend: 0, color: '#f56c6c' }
])

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

const rankData = ref<any[]>([])
const rankCols: TableColumnItem<any>[] = [
  { type: 'index', label: '#', minWidth: 50 },
  { prop: 'material', label: '产品', minWidth: 180 },
  { prop: 'qty', label: '产量', minWidth: 80, align: 'center' }
]

async function fetchDashboardData() {
  try {
    const [statsRes, chartsRes] = await Promise.all([
      getDashboardStats(),
      getHomeCharts()
    ])

    if (statsRes.data) {
      const s = statsRes.data
      topCards.value = [
        { title: '本月营收', value: s.revenue ?? 850, unit: '万元', trend: s.revenue_trend ?? 12.5, color: '#409eff' },
        { title: '在制工单', value: s.active_orders ?? 28, unit: '单', trend: s.orders_trend ?? -5.2, color: '#67c23a' },
        { title: '设备OEE', value: s.oee ?? 85.2, unit: '%', trend: s.oee_trend ?? 3.1, color: '#e6a23c' },
        { title: '订单交付率', value: s.delivery_rate ?? 94.2, unit: '%', trend: s.delivery_trend ?? 1.8, color: '#f56c6c' }
      ]
      rankData.value = s.top_products || []
    }

    if (chartsRes.data) {
      const c = chartsRes.data
      // Init charts with API data
      initCharts(c)
    }
  } catch {
    // Fallback with default charts
    initCharts(null)
  }
}

function initCharts(chartData: any) {
  if (chart1.value) {
    chart1Instance = echarts.init(chart1.value)
    chart1Instance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '成本', '利润'] },
      xAxis: { type: 'category', data: chartData?.trend?.months || ['7月', '8月', '9月', '10月', '11月', '12月', '1月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '营收', type: 'bar', data: chartData?.trend?.revenue || [680, 720, 780, 750, 820, 800, 850], itemStyle: { color: '#409eff' } },
        { name: '成本', type: 'bar', data: chartData?.trend?.cost || [520, 550, 580, 570, 600, 590, 620], itemStyle: { color: '#e6a23c' } },
        { name: '利润', type: 'line', data: chartData?.trend?.profit || [160, 170, 200, 180, 220, 210, 230], itemStyle: { color: '#67c23a' } }
      ]
    })
  }
  if (chart2.value) {
    chart2Instance = echarts.init(chart2.value)
    chart2Instance.setOption({
      series: [
        {
          type: 'pie',
          radius: ['55%', '80%'],
          data: chartData?.order_status || [
            { value: 12, name: '已下发' },
            { value: 28, name: '生产中' },
            { value: 8, name: '已完工' },
            { value: 5, name: '待审批' },
            { value: 3, name: '已关闭' }
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
      legend: { data: chartData?.capacity?.legend || ['一车间', '二车间', '装配车间'] },
      xAxis: { type: 'category', data: chartData?.capacity?.days || ['周一', '周二', '周三', '周四', '周五', '周六'] },
      yAxis: { type: 'value', max: 100 },
      series: (chartData?.capacity?.series || [
        { name: '一车间', data: [85, 88, 82, 90, 86, 45], itemStyle: { color: '#409eff' } },
        { name: '二车间', data: [78, 80, 75, 82, 79, 40], itemStyle: { color: '#67c23a' } },
        { name: '装配车间', data: [92, 90, 88, 95, 91, 50], itemStyle: { color: '#e6a23c' } }
      ]).map((s: any) => ({ ...s, type: 'line' }))
    })
  }
}

onMounted(() => {
  fetchDashboardData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart1Instance?.dispose()
  chart2Instance?.dispose()
  chart3Instance?.dispose()
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

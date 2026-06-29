<template>
  <div class="dashboard-v2">
    <el-row :gutter="16" class="top-row">
      <el-col :span="6" v-for="c in topCards" :key="c.title">
        <el-card shadow="hover" class="top-card">
          <div class="top-title">{{ c.title }}</div>
          <div class="top-value" :style="{ color: c.color }">
            {{ c.value }}<span class="top-unit">{{ c.unit }}</span>
          </div>
          <div class="top-trend">
            <span :style="{ color: c.trend > 0 ? '#f56c6c' : '#67c23a' }"> {{ c.trend > 0 ? '↑' : '↓' }}{{ Math.abs(c.trend) }}% </span>
            较上月
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const topCards = [
  { title: '本月营收', value: 850, unit: '万元', trend: 12.5, color: '#409eff' },
  { title: '在制工单', value: 28, unit: '单', trend: -5.2, color: '#67c23a' },
  { title: '设备OEE', value: 78.5, unit: '%', trend: 3.1, color: '#e6a23c' },
  { title: '订单交付率', value: 94.2, unit: '%', trend: 1.8, color: '#f56c6c' }
]

const revenueChart = ref()
const orderStatusChart = ref()

let revenueInstance: echarts.ECharts | null = null
let orderStatusInstance: echarts.ECharts | null = null

function initRevenueChart() {
  if (!revenueChart.value) return
  revenueInstance = echarts.init(revenueChart.value)
  revenueInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收', '成本', '利润'] },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '营收',
        type: 'line',
        data: [620, 650, 700, 720, 750, 780, 800, 820, 830, 850, 860, 880],
        smooth: true,
        itemStyle: { color: '#409eff' }
      },
      {
        name: '成本',
        type: 'line',
        data: [480, 500, 530, 540, 560, 580, 590, 600, 610, 620, 630, 640],
        smooth: true,
        itemStyle: { color: '#e6a23c' }
      },
      {
        name: '利润',
        type: 'line',
        data: [140, 150, 170, 180, 190, 200, 210, 220, 220, 230, 230, 240],
        smooth: true,
        itemStyle: { color: '#67c23a' }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  })
}

function initOrderStatusChart() {
  if (!orderStatusChart.value) return
  orderStatusInstance = echarts.init(orderStatusChart.value)
  orderStatusInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['55%', '50%'],
        data: [
          { value: 12, name: '待审批' },
          { value: 28, name: '生产中' },
          { value: 15, name: '已完工' },
          { value: 8, name: '已下发' },
          { value: 5, name: '已关闭' }
        ],
        label: { formatter: '{b}\n{d}%' },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
        }
      }
    ]
  })
}

function handleResize() {
  revenueInstance?.resize()
  orderStatusInstance?.resize()
}

onMounted(() => {
  initRevenueChart()
  initOrderStatusChart()
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

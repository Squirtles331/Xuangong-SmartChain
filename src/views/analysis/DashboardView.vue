<template>
  <div class="dashboard-view">
    <div class="page-header">
      <h2>数据面板</h2>
    </div>

    <div class="page-content">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon style="font-size: 24px; color: #409eff"><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">1,234</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon style="font-size: 24px; color: #67c23a"><TrendCharts /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">5,678</div>
                <div class="stat-label">今日访问量</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon style="font-size: 24px; color: #e6a23c"><Coin /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">89.5%</div>
                <div class="stat-label">转化率</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon style="font-size: 24px; color: #f56c6c"><Warning /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">12</div>
                <div class="stat-label">待处理警告</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" style="margin-top: 16px">
        <el-col :span="12">
          <el-card title="访问趋势">
            <div ref="trendChart" style="height: 300px"></div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card title="用户分布">
            <div ref="pieChart" style="height: 300px"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { User, TrendCharts, Coin, Warning } from '@element-plus/icons-vue'

const trendChart = ref<HTMLDivElement | null>(null)
const pieChart = ref<HTMLDivElement | null>(null)
let trendChartInstance: echarts.ECharts | null = null
let pieChartInstance: echarts.ECharts | null = null

onMounted(() => {
  // 趋势图
  if (trendChart.value) {
    trendChartInstance = echarts.init(trendChart.value)
    trendChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          smooth: true
        }
      ]
    })
  }

  // 饼图
  if (pieChart.value) {
    pieChartInstance = echarts.init(pieChart.value)
    pieChartInstance.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '用户分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '北京' },
            { value: 735, name: '上海' },
            { value: 580, name: '广州' },
            { value: 484, name: '深圳' },
            { value: 300, name: '其他' }
          ]
        }
      ]
    })
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChartInstance?.dispose()
  pieChartInstance?.dispose()
})

function handleResize() {
  trendChartInstance?.resize()
  pieChartInstance?.resize()
}
</script>

<style scoped>
.dashboard-view {
  height: 100%;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-content {
  background-color: #fff;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}
</style>

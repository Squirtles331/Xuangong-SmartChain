<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
            <div class="stat-icon" :style="{ backgroundColor: card.color }">
              <el-icon :size="28" color="white"><component :is="card.icon" /></el-icon>
            </div>
          </div>
          <div class="stat-footer">
            <span :style="{ color: card.trend > 0 ? '#67c23a' : '#f56c6c' }"> {{ card.trend > 0 ? '↑' : '↓' }} {{ Math.abs(card.trend) }}% </span>
            <span style="color: #909399; margin-left: 8px">较上周</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办 + 图表 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="我的待办" shadow="hover">
          <div v-if="todos.length === 0" style="text-align: center; padding: 40px; color: #909399">暂无待办</div>
          <div v-for="todo in todos" :key="todo.id" class="todo-item">
            <el-tag :type="todo.tagType" size="small" style="margin-right: 8px">{{ todo.tag }}</el-tag>
            <span class="todo-text">{{ todo.text }}</span>
            <span class="todo-time">{{ todo.time }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="快捷入口" shadow="hover">
          <el-row :gutter="12">
            <el-col :span="8" v-for="link in quickLinks" :key="link.title" style="margin-bottom: 12px">
              <div class="quick-link" @click="$router.push(link.path)">
                <el-icon :size="24" :color="link.color"><component :is="link.icon" /></el-icon>
                <span class="quick-link-text">{{ link.title }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card header="本周工单完成趋势" shadow="hover">
          <div ref="chartRef1" style="height: 280px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="工单状态分布" shadow="hover">
          <div ref="chartRef2" style="height: 280px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Tickets, DataLine, Monitor, Document, TrendCharts, Setting, User, List } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// ==================== 统计卡片 ====================
const statCards = [
  { title: '在制工单', value: 28, icon: Tickets, color: '#409eff', trend: 12 },
  { title: '今日报工', value: 156, icon: DataLine, color: '#67c23a', trend: 8 },
  { title: '待审批', value: 5, icon: Document, color: '#e6a23c', trend: -15 },
  { title: '设备运行率', value: '87%', icon: Monitor, color: '#909399', trend: 3 }
]

// ==================== 待办 ====================
const todos = [
  { id: '1', tag: '审批', tagType: 'warning' as const, text: '工单 WO202501150001 待审批', time: '10分钟前' },
  { id: '2', tag: '质检', tagType: 'primary' as const, text: '工序"精车"已完成，请检验', time: '25分钟前' },
  { id: '3', tag: '异常', tagType: 'danger' as const, text: '工单 WO202501140003 设备故障', time: '1小时前' },
  { id: '4', tag: '预警', tagType: 'warning' as const, text: '物料"45#圆钢φ50"库存低于安全库存', time: '2小时前' },
  { id: '5', tag: '提醒', tagType: 'info' as const, text: '采购订单 PO202501130005 预计今日到货', time: '3小时前' }
]

// ==================== 快捷入口 ====================
const quickLinks = [
  { title: '新建工单', icon: Tickets, color: '#409eff', path: '/work-order/create' },
  { title: '车间看板', icon: Monitor, color: '#67c23a', path: '/work-order/kanban' },
  { title: '报工入口', icon: DataLine, color: '#e6a23c', path: '/work-order/my-tasks' },
  { title: 'BOM管理', icon: List, color: '#409eff', path: '/bom/list' },
  { title: '采购订单', icon: Document, color: '#67c23a', path: '/scm/purchase' },
  { title: '库存查询', icon: TrendCharts, color: '#e6a23c', path: '/wms/inventory' },
  { title: '系统管理', icon: Setting, color: '#909399', path: '/system/user' },
  { title: '我的任务', icon: User, color: '#409eff', path: '/work-order/my-tasks' }
]

// ==================== 图表 ====================
const chartRef1 = ref<HTMLDivElement>()
const chartRef2 = ref<HTMLDivElement>()

onMounted(() => {
  if (chartRef1.value) {
    const chart = echarts.init(chartRef1.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['完工', '不良'] },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [
        { name: '完工', type: 'bar', data: [120, 132, 101, 134, 90, 145, 156], itemStyle: { color: '#409eff' } },
        { name: '不良', type: 'bar', data: [3, 5, 2, 4, 3, 2, 4], itemStyle: { color: '#f56c6c' } }
      ]
    })
  }
  if (chartRef2.value) {
    const chart = echarts.init(chartRef2.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['50%', '75%'],
          data: [
            { value: 12, name: '已下发', itemStyle: { color: '#909399' } },
            { value: 28, name: '生产中', itemStyle: { color: '#409eff' } },
            { value: 8, name: '已完工', itemStyle: { color: '#67c23a' } },
            { value: 5, name: '待审批', itemStyle: { color: '#e6a23c' } }
          ],
          label: { show: true, formatter: '{b}\n{d}%' }
        }
      ]
    })
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 0;
}

.stat-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-footer {
  margin-top: 12px;
  font-size: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}

.todo-text {
  flex: 1;
  font-size: 14px;
}
.todo-time {
  font-size: 12px;
  color: #c0c4cc;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #f5f7fa;
  }
}

.quick-link-text {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
</style>

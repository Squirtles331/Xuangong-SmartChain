<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <div class="aps-header">
        <h2>APS 排程</h2>
        <div>
          <el-button type="primary" @click="runSchedule">运行排程</el-button>
          <el-button @click="$router.push('/aps/history')">历史版本</el-button>
        </div>
      </div>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="工单甘特图" name="gantt">
        <div class="gantt-container">
          <div class="gantt-sidebar">
            <div v-for="wo in ganttData" :key="wo.id" class="gantt-row-label">
              <div class="gantt-wo-code">{{ wo.code }}</div>
              <div class="gantt-wo-name">{{ wo.material }}</div>
            </div>
          </div>
          <div class="gantt-chart" ref="ganttRef">
            <div class="gantt-timeline">
              <div v-for="d in days" :key="d.label" class="gantt-day" :class="{ weekend: d.isWeekend }">{{ d.label }}</div>
            </div>
            <div v-for="wo in ganttData" :key="wo.id" class="gantt-row">
              <div
                v-for="(seg, i) in wo.segments"
                :key="i"
                class="gantt-bar"
                :class="{ 'gantt-bar-conflict': seg.conflict }"
                :style="{ left: seg.left + '%', width: seg.width + '%', backgroundColor: seg.conflict ? '#f56c6c' : seg.color }"
                :title="`${seg.name} (${seg.wc})${seg.conflict ? ' [约束冲突]' : ''}`"
              >
                {{ seg.name }}
                <span v-if="seg.conflict" class="conflict-badge">!</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="工作中心负荷" name="load">
        <div class="load-grid">
          <el-card v-for="wc in loadData" :key="wc.name" shadow="hover" class="load-card">
            <div class="load-header">
              <span class="load-name">{{ wc.name }}</span>
              <el-tag :type="wc.loadPct > 90 ? 'danger' : wc.loadPct > 70 ? 'warning' : 'success'" size="small">{{ wc.loadPct }}%</el-tag>
            </div>
            <el-progress :percentage="wc.loadPct" :stroke-width="16" :color="wc.loadPct > 90 ? '#f56c6c' : wc.loadPct > 70 ? '#e6a23c' : '#67c23a'" />
            <div class="load-detail">{{ wc.used }}h / {{ wc.capacity }}h</div>
          </el-card>
        </div>
        <!-- 周负荷趋势 -->
        <el-card header="周负荷趋势" shadow="never" style="margin-top: 16px">
          <div ref="chartRef" style="height: 300px"></div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="约束冲突" name="conflicts">
        <el-alert v-if="conflicts.length === 0" title="排程通过" description="所有约束检查通过，无冲突" type="success" show-icon :closable="false" />
        <div v-else class="conflict-list">
          <el-alert
            v-for="(c, i) in conflicts"
            :key="i"
            :title="c.operation"
            :description="c.reasons.join('；')"
            :type="c.reasons.length > 1 ? 'error' : 'warning'"
            show-icon
            :closable="false"
            style="margin-bottom: 8px"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { useConstraintStore } from '@/stores/constraint'

const tab = ref('gantt')
const constraintStore = useConstraintStore()
const conflicts = ref<{ operation: string; reasons: string[] }[]>([])

// 甘特图数据
const days = Array.from({ length: 21 }, (_, i) => {
  const d = new Date(2025, 0, 11 + i)
  return { label: `1/${11 + i}`, isWeekend: d.getDay() === 0 || d.getDay() === 6 }
})
const ganttData = ref([
  {
    id: '1',
    code: 'WO001',
    material: '离心泵 XJP-100',
    segments: [
      { name: '下料', wc: '下料组', left: 0, width: 8, color: '#409eff', conflict: false },
      { name: '粗车', wc: '数控车组', left: 8, width: 14, color: '#67c23a', conflict: false },
      { name: '精车', wc: '数控车组', left: 22, width: 10, color: '#e6a23c', conflict: true },
      { name: '钻孔', wc: '钻床组', left: 32, width: 8, color: '#909399', conflict: false },
      { name: '磨削', wc: '磨床组', left: 40, width: 10, color: '#f56c6c', conflict: false },
      { name: '装配', wc: '装配组', left: 50, width: 12, color: '#409eff', conflict: true },
      { name: '试压', wc: '测试组', left: 62, width: 8, color: '#67c23a', conflict: false },
      { name: '油漆', wc: '涂装组', left: 70, width: 10, color: '#e6a23c', conflict: false }
    ]
  },
  {
    id: '2',
    code: 'WO002',
    material: '齿轮箱 GBX-200',
    segments: [
      { name: '下料', wc: '下料组', left: 8, width: 6, color: '#409eff', conflict: false },
      { name: '粗车', wc: '数控车组', left: 24, width: 12, color: '#67c23a', conflict: false },
      { name: '精车', wc: '数控车组', left: 36, width: 8, color: '#e6a23c', conflict: false }
    ]
  },
  {
    id: '3',
    code: 'WO003',
    material: '传动轴 DS-50',
    segments: [
      { name: '车削', wc: '数控车组', left: 44, width: 14, color: '#409eff', conflict: false },
      { name: '磨削', wc: '磨床组', left: 58, width: 10, color: '#f56c6c', conflict: false }
    ]
  }
])

// 负荷数据
const loadData = ref([
  { name: '下料组', capacity: '8h', used: '5.5h', loadPct: 69 },
  { name: '数控车组', capacity: '16h', used: '15h', loadPct: 94 },
  { name: '钻床组', capacity: '8h', used: '4h', loadPct: 50 },
  { name: '磨床组', capacity: '8h', used: '7.5h', loadPct: 94 },
  { name: '装配组', capacity: '8h', used: '6h', loadPct: 75 },
  { name: '测试组', capacity: '8h', used: '3h', loadPct: 38 },
  { name: '涂装组', capacity: '8h', used: '5h', loadPct: 63 },
  { name: '热处理组', capacity: '16h', used: '8h', loadPct: 50 }
])

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['下料组', '数控车组', '磨床组', '装配组'] },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value', name: '负荷(h)' },
      series: [
        { name: '下料组', type: 'line', data: [5, 6, 4, 7, 5, 0, 0], itemStyle: { color: '#409eff' } },
        { name: '数控车组', type: 'line', data: [14, 15, 12, 16, 10, 5, 0], itemStyle: { color: '#67c23a' } },
        { name: '磨床组', type: 'line', data: [6, 7, 5, 8, 7, 3, 0], itemStyle: { color: '#f56c6c' } },
        { name: '装配组', type: 'line', data: [5, 4, 6, 5, 8, 2, 0], itemStyle: { color: '#e6a23c' } }
      ]
    })
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

function runSchedule() {
  const allOps = [
    { op: '工序10:下料', wc: '下料组', qty: 100 },
    { op: '工序20:粗车', wc: '数控车组', qty: 100 },
    { op: '工序30:精车', wc: '数控车组', qty: 100 },
    { op: '工序40:钻孔', wc: '钻床组', qty: 100 },
    { op: '工序50:磨削', wc: '磨床组', qty: 100 },
    { op: '工序60:装配', wc: '装配组', qty: 100 },
    { op: '工序70:试压', wc: '测试组', qty: 100 },
    { op: '工序80:油漆', wc: '涂装组', qty: 100 }
  ]
  conflicts.value = []

  // 收集所有冲突工序名
  const conflictOps = new Set<string>()
  for (const op of allOps) {
    const reasons = constraintStore.checkConflicts(op.op, op.wc, op.qty)
    if (reasons.length > 0) {
      conflicts.value.push({ operation: op.op, reasons })
      // 提取工序名(去掉"工序XX:"前缀)匹配甘特图segment
      const opName = op.op.replace(/^工序\d+:/, '')
      conflictOps.add(opName)
    }
  }

  // 同步冲突状态到甘特图
  for (const wo of ganttData.value) {
    for (const seg of wo.segments) {
      seg.conflict = conflictOps.has(seg.name)
    }
  }

  if (conflicts.value.length === 0) {
    ElMessage.success('排程完成，所有约束通过')
  } else {
    ElMessage.warning(`排程完成，${conflicts.value.length}道工序存在约束冲突，请查看"约束冲突"标签页`)
    tab.value = 'conflicts'
  }
}
</script>

<style scoped>
.aps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.aps-header h2 {
  margin: 0;
  font-size: 18px;
}
.gantt-container {
  display: flex;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  height: 400px;
}
.gantt-sidebar {
  width: 180px;
  border-right: 1px solid #ebeef5;
  flex-shrink: 0;
}
.gantt-row-label {
  padding: 10px 12px;
  border-bottom: 1px solid #ebeef5;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.gantt-wo-code {
  font-weight: 600;
  font-size: 13px;
}
.gantt-wo-name {
  font-size: 11px;
  color: #909399;
}
.gantt-chart {
  flex: 1;
  overflow: auto;
}
.gantt-timeline {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.gantt-day {
  min-width: 40px;
  padding: 8px 4px;
  text-align: center;
  font-size: 11px;
  border-right: 1px solid #ebeef5;
}
.gantt-day.weekend {
  background: #fafafa;
  color: #c0c4cc;
}
.gantt-row {
  height: 40px;
  position: relative;
  border-bottom: 1px solid #ebeef5;
}
.gantt-bar {
  position: absolute;
  top: 6px;
  height: 28px;
  border-radius: 4px;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 4px;
  cursor: pointer;
}
.gantt-bar-conflict {
  animation: conflict-pulse 1.5s ease-in-out infinite;
}
.conflict-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  color: #f56c6c;
  font-size: 11px;
  font-weight: 700;
  margin-left: 4px;
  flex-shrink: 0;
}
@keyframes conflict-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.load-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.load-card :deep(.el-card__body) {
  padding: 16px;
}
.load-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.load-name {
  font-weight: 600;
  font-size: 14px;
}
.load-detail {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>

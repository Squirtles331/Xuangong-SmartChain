<template>
  <gi-page-layout>
    <template #header>
      <div class="aps-header">
        <h2>APS 排程</h2>
        <div>
          <el-button type="primary" @click="handleRunSchedule">运行排程</el-button>
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
          <div class="gantt-chart">
            <div class="gantt-timeline">
              <div v-for="day in days" :key="day.label" class="gantt-day" :class="{ weekend: day.isWeekend }">{{ day.label }}</div>
            </div>
            <div v-for="wo in ganttData" :key="wo.id" class="gantt-row">
              <div
                v-for="(segment, index) in wo.segments"
                :key="index"
                class="gantt-bar"
                :class="{ 'gantt-bar-conflict': segment.conflict }"
                :style="{ left: segment.left + '%', width: segment.width + '%', backgroundColor: segment.conflict ? '#f56c6c' : segment.color }"
                :title="`${segment.name} (${segment.wc})${segment.conflict ? ' [约束冲突]' : ''}`"
              >
                {{ segment.name }}
                <span v-if="segment.conflict" class="conflict-badge">!</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="工作中心负荷" name="load">
        <div class="load-grid">
          <el-card v-for="workCenter in loadData" :key="workCenter.name" shadow="hover" class="load-card">
            <div class="load-header">
              <span class="load-name">{{ workCenter.name }}</span>
              <el-tag :type="workCenter.loadPct > 90 ? 'danger' : workCenter.loadPct > 70 ? 'warning' : 'success'" size="small">
                {{ workCenter.loadPct }}%
              </el-tag>
            </div>
            <el-progress
              :percentage="workCenter.loadPct"
              :stroke-width="16"
              :color="workCenter.loadPct > 90 ? '#f56c6c' : workCenter.loadPct > 70 ? '#e6a23c' : '#67c23a'"
            />
            <div class="load-detail">{{ workCenter.used }} / {{ workCenter.capacity }}</div>
          </el-card>
        </div>
        <el-card header="周负荷趋势" shadow="never" style="margin-top: 16px">
          <div ref="chartRef" style="height: 300px"></div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="约束冲突" name="conflicts">
        <el-alert v-if="conflicts.length === 0" title="排程通过" description="所有约束检查通过，无冲突" type="success" show-icon :closable="false" />
        <div v-else class="conflict-list">
          <el-alert
            v-for="(conflict, index) in conflicts"
            :key="index"
            :title="conflict.operation"
            :description="conflict.reasons.join('；')"
            :type="conflict.reasons.length > 1 ? 'error' : 'warning'"
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
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getApsScheduleData, runApsSchedule } from '@/api/aps'
import { useConstraintStore } from '@/stores/constraint'

const tab = ref('gantt')
const constraintStore = useConstraintStore()

const days = Array.from({ length: 21 }, (_, index) => {
  const current = new Date(2025, 0, 11 + index)
  return { label: `1/${11 + index}`, isWeekend: current.getDay() === 0 || current.getDay() === 6 }
})

const ganttData = ref<any[]>([])
const loadData = ref<any[]>([])
const scheduleOps = ref<{ op: string; wc: string; qty: number }[]>([])
const loadTrend = ref<{ days: string[]; series: { name: string; data: number[]; color: string }[] }>({ days: [], series: [] })
const conflicts = ref<{ operation: string; reasons: string[] }[]>([])

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) return

  chartInstance ??= echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: loadTrend.value.series.map((item) => item.name) },
    xAxis: { type: 'category', data: loadTrend.value.days },
    yAxis: { type: 'value', name: '负荷(h)' },
    series: loadTrend.value.series.map((item) => ({
      name: item.name,
      type: 'line',
      data: item.data,
      itemStyle: { color: item.color }
    }))
  })
}

async function loadSchedule() {
  const res = await getApsScheduleData()
  ganttData.value = JSON.parse(JSON.stringify(res.data.ganttData || []))
  loadData.value = res.data.loadData || []
  scheduleOps.value = res.data.scheduleOps || []
  loadTrend.value = res.data.loadTrend || { days: [], series: [] }
  renderChart()
}

function applyConflicts() {
  const conflictOps = new Set<string>()
  const nextConflicts: { operation: string; reasons: string[] }[] = []

  for (const operation of scheduleOps.value) {
    const reasons = constraintStore.checkConflicts(operation.op, operation.wc, operation.qty)
    if (reasons.length > 0) {
      nextConflicts.push({ operation: operation.op, reasons })
      conflictOps.add(operation.op.replace(/^工序\d+:/, ''))
    }
  }

  conflicts.value = nextConflicts
  ganttData.value.forEach((wo) => {
    wo.segments.forEach((segment: any) => {
      segment.conflict = conflictOps.has(segment.name)
    })
  })
}

async function handleRunSchedule() {
  const res = await runApsSchedule()
  await loadSchedule()
  applyConflicts()

  if (conflicts.value.length === 0) {
    ElMessage.success(res.message || '排程完成，所有约束通过')
    return
  }

  ElMessage.warning(`排程完成，发现 ${conflicts.value.length} 个约束冲突`)
  tab.value = 'conflicts'
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(async () => {
  await loadSchedule()
  applyConflicts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
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

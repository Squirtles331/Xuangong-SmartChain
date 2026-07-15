<template>
  <gi-page-layout>
    <template #header>
      <div class="page-header">
        <div>
          <div class="page-header__title">排程结果</div>
          <div class="page-header__desc">静态展示 APS 输出的排程节奏、负荷状态与冲突提示，不承接执行回写。</div>
        </div>
        <div class="page-header__actions">
          <el-button @click="goHistory">查看历史</el-button>
          <el-button type="primary" @click="handleRunSchedule">重新计算</el-button>
        </div>
      </div>
    </template>

    <div class="stats-grid">
      <el-card shadow="hover" class="stats-card">
        <div class="stats-card__label">排程工单</div>
        <div class="stats-card__value">{{ stats.workOrderCount }}</div>
        <div class="stats-card__hint">当前计划窗口内已纳入排程的工单数量</div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-card__label">冲突数量</div>
        <div class="stats-card__value stats-card__value--danger">{{ stats.conflictCount }}</div>
        <div class="stats-card__hint">需要在 APS 层确认的约束冲突与重排提示</div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-card__label">超载工作中心</div>
        <div class="stats-card__value stats-card__value--warning">{{ stats.overloadedCenters }}</div>
        <div class="stats-card__hint">工作中心负荷超过 90% 的资源数</div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-card__label">平均负荷</div>
        <div class="stats-card__value">{{ stats.averageLoadPct }}%</div>
        <div class="stats-card__hint">最近一次静态计算的整体资源利用水平</div>
      </el-card>
    </div>

    <el-alert
      class="run-alert"
      type="info"
      show-icon
      :closable="false"
      :title="`最近计算时间：${snapshot?.lastRunTime || '--'}`"
      description="排程结果仅用于静态页面验收，后续 mock 与 API 阶段将沿用当前字段结构。"
    />

    <el-tabs v-model="tab">
      <el-tab-pane label="工单甘特" name="gantt">
        <div class="gantt-shell">
          <div class="gantt-sidebar">
            <div v-for="order in ganttData" :key="order.id" class="gantt-row-label">
              <div class="gantt-row-label__top">
                <span class="gantt-wo-code">{{ order.code }}</span>
                <el-tag size="small" effect="plain">{{ priorityLabel(order.priority) }}</el-tag>
              </div>
              <div class="gantt-wo-name">{{ order.material }}</div>
              <div class="gantt-wo-due">交期：{{ order.dueDate }}</div>
            </div>
          </div>
          <div class="gantt-chart">
            <div class="gantt-timeline" :style="timelineStyle">
              <div v-for="day in days" :key="day.label" class="gantt-day" :class="{ weekend: day.isWeekend }">
                {{ day.label }}
              </div>
            </div>
            <div v-for="order in ganttData" :key="order.id" class="gantt-row" :style="timelineStyle">
              <div
                v-for="segment in order.segments"
                :key="`${order.id}-${segment.name}-${segment.wc}`"
                class="gantt-bar"
                :class="{ 'gantt-bar--conflict': segment.conflict }"
                :style="{
                  left: `${segment.left}%`,
                  width: `${segment.width}%`,
                  backgroundColor: segment.conflict ? '#f56c6c' : segment.color
                }"
                :title="`${segment.name} / ${segment.wc}${segment.conflict ? ' / 约束冲突' : ''}`"
              >
                <span>{{ segment.name }}</span>
                <span v-if="segment.conflict" class="conflict-badge">!</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="负荷视图" name="load">
        <div class="load-grid">
          <el-card v-for="item in loadData" :key="item.name" shadow="hover" class="load-card">
            <div class="load-card__header">
              <span class="load-card__name">{{ item.name }}</span>
              <el-tag :type="loadTagType(item.loadPct)" size="small">{{ item.loadPct }}%</el-tag>
            </div>
            <el-progress :percentage="item.loadPct" :stroke-width="14" :color="loadColor(item.loadPct)" />
            <div class="load-card__detail">{{ item.used }} / {{ item.capacity }}</div>
          </el-card>
        </div>

        <el-card shadow="never" class="trend-card">
          <template #header>
            <div class="trend-card__header">
              <span>周负荷趋势</span>
              <span class="trend-card__sub">按主要工作中心观察静态负荷波动</span>
            </div>
          </template>
          <div ref="chartRef" class="trend-chart"></div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="冲突复盘" name="conflicts">
        <el-empty v-if="conflicts.length === 0" description="当前静态排程未发现约束冲突" />
        <div v-else class="conflict-list">
          <el-card v-for="conflict in conflicts" :key="conflict.id" shadow="hover" class="conflict-card">
            <div class="conflict-card__header">
              <div>
                <div class="conflict-card__title">{{ conflict.operation }}</div>
                <div class="conflict-card__sub">{{ conflict.workCenter }}</div>
              </div>
              <StatusTag :value="conflict.severity" :options="severityOptions" />
            </div>

            <div class="conflict-card__section">
              <div class="conflict-card__label">冲突原因</div>
              <ul class="conflict-card__list">
                <li v-for="reason in conflict.reasons" :key="reason">{{ reason }}</li>
              </ul>
            </div>

            <div class="conflict-card__section">
              <div class="conflict-card__label">排程建议</div>
              <div class="conflict-card__suggestion">{{ conflict.suggestion }}</div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import StatusTag from '@/components/StatusTag.vue'
import { getApsScheduleSnapshot, runApsSchedule } from '@/static/services/aps'
import type { ApsScheduleSnapshot, ApsScheduleWorkOrder } from '@/types/aps'

const router = useRouter()
const tab = ref('gantt')
const snapshot = ref<ApsScheduleSnapshot | null>(null)
const chartRef = ref<HTMLDivElement>()

const severityOptions = [
  { value: 'warning', label: '预警', type: 'warning' as const },
  { value: 'critical', label: '关键冲突', type: 'danger' as const }
]

const stats = computed(
  () =>
    snapshot.value?.stats ?? {
      workOrderCount: 0,
      conflictCount: 0,
      overloadedCenters: 0,
      averageLoadPct: 0
    }
)
const days = computed(() => snapshot.value?.days ?? [])
const ganttData = computed(() => snapshot.value?.ganttData ?? [])
const loadData = computed(() => snapshot.value?.loadData ?? [])
const loadTrend = computed(() => snapshot.value?.loadTrend ?? { days: [], series: [] })
const conflicts = computed(() => snapshot.value?.conflicts ?? [])
const timelineStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(days.value.length, 1)}, minmax(48px, 1fr))`,
  minWidth: `${Math.max(days.value.length, 1) * 48}px`
}))

let chartInstance: echarts.ECharts | null = null

async function loadSchedule() {
  const response = await getApsScheduleSnapshot()
  snapshot.value = response.data
  await nextTick()
  renderChart()
}

function renderChart() {
  if (!chartRef.value || loadTrend.value.days.length === 0) return

  chartInstance ??= echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: loadTrend.value.series.map((item) => item.name) },
    grid: { left: 36, right: 20, top: 28, bottom: 48 },
    xAxis: {
      type: 'category',
      data: loadTrend.value.days,
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '负荷(h)',
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    series: loadTrend.value.series.map((item) => ({
      name: item.name,
      type: 'line',
      smooth: true,
      data: item.data,
      itemStyle: { color: item.color },
      areaStyle: { opacity: 0.08, color: item.color }
    }))
  })
}

async function handleRunSchedule() {
  const response = await runApsSchedule()
  snapshot.value = response.data
  await nextTick()
  renderChart()

  if (response.data.conflicts.length > 0) {
    tab.value = 'conflicts'
    ElMessage.warning(`静态排程已重新计算，发现 ${response.data.conflicts.length} 项约束冲突`)
    return
  }

  ElMessage.success(response.msg || '静态排程已重新计算')
}

function goHistory() {
  router.push('/engineering-plan/planning/aps/history')
}

function loadTagType(value: number) {
  if (value >= 90) return 'danger'
  if (value >= 75) return 'warning'
  return 'success'
}

function loadColor(value: number) {
  if (value >= 90) return '#f56c6c'
  if (value >= 75) return '#e6a23c'
  return '#67c23a'
}

function priorityLabel(priority: ApsScheduleWorkOrder['priority']) {
  if (priority === 'urgent') return '紧急'
  if (priority === 'normal') return '常规'
  return '低优先'
}

function handleResize() {
  chartInstance?.resize()
}

watch(tab, async (value) => {
  if (value === 'load') {
    await nextTick()
    renderChart()
  }
})

onMounted(async () => {
  await loadSchedule()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-header__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-header__desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.page-header__actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stats-card :deep(.el-card__body) {
  padding: 18px;
}

.stats-card__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.stats-card__value {
  margin-top: 10px;
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stats-card__value--danger {
  color: #f56c6c;
}

.stats-card__value--warning {
  color: #e6a23c;
}

.stats-card__hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.run-alert {
  margin-bottom: 16px;
}

.gantt-shell {
  display: flex;
  min-height: 460px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.gantt-sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--el-border-color-light);
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.gantt-row-label {
  min-height: 92px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.gantt-row-label__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.gantt-wo-code {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.gantt-wo-name,
.gantt-wo-due {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.gantt-chart {
  flex: 1;
  overflow: auto;
  background:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px) 0 0 / 48px 100%,
    #fff;
}

.gantt-timeline {
  display: grid;
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
}

.gantt-day {
  padding: 12px 4px;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.gantt-day.weekend {
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.08);
}

.gantt-row {
  height: 92px;
  position: relative;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.gantt-bar {
  position: absolute;
  top: 28px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.gantt-bar--conflict {
  animation: conflict-pulse 1.6s ease-in-out infinite;
}

.conflict-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #f56c6c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.load-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.load-card :deep(.el-card__body) {
  padding: 18px;
}

.load-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.load-card__name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.load-card__detail {
  margin-top: 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.trend-card {
  margin-top: 16px;
}

.trend-card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.trend-card__sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.trend-chart {
  height: 320px;
}

.conflict-list {
  display: grid;
  gap: 16px;
}

.conflict-card :deep(.el-card__body) {
  padding: 18px;
}

.conflict-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.conflict-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.conflict-card__sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.conflict-card__section + .conflict-card__section {
  margin-top: 16px;
}

.conflict-card__label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.conflict-card__list {
  margin: 0;
  padding-left: 18px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.conflict-card__suggestion {
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

@keyframes conflict-pulse {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }

  50% {
    transform: translateY(-1px);
    opacity: 0.82;
  }
}

@media (max-width: 960px) {
  .page-header {
    flex-direction: column;
  }

  .page-header__actions {
    width: 100%;
    justify-content: flex-end;
  }

  .gantt-shell {
    flex-direction: column;
  }

  .gantt-sidebar {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}
</style>

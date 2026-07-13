<template>
  <gi-page-layout v-loading="loading" class="workbench-page">
    <el-card class="hero-card" shadow="never">
      <div class="hero-card__content">
        <div class="hero-copy">
          <div class="hero-copy__eyebrow">工作台</div>
          <h2 class="hero-copy__title">{{ workbenchData?.headline || '今天优先处理执行阻塞与待办' }}</h2>
          <p class="hero-copy__summary">
            {{ workbenchData?.prioritySummary || '先处理缺料、停机、待裁决事项，再进入对应业务域继续执行。' }}
          </p>
          <div class="hero-copy__tips">
            <span v-for="tip in heroTips" :key="tip" class="hero-tip">{{ tip }}</span>
          </div>
        </div>

        <div class="hero-actions">
          <div class="hero-updated">更新时间：{{ workbenchData?.updatedAt || '今天 08:30' }}</div>
          <div class="hero-actions__buttons">
            <el-button type="primary" @click="goTo('/mes/traceability/kanban')">查看生产看板</el-button>
            <el-button @click="goTo('/management-analysis/operations/dashboard')">进入经营驾驶舱</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <section class="workbench-section">
      <div class="section-heading">
        <div>
          <h3>我的待办</h3>
          <p>把需要动作的事项放在最前面，登录后先处理待办，再进入对应业务域继续执行。</p>
        </div>
      </div>

      <div class="todo-grid">
        <button
          v-for="item in todoCards"
          :key="item.id"
          type="button"
          class="todo-card"
          :class="`todo-card--${item.severity}`"
          @click="goTo(item.targetRoute)"
        >
          <div class="todo-card__top">
            <span class="todo-card__system">{{ item.ownerSystem }}</span>
            <el-tag :type="tagTypeMap[item.severity]" effect="light" round>{{ item.targetLabel }}</el-tag>
          </div>
          <div class="todo-card__value">
            <strong>{{ item.count }}</strong>
            <span>项</span>
          </div>
          <div class="todo-card__title">{{ item.title }}</div>
          <div class="todo-card__helper">{{ item.helperText }}</div>
        </button>
      </div>
    </section>

    <el-row :gutter="16" class="section-row">
      <el-col :xs="24" :lg="9">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-card__header">
              <div>
                <h3>今日异常与预警</h3>
                <p>优先暴露阻塞执行的事项，先锁定、再处置、再放行。</p>
              </div>
            </div>
          </template>

          <div class="alert-list">
            <button v-for="alert in alerts" :key="alert.id" type="button" class="alert-item" @click="goTo(alert.targetRoute)">
              <div class="alert-item__indicator" :class="`alert-item__indicator--${alert.level}`"></div>
              <div class="alert-item__body">
                <div class="alert-item__meta">
                  <span class="alert-item__type">{{ alert.type }}</span>
                  <span class="alert-item__owner">{{ alert.ownerSystem }}</span>
                </div>
                <div class="alert-item__title">{{ alert.title }}</div>
                <div class="alert-item__footer">
                  <span>影响对象：{{ alert.affectedObject }}</span>
                  <span class="alert-item__action">{{ alert.actionText }}</span>
                </div>
              </div>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="15">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-card__header">
              <div>
                <h3>执行总览</h3>
                <p>围绕工单、工序任务、WIP 与报工，快速判断今天的执行节奏。</p>
              </div>
            </div>
          </template>

          <div class="execution-stats">
            <button v-for="item in executionStats" :key="item.id" type="button" class="execution-stat" @click="goTo(item.targetRoute)">
              <div class="execution-stat__title">{{ item.title }}</div>
              <div class="execution-stat__value">
                <strong>{{ item.value }}</strong>
                <span>{{ item.unit }}</span>
              </div>
              <div class="execution-stat__trend" :class="trendClass(item.trendDirection)">
                {{ item.trendText || '—' }}
              </div>
            </button>
          </div>

          <div class="chart-grid">
            <div class="chart-panel">
              <div class="chart-panel__title">执行状态分布</div>
              <div ref="statusChartRef" class="chart-panel__chart"></div>
            </div>

            <div class="load-panel">
              <div class="chart-panel__title">车间负荷摘要</div>
              <button v-for="item in workshopLoad" :key="item.workshop" type="button" class="load-item" @click="goTo(item.targetRoute)">
                <div class="load-item__head">
                  <span>{{ item.workshop }}</span>
                  <span class="load-item__rate">{{ item.utilization }}%</span>
                </div>
                <el-progress :percentage="item.utilization" :show-text="false" :color="progressColor(item.status)" />
                <div class="load-item__foot">
                  <span>在制 {{ item.wip }} 批</span>
                  <span>{{ loadStatusText(item.status) }}</span>
                </div>
              </button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="section-row">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-card__header">
              <div>
                <h3>协同域摘要</h3>
                <p>看到哪些外围系统正在影响执行中枢，但首页只做聚合，不维护各自真相。</p>
              </div>
            </div>
          </template>

          <div class="domain-grid">
            <button v-for="domain in collaborationDomains" :key="domain.domain" type="button" class="domain-card" @click="goTo(domain.targetRoute)">
              <div class="domain-card__head">
                <div>
                  <div class="domain-card__title">{{ domain.title }}</div>
                  <div class="domain-card__owner">{{ domain.ownerSystem }}</div>
                </div>
                <span class="domain-card__badge">{{ domain.domain }}</span>
              </div>
              <div class="domain-summary">
                <div v-for="summary in domain.summaryItems" :key="summary.label" class="domain-summary__item">
                  <span>{{ summary.label }}</span>
                  <strong :class="`domain-summary__value--${summary.level}`">{{ summary.value }}</strong>
                </div>
              </div>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-card__header">
              <div>
                <h3>快捷入口</h3>
                <p>把高频静态页入口放在首页，减少从菜单逐层寻找的成本。</p>
              </div>
            </div>
          </template>

          <div class="shortcut-grid">
            <button v-for="item in shortcuts" :key="item.id" type="button" class="shortcut-card" @click="goTo(item.targetRoute)">
              <span class="shortcut-card__badge">{{ item.badge }}</span>
              <div class="shortcut-card__title">{{ item.title }}</div>
              <div class="shortcut-card__meta">{{ item.group }} · {{ item.ownerSystem }}</div>
            </button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <section class="workbench-section">
      <el-card class="panel-card summary-card" shadow="never">
        <template #header>
          <div class="panel-card__header">
            <div>
              <h3>经营摘要（轻量）</h3>
              <p>首页只保留健康度摘要，完整经营趋势、收入、成本与利润分析统一进入经营驾驶舱。</p>
            </div>
            <el-button @click="goTo('/management-analysis/operations/dashboard')">查看完整经营驾驶舱</el-button>
          </div>
        </template>

        <div class="summary-grid">
          <button v-for="metric in businessSummary" :key="metric.id" type="button" class="summary-metric" @click="goTo(metric.targetRoute)">
            <div class="summary-metric__title">{{ metric.title }}</div>
            <div class="summary-metric__value">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.unit }}</span>
            </div>
            <div class="summary-metric__trend" :class="trendClass(metric.trendDirection)">
              {{ metric.trendText || '—' }}
            </div>
          </button>
        </div>
      </el-card>
    </section>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { getWorkbenchHomepageData } from '@/api/dashboard'
import type {
  WorkbenchAlertItem,
  WorkbenchCollaborationDomainCard,
  WorkbenchExecutionStat,
  WorkbenchHomepageData,
  WorkbenchSeverity,
  WorkbenchShortcutItem,
  WorkbenchSummaryMetric,
  WorkbenchTodoCard,
  WorkbenchWorkshopLoadItem
} from '@/types/workbench'

const router = useRouter()
const loading = ref(false)
const workbenchData = ref<WorkbenchHomepageData | null>(null)
const statusChartRef = ref<HTMLDivElement>()
let statusChart: echarts.ECharts | null = null

const todoCards = computed<WorkbenchTodoCard[]>(() => workbenchData.value?.todoCards || [])
const alerts = computed<WorkbenchAlertItem[]>(() => workbenchData.value?.alerts || [])
const executionStats = computed<WorkbenchExecutionStat[]>(() => workbenchData.value?.executionStats || [])
const collaborationDomains = computed<WorkbenchCollaborationDomainCard[]>(() => workbenchData.value?.collaborationDomains || [])
const shortcuts = computed<WorkbenchShortcutItem[]>(() => workbenchData.value?.shortcuts || [])
const businessSummary = computed<WorkbenchSummaryMetric[]>(() => workbenchData.value?.businessSummary || [])
const workshopLoad = computed<WorkbenchWorkshopLoadItem[]>(() => workbenchData.value?.executionCharts.workshopLoad || [])

const heroTips = computed(() => alerts.value.slice(0, 3).map((item) => item.type))

const tagTypeMap: Record<WorkbenchSeverity, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
  normal: 'primary',
  warning: 'warning',
  danger: 'danger',
  info: 'info'
}

function trendClass(direction?: string) {
  if (direction === 'up') return 'trend trend--up'
  if (direction === 'down') return 'trend trend--down'
  if (direction === 'warning') return 'trend trend--warning'
  return 'trend trend--flat'
}

function progressColor(status: WorkbenchWorkshopLoadItem['status']) {
  if (status === 'warning') return '#f97316'
  if (status === 'busy') return '#3b82f6'
  return '#22c55e'
}

function loadStatusText(status: WorkbenchWorkshopLoadItem['status']) {
  if (status === 'warning') return '负荷偏高'
  if (status === 'busy') return '负荷紧张'
  return '负荷正常'
}

function goTo(path: string) {
  router.push(path)
}

function renderStatusChart() {
  const chartData = workbenchData.value?.executionCharts.statusDistribution || []

  if (!statusChartRef.value || chartData.length === 0) return

  statusChart ??= echarts.init(statusChartRef.value)
  statusChart.setOption({
    tooltip: { trigger: 'item' },
    grid: { left: 12, right: 12, top: 24, bottom: 12, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.map((item) => item.label),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#d0d7e2' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef2f7' } }
    },
    series: [
      {
        type: 'bar',
        barWidth: 28,
        data: chartData.map((item) => ({
          value: item.value,
          itemStyle: { color: item.color, borderRadius: [8, 8, 0, 0] }
        })),
        label: { show: true, position: 'top', color: '#475569' }
      }
    ]
  })
}

function handleResize() {
  statusChart?.resize()
}

async function loadWorkbench() {
  loading.value = true

  try {
    const response = await getWorkbenchHomepageData()
    workbenchData.value = response.data
    await nextTick()
    renderStatusChart()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadWorkbench()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  statusChart?.dispose()
  statusChart = null
})
</script>

<style scoped>
.workbench-page {
  display: block;
  min-height: 100%;
  height: auto;
  overflow: visible;
}

.hero-card {
  margin-bottom: 16px;
  border: 1px solid #d8e1ec;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 34%), linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
}

.hero-card__content {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.hero-copy {
  flex: 1;
}

.hero-copy__eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}

.hero-copy__title {
  margin: 14px 0 10px;
  font-size: 28px;
  line-height: 1.2;
  color: #0f172a;
}

.hero-copy__summary {
  margin: 0;
  max-width: 760px;
  color: #475569;
  line-height: 1.7;
}

.hero-copy__tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.hero-tip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 12px;
  font-weight: 600;
}

.hero-actions {
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.hero-updated {
  color: #64748b;
  font-size: 13px;
}

.hero-actions__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.workbench-section {
  margin-bottom: 16px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.section-heading h3,
.panel-card__header h3 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.section-heading p,
.panel-card__header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.todo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.todo-card,
.alert-item,
.execution-stat,
.domain-card,
.shortcut-card,
.summary-metric,
.load-item {
  border: 0;
  background: none;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.todo-card {
  position: relative;
  overflow: hidden;
  padding: 18px 18px 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.todo-card::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  content: '';
}

.todo-card--normal::before {
  background: #2563eb;
}

.todo-card--warning::before {
  background: #f59e0b;
}

.todo-card--danger::before {
  background: #ef4444;
}

.todo-card--info::before {
  background: #06b6d4;
}

.todo-card:hover,
.alert-item:hover,
.execution-stat:hover,
.domain-card:hover,
.shortcut-card:hover,
.summary-metric:hover,
.load-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
}

.todo-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.todo-card__system {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.todo-card__value {
  margin-top: 18px;
  color: #0f172a;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.todo-card__value strong {
  font-size: 38px;
  line-height: 1;
}

.todo-card__value span {
  color: #64748b;
  font-size: 14px;
}

.todo-card__title {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.todo-card__helper {
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.section-row {
  margin-bottom: 16px;
}

.panel-card {
  height: 100%;
  border: 1px solid #dbe3ef;
}

.panel-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.alert-item__indicator {
  width: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.alert-item__indicator--danger {
  background: #ef4444;
}

.alert-item__indicator--warning {
  background: #f59e0b;
}

.alert-item__indicator--normal,
.alert-item__indicator--info {
  background: #3b82f6;
}

.alert-item__body {
  min-width: 0;
  flex: 1;
}

.alert-item__meta,
.alert-item__footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #64748b;
  font-size: 12px;
}

.alert-item__type {
  color: #0f172a;
  font-weight: 600;
}

.alert-item__title {
  margin: 8px 0;
  color: #1e293b;
  line-height: 1.6;
}

.alert-item__action {
  color: #2563eb;
  font-weight: 600;
}

.execution-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.execution-stat {
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.execution-stat__title,
.summary-metric__title {
  color: #64748b;
  font-size: 13px;
}

.execution-stat__value,
.summary-metric__value {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #0f172a;
}

.execution-stat__value strong,
.summary-metric__value strong {
  font-size: 30px;
  line-height: 1;
}

.execution-stat__value span,
.summary-metric__value span {
  color: #64748b;
  font-size: 13px;
}

.execution-stat__trend,
.summary-metric__trend {
  margin-top: 8px;
  font-size: 12px;
}

.trend--up {
  color: #16a34a;
}

.trend--down {
  color: #ef4444;
}

.trend--warning {
  color: #ea580c;
}

.trend--flat {
  color: #64748b;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 16px;
  margin-top: 16px;
}

.chart-panel,
.load-panel {
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.chart-panel__title {
  margin-bottom: 12px;
  color: #0f172a;
  font-weight: 600;
}

.chart-panel__chart {
  height: 280px;
}

.load-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.load-item {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.load-item:last-child {
  border-bottom: 0;
}

.load-item__head,
.load-item__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.load-item__head {
  margin-bottom: 8px;
  color: #0f172a;
  font-weight: 600;
}

.load-item__rate {
  color: #2563eb;
}

.load-item__foot {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
}

.domain-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.domain-card {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.domain-card__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.domain-card__title {
  color: #0f172a;
  font-weight: 600;
}

.domain-card__owner {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

.domain-card__badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.domain-summary {
  display: grid;
  gap: 8px;
}

.domain-summary__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  color: #475569;
  border-top: 1px solid #edf2f7;
}

.domain-summary__value--normal {
  color: #2563eb;
}

.domain-summary__value--warning {
  color: #ea580c;
}

.domain-summary__value--danger {
  color: #dc2626;
}

.domain-summary__value--info {
  color: #0891b2;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.shortcut-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.shortcut-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 700;
}

.shortcut-card__title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
}

.shortcut-card__meta {
  color: #64748b;
  font-size: 12px;
}

.summary-card :deep(.el-card__header) {
  padding-bottom: 18px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.summary-metric {
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

@media (max-width: 1440px) {
  .todo-grid,
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .execution-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 992px) {
  .hero-card__content,
  .panel-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    width: 100%;
    min-width: 0;
    align-items: flex-start;
  }

  .hero-actions__buttons {
    justify-content: flex-start;
  }

  .chart-grid,
  .domain-grid,
  .shortcut-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .todo-grid,
  .execution-stats,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy__title {
    font-size: 24px;
  }
}
</style>

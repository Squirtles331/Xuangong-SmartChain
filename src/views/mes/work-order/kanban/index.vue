<template>
  <gi-page-layout>
    <template #header>
      <div class="page-header">
        <div>
          <h2>生产看板</h2>
          <p>消费任务池、WIP 与异常信号，形成车间执行快照，不在本页维护源头事务。</p>
        </div>
        <div class="header-actions">
          <el-select v-model="selectedWorkshop" clearable placeholder="全部车间" style="width: 180px">
            <el-option v-for="item in workshopOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button type="primary" @click="refreshView">刷新快照</el-button>
        </div>
      </div>
    </template>

    <PageOwnershipNotice style="margin-bottom: 16px" />

    <el-alert
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 16px"
      title="静态阶段口径：看板只展示执行快照与关注信号，不承担派工、报工、冻结或放行的源头维护。"
    />

    <div class="metric-grid">
      <el-card shadow="never">
        <div class="metric-label">执行中任务</div>
        <div class="metric-value">{{ metrics.runningTasks }}</div>
        <div class="metric-tip">来自工序任务池的当前执行量</div>
      </el-card>
      <el-card shadow="never">
        <div class="metric-label">冻结/返工 WIP</div>
        <div class="metric-value danger">{{ metrics.riskyWip }}</div>
        <div class="metric-tip">需要重点跟踪回流和释放</div>
      </el-card>
      <el-card shadow="never">
        <div class="metric-label">待放行异常</div>
        <div class="metric-value primary">{{ metrics.awaitingRelease }}</div>
        <div class="metric-tip">最接近恢复生产的异常队列</div>
      </el-card>
      <el-card shadow="never">
        <div class="metric-label">逾期信号</div>
        <div class="metric-value warning">{{ metrics.overdueSignals }}</div>
        <div class="metric-tip">来自任务与 WIP 的复合关注</div>
      </el-card>
    </div>

    <div class="kanban-grid">
      <el-card shadow="never">
        <template #header>工作中心负荷</template>
        <div class="center-grid">
          <div v-for="item in workCenterCards" :key="item.name" class="center-card">
            <div class="center-top">
              <strong>{{ item.name }}</strong>
              <StatusTag :value="item.signal" :options="KANBAN_SIGNAL_OPTIONS" />
            </div>
            <div class="center-meta">执行中 {{ item.running }} 项 · 阻塞 {{ item.blocked }} 项</div>
            <el-progress :percentage="item.load" :stroke-width="8" />
            <div class="center-meta">关注原因：{{ item.reason }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>异常聚焦</template>
        <div class="signal-list">
          <div v-for="item in exceptionWatchList" :key="item.id" class="signal-item">
            <div class="signal-main">
              <strong>{{ item.exception_code }}</strong>
              <StatusTag :value="item.status" :options="EXCEPTION_STATUS_OPTIONS" />
            </div>
            <div class="signal-sub">{{ item.lock_scope }}</div>
            <div class="signal-sub">放行前提：{{ item.release_gate }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>WIP 压力分布</template>
        <div class="stack-list">
          <div v-for="item in wipStatusCards" :key="item.label" class="stack-row">
            <div class="stack-label">{{ item.label }}</div>
            <div class="stack-bar">
              <el-progress :percentage="item.percent" :stroke-width="10" :show-text="false" />
            </div>
            <div class="stack-value">{{ item.count }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>逾期与待协调任务</template>
        <el-table :data="attentionTasks" border size="small">
          <el-table-column prop="task_code" label="任务号" min-width="130" />
          <el-table-column prop="wo_code" label="工单号" width="140" />
          <el-table-column prop="work_center" label="工作中心" width="120" />
          <el-table-column label="信号" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.blocked ? 'danger' : 'warning'" effect="light">
                {{ row.blocked ? '阻塞' : '逾期' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="release_note" label="协调说明" min-width="160" />
        </el-table>
      </el-card>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import {
  EXCEPTION_STATUS_OPTIONS,
  KANBAN_SIGNAL_OPTIONS,
  cloneSecondBatchData,
  executionExceptionRecords,
  operationTaskPoolRecords,
  wipBatchRecords
} from '../second-batch-static'

const selectedWorkshop = ref('')
const taskPool = ref(cloneSecondBatchData(operationTaskPoolRecords))
const wipPool = ref(cloneSecondBatchData(wipBatchRecords))
const exceptionPool = ref(cloneSecondBatchData(executionExceptionRecords))

const workshopOptions = Array.from(
  new Set([...operationTaskPoolRecords.map((item) => item.workshop_name), ...wipBatchRecords.map((item) => item.workshop_name)])
)

const visibleTasks = computed(() => taskPool.value.filter((item) => !selectedWorkshop.value || item.workshop_name === selectedWorkshop.value))

const visibleWip = computed(() => wipPool.value.filter((item) => !selectedWorkshop.value || item.workshop_name === selectedWorkshop.value))

const visibleExceptions = computed(() =>
  exceptionPool.value.filter((item) => !selectedWorkshop.value || item.workshop_name === selectedWorkshop.value)
)

const metrics = computed(() => ({
  runningTasks: visibleTasks.value.filter((item) => item.status === 'running').length,
  riskyWip: visibleWip.value.filter((item) => item.status === 'frozen' || item.status === 'rework').length,
  awaitingRelease: visibleExceptions.value.filter((item) => item.status === 'awaiting_release').length,
  overdueSignals:
    visibleTasks.value.filter((item) => item.delay_hours > 0).length + visibleWip.value.filter((item) => item.signal === 'overdue').length
}))

const workCenterCards = computed(() => {
  const centers = Array.from(new Set(visibleTasks.value.map((item) => item.work_center)))
  return centers.map((name) => {
    const centerTasks = visibleTasks.value.filter((item) => item.work_center === name)
    const running = centerTasks.filter((item) => item.status === 'running').length
    const blocked = centerTasks.filter((item) => item.blocked).length
    const load = Math.min(100, Math.round((running / Math.max(centerTasks.length, 1)) * 100 + blocked * 15))
    const signal = blocked > 0 || centerTasks.some((item) => item.delay_hours > 0) ? (blocked > 0 ? 'overdue' : 'attention') : 'normal'

    return {
      name,
      running,
      blocked,
      load,
      signal,
      reason: blocked > 0 ? '存在锁定或待释放任务' : running > 0 ? '需关注报工节拍' : '当前节奏平稳'
    }
  })
})

const exceptionWatchList = computed(() => visibleExceptions.value.filter((item) => item.status !== 'closed').slice(0, 4))

const wipStatusCards = computed(() => {
  const total = visibleWip.value.length || 1
  const states = [
    { key: 'queued', label: '待流转' },
    { key: 'processing', label: '加工中' },
    { key: 'frozen', label: '已冻结' },
    { key: 'rework', label: '返工中' },
    { key: 'completed', label: '已完成' }
  ]
  return states.map((state) => {
    const count = visibleWip.value.filter((item) => item.status === state.key).length
    return {
      ...state,
      count,
      percent: Math.round((count / total) * 100)
    }
  })
})

const attentionTasks = computed(() => visibleTasks.value.filter((item) => item.blocked || item.delay_hours > 0).slice(0, 6))

function refreshView() {
  taskPool.value = cloneSecondBatchData(operationTaskPoolRecords)
  wipPool.value = cloneSecondBatchData(wipBatchRecords)
  exceptionPool.value = cloneSecondBatchData(executionExceptionRecords)
  ElMessage.success('生产看板快照已刷新')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.page-header h2 {
  margin: 0;
}

.page-header p {
  margin: 8px 0 0;
  color: #606266;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.metric-label {
  color: #64748b;
  font-size: 13px;
}

.metric-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
}

.metric-value.warning {
  color: #d97706;
}

.metric-value.danger {
  color: #dc2626;
}

.metric-value.primary {
  color: #2563eb;
}

.metric-tip {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.kanban-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.center-grid,
.signal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.center-card,
.signal-item {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.center-top,
.signal-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.center-meta,
.signal-sub {
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stack-row {
  display: grid;
  grid-template-columns: 72px 1fr 40px;
  gap: 12px;
  align-items: center;
}

.stack-label,
.stack-value {
  color: #475569;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .metric-grid,
  .kanban-grid {
    grid-template-columns: 1fr;
  }
}
</style>

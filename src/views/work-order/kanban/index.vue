<template>
  <div class="kanban-container">
    <div class="kanban-header">
      <h2>车间看板 - {{ currentWorkshop }}</h2>
      <div class="kanban-actions">
        <el-select v-model="currentWorkshop" style="width: 180px" @change="onWorkshopChange">
          <el-option v-for="item in workshops" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" style="margin-left: 12px" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <div class="kanban-columns">
      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(event) => onDrop(event, 'pending')">
        <div class="column-header header-pending">
          <span>待派工</span>
          <el-tag type="info" size="small">{{ pendingOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in pendingOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(event) => onDragStart(event, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag :type="priorityTagType(op.wo_priority)" size="small">{{ priorityLabel(op.wo_priority) }}</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">产品：{{ op.material_name }}</div>
              <div class="card-info">工作中心：{{ op.work_center }}</div>
              <div class="card-info">工时：{{ op.total_hours }} 小时</div>
            </div>
            <div class="card-footer">
              <el-button type="primary" size="small" @click="openAssign(op)">派工</el-button>
            </div>
          </div>
          <div v-if="pendingOps.length === 0" class="empty-hint">暂无待派工工序</div>
        </div>
      </div>

      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(event) => onDrop(event, 'assigned')">
        <div class="column-header header-assigned">
          <span>已派工</span>
          <el-tag type="primary" size="small">{{ assignedOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in assignedOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(event) => onDragStart(event, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="warning" size="small">待开工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工：{{ op.worker || '未指定' }}</div>
              <div class="card-info">工作中心：{{ op.work_center }}</div>
              <div class="card-info">计划开工：{{ formatPlanTime(op.planned_start) }}</div>
            </div>
          </div>
          <div v-if="assignedOps.length === 0" class="empty-hint">暂无已派工工序</div>
        </div>
      </div>

      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(event) => onDrop(event, 'running')">
        <div class="column-header header-running">
          <span>生产中</span>
          <el-tag type="warning" size="small">{{ runningOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in runningOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(event) => onDragStart(event, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="danger" size="small">进行中</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工：{{ op.worker || '未指定' }}</div>
              <div class="card-info">
                <el-progress :percentage="op.progress || 0" :stroke-width="6" style="margin-top: 8px" />
              </div>
            </div>
          </div>
          <div v-if="runningOps.length === 0" class="empty-hint">暂无生产中工序</div>
        </div>
      </div>

      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(event) => onDrop(event, 'completed')">
        <div class="column-header header-completed">
          <span>已完工</span>
          <el-tag type="success" size="small">{{ completedOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in completedOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(event) => onDragStart(event, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="success" size="small">已完工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工：{{ op.worker || '未指定' }}</div>
              <div class="card-info">合格：{{ op.qualified_qty || 0 }} | 不良：{{ op.defective_qty || 0 }}</div>
            </div>
          </div>
          <div v-if="completedOps.length === 0" class="empty-hint">暂无已完工工序</div>
        </div>
      </div>
    </div>

    <AssignFormDialog
      v-model:visible="assignVisible"
      v-model:form="assignForm"
      :op-info="currentAssignOp"
      :teams="teams"
      :workers="workers"
      :equipment="equipment"
      @confirm="confirmAssign"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { assignOperation, getKanbanData } from '@/api/work-order'
import AssignFormDialog, { type AssignFormModel } from './AssignFormDialog.vue'

interface KanbanOp {
  id: string
  wo_code: string
  wo_priority: string
  material_name: string
  operation_no: number
  name: string
  work_center: string
  total_hours: number
  status: string
  worker?: string
  qualified_qty?: number
  defective_qty?: number
  progress?: number
  planned_start?: string
}

const currentWorkshop = ref('机加工一车间')
const workshops = ['机加工一车间', '机加工二车间', '装配车间']
const operations = ref<KanbanOp[]>([])

const assignVisible = ref(false)
const currentAssignOp = ref<KanbanOp | null>(null)
const assignForm = ref<AssignFormModel>({ team: '甲班', worker: '', equipment: '' })

const teams = ['甲班', '乙班', '丙班']
const workers = ['李四', '王五', '赵六', '孙八']
const equipment = ['数控车床-01', '数控车床-02', '钻床-01', '磨床-01']

const draggedOpId = ref<string | null>(null)

onMounted(() => {
  loadWorkshopData()
})

const pendingOps = computed(() => operations.value.filter((item) => item.status === 'pending'))
const assignedOps = computed(() => operations.value.filter((item) => item.status === 'assigned'))
const runningOps = computed(() => operations.value.filter((item) => item.status === 'running'))
const completedOps = computed(() => operations.value.filter((item) => item.status === 'completed'))

async function loadWorkshopData() {
  try {
    const response = await getKanbanData()
    operations.value = (response.data as KanbanOp[]) || []
  } catch {
    operations.value = []
  }
}

function onWorkshopChange() {
  loadWorkshopData()
  ElMessage.success(`已切换到 ${currentWorkshop.value}`)
}

function refreshData() {
  loadWorkshopData()
  ElMessage.success('数据已刷新')
}

function priorityLabel(priority: string) {
  const map: Record<string, string> = {
    urgent: '紧急',
    high: '高',
    normal: '普通',
    low: '低'
  }
  return map[priority] || priority
}

function priorityTagType(priority: string) {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  return 'info'
}

function formatPlanTime(value?: string) {
  if (!value) return '-'
  return value.replace(/^\d{4}-/, '')
}

function onDragStart(event: DragEvent, op: KanbanOp) {
  draggedOpId.value = op.id
  event.dataTransfer?.setData('text/plain', op.id)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
  const element = event.target as HTMLElement
  requestAnimationFrame(() => {
    element.style.opacity = '0.5'
  })
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(event: DragEvent, targetStatus: string) {
  event.preventDefault()
  const opId = event.dataTransfer?.getData('text/plain') || draggedOpId.value
  if (!opId) return

  const op = operations.value.find((item) => item.id === opId)
  if (!op) return

  const allowedTransitions: Record<string, string[]> = {
    pending: ['assigned'],
    assigned: ['running', 'pending'],
    running: ['completed', 'assigned'],
    completed: ['running']
  }

  const allowed = allowedTransitions[op.status]
  if (!allowed || !allowed.includes(targetStatus)) {
    ElMessage.warning(`不允许从“${statusLabel(op.status)}”拖拽到“${statusLabel(targetStatus)}”`)
    resetDragStyles()
    return
  }

  op.status = targetStatus
  if (targetStatus === 'running' && !op.progress) op.progress = 0
  if (targetStatus === 'completed') op.progress = 100

  ElMessage.success(`${op.wo_code} 工序${op.operation_no} 已移动到“${statusLabel(targetStatus)}”`)
  resetDragStyles()
}

function resetDragStyles() {
  document.querySelectorAll('.kanban-card').forEach((card) => {
    ;(card as HTMLElement).style.opacity = '1'
  })
  draggedOpId.value = null
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待派工',
    assigned: '已派工',
    running: '生产中',
    completed: '已完工'
  }
  return map[status] || status
}

function openAssign(op: KanbanOp) {
  currentAssignOp.value = { ...op }
  assignForm.value = { team: '甲班', worker: '', equipment: '' }
  assignVisible.value = true
}

async function confirmAssign() {
  if (!currentAssignOp.value) return

  try {
    await assignOperation(currentAssignOp.value.id, {
      team_id: assignForm.value.team,
      worker_id: assignForm.value.worker || undefined,
      equipment_id: assignForm.value.equipment || undefined
    })

    const target = operations.value.find((item) => item.id === currentAssignOp.value?.id)
    if (target) {
      target.status = 'assigned'
      target.worker = assignForm.value.worker || '未指定'
    }

    assignVisible.value = false
    ElMessage.success('派工成功')
  } catch {
    ElMessage.error('派工失败')
  }
}
</script>

<style scoped>
.kanban-container {
  padding: 0;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kanban-header h2 {
  margin: 0;
  font-size: 18px;
}

.kanban-columns {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow: hidden;
}

.kanban-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
}

.column-header {
  padding: 10px 16px;
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-pending {
  background: #909399;
}

.header-assigned {
  background: #409eff;
}

.header-running {
  background: #e6a23c;
}

.header-completed {
  background: #67c23a;
}

.column-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.kanban-card {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition:
    box-shadow 0.2s,
    opacity 0.2s;
}

.kanban-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-wo-code {
  font-weight: 600;
  font-size: 13px;
  color: #303133;
}

.card-op {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.card-info {
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

.card-footer {
  margin-top: 8px;
  text-align: right;
}

.empty-hint {
  text-align: center;
  color: #c0c4cc;
  font-size: 13px;
  padding: 24px 0;
}
</style>

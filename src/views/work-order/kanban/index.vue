<template>
  <div class="kanban-container">
    <div class="kanban-header">
      <h2>车间看板 — {{ currentWorkshop }}</h2>
      <div class="kanban-actions">
        <el-select v-model="currentWorkshop" style="width: 180px" @change="onWorkshopChange">
          <el-option v-for="w in workshops" :key="w" :label="w" :value="w" />
        </el-select>
        <el-button type="primary" style="margin-left: 12px" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <div class="kanban-columns">
      <!-- 待派工 -->
      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'pending')">
        <div class="column-header" style="background: #909399">
          <span>待派工</span>
          <el-tag type="info" size="small">{{ pendingOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in pendingOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag :type="op.wo_priority === 'urgent' ? 'danger' : 'info'" size="small">{{
                op.wo_priority === 'urgent' ? '紧急' : '普通'
              }}</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">产品: {{ op.material_name }}</div>
              <div class="card-info">工作中心: {{ op.work_center }}</div>
              <div class="card-info">工时: {{ op.total_hours }}h</div>
            </div>
            <div class="card-footer">
              <el-button type="primary" size="small" @click="openAssign(op)">派工</el-button>
            </div>
          </div>
          <div v-if="pendingOps.length === 0" class="empty-hint">暂无待派工工序</div>
        </div>
      </div>

      <!-- 已派工 -->
      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'assigned')">
        <div class="column-header" style="background: #409eff">
          <span>已派工</span>
          <el-tag type="primary" size="small">{{ assignedOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in assignedOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="warning" size="small">待开工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工: {{ op.worker || '未指定' }}</div>
              <div class="card-info">工作中心: {{ op.work_center }}</div>
              <div class="card-info">计划: {{ op.planned_start?.slice(5) }}</div>
            </div>
          </div>
          <div v-if="assignedOps.length === 0" class="empty-hint">暂无已派工工序</div>
        </div>
      </div>

      <!-- 生产中 -->
      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'running')">
        <div class="column-header" style="background: #e6a23c">
          <span>生产中</span>
          <el-tag type="warning" size="small">{{ runningOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in runningOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="danger" size="small">进行中</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工: {{ op.worker }}</div>
              <div class="card-info">
                <el-progress :percentage="op.progress || 50" :stroke-width="6" style="margin-top: 8px" />
              </div>
            </div>
          </div>
          <div v-if="runningOps.length === 0" class="empty-hint">暂无生产中工序</div>
        </div>
      </div>

      <!-- 已完工 -->
      <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'completed')">
        <div class="column-header" style="background: #67c23a">
          <span>已完工</span>
          <el-tag type="success" size="small">{{ completedOps.length }} 单</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in completedOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, op)">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="success" size="small">已完工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">操作工: {{ op.worker }}</div>
              <div class="card-info">合格: {{ op.qualified_qty }} | 不良: {{ op.defective_qty }}</div>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getKanbanData, assignOperation } from '@/api/work-order'
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

const ops = ref<KanbanOp[]>([])

async function loadWorkshopData() {
  try {
    const res = await getKanbanData()
    ops.value = (res.data as KanbanOp[]) || []
  } catch {
    ops.value = []
  }
}

onMounted(() => {
  loadWorkshopData()
})

function onWorkshopChange() {
  loadWorkshopData()
  ElMessage.success(`已切换到 ${currentWorkshop.value}`)
}

function refreshData() {
  loadWorkshopData()
  ElMessage.success('数据已刷新')
}

const pendingOps = computed(() => ops.value.filter((o) => o.status === 'pending'))
const assignedOps = computed(() => ops.value.filter((o) => o.status === 'assigned'))
const runningOps = computed(() => ops.value.filter((o) => o.status === 'running'))
const completedOps = computed(() => ops.value.filter((o) => o.status === 'completed'))

// ==================== 拖拽处理 ====================
const draggedOpId = ref<string | null>(null)

function onDragStart(e: DragEvent, op: KanbanOp) {
  draggedOpId.value = op.id
  e.dataTransfer!.setData('text/plain', op.id)
  if (e.dataTransfer!.effectAllowed !== undefined) {
    e.dataTransfer!.effectAllowed = 'move'
  }
  const el = e.target as HTMLElement
  setTimeout(() => {
    el.style.opacity = '0.5'
  }, 0)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(e: DragEvent, targetStatus: string) {
  e.preventDefault()
  const opId = e.dataTransfer!.getData('text/plain') || draggedOpId.value
  if (!opId) return

  const op = ops.value.find((o) => o.id === opId)
  if (!op) return

  const allowedTransitions: Record<string, string[]> = {
    'pending': ['assigned'],
    'assigned': ['running', 'pending'],
    'running': ['completed', 'assigned'],
    'completed': ['running']
  }

  const allowed = allowedTransitions[op.status]
  if (!allowed || !allowed.includes(targetStatus)) {
    ElMessage.warning(`不允许从「${statusLabel(op.status)}」拖拽到「${statusLabel(targetStatus)}」`)
    return
  }

  op.status = targetStatus

  if (targetStatus === 'running' && !op.progress) {
    op.progress = 0
  }
  if (targetStatus === 'completed') {
    op.progress = 100
  }

  ElMessage.success(`${op.wo_code} 工序${op.operation_no} 已移至「${statusLabel(targetStatus)}」`)

  const cards = document.querySelectorAll('.kanban-card')
  cards.forEach((c) => ((c as HTMLElement).style.opacity = '1'))

  draggedOpId.value = null
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    'pending': '待派工',
    'assigned': '已派工',
    'running': '生产中',
    'completed': '已完工'
  }
  return map[status] || status
}

// ==================== 派工 ====================
const assignVisible = ref(false)
const currentAssignOp = ref<KanbanOp | null>(null)
const assignForm = ref<AssignFormModel>({ team: '甲班', worker: '', equipment: '' })
const teams = ['甲班', '乙班', '丙班']
const workers = ['李四', '王五', '赵六', '孙八']
const equipment = ['数控车床-01', '数控车床-02', '钻床-01', '磨床-01']

function openAssign(op: KanbanOp) {
  currentAssignOp.value = { ...op }
  assignForm.value = { team: '甲班', worker: '', equipment: '' }
  assignVisible.value = true
}

async function confirmAssign() {
  if (currentAssignOp.value) {
    try {
      await assignOperation(currentAssignOp.value.id, {
        team_id: assignForm.value.team,
        worker_id: assignForm.value.worker || undefined,
        equipment_id: assignForm.value.equipment || undefined
      })
      currentAssignOp.value.status = 'assigned'
      currentAssignOp.value.worker = assignForm.value.worker || '未指定'
      ElMessage.success('派工成功')
    } catch {
      ElMessage.error('派工失败')
    }
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
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}
.column-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.kanban-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition:
    box-shadow 0.2s,
    opacity 0.2s;
}
.kanban-card:active {
  cursor: grabbing;
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

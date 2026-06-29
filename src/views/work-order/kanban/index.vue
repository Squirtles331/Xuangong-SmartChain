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

    <!-- 派工弹窗 -->
    <el-dialog v-model="assignVisible" title="工序派工" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="工单">{{ currentAssignOp?.wo_code }}</el-form-item>
        <el-form-item label="工序">{{ currentAssignOp?.operation_no }}: {{ currentAssignOp?.name }}</el-form-item>
        <el-form-item label="执行班组" required>
          <el-select v-model="assignForm.team" style="width: 100%">
            <el-option v-for="t in teams" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作工">
          <el-select v-model="assignForm.worker" style="width: 100%">
            <el-option v-for="w in workers" :key="w" :label="w" :value="w" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行设备">
          <el-select v-model="assignForm.equipment" style="width: 100%">
            <el-option v-for="e in equipment" :key="e" :label="e" :value="e" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确认派工</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { kanbanOps as mockKanbanOps } from '@/mock'

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

// 按车间分组的数据
const workshopDataMap: Record<string, KanbanOp[]> = {
  '机加工一车间': mockKanbanOps as any,
  '机加工二车间': [
    {
      id: 'a1',
      wo_code: 'WO202501200001',
      wo_priority: 'high',
      material_name: '齿轮箱 GBX-200',
      operation_no: 10,
      name: '下料',
      work_center: '下料组',
      total_hours: 6,
      status: 'pending'
    },
    {
      id: 'a2',
      wo_code: 'WO202501200001',
      wo_priority: 'high',
      material_name: '齿轮箱 GBX-200',
      operation_no: 20,
      name: '粗车',
      work_center: '数控车组',
      total_hours: 12,
      status: 'assigned',
      worker: '张三',
      planned_start: '2025-01-18 08:00'
    },
    {
      id: 'a3',
      wo_code: 'WO202501200002',
      wo_priority: 'normal',
      material_name: '传动轴 DS-50',
      operation_no: 30,
      name: '精车',
      work_center: '数控车组',
      total_hours: 16,
      status: 'running',
      worker: '李四',
      progress: 70
    },
    {
      id: 'a4',
      wo_code: 'WO202501200002',
      wo_priority: 'normal',
      material_name: '传动轴 DS-50',
      operation_no: 20,
      name: '车削',
      work_center: '数控车组',
      total_hours: 10,
      status: 'completed',
      worker: '李四',
      qualified_qty: 30,
      defective_qty: 1
    }
  ],
  '装配车间': [
    {
      id: 'b1',
      wo_code: 'WO202501210001',
      wo_priority: 'urgent',
      material_name: '离心泵 XJP-200',
      operation_no: 60,
      name: '装配',
      work_center: '装配组',
      total_hours: 40,
      status: 'pending'
    },
    {
      id: 'b2',
      wo_code: 'WO202501210002',
      wo_priority: 'normal',
      material_name: '齿轮箱 GBX-200',
      operation_no: 70,
      name: '试压',
      work_center: '测试组',
      total_hours: 12,
      status: 'assigned',
      worker: '赵六',
      planned_start: '2025-01-20 08:00'
    },
    {
      id: 'b3',
      wo_code: 'WO202501210003',
      wo_priority: 'normal',
      material_name: '离心泵 XJP-100',
      operation_no: 80,
      name: '油漆',
      work_center: '涂装组',
      total_hours: 18,
      status: 'running',
      worker: '王五',
      progress: 45
    },
    {
      id: 'b4',
      wo_code: 'WO202501210002',
      wo_priority: 'normal',
      material_name: '齿轮箱 GBX-200',
      operation_no: 60,
      name: '装配',
      work_center: '装配组',
      total_hours: 24,
      status: 'completed',
      worker: '赵六',
      qualified_qty: 50,
      defective_qty: 0
    }
  ]
}

const ops = ref<KanbanOp[]>([])

function loadWorkshopData() {
  ops.value = JSON.parse(JSON.stringify(workshopDataMap[currentWorkshop.value] || []))
}

// 初始化
loadWorkshopData()

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
  // 拖拽样式
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

  // 校验状态流转合法性
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

  // 更新状态
  op.status = targetStatus

  // 目标状态附加字段处理
  if (targetStatus === 'running' && !op.progress) {
    op.progress = 0
  }
  if (targetStatus === 'completed') {
    op.progress = 100
  }

  ElMessage.success(`${op.wo_code} 工序${op.operation_no} 已移至「${statusLabel(targetStatus)}」`)

  // 恢复拖拽样式
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
const assignForm = ref({ team: '甲班', worker: '', equipment: '' })
const teams = ['甲班', '乙班', '丙班']
const workers = ['李四', '王五', '赵六', '孙八']
const equipment = ['数控车床-01', '数控车床-02', '钻床-01', '磨床-01']

function openAssign(op: KanbanOp) {
  currentAssignOp.value = op
  assignVisible.value = true
}

function confirmAssign() {
  if (currentAssignOp.value) {
    currentAssignOp.value.status = 'assigned'
    currentAssignOp.value.worker = assignForm.value.worker || '未指定'
  }
  assignVisible.value = false
  ElMessage.success('派工成功')
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

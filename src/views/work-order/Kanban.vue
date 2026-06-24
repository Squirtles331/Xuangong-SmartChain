<template>
  <div class="kanban-container">
    <div class="kanban-header">
      <h2>车间看板 — {{ currentWorkshop }}</h2>
      <div class="kanban-actions">
        <el-select v-model="currentWorkshop" style="width: 180px">
          <el-option v-for="w in workshops" :key="w" :label="w" :value="w" />
        </el-select>
        <el-button type="primary" style="margin-left: 12px" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <div class="kanban-columns">
      <!-- 待派工 -->
      <div class="kanban-column">
        <div class="column-header" style="background: #909399">
          <span>待派工</span>
          <el-tag type="info" size="small">{{ pendingOps.length }}</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in pendingOps" :key="op.id" class="kanban-card" draggable="true" @dragstart="onDragStart($event, op)">
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
        </div>
      </div>

      <!-- 已派工 -->
      <div class="kanban-column">
        <div class="column-header" style="background: #409eff">
          <span>已派工</span>
          <el-tag type="primary" size="small">{{ assignedOps.length }}</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in assignedOps" :key="op.id" class="kanban-card">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="warning" size="small">待开工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">👤 {{ op.worker || '未指定' }}</div>
              <div class="card-info">🔧 {{ op.work_center }}</div>
              <div class="card-info">⏱ 计划: {{ op.planned_start?.slice(5) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生产中 -->
      <div class="kanban-column">
        <div class="column-header" style="background: #e6a23c">
          <span>生产中</span>
          <el-tag type="warning" size="small">{{ runningOps.length }}</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in runningOps" :key="op.id" class="kanban-card">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="danger" size="small">进行中</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">👤 {{ op.worker }}</div>
              <div class="card-info">
                <el-progress :percentage="op.progress || 50" :stroke-width="6" style="margin-top: 8px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 已完工 -->
      <div class="kanban-column">
        <div class="column-header" style="background: #67c23a">
          <span>已完工</span>
          <el-tag type="success" size="small">{{ completedOps.length }}</el-tag>
        </div>
        <div class="column-body">
          <div v-for="op in completedOps" :key="op.id" class="kanban-card">
            <div class="card-header">
              <span class="card-wo-code">{{ op.wo_code }}</span>
              <el-tag type="success" size="small">已完工</el-tag>
            </div>
            <div class="card-body">
              <div class="card-op">{{ op.operation_no }}: {{ op.name }}</div>
              <div class="card-info">👤 {{ op.worker }}</div>
              <div class="card-info">✅ 合格: {{ op.qualified_qty }} | ❌ 不良: {{ op.defective_qty }}</div>
            </div>
          </div>
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
import { ref, computed } from 'vue'
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

const ops = ref<KanbanOp[]>(mockKanbanOps as any)

const pendingOps = computed(() => ops.value.filter((o) => o.status === 'pending'))
const assignedOps = computed(() => ops.value.filter((o) => o.status === 'assigned'))
const runningOps = computed(() => ops.value.filter((o) => o.status === 'running'))
const completedOps = computed(() => ops.value.filter((o) => o.status === 'completed'))

function refreshData() {
  ElMessage.success('数据已刷新')
}

// 派工
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

function onDragStart(e: DragEvent, op: KanbanOp) {
  e.dataTransfer!.setData('text/plain', op.id)
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
  background: #f5f7fa;
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
  cursor: pointer;
  transition: box-shadow 0.2s;
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
</style>

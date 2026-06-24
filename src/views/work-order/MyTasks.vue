<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待开工" name="assigned">
        <el-empty v-if="assignedTasks.length === 0" description="暂无待开工任务" />
        <div v-else class="task-list">
          <el-card v-for="task in assignedTasks" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag :type="task.wo_priority === 'urgent' ? 'danger' : 'info'" size="small">{{ task.wo_priority === 'urgent' ? '紧急' : '普通' }}</el-tag>
            </div>
            <div class="task-body">
              <p><strong>工序{{ task.operation_no }}:</strong> {{ task.operation_name }}</p>
              <p>产品: {{ task.material_name }}</p>
              <p>工作中心: {{ task.work_center }}</p>
              <p>计划数量: {{ task.planned_qty }} 台</p>
              <p>计划时间: {{ task.planned_start }} ~ {{ task.planned_end }}</p>
            </div>
            <div class="task-footer">
              <el-button type="primary" @click="startWork(task)">开工</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="生产中" name="running">
        <el-empty v-if="runningTasks.length === 0" description="暂无生产中任务" />
        <div v-else class="task-list">
          <el-card v-for="task in runningTasks" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag type="warning" size="small">进行中</el-tag>
            </div>
            <div class="task-body">
              <p><strong>工序{{ task.operation_no }}:</strong> {{ task.operation_name }}</p>
              <p>产品: {{ task.material_name }}</p>
              <p>已报工: {{ task.reported_qty }} / {{ task.planned_qty }} 台</p>
              <el-progress :percentage="Math.round(task.reported_qty / task.planned_qty * 100)" :stroke-width="8" />
            </div>
            <div class="task-footer">
              <el-button type="success" @click="$router.push(`/work-order/report/${task.wo_id}`)">报工</el-button>
              <el-button type="warning" @click="reportException(task)">异常上报</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="已完工" name="completed">
        <gi-table :columns="completedColumns" :data="completedTasks" border size="small">
          <template #status="{ row }">
            <el-tag v-if="row.qc_required && !row.inspected" type="warning" size="small">待质检</el-tag>
            <el-tag v-else type="success" size="small">已完工</el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 异常上报弹窗 -->
    <el-dialog v-model="exceptionVisible" title="异常上报" width="500px">
      <el-form :model="exceptionForm" label-width="100px">
        <el-form-item label="异常类型" required>
          <el-select v-model="exceptionForm.type" style="width: 100%">
            <el-option label="设备故障" value="equipment" />
            <el-option label="来料不良" value="material" />
            <el-option label="图纸/工艺错误" value="process" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input v-model="exceptionForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exceptionVisible = false">取消</el-button>
        <el-button type="primary" @click="submitException">提交</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'

interface Task {
  id: string; wo_id: string; wo_code: string; wo_priority: string; material_name: string
  operation_no: number; operation_name: string; work_center: string
  planned_qty: number; reported_qty: number; planned_start: string; planned_end: string
  status: string; qc_required?: boolean; inspected?: boolean
}

const activeTab = ref('assigned')

const assignedTasks = ref<Task[]>([
  { id: '1', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 40, operation_name: '钻孔', work_center: '钻床组', planned_qty: 100, reported_qty: 0, planned_start: '2025-01-17 08:00', planned_end: '2025-01-17 17:00', status: 'assigned' },
  { id: '2', wo_id: '2', wo_code: 'WO202501150002', wo_priority: 'high', material_name: '齿轮箱 GBX-200', operation_no: 10, operation_name: '下料', work_center: '下料组', planned_qty: 50, reported_qty: 0, planned_start: '2025-01-16 08:00', planned_end: '2025-01-16 17:00', status: 'assigned' }
])

const runningTasks = ref<Task[]>([
  { id: '3', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 30, operation_name: '精车', work_center: '数控车组', planned_qty: 100, reported_qty: 45, planned_start: '2025-01-14', planned_end: '2025-01-16', status: 'running' }
])

const completedTasks = ref<Task[]>([
  { id: '4', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 20, operation_name: '粗车', work_center: '数控车组', planned_qty: 100, reported_qty: 100, planned_start: '2025-01-12', planned_end: '2025-01-14', status: 'completed', qc_required: false, inspected: false },
  { id: '5', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 10, operation_name: '下料', work_center: '下料组', planned_qty: 100, reported_qty: 100, planned_start: '2025-01-11', planned_end: '2025-01-11', status: 'completed', qc_required: false, inspected: false },
  { id: '6', wo_id: '3', wo_code: 'WO202501140003', wo_priority: 'normal', material_name: '离心泵 XJP-200', operation_no: 50, operation_name: '磨削', work_center: '磨床组', planned_qty: 30, reported_qty: 30, planned_start: '2025-01-13', planned_end: '2025-01-14', status: 'completed', qc_required: true, inspected: true }
])

const completedColumns: TableColumnItem<Task>[] = [
  { prop: 'wo_code', label: '工单', width: 150 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'operation_name', label: '工序', width: 100 },
  { prop: 'reported_qty', label: '报工数', width: 80, align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' }
]

function startWork(task: Task) {
  task.status = 'running'
  runningTasks.value.unshift(task)
  assignedTasks.value = assignedTasks.value.filter(t => t.id !== task.id)
  ElMessage.success('已开工')
}

const exceptionVisible = ref(false)
const exceptionForm = reactive({ type: 'equipment', description: '' })
function reportException(_task: Task) { exceptionVisible.value = true }
function submitException() {
  ElMessage.success('异常已上报，维修人员已通知')
  exceptionVisible.value = false
}
</script>

<style scoped>
.task-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.task-card { cursor: pointer; }
.task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.task-code { font-weight: 600; }
.task-body p { margin: 4px 0; font-size: 13px; color: #606266; }
.task-footer { margin-top: 12px; text-align: right; }
</style>

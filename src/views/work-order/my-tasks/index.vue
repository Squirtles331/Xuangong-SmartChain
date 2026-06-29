<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待开工" name="assigned">
        <!-- 搜索+筛选 -->
        <div class="search-bar">
          <el-input
            v-model="assignedSearch.keyword"
            placeholder="搜索工单号"
            clearable
            style="width: 200px"
            @input="assignedPagination.currentPage = 1"
          />
          <el-select
            v-model="assignedSearch.priority"
            placeholder="优先级"
            clearable
            style="width: 120px; margin-left: 8px"
            @change="assignedPagination.currentPage = 1"
          >
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="普通" value="normal" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        <el-empty v-if="pagedAssigned.length === 0" description="暂无待开工任务" />
        <div v-else class="task-list">
          <el-card v-for="task in pagedAssigned" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag :type="task.wo_priority === 'urgent' ? 'danger' : 'info'" size="small">{{
                task.wo_priority === 'urgent' ? '紧急' : '普通'
              }}</el-tag>
            </div>
            <div class="task-body">
              <p>
                <strong>工序{{ task.operation_no }}:</strong> {{ task.operation_name }}
              </p>
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
        <el-pagination
          v-if="filteredAssigned.length > assignedPagination.pageSize"
          v-model:current-page="assignedPagination.currentPage"
          v-model:page-size="assignedPagination.pageSize"
          :total="filteredAssigned.length"
          :page-sizes="[6, 12, 18]"
          layout="total, sizes, prev, pager, next"
          small
          style="margin-top: 16px; justify-content: center"
        />
      </el-tab-pane>

      <el-tab-pane label="生产中" name="running">
        <div class="search-bar">
          <el-input
            v-model="runningSearch.keyword"
            placeholder="搜索工单号"
            clearable
            style="width: 200px"
            @input="runningPagination.currentPage = 1"
          />
          <el-select
            v-model="runningSearch.priority"
            placeholder="优先级"
            clearable
            style="width: 120px; margin-left: 8px"
            @change="runningPagination.currentPage = 1"
          >
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="普通" value="normal" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        <el-empty v-if="pagedRunning.length === 0" description="暂无生产中任务" />
        <div v-else class="task-list">
          <el-card v-for="task in pagedRunning" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag type="warning" size="small">进行中</el-tag>
            </div>
            <div class="task-body">
              <p>
                <strong>工序{{ task.operation_no }}:</strong> {{ task.operation_name }}
              </p>
              <p>产品: {{ task.material_name }}</p>
              <p>已报工: {{ task.reported_qty }} / {{ task.planned_qty }} 台</p>
              <el-progress :percentage="Math.round((task.reported_qty / task.planned_qty) * 100)" :stroke-width="8" />
            </div>
            <div class="task-footer">
              <el-button type="success" @click="$router.push(`/work-order/report/${task.wo_id}`)">报工</el-button>
              <el-button type="warning" @click="reportException(task)">异常上报</el-button>
            </div>
          </el-card>
        </div>
        <el-pagination
          v-if="filteredRunning.length > runningPagination.pageSize"
          v-model:current-page="runningPagination.currentPage"
          v-model:page-size="runningPagination.pageSize"
          :total="filteredRunning.length"
          :page-sizes="[6, 12, 18]"
          layout="total, sizes, prev, pager, next"
          small
          style="margin-top: 16px; justify-content: center"
        />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { myTasks as mockMyTasks } from '@/mock'
import type { TableColumnItem } from 'gi-component'

interface Task {
  id: string
  wo_id: string
  wo_code: string
  wo_priority: string
  material_name: string
  operation_no: number
  operation_name: string
  work_center: string
  planned_qty: number
  reported_qty: number
  planned_start: string
  planned_end: string
  status: string
  qc_required?: boolean
  inspected?: boolean
}

const activeTab = ref('assigned')

const assignedTasks = ref<Task[]>(mockMyTasks.assigned as any)
const runningTasks = ref<Task[]>(mockMyTasks.running as any)
const completedTasks = ref<Task[]>(mockMyTasks.completed as any)

// 搜索+筛选
const assignedSearch = reactive({ keyword: '', priority: '' })
const runningSearch = reactive({ keyword: '', priority: '' })

const assignedPagination = reactive({ currentPage: 1, pageSize: 6 })
const runningPagination = reactive({ currentPage: 1, pageSize: 6 })

const filteredAssigned = computed(() => {
  return assignedTasks.value.filter((t) => {
    if (assignedSearch.keyword && !t.wo_code.includes(assignedSearch.keyword)) return false
    if (assignedSearch.priority && t.wo_priority !== assignedSearch.priority) return false
    return true
  })
})

const filteredRunning = computed(() => {
  return runningTasks.value.filter((t) => {
    if (runningSearch.keyword && !t.wo_code.includes(runningSearch.keyword)) return false
    if (runningSearch.priority && t.wo_priority !== runningSearch.priority) return false
    return true
  })
})

const pagedAssigned = computed(() => {
  const s = (assignedPagination.currentPage - 1) * assignedPagination.pageSize
  return filteredAssigned.value.slice(s, s + assignedPagination.pageSize)
})

const pagedRunning = computed(() => {
  const s = (runningPagination.currentPage - 1) * runningPagination.pageSize
  return filteredRunning.value.slice(s, s + runningPagination.pageSize)
})

const completedColumns: TableColumnItem<Task>[] = [
  { prop: 'wo_code', label: '工单', width: 150 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'operation_name', label: '工序', width: 100 },
  { prop: 'reported_qty', label: '报工数', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' }
]

function startWork(task: Task) {
  task.status = 'running'
  runningTasks.value.unshift(task)
  assignedTasks.value = assignedTasks.value.filter((t) => t.id !== task.id)
  ElMessage.success('已开工')
}

const exceptionVisible = ref(false)
const exceptionForm = reactive({ type: 'equipment', description: '' })
function reportException(_task: Task) {
  exceptionVisible.value = true
}
function submitException() {
  ElMessage.success('异常已上报，维修人员已通知')
  exceptionVisible.value = false
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.task-card {
  cursor: pointer;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.task-code {
  font-weight: 600;
}
.task-body p {
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
}
.task-footer {
  margin-top: 12px;
  text-align: right;
}
</style>

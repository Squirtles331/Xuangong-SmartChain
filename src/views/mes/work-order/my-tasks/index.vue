<template>
  <gi-page-layout>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待开工" name="assigned">
        <div class="search-bar">
          <el-input v-model="assignedSearch.keyword" placeholder="搜索工单号" clearable style="width: 220px" />
          <el-select v-model="assignedSearch.priority" placeholder="优先级" clearable style="width: 120px; margin-left: 8px">
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="普通" value="normal" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        <el-empty v-if="filteredAssigned.length === 0" description="暂无待开工任务" />
        <div v-else class="task-list">
          <el-card v-for="task in filteredAssigned" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag :type="priorityTag(task.wo_priority)" size="small">{{ priorityLabel(task.wo_priority) }}</el-tag>
            </div>
            <div class="task-body">
              <p>
                <strong>工序{{ task.operation_no }}：</strong>{{ task.operation_name }}
              </p>
              <p>产品：{{ task.material_name }}</p>
              <p>工作中心：{{ task.work_center }}</p>
              <p>计划数量：{{ task.planned_qty }} 件</p>
              <p>计划时间：{{ task.planned_start }} ~ {{ task.planned_end }}</p>
            </div>
            <div class="task-footer">
              <el-button type="primary" @click="startWork(task)">开工</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="生产中" name="running">
        <div class="search-bar">
          <el-input v-model="runningSearch.keyword" placeholder="搜索工单号" clearable style="width: 220px" />
          <el-select v-model="runningSearch.priority" placeholder="优先级" clearable style="width: 120px; margin-left: 8px">
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="普通" value="normal" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        <el-empty v-if="filteredRunning.length === 0" description="暂无生产中任务" />
        <div v-else class="task-list">
          <el-card v-for="task in filteredRunning" :key="task.id" shadow="hover" class="task-card">
            <div class="task-header">
              <span class="task-code">{{ task.wo_code }}</span>
              <el-tag type="warning" size="small">进行中</el-tag>
            </div>
            <div class="task-body">
              <p>
                <strong>工序{{ task.operation_no }}：</strong>{{ task.operation_name }}
              </p>
              <p>产品：{{ task.material_name }}</p>
              <p>已报工：{{ task.reported_qty }} / {{ task.planned_qty }} 件</p>
              <el-progress :percentage="Math.round((task.reported_qty / task.planned_qty) * 100)" :stroke-width="8" />
            </div>
            <div class="task-footer">
              <el-button type="success" @click="$router.push(`/mes/execution/report/${task.wo_id}`)">报工</el-button>
              <el-button type="warning" @click="reportException(task)">异常上报</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="已完工" name="completed">
        <TableSetting title="已完工任务" :columns="completedColumns">
          <template #default="{ settingColumns, tableProps }">
            <gi-table :columns="settingColumns" :data="completedTasks" v-bind="tableProps" border size="small">
              <template #status="{ row }">
                <el-tag v-if="row.qc_required && !row.inspected" type="warning" size="small">待质检</el-tag>
                <el-tag v-else type="success" size="small">已完工</el-tag>
              </template>
            </gi-table>
          </template>
        </TableSetting>
      </el-tab-pane>
    </el-tabs>

    <ExceptionFormDialog v-model:visible="exceptionVisible" v-model:form="exceptionForm" @confirm="submitException" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import TableSetting from '@/components/TableSetting.vue'
import { getMyTasks, startOperation, type MyTask } from '@/api/work-order'
import ExceptionFormDialog, { type ExceptionFormModel } from './ExceptionFormDialog.vue'

type Task = MyTask

const activeTab = ref('assigned')
const assignedTasks = ref<Task[]>([])
const runningTasks = ref<Task[]>([])
const completedTasks = ref<Task[]>([])

const assignedSearch = reactive({ keyword: '', priority: '' })
const runningSearch = reactive({ keyword: '', priority: '' })

const exceptionVisible = ref(false)
const exceptionForm = ref<ExceptionFormModel>({ type: 'equipment', description: '' })

const completedColumns: TableColumnItem<Task>[] = [
  { prop: 'wo_code', label: '工单号', width: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 140 },
  { prop: 'operation_name', label: '工序', width: 100 },
  { prop: 'reported_qty', label: '报工数', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' }
]

onMounted(() => {
  fetchMyTasks()
})

async function fetchMyTasks() {
  try {
    const response = await getMyTasks()
    assignedTasks.value = response.data.assigned || []
    runningTasks.value = response.data.running || []
    completedTasks.value = response.data.completed || []
  } catch {
    assignedTasks.value = []
    runningTasks.value = []
    completedTasks.value = []
  }
}

const filteredAssigned = computed(() =>
  assignedTasks.value.filter((task) => {
    if (assignedSearch.keyword && !task.wo_code.includes(assignedSearch.keyword)) return false
    if (assignedSearch.priority && task.wo_priority !== assignedSearch.priority) return false
    return true
  })
)

const filteredRunning = computed(() =>
  runningTasks.value.filter((task) => {
    if (runningSearch.keyword && !task.wo_code.includes(runningSearch.keyword)) return false
    if (runningSearch.priority && task.wo_priority !== runningSearch.priority) return false
    return true
  })
)

function priorityLabel(priority: string) {
  const map: Record<string, string> = {
    urgent: '紧急',
    high: '高',
    normal: '普通',
    low: '低'
  }
  return map[priority] || priority
}

function priorityTag(priority: string) {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  return 'info'
}

async function startWork(task: Task) {
  await startOperation(task.id)
  assignedTasks.value = assignedTasks.value.filter((item) => item.id !== task.id)
  runningTasks.value.unshift({
    ...task,
    status: 'running'
  })
  ElMessage.success('已开工')
}

function reportException(_task: Task) {
  exceptionForm.value = { type: 'equipment', description: '' }
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

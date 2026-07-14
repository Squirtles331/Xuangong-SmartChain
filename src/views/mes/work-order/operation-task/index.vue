<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="工序任务"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :segmented-options="segmentedOptions"
    @search="search"
    @reset="handleReset"
    @refresh="refreshView"
    @segmented-change="handleSegmentedChange"
  >
    <template #operation="{ row }">{{ row.operation_no }} - {{ row.operation_name }}</template>

    <template #priority="{ row }">
      <StatusTag :value="row.priority" :options="TASK_PRIORITY_OPTIONS" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="TASK_POOL_STATUS_OPTIONS" />
    </template>

    <template #blocked="{ row }">
      <el-tag v-if="row.blocked" type="danger" effect="light">已阻塞</el-tag>
      <el-tag v-else type="success" effect="light">通畅</el-tag>
    </template>

    <template #progress="{ row }">{{ row.reported_qty }} / {{ row.planned_qty }}</template>

    <template #dependency="{ row }">
      <el-tag :type="row.dependency_ready ? 'success' : 'warning'" effect="light">
        {{ row.dependency_ready ? '已就绪' : '待释放' }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">协调</el-button>
      <el-button link @click="goWorkOrder(row.wo_id)">工单</el-button>
      <el-button link :type="row.blocked ? 'success' : 'danger'" @click="toggleBlocked(row)">
        {{ row.blocked ? '解除阻塞' : '标记阻塞' }}
      </el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="任务协调面板" size="420px">
        <template v-if="currentTask">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="任务号">{{ currentTask.task_code }}</el-descriptions-item>
            <el-descriptions-item label="所属工单">{{ currentTask.wo_code }}</el-descriptions-item>
            <el-descriptions-item label="工序">{{ currentTask.operation_no }} - {{ currentTask.operation_name }}</el-descriptions-item>
            <el-descriptions-item label="依赖任务">{{ currentTask.dependency_task }}</el-descriptions-item>
            <el-descriptions-item label="阻塞原因">{{ currentTask.blocked_reason || '无' }}</el-descriptions-item>
            <el-descriptions-item label="释放说明">{{ currentTask.release_note }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-drawer>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import type { CrudSegmentedOption } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import {
  TASK_POOL_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  cloneSecondBatchData,
  operationTaskPoolRecords,
  type OperationTaskPoolRecord
} from '../second-batch-static'

const router = useRouter()
const tasks = ref<OperationTaskPoolRecord[]>(cloneSecondBatchData(operationTaskPoolRecords))
const drawerVisible = ref(false)
const currentTask = ref<OperationTaskPoolRecord | null>(null)
const segmentedStatus = ref<OperationTaskPoolRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(operationTaskPoolRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...TASK_POOL_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索任务号 / 工单号 / 产品名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: TASK_PRIORITY_OPTIONS,
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '生产车间',
    field: 'workshop',
    props: {
      options: workshopOptions,
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<OperationTaskPoolRecord>[] = [
  { prop: 'task_code', label: '任务号', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 150 },
  { label: '工序', minWidth: 160, slotName: 'operation' },
  { prop: 'work_center', label: '工作中心', minWidth: 120 },
  { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '阻塞信号', minWidth: 110, slotName: 'blocked', align: 'center' },
  { label: '进度', minWidth: 120, slotName: 'progress', align: 'center' },
  { label: '依赖就绪', minWidth: 110, slotName: 'dependency', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  priority: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<OperationTaskPoolRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const filtered = tasks.value.filter(matchTask)
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function matchTask(item: OperationTaskPoolRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.task_code, item.wo_code, item.material_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.priority && item.priority !== queryParams.priority) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: OperationTaskPoolRecord) {
  currentTask.value = row
  drawerVisible.value = true
}

function goWorkOrder(woId: string) {
  router.push(`/mes/work-order/${woId}`)
}

function toggleBlocked(row: OperationTaskPoolRecord) {
  row.blocked = !row.blocked
  row.blocked_reason = row.blocked ? '静态演示：等待协调后解除' : ''
  row.release_note = row.blocked ? '请同步异常中心与班组负责人' : '已解除协调阻塞'

  if (currentTask.value?.id === row.id) {
    currentTask.value = row
  }

  ElMessage.success(row.blocked ? '已标记为阻塞任务' : '已解除阻塞信号')
  refresh()
}

function refreshView() {
  tasks.value = cloneSecondBatchData(operationTaskPoolRecords)
  drawerVisible.value = false
  currentTask.value = null
  ElMessage.success('任务池视图已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.priority = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

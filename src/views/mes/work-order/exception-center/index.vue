<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="异常中心"
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
    <template #level="{ row }">
      <StatusTag :value="row.level" :options="EXCEPTION_LEVEL_OPTIONS" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="EXCEPTION_STATUS_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">详情</el-button>
      <el-button link type="warning" @click="advanceStatus(row)">推进状态</el-button>
      <el-button link @click="goWorkOrder(row.wo_id)">工单</el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="异常详情" size="460px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="异常号">{{ currentRecord.exception_code }}</el-descriptions-item>
            <el-descriptions-item label="当前状态">
              <StatusTag :value="currentRecord.status" :options="EXCEPTION_STATUS_OPTIONS" />
            </el-descriptions-item>
            <el-descriptions-item label="锁定范围">{{ currentRecord.lock_scope }}</el-descriptions-item>
            <el-descriptions-item label="责任人">{{ currentRecord.owner_name }}</el-descriptions-item>
            <el-descriptions-item label="放行前提">{{ currentRecord.release_gate }}</el-descriptions-item>
            <el-descriptions-item label="处理摘要">{{ currentRecord.action_summary }}</el-descriptions-item>
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
  EXCEPTION_LEVEL_OPTIONS,
  EXCEPTION_STATUS_OPTIONS,
  cloneSecondBatchData,
  executionExceptionRecords,
  type ExecutionExceptionRecord
} from '../second-batch-static'

const router = useRouter()
const records = ref<ExecutionExceptionRecord[]>(cloneSecondBatchData(executionExceptionRecords))
const drawerVisible = ref(false)
const currentRecord = ref<ExecutionExceptionRecord | null>(null)
const segmentedStatus = ref<ExecutionExceptionRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(executionExceptionRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...EXCEPTION_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索异常号 / 工单号 / 来源对象',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '等级',
    field: 'level',
    props: {
      options: EXCEPTION_LEVEL_OPTIONS,
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

const columns: TableColumnItem<ExecutionExceptionRecord>[] = [
  { prop: 'exception_code', label: '异常号', minWidth: 150 },
  { label: '等级', minWidth: 90, slotName: 'level', align: 'center' },
  { prop: 'source_object', label: '来源对象', minWidth: 140 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'operation_name', label: '工序', minWidth: 120 },
  { label: '状态', minWidth: 110, slotName: 'status', align: 'center' },
  { prop: 'lock_scope', label: '锁定范围', minWidth: 180 },
  { prop: 'owner_name', label: '责任人', minWidth: 120 },
  { prop: 'discovered_at', label: '识别时间', minWidth: 150 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  level: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<ExecutionExceptionRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const filtered = records.value.filter(matchRecord)
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function matchRecord(item: ExecutionExceptionRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.exception_code, item.wo_code, item.source_object].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.level && item.level !== queryParams.level) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: ExecutionExceptionRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function goWorkOrder(woId: string) {
  router.push(`/mes/work-order/${woId}`)
}

function advanceStatus(row: ExecutionExceptionRecord) {
  const chain: ExecutionExceptionRecord['status'][] = ['identified', 'locked', 'processing', 'awaiting_release', 'released', 'closed']
  const index = chain.indexOf(row.status)
  row.status = chain[Math.min(index + 1, chain.length - 1)]
  const statusLabel = EXCEPTION_STATUS_OPTIONS.find((item) => item.value === row.status)?.label || row.status
  row.action_summary = `静态演示：异常已推进到“${statusLabel}”`

  if (currentRecord.value?.id === row.id) {
    currentRecord.value = row
  }

  ElMessage.success('异常状态已推进')
  refresh()
}

function refreshView() {
  records.value = cloneSecondBatchData(executionExceptionRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('异常视图已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.level = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

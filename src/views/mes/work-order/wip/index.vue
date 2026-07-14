<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="WIP"
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
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="WIP_STATUS_OPTIONS" />
    </template>

    <template #signal="{ row }">
      <StatusTag :value="row.signal" :options="KANBAN_SIGNAL_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="goWorkOrder(row.wo_id)">工单</el-button>
      <el-button link :type="row.status === 'frozen' ? 'success' : 'danger'" @click="toggleFreeze(row)">
        {{ row.status === 'frozen' ? '解除冻结' : '冻结' }}
      </el-button>
      <el-button link type="warning" @click="startRework(row)">返工回流</el-button>
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
import { KANBAN_SIGNAL_OPTIONS, WIP_STATUS_OPTIONS, cloneSecondBatchData, wipBatchRecords, type WipBatchRecord } from '../second-batch-static'

const router = useRouter()
const batches = ref<WipBatchRecord[]>(cloneSecondBatchData(wipBatchRecords))
const segmentedStatus = ref<WipBatchRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(wipBatchRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...WIP_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索批次号 / 工单号 / 产品名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '信号等级',
    field: 'signal',
    props: {
      options: KANBAN_SIGNAL_OPTIONS,
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

const columns: TableColumnItem<WipBatchRecord>[] = [
  { prop: 'batch_code', label: 'WIP批次号', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 150 },
  { prop: 'current_operation', label: '当前工序', minWidth: 140 },
  { prop: 'next_operation', label: '下一工序', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
  { label: '批次状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '监控信号', minWidth: 100, slotName: 'signal', align: 'center' },
  { prop: 'hold_owner', label: '持有岗位', minWidth: 120 },
  { prop: 'last_report_time', label: '最近报工', minWidth: 150 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  signal: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<WipBatchRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const filtered = batches.value.filter(matchBatch)
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function matchBatch(item: WipBatchRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.batch_code, item.wo_code, item.material_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.signal && item.signal !== queryParams.signal) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function goWorkOrder(woId: string) {
  router.push(`/mes/work-order/${woId}`)
}

function toggleFreeze(row: WipBatchRecord) {
  if (row.status === 'frozen') {
    row.status = 'processing'
    row.freeze_reason = ''
    row.signal = 'attention'
    ElMessage.success('已解除冻结，批次恢复执行流转')
    refresh()
    return
  }

  row.status = 'frozen'
  row.freeze_reason = '静态演示：待异常中心确认后释放'
  row.signal = 'overdue'
  ElMessage.success('已冻结批次并同步至异常关注')
  refresh()
}

function startRework(row: WipBatchRecord) {
  row.status = 'rework'
  row.rework_route = row.rework_route || '静态演示：返工回流 -> 复检 -> 放行'
  row.signal = 'attention'
  ElMessage.success('已标记返工回流路径')
  refresh()
}

function refreshView() {
  batches.value = cloneSecondBatchData(wipBatchRecords)
  ElMessage.success('WIP 视图已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.signal = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

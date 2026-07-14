<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="返工执行"
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
      <StatusTag :value="row.status" :options="REWORK_STATUS_OPTIONS" />
    </template>

    <template #priority="{ row }">
      <StatusTag :value="row.priority" :options="REWORK_PRIORITY_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">详情</el-button>
      <el-button link type="warning" @click="advanceStatus(row)">推进</el-button>
      <el-button link @click="goWorkOrder(row)">工单</el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="返工执行详情" size="480px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="返工单号">{{ currentRecord.rework_code }}</el-descriptions-item>
            <el-descriptions-item label="QMS 裁决引用">{{ currentRecord.qms_decision_ref }}</el-descriptions-item>
            <el-descriptions-item label="返工路径">{{ currentRecord.rework_route }}</el-descriptions-item>
            <el-descriptions-item label="执行责任">{{ currentRecord.owner_name }}</el-descriptions-item>
            <el-descriptions-item label="复检责任">{{ currentRecord.recheck_owner }}</el-descriptions-item>
            <el-descriptions-item label="关闭说明">{{ currentRecord.close_note }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-drawer>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useRouter } from 'vue-router'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import type { CrudSegmentedOption } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import {
  REWORK_PRIORITY_OPTIONS,
  REWORK_STATUS_OPTIONS,
  cloneFifthBatchData,
  reworkOrderRecords,
  type ReworkOrderRecord
} from '../fifth-batch-static'

const router = useRouter()

const records = ref<ReworkOrderRecord[]>(cloneFifthBatchData(reworkOrderRecords))
const drawerVisible = ref(false)
const currentRecord = ref<ReworkOrderRecord | null>(null)
const segmentedStatus = ref<ReworkOrderRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(reworkOrderRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...REWORK_STATUS_OPTIONS.map((item) => ({
    label: item.label,
    value: item.value
  }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索返工单号 / 来源号 / 工单号 / 产品名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: REWORK_PRIORITY_OPTIONS,
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

const columns: TableColumnItem<ReworkOrderRecord>[] = [
  { prop: 'rework_code', label: '返工单号', minWidth: 150 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
  { prop: 'source_type', label: '来源类型', minWidth: 120 },
  { prop: 'source_code', label: '来源号', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 150 },
  { prop: 'workshop_name', label: '生产车间', minWidth: 140 },
  { prop: 'current_step', label: '当前步骤', minWidth: 180 },
  { prop: 'planned_finish', label: '计划完成', minWidth: 150 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  priority: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<ReworkOrderRecord>({
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

function matchRecord(item: ReworkOrderRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.rework_code, item.source_code, item.wo_code, item.material_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.priority && item.priority !== queryParams.priority) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: ReworkOrderRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function advanceStatus(row: ReworkOrderRecord) {
  const chain: ReworkOrderRecord['status'][] = ['pending_decision', 'released', 'executing', 'pending_recheck', 'closed']
  const index = chain.indexOf(row.status)
  row.status = chain[Math.min(index + 1, chain.length - 1)]

  if (row.status === 'released') row.current_step = '已获返工放行，待班组接收'
  if (row.status === 'executing') row.current_step = '返工执行中'
  if (row.status === 'pending_recheck') row.current_step = '返工完成，等待复检'
  if (row.status === 'closed') row.current_step = '返工链已关闭'

  if (currentRecord.value?.id === row.id) {
    currentRecord.value = row
  }

  ElMessage.success('返工状态已推进')
  refresh()
}

function goWorkOrder(row: ReworkOrderRecord) {
  const mapping: Record<string, string> = {
    WO202501150001: '1',
    WO202501140003: '3',
    WO202501130004: '4'
  }

  router.push(`/mes/work-order/${mapping[row.wo_code] || '1'}`)
}

function refreshView() {
  records.value = cloneFifthBatchData(reworkOrderRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('返工执行视图已刷新')
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

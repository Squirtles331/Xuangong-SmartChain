<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="投料与消耗"
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
    <template #plannedActual="{ row }">{{ row.planned_qty }} / {{ row.actual_qty }} {{ row.unit }}</template>

    <template #variance="{ row }">
      <StatusTag :value="row.variance_type" :options="CONSUMPTION_VARIANCE_OPTIONS" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="CONSUMPTION_STATUS_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">详情</el-button>
      <el-button link type="warning" @click="advanceStatus(row)">推进状态</el-button>
      <el-button link :type="row.variance_type === 'over' ? 'success' : 'danger'" @click="toggleVariance(row)">
        {{ row.variance_type === 'over' ? '复位偏差' : '标记超耗' }}
      </el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="投料消耗详情" size="460px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="记录号">{{ currentRecord.record_code }}</el-descriptions-item>
            <el-descriptions-item label="工单号">{{ currentRecord.wo_code }}</el-descriptions-item>
            <el-descriptions-item label="WMS引用">{{ currentRecord.warehouse_ref }}</el-descriptions-item>
            <el-descriptions-item label="补料引用">{{ currentRecord.supplement_ref || '无' }}</el-descriptions-item>
            <el-descriptions-item label="替代料引用">{{ currentRecord.substitute_ref || '无' }}</el-descriptions-item>
            <el-descriptions-item label="偏差说明">
              {{ currentRecord.variance_qty === 0 ? '无偏差' : `${currentRecord.variance_qty} ${currentRecord.unit}` }}
            </el-descriptions-item>
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
import CrudPage from '@/components/crud/CrudPage/index.vue'
import type { CrudSegmentedOption } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import {
  CONSUMPTION_STATUS_OPTIONS,
  CONSUMPTION_VARIANCE_OPTIONS,
  cloneThirdBatchData,
  consumptionRecords,
  type ConsumptionRecord
} from '../third-batch-static'

const records = ref<ConsumptionRecord[]>(cloneThirdBatchData(consumptionRecords))
const drawerVisible = ref(false)
const currentRecord = ref<ConsumptionRecord | null>(null)
const segmentedStatus = ref<ConsumptionRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(consumptionRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...CONSUMPTION_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索记录号 / 工单号 / 物料名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '偏差类型',
    field: 'variance',
    props: {
      options: CONSUMPTION_VARIANCE_OPTIONS,
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

const columns: TableColumnItem<ConsumptionRecord>[] = [
  { prop: 'record_code', label: '记录号', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'material_name', label: '物料名称', minWidth: 150 },
  { prop: 'batch_code', label: '批次号', minWidth: 140 },
  { label: '计划/实耗', minWidth: 130, slotName: 'plannedActual', align: 'center' },
  { label: '偏差', minWidth: 100, slotName: 'variance', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'warehouse_ref', label: 'WMS引用', minWidth: 150 },
  { prop: 'last_time', label: '最近记录', minWidth: 150 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  variance: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<ConsumptionRecord>({
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

function matchRecord(item: ConsumptionRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.record_code, item.wo_code, item.material_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.variance && item.variance_type !== queryParams.variance) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: ConsumptionRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function advanceStatus(row: ConsumptionRecord) {
  const chain: ConsumptionRecord['status'][] = ['draft', 'in_use', 'reconciled', 'closed']
  const index = chain.indexOf(row.status)
  row.status = chain[Math.min(index + 1, chain.length - 1)]

  if (currentRecord.value?.id === row.id) {
    currentRecord.value = row
  }

  ElMessage.success('消耗记录状态已推进')
  refresh()
}

function toggleVariance(row: ConsumptionRecord) {
  if (row.variance_type === 'over') {
    row.variance_type = 'normal'
    row.variance_qty = 0
    ElMessage.success('已复位偏差')
    refresh()
    return
  }

  row.variance_type = 'over'
  row.variance_qty = Math.max(row.variance_qty, 1)
  ElMessage.success('已标记超耗')
  refresh()
}

function refreshView() {
  records.value = cloneThirdBatchData(consumptionRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('投料记录已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.variance = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="产品追溯"
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
    <template #direction="{ row }">
      <StatusTag :value="row.trace_direction" :options="TRACE_DIRECTION_OPTIONS" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="TRACE_STATUS_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">查看链路</el-button>
      <el-button link @click="goWorkOrder(row.wo_code)">工单</el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="产品追溯链详情" size="500px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="追溯号">{{ currentRecord.trace_code }}</el-descriptions-item>
            <el-descriptions-item label="工单号">{{ currentRecord.wo_code }}</el-descriptions-item>
            <el-descriptions-item label="报工引用">{{ currentRecord.report_ref || '无' }}</el-descriptions-item>
            <el-descriptions-item label="检验引用">{{ currentRecord.inspection_ref || '无' }}</el-descriptions-item>
            <el-descriptions-item label="WMS引用">{{ currentRecord.warehouse_ref || '无' }}</el-descriptions-item>
            <el-descriptions-item label="设备引用">{{ currentRecord.equipment_ref || '无' }}</el-descriptions-item>
          </el-descriptions>

          <div class="trace-nodes">
            <div v-for="node in currentRecord.chain_nodes" :key="node" class="trace-node">{{ node }}</div>
          </div>
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
  TRACE_DIRECTION_OPTIONS,
  TRACE_STATUS_OPTIONS,
  cloneFourthBatchData,
  productTraceRecords,
  type ProductTraceRecord
} from '../fourth-batch-static'

const router = useRouter()
const records = ref<ProductTraceRecord[]>(cloneFourthBatchData(productTraceRecords))
const drawerVisible = ref(false)
const currentRecord = ref<ProductTraceRecord | null>(null)
const segmentedStatus = ref<ProductTraceRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(productTraceRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...TRACE_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索追溯号 / 序列号 / 工单号 / 产品名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '追溯方向',
    field: 'direction',
    props: {
      options: TRACE_DIRECTION_OPTIONS,
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

const columns: TableColumnItem<ProductTraceRecord>[] = [
  { prop: 'trace_code', label: '追溯号', minWidth: 150 },
  { prop: 'serial_code', label: '序列号', minWidth: 170 },
  { prop: 'product_name', label: '产品名称', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { label: '方向', minWidth: 100, slotName: 'direction', align: 'center' },
  { label: '链路状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'material_batch', label: '物料批次', minWidth: 140 },
  { prop: 'impact_scope', label: '影响范围', minWidth: 180 },
  { prop: 'latest_time', label: '最近更新时间', minWidth: 150 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  direction: '',
  workshop: ''
})

const { tableData, pagination, loading, search } = useTable<ProductTraceRecord>({
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

function matchRecord(item: ProductTraceRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.trace_code, item.serial_code, item.wo_code, item.product_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.direction && item.trace_direction !== queryParams.direction) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: ProductTraceRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function goWorkOrder(woCode: string) {
  const mapping: Record<string, string> = {
    WO202501150001: '1',
    WO202501150002: '2',
    WO202501140003: '3'
  }

  router.push(`/mes/work-order/${mapping[woCode] || '1'}`)
}

function refreshView() {
  records.value = cloneFourthBatchData(productTraceRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('追溯链已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.direction = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

<style scoped>
.trace-nodes {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trace-node {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
  color: #334155;
}
</style>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="执行日志"
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
      <StatusTag :value="row.status" :options="AUDIT_STATUS_OPTIONS" />
    </template>

    <template #category="{ row }">
      <StatusTag :value="row.category" :options="AUDIT_CATEGORY_OPTIONS" />
    </template>

    <template #transition="{ row }">{{ row.before_status }} -> {{ row.after_status }}</template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">详情</el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="执行日志详情" size="460px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="日志号">{{ currentRecord.log_code }}</el-descriptions-item>
            <el-descriptions-item label="对象">{{ currentRecord.object_type }} / {{ currentRecord.object_code }}</el-descriptions-item>
            <el-descriptions-item label="来源页面">{{ currentRecord.source_page }}</el-descriptions-item>
            <el-descriptions-item label="班次">{{ currentRecord.shift_name }}</el-descriptions-item>
            <el-descriptions-item label="状态变化">{{ currentRecord.before_status }} -> {{ currentRecord.after_status }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ currentRecord.remark }}</el-descriptions-item>
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
  AUDIT_CATEGORY_OPTIONS,
  AUDIT_STATUS_OPTIONS,
  cloneFourthBatchData,
  productionLogRecords,
  type ProductionLogRecord
} from '../fourth-batch-static'

const records = ref<ProductionLogRecord[]>(cloneFourthBatchData(productionLogRecords))
const drawerVisible = ref(false)
const currentRecord = ref<ProductionLogRecord | null>(null)
const segmentedStatus = ref<ProductionLogRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(productionLogRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...AUDIT_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索日志号 / 对象号 / 动作名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '动作分类',
    field: 'category',
    props: {
      options: AUDIT_CATEGORY_OPTIONS,
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

const columns: TableColumnItem<ProductionLogRecord>[] = [
  { prop: 'log_code', label: '日志号', minWidth: 150 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '分类', minWidth: 100, slotName: 'category', align: 'center' },
  { prop: 'object_type', label: '对象类型', minWidth: 120 },
  { prop: 'object_code', label: '对象号', minWidth: 150 },
  { prop: 'action_name', label: '动作', minWidth: 130 },
  { label: '状态变化', minWidth: 150, slotName: 'transition' },
  { prop: 'operator_name', label: '操作人', minWidth: 120 },
  { prop: 'happened_at', label: '发生时间', minWidth: 150 },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  category: '',
  workshop: ''
})

const { tableData, pagination, loading, search } = useTable<ProductionLogRecord>({
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

function matchRecord(item: ProductionLogRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.log_code, item.object_code, item.action_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.category && item.category !== queryParams.category) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: ProductionLogRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function refreshView() {
  records.value = cloneFourthBatchData(productionLogRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('执行日志已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.category = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

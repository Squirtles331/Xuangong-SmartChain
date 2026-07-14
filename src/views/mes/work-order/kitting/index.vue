<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="segmentedStatus"
    title="开工齐套检查"
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
    <template #materialSignal="{ row }">
      <StatusTag :value="row.material_signal" :options="READINESS_SIGNAL_OPTIONS" />
    </template>

    <template #versionSignal="{ row }">
      <StatusTag :value="row.version_signal" :options="READINESS_SIGNAL_OPTIONS" />
    </template>

    <template #batchSignal="{ row }">
      <StatusTag :value="row.batch_signal" :options="READINESS_SIGNAL_OPTIONS" />
    </template>

    <template #qualitySignal="{ row }">
      <StatusTag :value="row.quality_signal" :options="READINESS_SIGNAL_OPTIONS" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="KITTING_STATUS_OPTIONS" />
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" @click="openDrawer(row)">详情</el-button>
      <el-button link :type="row.status === 'blocked' ? 'warning' : 'danger'" @click="toggleBlocked(row)">
        {{ row.status === 'blocked' ? '解除阻塞' : '标记阻塞' }}
      </el-button>
      <el-button link type="success" @click="releaseRecord(row)">放行</el-button>
    </template>

    <template #dialog>
      <el-drawer v-model="drawerVisible" title="开工放行条件详情" size="460px">
        <template v-if="currentRecord">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="放行单号">{{ currentRecord.release_code }}</el-descriptions-item>
            <el-descriptions-item label="工单号">{{ currentRecord.wo_code }}</el-descriptions-item>
            <el-descriptions-item label="BOM版本">{{ currentRecord.bom_version }}</el-descriptions-item>
            <el-descriptions-item label="工艺版本">{{ currentRecord.routing_version }}</el-descriptions-item>
            <el-descriptions-item label="阻塞原因">{{ currentRecord.blocker_reason || '无' }}</el-descriptions-item>
            <el-descriptions-item label="放行说明">{{ currentRecord.release_note }}</el-descriptions-item>
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
import { KITTING_STATUS_OPTIONS, READINESS_SIGNAL_OPTIONS, cloneThirdBatchData, kittingRecords, type KittingRecord } from '../third-batch-static'

const records = ref<KittingRecord[]>(cloneThirdBatchData(kittingRecords))
const drawerVisible = ref(false)
const currentRecord = ref<KittingRecord | null>(null)
const segmentedStatus = ref<KittingRecord['status'] | ''>('')

const workshopOptions = Array.from(new Set(kittingRecords.map((item) => item.workshop_name))).map((item) => ({
  label: item,
  value: item
}))

const segmentedOptions: CrudSegmentedOption[] = [
  { label: '全部', value: '' },
  ...KITTING_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: {
      placeholder: '搜索放行单号 / 工单号 / 产品名称',
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

const columns: TableColumnItem<KittingRecord>[] = [
  { prop: 'release_code', label: '放行单号', minWidth: 150 },
  { prop: 'wo_code', label: '工单号', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 150 },
  { prop: 'planned_start', label: '计划开工', minWidth: 150 },
  { label: '物料就绪', minWidth: 100, slotName: 'materialSignal', align: 'center' },
  { label: '版本就绪', minWidth: 100, slotName: 'versionSignal', align: 'center' },
  { label: '批次就绪', minWidth: 100, slotName: 'batchSignal', align: 'center' },
  { label: '放行关口', minWidth: 100, slotName: 'qualitySignal', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'release_owner', label: '责任人', minWidth: 140 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  workshop: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<KittingRecord>({
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

function matchRecord(item: KittingRecord) {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (keyword) {
    const haystack = [item.release_code, item.wo_code, item.material_name].join(' ').toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (segmentedStatus.value && item.status !== segmentedStatus.value) return false
  if (queryParams.workshop && item.workshop_name !== queryParams.workshop) return false

  return true
}

function openDrawer(row: KittingRecord) {
  currentRecord.value = row
  drawerVisible.value = true
}

function toggleBlocked(row: KittingRecord) {
  if (row.status === 'blocked') {
    row.status = 'ready'
    row.blocker_reason = ''
    row.release_note = '阻塞已解除，可进入放行确认'
    ElMessage.success('已解除阻塞')
    refresh()
    return
  }

  row.status = 'blocked'
  row.blocker_reason = '静态演示：待补齐来料 / 放行条件'
  row.release_note = '请同步 WMS / QMS / 异常中心后重新确认'
  ElMessage.success('已标记阻塞')
  refresh()
}

function releaseRecord(row: KittingRecord) {
  row.status = 'released'
  row.blocker_reason = ''
  row.release_note = '静态演示：放行成功，可进入执行链'

  if (currentRecord.value?.id === row.id) {
    currentRecord.value = row
  }

  ElMessage.success('已放行开工条件')
  refresh()
}

function refreshView() {
  records.value = cloneThirdBatchData(kittingRecords)
  drawerVisible.value = false
  currentRecord.value = null
  ElMessage.success('齐套视图已刷新')
  search()
}

function handleSegmentedChange() {
  search()
}

function handleReset() {
  queryParams.keyword = ''
  queryParams.workshop = ''
  segmentedStatus.value = ''
  search()
}
</script>

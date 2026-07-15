<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="currentLevel"
    title="扰动重排"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :segmented-options="segmentedOptions"
    :segmented-auto-search="true"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @toolbar-action="handleToolbarAction"
    @segmented-change="handleLevelChange"
  >
    <template #headerTop>
      <div class="page-summary">
        <div class="page-summary__title">APS 扰动重排建议</div>
        <div class="page-summary__desc">按扰动等级组织 APS 建议动作，MES 负责承接执行调整，当前阶段仅交付静态建议页。</div>
      </div>
    </template>

    <template #beforeTable>
      <div class="stats-grid">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">当前等级建议数</div>
          <div class="stats-card__value">{{ pagination.total }}</div>
        </el-card>
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">待下发</div>
          <div class="stats-card__value stats-card__value--warning">{{ pendingCount }}</div>
        </el-card>
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">已下发</div>
          <div class="stats-card__value stats-card__value--success">{{ releasedCount }}</div>
        </el-card>
      </div>
    </template>

    <template #level="{ row }">
      <StatusTag :value="row.level" :options="levelOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <DisturbanceRescheduleDialog v-model:visible="dialogVisible" :record="currentRecord" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { getApsRescheduleList, updateApsReschedule } from '@/static/services/aps'
import type { ApsRescheduleLevel, ApsRescheduleRecord } from '@/types/aps'
import DisturbanceRescheduleDialog from './DisturbanceRescheduleDialog.vue'

const segmentedOptions = [
  { label: 'L1 微调', value: 'L1' },
  { label: 'L2 局部重排', value: 'L2' },
  { label: 'L3 全局重排', value: 'L3' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const levelOptions = [
  { value: 'L1', label: 'L1 微调', type: 'success' as const },
  { value: 'L2', label: 'L2 局部重排', type: 'warning' as const },
  { value: 'L3', label: 'L3 全局重排', type: 'danger' as const }
]
const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'reviewing', label: '评审中', type: 'warning' as const },
  { value: 'released', label: '已下发', type: 'success' as const }
]

const currentLevel = ref<ApsRescheduleLevel>('L1')
const queryParams = ref({
  code: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '建议单号 / 扰动类型', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ApsRescheduleRecord>[] = [
  { prop: 'code', label: '建议单号', minWidth: 150 },
  { prop: 'disturbanceType', label: '扰动类型', minWidth: 160 },
  { label: '等级', width: 120, align: 'center', slotName: 'level' },
  { prop: 'scope', label: '影响范围', minWidth: 180 },
  { prop: 'affectedOrders', label: '影响工单', width: 100, align: 'center' },
  { prop: 'affectedCenters', label: '影响资源', minWidth: 180 },
  { prop: 'targetWindow', label: '建议窗口', minWidth: 180 },
  { label: '状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 170, fixed: 'right', align: 'center', slotName: 'actions' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ApsRescheduleRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getApsRescheduleList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      level: currentLevel.value,
      status: queryParams.value.status || undefined
    })
    return response.data
  }
})

const dialogVisible = ref(false)
const dialogMode = ref<'detail' | 'release'>('detail')
const currentRecord = ref<ApsRescheduleRecord | null>(null)

const pendingCount = computed(() => tableData.value.filter((item) => item.status !== 'released').length)
const releasedCount = computed(() => tableData.value.filter((item) => item.status === 'released').length)

function getRowActions(row: ApsRescheduleRecord): CrudRowActionItem[] {
  return [
    { key: 'detail', label: '查看', tone: 'primary' },
    { key: 'release', label: '下发建议', tone: 'success', hidden: row.status === 'released' }
  ]
}

function handleReset() {
  queryParams.value = {
    code: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('扰动重排静态数据已导出')
  }
}

function handleLevelChange() {
  queryParams.value = {
    code: '',
    status: ''
  }
}

function handleRowAction(action: string, row: ApsRescheduleRecord) {
  currentRecord.value = row
  dialogMode.value = action === 'release' ? 'release' : 'detail'
  dialogVisible.value = true
}

async function submitDialog() {
  if (!currentRecord.value) return

  await updateApsReschedule(currentRecord.value.id, { status: 'released' })
  dialogVisible.value = false
  ElMessage.success('重排建议已下发给 MES 承接执行')
  await refresh()
}
</script>

<style scoped>
.page-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-summary__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-summary__desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stats-card :deep(.el-card__body) {
  padding: 18px;
}

.stats-card__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.stats-card__value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stats-card__value--warning {
  color: #e6a23c;
}

.stats-card__value--success {
  color: #67c23a;
}
</style>

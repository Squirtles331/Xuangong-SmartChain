<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="排程历史"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @toolbar-action="handleToolbarAction"
  >
    <template #headerTop>
      <div class="page-summary">
        <div class="page-summary__title">APS 排程版本回看</div>
        <div class="page-summary__desc">沉淀静态版本列表、参数快照与冲突差异，便于后续扩展版本复盘能力。</div>
      </div>
    </template>

    <template #beforeTable>
      <div class="stats-grid">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">版本总数</div>
          <div class="stats-card__value">{{ pagination.total }}</div>
        </el-card>
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">当前主版本</div>
          <div class="stats-card__value stats-card__value--primary">{{ activeVersion?.versionCode || '--' }}</div>
        </el-card>
        <el-card shadow="hover" class="stats-card">
          <div class="stats-card__label">扰动回算次数</div>
          <div class="stats-card__value stats-card__value--warning">{{ disturbanceCount }}</div>
        </el-card>
      </div>
    </template>

    <template #triggerType="{ row }">
      <StatusTag :value="row.triggerType" :options="triggerOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ApsHistoryDetailDialog v-model:visible="detailVisible" :record="currentRecord" :mode="dialogMode" :active-version="activeVersion" />
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
import { getApsHistoryList } from '@/static/services/aps'
import type { ApsHistoryRecord } from '@/types/aps'
import ApsHistoryDetailDialog from './ApsHistoryDetailDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'detail', label: '查看', tone: 'primary' },
  { key: 'compare', label: '对比', tone: 'success' }
]

const triggerOptions = [
  { value: 'manual', label: '手动排程', type: 'primary' as const },
  { value: 'nightly', label: '夜间批算', type: 'info' as const },
  { value: 'disturbance', label: '扰动回算', type: 'warning' as const }
]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'active', label: '主版本', type: 'success' as const },
  { value: 'archived', label: '归档', type: 'warning' as const }
]

const queryParams = ref({
  versionCode: '',
  triggerType: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '版本号', field: 'versionCode', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '触发方式',
    field: 'triggerType',
    props: {
      options: triggerOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
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

const columns: TableColumnItem<ApsHistoryRecord>[] = [
  { prop: 'versionCode', label: '版本号', minWidth: 180 },
  { prop: 'planRange', label: '计划范围', minWidth: 180 },
  { label: '触发方式', minWidth: 120, align: 'center', slotName: 'triggerType' },
  { prop: 'constraintSet', label: '约束快照', minWidth: 220 },
  { prop: 'conflictCount', label: '冲突数', width: 90, align: 'center' },
  { prop: 'workOrderCount', label: '工单数', width: 90, align: 'center' },
  { prop: 'generatedBy', label: '生成人', minWidth: 120 },
  { prop: 'generatedAt', label: '生成时间', width: 160 },
  { label: '状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 150, fixed: 'right', align: 'center', slotName: 'actions' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ApsHistoryRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getApsHistoryList({
      pageNum: page,
      pageSize: size,
      versionCode: queryParams.value.versionCode || undefined,
      triggerType: queryParams.value.triggerType || undefined,
      status: queryParams.value.status || undefined
    })
    return response.data
  }
})

const detailVisible = ref(false)
const dialogMode = ref<'detail' | 'compare'>('detail')
const currentRecord = ref<ApsHistoryRecord | null>(null)

const activeVersion = computed(() => tableData.value.find((item) => item.status === 'active') || null)
const disturbanceCount = computed(() => tableData.value.filter((item) => item.triggerType === 'disturbance').length)

function handleReset() {
  queryParams.value = {
    versionCode: '',
    triggerType: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('排程历史静态数据已导出')
  }
}

function handleRowAction(action: string, row: ApsHistoryRecord) {
  currentRecord.value = row
  dialogMode.value = action === 'compare' ? 'compare' : 'detail'
  detailVisible.value = true
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

.stats-card__value--primary {
  color: #3b82f6;
}

.stats-card__value--warning {
  color: #e6a23c;
}
</style>

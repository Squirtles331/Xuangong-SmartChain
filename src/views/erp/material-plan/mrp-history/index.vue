<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="物料需求历史"
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
    <template #triggerType="{ row }">
      <StatusTag :value="row.triggerType" :options="triggerOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #expand="{ row }">
      <div class="expand-panel">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="运行范围">{{ row.scope }}</el-descriptions-item>
          <el-descriptions-item label="日期范围">{{ row.dateRange }}</el-descriptions-item>
          <el-descriptions-item label="运行策略">{{ row.strategy }}</el-descriptions-item>
          <el-descriptions-item label="安全库存">{{ row.includeSafetyStock ? '纳入' : '不纳入' }}</el-descriptions-item>
          <el-descriptions-item label="在途库存">{{ row.includeInTransit ? '纳入' : '不纳入' }}</el-descriptions-item>
          <el-descriptions-item label="提前期模式">{{ row.leadTimeMode }}</el-descriptions-item>
        </el-descriptions>
        <div class="expand-metrics">
          <span
            >销售需求 <b>{{ row.orders }}</b></span
          >
          <span
            >采购建议 <b>{{ row.purchaseSuggestions }}</b></span
          >
          <span
            >调拨建议 <b>{{ row.transferSuggestions }}</b></span
          >
          <span
            >生产建议 <b>{{ row.productionSuggestions }}</b></span
          >
          <span
            >建议总数 <b>{{ row.suggestions }}</b></span
          >
        </div>
      </div>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { getErpMrpHistoryList, runErpMrp, type ErpMrpHistoryRecord, type MrpHistoryStatus, type MrpHistoryTrigger } from '@/static/services/erp'

const router = useRouter()

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'view', label: '查看结果', tone: 'primary' },
  { key: 'replay', label: '沿用口径重跑', tone: 'success' }
]

const triggerOptions = [
  { value: 'manual', label: '手动触发', type: 'primary' as const },
  { value: 'nightly', label: '夜间批次', type: 'info' as const },
  { value: 'net_change', label: '净变更重算', type: 'warning' as const }
]

const statusOptions = [
  { value: 'completed', label: '已完成', type: 'success' as const },
  { value: 'reviewing', label: '待复核', type: 'warning' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const queryParams = reactive<{
  keyword: string
  triggerType: '' | MrpHistoryTrigger
  status: '' | MrpHistoryStatus
}>({
  keyword: '',
  triggerType: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { placeholder: '批次号 / 范围 / 策略 / 操作人', clearable: true } as any
  },
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

const columns: TableColumnItem<ErpMrpHistoryRecord>[] = [
  { type: 'expand', slotName: 'expand', width: 60 },
  { prop: 'id', label: '运行批次', minWidth: 170 },
  { prop: 'runTime', label: '运行时间', width: 160, align: 'center' },
  { prop: 'operator', label: '操作人', minWidth: 120 },
  { label: '触发方式', width: 120, align: 'center', slotName: 'triggerType' },
  { prop: 'scope', label: '运行范围', minWidth: 180 },
  { prop: 'suggestions', label: '建议总数', width: 100, align: 'center' },
  { label: '状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, align: 'center', fixed: 'right', slotName: 'actions' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ErpMrpHistoryRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getErpMrpHistoryList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      triggerType: queryParams.triggerType || undefined,
      status: queryParams.status || undefined
    })
    return response.data
  }
})

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    triggerType: '',
    status: ''
  })
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('MRP 历史静态数据已导出')
  }
}

async function handleRowAction(action: string, row: ErpMrpHistoryRecord) {
  if (action === 'view') {
    router.push({
      path: '/erp/material-plan/mrp-result',
      query: { runId: row.id }
    })
    return
  }

  if (action === 'replay') {
    await runErpMrp()
    ElMessage.success(`已按 ${row.id} 的静态口径追加一条重跑批次`)
    await refresh()
  }
}
</script>

<style scoped>
.expand-panel {
  padding: 12px 20px;
}

.expand-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 12px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>

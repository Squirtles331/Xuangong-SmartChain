<template>
  <CrudPage
    v-model:search-model="searchModel"
    v-model:segmented-value="activeTab"
    title="物料需求结果"
    :search-columns="[]"
    :segmented-options="segmentedOptions"
    :columns="currentColumns"
    :data="currentTableData"
    :loading="loading"
    :show-add-button="false"
    :show-refresh-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @segmented-change="handleSegmentedChange"
    @selection-change="handleSelectionChange"
  >
    <template #headerTop>
      <div class="page-header">
        <div class="page-header__title">物料需求结果</div>
        <div class="page-header__meta">
          <el-tag type="primary">运行批次 {{ summary?.runId || '--' }}</el-tag>
          <el-tag v-if="demandCode" type="warning">来源需求 {{ demandCode }}</el-tag>
          <el-tag type="success">最近运算 {{ summary?.lastRunTime || '--' }}</el-tag>
        </div>
      </div>
    </template>

    <template #tool>
      <el-space wrap>
        <el-button @click="router.push('/erp/material-plan/mrp-history')">查看历史</el-button>
        <el-button @click="loadPage">刷新结果</el-button>
        <el-button type="primary" @click="handleRunMrp">重跑 MRP</el-button>
      </el-space>
    </template>

    <template #beforeTable>
      <el-card shadow="never" class="run-card">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="MRP 范围">{{ summary?.scope || '--' }}</el-descriptions-item>
          <el-descriptions-item label="运算策略">{{ summary?.strategy || '--' }}</el-descriptions-item>
          <el-descriptions-item label="最近运算">{{ summary?.lastRunTime || '--' }}</el-descriptions-item>
        </el-descriptions>
        <el-alert
          class="run-card__alert"
          type="info"
          :closable="false"
          title="APS 继续负责排程结果，MES 和 WMS 继续负责执行与库存真相；本页只表达 ERP 的 MRP 建议承接。"
        />
      </el-card>
    </template>

    <template #tableToolbarLeft>
      <div v-if="activeTab !== 'exception'" class="action-row">
        <span class="action-row__hint">
          {{ activeTab === 'purchase' ? '批量确认后进入 ERP 承接状态，不代表采购执行完成。' : 'ERP 输出生产建议，实际工单执行仍由 MES 持有。' }}
        </span>
        <el-button type="primary" @click="confirmBatch(activeTab)">
          {{ activeTab === 'purchase' ? '批量确认采购建议' : '批量确认生产建议' }}
        </el-button>
      </div>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="suggestionStatusOptions" />
    </template>

    <template #actions="{ row }">
      <el-button type="primary" link @click="confirmOne(activeTab as 'purchase' | 'production', row.id)">确认承接</el-button>
    </template>

    <template #level="{ row }">
      <StatusTag :value="row.level" :options="exceptionLevelOptions" effect="dark" />
    </template>

    <template #detail="{ row }">
      <div class="exception-detail">
        <div>{{ row.detail }}</div>
        <div class="exception-detail__action">{{ row.action }}</div>
      </div>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import {
  confirmErpMrpSuggestions,
  getErpMrpResults,
  getErpMrpRunSummary,
  runErpMrp,
  type ErpMrpException,
  type ErpMrpProductionSuggestion,
  type ErpMrpPurchaseSuggestion,
  type ErpMrpRunSummary
} from '@/static/services/erp'

defineOptions({
  name: 'ErpMrpResultPage'
})

type MrpTabKey = 'purchase' | 'production' | 'exception'
type MrpResultRow = ErpMrpPurchaseSuggestion | ErpMrpProductionSuggestion | ErpMrpException

const route = useRoute()
const router = useRouter()

const searchModel = reactive({})
const activeTab = ref<MrpTabKey>('purchase')
const currentRunId = ref('')
const summary = ref<ErpMrpRunSummary | null>(null)
const purchaseList = ref<ErpMrpPurchaseSuggestion[]>([])
const productionList = ref<ErpMrpProductionSuggestion[]>([])
const exceptionList = ref<ErpMrpException[]>([])
const selectedPurchaseIds = ref<string[]>([])
const selectedProductionIds = ref<string[]>([])
const loading = ref(false)

const segmentedOptions = [
  { label: '采购建议', value: 'purchase' },
  { label: '生产建议', value: 'production' },
  { label: '例外提醒', value: 'exception' }
]

const demandCode = computed(() => String(route.query.demandCode || ''))

const suggestionStatusOptions = [
  { value: 'pending', label: '待承接', type: 'warning' as const },
  { value: 'reviewing', label: '待复核', type: 'primary' as const },
  { value: 'released', label: '已承接', type: 'success' as const }
]

const exceptionLevelOptions = [
  { value: 'critical', label: '高风险', type: 'danger' as const },
  { value: 'warning', label: '需协调', type: 'warning' as const },
  { value: 'info', label: '提示', type: 'info' as const }
]

const purchaseColumns: TableColumnItem<ErpMrpPurchaseSuggestion>[] = [
  { type: 'selection', width: 50 },
  { prop: 'code', label: '物料编码', minWidth: 130 },
  { prop: 'name', label: '物料名称', minWidth: 180 },
  { prop: 'qty', label: '建议采购量', width: 120, align: 'right' },
  { prop: 'orderDate', label: '建议下单日', width: 120, align: 'center' },
  { prop: 'needDate', label: '需求日期', width: 120, align: 'center' },
  { prop: 'supplier', label: '建议供应商', minWidth: 180 },
  { prop: 'source', label: '来源需求', minWidth: 180 },
  { label: '承接状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', width: 110, align: 'center', slotName: 'actions', fixed: 'right' }
]

const productionColumns: TableColumnItem<ErpMrpProductionSuggestion>[] = [
  { type: 'selection', width: 50 },
  { prop: 'code', label: '产品编码', minWidth: 130 },
  { prop: 'name', label: '产品名称', minWidth: 180 },
  { prop: 'qty', label: '建议生产量', width: 120, align: 'right' },
  { prop: 'startDate', label: '建议开工', width: 120, align: 'center' },
  { prop: 'endDate', label: '建议完工', width: 120, align: 'center' },
  { prop: 'bomVersion', label: 'BOM 版本', width: 120, align: 'center' },
  { prop: 'routingVersion', label: '工艺版本', width: 120, align: 'center' },
  { prop: 'source', label: '来源需求', minWidth: 180 },
  { label: '承接状态', width: 100, align: 'center', slotName: 'status' },
  { label: '操作', width: 110, align: 'center', slotName: 'actions', fixed: 'right' }
]

const exceptionColumns: TableColumnItem<ErpMrpException>[] = [
  { prop: 'type', label: '例外类型', minWidth: 120 },
  { prop: 'material', label: '关联物料', minWidth: 160 },
  { label: '风险级别', width: 100, align: 'center', slotName: 'level' },
  { label: '影响与建议', minWidth: 360, slotName: 'detail' }
]

const currentColumns = computed<TableColumnItem<MrpResultRow>[]>(() => {
  if (activeTab.value === 'purchase') return purchaseColumns as TableColumnItem<MrpResultRow>[]
  if (activeTab.value === 'production') return productionColumns as TableColumnItem<MrpResultRow>[]
  return exceptionColumns as TableColumnItem<MrpResultRow>[]
})

const currentTableData = computed<MrpResultRow[]>(() => {
  if (activeTab.value === 'purchase') return purchaseList.value
  if (activeTab.value === 'production') return productionList.value
  return exceptionList.value
})

async function loadSummary() {
  const summaryResponse = await getErpMrpRunSummary(currentRunId.value || undefined)
  summary.value = summaryResponse.data
  currentRunId.value = summaryResponse.data.runId
}

async function loadTabData(tab: MrpTabKey) {
  const response = await getErpMrpResults(currentRunId.value, {
    type: tab,
    pageNum: 1,
    pageSize: 100
  })

  if (tab === 'purchase') {
    purchaseList.value = response.data.list as ErpMrpPurchaseSuggestion[]
    selectedPurchaseIds.value = []
    return
  }

  if (tab === 'production') {
    productionList.value = response.data.list as ErpMrpProductionSuggestion[]
    selectedProductionIds.value = []
    return
  }

  exceptionList.value = response.data.list as ErpMrpException[]
}

async function loadPage() {
  loading.value = true
  try {
    await loadSummary()
    await loadTabData(activeTab.value)
  } finally {
    loading.value = false
  }
}

function handleSelectionChange(rows: MrpResultRow[]) {
  if (activeTab.value === 'purchase') {
    selectedPurchaseIds.value = (rows as ErpMrpPurchaseSuggestion[]).map((item) => item.id)
    return
  }

  if (activeTab.value === 'production') {
    selectedProductionIds.value = (rows as ErpMrpProductionSuggestion[]).map((item) => item.id)
  }
}

async function confirmOne(type: 'purchase' | 'production', id: string) {
  await confirmErpMrpSuggestions(currentRunId.value, [id])
  ElMessage.success(type === 'purchase' ? '采购建议已承接' : '生产建议已承接')
  await loadTabData(type)
}

async function confirmBatch(type: 'purchase' | 'production') {
  const ids = type === 'purchase' ? selectedPurchaseIds.value : selectedProductionIds.value

  if (!ids.length) {
    ElMessage.warning(type === 'purchase' ? '请先选择采购建议' : '请先选择生产建议')
    return
  }

  await confirmErpMrpSuggestions(currentRunId.value, ids)
  ElMessage.success(type === 'purchase' ? `已批量承接 ${ids.length} 条采购建议` : `已批量承接 ${ids.length} 条生产建议`)
  await loadTabData(type)
}

async function handleRunMrp() {
  loading.value = true
  try {
    const response = await runErpMrp()
    currentRunId.value = response.data.runId
    ElMessage.success('已按静态口径重跑一轮 MRP 建议')
    await loadPage()
  } finally {
    loading.value = false
  }
}

function handleSegmentedChange(value: string | number | boolean | '') {
  loadTabData(value as MrpTabKey)
}

watch(
  () => route.query.runId,
  async (runId) => {
    currentRunId.value = String(runId || '')
    await loadPage()
  },
  { immediate: true }
)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.page-header__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.run-card {
  margin-bottom: 16px;
}

.run-card__alert {
  margin-top: 16px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.action-row__hint {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.exception-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  line-height: 1.6;
}

.exception-detail__action {
  color: #2563eb;
}

@media (max-width: 960px) {
  .action-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

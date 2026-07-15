<template>
  <CrudPage
    v-model:search-model="searchModel"
    v-model:segmented-value="activeTab"
    title="总账对账"
    :search-columns="[]"
    :segmented-options="segmentedOptions"
    :columns="currentColumns"
    :data="currentTableData"
    :loading="loading"
    :show-add-button="false"
    :show-refresh-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
  >
    <template #headerTop>
      <div class="page-header">
        <div class="page-header__title">总账对账</div>
        <div class="page-header__meta">
          <el-tag type="primary">关账期间 {{ overview?.lastClosePeriod || '--' }}</el-tag>
        </div>
      </div>
    </template>

    <template #tool>
      <el-space wrap>
        <el-button @click="loadData">刷新</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </el-space>
    </template>

    <template #beforeTable>
      <el-alert :closable="false" type="info" class="boundary-alert" :title="overview?.carryNote || ''" />

      <el-row :gutter="16" class="account-row">
        <el-col :xs="24" :lg="12">
          <el-card shadow="never" header="借方科目">
            <gi-table :columns="accountColumns" :data="overview?.debitData || []" border stripe>
              <template #amount="{ row }">
                {{ formatAmount(row.amount) }}
              </template>
            </gi-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-card shadow="never" header="贷方科目">
            <gi-table :columns="accountColumns" :data="overview?.creditData || []" border stripe>
              <template #amount="{ row }">
                {{ formatAmount(row.amount) }}
              </template>
            </gi-table>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <template #debit="{ row }">
      {{ formatAmount(row.debit) }}
    </template>

    <template #credit="{ row }">
      {{ formatAmount(row.credit) }}
    </template>

    <template #diff="{ row }">
      <span :class="['diff-value', { 'diff-value--warn': row.diff !== 0 }]">
        {{ formatAmount(row.diff) }}
      </span>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="reconciliationStatusOptions" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import { getErpLedgerOverview, type ErpLedgerOverview } from '@/static/services/erp'

defineOptions({
  name: 'ErpLedgerPage'
})

type LedgerTabKey = 'ledger' | 'reconciliation'
type DebitAccountRow = ErpLedgerOverview['debitData'][number]
type LedgerEntryRow = ErpLedgerOverview['ledgerData'][number]
type ReconciliationRow = ErpLedgerOverview['recData'][number]
type LedgerTableRow = LedgerEntryRow | ReconciliationRow

const searchModel = reactive({})
const activeTab = ref<LedgerTabKey>('ledger')
const overview = ref<ErpLedgerOverview | null>(null)
const loading = ref(false)

const segmentedOptions = [
  { label: '总账分录', value: 'ledger' },
  { label: '对账结果', value: 'reconciliation' }
]

const reconciliationStatusOptions = [
  { value: 'matched', label: '已平衡', type: 'success' as const },
  { value: 'pending', label: '待处理', type: 'warning' as const }
]

const accountColumns: TableColumnItem<DebitAccountRow>[] = [
  { prop: 'code', label: '科目编码', minWidth: 120 },
  { prop: 'account', label: '科目名称', minWidth: 160 },
  { prop: 'type', label: '科目类型', width: 100, align: 'center' },
  { prop: 'amount', label: '金额', width: 130, align: 'right', slotName: 'amount' }
]

const ledgerColumns: TableColumnItem<LedgerEntryRow>[] = [
  { prop: 'date', label: '日期', width: 120, align: 'center' },
  { prop: 'voucher', label: '凭证号', minWidth: 140 },
  { prop: 'account', label: '科目', minWidth: 160 },
  { prop: 'debit', label: '借方金额', width: 130, align: 'right', slotName: 'debit' },
  { prop: 'credit', label: '贷方金额', width: 130, align: 'right', slotName: 'credit' },
  { prop: 'summary', label: '摘要', minWidth: 240 }
]

const reconciliationColumns: TableColumnItem<ReconciliationRow>[] = [
  { prop: 'date', label: '日期', width: 120, align: 'center' },
  { prop: 'voucher', label: '凭证号', minWidth: 140 },
  { prop: 'debit_account', label: '借方科目', minWidth: 160 },
  { prop: 'credit_account', label: '贷方科目', minWidth: 160 },
  { prop: 'debit', label: '借方金额', width: 130, align: 'right', slotName: 'debit' },
  { prop: 'credit', label: '贷方金额', width: 130, align: 'right', slotName: 'credit' },
  { label: '差异金额', width: 120, align: 'right', slotName: 'diff' },
  { label: '状态', width: 100, align: 'center', slotName: 'status' }
]

const currentColumns = computed<TableColumnItem<LedgerTableRow>[]>(() => {
  if (activeTab.value === 'ledger') return ledgerColumns as TableColumnItem<LedgerTableRow>[]
  return reconciliationColumns as TableColumnItem<LedgerTableRow>[]
})

const currentTableData = computed<LedgerTableRow[]>(() => {
  if (activeTab.value === 'ledger') return overview.value?.ledgerData || []
  return overview.value?.recData || []
})

function formatAmount(value?: number | null) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0

  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function loadData() {
  loading.value = true
  try {
    const response = await getErpLedgerOverview()
    overview.value = response.data
  } finally {
    loading.value = false
  }
}

function handleExport() {
  ElMessage.success('总账对账静态数据已导出')
}

onMounted(() => {
  loadData()
})
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

.boundary-alert {
  margin-bottom: 16px;
}

.account-row {
  margin-bottom: 16px;
}

.diff-value {
  color: #059669;
}

.diff-value--warn {
  color: #dc2626;
}
</style>

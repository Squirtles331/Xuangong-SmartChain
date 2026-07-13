<template>
  <gi-page-layout>
    <el-row :gutter="16">
      <el-col v-for="card in cards" :key="card.title" :span="6">
        <el-card shadow="hover">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">
            {{ formatAmount(card.value) }}
            <span class="card-unit">元</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="借方科目">
          <gi-table :columns="accountColumns" :data="debitData" border stripe size="small">
            <template #amount="{ row }">
              {{ formatAmount(row.amount) }}
            </template>
          </gi-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="贷方科目">
          <gi-table :columns="accountColumns" :data="creditData" border stripe size="small">
            <template #amount="{ row }">
              {{ formatAmount(row.amount) }}
            </template>
          </gi-table>
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="tab" style="margin-top: 16px">
      <el-tab-pane label="总账分录" name="ledger">
        <gi-table :columns="ledgerColumns" :data="ledgerData" border stripe size="small">
          <template #debit="{ row }">
            {{ formatAmount(row.debit) }}
          </template>

          <template #credit="{ row }">
            {{ formatAmount(row.credit) }}
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="对账结果" name="reconciliation">
        <gi-table :columns="reconciliationColumns" :data="reconciliationData" border stripe size="small">
          <template #debit="{ row }">
            {{ formatAmount(row.debit) }}
          </template>

          <template #credit="{ row }">
            {{ formatAmount(row.credit) }}
          </template>

          <template #diff="{ row }">
            <span :style="{ color: row.diff === 0 ? '#67c23a' : '#f56c6c' }">
              {{ row.diff === 0 ? '0.00' : formatAmount(row.diff) }}
            </span>
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'matched' ? 'success' : 'warning'">
              {{ row.status === 'matched' ? '已平衡' : '待处理' }}
            </el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import {
  getFinanceLedgerOverview,
  type FinanceAccountSummary,
  type FinanceLedgerCard,
  type FinanceLedgerEntry,
  type FinanceReconciliationItem
} from '@/api/finance'

const tab = ref('ledger')
const cards = ref<FinanceLedgerCard[]>([])
const debitData = ref<FinanceAccountSummary[]>([])
const creditData = ref<FinanceAccountSummary[]>([])
const ledgerData = ref<FinanceLedgerEntry[]>([])
const reconciliationData = ref<FinanceReconciliationItem[]>([])

const accountColumns: TableColumnItem<FinanceAccountSummary>[] = [
  { prop: 'code', label: '科目编码', minWidth: 100 },
  { prop: 'account', label: '科目名称', minWidth: 150 },
  { prop: 'type', label: '科目类型', minWidth: 100, align: 'center' },
  { prop: 'amount', label: '金额', minWidth: 120, align: 'right', slotName: 'amount' }
]

const ledgerColumns: TableColumnItem<FinanceLedgerEntry>[] = [
  { prop: 'date', label: '日期', minWidth: 110 },
  { prop: 'voucher', label: '凭证号', minWidth: 130 },
  { prop: 'account', label: '科目', minWidth: 150 },
  { prop: 'debit', label: '借方金额', minWidth: 120, align: 'right', slotName: 'debit' },
  { prop: 'credit', label: '贷方金额', minWidth: 120, align: 'right', slotName: 'credit' },
  { prop: 'summary', label: '摘要', minWidth: 220 }
]

const reconciliationColumns: TableColumnItem<FinanceReconciliationItem>[] = [
  { prop: 'date', label: '日期', minWidth: 110 },
  { prop: 'voucher', label: '凭证号', minWidth: 130 },
  { prop: 'debit_account', label: '借方科目', minWidth: 150 },
  { prop: 'credit_account', label: '贷方科目', minWidth: 150 },
  { prop: 'debit', label: '借方金额', minWidth: 120, align: 'right', slotName: 'debit' },
  { prop: 'credit', label: '贷方金额', minWidth: 120, align: 'right', slotName: 'credit' },
  { label: '差异金额', minWidth: 100, align: 'right', slotName: 'diff' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' }
]

function formatAmount(value: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function loadData() {
  const response = await getFinanceLedgerOverview()
  cards.value = response.data.cards
  debitData.value = response.data.debitData
  creditData.value = response.data.creditData
  ledgerData.value = response.data.ledgerData
  reconciliationData.value = response.data.recData
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-title {
  font-size: 13px;
  color: #909399;
}

.card-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
}

.card-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}
</style>

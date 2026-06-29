<template>
  <gi-page-layout>
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ Number(card.value || 0).toLocaleString() }}<span class="card-unit"> CNY</span></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="Debit Accounts">
          <gi-table :columns="debitColumns" :data="debitData" border stripe size="small" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="Credit Accounts">
          <gi-table :columns="creditColumns" :data="creditData" border stripe size="small" />
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="tab" style="margin-top: 16px">
      <el-tab-pane label="Ledger Entries" name="ledger">
        <gi-table :columns="ledgerColumns" :data="ledgerData" border stripe size="small" />
      </el-tab-pane>
      <el-tab-pane label="Reconciliation" name="reconciliation">
        <gi-table :columns="reconciliationColumns" :data="reconciliationData" border stripe size="small">
          <template #diff="{ row }">
            <span :style="{ color: row.diff !== 0 ? '#f56c6c' : '' }">
              {{ row.diff === 0 ? '0' : row.diff > 0 ? '+' + row.diff : row.diff }}
            </span>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { getFinanceLedgerOverview } from '@/api/finance'

const tab = ref('ledger')
const cards = ref<any[]>([])
const debitData = ref<any[]>([])
const creditData = ref<any[]>([])
const ledgerData = ref<any[]>([])
const reconciliationData = ref<any[]>([])

const debitColumns: TableColumnItem<any>[] = [
  { prop: 'code', label: 'Code', minWidth: 100 },
  { prop: 'account', label: 'Account', minWidth: 150 },
  { prop: 'type', label: 'Type', minWidth: 100 },
  { prop: 'amount', label: 'Amount', minWidth: 110, align: 'right' }
]

const creditColumns: TableColumnItem<any>[] = [
  { prop: 'code', label: 'Code', minWidth: 100 },
  { prop: 'account', label: 'Account', minWidth: 150 },
  { prop: 'type', label: 'Type', minWidth: 100 },
  { prop: 'amount', label: 'Amount', minWidth: 110, align: 'right' }
]

const ledgerColumns: TableColumnItem<any>[] = [
  { prop: 'date', label: 'Date', minWidth: 110 },
  { prop: 'voucher', label: 'Voucher', minWidth: 130 },
  { prop: 'account', label: 'Account', minWidth: 150 },
  { prop: 'debit', label: 'Debit', minWidth: 110, align: 'right' },
  { prop: 'credit', label: 'Credit', minWidth: 110, align: 'right' },
  { prop: 'summary', label: 'Summary', minWidth: 220 }
]

const reconciliationColumns: TableColumnItem<any>[] = [
  { prop: 'date', label: 'Date', minWidth: 110 },
  { prop: 'voucher', label: 'Voucher', minWidth: 130 },
  { prop: 'debit_account', label: 'Debit Account', minWidth: 150 },
  { prop: 'credit_account', label: 'Credit Account', minWidth: 150 },
  { prop: 'debit', label: 'Debit', minWidth: 110, align: 'right' },
  { prop: 'credit', label: 'Credit', minWidth: 110, align: 'right' },
  { label: 'Diff', minWidth: 90, align: 'center', slotName: 'diff' },
  { prop: 'status', label: 'Status', minWidth: 100, align: 'center' }
]

async function loadData() {
  const res = await getFinanceLedgerOverview()
  cards.value = res.data.cards || []
  debitData.value = res.data.debitData || []
  creditData.value = res.data.creditData || []
  ledgerData.value = res.data.ledgerData || []
  reconciliationData.value = res.data.recData || []
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
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
}

.card-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
</style>

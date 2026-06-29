<template>
  <gi-page-layout>
    <el-row :gutter="16">
      <el-col :span="6" v-for="c in cards" :key="c.title">
        <el-card shadow="hover">
          <div class="card-title">{{ c.title }}</div>
          <div class="card-value">{{ c.value.toLocaleString() }}<span class="card-unit"> 元</span></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="借方科目汇总">
          <gi-table :columns="debitCols" :data="debitData" border stripe size="small">
            <template #balance_type>
              <el-tag type="primary" size="small">借</el-tag>
            </template>
          </gi-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="贷方科目汇总">
          <gi-table :columns="creditCols" :data="creditData" border stripe size="small">
            <template #balance_type>
              <el-tag type="success" size="small">贷</el-tag>
            </template>
          </gi-table>
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="tab" style="margin-top: 16px">
      <el-tab-pane label="总账科目" name="ledger">
        <gi-table :columns="ledgerCols" :data="ledgerData" border stripe size="small">
          <template #balance_type="{ row }">
            <el-tag :type="row.balance_type === 'debit' ? 'primary' : 'success'" size="small">{{
              row.balance_type === 'debit' ? '借' : '贷'
            }}</el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="应收应付对账" name="reconciliation">
        <gi-table :columns="recCols" :data="recData" border stripe size="small">
          <template #diff="{ row }">
            <span :style="{ color: row.diff !== 0 ? '#f56c6c' : '' }">{{ row.diff === 0 ? '平' : row.diff > 0 ? '+' + row.diff : row.diff }}</span>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
const tab = ref('ledger')
const cards = [
  { title: '资产总额', value: 8500000 },
  { title: '负债总额', value: 3200000 },
  { title: '本月收入', value: 850000 },
  { title: '本月利润', value: 150000 }
]

// 借方数据
const debitData = ref(mockDebit as any)
const debitCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '科目编码', minWidth: 100 },
  { prop: 'name', label: '科目名称', minWidth: 150 },
  { label: '方向', minWidth: 50, slotName: 'balance_type', align: 'center' },
  { prop: 'begin_balance', label: '期初余额', minWidth: 110, align: 'right' },
  { prop: 'amount', label: '借方发生额', minWidth: 110, align: 'right' },
  { prop: 'end_balance', label: '期末余额', minWidth: 110, align: 'right' }
]

// 贷方数据
const creditData = ref(mockCredit as any)
const creditCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '科目编码', minWidth: 100 },
  { prop: 'name', label: '科目名称', minWidth: 150 },
  { label: '方向', minWidth: 50, slotName: 'balance_type', align: 'center' },
  { prop: 'begin_balance', label: '期初余额', minWidth: 110, align: 'right' },
  { prop: 'amount', label: '贷方发生额', minWidth: 110, align: 'right' },
  { prop: 'end_balance', label: '期末余额', minWidth: 110, align: 'right' }
]

const ledgerData = ref(mockLedger as any)
const ledgerCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '科目编码', minWidth: 100 },
  { prop: 'name', label: '科目名称', minWidth: 150 },
  { label: '方向', minWidth: 50, slotName: 'balance_type', align: 'center' },
  { prop: 'begin_balance', label: '期初余额', minWidth: 110, align: 'right' },
  { prop: 'debit', label: '借方发生', minWidth: 110, align: 'right' },
  { prop: 'credit', label: '贷方发生', minWidth: 110, align: 'right' },
  { prop: 'end_balance', label: '期末余额', minWidth: 110, align: 'right' }
]
const recData = ref(mockRec as any)
const recCols: TableColumnItem<any>[] = [
  { prop: 'customer', label: '往来单位', minWidth: 180 },
  { prop: 'ar_amount', label: '应收金额', minWidth: 110, align: 'right' },
  { prop: 'ap_amount', label: '应付金额', minWidth: 110, align: 'right' },
  { label: '差额', minWidth: 100, align: 'center', slotName: 'diff' },
  { prop: 'status', label: '状态', minWidth: 80, align: 'center' }
]
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

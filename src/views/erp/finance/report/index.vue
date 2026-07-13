<template>
  <gi-page-layout>
    <el-card header="月度经营概览">
      <el-descriptions :column="3" border>
        <el-descriptions-item label="营业收入">
          {{ formatAmount(currentMonth.revenue) }}
          <span :style="getTrendStyle(incomeTrend, true)">环比 {{ formatTrend(incomeTrend) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="营业成本">
          {{ formatAmount(currentMonth.cost) }}
          <span :style="getTrendStyle(costTrend, false)">环比 {{ formatTrend(costTrend) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="毛利">
          {{ formatAmount(currentMonth.gross) }}
          <span :style="getTrendStyle(grossTrend, true)">环比 {{ formatTrend(grossTrend) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="应收余额">
          {{ formatAmount(currentMonth.receivable) }}
          <span :style="getTrendStyle(receivableTrend, false)">环比 {{ formatTrend(receivableTrend) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="应付余额">
          {{ formatAmount(currentMonth.payable) }}
          <span :style="getTrendStyle(payableTrend, false)">环比 {{ formatTrend(payableTrend) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="净利润">
          {{ formatAmount(currentMonth.profit) }}
          <span :style="getTrendStyle(profitTrend, true)">环比 {{ formatTrend(profitTrend) }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getFinanceReportSummary, type FinanceReportMetrics } from '@/api/finance'

const currentMonth = ref<FinanceReportMetrics>({
  revenue: 0,
  cost: 0,
  gross: 0,
  receivable: 0,
  payable: 0,
  profit: 0
})

const lastMonth = ref<FinanceReportMetrics>({
  revenue: 0,
  cost: 0,
  gross: 0,
  receivable: 0,
  payable: 0,
  profit: 0
})

const incomeTrend = computed(() => calcTrend(currentMonth.value.revenue, lastMonth.value.revenue))
const costTrend = computed(() => calcTrend(currentMonth.value.cost, lastMonth.value.cost))
const grossTrend = computed(() => calcTrend(currentMonth.value.gross, lastMonth.value.gross))
const receivableTrend = computed(() => calcTrend(currentMonth.value.receivable, lastMonth.value.receivable))
const payableTrend = computed(() => calcTrend(currentMonth.value.payable, lastMonth.value.payable))
const profitTrend = computed(() => calcTrend(currentMonth.value.profit, lastMonth.value.profit))

function calcTrend(current: number, last: number) {
  if (!last) return 0
  return Number((((current - last) / last) * 100).toFixed(1))
}

function formatAmount(value: number) {
  return `￥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatTrend(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`
}

function getTrendStyle(value: number, positiveBetter: boolean) {
  const isPositive = value >= 0
  const color = positiveBetter ? (isPositive ? '#67c23a' : '#f56c6c') : isPositive ? '#f56c6c' : '#67c23a'
  return {
    color,
    marginLeft: '8px',
    fontSize: '12px'
  }
}

async function loadData() {
  const response = await getFinanceReportSummary()
  currentMonth.value = response.data.currentMonth
  lastMonth.value = response.data.lastMonth
}

onMounted(() => {
  loadData()
})
</script>

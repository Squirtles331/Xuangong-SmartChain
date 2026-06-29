<template>
  <gi-page-layout :bordered="true">
    <el-card header="月度经营概览">
      <el-descriptions :column="3" border>
        <el-descriptions-item label="营业收入">
          ¥850,000
          <span :style="{ color: incomeTrend > 0 ? '#f56c6c' : '#67c23a', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ incomeTrend > 0 ? '+' : '' }}{{ incomeTrend }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="营业成本">
          ¥620,000
          <span :style="{ color: costTrend > 0 ? '#f56c6c' : '#67c23a', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ costTrend > 0 ? '+' : '' }}{{ costTrend }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="毛利">
          ¥230,000
          <span :style="{ color: grossTrend > 0 ? '#67c23a' : '#f56c6c', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ grossTrend > 0 ? '+' : '' }}{{ grossTrend }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="应收余额">
          ¥310,000
          <span :style="{ color: arTrend > 0 ? '#f56c6c' : '#67c23a', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ arTrend > 0 ? '+' : '' }}{{ arTrend }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="应付余额">
          ¥180,000
          <span :style="{ color: apTrend > 0 ? '#f56c6c' : '#67c23a', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ apTrend > 0 ? '+' : '' }}{{ apTrend }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="净利润">
          ¥150,000
          <span :style="{ color: profitTrend > 0 ? '#67c23a' : '#f56c6c', marginLeft: '8px', fontSize: '12px' }">
            环比 {{ profitTrend > 0 ? '+' : '' }}{{ profitTrend }}%
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

// 上月数据
const lastMonth = {
  revenue: 820000,
  cost: 605000,
  gross: 215000,
  ar: 295000,
  ap: 175000,
  profit: 140000
}

// 本月数据
const currentMonth = {
  revenue: 850000,
  cost: 620000,
  gross: 230000,
  ar: 310000,
  ap: 180000,
  profit: 150000
}

function calcTrend(current: number, last: number): number {
  if (last === 0) return 0
  return +(((current - last) / last) * 100).toFixed(1)
}

const incomeTrend = ref(calcTrend(currentMonth.revenue, lastMonth.revenue))
const costTrend = ref(calcTrend(currentMonth.cost, lastMonth.cost))
const grossTrend = ref(calcTrend(currentMonth.gross, lastMonth.gross))
const arTrend = ref(calcTrend(currentMonth.ar, lastMonth.ar))
const apTrend = ref(calcTrend(currentMonth.ap, lastMonth.ap))
const profitTrend = ref(calcTrend(currentMonth.profit, lastMonth.profit))
</script>

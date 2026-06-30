<template>
  <gi-page-layout>
    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'completed' ? 'success' : 'danger'" size="small">
          {{ row.status === 'completed' ? '已完成' : '失败' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="$router.push(`/mrp/result?runId=${row.id}`)">查看结果</el-button>
      </template>
      <template #expand="{ row }">
        <div style="padding: 12px 24px">
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="运算范围">{{ row.scope }}</el-descriptions-item>
            <el-descriptions-item label="需求日期范围">{{ row.date_range || '2025-01-15 ~ 2025-02-15' }}</el-descriptions-item>
            <el-descriptions-item label="考虑安全库存">{{ row.include_safety_stock ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="考虑在途库存">{{ row.include_in_transit ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="提前期模式">{{ row.lead_time_mode || '标准' }}</el-descriptions-item>
            <el-descriptions-item label="运算策略">{{ row.strategy || '全量重算' }}</el-descriptions-item>
          </el-descriptions>
          <div style="margin-top: 12px; display: flex; gap: 24px; color: #606266; font-size: 13px">
            <span>输出统计：</span>
            <span
              >计划订单 <b>{{ row.orders }}</b></span
            >
            <span
              >采购建议 <b>{{ row.purchase_suggestions || 0 }}</b></span
            >
            <span
              >调拨建议 <b>{{ row.transfer_suggestions || 0 }}</b></span
            >
            <span
              >生产建议 <b>{{ row.production_suggestions || 0 }}</b></span
            >
            <span
              >总建议 <b>{{ row.suggestions }}</b></span
            >
          </div>
        </div>
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import type { TableColumnItem } from 'gi-component'
import { getMRPHistory } from '@/api/mrp'
import { useTable } from '@/hooks/useTable'

interface RunRow {
  id: string
  run_time: string
  operator: string
  scope: string
  date_range: string
  include_safety_stock: boolean
  include_in_transit: boolean
  lead_time_mode: string
  strategy: string
  orders: number
  purchase_suggestions: number
  transfer_suggestions: number
  production_suggestions: number
  suggestions: number
  status: string
}

const cols: TableColumnItem<RunRow>[] = [
  { type: 'expand', slotName: 'expand' },
  { prop: 'id', label: '运行编号', width: 170 },
  { prop: 'run_time', label: '运行时间', width: 170 },
  { prop: 'operator', label: '操作人', width: 80 },
  { prop: 'scope', label: '范围', width: 80 },
  { prop: 'orders', label: '销售订单数', minWidth: 100, align: 'center' },
  { prop: 'suggestions', label: '建议数', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading } = useTable<RunRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getMRPHistory({ pageNum: page, pageSize: size })
    const items = res.data.list
    return { list: items, total: res.data.total || items.length }
  }
})
</script>

<template>
  <gi-page-layout>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'completed' ? 'success' : 'danger'" size="small">{{
          row.status === 'completed' ? '已完成' : '失败'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button type="primary" link size="small" @click="$router.push(`/mrp/result?runId=${row.id}`)">查看结果</el-button></template
      >
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
import { ref, reactive, computed, watch } from 'vue'
import type { TableColumnItem } from 'gi-component'
interface Run {
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
const runs = ref<Run[]>([
  {
    id: 'MRP20250115001',
    run_time: '2025-01-15 08:00:00',
    operator: '张三',
    scope: '全厂',
    date_range: '2025-01-15 ~ 2025-02-15',
    include_safety_stock: true,
    include_in_transit: true,
    lead_time_mode: '标准',
    strategy: '全量重算',
    orders: 5,
    purchase_suggestions: 4,
    transfer_suggestions: 3,
    production_suggestions: 5,
    suggestions: 12,
    status: 'completed'
  },
  {
    id: 'MRP20250114001',
    run_time: '2025-01-14 08:00:00',
    operator: '张三',
    scope: '全厂',
    date_range: '2025-01-14 ~ 2025-02-14',
    include_safety_stock: true,
    include_in_transit: false,
    lead_time_mode: '标准',
    strategy: '净变更',
    orders: 3,
    purchase_suggestions: 2,
    transfer_suggestions: 1,
    production_suggestions: 5,
    suggestions: 8,
    status: 'completed'
  },
  {
    id: 'MRP20250113001',
    run_time: '2025-01-13 08:00:00',
    operator: '张三',
    scope: '全厂',
    date_range: '2025-01-13 ~ 2025-02-13',
    include_safety_stock: true,
    include_in_transit: true,
    lead_time_mode: '标准',
    strategy: '全量重算',
    orders: 2,
    purchase_suggestions: 1,
    transfer_suggestions: 0,
    production_suggestions: 4,
    suggestions: 5,
    status: 'completed'
  }
])
const cols: TableColumnItem<Run>[] = [
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
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pd = computed(() => runs.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  runs,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
</script>

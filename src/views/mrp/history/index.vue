<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'completed' ? 'success' : 'danger'" size="small">{{
          row.status === 'completed' ? '已完成' : '失败'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button type="primary" link size="small" @click="$router.push(`/mrp/result?runId=${row.id}`)">查看结果</el-button></template
      >
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
  orders: number
  suggestions: number
  status: string
}
const runs = ref<Run[]>([
  { id: 'MRP20250115001', run_time: '2025-01-15 08:00:00', operator: '张三', scope: '全厂', orders: 5, suggestions: 12, status: 'completed' },
  { id: 'MRP20250114001', run_time: '2025-01-14 08:00:00', operator: '张三', scope: '全厂', orders: 3, suggestions: 8, status: 'completed' },
  { id: 'MRP20250113001', run_time: '2025-01-13 08:00:00', operator: '张三', scope: '全厂', orders: 2, suggestions: 5, status: 'completed' }
])
const cols: TableColumnItem<Run>[] = [
  { prop: 'id', label: '运行编号', width: 170 },
  { prop: 'run_time', label: '运行时间', width: 170 },
  { prop: 'operator', label: '操作人', width: 80 },
  { prop: 'scope', label: '范围', width: 80 },
  { prop: 'orders', label: '销售订单数', width: 100, align: 'center' },
  { prop: 'suggestions', label: '建议数', width: 80, align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '操作', width: 100, slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pd = computed(() => {
  p.total = runs.value.length
  return runs.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize)
})
watch(
  runs,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
</script>

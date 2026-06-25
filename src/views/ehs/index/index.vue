<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #level="{ row }"
        ><el-tag :type="row.level === 'major' ? 'danger' : row.level === 'moderate' ? 'warning' : 'info'" size="small">{{
          row.level === 'major' ? '重大' : row.level === 'moderate' ? '一般' : '低风险'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'open' ? 'danger' : row.status === 'processing' ? 'warning' : 'success'" size="small">{{
          row.status === 'open' ? '待整改' : row.status === 'processing' ? '整改中' : '已关闭'
        }}</el-tag></template
      >
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
const data = ref([
  {
    id: '1',
    code: 'YH20250115001',
    location: '机加工一车间',
    desc: '冷却液泄漏',
    level: 'moderate',
    status: 'open',
    finder: '李四',
    found_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'YH20250110002',
    location: '装配车间',
    desc: '安全护栏损坏',
    level: 'major',
    status: 'processing',
    finder: '王五',
    found_at: '2025-01-10'
  },
  {
    id: '3',
    code: 'YH20250105003',
    location: '热处理车间',
    desc: '通风不畅',
    level: 'minor',
    status: 'closed',
    finder: '赵六',
    found_at: '2025-01-05'
  }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { prop: 'location', label: '位置', width: 140 },
  { prop: 'desc', label: '描述', minWidth: 180 },
  { label: '风险等级', width: 80, slotName: 'level', align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { prop: 'finder', label: '发现人', width: 80 },
  { prop: 'found_at', label: '发现时间', width: 110 }
]
function openAdd() {}
</script>

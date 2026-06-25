<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #type="{ row }"
        ><el-tag size="small">{{
          row.type === 'hot' ? '动火' : row.type === 'height' ? '高处' : row.type === 'confined' ? '受限空间' : '临时用电'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">{{
          row.status === 'approved' ? '已批准' : row.status === 'pending' ? '待审批' : '已关闭'
        }}</el-tag></template
      >
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
const data = ref([
  { id: '1', code: 'ZYP20250115001', type: 'hot', location: '机加工一车间', applicant: '李四', apply_date: '2025-01-15', status: 'approved' },
  { id: '2', code: 'ZYP20250116001', type: 'height', location: '装配车间', applicant: '王五', apply_date: '2025-01-16', status: 'pending' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { label: '类型', width: 80, slotName: 'type', align: 'center' },
  { prop: 'location', label: '作业位置', width: 140 },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'apply_date', label: '日期', width: 110 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' }
]
function openAdd() {}
</script>

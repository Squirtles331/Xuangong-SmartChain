<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #type="{ row }"
        ><el-tag :type="row.type === '电' ? 'warning' : row.type === '水' ? 'primary' : 'info'" size="small">{{ row.type }}</el-tag></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
const data = ref([
  { id: '1', date: '2025-01-15', type: '电', workshop: '机加工一车间', qty: 5800, unit: 'kWh' },
  { id: '2', date: '2025-01-15', type: '水', workshop: '全厂', qty: 120, unit: '吨' },
  { id: '3', date: '2025-01-15', type: '气', workshop: '热处理车间', qty: 350, unit: 'm³' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'date', label: '日期', width: 110 },
  { label: '类型', minWidth: 60, slotName: 'type', align: 'center' },
  { prop: 'workshop', label: '车间', width: 140 },
  { prop: 'qty', label: '用量', minWidth: 100, align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' }
]
</script>

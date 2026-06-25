<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #result="{ row }"><el-tag :type="row.result==='normal'?'success':row.result==='late'?'warning':'danger'" size="small">{{ row.result==='normal'?'正常':row.result==='late'?'迟到':'旷工' }}</el-tag></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const data=ref([{id:'1',employee:'李四',date:'2025-01-15',clock_in:'07:50',clock_out:'17:05',result:'normal'},{id:'2',employee:'王五',date:'2025-01-15',clock_in:'08:15',clock_out:'17:00',result:'late'},{id:'3',employee:'赵六',date:'2025-01-15',clock_in:'07:55',clock_out:'17:10',result:'normal'}])
const cols:TableColumnItem<any>[]=[{prop:'employee',label:'员工',width:80},{prop:'date',label:'日期',width:110},{prop:'clock_in',label:'上班打卡',width:100},{prop:'clock_out',label:'下班打卡',width:100},{label:'结果',width:60,slotName:'result',align:'center'}]
</script>

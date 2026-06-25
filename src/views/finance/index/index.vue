<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #status="{ row }"><el-tag :type="row.status==='open'?'warning':row.status==='paid'?'success':'info'" size="small">{{ row.status==='open'?'未付':row.status==='paid'?'已付':'部分付' }}</el-tag></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const data=ref([{id:'1',code:'AP20250115001',supplier:'XX钢材有限公司',amount:85000,paid:50000,balance:35000,due_date:'2025-02-15',status:'partial'},{id:'2',code:'AP20250110002',supplier:'YY轴承制造厂',amount:120000,paid:0,balance:120000,due_date:'2025-03-10',status:'open'},{id:'3',code:'AP20250105003',supplier:'ZZ标准件有限公司',amount:30000,paid:30000,balance:0,due_date:'2025-01-20',status:'paid'}])
const cols:TableColumnItem<any>[]=[{prop:'code',label:'应付单号',width:160},{prop:'supplier',label:'供应商',minWidth:150},{prop:'amount',label:'金额',width:100,align:'right'},{prop:'paid',label:'已付',width:100,align:'right'},{prop:'balance',label:'余额',width:100,align:'right'},{prop:'due_date',label:'到期日',width:110},{label:'状态',width:80,slotName:'status',align:'center'}]
</script>

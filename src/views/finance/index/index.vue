<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="应付账款" name="payable">
        <gi-table :columns="payCols" :data="payables" border stripe size="small">
          <template #status="{ row }"><el-tag :type="row.status==='open'?'warning':row.status==='paid'?'success':'info'" size="small">{{ row.status==='open'?'未付':row.status==='paid'?'已付':'部分付' }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="成本核算" name="cost">
        <el-row :gutter="16"><el-col :span="8" v-for="c in costs" :key="c.title"><el-card shadow="hover"><div class="cost-title">{{ c.title }}</div><div class="cost-value">{{ c.value.toLocaleString() }} 元</div></el-card></el-col></el-row>
      </el-tab-pane>
      <el-tab-pane label="财务报表" name="report">
        <el-card header="月度经营概览"><el-descriptions :column="3" border><el-descriptions-item label="营业收入">¥850,000</el-descriptions-item><el-descriptions-item label="营业成本">¥620,000</el-descriptions-item><el-descriptions-item label="毛利">¥230,000</el-descriptions-item><el-descriptions-item label="应收余额">¥310,000</el-descriptions-item><el-descriptions-item label="应付余额">¥180,000</el-descriptions-item><el-descriptions-item label="净利润">¥150,000</el-descriptions-item></el-descriptions></el-card>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'

const tab=ref('payable')
const payables=ref([{id:'1',code:'AP20250115001',supplier:'XX钢材有限公司',amount:85000,paid:50000,balance:35000,due_date:'2025-02-15',status:'partial'},{id:'2',code:'AP20250110002',supplier:'YY轴承制造厂',amount:120000,paid:0,balance:120000,due_date:'2025-03-10',status:'open'},{id:'3',code:'AP20250105003',supplier:'ZZ标准件有限公司',amount:30000,paid:30000,balance:0,due_date:'2025-01-20',status:'paid'}])
const payCols:TableColumnItem<any>[]=[{prop:'code',label:'应付单号',width:160},{prop:'supplier',label:'供应商',minWidth:150},{prop:'amount',label:'金额',width:100,align:'right'},{prop:'paid',label:'已付',width:100,align:'right'},{prop:'balance',label:'余额',width:100,align:'right'},{prop:'due_date',label:'到期日',width:110},{label:'状态',width:80,slotName:'status',align:'center'}]
const costs=[{title:'本月材料成本',value:380000},{title:'本月人工成本',value:150000},{title:'本月制造费用',value:90000}]
</script>
<style scoped>
.cost-title{font-size:13px;color:#909399}.cost-value{font-size:24px;font-weight:700;margin-top:8px}
</style>

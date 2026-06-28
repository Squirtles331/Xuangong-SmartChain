<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="16">
      <el-col :span="6" v-for="c in cards" :key="c.title"><el-card shadow="hover"><div class="card-title">{{ c.title }}</div><div class="card-value">{{ c.value.toLocaleString() }}<span class="card-unit"> 元</span></div></el-card></el-col>
    </el-row>
    <el-tabs v-model="tab" style="margin-top:16px">
      <el-tab-pane label="总账科目" name="ledger">
        <gi-table :columns="ledgerCols" :data="ledgerData" border stripe size="small">
          <template #balance_type="{ row }"><el-tag :type="row.balance_type==='debit'?'primary':'success'" size="small">{{ row.balance_type==='debit'?'借':'贷' }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="应收应付对账" name="reconciliation">
        <gi-table :columns="recCols" :data="recData" border stripe size="small">
          <template #diff="{ row }"><span :style="{color:row.diff!==0?'#f56c6c':''}">{{ row.diff===0?'平':(row.diff>0?'+'+row.diff:row.diff) }}</span></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const tab=ref('ledger')
const cards=[{title:'资产总额',value:8500000},{title:'负债总额',value:3200000},{title:'本月收入',value:850000},{title:'本月利润',value:150000}]
const ledgerData=ref([{code:'1001',name:'库存现金',balance_type:'debit',begin_balance:50000,debit:120000,credit:100000,end_balance:70000},{code:'1122',name:'应收账款',balance_type:'debit',begin_balance:450000,debit:850000,credit:620000,end_balance:680000},{code:'1403',name:'原材料',balance_type:'debit',begin_balance:1200000,debit:380000,credit:420000,end_balance:1160000},{code:'2202',name:'应付账款',balance_type:'credit',begin_balance:280000,debit:180000,credit:200000,end_balance:300000},{code:'4001',name:'实收资本',balance_type:'credit',begin_balance:5000000,debit:0,credit:0,end_balance:5000000},{code:'6001',name:'主营业务收入',balance_type:'credit',begin_balance:0,debit:0,credit:850000,end_balance:850000}])
const ledgerCols:TableColumnItem<any>[]=[{prop:'code',label:'科目编码',minWidth:100},{prop:'name',label:'科目名称',minWidth:150},{label:'方向',minWidth:50,slotName:'balance_type',align:'center'},{prop:'begin_balance',label:'期初余额',minWidth:110,align:'right'},{prop:'debit',label:'借方发生',minWidth:110,align:'right'},{prop:'credit',label:'贷方发生',minWidth:110,align:'right'},{prop:'end_balance',label:'期末余额',minWidth:110,align:'right'}]
const recData=ref([{id:'1',customer:'XX重工集团',ar_amount:310000,ap_amount:0,diff:310000,status:'应收'},{id:'2',customer:'YY机械设备',ar_amount:80000,ap_amount:0,diff:80000,status:'应收'},{id:'3',customer:'XX钢材有限公司',ar_amount:0,ap_amount:35000,diff:-35000,status:'应付'},{id:'4',customer:'ZZ标准件有限公司',ar_amount:0,ap_amount:0,diff:0,status:'已平'}])
const recCols:TableColumnItem<any>[]=[{prop:'customer',label:'往来单位',minWidth:180},{prop:'ar_amount',label:'应收金额',minWidth:110,align:'right'},{prop:'ap_amount',label:'应付金额',minWidth:110,align:'right'},{label:'差额',minWidth:100,align:'center',slotName:'diff'},{prop:'status',label:'状态',minWidth:80,align:'center'}]
</script>
<style scoped>.card-title{font-size:13px;color:#909399}.card-value{font-size:28px;font-weight:700;margin:8px 0}.card-unit{font-size:14px;color:#909399;margin-left:4px}</style>

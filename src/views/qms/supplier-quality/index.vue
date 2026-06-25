<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left:8px" type="reset" @click="refresh" /><el-button style="margin-left:8px" @click="handleExport">导出</el-button></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #pass_rate="{ row }"><el-progress :percentage="row.pass_rate" :stroke-width="8" :color="row.pass_rate>=95?'#67c23a':row.pass_rate>=80?'#e6a23c':'#f56c6c'" /></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive,computed,watch } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface SQ { id:string;supplier:string;total_batches:number;pass_batches:number;pass_rate:number;repeat_issues:number;last_inspection:string }
const data=ref<SQ[]>([{id:'1',supplier:'XX钢材有限公司',total_batches:24,pass_batches:22,pass_rate:91.7,repeat_issues:1,last_inspection:'2025-01-15'},{id:'2',supplier:'YY轴承制造厂',total_batches:18,pass_batches:17,pass_rate:94.4,repeat_issues:0,last_inspection:'2025-01-12'}])
const s=reactive({supplier:'',date_range:[] as string[]});const sc:FormColumnItem[]=[{type:'input',label:'供应商',field:'supplier'} as any,{type:'date-picker',label:'时间范围',field:'date_range',props:{type:'daterange'} as any}]
const cols:TableColumnItem<SQ>[]=[{prop:'supplier',label:'供应商',minWidth:180},{prop:'total_batches',label:'总批次数',width:100,align:'center'},{prop:'pass_batches',label:'合格批次',width:100,align:'center'},{label:'合格率',width:180,slotName:'pass_rate'},{prop:'repeat_issues',label:'重复问题',width:90,align:'center'},{prop:'last_inspection',label:'最近检验',width:110}]
const p=reactive({currentPage:1,pageSize:10,total:0});const fd=computed(()=>data.value.filter(r=>!s.supplier||r.supplier.includes(s.supplier)));const pd=computed(()=>fd.value.slice((p.currentPage-1)*p.pageSize,p.currentPage*p.pageSize));watch(fd,(v)=>{p.total=v.length},{immediate:true})
function hs(){p.currentPage=1};function hr(){s.supplier='';s.date_range=[];p.currentPage=1};function refresh(){hr()};function handleExport(){ElMessage.success('导出成功')}
</script>

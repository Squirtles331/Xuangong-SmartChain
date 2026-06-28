<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #deviation="{ row }"><el-tag :type="row.deviation<=10?'success':row.deviation<=20?'warning':'danger'" size="small">{{ row.deviation }}%</el-tag></template>
      <template #actions="{ row }"><el-button type="primary" link size="small" @click="adopt(row)">采纳</el-button></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive,computed,watch } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface TD { id:string;operation:string;material:string;std_hours:number;actual_avg:number;deviation:number;samples:number;suggestion:string }
const data=ref<TD[]>([{id:'1',operation:'下料',material:'离心泵 XJP-100',std_hours:5,actual_avg:4.2,deviation:16,samples:120,suggestion:'建议调整为4.5min'},{id:'2',operation:'精车',material:'离心泵 XJP-100',std_hours:18,actual_avg:20.5,deviation:14,samples:85,suggestion:'建议调整为20min'},{id:'3',operation:'钻孔',material:'离心泵 XJP-100',std_hours:8,actual_avg:7.8,deviation:2.5,samples:110,suggestion:'偏差在合理范围'},{id:'4',operation:'磨削',material:'齿轮箱 GBX-200',std_hours:15,actual_avg:18.2,deviation:21,samples:60,suggestion:'建议调整为18min'}])
const s=reactive({keyword:'',deviation:''});const sc:FormColumnItem[]=[{type:'input',label:'关键字',field:'keyword'} as any,{type:'select-v2',label:'偏差',field:'deviation',props:{options:[{label:'全部',value:''},{label:'≤10%',value:'low'},{label:'10-20%',value:'mid'},{label:'>20%',value:'high'}]}} as any]
const cols:TableColumnItem<TD>[]=[{prop:'operation',label:'工序',minWidth:100},{prop:'material',label:'产品',minWidth:160},{prop:'std_hours',label:'定额工时(min)',minWidth:120,align:'center'},{prop:'actual_avg',label:'实际平均(min)',minWidth:120,align:'center'},{label:'偏差',minWidth:80,slotName:'deviation',align:'center'},{prop:'samples',label:'样本数',minWidth:80,align:'center'},{prop:'suggestion',label:'建议',minWidth:180},{label:'操作',minWidth:80,fixed:'right',slotName:'actions',align:'center'}]
const p=reactive({currentPage:1,pageSize:10,total:0});const fd=computed(()=>data.value.filter(r=>!s.keyword||r.operation.includes(s.keyword)));const pd=computed(()=>fd.value.slice((p.currentPage-1)*p.pageSize,p.currentPage*p.pageSize));watch(fd,(v)=>{p.total=v.length},{immediate:true})
function hs(){p.currentPage=1};function hr(){s.keyword='';s.deviation='';p.currentPage=1}
function adopt(r:TD){r.std_hours=Math.round(r.actual_avg);r.deviation=0;ElMessage.success(`已采纳建议: ${r.operation} 定额调整为 ${r.std_hours}min`)}
</script>

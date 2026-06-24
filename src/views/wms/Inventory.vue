<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe style="height:100%">
      <template #qty="{row}"><span :style="{color:row.qty<row.safety?'#f56c6c':''}">{{row.qty}}</span></template>
      <template #actions="{row}"><el-button type="primary" link size="small" @click="trace(row)">追溯</el-button></template>
    </gi-table>
    <el-dialog v-model="tv" title="批次追溯" width="700px">
      <div v-if="td.length"><el-timeline><el-timeline-item v-for="(t,i) in td" :key="i" :timestamp="t.time" :type="t.type">{{t.desc}}</el-timeline-item></el-timeline></div>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref,reactive,computed } from 'vue';import type { FormColumnItem,TableColumnItem } from 'gi-component';
interface Inv { id:string;code:string;name:string;spec:string;warehouse:string;location:string;lot:string;qty:number;reserved:number;available:number;safety:number;unit:string }
const invs=ref<Inv[]>([{id:'1',code:'01.01.001-00001',name:'45#圆钢',spec:'φ50',warehouse:'原材料仓',location:'A-01-01',lot:'L20250101',qty:350,reserved:200,available:150,safety:100,unit:'kg'},{id:'2',code:'02.04.001-00001',name:'轴承 6308',spec:'SKF',warehouse:'原材料仓',location:'B-02-03',lot:'L20241215',qty:80,reserved:50,available:30,safety:50,unit:'个'},{id:'3',code:'04.01.001-00001',name:'离心泵 XJP-100',spec:'流量100m³/h',warehouse:'成品仓',location:'C-01-01',lot:'WO202501150001',qty:45,reserved:0,available:45,safety:10,unit:'台'}])
const s=reactive({keyword:'',warehouse:''});const sc:FormColumnItem[]=[{type:'input',label:'关键字',field:'keyword'} as any,{type:'select-v2',label:'仓库',field:'warehouse',props:{options:[{label:'全部',value:''},{label:'原材料仓',value:'原材料仓'},{label:'成品仓',value:'成品仓'},{label:'备件仓',value:'备件仓'}]}} as any]
const cols:TableColumnItem<Inv>[]=[{prop:'code',label:'物料编码',width:170},{prop:'name',label:'名称',minWidth:130},{prop:'spec',label:'规格',width:120},{prop:'warehouse',label:'仓库',width:100},{prop:'location',label:'库位',width:100},{prop:'lot',label:'批号',width:150},{label:'库存',width:80,slotName:'qty',align:'center'},{prop:'reserved',label:'已预留',width:80,align:'center'},{prop:'available',label:'可用',width:80,align:'center'},{label:'操作',width:80,fixed:'right',slotName:'actions',align:'center'}]
const p=reactive({currentPage:1,pageSize:10,total:0});const fd=computed(()=>invs.value.filter(i=>(!s.keyword||i.name.includes(s.keyword)||i.code.includes(s.keyword))&&(!s.warehouse||i.warehouse===s.warehouse)))
const pd=computed(()=>{p.total=fd.value.length;return fd.value.slice((p.currentPage-1)*p.pageSize,p.currentPage*p.pageSize)})
function hs(){p.currentPage=1};function hr(){s.keyword='';s.warehouse='';p.currentPage=1}
const tv=ref(false);const td=ref<any[]>([])
function trace(row:Inv){td.value=[{time:'2025-01-15 14:00',type:'primary',desc:`成品入库: ${row.name} 入库 ${row.qty}${row.unit}`},{time:'2025-01-14 10:00',type:'success',desc:`工序报工: 工单 WO202501150001 完工`},{time:'2025-01-05 08:00',type:'warning',desc:`来料入库: 批号 ${row.lot} 从 PO202501010005 收货`}];tv.value=true}
</script>

<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"><el-tag :type="row.status==='pending'?'warning':row.status==='picked'?'primary':'success'" size="small">{{ row.status==='pending'?'待拣货':row.status==='picked'?'已拣货':'已出库' }}</el-tag></template>
      <template #actions="{ row }">
        <el-button v-if="row.status==='pending'" type="primary" link size="small" @click="startPick(row)">开始拣货</el-button>
        <el-button v-if="row.status==='picked'" type="success" link size="small" @click="confirmOut(row)">确认出库</el-button>
      </template>
    </gi-table>
    <el-dialog v-model="pickVis" title="拣货确认" width="700px">
      <el-descriptions :column="2" border><el-descriptions-item label="工单号">{{cp?.wo_code}}</el-descriptions-item><el-descriptions-item label="产品">{{cp?.material}}</el-descriptions-item></el-descriptions>
      <el-table :data="pickItems" border size="small" style="margin-top:12px">
        <el-table-column prop="material" label="物料" minWidth="160" />
        <el-table-column prop="need_qty" label="需求数" width="80" align="center" />
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column label="拣货数" width="120"><template #default="{row}"><el-input-number v-model="row.pick_qty" :min="0" :max="row.need_qty" size="small" /></template></el-table-column>
      </el-table>
      <template #footer><el-button @click="pickVis=false">取消</el-button><el-button type="primary" @click="confirmPick">确认拣货</el-button></template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref,reactive,computed,watch } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface Pick { id:string;wo_code:string;material:string;status:string;created_at:string }
const picks=ref<Pick[]>([{id:'1',wo_code:'WO202501150001',material:'离心泵 XJP-100',status:'pending',created_at:'2025-01-15'},{id:'2',wo_code:'WO202501150002',material:'齿轮箱 GBX-200',status:'pending',created_at:'2025-01-15'},{id:'3',wo_code:'WO202501140003',material:'离心泵 XJP-200',status:'completed',created_at:'2025-01-14'}])
const s=reactive({wo_code:'',status:''})
const sc:FormColumnItem[]=[{type:'input',label:'工单号',field:'wo_code'} as any,{type:'select-v2',label:'状态',field:'status',props:{options:[{label:'全部',value:''},{label:'待拣货',value:'pending'},{label:'已拣货',value:'picked'},{label:'已出库',value:'completed'}]}} as any]
const cols:TableColumnItem<Pick>[]=[{prop:'wo_code',label:'工单号',width:170},{prop:'material',label:'产品',minWidth:160},{label:'状态',width:80,slotName:'status',align:'center'},{prop:'created_at',label:'创建时间',width:110},{label:'操作',width:180,slotName:'actions',align:'center'}]
const p=reactive({currentPage:1,pageSize:10,total:0});const fd=computed(()=>picks.value.filter(r=>(!s.wo_code||r.wo_code.includes(s.wo_code))&&(!s.status||r.status===s.status)));const pd=computed(()=>fd.value.slice((p.currentPage-1)*p.pageSize,p.currentPage*p.pageSize));watch(fd,(v)=>{p.total=v.length},{immediate:true})
function hs(){p.currentPage=1};function hr(){s.wo_code='';s.status='';p.currentPage=1}
const pickVis=ref(false);const cp=ref<Pick|null>(null)
const pickItems=ref([{material:'泵体铸件',need_qty:100,location:'A-01-01',pick_qty:100},{material:'耐磨环',need_qty:200,location:'B-02-03',pick_qty:200},{material:'螺栓 M16×60',need_qty:800,location:'B-03-01',pick_qty:800},{material:'叶轮铸件',need_qty:100,location:'A-02-01',pick_qty:100},{material:'轴承 6308',need_qty:200,location:'B-04-02',pick_qty:200}])
function startPick(r:Pick){cp.value=r;pickVis.value=true}
function confirmPick(){if(cp.value)cp.value.status='picked';pickVis.value=false;ElMessage.success('拣货完成')}
function confirmOut(r:Pick){r.status='completed';ElMessage.success('出库成功，库存已扣减')}
</script>

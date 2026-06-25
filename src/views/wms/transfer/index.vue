<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="transfers" border stripe>
      <template #status="{ row }"><el-tag :type="row.status==='pending'?'warning':row.status==='transit'?'primary':'success'" size="small">{{ row.status==='pending'?'待调出':row.status==='transit'?'在途':'已完成' }}</el-tag></template>
      <template #actions="{ row }">
        <el-button v-if="row.status==='pending'" type="primary" link size="small" @click="confirmOut(row)">调出确认</el-button>
        <el-button v-if="row.status==='transit'" type="success" link size="small" @click="confirmIn(row)">调入确认</el-button>
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" title="新建调拨单" width="550px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface Tr { id:string;code:string;material:string;qty:number;from_wh:string;to_wh:string;status:string }
const transfers=ref<Tr[]>([{id:'1',code:'DB20250115001',material:'螺栓 M16×60',qty:500,from_wh:'原材料仓',to_wh:'车间线边仓',status:'pending'}])
const cols:TableColumnItem<Tr>[]=[{prop:'code',label:'调拨单号',width:160},{prop:'material',label:'物料',minWidth:160},{prop:'qty',label:'数量',width:80,align:'center'},{prop:'from_wh',label:'调出仓库',width:120},{prop:'to_wh',label:'调入仓库',width:120},{label:'状态',width:80,slotName:'status',align:'center'},{label:'操作',width:180,slotName:'actions',align:'center'}]
const vis=ref(false);const form=reactive({material:'',qty:1,from_wh:'原材料仓',to_wh:'车间线边仓'})
const formCols:FormColumnItem[]=[{type:'input',label:'物料',field:'material',required:true},{type:'input-number',label:'数量',field:'qty',required:true,props:{min:1} as any},{type:'select-v2',label:'调出仓库',field:'from_wh',required:true,props:{options:[{label:'原材料仓',value:'原材料仓'},{label:'成品仓',value:'成品仓'},{label:'备件仓',value:'备件仓'}]} as any},{type:'select-v2',label:'调入仓库',field:'to_wh',required:true,props:{options:[{label:'原材料仓',value:'原材料仓'},{label:'成品仓',value:'成品仓'},{label:'车间线边仓',value:'车间线边仓'}]} as any}]
function openAdd(){vis.value=true}
async function submit(){if(!form.material){ElMessage.warning('请填写必填项');return false};transfers.value.unshift({id:Date.now().toString(),code:'DB'+new Date().toISOString().slice(0,10).replace(/-/g,'')+String(transfers.value.length+1).padStart(4,'0'),...form,status:'pending'} as Tr);return true}
function confirmOut(r:Tr){r.status='transit';ElMessage.success('调出确认成功')}
function confirmIn(r:Tr){r.status='completed';ElMessage.success('调入确认成功，库存已更新')}
</script>

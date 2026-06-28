<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left:8px" type="reset" @click="refresh" /><el-button style="margin-left:8px" @click="handleExport">导出</el-button></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode==='add'?'新增计件单价':'编辑计件单价'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive,computed,watch } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface PW { id:string;operation:string;unit_price:number;unit:string;qualified_bonus:number;defective_penalty:number }
const data=ref<PW[]>([{id:'1',operation:'下料',unit_price:2.5,unit:'件',qualified_bonus:0.5,defective_penalty:5},{id:'2',operation:'粗车',unit_price:8.0,unit:'件',qualified_bonus:1.0,defective_penalty:15},{id:'3',operation:'精车',unit_price:12.0,unit:'件',qualified_bonus:1.5,defective_penalty:20},{id:'4',operation:'钻孔',unit_price:3.0,unit:'件',qualified_bonus:0.3,defective_penalty:8},{id:'5',operation:'磨削',unit_price:10.0,unit:'件',qualified_bonus:1.0,defective_penalty:18},{id:'6',operation:'装配',unit_price:15.0,unit:'台',qualified_bonus:2.0,defective_penalty:30}])
const s=reactive({keyword:''});const sc:FormColumnItem[]=[{type:'input',label:'工序名称',field:'keyword'} as any]
const cols:TableColumnItem<PW>[]=[{prop:'operation',label:'工序名称',minWidth:120},{prop:'unit_price',label:'计件单价(元)',minWidth:120,align:'right'},{prop:'unit',label:'单位',minWidth:60,align:'center'},{prop:'qualified_bonus',label:'合格奖励(元)',minWidth:120,align:'right'},{prop:'defective_penalty',label:'不良扣款(元)',minWidth:120,align:'right'},{label:'操作',minWidth:120,fixed:'right',slotName:'actions',align:'center'}]
const p=reactive({currentPage:1,pageSize:10,total:0});const fd=computed(()=>data.value.filter(r=>!s.keyword||r.operation.includes(s.keyword)));const pd=computed(()=>fd.value.slice((p.currentPage-1)*p.pageSize,p.currentPage*p.pageSize));watch(fd,(v)=>{p.total=v.length},{immediate:true})
function hs(){p.currentPage=1};function hr(){s.keyword='';p.currentPage=1};function refresh(){hr()};function handleExport(){ElMessage.success('导出成功')}
const vis=ref(false);const mode=ref<'add'|'edit'>('add');const eid=ref('')
const form=reactive({operation:'',unit_price:0,unit:'件',qualified_bonus:0,defective_penalty:0})
const formCols:FormColumnItem[]=[{type:'input',label:'工序名称',field:'operation',required:true},{type:'input-number',label:'计件单价(元)',field:'unit_price',required:true,props:{min:0,precision:2} as any},{type:'input',label:'单位',field:'unit'},{type:'input-number',label:'合格奖励(元)',field:'qualified_bonus',props:{min:0,precision:2} as any},{type:'input-number',label:'不良扣款(元)',field:'defective_penalty',props:{min:0,precision:2} as any}]
function openAdd(){mode.value='add';Object.assign(form,{operation:'',unit_price:0,unit:'件',qualified_bonus:0,defective_penalty:0});vis.value=true}
function openEdit(r:PW){mode.value='edit';eid.value=r.id;Object.assign(form,r);vis.value=true}
async function submit(){if(!form.operation){ElMessage.warning('请填写必填项');return false};if(mode.value==='add'){data.value.unshift({id:Date.now().toString(),...form} as PW)}else{const i=data.value.findIndex(e=>e.id===eid.value);if(i>-1)Object.assign(data.value[i],form)};return true}
</script>

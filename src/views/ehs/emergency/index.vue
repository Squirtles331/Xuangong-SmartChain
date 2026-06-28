<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left:8px" type="reset" @click="refresh" /><el-button style="margin-left:8px" @click="handleExport">导出</el-button></template>
    <gi-table :columns="cols" :data="plans" border stripe>
      <template #level="{ row }"><el-tag :type="row.level==='I'?'danger':row.level==='II'?'warning':'info'" size="small">{{ row.level }}级响应</el-tag></template>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><el-button type="primary" link size="small" @click="drill(row)">演练</el-button></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode==='add'?'新增预案':'编辑预案'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
interface EP { id:string;name:string;type:string;level:string;responsible:string;last_drill:string }
const plans=ref<EP[]>([{id:'1',name:'火灾爆炸应急预案',type:'火灾',level:'I',responsible:'安全主管-陈工',last_drill:'2024-12-15'},{id:'2',name:'化学品泄漏应急预案',type:'危化品',level:'II',responsible:'车间主任-李四',last_drill:'2024-11-20'},{id:'3',name:'机械伤害应急预案',type:'机械',level:'II',responsible:'设备主管-王工',last_drill:'2024-10-10'},{id:'4',name:'停电应急处置方案',type:'电力',level:'III',responsible:'电工-张工',last_drill:'2024-09-05'}])
const cols:TableColumnItem<EP>[]=[{prop:'name',label:'预案名称',minWidth:200},{prop:'type',label:'事故类型',minWidth:100},{label:'响应等级',minWidth:90,slotName:'level',align:'center'},{prop:'responsible',label:'负责人',minWidth:140},{prop:'last_drill',label:'最近演练',minWidth:120},{label:'操作',minWidth:160,fixed:'right',slotName:'actions',align:'center'}]
const vis=ref(false);const mode=ref<'add'|'edit'>('add');const eid=ref('')
const form=reactive({name:'',type:'火灾',level:'II',responsible:'',last_drill:''})
const formCols:FormColumnItem[]=[{type:'input',label:'预案名称',field:'name',required:true},{type:'select-v2',label:'事故类型',field:'type',required:true,props:{options:[{label:'火灾',value:'火灾'},{label:'危化品',value:'危化品'},{label:'机械',value:'机械'},{label:'电力',value:'电力'},{label:'其他',value:'其他'}]} as any},{type:'select-v2',label:'响应等级',field:'level',required:true,props:{options:[{label:'I级',value:'I'},{label:'II级',value:'II'},{label:'III级',value:'III'}]} as any},{type:'input',label:'负责人',field:'responsible'},{type:'date-picker',label:'最近演练',field:'last_drill'}]
function openAdd(){mode.value='add';Object.assign(form,{name:'',type:'火灾',level:'II',responsible:'',last_drill:''});vis.value=true}
function openEdit(r:EP){mode.value='edit';eid.value=r.id;Object.assign(form,r);vis.value=true}
async function submit(){if(!form.name){ElMessage.warning('请填写必填项');return false};if(mode.value==='add'){plans.value.unshift({id:Date.now().toString(),...form} as EP)}else{const i=plans.value.findIndex(e=>e.id===eid.value);if(i>-1)Object.assign(plans.value[i],form)};return true}
function drill(r:EP){r.last_drill=new Date().toISOString().slice(0,10);ElMessage.success(`演练完成: ${r.name}`)}
function refresh(){};function handleExport(){ElMessage.success('导出成功')}
</script>

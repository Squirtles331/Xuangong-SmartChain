<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>约束理论排程配置</h3></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="模具约束" name="mold">
        <template #tool><gi-button type="add" @click="openAdd('mold')" /></template>
        <gi-table :columns="moldCols" :data="molds" border stripe size="small">
          <template #actions="{ row }"
            ><gi-button type="edit" @click="openEdit('mold', row)" /><gi-button type="delete" @click="del('mold', row.id)"
          /></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="刀具约束" name="tool">
        <template #tool><gi-button type="add" @click="openAdd('tool')" /></template>
        <gi-table :columns="toolCols" :data="tools" border stripe size="small">
          <template #actions="{ row }"
            ><gi-button type="edit" @click="openEdit('tool', row)" /><gi-button type="delete" @click="del('tool', row.id)"
          /></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="人员技能约束" name="skill">
        <template #tool><gi-button type="add" @click="openAdd('skill')" /></template>
        <gi-table :columns="skillCols" :data="skills" border stripe size="small">
          <template #actions="{ row }"
            ><gi-button type="edit" @click="openEdit('skill', row)" /><gi-button type="delete" @click="del('skill', row.id)"
          /></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增约束' : '编辑约束'" width="550px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem,TableColumnItem } from 'gi-component'
import { useConstraintStore } from '@/stores/constraint'
const store=useConstraintStore()
const tab=ref('mold')
const molds=store.molds
const moldCols:TableColumnItem<any>[]=[{prop:'code',label:'模具编码',minWidth:150},{prop:'name',label:'名称',minWidth:140},{prop:'applicable',label:'适用物料',minWidth:120},{prop:'life',label:'设计寿命',minWidth:100},{label:'可用',minWidth:70,slotName:'available',align:'center'},{label:'操作',minWidth:180,fixed:'right',slotName:'actions',align:'center'}]
const tools=store.tools
const toolCols:TableColumnItem<any>[]=[{prop:'code',label:'刀具编码',minWidth:130},{prop:'name',label:'名称',minWidth:160},{prop:'applicable',label:'适用设备',minWidth:140},{prop:'life',label:'寿命',minWidth:80},{label:'可用',minWidth:70,slotName:'available',align:'center'},{label:'操作',minWidth:180,fixed:'right',slotName:'actions',align:'center'}]
const skills=store.skills
const skillCols:TableColumnItem<any>[]=[{prop:'operation',label:'工序',minWidth:100},{prop:'skill',label:'技能要求',minWidth:160},{prop:'min_level',label:'最低等级',minWidth:80,align:'center'},{prop:'workers_count',label:'具备人数',minWidth:80,align:'center'},{label:'操作',minWidth:180,fixed:'right',slotName:'actions',align:'center'}]
const vis=ref(false);const mode=ref<'add'|'edit'>('add');const eid=ref('');const curType=ref('')
const form=reactive({code:'',name:'',applicable:'',life:''})
const formCols:FormColumnItem[]=[{type:'input',label:'编码',field:'code',required:true},{type:'input',label:'名称',field:'name',required:true},{type:'input',label:'适用对象',field:'applicable'},{type:'input',label:'寿命/数量',field:'life'}]
function openAdd(t:string){curType.value=t;mode.value='add';Object.assign(form,{code:'',name:'',applicable:'',life:''});vis.value=true}
function openEdit(t:string,r:any){curType.value=t;mode.value='edit';eid.value=r.id;Object.assign(form,r);vis.value=true}
async function submit(){if(!form.name){ElMessage.warning('请填写必填项');return false};const list:any={mold:molds,tool:tools,skill:skills}[curType.value];if(mode.value==='add'){list.value.unshift({id:Date.now().toString(),...form})}else{const i=list.value.findIndex((e:any)=>e.id===eid.value);if(i>-1)Object.assign(list.value[i],form)};return true}
function del(t:string,id:string){const list:any={mold:molds,tool:tools,skill:skills}[t];list.value=list.value.filter((e:any)=>e.id!==id)}
</script>

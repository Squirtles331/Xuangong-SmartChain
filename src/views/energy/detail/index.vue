<template>
  <gi-page-layout :bordered="true">
    <template #header><SearchSetting :columns="allSearchColumns" storage-key="detail-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #type="{ row }"
        ><el-tag :type="row.type === '电' ? 'warning' : row.type === '水' ? 'primary' : 'info'" size="small">{{ row.type }}</el-tag></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <SearchSetting :columns="allSearchColumns" storage-key="detail-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem,TableColumnItem } from 'gi-component'
const s=reactive({keyword:''});const sc:FormColumnItem[]=[{type:'input',label:'关键字',field:'keyword'} as any]
const data = ref([
  { id: '1', date: '2025-01-15', type: '电', workshop: '机加工一车间', qty: 5800, unit: 'kWh' },
  { id: '2', date: '2025-01-15', type: '水', workshop: '全厂', qty: 120, unit: '吨' },
  { id: '3', date: '2025-01-15', type: '气', workshop: '热处理车间', qty: 350, unit: 'm³' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'date', label: '日期', minWidth: 110 },
  { label: '类型', minWidth: 60, slotName: 'type', align: 'center' },
  { prop: 'workshop', label: '车间', minWidth: 140 },
  { prop: 'qty', label: '用量', minWidth: 100, align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
function hs(){};function hr(){s.keyword=''}
const vis=ref(false);const mode=ref<'add'|'edit'>('add');const eid=ref('')
const form=reactive({date:'',type:'电',workshop:'',qty:0,unit:'kWh'})
const formCols:FormColumnItem[]=[{type:'date-picker',label:'日期',field:'date',required:true},{type:'select-v2',label:'类型',field:'type',required:true,props:{options:[{label:'电',value:'电'},{label:'水',value:'水'},{label:'气',value:'气'}]} as any},{type:'input',label:'车间',field:'workshop'},{type:'input-number',label:'用量',field:'qty',required:true,props:{min:0} as any},{type:'input',label:'单位',field:'unit'}]
function openAdd(){mode.value='add';eid.value='';Object.assign(form,{date:'',type:'电',workshop:'',qty:0,unit:'kWh'});vis.value=true}
function openEdit(r:any){mode.value='edit';eid.value=r.id;Object.assign(form,r);vis.value=true}
async function submit(){if(!form.date){ElMessage.warning('请填写必填项');return false};if(mode.value==='add'){data.value.unshift({id:Date.now().toString(),...form})}else{const i=data.value.findIndex((e:any)=>e.id===eid.value);if(i>-1)Object.assign(data.value[i],form)};return true}
function del(id:string){data.value=data.value.filter((e:any)=>e.id!==id)}
</script>

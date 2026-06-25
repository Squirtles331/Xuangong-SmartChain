<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #status="{ row }"><el-tag :type="row.status==='active'?'success':'info'" size="small">{{ row.status==='active'?'在职':'离职' }}</el-tag></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const data=ref([{id:'1',code:'E00000001',name:'李四',department:'机加工一车间',position:'数控操作工',phone:'13800000001',hire_date:'2022-03-01',status:'active'},{id:'2',code:'E00000002',name:'王五',department:'机加工一车间',position:'钻床操作工',phone:'13800000002',hire_date:'2023-06-15',status:'active'},{id:'3',code:'E00000003',name:'赵六',department:'装配车间',position:'装配钳工',phone:'13800000003',hire_date:'2021-09-01',status:'active'}])
const cols:TableColumnItem<any>[]=[{prop:'code',label:'工号',width:120},{prop:'name',label:'姓名',width:80},{prop:'department',label:'部门',width:140},{prop:'position',label:'岗位',width:140},{prop:'phone',label:'电话',width:130},{prop:'hire_date',label:'入职日期',width:110},{label:'状态',width:60,slotName:'status',align:'center'}]
</script>

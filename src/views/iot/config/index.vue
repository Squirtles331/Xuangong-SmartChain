<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #protocol="{ row }"><el-tag size="small">{{ row.protocol }}</el-tag></template>
      <template #actions="{ row }"><gi-button type="edit" size="small" @click="editCfg(row)" /></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const data=ref([{id:'1',name:'数控车床 CK6150',protocol:'OPC UA',address:'opc.tcp://192.168.1.10:4840',interval:'1s'},{id:'2',name:'钻床 Z3050',protocol:'MQTT',address:'mqtt://192.168.1.11:1883/topics/z3050',interval:'5s'},{id:'3',name:'加工中心 VMC850',protocol:'OPC UA',address:'opc.tcp://192.168.1.12:4840',interval:'1s'}])
const cols:TableColumnItem<any>[]=[{prop:'name',label:'设备名称',width:180},{label:'协议',width:80,slotName:'protocol',align:'center'},{prop:'address',label:'采集地址',minWidth:280},{prop:'interval',label:'采集间隔',width:80,align:'center'},{label:'操作',width:100,slotName:'actions',align:'center'}]
function openAdd(){}
function editCfg(_r:any){}
</script>

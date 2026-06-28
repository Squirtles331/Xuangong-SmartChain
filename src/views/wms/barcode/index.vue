<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>条码/RFID 仓储管理</h3></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="条码打印" name="print">
        <template #tool><el-button type="primary" @click="printBarcode">批量打印</el-button></template>
        <gi-table :columns="printCols" :data="materials" border stripe size="small" @selection-change="onSelect" />
      </el-tab-pane>
      <el-tab-pane label="扫码入库" name="scanIn">
        <el-card shadow="never"><el-form :inline="true"><el-form-item label="扫描条码"><el-input v-model="scanCode" placeholder="扫描或输入条码" style="width:300px" @keyup.enter="handleScanIn" /><el-button type="primary" style="margin-left:8px" @click="handleScanIn">确认入库</el-button></el-form-item></el-form></el-card>
        <gi-table :columns="scanInCols" :data="scanRecords" border stripe size="small" style="margin-top:16px" />
      </el-tab-pane>
      <el-tab-pane label="扫码出库" name="scanOut">
        <el-card shadow="never"><el-form :inline="true"><el-form-item label="扫描条码"><el-input v-model="scanOutCode" placeholder="扫描或输入条码" style="width:300px" @keyup.enter="handleScanOut" /><el-button type="primary" style="margin-left:8px" @click="handleScanOut">确认出库</el-button></el-form-item></el-form></el-card>
        <gi-table :columns="scanOutCols" :data="scanOutRecords" border stripe size="small" style="margin-top:16px" />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import { ElMessage } from 'element-plus';import type { TableColumnItem } from 'gi-component'
const tab=ref('print')
const materials=ref([{id:'1',code:'01.01.001-00001',name:'45#圆钢 φ50',barcode:'BC20250115001',lot:'L20250101',qty:350},{id:'2',code:'02.04.001-00001',name:'轴承 6308',barcode:'BC20250115002',lot:'L20241215',qty:80},{id:'3',code:'04.01.001-00001',name:'离心泵 XJP-100',barcode:'BC20250115003',lot:'WO202501150001',qty:45}])
const printCols:TableColumnItem<any>[]=[{type:'selection',minWidth:50},{prop:'barcode',label:'条码',minWidth:180},{prop:'code',label:'物料编码',minWidth:170},{prop:'name',label:'物料名称',minWidth:160},{prop:'lot',label:'批号',minWidth:160},{prop:'qty',label:'库存',minWidth:80,align:'center'}]
function onSelect(_rows:any){}
function printBarcode(){ElMessage.success('条码打印任务已发送')}
const scanCode=ref('');const scanRecords=ref<any[]>([]);const scanInCols:TableColumnItem<any>[]=[{prop:'barcode',label:'条码',minWidth:180},{prop:'material',label:'物料',minWidth:180},{prop:'time',label:'入库时间',minWidth:170}]
function handleScanIn(){if(scanCode.value){scanRecords.value.unshift({barcode:scanCode.value,material:'45#圆钢 φ50',time:new Date().toLocaleString()});scanCode.value='';ElMessage.success('入库成功')}}
const scanOutCode=ref('');const scanOutRecords=ref<any[]>([]);const scanOutCols:TableColumnItem<any>[]=[{prop:'barcode',label:'条码',minWidth:180},{prop:'material',label:'物料',minWidth:180},{prop:'time',label:'出库时间',minWidth:170}]
function handleScanOut(){if(scanOutCode.value){scanOutRecords.value.unshift({barcode:scanOutCode.value,material:'轴承 6308',time:new Date().toLocaleString()});scanOutCode.value='';ElMessage.success('出库成功')}}
</script>

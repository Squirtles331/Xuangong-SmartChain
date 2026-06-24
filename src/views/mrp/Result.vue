<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <div class="mrp-header">
        <h2>MRP 运算结果</h2>
        <div>
          <el-tag type="success" style="margin-right:8px">最近运行: 2025-01-15 08:00</el-tag>
          <el-button type="primary" @click="runMRP">运行 MRP</el-button>
          <el-button @click="$router.push('/mrp/history')">运行历史</el-button>
        </div>
      </div>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="建议采购" name="purchase">
        <div style="margin-bottom:12px"><el-button type="primary" size="small" @click="confirmAll('purchase')">批量生成采购申请</el-button></div>
        <gi-table :columns="purCols" :data="purchaseList" border stripe size="small" @selection-change="onPurSelect">
          <template #actions="{row}"><el-button type="primary" link size="small" @click="confirmOne('purchase',row)">生成申请</el-button></template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="建议生产" name="production">
        <div style="margin-bottom:12px"><el-button type="primary" size="small" @click="confirmAll('production')">批量生成工单</el-button></div>
        <gi-table :columns="prodCols" :data="productionList" border stripe size="small">
          <template #actions="{row}"><el-button type="primary" link size="small" @click="confirmOne('production',row)">生成工单</el-button></template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="例外报告" name="exception">
        <el-tag v-if="exceptions.length===0" type="success" size="large">无例外</el-tag>
        <gi-table v-else :columns="excCols" :data="exceptions" border stripe size="small" />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';import { ElMessage } from 'element-plus';import type { TableColumnItem } from 'gi-component';

const tab=ref('purchase')
const purchaseList=ref([{id:'1',code:'01.01.001-00001',name:'45#圆钢 φ50',qty:300,order_date:'2025-01-02',need_date:'2025-01-18',supplier:'XX钢材有限公司',source:'SO202501150001'},{id:'2',code:'02.04.001-00001',name:'轴承 6308',qty:150,order_date:'2025-01-05',need_date:'2025-01-20',supplier:'YY轴承制造厂',source:'SO202501150001'},{id:'3',code:'02.02.001-00001',name:'螺栓 M16×60',qty:800,order_date:'2025-01-08',need_date:'2025-01-22',supplier:'ZZ标准件有限公司',source:'SO202501100002'}])
const purCols:TableColumnItem<any>[]=[{type:'selection',width:50},{prop:'code',label:'物料编码',width:180},{prop:'name',label:'物料名称',minWidth:140},{prop:'qty',label:'建议采购量',width:110,align:'center'},{prop:'order_date',label:'建议下单',width:110},{prop:'need_date',label:'需求日期',width:110},{prop:'supplier',label:'建议供应商',width:150},{prop:'source',label:'来源需求',width:150},{label:'操作',width:100,slotName:'actions',align:'center'}]

const productionList=ref([{id:'1',code:'04.01.001-00001',name:'离心泵 XJP-100',qty:70,start_date:'2025-01-10',end_date:'2025-01-25',bom:'MBOM V1.2',routing:'标准工艺 V1.1',source:'SO202501150001'},{id:'2',code:'03.01.001-00001',name:'传动轴 DS-50',qty:50,start_date:'2025-01-12',end_date:'2025-01-22',bom:'MBOM V1.1',routing:'标准工艺 V1.0',source:'SO202501150001'}])
const prodCols:TableColumnItem<any>[]=[{type:'selection',width:50},{prop:'code',label:'产品编码',width:180},{prop:'name',label:'产品名称',minWidth:140},{prop:'qty',label:'建议生产量',width:110,align:'center'},{prop:'start_date',label:'建议开工',width:110},{prop:'end_date',label:'建议完工',width:110},{prop:'bom',label:'BOM版本',width:110},{prop:'routing',label:'工艺版本',width:130},{prop:'source',label:'来源需求',width:150},{label:'操作',width:100,slotName:'actions',align:'center'}]

const exceptions=ref([{id:'1',type:'延期风险',material:'轴承 6308',detail:'建议下单日期(1月5日)已过，需要加急采购',action:'建议联系供应商紧急供货'}])
const excCols:TableColumnItem<any>[]=[{prop:'type',label:'类型',width:100},{prop:'material',label:'物料',width:150},{prop:'detail',label:'详情',minWidth:250},{prop:'action',label:'建议动作',minWidth:200}]

const selectedPur=ref<any[]>([])
function onPurSelect(rows:any[]){selectedPur.value=rows}
function confirmOne(type:string,_row:any){ElMessage.success(type==='purchase'?'已生成采购申请':'已生成工单')}
function confirmAll(type:string){ElMessage.success(type==='purchase'?`已批量生成 ${selectedPur.value.length} 个采购申请`:`已批量生成工单`)}
function runMRP(){ElMessage.success('MRP 运算已启动，请稍候查看结果')}
</script>
<style scoped>.mrp-header{display:flex;justify-content:space-between;align-items:center}.mrp-header h2{margin:0;font-size:18px}</style>

<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="能耗概览" name="overview">
        <el-row :gutter="16">
          <el-col :span="6" v-for="c in cards" :key="c.title"><el-card shadow="hover"><div class="card-title">{{ c.title }}</div><div class="card-value">{{ c.value }}<span class="card-unit">{{ c.unit }}</span></div><div class="card-trend" :style="{color:c.trend>0?'#f56c6c':'#67c23a'}">{{ c.trend>0?'↑':'↓' }}{{ Math.abs(c.trend) }}% 较上月</div></el-card></el-col>
        </el-row>
        <el-row :gutter="16" style="margin-top:16px">
          <el-col :span="16"><el-card header="能耗趋势"><div ref="chartRef" style="height:300px"></div></el-card></el-col>
          <el-col :span="8"><el-card header="能耗占比"><div ref="pieRef" style="height:300px"></div></el-card></el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="能耗明细" name="detail">
        <gi-table :columns="detailCols" :data="details" border stripe size="small">
          <template #type="{ row }"><el-tag :type="row.type==='电'?'warning':row.type==='水'?'primary':'info'" size="small">{{ row.type }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue';import * as echarts from 'echarts';import type { TableColumnItem } from 'gi-component'

const tab=ref('overview')
const cards=[{title:'本月用电',value:125800,unit:'kWh',trend:5.2},{title:'本月用水',value:3200,unit:'吨',trend:-3.1},{title:'本月用气',value:8500,unit:'m³',trend:8.7},{title:'碳排放',value:98.5,unit:'吨CO₂',trend:5.2}]
const details=ref([{id:'1',date:'2025-01-15',type:'电',workshop:'机加工一车间',qty:5800,unit:'kWh'},{id:'2',date:'2025-01-15',type:'水',workshop:'全厂',qty:120,unit:'吨'},{id:'3',date:'2025-01-15',type:'气',workshop:'热处理车间',qty:350,unit:'m³'},{id:'4',date:'2025-01-14',type:'电',workshop:'机加工二车间',qty:4200,unit:'kWh'}])
const detailCols:TableColumnItem<any>[]=[{prop:'date',label:'日期',width:110},{label:'类型',width:60,slotName:'type',align:'center'},{prop:'workshop',label:'车间',width:140},{prop:'qty',label:'用量',width:100,align:'center'},{prop:'unit',label:'单位',width:60,align:'center'}]
const chartRef=ref<HTMLDivElement>();const pieRef=ref<HTMLDivElement>()
onMounted(()=>{
  if(chartRef.value){const c=echarts.init(chartRef.value);c.setOption({tooltip:{trigger:'axis'},legend:{data:['电','水','气']},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']},yAxis:{type:'value'},series:[{name:'电',type:'bar',data:[120,132,101,134,90,145,156,130,125,140,135,125],itemStyle:{color:'#e6a23c'}},{name:'水',type:'line',data:[3.2,3.5,2.8,3.0,3.1,3.3,3.0,3.2,2.9,3.1,3.0,3.2],itemStyle:{color:'#409eff'}},{name:'气',type:'line',data:[8.5,9.0,7.8,8.2,8.8,9.2,8.5,8.0,8.5,9.0,8.5,8.5],itemStyle:{color:'#67c23a'}}]})}
  if(pieRef.value){const c=echarts.init(pieRef.value);c.setOption({series:[{type:'pie',radius:'70%',data:[{value:5800,name:'电',itemStyle:{color:'#e6a23c'}},{value:120,name:'水',itemStyle:{color:'#409eff'}},{value:350,name:'气',itemStyle:{color:'#67c23a'}}]}]})}
})
</script>
<style scoped>
.card-title{font-size:13px;color:#909399}.card-value{font-size:28px;font-weight:700;margin:8px 0}.card-unit{font-size:14px;color:#909399;margin-left:4px}.card-trend{font-size:12px}
</style>

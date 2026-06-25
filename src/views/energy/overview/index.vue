<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="16">
      <el-col :span="6" v-for="c in cards" :key="c.title"><el-card shadow="hover"><div class="card-title">{{ c.title }}</div><div class="card-value">{{ c.value }}<span class="card-unit">{{ c.unit }}</span></div><div class="card-trend" :style="{color:c.trend>0?'#f56c6c':'#67c23a'}">{{ c.trend>0?'↑':'↓' }}{{ Math.abs(c.trend) }}% 较上月</div></el-card></el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="16"><el-card header="能耗趋势"><div ref="chartRef" style="height:300px"></div></el-card></el-col>
      <el-col :span="8"><el-card header="能耗占比"><div ref="pieRef" style="height:300px"></div></el-card></el-col>
    </el-row>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue';import * as echarts from 'echarts'
const cards=[{title:'本月用电',value:125800,unit:'kWh',trend:5.2},{title:'本月用水',value:3200,unit:'吨',trend:-3.1},{title:'本月用气',value:8500,unit:'m³',trend:8.7},{title:'碳排放',value:98.5,unit:'吨CO₂',trend:5.2}]
const chartRef=ref<HTMLDivElement>();const pieRef=ref<HTMLDivElement>()
onMounted(()=>{
  if(chartRef.value){const c=echarts.init(chartRef.value);c.setOption({tooltip:{trigger:'axis'},legend:{data:['电','水','气']},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']},yAxis:{type:'value'},series:[{name:'电',type:'bar',data:[120,132,101,134,90,145,156,130,125,140,135,125],itemStyle:{color:'#e6a23c'}},{name:'水',type:'line',data:[3.2,3.5,2.8,3.0,3.1,3.3,3.0,3.2,2.9,3.1,3.0,3.2],itemStyle:{color:'#409eff'}},{name:'气',type:'line',data:[8.5,9.0,7.8,8.2,8.8,9.2,8.5,8.0,8.5,9.0,8.5,8.5],itemStyle:{color:'#67c23a'}}]})}
  if(pieRef.value){const c=echarts.init(pieRef.value);c.setOption({series:[{type:'pie',radius:'70%',data:[{value:5800,name:'电',itemStyle:{color:'#e6a23c'}},{value:120,name:'水',itemStyle:{color:'#409eff'}},{value:350,name:'气',itemStyle:{color:'#67c23a'}}]}]})}
})
</script>
<style scoped>.card-title{font-size:13px;color:#909399}.card-value{font-size:28px;font-weight:700;margin:8px 0}.card-unit{font-size:14px;color:#909399;margin-left:4px}.card-trend{font-size:12px}</style>

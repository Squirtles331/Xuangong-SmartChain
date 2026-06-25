<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="16">
      <el-col :span="6" v-for="c in cards" :key="c.title"><el-card shadow="hover"><div class="card-title">{{ c.title }}</div><div class="card-value">{{ c.value }}<span class="card-unit">%</span></div><el-progress :percentage="c.value" :stroke-width="12" :color="c.value>=85?'#67c23a':c.value>=70?'#e6a23c':'#f56c6c'" /></el-card></el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="12"><el-card header="OEE趋势"><div ref="chartRef" style="height:300px"></div></el-card></el-col>
      <el-col :span="12"><el-card header="设备OEE排行"><gi-table :columns="rankCols" :data="rankData" border stripe size="small" /></el-card></el-col>
    </el-row>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue';import * as echarts from 'echarts';import type { TableColumnItem } from 'gi-component'
const cards=[{title:'OEE综合',value:78.5},{title:'设备利用率',value:85.2},{title:'性能效率',value:92.1},{title:'合格品率',value:98.3}]
const rankData=ref([{equipment:'数控车床 CK6150',oee:'85.2%',utilization:'90.1%',performance:'95.0%',quality:'99.5%'},{equipment:'钻床 Z3050',oee:'78.6%',utilization:'82.3%',performance:'93.5%',quality:'98.2%'},{equipment:'磨床 M1432',oee:'72.1%',utilization:'75.0%',performance:'90.2%',quality:'97.8%'},{equipment:'加工中心 VMC850',oee:'80.5%',utilization:'88.0%',performance:'92.8%',quality:'98.8%'}])
const rankCols:TableColumnItem<any>[]=[{prop:'equipment',label:'设备',minWidth:160},{prop:'oee',label:'OEE',minWidth:80,align:'center'},{prop:'utilization',label:'利用率',minWidth:80,align:'center'},{prop:'performance',label:'性能',minWidth:80,align:'center'},{prop:'quality',label:'质量',minWidth:80,align:'center'}]
const chartRef=ref<HTMLDivElement>()
onMounted(()=>{if(chartRef.value){const c=echarts.init(chartRef.value);c.setOption({tooltip:{trigger:'axis'},legend:{data:['OEE','利用率','性能','质量']},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月']},yAxis:{type:'value',max:100},series:[{name:'OEE',type:'line',data:[75,76,78,77,79,78.5],itemStyle:{color:'#409eff'}},{name:'利用率',type:'line',data:[82,84,85,83,86,85.2],itemStyle:{color:'#67c23a'}},{name:'性能',type:'line',data:[90,91,92,91,93,92.1],itemStyle:{color:'#e6a23c'}},{name:'质量',type:'line',data:[97,98,97.5,98.2,98.5,98.3],itemStyle:{color:'#f56c6c'}}]})}})
</script>
<style scoped>.card-title{font-size:13px;color:#909399}.card-value{font-size:28px;font-weight:700;margin:8px 0}.card-unit{font-size:14px;color:#909399;margin-left:4px}</style>

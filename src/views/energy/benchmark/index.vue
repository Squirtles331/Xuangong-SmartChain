<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="16"
      ><el-col :span="8" v-for="c in cards" :key="c.title"
        ><el-card shadow="hover"
          ><div class="card-title">{{ c.title }}</div>
          <div class="card-value">
            {{ c.value }}<span class="card-unit">{{ c.unit }}</span>
          </div>
          <div class="card-compare" :style="{ color: c.actual > c.benchmark ? '#f56c6c' : '#67c23a' }">
            实际 {{ c.actual }}{{ c.unit }} | 对标 {{ c.benchmark }}{{ c.unit }}
          </div></el-card
        ></el-col
      ></el-row
    >
    <el-card header="能耗对标分析" style="margin-top: 16px"><div ref="chartRef" style="height: 350px"></div></el-card>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const cards = [
  { title: '单位产值能耗', value: 0.15, unit: 'kWh/万元', actual: 0.15, benchmark: 0.12 },
  { title: '单位产品电耗', value: 12.5, unit: 'kWh/台', actual: 12.5, benchmark: 10.0 },
  { title: '水耗', value: 3.2, unit: '吨/台', actual: 3.2, benchmark: 2.8 }
]
const chartRef = ref<HTMLDivElement>()
onMounted(() => {
  if (chartRef.value) {
    const c = echarts.init(chartRef.value)
    c.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['实际值', '行业标杆', '先进值'] },
      xAxis: { type: 'category', data: ['电耗(kWh/台)', '水耗(吨/台)', '气耗(m³/台)', '综合能耗'] },
      yAxis: { type: 'value' },
      series: [
        { name: '实际值', type: 'bar', data: [12.5, 3.2, 8.5, 0.15], itemStyle: { color: '#409eff' } },
        { name: '行业标杆', type: 'bar', data: [10.0, 2.8, 7.0, 0.12], itemStyle: { color: '#67c23a' } },
        { name: '先进值', type: 'bar', data: [8.0, 2.2, 5.5, 0.09], itemStyle: { color: '#e6a23c' } }
      ]
    })
  }
})
</script>
<style scoped>
.card-title {
  font-size: 13px;
  color: #909399;
}
.card-value {
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
}
.card-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
.card-compare {
  font-size: 12px;
  margin-top: 4px;
}
</style>

<template>
  <div class="home">
    <h2>{{ title }}</h2>
    <el-space :size="12">
      <el-button type="primary" @click="load">加载示例数据</el-button>
    </el-space>
    <div class="grid">
      <div class="card">
        <h3>ECharts 示例</h3>
        <div ref="chartEl" style="height: 300px"></div>
      </div>
      <div class="card">
        <h3>VXE Table 示例</h3>
        <vxe-table :data="rows" border>
          <vxe-column field="id" title="ID" width="80" />
          <vxe-column field="name" title="名称" />
          <vxe-column field="value" title="值" />
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import http from '@/utils/http'
import type { EChartsOption } from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const app = useAppStore()
const { title } = storeToRefs(app)

const chartOption: EChartsOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [120, 200, 150, 80, 70, 110, 130] }]
}

const rows = ref<{ id: number; name: string; value: number }[]>([])

const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (chartEl.value) {
    chart = echarts.init(chartEl.value)
    chart.setOption(chartOption)
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

function handleResize() {
  chart?.resize()
}

async function load() {
  try {
    const res = await http.get('/demo')
    rows.value.splice(0, rows.value.length, ...(res.data || []))
  } catch {}
}
</script>

<style scoped>
.home {
  padding: 16px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.card {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>

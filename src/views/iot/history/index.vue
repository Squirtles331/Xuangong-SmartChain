<template>
  <gi-page-layout>
    <template #header>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="device" placeholder="选择设备" style="width: 100%">
            <el-option v-for="d in devices" :key="d" :label="d" :value="d" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="query">查询</el-button>
        </el-col>
      </el-row>
    </template>

    <template #tool>
      <el-button type="primary" @click="exportCSV">导出 CSV</el-button>
    </template>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card header="实时趋势"><div ref="chartRef" style="height: 350px"></div></el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="当前值">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="转速">{{ metrics.rpm }} rpm</el-descriptions-item>
            <el-descriptions-item label="温度">{{ metrics.temp }}°C</el-descriptions-item>
            <el-descriptions-item label="电流">{{ metrics.current }}A</el-descriptions-item>
            <el-descriptions-item label="振动">{{ metrics.vibration }} mm/s</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ metrics.runtime }}h</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-card header="历史数据" style="margin-top: 16px">
      <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small" />
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'

const devices = ['数控车床 CK6150', '钻床 Z3050', '加工中心 VMC850']
const device = ref('数控车床 CK6150')
const dateRange = ref([])
const metrics = reactive({ rpm: 1500, temp: 52, current: 18.5, vibration: 2.3, runtime: 12580 })

interface LogRow {
  time: string
  rpm: number
  temp: number
  current: number
  vibration: number
}

const mockLogs = ref<LogRow[]>(
  Array.from({ length: 20 }, (_, i) => ({
    time: `2025-01-15 ${String(8 + Math.floor(i / 4)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
    rpm: 1400 + Math.floor(Math.random() * 200),
    temp: 48 + Math.floor(Math.random() * 10),
    current: +(16 + Math.random() * 5).toFixed(1),
    vibration: +(2 + Math.random() * 1).toFixed(2)
  }))
)

const columns: TableColumnItem<LogRow>[] = [
  { prop: 'time', label: '时间', minWidth: 160 },
  { prop: 'rpm', label: '转速(rpm)', minWidth: 100, align: 'center' },
  { prop: 'temp', label: '温度(°C)', minWidth: 100, align: 'center' },
  { prop: 'current', label: '电流(A)', minWidth: 100, align: 'center' },
  { prop: 'vibration', label: '振动(mm/s)', minWidth: 110, align: 'center' }
]

const { tableData, pagination, loading, refresh } = useTable<LogRow>({
  rowKey: 'time',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return { list: mockLogs.value.slice(start, start + size), total: mockLogs.value.length }
  }
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['转速', '温度', '电流'] },
      xAxis: { type: 'category', data: mockLogs.value.map((l) => l.time.slice(11)) },
      yAxis: [
        { type: 'value', name: '转速/温度' },
        { type: 'value', name: '电流(A)' }
      ],
      series: [
        { name: '转速', type: 'line', data: mockLogs.value.map((l) => l.rpm), smooth: true, itemStyle: { color: '#409eff' } },
        { name: '温度', type: 'line', data: mockLogs.value.map((l) => l.temp), smooth: true, itemStyle: { color: '#f56c6c' } },
        {
          name: '电流',
          type: 'line',
          yAxisIndex: 1,
          data: mockLogs.value.map((l) => Math.round(l.current * 10) / 10),
          smooth: true,
          itemStyle: { color: '#67c23a' }
        }
      ]
    })
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

function query() {
  refresh()
}

function exportCSV() {
  const headers = ['时间', '转速(rpm)', '温度(°C)', '电流(A)', '振动(mm/s)']
  const rows = mockLogs.value.map((l) => [l.time, l.rpm, l.temp, l.current.toFixed(1), l.vibration.toFixed(2)])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `设备历史数据_${device.value}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
</script>

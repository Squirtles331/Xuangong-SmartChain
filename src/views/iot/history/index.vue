<template>
  <gi-page-layout>
    <template #header>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="device" placeholder="选择设备" style="width: 100%">
            <el-option v-for="item in devices" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
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
        <el-card header="实时趋势">
          <div ref="chartRef" style="height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="当前值">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="转速">{{ metrics.rpm }} rpm</el-descriptions-item>
            <el-descriptions-item label="温度">{{ metrics.temp }} °C</el-descriptions-item>
            <el-descriptions-item label="电流">{{ metrics.current }} A</el-descriptions-item>
            <el-descriptions-item label="振动">{{ metrics.vibration }} mm/s</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ metrics.runtime }} h</el-descriptions-item>
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { TableColumnItem } from 'gi-component'
import { getIoTDeviceHistory, type IoTDeviceHistoryItem } from '@/api/iot'
import { useTable } from '@/hooks/useTable'

const devices = ['数控车床 CK6150', '钻床 Z3050', '加工中心 VMC850']
const device = ref('数控车床 CK6150')
const dateRange = ref<string[]>([])
const metrics = reactive({ rpm: 0, temp: 0, current: 0, vibration: 0, runtime: 12580 })
const historyRows = ref<IoTDeviceHistoryItem[]>([])

const columns: TableColumnItem<IoTDeviceHistoryItem>[] = [
  { prop: 'time', label: '时间', minWidth: 160 },
  { prop: 'rpm', label: '转速(rpm)', minWidth: 110, align: 'center' },
  { prop: 'temp', label: '温度(°C)', minWidth: 110, align: 'center' },
  { prop: 'current', label: '电流(A)', minWidth: 110, align: 'center' },
  { prop: 'vibration', label: '振动(mm/s)', minWidth: 120, align: 'center' }
]

const { tableData, pagination, loading, refresh } = useTable<IoTDeviceHistoryItem>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getIoTDeviceHistory({
      pageNum: page,
      pageSize: size,
      device: device.value || undefined
    })
    historyRows.value = response.data.list || []
    updateMetrics(historyRows.value)
    return response.data
  }
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function updateMetrics(rows: IoTDeviceHistoryItem[]) {
  const latest = rows[rows.length - 1]
  if (!latest) return

  metrics.rpm = latest.rpm
  metrics.temp = latest.temp
  metrics.current = latest.current
  metrics.vibration = latest.vibration
}

function renderChart(rows: IoTDeviceHistoryItem[]) {
  if (!chartRef.value) return
  chartInstance ??= echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['转速', '温度', '电流'] },
    xAxis: { type: 'category', data: rows.map((item) => item.time.slice(11, 16)) },
    yAxis: [
      { type: 'value', name: '转速/温度' },
      { type: 'value', name: '电流(A)' }
    ],
    series: [
      { name: '转速', type: 'line', data: rows.map((item) => item.rpm), smooth: true, itemStyle: { color: '#409eff' } },
      { name: '温度', type: 'line', data: rows.map((item) => item.temp), smooth: true, itemStyle: { color: '#f56c6c' } },
      { name: '电流', type: 'line', yAxisIndex: 1, data: rows.map((item) => item.current), smooth: true, itemStyle: { color: '#67c23a' } }
    ]
  })
}

function handleResize() {
  chartInstance?.resize()
}

function query() {
  refresh()
}

function exportCSV() {
  const headers = ['时间', '转速(rpm)', '温度(°C)', '电流(A)', '振动(mm/s)']
  const rows = historyRows.value.map((item) => [item.time, item.rpm, item.temp, item.current, item.vibration])
  const csv = [headers.join(','), ...rows.map((item) => item.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `设备历史数据_${device.value}_2026-06-30.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

watch(historyRows, (rows) => {
  renderChart(rows)
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

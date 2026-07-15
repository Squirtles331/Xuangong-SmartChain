<template>
  <CrudPage
    v-model:search-model="searchModel"
    title="多工厂计划"
    :search-columns="[]"
    :columns="resultColumns"
    :data="overview?.results || []"
    :loading="loading"
    :show-add-button="false"
    :show-refresh-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
  >
    <template #tool>
      <el-space wrap>
        <el-button @click="loadData">刷新</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </el-space>
    </template>

    <template #beforeTable>
      <el-alert type="info" :closable="false" class="boundary-alert" title="多工厂计划只输出 ERP 平衡建议，不替代 APS 排程窗口或 WMS 调拨执行。" />

      <el-row :gutter="16" class="panel-row">
        <el-col :xs="24" :xl="14">
          <el-card shadow="never" header="工厂产能利用率">
            <div ref="chartRef" class="chart-canvas"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="10">
          <el-card shadow="never" header="工厂负荷快照">
            <gi-table :columns="plantColumns" :data="overview?.plantCapacity || []" border stripe>
              <template #utilization="{ row }">
                <span :class="['utilization', { 'utilization--high': row.utilization >= 85 }]">{{ row.utilization }}%</span>
              </template>
            </gi-table>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <template #type="{ row }">
      <StatusTag :value="row.type" :options="typeOptions" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import { getErpMultiPlantOverview, type ErpMultiPlantCapacity, type ErpMultiPlantOverview, type ErpMultiPlantSuggestion } from '@/static/services/erp'

defineOptions({
  name: 'ErpMultiPlantPage'
})

const searchModel = reactive({})
const typeOptions = [
  { value: 'transfer', label: '调拨建议', type: 'warning' as const },
  { value: 'purchase', label: '采购建议', type: 'primary' as const },
  { value: 'production', label: '补产建议', type: 'success' as const }
]

const overview = ref<ErpMultiPlantOverview | null>(null)
const loading = ref(false)

const plantColumns: TableColumnItem<ErpMultiPlantCapacity>[] = [
  { prop: 'plant', label: '工厂', minWidth: 120 },
  { prop: 'capacity', label: '总产能', width: 100, align: 'right' },
  { prop: 'used', label: '已占用', width: 100, align: 'right' },
  { label: '利用率', width: 90, align: 'center', slotName: 'utilization' },
  { prop: 'bottleneck', label: '瓶颈说明', minWidth: 180 }
]

const resultColumns: TableColumnItem<ErpMultiPlantSuggestion>[] = [
  { prop: 'material', label: '物料 / 产品', minWidth: 180 },
  { prop: 'fromPlant', label: '供给来源', minWidth: 120 },
  { prop: 'toPlant', label: '承接工厂', minWidth: 120 },
  { prop: 'qty', label: '数量', width: 100, align: 'right' },
  { label: '建议类型', width: 100, align: 'center', slotName: 'type' },
  { prop: 'suggestion', label: '建议说明', minWidth: 320 }
]

async function loadData() {
  loading.value = true
  try {
    const response = await getErpMultiPlantOverview()
    overview.value = response.data
  } finally {
    loading.value = false
  }
}

function handleExport() {
  ElMessage.success('多工厂计划静态数据已导出')
}

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value || !overview.value) return

  if (chart) {
    chart.dispose()
  }

  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总产能', '已占用'], bottom: 0 },
    grid: { left: 48, right: 24, top: 36, bottom: 40 },
    xAxis: {
      type: 'category',
      data: overview.value.plantCapacity.map((item) => item.plant)
    },
    yAxis: {
      type: 'value',
      name: '产能'
    },
    series: [
      {
        name: '总产能',
        type: 'bar',
        data: overview.value.plantCapacity.map((item) => item.capacity),
        itemStyle: { color: '#93c5fd' }
      },
      {
        name: '已占用',
        type: 'bar',
        data: overview.value.plantCapacity.map((item) => item.used),
        itemStyle: { color: '#2563eb' }
      }
    ]
  })
}

function handleResize() {
  chart?.resize()
}

watch(
  overview,
  () => {
    nextTick(() => {
      renderChart()
    })
  },
  { deep: true }
)

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.boundary-alert {
  margin-bottom: 16px;
}

.panel-row {
  margin-bottom: 16px;
}

.chart-canvas {
  width: 100%;
  height: 320px;
}

.utilization {
  color: #059669;
  font-weight: 600;
}

.utilization--high {
  color: #dc2626;
}
</style>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="预测需求"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @add="openAdd"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @toolbar-action="handleToolbarAction"
  >
    <template #beforeTable>
      <el-card shadow="never" class="chart-card" header="预测与实际需求对比">
        <div ref="chartRef" class="chart-canvas"></div>
      </el-card>
    </template>

    <template #type="{ row }">
      <StatusTag :value="row.type" :options="typeOptions" />
    </template>

    <template #consumptionStatus="{ row }">
      <StatusTag :value="row.consumptionStatus" :options="consumptionOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ForecastFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import {
  createErpForecast,
  deleteErpForecast,
  getErpForecastList,
  getErpForecastOverview,
  updateErpForecast,
  type ErpForecastOverview,
  type ErpForecastRecord,
  type ForecastDemandType
} from '@/static/services/erp'
import ForecastFormDialog, { type ForecastFormModel } from './ForecastFormDialog.vue'

const router = useRouter()

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'demandPool', label: '查看需求池', tone: 'success' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const typeOptions = [
  { value: 'sales', label: '销售预测', type: 'primary' as const },
  { value: 'independent', label: '独立预测', type: 'warning' as const }
]

const consumptionOptions = [
  { value: 'pending', label: '待承接', type: 'warning' as const },
  { value: 'consumed', label: '已纳入需求池', type: 'success' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const queryParams = reactive<{
  keyword: string
  type: '' | ForecastDemandType
}>({
  keyword: '',
  type: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { placeholder: '物料编码 / 物料名称 / 备注 / 责任人', clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '预测类型',
    field: 'type',
    props: {
      options: typeOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ErpForecastRecord>[] = [
  { prop: 'materialCode', label: '物料编码', minWidth: 130 },
  { prop: 'materialName', label: '物料名称', minWidth: 180 },
  { prop: 'qty', label: '预测数量', width: 100, align: 'right' },
  { prop: 'needDate', label: '需求日期', width: 120, align: 'center' },
  { label: '预测类型', width: 100, align: 'center', slotName: 'type' },
  { prop: 'probability', label: '概率(%)', width: 100, align: 'center' },
  { prop: 'demandOwner', label: '责任人', minWidth: 120 },
  { label: '需求池状态', width: 120, align: 'center', slotName: 'consumptionStatus' },
  { prop: 'remark', label: '备注', minWidth: 220 },
  { label: '操作', minWidth: 180, align: 'center', slotName: 'actions', fixed: 'right' }
]

const overview = ref<ErpForecastOverview | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ForecastFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, handleDelete } = useTable<ErpForecastRecord>({
  rowKey: 'id',
  onSuccess: () => {
    loadOverview()
  },
  listAPI: async ({ page, size }) => {
    const response = await getErpForecastList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: queryParams.type || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteErpForecast(id)))
})

function createDefaultFormModel(): ForecastFormModel {
  return {
    id: '',
    materialCode: '',
    materialName: '',
    qty: 1,
    needDate: '',
    type: 'sales',
    probability: 80,
    remark: '',
    demandOwner: '经营计划部',
    consumptionStatus: 'pending'
  }
}

async function loadOverview() {
  const response = await getErpForecastOverview({
    keyword: queryParams.keyword || undefined,
    type: queryParams.type || undefined
  })
  overview.value = response.data
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ErpForecastRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.materialCode || !formModel.value.materialName) {
    ElMessage.warning('请填写物料编码和物料名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createErpForecast(formModel.value)
    ElMessage.success('预测需求已新增')
  } else {
    await updateErpForecast(formModel.value.id, formModel.value)
    ElMessage.success('预测需求已更新')
  }

  dialogVisible.value = false
  await refresh()
}

async function handleRowAction(action: string, row: ErpForecastRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'demandPool') {
    router.push('/erp/planning-input/demand-pool')
    return
  }

  if (action === 'delete') {
    await handleDelete(() => deleteErpForecast(row.id), {
      title: '删除预测需求',
      content: '确认删除当前预测需求吗？',
      successTip: '预测需求已删除'
    })
  }
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('预测需求静态数据已导出')
  }
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
    legend: { data: ['预测需求', '实际需求'], bottom: 0 },
    grid: { left: 48, right: 24, top: 36, bottom: 40 },
    xAxis: {
      type: 'category',
      data: overview.value.trend.map((item) => item.period)
    },
    yAxis: {
      type: 'value',
      name: '数量'
    },
    series: [
      {
        name: '预测需求',
        type: 'line',
        smooth: true,
        data: overview.value.trend.map((item) => item.forecastQty),
        itemStyle: { color: '#2563eb' }
      },
      {
        name: '实际需求',
        type: 'line',
        smooth: true,
        data: overview.value.trend.map((item) => item.actualQty),
        itemStyle: { color: '#059669' },
        lineStyle: { type: 'dashed' }
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
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}

.chart-canvas {
  width: 100%;
  height: 360px;
}
</style>

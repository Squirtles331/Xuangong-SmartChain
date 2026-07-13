<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="预测需求列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border>
          <template #type="{ row }">
            <el-tag :type="row.type === 'sales' ? 'primary' : 'warning'" size="small">
              {{ row.type === 'sales' ? '销售预测' : '独立需求' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <el-card header="预测与实际需求对比" shadow="never" style="margin-top: 16px">
      <div ref="forecastChartRef" style="width: 100%; height: 400px"></div>
    </el-card>

    <ForecastFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createMRPForecast, deleteMRPForecast, getMRPForecast, updateMRPForecast, type MRPForecast, type MRPForecastQuery } from '@/api/mrp'
import { useTable } from '@/hooks/useTable'
import ForecastFormDialog, { type ForecastFormModel } from './ForecastFormDialog.vue'

const queryParams = reactive<{
  keyword: string
  type: '' | MRPForecast['type']
}>({
  keyword: '',
  type: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ForecastFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword' },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MRPForecast>[] = [
  { prop: 'material_name', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '预测数量', minWidth: 100, align: 'center' },
  { prop: 'need_date', label: '需求日期', minWidth: 120 },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'probability', label: '概率(%)', minWidth: 100, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MRPForecast>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: MRPForecastQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: queryParams.type || undefined
    }
    const response = await getMRPForecast(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteMRPForecast(id)))
})

function createDefaultFormModel(): ForecastFormModel {
  return {
    id: '',
    material_code: '',
    material_name: '',
    qty: 1,
    need_date: '',
    type: 'sales',
    probability: 80,
    remark: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

function openEdit(row: MRPForecast) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.material_code || !formModel.value.material_name) {
    ElMessage.warning('请填写产品编码和产品名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createMRPForecast(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateMRPForecast(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}

const forecastChartRef = ref<HTMLDivElement>()
let forecastChart: echarts.ECharts | null = null

function initForecastChart() {
  if (!forecastChartRef.value) return
  if (forecastChart) forecastChart.dispose()
  forecastChart = echarts.init(forecastChartRef.value)

  const dateMap: Record<string, { forecast: number; actual: number }> = {}
  tableData.value.forEach((item) => {
    if (!dateMap[item.need_date]) dateMap[item.need_date] = { forecast: 0, actual: 0 }
    dateMap[item.need_date].forecast += item.qty
    dateMap[item.need_date].actual += Math.round(item.qty * (0.8 + Math.random() * 0.3))
  })

  const dates = Object.keys(dateMap).sort()
  const forecastValues = dates.map((date) => dateMap[date].forecast)
  const actualValues = dates.map((date) => dateMap[date].actual)

  forecastChart.setOption({
    title: { text: '预测与实际需求对比', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['预测需求', '实际需求'], bottom: 0 },
    grid: { left: 60, right: 30, bottom: 40, top: 50 },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', name: '数量(台)' },
    series: [
      {
        name: '预测需求',
        type: 'line',
        data: forecastValues,
        smooth: true,
        lineStyle: { color: '#409eff', width: 2 },
        itemStyle: { color: '#409eff' }
      },
      {
        name: '实际需求',
        type: 'line',
        data: actualValues,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
        itemStyle: { color: '#67c23a' }
      }
    ]
  })

  window.addEventListener('resize', handleForecastResize)
}

function handleForecastResize() {
  forecastChart?.resize()
}

watch(
  tableData,
  () => {
    nextTick(() => initForecastChart())
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => initForecastChart())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleForecastResize)
  forecastChart?.dispose()
})
</script>

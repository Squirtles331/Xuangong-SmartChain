<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="handleRefresh" />
    </template>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card header="报价分布" shadow="never">
          <div ref="priceChartRef" style="height: 320px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card header="报价概览" shadow="never">
          <gi-table :columns="overviewColumns" :data="overviewData" border stripe size="small" />
        </el-card>
      </el-col>
    </el-row>

    <TableSetting title="价格记录" :columns="columns" @refresh="handleRefresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="margin-top: 16px"
        >
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PriceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createPrice, deletePrice, getPriceList, updatePrice, type PriceQuery, type PriceRecord } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import PriceFormDialog, { type PriceFormModel } from './PriceFormDialog.vue'

type PriceRow = PriceRecord

const sourceOptions = ['报价单', '比价结果', '年度合同', '历史价格']

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '物料名称', field: 'material', props: { clearable: true } as any },
  { type: 'input', label: '供应商', field: 'supplier', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      clearable: true,
      options: sourceOptions.map((item) => ({ label: item, value: item }))
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PriceRow>[] = [
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
  { prop: 'currency', label: '币种', minWidth: 80, align: 'center' },
  { prop: 'valid_from', label: '生效日期', minWidth: 120 },
  { prop: 'valid_to', label: '失效日期', minWidth: 120 },
  { prop: 'source', label: '来源', minWidth: 100 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const overviewColumns: TableColumnItem<PriceRow>[] = [
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'supplier', label: '供应商', minWidth: 160 },
  { prop: 'price', label: '报价', minWidth: 90, align: 'right' },
  { prop: 'source', label: '来源', minWidth: 90 }
]

const queryParams = reactive({
  material: '',
  supplier: '',
  source: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PriceFormModel>(createDefaultFormModel())
const overviewRecords = ref<PriceRow[]>([])
const priceChartRef = ref<HTMLDivElement>()
let priceChart: echarts.ECharts | null = null

const { tableData, pagination, loading, search, refresh, handleDelete } = useTable<PriceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PriceQuery = {
      pageNum: page,
      pageSize: size,
      material: queryParams.material || undefined,
      supplier: queryParams.supplier || undefined,
      source: queryParams.source || undefined
    }
    const response = await getPriceList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePrice(id)))
})

const overviewData = computed(() => overviewRecords.value.slice(0, 6))

watch(
  overviewRecords,
  () => {
    updateChart()
  },
  { deep: true }
)

function createDefaultFormModel(): PriceFormModel {
  return {
    id: '',
    material: '',
    supplier: '',
    price: 0,
    currency: '元',
    valid_from: '',
    valid_to: '',
    source: '报价单'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function buildOverviewQuery(): PriceQuery {
  return {
    pageNum: 1,
    pageSize: 100,
    material: queryParams.material || undefined,
    supplier: queryParams.supplier || undefined,
    source: queryParams.source || undefined
  }
}

async function loadOverview() {
  const response = await getPriceList(buildOverviewQuery())
  overviewRecords.value = response.data.list
}

function handleSearch() {
  search()
  loadOverview()
}

function handleReset() {
  Object.assign(queryParams, {
    material: '',
    supplier: '',
    source: ''
  })
  search()
  loadOverview()
}

function handleRefresh() {
  refresh()
  loadOverview()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PriceRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.material || !formModel.value.supplier) {
    ElMessage.warning('请填写物料名称和供应商')
    return
  }

  const payload: Partial<PriceRecord> = {
    material: formModel.value.material,
    supplier: formModel.value.supplier,
    price: Number(formModel.value.price || 0),
    currency: formModel.value.currency,
    valid_from: formModel.value.valid_from,
    valid_to: formModel.value.valid_to,
    source: formModel.value.source
  }

  if (dialogMode.value === 'add') {
    await createPrice(payload)
  } else {
    await updatePrice(formModel.value.id, payload)
  }

  dialogVisible.value = false
  handleRefresh()
}

async function remove(row: PriceRow) {
  const result = await handleDelete(() => deletePrice(row.id) as any)
  if (result) {
    await loadOverview()
  }
}

function initChart() {
  if (!priceChartRef.value) return
  priceChart = echarts.init(priceChartRef.value)
  updateChart()
  window.addEventListener('resize', handleResize)
}

function updateChart() {
  if (!priceChart) return

  const data = overviewRecords.value.map((item) => ({
    name: `${item.material}\n${item.supplier}`,
    value: item.price
  }))

  priceChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 20, top: 24, bottom: 70 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '报价'
    },
    series: [
      {
        type: 'bar',
        data: data.map((item) => item.value),
        barWidth: 28,
        itemStyle: {
          color: '#409eff',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

function handleResize() {
  priceChart?.resize()
}

onMounted(() => {
  initChart()
  loadOverview()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  priceChart?.dispose()
})
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

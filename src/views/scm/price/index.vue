<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card header="价格趋势" shadow="never">
          <div ref="priceChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="供应商比价" shadow="never">
          <gi-table :columns="compareCols" :data="compareData" border stripe size="small" />
        </el-card>
      </el-col>
    </el-row>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
      style="margin-top: 16px"
    >
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <PriceFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import PriceFormDialog, { type PriceFormModel } from './PriceFormDialog.vue'

interface PriceRow {
  id: string
  material: string
  supplier: string
  price: number
  currency: string
  valid_from: string
  valid_to: string
  source: string
}

const localData = ref<PriceRow[]>([
  {
    id: '1',
    material: '45#圆钢 φ50',
    supplier: 'XX钢材有限公司',
    price: 5.8,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-06-30',
    source: '年度合同'
  },
  {
    id: '2',
    material: '45#圆钢 φ50',
    supplier: 'AA铸件有限公司',
    price: 6.2,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-03-31',
    source: '询价'
  },
  {
    id: '3',
    material: '轴承 6308',
    supplier: 'YY轴承制造厂',
    price: 85.0,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-12-31',
    source: '年度合同'
  },
  {
    id: '4',
    material: '螺栓 M16×60',
    supplier: 'ZZ标准件有限公司',
    price: 2.5,
    currency: 'CNY',
    valid_from: '2024-07-01',
    valid_to: '2025-06-30',
    source: '询价'
  }
])

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PriceFormModel>(createDefaultFormModel())

const columns: TableColumnItem<PriceRow>[] = [
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
  { prop: 'currency', label: '币种', minWidth: 60, align: 'center' },
  { prop: 'valid_from', label: '生效日期', minWidth: 110 },
  { prop: 'valid_to', label: '失效日期', minWidth: 110 },
  { prop: 'source', label: '来源', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, refresh } = useTable<PriceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const total = localData.value.length
    const start = (page - 1) * size
    return {
      list: localData.value.slice(start, start + size),
      total
    }
  }
})

function createDefaultFormModel(): PriceFormModel {
  return {
    id: '',
    material: '',
    supplier: '',
    price: 0,
    currency: 'CNY',
    valid_from: '',
    valid_to: '',
    source: '询价'
  }
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
  if (!formModel.value.material) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    localData.value.unshift({ id: Date.now().toString(), ...formModel.value } as PriceRow)
  } else {
    const idx = localData.value.findIndex((r) => r.id === formModel.value.id)
    if (idx > -1) {
      localData.value[idx] = { ...formModel.value }
    }
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: PriceRow) {
  localData.value = localData.value.filter((r) => r.id !== row.id)
  refresh()
}

// Price trend chart
const priceChartRef = ref<HTMLDivElement>()
let priceChart: echarts.ECharts | null = null

function handleResize() {
  priceChart?.resize()
}

onMounted(() => {
  if (priceChartRef.value) {
    priceChart = echarts.init(priceChartRef.value)
    priceChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['45#圆钢 φ50', '轴承 6308', '螺栓 M16×60'] },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', name: '单价(元)' },
      series: [
        { name: '45#圆钢 φ50', type: 'line', data: [5.8, 5.9, 6.0, 6.1, 6.0, 5.9], smooth: true, itemStyle: { color: '#409eff' } },
        { name: '轴承 6308', type: 'line', data: [85, 86, 84, 83, 85, 84], smooth: true, itemStyle: { color: '#67c23a' } },
        { name: '螺栓 M16×60', type: 'line', data: [2.5, 2.4, 2.6, 2.5, 2.5, 2.4], smooth: true, itemStyle: { color: '#e6a23c' } }
      ]
    })
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  priceChart?.dispose()
})

// Supplier comparison table
const compareCols: TableColumnItem<any>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'price_45', label: '45#圆钢(元/kg)', minWidth: 130, align: 'center' },
  { prop: 'price_bearing', label: '轴承6308(元/个)', minWidth: 130, align: 'center' },
  { prop: 'price_bolt', label: '螺栓M16×60(元/个)', minWidth: 140, align: 'center' },
  { prop: 'delivery_days', label: '交期(天)', minWidth: 80, align: 'center' }
]

const compareData = ref([
  { supplier: 'XX钢材有限公司', price_45: '5.80', price_bearing: '-', price_bolt: '2.50', delivery_days: 7 },
  { supplier: 'AA铸件有限公司', price_45: '6.20', price_bearing: '-', price_bolt: '2.60', delivery_days: 10 },
  { supplier: 'YY轴承制造厂', price_45: '-', price_bearing: '85.00', price_bolt: '-', delivery_days: 5 },
  { supplier: 'ZZ标准件有限公司', price_45: '-', price_bearing: '-', price_bolt: '2.40', delivery_days: 3 }
])
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

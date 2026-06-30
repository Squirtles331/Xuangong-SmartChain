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

    <TableSetting title="价格记录" :columns="columns" @refresh="refresh">
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
            <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PriceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { TableColumnItem } from 'gi-component'
import TableSetting from '@/components/TableSetting.vue'
import { deletePrice, getPriceList, type PriceRecord } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import PriceFormDialog, { type PriceFormModel } from './PriceFormDialog.vue'

interface PriceRow extends PriceRecord {}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PriceFormModel>(createDefaultFormModel())

const columns: TableColumnItem<PriceRow>[] = [
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
  { prop: 'currency', label: '币种', minWidth: 60, align: 'center' },
  { prop: 'valid_from', label: '生效日期', minWidth: 110 },
  { prop: 'valid_to', label: '失效日期', minWidth: 110 },
  { prop: 'source', label: '来源', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, refresh, onDelete } = useTable<PriceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getPriceList({ pageNum: page, pageSize: size })
    return res.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePrice(id)))
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
    source: '报价单'
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
  dialogVisible.value = false
  await refresh()
}

function remove(row: PriceRow) {
  onDelete(row)
}

const priceChartRef = ref<HTMLDivElement>()
let priceChart: echarts.ECharts | null = null

function handleResize() {
  priceChart?.resize()
}

onMounted(() => {
  if (!priceChartRef.value) return
  priceChart = echarts.init(priceChartRef.value)
  priceChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['45#圆钢 D50', '轴承 6308', '螺栓 M16x60'] },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '单价(元)' },
    series: [
      { name: '45#圆钢 D50', type: 'line', data: [5.8, 5.9, 6.0, 6.1, 6.0, 5.9], smooth: true, itemStyle: { color: '#409eff' } },
      { name: '轴承 6308', type: 'line', data: [85, 86, 84, 83, 85, 84], smooth: true, itemStyle: { color: '#67c23a' } },
      { name: '螺栓 M16x60', type: 'line', data: [2.5, 2.4, 2.6, 2.5, 2.5, 2.4], smooth: true, itemStyle: { color: '#e6a23c' } }
    ]
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  priceChart?.dispose()
})

const compareCols: TableColumnItem<any>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'price_45', label: '45#圆钢(元/kg)', minWidth: 130, align: 'center' },
  { prop: 'price_bearing', label: '轴承6308(元/个)', minWidth: 130, align: 'center' },
  { prop: 'price_bolt', label: '螺栓M16x60(元/个)', minWidth: 140, align: 'center' },
  { prop: 'delivery_days', label: '交期(天)', minWidth: 80, align: 'center' }
]

const compareData = ref([
  { supplier: '苏州钢材有限公司', price_45: '5.80', price_bearing: '-', price_bolt: '2.50', delivery_days: 7 },
  { supplier: '南通钢材贸易公司', price_45: '6.10', price_bearing: '-', price_bolt: '2.60', delivery_days: 10 },
  { supplier: '常州轴承制造厂', price_45: '-', price_bearing: '85.00', price_bolt: '-', delivery_days: 5 },
  { supplier: '无锡标准件有限公司', price_45: '-', price_bearing: '-', price_bolt: '2.40', delivery_days: 3 }
])
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

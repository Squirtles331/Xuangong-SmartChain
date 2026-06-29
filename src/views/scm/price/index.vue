<template>
  <gi-page-layout>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card header="价格趋势" shadow="never"><div ref="priceChartRef" style="height: 300px"></div></el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="供应商比价" shadow="never">
          <gi-table :columns="compareCols" :data="compareData" border stripe size="small" />
        </el-card>
      </el-col>
    </el-row>
    <gi-table :columns="cols" :data="records" border stripe style="margin-top: 16px">
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增价格记录' : '编辑价格记录'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface PR {
  id: string
  material: string
  supplier: string
  price: number
  currency: string
  valid_from: string
  valid_to: string
  source: string
}
const records = ref<PR[]>([
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
const cols: TableColumnItem<PR>[] = [
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
  { prop: 'currency', label: '币种', minWidth: 60, align: 'center' },
  { prop: 'valid_from', label: '生效日期', minWidth: 110 },
  { prop: 'valid_to', label: '失效日期', minWidth: 110 },
  { prop: 'source', label: '来源', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ material: '', supplier: '', price: 0, currency: 'CNY', valid_from: '', valid_to: '', source: '询价' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '单价', field: 'price', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input', label: '币种', field: 'currency' },
  { type: 'date-picker', label: '生效日期', field: 'valid_from' },
  { type: 'date-picker', label: '失效日期', field: 'valid_to' },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: '询价', value: '询价' },
        { label: '比价', value: '比价' },
        { label: '年度合同', value: '年度合同' },
        { label: '历史价格', value: '历史价格' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { material: '', supplier: '', price: 0, currency: 'CNY', valid_from: '', valid_to: '', source: '询价' })
  vis.value = true
}
function openEdit(r: PR) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    records.value.unshift({ id: Date.now().toString(), ...form } as PR)
  } else {
    const i = records.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(records.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      records.value = records.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
function refresh() {}

// 价格趋势图
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

// 供应商比价表
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

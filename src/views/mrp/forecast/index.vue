<template>
  <gi-page-layout>
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="forecast-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'sales' ? 'primary' : 'warning'" size="small">{{
          row.type === 'sales' ? '销售预测' : '独立需求'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>

    <!-- 预测 vs 实际对比图 -->
    <el-card header="预测 vs 实际需求对比" shadow="never" style="margin-top: 16px">
      <div ref="forecastChartRef" style="width: 100%; height: 400px"></div>
    </el-card>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增预测需求' : '编辑预测需求'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'
interface FC {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: string
  probability: number
  remark: string
}
const data = ref<FC[]>([
  {
    id: '1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    qty: 30,
    need_date: '2025-03-01',
    type: 'sales',
    probability: 80,
    remark: 'Q1销售预测'
  },
  {
    id: '2',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    qty: 15,
    need_date: '2025-03-15',
    type: 'sales',
    probability: 60,
    remark: '新客户意向'
  },
  {
    id: '3',
    material_code: '03.01.001-00001',
    material_name: '传动轴 DS-50',
    qty: 50,
    need_date: '2025-02-20',
    type: 'independent',
    probability: 100,
    remark: '安全库存补充'
  }
])
const s = reactive({ keyword: '', type: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
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
    }
  } as any
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const cols: TableColumnItem<FC>[] = [
  { prop: 'material_name', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '预测数量', minWidth: 90, align: 'center' },
  { prop: 'need_date', label: '需求日期', minWidth: 110 },
  { label: '类型', minWidth: 90, slotName: 'type', align: 'center' },
  { prop: 'probability', label: '概率(%)', minWidth: 90, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.keyword || r.material_name.includes(s.keyword)) && (!s.type || r.type === s.type)))
const pd = computed(() => fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  fd,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function hs() {
  p.currentPage = 1
}
function hr() {
  s.keyword = ''
  s.type = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ material_code: '', material_name: '', qty: 1, need_date: '', type: 'sales', probability: 80, remark: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '产品编码', field: 'material_code', required: true },
  { type: 'input', label: '产品名称', field: 'material_name', required: true },
  { type: 'input-number', label: '预测数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    } as any
  },
  { type: 'input-number', label: '概率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '备注', field: 'remark' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { material_code: '', material_name: '', qty: 1, need_date: '', type: 'sales', probability: 80, remark: '' })
  vis.value = true
}
function openEdit(r: FC) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.material_name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as FC)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      data.value = data.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 预测 vs 实际对比图
const forecastChartRef = ref<HTMLDivElement>()
let forecastChart: echarts.ECharts | null = null

function initForecastChart() {
  if (!forecastChartRef.value) return
  if (forecastChart) forecastChart.dispose()
  forecastChart = echarts.init(forecastChartRef.value)

  // 按日期汇总预测数量，生成模拟实际数据
  const dateMap: Record<string, { forecast: number; actual: number }> = {}
  data.value.forEach((r) => {
    const d = r.need_date
    if (!dateMap[d]) dateMap[d] = { forecast: 0, actual: 0 }
    dateMap[d].forecast += r.qty
    dateMap[d].actual += Math.round(r.qty * (0.7 + Math.random() * 0.5))
  })

  const dates = Object.keys(dateMap).sort()
  const forecastVals = dates.map((d) => dateMap[d].forecast)
  const actualVals = dates.map((d) => dateMap[d].actual)

  forecastChart.setOption({
    title: { text: '预测 vs 实际需求', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['预测需求', '实际需求'], bottom: 0 },
    grid: { left: 60, right: 30, bottom: 40, top: 50 },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', name: '数量(台)' },
    series: [
      {
        name: '预测需求',
        type: 'line',
        data: forecastVals,
        smooth: true,
        lineStyle: { color: '#409eff', width: 2 },
        itemStyle: { color: '#409eff' },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: '实际需求',
        type: 'line',
        data: actualVals,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
        itemStyle: { color: '#67c23a' },
        symbol: 'diamond',
        symbolSize: 8
      }
    ]
  })
  window.addEventListener('resize', handleForecastResize)
}

function handleForecastResize() {
  forecastChart?.resize()
}

watch(
  data,
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

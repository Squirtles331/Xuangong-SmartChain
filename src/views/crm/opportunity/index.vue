<template>
  <gi-page-layout :bordered="true">
    <template #header><SearchSetting :columns="allSearchColumns" storage-key="opportunity-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #stage="{ row }"
        ><el-steps :active="stageStep(row.stage)" align-center style="min-width: 200px"
          ><el-step title="初步" /><el-step title="方案" /><el-step title="报价" /><el-step title="成交" /></el-steps
      ></template>
      <template #probability="{ row }"
        ><el-progress
          :percentage="row.probability"
          :stroke-width="8"
          :color="row.probability >= 70 ? '#67c23a' : row.probability >= 40 ? '#e6a23c' : '#909399'"
      /></template>
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button type="success" link size="small" @click="convertToOrder(row)"
          >转订单</el-button
        ></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增商机' : '编辑商机'" width="600px">
      <SearchSetting :columns="allSearchColumns" storage-key="opportunity-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Opp {
  id: string
  customer: string
  product: string
  amount: number
  stage: string
  probability: number
  owner: string
  close_date: string
}
const data = ref<Opp[]>([
  {
    id: '1',
    customer: 'XX重工集团',
    product: '离心泵 XJP-100 批量订单',
    amount: 500000,
    stage: 'quotation',
    probability: 60,
    owner: '销售-张经理',
    close_date: '2025-03-15'
  },
  {
    id: '2',
    customer: 'AA精密制造',
    product: '齿轮箱 GBX-200 试制',
    amount: 80000,
    stage: 'solution',
    probability: 40,
    owner: '销售-李经理',
    close_date: '2025-04-01'
  },
  {
    id: '3',
    customer: 'BB动力设备厂',
    product: '传动轴 DS-50 长期合同',
    amount: 300000,
    stage: 'initial',
    probability: 20,
    owner: '销售-张经理',
    close_date: '2025-06-01'
  }
])
const s = reactive({ keyword: '', stage: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '初步接触', value: 'initial' },
        { label: '方案制定', value: 'solution' },
        { label: '报价中', value: 'quotation' },
        { label: '成交', value: 'won' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Opp>[] = [
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'product', label: '商机描述', minWidth: 200 },
  { prop: 'amount', label: '预计金额', minWidth: 110, align: 'right' },
  { label: '阶段', minWidth: 240, slotName: 'stage' },
  { label: '赢单率', minWidth: 140, slotName: 'probability' },
  { prop: 'owner', label: '负责人', minWidth: 100 },
  { prop: 'close_date', label: '预计成交', minWidth: 110 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.keyword || r.customer.includes(s.keyword)) && (!s.stage || r.stage === s.stage)))
const pd = computed(() => fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  fd,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function stageStep(s: string) {
  const m: Record<string, number> = { initial: 1, solution: 2, quotation: 3, won: 4 }
  return m[s] || 0
}
function hs() {
  p.currentPage = 1
}
function hr() {
  s.keyword = ''
  s.stage = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ customer: '', product: '', amount: 0, stage: 'initial', probability: 20, owner: '', close_date: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '客户', field: 'customer', required: true },
  { type: 'input', label: '商机描述', field: 'product', required: true },
  { type: 'input-number', label: '预计金额', field: 'amount', props: { min: 0, step: 10000 } as any },
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      options: [
        { label: '初步接触', value: 'initial' },
        { label: '方案制定', value: 'solution' },
        { label: '报价中', value: 'quotation' },
        { label: '成交', value: 'won' }
      ]
    } as any
  },
  { type: 'input-number', label: '赢单率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '负责人', field: 'owner' },
  { type: 'date-picker', label: '预计成交', field: 'close_date' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { customer: '', product: '', amount: 0, stage: 'initial', probability: 20, owner: '', close_date: '' })
  vis.value = true
}
function openEdit(r: Opp) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.customer) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as Opp)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function convertToOrder(r: Opp) {
  r.stage = 'won'
  r.probability = 100
  ElMessage.success('已转为销售订单')
}
</script>

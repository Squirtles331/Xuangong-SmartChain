<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="sf"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <div style="margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px">
      <div style="text-align: center; font-weight: bold; margin-bottom: 8px">商机阶段漏斗</div>
      <div ref="funnelRef" style="width: 100%; height: 300px"></div>
    </div>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
    >
      <template #stage="{ row }">
        <el-steps :active="stageStep(row.stage)" align-center style="min-width: 200px">
          <el-step title="初步" />
          <el-step title="方案" />
          <el-step title="报价" />
          <el-step title="成交" />
        </el-steps>
      </template>
      <template #probability="{ row }">
        <el-progress
          :percentage="row.probability"
          :stroke-width="8"
          :color="row.probability >= 70 ? '#67c23a' : row.probability >= 40 ? '#e6a23c' : '#909399'"
        />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
        <el-button type="success" link size="small" @click="convertToOrder(row)">转订单</el-button>
      </template>
    </gi-table>

    <OpportunityFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import OpportunityFormDialog, { type OpportunityFormModel } from './OpportunityFormDialog.vue'

interface OpportunityRow {
  id: string
  customer: string
  product: string
  amount: number
  stage: string
  probability: number
  owner: string
  close_date: string
}

const localData = ref<OpportunityRow[]>([
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

const sf = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  stage: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<OpportunityFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
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

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<OpportunityRow>[] = [
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'product', label: '商机描述', minWidth: 200 },
  { prop: 'amount', label: '预计金额', minWidth: 110, align: 'right' },
  { label: '阶段', minWidth: 240, slotName: 'stage' },
  { label: '赢单率', minWidth: 140, slotName: 'probability' },
  { prop: 'owner', label: '负责人', minWidth: 100 },
  { prop: 'close_date', label: '预计成交', minWidth: 110 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<OpportunityRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.keyword) {
      filtered = filtered.filter(
        (r) => r.customer.includes(s.keyword) || r.product.includes(s.keyword) || r.owner.includes(s.keyword)
      )
    }
    if (s.stage) filtered = filtered.filter((r) => r.stage === s.stage)
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
  },
  deleteAPI: (ids) => {
    localData.value = localData.value.filter((r) => !ids.includes(r.id))
    return Promise.resolve()
  }
})

function createDefaultFormModel(): OpportunityFormModel {
  return {
    id: '',
    customer: '',
    product: '',
    amount: 0,
    stage: 'initial',
    probability: 20,
    owner: '',
    close_date: ''
  }
}

function stageStep(s: string) {
  const m: Record<string, number> = { initial: 1, solution: 2, quotation: 3, won: 4 }
  return m[s] || 0
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', stage: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: OpportunityRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    localData.value.unshift({ id: Date.now().toString(), ...formModel.value } as OpportunityRow)
  } else {
    const idx = localData.value.findIndex((r) => r.id === formModel.value.id)
    if (idx > -1) {
      localData.value[idx] = { ...formModel.value }
    }
  }

  dialogVisible.value = false
  await refresh()
}

function convertToOrder(row: OpportunityRow) {
  row.stage = 'won'
  row.probability = 100
  ElMessage.success('已转为销售订单')
}

function remove(row: OpportunityRow) {
  onDelete(row)
}

// Funnel chart
const funnelRef = ref<HTMLElement | null>(null)
let funnelChart: echarts.ECharts | null = null

function handleFunnelResize() {
  funnelChart?.resize()
}

function renderFunnel() {
  if (!funnelRef.value) return
  if (!funnelChart) {
    funnelChart = echarts.init(funnelRef.value)
  }
  const stageCount: Record<string, number> = { initial: 0, solution: 0, quotation: 0, won: 0 }
  localData.value.forEach((r) => {
    if (stageCount[r.stage] !== undefined) stageCount[r.stage]++
  })
  const stageNames: Record<string, string> = { initial: '初步接触', solution: '方案制定', quotation: '报价中', won: '成交' }
  const funnelData = Object.entries(stageCount)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: stageNames[k] || k, value: v }))
  funnelChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 个' },
    series: [
      {
        type: 'funnel',
        left: '20%',
        right: '20%',
        top: 20,
        bottom: 20,
        width: '60%',
        min: 0,
        max: funnelData.length ? funnelData[0].value : 1,
        minSize: '20%',
        maxSize: '100%',
        gap: 4,
        label: { show: true, position: 'inside', formatter: '{b}: {c}' },
        labelLine: { show: false },
        itemStyle: { borderWidth: 0 },
        data: funnelData
      }
    ]
  })
}

watch(localData, () => nextTick(renderFunnel), { deep: true })

onMounted(() => {
  nextTick(renderFunnel)
  window.addEventListener('resize', handleFunnelResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleFunnelResize)
  funnelChart?.dispose()
})
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

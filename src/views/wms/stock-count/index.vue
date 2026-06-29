<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openCreate" />
    </template>

    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6" v-for="item in diffSummary" :key="item.label">
        <el-card shadow="hover" class="diff-card">
          <div class="diff-label">{{ item.label }}</div>
          <div class="diff-value" :style="{ color: item.color }">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <gi-table :columns="planColumns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #type="{ row }">
        <el-tag :type="row.type === 'full' ? 'danger' : 'warning'" size="small">{{ row.type }}</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'running' ? 'primary' : 'success'" size="small">
          {{ row.status }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="startCount(row)">Start</el-button>
        <el-button v-if="row.status !== 'pending'" type="success" link size="small" @click="viewDiff(row)">View Diff</el-button>
      </template>
    </gi-table>

    <StockCountExecuteDialog v-model:visible="execVisible" v-model:items="execItems" @submit="submitCount" />
    <StockCountDiffDialog v-model:visible="diffVisible" v-model:items="diffItems" @submit="confirmDiff" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getStockCountDiff, getStockCountList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import StockCountExecuteDialog, { type StockCountExecuteItem } from './StockCountExecuteDialog.vue'
import StockCountDiffDialog, { type StockCountDiffItem } from './StockCountDiffDialog.vue'

interface PlanRow {
  id: string
  code: string
  warehouse: string
  type: string
  plan_date: string
  executor: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '' })

const searchColumns: FormColumnItem[] = [{ type: 'input', label: 'Keyword', field: 'keyword' } as any]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const rawExecLines = ref<any[]>([])
const rawDiffLines = ref<any[]>([])
const execItems = ref<StockCountExecuteItem[]>([])
const diffItems = ref<StockCountDiffItem[]>([])
const execVisible = ref(false)
const diffVisible = ref(false)
const currentPlanCode = ref('')

const planColumns: TableColumnItem<PlanRow>[] = [
  { prop: 'code', label: 'Plan Code', width: 160 },
  { prop: 'warehouse', label: 'Warehouse', width: 140 },
  { label: 'Type', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: 'Plan Date', width: 110 },
  { prop: 'executor', label: 'Executor', width: 100 },
  { label: 'Status', minWidth: 90, slotName: 'status', align: 'center' },
  { label: 'Actions', minWidth: 160, slotName: 'actions', align: 'center' }
]

const diffSummary = computed(() => {
  const totalItems = rawDiffLines.value.length
  const changedItems = rawDiffLines.value.filter((item) => item.diff !== 0).length
  const totalBookQty = rawDiffLines.value.reduce((sum, item) => sum + Number(item.book_qty || 0), 0)
  const totalDiff = rawDiffLines.value.reduce((sum, item) => sum + Math.abs(Number(item.diff || 0)), 0)
  const diffRate = totalBookQty > 0 ? `${((totalDiff / totalBookQty) * 100).toFixed(2)}%` : '0.00%'

  return [
    { label: 'Count Items', value: String(totalItems), color: '#409eff' },
    { label: 'Diff Items', value: String(changedItems), color: '#e6a23c' },
    { label: 'Diff Rate', value: diffRate, color: '#f56c6c' },
    { label: 'Total Diff', value: String(totalDiff), color: '#67c23a' }
  ]
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function buildPlans(lines: any[]) {
  const map = new Map<string, PlanRow>()

  lines.forEach((line, index) => {
    const code = String(line.plan_code)
    if (!map.has(code)) {
      const hasDone = lines.some((item) => item.plan_code === code && Number(item.diff || 0) !== 0)
      map.set(code, {
        id: code,
        code,
        warehouse: line.warehouse,
        type: index % 2 === 0 ? 'full' : 'cycle',
        plan_date: `2025-01-${String(10 + index).padStart(2, '0')}`,
        executor: `User ${index + 1}`,
        status: hasDone ? 'completed' : 'pending'
      })
    }
  })

  const keyword = searchForm.value.keyword.trim().toLowerCase()
  const result = Array.from(map.values())
  return keyword ? result.filter((item) => item.code.toLowerCase().includes(keyword) || item.warehouse.toLowerCase().includes(keyword)) : result
}

const { tableData, pagination, loading, search, refresh } = useTable<PlanRow>({
  rowKey: 'id',
  listAPI: async () => {
    const [execRes, diffRes] = await Promise.all([getStockCountList({ page: 1, page_size: 100 }), getStockCountDiff({ page: 1, page_size: 100 })])

    rawExecLines.value = (execRes.data.items || []).map((item: any) => ({
      ...item,
      id: String(item.id),
      actual: Number(item.actual_qty ?? item.book_qty ?? 0)
    }))
    rawDiffLines.value = (diffRes.data.items || []).map((item: any) => ({
      ...item,
      id: String(item.id),
      disposition: 'ignore'
    }))

    const plans = buildPlans(rawExecLines.value)
    return { list: plans, total: plans.length }
  }
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.keyword = ''
  search()
}

function openCreate() {
  ElMessage.info('Create flow is not implemented in mock mode yet')
}

function startCount(plan: PlanRow) {
  currentPlanCode.value = plan.code
  plan.status = 'running'
  execItems.value = rawExecLines.value
    .filter((item) => item.plan_code === plan.code)
    .map((item) => ({ ...item, actual: Number(item.actual_qty ?? item.book_qty ?? 0) }))
  execVisible.value = true
}

function submitCount() {
  const plan = tableData.value.find((item) => item.code === currentPlanCode.value)
  if (plan) plan.status = 'completed'
  execVisible.value = false
  ElMessage.success('Count submitted')
}

function viewDiff(plan: PlanRow) {
  diffItems.value = rawDiffLines.value.filter((item) => item.plan_code === plan.code).map((item) => ({ ...item }))
  diffVisible.value = true
}

function confirmDiff() {
  diffVisible.value = false
  ElMessage.success('Diff confirmed')
}
</script>

<style scoped>
.diff-card :deep(.el-card__body) {
  padding: 16px;
  text-align: center;
}

.diff-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.diff-value {
  font-size: 28px;
  font-weight: 700;
}
</style>

<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form v-model="queryParams" :columns="visibleSearchColumns" search @search="search" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openCreate" />
    </template>

    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col v-for="item in diffSummary" :key="item.label" :span="6">
        <el-card shadow="hover" class="diff-card">
          <div class="diff-label">{{ item.label }}</div>
          <div class="diff-value" :style="{ color: item.color }">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <TableSetting title="盘点计划" :columns="planColumns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #type="{ row }">
            <el-tag :type="row.type === 'full' ? 'danger' : 'warning'" size="small">
              {{ row.type === 'full' ? '全盘' : '循环盘点' }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="statusTagMap[row.status] || 'info'" size="small">
              {{ statusLabelMap[row.status] || row.status }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="startCount(row)">开始盘点</el-button>
            <el-button v-if="row.status !== 'pending'" type="success" link size="small" @click="viewDiff(row)">查看差异</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <StockCountExecuteDialog v-model:visible="execVisible" v-model:items="execItems" @submit="submitCount" />
    <StockCountDiffDialog v-model:visible="diffVisible" v-model:items="diffItems" @submit="confirmDiff" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getStockCountDiff, getStockCountList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import StockCountExecuteDialog, { type StockCountExecuteItem } from './StockCountExecuteDialog.vue'
import StockCountDiffDialog, { type StockCountDiffItem } from './StockCountDiffDialog.vue'

interface PlanRow {
  id: string
  code: string
  warehouse: string
  type: string
  planDate: string
  executor: string
  status: string
}

const statusLabelMap: Record<string, string> = {
  pending: '待执行',
  counting: '执行中',
  completed: '已完成'
}

const statusTagMap: Record<string, 'warning' | 'primary' | 'success' | 'info'> = {
  pending: 'warning',
  counting: 'primary',
  completed: 'success'
}

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const queryParams = ref({
  keyword: '',
  warehouse: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: {
      placeholder: '请输入盘点计划号',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: warehouseOptions,
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待执行', value: 'pending' },
        { label: '执行中', value: 'counting' },
        { label: '已完成', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const rawExecLines = ref<any[]>([])
const rawDiffLines = ref<any[]>([])
const execItems = ref<StockCountExecuteItem[]>([])
const diffItems = ref<StockCountDiffItem[]>([])
const execVisible = ref(false)
const diffVisible = ref(false)
const currentPlanCode = ref('')

const planColumns: TableColumnItem<PlanRow>[] = [
  { prop: 'code', label: '计划号', width: 160 },
  { prop: 'warehouse', label: '仓库', width: 120 },
  { label: '盘点类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'planDate', label: '计划日期', width: 120 },
  { prop: 'executor', label: '执行人', width: 100 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 140, slotName: 'actions', align: 'center' }
]

const diffSummary = computed(() => {
  const totalItems = rawDiffLines.value.length
  const changedItems = rawDiffLines.value.filter((item) => Number(item.diff || 0) !== 0).length
  const totalBookQty = rawDiffLines.value.reduce((sum, item) => sum + Number(item.book_qty || 0), 0)
  const totalDiff = rawDiffLines.value.reduce((sum, item) => sum + Math.abs(Number(item.diff || 0)), 0)
  const diffRate = totalBookQty > 0 ? `${((totalDiff / totalBookQty) * 100).toFixed(2)}%` : '0.00%'

  return [
    { label: '盘点项数', value: String(totalItems), color: '#409eff' },
    { label: '差异项数', value: String(changedItems), color: '#e6a23c' },
    { label: '差异率', value: diffRate, color: '#f56c6c' },
    { label: '总差异数', value: String(totalDiff), color: '#67c23a' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<PlanRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const [execResponse, diffResponse] = await Promise.all([
      getStockCountList({
        pageNum: 1,
        pageSize: 200,
        planCode: queryParams.value.keyword || undefined,
        warehouse: queryParams.value.warehouse || undefined,
        status: queryParams.value.status || undefined
      }),
      getStockCountDiff({
        pageNum: 1,
        pageSize: 200,
        planCode: queryParams.value.keyword || undefined
      })
    ])

    rawExecLines.value = execResponse.data.list.map((item: any) => ({
      ...item,
      id: String(item.id),
      actual: Number(item.actual_qty ?? item.book_qty ?? 0)
    }))
    rawDiffLines.value = diffResponse.data.list.map((item: any) => ({
      ...item,
      id: String(item.id),
      disposition: item.disposition || 'ignore'
    }))

    const plans = buildPlans(rawExecLines.value)
    const start = (page - 1) * size
    const end = start + size

    return {
      list: plans.slice(start, end),
      total: plans.length
    }
  }
})

function buildPlans(lines: any[]): PlanRow[] {
  const planMap = new Map<string, PlanRow>()

  lines.forEach((line) => {
    const code = String(line.plan_code || '')
    if (!code || planMap.has(code)) return

    planMap.set(code, {
      id: code,
      code,
      warehouse: line.warehouse || '',
      type: line.type || 'cycle',
      planDate: line.plan_date || '',
      executor: line.executor || '',
      status: line.status || 'pending'
    })
  })

  return Array.from(planMap.values())
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.value = {
    keyword: '',
    warehouse: '',
    status: ''
  }
  search()
}

function openCreate() {
  ElMessage.info('当前为 Mock 演示模式，暂不提供新增盘点计划')
}

function startCount(plan: PlanRow) {
  currentPlanCode.value = plan.code
  plan.status = 'counting'
  execItems.value = rawExecLines.value
    .filter((item) => item.plan_code === plan.code)
    .map((item) => ({
      location: item.location,
      material: item.material,
      bookQty: Number(item.book_qty ?? 0),
      actual: Number(item.actual_qty ?? item.book_qty ?? 0)
    }))
  execVisible.value = true
}

function submitCount() {
  const plan = tableData.value.find((item) => item.code === currentPlanCode.value)
  if (plan) {
    plan.status = 'completed'
  }
  execVisible.value = false
  ElMessage.success('盘点结果已提交')
}

function viewDiff(plan: PlanRow) {
  diffItems.value = rawDiffLines.value
    .filter((item) => item.plan_code === plan.code)
    .map((item) => ({
      material: item.material,
      bookQty: Number(item.book_qty ?? 0),
      actualQty: Number(item.actual_qty ?? 0),
      diff: Number(item.diff ?? 0),
      disposition: item.disposition || 'ignore'
    }))
  diffVisible.value = true
}

function confirmDiff() {
  diffVisible.value = false
  ElMessage.success('差异处理已确认')
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

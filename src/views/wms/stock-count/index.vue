<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="库存盘点计划"
    :search-columns="searchColumns"
    :columns="planColumns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openCreate"
  >
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
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <StockCountExecuteDialog v-model:visible="execVisible" v-model:items="execItems" @submit="submitCount" />
      <StockCountDiffDialog v-model:visible="diffVisible" v-model:items="diffItems" @submit="confirmDiff" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { completeStockCountPlan, getStockCountDiff, getStockCountList, updateStockCountDiffDispositions } from '@/api/wms'
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

function handleReset() {
  queryParams.value = {
    keyword: '',
    warehouse: '',
    status: ''
  }
  search()
}

function openCreate() {
  ElMessage.info('当前为静态演示模式，暂不提供新增盘点计划')
}

function getRowActions(row: PlanRow) {
  return row.status === 'pending'
    ? [{ key: 'start', label: '开始盘点', tone: 'primary' as const }]
    : [{ key: 'diff', label: '查看差异', tone: 'success' as const }]
}

function handleRowAction(action: string, row: PlanRow) {
  if (action === 'start') {
    startCount(row)
    return
  }

  if (action === 'diff') {
    viewDiff(row)
  }
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

async function submitCount() {
  await completeStockCountPlan(currentPlanCode.value, execItems.value)

  const plan = tableData.value.find((item) => item.code === currentPlanCode.value)
  if (plan) {
    plan.status = 'completed'
  }

  execVisible.value = false
  ElMessage.success('盘点结果已提交')
  await refresh()
}

function viewDiff(plan: PlanRow) {
  currentPlanCode.value = plan.code
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

async function confirmDiff() {
  await updateStockCountDiffDispositions(
    currentPlanCode.value,
    diffItems.value.map((item) => ({
      material: item.material,
      disposition: item.disposition
    }))
  )

  diffVisible.value = false
  ElMessage.success('差异处理已确认')
  await refresh()
}
</script>

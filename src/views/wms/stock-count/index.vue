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
            <el-tag :type="row.type === '全盘' ? 'danger' : 'warning'" size="small">{{ row.type }}</el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === '待执行' ? 'warning' : row.status === '执行中' ? 'primary' : 'success'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === '待执行'" type="primary" link size="small" @click="startCount(row)">开始盘点</el-button>
            <el-button v-if="row.status !== '待执行'" type="success" link size="small" @click="viewDiff(row)">查看差异</el-button>
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
  plan_date: string
  executor: string
  status: string
}

const queryParams = ref({ keyword: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入计划号/仓库', clearable: true } as any }
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
  { prop: 'warehouse', label: '仓库', width: 140 },
  { label: '盘点类型', minWidth: 90, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: '计划日期', width: 110 },
  { prop: 'executor', label: '执行人', width: 100 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const diffSummary = computed(() => {
  const totalItems = rawDiffLines.value.length
  const changedItems = rawDiffLines.value.filter((item) => item.diff !== 0).length
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
        type: index % 2 === 0 ? '全盘' : '循环盘点',
        plan_date: `2025-01-${String(10 + index).padStart(2, '0')}`,
        executor: ['张三', '李四', '王五', '赵六'][index % 4],
        status: hasDone ? '已完成' : '待执行'
      })
    }
  })

  const keyword = queryParams.value.keyword.trim().toLowerCase()
  const result = Array.from(map.values())
  return keyword ? result.filter((item) => item.code.toLowerCase().includes(keyword) || item.warehouse.toLowerCase().includes(keyword)) : result
}

const { tableData, pagination, loading, search, refresh } = useTable<PlanRow>({
  rowKey: 'id',
  listAPI: async () => {
    const [execRes, diffRes] = await Promise.all([getStockCountList({ pageNum: 1, pageSize: 100 }), getStockCountDiff({ pageNum: 1, pageSize: 100 })])

    rawExecLines.value = execRes.data.list.map((item: any) => ({
      ...item,
      id: String(item.id),
      actual: Number(item.actual_qty ?? item.book_qty ?? 0)
    }))
    rawDiffLines.value = diffRes.data.list.map((item: any) => ({
      ...item,
      id: String(item.id),
      disposition: 'ignore'
    }))

    const plans = buildPlans(rawExecLines.value)
    return { list: plans, total: plans.length }
  }
})

function handleReset() {
  queryParams.value.keyword = ''
  search()
}

function openCreate() {
  ElMessage.info('Mock 数据模式下暂未实现新建流程')
}

function startCount(plan: PlanRow) {
  currentPlanCode.value = plan.code
  plan.status = '执行中'
  execItems.value = rawExecLines.value
    .filter((item) => item.plan_code === plan.code)
    .map((item) => ({ ...item, actual: Number(item.actual_qty ?? item.book_qty ?? 0) }))
  execVisible.value = true
}

function submitCount() {
  const plan = tableData.value.find((item) => item.code === currentPlanCode.value)
  if (plan) plan.status = '已完成'
  execVisible.value = false
  ElMessage.success('盘点结果已提交')
}

function viewDiff(plan: PlanRow) {
  diffItems.value = rawDiffLines.value.filter((item) => item.plan_code === plan.code).map((item) => ({ ...item }))
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

<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="$router.push('/work-order/create')">新建工单</gi-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="工单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #priority="{ row }">
            <StatusTag :value="row.priority" :options="WORK_ORDER_PRIORITY" />
          </template>

          <template #progress="{ row }">
            <div class="progress-cell">
              <el-progress :percentage="row.progress" :stroke-width="6" :color="row.progress === 100 ? '#67c23a' : '#409eff'" />
            </div>
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="WORK_ORDER_STATUS" />
          </template>

          <template #plannedEnd="{ row }">
            <span :style="{ color: isOverdue(row) ? '#f56c6c' : '' }">{{ row.planned_end_date || '-' }}</span>
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/work-order/${row.id}`)">详情</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" link size="small">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="row.status === 'draft'" @click="submitApproval(row)">提交审核</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 'approved'" @click="releaseOrder(row)">下发</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 'completed'" @click="closeOrder(row)">关闭</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 'in_progress'" @click="$router.push(`/work-order/report/${row.id}`)">报工</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </gi-table>
      </template>
    </TableSetting>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { WORK_ORDER_PRIORITY, WORK_ORDER_STATUS } from '@/common/status-maps'
import { approveWorkOrder, closeWorkOrder, getWorkOrderList, releaseWorkOrder, type WorkOrder, type WorkOrderQuery } from '@/api/work-order'
import { useTable } from '@/hooks/useTable'

interface WorkOrderRow extends WorkOrder {
  material_spec?: string
  current_operation?: string
  progress: number
}

const statusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '已审核', value: 'approved' },
  { label: '已下发', value: 'released' },
  { label: '生产中', value: 'in_progress' },
  { label: '已完工', value: 'completed' },
  { label: '已关闭', value: 'closed' }
]

const priorityOptions = [
  { label: '紧急', value: 'urgent' },
  { label: '高', value: 'high' },
  { label: '普通', value: 'normal' },
  { label: '低', value: 'low' }
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '工单编号',
    field: 'code',
    props: { placeholder: '请输入工单编号', clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: statusOptions, clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: { options: priorityOptions, clearable: true } as any
  },
  {
    type: 'date-picker',
    label: '计划完工',
    field: 'dateRange',
    props: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD'
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<WorkOrderRow>[] = [
  { prop: 'code', label: '工单编号', minWidth: 160 },
  { prop: 'material_name', label: '产品名称', minWidth: 140 },
  { prop: 'planned_qty', label: '计划数量', minWidth: 100, align: 'center' },
  { label: '进度', minWidth: 140, slotName: 'progress' },
  { prop: 'current_operation', label: '当前工序', minWidth: 140 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
  { prop: 'workshop_name', label: '生产车间', minWidth: 130 },
  { label: '计划完工', minWidth: 120, slotName: 'plannedEnd' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  code: string
  status: string
  priority: string
  dateRange: string[]
}>({
  code: '',
  status: '',
  priority: '',
  dateRange: []
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const { tableData, pagination, loading, search, refresh } = useTable<WorkOrderRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: WorkOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      status: queryParams.status || undefined,
      priority: queryParams.priority || undefined,
      startDate: queryParams.dateRange[0] || undefined,
      endDate: queryParams.dateRange[1] || undefined
    }
    const response = await getWorkOrderList(params)
    return {
      list: response.data.list.map(mapWorkOrderRow),
      total: response.data.total
    }
  }
})

function mapWorkOrderRow(item: WorkOrderRow): WorkOrderRow {
  return {
    ...item,
    material_spec: item.material_spec || '',
    current_operation: item.current_operation || '待排产',
    progress: item.planned_qty > 0 ? Math.round(((item.completed_qty || 0) / item.planned_qty) * 100) : 0
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    status: '',
    priority: '',
    dateRange: []
  })
  search()
}

function isOverdue(row: WorkOrderRow) {
  if (row.status === 'completed' || row.status === 'closed' || !row.planned_end_date) return false
  return new Date(row.planned_end_date).getTime() < Date.now()
}

async function submitApproval(row: WorkOrderRow) {
  const response = await approveWorkOrder(row.id, true)
  ElMessage.success(response.msg || `工单 ${row.code} 已提交审核`)
  await refresh()
}

async function releaseOrder(row: WorkOrderRow) {
  const response = await releaseWorkOrder(row.id)
  ElMessage.success(response.msg || `工单 ${row.code} 已下发`)
  await refresh()
}

function closeOrder(row: WorkOrderRow) {
  ElMessageBox.confirm(`确认关闭工单 ${row.code} 吗？`, '关闭工单', { type: 'warning' })
    .then(async () => {
      const response = await closeWorkOrder(row.id, { close_type: 'normal' })
      ElMessage.success(response.msg || '工单已关闭')
      await refresh()
    })
    .catch(() => {})
}
</script>

<style scoped>
.progress-cell {
  min-width: 120px;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>

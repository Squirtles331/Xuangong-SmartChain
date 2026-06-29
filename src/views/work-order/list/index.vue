<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 } }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="$router.push('/work-order/create')">新建工单</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
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
      <template #planned_end_date="{ row }">
        <span :style="{ color: isOverdue(row) ? '#f56c6c' : '' }">{{ row.planned_end_date }}</span>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="$router.push(`/work-order/${row.id}`)">详情</el-button>
        <el-dropdown trigger="click">
          <el-button type="primary" link size="small">
            更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="row.status === 'draft'" @click="submitApproval(row)">提交审批</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 'approved'" @click="releaseOrder(row)">下发</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 'completed'" @click="closeOrder(row)">关闭</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 'in_progress'" @click="$router.push(`/work-order/report/${row.id}`)">报工</el-dropdown-item>
              <el-dropdown-item v-if="['draft', 'approved'].includes(row.status)" @click="deleteOrder(row.id)" divided>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </gi-table>

    <WorkOrderFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { WORK_ORDER_STATUS, WORK_ORDER_PRIORITY } from '@/common/status-maps'
import { getWorkOrderList, approveWorkOrder, releaseWorkOrder, closeWorkOrder } from '@/api/work-order'
import { useTable } from '@/hooks/useTable'
import WorkOrderFormDialog, { type WorkOrderFormModel } from './WorkOrderFormDialog.vue'

interface WorkOrderRow {
  id: string
  code: string
  wo_type: string
  material_code: string
  material_name: string
  material_spec: string
  planned_qty: number
  completed_qty: number
  progress: number
  status: string
  priority: string
  workshop_name: string
  current_operation: string
  planned_start_date: string
  planned_end_date: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  status: '',
  priority: '',
  date_range: [] as string[]
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<WorkOrderFormModel>({ id: '', code: '', name: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单编号', field: 'code', props: { placeholder: 'WO...' } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '已审批', value: 'approved' },
        { label: '已下发', value: 'released' },
        { label: '生产中', value: 'in_progress' },
        { label: '已完工', value: 'completed' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' },
        { label: '低', value: 'low' }
      ]
    } as any
  },
  {
    type: 'date-picker',
    label: '计划完工',
    field: 'date_range',
    props: { type: 'daterange', startPlaceholder: '开始', endPlaceholder: '结束' } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<WorkOrderRow>[] = [
  { prop: 'code', label: '工单编号', width: 160 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'planned_qty', label: '计划数量', minWidth: 100, align: 'center' },
  { label: '进度', minWidth: 140, slotName: 'progress' },
  { prop: 'current_operation', label: '当前工序', width: 140 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '优先级', minWidth: 70, slotName: 'priority', align: 'center' },
  { prop: 'workshop_name', label: '车间', width: 130 },
  { label: '计划完工', minWidth: 110, slotName: 'planned_end_date' },
  { label: '操作', minWidth: 140, fixed: 'right', slotName: 'actions', align: 'center' }
]

const {
  tableData,
  pagination,
  loading,
  search,
  refresh: refreshTable
} = useTable<WorkOrderRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: any = {
      page,
      page_size: size
    }
    if (searchForm.value.code) params.code = searchForm.value.code
    if (searchForm.value.status) params.status = searchForm.value.status
    if (searchForm.value.priority) params.priority = searchForm.value.priority
    if (searchForm.value.date_range && searchForm.value.date_range.length === 2) {
      const start = searchForm.value.date_range[0]
      const end = searchForm.value.date_range[1]
      if (start) params.start_date = start
      if (end) params.end_date = end
    }
    const res = await getWorkOrderList(params)
    return {
      list: (res.data.items as WorkOrderRow[]).map(mapWorkOrderRow),
      total: res.data.total
    }
  }
})

function deleteOrder(id: string) {
  ElMessageBox.confirm('确定删除该工单？', '警告', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      refreshTable()
    })
    .catch(() => {})
}

function mapWorkOrderRow(item: any): WorkOrderRow {
  return {
    id: item.id,
    code: item.code,
    wo_type: item.wo_type,
    material_code: item.material_code,
    material_name: item.material_name,
    material_spec: item.material_spec || '',
    planned_qty: item.planned_qty,
    completed_qty: item.completed_qty || 0,
    progress: item.planned_qty > 0 ? Math.round(((item.completed_qty || 0) / item.planned_qty) * 100) : 0,
    status: item.status,
    priority: item.priority,
    workshop_name: item.workshop_name || '',
    current_operation: item.current_operation || '',
    planned_start_date: item.planned_start_date || '',
    planned_end_date: item.planned_end_date || ''
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', status: '', priority: '', date_range: [] }
  search()
}

function refresh() {
  handleReset()
}

function isOverdue(row: WorkOrderRow) {
  if (row.status === 'completed' || row.status === 'closed') return false
  if (!row.planned_end_date) return false
  return new Date(row.planned_end_date) < new Date()
}

async function submitApproval(row: WorkOrderRow) {
  const res = await approveWorkOrder(row.id, true)
  ElMessage.success(res.message || `工单 ${row.code} 已提交审批`)
  refreshTable()
}

async function releaseOrder(row: WorkOrderRow) {
  const res = await releaseWorkOrder(row.id)
  ElMessage.success(res.message || `工单 ${row.code} 已下发到车间`)
  refreshTable()
}

async function closeOrder(row: WorkOrderRow) {
  ElMessageBox.confirm('确认关闭该工单？', '确认', { type: 'warning' })
    .then(async () => {
      const res = await closeWorkOrder(row.id, { close_type: 'normal' })
      ElMessage.success(res.message || '工单已关闭')
      refreshTable()
    })
    .catch(() => {})
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = { id: '', code: '', name: '' }
  dialogVisible.value = true
}

function openEdit(row: WorkOrderRow) {
  dialogMode.value = 'edit'
  formModel.value = { id: row.id, code: row.code, name: row.material_name }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refreshTable()
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

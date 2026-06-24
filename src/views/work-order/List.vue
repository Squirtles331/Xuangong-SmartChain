<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form
        ref="searchFormRef"
        v-model="searchForm"
        :columns="searchColumns"
        :grid-item-props="{ span: { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 } }"
        search
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>
    <template #tool>
      <gi-button type="add" @click="$router.push('/work-order/create')">新建工单</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="pagedOrders" :pagination="pagination" border stripe style="height: 100%">
      <template #priority="{ row }">
        <el-tag v-if="row.priority === 'urgent'" type="danger" size="small">紧急</el-tag>
        <el-tag v-else-if="row.priority === 'high'" type="warning" size="small">高</el-tag>
        <el-tag v-else-if="row.priority === 'normal'" type="info" size="small">普通</el-tag>
        <el-tag v-else size="small">低</el-tag>
      </template>
      <template #progress="{ row }">
        <div class="progress-cell">
          <el-progress :percentage="row.progress" :stroke-width="6" :color="row.progress === 100 ? '#67c23a' : '#409eff'" />
        </div>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === 'draft'" type="info" size="small">草稿</el-tag>
        <el-tag v-else-if="row.status === 'approved'" size="small">已审批</el-tag>
        <el-tag v-else-if="row.status === 'released'" type="warning" size="small">已下发</el-tag>
        <el-tag v-else-if="row.status === 'in_progress'" type="primary" size="small">生产中</el-tag>
        <el-tag v-else-if="row.status === 'completed'" type="success" size="small">已完工</el-tag>
        <el-tag v-else size="small">已关闭</el-tag>
      </template>
      <template #planned_end_date="{ row }">
        <span :style="{ color: isOverdue(row) ? '#f56c6c' : '' }">{{ row.planned_end_date }}</span>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="$router.push(`/work-order/${row.id}`)">详情</el-button>
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitApproval(row)">提交审批</el-button>
        <el-button v-if="row.status === 'approved'" type="warning" link size="small" @click="releaseOrder(row)">下发</el-button>
        <el-button v-if="row.status === 'completed'" type="success" link size="small" @click="closeOrder(row)">关闭</el-button>
        <el-button v-if="row.status === 'in_progress'" type="primary" link size="small" @click="$router.push(`/work-order/report/${row.id}`)"
          >报工</el-button
        >
        <gi-button v-if="['draft', 'approved'].includes(row.status)" type="delete" size="small" @click="deleteOrder(row.id)" />
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface WorkOrder {
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

// ==================== Mock 数据 ====================
const orders = ref<WorkOrder[]>([
  {
    id: '1',
    code: 'WO202501150001',
    wo_type: 'production',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    material_spec: '流量100m³/h',
    planned_qty: 100,
    completed_qty: 45,
    progress: 45,
    status: 'in_progress',
    priority: 'normal',
    workshop_name: '机加工一车间',
    current_operation: '工序30:精车',
    planned_start_date: '2025-01-10',
    planned_end_date: '2025-01-20'
  },
  {
    id: '2',
    code: 'WO202501150002',
    wo_type: 'production',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    material_spec: '速比1:5',
    planned_qty: 50,
    completed_qty: 0,
    progress: 0,
    status: 'released',
    priority: 'high',
    workshop_name: '机加工二车间',
    current_operation: '-',
    planned_start_date: '2025-01-16',
    planned_end_date: '2025-01-28'
  },
  {
    id: '3',
    code: 'WO202501140003',
    wo_type: 'production',
    material_code: '04.01.002-00001',
    material_name: '离心泵 XJP-200',
    material_spec: '流量200m³/h',
    planned_qty: 30,
    completed_qty: 30,
    progress: 100,
    status: 'completed',
    priority: 'normal',
    workshop_name: '机加工一车间',
    current_operation: '全部完工',
    planned_start_date: '2025-01-05',
    planned_end_date: '2025-01-14'
  },
  {
    id: '4',
    code: 'WO202501150004',
    wo_type: 'rework',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    material_spec: '流量100m³/h',
    planned_qty: 5,
    completed_qty: 0,
    progress: 0,
    status: 'draft',
    priority: 'urgent',
    workshop_name: '机加工一车间',
    current_operation: '-',
    planned_start_date: '2025-01-16',
    planned_end_date: '2025-01-18'
  },
  {
    id: '5',
    code: 'WO202501150005',
    wo_type: 'production',
    material_code: '03.01.001-00001',
    material_name: '传动轴 DS-50',
    material_spec: 'φ50×500',
    planned_qty: 200,
    completed_qty: 120,
    progress: 60,
    status: 'in_progress',
    priority: 'normal',
    workshop_name: '机加工二车间',
    current_operation: '工序20:车削',
    planned_start_date: '2025-01-12',
    planned_end_date: '2025-01-22'
  },
  {
    id: '6',
    code: 'WO202501130006',
    wo_type: 'production',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    material_spec: '流量100m³/h',
    planned_qty: 80,
    completed_qty: 80,
    progress: 100,
    status: 'closed',
    priority: 'normal',
    workshop_name: '机加工一车间',
    current_operation: '-',
    planned_start_date: '2025-01-02',
    planned_end_date: '2025-01-12'
  },
  {
    id: '7',
    code: 'WO202501150007',
    wo_type: 'sample',
    material_code: '04.03.001-00001',
    material_name: '新型泵 NP-001',
    material_spec: '试制',
    planned_qty: 3,
    completed_qty: 1,
    progress: 33,
    status: 'in_progress',
    priority: 'low',
    workshop_name: '装配车间',
    current_operation: '工序40:测试',
    planned_start_date: '2025-01-14',
    planned_end_date: '2025-01-25'
  },
  {
    id: '8',
    code: 'WO202501150008',
    wo_type: 'production',
    material_code: '04.01.003-00001',
    material_name: '阀门组件 VL-300',
    material_spec: 'DN300',
    planned_qty: 60,
    completed_qty: 0,
    progress: 0,
    status: 'approved',
    priority: 'normal',
    workshop_name: '机加工二车间',
    current_operation: '-',
    planned_start_date: '2025-01-18',
    planned_end_date: '2025-01-30'
  }
])

// ==================== 搜索 ====================
const searchForm = reactive({ code: '', status: '', priority: '', workshop: '', date_range: [] as string[] })
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

const columns: TableColumnItem<WorkOrder>[] = [
  { prop: 'code', label: '工单编号', width: 160 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'planned_qty', label: '计划数量', width: 100, align: 'center' },
  { label: '进度', width: 140, slotName: 'progress' },
  { prop: 'current_operation', label: '当前工序', width: 140 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '优先级', width: 70, slotName: 'priority', align: 'center' },
  { prop: 'workshop_name', label: '车间', width: 130 },
  { label: '计划完工', width: 110, slotName: 'planned_end_date' },
  { label: '操作', width: 280, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    if (searchForm.code && !o.code.includes(searchForm.code)) return false
    if (searchForm.status && o.status !== searchForm.status) return false
    if (searchForm.priority && o.priority !== searchForm.priority) return false
    return true
  })
})

const pagedOrders = computed(() => {
  pagination.total = filteredOrders.value.length
  const s = (pagination.currentPage - 1) * pagination.pageSize
  return filteredOrders.value.slice(s, s + pagination.pageSize)
})

function handleSearch() {
  pagination.currentPage = 1
}
function handleReset() {
  Object.assign(searchForm, { code: '', status: '', priority: '', date_range: [] })
  pagination.currentPage = 1
}
function refresh() {
  handleReset()
}

function isOverdue(row: WorkOrder) {
  if (row.status === 'completed' || row.status === 'closed') return false
  return new Date(row.planned_end_date) < new Date()
}

function submitApproval(row: WorkOrder) {
  row.status = 'approved'
  ElMessage.success(`工单 ${row.code} 已提交审批`)
}

function releaseOrder(row: WorkOrder) {
  row.status = 'released'
  ElMessage.success(`工单 ${row.code} 已下发到车间`)
}

function closeOrder(row: WorkOrder) {
  ElMessageBox.confirm('确认关闭该工单？', '确认', { type: 'warning' })
    .then(() => {
      row.status = 'closed'
      ElMessage.success('工单已关闭')
    })
    .catch(() => {})
}

function deleteOrder(id: string) {
  ElMessageBox.confirm('确定删除该工单？', '警告', { type: 'warning' })
    .then(() => {
      orders.value = orders.value.filter((o) => o.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style scoped>
.progress-cell {
  min-width: 120px;
}
</style>

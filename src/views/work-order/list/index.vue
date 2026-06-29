<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="list-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          :columns="visibleSearchColumns"
          ref="searchFormRef"
          v-model="searchForm"
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

    <gi-table :columns="columns" :data="pagedOrders" :pagination="pagination" border stripe style="height: 100%">
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
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { getWorkOrderList, approveWorkOrder, releaseWorkOrder, closeWorkOrder } from '@/api/work-order'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { WORK_ORDER_STATUS, WORK_ORDER_PRIORITY } from '@/common/status-maps'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

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

// ==================== 数据加载 ====================
const orders = ref<WorkOrder[]>([])
const total = ref(0)
const loading = ref(false)

async function fetchOrders() {
  loading.value = true
  try {
    const params: any = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }
    if (searchForm.code) params.code = searchForm.code
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.priority) params.priority = searchForm.priority
    if (searchForm.date_range && searchForm.date_range.length === 2) {
      const start = searchForm.date_range[0]
      const end = searchForm.date_range[1]
      if (start) params.start_date = start
      if (end) params.end_date = end
    }

    const res = await getWorkOrderList(params)
    orders.value = res.data.items as WorkOrder[]
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

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

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => searchColumns)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const searchFormRef = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<WorkOrder>[] = [
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

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

// 分页使用 API 服务端分页，数据直接绑定
const pagedOrders = computed(() => orders.value)

// 同步 pagination.total
watch(total, (val) => {
  pagination.total = val
})

// 监听分页变化重新请求
watch(
  () => pagination.currentPage,
  () => fetchOrders()
)
watch(
  () => pagination.pageSize,
  () => {
    pagination.currentPage = 1
    fetchOrders()
  }
)

function handleSearch() {
  pagination.currentPage = 1
  fetchOrders()
}
function handleReset() {
  Object.assign(searchForm, { code: '', status: '', priority: '', date_range: [] })
  pagination.currentPage = 1
  fetchOrders()
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      orders.value = orders.value.filter((e: any) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ name: '' })
const formCols: FormColumnItem[] = [{ type: 'input', label: '名称', field: 'name', required: true }]
function openAdd() {
  mode.value = 'add'
  eid.value = ''
  vis.value = true
}
function openEdit(r: any) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    orders.value.unshift({ id: Date.now().toString(), ...form } as any)
  } else {
    const i = orders.value.findIndex((e: any) => e.id === eid.value)
    if (i > -1) Object.assign(orders.value[i], form)
  }
  return true
}
function refresh() {
  handleReset()
}

function isOverdue(row: WorkOrder) {
  if (row.status === 'completed' || row.status === 'closed') return false
  return new Date(row.planned_end_date) < new Date()
}

async function submitApproval(row: WorkOrder) {
  const res = await approveWorkOrder(row.id, true)
  ElMessage.success(res.message || `工单 ${row.code} 已提交审批`)
  fetchOrders()
}

async function releaseOrder(row: WorkOrder) {
  const res = await releaseWorkOrder(row.id)
  ElMessage.success(res.message || `工单 ${row.code} 已下发到车间`)
  fetchOrders()
}

async function closeOrder(row: WorkOrder) {
  ElMessageBox.confirm('确认关闭该工单？', '确认', { type: 'warning' })
    .then(async () => {
      const res = await closeWorkOrder(row.id, { close_type: 'normal' })
      ElMessage.success(res.message || '工单已关闭')
      fetchOrders()
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

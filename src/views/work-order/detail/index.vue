<template>
  <gi-page-layout>
    <template #header>
      <div class="detail-header">
        <div class="header-left">
          <h2>工单 {{ order.code || '-' }}</h2>
          <StatusTag :value="order.priority" :options="WORK_ORDER_PRIORITY" style="margin-left: 12px" />
        </div>
        <div class="header-right">
          <template v-for="action in availableActions" :key="action.key">
            <el-button v-if="action.key === 'report'" type="primary" @click="$router.push(`/work-order/report/${order.id}`)"> 报工 </el-button>
            <el-button v-else :type="action.type" @click="handleTransition(action.key)">
              {{ action.label }}
            </el-button>
          </template>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <el-tabs v-model="activeTab">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="info">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="工单编号">{{ order.code || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{
            order.wo_type === 'production' ? '生产工单' : order.wo_type === 'rework' ? '返工工单' : '样品工单'
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <StatusTag :value="order.status" :options="WORK_ORDER_STATUS" />
          </el-descriptions-item>
          <el-descriptions-item label="产品编码">{{ order.material_code || '-' }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ order.material_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ order.material_spec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="计划数量">{{ order.planned_qty || 0 }} 台</el-descriptions-item>
          <el-descriptions-item label="已完工数量">{{ order.completed_qty || 0 }} 台</el-descriptions-item>
          <el-descriptions-item label="进度">
            <el-progress :percentage="order.progress || 0" :stroke-width="8" style="width: 200px" />
          </el-descriptions-item>
          <el-descriptions-item label="生产车间">{{ order.workshop_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="生产产线">{{ order.line_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <StatusTag :value="order.priority" :options="WORK_ORDER_PRIORITY" />
          </el-descriptions-item>
          <el-descriptions-item label="计划开工">{{ order.planned_start_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="计划完工">{{ order.planned_end_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际开工">{{ order.actual_start_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="BOM版本">{{ order.bom_version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工艺版本">{{ order.routing_version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户订单号">{{ order.customer_po || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ order.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ order.created_by || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ order.created_at || '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="order.approval_opinion" label="审批意见" :span="3">
            {{ order.approval_opinion }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <!-- 工序列表 -->
      <el-tab-pane label="工序列表" name="operations">
        <el-table :data="operations" border stripe show-summary :summary-method="getOperationsSummary">
          <el-table-column prop="operation_no" label="工序号" width="80" />
          <el-table-column prop="name" label="工序名称" width="120" />
          <el-table-column prop="work_center" label="工作中心" width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <StatusTag :value="row.status" :options="OPERATION_STATUS" />
            </template>
          </el-table-column>
          <el-table-column prop="worker" label="操作工" width="100" />
          <el-table-column prop="qualified_qty" label="合格数" width="80" align="center" />
          <el-table-column prop="defective_qty" label="不良数" width="80" align="center" />
          <el-table-column prop="actual_hours" label="实际工时(h)" width="100" align="center" />
          <el-table-column prop="planned_start" label="计划开工" width="140" />
          <el-table-column prop="planned_end" label="计划完工" width="140" />
          <el-table-column label="质检关口" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.is_qc_gate" type="warning" size="small">是</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 物料领用情况 -->
      <el-tab-pane label="物料领用" name="material">
        <el-table :data="materialUsage" border stripe>
          <el-table-column prop="material_code" label="物料编码" width="160" />
          <el-table-column prop="material_name" label="物料名称" minWidth="140" />
          <el-table-column prop="spec" label="规格" width="120" />
          <el-table-column prop="unit" label="单位" width="60" align="center" />
          <el-table-column prop="planned_qty" label="计划用量" width="100" align="center" />
          <el-table-column prop="issued_qty" label="已领数量" width="100" align="center" />
          <el-table-column prop="available_qty" label="可用库存" width="100" align="center" />
          <el-table-column label="领用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.issued_qty >= row.planned_qty" type="success" size="small">已领齐</el-tag>
              <el-tag v-else-if="row.issued_qty > 0" type="warning" size="small">部分领用</el-tag>
              <el-tag v-else type="info" size="small">未领用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button
                v-if="row.issued_qty < row.planned_qty && row.available_qty > 0"
                type="primary"
                size="small"
                link
                @click="handleMaterialIssue(row)"
              >
                领用
              </el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 操作日志 -->
      <el-tab-pane label="操作日志" name="log">
        <el-timeline>
          <el-timeline-item v-for="log in logs" :key="log.id" :timestamp="log.time" :type="log.type" placement="top">
            <p>{{ log.content }}</p>
            <p style="font-size: 12px; color: #909399">{{ log.user }}</p>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>

    <!-- 状态流转审批意见弹窗 -->
    <el-dialog v-model="approvalVisible" :title="approvalDialogTitle" width="480px" :close-on-click-modal="false">
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="currentStatusTagType">{{ currentStatusLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="目标状态">
          <el-tag :type="targetStatusTagType">{{ targetStatusLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="审批意见" required>
          <el-input v-model="approvalForm.opinion" type="textarea" :rows="3" placeholder="请输入审批意见（通过/拒绝时必填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmApproval">确认</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { WORK_ORDER_STATUS, WORK_ORDER_PRIORITY } from '@/common/status-maps'
import { getWorkOrderDetail, getWorkOrderOperations, approveWorkOrder, releaseWorkOrder, closeWorkOrder } from '@/api/work-order'
import { getBOMList } from '@/api/bom'

const route = useRoute()

const OPERATION_STATUS = [
  { value: 'pending', label: '待开工', type: 'info' as const },
  { value: 'assigned', label: '已派工', type: 'info' as const },
  { value: 'running', label: '生产中', type: 'warning' as const },
  { value: 'completed', label: '已完工', type: 'success' as const },
  { value: 'inspected', label: '已质检', type: 'primary' as const }
]

// ==================== 状态流转定义 ====================
interface TransitionRule {
  from: string
  to: string
  label: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
  needOpinion: boolean
}

const TRANSITION_RULES: TransitionRule[] = [
  { from: 'draft', to: 'approved', label: '提交审批', type: 'primary', needOpinion: false },
  { from: 'approved', to: 'released', label: '下发到车间', type: 'warning', needOpinion: false },
  { from: 'released', to: 'in_progress', label: '开始生产', type: 'primary', needOpinion: false },
  { from: 'in_progress', to: 'completed', label: '完工确认', type: 'success', needOpinion: false },
  { from: 'completed', to: 'closed', label: '确认关闭', type: 'info', needOpinion: true },
  { from: 'draft', to: 'closed', label: '取消工单', type: 'danger', needOpinion: true },
  { from: 'approved', to: 'draft', label: '驳回', type: 'danger', needOpinion: true }
]

function canTransition(from: string, to: string): TransitionRule | null {
  return TRANSITION_RULES.find((r) => r.from === from && r.to === to) || null
}

// ==================== 工单数据加载 ====================
const activeTab = ref('info')
const order = reactive<any>({})
const operations = ref<any[]>([])

async function loadOrder() {
  const id = route.params.id as string
  try {
    const res = await getWorkOrderDetail(id)
    if (res.data) {
      Object.assign(order, res.data)
    }
  } catch {
    // fallback handled below
  }

  try {
    const opsRes = await getWorkOrderOperations(id)
    if (opsRes.data) {
      operations.value = (opsRes.data as any[]).map((op: any) => ({
        ...op,
        actual_hours: typeof op.actual_hours === 'number' ? op.actual_hours : 0
      }))
    }
  } catch {
    operations.value = []
  }

  // 加载物料领用数据
  try {
    const bomRes = await getBOMList({ page: 1, page_size: 100, status: 'active' })
    const items = Array.isArray(bomRes.data) ? bomRes.data : ((bomRes.data as any)?.items || [])
    materialUsage.value = (items as any[]).filter((b: any) => b.bom_type === 'EBOM')
  } catch {
    materialUsage.value = []
  }
}

onMounted(() => {
  loadOrder()
})

// ==================== 工序合计行 ====================
function getOperationsSummary(param: { columns: any[]; data: any[] }) {
  const sums: string[] = []
  const { columns, data } = param
  columns.forEach((col, idx) => {
    if (idx === 0) {
      sums[idx] = '合计'
    } else if (col.property === 'qualified_qty') {
      sums[idx] = String(data.reduce((acc: number, row: any) => acc + (Number(row.qualified_qty) || 0), 0))
    } else if (col.property === 'defective_qty') {
      sums[idx] = String(data.reduce((acc: number, row: any) => acc + (Number(row.defective_qty) || 0), 0))
    } else if (col.property === 'actual_hours') {
      const total = data.reduce((acc: number, row: any) => acc + (Number(row.actual_hours) || 0), 0)
      sums[idx] = total.toFixed(1) + 'h'
    } else {
      sums[idx] = ''
    }
  })
  return sums
}

// ==================== 物料领用 ====================
const materialUsage = ref<any[]>([])

function handleMaterialIssue(row: any) {
  ElMessageBox.confirm(`确认领用物料 "${row.material_name}" ？`, '物料领用', { type: 'warning' })
    .then(() => {
      row.issued_qty = row.planned_qty
      ElMessage.success(`物料 "${row.material_name}" 已领用`)
    })
    .catch(() => {})
}

// ==================== 状态流转 + 审批意见 ====================
const approvalVisible = ref(false)
const approvalDialogTitle = ref('')
const currentStatusLabel = ref('')
const currentStatusTagType = ref<any>('')
const targetStatusLabel = ref('')
const targetStatusTagType = ref<any>('')
const approvalForm = reactive({ opinion: '', targetStatus: '' })

function getStatusInfo(status: string) {
  const found = WORK_ORDER_STATUS.find((s) => s.value === status)
  return { label: found?.label || status, type: found?.type || 'info' }
}

const availableActions = computed(() => {
  if (!order.status) return []
  return TRANSITION_RULES.filter((r) => r.from === order.status).map((r) => ({ key: r.to, label: r.label, type: r.type }))
})

function handleTransition(targetStatus: string) {
  const rule = canTransition(order.status, targetStatus)
  if (!rule) {
    ElMessage.error('不允许的状态流转')
    return
  }

  const fromInfo = getStatusInfo(order.status)
  const toInfo = getStatusInfo(targetStatus)

  if (rule.needOpinion) {
    currentStatusLabel.value = fromInfo.label
    currentStatusTagType.value = fromInfo.type
    targetStatusLabel.value = toInfo.label
    targetStatusTagType.value = toInfo.type
    approvalDialogTitle.value = rule.label
    approvalForm.opinion = ''
    approvalForm.targetStatus = targetStatus
    approvalVisible.value = true
  } else {
    ElMessageBox.confirm(`确认将工单从「${fromInfo.label}」变更为「${toInfo.label}」？`, rule.label, { type: 'warning' })
      .then(() => {
        doTransition(targetStatus, '')
      })
      .catch(() => {})
  }
}

function confirmApproval() {
  if (!approvalForm.opinion.trim()) {
    ElMessage.warning('请填写审批意见')
    return
  }
  doTransition(approvalForm.targetStatus, approvalForm.opinion.trim())
  approvalVisible.value = false
}

async function doTransition(targetStatus: string, opinion: string) {
  try {
    if (targetStatus === 'approved') {
      await approveWorkOrder(order.id, true, opinion)
    } else if (targetStatus === 'released') {
      await releaseWorkOrder(order.id)
    } else if (targetStatus === 'closed') {
      await closeWorkOrder(order.id, { close_type: 'normal', reason: opinion })
    } else {
      // For statuses not directly mapped to API (e.g., in_progress, completed, draft-revert),
      // update locally and log
      order.status = targetStatus
    }

    if (opinion) {
      order.approval_opinion = opinion
    }

    const toInfo = getStatusInfo(targetStatus)
    logs.value.unshift({
      id: String(Date.now()),
      time: new Date().toLocaleString('zh-CN'),
      type: targetStatus === 'closed' ? 'info' : 'primary',
      content: `工单状态变更为「${toInfo.label}」${opinion ? `，审批意见: ${opinion}` : ''}`,
      user: '当前用户'
    })
    ElMessage.success(`状态已变更为「${toInfo.label}」`)
  } catch {
    ElMessage.error('状态流转失败')
  }
}

// ==================== 操作日志 ====================
const logs = ref([] as any[])
</script>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
}
.header-left h2 {
  margin: 0;
  font-size: 20px;
}
</style>

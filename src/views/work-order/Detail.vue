<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <div class="detail-header">
        <div class="header-left">
          <h2>工单 {{ order.code }}</h2>
          <el-tag v-if="order.priority === 'urgent'" type="danger" style="margin-left: 12px">紧急</el-tag>
          <el-tag v-else-if="order.priority === 'high'" type="warning" style="margin-left: 12px">高</el-tag>
        </div>
        <div class="header-right">
          <el-button v-if="order.status === 'draft'" type="primary" @click="submitApproval">提交审批</el-button>
          <el-button v-if="order.status === 'approved'" type="warning" @click="releaseOrder">下发到车间</el-button>
          <el-button v-if="order.status === 'completed'" type="success" @click="closeOrder">确认关闭</el-button>
          <el-button v-if="order.status === 'in_progress'" type="primary" @click="$router.push(`/work-order/report/${order.id}`)">报工</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <el-tabs v-model="activeTab">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="info">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="工单编号">{{ order.code }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{ order.wo_type === 'production' ? '生产工单' : order.wo_type === 'rework' ? '返工工单' : '样品工单' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(order.status)">{{ statusText(order.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品编码">{{ order.material_code }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ order.material_name }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ order.material_spec }}</el-descriptions-item>
          <el-descriptions-item label="计划数量">{{ order.planned_qty }} 台</el-descriptions-item>
          <el-descriptions-item label="已完工数量">{{ order.completed_qty }} 台</el-descriptions-item>
          <el-descriptions-item label="进度">
            <el-progress :percentage="order.progress" :stroke-width="8" style="width: 200px" />
          </el-descriptions-item>
          <el-descriptions-item label="生产车间">{{ order.workshop_name }}</el-descriptions-item>
          <el-descriptions-item label="生产产线">{{ order.line_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ order.priority === 'urgent' ? '紧急' : order.priority === 'high' ? '高' : order.priority === 'normal' ? '普通' : '低' }}</el-descriptions-item>
          <el-descriptions-item label="计划开工">{{ order.planned_start_date }}</el-descriptions-item>
          <el-descriptions-item label="计划完工">{{ order.planned_end_date }}</el-descriptions-item>
          <el-descriptions-item label="实际开工">{{ order.actual_start_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="BOM版本">{{ order.bom_version || 'MBOM V1.2' }}</el-descriptions-item>
          <el-descriptions-item label="工艺版本">{{ order.routing_version || '标准工艺 V1.1' }}</el-descriptions-item>
          <el-descriptions-item label="客户订单号">{{ order.customer_po || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ order.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ order.created_by || '张三' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ order.created_at || '2025-01-15 09:00:00' }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <!-- 工序列表 -->
      <el-tab-pane label="工序列表" name="operations">
        <el-table :data="operations" border stripe>
          <el-table-column prop="operation_no" label="工序号" width="80" />
          <el-table-column prop="name" label="工序名称" width="120" />
          <el-table-column prop="work_center" label="工作中心" width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'pending'" type="info" size="small">待开工</el-tag>
              <el-tag v-else-if="row.status === 'assigned'" size="small">已派工</el-tag>
              <el-tag v-else-if="row.status === 'running'" type="warning" size="small">生产中</el-tag>
              <el-tag v-else-if="row.status === 'completed'" type="success" size="small">已完工</el-tag>
              <el-tag v-else-if="row.status === 'inspected'" type="primary" size="small">已质检</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="worker" label="操作工" width="100" />
          <el-table-column prop="qualified_qty" label="合格数" width="80" align="center" />
          <el-table-column prop="defective_qty" label="不良数" width="80" align="center" />
          <el-table-column prop="actual_hours" label="实际工时" width="100" align="center" />
          <el-table-column prop="planned_start" label="计划开工" width="140" />
          <el-table-column prop="planned_end" label="计划完工" width="140" />
          <el-table-column label="质检关口" width="80" align="center">
            <template #default="{ row }"><el-tag v-if="row.is_qc_gate" type="warning" size="small">是</el-tag><span v-else>-</span></template>
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
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('info')

const order = reactive({
  id: '1', code: 'WO202501150001', wo_type: 'production', material_code: '04.01.001-00001',
  material_name: '离心泵 XJP-100', material_spec: '流量100m³/h', planned_qty: 100, completed_qty: 45,
  progress: 45, status: 'in_progress', priority: 'normal', workshop_name: '机加工一车间',
  line_name: '产线A', planned_start_date: '2025-01-10', planned_end_date: '2025-01-20',
  actual_start_date: '2025-01-11', bom_version: 'MBOM V1.2', routing_version: '标准工艺 V1.1',
  customer_po: 'PO-2025-001', remark: '', created_by: '张三', created_at: '2025-01-09 14:00:00'
})

const operations = [
  { operation_no: 10, name: '下料', work_center: '下料组', status: 'completed', worker: '李四', qualified_qty: 100, defective_qty: 2, actual_hours: '8.5h', planned_start: '2025-01-11 08:00', planned_end: '2025-01-11 17:00', is_qc_gate: false },
  { operation_no: 20, name: '粗车', work_center: '数控车组', status: 'completed', worker: '王五', qualified_qty: 98, defective_qty: 1, actual_hours: '16h', planned_start: '2025-01-12 08:00', planned_end: '2025-01-14 12:00', is_qc_gate: false },
  { operation_no: 30, name: '精车', work_center: '数控车组', status: 'running', worker: '赵六', qualified_qty: 45, defective_qty: 3, actual_hours: '12h', planned_start: '2025-01-14 13:00', planned_end: '2025-01-16 17:00', is_qc_gate: true },
  { operation_no: 40, name: '钻孔', work_center: '钻床组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: '-', planned_start: '2025-01-17 08:00', planned_end: '2025-01-17 17:00', is_qc_gate: false },
  { operation_no: 50, name: '磨削', work_center: '磨床组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: '-', planned_start: '2025-01-18 08:00', planned_end: '2025-01-19 12:00', is_qc_gate: true },
  { operation_no: 60, name: '装配', work_center: '装配组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: '-', planned_start: '2025-01-19 13:00', planned_end: '2025-01-20 12:00', is_qc_gate: false },
  { operation_no: 70, name: '试压', work_center: '测试组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: '-', planned_start: '2025-01-20 13:00', planned_end: '2025-01-20 17:00', is_qc_gate: true },
  { operation_no: 80, name: '油漆', work_center: '涂装组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: '-', planned_start: '2025-01-21 08:00', planned_end: '2025-01-21 12:00', is_qc_gate: false }
]

const logs = [
  { id: '1', time: '2025-01-15 10:30', type: 'primary', content: '赵六开始工序30:精车', user: '系统' },
  { id: '2', time: '2025-01-14 17:00', type: 'success', content: '王五完成工序20:粗车，合格98件，不良1件', user: '王五' },
  { id: '3', time: '2025-01-12 08:00', type: 'primary', content: '王五开始工序20:粗车', user: '系统' },
  { id: '4', time: '2025-01-11 17:00', type: 'success', content: '李四完成工序10:下料，合格100件，不良2件', user: '李四' },
  { id: '5', time: '2025-01-10 14:00', type: 'warning', content: '车间主任审批通过，工单已下发', user: '车间主任-陈七' },
  { id: '6', time: '2025-01-09 14:00', type: 'info', content: '张三创建工单', user: '张三' }
]

function statusTagType(s: string) {
  const map: Record<string, string> = { draft: 'info', approved: '', released: 'warning', in_progress: 'primary', completed: 'success', closed: 'info' }
  return map[s] || 'info'
}

function statusText(s: string) {
  const map: Record<string, string> = { draft: '草稿', approved: '已审批', released: '已下发', in_progress: '生产中', completed: '已完工', closed: '已关闭' }
  return map[s] || s
}

function submitApproval() { order.status = 'approved'; ElMessage.success('已提交审批') }
function releaseOrder() { order.status = 'released'; ElMessage.success('已下发到车间') }
function closeOrder() {
  ElMessageBox.confirm('确认关闭该工单？', '确认', { type: 'warning' }).then(() => {
    order.status = 'closed'; ElMessage.success('工单已关闭')
  }).catch(() => {})
}
</script>

<style scoped>
.detail-header { display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; align-items: center; }
.header-left h2 { margin: 0; font-size: 20px; }
</style>

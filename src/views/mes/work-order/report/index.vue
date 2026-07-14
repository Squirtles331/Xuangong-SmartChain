<template>
  <gi-page-layout>
    <div class="report-container">
      <div class="report-header">
        <div>
          <h2>工序报工</h2>
          <p class="report-subtitle">围绕报工记录对象完成数量提交、状态确认与缺陷原因归集。</p>
        </div>
        <div class="report-tags">
          <el-tag size="large" type="warning">当前工序：{{ operationStatusText }}</el-tag>
          <el-tag size="large" :type="reportStatusMeta.type">最新记录：{{ reportStatusMeta.label }}</el-tag>
        </div>
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        class="phase-alert"
        title="静态阶段口径：提交报工后记录进入“已提交”，在下方历史记录中点击“确认入账”后进入“已确认”；本阶段不联动 WMS、QMS、成本接口。"
      />

      <el-descriptions :column="2" border class="summary-block">
        <el-descriptions-item label="工单编号">{{ report.wo_code || '-' }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ report.material_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="工序">
          {{ report.operation_no ? `${report.operation_no} - ${report.operation_name}` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="工作中心">{{ report.work_center || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开工时间">{{ report.start_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="已用时长">{{ elapsedDisplay }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ report.planned_qty }} 件</el-descriptions-item>
        <el-descriptions-item label="已报工数量">{{ report.reported_qty }} 件</el-descriptions-item>
        <el-descriptions-item label="剩余可报">{{ maxReportQty }} 件</el-descriptions-item>
        <el-descriptions-item label="完成进度">
          <el-progress :percentage="completionProgress" :stroke-width="8" :color="progressColor" style="width: 220px" />
        </el-descriptions-item>
      </el-descriptions>

      <el-card header="本次报工" shadow="never">
        <el-form :model="form" label-width="120px" style="max-width: 640px">
          <el-form-item label="合格数量" required>
            <el-input-number v-model="form.qualified_qty" :min="0" :max="maxReportQty" style="width: 220px" />
            <span class="field-tip">本次提交上限为 {{ maxReportQty }} 件</span>
          </el-form-item>

          <el-form-item label="不良数量" required>
            <el-input-number v-model="form.defective_qty" :min="0" :max="maxReportQty" style="width: 220px" />
          </el-form-item>

          <el-form-item v-if="form.defective_qty > 0" label="不良原因" required>
            <el-checkbox-group v-model="form.defect_reasons">
              <el-checkbox label="尺寸超差" value="尺寸超差" />
              <el-checkbox label="外观缺陷" value="外观缺陷" />
              <el-checkbox label="材质问题" value="材质问题" />
              <el-checkbox label="设备精度异常" value="设备精度异常" />
              <el-checkbox label="操作失误" value="操作失误" />
              <el-checkbox label="其他" value="其他" />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="实际工时(分钟)">
            <el-input-number v-model="form.actual_hours" :min="1" style="width: 220px" />
            <span class="field-tip">当前自动计时：{{ elapsedDisplay }}</span>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="2" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" :disabled="submitDisabled" @click="submitReport">提交报工</el-button>
            <el-button size="large" @click="resetForm">重置</el-button>
            <el-button size="large" @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card header="报工记录" shadow="never" style="margin-top: 16px">
        <TableSetting title="报工历史" :columns="historyColumns" @refresh="refresh">
          <template #default="{ settingColumns, tableProps }">
            <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border size="small">
              <template #status="{ row }">
                <el-tag size="small" :type="getReportStatusMeta(row.status).type">
                  {{ getReportStatusMeta(row.status).label }}
                </el-tag>
              </template>
              <template #defect_reasons="{ row }">
                <span>{{ row.defect_reasons || '-' }}</span>
              </template>
              <template #actions="{ row }">
                <el-button v-if="row.status === 'submitted'" type="primary" link size="small" @click="confirmRecord(row)">确认入账</el-button>
                <span v-else>-</span>
              </template>
            </gi-table>
          </template>
        </TableSetting>
      </el-card>

      <el-card header="不良原因 Pareto 分析" shadow="never" style="margin-top: 16px">
        <div ref="paretoChartRef" style="width: 100%; height: 400px"></div>
      </el-card>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import type { TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'
import TableSetting from '@/components/TableSetting.vue'
import {
  getReportHistory,
  getWorkOrderDetail,
  getWorkOrderOperations,
  reportOperation,
  type ReportHistoryQuery,
  type ReportRecord
} from '@/api/work-order'
import { useTable } from '@/hooks/useTable'

type ReportStatus = 'draft' | 'submitted' | 'confirmed' | 'rejected'
type ReportTableRow = ReportRecord & { status?: ReportStatus }

const route = useRoute()
const router = useRouter()

const report = reactive({
  workOrderId: '',
  operationId: '',
  wo_code: '',
  material_name: '',
  operation_no: 0,
  operation_name: '',
  work_center: '',
  start_time: '',
  planned_qty: 0,
  reported_qty: 0,
  status: 'in_progress'
})

const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const form = reactive({
  qualified_qty: 0,
  defective_qty: 0,
  defect_reasons: [] as string[],
  actual_hours: 1,
  remark: ''
})

const operationStatusText = computed(() => {
  const map: Record<string, string> = {
    pending: '待开工',
    assigned: '已派工',
    running: '生产中',
    completed: '已完工',
    in_progress: '生产中'
  }
  return map[report.status] || '生产中'
})

const reportStatusMeta = computed(() => {
  const latest = (tableData.value?.[0]?.status || 'draft') as ReportStatus
  return getReportStatusMeta(latest)
})

const elapsedDisplay = computed(() => {
  const h = Math.floor(elapsed.value / 60)
  const m = elapsed.value % 60
  return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`
})

const maxReportQty = computed(() => Math.max(report.planned_qty - report.reported_qty, 0))
const completionProgress = computed(() => (report.planned_qty === 0 ? 0 : Math.round((report.reported_qty / report.planned_qty) * 100)))
const submitDisabled = computed(() => !report.operationId || form.qualified_qty + form.defective_qty === 0)
const progressColor = computed(() => {
  if (completionProgress.value >= 100) return '#67c23a'
  if (completionProgress.value >= 60) return '#409eff'
  return '#e6a23c'
})

watch(elapsed, (value) => {
  form.actual_hours = Math.max(value, 1)
})

const historyColumns: TableColumnItem<ReportTableRow>[] = [
  { prop: 'time', label: '报工时间', width: 160 },
  { prop: 'status', label: '记录状态', width: 110, align: 'center', slotName: 'status' },
  { prop: 'qualified_qty', label: '合格数', width: 90, align: 'center' },
  { prop: 'defective_qty', label: '不良数', width: 90, align: 'center' },
  { prop: 'defect_reasons', label: '不良原因', minWidth: 180, slotName: 'defect_reasons' },
  { prop: 'actual_hours', label: '工时(分钟)', width: 110, align: 'center' },
  { prop: 'worker', label: '操作人', width: 100 },
  { prop: 'actions', label: '操作', width: 100, align: 'center', slotName: 'actions', fixed: 'right' }
]

const { tableData, pagination, loading, refresh } = useTable<ReportTableRow>({
  rowKey: 'time',
  listAPI: async ({ page, size }) => {
    const params: ReportHistoryQuery = {
      pageNum: page,
      pageSize: size,
      workOrderCode: report.wo_code || undefined
    }
    const response = await getReportHistory(params)
    return response.data
  }
})

onMounted(async () => {
  await loadReportData()
  timer = setInterval(() => {
    elapsed.value += 1
  }, 60000)
  await refresh()
  nextTick(() => initParetoChart())
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', handleParetoResize)
  paretoChart?.dispose()
})

async function loadReportData() {
  const workOrderId = route.params.id as string
  report.workOrderId = workOrderId

  try {
    const [detailResponse, operationsResponse] = await Promise.all([getWorkOrderDetail(workOrderId), getWorkOrderOperations(workOrderId)])
    const detail = detailResponse.data as any
    const operations = (operationsResponse.data || []) as any[]
    const currentOperation =
      operations.find((item) => item.status === 'running') || operations.find((item) => item.status === 'assigned') || operations[0]

    Object.assign(report, {
      wo_code: detail?.code || '',
      material_name: detail?.material_name || '',
      planned_qty: detail?.planned_qty || 0,
      reported_qty: detail?.completed_qty || 0,
      operationId: currentOperation?.id || '',
      operation_no: currentOperation?.operation_no || 0,
      operation_name: currentOperation?.name || '',
      work_center: currentOperation?.work_center || currentOperation?.work_center_name || '',
      start_time: currentOperation?.actual_start_time || currentOperation?.planned_start || currentOperation?.planned_start_time || '',
      status: currentOperation?.status || detail?.status || 'in_progress'
    })

    const startTime = report.start_time ? new Date(report.start_time.replace(/-/g, '/')).getTime() : Date.now()
    const diffMinutes = Math.max(Math.floor((Date.now() - startTime) / 60000), 1)
    elapsed.value = Number.isFinite(diffMinutes) ? diffMinutes : 1
    form.qualified_qty = maxReportQty.value
    form.actual_hours = elapsed.value
  } catch {
    ElMessage.error('报工数据加载失败')
  }
}

async function submitReport() {
  if (!report.operationId) {
    ElMessage.warning('未找到可报工工序')
    return
  }
  if (form.qualified_qty + form.defective_qty === 0) {
    ElMessage.warning('请填写报工数量')
    return
  }
  if (form.qualified_qty + form.defective_qty > maxReportQty.value) {
    ElMessage.warning('报工总数不能超过剩余数量')
    return
  }
  if (form.defective_qty > 0 && form.defect_reasons.length === 0) {
    ElMessage.warning('请选择不良原因')
    return
  }

  ElMessageBox.confirm(`确认提交报工：合格 ${form.qualified_qty} 件，不良 ${form.defective_qty} 件？提交后记录将进入“已提交”状态。`, '确认报工', {
    type: 'warning'
  })
    .then(async () => {
      try {
        await reportOperation(report.operationId, {
          qualified_qty: form.qualified_qty,
          defective_qty: form.defective_qty,
          defect_reasons: form.defect_reasons,
          actual_hours: form.actual_hours
        })

        report.reported_qty += form.qualified_qty + form.defective_qty
        await refresh()

        if (report.reported_qty >= report.planned_qty) {
          ElMessage.success('当前工单已全部报工完成，请返回工单列表继续处理。')
          router.push('/mes/work-order/list')
          return
        }

        ElMessage.success(`报工已提交，当前进度 ${completionProgress.value}%，可在下方继续确认入账。`)
        resetForm()
        form.qualified_qty = maxReportQty.value
      } catch {
        ElMessage.error('报工提交失败')
      }
    })
    .catch(() => {})
}

function resetForm() {
  form.qualified_qty = 0
  form.defective_qty = 0
  form.defect_reasons = []
  form.actual_hours = Math.max(elapsed.value, 1)
  form.remark = ''
}

function confirmRecord(row: ReportTableRow) {
  row.status = 'confirmed'
  ElMessage.success('静态演示：该报工记录已确认入账。')
}

function getReportStatusMeta(status?: ReportStatus) {
  const normalized = status || 'draft'
  const map: Record<ReportStatus, { label: string; type: 'info' | 'warning' | 'success' | 'danger' }> = {
    draft: { label: '待提交', type: 'info' },
    submitted: { label: '已提交', type: 'warning' },
    confirmed: { label: '已确认', type: 'success' },
    rejected: { label: '已退回', type: 'danger' }
  }
  return map[normalized]
}

const paretoChartRef = ref<HTMLDivElement>()
let paretoChart: echarts.ECharts | null = null

function handleParetoResize() {
  paretoChart?.resize()
}

function initParetoChart() {
  if (!paretoChartRef.value) return
  paretoChart?.dispose()
  paretoChart = echarts.init(paretoChartRef.value)

  const reasonMap: Record<string, number> = {}
  ;(tableData.value || []).forEach((row) => {
    const reasons = (row.defect_reasons || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    reasons.forEach((reason) => {
      reasonMap[reason] = (reasonMap[reason] || 0) + 1
    })
  })

  const sorted = Object.entries(reasonMap).sort((a, b) => b[1] - a[1])
  const names = sorted.map(([name]) => name)
  const values = sorted.map(([, value]) => value)
  const total = values.reduce((sum, value) => sum + value, 0)
  let cumulative = 0
  const cumulativePercentages = values.map((value) => {
    cumulative += value
    return total > 0 ? Math.round((cumulative / total) * 100) : 0
  })

  window.addEventListener('resize', handleParetoResize)
  paretoChart.setOption({
    title: { text: '不良原因 Pareto 图', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: { left: 60, right: 60, bottom: 40, top: 60 },
    xAxis: { type: 'category', data: names, axisLabel: { rotate: 30 } },
    yAxis: [
      { type: 'value', name: '频次' },
      { type: 'value', name: '累计(%)', max: 100, axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      { name: '频次', type: 'bar', data: values, itemStyle: { color: '#409eff' } },
      {
        name: '累计占比',
        type: 'line',
        yAxisIndex: 1,
        data: cumulativePercentages,
        smooth: true,
        lineStyle: { color: '#f56c6c', width: 2 },
        itemStyle: { color: '#f56c6c' }
      }
    ]
  })
}

watch(tableData, () => {
  nextTick(() => initParetoChart())
})
</script>

<style scoped>
.report-container {
  max-width: 960px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.report-header h2 {
  margin: 0;
}

.report-subtitle {
  margin: 8px 0 0;
  color: #606266;
}

.report-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.phase-alert {
  margin-bottom: 16px;
}

.summary-block {
  margin-bottom: 20px;
}

.field-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
</style>

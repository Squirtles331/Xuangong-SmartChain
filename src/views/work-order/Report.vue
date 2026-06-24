<template>
  <gi-page-layout :bordered="true">
    <div class="report-container">
      <div class="report-header">
        <h2>工序报工</h2>
        <div class="report-info">
          <el-tag type="warning" size="large">生产中</el-tag>
        </div>
      </div>

      <!-- 工单+工序信息 -->
      <el-descriptions :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="工单编号">{{ report.wo_code }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ report.material_name }}</el-descriptions-item>
        <el-descriptions-item label="工序">{{ report.operation_no }}: {{ report.operation_name }}</el-descriptions-item>
        <el-descriptions-item label="工作中心">{{ report.work_center }}</el-descriptions-item>
        <el-descriptions-item label="开工时间">{{ report.start_time }}</el-descriptions-item>
        <el-descriptions-item label="已用时长">{{ elapsedDisplay }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ report.planned_qty }} 台</el-descriptions-item>
        <el-descriptions-item label="已报工数量">{{ report.reported_qty }} 台</el-descriptions-item>
        <el-descriptions-item label="剩余数量">{{ report.planned_qty - report.reported_qty }} 台</el-descriptions-item>
      </el-descriptions>

      <!-- 报工表单 -->
      <el-card header="本次报工" shadow="never">
        <el-form :model="form" label-width="120px" style="max-width: 600px">
          <el-form-item label="合格数量" required>
            <el-input-number v-model="form.qualified_qty" :min="0" :max="maxReportQty" style="width: 200px" />
            <span style="margin-left: 8px; color: #909399; font-size: 12px">最大可报: {{ maxReportQty }} 台</span>
          </el-form-item>
          <el-form-item label="不良数量" required>
            <el-input-number v-model="form.defective_qty" :min="0" :max="maxReportQty" style="width: 200px" />
          </el-form-item>
          <el-form-item v-if="form.defective_qty > 0" label="不良原因" required>
            <el-checkbox-group v-model="form.defect_reasons">
              <el-checkbox label="尺寸超差" value="dimension" />
              <el-checkbox label="外观缺陷" value="appearance" />
              <el-checkbox label="材质问题" value="material" />
              <el-checkbox label="设备精度" value="equipment" />
              <el-checkbox label="操作失误" value="operation" />
              <el-checkbox label="其他" value="other" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="实际工时(分钟)">
            <el-input-number v-model="form.actual_hours" :min="1" style="width: 200px" />
            <span style="margin-left: 8px; color: #909399; font-size: 12px">自动计时: {{ elapsedDisplay }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submitReport" :disabled="form.qualified_qty + form.defective_qty === 0">提交报工</el-button>
            <el-button size="large" @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 报工历史 -->
      <el-card header="报工记录" shadow="never" style="margin-top: 16px">
        <el-table :data="reportHistory" border size="small">
          <el-table-column prop="time" label="时间" width="160" />
          <el-table-column prop="qualified_qty" label="合格数" width="80" align="center" />
          <el-table-column prop="defective_qty" label="不良数" width="80" align="center" />
          <el-table-column prop="defect_reasons" label="不良原因" minWidth="150" />
          <el-table-column prop="actual_hours" label="工时(分)" width="90" align="center" />
          <el-table-column prop="worker" label="操作人" width="100" />
        </el-table>
      </el-card>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const report = reactive({
  wo_code: 'WO202501150001', material_name: '离心泵 XJP-100',
  operation_no: 30, operation_name: '精车', work_center: '数控车组',
  start_time: '2025-01-15 08:00:00', planned_qty: 100, reported_qty: 45
})

// 计时器
const elapsed = ref(65) // 分钟，模拟已过时间
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => elapsed.value++, 60000) })
onUnmounted(() => clearInterval(timer))

const elapsedDisplay = computed(() => {
  const h = Math.floor(elapsed.value / 60)
  const m = elapsed.value % 60
  return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`
})

const maxReportQty = computed(() => report.planned_qty - report.reported_qty)

const form = reactive({
  qualified_qty: 55, defective_qty: 0, defect_reasons: [] as string[],
  actual_hours: elapsed.value, remark: ''
})

const reportHistory = ref([
  { time: '2025-01-15 14:00', qualified_qty: 25, defective_qty: 1, defect_reasons: '尺寸超差', actual_hours: 180, worker: '赵六' },
  { time: '2025-01-15 10:00', qualified_qty: 20, defective_qty: 2, defect_reasons: '外观缺陷, 设备精度', actual_hours: 120, worker: '赵六' }
])

function submitReport() {
  if (form.qualified_qty + form.defective_qty === 0) { ElMessage.warning('请填写报工数量'); return }
  if (form.qualified_qty + form.defective_qty > maxReportQty.value) { ElMessage.warning('报工总数不能超过剩余数量'); return }
  if (form.defective_qty > 0 && form.defect_reasons.length === 0) { ElMessage.warning('请选择不良原因'); return }

  ElMessageBox.confirm(
    `确认报工：合格 ${form.qualified_qty} 件，不良 ${form.defective_qty} 件？`,
    '确认报工', { type: 'warning' }
  ).then(() => {
    reportHistory.value.unshift({
      time: new Date().toLocaleString('zh-CN'), qualified_qty: form.qualified_qty,
      defective_qty: form.defective_qty, defect_reasons: form.defect_reasons.join(', '),
      actual_hours: form.actual_hours, worker: '赵六'
    })
    report.reported_qty += form.qualified_qty + form.defective_qty

    if (report.reported_qty >= report.planned_qty) {
      ElMessage.success('全部完工！')
      setTimeout(() => router.push('/work-order/list'), 1500)
    } else {
      ElMessage.success('报工成功')
      form.qualified_qty = report.planned_qty - report.reported_qty
      form.defective_qty = 0
      form.defect_reasons = []
    }
  }).catch(() => {})
}
</script>

<style scoped>
.report-container { max-width: 900px; }
.report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.report-header h2 { margin: 0; }
</style>

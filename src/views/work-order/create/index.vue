<template>
  <gi-page-layout>
    <template #header>
      <el-steps :active="activeStep" align-center style="margin-bottom: 24px">
        <el-step title="基本信息" />
        <el-step title="选择BOM和工艺" />
        <el-step title="确认提交" />
      </el-steps>
    </template>

    <div v-show="activeStep === 0">
      <gi-form v-model="step1Form" :columns="step1Columns" :label-width="120" />
      <div class="step-footer">
        <el-button type="primary" @click="nextStep">下一步</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
    </div>

    <div v-show="activeStep === 1">
      <el-descriptions :column="2" border style="margin-bottom: 16px">
        <el-descriptions-item label="产品名称">{{ step1Form.materialName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ step1Form.plannedQty }}</el-descriptions-item>
        <el-descriptions-item label="生产产线">
          <el-select v-model="step1Form.line" filterable placeholder="请选择生产产线" style="width: 100%">
            <el-option v-for="item in lines" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="BOM版本">
          <el-select v-model="step2Form.bomVersion" filterable placeholder="请选择BOM版本" style="width: 100%" @change="onBomChange">
            <el-option v-for="item in bomVersionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="工艺路线版本">
          <el-select v-model="step2Form.routingVersion" filterable placeholder="请选择工艺路线版本" style="width: 100%" @change="onRoutingChange">
            <el-option v-for="item in routingVersionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="产线负荷">
          <span :style="{ color: lineCapacityStatus.color, fontWeight: 'bold' }">{{ lineCapacityStatus.text }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <el-alert
        v-if="lineCapacityStatus.overloaded"
        :title="`产线“${step1Form.line || '-'}”当前负荷已达 ${lineCapacityStatus.rate}%，建议调整计划或切换其他产线`"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />

      <el-card v-if="step2Form.bomVersion" header="BOM 物料清单预览" shadow="never" style="margin-bottom: 16px">
        <el-table :data="bomPreviewData" border size="small">
          <el-table-column prop="level" label="层级" width="60" />
          <el-table-column prop="material" label="物料名称" min-width="180">
            <template #default="{ row }">
              <span :style="{ paddingLeft: `${row.level * 16}px` }">{{ row.material }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="qty" label="单位用量" width="100" align="center" />
          <el-table-column prop="total" label="总需求" width="100" align="center" />
          <el-table-column prop="available" label="可用库存" width="100" align="center">
            <template #default="{ row }">
              <span :style="{ color: row.available < row.total ? '#e6a23c' : '#67c23a' }">{{ row.available }}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.available >= row.total" type="success" size="small">充足</el-tag>
              <el-tag v-else-if="row.available > 0" type="warning" size="small">不足</el-tag>
              <el-tag v-else type="danger" size="small">缺料</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-if="step2Form.routingVersion" header="工艺路线预览" shadow="never">
        <el-table :data="routingPreviewData" border size="small">
          <el-table-column prop="opNo" label="工序号" width="80" align="center" />
          <el-table-column prop="name" label="工序名称" width="120" />
          <el-table-column prop="workCenter" label="工作中心" width="120" />
          <el-table-column prop="setup" label="准备工时(分钟)" width="120" align="center" />
          <el-table-column prop="run" label="单件工时(分钟)" width="120" align="center" />
          <el-table-column label="总工时(小时)" width="110" align="center">
            <template #default="{ row }">
              {{ ((row.setupVal + row.runVal * step1Form.plannedQty) / 60).toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column prop="qc" label="质检关口" width="90" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.qc" type="warning" size="small">是</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="step-footer">
        <el-button type="primary" @click="activeStep = 2">下一步</el-button>
        <el-button @click="activeStep = 0">上一步</el-button>
      </div>
    </div>

    <div v-show="activeStep === 2">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工单类型">{{ workOrderTypeLabel }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ step1Form.materialName }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ step1Form.plannedQty }} {{ step1Form.unit }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ priorityLabel }}</el-descriptions-item>
        <el-descriptions-item label="生产车间">{{ step1Form.workshop }}</el-descriptions-item>
        <el-descriptions-item label="生产产线">{{ step1Form.line || '-' }}</el-descriptions-item>
        <el-descriptions-item label="计划开工">{{ step1Form.plannedStart }}</el-descriptions-item>
        <el-descriptions-item label="计划完工">{{ step1Form.plannedEnd }}</el-descriptions-item>
        <el-descriptions-item label="BOM版本">{{ step2Form.bomVersion || '-' }}</el-descriptions-item>
        <el-descriptions-item label="工艺路线版本">{{ step2Form.routingVersion || '-' }}</el-descriptions-item>
        <el-descriptions-item label="客户订单号">{{ step1Form.customerPo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ step1Form.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="step-footer">
        <el-button type="primary" @click="submitOrder">提交工单</el-button>
        <el-button @click="activeStep = 1">上一步</el-button>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormColumnItem } from 'gi-component'
import { createWorkOrder } from '@/api/work-order'
import { getBOMList, getBOMPreview } from '@/api/bom'
import { getRoutingList } from '@/api/routing'

const router = useRouter()
const activeStep = ref(0)

const step1Form = reactive({
  woType: 'production',
  materialCode: '',
  materialName: '',
  materialSpec: '',
  unit: '件',
  plannedQty: 100,
  priority: 'normal',
  workshop: '机加工一车间',
  line: '',
  plannedStart: '2025-01-16',
  plannedEnd: '2025-01-25',
  customerPo: '',
  remark: ''
})

const step1Columns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '工单类型',
    field: 'woType',
    required: true,
    props: {
      options: [
        { label: '生产工单', value: 'production' },
        { label: '返工工单', value: 'rework' },
        { label: '样品工单', value: 'sample' }
      ]
    } as any
  },
  {
    type: 'input',
    label: '产品物料编码',
    field: 'materialCode',
    required: true,
    props: { placeholder: '请输入产品物料编码', clearable: true } as any
  },
  {
    type: 'input',
    label: '产品名称',
    field: 'materialName',
    props: { disabled: true, placeholder: '输入编码后自动带出' } as any
  },
  { type: 'input-number', label: '计划数量', field: 'plannedQty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    required: true,
    props: {
      options: [
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' },
        { label: '低', value: 'low' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '生产车间',
    field: 'workshop',
    required: true,
    props: {
      options: [
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  },
  { type: 'date-picker', label: '计划开工', field: 'plannedStart', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'date-picker', label: '计划完工', field: 'plannedEnd', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'input', label: '客户订单号', field: 'customerPo', props: { clearable: true } as any },
  { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } as any }
]

const step2Form = reactive({
  bomVersion: '',
  routingVersion: ''
})

const bomVersionOptions = ref<Array<{ label: string; value: string }>>([])
const bomPreviewData = ref<any[]>([])
const routingPreviewData = ref<any[]>([])

const routingVersionOptions = computed(() => [
  { label: '标准工艺 V1.1（生效中）', value: '标准工艺 V1.1' },
  { label: '标准工艺 V1.0（已归档）', value: '标准工艺 V1.0' }
])

const lines = [
  { label: '产线A（日产能 20 件）', value: '产线A' },
  { label: '产线B（日产能 15 件）', value: '产线B' },
  { label: '产线C（日产能 10 件）', value: '产线C' }
]

const lineLoadMap: Record<string, number> = {
  产线A: 75,
  产线B: 40,
  产线C: 95
}

const lineCapacityStatus = computed(() => {
  if (!step1Form.line) {
    return { rate: 0, text: '请先选择产线', color: '#909399', overloaded: false }
  }
  const rate = lineLoadMap[step1Form.line] || 0
  if (rate >= 90) return { rate, text: `超负荷（${rate}%）`, color: '#f56c6c', overloaded: true }
  if (rate >= 70) return { rate, text: `负荷偏高（${rate}%）`, color: '#e6a23c', overloaded: false }
  return { rate, text: `负荷正常（${rate}%）`, color: '#67c23a', overloaded: false }
})

const workOrderTypeLabel = computed(() => {
  if (step1Form.woType === 'production') return '生产工单'
  if (step1Form.woType === 'rework') return '返工工单'
  return '样品工单'
})

const priorityLabel = computed(() => {
  if (step1Form.priority === 'urgent') return '紧急'
  if (step1Form.priority === 'high') return '高'
  if (step1Form.priority === 'normal') return '普通'
  return '低'
})

async function fetchBOMVersions() {
  try {
    const response = await getBOMList({ pageNum: 1, pageSize: 100, materialCode: step1Form.materialCode || undefined })
    const items = response.data.list || []
    bomVersionOptions.value = items.map((item: any) => ({
      label: `${item.bom_type} ${item.version}（${item.status === 'active' ? '生效中' : item.status === 'draft' ? '草稿' : '已归档'}）`,
      value: `${item.bom_type} ${item.version}`
    }))
  } catch {
    bomVersionOptions.value = []
  }
}

async function onBomChange(version: string) {
  if (!version) {
    bomPreviewData.value = []
    return
  }

  try {
    const response = await getBOMPreview(step1Form.materialCode)
    const items = Array.isArray(response.data) ? response.data : response.data?.list || []
    bomPreviewData.value = items.map((item: any, index: number) => ({
      ...item,
      material: item.material || item.material_name || step1Form.materialName,
      available: item.available ?? Math.floor(Math.random() * 200) + index * 30
    }))
  } catch {
    bomPreviewData.value = []
  }
}

async function onRoutingChange(version: string) {
  if (!version) {
    routingPreviewData.value = []
    return
  }

  try {
    const response = await getRoutingList({ pageNum: 1, pageSize: 100, materialCode: step1Form.materialCode })
    routingPreviewData.value = (response.data.list || []).map((item: any) => ({
      opNo: item.operation_no,
      name: item.name,
      workCenter: item.work_center,
      setup: item.setup_hours,
      setupVal: item.setup_hours,
      run: item.run_hours,
      runVal: item.run_hours,
      qc: item.is_qc_gate
    }))
  } catch {
    routingPreviewData.value = []
  }
}

async function nextStep() {
  if (!step1Form.materialCode) {
    ElMessage.warning('请输入产品物料编码')
    return
  }

  if (step1Form.plannedStart && step1Form.plannedEnd && new Date(step1Form.plannedEnd) < new Date(step1Form.plannedStart)) {
    ElMessage.warning('计划完工日期不能早于计划开工日期')
    return
  }

  if (step1Form.materialCode === '04.01.001-00001') {
    step1Form.materialName = '离心泵 XJP-100'
    step1Form.materialSpec = '流量 100m3/h'
  } else if (!step1Form.materialName) {
    step1Form.materialName = step1Form.materialCode
  }

  await fetchBOMVersions()

  if (!step2Form.bomVersion && bomVersionOptions.value.length > 0) {
    step2Form.bomVersion = bomVersionOptions.value[0].value
    await onBomChange(step2Form.bomVersion)
  }

  if (!step2Form.routingVersion && routingVersionOptions.value.length > 0) {
    step2Form.routingVersion = routingVersionOptions.value[0].value
    await onRoutingChange(step2Form.routingVersion)
  }

  activeStep.value = 1
}

async function submitOrder() {
  if (lineCapacityStatus.value.overloaded) {
    ElMessage.warning('所选产线已超负荷，请调整计划后再提交')
    return
  }

  try {
    await createWorkOrder({
      wo_type: step1Form.woType,
      material_code: step1Form.materialCode,
      material_name: step1Form.materialName,
      material_spec: step1Form.materialSpec,
      planned_qty: step1Form.plannedQty,
      priority: step1Form.priority,
      workshop_name: step1Form.workshop,
      line_name: step1Form.line,
      planned_start_date: step1Form.plannedStart,
      planned_end_date: step1Form.plannedEnd,
      bom_version: step2Form.bomVersion,
      routing_version: step2Form.routingVersion,
      customer_po: step1Form.customerPo,
      remark: step1Form.remark,
      status: 'draft',
      completed_qty: 0,
      defective_qty: 0
    })
    ElMessage.success('工单创建成功')
    router.push('/mes/work-order/list')
  } catch {
    ElMessage.error('工单创建失败')
  }
}
</script>

<style scoped>
.step-footer {
  margin-top: 32px;
  text-align: center;
}
</style>

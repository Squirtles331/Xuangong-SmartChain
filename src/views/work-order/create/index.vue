<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <el-steps :active="activeStep" align-center style="margin-bottom: 24px">
        <el-step title="基本信息" />
        <el-step title="选择BOM/工艺" />
        <el-step title="确认提交" />
      </el-steps>
    </template>

    <!-- Step 1: 基本信息 -->
    <div v-show="activeStep === 0">
      <gi-form ref="step1FormRef" v-model="step1Form" :columns="step1Columns" :label-width="120" />
      <div style="text-align: center; margin-top: 32px">
        <el-button type="primary" @click="nextStep">下一步</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
    </div>

    <!-- Step 2: 选择BOM/工艺 -->
    <div v-show="activeStep === 1">
      <el-descriptions :column="2" border style="margin-bottom: 16px">
        <el-descriptions-item label="产品">{{ step1Form.material_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ step1Form.planned_qty }}</el-descriptions-item>
        <el-descriptions-item label="BOM版本">
          <el-select v-model="step2Form.bom_version" placeholder="选择BOM版本" style="width: 100%">
            <el-option v-for="b in bomVersions" :key="b" :label="b" :value="b" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="工艺路线版本">
          <el-select v-model="step2Form.routing_version" placeholder="选择工艺路线版本" style="width: 100%">
            <el-option v-for="r in routingVersions" :key="r" :label="r" :value="r" />
          </el-select>
        </el-descriptions-item>
      </el-descriptions>

      <!-- BOM预览 -->
      <el-card v-if="step2Form.bom_version" header="BOM 物料清单预览" shadow="never" style="margin-bottom: 16px">
        <el-table :data="bomPreview" border size="small">
          <el-table-column prop="level" label="层级" width="60" />
          <el-table-column prop="material" label="物料" />
          <el-table-column prop="qty" label="单位用量" width="100" />
          <el-table-column prop="total" label="总需求" width="100" />
        </el-table>
      </el-card>

      <!-- 工艺预览 -->
      <el-card v-if="step2Form.routing_version" header="工艺路线预览" shadow="never">
        <el-table :data="routingPreview" border size="small">
          <el-table-column prop="op_no" label="工序号" width="80" />
          <el-table-column prop="name" label="工序名称" width="120" />
          <el-table-column prop="work_center" label="工作中心" width="120" />
          <el-table-column prop="setup" label="准备工时" width="100" />
          <el-table-column prop="run" label="单件工时" width="100" />
          <el-table-column prop="qc" label="质检关口" width="80">
            <template #default="{ row }"><el-tag v-if="row.qc" type="warning" size="small">是</el-tag><span v-else>-</span></template>
          </el-table-column>
        </el-table>
      </el-card>

      <div style="text-align: center; margin-top: 32px">
        <el-button type="primary" @click="activeStep = 2">下一步</el-button>
        <el-button @click="activeStep = 0">上一步</el-button>
      </div>
    </div>

    <!-- Step 3: 确认提交 -->
    <div v-show="activeStep === 2">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工单类型">{{
          step1Form.wo_type === 'production' ? '生产工单' : step1Form.wo_type === 'rework' ? '返工工单' : '样品工单'
        }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ step1Form.material_name }}</el-descriptions-item>
        <el-descriptions-item label="计划数量">{{ step1Form.planned_qty }} {{ step1Form.unit }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{
          step1Form.priority === 'urgent' ? '紧急' : step1Form.priority === 'high' ? '高' : step1Form.priority === 'normal' ? '普通' : '低'
        }}</el-descriptions-item>
        <el-descriptions-item label="生产车间">{{ step1Form.workshop }}</el-descriptions-item>
        <el-descriptions-item label="计划开工">{{ step1Form.planned_start }}</el-descriptions-item>
        <el-descriptions-item label="计划完工">{{ step1Form.planned_end }}</el-descriptions-item>
        <el-descriptions-item label="BOM版本">{{ step2Form.bom_version }}</el-descriptions-item>
        <el-descriptions-item label="工艺路线版本">{{ step2Form.routing_version }}</el-descriptions-item>
        <el-descriptions-item label="客户订单号">{{ step1Form.customer_po || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ step1Form.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div style="text-align: center; margin-top: 32px">
        <el-button type="primary" @click="submitOrder">提交工单</el-button>
        <el-button @click="activeStep = 1">上一步</el-button>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormColumnItem } from 'gi-component'

const router = useRouter()
const activeStep = ref(0)

const step1Form = reactive({
  wo_type: 'production',
  material_code: '',
  material_name: '',
  material_spec: '',
  unit: '台',
  planned_qty: 100,
  priority: 'normal',
  workshop: '机加工一车间',
  line: '',
  planned_start: '2025-01-16',
  planned_end: '2025-01-25',
  customer_po: '',
  remark: ''
})

const step1Columns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '工单类型',
    field: 'wo_type',
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
    label: '产品物料',
    field: 'material_code',
    required: true,
    props: { placeholder: '搜索选择产品物料编码', clearable: true } as any
  },
  { type: 'input', label: '产品名称', field: 'material_name', props: { disabled: true, placeholder: '选择物料后自动填充' } as any },
  { type: 'input-number', label: '计划数量', field: 'planned_qty', required: true, props: { min: 1 } as any },
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
  { type: 'date-picker', label: '计划开工', field: 'planned_start', required: true },
  { type: 'date-picker', label: '计划完工', field: 'planned_end', required: true },
  { type: 'input', label: '客户订单号', field: 'customer_po' },
  { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } as any }
]

const step2Form = reactive({ bom_version: '', routing_version: '' })
const bomVersions = ref(['MBOM V1.2 (生效中)', 'MBOM V1.1 (已归档)', 'MBOM V1.0 (已归档)'])
const routingVersions = ref(['标准工艺 V1.1 (生效中)', '标准工艺 V1.0 (已归档)'])

const bomPreview = [
  { level: 0, material: '离心泵 XJP-100', qty: '1', total: '100台' },
  { level: 1, material: '泵体组件', qty: '1', total: '100' },
  { level: 2, material: '泵体铸件', qty: '1', total: '100' },
  { level: 2, material: '耐磨环', qty: '2', total: '200' },
  { level: 2, material: '螺栓 M16×60', qty: '8', total: '800' },
  { level: 1, material: '叶轮组件', qty: '1', total: '100' },
  { level: 1, material: '轴承架组件', qty: '1', total: '100' }
]

const routingPreview = [
  { op_no: 10, name: '下料', work_center: '下料组', setup: '15min', run: '5min', qc: false },
  { op_no: 20, name: '粗车', work_center: '数控车组', setup: '30min', run: '25min', qc: false },
  { op_no: 30, name: '精车', work_center: '数控车组', setup: '20min', run: '18min', qc: true },
  { op_no: 40, name: '钻孔', work_center: '钻床组', setup: '10min', run: '8min', qc: false },
  { op_no: 50, name: '磨削', work_center: '磨床组', setup: '20min', run: '15min', qc: true },
  { op_no: 60, name: '装配', work_center: '装配组', setup: '30min', run: '45min', qc: false },
  { op_no: 70, name: '试压', work_center: '测试组', setup: '15min', run: '20min', qc: true },
  { op_no: 80, name: '油漆', work_center: '涂装组', setup: '20min', run: '30min', qc: false }
]

function nextStep() {
  // 增强校验
  if (!step1Form.material_code) {
    ElMessage.warning('请选择产品物料')
    return
  }
  if (step1Form.planned_start && step1Form.planned_end && new Date(step1Form.planned_end) < new Date(step1Form.planned_start)) {
    ElMessage.warning('计划完工日期不能早于计划开工日期')
    return
  }
  // 自动填充产品信息
  if (step1Form.material_code === '04.01.001-00001') {
    step1Form.material_name = '离心泵 XJP-100'
    step1Form.material_spec = '流量100m³/h'
  } else if (!step1Form.material_name) {
    step1Form.material_name = step1Form.material_code
  }
  step2Form.bom_version = step2Form.bom_version || bomVersions.value[0]
  step2Form.routing_version = step2Form.routing_version || routingVersions.value[0]
  activeStep.value = 1
}

function submitOrder() {
  ElMessage.success('工单创建成功')
  router.push('/work-order/list')
}
</script>

<template>
  <gi-page-layout>
    <template #header>
      <div class="editor-header">
        <div>
          <h2>{{ isCreateMode ? '新建工艺路线' : routingTitle }}</h2>
          <p class="header-desc">{{ routingForm.material_code || '待定义产品编码' }} ｜ 版本：{{ routingForm.version || '-' }}</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="page-shell">
      <PageOwnershipNotice />

      <div class="page-overview">
        <div class="overview-card">
          <div class="overview-label">工序数</div>
          <div class="overview-value">{{ operations.length }}</div>
          <div class="overview-desc">当前路线中已维护的工序节点数量</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">质检关卡</div>
          <div class="overview-value">{{ qcGateCount }}</div>
          <div class="overview-desc">需要过程质量裁决的工序数量</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">工作中心数</div>
          <div class="overview-value">{{ workCenterCount }}</div>
          <div class="overview-desc">覆盖的主要制造资源类型</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">总工时</div>
          <div class="overview-value">{{ totalDuration }} 分钟</div>
          <div class="overview-desc">用于后续 APS / MES 链路的静态口径</div>
        </div>
      </div>

      <div class="editor-layout">
        <div class="left-panel">
          <el-card shadow="never" class="summary-card">
            <template #header>
              <div class="card-header">
                <span>路线头信息</span>
              </div>
            </template>

            <el-form :model="routingForm" label-width="92px">
              <el-form-item label="工艺路线">
                <el-input v-model="routingForm.routing_name" />
              </el-form-item>
              <el-form-item label="物料编码">
                <el-input v-model="routingForm.material_code" />
              </el-form-item>
              <el-form-item label="物料名称">
                <el-input v-model="routingForm.material_name" />
              </el-form-item>
              <el-form-item label="版本">
                <el-input v-model="routingForm.version" />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="routingForm.status" style="width: 100%">
                  <el-option label="草稿" value="draft" />
                  <el-option label="已生效" value="active" />
                  <el-option label="已停用" value="disabled" />
                </el-select>
              </el-form-item>
              <el-form-item label="说明">
                <el-input v-model="routingForm.description" type="textarea" :rows="4" />
              </el-form-item>
            </el-form>
          </el-card>

          <el-card shadow="never" class="summary-card">
            <template #header>
              <div class="card-header">
                <span>工时汇总</span>
              </div>
            </template>

            <div class="summary-item">
              <span>准备工时</span>
              <strong>{{ totalSetup }} 分钟</strong>
            </div>
            <div class="summary-item">
              <span>加工工时</span>
              <strong>{{ totalRun }} 分钟</strong>
            </div>
            <div class="summary-item">
              <span>排队与转运</span>
              <strong>{{ totalFlow }} 分钟</strong>
            </div>
            <div class="summary-item total">
              <span>总工时</span>
              <strong>{{ totalDuration }} 分钟</strong>
            </div>
          </el-card>
        </div>

        <div class="right-panel">
          <div class="toolbar">
            <el-button type="primary" @click="addOperation">新增工序</el-button>
          </div>

          <el-table :data="operations" border stripe style="width: 100%">
            <el-table-column label="工序号" width="90" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.operation_no" :min="10" :step="10" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="工序名称" min-width="130">
              <template #default="{ row }">
                <el-input v-model="row.name" />
              </template>
            </el-table-column>
            <el-table-column label="工作中心" min-width="140">
              <template #default="{ row }">
                <el-select v-model="row.work_center" style="width: 100%">
                  <el-option v-for="item in workCenterOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="准备工时" width="110" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.setup_hours" :min="0" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="加工工时" width="110" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.run_hours" :min="0" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="排队工时" width="110" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.queue_hours" :min="0" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="转运工时" width="110" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.move_hours" :min="0" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="人数" width="80" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.workers" :min="1" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="技能要求" min-width="140">
              <template #default="{ row }">
                <el-select v-model="row.skill" style="width: 100%">
                  <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="质检关卡" width="100" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.is_qc_gate" />
              </template>
            </el-table-column>
            <el-table-column label="委外" width="90" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.is_outsourced" />
              </template>
            </el-table-column>
            <el-table-column label="操作说明" min-width="220">
              <template #default="{ row }">
                <el-input v-model="row.instruction" type="textarea" :rows="2" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170" fixed="right" align="center">
              <template #default="{ $index }">
                <el-button link type="primary" @click="moveUp($index)" :disabled="$index === 0">上移</el-button>
                <el-button link type="primary" @click="moveDown($index)" :disabled="$index === operations.length - 1">下移</el-button>
                <el-button link type="danger" @click="removeOperation($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'

interface RoutingOperation {
  id: string
  operation_no: number
  name: string
  work_center: string
  setup_hours: number
  run_hours: number
  queue_hours: number
  move_hours: number
  workers: number
  skill: string
  is_qc_gate: boolean
  is_outsourced: boolean
  instruction: string
}

interface RoutingDetail {
  id: string
  material_code: string
  material_name: string
  routing_name: string
  version: string
  status: 'draft' | 'active' | 'disabled'
  description: string
  operations: RoutingOperation[]
}

const route = useRoute()

const workCenterOptions = ['下料组', '数控车组', '钻床组', '热处理组', '磨床组', '装配组', '测试组', '加工中心']
const skillOptions = ['下料操作', '数控车床操作', '钻床操作', '热处理操作', '磨床操作', '装配钳工', '测试操作', '加工中心操作']

const routingTemplates: Record<string, RoutingDetail> = {
  'RT-2101-V2.0': {
    id: 'RT-2101-V2.0',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    routing_name: '供液控制总成主装路线',
    version: 'V2.0',
    status: 'active',
    description: '用于主装产线的标准装配路线。',
    operations: [
      {
        id: '1',
        operation_no: 10,
        name: '壳体清洗',
        work_center: '装配组',
        setup_hours: 8,
        run_hours: 12,
        queue_hours: 4,
        move_hours: 2,
        workers: 1,
        skill: '装配钳工',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: '装配前完成油污清洗。'
      },
      {
        id: '2',
        operation_no: 20,
        name: '密封件预装',
        work_center: '装配组',
        setup_hours: 10,
        run_hours: 18,
        queue_hours: 6,
        move_hours: 2,
        workers: 2,
        skill: '装配钳工',
        is_qc_gate: true,
        is_outsourced: false,
        instruction: '确认密封圈批次和装配方向。'
      },
      {
        id: '3',
        operation_no: 30,
        name: '总成装配',
        work_center: '装配组',
        setup_hours: 12,
        run_hours: 40,
        queue_hours: 8,
        move_hours: 4,
        workers: 2,
        skill: '装配钳工',
        is_qc_gate: true,
        is_outsourced: false,
        instruction: '按标准扭矩完成总成装配。'
      }
    ]
  },
  'RT-2101-V2.1': {
    id: 'RT-2101-V2.1',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    routing_name: '供液控制总成优化路线',
    version: 'V2.1',
    status: 'draft',
    description: '优化排队工时并新增中间质检关卡。',
    operations: [
      {
        id: '1',
        operation_no: 10,
        name: '壳体清洗',
        work_center: '装配组',
        setup_hours: 8,
        run_hours: 10,
        queue_hours: 2,
        move_hours: 2,
        workers: 1,
        skill: '装配钳工',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: '装配前完成油污清洗。'
      },
      {
        id: '2',
        operation_no: 20,
        name: '核心组件预组',
        work_center: '装配组',
        setup_hours: 10,
        run_hours: 16,
        queue_hours: 4,
        move_hours: 2,
        workers: 2,
        skill: '装配钳工',
        is_qc_gate: true,
        is_outsourced: false,
        instruction: '拆分为预装工位减少主线等待。'
      },
      {
        id: '3',
        operation_no: 30,
        name: '整机联调',
        work_center: '测试组',
        setup_hours: 12,
        run_hours: 34,
        queue_hours: 6,
        move_hours: 4,
        workers: 2,
        skill: '测试操作',
        is_qc_gate: true,
        is_outsourced: false,
        instruction: '完成功能联调与首件确认。'
      }
    ]
  },
  'RT-1001-V1.0': {
    id: 'RT-1001-V1.0',
    material_code: 'SM-CNC-1001',
    material_name: '壳体粗加工件',
    routing_name: '壳体粗加工路线',
    version: 'V1.0',
    status: 'active',
    description: '机加壳体的标准工艺路线。',
    operations: [
      {
        id: '1',
        operation_no: 10,
        name: '下料',
        work_center: '下料组',
        setup_hours: 6,
        run_hours: 10,
        queue_hours: 3,
        move_hours: 2,
        workers: 1,
        skill: '下料操作',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: '按毛坯图纸完成下料。'
      },
      {
        id: '2',
        operation_no: 20,
        name: '数控粗车',
        work_center: '数控车组',
        setup_hours: 10,
        run_hours: 28,
        queue_hours: 8,
        move_hours: 3,
        workers: 1,
        skill: '数控车床操作',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: '执行粗车并保留精加工余量。'
      },
      {
        id: '3',
        operation_no: 30,
        name: '热处理',
        work_center: '热处理组',
        setup_hours: 8,
        run_hours: 12,
        queue_hours: 8,
        move_hours: 6,
        workers: 1,
        skill: '热处理操作',
        is_qc_gate: true,
        is_outsourced: true,
        instruction: '按热处理标准完成硬度控制。'
      }
    ]
  }
}

const routingForm = reactive<RoutingDetail>({
  id: '',
  material_code: '',
  material_name: '',
  routing_name: '',
  version: 'V1.0',
  status: 'draft',
  description: '',
  operations: []
})

const operations = ref<RoutingOperation[]>([])

const isCreateMode = computed(() => String(route.params.id || '') === 'new')
const routingTitle = computed(() => routingForm.routing_name || '工艺路线编辑')
const totalSetup = computed(() => operations.value.reduce((sum, item) => sum + Number(item.setup_hours || 0), 0))
const totalRun = computed(() => operations.value.reduce((sum, item) => sum + Number(item.run_hours || 0), 0))
const totalFlow = computed(() => operations.value.reduce((sum, item) => sum + Number(item.queue_hours || 0) + Number(item.move_hours || 0), 0))
const totalDuration = computed(() => totalSetup.value + totalRun.value + totalFlow.value)
const qcGateCount = computed(() => operations.value.filter((item) => item.is_qc_gate).length)
const workCenterCount = computed(() => new Set(operations.value.map((item) => item.work_center)).size)

function createOperation(): RoutingOperation {
  const nextNo = operations.value.length ? Math.max(...operations.value.map((item) => item.operation_no)) + 10 : 10
  return {
    id: `temp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    operation_no: nextNo,
    name: '',
    work_center: workCenterOptions[0],
    setup_hours: 0,
    run_hours: 0,
    queue_hours: 0,
    move_hours: 0,
    workers: 1,
    skill: skillOptions[0],
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  }
}

function normalizeOrder() {
  operations.value = [...operations.value].sort((a, b) => a.operation_no - b.operation_no)
  operations.value.forEach((item, index) => {
    item.operation_no = (index + 1) * 10
  })
}

function addOperation() {
  operations.value.push(createOperation())
  normalizeOrder()
}

function moveUp(index: number) {
  if (index === 0) return
  ;[operations.value[index - 1], operations.value[index]] = [operations.value[index], operations.value[index - 1]]
  normalizeOrder()
}

function moveDown(index: number) {
  if (index >= operations.value.length - 1) return
  ;[operations.value[index], operations.value[index + 1]] = [operations.value[index + 1], operations.value[index]]
  normalizeOrder()
}

function removeOperation(index: number) {
  operations.value.splice(index, 1)
  normalizeOrder()
}

function loadDetail() {
  const id = String(route.params.id || '')

  if (isCreateMode.value || !id) {
    Object.assign(routingForm, {
      id: 'new',
      material_code: '',
      material_name: '',
      routing_name: '',
      version: 'V1.0',
      status: 'draft',
      description: '',
      operations: []
    })
    operations.value = [createOperation()]
    return
  }

  const template = routingTemplates[id] || routingTemplates['RT-2101-V2.0']
  Object.assign(routingForm, {
    ...template,
    operations: []
  })
  operations.value = template.operations.map((item) => ({ ...item }))
  normalizeOrder()
}

function handleSave() {
  if (!routingForm.routing_name || !routingForm.material_name) {
    ElMessage.warning('请填写工艺路线名称和物料名称')
    return
  }

  if (!operations.value.length) {
    ElMessage.warning('请至少维护一条工序')
    return
  }

  routingForm.operations = operations.value.map((item) => ({ ...item }))
  ElMessage.success('静态工艺路线已保存，可作为后续 mock 基线')
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-desc {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.page-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.overview-card {
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  background: linear-gradient(180deg, #fcfdff 0%, #f7faff 100%);
}

.overview-label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.overview-value {
  margin-top: 10px;
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
}

.overview-desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.editor-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.summary-item:last-child {
  border-bottom: 0;
}

.summary-item.total {
  color: var(--el-color-primary);
}

.right-panel {
  min-width: 0;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

@media (max-width: 1200px) {
  .page-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .editor-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-overview {
    grid-template-columns: 1fr;
  }

  .editor-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="版本切换"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新建切换任务"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <div class="page-overview">
        <div v-for="card in overviewCards" :key="card.label" class="overview-card">
          <div class="overview-label">{{ card.label }}</div>
          <div class="overview-value">{{ card.value }}</div>
          <div class="overview-desc">{{ card.desc }}</div>
        </div>
      </div>
    </template>

    <template #cutoverType="{ row }">
      <StatusTag :value="row.cutoverType" :options="cutoverTypeOptions" />
    </template>

    <template #riskLevel="{ row }">
      <StatusTag :value="row.riskLevel" :options="riskLevelOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新建切换任务' : '编辑切换任务'" width="820px">
        <el-form ref="formRef" :model="dialogForm" :rules="formRules" label-width="110px">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="切换单号" prop="code">
                <el-input v-model="dialogForm.code" placeholder="请输入切换单号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="切换对象" prop="material">
                <el-input v-model="dialogForm.material" placeholder="请输入产品或对象名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="切换类型" prop="cutoverType">
                <el-select v-model="dialogForm.cutoverType" style="width: 100%">
                  <el-option v-for="item in cutoverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风险等级" prop="riskLevel">
                <el-select v-model="dialogForm.riskLevel" style="width: 100%">
                  <el-option v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前版本" prop="currentVersion">
                <el-input v-model="dialogForm.currentVersion" placeholder="如 EBOM V2.3 / RT V2.0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标版本" prop="targetVersion">
                <el-input v-model="dialogForm.targetVersion" placeholder="如 EBOM V2.4 / RT V2.1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划切换日" prop="plannedDate">
                <el-date-picker v-model="dialogForm.plannedDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人" prop="owner">
                <el-input v-model="dialogForm.owner" placeholder="请输入责任人" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="切换说明">
            <el-input v-model="dialogForm.description" type="textarea" :rows="4" maxlength="180" show-word-limit />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDialog">保存</el-button>
        </template>
      </el-dialog>

      <el-drawer v-model="detailVisible" title="版本切换详情" size="820px">
        <template v-if="currentDetail">
          <div class="detail-shell">
            <div class="detail-hero">
              <div>
                <div class="detail-title">{{ currentDetail.material }}</div>
                <div class="detail-subtitle">{{ currentDetail.code }} · {{ currentDetail.currentVersion }} -> {{ currentDetail.targetVersion }}</div>
              </div>
              <StatusTag :value="currentDetail.status" :options="statusOptions" />
            </div>

            <div class="detail-grid">
              <section class="detail-card">
                <div class="detail-card__title">切换基础</div>
                <div class="detail-item">
                  <span>切换类型</span><strong>{{ getOptionLabel(cutoverTypeOptions, currentDetail.cutoverType) }}</strong>
                </div>
                <div class="detail-item">
                  <span>风险等级</span><strong>{{ getOptionLabel(riskLevelOptions, currentDetail.riskLevel) }}</strong>
                </div>
                <div class="detail-item">
                  <span>计划切换日</span><strong>{{ currentDetail.plannedDate }}</strong>
                </div>
                <div class="detail-item">
                  <span>责任人</span><strong>{{ currentDetail.owner }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">版本来源</div>
                <div class="detail-item">
                  <span>当前版本</span><strong>{{ currentDetail.currentVersion }}</strong>
                </div>
                <div class="detail-item">
                  <span>目标版本</span><strong>{{ currentDetail.targetVersion }}</strong>
                </div>
                <div class="detail-item">
                  <span>来源变更单</span><strong>{{ currentDetail.changeOrder }}</strong>
                </div>
                <div class="detail-item">
                  <span>影响工单</span><strong>{{ currentDetail.workOrderCount }} 张</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">影响对象</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.impactObjects" :key="item" type="warning" effect="light" round>{{ item }}</el-tag>
                </div>
                <p class="detail-description">{{ currentDetail.description }}</p>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">收口记录</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.closureRecords" :key="item" type="success" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>
            </div>

            <section class="detail-card detail-card--full">
              <div class="detail-card__title">切换步骤</div>
              <el-steps :active="getStepActive(currentDetail.status)" finish-status="success" align-center>
                <el-step v-for="step in currentDetail.steps" :key="step" :title="step" />
              </el-steps>
            </section>
          </div>
        </template>
      </el-drawer>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type CutoverStatus = 'draft' | 'approval' | 'approved' | 'executing' | 'verified' | 'closed'
type CutoverType = 'bom' | 'routing' | 'bom_routing'
type RiskLevel = 'low' | 'medium' | 'high'

interface OptionItem {
  value: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface CutoverTask {
  id: string
  code: string
  material: string
  cutoverType: CutoverType
  currentVersion: string
  targetVersion: string
  status: CutoverStatus
  riskLevel: RiskLevel
  plannedDate: string
  owner: string
  changeOrder: string
  workOrderCount: number
  inventoryImpact: string
  impactObjects: string[]
  closureRecords: string[]
  steps: string[]
  description: string
}

const cutoverTypeOptions: OptionItem[] = [
  { value: 'bom', label: 'BOM切换', type: 'primary' },
  { value: 'routing', label: '工艺路线切换', type: 'success' },
  { value: 'bom_routing', label: 'BOM+工艺切换', type: 'warning' }
]

const riskLevelOptions: OptionItem[] = [
  { value: 'low', label: '低', type: 'info' },
  { value: 'medium', label: '中', type: 'warning' },
  { value: 'high', label: '高', type: 'danger' }
]

const statusOptions: OptionItem[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'approval', label: '待审批', type: 'warning' },
  { value: 'approved', label: '已放行', type: 'primary' },
  { value: 'executing', label: '执行中', type: 'warning' },
  { value: 'verified', label: '已验证', type: 'success' },
  { value: 'closed', label: '已关闭', type: 'info' }
]

const records = ref<CutoverTask[]>([
  {
    id: 'CUT-001',
    code: 'CUT-202607-001',
    material: '供液控制总成',
    cutoverType: 'bom_routing',
    currentVersion: 'EBOM V2.3 / RT V2.0',
    targetVersion: 'EBOM V2.4 / RT V2.1',
    status: 'approval',
    riskLevel: 'high',
    plannedDate: '2026-07-18',
    owner: '李工艺',
    changeOrder: 'ECN-202607-001',
    workOrderCount: 2,
    inventoryImpact: '旧版库存 86 件，新版辅料待齐套',
    impactObjects: ['在制工单', '旧版库存', '工艺路线', '首件检验'],
    closureRecords: ['待审批放行', '待现场切换'],
    steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
    description: '新增密封结构后需要同步切换 BOM、工艺路线、首件确认和现场投料口径。'
  },
  {
    id: 'CUT-002',
    code: 'CUT-202607-002',
    material: '壳体粗加工件',
    cutoverType: 'routing',
    currentVersion: 'RT V1.0',
    targetVersion: 'RT V1.1',
    status: 'approved',
    riskLevel: 'medium',
    plannedDate: '2026-07-16',
    owner: '周制造',
    changeOrder: 'ECN-202607-002',
    workOrderCount: 1,
    inventoryImpact: '不影响库存，仅调整工序顺序和质检关卡',
    impactObjects: ['工艺路线', '工时参数', '过程检验'],
    closureRecords: ['审批已放行', '等待现场执行'],
    steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
    description: '缩短排队工时并新增中间检验点，切换后 APS 和 MES 按新路线消费。'
  },
  {
    id: 'CUT-003',
    code: 'CUT-202607-003',
    material: '真空模组总成',
    cutoverType: 'bom',
    currentVersion: 'EBOM V3.1',
    targetVersion: 'EBOM V3.2',
    status: 'executing',
    riskLevel: 'medium',
    plannedDate: '2026-07-20',
    owner: '陈设计',
    changeOrder: 'ECN-202607-003',
    workOrderCount: 3,
    inventoryImpact: '替代辅料需冻结旧版领料',
    impactObjects: ['采购替代料', '装配辅料', '现场切换'],
    closureRecords: ['已放行', '执行日志待收口'],
    steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
    description: '替换老版本密封辅料，现场按新 EBOM 版本完成齐套和投料切换。'
  },
  {
    id: 'CUT-004',
    code: 'CUT-202607-004',
    material: '供液控制总成',
    cutoverType: 'bom',
    currentVersion: 'MBOM V1.1',
    targetVersion: 'MBOM V1.2',
    status: 'verified',
    riskLevel: 'low',
    plannedDate: '2026-07-14',
    owner: '周制造',
    changeOrder: 'ECN-202607-004',
    workOrderCount: 0,
    inventoryImpact: '制造投料口径已同步',
    impactObjects: ['领料口径', '制造版本'],
    closureRecords: ['现场已切换', '首件已验证'],
    steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
    description: '制造口径结构与现场投料同步修正，等待最终关闭。'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '切换单号 / 对象 / 责任人' } as never },
  {
    type: 'select-v2',
    label: '切换类型',
    field: 'cutoverType',
    props: { options: [{ label: '全部', value: '' }, ...cutoverTypeOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: [{ label: '全部', value: '' }, ...statusOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  },
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'riskLevel',
    props: { options: [{ label: '全部', value: '' }, ...riskLevelOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<CutoverTask>[] = [
  { prop: 'code', label: '切换单号', minWidth: 150 },
  { prop: 'material', label: '切换对象', minWidth: 170 },
  { label: '切换类型', minWidth: 120, align: 'center', slotName: 'cutoverType' },
  { prop: 'currentVersion', label: '当前版本', minWidth: 170 },
  { prop: 'targetVersion', label: '目标版本', minWidth: 170 },
  { label: '风险', minWidth: 90, align: 'center', slotName: 'riskLevel' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'plannedDate', label: '计划切换日', minWidth: 120 },
  { prop: 'owner', label: '责任人', minWidth: 100 },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  cutoverType: '',
  status: '',
  riskLevel: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const detailVisible = ref(false)
const currentDetail = ref<CutoverTask | null>(null)
const formRef = ref<FormInstance>()
const dialogForm = reactive(createDefaultForm())

const formRules: FormRules = {
  code: [{ required: true, message: '请输入切换单号', trigger: 'blur' }],
  material: [{ required: true, message: '请输入切换对象', trigger: 'blur' }],
  cutoverType: [{ required: true, message: '请选择切换类型', trigger: 'change' }],
  currentVersion: [{ required: true, message: '请输入当前版本', trigger: 'blur' }],
  targetVersion: [{ required: true, message: '请输入目标版本', trigger: 'blur' }],
  plannedDate: [{ required: true, message: '请选择计划切换日', trigger: 'change' }],
  owner: [{ required: true, message: '请输入责任人', trigger: 'blur' }]
}

const filteredRecords = computed(() =>
  records.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.code.toLowerCase().includes(keyword) ||
      item.material.toLowerCase().includes(keyword) ||
      item.owner.toLowerCase().includes(keyword)
    const matchType = !queryParams.cutoverType || item.cutoverType === queryParams.cutoverType
    const matchStatus = !queryParams.status || item.status === queryParams.status
    const matchRisk = !queryParams.riskLevel || item.riskLevel === queryParams.riskLevel
    return matchKeyword && matchType && matchStatus && matchRisk
  })
)

const overviewCards = computed(() => {
  const approvalCount = records.value.filter((item) => item.status === 'approval').length
  const executingCount = records.value.filter((item) => item.status === 'executing').length
  const highRiskCount = records.value.filter((item) => item.riskLevel === 'high').length
  const affectedWorkOrders = records.value.reduce((sum, item) => sum + item.workOrderCount, 0)

  return [
    { label: '切换任务数', value: records.value.length, desc: '当前 PLM 定义链待管理的版本切换任务' },
    { label: '待审批', value: approvalCount, desc: '需要工程放行后才能进入现场切换的任务' },
    { label: '执行中', value: executingCount, desc: '已经进入 MES 现场切换和留痕阶段的任务' },
    { label: '高风险 / 工单', value: `${highRiskCount} / ${affectedWorkOrders}`, desc: '高风险切换任务与受影响在制工单总量' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<CutoverTask>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  }
})

function createDefaultForm(): CutoverTask {
  return {
    id: '',
    code: '',
    material: '',
    cutoverType: 'bom_routing',
    currentVersion: '',
    targetVersion: '',
    status: 'draft',
    riskLevel: 'medium',
    plannedDate: '',
    owner: '',
    changeOrder: '待关联',
    workOrderCount: 0,
    inventoryImpact: '待扫描',
    impactObjects: ['待影响扫描'],
    closureRecords: ['待创建'],
    steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
    description: ''
  }
}

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((item) => item.value === value)?.label || value || '-'
}

function getStepActive(status: CutoverStatus) {
  const indexMap: Record<CutoverStatus, number> = {
    draft: 0,
    approval: 1,
    approved: 2,
    executing: 3,
    verified: 4,
    closed: 4
  }
  return indexMap[status]
}

function getRowActions(row: CutoverTask): CrudRowActionItem[] {
  return [
    { key: 'detail', label: '查看详情', tone: 'primary' },
    { key: 'edit', label: '编辑', tone: 'secondary', hidden: row.status !== 'draft' },
    { key: 'submit', label: '提交审批', tone: 'warning', hidden: row.status !== 'draft' },
    { key: 'approve', label: '审批放行', tone: 'success', hidden: row.status !== 'approval' },
    { key: 'execute', label: '开始切换', tone: 'warning', hidden: row.status !== 'approved' },
    { key: 'verify', label: '验证收口', tone: 'success', hidden: row.status !== 'executing' },
    { key: 'close', label: '关闭', tone: 'danger', hidden: row.status !== 'verified' }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    cutoverType: '',
    status: '',
    riskLevel: ''
  })
  search()
}

function assignForm(row: CutoverTask) {
  Object.assign(dialogForm, createDefaultForm(), row)
}

function openAdd() {
  dialogMode.value = 'add'
  assignForm(createDefaultForm())
  dialogVisible.value = true
}

function openEdit(row: CutoverTask) {
  dialogMode.value = 'edit'
  assignForm({
    ...row,
    impactObjects: [...row.impactObjects],
    closureRecords: [...row.closureRecords],
    steps: [...row.steps]
  })
  dialogVisible.value = true
}

function openDetail(row: CutoverTask) {
  currentDetail.value = {
    ...row,
    impactObjects: [...row.impactObjects],
    closureRecords: [...row.closureRecords],
    steps: [...row.steps]
  }
  detailVisible.value = true
}

async function submitDialog() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload: CutoverTask = {
    ...dialogForm,
    id: dialogForm.id || `CUT-${Date.now()}`,
    impactObjects: [...dialogForm.impactObjects],
    closureRecords: [...dialogForm.closureRecords],
    steps: [...dialogForm.steps]
  }

  if (dialogMode.value === 'add') {
    records.value.unshift(payload)
    ElMessage.success('已新增静态切换任务')
  } else {
    records.value = records.value.map((item) => (item.id === payload.id ? payload : item))
    if (currentDetail.value?.id === payload.id) currentDetail.value = { ...payload }
    ElMessage.success('已更新静态切换任务')
  }

  dialogVisible.value = false
  search()
}

function updateStatus(row: CutoverTask, status: CutoverStatus, message: string, closureRecord: string) {
  row.status = status
  if (!row.closureRecords.includes(closureRecord)) {
    row.closureRecords.push(closureRecord)
  }
  if (currentDetail.value?.id === row.id) {
    currentDetail.value = { ...row, impactObjects: [...row.impactObjects], closureRecords: [...row.closureRecords], steps: [...row.steps] }
  }
  ElMessage.success(message)
}

function handleRowAction(action: string, row: CutoverTask) {
  if (action === 'detail') {
    openDetail(row)
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'submit') {
    updateStatus(row, 'approval', '已提交切换审批', '已提交审批')
    return
  }

  if (action === 'approve') {
    updateStatus(row, 'approved', '已审批放行', '审批已放行')
    return
  }

  if (action === 'execute') {
    updateStatus(row, 'executing', '已进入现场切换执行', '现场切换执行中')
    return
  }

  if (action === 'verify') {
    updateStatus(row, 'verified', '已完成切换验证', '切换已验证')
    return
  }

  if (action === 'close') {
    updateStatus(row, 'closed', '已关闭切换任务', '任务已关闭')
  }
}
</script>

<style scoped>
.page-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
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

.detail-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%);
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-subtitle {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-card {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
  background: #fff;
}

.detail-card--full {
  width: 100%;
}

.detail-card__title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.detail-item strong {
  color: var(--el-text-color-primary);
  text-align: right;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.detail-description {
  margin: 10px 0 0;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

@media (max-width: 1200px) {
  .page-overview,
  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-hero,
  .detail-item {
    flex-direction: column;
  }

  .detail-item strong {
    text-align: left;
  }
}
</style>

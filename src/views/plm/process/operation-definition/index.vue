<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="工序定义"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新增工序定义"
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

    <template #operationCategory="{ row }">
      <el-tag effect="light" round>{{ getOptionLabel(categoryOptions, row.operationCategory) }}</el-tag>
    </template>

    <template #qcMode="{ row }">
      <el-tag :type="row.qcMode === 'required' ? 'danger' : row.qcMode === 'sampling' ? 'warning' : 'info'" effect="light" round>
        {{ getOptionLabel(qcModeOptions, row.qcMode) }}
      </el-tag>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #routeCount="{ row }">
      <el-button link type="primary" @click="openDetail(row)">{{ row.routeCount }}</el-button>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增工序定义' : '编辑工序定义'" width="900px">
        <el-form ref="formRef" :model="dialogForm" :rules="formRules" label-width="110px">
          <div class="form-section">
            <div class="form-section__title">基础信息</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="工序编码" prop="code">
                  <el-input v-model="dialogForm.code" placeholder="请输入工序编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工序名称" prop="name">
                  <el-input v-model="dialogForm.name" placeholder="请输入工序名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工序分类" prop="operationCategory">
                  <el-select v-model="dialogForm.operationCategory" style="width: 100%">
                    <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认工作中心" prop="defaultWorkCenter">
                  <el-input v-model="dialogForm.defaultWorkCenter" placeholder="请输入默认工作中心" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认技能要求" prop="defaultSkill">
                  <el-input v-model="dialogForm.defaultSkill" placeholder="请输入默认技能要求" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="dialogForm.status" style="width: 100%">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section">
            <div class="form-section__title">工时与资源</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="准备工时(分)">
                  <el-input-number v-model="dialogForm.setupMinutes" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工工时(分)">
                  <el-input-number v-model="dialogForm.runMinutes" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排队工时(分)">
                  <el-input-number v-model="dialogForm.queueMinutes" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="转运工时(分)">
                  <el-input-number v-model="dialogForm.moveMinutes" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准人数">
                  <el-input-number v-model="dialogForm.workers" :min="1" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="委外工序">
                  <el-switch v-model="dialogForm.isOutsourced" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section">
            <div class="form-section__title">质量与报工约束</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="质检模式" prop="qcMode">
                  <el-select v-model="dialogForm.qcMode" style="width: 100%">
                    <el-option v-for="item in qcModeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报工模式" prop="reportMode">
                  <el-select v-model="dialogForm.reportMode" style="width: 100%">
                    <el-option v-for="item in reportModeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="工序说明">
              <el-input v-model="dialogForm.description" type="textarea" :rows="4" placeholder="请输入工序定义说明" />
            </el-form-item>
          </div>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitDialog">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <el-drawer v-model="detailVisible" title="工序定义详情" size="760px">
        <template v-if="currentDetail">
          <div class="detail-shell">
            <div class="detail-hero">
              <div>
                <div class="detail-title">{{ currentDetail.name }}</div>
                <div class="detail-subtitle">{{ currentDetail.code }} · {{ getOptionLabel(categoryOptions, currentDetail.operationCategory) }}</div>
              </div>
              <StatusTag :value="currentDetail.status" :options="statusOptions" />
            </div>

            <div class="detail-grid">
              <section class="detail-card">
                <div class="detail-card__title">基础信息</div>
                <div class="detail-item">
                  <span>默认工作中心</span><strong>{{ currentDetail.defaultWorkCenter }}</strong>
                </div>
                <div class="detail-item">
                  <span>默认技能要求</span><strong>{{ currentDetail.defaultSkill }}</strong>
                </div>
                <div class="detail-item">
                  <span>最新变更单</span><strong>{{ currentDetail.latestChangeOrder }}</strong>
                </div>
                <div class="detail-item">
                  <span>维护人</span><strong>{{ currentDetail.updatedBy }} / {{ currentDetail.updatedAt }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">工时与资源</div>
                <div class="detail-item">
                  <span>准备工时</span><strong>{{ currentDetail.setupMinutes }} 分</strong>
                </div>
                <div class="detail-item">
                  <span>加工工时</span><strong>{{ currentDetail.runMinutes }} 分</strong>
                </div>
                <div class="detail-item">
                  <span>排队工时</span><strong>{{ currentDetail.queueMinutes }} 分</strong>
                </div>
                <div class="detail-item">
                  <span>转运工时</span><strong>{{ currentDetail.moveMinutes }} 分</strong>
                </div>
                <div class="detail-item">
                  <span>标准人数</span><strong>{{ currentDetail.workers }} 人</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">质量与报工约束</div>
                <div class="detail-item">
                  <span>质检模式</span><strong>{{ getOptionLabel(qcModeOptions, currentDetail.qcMode) }}</strong>
                </div>
                <div class="detail-item">
                  <span>报工模式</span><strong>{{ getOptionLabel(reportModeOptions, currentDetail.reportMode) }}</strong>
                </div>
                <div class="detail-item">
                  <span>委外工序</span><strong>{{ currentDetail.isOutsourced ? '是' : '否' }}</strong>
                </div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.controlPoints" :key="item" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">上下游关联</div>
                <div class="detail-item">
                  <span>关联工艺路线</span><strong>{{ currentDetail.routeCount }} 个版本</strong>
                </div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.releasedRoutingCodes" :key="item" type="success" effect="light" round>{{ item }}</el-tag>
                </div>
                <div class="detail-item">
                  <span>影响 BOM 版本</span><strong>{{ currentDetail.linkedBomVersions.length }} 个</strong>
                </div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.linkedBomVersions" :key="item" type="primary" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>
            </div>

            <section class="detail-card detail-card--full">
              <div class="detail-card__title">工序说明</div>
              <p class="detail-description">{{ currentDetail.description }}</p>
            </section>
          </div>
        </template>
      </el-drawer>
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type OperationStatus = 'draft' | 'pending_approval' | 'active' | 'disabled'
type OperationCategory = 'machining' | 'assembly' | 'inspection' | 'outsource'
type QcMode = 'none' | 'sampling' | 'required'
type ReportMode = 'single' | 'batch' | 'milestone'

interface OptionItem {
  value: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface OperationDefinition {
  id: string
  code: string
  name: string
  operationCategory: OperationCategory
  defaultWorkCenter: string
  defaultSkill: string
  setupMinutes: number
  runMinutes: number
  queueMinutes: number
  moveMinutes: number
  workers: number
  qcMode: QcMode
  reportMode: ReportMode
  isOutsourced: boolean
  status: OperationStatus
  routeCount: number
  releasedRoutingCodes: string[]
  linkedBomVersions: string[]
  latestChangeOrder: string
  controlPoints: string[]
  description: string
  updatedBy: string
  updatedAt: string
}

const categoryOptions: OptionItem[] = [
  { value: 'machining', label: '机加工' },
  { value: 'assembly', label: '装配' },
  { value: 'inspection', label: '检验' },
  { value: 'outsource', label: '委外协同' }
]

const qcModeOptions: OptionItem[] = [
  { value: 'none', label: '无质检关卡' },
  { value: 'sampling', label: '抽检放行' },
  { value: 'required', label: '必检放行' }
]

const reportModeOptions: OptionItem[] = [
  { value: 'single', label: '单件报工' },
  { value: 'batch', label: '批次报工' },
  { value: 'milestone', label: '里程碑报工' }
]

const statusOptions: OptionItem[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'pending_approval', label: '待审批', type: 'warning' },
  { value: 'active', label: '已发布', type: 'success' },
  { value: 'disabled', label: '已停用', type: 'warning' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工序编码 / 工序名称 / 工作中心' } as never },
  {
    type: 'select-v2',
    label: '工序分类',
    field: 'operationCategory',
    props: {
      options: [{ label: '全部', value: '' }, ...categoryOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  },
  {
    type: 'select-v2',
    label: '质检模式',
    field: 'qcMode',
    props: {
      options: [{ label: '全部', value: '' }, ...qcModeOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [{ label: '全部', value: '' }, ...statusOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<OperationDefinition>[] = [
  { prop: 'code', label: '工序编码', minWidth: 130 },
  { prop: 'name', label: '工序名称', minWidth: 160 },
  { label: '工序分类', minWidth: 110, align: 'center', slotName: 'operationCategory' },
  { prop: 'defaultWorkCenter', label: '默认工作中心', minWidth: 150 },
  { label: '质检模式', minWidth: 120, align: 'center', slotName: 'qcMode' },
  { label: '关联路线', minWidth: 100, align: 'center', slotName: 'routeCount' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'updatedBy', label: '维护人', minWidth: 100 },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const records = ref<OperationDefinition[]>([
  {
    id: 'OP-010',
    code: 'OP-010',
    name: '壳体清洗',
    operationCategory: 'assembly',
    defaultWorkCenter: '装配清洗工位',
    defaultSkill: '装配钳工',
    setupMinutes: 8,
    runMinutes: 12,
    queueMinutes: 4,
    moveMinutes: 2,
    workers: 1,
    qcMode: 'none',
    reportMode: 'single',
    isOutsourced: false,
    status: 'active',
    routeCount: 2,
    releasedRoutingCodes: ['RT-2101-V2.0', 'RT-2101-V2.1'],
    linkedBomVersions: ['EBOM V2.4', 'MBOM V1.2'],
    latestChangeOrder: 'ECN-202607-004',
    controlPoints: ['首件确认', '清洗防锈'],
    description: '定义主装前的壳体清洗标准工序，供工艺路线复用并被 MES 报工直接消费。',
    updatedBy: '周工艺',
    updatedAt: '2026-07-14 09:20'
  },
  {
    id: 'OP-020',
    code: 'OP-020',
    name: '核心组件预组',
    operationCategory: 'assembly',
    defaultWorkCenter: '主装工位',
    defaultSkill: '装配钳工',
    setupMinutes: 10,
    runMinutes: 16,
    queueMinutes: 4,
    moveMinutes: 2,
    workers: 2,
    qcMode: 'required',
    reportMode: 'batch',
    isOutsourced: false,
    status: 'pending_approval',
    routeCount: 1,
    releasedRoutingCodes: ['RT-2101-V2.1'],
    linkedBomVersions: ['EBOM V2.4'],
    latestChangeOrder: 'ECN-202607-001',
    controlPoints: ['中间质检关卡', '扭矩确认'],
    description: '在总成装配前完成关键组件预组与参数确认，后续 QMS 过程检验直接挂接该工序。',
    updatedBy: '李工艺',
    updatedAt: '2026-07-13 16:45'
  },
  {
    id: 'OP-030',
    code: 'OP-030',
    name: '整机联调',
    operationCategory: 'inspection',
    defaultWorkCenter: '测试组',
    defaultSkill: '测试操作',
    setupMinutes: 12,
    runMinutes: 24,
    queueMinutes: 6,
    moveMinutes: 3,
    workers: 2,
    qcMode: 'required',
    reportMode: 'milestone',
    isOutsourced: false,
    status: 'active',
    routeCount: 2,
    releasedRoutingCodes: ['RT-2101-V2.0', 'RT-1888-V1.8'],
    linkedBomVersions: ['MBOM V1.2', 'EBOM V3.1'],
    latestChangeOrder: 'ECN-202606-017',
    controlPoints: ['性能判定', '终检放行'],
    description: '作为完工前的里程碑工序，用于统一联调、终检和放行的上游工艺定义。',
    updatedBy: '陈工艺',
    updatedAt: '2026-07-12 14:10'
  },
  {
    id: 'OP-040',
    code: 'OP-040',
    name: '热处理委外',
    operationCategory: 'outsource',
    defaultWorkCenter: '热处理协同',
    defaultSkill: '委外协调',
    setupMinutes: 6,
    runMinutes: 0,
    queueMinutes: 30,
    moveMinutes: 15,
    workers: 1,
    qcMode: 'sampling',
    reportMode: 'batch',
    isOutsourced: true,
    status: 'draft',
    routeCount: 1,
    releasedRoutingCodes: ['RT-1001-V1.0'],
    linkedBomVersions: ['MBOM V1.0'],
    latestChangeOrder: 'ECN-202607-006',
    controlPoints: ['回厂复验', '批次一致性'],
    description: '定义外协热处理工序的默认约束，供 MES 委外任务和回厂质检共同引用。',
    updatedBy: '王工艺',
    updatedAt: '2026-07-14 10:05'
  }
])

const queryParams = reactive({
  keyword: '',
  operationCategory: '',
  qcMode: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const detailVisible = ref(false)
const currentDetail = ref<OperationDefinition | null>(null)
const formRef = ref<FormInstance>()
const dialogForm = reactive(createDefaultForm())

const formRules: FormRules = {
  code: [{ required: true, message: '请输入工序编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
  operationCategory: [{ required: true, message: '请选择工序分类', trigger: 'change' }],
  defaultWorkCenter: [{ required: true, message: '请输入默认工作中心', trigger: 'blur' }],
  defaultSkill: [{ required: true, message: '请输入默认技能要求', trigger: 'blur' }],
  qcMode: [{ required: true, message: '请选择质检模式', trigger: 'change' }],
  reportMode: [{ required: true, message: '请选择报工模式', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const filteredRecords = computed(() =>
  records.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.code.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword) ||
      item.defaultWorkCenter.toLowerCase().includes(keyword)

    const matchCategory = !queryParams.operationCategory || item.operationCategory === queryParams.operationCategory
    const matchQcMode = !queryParams.qcMode || item.qcMode === queryParams.qcMode
    const matchStatus = !queryParams.status || item.status === queryParams.status

    return matchKeyword && matchCategory && matchQcMode && matchStatus
  })
)

const overviewCards = computed(() => {
  const activeCount = records.value.filter((item) => item.status === 'active').length
  const qcCount = records.value.filter((item) => item.qcMode === 'required').length
  const routeCount = records.value.reduce((sum, item) => sum + item.routeCount, 0)

  return [
    { label: '工序定义总量', value: records.value.length, desc: '当前纳入 PLM 定义链的标准工序对象数量' },
    { label: '已发布工序', value: activeCount, desc: '已可被 MES / QMS / APS 下游页面直接消费的工序定义' },
    { label: '必检工序', value: qcCount, desc: '静态阶段已明确必须挂接质量放行约束的工序数量' },
    { label: '关联路线版本', value: routeCount, desc: '用于表达工序定义与工艺路线、版本切换的上游关系密度' }
  ]
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<OperationDefinition>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    records.value = records.value.filter((item) => !ids.includes(String(item.id)))
  }
})

function createDefaultForm() {
  return {
    id: '',
    code: '',
    name: '',
    operationCategory: 'assembly' as OperationCategory,
    defaultWorkCenter: '',
    defaultSkill: '',
    setupMinutes: 0,
    runMinutes: 0,
    queueMinutes: 0,
    moveMinutes: 0,
    workers: 1,
    qcMode: 'none' as QcMode,
    reportMode: 'single' as ReportMode,
    isOutsourced: false,
    status: 'draft' as OperationStatus,
    routeCount: 0,
    releasedRoutingCodes: [] as string[],
    linkedBomVersions: [] as string[],
    latestChangeOrder: '待发布',
    controlPoints: [] as string[],
    description: '',
    updatedBy: '当前用户',
    updatedAt: '2026-07-14 00:00'
  }
}

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((item) => item.value === value)?.label || value || '-'
}

function getRowActions(row: OperationDefinition): CrudRowActionItem[] {
  return [
    { key: 'detail', label: '查看详情', tone: 'primary' },
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: row.status === 'disabled' ? 'enable' : 'disable', label: row.status === 'disabled' ? '启用' : '停用', tone: 'warning' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    operationCategory: '',
    qcMode: '',
    status: ''
  })
  search()
}

function assignForm(record: ReturnType<typeof createDefaultForm>) {
  Object.assign(dialogForm, createDefaultForm(), record)
}

function openAdd() {
  dialogMode.value = 'add'
  assignForm(createDefaultForm())
  dialogVisible.value = true
}

function openEdit(row: OperationDefinition) {
  dialogMode.value = 'edit'
  assignForm({
    ...createDefaultForm(),
    ...row,
    releasedRoutingCodes: [...row.releasedRoutingCodes],
    linkedBomVersions: [...row.linkedBomVersions],
    controlPoints: [...row.controlPoints]
  })
  dialogVisible.value = true
}

function openDetail(row: OperationDefinition) {
  currentDetail.value = {
    ...row,
    releasedRoutingCodes: [...row.releasedRoutingCodes],
    linkedBomVersions: [...row.linkedBomVersions],
    controlPoints: [...row.controlPoints]
  }
  detailVisible.value = true
}

async function submitDialog() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload: OperationDefinition = {
    ...dialogForm,
    updatedBy: '工艺工程师',
    updatedAt: '2026-07-14 11:30',
    controlPoints: dialogForm.qcMode === 'required' ? ['质量放行', '报工校验'] : dialogForm.qcMode === 'sampling' ? ['抽样复验'] : ['标准报工'],
    releasedRoutingCodes: dialogForm.releasedRoutingCodes.length ? [...dialogForm.releasedRoutingCodes] : [],
    linkedBomVersions: dialogForm.linkedBomVersions.length ? [...dialogForm.linkedBomVersions] : []
  }

  const duplicated = records.value.find((item) => item.code === payload.code && item.id !== payload.id)
  if (duplicated) {
    ElMessage.warning('工序编码已存在，请调整后重试')
    return
  }

  if (dialogMode.value === 'add') {
    payload.id = payload.code
    payload.latestChangeOrder = '待发布'
    records.value.unshift(payload)
    ElMessage.success('已新增静态工序定义')
  } else {
    const index = records.value.findIndex((item) => item.id === payload.id)
    if (index >= 0) {
      records.value[index] = payload
    }
    if (currentDetail.value?.id === payload.id) {
      currentDetail.value = { ...payload }
    }
    ElMessage.success('已更新静态工序定义')
  }

  dialogVisible.value = false
  search()
}

async function toggleStatus(row: OperationDefinition, target: OperationStatus) {
  row.status = target
  if (currentDetail.value?.id === row.id) {
    currentDetail.value = { ...row }
  }
  ElMessage.success(target === 'disabled' ? '已停用工序定义' : '已启用工序定义')
}

async function handleDelete(row: OperationDefinition) {
  await ElMessageBox.confirm(`确认删除工序定义「${row.name}」吗？`, '删除确认', { type: 'warning' })
  onDelete(row)
  if (currentDetail.value?.id === row.id) {
    detailVisible.value = false
    currentDetail.value = null
  }
}

async function handleRowAction(action: string, row: OperationDefinition) {
  if (action === 'detail') {
    openDetail(row)
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'enable') {
    await toggleStatus(row, 'active')
    return
  }

  if (action === 'disable') {
    await toggleStatus(row, 'disabled')
    return
  }

  if (action === 'delete') {
    await handleDelete(row)
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
  margin-top: 6px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.overview-desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  font-size: 12px;
}

.form-section + .form-section {
  margin-top: 12px;
}

.form-section__title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
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
  margin: 0;
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

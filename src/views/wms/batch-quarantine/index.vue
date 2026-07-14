<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="批次隔离"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <el-row :gutter="16" class="summary-row">
        <el-col v-for="item in summaryCards" :key="item.label" :xs="24" :sm="12" :lg="6">
          <el-card shadow="hover" class="summary-card">
            <div class="summary-card__label">{{ item.label }}</div>
            <div class="summary-card__value" :style="{ color: item.color }">{{ item.value }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-card header="QMS / WMS 裁决桥接" shadow="never" class="bridge-card">
        <div class="bridge-note">WMS 负责批次冻结、隔离范围和库存控制，QMS 负责质量裁决结论。当前页面只消费质量裁决结果，不在这里定义质量真相。</div>

        <el-row :gutter="16">
          <el-col :xs="24" :lg="14">
            <div class="bridge-section">
              <div v-for="item in bridgeSteps" :key="item.title" class="bridge-step">
                <div class="bridge-step__header">
                  <span class="bridge-step__title">{{ item.title }}</span>
                  <el-tag size="small" :type="item.type">{{ item.owner }}</el-tag>
                </div>
                <div class="bridge-step__desc">{{ item.description }}</div>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :lg="10">
            <div class="bridge-section">
              <div class="bridge-section__title">待处理桥接批次</div>
              <div v-for="item in bridgeRows" :key="item.id" class="bridge-row">
                <div class="bridge-row__header">
                  <span class="bridge-row__code">{{ item.code }}</span>
                  <span class="bridge-row__batch">{{ item.batchCode }}</span>
                </div>
                <div class="bridge-row__name">{{ item.materialName }}</div>
                <div class="bridge-row__tags">
                  <el-tag size="small" :type="getStatusTagType(item.status)">{{ statusLabelMap[item.status] }}</el-tag>
                  <el-tag size="small" :type="getDecisionTagType(item.qualityDecision)">{{ decisionLabelMap[item.qualityDecision] }}</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <template #quarantineType="{ row }">
      <el-tag size="small" effect="light" type="info">
        {{ quarantineTypeLabelMap[row.quarantineType] || row.quarantineType }}
      </el-tag>
    </template>

    <template #status="{ row }">
      <el-tag size="small" :type="getStatusTagType(row.status)">
        {{ statusLabelMap[row.status] || row.status }}
      </el-tag>
    </template>

    <template #qualityDecision="{ row }">
      <el-tag size="small" :type="getDecisionTagType(row.qualityDecision)">
        {{ decisionLabelMap[row.qualityDecision] || row.qualityDecision }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <BatchQuarantineFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import BatchQuarantineFormDialog, { type BatchQuarantineFormModel } from './BatchQuarantineFormDialog.vue'

type QuarantineStatus = 'quarantined' | 'frozen' | 'waiting_release' | 'released' | 'disposed'
type QualityDecision = 'pending' | 'allow_release' | 'keep_quarantine' | 'scrap'
type QuarantineType = 'incoming' | 'process' | 'finished' | 'customer-return'

interface QuarantineRow {
  id: string
  code: string
  batchCode: string
  materialCode: string
  materialName: string
  warehouse: string
  location: string
  quarantineType: QuarantineType
  sourceDocument: string
  status: QuarantineStatus
  qualityDecision: QualityDecision
  createdAt: string
}

const quarantineRows = ref<QuarantineRow[]>([
  {
    id: '1',
    code: 'GL20260714001',
    batchCode: 'LOT-20260714-001',
    materialCode: '01.01.001-00001',
    materialName: '45#圆钢',
    warehouse: '原材料仓',
    location: 'A-01-01',
    quarantineType: 'incoming',
    sourceDocument: 'IQC20260714001',
    status: 'quarantined',
    qualityDecision: 'pending',
    createdAt: '2026-07-14 09:20:00'
  },
  {
    id: '2',
    code: 'GL20260713002',
    batchCode: 'LOT-20260713-006',
    materialCode: '02.01.002-00001',
    materialName: '机械密封 M37G-55',
    warehouse: '标准件仓',
    location: 'C-03-02',
    quarantineType: 'process',
    sourceDocument: 'IPQC20260713008',
    status: 'waiting_release',
    qualityDecision: 'allow_release',
    createdAt: '2026-07-13 14:30:00'
  },
  {
    id: '3',
    code: 'GL20260712003',
    batchCode: 'LOT-20260712-011',
    materialCode: '04.01.001-00001',
    materialName: '离心泵 XJP-100',
    warehouse: '成品仓',
    location: 'F-01-03',
    quarantineType: 'finished',
    sourceDocument: 'FQC20260712003',
    status: 'frozen',
    qualityDecision: 'keep_quarantine',
    createdAt: '2026-07-12 16:10:00'
  },
  {
    id: '4',
    code: 'GL20260711004',
    batchCode: 'LOT-20260711-003',
    materialCode: '03.02.001-00008',
    materialName: '阀体铸件',
    warehouse: '原材料仓',
    location: 'B-02-01',
    quarantineType: 'customer-return',
    sourceDocument: 'RTN20260711001',
    status: 'waiting_release',
    qualityDecision: 'scrap',
    createdAt: '2026-07-11 11:40:00'
  },
  {
    id: '5',
    code: 'GL20260710005',
    batchCode: 'LOT-20260710-002',
    materialCode: '01.01.003-00001',
    materialName: '泵轴 45#',
    warehouse: '半成品仓',
    location: 'D-02-01',
    quarantineType: 'process',
    sourceDocument: 'IPQC20260710009',
    status: 'released',
    qualityDecision: 'allow_release',
    createdAt: '2026-07-10 10:15:00'
  }
])

const statusLabelMap: Record<QuarantineStatus, string> = {
  quarantined: '隔离中',
  frozen: '冻结中',
  waiting_release: '待放行',
  released: '已放行',
  disposed: '已处置'
}

const decisionLabelMap: Record<QualityDecision, string> = {
  pending: '待裁决',
  allow_release: '允收放行',
  keep_quarantine: '继续隔离',
  scrap: '报废处置'
}

const quarantineTypeLabelMap: Record<QuarantineType, string> = {
  incoming: '来料隔离',
  process: '制程隔离',
  finished: '成品隔离',
  'customer-return': '客退隔离'
}

const warehouseOptions = ['原材料仓', '标准件仓', '半成品仓', '成品仓'].map((item) => ({
  label: item,
  value: item
}))

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: {
      placeholder: '请输入隔离单号 / 批次号 / 物料名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: warehouseOptions,
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '隔离状态',
    field: 'status',
    props: {
      options: Object.entries(statusLabelMap).map(([value, label]) => ({ value, label })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '质量裁决',
    field: 'qualityDecision',
    props: {
      options: Object.entries(decisionLabelMap).map(([value, label]) => ({ value, label })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<QuarantineRow>[] = [
  { prop: 'code', label: '隔离单号', minWidth: 150 },
  { prop: 'batchCode', label: '批次号', minWidth: 160 },
  { prop: 'materialName', label: '物料名称', minWidth: 160 },
  { prop: 'warehouse', label: '仓库', width: 110 },
  { prop: 'location', label: '库位', width: 100 },
  { label: '隔离类型', minWidth: 110, slotName: 'quarantineType', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '质量裁决', minWidth: 110, slotName: 'qualityDecision', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 220, slotName: 'actions', fixed: 'right', align: 'center' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]

const queryParams = ref({
  keyword: '',
  warehouse: '',
  status: '',
  qualityDecision: ''
})

const summaryCards = computed(() => {
  const rows = quarantineRows.value
  return [
    { label: '隔离中批次', value: String(rows.filter((item) => item.status === 'quarantined').length), color: '#e6a23c' },
    { label: '冻结中批次', value: String(rows.filter((item) => item.status === 'frozen').length), color: '#f56c6c' },
    { label: '待质量回写', value: String(rows.filter((item) => item.qualityDecision === 'pending').length), color: '#409eff' },
    { label: '已完成处置', value: String(rows.filter((item) => ['released', 'disposed'].includes(item.status)).length), color: '#67c23a' }
  ]
})

const bridgeSteps = [
  {
    title: 'WMS 发起隔离',
    owner: 'WMS',
    type: 'primary' as const,
    description: '在仓储侧冻结批次、限定库存可用范围，并记录隔离位置与来源单据。'
  },
  {
    title: 'QMS 输出裁决',
    owner: 'QMS',
    type: 'success' as const,
    description: 'QMS 给出允收放行、继续隔离或报废处置等质量结论，WMS 不在此页定义结论。'
  },
  {
    title: 'WMS 执行放行 / 处置',
    owner: 'WMS',
    type: 'warning' as const,
    description: 'WMS 根据 QMS 已输出的结论执行解冻放行、继续冻结或库存处置动作。'
  }
]

const bridgeRows = computed(() =>
  quarantineRows.value.filter((item) => ['quarantined', 'frozen', 'waiting_release'].includes(item.status)).slice(0, 4)
)

const { tableData, pagination, loading, search, refresh } = useTable<QuarantineRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...quarantineRows.value]

    if (queryParams.value.keyword) {
      const keyword = queryParams.value.keyword.trim()
      filtered = filtered.filter((item) => [item.code, item.batchCode, item.materialName, item.materialCode].some((field) => field.includes(keyword)))
    }

    if (queryParams.value.warehouse) {
      filtered = filtered.filter((item) => item.warehouse === queryParams.value.warehouse)
    }

    if (queryParams.value.status) {
      filtered = filtered.filter((item) => item.status === queryParams.value.status)
    }

    if (queryParams.value.qualityDecision) {
      filtered = filtered.filter((item) => item.qualityDecision === queryParams.value.qualityDecision)
    }

    const start = (page - 1) * size
    const end = start + size

    return {
      list: filtered.slice(start, end),
      total: filtered.length
    }
  }
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<BatchQuarantineFormModel>(createDefaultForm())

function createDefaultForm(): BatchQuarantineFormModel {
  return {
    id: '',
    code: createQuarantineCode(),
    batchCode: '',
    materialCode: '',
    materialName: '',
    warehouse: warehouseOptions[0].value,
    location: '',
    quarantineType: 'incoming',
    sourceDocument: ''
  }
}

function createQuarantineCode() {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const seq = String(quarantineRows.value.length + 1).padStart(3, '0')
  return `GL${date}${seq}`
}

function handleReset() {
  queryParams.value = {
    keyword: '',
    warehouse: '',
    status: '',
    qualityDecision: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('导出成功')
  }
}

function getStatusTagType(status: QuarantineStatus) {
  if (status === 'quarantined') return 'warning'
  if (status === 'frozen') return 'danger'
  if (status === 'waiting_release') return 'primary'
  if (status === 'released') return 'success'
  return 'info'
}

function getDecisionTagType(decision: QualityDecision) {
  if (decision === 'pending') return 'info'
  if (decision === 'allow_release') return 'success'
  if (decision === 'keep_quarantine') return 'warning'
  return 'danger'
}

function getRowActions(row: QuarantineRow): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'freeze', label: '冻结确认', tone: 'danger', hidden: row.status !== 'quarantined' },
    { key: 'submitRelease', label: '提交放行申请', tone: 'secondary', hidden: !['quarantined', 'frozen'].includes(row.status) },
    {
      key: 'release',
      label: '执行放行',
      tone: 'success',
      hidden: !(row.status === 'waiting_release' && row.qualityDecision === 'allow_release')
    },
    {
      key: 'keepQuarantine',
      label: '继续隔离',
      tone: 'warning',
      hidden: !(row.status === 'waiting_release' && row.qualityDecision === 'keep_quarantine')
    },
    {
      key: 'dispose',
      label: '执行处置',
      tone: 'danger',
      hidden: !(row.status === 'waiting_release' && row.qualityDecision === 'scrap')
    }
  ]
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: QuarantineRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    batchCode: row.batchCode,
    materialCode: row.materialCode,
    materialName: row.materialName,
    warehouse: row.warehouse,
    location: row.location,
    quarantineType: row.quarantineType,
    sourceDocument: row.sourceDocument
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: QuarantineRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'freeze') {
    row.status = 'frozen'
    ElMessage.success('批次已冻结，等待质量裁决')
    return
  }

  if (action === 'submitRelease') {
    row.status = 'waiting_release'
    ElMessage.success('已提交放行申请，等待 QMS 回写裁决')
    return
  }

  if (action === 'release') {
    row.status = 'released'
    ElMessage.success('批次已放行，可恢复库存使用')
    return
  }

  if (action === 'keepQuarantine') {
    row.status = 'frozen'
    ElMessage.success('已按质量裁决继续隔离')
    return
  }

  if (action === 'dispose') {
    row.status = 'disposed'
    ElMessage.success('批次已完成处置')
  }
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    quarantineRows.value.unshift({
      id: Date.now().toString(),
      code: formModel.value.code,
      batchCode: formModel.value.batchCode,
      materialCode: formModel.value.materialCode,
      materialName: formModel.value.materialName,
      warehouse: formModel.value.warehouse,
      location: formModel.value.location,
      quarantineType: formModel.value.quarantineType as QuarantineType,
      sourceDocument: formModel.value.sourceDocument,
      status: 'quarantined',
      qualityDecision: 'pending',
      createdAt: new Date().toLocaleString('zh-CN')
    })
    ElMessage.success('批次隔离记录创建成功')
  } else {
    const current = quarantineRows.value.find((item) => item.id === formModel.value.id)
    if (current) {
      current.code = formModel.value.code
      current.batchCode = formModel.value.batchCode
      current.materialCode = formModel.value.materialCode
      current.materialName = formModel.value.materialName
      current.warehouse = formModel.value.warehouse
      current.location = formModel.value.location
      current.quarantineType = formModel.value.quarantineType as QuarantineType
      current.sourceDocument = formModel.value.sourceDocument
    }
    ElMessage.success('批次隔离记录更新成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
.summary-row {
  margin-bottom: 16px;
}

.summary-card :deep(.el-card__body) {
  padding: 16px;
  text-align: center;
}

.summary-card__label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.summary-card__value {
  font-size: 28px;
  font-weight: 700;
}

.bridge-card {
  margin-bottom: 16px;
}

.bridge-note {
  margin-bottom: 16px;
  color: #475569;
  line-height: 1.7;
}

.bridge-section {
  height: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fbfdff;
}

.bridge-section__title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.bridge-step + .bridge-step,
.bridge-row + .bridge-row {
  margin-top: 12px;
}

.bridge-step,
.bridge-row {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.bridge-step__header,
.bridge-row__header,
.bridge-row__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bridge-step__header {
  justify-content: space-between;
}

.bridge-step__title,
.bridge-row__code {
  font-weight: 600;
  color: #1f2937;
}

.bridge-step__desc,
.bridge-row__name,
.bridge-row__batch {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .bridge-section {
    margin-bottom: 12px;
  }
}
</style>

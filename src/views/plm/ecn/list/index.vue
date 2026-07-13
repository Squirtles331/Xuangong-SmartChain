<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="工程变更"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新建变更单"
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

    <template #urgency="{ row }">
      <StatusTag :value="row.urgency" :options="ecnUrgencyOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="ecnStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ECNFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
      <ECNImpactDialog v-model:visible="impactVisible" v-model:data="impactData" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import ECNFormDialog, { type ECNFormModel } from './ECNFormDialog.vue'
import ECNImpactDialog, { type ECNImpactModel } from './ECNImpactDialog.vue'

interface ECNOrder {
  id: string
  code: string
  change_type: 'BOM变更' | '工艺变更' | 'BOM+工艺变更'
  material: string
  current_version: string
  target_version: string
  status: 'draft' | 'pending_approval' | 'approved' | 'executing' | 'verified' | 'closed'
  urgency: 'urgent' | 'normal' | 'planned'
  applicant: string
  plan_effective_date: string
  impact_scope: string
  reason: string
  createdAt: string
}

const ecnUrgencyOptions = [
  { value: 'urgent', label: '紧急', type: 'danger' as const },
  { value: 'normal', label: '普通', type: 'warning' as const },
  { value: 'planned', label: '计划', type: 'info' as const }
]

const ecnStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'pending_approval', label: '待审批', type: 'warning' as const },
  { value: 'approved', label: '已批准', type: 'primary' as const },
  { value: 'executing', label: '执行中', type: 'warning' as const },
  { value: 'verified', label: '已验证', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const ecnRecords = ref<ECNOrder[]>([
  {
    id: 'ECN-001',
    code: 'ECN-202607-001',
    change_type: 'BOM+工艺变更',
    material: '供液控制总成',
    current_version: 'EBOM V2.3 / RT V2.0',
    target_version: 'EBOM V2.4 / RT V2.1',
    status: 'pending_approval',
    urgency: 'urgent',
    applicant: '李工艺',
    plan_effective_date: '2026-07-18',
    impact_scope: '在制工单 / 原材料库存 / 工艺路线',
    reason: '新增密封结构，解决现场渗漏问题',
    createdAt: '2026-07-12 15:36'
  },
  {
    id: 'ECN-002',
    code: 'ECN-202607-002',
    change_type: '工艺变更',
    material: '壳体粗加工件',
    current_version: 'RT V1.0',
    target_version: 'RT V1.1',
    status: 'approved',
    urgency: 'normal',
    applicant: '周制造',
    plan_effective_date: '2026-07-16',
    impact_scope: '工时参数 / 工序顺序 / 质检关卡',
    reason: '缩短排队工时并新增中间检验点',
    createdAt: '2026-07-11 10:22'
  },
  {
    id: 'ECN-003',
    code: 'ECN-202607-003',
    change_type: 'BOM变更',
    material: '真空模组总成',
    current_version: 'EBOM V3.1',
    target_version: 'EBOM V3.2',
    status: 'executing',
    urgency: 'planned',
    applicant: '陈设计',
    plan_effective_date: '2026-07-20',
    impact_scope: '采购替代料 / 装配辅料 / 现场切换',
    reason: '替换老版本密封辅料，收敛供应风险',
    createdAt: '2026-07-10 18:08'
  },
  {
    id: 'ECN-004',
    code: 'ECN-202607-004',
    change_type: 'BOM变更',
    material: '供液控制总成',
    current_version: 'MBOM V1.1',
    target_version: 'MBOM V1.2',
    status: 'verified',
    urgency: 'normal',
    applicant: '周制造',
    plan_effective_date: '2026-07-14',
    impact_scope: '领料口径 / 制造版本切换',
    reason: '制造口径结构与现场投料同步修正',
    createdAt: '2026-07-09 14:30'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '变更单号 / 对象 / 申请人' } as never },
  {
    type: 'select-v2',
    label: '变更类型',
    field: 'changeType',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'BOM变更', value: 'BOM变更' },
        { label: '工艺变更', value: '工艺变更' },
        { label: 'BOM+工艺变更', value: 'BOM+工艺变更' }
      ]
    } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: [{ label: '全部', value: '' }, ...ecnStatusOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  },
  {
    type: 'select-v2',
    label: '紧急程度',
    field: 'urgency',
    props: { options: [{ label: '全部', value: '' }, ...ecnUrgencyOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<ECNOrder>[] = [
  { prop: 'code', label: '变更单号', minWidth: 160 },
  { prop: 'change_type', label: '变更类型', minWidth: 120 },
  { prop: 'material', label: '变更对象', minWidth: 170 },
  { prop: 'current_version', label: '当前版本', minWidth: 160 },
  { prop: 'target_version', label: '目标版本', minWidth: 160 },
  { label: '紧急程度', minWidth: 100, slotName: 'urgency', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'plan_effective_date', label: '计划切换日期', minWidth: 130 },
  { prop: 'applicant', label: '申请人', minWidth: 100 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  changeType: '',
  status: '',
  urgency: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<ECNFormModel>(createDefaultFormModel())
const impactVisible = ref(false)
const impactData = ref<ECNImpactModel>({
  code: '',
  material: '',
  change_type: '',
  current_version: '',
  items: []
})

const filteredRecords = computed(() =>
  ecnRecords.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.code.toLowerCase().includes(keyword) ||
      item.material.toLowerCase().includes(keyword) ||
      item.applicant.toLowerCase().includes(keyword)
    const matchType = !queryParams.changeType || item.change_type === queryParams.changeType
    const matchStatus = !queryParams.status || item.status === queryParams.status
    const matchUrgency = !queryParams.urgency || item.urgency === queryParams.urgency
    return matchKeyword && matchType && matchStatus && matchUrgency
  })
)

const overviewCards = computed(() => {
  const approvalCount = ecnRecords.value.filter((item) => item.status === 'pending_approval').length
  const approvedCount = ecnRecords.value.filter((item) => item.status === 'approved').length
  const executingCount = ecnRecords.value.filter((item) => item.status === 'executing').length

  return [
    { label: '变更单总量', value: ecnRecords.value.length, desc: '产品结构与工艺版本切换的统一入口' },
    { label: '待审批', value: approvalCount, desc: '等待正式评审与放行决策的变更单' },
    { label: '待执行', value: approvedCount, desc: '已批准但尚未现场切换落地的变更单' },
    { label: '执行中', value: executingCount, desc: '已进入现场切换与验证闭环的变更单' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<ECNOrder>({
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

function createDefaultFormModel(): ECNFormModel {
  return {
    id: '',
    code: '',
    change_type: 'BOM变更',
    material: '',
    current_version: '',
    target_version: '',
    status: 'draft',
    urgency: 'normal',
    applicant: '',
    plan_effective_date: '',
    reason: ''
  }
}

function getRowActions(row: ECNOrder): CrudRowActionItem[] {
  return [
    { key: 'impact', label: '影响分析', tone: 'primary' },
    { key: 'edit', label: '编辑', tone: 'secondary', hidden: row.status !== 'draft' },
    { key: 'submit', label: '提交审批', tone: 'warning', hidden: row.status !== 'draft' },
    { key: 'execute', label: '执行', tone: 'success', hidden: row.status !== 'approved' },
    { key: 'verify', label: '验证', tone: 'success', hidden: row.status !== 'executing' },
    { key: 'close', label: '关闭', tone: 'danger', hidden: row.status !== 'verified' }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    changeType: '',
    status: '',
    urgency: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ECNOrder) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    change_type: row.change_type,
    material: row.material,
    current_version: row.current_version,
    target_version: row.target_version,
    status: row.status,
    urgency: row.urgency,
    applicant: row.applicant,
    plan_effective_date: row.plan_effective_date,
    reason: row.reason
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.material || !formModel.value.target_version) {
    ElMessage.warning('请完整填写变更单号、变更对象和目标版本')
    return
  }

  if (dialogMode.value === 'add') {
    ecnRecords.value.unshift({
      id: `ECN-${Date.now()}`,
      code: formModel.value.code,
      change_type: formModel.value.change_type as ECNOrder['change_type'],
      material: formModel.value.material,
      current_version: formModel.value.current_version,
      target_version: formModel.value.target_version,
      status: formModel.value.status as ECNOrder['status'],
      urgency: formModel.value.urgency as ECNOrder['urgency'],
      applicant: formModel.value.applicant || '待填写',
      plan_effective_date: formModel.value.plan_effective_date || '待排期',
      impact_scope: '待补充影响分析',
      reason: formModel.value.reason || '待补充变更原因',
      createdAt: '2026-07-13 23:58'
    })
    ElMessage.success('已新增静态 ECN 数据')
  } else {
    ecnRecords.value = ecnRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            code: formModel.value.code,
            change_type: formModel.value.change_type as ECNOrder['change_type'],
            material: formModel.value.material,
            current_version: formModel.value.current_version,
            target_version: formModel.value.target_version,
            status: formModel.value.status as ECNOrder['status'],
            urgency: formModel.value.urgency as ECNOrder['urgency'],
            applicant: formModel.value.applicant || '待填写',
            plan_effective_date: formModel.value.plan_effective_date || '待排期',
            reason: formModel.value.reason || '待补充变更原因'
          }
        : item
    )
    ElMessage.success('已更新静态 ECN 数据')
  }

  dialogVisible.value = false
  await refresh()
}

function viewImpact(row: ECNOrder) {
  impactData.value = {
    code: row.code,
    material: row.material,
    change_type: row.change_type,
    current_version: row.current_version,
    items: [
      { dimension: '在制工单', detail: `${row.material} 关联 2 张在制工单，需确认切换批次`, count: 2 },
      { dimension: '库存与在途', detail: '旧版本库存 86 件，在途采购 120 件', count: 206 },
      { dimension: '工艺路线', detail: `目标版本 ${row.target_version} 需要同步切换工艺路线`, count: 1 },
      { dimension: '质量验证', detail: '需补充首件确认与切换后验证记录', count: 1 }
    ]
  }
  impactVisible.value = true
}

function handleRowAction(action: string, row: ECNOrder) {
  if (action === 'impact') {
    viewImpact(row)
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'submit') {
    row.status = 'pending_approval'
    ElMessage.success('已提交变更审批')
    return
  }

  if (action === 'execute') {
    row.status = 'executing'
    ElMessage.success('已进入现场切换执行')
    return
  }

  if (action === 'verify') {
    row.status = 'verified'
    ElMessage.success('已完成切换验证')
    return
  }

  if (action === 'close') {
    row.status = 'closed'
    ElMessage.success('已关闭变更单')
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

@media (max-width: 1200px) {
  .page-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview {
    grid-template-columns: 1fr;
  }
}
</style>

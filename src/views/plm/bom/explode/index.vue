<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="用量展开与反查"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="tableColumns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    :show-add-button="false"
    @search="handleSearch"
    @reset="handleReset"
    @refresh="handleRefresh"
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

      <div class="analysis-switch">
        <span class="analysis-switch__label">视图模式</span>
        <el-radio-group v-model="activeMode" @change="handleModeChange">
          <el-radio-button label="explode">BOM 展开</el-radio-button>
          <el-radio-button label="whereUsed">反查引用</el-radio-button>
        </el-radio-group>
      </div>
    </template>

    <template #nodeType="{ row }">
      <el-tag effect="light" round>{{ row.nodeType || '-' }}</el-tag>
    </template>

    <template #supplyMode="{ row }">
      <StatusTag :value="row.supplyMode" :options="supplyModeOptions" />
    </template>

    <template #effectiveStatus="{ row }">
      <StatusTag :value="row.effectiveStatus" :options="effectiveStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <el-drawer v-model="detailVisible" :title="activeMode === 'explode' ? '结构节点详情' : '引用关系详情'" size="760px">
        <template v-if="currentDetail">
          <div class="detail-shell">
            <div class="detail-hero">
              <div>
                <div class="detail-title">{{ currentDetail.componentName || currentDetail.parentName }}</div>
                <div class="detail-subtitle">
                  {{ activeMode === 'explode' ? currentDetail.componentCode : currentDetail.parentCode }}
                  ·
                  {{
                    activeMode === 'explode' ? `层级 ${currentDetail.level}` : `${currentDetail.referenceBomType} ${currentDetail.referenceVersion}`
                  }}
                </div>
              </div>
              <StatusTag
                :value="activeMode === 'explode' ? currentDetail.supplyMode || 'purchase' : currentDetail.effectiveStatus || 'active'"
                :options="activeMode === 'explode' ? supplyModeOptions : effectiveStatusOptions"
              />
            </div>

            <div class="detail-grid">
              <section class="detail-card">
                <div class="detail-card__title">基础信息</div>
                <div v-if="activeMode === 'explode'" class="detail-item">
                  <span>节点类型</span><strong>{{ currentDetail.nodeType }}</strong>
                </div>
                <div v-if="activeMode === 'explode'" class="detail-item">
                  <span>单位用量</span><strong>{{ currentDetail.unitQty }}</strong>
                </div>
                <div v-if="activeMode === 'explode'" class="detail-item">
                  <span>需求总量</span><strong>{{ currentDetail.demandQty }}</strong>
                </div>
                <div v-if="activeMode === 'whereUsed'" class="detail-item">
                  <span>父项物料</span><strong>{{ currentDetail.parentCode }}</strong>
                </div>
                <div v-if="activeMode === 'whereUsed'" class="detail-item">
                  <span>引用数量</span><strong>{{ currentDetail.referenceQty }}</strong>
                </div>
                <div class="detail-item">
                  <span>变更单</span><strong>{{ currentDetail.changeOrder }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">版本与路线</div>
                <div class="detail-item">
                  <span>BOM 版本</span><strong>{{ currentBomLabel }}</strong>
                </div>
                <div class="detail-item">
                  <span>关联路线</span><strong>{{ currentDetail.routeBinding }}</strong>
                </div>
                <div class="detail-item">
                  <span>替代策略</span><strong>{{ currentDetail.replacementStrategy }}</strong>
                </div>
                <div class="detail-item" v-if="activeMode === 'whereUsed'">
                  <span>生效状态</span><strong>{{ getOptionLabel(effectiveStatusOptions, currentDetail.effectiveStatus || '') }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">库存与执行影响</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.inventoryImpacts" :key="item" type="warning" effect="light" round>{{ item }}</el-tag>
                </div>
                <p class="detail-description">{{ currentDetail.impactSummary }}</p>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">消费关系</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.consumedBy" :key="item" type="success" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>
            </div>
          </div>
        </template>
      </el-drawer>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type AnalysisMode = 'explode' | 'whereUsed'
type SupplyMode = 'purchase' | 'manufacture' | 'outsource'
type EffectiveStatus = 'active' | 'pending' | 'archived'

interface OptionItem {
  value: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface BomContext {
  id: string
  materialCode: string
  materialName: string
  bomType: 'EBOM' | 'MBOM'
  version: string
  routeBinding: string
  changeOrder: string
}

interface AnalysisRow {
  id: string
  level?: number
  componentCode?: string
  componentName?: string
  nodeType?: string
  supplyMode?: SupplyMode
  unitQty?: string
  demandQty?: string
  parentCode?: string
  parentName?: string
  referenceBomType?: string
  referenceVersion?: string
  referenceQty?: string
  effectiveStatus?: EffectiveStatus
  routeBinding: string
  replacementStrategy: string
  changeOrder: string
  impactSummary: string
  inventoryImpacts: string[]
  consumedBy: string[]
}

const bomContexts: BomContext[] = [
  {
    id: 'BOM-EB-1002',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'EBOM',
    version: 'V2.4',
    routeBinding: 'RT-2101-V2.1',
    changeOrder: 'ECN-202607-004'
  },
  {
    id: 'BOM-MB-2101',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'MBOM',
    version: 'V1.2',
    routeBinding: 'RT-2101-V2.0',
    changeOrder: 'ECN-202607-001'
  }
]

const explodeDataMap: Record<string, AnalysisRow[]> = {
  'BOM-EB-1002': [
    {
      id: 'EXP-001',
      level: 0,
      componentCode: 'FG-ASSY-2101',
      componentName: '供液控制总成',
      nodeType: '成品总成',
      supplyMode: 'manufacture',
      unitQty: '1',
      demandQty: '12',
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '总成版本切换',
      changeOrder: 'ECN-202607-004',
      impactSummary: '作为顶层总成节点，决定下游领料、装配与首件切换的统一口径。',
      inventoryImpacts: ['在制工单 2 张', '待切换库存 86 件'],
      consumedBy: ['MES 工单', 'WMS 领料', 'QMS 首件确认']
    },
    {
      id: 'EXP-002',
      level: 1,
      componentCode: 'SUB-ASSY-001',
      componentName: '密封组件',
      nodeType: '自制子装配',
      supplyMode: 'manufacture',
      unitQty: '1',
      demandQty: '12',
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '替换旧密封件组合',
      changeOrder: 'ECN-202607-004',
      impactSummary: '该节点变化会同步影响工艺路线扭矩确认和联调前质检关卡。',
      inventoryImpacts: ['旧组件收口', '首件样机复验'],
      consumedBy: ['工艺路线', '工序定义', 'ECN 影响分析']
    },
    {
      id: 'EXP-003',
      level: 2,
      componentCode: 'RM-FAST-021',
      componentName: '不锈钢卡箍',
      nodeType: '采购件',
      supplyMode: 'purchase',
      unitQty: '2',
      demandQty: '24',
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '新增标准件，进入首批切换池',
      changeOrder: 'ECN-202607-004',
      impactSummary: '新增采购件后需要同步新增领料与来料检验口径。',
      inventoryImpacts: ['新增安全库存', '补充来料检验'],
      consumedBy: ['WMS 领料', 'QMS 来料检验']
    },
    {
      id: 'EXP-004',
      level: 2,
      componentCode: 'RM-SRV-003',
      componentName: '热处理套筒',
      nodeType: '委外件',
      supplyMode: 'outsource',
      unitQty: '1',
      demandQty: '12',
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '沿用委外协同标准',
      changeOrder: 'ECN-202607-004',
      impactSummary: '委外件节点用于约束回厂复验和批次追溯深度。',
      inventoryImpacts: ['回厂复验', '批次追溯'],
      consumedBy: ['MES 委外任务', 'QMS 回厂检验']
    }
  ],
  'BOM-MB-2101': [
    {
      id: 'EXP-005',
      level: 0,
      componentCode: 'FG-ASSY-2101',
      componentName: '供液控制总成',
      nodeType: '制造总成',
      supplyMode: 'manufacture',
      unitQty: '1',
      demandQty: '8',
      routeBinding: 'RT-2101-V2.0',
      replacementStrategy: '按制造投料口径执行',
      changeOrder: 'ECN-202607-001',
      impactSummary: 'MBOM 结构用于驱动工单派工和现场领料真相。',
      inventoryImpacts: ['工单投料', '完工收口'],
      consumedBy: ['MES 工单', 'WMS 倒冲']
    }
  ]
}

const whereUsedDataMap: Record<string, AnalysisRow[]> = {
  'BOM-EB-1002': [
    {
      id: 'REF-001',
      parentCode: 'FG-LINE-9001',
      parentName: '供液总装单元',
      referenceBomType: 'EBOM',
      referenceVersion: 'V1.4',
      referenceQty: '1',
      effectiveStatus: 'active',
      routeBinding: 'RT-LINE-9001-V1.2',
      replacementStrategy: '随总装单元版本同步消费',
      changeOrder: 'ECN-202607-004',
      impactSummary: '父项总装单元仍引用该总成，需要同步评估整机交付切换窗口。',
      inventoryImpacts: ['整机在制 1 套', '交付窗口确认'],
      consumedBy: ['整机装配', '交付齐套']
    },
    {
      id: 'REF-002',
      parentCode: 'FG-MOD-5008',
      parentName: '注液功能模组',
      referenceBomType: 'MBOM',
      referenceVersion: 'V2.0',
      referenceQty: '2',
      effectiveStatus: 'pending',
      routeBinding: 'RT-MOD-5008-V2.0',
      replacementStrategy: '待 ECN 放行后切换',
      changeOrder: 'ECN-202607-004',
      impactSummary: '下游模组正在等待变更放行，引用版本仍需现场验证。',
      inventoryImpacts: ['待切换工单', '首件验证'],
      consumedBy: ['模组装配', '现场切换']
    }
  ],
  'BOM-MB-2101': [
    {
      id: 'REF-003',
      parentCode: 'WO-202607-021',
      parentName: '供液控制总成工单',
      referenceBomType: '工单投料',
      referenceVersion: '批次 A',
      referenceQty: '8',
      effectiveStatus: 'active',
      routeBinding: 'RT-2101-V2.0',
      replacementStrategy: '按工单冻结版本执行',
      changeOrder: 'ECN-202607-001',
      impactSummary: '该 MBOM 直接被在制工单引用，是现场领料与倒冲的依据。',
      inventoryImpacts: ['冻结投料', '完工倒冲'],
      consumedBy: ['领料执行', '完工入库']
    }
  ]
}

const supplyModeOptions: OptionItem[] = [
  { value: 'purchase', label: '采购', type: 'primary' },
  { value: 'manufacture', label: '自制', type: 'success' },
  { value: 'outsource', label: '委外', type: 'warning' }
]

const effectiveStatusOptions: OptionItem[] = [
  { value: 'active', label: '已生效', type: 'success' },
  { value: 'pending', label: '待切换', type: 'warning' },
  { value: 'archived', label: '已归档', type: 'info' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码 / 物料名称 / 变更单号' } as never },
  {
    type: 'select-v2',
    label: 'BOM 版本',
    field: 'versionId',
    props: {
      options: bomContexts.map((item) => ({
        label: `${item.materialCode} / ${item.bomType} ${item.version}`,
        value: item.id
      }))
    } as never
  },
  {
    type: 'select-v2',
    label: '节点筛选',
    field: 'nodeType',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '成品总成', value: '成品总成' },
        { label: '制造总成', value: '制造总成' },
        { label: '自制子装配', value: '自制子装配' },
        { label: '采购件', value: '采购件' },
        { label: '委外件', value: '委外件' }
      ]
    } as never
  },
  {
    type: 'select-v2',
    label: '供给方式',
    field: 'supplyMode',
    props: {
      options: [{ label: '全部', value: '' }, ...supplyModeOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const explodeColumns: TableColumnItem<AnalysisRow>[] = [
  { prop: 'level', label: '层级', minWidth: 70, align: 'center' },
  { prop: 'componentCode', label: '组件编码', minWidth: 140 },
  { prop: 'componentName', label: '组件名称', minWidth: 180 },
  { label: '节点类型', minWidth: 120, align: 'center', slotName: 'nodeType' },
  { label: '供给方式', minWidth: 100, align: 'center', slotName: 'supplyMode' },
  { prop: 'unitQty', label: '单位用量', minWidth: 100, align: 'center' },
  { prop: 'demandQty', label: '需求总量', minWidth: 100, align: 'center' },
  { prop: 'routeBinding', label: '关联路线', minWidth: 150 },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const whereUsedColumns: TableColumnItem<AnalysisRow>[] = [
  { prop: 'parentCode', label: '父项编码', minWidth: 140 },
  { prop: 'parentName', label: '父项名称', minWidth: 180 },
  { prop: 'referenceBomType', label: '引用类型', minWidth: 110, align: 'center' },
  { prop: 'referenceVersion', label: '引用版本', minWidth: 110, align: 'center' },
  { prop: 'referenceQty', label: '引用数量', minWidth: 100, align: 'center' },
  { label: '生效状态', minWidth: 100, align: 'center', slotName: 'effectiveStatus' },
  { prop: 'routeBinding', label: '关联路线', minWidth: 150 },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const rowActions: CrudRowActionItem[] = [{ key: 'detail', label: '查看详情', tone: 'primary' }]

const queryParams = reactive({
  keyword: '',
  versionId: 'BOM-EB-1002',
  nodeType: '',
  supplyMode: ''
})

const activeMode = ref<AnalysisMode>('explode')
const detailVisible = ref(false)
const currentDetail = ref<AnalysisRow | null>(null)

const currentBomContext = computed(() => bomContexts.find((item) => item.id === queryParams.versionId) || bomContexts[0])
const currentBomLabel = computed(() => `${currentBomContext.value.bomType} ${currentBomContext.value.version}`)

const activeRows = computed(() => {
  const sourceRows = activeMode.value === 'explode' ? explodeDataMap[queryParams.versionId] || [] : whereUsedDataMap[queryParams.versionId] || []

  return sourceRows.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const keywordTargets = [item.componentCode, item.componentName, item.parentCode, item.parentName, item.changeOrder]
      .filter(Boolean)
      .map((entry) => String(entry).toLowerCase())
    const matchKeyword = !keyword || keywordTargets.some((entry) => entry.includes(keyword))

    const matchNodeType = activeMode.value !== 'explode' || !queryParams.nodeType || item.nodeType === queryParams.nodeType
    const matchSupplyMode = activeMode.value !== 'explode' || !queryParams.supplyMode || item.supplyMode === queryParams.supplyMode

    return matchKeyword && matchNodeType && matchSupplyMode
  })
})

const overviewCards = computed(() => {
  if (activeMode.value === 'explode') {
    const topLevelCount = activeRows.value.filter((item) => item.level === 1 || item.level === 0).length
    const purchaseCount = activeRows.value.filter((item) => item.supplyMode === 'purchase').length
    const outsourceCount = activeRows.value.filter((item) => item.supplyMode === 'outsource').length

    return [
      { label: '结构节点数', value: activeRows.value.length, desc: '当前版本展开后纳入静态分析的结构节点数量' },
      {
        label: '顶层 / 子层',
        value: `${topLevelCount} / ${Math.max(activeRows.value.length - topLevelCount, 0)}`,
        desc: '用于快速判断结构层次与追溯深度'
      },
      { label: '采购件', value: purchaseCount, desc: '会直接影响来料、领料和库存预留口径的节点数量' },
      { label: '委外件', value: outsourceCount, desc: '需要同步约束委外协同和回厂检验的节点数量' }
    ]
  }

  const activeRefCount = activeRows.value.filter((item) => item.effectiveStatus === 'active').length
  const pendingRefCount = activeRows.value.filter((item) => item.effectiveStatus === 'pending').length

  return [
    { label: '引用父项数', value: activeRows.value.length, desc: '当前版本被上游对象引用的关系数量' },
    { label: '已生效引用', value: activeRefCount, desc: '已经落到执行或交付链路中的引用关系' },
    { label: '待切换引用', value: pendingRefCount, desc: '仍需在现场完成版本切换确认的引用关系' },
    { label: '统一来源', value: currentBomLabel.value, desc: '当前所有引用关系都来自同一 BOM 版本上下文' }
  ]
})

const tableColumns = computed(() => (activeMode.value === 'explode' ? explodeColumns : whereUsedColumns))

const { tableData, pagination, loading, search, refresh } = useTable<AnalysisRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: activeRows.value.slice(start, end),
      total: activeRows.value.length
    }
  }
})

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((item) => item.value === value)?.label || value || '-'
}

function handleSearch() {
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    versionId: 'BOM-EB-1002',
    nodeType: '',
    supplyMode: ''
  })
  activeMode.value = 'explode'
  search()
}

function handleRefresh() {
  refresh()
}

function handleModeChange() {
  detailVisible.value = false
  currentDetail.value = null
  search()
}

function handleRowAction(action: string, row: AnalysisRow) {
  if (action === 'detail') {
    currentDetail.value = {
      ...row,
      inventoryImpacts: [...row.inventoryImpacts],
      consumedBy: [...row.consumedBy]
    }
    detailVisible.value = true
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

.analysis-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff 0%, #f3f8ff 100%);
}

.analysis-switch__label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
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

  .analysis-switch,
  .detail-hero,
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-item strong {
    text-align: left;
  }
}
</style>

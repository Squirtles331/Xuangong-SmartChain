<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="结构版本比较"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    :show-add-button="false"
    :toolbar-actions="toolbarActions"
    @search="handleSearch"
    @reset="handleReset"
    @refresh="handleRefresh"
    @toolbar-action="handleToolbarAction"
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

      <div class="compare-context">
        <div class="compare-context__item">
          <span>对比对象</span>
          <strong>{{ currentCompareMeta.materialCode }} / {{ currentCompareMeta.materialName }}</strong>
        </div>
        <div class="compare-context__item">
          <span>基线版本</span>
          <strong>{{ currentCompareMeta.baseLabel }}</strong>
        </div>
        <div class="compare-context__item">
          <span>目标版本</span>
          <strong>{{ currentCompareMeta.targetLabel }}</strong>
        </div>
        <div class="compare-context__item">
          <span>评估来源</span>
          <strong>{{ currentCompareMeta.changeOrder }}</strong>
        </div>
      </div>
    </template>

    <template #changeType="{ row }">
      <StatusTag :value="row.changeType" :options="changeTypeOptions" />
    </template>

    <template #impactLevel="{ row }">
      <StatusTag :value="row.impactLevel" :options="impactLevelOptions" />
    </template>

    <template #quantityDelta="{ row }">
      <span :class="['delta-text', row.quantityDelta > 0 ? 'is-up' : row.quantityDelta < 0 ? 'is-down' : '']">
        {{ formatDelta(row.quantityDelta) }}
      </span>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <el-drawer v-model="detailVisible" title="结构差异详情" size="760px">
        <template v-if="currentDetail">
          <div class="detail-shell">
            <div class="detail-hero">
              <div>
                <div class="detail-title">{{ currentDetail.componentName }}</div>
                <div class="detail-subtitle">{{ currentDetail.componentCode }} · 层级 {{ currentDetail.level }}</div>
              </div>
              <StatusTag :value="currentDetail.changeType" :options="changeTypeOptions" />
            </div>

            <div class="detail-grid">
              <section class="detail-card">
                <div class="detail-card__title">差异基础</div>
                <div class="detail-item">
                  <span>基线版本</span><strong>{{ currentCompareMeta.baseLabel }}</strong>
                </div>
                <div class="detail-item">
                  <span>目标版本</span><strong>{{ currentCompareMeta.targetLabel }}</strong>
                </div>
                <div class="detail-item">
                  <span>供给方式</span><strong>{{ currentDetail.supplyMode }}</strong>
                </div>
                <div class="detail-item">
                  <span>变更单</span><strong>{{ currentDetail.changeOrder }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">数量与损耗变化</div>
                <div class="detail-item">
                  <span>基线用量</span><strong>{{ currentDetail.baseQty }}</strong>
                </div>
                <div class="detail-item">
                  <span>目标用量</span><strong>{{ currentDetail.targetQty }}</strong>
                </div>
                <div class="detail-item">
                  <span>基线损耗</span><strong>{{ currentDetail.baseScrap }}</strong>
                </div>
                <div class="detail-item">
                  <span>目标损耗</span><strong>{{ currentDetail.targetScrap }}</strong>
                </div>
                <div class="detail-item">
                  <span>数量变动</span
                  ><strong :class="['delta-text', currentDetail.quantityDelta > 0 ? 'is-up' : currentDetail.quantityDelta < 0 ? 'is-down' : '']">{{
                    formatDelta(currentDetail.quantityDelta)
                  }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">路线与版本影响</div>
                <div class="detail-item">
                  <span>关联工艺路线</span><strong>{{ currentDetail.routeBinding }}</strong>
                </div>
                <div class="detail-item">
                  <span>替代策略</span><strong>{{ currentDetail.replacementStrategy }}</strong>
                </div>
                <div class="detail-item">
                  <span>影响层级</span><strong>{{ getOptionLabel(impactLevelOptions, currentDetail.impactLevel) }}</strong>
                </div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.affectedObjects" :key="item" type="success" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">执行影响</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.executionImpacts" :key="item" type="warning" effect="light" round>{{ item }}</el-tag>
                </div>
                <p class="detail-description">{{ currentDetail.impactSummary }}</p>
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
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type ChangeType = 'added' | 'removed' | 'updated' | 'unchanged'
type ImpactLevel = 'low' | 'medium' | 'high'

interface OptionItem {
  value: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface BomVersionOption {
  id: string
  materialCode: string
  materialName: string
  bomType: 'EBOM' | 'MBOM'
  version: string
  status: string
  routeBinding: string
  changeOrder: string
}

interface CompareRow {
  id: string
  level: number
  componentCode: string
  componentName: string
  changeType: ChangeType
  supplyMode: string
  baseQty: string
  targetQty: string
  baseScrap: string
  targetScrap: string
  quantityDelta: number
  routeBinding: string
  replacementStrategy: string
  impactLevel: ImpactLevel
  impactSummary: string
  changeOrder: string
  affectedObjects: string[]
  executionImpacts: string[]
}

const bomVersionOptions: BomVersionOption[] = [
  {
    id: 'BOM-EB-1001',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'EBOM',
    version: 'V2.3',
    status: '已生效',
    routeBinding: 'RT-2101-V2.0',
    changeOrder: 'ECN-202607-001'
  },
  {
    id: 'BOM-EB-1002',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'EBOM',
    version: 'V2.4',
    status: '待评审',
    routeBinding: 'RT-2101-V2.1',
    changeOrder: 'ECN-202607-004'
  },
  {
    id: 'BOM-MB-2101',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'MBOM',
    version: 'V1.2',
    status: '已生效',
    routeBinding: 'RT-2101-V2.0',
    changeOrder: 'ECN-202607-001'
  },
  {
    id: 'BOM-MB-3102',
    materialCode: 'SM-CNC-1001',
    materialName: '壳体粗加工件',
    bomType: 'MBOM',
    version: 'V1.0',
    status: '草稿',
    routeBinding: 'RT-1001-V1.0',
    changeOrder: 'ECN-202607-005'
  }
]

const compareMatrix: Record<string, CompareRow[]> = {
  'BOM-EB-1001__BOM-EB-1002': [
    {
      id: 'CMP-001',
      level: 1,
      componentCode: 'SUB-ASSY-001',
      componentName: '密封组件',
      changeType: 'updated',
      supplyMode: '自制',
      baseQty: '1',
      targetQty: '1',
      baseScrap: '1%',
      targetScrap: '0%',
      quantityDelta: 0,
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '旧件停用，新件首批切换',
      impactLevel: 'high',
      impactSummary: '影响主装路线扭矩确认与首件验证，需要同步切换工艺参数基线。',
      changeOrder: 'ECN-202607-004',
      affectedObjects: ['MBOM V1.2', 'RT-2101-V2.1', '首件检验模板'],
      executionImpacts: ['在制工单切换', '首件确认', '扭矩参数更新']
    },
    {
      id: 'CMP-002',
      level: 2,
      componentCode: 'RM-FAST-021',
      componentName: '不锈钢卡箍',
      changeType: 'added',
      supplyMode: '采购',
      baseQty: '-',
      targetQty: '2',
      baseScrap: '-',
      targetScrap: '0%',
      quantityDelta: 2,
      routeBinding: 'RT-2101-V2.1',
      replacementStrategy: '新增采购件，首批按替代料池补齐',
      impactLevel: 'medium',
      impactSummary: '新增辅料后需要同步修正领料口径和库存预留策略。',
      changeOrder: 'ECN-202607-004',
      affectedObjects: ['领料口径', '替代料策略'],
      executionImpacts: ['新增领料行', '补充来料检验']
    },
    {
      id: 'CMP-003',
      level: 2,
      componentCode: 'RM-SEAL-017',
      componentName: '密封圈 A17',
      changeType: 'removed',
      supplyMode: '采购',
      baseQty: '2',
      targetQty: '-',
      baseScrap: '2%',
      targetScrap: '-',
      quantityDelta: -2,
      routeBinding: 'RT-2101-V2.0',
      replacementStrategy: '由新密封组件整体替代',
      impactLevel: 'high',
      impactSummary: '旧版库存需收口，现场不得继续按旧结构投料。',
      changeOrder: 'ECN-202607-004',
      affectedObjects: ['旧版库存', '现场投料指引'],
      executionImpacts: ['库存收口', '旧料隔离']
    },
    {
      id: 'CMP-004',
      level: 2,
      componentCode: 'RM-BOLT-016',
      componentName: '六角螺栓 M16×60',
      changeType: 'unchanged',
      supplyMode: '采购',
      baseQty: '8',
      targetQty: '8',
      baseScrap: '1%',
      targetScrap: '1%',
      quantityDelta: 0,
      routeBinding: 'RT-2101-V2.0',
      replacementStrategy: '延续现行标准件口径',
      impactLevel: 'low',
      impactSummary: '结构未变化，可继续沿用现有领料与工艺口径。',
      changeOrder: 'ECN-202607-004',
      affectedObjects: ['标准件池'],
      executionImpacts: ['无需额外动作']
    }
  ],
  'BOM-MB-2101__BOM-MB-3102': [
    {
      id: 'CMP-005',
      level: 1,
      componentCode: 'SM-BODY-1001',
      componentName: '壳体毛坯',
      changeType: 'updated',
      supplyMode: '自制',
      baseQty: '1',
      targetQty: '1',
      baseScrap: '3%',
      targetScrap: '4%',
      quantityDelta: 0,
      routeBinding: 'RT-1001-V1.0',
      replacementStrategy: '机加余量重估',
      impactLevel: 'medium',
      impactSummary: '机加良率口径变化，需要同步更新工时学习样本解释。',
      changeOrder: 'ECN-202607-005',
      affectedObjects: ['工时学习样本', '机加良率模型'],
      executionImpacts: ['调整报废率口径']
    }
  ]
}

const changeTypeOptions: OptionItem[] = [
  { value: 'added', label: '新增', type: 'success' },
  { value: 'removed', label: '删除', type: 'danger' },
  { value: 'updated', label: '修改', type: 'warning' },
  { value: 'unchanged', label: '无变化', type: 'info' }
]

const impactLevelOptions: OptionItem[] = [
  { value: 'low', label: '低', type: 'info' },
  { value: 'medium', label: '中', type: 'warning' },
  { value: 'high', label: '高', type: 'danger' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '组件编码 / 组件名称 / 变更单号' } as never },
  {
    type: 'select-v2',
    label: 'BOM 类型',
    field: 'bomType',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'EBOM', value: 'EBOM' },
        { label: 'MBOM', value: 'MBOM' }
      ]
    } as never
  },
  {
    type: 'select-v2',
    label: '基线版本',
    field: 'baseVersionId',
    props: {
      options: bomVersionOptions.map((item) => ({
        label: `${item.materialCode} / ${item.bomType} ${item.version} / ${item.status}`,
        value: item.id
      }))
    } as never
  },
  {
    type: 'select-v2',
    label: '目标版本',
    field: 'targetVersionId',
    props: {
      options: bomVersionOptions.map((item) => ({
        label: `${item.materialCode} / ${item.bomType} ${item.version} / ${item.status}`,
        value: item.id
      }))
    } as never
  },
  {
    type: 'select-v2',
    label: '差异类型',
    field: 'changeType',
    props: {
      options: [{ label: '全部', value: '' }, ...changeTypeOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<CompareRow>[] = [
  { prop: 'level', label: '层级', minWidth: 70, align: 'center' },
  { prop: 'componentCode', label: '组件编码', minWidth: 140 },
  { prop: 'componentName', label: '组件名称', minWidth: 170 },
  { label: '差异类型', minWidth: 100, align: 'center', slotName: 'changeType' },
  { prop: 'baseQty', label: '基线用量', minWidth: 90, align: 'center' },
  { prop: 'targetQty', label: '目标用量', minWidth: 90, align: 'center' },
  { label: '数量变动', minWidth: 100, align: 'center', slotName: 'quantityDelta' },
  { prop: 'routeBinding', label: '关联路线', minWidth: 140 },
  { label: '影响级别', minWidth: 100, align: 'center', slotName: 'impactLevel' },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出差异', tone: 'default' }]
const rowActions: CrudRowActionItem[] = [{ key: 'detail', label: '查看详情', tone: 'primary' }]

const queryParams = reactive({
  keyword: '',
  bomType: '',
  baseVersionId: 'BOM-EB-1001',
  targetVersionId: 'BOM-EB-1002',
  changeType: ''
})

const compareRows = ref<CompareRow[]>(buildCompareRows(queryParams.baseVersionId, queryParams.targetVersionId))
const detailVisible = ref(false)
const currentDetail = ref<CompareRow | null>(null)

const currentCompareMeta = computed(() => {
  const base = getVersion(queryParams.baseVersionId)
  const target = getVersion(queryParams.targetVersionId)

  return {
    materialCode: target?.materialCode || base?.materialCode || '-',
    materialName: target?.materialName || base?.materialName || '-',
    baseLabel: base ? `${base.bomType} ${base.version}` : '-',
    targetLabel: target ? `${target.bomType} ${target.version}` : '-',
    changeOrder: target?.changeOrder || base?.changeOrder || '-'
  }
})

const filteredRows = computed(() =>
  compareRows.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.componentCode.toLowerCase().includes(keyword) ||
      item.componentName.toLowerCase().includes(keyword) ||
      item.changeOrder.toLowerCase().includes(keyword)

    const targetVersion = getVersion(queryParams.targetVersionId)
    const matchBomType = !queryParams.bomType || targetVersion?.bomType === queryParams.bomType
    const matchChangeType = !queryParams.changeType || item.changeType === queryParams.changeType

    return matchKeyword && matchBomType && matchChangeType
  })
)

const overviewCards = computed(() => {
  const changedCount = compareRows.value.filter((item) => item.changeType !== 'unchanged').length
  const addedCount = compareRows.value.filter((item) => item.changeType === 'added').length
  const removedCount = compareRows.value.filter((item) => item.changeType === 'removed').length
  const affectedRoutes = new Set(compareRows.value.map((item) => item.routeBinding)).size

  return [
    { label: '差异条目数', value: compareRows.value.length, desc: '当前版本对比中纳入静态分析的结构条目数量' },
    { label: '发生变化', value: changedCount, desc: '新增、删除、修改的结构条目总数' },
    { label: '新增 / 删除', value: `${addedCount} / ${removedCount}`, desc: '用于快速判断投料与库存收口压力' },
    { label: '影响路线', value: affectedRoutes, desc: '需要同步确认工艺路线或执行口径的版本数量' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<CompareRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRows.value.slice(start, end),
      total: filteredRows.value.length
    }
  }
})

function getVersion(id: string) {
  return bomVersionOptions.find((item) => item.id === id)
}

function buildCompareRows(baseVersionId: string, targetVersionId: string) {
  const base = getVersion(baseVersionId)
  const target = getVersion(targetVersionId)

  if (!base || !target) return []
  if (base.id === target.id) return []
  if (base.materialCode !== target.materialCode || base.bomType !== target.bomType) return []

  return (
    compareMatrix[`${baseVersionId}__${targetVersionId}`] || [
      {
        id: 'CMP-DEFAULT',
        level: 1,
        componentCode: 'BASELINE-KEEP',
        componentName: '当前版本间无显著结构差异',
        changeType: 'unchanged',
        supplyMode: '延续现状',
        baseQty: '1',
        targetQty: '1',
        baseScrap: '0%',
        targetScrap: '0%',
        quantityDelta: 0,
        routeBinding: target.routeBinding,
        replacementStrategy: '维持现行定义',
        impactLevel: 'low',
        impactSummary: '当前对比范围内没有需要额外切换的结构差异。',
        changeOrder: target.changeOrder,
        affectedObjects: ['现行版本'],
        executionImpacts: ['无需额外动作']
      }
    ]
  )
}

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((item) => item.value === value)?.label || value || '-'
}

function formatDelta(value: number) {
  if (value > 0) return `+${value}`
  if (value < 0) return `${value}`
  return '0'
}

function applyComparison(showMessage = false) {
  const base = getVersion(queryParams.baseVersionId)
  const target = getVersion(queryParams.targetVersionId)

  if (!base || !target) {
    compareRows.value = []
    return
  }

  if (base.id === target.id) {
    compareRows.value = []
    if (showMessage) ElMessage.warning('请选择两个不同的版本进行比较')
    return
  }

  if (base.materialCode !== target.materialCode || base.bomType !== target.bomType) {
    compareRows.value = []
    if (showMessage) ElMessage.warning('请比较同一产品、同一 BOM 类型下的版本')
    return
  }

  compareRows.value = buildCompareRows(base.id, target.id)
}

function handleSearch() {
  applyComparison(true)
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    bomType: '',
    baseVersionId: 'BOM-EB-1001',
    targetVersionId: 'BOM-EB-1002',
    changeType: ''
  })
  applyComparison()
  search()
}

function handleRefresh() {
  applyComparison()
  refresh()
}

function exportDiff() {
  if (!filteredRows.value.length) {
    ElMessage.warning('当前没有可导出的差异结果')
    return
  }

  const headers = ['层级', '组件编码', '组件名称', '差异类型', '基线用量', '目标用量', '数量变动', '关联路线', '影响级别', '变更单']
  const rows = filteredRows.value.map((item) => [
    item.level,
    item.componentCode,
    item.componentName,
    getOptionLabel(changeTypeOptions, item.changeType),
    item.baseQty,
    item.targetQty,
    formatDelta(item.quantityDelta),
    item.routeBinding,
    getOptionLabel(impactLevelOptions, item.impactLevel),
    item.changeOrder
  ])
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `BOM差异_${currentCompareMeta.value.baseLabel}_vs_${currentCompareMeta.value.targetLabel}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出结构差异报告')
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    exportDiff()
  }
}

function handleRowAction(action: string, row: CompareRow) {
  if (action === 'detail') {
    currentDetail.value = { ...row, affectedObjects: [...row.affectedObjects], executionImpacts: [...row.executionImpacts] }
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

.compare-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff 0%, #f3f8ff 100%);
}

.compare-context__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.compare-context__item span {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.compare-context__item strong {
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.delta-text {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.delta-text.is-up {
  color: var(--el-color-danger);
}

.delta-text.is-down {
  color: var(--el-color-success);
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
  .compare-context,
  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview,
  .compare-context,
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

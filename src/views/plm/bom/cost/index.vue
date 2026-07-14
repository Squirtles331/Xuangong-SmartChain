<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="结构成本估算"
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

      <div class="cost-context">
        <div class="cost-context__item">
          <span>估算对象</span>
          <strong>{{ currentContext.materialCode }} / {{ currentContext.materialName }}</strong>
        </div>
        <div class="cost-context__item">
          <span>估算版本</span>
          <strong>{{ currentContext.bomType }} {{ currentContext.version }}</strong>
        </div>
        <div class="cost-context__item">
          <span>工艺路线</span>
          <strong>{{ currentContext.routeBinding }}</strong>
        </div>
        <div class="cost-context__item">
          <span>变更来源</span>
          <strong>{{ currentContext.changeOrder }}</strong>
        </div>
      </div>

      <el-card v-if="summaryRow" class="chart-card" header="成本构成分析" shadow="never">
        <div ref="pieChartRef" class="chart-card__canvas"></div>
      </el-card>
    </template>

    <template #costSource="{ row }">
      <StatusTag :value="row.costSource" :options="costSourceOptions" />
    </template>

    <template #materialCost="{ row }">{{ formatCost(row.materialCost) }}</template>
    <template #laborCost="{ row }">{{ formatCost(row.laborCost) }}</template>
    <template #overheadCost="{ row }">{{ formatCost(row.overheadCost) }}</template>
    <template #totalCost="{ row }">
      <strong>{{ formatCost(row.totalCost) }}</strong>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <el-drawer v-model="detailVisible" title="成本明细详情" size="760px">
        <template v-if="currentDetail">
          <div class="detail-shell">
            <div class="detail-hero">
              <div>
                <div class="detail-title">{{ currentDetail.componentName }}</div>
                <div class="detail-subtitle">{{ currentDetail.componentCode }} · {{ currentDetail.levelLabel }}</div>
              </div>
              <StatusTag :value="currentDetail.costSource" :options="costSourceOptions" />
            </div>

            <div class="detail-grid">
              <section class="detail-card">
                <div class="detail-card__title">基础信息</div>
                <div class="detail-item">
                  <span>单位用量</span><strong>{{ currentDetail.quantity }}</strong>
                </div>
                <div class="detail-item">
                  <span>成本来源</span><strong>{{ getOptionLabel(costSourceOptions, currentDetail.costSource) }}</strong>
                </div>
                <div class="detail-item">
                  <span>替代策略</span><strong>{{ currentDetail.replacementStrategy }}</strong>
                </div>
                <div class="detail-item">
                  <span>变更单</span><strong>{{ currentDetail.changeOrder }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">成本拆分</div>
                <div class="detail-item">
                  <span>材料成本</span><strong>{{ formatCost(currentDetail.materialCost) }}</strong>
                </div>
                <div class="detail-item">
                  <span>人工成本</span><strong>{{ formatCost(currentDetail.laborCost) }}</strong>
                </div>
                <div class="detail-item">
                  <span>制造费用</span><strong>{{ formatCost(currentDetail.overheadCost) }}</strong>
                </div>
                <div class="detail-item">
                  <span>估算合计</span><strong>{{ formatCost(currentDetail.totalCost) }}</strong>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">版本与路线影响</div>
                <div class="detail-item">
                  <span>BOM 版本</span><strong>{{ currentContext.bomType }} {{ currentContext.version }}</strong>
                </div>
                <div class="detail-item">
                  <span>工艺路线</span><strong>{{ currentContext.routeBinding }}</strong>
                </div>
                <div class="detail-item">
                  <span>估算口径</span><strong>{{ getValuationLabel(queryParams.valuationView) }}</strong>
                </div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.routeImpacts" :key="item" type="success" effect="light" round>{{ item }}</el-tag>
                </div>
              </section>

              <section class="detail-card">
                <div class="detail-card__title">下游消费影响</div>
                <div class="detail-tags">
                  <el-tag v-for="item in currentDetail.downstreamConsumers" :key="item" type="warning" effect="light" round>{{ item }}</el-tag>
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
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import * as echarts from 'echarts'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type CostSource = 'material' | 'route' | 'mixed' | 'summary'
type ValuationView = 'engineering' | 'manufacturing'

interface OptionItem {
  value: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface CostContext {
  id: string
  materialCode: string
  materialName: string
  bomType: 'EBOM' | 'MBOM'
  version: string
  routeBinding: string
  changeOrder: string
}

interface CostRow {
  id: string
  levelLabel: string
  componentCode: string
  componentName: string
  quantity: number
  costSource: CostSource
  materialCost: number
  laborCost: number
  overheadCost: number
  totalCost: number
  replacementStrategy: string
  changeOrder: string
  routeImpacts: string[]
  downstreamConsumers: string[]
  impactSummary: string
}

const costContexts: CostContext[] = [
  {
    id: 'BOM-MB-2101',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'MBOM',
    version: 'V1.2',
    routeBinding: 'RT-2101-V2.0',
    changeOrder: 'ECN-202607-001'
  },
  {
    id: 'BOM-EB-1002',
    materialCode: 'FG-ASSY-2101',
    materialName: '供液控制总成',
    bomType: 'EBOM',
    version: 'V2.4',
    routeBinding: 'RT-2101-V2.1',
    changeOrder: 'ECN-202607-004'
  }
]

const costDataMap: Record<string, Record<ValuationView, CostRow[]>> = {
  'BOM-MB-2101': {
    engineering: [
      {
        id: 'COST-001',
        levelLabel: 'L1 子装配',
        componentCode: 'SUB-ASSY-001',
        componentName: '密封组件',
        quantity: 1,
        costSource: 'mixed',
        materialCost: 1260,
        laborCost: 180,
        overheadCost: 64,
        totalCost: 1504,
        replacementStrategy: '沿用当前密封组件方案',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['主装工位', '扭矩确认'],
        downstreamConsumers: ['MES 报工', 'QMS 首件检验'],
        impactSummary: '该子装配同时受材料替代与装配工时影响，是版本测算中的主要成本驱动项。'
      },
      {
        id: 'COST-002',
        levelLabel: 'L2 采购件',
        componentCode: 'RM-FAST-021',
        componentName: '不锈钢卡箍',
        quantity: 2,
        costSource: 'material',
        materialCost: 96,
        laborCost: 0,
        overheadCost: 0,
        totalCost: 96,
        replacementStrategy: '首批按标准件池采购',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['来料检验'],
        downstreamConsumers: ['WMS 领料', 'QMS 来料检验'],
        impactSummary: '新增标准件对材料成本敏感，主要影响采购与来料检验口径。'
      },
      {
        id: 'COST-003',
        levelLabel: 'L1 委外件',
        componentCode: 'RM-SRV-003',
        componentName: '热处理套筒',
        quantity: 1,
        costSource: 'route',
        materialCost: 210,
        laborCost: 72,
        overheadCost: 28,
        totalCost: 310,
        replacementStrategy: '沿用委外协同方案',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['委外协同', '回厂复验'],
        downstreamConsumers: ['MES 委外任务', 'QMS 回厂检验'],
        impactSummary: '委外件成本由外协工时和回厂复验共同拉动。'
      },
      {
        id: 'COST-004',
        levelLabel: '汇总',
        componentCode: 'FG-ASSY-2101',
        componentName: '供液控制总成',
        quantity: 1,
        costSource: 'summary',
        materialCost: 3520,
        laborCost: 820,
        overheadCost: 246,
        totalCost: 4586,
        replacementStrategy: '汇总结构成本估算',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['路线版本冻结'],
        downstreamConsumers: ['ECN 评估', '版本切换'],
        impactSummary: '当前 MBOM 版本估算结果可用于工程评审与版本切换前的成本预判。'
      }
    ],
    manufacturing: [
      {
        id: 'COST-005',
        levelLabel: 'L1 子装配',
        componentCode: 'SUB-ASSY-001',
        componentName: '密封组件',
        quantity: 1,
        costSource: 'mixed',
        materialCost: 1310,
        laborCost: 210,
        overheadCost: 76,
        totalCost: 1596,
        replacementStrategy: '按制造节拍重估',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['节拍修正', '工时学习'],
        downstreamConsumers: ['MES 派工', 'ERP 成本接口'],
        impactSummary: '制造视角进一步考虑节拍与现场损耗，成本略高于工程估算。'
      },
      {
        id: 'COST-006',
        levelLabel: 'L2 采购件',
        componentCode: 'RM-FAST-021',
        componentName: '不锈钢卡箍',
        quantity: 2,
        costSource: 'material',
        materialCost: 104,
        laborCost: 0,
        overheadCost: 0,
        totalCost: 104,
        replacementStrategy: '按制造批量采购均价',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['批量采购'],
        downstreamConsumers: ['WMS 领料'],
        impactSummary: '制造视角按批量采购均价重新估算材料成本。'
      },
      {
        id: 'COST-007',
        levelLabel: '汇总',
        componentCode: 'FG-ASSY-2101',
        componentName: '供液控制总成',
        quantity: 1,
        costSource: 'summary',
        materialCost: 3648,
        laborCost: 908,
        overheadCost: 284,
        totalCost: 4840,
        replacementStrategy: '制造估算汇总',
        changeOrder: 'ECN-202607-001',
        routeImpacts: ['制造节拍', '现场损耗'],
        downstreamConsumers: ['ERP 成本接口', '工单定额'],
        impactSummary: '制造估算用于判断现场执行阶段的成本波动风险。'
      }
    ]
  },
  'BOM-EB-1002': {
    engineering: [
      {
        id: 'COST-008',
        levelLabel: 'L1 子装配',
        componentCode: 'SUB-ASSY-001',
        componentName: '密封组件',
        quantity: 1,
        costSource: 'mixed',
        materialCost: 1388,
        laborCost: 186,
        overheadCost: 66,
        totalCost: 1640,
        replacementStrategy: '新密封结构切换',
        changeOrder: 'ECN-202607-004',
        routeImpacts: ['扭矩参数更新', '首件确认'],
        downstreamConsumers: ['ECN 影响分析', 'QMS 首件检验'],
        impactSummary: '新密封结构是 EBOM V2.4 版本的主要增量成本来源。'
      },
      {
        id: 'COST-009',
        levelLabel: 'L2 采购件',
        componentCode: 'RM-SEAL-021',
        componentName: '高性能密封圈',
        quantity: 2,
        costSource: 'material',
        materialCost: 168,
        laborCost: 0,
        overheadCost: 0,
        totalCost: 168,
        replacementStrategy: '替代旧版密封圈',
        changeOrder: 'ECN-202607-004',
        routeImpacts: ['来料检验更新'],
        downstreamConsumers: ['WMS 齐套', 'QMS 来料检验'],
        impactSummary: '替代件抬升材料成本，但同步降低后续返修风险。'
      },
      {
        id: 'COST-010',
        levelLabel: '汇总',
        componentCode: 'FG-ASSY-2101',
        componentName: '供液控制总成',
        quantity: 1,
        costSource: 'summary',
        materialCost: 3716,
        laborCost: 838,
        overheadCost: 252,
        totalCost: 4806,
        replacementStrategy: 'EBOM 工程估算汇总',
        changeOrder: 'ECN-202607-004',
        routeImpacts: ['版本评审', '成本评估'],
        downstreamConsumers: ['ECN 审批', '版本切换评估'],
        impactSummary: 'EBOM 估算用于版本评审阶段判断变更收益与成本压力。'
      }
    ],
    manufacturing: [
      {
        id: 'COST-011',
        levelLabel: 'L1 子装配',
        componentCode: 'SUB-ASSY-001',
        componentName: '密封组件',
        quantity: 1,
        costSource: 'mixed',
        materialCost: 1432,
        laborCost: 224,
        overheadCost: 84,
        totalCost: 1740,
        replacementStrategy: '按制造节拍模拟切换',
        changeOrder: 'ECN-202607-004',
        routeImpacts: ['节拍变化', '工装切换'],
        downstreamConsumers: ['MES 派工', 'ERP 成本接口'],
        impactSummary: '制造视角会把现场切换和工装准备成本纳入估算。'
      },
      {
        id: 'COST-012',
        levelLabel: '汇总',
        componentCode: 'FG-ASSY-2101',
        componentName: '供液控制总成',
        quantity: 1,
        costSource: 'summary',
        materialCost: 3842,
        laborCost: 926,
        overheadCost: 306,
        totalCost: 5074,
        replacementStrategy: 'EBOM 制造估算汇总',
        changeOrder: 'ECN-202607-004',
        routeImpacts: ['现场切换', '节拍修正'],
        downstreamConsumers: ['工单定额', 'ERP 成本接口'],
        impactSummary: '制造估算更适合评估切换后工单执行成本与定额影响。'
      }
    ]
  }
}

const costSourceOptions: OptionItem[] = [
  { value: 'material', label: '物料主导', type: 'primary' },
  { value: 'route', label: '工艺主导', type: 'warning' },
  { value: 'mixed', label: '结构+工艺', type: 'success' },
  { value: 'summary', label: '汇总', type: 'info' }
]

const valuationOptions = [
  { label: '工程估算', value: 'engineering' },
  { label: '制造估算', value: 'manufacturing' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '组件编码 / 组件名称 / 变更单号' } as never },
  {
    type: 'select-v2',
    label: 'BOM 版本',
    field: 'contextId',
    props: {
      options: costContexts.map((item) => ({
        label: `${item.materialCode} / ${item.bomType} ${item.version}`,
        value: item.id
      }))
    } as never
  },
  {
    type: 'select-v2',
    label: '估算口径',
    field: 'valuationView',
    props: {
      options: valuationOptions
    } as never
  },
  {
    type: 'select-v2',
    label: '成本来源',
    field: 'costSource',
    props: {
      options: [{ label: '全部', value: '' }, ...costSourceOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<CostRow>[] = [
  { prop: 'levelLabel', label: '层级', minWidth: 100, align: 'center' },
  { prop: 'componentCode', label: '组件编码', minWidth: 140 },
  { prop: 'componentName', label: '组件名称', minWidth: 170 },
  { prop: 'quantity', label: '用量', minWidth: 80, align: 'center' },
  { label: '成本来源', minWidth: 110, align: 'center', slotName: 'costSource' },
  { label: '材料成本', minWidth: 120, align: 'right', slotName: 'materialCost' },
  { label: '人工成本', minWidth: 120, align: 'right', slotName: 'laborCost' },
  { label: '制造费用', minWidth: 120, align: 'right', slotName: 'overheadCost' },
  { label: '估算合计', minWidth: 120, align: 'right', slotName: 'totalCost' },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出估算', tone: 'default' }]
const rowActions: CrudRowActionItem[] = [{ key: 'detail', label: '查看详情', tone: 'primary' }]

const queryParams = reactive({
  keyword: '',
  contextId: 'BOM-MB-2101',
  valuationView: 'engineering' as ValuationView,
  costSource: ''
})

const detailVisible = ref(false)
const currentDetail = ref<CostRow | null>(null)
const pieChartRef = ref<HTMLDivElement>()
let pieChart: echarts.ECharts | null = null

const currentContext = computed(() => costContexts.find((item) => item.id === queryParams.contextId) || costContexts[0])

const activeRows = computed(() => {
  const sourceRows = costDataMap[queryParams.contextId]?.[queryParams.valuationView] || []
  return sourceRows.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.componentCode.toLowerCase().includes(keyword) ||
      item.componentName.toLowerCase().includes(keyword) ||
      item.changeOrder.toLowerCase().includes(keyword)
    const matchSource = !queryParams.costSource || item.costSource === queryParams.costSource
    return matchKeyword && matchSource
  })
})

const summaryRow = computed(() => activeRows.value.find((item) => item.costSource === 'summary') || null)

const overviewCards = computed(() => {
  const total = summaryRow.value?.totalCost || 0
  const material = summaryRow.value?.materialCost || 0
  const labor = summaryRow.value?.laborCost || 0
  const overhead = summaryRow.value?.overheadCost || 0
  const highImpactCount = activeRows.value.filter((item) => item.totalCost >= 1000 && item.costSource !== 'summary').length

  return [
    { label: '估算总成本', value: formatCost(total), desc: '当前结构版本在所选口径下的静态估算合计' },
    { label: '材料 / 人工', value: `${formatCost(material)} / ${formatCost(labor)}`, desc: '用于快速判断成本主要受结构还是工时驱动' },
    { label: '制造费用', value: formatCost(overhead), desc: '体现工艺路线、节拍和制造约束带来的额外成本' },
    { label: '高影响项', value: highImpactCount, desc: '总成本超过 1000 元的主要驱动结构项数量' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<CostRow>({
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

function formatCost(value: number) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((item) => item.value === value)?.label || value || '-'
}

function getValuationLabel(value: ValuationView) {
  return valuationOptions.find((item) => item.value === value)?.label || value
}

function renderChart() {
  if (!pieChartRef.value || !summaryRow.value) return

  pieChart?.dispose()
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    title: { text: '成本构成分析', left: 'center', textStyle: { fontSize: 16, fontWeight: 600 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        name: '成本构成',
        type: 'pie',
        radius: ['42%', '72%'],
        center: ['58%', '52%'],
        label: { formatter: '{b}\n{c} 元' },
        data: [
          { value: summaryRow.value.materialCost, name: '材料成本' },
          { value: summaryRow.value.laborCost, name: '人工成本' },
          { value: summaryRow.value.overheadCost, name: '制造费用' }
        ]
      }
    ]
  })

  window.removeEventListener('resize', handleChartResize)
  window.addEventListener('resize', handleChartResize)
}

function handleChartResize() {
  pieChart?.resize()
}

watch(summaryRow, () => {
  nextTick(() => renderChart())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleChartResize)
  pieChart?.dispose()
})

function handleSearch() {
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    contextId: 'BOM-MB-2101',
    valuationView: 'engineering' as ValuationView,
    costSource: ''
  })
  search()
}

function handleRefresh() {
  refresh()
}

function exportEstimate() {
  const rows = activeRows.value
  if (!rows.length) return

  const headers = ['层级', '组件编码', '组件名称', '用量', '成本来源', '材料成本', '人工成本', '制造费用', '估算合计', '变更单']
  const csvRows = rows.map((item) => [
    item.levelLabel,
    item.componentCode,
    item.componentName,
    item.quantity,
    getOptionLabel(costSourceOptions, item.costSource),
    formatCost(item.materialCost),
    formatCost(item.laborCost),
    formatCost(item.overheadCost),
    formatCost(item.totalCost),
    item.changeOrder
  ])
  const csvContent = [headers, ...csvRows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `结构成本估算_${currentContext.value.bomType}_${currentContext.value.version}_${getValuationLabel(queryParams.valuationView)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    exportEstimate()
  }
}

function handleRowAction(action: string, row: CostRow) {
  if (action === 'detail') {
    currentDetail.value = {
      ...row,
      routeImpacts: [...row.routeImpacts],
      downstreamConsumers: [...row.downstreamConsumers]
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

.cost-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff 0%, #f3f8ff 100%);
}

.cost-context__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cost-context__item span {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.cost-context__item strong {
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.chart-card {
  margin-bottom: 12px;
}

.chart-card__canvas {
  width: 100%;
  height: 380px;
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
  .cost-context,
  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview,
  .cost-context,
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

import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'
import type { FinanceAccountSummary, FinanceLedgerEntry, FinanceReconciliationItem } from '@/api/finance'

export type DemandSourceType = 'sales' | 'forecast' | 'manual'
export type DemandPriority = 'urgent' | 'high' | 'normal' | 'low'
export type DemandReadiness = 'ready' | 'reviewing' | 'pending'
export type DemandMrpStatus = 'not_run' | 'planned' | 'released'
export type MrpSuggestionStatus = 'pending' | 'reviewing' | 'released'
export type MrpExceptionLevel = 'critical' | 'warning' | 'info'
export type MrpHistoryStatus = 'completed' | 'reviewing' | 'archived'
export type MrpHistoryTrigger = 'manual' | 'nightly' | 'net_change'
export type NetChangeAction = 'increase' | 'decrease' | 'keep'
export type ForecastDemandType = 'sales' | 'independent'
export type ForecastConsumptionStatus = 'pending' | 'consumed' | 'archived'
export type MultiPlantSuggestionType = 'transfer' | 'purchase' | 'production'
export type PayableStatus = 'open' | 'paid' | 'partial'

type SummaryTone = 'primary' | 'success' | 'warning' | 'info'

export interface ErpDemandPoolRecord {
  id: string
  demandCode: string
  sourceType: DemandSourceType
  sourceCode: string
  customerName: string
  productCode: string
  productName: string
  qty: number
  dueDate: string
  priority: DemandPriority
  releaseReadiness: DemandReadiness
  mrpStatus: DemandMrpStatus
  apsPlanVersion: string
  demandOwner: string
}

export interface ErpDemandPoolSummary {
  totalCount: number
  urgentCount: number
  readyCount: number
  totalQty: number
}

export interface ErpMrpPurchaseSuggestion {
  id: string
  code: string
  name: string
  qty: number
  orderDate: string
  needDate: string
  supplier: string
  source: string
  status: MrpSuggestionStatus
}

export interface ErpMrpProductionSuggestion {
  id: string
  code: string
  name: string
  qty: number
  startDate: string
  endDate: string
  bomVersion: string
  routingVersion: string
  source: string
  status: MrpSuggestionStatus
}

export interface ErpMrpException {
  id: string
  type: string
  level: MrpExceptionLevel
  material: string
  detail: string
  action: string
}

export interface ErpMrpSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpMrpRunSummary {
  runId: string
  scope: string
  strategy: string
  lastRunTime: string
  cards: ErpMrpSummaryCard[]
}

export interface ErpMrpHistoryRecord {
  id: string
  runTime: string
  operator: string
  triggerType: MrpHistoryTrigger
  scope: string
  dateRange: string
  includeSafetyStock: boolean
  includeInTransit: boolean
  leadTimeMode: string
  strategy: string
  orders: number
  purchaseSuggestions: number
  transferSuggestions: number
  productionSuggestions: number
  suggestions: number
  status: MrpHistoryStatus
}

export interface ErpNetChangeEvent {
  id: string
  type: string
  detail: string
  time: string
}

export interface ErpNetChangeDetail {
  source: string
  oldQty: number
  newQty: number
  diff: number
  reason: string
}

export interface ErpNetChangeAffectedRecord {
  id: string
  material: string
  oldQty: number
  newQty: number
  diff: number
  action: NetChangeAction
  details: ErpNetChangeDetail[]
}

export interface ErpNetChangeSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpNetChangeOverview {
  cards: ErpNetChangeSummaryCard[]
  events: ErpNetChangeEvent[]
  affected: ErpNetChangeAffectedRecord[]
}

export interface ErpLedgerSummaryCard {
  title: string
  value: number
  tone: SummaryTone
  note: string
}

export interface ErpLedgerOverview {
  cards: ErpLedgerSummaryCard[]
  debitData: FinanceAccountSummary[]
  creditData: FinanceAccountSummary[]
  ledgerData: FinanceLedgerEntry[]
  recData: FinanceReconciliationItem[]
  lastClosePeriod: string
  carryNote: string
}

export interface ErpForecastRecord {
  id: string
  materialCode: string
  materialName: string
  qty: number
  needDate: string
  type: ForecastDemandType
  probability: number
  remark: string
  demandOwner: string
  consumptionStatus: ForecastConsumptionStatus
}

export interface ErpForecastSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpForecastTrendPoint {
  period: string
  forecastQty: number
  actualQty: number
}

export interface ErpForecastOverview {
  cards: ErpForecastSummaryCard[]
  trend: ErpForecastTrendPoint[]
}

export interface ErpMultiPlantCapacity {
  plant: string
  capacity: number
  used: number
  utilization: number
  bottleneck: string
}

export interface ErpMultiPlantSuggestion {
  id: string
  material: string
  fromPlant: string
  toPlant: string
  qty: number
  type: MultiPlantSuggestionType
  suggestion: string
}

export interface ErpMultiPlantSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpMultiPlantOverview {
  cards: ErpMultiPlantSummaryCard[]
  plantCapacity: ErpMultiPlantCapacity[]
  results: ErpMultiPlantSuggestion[]
}

export interface ErpPayableRecord {
  id: string
  code: string
  supplier: string
  amount: number
  paid: number
  balance: number
  dueDate: string
  status: PayableStatus
  sourceVoucher: string
}

export interface ErpPayableSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpPayableOverview {
  cards: ErpPayableSummaryCard[]
}

export interface ErpCostDetail {
  id: string
  product: string
  materialCost: number
  laborCost: number
  overhead: number
  total: number
  period: string
}

export interface ErpCostSummaryCard {
  title: string
  value: string
  tone: SummaryTone
}

export interface ErpCostCompositionItem {
  label: string
  value: number
}

export interface ErpCostOverview {
  cards: ErpCostSummaryCard[]
  composition: ErpCostCompositionItem[]
}

export interface ErpFinanceReportMetrics {
  revenue: number
  cost: number
  gross: number
  receivable: number
  payable: number
  profit: number
}

export interface ErpFinanceReportCard {
  title: string
  current: number
  last: number
  positiveBetter: boolean
}

export interface ErpFinanceReportTrendPoint {
  period: string
  revenue: number
  cost: number
  profit: number
}

export interface ErpFinanceReportOverview {
  cards: ErpFinanceReportCard[]
  currentMonth: ErpFinanceReportMetrics
  lastMonth: ErpFinanceReportMetrics
  trend: ErpFinanceReportTrendPoint[]
}

type DemandPoolParams = {
  pageNum: number
  pageSize: number
  keyword?: string
  sourceType?: DemandSourceType
  priority?: DemandPriority
  releaseReadiness?: DemandReadiness
}

type MrpResultParams = {
  type: 'purchase' | 'production' | 'exception'
  pageNum: number
  pageSize: number
}

type MrpHistoryParams = {
  pageNum: number
  pageSize: number
  keyword?: string
  triggerType?: MrpHistoryTrigger
  status?: MrpHistoryStatus
}

type NetChangeParams = {
  pageNum: number
  pageSize: number
  changeType?: string
}

type ForecastParams = {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: ForecastDemandType
}

type PayableParams = {
  pageNum: number
  pageSize: number
  code?: string
  supplier?: string
  status?: PayableStatus
}

type CostParams = {
  pageNum: number
  pageSize: number
  product?: string
  period?: string
}

const demandPoolState: ErpDemandPoolRecord[] = [
  {
    id: 'demand-1',
    demandCode: 'DP-20260715-001',
    sourceType: 'sales',
    sourceCode: 'SO-20260715-001',
    customerName: '华东泵业集团',
    productCode: 'FG-XJP-100',
    productName: '离心泵 XJP-100',
    qty: 48,
    dueDate: '2026-07-22',
    priority: 'urgent',
    releaseReadiness: 'ready',
    mrpStatus: 'planned',
    apsPlanVersion: 'APS-V20260715-01',
    demandOwner: '销售计划组'
  },
  {
    id: 'demand-2',
    demandCode: 'DP-20260715-002',
    sourceType: 'sales',
    sourceCode: 'SO-20260715-004',
    customerName: '苏南装备制造',
    productCode: 'FG-GBX-200',
    productName: '齿轮箱 GBX-200',
    qty: 24,
    dueDate: '2026-07-25',
    priority: 'high',
    releaseReadiness: 'reviewing',
    mrpStatus: 'not_run',
    apsPlanVersion: 'APS-V20260715-01',
    demandOwner: '经营计划部'
  },
  {
    id: 'demand-3',
    demandCode: 'DP-20260715-003',
    sourceType: 'forecast',
    sourceCode: 'FC-202607-013',
    customerName: '西南维保中心',
    productCode: 'SP-DS-050',
    productName: '传动轴备件 DS-50',
    qty: 80,
    dueDate: '2026-07-29',
    priority: 'normal',
    releaseReadiness: 'pending',
    mrpStatus: 'not_run',
    apsPlanVersion: '待 APS 排程承接',
    demandOwner: '售后计划组'
  },
  {
    id: 'demand-4',
    demandCode: 'DP-20260715-004',
    sourceType: 'manual',
    sourceCode: 'MD-RESERVE-007',
    customerName: '备品备件池',
    productCode: 'FG-XJP-150',
    productName: '离心泵 XJP-150',
    qty: 16,
    dueDate: '2026-07-30',
    priority: 'low',
    releaseReadiness: 'ready',
    mrpStatus: 'released',
    apsPlanVersion: 'APS-V20260714-03',
    demandOwner: '计划专员 周岚'
  }
]

const purchaseSuggestionState: ErpMrpPurchaseSuggestion[] = [
  {
    id: 'pur-1',
    code: 'RM-6308',
    name: '轴承 6308',
    qty: 620,
    orderDate: '2026-07-15',
    needDate: '2026-07-19',
    supplier: '苏州精密轴承制造厂',
    source: 'DP-20260715-001 / DP-20260715-002',
    status: 'pending'
  },
  {
    id: 'pur-2',
    code: 'RM-D50',
    name: '圆钢 D50',
    qty: 880,
    orderDate: '2026-07-16',
    needDate: '2026-07-21',
    supplier: '华东钢材供应有限公司',
    source: 'DP-20260715-001',
    status: 'reviewing'
  },
  {
    id: 'pur-3',
    code: 'RM-DN100',
    name: '密封件 DN100',
    qty: 96,
    orderDate: '2026-07-16',
    needDate: '2026-07-24',
    supplier: '青岛密封科技有限公司',
    source: 'DP-20260715-004',
    status: 'released'
  }
]

const productionSuggestionState: ErpMrpProductionSuggestion[] = [
  {
    id: 'prod-1',
    code: 'FG-XJP-100',
    name: '离心泵 XJP-100',
    qty: 48,
    startDate: '2026-07-17',
    endDate: '2026-07-22',
    bomVersion: 'MBOM V1.2',
    routingVersion: '工艺路线 V1.1',
    source: 'DP-20260715-001',
    status: 'pending'
  },
  {
    id: 'prod-2',
    code: 'FG-GBX-200',
    name: '齿轮箱 GBX-200',
    qty: 24,
    startDate: '2026-07-18',
    endDate: '2026-07-25',
    bomVersion: 'MBOM V2.0',
    routingVersion: '工艺路线 V1.3',
    source: 'DP-20260715-002',
    status: 'reviewing'
  },
  {
    id: 'prod-3',
    code: 'SP-DS-050',
    name: '传动轴备件 DS-50',
    qty: 80,
    startDate: '2026-07-21',
    endDate: '2026-07-29',
    bomVersion: 'MBOM V1.0',
    routingVersion: '工艺路线 V1.0',
    source: 'DP-20260715-003',
    status: 'pending'
  }
]

const mrpExceptionState: ErpMrpException[] = [
  {
    id: 'exp-1',
    type: '缺料风险',
    level: 'critical',
    material: '轴承 6308',
    detail: '建议下单日期已经逼近交期缓冲线，若 24 小时内不释放采购承接，将影响齿轮箱批次开工。',
    action: '优先释放采购建议，并要求供应商确认现货。'
  },
  {
    id: 'exp-2',
    type: '产能冲突',
    level: 'warning',
    material: '离心泵 XJP-100',
    detail: '装配与试压窗口存在重叠，预计 7 月 21 日出现 0.5 天局部拥堵。',
    action: '保留 ERP 建议结果，由 APS 继续负责重排与窗口锁定。'
  },
  {
    id: 'exp-3',
    type: '版本校验',
    level: 'info',
    material: '传动轴备件 DS-50',
    detail: '当前建议使用 MBOM V1.0，请在版本切换窗口确认后再正式承接。',
    action: '保持建议为待复核状态，等待版本确认。'
  }
]

const mrpHistoryState: ErpMrpHistoryRecord[] = [
  {
    id: 'MRP-20260715-01',
    runTime: '2026-07-15 09:40',
    operator: '计划专员 周岚',
    triggerType: 'manual',
    scope: '制造一厂 / 装配车间',
    dateRange: '2026-07-15 ~ 2026-07-31',
    includeSafetyStock: true,
    includeInTransit: true,
    leadTimeMode: '标准',
    strategy: '净变更 + 缺料优先',
    orders: 14,
    purchaseSuggestions: 3,
    transferSuggestions: 1,
    productionSuggestions: 3,
    suggestions: 7,
    status: 'completed'
  },
  {
    id: 'MRP-20260714-03',
    runTime: '2026-07-14 23:30',
    operator: 'ERP 夜间任务',
    triggerType: 'nightly',
    scope: '制造一厂',
    dateRange: '2026-07-14 ~ 2026-07-30',
    includeSafetyStock: true,
    includeInTransit: false,
    leadTimeMode: '标准',
    strategy: '全量重算',
    orders: 11,
    purchaseSuggestions: 2,
    transferSuggestions: 1,
    productionSuggestions: 2,
    suggestions: 5,
    status: 'archived'
  },
  {
    id: 'MRP-20260713-02',
    runTime: '2026-07-13 14:20',
    operator: '经营计划部',
    triggerType: 'net_change',
    scope: '制造一厂 / 关键物料',
    dateRange: '2026-07-13 ~ 2026-07-28',
    includeSafetyStock: true,
    includeInTransit: true,
    leadTimeMode: '快速',
    strategy: '净变更重算',
    orders: 9,
    purchaseSuggestions: 2,
    transferSuggestions: 0,
    productionSuggestions: 2,
    suggestions: 4,
    status: 'reviewing'
  }
]

const netChangeEventState: ErpNetChangeEvent[] = [
  {
    id: 'nce-1',
    type: '销售订单增量',
    detail: 'SO-20260715-001 数量上调，带动轴承与圆钢需求同步增加。',
    time: '2026-07-15 08:35'
  },
  {
    id: 'nce-2',
    type: 'BOM 用量优化',
    detail: '传动轴备件 DS-50 新版 BOM 释放后，泵体 HT200 理论需求下降。',
    time: '2026-07-15 09:10'
  },
  {
    id: 'nce-3',
    type: '安全库存回补',
    detail: '密封件 DN100 安全库存触底，系统重新拉起补货建议。',
    time: '2026-07-15 09:35'
  }
]

const netChangeAffectedState: ErpNetChangeAffectedRecord[] = [
  {
    id: 'nca-1',
    material: '轴承 6308',
    oldQty: 500,
    newQty: 620,
    diff: 120,
    action: 'increase',
    details: [
      { source: 'SO-20260715-001', oldQty: 240, newQty: 320, diff: 80, reason: '销售订单增量' },
      { source: 'DP-20260715-002', oldQty: 260, newQty: 300, diff: 40, reason: '排产缓冲提前准备' }
    ]
  },
  {
    id: 'nca-2',
    material: '泵体 HT200',
    oldQty: 180,
    newQty: 140,
    diff: -40,
    action: 'decrease',
    details: [{ source: 'MBOM V1.1 -> V1.2', oldQty: 180, newQty: 140, diff: -40, reason: 'BOM 用量优化' }]
  },
  {
    id: 'nca-3',
    material: '密封件 DN100',
    oldQty: 90,
    newQty: 90,
    diff: 0,
    action: 'keep',
    details: [{ source: '安全库存校验', oldQty: 90, newQty: 90, diff: 0, reason: '重算后维持不变' }]
  }
]

const financeDebitAccounts: FinanceAccountSummary[] = [
  { id: 'debit-1', code: '5001', account: '生产成本', type: '成本', amount: 918000 },
  { id: 'debit-2', code: '1403', account: '原材料', type: '资产', amount: 1260000 },
  { id: 'debit-3', code: '6602', account: '管理费用', type: '费用', amount: 286000 }
]

const financeCreditAccounts: FinanceAccountSummary[] = [
  { id: 'credit-1', code: '2202', account: '应付账款', type: '负债', amount: 1080000 },
  { id: 'credit-2', code: '2221', account: '应交税费', type: '负债', amount: 312000 },
  { id: 'credit-3', code: '6001', account: '主营业务收入', type: '收入', amount: 1072000 }
]

const financeLedgerEntries: FinanceLedgerEntry[] = [
  {
    id: 'ledger-1',
    date: '2026-07-03',
    voucher: 'PZ-202607-001',
    account: '原材料',
    debit: 360000,
    credit: 0,
    summary: '采购圆钢与铸件入账'
  },
  {
    id: 'ledger-2',
    date: '2026-07-08',
    voucher: 'PZ-202607-002',
    account: '生产成本',
    debit: 285000,
    credit: 0,
    summary: '生产领料结转'
  },
  {
    id: 'ledger-3',
    date: '2026-07-12',
    voucher: 'PZ-202607-003',
    account: '主营业务收入',
    debit: 0,
    credit: 820000,
    summary: '离心泵产品销售确认'
  },
  {
    id: 'ledger-4',
    date: '2026-07-18',
    voucher: 'PZ-202607-004',
    account: '应付账款',
    debit: 120000,
    credit: 0,
    summary: '支付供应商货款'
  }
]

const financeReconciliation: FinanceReconciliationItem[] = [
  {
    id: 'rec-1',
    date: '2026-07-03',
    voucher: 'PZ-202607-001',
    debit_account: '原材料',
    credit_account: '银行存款',
    debit: 360000,
    credit: 360000,
    diff: 0,
    status: 'matched'
  },
  {
    id: 'rec-2',
    date: '2026-07-12',
    voucher: 'PZ-202607-003',
    debit_account: '银行存款',
    credit_account: '主营业务收入',
    debit: 820000,
    credit: 820000,
    diff: 0,
    status: 'matched'
  },
  {
    id: 'rec-3',
    date: '2026-07-28',
    voucher: 'PZ-202607-007',
    debit_account: '制造费用',
    credit_account: '银行存款',
    debit: 98500,
    credit: 96000,
    diff: 2500,
    status: 'pending'
  }
]

const forecastState: ErpForecastRecord[] = [
  {
    id: 'fc-1',
    materialCode: 'FG-XJP-100',
    materialName: '离心泵 XJP-100',
    qty: 60,
    needDate: '2026-08-05',
    type: 'sales',
    probability: 92,
    remark: '根据华东项目签约节奏提前锁定需求。',
    demandOwner: '营销预测组',
    consumptionStatus: 'consumed'
  },
  {
    id: 'fc-2',
    materialCode: 'FG-GBX-200',
    materialName: '齿轮箱 GBX-200',
    qty: 32,
    needDate: '2026-08-09',
    type: 'sales',
    probability: 86,
    remark: '重点客户季度框架单滚动预测。',
    demandOwner: '经营计划部',
    consumptionStatus: 'pending'
  },
  {
    id: 'fc-3',
    materialCode: 'SP-DS-050',
    materialName: '传动轴备件 DS-50',
    qty: 120,
    needDate: '2026-08-12',
    type: 'independent',
    probability: 75,
    remark: '维保中心按保有量推算备件补货。',
    demandOwner: '售后计划组',
    consumptionStatus: 'pending'
  },
  {
    id: 'fc-4',
    materialCode: 'FG-XJP-150',
    materialName: '离心泵 XJP-150',
    qty: 18,
    needDate: '2026-08-15',
    type: 'independent',
    probability: 68,
    remark: '年度重点项目立项后预占产能。',
    demandOwner: '产品线计划',
    consumptionStatus: 'archived'
  }
]

const forecastTrendState: ErpForecastTrendPoint[] = [
  { period: '2026-04', forecastQty: 88, actualQty: 81 },
  { period: '2026-05', forecastQty: 102, actualQty: 98 },
  { period: '2026-06', forecastQty: 116, actualQty: 111 },
  { period: '2026-07', forecastQty: 128, actualQty: 122 },
  { period: '2026-08', forecastQty: 144, actualQty: 0 }
]

const multiPlantCapacityState: ErpMultiPlantCapacity[] = [
  { plant: '制造一厂', capacity: 240, used: 210, utilization: 88, bottleneck: '装配线接近满负荷' },
  { plant: '制造二厂', capacity: 180, used: 122, utilization: 68, bottleneck: '机加段仍有余量' },
  { plant: '西南协同厂', capacity: 130, used: 96, utilization: 74, bottleneck: '外协涂装节拍偏慢' }
]

const multiPlantSuggestionState: ErpMultiPlantSuggestion[] = [
  {
    id: 'mp-1',
    material: '离心泵 XJP-100',
    fromPlant: '制造二厂',
    toPlant: '制造一厂',
    qty: 16,
    type: 'transfer',
    suggestion: '建议从制造二厂转出半成品套件，以缓解制造一厂装配前段缺口。'
  },
  {
    id: 'mp-2',
    material: '齿轮箱 GBX-200',
    fromPlant: '外部采购',
    toPlant: '制造一厂',
    qty: 24,
    type: 'purchase',
    suggestion: '维持 ERP 采购承接，由 APS 继续协调跨厂排产窗口。'
  },
  {
    id: 'mp-3',
    material: '传动轴备件 DS-50',
    fromPlant: '西南协同厂',
    toPlant: '制造二厂',
    qty: 40,
    type: 'production',
    suggestion: '建议在制造二厂追加补产，减少跨区域长途调拨。'
  }
]

const payableState: ErpPayableRecord[] = [
  {
    id: 'ap-1',
    code: 'AP-202607-001',
    supplier: '华东钢材供应有限公司',
    amount: 360000,
    paid: 120000,
    balance: 240000,
    dueDate: '2026-08-05',
    status: 'partial',
    sourceVoucher: 'PO-202607-018'
  },
  {
    id: 'ap-2',
    code: 'AP-202607-002',
    supplier: '苏州精密轴承制造厂',
    amount: 210000,
    paid: 0,
    balance: 210000,
    dueDate: '2026-08-08',
    status: 'open',
    sourceVoucher: 'PO-202607-024'
  },
  {
    id: 'ap-3',
    code: 'AP-202607-003',
    supplier: '青岛密封科技有限公司',
    amount: 96000,
    paid: 96000,
    balance: 0,
    dueDate: '2026-07-28',
    status: 'paid',
    sourceVoucher: 'PO-202607-011'
  }
]

const costState: ErpCostDetail[] = [
  {
    id: 'cost-1',
    product: '离心泵 XJP-100',
    materialCost: 268000,
    laborCost: 84000,
    overhead: 46000,
    total: 398000,
    period: '2026-07'
  },
  {
    id: 'cost-2',
    product: '齿轮箱 GBX-200',
    materialCost: 192000,
    laborCost: 61000,
    overhead: 35000,
    total: 288000,
    period: '2026-07'
  },
  {
    id: 'cost-3',
    product: '传动轴备件 DS-50',
    materialCost: 126000,
    laborCost: 42000,
    overhead: 24000,
    total: 192000,
    period: '2026-07'
  },
  {
    id: 'cost-4',
    product: '离心泵 XJP-150',
    materialCost: 214000,
    laborCost: 73000,
    overhead: 39000,
    total: 326000,
    period: '2026-06'
  }
]

const financeReportTrendState: ErpFinanceReportTrendPoint[] = [
  { period: '2026-03', revenue: 2760000, cost: 1980000, profit: 412000 },
  { period: '2026-04', revenue: 2890000, cost: 2050000, profit: 436000 },
  { period: '2026-05', revenue: 3010000, cost: 2120000, profit: 458000 },
  { period: '2026-06', revenue: 3140000, cost: 2210000, profit: 476000 },
  { period: '2026-07', revenue: 3280000, cost: 2320000, profit: 502000 }
]

const financeReportCurrentMonth: ErpFinanceReportMetrics = {
  revenue: 3280000,
  cost: 2320000,
  gross: 960000,
  receivable: 1260000,
  payable: 450000,
  profit: 502000
}

const financeReportLastMonth: ErpFinanceReportMetrics = {
  revenue: 3140000,
  cost: 2210000,
  gross: 930000,
  receivable: 1180000,
  payable: 472000,
  profit: 476000
}

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

function filterDemandPool(params: Omit<DemandPoolParams, 'pageNum' | 'pageSize'>) {
  let filtered = [...demandPoolState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['demandCode', 'sourceCode', 'productCode', 'productName', 'customerName', 'demandOwner'])
  }
  if (params.sourceType) {
    filtered = filtered.filter((item) => item.sourceType === params.sourceType)
  }
  if (params.priority) {
    filtered = filtered.filter((item) => item.priority === params.priority)
  }
  if (params.releaseReadiness) {
    filtered = filtered.filter((item) => item.releaseReadiness === params.releaseReadiness)
  }

  return filtered
}

function filterForecast(params: Omit<ForecastParams, 'pageNum' | 'pageSize'>) {
  let filtered = [...forecastState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['materialCode', 'materialName', 'remark', 'demandOwner'])
  }
  if (params.type) {
    filtered = filtered.filter((item) => item.type === params.type)
  }

  return filtered
}

function filterPayables(params: Omit<PayableParams, 'pageNum' | 'pageSize'>) {
  let filtered = [...payableState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'sourceVoucher'])
  }
  if (params.supplier) {
    filtered = searchItems(filtered, params.supplier, ['supplier'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterCost(params: Omit<CostParams, 'pageNum' | 'pageSize'>) {
  let filtered = [...costState]

  if (params.product) {
    filtered = searchItems(filtered, params.product, ['product'])
  }
  if (params.period) {
    filtered = filtered.filter((item) => item.period === params.period)
  }

  return filtered
}

function buildMrpCards(): ErpMrpSummaryCard[] {
  return [
    { title: '计划需求条目', value: `${demandPoolState.length} 条`, tone: 'primary' },
    { title: '采购建议', value: `${purchaseSuggestionState.length} 条`, tone: 'warning' },
    { title: '生产建议', value: `${productionSuggestionState.length} 条`, tone: 'success' },
    { title: '例外提醒', value: `${mrpExceptionState.length} 条`, tone: 'info' }
  ]
}

export async function getErpDemandPoolList(params: DemandPoolParams) {
  const filtered = filterDemandPool(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getErpDemandPoolSummary(params: Omit<DemandPoolParams, 'pageNum' | 'pageSize'> = {}) {
  const filtered = filterDemandPool(params)
  const summary: ErpDemandPoolSummary = {
    totalCount: filtered.length,
    urgentCount: filtered.filter((item) => item.priority === 'urgent').length,
    readyCount: filtered.filter((item) => item.releaseReadiness === 'ready').length,
    totalQty: filtered.reduce((sum, item) => sum + item.qty, 0)
  }

  return wrapDetailResponse(summary)
}

export async function mergeErpDemandPool(ids: string[]) {
  return wrapSuccessResponse(`已合并 ${ids.length} 条计划需求，请继续复核合并口径。`)
}

export async function prepareErpDemandRelease(ids: string[]) {
  demandPoolState.forEach((item) => {
    if (!ids.includes(item.id)) return

    item.releaseReadiness = 'ready'
    if (item.mrpStatus === 'not_run') {
      item.mrpStatus = 'planned'
    }
  })

  return wrapSuccessResponse(`已将 ${ids.length} 条需求标记为“可释放”。`)
}

export async function getErpMrpRunSummary(runId?: string) {
  const currentRun = mrpHistoryState.find((item) => item.id === runId) || mrpHistoryState[0]

  return wrapDetailResponse({
    runId: currentRun.id,
    scope: currentRun.scope,
    strategy: currentRun.strategy,
    lastRunTime: currentRun.runTime,
    cards: buildMrpCards()
  } satisfies ErpMrpRunSummary)
}

export async function runErpMrp() {
  const runId = `MRP-20260715-${String(mrpHistoryState.length + 1).padStart(2, '0')}`
  const runTime = '2026-07-15 15:20'

  mrpHistoryState.unshift({
    id: runId,
    runTime,
    operator: '经营计划部',
    triggerType: 'manual',
    scope: '制造一厂 / 装配车间',
    dateRange: '2026-07-15 ~ 2026-07-31',
    includeSafetyStock: true,
    includeInTransit: true,
    leadTimeMode: '标准',
    strategy: '净变更 + 缺料优先',
    orders: 14,
    purchaseSuggestions: purchaseSuggestionState.length,
    transferSuggestions: 1,
    productionSuggestions: productionSuggestionState.length,
    suggestions: purchaseSuggestionState.length + productionSuggestionState.length + 1,
    status: 'completed'
  })

  return wrapDetailResponse({
    runId,
    startedAt: runTime,
    status: 'completed'
  })
}

export async function getErpMrpResults(_runId: string, params: MrpResultParams) {
  let sourceData: Array<ErpMrpPurchaseSuggestion | ErpMrpProductionSuggestion | ErpMrpException> = []

  if (params.type === 'purchase') sourceData = purchaseSuggestionState
  if (params.type === 'production') sourceData = productionSuggestionState
  if (params.type === 'exception') sourceData = mrpExceptionState

  const result = paginate(cloneSeed(sourceData), params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function confirmErpMrpSuggestions(_runId: string, ids: string[]) {
  purchaseSuggestionState.forEach((item) => {
    if (ids.includes(item.id)) {
      item.status = 'released'
    }
  })
  productionSuggestionState.forEach((item) => {
    if (ids.includes(item.id)) {
      item.status = 'released'
    }
  })

  return wrapSuccessResponse(`已确认 ${ids.length} 条 MRP 建议，等待下游业务承接。`)
}

export async function getErpMrpHistoryList(params: MrpHistoryParams) {
  let filtered = [...mrpHistoryState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['id', 'scope', 'strategy', 'operator'])
  }
  if (params.triggerType) {
    filtered = filtered.filter((item) => item.triggerType === params.triggerType)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getErpNetChangeOverview(params: NetChangeParams) {
  let events = [...netChangeEventState]

  if (params.changeType) {
    events = events.filter((item) => item.type === params.changeType)
  }

  const increaseCount = netChangeAffectedState.filter((item) => item.action === 'increase').length
  const manualReviewCount = mrpExceptionState.filter((item) => item.level !== 'info').length
  const result = paginate(events, params.pageNum, params.pageSize)

  return wrapDetailResponse({
    cards: [
      { title: '净变更事件', value: `${result.total} 条`, tone: 'primary' },
      { title: '受影响物料', value: `${netChangeAffectedState.length} 项`, tone: 'warning' },
      { title: '增量需求物料', value: `${increaseCount} 项`, tone: 'success' },
      { title: '需人工复核', value: `${manualReviewCount} 项`, tone: 'info' }
    ],
    events: result.list,
    affected: cloneSeed(netChangeAffectedState)
  } satisfies ErpNetChangeOverview)
}

export async function getErpLedgerOverview() {
  const totalDebit = financeDebitAccounts.reduce((sum, item) => sum + item.amount, 0)
  const totalCredit = financeCreditAccounts.reduce((sum, item) => sum + item.amount, 0)
  const pendingReconciliation = financeReconciliation.filter((item) => item.status === 'pending').length

  return wrapDetailResponse({
    cards: [
      { title: '本期借方合计', value: totalDebit, tone: 'primary', note: '承接制造、库存和费用结转' },
      { title: '本期贷方合计', value: totalCredit, tone: 'success', note: '承接收入、负债与税费入账' },
      { title: '待处理对账项', value: pendingReconciliation, tone: 'warning', note: '仅表达 ERP 对账承接，不替代源单维护' },
      { title: '凭证条目数', value: financeLedgerEntries.length, tone: 'info', note: '静态批次校验样本' }
    ],
    debitData: cloneSeed(financeDebitAccounts),
    creditData: cloneSeed(financeCreditAccounts),
    ledgerData: cloneSeed(financeLedgerEntries),
    recData: cloneSeed(financeReconciliation),
    lastClosePeriod: '2026-07',
    carryNote: 'MES 提供执行事实，WMS 提供库存事实，本页仅承接 ERP 总账与对账结果。'
  } satisfies ErpLedgerOverview)
}

export async function getErpForecastList(params: ForecastParams) {
  const filtered = filterForecast(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getErpForecastOverview(params: Omit<ForecastParams, 'pageNum' | 'pageSize'> = {}) {
  const filtered = filterForecast(params)
  const avgProbability = filtered.length ? Math.round(filtered.reduce((sum, item) => sum + item.probability, 0) / filtered.length) : 0

  return wrapDetailResponse({
    cards: [
      { title: '预测条目', value: `${filtered.length} 条`, tone: 'primary' },
      { title: '销售预测', value: `${filtered.filter((item) => item.type === 'sales').length} 条`, tone: 'success' },
      { title: '独立预测', value: `${filtered.filter((item) => item.type === 'independent').length} 条`, tone: 'warning' },
      { title: '平均概率', value: `${avgProbability}%`, tone: 'info' }
    ],
    trend: cloneSeed(forecastTrendState)
  } satisfies ErpForecastOverview)
}

export async function createErpForecast(data: Partial<ErpForecastRecord>) {
  forecastState.unshift({
    id: generateId(),
    materialCode: data.materialCode || '',
    materialName: data.materialName || '',
    qty: data.qty || 0,
    needDate: data.needDate || '',
    type: data.type || 'sales',
    probability: data.probability || 0,
    remark: data.remark || '',
    demandOwner: data.demandOwner || '经营计划部',
    consumptionStatus: data.consumptionStatus || 'pending'
  })

  return wrapSuccessResponse('预测需求已新增。')
}

export async function updateErpForecast(id: string, data: Partial<ErpForecastRecord>) {
  const target = forecastState.find((item) => item.id === id)
  if (target) {
    Object.assign(target, data)
  }

  return wrapSuccessResponse('预测需求已更新。')
}

export async function deleteErpForecast(id: string) {
  const index = forecastState.findIndex((item) => item.id === id)
  if (index >= 0) {
    forecastState.splice(index, 1)
  }

  return wrapSuccessResponse('预测需求已删除。')
}

export async function getErpMultiPlantOverview() {
  const overloadedCount = multiPlantCapacityState.filter((item) => item.utilization >= 85).length

  return wrapDetailResponse({
    cards: [
      { title: '参与工厂', value: `${multiPlantCapacityState.length} 个`, tone: 'primary' },
      { title: '平衡建议', value: `${multiPlantSuggestionState.length} 条`, tone: 'warning' },
      { title: '高负荷工厂', value: `${overloadedCount} 个`, tone: 'success' },
      { title: '跨厂协同口径', value: 'ERP 承接', tone: 'info' }
    ],
    plantCapacity: cloneSeed(multiPlantCapacityState),
    results: cloneSeed(multiPlantSuggestionState)
  } satisfies ErpMultiPlantOverview)
}

export async function getErpPayableList(params: PayableParams) {
  const filtered = filterPayables(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getErpPayableOverview(params: Omit<PayableParams, 'pageNum' | 'pageSize'> = {}) {
  const filtered = filterPayables(params)
  const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0)
  const totalBalance = filtered.reduce((sum, item) => sum + item.balance, 0)

  return wrapDetailResponse({
    cards: [
      { title: '应付单据', value: `${filtered.length} 条`, tone: 'primary' },
      { title: '应付合计', value: `${totalAmount.toLocaleString('zh-CN')} 元`, tone: 'warning' },
      { title: '未付余额', value: `${totalBalance.toLocaleString('zh-CN')} 元`, tone: 'success' },
      { title: '部分付款', value: `${filtered.filter((item) => item.status === 'partial').length} 条`, tone: 'info' }
    ]
  } satisfies ErpPayableOverview)
}

export async function createErpPayable(data: Partial<ErpPayableRecord>) {
  const amount = data.amount || 0
  const paid = data.paid || 0

  payableState.unshift({
    id: generateId(),
    code: data.code || `AP-202607-${String(payableState.length + 1).padStart(3, '0')}`,
    supplier: data.supplier || '',
    amount,
    paid,
    balance: Math.max(amount - paid, 0),
    dueDate: data.dueDate || '',
    status: data.status || 'open',
    sourceVoucher: data.sourceVoucher || 'PO-STATIC'
  })

  return wrapSuccessResponse('应付单据已新增。')
}

export async function updateErpPayable(id: string, data: Partial<ErpPayableRecord>) {
  const target = payableState.find((item) => item.id === id)
  if (target) {
    const amount = data.amount ?? target.amount
    const paid = data.paid ?? target.paid
    Object.assign(target, data, {
      amount,
      paid,
      balance: Math.max(amount - paid, 0)
    })
  }

  return wrapSuccessResponse('应付单据已更新。')
}

export async function deleteErpPayable(id: string) {
  const index = payableState.findIndex((item) => item.id === id)
  if (index >= 0) {
    payableState.splice(index, 1)
  }

  return wrapSuccessResponse('应付单据已删除。')
}

export async function getErpCostList(params: CostParams) {
  const filtered = filterCost(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getErpCostOverview(period?: string) {
  const filtered = filterCost({ product: undefined, period })
  const totalCost = filtered.reduce((sum, item) => sum + item.total, 0)
  const materialCost = filtered.reduce((sum, item) => sum + item.materialCost, 0)
  const laborCost = filtered.reduce((sum, item) => sum + item.laborCost, 0)
  const overhead = filtered.reduce((sum, item) => sum + item.overhead, 0)

  return wrapDetailResponse({
    cards: [
      { title: '成本条目', value: `${filtered.length} 条`, tone: 'primary' },
      { title: '总成本', value: `${totalCost.toLocaleString('zh-CN')} 元`, tone: 'warning' },
      { title: '材料占比', value: totalCost ? `${Math.round((materialCost / totalCost) * 100)}%` : '0%', tone: 'success' },
      { title: '期间口径', value: period || '全部期间', tone: 'info' }
    ],
    composition: [
      { label: '材料成本', value: materialCost },
      { label: '人工成本', value: laborCost },
      { label: '制造费用', value: overhead }
    ]
  } satisfies ErpCostOverview)
}

export async function getErpFinanceReportOverview() {
  return wrapDetailResponse({
    cards: [
      { title: '营业收入', current: financeReportCurrentMonth.revenue, last: financeReportLastMonth.revenue, positiveBetter: true },
      { title: '营业成本', current: financeReportCurrentMonth.cost, last: financeReportLastMonth.cost, positiveBetter: false },
      { title: '毛利', current: financeReportCurrentMonth.gross, last: financeReportLastMonth.gross, positiveBetter: true },
      { title: '净利润', current: financeReportCurrentMonth.profit, last: financeReportLastMonth.profit, positiveBetter: true }
    ],
    currentMonth: cloneSeed(financeReportCurrentMonth),
    lastMonth: cloneSeed(financeReportLastMonth),
    trend: cloneSeed(financeReportTrendState)
  } satisfies ErpFinanceReportOverview)
}

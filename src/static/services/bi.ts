import { wrapDetailResponse } from '@/mock/shared/response'

export type BiDashboardKind = 'production' | 'quality' | 'inventory' | 'business'

export interface BiMetricCard {
  key: string
  label: string
  value: string | number
  unit: string
  trend: number
  tone: 'primary' | 'success' | 'warning' | 'danger'
}

export interface BiTrendSeries {
  name: string
  data: number[]
}

export interface BiDistributionItem {
  name: string
  value: number
}

export interface BiDetailColumn {
  prop: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}

export interface BiAnalysisSnapshot {
  kind: BiDashboardKind
  title: string
  primary_object: string
  source_systems: string[]
  period: string
  metrics: BiMetricCard[]
  trend: {
    title: string
    xAxis: string[]
    series: BiTrendSeries[]
  }
  distribution: {
    title: string
    items: BiDistributionItem[]
  }
  detailTitle: string
  detailColumns: BiDetailColumn[]
  detailRows: Array<Record<string, string | number>>
}

export const biPeriodOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本季度', value: 'quarter' }
]

const snapshots: Record<BiDashboardKind, Omit<BiAnalysisSnapshot, 'period'>> = {
  production: {
    kind: 'production',
    title: '生产分析看板',
    primary_object: '生产分析快照',
    source_systems: ['MES', 'IOT', 'EAM'],
    metrics: [
      { key: 'output', label: '完工数量', value: 18640, unit: '件', trend: 8.2, tone: 'primary' },
      { key: 'completion', label: '工单达成率', value: 94.6, unit: '%', trend: 3.1, tone: 'success' },
      { key: 'exception', label: '异常工单', value: 12, unit: '单', trend: -2.4, tone: 'warning' },
      { key: 'utilization', label: '设备利用率', value: 82.5, unit: '%', trend: 4.8, tone: 'success' }
    ],
    trend: {
      title: '产出与达成趋势',
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '完工数量', data: [2860, 3020, 3180, 2960, 3360, 3260] },
        { name: '计划数量', data: [3000, 3100, 3200, 3100, 3400, 3300] }
      ]
    },
    distribution: {
      title: '工单状态分布',
      items: [
        { name: '生产中', value: 38 },
        { name: '待派工', value: 16 },
        { name: '已完工', value: 84 },
        { name: '异常暂停', value: 12 }
      ]
    },
    detailTitle: '生产来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 160 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 120, align: 'right' },
      { prop: 'status', label: '状态', minWidth: 100, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 100 }
    ],
    detailRows: [
      { object: 'WO-202607-018 数控车削批次', source: 'MES', value: '3,260 件', status: '生产中', owner: '李班长' },
      { object: 'EQ-CK6150-01 主轴采样', source: 'IOT', value: '82.5%', status: '稳定', owner: '周采集' },
      { object: 'RP-202607-001 维修影响', source: 'EAM', value: '85 分钟', status: '维修中', owner: '陈维修' }
    ]
  },
  quality: {
    kind: 'quality',
    title: '质量分析看板',
    primary_object: '质量分析快照',
    source_systems: ['QMS', 'MES', 'SRM'],
    metrics: [
      { key: 'passRate', label: '一次合格率', value: 97.3, unit: '%', trend: 1.4, tone: 'success' },
      { key: 'inspection', label: '检验批次', value: 146, unit: '批', trend: 6.2, tone: 'primary' },
      { key: 'defect', label: '不良数量', value: 238, unit: '件', trend: -4.5, tone: 'warning' },
      { key: 'ncr', label: '不合格评审', value: 9, unit: '单', trend: -1.8, tone: 'danger' }
    ],
    trend: {
      title: '合格率与不良趋势',
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '一次合格率', data: [96.1, 96.8, 97.2, 97.6, 97.1, 97.3] },
        { name: '目标合格率', data: [97, 97, 97, 97, 97, 97] }
      ]
    },
    distribution: {
      title: '不良原因分布',
      items: [
        { name: '尺寸超差', value: 42 },
        { name: '外观缺陷', value: 31 },
        { name: '装配间隙', value: 18 },
        { name: '来料异常', value: 11 }
      ]
    },
    detailTitle: '质量来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 170 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 120, align: 'right' },
      { prop: 'status', label: '判定', minWidth: 100, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 100 }
    ],
    detailRows: [
      { object: 'IQC-202607-026 来料检验', source: 'QMS', value: '98.2%', status: '合格', owner: '王质检' },
      { object: 'PQC-202607-041 过程检验', source: 'QMS', value: '23 件不良', status: '待评审', owner: '赵质检' },
      { object: 'SRM 供应批次 S-081', source: 'SRM', value: '11 件', status: '供应异常', owner: '许采购' }
    ]
  },
  inventory: {
    kind: 'inventory',
    title: '库存分析看板',
    primary_object: '库存分析快照',
    source_systems: ['WMS', 'ERP'],
    metrics: [
      { key: 'amount', label: '库存金额', value: 1286, unit: '万元', trend: -3.2, tone: 'primary' },
      { key: 'turnover', label: '周转天数', value: 23.4, unit: '天', trend: -1.6, tone: 'success' },
      { key: 'risk', label: '风险物料', value: 37, unit: '项', trend: 5.2, tone: 'warning' },
      { key: 'accuracy', label: '账实准确率', value: 99.1, unit: '%', trend: 0.6, tone: 'success' }
    ],
    trend: {
      title: '库存金额与周转趋势',
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '库存金额', data: [1390, 1352, 1330, 1306, 1298, 1286] },
        { name: '周转天数', data: [28, 27, 25.5, 24.8, 24.1, 23.4] }
      ]
    },
    distribution: {
      title: '库存风险分布',
      items: [
        { name: '短缺', value: 12 },
        { name: '呆滞', value: 15 },
        { name: '超储', value: 7 },
        { name: '待检', value: 3 }
      ]
    },
    detailTitle: '库存来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 170 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 120, align: 'right' },
      { prop: 'status', label: '库存状态', minWidth: 100, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 100 }
    ],
    detailRows: [
      { object: 'INV-MAT-AX03 库存余额', source: 'WMS', value: '2,860 件', status: '正常', owner: '仓储组' },
      { object: 'PICK-202607-018 领料事务', source: 'WMS', value: '420 件', status: '已出库', owner: '张仓管' },
      { object: 'ERP-COST-0716 库存账', source: 'ERP', value: '1286 万元', status: '已过账', owner: '财务组' }
    ]
  },
  business: {
    kind: 'business',
    title: '经营分析看板',
    primary_object: '经营分析快照',
    source_systems: ['ERP', 'CRM', 'SRM'],
    metrics: [
      { key: 'revenue', label: '本月收入', value: 4360, unit: '万元', trend: 7.5, tone: 'primary' },
      { key: 'delivery', label: '订单交付率', value: 96.4, unit: '%', trend: 2.1, tone: 'success' },
      { key: 'purchase', label: '采购准交率', value: 93.8, unit: '%', trend: -1.2, tone: 'warning' },
      { key: 'receivable', label: '应收余额', value: 780, unit: '万元', trend: -4.2, tone: 'danger' }
    ],
    trend: {
      title: '收入与交付趋势',
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '收入', data: [3860, 3940, 4010, 4180, 4260, 4360] },
        { name: '交付率', data: [92.4, 93.1, 94.6, 95.1, 95.8, 96.4] }
      ]
    },
    distribution: {
      title: '订单结构分布',
      items: [
        { name: '重点客户', value: 46 },
        { name: '常规客户', value: 32 },
        { name: '试制订单', value: 12 },
        { name: '售后订单', value: 10 }
      ]
    },
    detailTitle: '经营来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 180 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 120, align: 'right' },
      { prop: 'status', label: '业务状态', minWidth: 100, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 100 }
    ],
    detailRows: [
      { object: 'SO-202607-039 销售订单', source: 'ERP', value: '860 万元', status: '生产中', owner: '销售组' },
      { object: 'CRM-OPP-062 客户机会', source: 'CRM', value: '320 万元', status: '报价中', owner: '客户经理' },
      { object: 'SRM-PO-071 采购协同', source: 'SRM', value: '93.8%', status: '跟进中', owner: '采购组' }
    ]
  }
}

export async function getBiAnalysisSnapshot(kind: BiDashboardKind, period = 'month') {
  return wrapDetailResponse({ ...snapshots[kind], period }, '查询分析快照成功')
}

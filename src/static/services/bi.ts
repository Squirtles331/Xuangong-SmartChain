import { wrapDetailResponse, wrapListResponse } from '@/mock/shared/response'

export type BiDashboardKind = 'production' | 'quality' | 'inventory' | 'business' | 'energy' | 'ehs' | 'hr'

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

export type BiReportCatalogStatus = 'published' | 'draft' | 'offline'

export interface BiReportCatalogRecord {
  id: string
  name: string
  topic: string
  source_systems: string[]
  cycle: string
  status: BiReportCatalogStatus
  last_updated_at: string
  owner: string
  description: string
}

export interface BiReportCatalogQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  topic?: string
  status?: BiReportCatalogStatus | ''
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
  },
  energy: {
    kind: 'energy',
    title: '能耗分析',
    primary_object: '能耗分析快照',
    source_systems: ['IOT', 'EAM', 'MES'],
    metrics: [
      { key: 'totalEnergy', label: '综合能耗', value: 286.4, unit: 'MWh', trend: -4.6, tone: 'primary' },
      { key: 'unitEnergy', label: '单位能耗', value: 15.2, unit: 'kWh/件', trend: -2.8, tone: 'success' },
      { key: 'peakLoad', label: '峰值负荷', value: 842, unit: 'kW', trend: 3.5, tone: 'warning' },
      { key: 'abnormal', label: '异常点位', value: 7, unit: '个', trend: -1.2, tone: 'danger' }
    ],
    trend: {
      title: '能耗与单位能耗趋势',
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '综合能耗', data: [48.6, 47.2, 45.8, 49.1, 46.3, 49.4] },
        { name: '单位能耗', data: [16.4, 15.9, 15.3, 15.8, 14.9, 15.2] }
      ]
    },
    distribution: {
      title: '能耗结构分布',
      items: [
        { name: '机加工产线', value: 42 },
        { name: '热处理设备', value: 26 },
        { name: '空压系统', value: 18 },
        { name: '辅助照明', value: 14 }
      ]
    },
    detailTitle: '能耗来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 180 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 130, align: 'right' },
      { prop: 'status', label: '状态', minWidth: 110, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 110 }
    ],
    detailRows: [
      { object: 'PT-ENERGY-018 主电表采样', source: 'IOT', value: '49.4 MWh', status: '已采集', owner: '能源专员' },
      { object: 'EQ-HT-02 热处理炉', source: 'EAM', value: '26%', status: '负荷偏高', owner: '设备组' },
      { object: 'LINE-CNC-01 产出折算', source: 'MES', value: '15.2 kWh/件', status: '稳定', owner: '生产组' }
    ]
  },
  ehs: {
    kind: 'ehs',
    title: '安环分析',
    primary_object: '安环分析快照',
    source_systems: ['QMS', 'MES', 'EAM'],
    metrics: [
      { key: 'eventCount', label: '安环事件', value: 18, unit: '起', trend: -3.4, tone: 'warning' },
      { key: 'closureRate', label: '整改闭环率', value: 92.8, unit: '%', trend: 4.2, tone: 'success' },
      { key: 'environmentRisk', label: '环保超限', value: 3, unit: '次', trend: -1.6, tone: 'danger' },
      { key: 'trainingRate', label: '培训完成率', value: 96.5, unit: '%', trend: 2.7, tone: 'primary' }
    ],
    trend: {
      title: '事件与整改闭环趋势',
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '安环事件', data: [26, 24, 21, 20, 19, 18] },
        { name: '整改闭环率', data: [84, 86.5, 88.2, 90.1, 91.4, 92.8] }
      ]
    },
    distribution: {
      title: '安环主题分布',
      items: [
        { name: '现场隐患', value: 38 },
        { name: '环保排放', value: 18 },
        { name: '设备防护', value: 24 },
        { name: '培训缺口', value: 20 }
      ]
    },
    detailTitle: '安环来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 180 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 130, align: 'right' },
      { prop: 'status', label: '闭环状态', minWidth: 110, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 110 }
    ],
    detailRows: [
      { object: 'SAFE-202607-012 现场隐患', source: 'QMS', value: '6 项', status: '整改中', owner: '安环专员' },
      { object: 'EQ-GUARD-05 防护检查', source: 'EAM', value: '2 项待修', status: '跟进中', owner: '设备组' },
      { object: 'MES-LINE-03 作业风险', source: 'MES', value: '96.5%', status: '已培训', owner: '班组长' }
    ]
  },
  hr: {
    kind: 'hr',
    title: '人资分析',
    primary_object: '人资分析快照',
    source_systems: ['HR', 'MES', 'MDM'],
    metrics: [
      { key: 'attendanceRate', label: '出勤率', value: 97.6, unit: '%', trend: 1.1, tone: 'success' },
      { key: 'shiftCoverage', label: '班次覆盖率', value: 94.2, unit: '%', trend: -0.8, tone: 'warning' },
      { key: 'skillMatch', label: '技能匹配率', value: 91.5, unit: '%', trend: 3.3, tone: 'primary' },
      { key: 'pieceworkOutput', label: '计件产出', value: 12840, unit: '件', trend: 6.4, tone: 'success' }
    ],
    trend: {
      title: '出勤与产出趋势',
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '出勤率', data: [96.8, 97.1, 97.6, 97.3, 97.9, 97.6] },
        { name: '计件产出', data: [1980, 2050, 2140, 2080, 2290, 2300] }
      ]
    },
    distribution: {
      title: '人资主题分布',
      items: [
        { name: '正常出勤', value: 68 },
        { name: '加班支撑', value: 14 },
        { name: '技能缺口', value: 10 },
        { name: '班次风险', value: 8 }
      ]
    },
    detailTitle: '人资来源明细',
    detailColumns: [
      { prop: 'object', label: '来源对象', minWidth: 180 },
      { prop: 'source', label: '源系统', minWidth: 100, align: 'center' },
      { prop: 'value', label: '关键数值', minWidth: 130, align: 'right' },
      { prop: 'status', label: '状态', minWidth: 110, align: 'center' },
      { prop: 'owner', label: '责任人', minWidth: 110 }
    ],
    detailRows: [
      { object: 'ATT-202607-16 机加一班', source: 'HR', value: '97.6%', status: '正常', owner: '人事专员' },
      { object: 'SKILL-CNC-A 技能矩阵', source: 'MDM', value: '91.5%', status: '需补强', owner: '培训组' },
      { object: 'RPT-202607-058 计件报工', source: 'MES', value: '12,840 件', status: '已汇总', owner: '生产组' }
    ]
  }
}

export async function getBiAnalysisSnapshot(kind: BiDashboardKind, period = 'month') {
  return wrapDetailResponse({ ...snapshots[kind], period }, '查询分析快照成功')
}

const reportCatalogRecords: BiReportCatalogRecord[] = [
  {
    id: 'BI-RPT-001',
    name: '生产达成周报',
    topic: '生产分析',
    source_systems: ['MES', 'IOT', 'EAM'],
    cycle: '每周',
    status: 'published',
    last_updated_at: '2026-07-20 08:30',
    owner: '生产运营组',
    description: '汇总工单达成、设备利用、异常停机和产出趋势'
  },
  {
    id: 'BI-RPT-002',
    name: '质量损失月报',
    topic: '质量分析',
    source_systems: ['QMS', 'MES', 'SRM'],
    cycle: '每月',
    status: 'published',
    last_updated_at: '2026-07-18 17:20',
    owner: '质量管理组',
    description: '跟踪一次合格率、不良分布、不合格评审和供应批次异常'
  },
  {
    id: 'BI-RPT-003',
    name: '库存风险清单',
    topic: '库存分析',
    source_systems: ['WMS', 'ERP'],
    cycle: '每日',
    status: 'published',
    last_updated_at: '2026-07-21 07:45',
    owner: '仓储计划组',
    description: '识别短缺、呆滞、超储和待检库存风险'
  },
  {
    id: 'BI-RPT-004',
    name: '经营交付看板',
    topic: '经营分析',
    source_systems: ['ERP', 'CRM', 'SRM'],
    cycle: '每周',
    status: 'draft',
    last_updated_at: '2026-07-19 15:10',
    owner: '经营管理组',
    description: '观察收入、订单交付、采购准交和客户机会进度'
  },
  {
    id: 'BI-RPT-005',
    name: '能耗异常跟踪表',
    topic: '能耗分析',
    source_systems: ['IOT', 'EAM', 'MES'],
    cycle: '每日',
    status: 'published',
    last_updated_at: '2026-07-21 09:00',
    owner: '能源管理组',
    description: '跟踪高峰负荷、单位能耗和异常点位'
  },
  {
    id: 'BI-RPT-006',
    name: '安环整改闭环表',
    topic: '安环分析',
    source_systems: ['QMS', 'MES', 'EAM'],
    cycle: '每周',
    status: 'published',
    last_updated_at: '2026-07-20 16:40',
    owner: '安环管理组',
    description: '汇总现场隐患、环保超限、整改进度和培训完成情况'
  },
  {
    id: 'BI-RPT-007',
    name: '人资出勤与技能表',
    topic: '人资分析',
    source_systems: ['HR', 'MES', 'MDM'],
    cycle: '每周',
    status: 'draft',
    last_updated_at: '2026-07-17 18:05',
    owner: '人资管理组',
    description: '观察出勤率、班次覆盖、技能匹配和计件产出'
  },
  {
    id: 'BI-RPT-008',
    name: '供应协同风险表',
    topic: '经营分析',
    source_systems: ['SRM', 'ERP', 'WMS'],
    cycle: '每月',
    status: 'offline',
    last_updated_at: '2026-07-10 11:30',
    owner: '采购协同组',
    description: '复盘供应准交、到货异常和库存承接风险'
  }
]

export const biReportTopicOptions = Array.from(new Set(reportCatalogRecords.map((item) => item.topic))).map((topic) => ({
  label: topic,
  value: topic
}))

export const biReportStatusOptions = [
  { value: 'published', label: '已发布', type: 'success' as const },
  { value: 'draft', label: '草稿', type: 'warning' as const },
  { value: 'offline', label: '已下线', type: 'info' as const }
]

export async function getBiReportCatalogList(query: BiReportCatalogQuery = {}) {
  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const keyword = query.keyword?.trim()

  const filtered = reportCatalogRecords.filter((item) => {
    const matchKeyword = !keyword || [item.id, item.name, item.topic, item.owner, item.description].some((value) => value.includes(keyword))
    const matchTopic = !query.topic || item.topic === query.topic
    const matchStatus = !query.status || item.status === query.status

    return matchKeyword && matchTopic && matchStatus
  })

  const start = (pageNum - 1) * pageSize
  return wrapListResponse(filtered.slice(start, start + pageSize), filtered.length, pageNum, pageSize)
}

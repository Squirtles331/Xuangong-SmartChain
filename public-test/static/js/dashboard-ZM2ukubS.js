import { r as q } from './rolldown-runtime-b3L32Ng1.js'
import { A as m, M as g, g as y, j as p, y as v } from './index-DqMfCNbk.js'
import { t as I } from './mock-Ds7FPrnc.js'
import { t as d } from './mrp-1tKwTMFn.js'
import { a as u, i as l, o as i } from './wms-B08sA-A0.js'
import { s as a } from './work-order-_XyxRvo2.js'
var W = {
  headline: '今天优先处理执行阻塞与待办',
  prioritySummary: '当前有 3 类异常正在影响开工、报工与检验闭环，建议优先处理缺料、停机和待裁决事项。',
  updatedAt: '今天 08:30',
  todoCards: [
    {
      id: 'todo-wo-approval',
      title: '待审批工单',
      count: 2,
      severity: 'warning',
      ownerSystem: 'MES',
      targetRoute: '/mes/work-order/list',
      targetLabel: '进入工单列表',
      helperText: '2 单工单待审核后才能下发'
    },
    {
      id: 'todo-start',
      title: '待开工任务',
      count: 5,
      severity: 'normal',
      ownerSystem: 'MES',
      targetRoute: '/mes/execution/my-tasks',
      targetLabel: '进入我的任务',
      helperText: '班组成员今天待开工的工序任务'
    },
    {
      id: 'todo-report',
      title: '待报工任务',
      count: 4,
      severity: 'warning',
      ownerSystem: 'MES',
      targetRoute: '/mes/execution/my-tasks',
      targetLabel: '进入我的任务',
      helperText: '已有执行进度，需补报工结果'
    },
    {
      id: 'todo-inspection',
      title: '待检验任务',
      count: 6,
      severity: 'warning',
      ownerSystem: 'QMS',
      targetRoute: '/collaboration/qms/inspection',
      targetLabel: '进入检验任务',
      helperText: '来料与过程检验任务待处理'
    },
    {
      id: 'todo-ncr',
      title: '待质量裁决',
      count: 3,
      severity: 'danger',
      ownerSystem: 'QMS',
      targetRoute: '/collaboration/qms/ncr',
      targetLabel: '进入不合格处置',
      helperText: '失败检验待判定返工、报废或特采'
    },
    {
      id: 'todo-cutover',
      title: '待版本切换确认',
      count: 1,
      severity: 'info',
      ownerSystem: 'PLM / MES',
      targetRoute: '/engineering-plan/plm/change/cutover',
      targetLabel: '进入版本切换',
      helperText: '新旧版本现场切换待确认收口'
    }
  ],
  alerts: [
    {
      id: 'alert-shortage',
      type: '缺料预警',
      title: '机加工一车间有 3 张工单待齐套，影响今日开工计划',
      level: 'danger',
      count: 3,
      ownerSystem: 'WMS / MES',
      affectedObject: '工单 / 齐套检查',
      actionText: '查看开工齐套检查',
      targetRoute: '/mes/execution/kitting'
    },
    {
      id: 'alert-device',
      type: '设备停机',
      title: 'CNC 加工中心 VMC850 停机 26 分钟，影响 2 个工序任务',
      level: 'danger',
      count: 1,
      ownerSystem: '设备 / IoT',
      affectedObject: '设备事件 / 工序任务',
      actionText: '查看实时监控',
      targetRoute: '/collaboration/equipment-iot/iot/monitor'
    },
    {
      id: 'alert-quality',
      type: '质量失败',
      title: '2 张检验任务失败，冻结 WIP 批次 2 个，等待裁决',
      level: 'warning',
      count: 2,
      ownerSystem: 'QMS',
      affectedObject: '检验任务 / WIP 批次',
      actionText: '查看质量裁决',
      targetRoute: '/collaboration/qms/inspection'
    },
    {
      id: 'alert-overdue',
      type: '超期风险',
      title: '1 张工单计划完工已超期，需确认是否异常锁定或重排',
      level: 'warning',
      count: 1,
      ownerSystem: 'MES / APS',
      affectedObject: '工单 / 排程结果',
      actionText: '查看工单列表',
      targetRoute: '/mes/work-order/list'
    }
  ],
  executionStats: [
    {
      id: 'exec-start',
      title: '今日开工工单',
      value: 6,
      unit: '单',
      ownerSystem: 'MES',
      targetRoute: '/mes/work-order/list',
      trendText: '较昨日 +2',
      trendDirection: 'up'
    },
    {
      id: 'exec-running-wo',
      title: '生产中工单',
      value: 8,
      unit: '单',
      ownerSystem: 'MES',
      targetRoute: '/mes/work-order/list',
      trendText: '在制稳定',
      trendDirection: 'flat'
    },
    {
      id: 'exec-running-op',
      title: '生产中工序',
      value: 14,
      unit: '道',
      ownerSystem: 'MES',
      targetRoute: '/mes/execution/my-tasks',
      trendText: '较昨日 +3',
      trendDirection: 'up'
    },
    {
      id: 'exec-wip',
      title: '待检 WIP',
      value: 5,
      unit: '批',
      ownerSystem: 'MES / QMS',
      targetRoute: '/mes/execution/wip',
      trendText: '检验积压偏高',
      trendDirection: 'warning'
    },
    {
      id: 'exec-report',
      title: '今日报工',
      value: 126,
      unit: '件',
      ownerSystem: 'MES',
      targetRoute: '/mes/traceability/trace-report',
      trendText: '合格率 97.6%',
      trendDirection: 'up'
    },
    {
      id: 'exec-rework',
      title: '返工处理中',
      value: 2,
      unit: '单',
      ownerSystem: 'MES / QMS',
      targetRoute: '/mes/traceability/rework-order',
      trendText: '待复检 1 单',
      trendDirection: 'warning'
    }
  ],
  executionCharts: {
    statusDistribution: [
      { label: '待审批', value: 2, color: '#f59e0b', targetRoute: '/mes/work-order/list' },
      { label: '已下发', value: 6, color: '#3b82f6', targetRoute: '/mes/work-order/list' },
      { label: '生产中', value: 8, color: '#22c55e', targetRoute: '/mes/work-order/list' },
      { label: '待检验', value: 5, color: '#ef4444', targetRoute: '/collaboration/qms/inspection' },
      { label: '返工中', value: 2, color: '#8b5cf6', targetRoute: '/mes/traceability/rework-order' }
    ],
    workshopLoad: [
      { workshop: '机加工一车间', utilization: 86, wip: 18, status: 'busy', targetRoute: '/mes/traceability/kanban' },
      { workshop: '机加工二车间', utilization: 73, wip: 12, status: 'healthy', targetRoute: '/mes/traceability/kanban' },
      { workshop: '装配车间', utilization: 91, wip: 9, status: 'warning', targetRoute: '/mes/traceability/kanban' }
    ]
  },
  collaborationDomains: [
    {
      domain: 'WMS',
      title: '仓储与批次',
      ownerSystem: 'WMS',
      targetRoute: '/collaboration/wms/inventory',
      summaryItems: [
        { label: '低库存', value: 4, level: 'warning', targetRoute: '/collaboration/wms/inventory' },
        { label: '待领料', value: 3, level: 'warning', targetRoute: '/collaboration/wms/picking' },
        { label: '待入库', value: 2, level: 'normal', targetRoute: '/collaboration/wms/receipt' }
      ]
    },
    {
      domain: 'QMS',
      title: '质量裁决',
      ownerSystem: 'QMS',
      targetRoute: '/collaboration/qms/inspection',
      summaryItems: [
        { label: '待检', value: 6, level: 'warning', targetRoute: '/collaboration/qms/inspection' },
        { label: '失败待裁决', value: 3, level: 'danger', targetRoute: '/collaboration/qms/ncr' },
        { label: '待复检关闭', value: 1, level: 'info', targetRoute: '/collaboration/qms/re-inspection' }
      ]
    },
    {
      domain: '设备 / IoT',
      title: '设备与采集',
      ownerSystem: '设备 / IoT',
      targetRoute: '/collaboration/equipment-iot/iot/monitor',
      summaryItems: [
        { label: '运行设备', value: 8, level: 'normal', targetRoute: '/collaboration/equipment-iot/equipment/oee' },
        { label: '停机设备', value: 1, level: 'danger', targetRoute: '/collaboration/equipment-iot/iot/monitor' },
        { label: '告警', value: 3, level: 'warning', targetRoute: '/collaboration/equipment-iot/iot/alert' }
      ]
    },
    {
      domain: '工程计划',
      title: '工程与计划',
      ownerSystem: 'PLM / APS / ERP',
      targetRoute: '/engineering-plan/planning/aps/schedule',
      summaryItems: [
        { label: '待齐套', value: 3, level: 'warning', targetRoute: '/mes/execution/kitting' },
        { label: '待切换', value: 1, level: 'info', targetRoute: '/engineering-plan/plm/change/cutover' },
        { label: '计划例外', value: 2, level: 'danger', targetRoute: '/engineering-plan/planning/mrp/result' }
      ]
    },
    {
      domain: '客户交付',
      title: '客户与订单',
      ownerSystem: 'CRM',
      targetRoute: '/customer-business/crm/order',
      summaryItems: [
        { label: '今日交付', value: 4, level: 'normal', targetRoute: '/customer-business/crm/order' },
        { label: '延期风险', value: 2, level: 'warning', targetRoute: '/customer-business/crm/order' },
        { label: '订单变更', value: 1, level: 'info', targetRoute: '/customer-business/crm/order-change' }
      ]
    }
  ],
  shortcuts: [
    { id: 'shortcut-work-orders', title: '工单列表', group: '生产执行', ownerSystem: 'MES', targetRoute: '/mes/work-order/list', badge: '工' },
    { id: 'shortcut-tasks', title: '我的任务', group: '生产执行', ownerSystem: 'MES', targetRoute: '/mes/execution/my-tasks', badge: '任' },
    { id: 'shortcut-report', title: '报工记录', group: '生产执行', ownerSystem: 'MES', targetRoute: '/mes/traceability/trace-report', badge: '报' },
    { id: 'shortcut-wip', title: '在制品', group: '生产执行', ownerSystem: 'MES', targetRoute: '/mes/execution/wip', badge: 'W' },
    {
      id: 'shortcut-inspection',
      title: '检验任务',
      group: '质量裁决',
      ownerSystem: 'QMS',
      targetRoute: '/collaboration/qms/inspection',
      badge: '检'
    },
    { id: 'shortcut-picking', title: '生产领料', group: '仓储协同', ownerSystem: 'WMS', targetRoute: '/collaboration/wms/picking', badge: '领' },
    {
      id: 'shortcut-exception',
      title: '异常处置',
      group: '生产执行',
      ownerSystem: 'MES',
      targetRoute: '/mes/traceability/exception-center',
      badge: '异'
    },
    { id: 'shortcut-kanban', title: '生产看板', group: '追溯与异常', ownerSystem: 'MES', targetRoute: '/mes/traceability/kanban', badge: '看' },
    {
      id: 'shortcut-aps',
      title: '排程结果',
      group: '工程计划',
      ownerSystem: 'APS',
      targetRoute: '/engineering-plan/planning/aps/schedule',
      badge: '排'
    },
    { id: 'shortcut-bom', title: '产品结构', group: '工程计划', ownerSystem: 'PLM', targetRoute: '/engineering-plan/plm/bom/list', badge: 'B' }
  ],
  businessSummary: [
    {
      id: 'summary-delivery',
      title: '订单交付率',
      value: 94.2,
      unit: '%',
      trendText: '较上期 +1.8%',
      trendDirection: 'up',
      targetRoute: '/management-analysis/operations/dashboard'
    },
    {
      id: 'summary-oee',
      title: '设备 OEE',
      value: 78.5,
      unit: '%',
      trendText: '较上期 +3.1%',
      trendDirection: 'up',
      targetRoute: '/management-analysis/operations/dashboard'
    },
    {
      id: 'summary-stock-risk',
      title: '低库存风险',
      value: 4,
      unit: '项',
      trendText: '较昨日 +1',
      trendDirection: 'warning',
      targetRoute: '/collaboration/wms/inventory'
    },
    {
      id: 'summary-overdue',
      title: '超期工单',
      value: 1,
      unit: '单',
      trendText: '需确认重排',
      trendDirection: 'warning',
      targetRoute: '/mes/work-order/list'
    }
  ]
}
async function P() {
  return v(W)
}
var _ = q(I(), 1),
  c = _.default.mock({
    'list|6': [
      {
        'id|+1': 1,
        code: /(IQC|IPQC|FQC)-2026\d{5}/,
        'type|1': ['来料检验', '过程检验', '最终检验'],
        material: '@pick(["45#圆钢 D50","离心泵 XJP-100","轴承 6308","齿轮箱 GBX-200"])',
        lot: '@pick(["L20260601","WO202606300001","L20260518"])',
        'qty|10-500': 1,
        'status|1': ['pending', 'pending', 'done'],
        verdict: '@pick(["", "", "合格"])'
      }
    ]
  }).list
async function L() {
  await y(300, 600)
  const r = a.length,
    n = a.filter((t) => ['approved', 'released', 'in_progress'].includes(t.status)).length,
    e = a.filter((t) => t.status === 'completed').length,
    o = a.filter((t) => t.priority === 'urgent').length,
    s = c.length,
    w = c.filter((t) => t.status === 'pending').length,
    b = c.filter((t) => t.status === 'done').length,
    h = l.length,
    S = l.filter((t) => t.available < t.safety).length,
    f = l.reduce((t, E) => t + (E.qty || 0), 0),
    R = d.filter((t) => t.level === 'severe').length,
    k = d.filter((t) => t.level === 'warning').length,
    M = i.length,
    x = i.filter((t) => t.status === 'running').length,
    D = i.filter((t) => t.status === 'idle').length,
    T = i.filter((t) => t.status === 'maintenance').length
  return v({
    revenue: 850,
    revenue_trend: 12.5,
    active_orders: n,
    orders_trend: -5.2,
    oee: 78.5,
    oee_trend: 3.1,
    delivery_rate: 94.2,
    delivery_trend: 1.8,
    top_products: [
      { material: '离心泵 XJP-100', qty: 182 },
      { material: '齿轮箱 GBX-200', qty: 156 },
      { material: '传动轴 DS-50', qty: 121 },
      { material: '阀门组件 VL-300', qty: 96 }
    ],
    totalWorkOrders: r,
    activeWorkOrders: n,
    completedWorkOrders: e,
    urgentWorkOrders: o,
    planCompletionRate: r > 0 ? Math.round((e / r) * 100) : 0,
    totalInspections: s,
    pendingInspections: w,
    doneInspections: b,
    inspectionPassRate: s > 0 ? Math.round((b / s) * 100) : 0,
    totalStockItems: h,
    lowStockItems: S,
    totalStockQty: f,
    severeExceptions: R,
    warningExceptions: k,
    totalDevices: M,
    runningDevices: x,
    idleDevices: D,
    maintenanceDevices: T,
    todayOutput: 125
  })
}
async function O() {
  await y(400, 700)
  const r = []
  for (let e = 6; e >= 0; e -= 1) {
    const o = new Date()
    ;(o.setDate(o.getDate() - e),
      r.push({ date: o.toISOString().slice(0, 10), planned: Math.floor(Math.random() * 30) + 80, actual: Math.floor(Math.random() * 30) + 75 }))
  }
  const n = l
    .filter((e) => e.available < e.safety)
    .slice(0, 5)
    .map((e) => ({ code: e.code, name: e.name, available: e.available, safety: e.safety, gap: e.safety - e.available }))
  return v({
    trend: {
      months: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'],
      revenue: [680, 720, 780, 750, 820, 800, 850],
      cost: [520, 550, 580, 570, 600, 590, 620],
      profit: [160, 170, 200, 180, 220, 210, 230]
    },
    order_status: [
      { value: 12, name: '已下发' },
      { value: 28, name: '生产中' },
      { value: 8, name: '已完工' },
      { value: 5, name: '待审批' },
      { value: 3, name: '已关闭' }
    ],
    capacity: {
      legend: ['一车间', '二车间', '装配车间'],
      days: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '一车间', data: [85, 88, 82, 90, 86, 45], color: '#409eff' },
        { name: '二车间', data: [78, 80, 75, 82, 79, 40], color: '#67c23a' },
        { name: '装配车间', data: [92, 90, 88, 95, 91, 50], color: '#e6a23c' }
      ]
    },
    woStatusDistribution: [
      { name: '草稿', value: a.filter((e) => e.status === 'draft').length },
      { name: '已审批', value: a.filter((e) => e.status === 'approved').length },
      { name: '已下达', value: a.filter((e) => e.status === 'released').length },
      { name: '生产中', value: a.filter((e) => e.status === 'in_progress').length },
      { name: '已完成', value: a.filter((e) => e.status === 'completed').length },
      { name: '已关闭', value: a.filter((e) => e.status === 'closed').length }
    ],
    outputTrend: r,
    stockAlertTop5: n,
    workshopUtilization: [
      { workshop: '机加工一车间', utilization: 78, trend: 'up' },
      { workshop: '机加工二车间', utilization: 65, trend: 'stable' },
      { workshop: '装配车间', utilization: 92, trend: 'up' }
    ],
    qualityTrend: r.map((e) => ({
      date: e.date,
      inspected: Math.floor(Math.random() * 20) + 10,
      passed: Math.floor(Math.random() * 20) + 8,
      failed: Math.floor(Math.random() * 3)
    })),
    iotAlertStats: [
      { level: 'danger', count: u.filter((e) => e.level === 'danger').length },
      { level: 'warning', count: u.filter((e) => e.level === 'warning').length },
      { level: 'info', count: u.filter((e) => e.level === 'info').length }
    ],
    mrpExceptionSummary: d.map((e) => ({ type: e.type, level: e.level, material: e.material, detail: e.detail, action: e.action }))
  })
}
function X() {
  return g ? L() : m(p.get('/dashboard/stats'))
}
function B() {
  return g ? O() : m(p.get('/dashboard/charts'))
}
function $() {
  return g ? P() : m(p.get('/dashboard/workbench'))
}
export { B as n, $ as r, X as t }

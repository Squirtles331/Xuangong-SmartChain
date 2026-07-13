import type { WorkbenchHomepageData } from '@/types/workbench'
import { wrapDetailResponse } from '@/mock/shared/response'

const workbenchData: WorkbenchHomepageData = {
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
      targetRoute: '/engineering-plan/plm/cutover',
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
        { label: '待切换', value: 1, level: 'info', targetRoute: '/engineering-plan/plm/cutover' },
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

export async function getWorkbenchHomepageData() {
  return wrapDetailResponse(workbenchData)
}

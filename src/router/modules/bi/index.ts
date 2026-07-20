import type { RouteRecordRaw } from 'vue-router'

export const biRoute: RouteRecordRaw = {
  path: 'bi',
  name: 'businessInsight',
  meta: {
    title: '分析中心',
    icon: 'DataLine',
    order: 110,
    ownerSystem: 'BI',
    collaboratorSystems: ['MES', 'QMS', 'WMS', 'ERP', 'CRM', 'SRM', 'EAM', 'IOT'],
    coreObject: '生产分析快照 / 质量分析快照 / 库存分析快照 / 经营分析快照'
  },
  children: [
    {
      path: 'production',
      name: 'biProductionAnalysis',
      component: () => import('@/views/bi/production/index.vue'),
      meta: {
        title: '生产分析看板',
        icon: 'Histogram',
        order: 1,
        ownerSystem: 'BI',
        collaboratorSystems: ['MES', 'IOT', 'EAM'],
        coreObject: '生产分析快照'
      }
    },
    {
      path: 'quality',
      name: 'biQualityAnalysis',
      component: () => import('@/views/bi/quality/index.vue'),
      meta: {
        title: '质量分析看板',
        icon: 'DataAnalysis',
        order: 2,
        ownerSystem: 'BI',
        collaboratorSystems: ['QMS', 'MES', 'SRM'],
        coreObject: '质量分析快照'
      }
    },
    {
      path: 'inventory',
      name: 'biInventoryAnalysis',
      component: () => import('@/views/bi/inventory/index.vue'),
      meta: {
        title: '库存分析看板',
        icon: 'Box',
        order: 3,
        ownerSystem: 'BI',
        collaboratorSystems: ['WMS', 'ERP'],
        coreObject: '库存分析快照'
      }
    },
    {
      path: 'business',
      name: 'biBusinessAnalysis',
      component: () => import('@/views/bi/business/index.vue'),
      meta: {
        title: '经营分析看板',
        icon: 'TrendCharts',
        order: 4,
        ownerSystem: 'BI',
        collaboratorSystems: ['ERP', 'CRM', 'SRM'],
        coreObject: '经营分析快照'
      }
    },
    {
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/bi/DashboardView.vue'),
      meta: { title: '经营驾驶舱', icon: 'Histogram', order: 90, hidden: true }
    },
    {
      path: 'report',
      name: 'report',
      component: () => import('@/views/bi/ReportView.vue'),
      meta: { title: '经营报表', icon: 'Document', order: 91, hidden: true }
    },
    {
      path: 'energy/overview',
      name: 'energyOverview',
      component: () => import('@/views/bi/energy/overview/index.vue'),
      meta: { title: '能耗概览', icon: 'DataLine', order: 92, hidden: true }
    },
    {
      path: 'energy/detail',
      name: 'energyDetail',
      component: () => import('@/views/bi/energy/detail/index.vue'),
      meta: { title: '能耗明细', icon: 'List', order: 93, hidden: true }
    },
    {
      path: 'energy/benchmark',
      name: 'energyBenchmark',
      component: () => import('@/views/bi/energy/benchmark/index.vue'),
      meta: { title: '能效对标', icon: 'TrendCharts', order: 94, hidden: true }
    },
    {
      path: 'ehs/index',
      name: 'ehsIndex',
      component: () => import('@/views/bi/ehs/index/index.vue'),
      meta: { title: '安环总览', icon: 'Warning', order: 95, hidden: true }
    },
    {
      path: 'ehs/permit',
      name: 'ehsPermit',
      component: () => import('@/views/bi/ehs/permit/index.vue'),
      meta: { title: '作业票', icon: 'Document', order: 96, hidden: true }
    },
    {
      path: 'ehs/emergency',
      name: 'ehsEmergency',
      component: () => import('@/views/bi/ehs/emergency/index.vue'),
      meta: { title: '应急预案', icon: 'WarningFilled', order: 97, hidden: true }
    },
    {
      path: 'ehs/training',
      name: 'ehsTraining',
      component: () => import('@/views/bi/ehs/training/index.vue'),
      meta: { title: '安环培训', icon: 'Reading', order: 98, hidden: true }
    },
    {
      path: 'hr/index',
      name: 'hrIndex',
      component: () => import('@/views/bi/hr/index/index.vue'),
      meta: { title: '人资总览', icon: 'User', order: 99, hidden: true }
    },
    {
      path: 'hr/attendance',
      name: 'hrAttendance',
      component: () => import('@/views/bi/hr/attendance/index.vue'),
      meta: { title: '考勤', icon: 'Clock', order: 100, hidden: true }
    },
    {
      path: 'hr/schedule',
      name: 'hrSchedule',
      component: () => import('@/views/bi/hr/schedule/index.vue'),
      meta: { title: '排班', icon: 'Calendar', order: 101, hidden: true }
    },
    {
      path: 'hr/piecework',
      name: 'hrPiecework',
      component: () => import('@/views/bi/hr/piecework/index.vue'),
      meta: { title: '计件工资', icon: 'Money', order: 102, hidden: true }
    },
    {
      path: 'hr/skill-matrix',
      name: 'hrSkillMatrix',
      component: () => import('@/views/bi/hr/skill-matrix/index.vue'),
      meta: { title: '技能矩阵', icon: 'Grid', order: 103, hidden: true }
    }
  ]
}

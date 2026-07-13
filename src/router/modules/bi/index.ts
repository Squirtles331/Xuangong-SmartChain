import type { RouteRecordRaw } from 'vue-router'

export const biRoute: RouteRecordRaw = {
  path: 'bi',
  name: 'businessInsight',
  meta: {
    title: '经营分析',
    icon: 'DataLine',
    order: 110,
    ownerSystem: 'BI',
    collaboratorSystems: ['ERP', 'CRM', 'MES'],
    coreObject: '经营分析与专题分析'
  },
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/analysis/DashboardView.vue'),
      meta: { title: '经营驾驶舱', icon: 'Histogram', order: 1 }
    },
    {
      path: 'report',
      name: 'report',
      component: () => import('@/views/analysis/ReportView.vue'),
      meta: { title: '经营报表', icon: 'Document', order: 2 }
    },
    {
      path: 'energy/overview',
      name: 'energyOverview',
      component: () => import('@/views/energy/overview/index.vue'),
      meta: { title: '能耗概览', icon: 'DataLine', order: 3 }
    },
    {
      path: 'energy/detail',
      name: 'energyDetail',
      component: () => import('@/views/energy/detail/index.vue'),
      meta: { title: '能耗明细', icon: 'List', order: 4 }
    },
    {
      path: 'energy/benchmark',
      name: 'energyBenchmark',
      component: () => import('@/views/energy/benchmark/index.vue'),
      meta: { title: '能效对标', icon: 'TrendCharts', order: 5 }
    },
    {
      path: 'ehs/index',
      name: 'ehsIndex',
      component: () => import('@/views/ehs/index/index.vue'),
      meta: { title: '安环总览', icon: 'Warning', order: 6 }
    },
    {
      path: 'ehs/permit',
      name: 'ehsPermit',
      component: () => import('@/views/ehs/permit/index.vue'),
      meta: { title: '作业票', icon: 'Document', order: 7 }
    },
    {
      path: 'ehs/emergency',
      name: 'ehsEmergency',
      component: () => import('@/views/ehs/emergency/index.vue'),
      meta: { title: '应急预案', icon: 'WarningFilled', order: 8 }
    },
    {
      path: 'ehs/training',
      name: 'ehsTraining',
      component: () => import('@/views/ehs/training/index.vue'),
      meta: { title: '安环培训', icon: 'Reading', order: 9 }
    },
    {
      path: 'hr/index',
      name: 'hrIndex',
      component: () => import('@/views/hr/index/index.vue'),
      meta: { title: '人资总览', icon: 'User', order: 10 }
    },
    {
      path: 'hr/attendance',
      name: 'hrAttendance',
      component: () => import('@/views/hr/attendance/index.vue'),
      meta: { title: '考勤', icon: 'Clock', order: 11 }
    },
    {
      path: 'hr/schedule',
      name: 'hrSchedule',
      component: () => import('@/views/hr/schedule/index.vue'),
      meta: { title: '排班', icon: 'Calendar', order: 12 }
    },
    {
      path: 'hr/piecework',
      name: 'hrPiecework',
      component: () => import('@/views/hr/piecework/index.vue'),
      meta: { title: '计件工资', icon: 'Money', order: 13 }
    },
    {
      path: 'hr/skill-matrix',
      name: 'hrSkillMatrix',
      component: () => import('@/views/hr/skill-matrix/index.vue'),
      meta: { title: '技能矩阵', icon: 'Grid', order: 14 }
    }
  ]
}

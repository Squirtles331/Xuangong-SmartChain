import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const erpRoute: RouteRecordRaw = {
  path: 'erp',
  name: 'erpCenter',
  meta: {
    title: '经营计划',
    icon: 'Operation',
    order: 100,
    ownerSystem: 'ERP',
    collaboratorSystems: ['APS', 'CRM', 'BI'],
    coreObject: '需求计划 / MRP / 财务核算'
  },
  children: [
    {
      path: 'demand-pool',
      name: 'planningDemandPool',
      component: plannedPage,
      meta: planned(
        '需求池',
        'CollectionTag',
        1,
        '汇总计划输入，承接需求合并、优先级和发布准备。',
        ['需求合并', '优先级队列', '影响评估', '发布准备'],
        {
          ownerSystem: 'ERP',
          collaboratorSystems: ['APS'],
          coreObject: '计划需求'
        }
      )
    },
    {
      path: 'mrp/result',
      name: 'mrpResult',
      component: () => import('@/views/erp/mrp/result/index.vue'),
      meta: { title: '物料需求结果', icon: 'Operation', order: 2, ownerSystem: 'ERP', collaboratorSystems: ['APS'], coreObject: 'MRP 结果' }
    },
    {
      path: 'mrp/history',
      name: 'mrpHistory',
      component: () => import('@/views/erp/mrp/history/index.vue'),
      meta: { title: '物料需求历史', icon: 'Clock', order: 3 }
    },
    {
      path: 'mrp/forecast',
      name: 'mrpForecast',
      component: () => import('@/views/erp/mrp/forecast/index.vue'),
      meta: { title: '预测需求', icon: 'TrendCharts', order: 4 }
    },
    {
      path: 'mrp/multi-plant',
      name: 'mrpMultiPlant',
      component: () => import('@/views/erp/mrp/multi-plant/index.vue'),
      meta: { title: '多工厂计划', icon: 'Connection', order: 5 }
    },
    {
      path: 'mrp/net-change',
      name: 'mrpNetChange',
      component: () => import('@/views/erp/mrp/net-change/index.vue'),
      meta: { title: '净变更计划', icon: 'Refresh', order: 6 }
    },
    {
      path: 'finance/index',
      name: 'financeIndex',
      component: () => import('@/views/erp/finance/index/index.vue'),
      meta: { title: '财务概览', icon: 'Money', order: 7 }
    },
    {
      path: 'finance/cost',
      name: 'financeCost',
      component: () => import('@/views/erp/finance/cost/index.vue'),
      meta: { title: '成本分析', icon: 'TrendCharts', order: 8 }
    },
    {
      path: 'finance/report',
      name: 'financeReport',
      component: () => import('@/views/erp/finance/report/index.vue'),
      meta: { title: '财务报表', icon: 'DataLine', order: 9 }
    },
    {
      path: 'finance/ledger',
      name: 'financeLedger',
      component: () => import('@/views/erp/finance/ledger/index.vue'),
      meta: { title: '总账对账', icon: 'Notebook', order: 10 }
    }
  ]
}

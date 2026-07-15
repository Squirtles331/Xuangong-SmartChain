import type { RouteRecordRaw } from 'vue-router'

export const erpRoute: RouteRecordRaw = {
  path: 'erp',
  name: 'erpCenter',
  redirect: { name: 'erpDemandPool' },
  meta: {
    title: '计划经营',
    icon: 'Operation',
    order: 100,
    ownerSystem: 'ERP',
    collaboratorSystems: ['APS', 'CRM', 'MES', 'WMS', 'SRM'],
    coreObject: '计划输入 / MRP / 财务承接'
  },
  children: [
    {
      path: 'planning-input',
      name: 'erpPlanningInput',
      redirect: { name: 'erpDemandPool' },
      meta: {
        title: '计划输入',
        icon: 'CollectionTag',
        order: 1,
        ownerSystem: 'ERP',
        collaboratorSystems: ['CRM', 'APS'],
        coreObject: '计划输入承接'
      },
      children: [
        {
          path: 'demand-pool',
          name: 'erpDemandPool',
          component: () => import('@/views/erp/planning-input/demand-pool/index.vue'),
          meta: {
            title: '需求池',
            icon: 'CollectionTag',
            order: 1,
            ownerSystem: 'ERP',
            collaboratorSystems: ['CRM', 'APS'],
            coreObject: '计划需求'
          }
        },
        {
          path: 'forecast',
          name: 'erpForecast',
          component: () => import('@/views/erp/planning-input/forecast/index.vue'),
          meta: {
            title: '预测需求',
            icon: 'TrendCharts',
            order: 2,
            ownerSystem: 'ERP',
            collaboratorSystems: ['CRM'],
            coreObject: '预测需求'
          }
        }
      ]
    },
    {
      path: 'material-plan',
      name: 'erpMaterialPlan',
      redirect: { name: 'erpMrpResult' },
      meta: {
        title: '物料计划',
        icon: 'Operation',
        order: 2,
        ownerSystem: 'ERP',
        collaboratorSystems: ['APS', 'MES', 'WMS'],
        coreObject: 'MRP 承接结果'
      },
      children: [
        {
          path: 'mrp-result',
          name: 'erpMrpResult',
          component: () => import('@/views/erp/material-plan/mrp-result/index.vue'),
          meta: {
            title: 'MRP结果',
            icon: 'Operation',
            order: 1,
            ownerSystem: 'ERP',
            collaboratorSystems: ['CRM', 'APS', 'MES', 'WMS'],
            coreObject: 'MRP 建议结果'
          }
        },
        {
          path: 'net-change',
          name: 'erpMrpNetChange',
          component: () => import('@/views/erp/material-plan/net-change/index.vue'),
          meta: {
            title: '净变更计划',
            icon: 'Refresh',
            order: 2,
            ownerSystem: 'ERP',
            collaboratorSystems: ['APS', 'MES', 'WMS'],
            coreObject: '净变更影响'
          }
        },
        {
          path: 'mrp-history',
          name: 'erpMrpHistory',
          component: () => import('@/views/erp/material-plan/mrp-history/index.vue'),
          meta: {
            title: 'MRP历史',
            icon: 'Clock',
            order: 3,
            ownerSystem: 'ERP',
            collaboratorSystems: ['CRM', 'APS'],
            coreObject: 'MRP 历史运行'
          }
        },
        {
          path: 'multi-plant',
          name: 'erpMultiPlant',
          component: () => import('@/views/erp/material-plan/multi-plant/index.vue'),
          meta: {
            title: '多工厂计划',
            icon: 'Connection',
            order: 4,
            ownerSystem: 'ERP',
            collaboratorSystems: ['APS', 'WMS'],
            coreObject: '多工厂供需平衡'
          }
        }
      ]
    },
    {
      path: 'finance-carry',
      name: 'erpFinanceCarry',
      redirect: { name: 'erpLedger' },
      meta: {
        title: '财务承接',
        icon: 'Money',
        order: 3,
        ownerSystem: 'ERP',
        collaboratorSystems: ['MES', 'WMS', 'SRM', 'PLM', 'BI'],
        coreObject: '财务承接对象'
      },
      children: [
        {
          path: 'ledger',
          name: 'erpLedger',
          component: () => import('@/views/erp/finance-carry/ledger/index.vue'),
          meta: {
            title: '总账对账',
            icon: 'Notebook',
            order: 1,
            ownerSystem: 'ERP',
            collaboratorSystems: ['MES', 'WMS'],
            coreObject: '总账分录 / 对账结果'
          }
        },
        {
          path: 'payable',
          name: 'erpPayable',
          component: () => import('@/views/erp/finance-carry/payable/index.vue'),
          meta: {
            title: '应付管理',
            icon: 'Money',
            order: 2,
            ownerSystem: 'ERP',
            collaboratorSystems: ['SRM'],
            coreObject: '应付单据'
          }
        },
        {
          path: 'cost-analysis',
          name: 'erpCostAnalysis',
          component: () => import('@/views/erp/finance-carry/cost-analysis/index.vue'),
          meta: {
            title: '成本分析',
            icon: 'TrendCharts',
            order: 3,
            ownerSystem: 'ERP',
            collaboratorSystems: ['PLM', 'MES', 'WMS'],
            coreObject: '成本结果'
          }
        },
        {
          path: 'finance-report',
          name: 'erpFinanceReport',
          component: () => import('@/views/erp/finance-carry/finance-report/index.vue'),
          meta: {
            title: '财务报表',
            icon: 'DataLine',
            order: 4,
            ownerSystem: 'ERP',
            collaboratorSystems: ['BI'],
            coreObject: '经营报表'
          }
        }
      ]
    }
  ]
}

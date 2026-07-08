import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const plannedPage = () => import('@/views/shared/PlannedPage.vue')

const decode = (value: string) => decodeURIComponent(value)

const t = {
  login: decode('%E7%99%BB%E5%BD%95'),
  lock: decode('%E9%94%81%E5%B1%8F'),
  home: decode('%E9%A6%96%E9%A1%B5%E5%B7%A5%E4%BD%9C%E5%8F%B0'),
  mes: decode('MES%E6%89%A7%E8%A1%8C%E4%B8%AD%E6%9E%A2'),
  workOrderCenter: decode('%E5%B7%A5%E5%8D%95%E4%B8%AD%E5%BF%83'),
  workOrderList: decode('%E5%B7%A5%E5%8D%95%E7%AE%A1%E7%90%86'),
  workOrderCreate: decode('%E6%96%B0%E5%BB%BA%E5%B7%A5%E5%8D%95'),
  workOrderDetail: decode('%E5%B7%A5%E5%8D%95%E8%AF%A6%E6%83%85'),
  workOrderSplit: decode('%E5%B7%A5%E5%8D%95%E6%8B%86%E5%88%86'),
  outsource: decode('%E5%A7%94%E5%A4%96%E5%B7%A5%E5%8D%95'),
  execution: decode('%E6%89%A7%E8%A1%8C%E4%B8%AD%E5%BF%83'),
  myTasks: decode('%E6%88%91%E7%9A%84%E4%BB%BB%E5%8A%A1'),
  operationTask: decode('%E5%B7%A5%E5%BA%8F%E4%BB%BB%E5%8A%A1'),
  report: decode('%E5%B7%A5%E5%BA%8F%E6%8A%A5%E5%B7%A5'),
  wip: decode('WIP%E7%AE%A1%E7%90%86'),
  kitting: decode('%E9%BD%90%E5%A5%97%E6%A0%A1%E9%AA%8C'),
  consumption: decode('%E6%8A%95%E6%96%99%2F%E6%B6%88%E8%80%97'),
  traceability: decode('%E8%BF%BD%E6%BA%AF%E4%B8%8E%E7%9B%91%E6%8E%A7'),
  kanban: decode('%E8%BD%A6%E9%97%B4%E7%9C%8B%E6%9D%BF'),
  traceReport: decode('%E6%8A%A5%E5%B7%A5%E8%BF%BD%E6%BA%AF'),
  productTrace: decode('%E4%BA%A7%E5%93%81%E8%BF%BD%E6%BA%AF'),
  productionLog: decode('%E7%94%9F%E4%BA%A7%E6%97%A5%E5%BF%97'),
  exceptionCenter: decode('%E5%BC%82%E5%B8%B8%E4%B8%AD%E5%BF%83'),
  reworkOrder: decode('%E8%BF%94%E5%B7%A5%E5%B7%A5%E5%8D%95'),
  engineeringPlan: decode('%E5%B7%A5%E7%A8%8B%E4%B8%8E%E8%AE%A1%E5%88%92'),
  plm: decode('PLM%E4%BA%A7%E5%93%81%E5%B7%A5%E8%89%BA'),
  bomList: decode('BOM%E7%AE%A1%E7%90%86'),
  bomEditor: decode('BOM%E7%BC%96%E8%BE%91%E5%99%A8'),
  compare: decode('%E7%89%88%E6%9C%AC%E6%AF%94%E8%BE%83'),
  explode: decode('%E5%B1%95%E5%BC%80%2F%E5%8F%8D%E6%9F%A5'),
  costRollup: decode('%E6%88%90%E6%9C%AC%E5%8D%B7%E7%A7%AF'),
  routing: decode('%E5%B7%A5%E8%89%BA%E8%B7%AF%E7%BA%BF'),
  routingEditor: decode('%E5%B7%A5%E8%89%BA%E8%B7%AF%E7%BA%BF%E7%BC%96%E8%BE%91'),
  parallelRouting: decode('%E5%B9%B6%E8%A1%8C%E5%B7%A5%E5%BA%8F'),
  autoTime: decode('%E5%B7%A5%E6%97%B6%E8%87%AA%E5%AD%A6%E4%B9%A0'),
  ecn: decode('ECN%20%2F%20ECO%E5%8F%98%E6%9B%B4'),
  cutover: decode('%E7%89%88%E6%9C%AC%E5%88%87%E6%8D%A2'),
  planning: decode('%E8%AE%A1%E5%88%92%E5%8D%8F%E5%90%8C'),
  demandPool: decode('%E8%AE%A1%E5%88%92%E9%9C%80%E6%B1%82%E6%B1%A0'),
  aps: decode('APS%E6%8E%92%E7%A8%8B'),
  constraint: decode('%E7%BA%A6%E6%9D%9F%E9%85%8D%E7%BD%AE'),
  history: decode('%E8%BF%90%E8%A1%8C%E5%8E%86%E5%8F%B2'),
  mrpResult: decode('MRP%E7%BB%93%E6%9E%9C'),
  forecast: decode('%E9%A2%84%E6%B5%8B%E9%9C%80%E6%B1%82'),
  multiPlant: decode('%E5%A4%9A%E5%B7%A5%E5%8E%82MRP'),
  netChange: decode('%E5%87%80%E5%8F%98%E6%9B%B4MRP'),
  disturbance: decode('%E6%89%B0%E5%8A%A8%E9%87%8D%E6%8E%92'),
  collaboration: decode('%E5%8D%8F%E5%90%8C%E6%94%AF%E6%92%91'),
  wms: decode('WMS%E4%BB%93%E5%82%A8%E5%8D%8F%E5%90%8C'),
  inventory: decode('%E5%BA%93%E5%AD%98%E6%9F%A5%E8%AF%A2'),
  picking: decode('%E7%94%9F%E4%BA%A7%E9%A2%86%E6%96%99'),
  receipt: decode('%E5%85%A5%E5%BA%93%E7%AE%A1%E7%90%86'),
  delivery: decode('%E9%94%80%E5%94%AE%E5%87%BA%E5%BA%93'),
  return: decode('%E9%80%80%E6%96%99%2F%E9%80%80%E8%B4%A7'),
  stockCount: decode('%E5%BA%93%E5%AD%98%E7%9B%98%E7%82%B9'),
  transfer: decode('%E5%BA%93%E5%AD%98%E8%B0%83%E6%8B%A8'),
  backflush: decode('%E5%80%92%E5%86%B2%E9%A2%86%E6%96%99'),
  barcode: decode('%E6%9D%A1%E7%A0%81%E7%AE%A1%E7%90%86'),
  barcodePrint: decode('%E6%9D%A1%E7%A0%81%E6%89%93%E5%8D%B0'),
  barcodeScan: decode('%E6%89%AB%E7%A0%81%E5%87%BA%E5%85%A5%E5%BA%93'),
  quarantine: decode('%E6%89%B9%E6%AC%A1%E9%9A%94%E7%A6%BB'),
  qms: decode('QMS%E8%B4%A8%E9%87%8F%E8%A3%81%E5%86%B3'),
  inspection: decode('%E8%B4%A8%E6%A3%80%E7%AE%A1%E7%90%86'),
  template: decode('%E8%B4%A8%E6%A3%80%E6%A8%A1%E6%9D%BF'),
  supplierQuality: decode('%E4%BE%9B%E5%BA%94%E5%95%86%E8%B4%A8%E9%87%8F'),
  ncr: decode('%E4%B8%8D%E5%90%88%E6%A0%BC%E5%A4%84%E7%BD%AE'),
  concession: decode('%E7%89%B9%E9%87%87%E6%94%BE%E8%A1%8C'),
  reworkReview: decode('%E8%BF%94%E5%B7%A5%E8%AF%84%E5%AE%A1'),
  scrapReview: decode('%E6%8A%A5%E5%BA%9F%E8%AF%84%E5%AE%A1'),
  reInspection: decode('%E5%A4%8D%E6%A3%80%E5%85%B3%E9%97%AD'),
  srm: decode('SRM%E9%87%87%E8%B4%AD%E5%8D%8F%E5%90%8C'),
  supplier: decode('%E4%BE%9B%E5%BA%94%E5%95%86%E7%AE%A1%E7%90%86'),
  pr: decode('%E9%87%87%E8%B4%AD%E7%94%B3%E8%AF%B7'),
  purchase: decode('%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95'),
  purchaseReturn: decode('%E9%87%87%E8%B4%AD%E9%80%80%E8%B4%A7'),
  price: decode('%E9%87%87%E8%B4%AD%E4%BB%B7%E6%A0%BC'),
  portal: decode('%E4%BE%9B%E5%BA%94%E5%95%86%E9%97%A8%E6%88%B7'),
  equipmentIot: decode('%E8%AE%BE%E5%A4%87%E4%B8%8EIoT'),
  equipmentList: decode('%E8%AE%BE%E5%A4%87%E5%8F%B0%E8%B4%A6'),
  equipmentCheck: decode('%E7%82%B9%E6%A3%80%E7%AE%A1%E7%90%86'),
  maintain: decode('%E4%BF%9D%E5%85%BB%E7%AE%A1%E7%90%86'),
  repair: decode('%E7%BB%B4%E4%BF%AE%E5%B7%A5%E5%8D%95'),
  spare: decode('%E5%A4%87%E4%BB%B6%E7%AE%A1%E7%90%86'),
  oee: decode('OEE%E7%BB%9F%E8%AE%A1'),
  monitor: decode('%E8%AE%BE%E5%A4%87%E7%9B%91%E6%8E%A7'),
  collectConfig: decode('%E9%87%87%E9%9B%86%E9%85%8D%E7%BD%AE'),
  historyData: decode('%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE'),
  alertRule: decode('%E5%91%8A%E8%AD%A6%E8%A7%84%E5%88%99'),
  autoReport: decode('%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%B7%A5'),
  customerBusiness: decode('%E5%AE%A2%E6%88%B7%E4%B8%8E%E7%BB%8F%E8%90%A5'),
  crm: decode('CRM%E5%AE%A2%E6%88%B7%E7%BB%8F%E8%90%A5'),
  customer: decode('%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86'),
  order: decode('%E9%94%80%E5%94%AE%E8%AE%A2%E5%8D%95'),
  orderChange: decode('%E8%AE%A2%E5%8D%95%E5%8F%98%E6%9B%B4'),
  contract: decode('%E5%90%88%E5%90%8C%E7%AE%A1%E7%90%86'),
  opportunity: decode('%E5%95%86%E6%9C%BA%E7%AE%A1%E7%90%86'),
  quotation: decode('%E6%8A%A5%E4%BB%B7%E7%AE%A1%E7%90%86'),
  invoice: decode('%E5%8F%91%E7%A5%A8%E7%AE%A1%E7%90%86'),
  receivable: decode('%E5%BA%94%E6%94%B6%E5%8F%B0%E8%B4%A6'),
  analysis: decode('%E7%AE%A1%E7%90%86%E5%88%86%E6%9E%90'),
  opsAnalysis: decode('%E5%88%86%E6%9E%90%E4%B8%8E%E7%BB%8F%E8%90%A5'),
  dashboard: decode('%E6%95%B0%E6%8D%AE%E9%9D%A2%E6%9D%BF'),
  reportList: decode('%E6%8A%A5%E8%A1%A8%E7%AE%A1%E7%90%86'),
  finance: decode('%E8%B4%A2%E5%8A%A1%E7%AE%A1%E7%90%86'),
  cost: decode('%E6%88%90%E6%9C%AC%E6%A0%B8%E7%AE%97'),
  financeReport: decode('%E8%B4%A2%E5%8A%A1%E6%8A%A5%E8%A1%A8'),
  ledger: decode('%E6%80%BB%E8%B4%A6%E5%AF%B9%E8%B4%A6'),
  compliance: decode('%E8%83%BD%E6%BA%90%20%2F%20%E5%AE%89%E7%8E%AF%20%2F%20%E4%BA%BA%E8%B5%84'),
  energyOverview: decode('%E8%83%BD%E8%80%97%E6%A6%82%E8%A7%88'),
  energyDetail: decode('%E8%83%BD%E8%80%97%E6%98%8E%E7%BB%86'),
  energyBenchmark: decode('%E8%83%BD%E8%80%97%E5%AF%B9%E6%A0%87'),
  safety: decode('%E5%AE%89%E5%85%A8%E7%AE%A1%E7%90%86'),
  permit: decode('%E4%BD%9C%E4%B8%9A%E7%A5%A8%E7%AE%A1%E7%90%86'),
  emergency: decode('%E5%BA%94%E6%80%A5%E9%A2%84%E6%A1%88'),
  training: decode('%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86'),
  hr: decode('%E4%BA%BA%E8%B5%84%E7%AE%A1%E7%90%86'),
  attendance: decode('%E8%80%83%E5%8B%A4%E7%AE%A1%E7%90%86'),
  schedule: decode('%E7%8F%AD%E7%BB%84%E6%8E%92%E7%8F%AD'),
  piecework: decode('%E8%AE%A1%E4%BB%B6%E5%B7%A5%E8%B5%84'),
  skillMatrix: decode('%E6%8A%80%E8%83%BD%E7%9F%A9%E9%98%B5'),
  platform: decode('%E5%B9%B3%E5%8F%B0%E5%9F%BA%E7%A1%80'),
  system: decode('%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86'),
  user: decode('%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86'),
  role: decode('%E8%A7%92%E8%89%B2%E7%AE%A1%E7%90%86'),
  menu: decode('%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86'),
  dict: decode('%E5%AD%97%E5%85%B8%E7%AE%A1%E7%90%86'),
  params: decode('%E7%B3%BB%E7%BB%9F%E5%8F%82%E6%95%B0'),
  audit: decode('%E6%93%8D%E4%BD%9C%E6%97%A5%E5%BF%97'),
  codeRule: decode('%E7%BC%96%E7%A0%81%E8%A7%84%E5%88%99'),
  approval: decode('%E5%AE%A1%E6%89%B9%E6%B5%81%E9%85%8D%E7%BD%AE'),
  file: decode('%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86'),
  notification: decode('%E9%80%9A%E7%9F%A5%E9%85%8D%E7%BD%AE'),
  sso: decode('SSO%E9%85%8D%E7%BD%AE'),
  printConfig: decode('%E6%89%93%E5%8D%B0%E9%85%8D%E7%BD%AE'),
  printTemplate: decode('%E6%89%93%E5%8D%B0%E6%A8%A1%E6%9D%BF'),
  printTemplateSettings: decode('%E6%89%93%E5%8D%B0%E6%A8%A1%E6%9D%BF%E8%AE%BE%E7%BD%AE'),
  printTemplateDesigner: decode('%E6%89%93%E5%8D%B0%E6%A8%A1%E6%9D%BF%E8%AE%BE%E8%AE%A1'),
  mdm: decode('%E4%B8%BB%E6%95%B0%E6%8D%AE%E6%B2%BB%E7%90%86'),
  organization: decode('%E7%BB%84%E7%BB%87%E7%AE%A1%E7%90%86'),
  material: decode('%E7%89%A9%E6%96%99%E7%AE%A1%E7%90%86'),
  resource: decode('%E5%88%B6%E9%80%A0%E8%B5%84%E6%BA%90'),
  workCenter: decode('%E5%B7%A5%E4%BD%9C%E4%B8%AD%E5%BF%83'),
  mold: decode('%E6%A8%A1%E5%85%B7%E7%AE%A1%E7%90%86'),
  platformSettings: decode('%E5%B9%B3%E5%8F%B0%E9%85%8D%E7%BD%AE'),
  systemConfig: decode('%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE'),
  settingLog: decode('%E8%AE%BE%E7%BD%AE%E6%97%A5%E5%BF%97'),
  about: decode('%E5%85%B3%E4%BA%8E')
} as const

type PlannedMeta = {
  title: string
  icon: string
  order: number
  placeholderDesc?: string
  plannedItems?: string[]
}

const planned = (title: string, icon: string, order: number, desc: string, items: string[]): PlannedMeta => ({
  title,
  icon,
  order,
  placeholderDesc: desc,
  plannedItems: items
})

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: t.login, hidden: true }
  },
  {
    path: '/lock',
    name: 'lock',
    component: () => import('@/views/LockView.vue'),
    meta: { title: t.lock, hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: t.home, icon: 'House', order: 0 }
      },
      {
        path: 'mes',
        name: 'mesCenter',
        meta: { title: t.mes, icon: 'Monitor', order: 10 },
        children: [
          {
            path: 'work-order',
            name: 'mesWorkOrderCenter',
            meta: { title: t.workOrderCenter, icon: 'Tickets', order: 1 },
            children: [
              {
                path: 'list',
                name: 'workOrderList',
                component: () => import('@/views/work-order/list/index.vue'),
                meta: { title: t.workOrderList, icon: 'Tickets', order: 1 }
              },
              {
                path: 'create',
                name: 'workOrderCreate',
                component: () => import('@/views/work-order/create/index.vue'),
                meta: { title: t.workOrderCreate, icon: 'Plus', order: 2, hidden: true, activeMenu: '/mes/work-order/list' }
              },
              {
                path: ':id',
                name: 'workOrderDetail',
                component: () => import('@/views/work-order/detail/index.vue'),
                meta: { title: t.workOrderDetail, hidden: true, activeMenu: '/mes/work-order/list' }
              },
              {
                path: 'split',
                name: 'workOrderSplit',
                component: () => import('@/views/work-order/split/index.vue'),
                meta: { title: t.workOrderSplit, hidden: true, activeMenu: '/mes/work-order/list' }
              },
              {
                path: 'outsource',
                name: 'workOrderOutsource',
                component: () => import('@/views/work-order/outsource/index.vue'),
                meta: { title: t.outsource, icon: 'Connection', order: 3 }
              }
            ]
          },
          {
            path: 'execution',
            name: 'mesExecutionCenter',
            meta: { title: t.execution, icon: 'SetUp', order: 2 },
            children: [
              {
                path: 'my-tasks',
                name: 'workOrderMyTasks',
                component: () => import('@/views/work-order/my-tasks/index.vue'),
                meta: { title: t.myTasks, icon: 'User', order: 1 }
              },
              {
                path: 'operation-task',
                name: 'mesOperationTask',
                component: plannedPage,
                meta: planned(t.operationTask, 'List', 2, 'Operation task placeholder', [
                  'Task pool',
                  'Dependencies',
                  'Status flow',
                  'Exception recovery'
                ])
              },
              {
                path: 'report/:id',
                name: 'workOrderReport',
                component: () => import('@/views/work-order/report/index.vue'),
                meta: { title: t.report, hidden: true, activeMenu: '/mes/execution/my-tasks' }
              },
              {
                path: 'wip',
                name: 'mesWip',
                component: plannedPage,
                meta: planned(t.wip, 'Grid', 3, 'WIP management placeholder', ['Batch ledger', 'Freeze / unfreeze', 'Flow tracking', 'Rework return'])
              },
              {
                path: 'kitting',
                name: 'mesKitting',
                component: plannedPage,
                meta: planned(t.kitting, 'Select', 4, 'Kitting verification placeholder', [
                  'Material check',
                  'Version check',
                  'Qualification check',
                  'Release gate'
                ])
              },
              {
                path: 'consumption',
                name: 'mesConsumption',
                component: plannedPage,
                meta: planned(t.consumption, 'TakeawayBox', 5, 'Consumption placeholder', [
                  'Batch binding',
                  'Actual usage',
                  'Supplement / return',
                  'Substitute approval'
                ])
              }
            ]
          },
          {
            path: 'traceability',
            name: 'mesTraceabilityCenter',
            meta: { title: t.traceability, icon: 'DataBoard', order: 3 },
            children: [
              {
                path: 'kanban',
                name: 'workOrderKanban',
                component: () => import('@/views/work-order/kanban/index.vue'),
                meta: { title: t.kanban, icon: 'DataBoard', order: 1 }
              },
              {
                path: 'trace-report',
                name: 'workOrderTrace',
                component: () => import('@/views/work-order/trace/index.vue'),
                meta: { title: t.traceReport, icon: 'Clock', order: 2 }
              },
              {
                path: 'product-trace',
                name: 'mesProductTrace',
                component: plannedPage,
                meta: planned(t.productTrace, 'Connection', 3, 'Product trace placeholder', [
                  'Forward trace',
                  'Reverse trace',
                  'Entity linkage',
                  'Impact scope'
                ])
              },
              {
                path: 'production-log',
                name: 'mesProductionLog',
                component: plannedPage,
                meta: planned(t.productionLog, 'Notebook', 4, 'Production log placeholder', [
                  'Timeline',
                  'Object filter',
                  'Status history',
                  'Audit trail'
                ])
              },
              {
                path: 'exception-center',
                name: 'mesExceptionCenter',
                component: plannedPage,
                meta: planned(t.exceptionCenter, 'Warning', 5, 'Exception center placeholder', [
                  'Exception grades',
                  'Lock scope',
                  'Recovery rules',
                  'Approval release'
                ])
              },
              {
                path: 'rework-order',
                name: 'mesReworkOrder',
                component: plannedPage,
                meta: planned(t.reworkOrder, 'RefreshLeft', 6, 'Rework order placeholder', [
                  'Source link',
                  'Rework route',
                  'Reinspection handoff',
                  'Cost collection'
                ])
              }
            ]
          }
        ]
      },
      {
        path: 'engineering-plan',
        name: 'engineeringPlan',
        meta: { title: t.engineeringPlan, icon: 'Collection', order: 20 },
        children: [
          {
            path: 'plm',
            name: 'plmEngineering',
            meta: { title: t.plm, icon: 'Collection', order: 1 },
            children: [
              {
                path: 'bom/list',
                name: 'bomList',
                component: () => import('@/views/bom/list/index.vue'),
                meta: { title: t.bomList, icon: 'List', order: 1 }
              },
              {
                path: 'bom/create',
                name: 'bomCreate',
                component: () => import('@/views/bom/editor/index.vue'),
                meta: { title: t.workOrderCreate, hidden: true, activeMenu: '/engineering-plan/plm/bom/list' }
              },
              {
                path: 'bom/editor/:id',
                name: 'bomEditor',
                component: () => import('@/views/bom/editor/index.vue'),
                meta: { title: t.bomEditor, hidden: true, activeMenu: '/engineering-plan/plm/bom/list' }
              },
              {
                path: 'bom/compare',
                name: 'bomCompare',
                component: () => import('@/views/bom/compare/index.vue'),
                meta: { title: t.compare, icon: 'Switch', order: 2 }
              },
              {
                path: 'bom/explode',
                name: 'bomExplode',
                component: () => import('@/views/bom/explode/index.vue'),
                meta: { title: t.explode, icon: 'Search', order: 3 }
              },
              {
                path: 'bom/cost',
                name: 'bomCost',
                component: () => import('@/views/bom/cost/index.vue'),
                meta: { title: t.costRollup, icon: 'Money', order: 4 }
              },
              {
                path: 'routing',
                name: 'plmRoutingList',
                component: plannedPage,
                meta: planned(t.routing, 'Connection', 5, 'Routing placeholder', ['Route list', 'Route version', 'Process order', 'Editor entry'])
              },
              {
                path: 'routing/editor/:id',
                name: 'routingEditor',
                component: () => import('@/views/routing/editor/index.vue'),
                meta: { title: t.routingEditor, hidden: true, activeMenu: '/engineering-plan/plm/routing' }
              },
              {
                path: 'routing/parallel',
                name: 'routingParallel',
                component: () => import('@/views/routing/parallel/index.vue'),
                meta: { title: t.parallelRouting, icon: 'Share', order: 6 }
              },
              {
                path: 'routing/auto-time',
                name: 'routingAutoTime',
                component: () => import('@/views/routing/auto-time/index.vue'),
                meta: { title: t.autoTime, icon: 'Timer', order: 7 }
              },
              {
                path: 'ecn/list',
                name: 'ecnList',
                component: () => import('@/views/ecn/list/index.vue'),
                meta: { title: t.ecn, icon: 'Switch', order: 8 }
              },
              {
                path: 'cutover',
                name: 'plmCutover',
                component: plannedPage,
                meta: planned(t.cutover, 'Right', 9, 'Cutover placeholder', ['Impact scan', 'Approval', 'Old/new closeout', 'Execution log'])
              }
            ]
          },
          {
            path: 'planning',
            name: 'planningCollaboration',
            meta: { title: t.planning, icon: 'Timer', order: 2 },
            children: [
              {
                path: 'demand-pool',
                name: 'planningDemandPool',
                component: plannedPage,
                meta: planned(t.demandPool, 'CollectionTag', 1, 'Demand pool placeholder', [
                  'Demand merge',
                  'Priority queue',
                  'Impact review',
                  'Release prep'
                ])
              },
              {
                path: 'aps/schedule',
                name: 'apsSchedule',
                component: () => import('@/views/aps/schedule/index.vue'),
                meta: { title: t.aps, icon: 'Timer', order: 2 }
              },
              {
                path: 'aps/constraint',
                name: 'apsConstraint',
                component: () => import('@/views/aps/constraint/index.vue'),
                meta: { title: t.constraint, icon: 'Setting', order: 3 }
              },
              {
                path: 'aps/history',
                name: 'apsHistory',
                component: plannedPage,
                meta: planned(t.history, 'Clock', 4, 'APS history placeholder', ['Version list', 'Parameter snapshot', 'Conflict compare', 'Replay'])
              },
              {
                path: 'mrp/result',
                name: 'mrpResult',
                component: () => import('@/views/mrp/result/index.vue'),
                meta: { title: t.mrpResult, icon: 'Operation', order: 5 }
              },
              {
                path: 'mrp/history',
                name: 'mrpHistory',
                component: () => import('@/views/mrp/history/index.vue'),
                meta: { title: t.history, icon: 'Clock', order: 6 }
              },
              {
                path: 'mrp/forecast',
                name: 'mrpForecast',
                component: () => import('@/views/mrp/forecast/index.vue'),
                meta: { title: t.forecast, icon: 'TrendCharts', order: 7 }
              },
              {
                path: 'mrp/multi-plant',
                name: 'mrpMultiPlant',
                component: () => import('@/views/mrp/multi-plant/index.vue'),
                meta: { title: t.multiPlant, icon: 'Connection', order: 8 }
              },
              {
                path: 'mrp/net-change',
                name: 'mrpNetChange',
                component: () => import('@/views/mrp/net-change/index.vue'),
                meta: { title: t.netChange, icon: 'Refresh', order: 9 }
              },
              {
                path: 'disturbance-reschedule',
                name: 'planningDisturbanceReschedule',
                component: plannedPage,
                meta: planned(t.disturbance, 'RefreshRight', 10, 'Reschedule placeholder', [
                  'L1 adjust',
                  'L2 local',
                  'L3 global',
                  'Constraint coordination'
                ])
              }
            ]
          }
        ]
      },
      {
        path: 'collaboration',
        name: 'collaborationSupport',
        meta: { title: t.collaboration, icon: 'Connection', order: 30 },
        children: [
          {
            path: 'wms',
            name: 'wmsCollaboration',
            meta: { title: t.wms, icon: 'Box', order: 1 },
            children: [
              {
                path: 'inventory',
                name: 'wmsInventory',
                component: () => import('@/views/wms/inventory/index.vue'),
                meta: { title: t.inventory, icon: 'List', order: 1 }
              },
              {
                path: 'picking',
                name: 'wmsPicking',
                component: () => import('@/views/wms/picking/index.vue'),
                meta: { title: t.picking, icon: 'TakeawayBox', order: 2 }
              },
              {
                path: 'receipt',
                name: 'wmsReceipt',
                component: () => import('@/views/wms/receipt/index.vue'),
                meta: { title: t.receipt, icon: 'Download', order: 3 }
              },
              {
                path: 'delivery',
                name: 'wmsDelivery',
                component: () => import('@/views/wms/delivery/index.vue'),
                meta: { title: t.delivery, icon: 'Upload', order: 4 }
              },
              {
                path: 'return',
                name: 'wmsReturn',
                component: () => import('@/views/wms/return/index.vue'),
                meta: { title: t.return, icon: 'Refresh', order: 5 }
              },
              {
                path: 'stock-count',
                name: 'wmsStockCount',
                component: () => import('@/views/wms/stock-count/index.vue'),
                meta: { title: t.stockCount, icon: 'Checked', order: 6 }
              },
              {
                path: 'transfer',
                name: 'wmsTransfer',
                component: () => import('@/views/wms/transfer/index.vue'),
                meta: { title: t.transfer, icon: 'Connection', order: 7 }
              },
              {
                path: 'backflush',
                name: 'wmsBackflush',
                component: () => import('@/views/wms/backflush/index.vue'),
                meta: { title: t.backflush, icon: 'RefreshLeft', order: 8 }
              },
              {
                path: 'barcode',
                name: 'wmsBarcode',
                component: () => import('@/views/wms/barcode/index.vue'),
                meta: { title: t.barcode, icon: 'Postcard', order: 9 }
              },
              {
                path: 'barcode-print',
                name: 'wmsBarcodePrint',
                component: () => import('@/views/wms/barcode-print/index.vue'),
                meta: { title: t.barcodePrint, icon: 'Printer', order: 10 }
              },
              {
                path: 'barcode-scan',
                name: 'wmsBarcodeScan',
                component: () => import('@/views/wms/barcode-scan/index.vue'),
                meta: { title: t.barcodeScan, icon: 'Scan', order: 11 }
              },
              {
                path: 'batch-quarantine',
                name: 'wmsBatchQuarantine',
                component: plannedPage,
                meta: planned(t.quarantine, 'Lock', 12, 'Batch quarantine placeholder', [
                  'Quarantine list',
                  'Freeze / release',
                  'Decision link',
                  'Inventory control'
                ])
              }
            ]
          },
          {
            path: 'qms',
            name: 'qmsDecision',
            meta: { title: t.qms, icon: 'Checked', order: 2 },
            children: [
              {
                path: 'inspection',
                name: 'qmsInspection',
                component: () => import('@/views/qms/inspection/index.vue'),
                meta: { title: t.inspection, icon: 'Search', order: 1 }
              },
              {
                path: 'template',
                name: 'qmsTemplate',
                component: () => import('@/views/qms/template/index.vue'),
                meta: { title: t.template, icon: 'Notebook', order: 2 }
              },
              {
                path: 'supplier-quality',
                name: 'qmsSupplierQuality',
                component: () => import('@/views/qms/supplier-quality/index.vue'),
                meta: { title: t.supplierQuality, icon: 'TrendCharts', order: 3 }
              },
              {
                path: 'ncr',
                name: 'qmsNcr',
                component: plannedPage,
                meta: planned(t.ncr, 'CircleClose', 4, 'NCR placeholder', ['NCR ledger', 'Owner assignment', 'Decision actions', 'MES/WMS link'])
              },
              {
                path: 'concession',
                name: 'qmsConcession',
                component: plannedPage,
                meta: planned(t.concession, 'Finished', 5, 'Concession placeholder', ['Request', 'Approval route', 'Risk note', 'Release range'])
              },
              {
                path: 'rework-review',
                name: 'qmsReworkReview',
                component: plannedPage,
                meta: planned(t.reworkReview, 'RefreshLeft', 6, 'Rework review placeholder', [
                  'Review',
                  'Route choice',
                  'Create order',
                  'Reinspection rule'
                ])
              },
              {
                path: 'scrap-review',
                name: 'qmsScrapReview',
                component: plannedPage,
                meta: planned(t.scrapReview, 'DeleteFilled', 7, 'Scrap review placeholder', [
                  'Scrap request',
                  'Cause / owner',
                  'Quantity approval',
                  'Loss collection'
                ])
              },
              {
                path: 're-inspection',
                name: 'qmsReInspection',
                component: plannedPage,
                meta: planned(t.reInspection, 'Select', 8, 'Reinspection placeholder', [
                  'Reinspection task',
                  'Result confirm',
                  'Unlock action',
                  'Close case'
                ])
              }
            ]
          },
          {
            path: 'srm',
            name: 'srmCollaboration',
            meta: { title: t.srm, icon: 'ShoppingBag', order: 3 },
            children: [
              {
                path: 'supplier',
                name: 'scmSupplier',
                component: () => import('@/views/scm/supplier/index.vue'),
                meta: { title: t.supplier, icon: 'Avatar', order: 1 }
              },
              {
                path: 'purchase-request',
                name: 'scmPR',
                component: () => import('@/views/scm/purchase-request/index.vue'),
                meta: { title: t.pr, icon: 'Edit', order: 2 }
              },
              {
                path: 'purchase',
                name: 'scmPurchase',
                component: () => import('@/views/scm/purchase/index.vue'),
                meta: { title: t.purchase, icon: 'ShoppingCart', order: 3 }
              },
              {
                path: 'return',
                name: 'scmReturn',
                component: () => import('@/views/scm/return/index.vue'),
                meta: { title: t.purchaseReturn, icon: 'Sell', order: 4 }
              },
              {
                path: 'price',
                name: 'scmPrice',
                component: () => import('@/views/scm/price/index.vue'),
                meta: { title: t.price, icon: 'Money', order: 5 }
              },
              {
                path: 'portal',
                name: 'scmPortal',
                component: () => import('@/views/scm/portal/index.vue'),
                meta: { title: t.portal, icon: 'Connection', order: 6 }
              }
            ]
          },
          {
            path: 'equipment-iot',
            name: 'equipmentIotSupport',
            meta: { title: t.equipmentIot, icon: 'Cpu', order: 4 },
            children: [
              {
                path: 'equipment/list',
                name: 'equipmentList',
                component: () => import('@/views/equipment/list/index.vue'),
                meta: { title: t.equipmentList, icon: 'Monitor', order: 1 }
              },
              {
                path: 'equipment/check',
                name: 'equipmentCheck',
                component: () => import('@/views/equipment/check/index.vue'),
                meta: { title: t.equipmentCheck, icon: 'Checked', order: 2 }
              },
              {
                path: 'equipment/maintain',
                name: 'equipmentMaintain',
                component: () => import('@/views/equipment/maintain/index.vue'),
                meta: { title: t.maintain, icon: 'SetUp', order: 3 }
              },
              {
                path: 'equipment/repair',
                name: 'equipmentRepair',
                component: () => import('@/views/equipment/repair/index.vue'),
                meta: { title: t.repair, icon: 'Tools', order: 4 }
              },
              {
                path: 'equipment/spare',
                name: 'equipmentSpare',
                component: () => import('@/views/equipment/spare/index.vue'),
                meta: { title: t.spare, icon: 'Box', order: 5 }
              },
              {
                path: 'equipment/oee',
                name: 'equipmentOEE',
                component: () => import('@/views/equipment/oee/index.vue'),
                meta: { title: t.oee, icon: 'TrendCharts', order: 6 }
              },
              {
                path: 'iot/monitor',
                name: 'iotMonitor',
                component: () => import('@/views/iot/monitor/index.vue'),
                meta: { title: t.monitor, icon: 'Monitor', order: 7 }
              },
              {
                path: 'iot/config',
                name: 'iotConfig',
                component: () => import('@/views/iot/config/index.vue'),
                meta: { title: t.collectConfig, icon: 'Setting', order: 8 }
              },
              {
                path: 'iot/history',
                name: 'iotHistory',
                component: () => import('@/views/iot/history/index.vue'),
                meta: { title: t.historyData, icon: 'Clock', order: 9 }
              },
              {
                path: 'iot/alert',
                name: 'iotAlert',
                component: () => import('@/views/iot/alert/index.vue'),
                meta: { title: t.alertRule, icon: 'Bell', order: 10 }
              },
              {
                path: 'iot/auto-report',
                name: 'iotAutoReport',
                component: () => import('@/views/iot/auto-report/index.vue'),
                meta: { title: t.autoReport, icon: 'Connection', order: 11 }
              }
            ]
          }
        ]
      },
      {
        path: 'customer-business',
        name: 'customerBusiness',
        meta: { title: t.customerBusiness, icon: 'ShoppingCart', order: 40 },
        children: [
          {
            path: 'crm',
            name: 'crmBusiness',
            meta: { title: t.crm, icon: 'User', order: 1 },
            children: [
              {
                path: 'customer',
                name: 'crmCustomer',
                component: () => import('@/views/crm/customer/index.vue'),
                meta: { title: t.customer, icon: 'User', order: 1 }
              },
              {
                path: 'order',
                name: 'crmOrder',
                component: () => import('@/views/crm/order/index.vue'),
                meta: { title: t.order, icon: 'Document', order: 2 }
              },
              {
                path: 'order-change',
                name: 'crmOrderChange',
                component: () => import('@/views/crm/order-change/index.vue'),
                meta: { title: t.orderChange, hidden: true, activeMenu: '/customer-business/crm/order' }
              },
              {
                path: 'contract',
                name: 'crmContract',
                component: () => import('@/views/crm/contract/index.vue'),
                meta: { title: t.contract, icon: 'Tickets', order: 3 }
              },
              {
                path: 'opportunity',
                name: 'crmOpportunity',
                component: () => import('@/views/crm/opportunity/index.vue'),
                meta: { title: t.opportunity, icon: 'Aim', order: 4 }
              },
              {
                path: 'quotation',
                name: 'crmQuotation',
                component: () => import('@/views/crm/quotation/index.vue'),
                meta: { title: t.quotation, icon: 'PriceTag', order: 5 }
              },
              {
                path: 'invoice',
                name: 'crmInvoice',
                component: () => import('@/views/crm/invoice/index.vue'),
                meta: { title: t.invoice, icon: 'Stamp', order: 6 }
              },
              {
                path: 'receivable',
                name: 'crmReceivable',
                component: () => import('@/views/crm/receivable/index.vue'),
                meta: { title: t.receivable, icon: 'Money', order: 7 }
              }
            ]
          }
        ]
      },
      {
        path: 'management-analysis',
        name: 'managementAnalysis',
        meta: { title: t.analysis, icon: 'DataLine', order: 50 },
        children: [
          {
            path: 'operations',
            name: 'operationsAnalysis',
            meta: { title: t.opsAnalysis, icon: 'Histogram', order: 1 },
            children: [
              {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/analysis/DashboardView.vue'),
                meta: { title: t.dashboard, icon: 'Histogram', order: 1 }
              },
              {
                path: 'report',
                name: 'report',
                component: () => import('@/views/analysis/ReportView.vue'),
                meta: { title: t.reportList, icon: 'Document', order: 2 }
              },
              {
                path: 'finance/index',
                name: 'financeIndex',
                component: () => import('@/views/finance/index/index.vue'),
                meta: { title: t.finance, icon: 'Money', order: 3 }
              },
              {
                path: 'finance/cost',
                name: 'financeCost',
                component: () => import('@/views/finance/cost/index.vue'),
                meta: { title: t.cost, icon: 'TrendCharts', order: 4 }
              },
              {
                path: 'finance/report',
                name: 'financeReport',
                component: () => import('@/views/finance/report/index.vue'),
                meta: { title: t.financeReport, icon: 'DataLine', order: 5 }
              },
              {
                path: 'finance/ledger',
                name: 'financeLedger',
                component: () => import('@/views/finance/ledger/index.vue'),
                meta: { title: t.ledger, icon: 'Notebook', order: 6 }
              }
            ]
          },
          {
            path: 'compliance',
            name: 'complianceAnalysis',
            meta: { title: t.compliance, icon: 'Warning', order: 2 },
            children: [
              {
                path: 'energy/overview',
                name: 'energyOverview',
                component: () => import('@/views/energy/overview/index.vue'),
                meta: { title: t.energyOverview, icon: 'DataLine', order: 1 }
              },
              {
                path: 'energy/detail',
                name: 'energyDetail',
                component: () => import('@/views/energy/detail/index.vue'),
                meta: { title: t.energyDetail, icon: 'List', order: 2 }
              },
              {
                path: 'energy/benchmark',
                name: 'energyBenchmark',
                component: () => import('@/views/energy/benchmark/index.vue'),
                meta: { title: t.energyBenchmark, icon: 'TrendCharts', order: 3 }
              },
              {
                path: 'ehs/index',
                name: 'ehsIndex',
                component: () => import('@/views/ehs/index/index.vue'),
                meta: { title: t.safety, icon: 'Warning', order: 4 }
              },
              {
                path: 'ehs/permit',
                name: 'ehsPermit',
                component: () => import('@/views/ehs/permit/index.vue'),
                meta: { title: t.permit, icon: 'Document', order: 5 }
              },
              {
                path: 'ehs/emergency',
                name: 'ehsEmergency',
                component: () => import('@/views/ehs/emergency/index.vue'),
                meta: { title: t.emergency, icon: 'WarningFilled', order: 6 }
              },
              {
                path: 'ehs/training',
                name: 'ehsTraining',
                component: () => import('@/views/ehs/training/index.vue'),
                meta: { title: t.training, icon: 'Reading', order: 7 }
              },
              {
                path: 'hr/index',
                name: 'hrIndex',
                component: () => import('@/views/hr/index/index.vue'),
                meta: { title: t.hr, icon: 'User', order: 8 }
              },
              {
                path: 'hr/attendance',
                name: 'hrAttendance',
                component: () => import('@/views/hr/attendance/index.vue'),
                meta: { title: t.attendance, icon: 'Clock', order: 9 }
              },
              {
                path: 'hr/schedule',
                name: 'hrSchedule',
                component: () => import('@/views/hr/schedule/index.vue'),
                meta: { title: t.schedule, icon: 'Calendar', order: 10 }
              },
              {
                path: 'hr/piecework',
                name: 'hrPiecework',
                component: () => import('@/views/hr/piecework/index.vue'),
                meta: { title: t.piecework, icon: 'Money', order: 11 }
              },
              {
                path: 'hr/skill-matrix',
                name: 'hrSkillMatrix',
                component: () => import('@/views/hr/skill-matrix/index.vue'),
                meta: { title: t.skillMatrix, icon: 'Grid', order: 12 }
              }
            ]
          }
        ]
      },
      {
        path: 'platform-foundation',
        name: 'platformFoundation',
        meta: { title: t.platform, icon: 'Setting', order: 60 },
        children: [
          {
            path: 'system',
            name: 'platformSystem',
            meta: { title: t.system, icon: 'Setting', order: 1 },
            children: [
              {
                path: 'user',
                name: 'user',
                component: () => import('@/views/system/user/index.vue'),
                meta: { title: t.user, icon: 'User', order: 1 }
              },
              {
                path: 'role',
                name: 'role',
                component: () => import('@/views/system/role/index.vue'),
                meta: { title: t.role, icon: 'UserFilled', order: 2 }
              },
              {
                path: 'menu',
                name: 'menu',
                component: () => import('@/views/system/menu/index.vue'),
                meta: { title: t.menu, icon: 'Menu', order: 3 }
              },
              {
                path: 'dict',
                name: 'dict',
                component: () => import('@/views/system/dict/index.vue'),
                meta: { title: t.dict, icon: 'Notebook', order: 4 }
              },
              {
                path: 'params',
                name: 'params',
                component: () => import('@/views/system/params/index.vue'),
                meta: { title: t.params, icon: 'Tools', order: 5 }
              },
              {
                path: 'audit',
                name: 'audit',
                component: () => import('@/views/system/audit/index.vue'),
                meta: { title: t.audit, icon: 'DocumentChecked', order: 6 }
              },
              {
                path: 'code-rule',
                name: 'codeRule',
                component: () => import('@/views/system/code-rule/index.vue'),
                meta: { title: t.codeRule, icon: 'Stamp', order: 7 }
              },
              {
                path: 'approval',
                name: 'approval',
                component: () => import('@/views/system/approval/index.vue'),
                meta: { title: t.approval, icon: 'Select', order: 8 }
              },
              {
                path: 'file',
                name: 'file',
                component: () => import('@/views/system/file/index.vue'),
                meta: { title: t.file, icon: 'FolderOpened', order: 9 }
              },
              {
                path: 'notification',
                name: 'systemNotification',
                component: () => import('@/views/system/notification/index.vue'),
                meta: { title: t.notification, icon: 'Bell', order: 10 }
              },
              {
                path: 'sso',
                name: 'systemSSO',
                component: () => import('@/views/system/sso/index.vue'),
                meta: { title: t.sso, icon: 'Key', order: 11 }
              },
              {
                path: 'print-template',
                redirect: { name: 'printTemplate' },
                meta: { title: t.printConfig, icon: 'Printer', order: 12 },
                children: [
                  {
                    path: 'list',
                    name: 'printTemplate',
                    component: () => import('@/views/system/print-template/index.vue'),
                    meta: { title: t.printTemplate, icon: 'Printer', order: 1 }
                  },
                  {
                    path: 'templates/:categoryId?',
                    name: 'printTemplateSettings',
                    component: () => import('@/views/system/print-template/template-list.vue'),
                    meta: { title: t.printTemplateSettings, icon: 'Setting', order: 2 }
                  },
                  {
                    path: 'designer/:id',
                    name: 'printTemplateDesigner',
                    component: () => import('@/views/system/print-template/designer.vue'),
                    meta: { title: t.printTemplateDesigner, hidden: true, activeMenu: '/platform-foundation/system/print-template/list' }
                  }
                ]
              }
            ]
          },
          {
            path: 'mdm',
            name: 'platformMdm',
            meta: { title: t.mdm, icon: 'DataAnalysis', order: 2 },
            children: [
              {
                path: 'organization',
                name: 'mdmOrg',
                component: () => import('@/views/mdm/organization/index.vue'),
                meta: { title: t.organization, icon: 'OfficeBuilding', order: 1 }
              },
              {
                path: 'material',
                name: 'mdmMaterial',
                component: () => import('@/views/mdm/material/index.vue'),
                meta: { title: t.material, icon: 'Goods', order: 2 }
              },
              {
                path: 'resource',
                name: 'mdmResource',
                component: () => import('@/views/mdm/resource/index.vue'),
                meta: { title: t.resource, icon: 'Cpu', order: 3 }
              },
              {
                path: 'work-center',
                name: 'mdmWorkCenter',
                component: () => import('@/views/mdm/work-center/index.vue'),
                meta: { title: t.workCenter, icon: 'Grid', order: 4 }
              },
              { path: 'mold', name: 'mdmMold', component: () => import('@/views/mdm/mold/index.vue'), meta: { title: t.mold, icon: 'Box', order: 5 } }
            ]
          },
          {
            path: 'settings',
            name: 'platformSettings',
            meta: { title: t.platformSettings, icon: 'Tools', order: 3 },
            children: [
              {
                path: 'config',
                name: 'config',
                component: () => import('@/views/settings/ConfigView.vue'),
                meta: { title: t.systemConfig, icon: 'Tools', order: 1 }
              },
              {
                path: 'log',
                name: 'log',
                component: () => import('@/views/settings/LogView.vue'),
                meta: { title: t.settingLog, icon: 'DocumentChecked', order: 2 }
              }
            ]
          }
        ]
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: { title: t.about, hidden: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

import { useLockStore } from '@/stores/lock'
import { useUserStore } from '@/stores/user'

router.beforeEach((to, _from, next) => {
  const lockStore = useLockStore()
  if (lockStore.isLocked && to.path !== '/lock') return next('/lock')

  const whiteList = ['/login', '/lock']
  const userStore = useUserStore()
  const mockLogin = localStorage.getItem('mock_login')
  if (!mockLogin && !userStore.isLoggedIn && !whiteList.includes(to.path)) {
    return next('/login')
  }

  if (userStore.isLoggedIn && to.path === '/login') {
    return next('/')
  }

  next()
})

export default router

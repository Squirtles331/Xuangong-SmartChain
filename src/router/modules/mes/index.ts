import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const mesRoute: RouteRecordRaw = {
  path: 'mes',
  name: 'mesCenter',
  meta: {
    title: '生产执行',
    icon: 'Monitor',
    order: 10,
    ownerSystem: 'MES',
    coreObject: '生产执行主链'
  },
  children: [
    {
      path: 'work-order',
      name: 'mesWorkOrderCenter',
      meta: {
        title: '工单',
        icon: 'Tickets',
        order: 1,
        ownerSystem: 'MES',
        coreObject: '生产工单'
      },
      children: [
        {
          path: 'list',
          name: 'workOrderList',
          component: () => import('@/views/mes/work-order/list/index.vue'),
          meta: {
            title: '工单列表',
            icon: 'Tickets',
            order: 1,
            ownerSystem: 'MES',
            collaboratorSystems: ['PLM'],
            coreObject: '生产工单',
            boundaryNote: 'MES 维护生产工单真相，BOM 与工艺版本只引用 PLM 已发布结构。'
          }
        },
        {
          path: 'create',
          name: 'workOrderCreate',
          component: () => import('@/views/mes/work-order/create/index.vue'),
          meta: {
            title: '新建工单',
            icon: 'Plus',
            order: 2,
            hidden: true,
            activeMenu: '/mes/work-order/list',
            ownerSystem: 'MES',
            collaboratorSystems: ['PLM'],
            coreObject: '生产工单',
            boundaryNote: '新建工单只引用 PLM 已发布的 BOM / 工艺版本，不在本页维护上游工程对象。'
          }
        },
        {
          path: ':id',
          name: 'workOrderDetail',
          component: () => import('@/views/mes/work-order/detail/index.vue'),
          meta: {
            title: '工单详情',
            hidden: true,
            activeMenu: '/mes/work-order/list',
            ownerSystem: 'MES',
            collaboratorSystems: ['PLM', 'WMS', 'QMS'],
            coreObject: '生产工单',
            boundaryNote: '详情页展示领料、质检等关联上下文，但不成为 WMS 或 QMS 的事务维护入口。'
          }
        },
        {
          path: 'split',
          name: 'workOrderSplit',
          component: () => import('@/views/mes/work-order/split/index.vue'),
          meta: { title: '工单拆分', hidden: true, activeMenu: '/mes/work-order/list' }
        },
        {
          path: 'outsource',
          name: 'workOrderOutsource',
          component: () => import('@/views/mes/work-order/outsource/index.vue'),
          meta: { title: '委外工单', icon: 'Connection', order: 3, hidden: true, activeMenu: '/mes/work-order/list' }
        }
      ]
    },
    {
      path: 'execution',
      name: 'mesExecutionCenter',
      meta: {
        title: '工序执行',
        icon: 'SetUp',
        order: 2,
        ownerSystem: 'MES',
        coreObject: '工序任务 / 报工记录'
      },
      children: [
        {
          path: 'my-tasks',
          name: 'workOrderMyTasks',
          component: () => import('@/views/mes/work-order/my-tasks/index.vue'),
          meta: {
            title: '我的任务',
            icon: 'User',
            order: 1,
            ownerSystem: 'MES',
            collaboratorSystems: ['PLM'],
            coreObject: '工序任务',
            boundaryNote: '本页是现场执行入口，主对象是工序任务，不等同于生产工单主维护页。'
          }
        },
        {
          path: 'operation-task',
          name: 'mesOperationTask',
          component: () => import('@/views/mes/work-order/operation-task/index.vue'),
          meta: {
            title: '工序任务',
            icon: 'List',
            order: 2,
            ownerSystem: 'MES',
            collaboratorSystems: ['PLM', 'QMS'],
            coreObject: '工序任务池',
            boundaryNote: '本页从协调视角统一查看任务池与阻塞信号，任务真相仍与“我的任务”保持一致，不单独创造新的执行对象。'
          }
        },
        {
          path: 'report/:id',
          name: 'workOrderReport',
          component: () => import('@/views/mes/work-order/report/index.vue'),
          meta: {
            title: '工序报工',
            hidden: true,
            activeMenu: '/mes/execution/my-tasks',
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS'],
            coreObject: '报工记录',
            boundaryNote: '报工事实由 MES 主责，后续检验与质量裁决不得在报工页直接替代。'
          }
        },
        {
          path: 'wip',
          name: 'mesWip',
          component: () => import('@/views/mes/work-order/wip/index.vue'),
          meta: {
            title: 'WIP',
            icon: 'Grid',
            order: 3,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS', 'WMS'],
            coreObject: 'WIP批次',
            boundaryNote: 'WIP 批次反映生产执行态缓存与冻结/返工信号，不等于 WMS 库存批次或入库事务真相。'
          }
        },
        {
          path: 'kitting',
          name: 'mesKitting',
          component: () => import('@/views/mes/work-order/kitting/index.vue'),
          meta: {
            title: '开工齐套检查',
            icon: 'Select',
            order: 4,
            ownerSystem: 'MES',
            collaboratorSystems: ['WMS', 'PLM', 'QMS'],
            coreObject: '开工放行条件',
            boundaryNote: '本页聚合开工放行条件，只消费 WMS 备料、PLM 版本和 QMS 放行信号，不接管它们的事务真相。'
          }
        },
        {
          path: 'consumption',
          name: 'mesConsumption',
          component: () => import('@/views/mes/work-order/consumption/index.vue'),
          meta: {
            title: '投料与消耗',
            icon: 'TakeawayBox',
            order: 5,
            ownerSystem: 'MES',
            collaboratorSystems: ['WMS'],
            coreObject: '投料消耗记录',
            boundaryNote: '本页记录 MES 的实际投料与消耗事实；领料、退料、补料等库存动作仍以 WMS 为准。'
          }
        }
      ]
    },
    {
      path: 'traceability',
      name: 'mesTraceabilityCenter',
      meta: {
        title: '追溯与异常',
        icon: 'DataBoard',
        order: 3,
        ownerSystem: 'MES',
        coreObject: '报工记录 / 追溯 / 异常'
      },
      children: [
        {
          path: 'trace-report',
          name: 'workOrderTrace',
          component: () => import('@/views/mes/work-order/trace/index.vue'),
          meta: {
            title: '报工记录',
            icon: 'Clock',
            order: 1,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS'],
            coreObject: '报工记录',
            boundaryNote: '本页查询报工事实历史，不替代产品全链路追溯或最终质量裁决。'
          }
        },
        {
          path: 'kanban',
          name: 'workOrderKanban',
          component: () => import('@/views/mes/work-order/kanban/index.vue'),
          meta: {
            title: '生产看板',
            icon: 'DataBoard',
            order: 2,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS', 'WMS'],
            coreObject: '生产监控快照',
            boundaryNote: '生产看板只消费任务、WIP 与异常事实形成快照，不在本页维护派工、报工、冻结或放行源头。'
          }
        },
        {
          path: 'product-trace',
          name: 'mesProductTrace',
          component: () => import('@/views/mes/work-order/product-trace/index.vue'),
          meta: {
            title: '产品追溯',
            icon: 'Connection',
            order: 3,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS', 'WMS', 'IoT'],
            coreObject: '产品追溯链',
            boundaryNote: '本页组织生产侧追溯链，只消费 QMS、WMS 和 IoT 事实，不接管它们的源头真相。'
          }
        },
        {
          path: 'production-log',
          name: 'mesProductionLog',
          component: () => import('@/views/mes/work-order/production-log/index.vue'),
          meta: {
            title: '执行日志',
            icon: 'Notebook',
            order: 4,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS', 'WMS', 'IoT'],
            coreObject: '执行审计记录',
            boundaryNote: '执行日志面向用户展示对象、动作与状态变化，不承接后台调试日志或技术监控输出。'
          }
        },
        {
          path: 'exception-center',
          name: 'mesExceptionCenter',
          component: () => import('@/views/mes/work-order/exception-center/index.vue'),
          meta: {
            title: '异常中心',
            icon: 'Warning',
            order: 5,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS', 'WMS', 'IoT', 'PLM'],
            coreObject: '执行异常',
            boundaryNote: '异常中心负责执行锁定、处理与放行协调；质量判定回 QMS，库存动作回 WMS，工程版本真相回 PLM。'
          }
        },
        {
          path: 'rework-order',
          name: 'mesReworkOrder',
          component: () => import('@/views/mes/work-order/rework-order/index.vue'),
          meta: {
            title: '返工执行',
            icon: 'RefreshLeft',
            order: 6,
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS'],
            coreObject: '返工单',
            boundaryNote: 'QMS 负责是否允许返工的裁决，MES 负责返工执行链、复检衔接与关闭，不接管质量判定真相。'
          }
        }
      ]
    }
  ]
}

import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const mesRoute: RouteRecordRaw = {
  path: 'mes',
  name: 'mesCenter',
  meta: { title: '生产执行', icon: 'Monitor', order: 10, ownerSystem: 'MES', coreObject: '生产执行' },
  children: [
    {
      path: 'work-order',
      name: 'mesWorkOrderCenter',
      meta: { title: '工单', icon: 'Tickets', order: 1, ownerSystem: 'MES', coreObject: '生产工单' },
      children: [
        {
          path: 'list',
          name: 'workOrderList',
          component: () => import('@/views/work-order/list/index.vue'),
          meta: { title: '工单列表', icon: 'Tickets', order: 1, ownerSystem: 'MES', coreObject: '生产工单' }
        },
        {
          path: 'create',
          name: 'workOrderCreate',
          component: () => import('@/views/work-order/create/index.vue'),
          meta: { title: '新建工单', icon: 'Plus', order: 2, hidden: true, activeMenu: '/mes/work-order/list' }
        },
        {
          path: ':id',
          name: 'workOrderDetail',
          component: () => import('@/views/work-order/detail/index.vue'),
          meta: { title: '工单详情', hidden: true, activeMenu: '/mes/work-order/list', ownerSystem: 'MES', coreObject: '生产工单' }
        },
        {
          path: 'split',
          name: 'workOrderSplit',
          component: () => import('@/views/work-order/split/index.vue'),
          meta: { title: '工单拆分', hidden: true, activeMenu: '/mes/work-order/list' }
        },
        {
          path: 'outsource',
          name: 'workOrderOutsource',
          component: () => import('@/views/work-order/outsource/index.vue'),
          meta: { title: '委外工单', icon: 'Connection', order: 3 }
        }
      ]
    },
    {
      path: 'execution',
      name: 'mesExecutionCenter',
      meta: { title: '工序执行', icon: 'SetUp', order: 2, ownerSystem: 'MES', coreObject: '工序任务 / WIP / 报工 / 消耗' },
      children: [
        {
          path: 'my-tasks',
          name: 'workOrderMyTasks',
          component: () => import('@/views/work-order/my-tasks/index.vue'),
          meta: { title: '我的任务', icon: 'User', order: 1, ownerSystem: 'MES', coreObject: '工序任务' }
        },
        {
          path: 'operation-task',
          name: 'mesOperationTask',
          component: plannedPage,
          meta: planned(
            '工序任务',
            'List',
            2,
            '围绕工序任务建立统一的执行调度、依赖跟踪和状态控制入口。',
            ['任务池', '依赖关系', '状态流转', '异常恢复'],
            {
              ownerSystem: 'MES',
              coreObject: '工序任务'
            }
          )
        },
        {
          path: 'report/:id',
          name: 'workOrderReport',
          component: () => import('@/views/work-order/report/index.vue'),
          meta: {
            title: '工序报工',
            hidden: true,
            activeMenu: '/mes/execution/my-tasks',
            ownerSystem: 'MES',
            collaboratorSystems: ['QMS'],
            coreObject: '报工记录',
            boundaryNote: '报工事实由 MES 主责，后续检验与质量裁决不得在报工页面直接替代。'
          }
        },
        {
          path: 'wip',
          name: 'mesWip',
          component: plannedPage,
          meta: planned(
            '在制品',
            'Grid',
            3,
            '统一查看在制品所处工序、批次状态、冻结情况和返工回流。',
            ['批次台账', '冻结 / 解冻', '流转跟踪', '返工回流'],
            {
              ownerSystem: 'MES',
              coreObject: 'WIP 批次',
              collaboratorSystems: ['QMS'],
              boundaryNote: '在制品状态由 MES 主控，不等于 WMS 库存批次。'
            }
          )
        },
        {
          path: 'kitting',
          name: 'mesKitting',
          component: plannedPage,
          meta: planned(
            '开工齐套检查',
            'Select',
            4,
            '在开工前统一核对物料、版本、资质和放行条件。',
            ['物料校验', '版本校验', '资质校验', '放行关口'],
            {
              ownerSystem: 'MES',
              coreObject: '开工放行条件',
              collaboratorSystems: ['WMS', 'PLM', 'QMS'],
              boundaryNote: '齐套检查是 MES 的放行关口，不等于仓库备料完成。'
            }
          )
        },
        {
          path: 'consumption',
          name: 'mesConsumption',
          component: plannedPage,
          meta: planned(
            '投料与消耗',
            'TakeawayBox',
            5,
            '记录现场实际投料与消耗事实，并承接补料、退料和替代料审批结果。',
            ['批次绑定', '实际消耗', '补料 / 退料', '替代料审批'],
            {
              ownerSystem: 'MES',
              coreObject: '投料 / 消耗记录',
              collaboratorSystems: ['WMS'],
              boundaryNote: '领料和倒冲属于 WMS 库存移动，实际投料与消耗事实仍以 MES 为准。'
            }
          )
        }
      ]
    },
    {
      path: 'traceability',
      name: 'mesTraceabilityCenter',
      meta: { title: '追溯与异常', icon: 'DataBoard', order: 3, ownerSystem: 'MES', coreObject: '追溯 / 异常 / 返工' },
      children: [
        {
          path: 'kanban',
          name: 'workOrderKanban',
          component: () => import('@/views/work-order/kanban/index.vue'),
          meta: { title: '生产看板', icon: 'DataBoard', order: 1 }
        },
        {
          path: 'trace-report',
          name: 'workOrderTrace',
          component: () => import('@/views/work-order/trace/index.vue'),
          meta: { title: '报工记录', icon: 'Clock', order: 2 }
        },
        {
          path: 'product-trace',
          name: 'mesProductTrace',
          component: plannedPage,
          meta: planned(
            '产品追溯',
            'Connection',
            3,
            '建立产品、工单、物料、检验和设备之间的追溯关系链。',
            ['正向追溯', '反向追溯', '实体关联', '影响范围'],
            {
              ownerSystem: 'MES',
              coreObject: '产品追溯链',
              collaboratorSystems: ['QMS', 'WMS', 'IoT'],
              boundaryNote: '追溯主链由 MES 组织，但需要关联质量、库存和设备事实。'
            }
          )
        },
        {
          path: 'production-log',
          name: 'mesProductionLog',
          component: plannedPage,
          meta: planned('执行日志', 'Notebook', 4, '按对象和时间轴记录关键执行活动、状态变化和审计痕迹。', [
            '时间轴',
            '对象筛选',
            '状态历史',
            '审计轨迹'
          ])
        },
        {
          path: 'exception-center',
          name: 'mesExceptionCenter',
          component: plannedPage,
          meta: planned(
            '异常处置',
            'Warning',
            5,
            '集中承接执行异常的锁定、处置、审批放行和恢复过程。',
            ['异常分级', '锁定范围', '恢复规则', '审批放行'],
            {
              ownerSystem: 'MES',
              coreObject: '执行异常',
              collaboratorSystems: ['QMS', 'WMS', 'IoT', 'PLM'],
              boundaryNote: '异常必须先锁定、再处置、再放行，质量结论不得绕过 QMS。'
            }
          )
        },
        {
          path: 'rework-order',
          name: 'mesReworkOrder',
          component: plannedPage,
          meta: planned(
            '返工执行',
            'RefreshLeft',
            6,
            '承接返工执行链，覆盖来源关联、返工路径和复检衔接。',
            ['来源关联', '返工路径', '复检衔接', '成本归集'],
            {
              ownerSystem: 'MES',
              coreObject: '返工单',
              collaboratorSystems: ['QMS'],
              boundaryNote: 'QMS 负责是否返工的裁决，MES 负责返工执行链和回流。'
            }
          )
        }
      ]
    }
  ]
}

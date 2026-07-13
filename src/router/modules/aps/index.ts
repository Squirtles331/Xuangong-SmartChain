import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const apsRoute: RouteRecordRaw = {
  path: 'aps',
  name: 'planningCollaboration',
  meta: {
    title: '计划排程',
    icon: 'Timer',
    order: 30,
    ownerSystem: 'APS',
    collaboratorSystems: ['ERP', 'MES'],
    coreObject: '计划排程'
  },
  children: [
    {
      path: 'schedule',
      name: 'apsSchedule',
      component: () => import('@/views/aps/schedule/index.vue'),
      meta: { title: '排程结果', icon: 'Timer', order: 1, ownerSystem: 'APS', coreObject: 'APS 排程结果' }
    },
    {
      path: 'constraint',
      name: 'apsConstraint',
      component: () => import('@/views/aps/constraint/index.vue'),
      meta: { title: '排程约束', icon: 'Setting', order: 2, ownerSystem: 'APS', coreObject: '排程约束' }
    },
    {
      path: 'history',
      name: 'apsHistory',
      component: plannedPage,
      meta: planned('排程历史', 'Clock', 3, '回看排程版本、参数快照和冲突差异，用于排程复盘。', ['版本列表', '参数快照', '冲突对比', '过程回放'], {
        ownerSystem: 'APS',
        coreObject: '排程历史'
      })
    },
    {
      path: 'disturbance-reschedule',
      name: 'planningDisturbanceReschedule',
      component: plannedPage,
      meta: planned(
        '扰动重排',
        'RefreshRight',
        4,
        '按扰动等级组织现场微调、局部重排和全局重排。',
        ['L1 微调', 'L2 局部重排', 'L3 全局重排', '约束协同'],
        {
          ownerSystem: 'APS',
          collaboratorSystems: ['MES'],
          coreObject: '扰动重排建议',
          boundaryNote: 'APS 给出重排建议，MES 承接执行调整，不应反向改写执行真相。'
        }
      )
    }
  ]
}

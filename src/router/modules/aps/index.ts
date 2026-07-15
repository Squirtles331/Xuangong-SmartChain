import type { RouteRecordRaw } from 'vue-router'

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
      meta: { title: '排程约束', icon: 'Setting', order: 2, ownerSystem: 'APS', coreObject: 'APS 排程约束' }
    },
    {
      path: 'history',
      name: 'apsHistory',
      component: () => import('@/views/aps/history/index.vue'),
      meta: { title: '排程历史', icon: 'Clock', order: 3, ownerSystem: 'APS', coreObject: 'APS 排程历史' }
    },
    {
      path: 'disturbance-reschedule',
      name: 'planningDisturbanceReschedule',
      component: () => import('@/views/aps/disturbance-reschedule/index.vue'),
      meta: {
        title: '扰动重排',
        icon: 'RefreshRight',
        order: 4,
        ownerSystem: 'APS',
        collaboratorSystems: ['MES'],
        coreObject: 'APS 扰动重排建议'
      }
    }
  ]
}

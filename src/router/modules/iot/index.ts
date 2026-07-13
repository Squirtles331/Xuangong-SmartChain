import type { RouteRecordRaw } from 'vue-router'

export const iotRoute: RouteRecordRaw = {
  path: 'iot',
  name: 'iotCenter',
  meta: {
    title: '设备物联',
    icon: 'Connection',
    order: 80,
    ownerSystem: 'IoT',
    collaboratorSystems: ['MES', 'EAM'],
    coreObject: '设备采集与实时监控'
  },
  children: [
    {
      path: 'monitor',
      name: 'iotMonitor',
      component: () => import('@/views/iot/monitor/index.vue'),
      meta: { title: '实时监控', icon: 'Monitor', order: 1 }
    },
    {
      path: 'config',
      name: 'iotConfig',
      component: () => import('@/views/iot/config/index.vue'),
      meta: { title: '采集配置', icon: 'Setting', order: 2 }
    },
    {
      path: 'history',
      name: 'iotHistory',
      component: () => import('@/views/iot/history/index.vue'),
      meta: { title: '采集历史', icon: 'Clock', order: 3 }
    },
    {
      path: 'alert',
      name: 'iotAlert',
      component: () => import('@/views/iot/alert/index.vue'),
      meta: { title: '告警规则', icon: 'Bell', order: 4 }
    },
    {
      path: 'auto-report',
      name: 'iotAutoReport',
      component: () => import('@/views/iot/auto-report/index.vue'),
      meta: { title: '自动报工', icon: 'Connection', order: 5 }
    }
  ]
}

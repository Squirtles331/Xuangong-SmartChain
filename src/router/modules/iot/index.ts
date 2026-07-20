import type { RouteRecordRaw } from 'vue-router'

export const iotRoute: RouteRecordRaw = {
  path: 'iot',
  name: 'iotCenter',
  meta: {
    title: '设备物联',
    icon: 'Connection',
    order: 80,
    ownerSystem: 'IOT',
    collaboratorSystems: ['EAM', 'MES', 'MDM'],
    coreObject: '设备连接 / 采集点位 / 运行采样 / 告警事件'
  },
  children: [
    {
      path: 'connection',
      name: 'iotConnection',
      component: () => import('@/views/iot/config/index.vue'),
      meta: {
        title: '设备连接管理',
        icon: 'Connection',
        order: 1,
        ownerSystem: 'IOT',
        collaboratorSystems: ['EAM', 'MDM'],
        coreObject: '设备连接'
      }
    },
    {
      path: 'point',
      name: 'iotPoint',
      component: () => import('@/views/iot/point/index.vue'),
      meta: {
        title: '点位配置',
        icon: 'SetUp',
        order: 2,
        ownerSystem: 'IOT',
        collaboratorSystems: ['EAM', 'MDM'],
        coreObject: '采集点位'
      }
    },
    {
      path: 'monitor',
      name: 'iotMonitor',
      component: () => import('@/views/iot/monitor/index.vue'),
      meta: {
        title: '实时监控',
        icon: 'Monitor',
        order: 3,
        ownerSystem: 'IOT',
        collaboratorSystems: ['EAM', 'MES'],
        coreObject: '运行采样快照'
      }
    },
    {
      path: 'alert',
      name: 'iotAlert',
      component: () => import('@/views/iot/alert/index.vue'),
      meta: {
        title: '报警记录',
        icon: 'Bell',
        order: 4,
        ownerSystem: 'IOT',
        collaboratorSystems: ['EAM', 'MES', 'WMS'],
        coreObject: '告警事件'
      }
    },
    {
      path: 'history',
      name: 'iotHistory',
      component: () => import('@/views/iot/history/index.vue'),
      meta: { title: '采集历史', icon: 'Clock', order: 90, hidden: true }
    },
    {
      path: 'auto-report',
      name: 'iotAutoReport',
      component: () => import('@/views/iot/auto-report/index.vue'),
      meta: { title: '自动报工', icon: 'Connection', order: 91, hidden: true }
    }
  ]
}

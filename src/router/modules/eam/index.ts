import type { RouteRecordRaw } from 'vue-router'

export const eamRoute: RouteRecordRaw = {
  path: 'eam',
  name: 'equipmentAssetManagement',
  meta: {
    title: '设备管理',
    icon: 'Cpu',
    order: 70,
    ownerSystem: 'EAM',
    collaboratorSystems: ['MDM', 'MES', 'IoT', 'WMS'],
    coreObject: '设备资产 / 点检计划 / 保养计划 / 维修工单'
  },
  children: [
    {
      path: 'equipment/list',
      name: 'equipmentList',
      component: () => import('@/views/eam/list/index.vue'),
      meta: {
        title: '设备台账',
        icon: 'Monitor',
        order: 1,
        ownerSystem: 'EAM',
        collaboratorSystems: ['MDM', 'MES'],
        coreObject: '设备资产'
      }
    },
    {
      path: 'equipment/check',
      name: 'equipmentCheck',
      component: () => import('@/views/eam/check/index.vue'),
      meta: {
        title: '点检',
        icon: 'Checked',
        order: 2,
        ownerSystem: 'EAM',
        collaboratorSystems: ['MES', 'IoT'],
        coreObject: '点检计划 / 点检执行'
      }
    },
    {
      path: 'equipment/maintain',
      name: 'equipmentMaintain',
      component: () => import('@/views/eam/maintain/index.vue'),
      meta: {
        title: '保养',
        icon: 'SetUp',
        order: 3,
        ownerSystem: 'EAM',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '保养计划 / 保养执行'
      }
    },
    {
      path: 'equipment/repair',
      name: 'equipmentRepair',
      component: () => import('@/views/eam/repair/index.vue'),
      meta: {
        title: '维修',
        icon: 'Tools',
        order: 4,
        ownerSystem: 'EAM',
        collaboratorSystems: ['MES', 'IoT', 'WMS'],
        coreObject: '维修工单'
      }
    },
    {
      path: 'equipment/spare',
      name: 'equipmentSpare',
      component: () => import('@/views/eam/spare/index.vue'),
      meta: { title: '备件', icon: 'Box', order: 5 }
    },
    {
      path: 'equipment/oee',
      name: 'equipmentOEE',
      component: () => import('@/views/eam/oee/index.vue'),
      meta: { title: '设备综合效率', icon: 'TrendCharts', order: 6 }
    }
  ]
}

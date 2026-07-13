import type { RouteRecordRaw } from 'vue-router'

export const eamRoute: RouteRecordRaw = {
  path: 'eam',
  name: 'equipmentAssetManagement',
  meta: { title: '设备管理', icon: 'Cpu', order: 70, ownerSystem: 'EAM', collaboratorSystems: ['MES', 'IoT'], coreObject: '设备资产与维护' },
  children: [
    {
      path: 'equipment/list',
      name: 'equipmentList',
      component: () => import('@/views/equipment/list/index.vue'),
      meta: { title: '设备台账', icon: 'Monitor', order: 1 }
    },
    {
      path: 'equipment/check',
      name: 'equipmentCheck',
      component: () => import('@/views/equipment/check/index.vue'),
      meta: { title: '点检', icon: 'Checked', order: 2 }
    },
    {
      path: 'equipment/maintain',
      name: 'equipmentMaintain',
      component: () => import('@/views/equipment/maintain/index.vue'),
      meta: { title: '保养', icon: 'SetUp', order: 3 }
    },
    {
      path: 'equipment/repair',
      name: 'equipmentRepair',
      component: () => import('@/views/equipment/repair/index.vue'),
      meta: { title: '维修', icon: 'Tools', order: 4 }
    },
    {
      path: 'equipment/spare',
      name: 'equipmentSpare',
      component: () => import('@/views/equipment/spare/index.vue'),
      meta: { title: '备件', icon: 'Box', order: 5 }
    },
    {
      path: 'equipment/oee',
      name: 'equipmentOEE',
      component: () => import('@/views/equipment/oee/index.vue'),
      meta: { title: '设备综合效率', icon: 'TrendCharts', order: 6 }
    }
  ]
}

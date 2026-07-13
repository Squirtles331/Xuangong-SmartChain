import type { RouteRecordRaw } from 'vue-router'

export const mdmRoute: RouteRecordRaw = {
  path: 'mdm',
  name: 'platformMdm',
  meta: {
    title: '主数据',
    icon: 'DataAnalysis',
    order: 130,
    ownerSystem: 'MDM',
    coreObject: '主数据标准',
    boundaryNote: 'MDM 属于跨域治理能力，不是普通平台设置页。'
  },
  children: [
    {
      path: 'organization',
      name: 'mdmOrg',
      component: () => import('@/views/mdm/organization/index.vue'),
      meta: { title: '组织', icon: 'OfficeBuilding', order: 1 }
    },
    {
      path: 'material',
      name: 'mdmMaterial',
      component: () => import('@/views/mdm/material/index.vue'),
      meta: { title: '物料', icon: 'Goods', order: 2 }
    },
    {
      path: 'resource',
      name: 'mdmResource',
      component: () => import('@/views/mdm/resource/index.vue'),
      meta: { title: '制造资源', icon: 'Cpu', order: 3 }
    },
    {
      path: 'work-center',
      name: 'mdmWorkCenter',
      component: () => import('@/views/mdm/work-center/index.vue'),
      meta: { title: '工作中心', icon: 'Grid', order: 4 }
    },
    {
      path: 'mold',
      name: 'mdmMold',
      component: () => import('@/views/mdm/mold/index.vue'),
      meta: { title: '模具', icon: 'Box', order: 5 }
    }
  ]
}

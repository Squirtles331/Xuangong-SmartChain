import type { RouteRecordRaw } from 'vue-router'

export const srmRoute: RouteRecordRaw = {
  path: 'srm',
  name: 'srmCollaboration',
  redirect: { name: 'scmPR' },
  meta: {
    title: '采购供应',
    icon: 'ShoppingBag',
    order: 60,
    ownerSystem: 'SRM',
    collaboratorSystems: ['MDM', 'ERP', 'WMS', 'QMS'],
    coreObject: '采购协同 / 价格协议 / 供应商门户'
  },
  children: [
    {
      path: 'purchase-request',
      name: 'scmPR',
      component: () => import('@/views/srm/purchase-request/index.vue'),
      meta: {
        title: '采购申请',
        icon: 'Edit',
        order: 1,
        ownerSystem: 'SRM',
        collaboratorSystems: ['ERP', 'MDM'],
        coreObject: '采购申请单'
      }
    },
    {
      path: 'purchase',
      name: 'scmPurchase',
      component: () => import('@/views/srm/purchase/index.vue'),
      meta: {
        title: '采购订单',
        icon: 'ShoppingCart',
        order: 2,
        ownerSystem: 'SRM',
        collaboratorSystems: ['ERP', 'MDM', 'WMS'],
        coreObject: '采购协同订单'
      }
    },
    {
      path: 'return',
      name: 'scmReturn',
      component: () => import('@/views/srm/return/index.vue'),
      meta: {
        title: '采购退货',
        icon: 'Sell',
        order: 3,
        ownerSystem: 'SRM',
        collaboratorSystems: ['QMS', 'WMS'],
        coreObject: '供应商退货协同单'
      }
    },
    {
      path: 'price',
      name: 'scmPrice',
      component: () => import('@/views/srm/price/index.vue'),
      meta: { title: '价格协议', icon: 'Money', order: 4 }
    },
    {
      path: 'portal',
      name: 'scmPortal',
      component: () => import('@/views/srm/portal/index.vue'),
      meta: { title: '供应商协同', icon: 'Connection', order: 5 }
    }
  ]
}

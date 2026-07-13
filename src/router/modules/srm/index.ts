import type { RouteRecordRaw } from 'vue-router'

export const srmRoute: RouteRecordRaw = {
  path: 'srm',
  name: 'srmCollaboration',
  meta: { title: '采购供应', icon: 'ShoppingBag', order: 60, ownerSystem: 'SRM', coreObject: '采购与供应商' },
  children: [
    {
      path: 'supplier',
      name: 'scmSupplier',
      component: () => import('@/views/scm/supplier/index.vue'),
      meta: { title: '供应商', icon: 'Avatar', order: 1 }
    },
    {
      path: 'purchase-request',
      name: 'scmPR',
      component: () => import('@/views/scm/purchase-request/index.vue'),
      meta: { title: '采购申请', icon: 'Edit', order: 2 }
    },
    {
      path: 'purchase',
      name: 'scmPurchase',
      component: () => import('@/views/scm/purchase/index.vue'),
      meta: { title: '采购订单', icon: 'ShoppingCart', order: 3 }
    },
    {
      path: 'return',
      name: 'scmReturn',
      component: () => import('@/views/scm/return/index.vue'),
      meta: { title: '采购退货', icon: 'Sell', order: 4 }
    },
    {
      path: 'price',
      name: 'scmPrice',
      component: () => import('@/views/scm/price/index.vue'),
      meta: { title: '价格协议', icon: 'Money', order: 5 }
    },
    {
      path: 'portal',
      name: 'scmPortal',
      component: () => import('@/views/scm/portal/index.vue'),
      meta: { title: '供应商协同', icon: 'Connection', order: 6 }
    }
  ]
}

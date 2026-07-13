import type { RouteRecordRaw } from 'vue-router'

export const crmRoute: RouteRecordRaw = {
  path: 'crm',
  name: 'crmBusiness',
  meta: { title: '客户经营', icon: 'User', order: 90, ownerSystem: 'CRM', coreObject: '商机 / 订单 / 合同' },
  children: [
    {
      path: 'order',
      name: 'crmOrder',
      component: () => import('@/views/crm/order/index.vue'),
      meta: { title: '销售订单', icon: 'Document', order: 1 }
    },
    {
      path: 'order-change',
      name: 'crmOrderChange',
      component: () => import('@/views/crm/order-change/index.vue'),
      meta: { title: '订单变更', hidden: true, activeMenu: '/crm/order' }
    },
    {
      path: 'contract',
      name: 'crmContract',
      component: () => import('@/views/crm/contract/index.vue'),
      meta: { title: '合同', icon: 'Tickets', order: 2 }
    },
    {
      path: 'opportunity',
      name: 'crmOpportunity',
      component: () => import('@/views/crm/opportunity/index.vue'),
      meta: { title: '商机', icon: 'Aim', order: 3 }
    },
    {
      path: 'quotation',
      name: 'crmQuotation',
      component: () => import('@/views/crm/quotation/index.vue'),
      meta: { title: '报价', icon: 'PriceTag', order: 4 }
    },
    {
      path: 'invoice',
      name: 'crmInvoice',
      component: () => import('@/views/crm/invoice/index.vue'),
      meta: { title: '发票', icon: 'Stamp', order: 5 }
    },
    {
      path: 'receivable',
      name: 'crmReceivable',
      component: () => import('@/views/crm/receivable/index.vue'),
      meta: { title: '应收', icon: 'Money', order: 6 }
    }
  ]
}

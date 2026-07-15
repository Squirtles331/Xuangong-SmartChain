import type { RouteRecordRaw } from 'vue-router'

export const crmRoute: RouteRecordRaw = {
  path: 'crm',
  name: 'crmBusiness',
  meta: {
    title: '客户经营',
    icon: 'User',
    order: 90,
    ownerSystem: 'CRM',
    collaboratorSystems: ['MDM', 'ERP', 'SRM'],
    coreObject: '客户商机 / 客户报价 / 客户协同订单 / 客户合同 / 客户应收 / 客户开票协同'
  },
  children: [
    {
      path: 'opportunity',
      name: 'crmOpportunity',
      component: () => import('@/views/crm/opportunity/index.vue'),
      meta: {
        title: '商机',
        icon: 'Aim',
        order: 1,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM'],
        coreObject: '客户商机'
      }
    },
    {
      path: 'quotation',
      name: 'crmQuotation',
      component: () => import('@/views/crm/quotation/index.vue'),
      meta: {
        title: '报价',
        icon: 'PriceTag',
        order: 2,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP'],
        coreObject: '客户报价单'
      }
    },
    {
      path: 'order',
      name: 'crmOrder',
      component: () => import('@/views/crm/order/index.vue'),
      meta: {
        title: '销售订单',
        icon: 'Document',
        order: 3,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP', 'SRM'],
        coreObject: '客户协同订单'
      }
    },
    {
      path: 'order-change',
      name: 'crmOrderChange',
      component: () => import('@/views/crm/order-change/index.vue'),
      meta: {
        title: '订单变更',
        hidden: true,
        activeMenu: '/crm/order',
        ownerSystem: 'CRM',
        collaboratorSystems: ['ERP'],
        coreObject: '客户订单变更请求'
      }
    },
    {
      path: 'contract',
      name: 'crmContract',
      component: () => import('@/views/crm/contract/index.vue'),
      meta: {
        title: '合同',
        icon: 'Tickets',
        order: 4,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP'],
        coreObject: '客户合同'
      }
    },
    {
      path: 'receivable',
      name: 'crmReceivable',
      component: () => import('@/views/crm/receivable/index.vue'),
      meta: {
        title: '应收',
        icon: 'Money',
        order: 5,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP'],
        coreObject: '客户应收跟进单'
      }
    },
    {
      path: 'invoice',
      name: 'crmInvoice',
      component: () => import('@/views/crm/invoice/index.vue'),
      meta: {
        title: '发票',
        icon: 'Stamp',
        order: 6,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP'],
        coreObject: '客户开票协同单'
      }
    }
  ]
}

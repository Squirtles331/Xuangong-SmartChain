import type { RouteRecordRaw } from 'vue-router'

export const qmsRoute: RouteRecordRaw = {
  path: 'qms',
  name: 'qmsDecision',
  meta: {
    title: '质量管理',
    icon: 'Checked',
    order: 50,
    ownerSystem: 'QMS',
    coreObject: '检验记录 / 质量裁决'
  },
  children: [
    {
      path: 'template',
      name: 'qmsTemplate',
      component: () => import('@/views/qms/template/index.vue'),
      meta: {
        title: '检验模板',
        icon: 'Notebook',
        order: 1,
        ownerSystem: 'QMS',
        coreObject: '检验模板'
      }
    },
    {
      path: 'incoming-inspection',
      name: 'qmsIncomingInspection',
      component: () => import('@/views/qms/incoming-inspection/index.vue'),
      meta: {
        title: '来料检验',
        icon: 'Search',
        order: 2,
        ownerSystem: 'QMS',
        collaboratorSystems: ['WMS'],
        coreObject: '来料检验任务'
      }
    },
    {
      path: 'process-inspection',
      name: 'qmsProcessInspection',
      component: () => import('@/views/qms/process-inspection/index.vue'),
      meta: {
        title: '过程检验',
        icon: 'Operation',
        order: 3,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES'],
        coreObject: '过程检验任务'
      }
    },
    {
      path: 'final-inspection',
      name: 'qmsFinalInspection',
      component: () => import('@/views/qms/final-inspection/index.vue'),
      meta: {
        title: '完工检验',
        icon: 'Finished',
        order: 4,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '完工检验任务'
      }
    },
    {
      path: 'ncr',
      name: 'qmsNcr',
      component: () => import('@/views/qms/ncr/index.vue'),
      meta: {
        title: '不合格处置',
        icon: 'CircleClose',
        order: 5,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '不合格处理单'
      }
    },
    {
      path: 'supplier-quality',
      name: 'qmsSupplierQuality',
      component: () => import('@/views/qms/supplier-quality/index.vue'),
      meta: {
        title: '供应商质量',
        icon: 'TrendCharts',
        order: 6,
        ownerSystem: 'QMS',
        collaboratorSystems: ['SRM'],
        coreObject: '供应商质量表现'
      }
    },
    {
      path: 'concession',
      name: 'qmsConcession',
      component: () => import('@/views/qms/concession/index.vue'),
      meta: {
        title: '特采放行',
        icon: 'Finished',
        order: 7,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '特采放行单'
      }
    },
    {
      path: 'rework-review',
      name: 'qmsReworkReview',
      component: () => import('@/views/qms/rework-review/index.vue'),
      meta: {
        title: '返工裁决',
        icon: 'RefreshLeft',
        order: 8,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES'],
        coreObject: '返工裁决',
        boundaryNote: 'QMS 决定是否返工，MES 负责返工执行链。'
      }
    },
    {
      path: 'scrap-review',
      name: 'qmsScrapReview',
      component: () => import('@/views/qms/scrap-review/index.vue'),
      meta: {
        title: '报废裁决',
        icon: 'DeleteFilled',
        order: 9,
        ownerSystem: 'QMS',
        collaboratorSystems: ['WMS'],
        coreObject: '报废裁决单'
      }
    },
    {
      path: 're-inspection',
      name: 'qmsReInspection',
      component: () => import('@/views/qms/re-inspection/index.vue'),
      meta: {
        title: '复检与关闭',
        icon: 'Select',
        order: 10,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '复检关闭'
      }
    }
  ]
}

import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const qmsRoute: RouteRecordRaw = {
  path: 'qms',
  name: 'qmsDecision',
  meta: { title: '质量管理', icon: 'Checked', order: 50, ownerSystem: 'QMS', coreObject: '检验任务 / 质量裁决' },
  children: [
    {
      path: 'inspection',
      name: 'qmsInspection',
      component: () => import('@/views/qms/inspection/index.vue'),
      meta: { title: '检验任务', icon: 'Search', order: 1, ownerSystem: 'QMS', coreObject: '检验任务' }
    },
    {
      path: 'template',
      name: 'qmsTemplate',
      component: () => import('@/views/qms/template/index.vue'),
      meta: { title: '检验模板', icon: 'Notebook', order: 2 }
    },
    {
      path: 'supplier-quality',
      name: 'qmsSupplierQuality',
      component: () => import('@/views/qms/supplier-quality/index.vue'),
      meta: { title: '供应商质量', icon: 'TrendCharts', order: 3 }
    },
    {
      path: 'ncr',
      name: 'qmsNcr',
      component: plannedPage,
      meta: planned(
        '不合格处置',
        'CircleClose',
        4,
        '统一处理不合格问题，承接责任分派、裁决动作和系统联动。',
        ['不合格台账', '责任分派', '裁决动作', 'MES / WMS 联动'],
        {
          ownerSystem: 'QMS',
          collaboratorSystems: ['MES', 'WMS'],
          coreObject: '不合格处理单'
        }
      )
    },
    {
      path: 'concession',
      name: 'qmsConcession',
      component: plannedPage,
      meta: planned('特采放行', 'Finished', 5, '承接特采申请、审批路径、风险说明和放行范围控制。', ['申请', '审批路径', '风险说明', '放行范围'], {
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '特采放行单'
      })
    },
    {
      path: 'rework-review',
      name: 'qmsReworkReview',
      component: plannedPage,
      meta: planned(
        '返工裁决',
        'RefreshLeft',
        6,
        '对返工请求进行质量裁决，并决定返工路径和复检规则。',
        ['评审', '路径选择', '创建返工单', '复检规则'],
        {
          ownerSystem: 'QMS',
          collaboratorSystems: ['MES'],
          coreObject: '返工裁决',
          boundaryNote: 'QMS 决定是否返工，MES 负责返工执行链。'
        }
      )
    },
    {
      path: 'scrap-review',
      name: 'qmsScrapReview',
      component: plannedPage,
      meta: planned('报废裁决', 'DeleteFilled', 7, '对报废申请进行原因判定、数量审批和损失归集确认。', [
        '报废申请',
        '原因 / 责任',
        '数量审批',
        '损失归集'
      ])
    },
    {
      path: 're-inspection',
      name: 'qmsReInspection',
      component: plannedPage,
      meta: planned('复检与关闭', 'Select', 8, '承接复检任务、结果确认、解锁动作和闭环关闭。', ['复检任务', '结果确认', '解锁动作', '闭环关闭'], {
        ownerSystem: 'QMS',
        collaboratorSystems: ['MES', 'WMS'],
        coreObject: '复检关闭'
      })
    }
  ]
}

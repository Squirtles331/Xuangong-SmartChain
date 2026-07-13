import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const plmRoute: RouteRecordRaw = {
  path: 'plm',
  name: 'plmEngineering',
  meta: { title: '产品工艺', icon: 'Collection', order: 20, ownerSystem: 'PLM', coreObject: 'BOM / 工艺路线 / 工程变更' },
  children: [
    {
      path: 'bom/list',
      name: 'bomList',
      component: () => import('@/views/bom/list/index.vue'),
      meta: { title: '产品结构清单', icon: 'List', order: 1, ownerSystem: 'PLM', coreObject: 'BOM 版本' }
    },
    {
      path: 'bom/create',
      name: 'bomCreate',
      component: () => import('@/views/bom/editor/index.vue'),
      meta: { title: '新建产品结构', hidden: true, activeMenu: '/plm/bom/list' }
    },
    {
      path: 'bom/editor/:id',
      name: 'bomEditor',
      component: () => import('@/views/bom/editor/index.vue'),
      meta: { title: '产品结构编辑', hidden: true, activeMenu: '/plm/bom/list' }
    },
    {
      path: 'bom/compare',
      name: 'bomCompare',
      component: () => import('@/views/bom/compare/index.vue'),
      meta: { title: '结构版本比较', icon: 'Switch', order: 2 }
    },
    {
      path: 'bom/explode',
      name: 'bomExplode',
      component: () => import('@/views/bom/explode/index.vue'),
      meta: { title: '用量展开与反查', icon: 'Search', order: 3 }
    },
    {
      path: 'bom/cost',
      name: 'bomCost',
      component: () => import('@/views/bom/cost/index.vue'),
      meta: { title: '结构成本估算', icon: 'Money', order: 4 }
    },
    {
      path: 'routing',
      name: 'plmRoutingList',
      component: plannedPage,
      meta: planned('工艺路线', 'Connection', 5, '统一管理工艺路线版本、工序顺序和工艺维护入口。', ['路线列表', '路线版本', '工序顺序', '编辑入口'], {
        ownerSystem: 'PLM',
        coreObject: '工艺路线版本'
      })
    },
    {
      path: 'routing/editor/:id',
      name: 'routingEditor',
      component: () => import('@/views/routing/editor/index.vue'),
      meta: { title: '工艺路线编辑', hidden: true, activeMenu: '/plm/routing' }
    },
    {
      path: 'routing/parallel',
      name: 'routingParallel',
      component: () => import('@/views/routing/parallel/index.vue'),
      meta: { title: '并行工序', icon: 'Share', order: 6 }
    },
    {
      path: 'routing/auto-time',
      name: 'routingAutoTime',
      component: () => import('@/views/routing/auto-time/index.vue'),
      meta: { title: '标准工时学习', icon: 'Timer', order: 7 }
    },
    {
      path: 'ecn/list',
      name: 'ecnList',
      component: () => import('@/views/ecn/list/index.vue'),
      meta: { title: '工程变更', icon: 'Switch', order: 8 }
    },
    {
      path: 'cutover',
      name: 'plmCutover',
      component: plannedPage,
      meta: planned('版本切换', 'Right', 9, '承接版本切换影响识别、审批放行和现场切换执行留痕。', ['影响扫描', '审批放行', '新旧收口', '执行日志'], {
        ownerSystem: 'PLM',
        collaboratorSystems: ['MES'],
        coreObject: '版本切换任务',
        boundaryNote: 'PLM 负责版本合法性与发起，MES 负责现场切换执行和收口留痕。'
      })
    }
  ]
}

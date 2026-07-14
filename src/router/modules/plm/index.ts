import type { RouteRecordRaw } from 'vue-router'

export const plmRoute: RouteRecordRaw = {
  path: 'plm',
  name: 'plmEngineering',
  meta: {
    title: '产品工艺',
    icon: 'Collection',
    order: 20,
    ownerSystem: 'PLM',
    coreObject: 'BOM / 工艺路线 / 工序定义 / 工程变更'
  },
  children: [
    {
      path: 'bom',
      name: 'plmBomCenter',
      meta: { title: 'BOM管理', icon: 'DocumentCopy', order: 1, ownerSystem: 'PLM', coreObject: 'BOM 版本' },
      children: [
        {
          path: 'list',
          name: 'bomList',
          component: () => import('@/views/plm/bom/list/index.vue'),
          meta: { title: '产品结构清单', icon: 'List', order: 1, ownerSystem: 'PLM', coreObject: 'BOM 版本' }
        },
        {
          path: 'create',
          name: 'bomCreate',
          component: () => import('@/views/plm/bom/editor/index.vue'),
          meta: { title: '新建产品结构', hidden: true, activeMenu: '/plm/bom/list' }
        },
        {
          path: 'editor/:id',
          name: 'bomEditor',
          component: () => import('@/views/plm/bom/editor/index.vue'),
          meta: { title: '产品结构编辑', hidden: true, activeMenu: '/plm/bom/list' }
        },
        {
          path: 'compare',
          name: 'bomCompare',
          component: () => import('@/views/plm/bom/compare/index.vue'),
          meta: {
            title: '结构版本比较',
            icon: 'Switch',
            order: 2,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'WMS', 'QMS'],
            coreObject: 'BOM 版本差异',
            boundaryNote: 'PLM 负责结构版本真相和差异评估，MES / WMS / QMS 只消费对比结果，不在本页重定义结构对象。'
          }
        },
        {
          path: 'explode',
          name: 'bomExplode',
          component: () => import('@/views/plm/bom/explode/index.vue'),
          meta: {
            title: '用量展开与反查',
            icon: 'Search',
            order: 3,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'WMS', 'QMS'],
            coreObject: 'BOM 结构 / 引用关系',
            boundaryNote: 'PLM 负责结构层级和引用版本真相，执行系统按统一结构做领料、反查和追溯，不在本页维护对象实例。'
          }
        },
        {
          path: 'cost',
          name: 'bomCost',
          component: () => import('@/views/plm/bom/cost/index.vue'),
          meta: {
            title: '结构成本估算',
            icon: 'Money',
            order: 4,
            ownerSystem: 'PLM',
            collaboratorSystems: ['ERP', 'MES'],
            coreObject: 'BOM + 物料成本估算',
            boundaryNote: 'PLM 基于结构、工时和路线参数给出工程估算口径，ERP 负责最终财务成本核算与结算真相。'
          }
        }
      ]
    },
    {
      path: 'process',
      name: 'plmProcessDefinition',
      meta: { title: '工艺定义', icon: 'Connection', order: 2, ownerSystem: 'PLM', coreObject: '工艺路线 / 工序定义' },
      children: [
        {
          path: 'routing',
          name: 'plmRoutingList',
          component: () => import('@/views/plm/process/routing-list/index.vue'),
          meta: {
            title: '工艺路线',
            icon: 'Connection',
            order: 1,
            ownerSystem: 'PLM',
            coreObject: '工艺路线版本',
            boundaryNote: 'PLM 负责工艺路线的新增、修改、发布和版本维护，MES 与 APS 按统一路线真相消费。'
          }
        },
        {
          path: 'operation-definition',
          name: 'plmOperationDefinition',
          component: () => import('@/views/plm/process/operation-definition/index.vue'),
          meta: {
            title: '工序定义',
            icon: 'Operation',
            order: 2,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'QMS', 'APS', 'MDM'],
            coreObject: '工序定义',
            boundaryNote: 'PLM 负责工序模板、发布语义与质量约束定义，MDM 只负责编码规则治理，MES/QMS/APS 按统一工序口径消费。'
          }
        },
        {
          path: 'routing/editor/:id',
          name: 'routingEditor',
          component: () => import('@/views/plm/process/routing-editor/index.vue'),
          meta: { title: '工艺路线编辑', hidden: true, activeMenu: '/plm/process/routing' }
        },
        {
          path: 'parallel-operation',
          name: 'routingParallel',
          component: () => import('@/views/plm/process/parallel-operation/index.vue'),
          meta: {
            title: '并行工序',
            icon: 'Share',
            order: 3,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'APS'],
            coreObject: '工序关系规则',
            boundaryNote: 'PLM 负责定义工艺路线中的并行与汇合规则，MES / APS 按已发布路线消费并执行，不在本页重定义工序对象。'
          }
        },
        {
          path: 'standard-time',
          name: 'routingAutoTime',
          component: () => import('@/views/plm/process/standard-time/index.vue'),
          meta: {
            title: '标准工时学习',
            icon: 'Timer',
            order: 4,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'APS'],
            coreObject: '工艺工时参数',
            boundaryNote: 'PLM 负责沉淀标准工时建议与采纳口径，MES 提供实绩样本，APS 按已采纳工时参数消费。'
          }
        }
      ]
    },
    {
      path: 'change',
      name: 'plmChangeCenter',
      meta: { title: '工程变更', icon: 'Switch', order: 3, ownerSystem: 'PLM', coreObject: 'ECN / 版本切换' },
      children: [
        {
          path: 'ecn/list',
          name: 'ecnList',
          component: () => import('@/views/plm/change/ecn/list/index.vue'),
          meta: {
            title: '工程变更',
            icon: 'Switch',
            order: 1,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES', 'WMS', 'QMS'],
            coreObject: '工程变更单',
            boundaryNote: 'PLM 负责工程变更的版本影响识别和放行，执行系统按放行结果消费。'
          }
        },
        {
          path: 'cutover',
          name: 'plmCutover',
          component: () => import('@/views/plm/change/cutover/index.vue'),
          meta: {
            title: '版本切换',
            icon: 'Right',
            order: 2,
            ownerSystem: 'PLM',
            collaboratorSystems: ['MES'],
            coreObject: '版本切换任务',
            boundaryNote: 'PLM 负责版本合法性与发起，MES 负责现场切换执行和收口留痕。'
          }
        }
      ]
    }
  ]
}

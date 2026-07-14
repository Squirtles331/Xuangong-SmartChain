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
      meta: {
        title: '组织',
        icon: 'OfficeBuilding',
        order: 1,
        ownerSystem: 'MDM',
        collaboratorSystems: ['SYS', 'ERP', 'MES'],
        coreObject: '组织主数据',
        boundaryNote: '统一维护集团、公司、工厂、车间与产线层级，供权限、计划与执行链路共同引用。'
      }
    },
    {
      path: 'material',
      name: 'mdmMaterial',
      component: () => import('@/views/mdm/material/index.vue'),
      meta: {
        title: '物料',
        icon: 'Goods',
        order: 2,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'WMS', 'SRM'],
        coreObject: '物料主数据',
        boundaryNote: '统一维护物料编码、基础属性与供应策略，下游模块按统一口径消费。'
      }
    },
    {
      path: 'material-category',
      name: 'mdmMaterialCategory',
      component: () => import('@/views/mdm/material-category/index.vue'),
      meta: {
        title: '物料分类',
        icon: 'CollectionTag',
        order: 3,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'WMS'],
        coreObject: '物料分类主数据',
        boundaryNote: '统一定义分类层级、默认批次与单位策略，避免各系统自建分类口径。'
      }
    },
    {
      path: 'unit',
      name: 'mdmUnit',
      component: () => import('@/views/mdm/unit/index.vue'),
      meta: {
        title: '计量单位',
        icon: 'ScaleToOriginal',
        order: 4,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'WMS', 'QMS'],
        coreObject: '计量单位主数据',
        boundaryNote: '统一维护主单位、辅助单位与精度规则，避免制造、仓储、财务口径不一致。'
      }
    },
    {
      path: 'batch-strategy',
      name: 'mdmBatchStrategy',
      component: () => import('@/views/mdm/batch-strategy/index.vue'),
      meta: {
        title: '批次策略',
        icon: 'Files',
        order: 5,
        ownerSystem: 'MDM',
        collaboratorSystems: ['MES', 'WMS', 'ERP', 'QMS'],
        coreObject: '批次策略主数据',
        boundaryNote: '统一定义批次生成、追溯深度与适用场景，保证领料、报工、检验链路一致。'
      }
    },
    {
      path: 'substitute-strategy',
      name: 'mdmSubstituteStrategy',
      component: () => import('@/views/mdm/substitute-strategy/index.vue'),
      meta: {
        title: '替代料策略',
        icon: 'Switch',
        order: 6,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'QMS'],
        coreObject: '替代料策略主数据',
        boundaryNote: '统一约束主料、替代料与审批规则，避免设计、生产、采购各自维护替代关系。'
      }
    },
    {
      path: 'work-center',
      name: 'mdmWorkCenter',
      component: () => import('@/views/mdm/work-center/index.vue'),
      meta: {
        title: '工作中心',
        icon: 'Grid',
        order: 7,
        ownerSystem: 'MES',
        collaboratorSystems: ['MDM', 'APS', 'ERP'],
        coreObject: '工作中心主数据',
        boundaryNote: '工作中心作为制造执行与排产的基础能力对象，统一纳入 MDM 目录治理。'
      }
    },
    {
      path: 'equipment',
      name: 'mdmEquipment',
      component: () => import('@/views/mdm/equipment/index.vue'),
      meta: {
        title: '设备',
        icon: 'Monitor',
        order: 8,
        ownerSystem: 'MES',
        collaboratorSystems: ['MDM', 'EAM', 'IOT'],
        coreObject: '设备主数据',
        boundaryNote: '统一设备编码、型号与状态口径，供执行、点检、采集与资产维护共同引用。'
      }
    },
    {
      path: 'production-line',
      name: 'mdmProductionLine',
      component: () => import('@/views/mdm/production-line/index.vue'),
      meta: {
        title: '产线',
        icon: 'Share',
        order: 9,
        ownerSystem: 'MES',
        collaboratorSystems: ['MDM', 'APS', 'IOT'],
        coreObject: '产线主数据',
        boundaryNote: '统一维护产线层级、节拍与约束，为排产、执行与采集提供一致对象模型。'
      }
    },
    {
      path: 'resource',
      name: 'mdmResource',
      component: () => import('@/views/mdm/resource/index.vue'),
      meta: {
        title: '制造资源',
        icon: 'Cpu',
        order: 10,
        ownerSystem: 'MES',
        collaboratorSystems: ['MDM', 'APS', 'EAM'],
        coreObject: '制造资源主数据',
        boundaryNote: '统一维护人员、工装、设备等资源对象，供计划与执行链路共用。'
      }
    },
    {
      path: 'resource-capability',
      name: 'mdmResourceCapability',
      component: () => import('@/views/mdm/resource-capability/index.vue'),
      meta: {
        title: '资源能力',
        icon: 'DataAnalysis',
        order: 11,
        ownerSystem: 'MES',
        collaboratorSystems: ['MDM', 'APS', 'PLM'],
        coreObject: '资源能力主数据',
        boundaryNote: '统一定义能力参数、产能约束与适用边界，避免计划与现场各自维护能力值。'
      }
    },
    {
      path: 'warehouse',
      name: 'mdmWarehouse',
      component: () => import('@/views/mdm/warehouse/index.vue'),
      meta: {
        title: '仓库',
        icon: 'House',
        order: 12,
        ownerSystem: 'WMS',
        collaboratorSystems: ['MDM', 'ERP', 'MES', 'SRM'],
        coreObject: '仓库主数据',
        boundaryNote: '统一仓库编码、类型与容量说明，库存事务和制造领退料按同一仓库口径执行。'
      }
    },
    {
      path: 'warehouse-location',
      name: 'mdmWarehouseLocation',
      component: () => import('@/views/mdm/warehouse-location/index.vue'),
      meta: {
        title: '库区 / 库位',
        icon: 'Box',
        order: 13,
        ownerSystem: 'WMS',
        collaboratorSystems: ['MDM', 'MES', 'ERP'],
        coreObject: '库区库位主数据',
        boundaryNote: '统一库区、库位与容器定位规则，避免收货、上架、发料使用不同位置口径。'
      }
    },
    {
      path: 'customer',
      name: 'mdmCustomer',
      component: () => import('@/views/mdm/customer/index.vue'),
      meta: {
        title: '客户',
        icon: 'User',
        order: 14,
        ownerSystem: 'CRM',
        collaboratorSystems: ['MDM', 'ERP'],
        coreObject: '客户基础主数据',
        boundaryNote: '纳入 MDM 统一治理目录，客户基础信息由 CRM 主导维护并向订单、对账场景共享。'
      }
    },
    {
      path: 'supplier',
      name: 'mdmSupplier',
      component: () => import('@/views/mdm/supplier/index.vue'),
      meta: {
        title: '供应商',
        icon: 'Avatar',
        order: 15,
        ownerSystem: 'SRM',
        collaboratorSystems: ['MDM', 'ERP', 'QMS'],
        coreObject: '供应商基础主数据',
        boundaryNote: '纳入 MDM 统一治理目录，供应商资质与协同信息由 SRM 主导维护。'
      }
    },
    {
      path: 'inspection-standard',
      name: 'mdmInspectionStandard',
      component: () => import('@/views/mdm/inspection-standard/index.vue'),
      meta: {
        title: '检验标准',
        icon: 'CircleCheck',
        order: 16,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MDM', 'MES', 'ERP'],
        coreObject: '检验标准主数据',
        boundaryNote: '统一维护来料、过程、完工检验标准，质量源头由 QMS 负责发布。'
      }
    },
    {
      path: 'inspection-item',
      name: 'mdmInspectionItem',
      component: () => import('@/views/mdm/inspection-item/index.vue'),
      meta: {
        title: '检验项目',
        icon: 'List',
        order: 17,
        ownerSystem: 'QMS',
        collaboratorSystems: ['MDM', 'MES'],
        coreObject: '检验项目主数据',
        boundaryNote: '统一维护检验方法、判定标准与项目编码，现场检验与追溯按统一项目执行。'
      }
    },
    {
      path: 'code-rule',
      name: 'mdmCodeRule',
      component: () => import('@/views/mdm/code-rule/index.vue'),
      meta: {
        title: '编码规则',
        icon: 'Postcard',
        order: 18,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'WMS', 'QMS'],
        coreObject: '编码规则',
        boundaryNote: '统一规范物料、BOM、工艺路线、工序、变更单等对象的编码规则；具体编码实例生成、占用与唯一性校验由对象所属系统负责。'
      }
    },
    {
      path: 'status-dict',
      name: 'mdmStatusDict',
      component: () => import('@/views/mdm/status-dict/index.vue'),
      meta: {
        title: '状态字典',
        icon: 'Tickets',
        order: 19,
        ownerSystem: 'MDM',
        collaboratorSystems: ['PLM', 'MES', 'ERP', 'WMS', 'QMS'],
        coreObject: '状态字典',
        boundaryNote: '统一维护关键对象状态值、显示文案与业务含义，防止不同模块状态语义失真。'
      }
    },
    {
      path: 'mold',
      name: 'mdmMold',
      component: () => import('@/views/mdm/mold/index.vue'),
      meta: {
        title: '模具',
        icon: 'Box',
        order: 20,
        ownerSystem: 'PLM',
        collaboratorSystems: ['MDM', 'MES', 'EAM'],
        coreObject: '模具主数据',
        boundaryNote: '模具设计与寿命基线由 PLM 管理，制造与维护环节按统一模具对象消费。'
      }
    }
  ]
}

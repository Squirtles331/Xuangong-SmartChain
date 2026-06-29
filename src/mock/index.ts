/**
 * Mock 数据中心 — 统一导出
 *
 * @deprecated 请通过 @/api/* 获取数据，不要直接引用此文件。
 *             页面应使用 src/api 层，由 api 层决定 mock/real 切换。
 *             此文件仅为向后兼容保留，后续版本将移除。
 *
 * 迁移指引：
 *   旧: import { workOrders } from '@/mock'
 *   新: import { getWorkOrderList } from '@/api/work-order'
 *
 * 详见 docs/mock-api-migration-master-plan.md
 */

// 系统管理
export { dictTypes, dictItems, menuTree, systemParams, auditLogs, codeRules, approvalFlows, systemUsers } from './modules/system'

// 工单管理
export { workOrders, workOrderOperations, kanbanOps, reportHistory, myTasks } from './modules/work-order'

// BOM/工艺/ECN
export { bomList, bomTree, routingOperations, ecnOrders, bomPreview } from './modules/bom'

// 营销 + 采购仓储质检 + MDM
export {
  customers,
  salesOrders,
  receivables,
  suppliers,
  purchaseOrders,
  inventory,
  inspectionTasks,
  qcTemplates,
  orgTree,
  materialTree,
  materialList,
  equipments,
  workCenters,
  molds
} from './modules/business'

// MRP
export { mrpPurchaseList, mrpProductionList, mrpExceptions } from './modules/mrp'

// 能源
export { energyDetails } from './modules/energy'

// 财务
export { costDetails, debitData, creditData, ledgerData, recData } from './modules/finance'

// 人资
export { hrEmployees, skillMatrix } from './modules/hr'

// 仓储/IoT
export { wmsMaterials, stockCountExec, stockCountDiff, iotDevices, iotAlertHistory } from './modules/wms'

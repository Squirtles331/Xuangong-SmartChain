/**
 * Mock 数据中心 — 统一导出
 *
 * 使用方式：
 * import { dictTypes, dictItems, menuTree, systemParams, auditLogs, codeRules, approvalFlows, systemUsers } from '@/mock'
 * import { workOrders, workOrderOperations, kanbanOps, reportHistory, myTasks } from '@/mock'
 * import { bomList, bomTree, routingOperations, ecnOrders, bomPreview } from '@/mock'
 * import { customers, salesOrders, receivables, suppliers, purchaseOrders, inventory, inspectionTasks, qcTemplates, orgTree, materialTree, materialList, equipments, workCenters, molds } from '@/mock'
 */

// 系统管理
export { dictTypes, dictItems, menuTree, systemParams, auditLogs, codeRules, approvalFlows, systemUsers } from './system'

// 工单管理
export { workOrders, workOrderOperations, kanbanOps, reportHistory, myTasks } from './work-order'

// BOM/工艺/ECN
export { bomList, bomTree, routingOperations, ecnOrders, bomPreview } from './bom'

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
} from './business'

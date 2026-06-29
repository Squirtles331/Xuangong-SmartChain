import type { StatusOption } from '@/components/StatusTag.vue'

/** 工单状态 */
export const WORK_ORDER_STATUS: StatusOption[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'approved', label: '已审批', type: '' },
  { value: 'released', label: '已下发', type: 'warning' },
  { value: 'in_progress', label: '生产中', type: 'primary' },
  { value: 'completed', label: '已完工', type: 'success' },
  { value: 'closed', label: '已关闭', type: 'info' }
]

/** 工单优先级 */
export const WORK_ORDER_PRIORITY: StatusOption[] = [
  { value: 'urgent', label: '紧急', type: 'danger' },
  { value: 'high', label: '高', type: 'warning' },
  { value: 'normal', label: '普通', type: 'info' },
  { value: 'low', label: '低', type: '' }
]

/** 通用启用/禁用 */
export const ENABLE_STATUS: StatusOption[] = [
  { value: '启用', label: '启用', type: 'success' },
  { value: 'active', label: '启用', type: 'success' },
  { value: '禁用', label: '禁用', type: 'info' },
  { value: 'disabled', label: '禁用', type: 'info' }
]

/** 客户状态 */
export const CUSTOMER_STATUS: StatusOption[] = [
  { value: 'active', label: '正常', type: 'success' },
  { value: 'blacklisted', label: '黑名单', type: 'danger' }
]

/** 设备状态 */
export const EQUIPMENT_STATUS: StatusOption[] = [
  { value: 'running', label: '运行中', type: 'success' },
  { value: 'idle', label: '空闲', type: '' },
  { value: 'maintenance', label: '保养中', type: 'warning' },
  { value: 'repair', label: '维修中', type: 'danger' },
  { value: 'scrapped', label: '已报废', type: 'info' }
]

/** 质检判定 */
export const INSPECTION_RESULT: StatusOption[] = [
  { value: 'pass', label: '合格', type: 'success' },
  { value: 'concession', label: '让步接收', type: 'warning' },
  { value: 'rework', label: '返工', type: 'danger' },
  { value: 'return', label: '退货', type: 'danger' },
  { value: 'scrap', label: '报废', type: 'info' }
]

/** 销售订单状态 */
export const ORDER_STATUS: StatusOption[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'approved', label: '已审批', type: '' },
  { value: 'in_production', label: '生产中', type: 'primary' },
  { value: 'delivered', label: '已发货', type: 'warning' },
  { value: 'completed', label: '已完成', type: 'success' },
  { value: 'cancelled', label: '已取消', type: 'info' }
]

/** 采购订单状态 */
export const PURCHASE_STATUS: StatusOption[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'ordered', label: '已下单', type: '' },
  { value: 'received', label: '已收货', type: 'success' },
  { value: 'returned', label: '已退货', type: 'danger' }
]

/** 商机阶段 */
export const OPPORTUNITY_STAGE: StatusOption[] = [
  { value: 'initial', label: '初步接触', type: 'info' },
  { value: 'proposal', label: '方案制定', type: '' },
  { value: 'quotation', label: '报价', type: 'warning' },
  { value: 'negotiation', label: '谈判', type: 'primary' },
  { value: 'won', label: '成交', type: 'success' },
  { value: 'lost', label: '丢失', type: 'danger' }
]

/** EHS 风险等级 */
export const RISK_LEVEL: StatusOption[] = [
  { value: 'I', label: 'I级风险', type: 'danger' },
  { value: 'II', label: 'II级风险', type: 'warning' },
  { value: 'III', label: 'III级风险', type: '' }
]

/** 合同状态 */
export const CONTRACT_STATUS: StatusOption[] = [
  { value: 'draft', label: '草稿', type: 'info' },
  { value: 'active', label: '生效中', type: 'success' },
  { value: 'expired', label: '已过期', type: 'warning' },
  { value: 'terminated', label: '已终止', type: 'danger' }
]

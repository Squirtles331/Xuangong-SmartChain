export const financePayables = [
  {
    id: 'payable-1',
    code: 'AP20250601001',
    supplier: '华东特钢供应有限公司',
    amount: 185000,
    paid: 90000,
    balance: 95000,
    due_date: '2026-07-10',
    status: 'partial'
  },
  {
    id: 'payable-2',
    code: 'AP20250605002',
    supplier: '苏州精密轴承制造厂',
    amount: 126000,
    paid: 0,
    balance: 126000,
    due_date: '2026-07-18',
    status: 'open'
  },
  {
    id: 'payable-3',
    code: 'AP20250608003',
    supplier: '宁波工业气体科技有限公司',
    amount: 42800,
    paid: 42800,
    balance: 0,
    due_date: '2026-06-28',
    status: 'paid'
  },
  {
    id: 'payable-4',
    code: 'AP20250612004',
    supplier: '上海自动化电控设备有限公司',
    amount: 96300,
    paid: 30000,
    balance: 66300,
    due_date: '2026-07-22',
    status: 'partial'
  },
  {
    id: 'payable-5',
    code: 'AP20250615005',
    supplier: '青岛包装材料有限公司',
    amount: 31800,
    paid: 0,
    balance: 31800,
    due_date: '2026-07-25',
    status: 'open'
  }
]

export const financeCostDetails = [
  {
    id: 'cost-1',
    product: '离心泵 XJ-LX-100',
    material_cost: 12800,
    labor_cost: 3600,
    overhead: 1900,
    total: 18300,
    period: '2026-06'
  },
  {
    id: 'cost-2',
    product: '离心泵 XJ-LX-150',
    material_cost: 15600,
    labor_cost: 4200,
    overhead: 2300,
    total: 22100,
    period: '2026-06'
  },
  {
    id: 'cost-3',
    product: '齿轮泵 XJ-CL-80',
    material_cost: 9100,
    labor_cost: 2600,
    overhead: 1500,
    total: 13200,
    period: '2026-06'
  },
  {
    id: 'cost-4',
    product: '液压站 XJ-YY-01',
    material_cost: 28600,
    labor_cost: 6800,
    overhead: 3200,
    total: 38600,
    period: '2026-06'
  },
  {
    id: 'cost-5',
    product: '装配组件 XJ-ZP-12',
    material_cost: 5200,
    labor_cost: 1900,
    overhead: 900,
    total: 8000,
    period: '2026-06'
  }
]

export const financeDebitAccounts = [
  { id: 'debit-1', code: '1403', account: '原材料', type: '资产', amount: 1260000 },
  { id: 'debit-2', code: '5001', account: '生产成本', type: '成本', amount: 918000 },
  { id: 'debit-3', code: '1122', account: '应收账款', type: '资产', amount: 1680000 },
  { id: 'debit-4', code: '6602', account: '管理费用', type: '费用', amount: 286000 }
]

export const financeCreditAccounts = [
  { id: 'credit-1', code: '2202', account: '应付账款', type: '负债', amount: 1080000 },
  { id: 'credit-2', code: '2221', account: '应交税费', type: '负债', amount: 312000 },
  { id: 'credit-3', code: '6001', account: '主营业务收入', type: '收入', amount: 2860000 },
  { id: 'credit-4', code: '4001', account: '实收资本', type: '权益', amount: 5000000 }
]

export const financeLedgerEntries = [
  {
    id: 'ledger-1',
    date: '2026-06-03',
    voucher: 'PZ-202606-001',
    account: '原材料',
    debit: 360000,
    credit: 0,
    summary: '采购钢材与铸件'
  },
  {
    id: 'ledger-2',
    date: '2026-06-08',
    voucher: 'PZ-202606-002',
    account: '生产成本',
    debit: 285000,
    credit: 0,
    summary: '生产领料结转'
  },
  {
    id: 'ledger-3',
    date: '2026-06-12',
    voucher: 'PZ-202606-003',
    account: '主营业务收入',
    debit: 0,
    credit: 820000,
    summary: '销售离心泵产品'
  },
  {
    id: 'ledger-4',
    date: '2026-06-18',
    voucher: 'PZ-202606-004',
    account: '应付账款',
    debit: 120000,
    credit: 0,
    summary: '支付供应商货款'
  },
  {
    id: 'ledger-5',
    date: '2026-06-24',
    voucher: 'PZ-202606-005',
    account: '管理费用',
    debit: 56000,
    credit: 0,
    summary: '办公及差旅报销'
  },
  {
    id: 'ledger-6',
    date: '2026-06-29',
    voucher: 'PZ-202606-006',
    account: '应收账款',
    debit: 0,
    credit: 468000,
    summary: '收到客户回款'
  }
]

export const financeReconciliation = [
  {
    id: 'rec-1',
    date: '2026-06-03',
    voucher: 'PZ-202606-001',
    debit_account: '原材料',
    credit_account: '银行存款',
    debit: 360000,
    credit: 360000,
    diff: 0,
    status: 'matched'
  },
  {
    id: 'rec-2',
    date: '2026-06-12',
    voucher: 'PZ-202606-003',
    debit_account: '银行存款',
    credit_account: '主营业务收入',
    debit: 820000,
    credit: 820000,
    diff: 0,
    status: 'matched'
  },
  {
    id: 'rec-3',
    date: '2026-06-18',
    voucher: 'PZ-202606-004',
    debit_account: '应付账款',
    credit_account: '银行存款',
    debit: 120000,
    credit: 120000,
    diff: 0,
    status: 'matched'
  },
  {
    id: 'rec-4',
    date: '2026-06-30',
    voucher: 'PZ-202606-007',
    debit_account: '制造费用',
    credit_account: '银行存款',
    debit: 98500,
    credit: 96000,
    diff: 2500,
    status: 'pending'
  }
]

export const financeReportSummary = {
  currentMonth: {
    revenue: 852000,
    cost: 628000,
    gross: 224000,
    receivable: 318000,
    payable: 196000,
    profit: 146000
  },
  lastMonth: {
    revenue: 816000,
    cost: 606000,
    gross: 210000,
    receivable: 302000,
    payable: 188000,
    profit: 138000
  }
}

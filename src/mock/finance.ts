// 财务管理 Mock 数据
export const costDetails = [
  { id: '1', product: '离心泵 XJP-100', material_cost: 12500, labor_cost: 3200, overhead: 1800, total: 17500, period: '2025-01' },
  { id: '2', product: '离心泵 XJP-150', material_cost: 15800, labor_cost: 3800, overhead: 2100, total: 21700, period: '2025-01' },
  { id: '3', product: '齿轮泵 CBP-50', material_cost: 8900, labor_cost: 2500, overhead: 1400, total: 12800, period: '2025-01' },
  { id: '4', product: '齿轮泵 CBP-80', material_cost: 10200, labor_cost: 2800, overhead: 1600, total: 14600, period: '2025-01' },
  { id: '5', product: '柱塞泵 ZSP-100', material_cost: 18500, labor_cost: 4200, overhead: 2400, total: 25100, period: '2025-01' },
  { id: '6', product: '柱塞泵 ZSP-150', material_cost: 22000, labor_cost: 5000, overhead: 2800, total: 29800, period: '2025-01' },
  { id: '7', product: '阀门组件 VF-50', material_cost: 3200, labor_cost: 1200, overhead: 600, total: 5000, period: '2025-01' },
  { id: '8', product: '阀门组件 VF-100', material_cost: 4500, labor_cost: 1500, overhead: 800, total: 6800, period: '2025-01' },
  { id: '9', product: '轴承座 BZ-200', material_cost: 2800, labor_cost: 900, overhead: 500, total: 4200, period: '2025-01' },
  { id: '10', product: '轴承座 BZ-300', material_cost: 3500, labor_cost: 1100, overhead: 600, total: 5200, period: '2025-01' }
]

export const debitData = [
  { id: '1', account: '原材料', code: '1403', amount: 1250000, type: '资产' },
  { id: '2', account: '生产成本', code: '5001', amount: 890000, type: '成本' },
  { id: '3', account: '应收账款', code: '1122', amount: 1560000, type: '资产' },
  { id: '4', account: '固定资产', code: '1601', amount: 3200000, type: '资产' },
  { id: '5', account: '管理费用', code: '6602', amount: 450000, type: '费用' },
  { id: '6', account: '销售费用', code: '6601', amount: 320000, type: '费用' }
]

export const creditData = [
  { id: '1', account: '应付账款', code: '2202', amount: 980000, type: '负债' },
  { id: '2', account: '实收资本', code: '4001', amount: 5000000, type: '权益' },
  { id: '3', account: '短期借款', code: '2001', amount: 1500000, type: '负债' },
  { id: '4', account: '主营业务收入', code: '6001', amount: 2800000, type: '收入' },
  { id: '5', account: '应交税费', code: '2221', amount: 340000, type: '负债' }
]

export const ledgerData = [
  { id: '1', date: '2025-01-05', voucher: 'PZ-2025-0001', account: '原材料', debit: 500000, credit: 0, summary: '采购钢材一批' },
  { id: '2', date: '2025-01-08', voucher: 'PZ-2025-0002', account: '生产成本', debit: 320000, credit: 0, summary: '领用原材料' },
  { id: '3', date: '2025-01-12', voucher: 'PZ-2025-0003', account: '主营业务收入', debit: 0, credit: 850000, summary: '销售离心泵' },
  { id: '4', date: '2025-01-15', voucher: 'PZ-2025-0004', account: '应付账款', debit: 200000, credit: 0, summary: '支付供应商货款' },
  { id: '5', date: '2025-01-20', voucher: 'PZ-2025-0005', account: '管理费用', debit: 85000, credit: 0, summary: '办公费用报销' },
  { id: '6', date: '2025-01-25', voucher: 'PZ-2025-0006', account: '应收账款', debit: 0, credit: 650000, summary: '收到客户回款' },
  { id: '7', date: '2025-01-28', voucher: 'PZ-2025-0007', account: '主营业务收入', debit: 0, credit: 450000, summary: '销售齿轮泵' },
  { id: '8', date: '2025-01-31', voucher: 'PZ-2025-0008', account: '应交税费', debit: 120000, credit: 0, summary: '缴纳增值税' }
]

export const recData = [
  {
    id: '1',
    date: '2025-01-05',
    voucher: 'PZ-2025-0001',
    debit_account: '原材料',
    credit_account: '银行存款',
    debit: 500000,
    credit: 500000,
    diff: 0,
    status: 'balanced'
  },
  {
    id: '2',
    date: '2025-01-12',
    voucher: 'PZ-2025-0003',
    debit_account: '银行存款',
    credit_account: '主营业务收入',
    debit: 850000,
    credit: 850000,
    diff: 0,
    status: 'balanced'
  },
  {
    id: '3',
    date: '2025-01-15',
    voucher: 'PZ-2025-0004',
    debit_account: '应付账款',
    credit_account: '银行存款',
    debit: 200000,
    credit: 200000,
    diff: 0,
    status: 'balanced'
  },
  {
    id: '4',
    date: '2025-01-25',
    voucher: 'PZ-2025-0006',
    debit_account: '银行存款',
    credit_account: '应收账款',
    debit: 650000,
    credit: 650000,
    diff: 0,
    status: 'balanced'
  },
  {
    id: '5',
    date: '2025-01-31',
    voucher: 'PZ-2025-0008',
    debit_account: '应交税费',
    credit_account: '银行存款',
    debit: 120000,
    credit: 120000,
    diff: 0,
    status: 'balanced'
  }
]

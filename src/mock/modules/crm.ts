export const customers = [
  {
    id: 'customer-1',
    code: 'KH202501001',
    name: '华东重工集团',
    contact_person: '张建国',
    contact_phone: '13800010001',
    payment_terms: '月结30天',
    credit_limit: 2000000,
    status: 'active' as const
  },
  {
    id: 'customer-2',
    code: 'KH202501002',
    name: '启明精密制造',
    contact_person: '李雅婷',
    contact_phone: '13800010002',
    payment_terms: '月结45天',
    credit_limit: 1200000,
    status: 'active' as const
  },
  {
    id: 'customer-3',
    code: 'KH202501003',
    name: '鼎盛动力设备',
    contact_person: '王海峰',
    contact_phone: '13800010003',
    payment_terms: '款到发货',
    credit_limit: 800000,
    status: 'disabled' as const
  }
]

export const salesOrders = [
  {
    id: 'sales-order-1',
    code: 'SO202506300001',
    customer_name: '华东重工集团',
    material_name: '离心泵 XJP-100',
    qty: 50,
    amount: 230000,
    delivery_date: '2026-07-20',
    status: 'approved' as const
  },
  {
    id: 'sales-order-2',
    code: 'SO202506280002',
    customer_name: '启明精密制造',
    material_name: '齿轮箱 GBX-200',
    qty: 20,
    amount: 180000,
    delivery_date: '2026-07-15',
    status: 'in_production' as const
  },
  {
    id: 'sales-order-3',
    code: 'SO202506250003',
    customer_name: '鼎盛动力设备',
    material_name: '传动轴 DS-50',
    qty: 80,
    amount: 320000,
    delivery_date: '2026-07-10',
    status: 'pending_delivery' as const
  },
  {
    id: 'sales-order-4',
    code: 'SO202506200004',
    customer_name: '华东重工集团',
    material_name: '联轴器 LZQ-80',
    qty: 120,
    amount: 156000,
    delivery_date: '2026-06-25',
    status: 'completed' as const
  }
]

export const quotations = [
  {
    id: 'quotation-1',
    code: 'BJ202506300001',
    customer: '华东重工集团',
    product: '离心泵 XJP-100',
    qty: 50,
    price: 4600,
    amount: 230000,
    valid_date: '2026-07-30',
    status: 'sent' as const
  },
  {
    id: 'quotation-2',
    code: 'BJ202506280002',
    customer: '启明精密制造',
    product: '齿轮箱 GBX-200',
    qty: 20,
    price: 9000,
    amount: 180000,
    valid_date: '2026-07-15',
    status: 'approved' as const
  },
  {
    id: 'quotation-3',
    code: 'BJ202506260003',
    customer: '鼎盛动力设备',
    product: '传动轴 DS-50',
    qty: 80,
    price: 4000,
    amount: 320000,
    valid_date: '2026-07-05',
    status: 'draft' as const
  }
]

export const opportunities: Array<{
  id: string
  customer: string
  product: string
  amount: number
  stage: 'initial' | 'solution' | 'quotation' | 'won'
  probability: number
  owner: string
  close_date: string
}> = [
  {
    id: 'opportunity-1',
    customer: '华东重工集团',
    product: '离心泵 XJP-100 批量订单',
    amount: 500000,
    stage: 'quotation' as const,
    probability: 60,
    owner: '张经理',
    close_date: '2026-08-15'
  },
  {
    id: 'opportunity-2',
    customer: '启明精密制造',
    product: '齿轮箱 GBX-200 试制项目',
    amount: 180000,
    stage: 'solution' as const,
    probability: 45,
    owner: '李经理',
    close_date: '2026-08-05'
  },
  {
    id: 'opportunity-3',
    customer: '鼎盛动力设备',
    product: '传动轴 DS-50 年框合作',
    amount: 320000,
    stage: 'initial' as const,
    probability: 25,
    owner: '王经理',
    close_date: '2026-09-01'
  }
]

export const contracts = [
  {
    id: 'contract-1',
    code: 'HT202506300001',
    customer: '华东重工集团',
    amount: 2500000,
    sign_date: '2026-06-01',
    start_date: '2026-06-01',
    end_date: '2026-12-31',
    status: 'active' as const
  },
  {
    id: 'contract-2',
    code: 'HT202506280002',
    customer: '启明精密制造',
    amount: 800000,
    sign_date: '2026-05-28',
    start_date: '2026-06-01',
    end_date: '2027-05-31',
    status: 'active' as const
  },
  {
    id: 'contract-3',
    code: 'HT202505100003',
    customer: '鼎盛动力设备',
    amount: 500000,
    sign_date: '2026-05-10',
    start_date: '2026-05-15',
    end_date: '2026-06-20',
    status: 'expired' as const
  }
]

export const invoices = [
  {
    id: 'invoice-1',
    code: 'FP202506300001',
    customer: '华东重工集团',
    order_code: 'SO202506300001',
    amount: 230000,
    tax_rate: 13,
    tax_amount: 29900,
    total: 259900,
    issue_date: '2026-06-30',
    status: 'issued' as const
  },
  {
    id: 'invoice-2',
    code: 'FP202506280002',
    customer: '启明精密制造',
    order_code: 'SO202506280002',
    amount: 180000,
    tax_rate: 13,
    tax_amount: 23400,
    total: 203400,
    issue_date: '2026-06-28',
    status: 'issued' as const
  },
  {
    id: 'invoice-3',
    code: 'FP202506260003',
    customer: '鼎盛动力设备',
    order_code: '',
    amount: 80000,
    tax_rate: 13,
    tax_amount: 10400,
    total: 90400,
    issue_date: '',
    status: 'draft' as const
  }
]

export const receivables = [
  {
    id: 'receivable-1',
    code: 'YS202506300001',
    customer: '华东重工集团',
    amount: 259900,
    settled: 100000,
    balance: 159900,
    due_date: '2026-07-30',
    aging: 0
  },
  {
    id: 'receivable-2',
    code: 'YS202506280002',
    customer: '启明精密制造',
    amount: 203400,
    settled: 203400,
    balance: 0,
    due_date: '2026-07-28',
    aging: 0
  },
  {
    id: 'receivable-3',
    code: 'YS202505200003',
    customer: '鼎盛动力设备',
    amount: 90400,
    settled: 20000,
    balance: 70400,
    due_date: '2026-06-01',
    aging: 29
  }
]

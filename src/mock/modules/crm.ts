import Mock from 'mockjs'

export const customers = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /CUST\d{8}/,
      name: '@pick(["XX Heavy Industry Co., Ltd.","YY Machinery Equipment Co., Ltd.","ZZ Pump Technology Co., Ltd.","AA Precision Manufacturing Co., Ltd.","BB Power Equipment Factory","CC Valve Manufacturing Co., Ltd.","DD Hydraulic Components Co., Ltd.","EE Transmission Equipment Co., Ltd."])',
      contact_person: '@cname',
      contact_phone: /1[3-9]\d{9}/,
      payment_terms: '@pick(["Month End 30","Month End 60","Cash Before Delivery","Month End 45"])',
      'credit_limit|0-1000000': 1,
      'status|1': ['active', 'active', 'active', 'disabled']
    }
  ]
}).list

export const salesOrders = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /SO2025\d{6}/,
      customer_name: '@pick(["XX Heavy Industry","YY Machinery Equipment","ZZ Pump Technology","AA Precision Manufacturing"])',
      material_name: '@pick(["Pump XJP-100","Gearbox GBX-200","Drive Shaft DS-50","Valve Assembly VL-300"])',
      'qty|10-200': 1,
      'amount|50000-500000': 1,
      delivery_date: '@date("yyyy-MM-dd")',
      'status|1': ['approved', 'in_production', 'pending_delivery', 'completed']
    }
  ]
}).list

export const receivables = [
  { id: '1', code: 'AR202501150001', customer: 'XX Heavy Industry', amount: 230000, settled: 0, balance: 230000, due_date: '2025-03-15', aging: -45 },
  {
    id: '2',
    code: 'AR202501100002',
    customer: 'YY Machinery Equipment',
    amount: 180000,
    settled: 100000,
    balance: 80000,
    due_date: '2025-02-10',
    aging: 35
  },
  { id: '3', code: 'AR202501050003', customer: 'ZZ Pump Technology', amount: 50000, settled: 50000, balance: 0, due_date: '2025-01-20', aging: 0 },
  {
    id: '4',
    code: 'AR202412010004',
    customer: 'XX Heavy Industry',
    amount: 120000,
    settled: 60000,
    balance: 60000,
    due_date: '2024-12-30',
    aging: 75
  },
  {
    id: '5',
    code: 'AR202412200005',
    customer: 'AA Precision Manufacturing',
    amount: 85000,
    settled: 0,
    balance: 85000,
    due_date: '2025-01-05',
    aging: 95
  }
]

import Mock from 'mockjs'

export const customers = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /CUST\d{8}/,
      name: '@pick(["华工重机有限公司","远洋机械设备有限公司","智造泵业科技有限公司","精工制造有限公司","北方动力设备厂","诚创阀门制造有限公司","德润液压元件有限公司","易虎机电传动有限公司"])',
      contact_person: '@cname',
      contact_phone: /1[3-9]\d{9}/,
      payment_terms: '@pick(["月结30天","月结60天","款到发货","月结45天"])',
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
      customer_name: '@pick(["华工重机","远洋机械设备","智造泵业科技","精工制造"])',
      material_name: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","阀门总成 VL-300"])',
      'qty|10-200': 1,
      'amount|50000-500000': 1,
      delivery_date: '@date("yyyy-MM-dd")',
      'status|1': ['approved', 'in_production', 'pending_delivery', 'completed']
    }
  ]
}).list

export const receivables = [
  { id: '1', code: 'AR202501150001', customer: '华工重机', amount: 230000, settled: 0, balance: 230000, due_date: '2025-03-15', aging: -45 },
  {
    id: '2',
    code: 'AR202501100002',
    customer: '远洋机械设备',
    amount: 180000,
    settled: 100000,
    balance: 80000,
    due_date: '2025-02-10',
    aging: 35
  },
  { id: '3', code: 'AR202501050003', customer: '智造泵业科技', amount: 50000, settled: 50000, balance: 0, due_date: '2025-01-20', aging: 0 },
  {
    id: '4',
    code: 'AR202412010004',
    customer: '华工重机',
    amount: 120000,
    settled: 60000,
    balance: 60000,
    due_date: '2024-12-30',
    aging: 75
  },
  {
    id: '5',
    code: 'AR202412200005',
    customer: '精工制造',
    amount: 85000,
    settled: 0,
    balance: 85000,
    due_date: '2025-01-05',
    aging: 95
  }
]

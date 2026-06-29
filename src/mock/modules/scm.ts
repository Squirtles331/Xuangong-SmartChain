import Mock from 'mockjs'

export const suppliers = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /SUP\d{8}/,
      name: '@pick(["Steel Supplier A","Bearing Manufacturer B","Standard Parts C","Casting Supplier D","Seal Supplier E","Electrical Supplier F"])',
      contact: '@cname',
      phone: /1[3-9]\d{9}/,
      terms: '@pick(["Month End 30","Month End 60","Cash Before Delivery"])',
      'status|1': ['active', 'active', 'active', 'frozen'],
      'qualified|1': [true, true, true, false]
    }
  ]
}).list

export const purchaseOrders = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /PO2025\d{6}/,
      supplier: '@pick(["Steel Supplier A","Bearing Manufacturer B","Standard Parts C","Casting Supplier D"])',
      material: '@pick(["45# Round Steel D50","Bearing 6308","Bolt M16x60","Pump Body Casting","Wear Ring"])',
      'qty|100-2000': 1,
      'received|0-2000': 1,
      'remain|0-500': 1,
      delivery: '@date("yyyy-MM-dd")',
      'status|1': ['sent', 'sent', 'partial', 'received', 'closed']
    }
  ]
}).list

export const portalOrders = [
  { id: '1', code: 'PO202501150001', material: '45# Round Steel D50', qty: 500, delivery_date: '2025-01-20', status: 'pending' },
  { id: '2', code: 'PO202501100002', material: 'Bearing 6308', qty: 200, delivery_date: '2025-01-18', status: 'confirmed' }
]

export const portalDeliveries = [
  { id: '1', code: 'DN20250115001', material: '45# Round Steel D50', qty: 500, carrier: 'SF Express', tracking_no: 'SF1234567890' }
]

export const portalTimeline = [
  { timestamp: '2025-01-15 09:30', content: 'Order PO202501150001 created.', color: '#0bbd87', type: 'primary', hollow: false },
  { timestamp: '2025-01-15 10:15', content: 'Supplier confirmed the order and planned shipment.', color: '#0bbd87', type: 'success', hollow: false },
  { timestamp: '2025-01-18 14:00', content: 'Goods are ready and waiting for pickup.', color: '#0bbd87', type: 'primary', hollow: false },
  {
    timestamp: '2025-01-19 08:30',
    content: 'Carrier picked up shipment. Tracking No. SF1234567890',
    color: '#0bbd87',
    type: 'warning',
    hollow: false
  },
  { timestamp: '2025-01-20', content: 'Expected arrival and receipt.', color: '#909399', type: 'info', hollow: true }
]

export const portalReconciliation = [
  {
    period: '2025-01',
    order_code: 'PO202501150001',
    material: '45# Round Steel D50',
    order_qty: 500,
    delivered_qty: 500,
    accepted_qty: 480,
    amount: 2784,
    rec_status: 'pending'
  },
  {
    period: '2025-01',
    order_code: 'PO202501100002',
    material: 'Bearing 6308',
    order_qty: 200,
    delivered_qty: 200,
    accepted_qty: 200,
    amount: 17000,
    rec_status: 'confirmed'
  }
]

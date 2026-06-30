export const suppliers = [
  {
    id: '1',
    code: 'SUP20250001',
    name: '苏州精工钢材有限公司',
    contact: '张建国',
    phone: '13812345678',
    terms: '月结30天',
    status: 'active',
    qualified: true
  },
  {
    id: '2',
    code: 'SUP20250002',
    name: '常州轴承制造厂',
    contact: '李国强',
    phone: '13912345679',
    terms: '月结60天',
    status: 'active',
    qualified: true
  },
  {
    id: '3',
    code: 'SUP20250003',
    name: '无锡标准件有限公司',
    contact: '王秀兰',
    phone: '13712345670',
    terms: '款到发货',
    status: 'active',
    qualified: true
  },
  {
    id: '4',
    code: 'SUP20250004',
    name: '南通铸造供应商',
    contact: '赵德海',
    phone: '13612345671',
    terms: '月结30天',
    status: 'frozen',
    qualified: false
  }
]

export const purchaseOrders = [
  {
    id: '1',
    code: 'PO202501150001',
    supplier: '苏州精工钢材有限公司',
    material: '45号圆钢 D50',
    qty: 500,
    received: 200,
    remain: 300,
    delivery: '2025-01-20',
    status: 'partial'
  },
  {
    id: '2',
    code: 'PO202501140002',
    supplier: '常州轴承制造厂',
    material: '轴承 6308',
    qty: 200,
    received: 0,
    remain: 200,
    delivery: '2025-01-18',
    status: 'sent'
  },
  {
    id: '3',
    code: 'PO202501130003',
    supplier: '无锡标准件有限公司',
    material: '螺栓 M16x60',
    qty: 1200,
    received: 1200,
    remain: 0,
    delivery: '2025-01-16',
    status: 'received'
  },
  {
    id: '4',
    code: 'PO202501120004',
    supplier: '南通铸造供应商',
    material: '泵体铸件',
    qty: 150,
    received: 0,
    remain: 150,
    delivery: '2025-01-14',
    status: 'closed'
  }
]

export const priceRecords = [
  {
    id: '1',
    material: '45号圆钢 D50',
    supplier: '苏州精工钢材有限公司',
    price: 5.8,
    currency: '元',
    valid_from: '2025-01-01',
    valid_to: '2025-06-30',
    source: '年度合同'
  },
  {
    id: '2',
    material: '45号圆钢 D50',
    supplier: '南通钢材贸易公司',
    price: 6.1,
    currency: '元',
    valid_from: '2025-01-01',
    valid_to: '2025-03-31',
    source: '报价单'
  },
  {
    id: '3',
    material: '轴承 6308',
    supplier: '常州轴承制造厂',
    price: 85,
    currency: '元',
    valid_from: '2025-01-01',
    valid_to: '2025-12-31',
    source: '年度合同'
  },
  {
    id: '4',
    material: '螺栓 M16x60',
    supplier: '无锡标准件有限公司',
    price: 2.4,
    currency: '元',
    valid_from: '2024-07-01',
    valid_to: '2025-06-30',
    source: '比价结果'
  },
  {
    id: '5',
    material: '泵体铸件',
    supplier: '南通铸造供应商',
    price: 168,
    currency: '元',
    valid_from: '2025-02-01',
    valid_to: '2025-08-31',
    source: '报价单'
  }
]

export const purchaseRequests = [
  {
    id: '1',
    code: 'PR202501150001',
    dept: '生产部',
    reason: '生产需求',
    need_date: '2025-01-20',
    status: 'draft',
    source: 'manual',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'PR202501150002',
    dept: '生产部',
    reason: '安全库存补货',
    need_date: '2025-01-22',
    status: 'approved',
    source: 'mrp',
    created_at: '2025-01-15'
  },
  {
    id: '3',
    code: 'PR202501100003',
    dept: '设备部',
    reason: '设备维修',
    need_date: '2025-01-18',
    status: 'ordered',
    source: 'manual',
    created_at: '2025-01-10'
  },
  {
    id: '4',
    code: 'PR202501080004',
    dept: '研发部',
    reason: '研发试制',
    need_date: '2025-01-25',
    status: 'rejected',
    source: 'manual',
    created_at: '2025-01-08'
  }
]

export const purchaseReturns = [
  {
    id: '1',
    code: 'PRT20250115001',
    po_code: 'PO202501140002',
    supplier: '常州轴承制造厂',
    material: '轴承 6308',
    qty: 20,
    reason: '尺寸超差',
    status: 'pending'
  },
  {
    id: '2',
    code: 'PRT20250110002',
    po_code: 'PO202501150001',
    supplier: '苏州精工钢材有限公司',
    material: '45号圆钢 D50',
    qty: 100,
    reason: '材质不合格',
    status: 'done'
  },
  {
    id: '3',
    code: 'PRT20250108003',
    po_code: 'PO202501120004',
    supplier: '南通铸造供应商',
    material: '泵体铸件',
    qty: 10,
    reason: '外观缺陷',
    status: 'pending'
  }
]

export const portalOrders = [
  { id: '1', code: 'PO202501150001', material: '45号圆钢 D50', qty: 500, delivery_date: '2025-01-20', status: 'pending' },
  { id: '2', code: 'PO202501100002', material: '轴承 6308', qty: 200, delivery_date: '2025-01-18', status: 'confirmed' },
  { id: '3', code: 'PO202501080003', material: '螺栓 M16x60', qty: 1500, delivery_date: '2025-01-21', status: 'rejected' }
]

export const portalDeliveries = [
  {
    id: '1',
    code: 'FH20250115001',
    material: '45号圆钢 D50',
    qty: 500,
    carrier: '顺丰物流',
    tracking_no: 'SF1234567890',
    confirmed: false
  },
  {
    id: '2',
    code: 'FH20250113002',
    material: '轴承 6308',
    qty: 200,
    carrier: '德邦快运',
    tracking_no: 'DB9876543210',
    confirmed: true
  }
]

export const portalTimeline = [
  { timestamp: '2025-01-15 09:30', content: '订单 PO202501150001 已创建', color: '#0bbd87', type: 'primary', hollow: false },
  { timestamp: '2025-01-15 10:15', content: '供应商已确认订单并计划发货', color: '#0bbd87', type: 'success', hollow: false },
  { timestamp: '2025-01-18 14:00', content: '货物已备齐，等待提货', color: '#0bbd87', type: 'primary', hollow: false },
  { timestamp: '2025-01-19 08:30', content: '承运商已揽件，运单号 SF1234567890', color: '#e6a23c', type: 'warning', hollow: false },
  { timestamp: '2025-01-20 18:00', content: '预计到货并完成收货', color: '#909399', type: 'info', hollow: true }
]

export const portalReconciliation = [
  {
    period: '2025-01',
    order_code: 'PO202501150001',
    material: '45号圆钢 D50',
    order_qty: 500,
    delivered_qty: 500,
    accepted_qty: 480,
    amount: 2784,
    rec_status: 'pending'
  },
  {
    period: '2025-01',
    order_code: 'PO202501100002',
    material: '轴承 6308',
    order_qty: 200,
    delivered_qty: 200,
    accepted_qty: 200,
    amount: 17000,
    rec_status: 'confirmed'
  }
]

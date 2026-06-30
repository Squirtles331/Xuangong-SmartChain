export const inventory = [
  {
    id: '1',
    code: '01.01.001-00001',
    name: '45#圆钢',
    spec: 'D50',
    warehouse: '原材料仓',
    location: 'A-01-01',
    lot: 'L20250001',
    qty: 320,
    reserved: 60,
    available: 260,
    safety: 80,
    unit: '千克'
  },
  {
    id: '2',
    code: '02.04.001-00001',
    name: '轴承 6308',
    spec: 'SKF',
    warehouse: '标准件仓',
    location: 'C-01-01',
    lot: 'L20250002',
    qty: 180,
    reserved: 30,
    available: 150,
    safety: 60,
    unit: '件'
  },
  {
    id: '3',
    code: '02.02.001-00001',
    name: '螺栓 M16x60',
    spec: '8.8级',
    warehouse: '标准件仓',
    location: 'C-02-03',
    lot: 'L20250003',
    qty: 980,
    reserved: 120,
    available: 860,
    safety: 200,
    unit: '件'
  },
  {
    id: '4',
    code: '04.01.001-00001',
    name: '离心泵 XJP-100',
    spec: '流量 100m3/h',
    warehouse: '成品仓',
    location: 'F-01-01',
    lot: 'L20250004',
    qty: 18,
    reserved: 6,
    available: 12,
    safety: 10,
    unit: '台'
  },
  {
    id: '5',
    code: '01.01.002-00001',
    name: '泵体铸件',
    spec: 'HT200',
    warehouse: '原材料仓',
    location: 'B-01-02',
    lot: 'L20250005',
    qty: 75,
    reserved: 10,
    available: 65,
    safety: 50,
    unit: '件'
  },
  {
    id: '6',
    code: '01.01.003-00001',
    name: '叶轮 304 不锈钢',
    spec: 'D200',
    warehouse: '半成品仓',
    location: 'D-01-01',
    lot: 'L20250006',
    qty: 42,
    reserved: 8,
    available: 34,
    safety: 40,
    unit: '件'
  },
  {
    id: '7',
    code: '01.01.004-00001',
    name: '泵轴 45#',
    spec: 'D50x500',
    warehouse: '半成品仓',
    location: 'D-02-01',
    lot: 'L20250007',
    qty: 28,
    reserved: 6,
    available: 22,
    safety: 30,
    unit: '件'
  },
  {
    id: '8',
    code: '02.01.002-00001',
    name: '机械密封 M37G-55',
    spec: 'D55',
    warehouse: '标准件仓',
    location: 'C-03-02',
    lot: 'L20250008',
    qty: 96,
    reserved: 18,
    available: 78,
    safety: 50,
    unit: '件'
  }
]

export const wmsMaterials = [
  { id: '1', code: '04.01.001-00001', name: '离心泵 XJP-100', spec: 'DN100', unit: '台', stock: 125, safety: 20, location: 'A-01-01' },
  { id: '2', code: '04.01.001-00002', name: '离心泵 XJP-150', spec: 'DN150', unit: '台', stock: 68, safety: 15, location: 'A-01-02' },
  { id: '3', code: '04.02.001-00001', name: '齿轮泵 CBP-50', spec: 'DN50', unit: '台', stock: 42, safety: 10, location: 'A-02-01' },
  { id: '4', code: '01.01.001-00001', name: '泵体 HT200', spec: 'DN100', unit: '件', stock: 350, safety: 50, location: 'B-01-01' },
  { id: '5', code: '01.01.002-00001', name: '叶轮 304 不锈钢', spec: 'D200', unit: '件', stock: 180, safety: 30, location: 'B-01-02' },
  { id: '6', code: '01.01.003-00001', name: '泵轴 45#', spec: 'D50x500', unit: '件', stock: 95, safety: 20, location: 'B-02-01' },
  { id: '7', code: '02.01.001-00001', name: '轴承 6205', spec: '25x52x15', unit: '件', stock: 520, safety: 100, location: 'C-01-01' },
  { id: '8', code: '02.01.002-00001', name: '机械密封 M37G-55', spec: 'D55', unit: '件', stock: 230, safety: 40, location: 'C-01-02' },
  { id: '9', code: '03.01.001-00001', name: '碳钢法兰 DN100', spec: 'PN16', unit: '件', stock: 680, safety: 80, location: 'D-01-01' },
  { id: '10', code: '03.01.002-00001', name: '螺栓 M16x80', spec: '304 不锈钢', unit: '件', stock: 1200, safety: 200, location: 'D-02-01' }
]

export const receiptOrders = [
  {
    id: '1',
    code: 'RK20250115001',
    type: 'purchase',
    material: '泵体铸件',
    qty: 80,
    warehouse: '原材料仓',
    supplier: '苏州铸造厂',
    status: 'pending',
    created_at: '2025-01-15 09:20:00'
  },
  {
    id: '2',
    code: 'RK20250114002',
    type: 'production',
    material: '离心泵 XJP-100',
    qty: 12,
    warehouse: '成品仓',
    supplier: '一号工厂总装车间',
    status: 'completed',
    created_at: '2025-01-14 16:30:00'
  },
  {
    id: '3',
    code: 'RK20250113003',
    type: 'purchase',
    material: '轴承 6205',
    qty: 260,
    warehouse: '标准件仓',
    supplier: '常州轴承供应商',
    status: 'completed',
    created_at: '2025-01-13 11:00:00'
  }
]

export const deliveryOrders = [
  {
    id: '1',
    code: 'CK20250115001',
    order_code: 'SO20250112001',
    customer: '江苏华工设备有限公司',
    material: '离心泵 XJP-100',
    qty: 8,
    status: 'pending',
    created_at: '2025-01-15 13:20:00'
  },
  {
    id: '2',
    code: 'CK20250114002',
    order_code: 'SO20250111003',
    customer: '上海宏远机械厂',
    material: '齿轮泵 CBP-50',
    qty: 5,
    status: 'completed',
    created_at: '2025-01-14 09:40:00'
  },
  {
    id: '3',
    code: 'CK20250113003',
    order_code: 'SO20250110006',
    customer: '无锡精工自动化有限公司',
    material: '离心泵 XJP-150',
    qty: 6,
    status: 'completed',
    created_at: '2025-01-13 15:10:00'
  }
]

export const pickingOrders = [
  {
    id: '1',
    wo_code: 'WO202501150001',
    material: '离心泵 XJP-100',
    warehouse: '原材料仓',
    status: 'pending',
    created_at: '2025-01-15 08:30:00'
  },
  {
    id: '2',
    wo_code: 'WO202501150002',
    material: '齿轮箱 GBX-200',
    warehouse: '标准件仓',
    status: 'picked',
    created_at: '2025-01-14 10:10:00'
  },
  {
    id: '3',
    wo_code: 'WO202501140003',
    material: '离心泵 XJP-200',
    warehouse: '半成品仓',
    status: 'completed',
    created_at: '2025-01-13 14:00:00'
  }
]

export const transferOrders = [
  {
    id: '1',
    code: 'DB20250115001',
    material: '泵体铸件',
    qty: 20,
    from_wh: '原材料仓',
    to_wh: '机加一车间线边仓',
    status: 'pending',
    out_time: ''
  },
  {
    id: '2',
    code: 'DB20250114002',
    material: '轴承 6205',
    qty: 60,
    from_wh: '标准件仓',
    to_wh: '装配车间线边仓',
    status: 'transit',
    out_time: '2025-01-14 08:00'
  },
  {
    id: '3',
    code: 'DB20250113003',
    material: '离心泵 XJP-100',
    qty: 6,
    from_wh: '成品仓',
    to_wh: '发货暂存区',
    status: 'completed',
    out_time: '2025-01-13 09:00'
  }
]

export const returnOrders = [
  {
    id: '1',
    code: 'TH20250115001',
    type: 'return',
    source: 'WO202501150001',
    material: '叶轮 304 不锈钢',
    qty: 2,
    reason: '多余退料',
    status: 'pending'
  },
  {
    id: '2',
    code: 'TH20250114002',
    type: 'refund',
    source: 'PO20250110008',
    material: '轴承 6205',
    qty: 10,
    reason: '来料外观不良',
    status: 'completed'
  }
]

export const barcodeScanRecords = [
  {
    id: '1',
    barcode: 'BC202501150001',
    material_code: '01.01.001-00001',
    material_name: '45#圆钢',
    qty: 50,
    location: 'A-01-01',
    type: '入库',
    operator: '张三',
    time: '2025-01-15 08:20:00'
  },
  {
    id: '2',
    barcode: 'BC202501150002',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    qty: 6,
    location: 'F-01-01',
    type: '出库',
    operator: '李四',
    time: '2025-01-15 10:05:00'
  },
  {
    id: '3',
    barcode: 'BC202501140003',
    material_code: '02.01.002-00001',
    material_name: '机械密封 M37G-55',
    qty: 20,
    location: 'C-03-02',
    type: '入库',
    operator: '王五',
    time: '2025-01-14 16:40:00'
  }
]

export const backflushOrders = [
  {
    id: '1',
    material: '泵体铸件',
    wo_code: 'WO202501150001',
    bom_qty: 50,
    actual_qty: 52,
    diff: 2,
    status: 'pending',
    backflush_date: '2025-01-15'
  },
  {
    id: '2',
    material: '叶轮 304 不锈钢',
    wo_code: 'WO202501150001',
    bom_qty: 50,
    actual_qty: 49,
    diff: -1,
    status: 'completed',
    backflush_date: '2025-01-14'
  },
  {
    id: '3',
    material: '轴承 6205',
    wo_code: 'WO202501150002',
    bom_qty: 100,
    actual_qty: 100,
    diff: 0,
    status: 'completed',
    backflush_date: '2025-01-13'
  }
]

export const stockCountExec = [
  {
    id: '1',
    plan_code: 'PD202501001',
    warehouse: '原材料仓',
    location: 'B-01-01',
    material: '泵体 HT200',
    book_qty: 350,
    actual_qty: 348,
    diff: -2,
    status: 'completed',
    type: 'full',
    plan_date: '2025-01-15',
    executor: '张三'
  },
  {
    id: '2',
    plan_code: 'PD202501001',
    warehouse: '原材料仓',
    location: 'B-01-02',
    material: '叶轮 304 不锈钢',
    book_qty: 180,
    actual_qty: 182,
    diff: 2,
    status: 'completed',
    type: 'full',
    plan_date: '2025-01-15',
    executor: '张三'
  },
  {
    id: '3',
    plan_code: 'PD202501002',
    warehouse: '标准件仓',
    location: 'C-01-01',
    material: '轴承 6205',
    book_qty: 520,
    actual_qty: 515,
    diff: -5,
    status: 'counting',
    type: 'cycle',
    plan_date: '2025-01-18',
    executor: '李四'
  },
  {
    id: '4',
    plan_code: 'PD202501002',
    warehouse: '标准件仓',
    location: 'C-01-02',
    material: '机械密封 M37G-55',
    book_qty: 230,
    actual_qty: 228,
    diff: -2,
    status: 'counting',
    type: 'cycle',
    plan_date: '2025-01-18',
    executor: '李四'
  },
  {
    id: '5',
    plan_code: 'PD202501003',
    warehouse: '成品仓',
    location: 'F-01-01',
    material: '离心泵 XJP-100',
    book_qty: 18,
    actual_qty: 18,
    diff: 0,
    status: 'pending',
    type: 'full',
    plan_date: '2025-01-22',
    executor: '王五'
  }
]

export const stockCountDiff = [
  {
    id: '1',
    plan_code: 'PD202501001',
    material: '泵体 HT200',
    book_qty: 350,
    actual_qty: 348,
    diff: -2,
    diff_rate: '-0.57%',
    reason: '生产领料未及时过账',
    handler: '张三'
  },
  {
    id: '2',
    plan_code: 'PD202501001',
    material: '叶轮 304 不锈钢',
    book_qty: 180,
    actual_qty: 182,
    diff: 2,
    diff_rate: '1.11%',
    reason: '供应商超额交付',
    handler: '李四'
  },
  {
    id: '3',
    plan_code: 'PD202501002',
    material: '轴承 6205',
    book_qty: 520,
    actual_qty: 515,
    diff: -5,
    diff_rate: '-0.96%',
    reason: '装配领用未过账',
    handler: '王五'
  },
  {
    id: '4',
    plan_code: 'PD202501002',
    material: '机械密封 M37G-55',
    book_qty: 230,
    actual_qty: 228,
    diff: -2,
    diff_rate: '-0.87%',
    reason: '质量抽样已消耗',
    handler: '赵六'
  }
]

export const iotDevices = [
  { id: '1', name: '数控车床 CK6150', type: 'CNC', status: 'running', temp: 42.5, rpm: 1850, power: 7.8, uptime: '128h' },
  { id: '2', name: '钻床 Z3050', type: 'drill', status: 'running', temp: 35.2, rpm: 1200, power: 3.5, uptime: '96h' },
  { id: '3', name: '磨床 M1432', type: 'grind', status: 'idle', temp: 28.1, rpm: 0, power: 0.2, uptime: '72h' },
  { id: '4', name: '加工中心 VMC850', type: 'CNC', status: 'running', temp: 45.8, rpm: 2200, power: 12.5, uptime: '156h' },
  { id: '5', name: '注塑机 HTF380', type: 'injection', status: 'maintenance', temp: 22, rpm: 0, power: 0, uptime: '0h' }
]

export const iotAlertHistory = [
  {
    id: '1',
    device: '数控车床 CK6150',
    metric: 'temp',
    value: 48.5,
    threshold: 45,
    level: 'warning',
    trigger_time: '2025-01-15 14:30',
    recover_time: '2025-01-15 15:00'
  },
  {
    id: '2',
    device: '加工中心 VMC850',
    metric: 'temp',
    value: 52.1,
    threshold: 50,
    level: 'danger',
    trigger_time: '2025-01-18 09:15',
    recover_time: '2025-01-18 10:30'
  },
  {
    id: '3',
    device: '钻床 Z3050',
    metric: 'vibration',
    value: 8.2,
    threshold: 7.5,
    level: 'warning',
    trigger_time: '2025-01-20 16:45',
    recover_time: '2025-01-20 17:30'
  },
  {
    id: '4',
    device: '磨床 M1432',
    metric: 'temp',
    value: 46.8,
    threshold: 45,
    level: 'warning',
    trigger_time: '2025-01-22 11:00',
    recover_time: '2025-01-22 11:45'
  }
]

export const iotAlertRules = [
  { id: 'rule-1', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' },
  { id: 'rule-2', device: '数控车床 CK6150', metric: 'vibration', operator: '>', threshold: 4, level: 'critical', status: 'active' },
  { id: 'rule-3', device: '加工中心 VMC850', metric: 'current', operator: '>', threshold: 20, level: 'warning', status: 'disabled' }
]

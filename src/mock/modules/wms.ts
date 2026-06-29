// 仓储管理 Mock 数据
export const wmsMaterials = [
  { id: '1', code: '04.01.001-00001', name: '离心泵 XJP-100', spec: 'DN100', unit: '台', stock: 125, safety: 20, location: 'A-01-01' },
  { id: '2', code: '04.01.001-00002', name: '离心泵 XJP-150', spec: 'DN150', unit: '台', stock: 68, safety: 15, location: 'A-01-02' },
  { id: '3', code: '04.02.001-00001', name: '齿轮泵 CBP-50', spec: 'DN50', unit: '台', stock: 42, safety: 10, location: 'A-02-01' },
  { id: '4', code: '01.01.001-00001', name: '泵体铸件 HT200', spec: 'DN100', unit: '件', stock: 350, safety: 50, location: 'B-01-01' },
  { id: '5', code: '01.01.002-00001', name: '叶轮锻件 304SS', spec: 'φ200', unit: '件', stock: 180, safety: 30, location: 'B-01-02' },
  { id: '6', code: '01.01.003-00001', name: '泵轴 45#钢', spec: 'φ50×500', unit: '件', stock: 95, safety: 20, location: 'B-02-01' },
  { id: '7', code: '02.01.001-00001', name: '深沟球轴承 6205', spec: '25×52×15', unit: '套', stock: 520, safety: 100, location: 'C-01-01' },
  { id: '8', code: '02.01.002-00001', name: '机械密封 M37G-55', spec: 'φ55', unit: '套', stock: 230, safety: 40, location: 'C-01-02' },
  { id: '9', code: '03.01.001-00001', name: '碳钢法兰 DN100', spec: 'PN16', unit: '件', stock: 680, safety: 80, location: 'D-01-01' },
  { id: '10', code: '03.01.002-00001', name: '不锈钢螺栓 M16×80', spec: '304SS', unit: '套', stock: 1200, safety: 200, location: 'D-02-01' }
]

export const stockCountExec = [
  {
    id: '1',
    plan_code: 'PD-2025-001',
    warehouse: '原材料仓',
    location: 'B-01-01',
    material: '泵体铸件 HT200',
    book_qty: 350,
    actual_qty: 348,
    diff: -2,
    status: 'done'
  },
  {
    id: '2',
    plan_code: 'PD-2025-001',
    warehouse: '原材料仓',
    location: 'B-01-02',
    material: '叶轮锻件 304SS',
    book_qty: 180,
    actual_qty: 182,
    diff: 2,
    status: 'done'
  },
  {
    id: '3',
    plan_code: 'PD-2025-001',
    warehouse: '原材料仓',
    location: 'B-02-01',
    material: '泵轴 45#钢',
    book_qty: 95,
    actual_qty: 95,
    diff: 0,
    status: 'done'
  },
  {
    id: '4',
    plan_code: 'PD-2025-002',
    warehouse: '标准件仓',
    location: 'C-01-01',
    material: '深沟球轴承 6205',
    book_qty: 520,
    actual_qty: 515,
    diff: -5,
    status: 'done'
  },
  {
    id: '5',
    plan_code: 'PD-2025-002',
    warehouse: '标准件仓',
    location: 'C-01-02',
    material: '机械密封 M37G-55',
    book_qty: 230,
    actual_qty: 228,
    diff: -2,
    status: 'done'
  }
]

export const stockCountDiff = [
  {
    id: '1',
    plan_code: 'PD-2025-001',
    material: '泵体铸件 HT200',
    book_qty: 350,
    actual_qty: 348,
    diff: -2,
    diff_rate: '-0.57%',
    reason: '生产损耗',
    handler: '张建国'
  },
  {
    id: '2',
    plan_code: 'PD-2025-001',
    material: '叶轮锻件 304SS',
    book_qty: 180,
    actual_qty: 182,
    diff: 2,
    diff_rate: '1.11%',
    reason: '供应商多发货',
    handler: '李伟强'
  },
  {
    id: '3',
    plan_code: 'PD-2025-002',
    material: '深沟球轴承 6205',
    book_qty: 520,
    actual_qty: 515,
    diff: -5,
    diff_rate: '-0.96%',
    reason: '装配损耗未登记',
    handler: '王大明'
  },
  {
    id: '4',
    plan_code: 'PD-2025-002',
    material: '机械密封 M37G-55',
    book_qty: 230,
    actual_qty: 228,
    diff: -2,
    diff_rate: '-0.87%',
    reason: '质检抽样消耗',
    handler: '刘志强'
  }
]

export const iotDevices = [
  { id: '1', name: '数控车床 CK6150', type: 'CNC', status: 'running', temp: 42.5, rpm: 1850, power: 7.8, uptime: '128h' },
  { id: '2', name: '钻床 Z3050', type: 'drill', status: 'running', temp: 35.2, rpm: 1200, power: 3.5, uptime: '96h' },
  { id: '3', name: '磨床 M1432', type: 'grind', status: 'idle', temp: 28.1, rpm: 0, power: 0.2, uptime: '72h' },
  { id: '4', name: '加工中心 VMC850', type: 'CNC', status: 'running', temp: 45.8, rpm: 2200, power: 12.5, uptime: '156h' },
  { id: '5', name: '注塑机 HTF380', type: 'injection', status: 'maintenance', temp: 22.0, rpm: 0, power: 0, uptime: '0h' }
]

export const iotAlertHistory = [
  {
    id: '1',
    device: '数控车床 CK6150',
    metric: '主轴温度',
    value: 48.5,
    threshold: 45,
    level: 'warning',
    trigger_time: '2025-01-15 14:30',
    recover_time: '2025-01-15 15:00'
  },
  {
    id: '2',
    device: '加工中心 VMC850',
    metric: '主轴温度',
    value: 52.1,
    threshold: 50,
    level: 'danger',
    trigger_time: '2025-01-18 09:15',
    recover_time: '2025-01-18 10:30'
  },
  {
    id: '3',
    device: '钻床 Z3050',
    metric: '振动',
    value: 8.2,
    threshold: 7.5,
    level: 'warning',
    trigger_time: '2025-01-20 16:45',
    recover_time: '2025-01-20 17:30'
  },
  {
    id: '4',
    device: '磨床 M1432',
    metric: '主轴温度',
    value: 46.8,
    threshold: 45,
    level: 'warning',
    trigger_time: '2025-01-22 11:00',
    recover_time: '2025-01-22 11:45'
  }
]

/**
 * 营销中心 + 采购仓储质检 Mock 数据
 */
import Mock from 'mockjs'

// ==================== 客户 ====================
export const customers = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /CUST\d{8}/,
      name: '@pick(["XX重工集团有限公司","YY机械设备有限公司","ZZ泵业科技有限公司","AA精密制造有限公司","BB动力设备厂","CC阀门制造有限公司","DD液压件有限公司","EE传动设备有限公司"])',
      contact_person: '@cname',
      contact_phone: /1[3-9]\d{9}/,
      payment_terms: '@pick(["月结30天","月结60天","款到发货","月结45天"])',
      'credit_limit|0-1000000': 1,
      'status|1': ['active', 'active', 'active', 'disabled']
    }
  ]
}).list

// ==================== 销售订单 ====================
export const salesOrders = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /SO2025\d{6}/,
      customer_name: '@pick(["XX重工集团","YY机械设备","ZZ泵业科技","AA精密制造"])',
      material_name: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","阀门组件 VL-300"])',
      'qty|10-200': 1,
      'amount|50000-500000': 1,
      delivery_date: '@date("yyyy-MM-dd")',
      'status|1': ['approved', 'in_production', 'pending_delivery', 'completed']
    }
  ]
}).list

// ==================== 应收台账 ====================
export const receivables = [
  { id: '1', code: 'AR202501150001', customer: 'XX重工集团', amount: 230000, settled: 0, balance: 230000, due_date: '2025-03-15', aging: -45 },
  { id: '2', code: 'AR202501100002', customer: 'YY机械设备', amount: 180000, settled: 100000, balance: 80000, due_date: '2025-02-10', aging: 35 },
  { id: '3', code: 'AR202501050003', customer: 'ZZ泵业科技', amount: 50000, settled: 50000, balance: 0, due_date: '2025-01-20', aging: 0 },
  { id: '4', code: 'AR202412010004', customer: 'XX重工集团', amount: 120000, settled: 60000, balance: 60000, due_date: '2024-12-30', aging: 75 },
  { id: '5', code: 'AR202412200005', customer: 'AA精密制造', amount: 85000, settled: 0, balance: 85000, due_date: '2025-01-05', aging: 95 }
]

// ==================== 供应商 ====================
export const suppliers = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /SUP\d{8}/,
      name: '@pick(["XX钢材有限公司","YY轴承制造厂","ZZ标准件有限公司","AA铸件有限公司","BB密封件厂","CC电气有限公司"])',
      contact: '@cname',
      phone: /1[3-9]\d{9}/,
      terms: '@pick(["月结30天","月结60天","款到发货"])',
      'status|1': ['active', 'active', 'active', 'frozen'],
      'qualified|1': [true, true, true, false]
    }
  ]
}).list

// ==================== 采购订单 ====================
export const purchaseOrders = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      code: /PO2025\d{6}/,
      supplier: '@pick(["XX钢材有限公司","YY轴承制造厂","ZZ标准件有限公司","AA铸件有限公司"])',
      material: '@pick(["45#圆钢 φ50","轴承 6308","螺栓 M16×60","泵体铸件","耐磨环"])',
      'qty|100-2000': 1,
      'received|0-2000': 1,
      'remain|0-500': 1,
      delivery: '@date("yyyy-MM-dd")',
      'status|1': ['sent', 'sent', 'partial', 'received', 'closed']
    }
  ]
}).list

// ==================== 库存 ====================
export const inventory = Mock.mock({
  'list|10': [
    {
      'id|+1': 1,
      code: '@pick(["01.01.001-00001","02.04.001-00001","02.02.001-00001","04.01.001-00001","01.01.002-00001"])',
      name: '@pick(["45#圆钢","轴承 6308","螺栓 M16×60","离心泵 XJP-100","泵体铸件","耐磨环"])',
      spec: '@pick(["φ50","SKF","M16×60","流量100m³/h",""])',
      warehouse: '@pick(["原材料仓","原材料仓","成品仓","备件仓"])',
      location: '@pick(["A-01-01","B-02-03","C-01-01","A-02-01"])',
      lot: /L2025\d{4}/,
      'qty|10-500': 1,
      'reserved|0-200': 1,
      'available|0-300': 1,
      'safety|10-100': 1,
      unit: '@pick(["kg","个","台","根"])'
    }
  ]
}).list

// ==================== 质检任务 ====================
export const inspectionTasks = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /(IQC|IPQC|FQC)-2025\d{5}/,
      'type|1': ['来料检验', '过程检验', '最终检验'],
      material: '@pick(["45#圆钢 φ50","离心泵 XJP-100","轴承 6308","齿轮箱 GBX-200"])',
      lot: '@pick(["L20250101","WO202501150001","L20241215"])',
      'qty|10-500': 1,
      'status|1': ['pending', 'pending', 'done']
    }
  ]
}).list

// ==================== 质检模板 ====================
export const qcTemplates = [
  { id: '1', name: '钢材来料检验标准', category: '原材料', items: 8 },
  { id: '2', name: '泵类成品检验标准', category: '成品', items: 12 },
  { id: '3', name: '轴承来料检验标准', category: '外购件', items: 6 }
]

// ==================== MDM 组织树 ====================
export const orgTree = [
  {
    id: '1',
    name: 'XX集团有限公司',
    type: 'group',
    children: [
      {
        id: '2',
        name: 'XX重工有限公司',
        type: 'company',
        children: [
          {
            id: '3',
            name: '一工厂',
            type: 'plant',
            children: [
              {
                id: '4',
                name: '机加工一车间',
                type: 'workshop',
                children: [
                  { id: '41', name: '产线A', type: 'line' },
                  { id: '42', name: '产线B', type: 'line' }
                ]
              },
              { id: '5', name: '机加工二车间', type: 'workshop' },
              { id: '6', name: '装配车间', type: 'workshop' }
            ]
          }
        ]
      }
    ]
  }
]

// ==================== MDM 物料 ====================
export const materialTree = [
  {
    id: '1',
    name: '原材料',
    children: [
      {
        id: '11',
        name: '钢材',
        children: [
          { id: '111', name: '圆钢' },
          { id: '112', name: '板材' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '外购件',
    children: [
      { id: '21', name: '轴承' },
      { id: '22', name: '紧固件' },
      { id: '23', name: '密封件' }
    ]
  },
  { id: '3', name: '自制半成品' },
  { id: '4', name: '成品' },
  { id: '5', name: '辅料' },
  { id: '6', name: '包材' }
]

export const materialList = Mock.mock({
  'list|12': [
    {
      'id|+1': 1,
      code: /(01|02|03|04)\.\d{2}\.\d{3}-\d{5}/,
      name: '@pick(["45#圆钢","轴承 6308","螺栓 M16×60","离心泵 XJP-100","传动轴 DS-50","泵体铸件","耐磨环","键 8×7×30","叶轮铸件","轴承架","润滑油 Shell Tellus 46","阀门组件 VL-300"])',
      spec: '@pick(["φ50","SKF","M16×60","流量100m³/h","φ50×500","","","","","","","DN300"])',
      'type|1': ['purchased', 'purchased', 'manufactured', 'manufactured', 'outsourced'],
      unit: '@pick(["kg","个","台","根","L"])'
    }
  ]
}).list

// ==================== MDM 制造资源 ====================
export const equipments = [
  { id: '1', code: 'EQ0000000001', name: '数控车床', model: 'CK6150', workshop: '机加工一车间', status: 'running' },
  { id: '2', code: 'EQ0000000002', name: '数控车床', model: 'CK6150', workshop: '机加工一车间', status: 'idle' },
  { id: '3', code: 'EQ0000000003', name: '钻床', model: 'Z3050', workshop: '机加工一车间', status: 'running' },
  { id: '4', code: 'EQ0000000004', name: '磨床', model: 'M1432', workshop: '机加工一车间', status: 'repair' },
  { id: '5', code: 'EQ0000000005', name: '加工中心', model: 'VMC850', workshop: '机加工二车间', status: 'running' }
]

export const workCenters = [
  { id: '1', code: 'WC00000001', name: '数控车组', workshop: '机加工一车间', capacity: '16h/天', cost: '150元/h' },
  { id: '2', code: 'WC00000002', name: '钻床组', workshop: '机加工一车间', capacity: '8h/天', cost: '80元/h' },
  { id: '3', code: 'WC00000003', name: '磨床组', workshop: '机加工一车间', capacity: '8h/天', cost: '120元/h' },
  { id: '4', code: 'WC00000004', name: '装配组', workshop: '装配车间', capacity: '8h/天', cost: '100元/h' }
]

export const molds = [
  { id: '1', code: 'MD0000000001', name: '泵体铸造模具', type: '铸模', life: '10000模次', used: '3500' },
  { id: '2', code: 'MD0000000002', name: '叶轮锻模', type: '锻模', life: '5000模次', used: '1200' }
]

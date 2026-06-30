import Mock from 'mockjs'

export const orgTree = [
  {
    id: '1',
    name: '玄工智链集团',
    code: 'ORG-GROUP-001',
    type: 'group',
    children: [
      {
        id: '2',
        name: '玄工重工有限公司',
        code: 'ORG-COMP-001',
        type: 'company',
        children: [
          {
            id: '3',
            name: '一号工厂',
            code: 'ORG-PLANT-001',
            type: 'plant',
            children: [
              {
                id: '4',
                name: '机加工一车间',
                code: 'ORG-WS-001',
                type: 'workshop',
                children: [
                  { id: '41', name: '产线 A', code: 'ORG-LINE-001', type: 'line' },
                  { id: '42', name: '产线 B', code: 'ORG-LINE-002', type: 'line' }
                ]
              },
              { id: '5', name: '机加工二车间', code: 'ORG-WS-002', type: 'workshop' },
              { id: '6', name: '装配车间', code: 'ORG-WS-003', type: 'workshop' }
            ]
          }
        ]
      }
    ]
  }
]

export const materialTree = [
  {
    id: '1',
    name: 'Raw Material',
    children: [
      {
        id: '11',
        name: 'Steel',
        children: [
          { id: '111', name: 'Round Steel' },
          { id: '112', name: 'Plate' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Purchased Part',
    children: [
      { id: '21', name: 'Bearing' },
      { id: '22', name: 'Fastener' },
      { id: '23', name: 'Seal' }
    ]
  },
  { id: '3', name: 'Semi-finished' },
  { id: '4', name: 'Finished Product' },
  { id: '5', name: 'Auxiliary Material' },
  { id: '6', name: 'Packaging' }
]

export const materialList = Mock.mock({
  'list|12': [
    {
      'id|+1': 1,
      code: /(01|02|03|04)\.\d{2}\.\d{3}-\d{5}/,
      name: '@pick(["45# Round Steel","Bearing 6308","Bolt M16x60","Pump XJP-100","Drive Shaft DS-50","Pump Body","Wear Ring","Key 8x7x30","Impeller Casting","Bearing Housing","Hydraulic Oil Shell Tellus 46","Valve Assembly VL-300"])',
      spec: '@pick(["D50","SKF","M16x60","Flow 100m3/h","D50x500","","","","","","","DN300"])',
      'type|1': ['purchased', 'purchased', 'manufactured', 'manufactured', 'outsourced'],
      unit: '@pick(["kg","pcs","set","m","L"])'
    }
  ]
}).list

export const equipments = [
  {
    id: '1',
    code: 'EQ0000000001',
    name: '数控车床',
    model: 'CK6150',
    workshop: '机加工一车间',
    status: 'running',
    purchase_date: '2023-03-12',
    commission_date: '2023-04-01'
  },
  {
    id: '2',
    code: 'EQ0000000002',
    name: '数控车床',
    model: 'CK6150',
    workshop: '机加工一车间',
    status: 'idle',
    purchase_date: '2023-05-20',
    commission_date: '2023-06-08'
  },
  {
    id: '3',
    code: 'EQ0000000003',
    name: '钻床',
    model: 'Z3050',
    workshop: '机加工一车间',
    status: 'running',
    purchase_date: '2022-11-18',
    commission_date: '2022-12-06'
  },
  {
    id: '4',
    code: 'EQ0000000004',
    name: '磨床',
    model: 'M1432',
    workshop: '机加工一车间',
    status: 'repair',
    purchase_date: '2021-09-15',
    commission_date: '2021-10-10'
  },
  {
    id: '5',
    code: 'EQ0000000005',
    name: '加工中心',
    model: 'VMC850',
    workshop: '机加工二车间',
    status: 'maintenance',
    purchase_date: '2024-01-09',
    commission_date: '2024-01-28'
  }
]

export const workCenters = [
  { id: '1', code: 'WC00000001', name: '数控班组', workshop: '机加工一车间', capacity: '16h/天', cost: '150元/小时' },
  { id: '2', code: 'WC00000002', name: '钻床班组', workshop: '机加工一车间', capacity: '8h/天', cost: '80元/小时' },
  { id: '3', code: 'WC00000003', name: '磨削班组', workshop: '机加工一车间', capacity: '8h/天', cost: '120元/小时' },
  { id: '4', code: 'WC00000004', name: '装配班组', workshop: '装配车间', capacity: '8h/天', cost: '100元/小时' }
]

export const molds = [
  { id: '1', code: 'MD0000000001', name: '泵体铸模', type: '铸模', lifeDesign: 10000, used: 3500, status: 'using' },
  { id: '2', code: 'MD0000000002', name: '叶轮锻模', type: '锻模', lifeDesign: 5000, used: 1200, status: 'idle' },
  { id: '3', code: 'MD0000000003', name: '支架冲模', type: '冲模', lifeDesign: 8000, used: 5200, status: 'maintain' },
  { id: '4', code: 'MD0000000004', name: '接线盒注塑模', type: '注塑模', lifeDesign: 20000, used: 8600, status: 'using' }
]

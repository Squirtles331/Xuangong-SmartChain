import Mock from 'mockjs'

export const orgTree = [
  {
    id: '1',
    name: 'XX Group Co., Ltd.',
    type: 'group',
    children: [
      {
        id: '2',
        name: 'XX Heavy Industry Co., Ltd.',
        type: 'company',
        children: [
          {
            id: '3',
            name: 'Plant A',
            type: 'plant',
            children: [
              {
                id: '4',
                name: 'Machining Workshop 1',
                type: 'workshop',
                children: [
                  { id: '41', name: 'Line A', type: 'line' },
                  { id: '42', name: 'Line B', type: 'line' }
                ]
              },
              { id: '5', name: 'Machining Workshop 2', type: 'workshop' },
              { id: '6', name: 'Assembly Workshop', type: 'workshop' }
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
  { id: '1', code: 'EQ0000000001', name: 'CNC Lathe', model: 'CK6150', workshop: 'Machining Workshop 1', status: 'running' },
  { id: '2', code: 'EQ0000000002', name: 'CNC Lathe', model: 'CK6150', workshop: 'Machining Workshop 1', status: 'idle' },
  { id: '3', code: 'EQ0000000003', name: 'Drill', model: 'Z3050', workshop: 'Machining Workshop 1', status: 'running' },
  { id: '4', code: 'EQ0000000004', name: 'Grinder', model: 'M1432', workshop: 'Machining Workshop 1', status: 'repair' },
  { id: '5', code: 'EQ0000000005', name: 'Machining Center', model: 'VMC850', workshop: 'Machining Workshop 2', status: 'running' }
]

export const workCenters = [
  { id: '1', code: 'WC00000001', name: 'CNC Group', workshop: 'Machining Workshop 1', capacity: '16h/day', cost: '150/hour' },
  { id: '2', code: 'WC00000002', name: 'Drill Group', workshop: 'Machining Workshop 1', capacity: '8h/day', cost: '80/hour' },
  { id: '3', code: 'WC00000003', name: 'Grind Group', workshop: 'Machining Workshop 1', capacity: '8h/day', cost: '120/hour' },
  { id: '4', code: 'WC00000004', name: 'Assembly Group', workshop: 'Assembly Workshop', capacity: '8h/day', cost: '100/hour' }
]

export const molds = [
  { id: '1', code: 'MD0000000001', name: 'Pump Body Casting Mold', type: 'casting', life: '10000 cycles', used: '3500' },
  { id: '2', code: 'MD0000000002', name: 'Impeller Forging Mold', type: 'forging', life: '5000 cycles', used: '1200' }
]

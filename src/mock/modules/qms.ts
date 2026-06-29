import Mock from 'mockjs'

export const inspectionTasks = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /(IQC|IPQC|FQC)-2025\d{5}/,
      'type|1': ['incoming', 'process', 'final'],
      material: '@pick(["45# Round Steel D50","Pump XJP-100","Bearing 6308","Gearbox GBX-200"])',
      lot: '@pick(["L20250101","WO202501150001","L20241215"])',
      'qty|10-500': 1,
      'status|1': ['pending', 'pending', 'done']
    }
  ]
}).list

export const qcTemplates = [
  { id: '1', name: 'Steel Incoming Inspection', category: 'raw', items: 8 },
  { id: '2', name: 'Pump Finished Inspection', category: 'finished', items: 12 },
  { id: '3', name: 'Bearing Incoming Inspection', category: 'purchased', items: 6 }
]

/**
 * MRP mock data
 */
import Mock from 'mockjs'

export const mrpPurchaseList = Mock.mock({
  'list|5': [
    {
      'id|+1': 1,
      code: '@pick(["01.01.001-00001","02.04.001-00001","02.02.001-00001","01.01.002-00001","02.03.001-00001"])',
      name: '@pick(["Round Steel D50","Bearing 6308","Bolt M16x60","Wear Ring","Seal DN100"])',
      'qty|100-1000': 1,
      order_date: '@date("yyyy-MM-dd")',
      need_date: '@date("yyyy-MM-dd")',
      supplier: '@pick(["Supplier A","Supplier B","Supplier C","Supplier D","Supplier E"])',
      source: '@pick(["SO202501150001","SO202501100002","SO202501080003"])'
    }
  ]
}).list

export const mrpProductionList = Mock.mock({
  'list|4': [
    {
      'id|+1': 1,
      code: '@pick(["04.01.001-00001","04.02.001-00001","03.01.001-00001","04.01.002-00001"])',
      name: '@pick(["Pump XJP-100","Gearbox GBX-200","Drive Shaft DS-50","Pump XJP-200"])',
      'qty|30-100': 1,
      start_date: '@date("yyyy-MM-dd")',
      end_date: '@date("yyyy-MM-dd")',
      bom: '@pick(["MBOM V1.2","MBOM V1.1"])',
      routing: '@pick(["Routing V1.1","Routing V1.0"])',
      source: '@pick(["SO202501150001","SO202501100002"])'
    }
  ]
}).list

export const mrpExceptions = [
  {
    id: '1',
    type: 'Delay Risk',
    level: 'severe',
    material: 'Bearing 6308',
    detail: 'Planned order date is already overdue and requires an urgent purchase.',
    action: 'Contact the supplier and expedite delivery.'
  },
  {
    id: '2',
    type: 'Low Stock',
    level: 'warning',
    material: 'Bolt M16x60',
    detail: 'Current stock is below safety stock by 100 units.',
    action: 'Increase the purchase quantity by 100.'
  },
  {
    id: '3',
    type: 'Over Capacity',
    level: 'severe',
    material: 'Pump XJP-100',
    detail: 'CNC line loading exceeds 120% of standard capacity.',
    action: 'Outsource part of the routing or adjust the schedule.'
  },
  {
    id: '4',
    type: 'Delivery Conflict',
    level: 'warning',
    material: 'Gearbox GBX-200',
    detail: 'Two sales orders overlap on the same due date.',
    action: 'Negotiate delivery dates with the customer.'
  },
  {
    id: '5',
    type: 'BOM Change',
    level: 'info',
    material: 'Drive Shaft DS-50',
    detail: 'BOM MBOM V1.1 will be replaced by V1.2 soon.',
    action: 'Confirm which BOM version should be used for calculation.'
  }
]

export const multiPlantCapacity = [
  { plant: 'Plant A', utilization: 85, capacity: 1000, used: 850 },
  { plant: 'Plant B', utilization: 62, capacity: 800, used: 496 },
  { plant: 'Plant C', utilization: 94, capacity: 600, used: 564 }
]

export const multiPlantResults = [
  {
    id: 'mp-1',
    material: 'Round Steel D50',
    from_plant: 'Plant A',
    to_plant: 'Plant B',
    qty: 120,
    type: 'transfer',
    suggestion: 'Transfer excess stock from Plant A to Plant B first.'
  },
  {
    id: 'mp-2',
    material: 'Bearing 6308',
    from_plant: 'Supplier',
    to_plant: 'Plant C',
    qty: 300,
    type: 'purchase',
    suggestion: 'Create a shared purchase order for Plant C demand.'
  },
  {
    id: 'mp-3',
    material: 'Pump Body HT200',
    from_plant: 'Plant B',
    to_plant: 'Plant C',
    qty: 60,
    type: 'production',
    suggestion: 'Schedule Plant B casting line to support Plant C assembly.'
  }
]

export const netChangeAffected = [
  {
    id: 'nc-1',
    material: 'Bearing 6308',
    old_qty: 500,
    new_qty: 620,
    diff: 120,
    action: 'increase',
    details: [
      { source: 'SO202501150001', old_qty: 200, new_qty: 260, diff: 60, reason: 'Sales order increase' },
      { source: 'SO202501180003', old_qty: 300, new_qty: 360, diff: 60, reason: 'Rush order inserted' }
    ]
  },
  {
    id: 'nc-2',
    material: 'Pump Body HT200',
    old_qty: 180,
    new_qty: 140,
    diff: -40,
    action: 'decrease',
    details: [{ source: 'WO202501200008', old_qty: 180, new_qty: 140, diff: -40, reason: 'BOM consumption optimized' }]
  },
  {
    id: 'nc-3',
    material: 'Seal DN100',
    old_qty: 90,
    new_qty: 90,
    diff: 0,
    action: 'keep',
    details: [{ source: 'MRP baseline', old_qty: 90, new_qty: 90, diff: 0, reason: 'No demand impact after recalculation' }]
  }
]

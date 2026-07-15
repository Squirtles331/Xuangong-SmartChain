import { r as t } from './rolldown-runtime-b3L32Ng1.js'
import { t as a } from './mock-Ds7FPrnc.js'
var e = t(a(), 1),
  d = e.default.mock({
    'list|5': [
      {
        'id|+1': 1,
        code: '@pick(["01.01.001-00001","02.04.001-00001","02.02.001-00001","01.01.002-00001","02.03.001-00001"])',
        name: '@pick(["圆钢 D50","轴承 6308","螺栓 M16x60","耐磨环","密封件 DN100"])',
        'qty|100-1000': 1,
        order_date: '@date("yyyy-MM-dd")',
        need_date: '@date("yyyy-MM-dd")',
        supplier: '@pick(["华东钢材供应有限公司","苏州轴承制造厂","宁波紧固件有限公司","青岛密封科技有限公司"])',
        source: '@pick(["SO202606300001","SO202606280002","SO202606250003"])'
      }
    ]
  }).list,
  l = e.default.mock({
    'list|4': [
      {
        'id|+1': 1,
        code: '@pick(["04.01.001-00001","04.02.001-00001","03.01.001-00001","04.01.002-00001"])',
        name: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","离心泵 XJP-200"])',
        'qty|30-100': 1,
        start_date: '@date("yyyy-MM-dd")',
        end_date: '@date("yyyy-MM-dd")',
        bom: '@pick(["MBOM V1.2","MBOM V1.1"])',
        routing: '@pick(["工艺路线 V1.1","工艺路线 V1.0"])',
        source: '@pick(["SO202606300001","SO202606280002"])'
      }
    ]
  }).list,
  o = [
    {
      id: '1',
      type: '延期风险',
      level: 'severe',
      material: '轴承 6308',
      detail: '计划下单日期已经逾期，需要立即发起加急采购。',
      action: '联系供应商确认现货并推进加急交付。'
    },
    {
      id: '2',
      type: '低库存',
      level: 'warning',
      material: '螺栓 M16x60',
      detail: '当前库存低于安全库存 100 件。',
      action: '将本次采购建议数量上调 100 件。'
    },
    {
      id: '3',
      type: '产能超载',
      level: 'severe',
      material: '离心泵 XJP-100',
      detail: '数控产线负荷达到标准产能的 120%。',
      action: '建议调整排产或外协部分工序。'
    },
    {
      id: '4',
      type: '交期冲突',
      level: 'warning',
      material: '齿轮箱 GBX-200',
      detail: '两张销售订单交期重叠，产能窗口不足。',
      action: '建议与客户协商分批交付。'
    },
    {
      id: '5',
      type: 'BOM 变更',
      level: 'info',
      material: '传动轴 DS-50',
      detail: 'MBOM V1.1 即将切换到 V1.2，请确认本次计算版本。',
      action: '确认正式生效版本后重新运算。'
    }
  ],
  n = [
    {
      id: 'forecast-1',
      material_code: 'FG-001',
      material_name: '离心泵 XJP-100',
      qty: 120,
      need_date: '2026-07-10',
      type: 'sales',
      probability: 90,
      remark: '重点客户月度滚动预测'
    },
    {
      id: 'forecast-2',
      material_code: 'FG-002',
      material_name: '离心泵 XJP-150',
      qty: 80,
      need_date: '2026-07-15',
      type: 'sales',
      probability: 85,
      remark: '华东区域项目订单'
    },
    {
      id: 'forecast-3',
      material_code: 'SP-001',
      material_name: '维修备件组件 A',
      qty: 40,
      need_date: '2026-07-18',
      type: 'independent',
      probability: 70,
      remark: '售后备件补货'
    }
  ],
  s = [
    { plant: '一号工厂', utilization: 85, capacity: 1e3, used: 850 },
    { plant: '二号工厂', utilization: 62, capacity: 800, used: 496 },
    { plant: '三号工厂', utilization: 94, capacity: 600, used: 564 }
  ],
  y = [
    {
      id: 'mp-1',
      material: '圆钢 D50',
      from_plant: '一号工厂',
      to_plant: '二号工厂',
      qty: 120,
      type: 'transfer',
      suggestion: '优先从一号工厂调拨富余库存支援二号工厂。'
    },
    {
      id: 'mp-2',
      material: '轴承 6308',
      from_plant: '供应商',
      to_plant: '三号工厂',
      qty: 300,
      type: 'purchase',
      suggestion: '建议统一下达联合采购单，满足三号工厂缺口。'
    },
    {
      id: 'mp-3',
      material: '泵体 HT200',
      from_plant: '二号工厂',
      to_plant: '三号工厂',
      qty: 60,
      type: 'production',
      suggestion: '安排二号工厂铸造线支援三号工厂装配需求。'
    }
  ],
  c = [
    {
      id: 'nc-1',
      material: '轴承 6308',
      old_qty: 500,
      new_qty: 620,
      diff: 120,
      action: 'increase',
      details: [
        { source: 'SO202606300001', old_qty: 200, new_qty: 260, diff: 60, reason: '销售订单增量' },
        { source: 'SO202606300004', old_qty: 300, new_qty: 360, diff: 60, reason: '插入紧急订单' }
      ]
    },
    {
      id: 'nc-2',
      material: '泵体 HT200',
      old_qty: 180,
      new_qty: 140,
      diff: -40,
      action: 'decrease',
      details: [{ source: 'WO202606300008', old_qty: 180, new_qty: 140, diff: -40, reason: 'BOM 用量优化' }]
    },
    {
      id: 'nc-3',
      material: '密封件 DN100',
      old_qty: 90,
      new_qty: 90,
      diff: 0,
      action: 'keep',
      details: [{ source: 'MRP 基线', old_qty: 90, new_qty: 90, diff: 0, reason: '重算后无变化' }]
    }
  ]
export { s as a, d as i, n, y as o, l as r, c as s, o as t }

/**
 * MRP 运算 Mock 数据
 */
import Mock from 'mockjs'

// ==================== 建议采购 ====================
export const mrpPurchaseList = Mock.mock({
  'list|5': [
    {
      'id|+1': 1,
      code: '@pick(["01.01.001-00001","02.04.001-00001","02.02.001-00001","01.01.002-00001","02.03.001-00001"])',
      name: '@pick(["45#圆钢 φ50","轴承 6308","螺栓 M16×60","耐磨环","密封圈 DN100"])',
      'qty|100-1000': 1,
      order_date: '@date("yyyy-MM-dd")',
      need_date: '@date("yyyy-MM-dd")',
      supplier: '@pick(["XX钢材有限公司","YY轴承制造厂","ZZ标准件有限公司","AA铸件有限公司","BB密封件厂"])',
      source: '@pick(["SO202501150001","SO202501100002","SO202501080003"])'
    }
  ]
}).list

// ==================== 建议生产 ====================
export const mrpProductionList = Mock.mock({
  'list|4': [
    {
      'id|+1': 1,
      code: '@pick(["04.01.001-00001","04.02.001-00001","03.01.001-00001","04.01.002-00001"])',
      name: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","离心泵 XJP-200"])',
      'qty|30-100': 1,
      start_date: '@date("yyyy-MM-dd")',
      end_date: '@date("yyyy-MM-dd")',
      bom: '@pick(["MBOM V1.2","MBOM V1.1","MBOM V1.2"])',
      routing: '@pick(["标准工艺 V1.1","标准工艺 V1.0","标准工艺 V1.1"])',
      source: '@pick(["SO202501150001","SO202501100002"])'
    }
  ]
}).list

// ==================== 例外报告 ====================
export const mrpExceptions = [
  {
    id: '1',
    type: '延期风险',
    level: 'severe',
    material: '轴承 6308',
    detail: '建议下单日期(1月5日)已过，需要加急采购',
    action: '建议联系供应商紧急供货'
  },
  {
    id: '2',
    type: '库存不足',
    level: 'warning',
    material: '螺栓 M16×60',
    detail: '当前库存 500件，安全库存 600件，需补充',
    action: '建议调整采购计划增加100件'
  },
  {
    id: '3',
    type: '产能超载',
    level: 'severe',
    material: '离心泵 XJP-100',
    detail: '数控车组产能占用 120%，超出负荷',
    action: '建议外包部分工序或调整排程'
  },
  {
    id: '4',
    type: '交期冲突',
    level: 'warning',
    material: '齿轮箱 GBX-200',
    detail: 'SO202501150001 交期与 SO202501100002 重叠',
    action: '建议与客户协商调整交期'
  },
  {
    id: '5',
    type: 'BOM 变更提示',
    level: 'info',
    material: '传动轴 DS-50',
    detail: 'BOM MBOM V1.1 即将被 V1.2 替代',
    action: '请确认是否使用新版本BOM进行运算'
  }
]

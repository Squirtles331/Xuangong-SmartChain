import Mock from 'mockjs'

export const inspectionTasks = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /(IQC|IPQC|FQC)-2026\d{5}/,
      'type|1': ['来料检验', '过程检验', '最终检验'],
      material: '@pick(["45#圆钢 D50","离心泵 XJP-100","轴承 6308","齿轮箱 GBX-200"])',
      lot: '@pick(["L20260601","WO202606300001","L20260518"])',
      'qty|10-500': 1,
      'status|1': ['pending', 'pending', 'done'],
      verdict: '@pick(["", "", "合格"])'
    }
  ]
}).list

export const qcTemplates = [
  {
    id: 'template-1',
    name: '钢材来料检验模板',
    category: 'raw',
    itemCount: 8,
    items: [
      { name: '外观', type: 'sensory', standard: '无锈蚀、无裂纹', required: true },
      { name: '直径', type: 'measure', standard: '50±0.2', required: true }
    ]
  },
  {
    id: 'template-2',
    name: '泵类成品检验模板',
    category: 'finished',
    itemCount: 12,
    items: [
      { name: '性能测试', type: 'measure', standard: '流量 100m3/h', required: true },
      { name: '外观清洁', type: 'sensory', standard: '无磕碰、无油污', required: true }
    ]
  },
  {
    id: 'template-3',
    name: '轴承来料检验模板',
    category: 'purchased',
    itemCount: 6,
    items: [
      { name: '型号核对', type: 'count', standard: '6308', required: true },
      { name: '转动灵活性', type: 'sensory', standard: '无卡滞', required: true }
    ]
  }
]

export const supplierQualityList = [
  {
    id: 'supplier-1',
    supplier: '华东钢材供应有限公司',
    total_batches: 36,
    pass_batches: 34,
    pass_rate: 94.4,
    repeat_issues: 1,
    last_inspection: '2026-06-25'
  },
  {
    id: 'supplier-2',
    supplier: '苏州轴承制造厂',
    total_batches: 28,
    pass_batches: 27,
    pass_rate: 96.4,
    repeat_issues: 0,
    last_inspection: '2026-06-28'
  },
  {
    id: 'supplier-3',
    supplier: '宁波密封科技有限公司',
    total_batches: 18,
    pass_batches: 15,
    pass_rate: 83.3,
    repeat_issues: 2,
    last_inspection: '2026-06-20'
  }
]

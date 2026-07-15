var e = [
    { value: 'draft', label: '草稿', type: 'info' },
    { value: 'approved', label: '已审核', type: 'primary' },
    { value: 'released', label: '已下发', type: 'warning' },
    { value: 'in_progress', label: '生产中', type: 'primary' },
    { value: 'completed', label: '已完工', type: 'success' },
    { value: 'closed', label: '已关闭', type: 'info' }
  ],
  a = [
    { value: 'urgent', label: '紧急', type: 'danger' },
    { value: 'high', label: '高', type: 'warning' },
    { value: 'normal', label: '普通', type: 'info' },
    { value: 'low', label: '低', type: 'info' }
  ],
  l = [
    { value: 'running', label: '运行中', type: 'success' },
    { value: 'idle', label: '空闲', type: 'info' },
    { value: 'maintenance', label: '保养中', type: 'warning' },
    { value: 'repair', label: '维修中', type: 'danger' },
    { value: 'scrapped', label: '已报废', type: 'info' }
  ],
  r = [
    { value: 'pass', label: '合格', type: 'success' },
    { value: 'concession', label: '让步接收', type: 'warning' },
    { value: 'rework', label: '返工', type: 'danger' },
    { value: 'return', label: '退货', type: 'danger' },
    { value: 'scrap', label: '报废', type: 'info' }
  ]
export { e as i, r as n, a as r, l as t }

export const apsScheduleData = {
  ganttData: [
    {
      id: '1',
      code: 'WO001',
      material: '离心泵 XJP-100',
      segments: [
        { name: '下料', wc: '下料组', left: 0, width: 8, color: '#409eff', conflict: false },
        { name: '粗车', wc: '数控车组', left: 8, width: 14, color: '#67c23a', conflict: false },
        { name: '精车', wc: '数控车组', left: 22, width: 10, color: '#e6a23c', conflict: true },
        { name: '钻孔', wc: '钻床组', left: 32, width: 8, color: '#909399', conflict: false },
        { name: '磨削', wc: '磨床组', left: 40, width: 10, color: '#f56c6c', conflict: false },
        { name: '装配', wc: '装配组', left: 50, width: 12, color: '#409eff', conflict: true },
        { name: '试压', wc: '测试组', left: 62, width: 8, color: '#67c23a', conflict: false },
        { name: '油漆', wc: '涂装组', left: 70, width: 10, color: '#e6a23c', conflict: false }
      ]
    },
    {
      id: '2',
      code: 'WO002',
      material: '齿轮箱 GBX-200',
      segments: [
        { name: '下料', wc: '下料组', left: 8, width: 6, color: '#409eff', conflict: false },
        { name: '粗车', wc: '数控车组', left: 24, width: 12, color: '#67c23a', conflict: false },
        { name: '精车', wc: '数控车组', left: 36, width: 8, color: '#e6a23c', conflict: false }
      ]
    },
    {
      id: '3',
      code: 'WO003',
      material: '传动轴 DS-50',
      segments: [
        { name: '车削', wc: '数控车组', left: 44, width: 14, color: '#409eff', conflict: false },
        { name: '磨削', wc: '磨床组', left: 58, width: 10, color: '#f56c6c', conflict: false }
      ]
    }
  ],
  loadData: [
    { name: '下料组', capacity: '8h', used: '5.5h', loadPct: 69 },
    { name: '数控车组', capacity: '16h', used: '15h', loadPct: 94 },
    { name: '钻床组', capacity: '8h', used: '4h', loadPct: 50 },
    { name: '磨床组', capacity: '8h', used: '7.5h', loadPct: 94 },
    { name: '装配组', capacity: '8h', used: '6h', loadPct: 75 },
    { name: '测试组', capacity: '8h', used: '3h', loadPct: 38 },
    { name: '涂装组', capacity: '8h', used: '5h', loadPct: 63 },
    { name: '热处理组', capacity: '16h', used: '8h', loadPct: 50 }
  ],
  loadTrend: {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    series: [
      { name: '下料组', data: [5, 6, 4, 7, 5, 0, 0], color: '#409eff' },
      { name: '数控车组', data: [14, 15, 12, 16, 10, 5, 0], color: '#67c23a' },
      { name: '磨床组', data: [6, 7, 5, 8, 7, 3, 0], color: '#f56c6c' },
      { name: '装配组', data: [5, 4, 6, 5, 8, 2, 0], color: '#e6a23c' }
    ]
  },
  scheduleOps: [
    { op: '工序10:下料', wc: '下料组', qty: 100 },
    { op: '工序20:粗车', wc: '数控车组', qty: 100 },
    { op: '工序30:精车', wc: '数控车组', qty: 100 },
    { op: '工序40:钻孔', wc: '钻床组', qty: 100 },
    { op: '工序50:磨削', wc: '磨床组', qty: 100 },
    { op: '工序60:装配', wc: '装配组', qty: 100 },
    { op: '工序70:试压', wc: '测试组', qty: 100 },
    { op: '工序80:油漆', wc: '涂装组', qty: 100 }
  ]
}

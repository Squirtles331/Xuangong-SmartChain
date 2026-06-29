export const equipmentOeeOverview = {
  cards: [
    { title: 'OEE综合', value: 78.5 },
    { title: '设备利用率', value: 85.2 },
    { title: '性能效率', value: 92.1 },
    { title: '合格品率', value: 98.3 }
  ],
  rankData: [
    { equipment: '数控车床 CK6150', oee: '85.2%', utilization: '90.1%', performance: '95.0%', quality: '99.5%' },
    { equipment: '钻床 Z3050', oee: '78.6%', utilization: '82.3%', performance: '93.5%', quality: '98.2%' },
    { equipment: '磨床 M1432', oee: '72.1%', utilization: '75.0%', performance: '90.2%', quality: '97.8%' },
    { equipment: '加工中心 VMC850', oee: '80.5%', utilization: '88.0%', performance: '92.8%', quality: '98.8%' }
  ],
  trendData: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    oee: [75, 76, 78, 77, 79, 78.5],
    utilization: [82, 84, 85, 83, 86, 85.2],
    performance: [90, 91, 92, 91, 93, 92.1],
    quality: [97, 98, 97.5, 98.2, 98.5, 98.3]
  }
}

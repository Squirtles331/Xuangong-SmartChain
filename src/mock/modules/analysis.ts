export interface MockReportItem {
  id: number
  name: string
  type: string
  createdAt: string
  status: string
}

export const reports: MockReportItem[] = [
  { id: 1, name: '2024年6月营收报表', type: '营收报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 2, name: '2024年6月工单汇总', type: '工单报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 3, name: '2024年6月设备OEE分析', type: 'OEE报表', createdAt: '2024-06-30', status: '生成中' },
  { id: 4, name: '2024年5月营收报表', type: '营收报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 5, name: '2024年5月工单汇总', type: '工单报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 6, name: '2024年5月设备OEE分析', type: 'OEE报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 7, name: '2024年Q2质量分析报告', type: '质量报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 8, name: '2024年6月库存盘点', type: '库存报表', createdAt: '2024-06-30', status: '生成失败' },
  { id: 9, name: '2024年6月采购汇总', type: '采购报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 10, name: '2024年Q2交付率统计', type: '交付报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 11, name: '2024年6月能耗统计', type: '能耗报表', createdAt: '2024-06-28', status: '已生成' },
  { id: 12, name: '2024年6月人员效率分析', type: '效率报表', createdAt: '2024-06-29', status: '生成中' }
]

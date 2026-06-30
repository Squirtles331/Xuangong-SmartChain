export interface MockReportItem {
  id: number
  name: string
  category: string
  createdAt: string
  creator: string
  status: string
}

export const reports: MockReportItem[] = [
  { id: 1, name: '2024骞?鏈堣惀鏀舵姤琛?', category: '钀ユ敹鎶ヨ〃', createdAt: '2024-06-30', creator: 'admin', status: '宸茬敓鎴?' },
  { id: 2, name: '2024骞?鏈堝伐鍗曟眹鎬?', category: '宸ュ崟鎶ヨ〃', createdAt: '2024-06-30', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 3, name: '2024骞?鏈堣澶嘜EE鍒嗘瀽', category: 'OEE鎶ヨ〃', createdAt: '2024-06-30', creator: 'analyst', status: '鐢熸垚涓?' },
  { id: 4, name: '2024骞?鏈堣惀鏀舵姤琛?', category: '钀ユ敹鎶ヨ〃', createdAt: '2024-05-31', creator: 'admin', status: '宸茬敓鎴?' },
  { id: 5, name: '2024骞?鏈堝伐鍗曟眹鎬?', category: '宸ュ崟鎶ヨ〃', createdAt: '2024-05-31', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 6, name: '2024骞?鏈堣澶嘜EE鍒嗘瀽', category: 'OEE鎶ヨ〃', createdAt: '2024-05-31', creator: 'analyst', status: '宸茬敓鎴?' },
  { id: 7, name: '2024骞碤2璐ㄩ噺鍒嗘瀽鎶ュ憡', category: '璐ㄩ噺鎶ヨ〃', createdAt: '2024-06-30', creator: 'quality', status: '宸茬敓鎴?' },
  { id: 8, name: '2024骞?鏈堝簱瀛樼洏鐐?', category: '搴撳瓨鎶ヨ〃', createdAt: '2024-06-30', creator: 'warehouse', status: '鐢熸垚澶辫触' },
  { id: 9, name: '2024骞?鏈堥噰璐眹鎬?', category: '閲囪喘鎶ヨ〃', createdAt: '2024-06-30', creator: 'buyer', status: '宸茬敓鎴?' },
  { id: 10, name: '2024骞碤2浜や粯鐜囩粺璁?', category: '浜や粯鎶ヨ〃', createdAt: '2024-06-30', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 11, name: '2024骞?鏈堣兘鑰楃粺璁?', category: '鑳借€楁姤琛?', createdAt: '2024-06-28', creator: 'ehs', status: '宸茬敓鎴?' },
  { id: 12, name: '2024骞?鏈堜汉鍛樻晥鐜囧垎鏋?', category: '鏁堢巼鎶ヨ〃', createdAt: '2024-06-29', creator: 'hr', status: '鐢熸垚涓?' }
]

import { wrapDetailResponse } from '@/static/utils/response'

export async function getDashboardStats() {
  return wrapDetailResponse({
    revenue: 865,
    revenue_trend: 9.6,
    active_orders: 26,
    orders_trend: -3.2,
    oee: 81.3,
    oee_trend: 2.4,
    delivery_rate: 95.1,
    delivery_trend: 1.7
  })
}

export async function getHomeCharts() {
  return wrapDetailResponse({
    trend: {
      months: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      revenue: [720, 755, 790, 804, 836, 865],
      cost: [560, 578, 590, 606, 620, 632],
      profit: [160, 177, 200, 198, 216, 233]
    },
    order_status: [
      { value: 6, name: 'Pending Approval' },
      { value: 18, name: 'Released' },
      { value: 26, name: 'In Production' },
      { value: 11, name: 'Completed' }
    ]
  })
}

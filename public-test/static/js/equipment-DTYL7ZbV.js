import { C as q, D as d, M as u, O as l, S as s, T as m, b as y, g as r, k as f, v as g, w as h, y as w } from './index-DqMfCNbk.js'
var k = {
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
  },
  a = [
    {
      id: 'repair-1',
      code: 'WX202606300001',
      equipment: '数控车床 CK6150',
      fault_desc: '主轴异响，需要检查轴承状态',
      priority: 'high',
      status: 'pending',
      worker: '',
      created_at: '2026-06-30 09:20:00'
    },
    {
      id: 'repair-2',
      code: 'WX202606280002',
      equipment: '钻床 Z3050',
      fault_desc: '液压系统压力波动',
      priority: 'urgent',
      status: 'running',
      worker: '张维修',
      created_at: '2026-06-28 14:10:00'
    },
    {
      id: 'repair-3',
      code: 'WX202606260003',
      equipment: '磨床 M1432',
      fault_desc: '导轨润滑不足，已补充并复检',
      priority: 'normal',
      status: 'done',
      worker: '李维修',
      created_at: '2026-06-26 11:30:00'
    }
  ],
  o = [
    {
      id: 'maintain-1',
      code: 'BY202606300001',
      equipment: '数控车床 CK6150',
      type: 'daily',
      plan_date: '2026-07-01',
      executor: '王保养',
      status: 'pending'
    },
    {
      id: 'maintain-2',
      code: 'BY202606280002',
      equipment: '钻床 Z3050',
      type: 'weekly',
      plan_date: '2026-06-29',
      executor: '张保养',
      status: 'done'
    },
    {
      id: 'maintain-3',
      code: 'BY202606250003',
      equipment: '磨床 M1432',
      type: 'overhaul',
      plan_date: '2026-06-20',
      executor: '李保养',
      status: 'overdue'
    }
  ],
  c = [
    {
      id: 'check-1',
      code: 'DJ202606300001',
      equipment: '数控车床 CK6150',
      check_type: '日点检',
      plan_date: '2026-07-01',
      executor: '赵点检',
      status: 'pending'
    },
    {
      id: 'check-2',
      code: 'DJ202606280002',
      equipment: '钻床 Z3050',
      check_type: '周点检',
      plan_date: '2026-06-28',
      executor: '钱点检',
      status: 'done'
    },
    {
      id: 'check-3',
      code: 'DJ202606250003',
      equipment: '磨床 M1432',
      check_type: '月点检',
      plan_date: '2026-06-20',
      executor: '孙点检',
      status: 'overdue'
    }
  ],
  p = [
    {
      id: 'spare-1',
      code: 'PJ202606300001',
      name: '主轴轴承',
      spec: '6208-2RS',
      applicable_equipment: '数控车床 CK6150',
      qty: 8,
      safety: 5,
      unit: '套',
      location: 'A-01-01'
    },
    {
      id: 'spare-2',
      code: 'PJ202606280002',
      name: '液压油滤芯',
      spec: 'HF-20',
      applicable_equipment: '钻床 Z3050',
      qty: 3,
      safety: 5,
      unit: '个',
      location: 'A-01-02'
    },
    {
      id: 'spare-3',
      code: 'PJ202606250003',
      name: '导轨防尘罩',
      spec: 'FCZ-M1432',
      applicable_equipment: '磨床 M1432',
      qty: 0,
      safety: 2,
      unit: '件',
      location: 'B-02-03'
    }
  ]
function S(e, t) {
  const i = Math.max(1, t - e + 1)
  return {
    months: Array.from({ length: i }, (n, _) => `${e + _}月`),
    oee: Array.from({ length: i }, () => +(70 + Math.random() * 12).toFixed(1)),
    utilization: Array.from({ length: i }, () => +(80 + Math.random() * 10).toFixed(1)),
    performance: Array.from({ length: i }, () => +(88 + Math.random() * 8).toFixed(1)),
    quality: Array.from({ length: i }, () => +(96 + Math.random() * 4).toFixed(1))
  }
}
async function x(e) {
  await r()
  const t = e?.start_month ? Number(e.start_month.split('-')[1]) : 1,
    i = e?.end_month ? Number(e.end_month.split('-')[1]) : 6
  return w({ cards: k.cards, rankData: k.rankData, trendData: S(t, i) })
}
async function $(e) {
  await r()
  let t = [...a]
  ;(e.keyword && (t = h(t, e.keyword, ['code', 'equipment', 'fault_desc'])),
    e.status && (t = t.filter((n) => n.status === e.status)),
    e.priority && (t = t.filter((n) => n.priority === e.priority)))
  const i = q(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function v(e) {
  await r()
  const t = {
      id: e.id || m(),
      code: e.code || `WX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(a.length + 1).padStart(4, '0')}`,
      equipment: e.equipment || '',
      fault_desc: e.fault_desc || '',
      priority: e.priority || 'normal',
      status: e.status || 'pending',
      worker: e.worker || '',
      created_at: e.created_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
    },
    i = a.findIndex((n) => n.id === t.id)
  return i > -1 ? ((a[i] = { ...a[i], ...t }), s(a[i], '编辑维修工单成功')) : (a.unshift(t), g(t, '新增维修工单成功'))
}
async function E(e, t) {
  await r()
  const i = a.find((n) => n.id === e)
  return (i && ((i.status = t.status), t.worker !== void 0 && (i.worker = t.worker)), s(i || { id: e, ...t }, '维修状态更新成功'))
}
async function M(e) {
  await r()
  let t = [...o]
  ;(e.keyword && (t = h(t, e.keyword, ['code', 'equipment'])),
    e.type && (t = t.filter((n) => n.type === e.type)),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = q(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function D(e) {
  await r()
  const t = {
      id: e.id || m(),
      code: e.code || `BY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(o.length + 1).padStart(4, '0')}`,
      equipment: e.equipment || '',
      type: e.type || 'daily',
      plan_date: e.plan_date || '',
      executor: e.executor || '',
      status: e.status || 'pending'
    },
    i = o.findIndex((n) => n.id === t.id)
  return i > -1 ? ((o[i] = { ...o[i], ...t }), s(o[i], '编辑保养计划成功')) : (o.unshift(t), g(t, '新增保养计划成功'))
}
async function C(e, t) {
  await r()
  const i = o.find((n) => n.id === e)
  return (i && (i.status = 'done'), s(i || { id: e }, '保养执行成功'))
}
async function z(e) {
  await r()
  let t = [...c]
  ;(e.keyword && (t = h(t, e.keyword, ['code', 'equipment'])),
    e.check_type && (t = t.filter((n) => n.check_type === e.check_type)),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = q(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function O(e) {
  await r()
  const t = {
      id: e.id || m(),
      code: e.code || `DJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(c.length + 1).padStart(4, '0')}`,
      equipment: e.equipment || '',
      check_type: e.check_type || '日点检',
      plan_date: e.plan_date || '',
      executor: e.executor || '',
      status: e.status || 'pending'
    },
    i = c.findIndex((n) => n.id === t.id)
  return i > -1 ? ((c[i] = { ...c[i], ...t }), s(c[i], '编辑点检计划成功')) : (c.unshift(t), g(t, '新增点检计划成功'))
}
async function R(e, t) {
  await r()
  const i = c.find((n) => n.id === e)
  return (i && (i.status = 'done'), s(i || { id: e }, '点检执行成功'))
}
async function I(e) {
  await r()
  let t = [...p]
  ;(e.keyword && (t = h(t, e.keyword, ['code', 'name', 'spec', 'applicable_equipment'])),
    e.stock_status === 'ok' && (t = t.filter((n) => n.qty > n.safety)),
    e.stock_status === 'low' && (t = t.filter((n) => n.qty > 0 && n.qty <= n.safety)),
    e.stock_status === 'out' && (t = t.filter((n) => n.qty <= 0)))
  const i = q(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function b(e) {
  await r()
  const t = {
      id: e.id || m(),
      code: e.code || `PJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(p.length + 1).padStart(4, '0')}`,
      name: e.name || '',
      spec: e.spec || '',
      applicable_equipment: e.applicable_equipment || '',
      qty: e.qty ?? 0,
      safety: e.safety ?? 0,
      unit: e.unit || '件',
      location: e.location || ''
    },
    i = p.findIndex((n) => n.id === t.id)
  return i > -1 ? ((p[i] = { ...p[i], ...t }), s(p[i], '编辑备件成功')) : (p.unshift(t), g(t, '新增备件成功'))
}
async function N(e, t) {
  await r()
  const i = p.find((n) => n.id === e)
  return (i && (i.qty = Math.max(0, i.qty + t)), s(i || { id: e, delta: t }, '备件库存更新成功'))
}
function J(e) {
  return u ? x(e) : d('/equipment/oee', { params: e })
}
function A(e) {
  return u ? $(e) : d('/equipment/repair', { params: e })
}
function F(e) {
  return u ? v(e) : e.id ? f(`/equipment/repair/${e.id}`, e) : l('/equipment/repair', e)
}
function P(e, t) {
  return u ? E(e, t) : f(`/equipment/repair/${e}/status`, t)
}
function Z(e) {
  return u ? M(e) : d('/equipment/maintain', { params: e })
}
function B(e) {
  return u ? D(e) : e.id ? f(`/equipment/maintain/${e.id}`, e) : l('/equipment/maintain', e)
}
function K(e, t) {
  return u ? C(e, t) : l(`/equipment/maintain/${e}/execute`, t)
}
function W(e) {
  return u ? z(e) : d('/equipment/check', { params: e })
}
function X(e) {
  return u ? O(e) : e.id ? f(`/equipment/check/${e.id}`, e) : l('/equipment/check', e)
}
function Y(e, t) {
  return u ? R(e, t) : l(`/equipment/check/${e}/execute`, t)
}
function T(e) {
  return u ? I(e) : d('/equipment/spare', { params: e })
}
function Q(e) {
  return u ? b(e) : e.id ? f(`/equipment/spare/${e.id}`, e) : l('/equipment/spare', e)
}
function G(e, t) {
  return u ? N(e, t) : f(`/equipment/spare/${e}/qty`, { delta: t })
}
export { J as a, X as c, Q as d, P as f, Z as i, B as l, K as n, A as o, G as p, W as r, T as s, Y as t, F as u }

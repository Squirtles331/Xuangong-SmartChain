import { C as p, D as f, E as x, M as o, O as _, S as d, T as v, b as y, g as r, k as g, v as w, w as l, x as $, y as I } from './index-DqMfCNbk.js'
var m = [
    {
      id: 'sales-order-1',
      code: 'SO202506300001',
      customer_name: '华东重工集团',
      material_name: '离心泵 XJP-100',
      qty: 50,
      amount: 23e4,
      delivery_date: '2026-07-20',
      status: 'approved'
    },
    {
      id: 'sales-order-2',
      code: 'SO202506280002',
      customer_name: '启明精密制造',
      material_name: '齿轮箱 GBX-200',
      qty: 20,
      amount: 18e4,
      delivery_date: '2026-07-15',
      status: 'in_production'
    },
    {
      id: 'sales-order-3',
      code: 'SO202506250003',
      customer_name: '鼎盛动力设备',
      material_name: '传动轴 DS-50',
      qty: 80,
      amount: 32e4,
      delivery_date: '2026-07-10',
      status: 'pending_delivery'
    },
    {
      id: 'sales-order-4',
      code: 'SO202506200004',
      customer_name: '华东重工集团',
      material_name: '联轴器 LZQ-80',
      qty: 120,
      amount: 156e3,
      delivery_date: '2026-06-25',
      status: 'completed'
    }
  ],
  s = [
    {
      id: 'quotation-1',
      code: 'BJ202506300001',
      customer: '华东重工集团',
      product: '离心泵 XJP-100',
      qty: 50,
      price: 4600,
      amount: 23e4,
      valid_date: '2026-07-30',
      status: 'sent'
    },
    {
      id: 'quotation-2',
      code: 'BJ202506280002',
      customer: '启明精密制造',
      product: '齿轮箱 GBX-200',
      qty: 20,
      price: 9e3,
      amount: 18e4,
      valid_date: '2026-07-15',
      status: 'approved'
    },
    {
      id: 'quotation-3',
      code: 'BJ202506260003',
      customer: '鼎盛动力设备',
      product: '传动轴 DS-50',
      qty: 80,
      price: 4e3,
      amount: 32e4,
      valid_date: '2026-07-05',
      status: 'draft'
    }
  ],
  c = [
    {
      id: 'opportunity-1',
      customer: '华东重工集团',
      product: '离心泵 XJP-100 批量订单',
      amount: 5e5,
      stage: 'quotation',
      probability: 60,
      owner: '张经理',
      close_date: '2026-08-15'
    },
    {
      id: 'opportunity-2',
      customer: '启明精密制造',
      product: '齿轮箱 GBX-200 试制项目',
      amount: 18e4,
      stage: 'solution',
      probability: 45,
      owner: '李经理',
      close_date: '2026-08-05'
    },
    {
      id: 'opportunity-3',
      customer: '鼎盛动力设备',
      product: '传动轴 DS-50 年框合作',
      amount: 32e4,
      stage: 'initial',
      probability: 25,
      owner: '王经理',
      close_date: '2026-09-01'
    }
  ],
  u = [
    {
      id: 'contract-1',
      code: 'HT202506300001',
      customer: '华东重工集团',
      amount: 25e5,
      sign_date: '2026-06-01',
      start_date: '2026-06-01',
      end_date: '2026-12-31',
      status: 'active'
    },
    {
      id: 'contract-2',
      code: 'HT202506280002',
      customer: '启明精密制造',
      amount: 8e5,
      sign_date: '2026-05-28',
      start_date: '2026-06-01',
      end_date: '2027-05-31',
      status: 'active'
    },
    {
      id: 'contract-3',
      code: 'HT202505100003',
      customer: '鼎盛动力设备',
      amount: 5e5,
      sign_date: '2026-05-10',
      start_date: '2026-05-15',
      end_date: '2026-06-20',
      status: 'expired'
    }
  ],
  a = [
    {
      id: 'invoice-1',
      code: 'FP202506300001',
      customer: '华东重工集团',
      order_code: 'SO202506300001',
      amount: 23e4,
      tax_rate: 13,
      tax_amount: 29900,
      total: 259900,
      issue_date: '2026-06-30',
      status: 'issued'
    },
    {
      id: 'invoice-2',
      code: 'FP202506280002',
      customer: '启明精密制造',
      order_code: 'SO202506280002',
      amount: 18e4,
      tax_rate: 13,
      tax_amount: 23400,
      total: 203400,
      issue_date: '2026-06-28',
      status: 'issued'
    },
    {
      id: 'invoice-3',
      code: 'FP202506260003',
      customer: '鼎盛动力设备',
      order_code: '',
      amount: 8e4,
      tax_rate: 13,
      tax_amount: 10400,
      total: 90400,
      issue_date: '',
      status: 'draft'
    }
  ],
  S = [
    {
      id: 'receivable-1',
      code: 'YS202506300001',
      customer: '华东重工集团',
      amount: 259900,
      settled: 1e5,
      balance: 159900,
      due_date: '2026-07-30',
      aging: 0
    },
    {
      id: 'receivable-2',
      code: 'YS202506280002',
      customer: '启明精密制造',
      amount: 203400,
      settled: 203400,
      balance: 0,
      due_date: '2026-07-28',
      aging: 0
    },
    {
      id: 'receivable-3',
      code: 'YS202505200003',
      customer: '鼎盛动力设备',
      amount: 90400,
      settled: 2e4,
      balance: 70400,
      due_date: '2026-06-01',
      aging: 29
    }
  ]
function b(e, t) {
  return `${e}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(t + 1).padStart(4, '0')}`
}
async function q(e) {
  await r()
  let t = [...m]
  ;(e.code && (t = l(t, e.code, ['code'])),
    e.customerName && (t = l(t, e.customerName, ['customer_name'])),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function R(e) {
  return (await r(), I(m.find((t) => t.id === e) || null))
}
async function L(e, t) {
  await r()
  const i = m.findIndex((n) => n.id === e)
  return i > -1 ? ((m[i] = { ...m[i], ...t }), d(m[i], '编辑销售订单成功')) : d({ id: e, ...t }, '编辑销售订单成功')
}
async function N(e) {
  await r()
  let t = [...s]
  ;(e.code && (t = l(t, e.code, ['code'])),
    e.customer && (t = l(t, e.customer, ['customer'])),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function h(e) {
  await r()
  const t = {
      id: e.id || v(),
      code: e.code || b('BJ', s.length),
      customer: e.customer || '',
      product: e.product || '',
      qty: e.qty ?? 0,
      price: e.price ?? 0,
      amount: e.amount ?? 0,
      valid_date: e.valid_date || '',
      status: e.status || 'draft'
    },
    i = s.findIndex((n) => n.id === t.id)
  return i > -1 ? ((s[i] = { ...s[i], ...t }), d(s[i], '编辑报价单成功')) : (s.unshift(t), w(t, '新增报价单成功'))
}
async function z(e) {
  await r()
  const t = s.findIndex((i) => i.id === e)
  return (t > -1 && s.splice(t, 1), $('删除报价单成功'))
}
async function D(e) {
  await r()
  let t = [...c]
  ;(e.keyword && (t = l(t, e.keyword, ['customer', 'product', 'owner'])), e.stage && (t = t.filter((n) => n.stage === e.stage)))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function C(e) {
  await r()
  const t = {
      id: e.id || v(),
      customer: e.customer || '',
      product: e.product || '',
      amount: e.amount ?? 0,
      stage: e.stage || 'initial',
      probability: e.probability ?? 0,
      owner: e.owner || '',
      close_date: e.close_date || ''
    },
    i = c.findIndex((n) => n.id === t.id)
  return i > -1 ? ((c[i] = { ...c[i], ...t }), d(c[i], '编辑商机成功')) : (c.unshift(t), w(t, '新增商机成功'))
}
async function P(e) {
  await r()
  const t = c.findIndex((i) => i.id === e)
  return (t > -1 && c.splice(t, 1), $('删除商机成功'))
}
async function k(e) {
  await r()
  const t = c.find((i) => i.id === e)
  return (t && ((t.stage = 'won'), (t.probability = 100)), d(t || { id: e }, '商机已转为销售订单'))
}
async function B(e) {
  await r()
  let t = [...u]
  ;(e.keyword && (t = l(t, e.keyword, ['code', 'customer'])), e.status && (t = t.filter((n) => n.status === e.status)))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function J(e) {
  await r()
  const t = {
      id: e.id || v(),
      code: e.code || b('HT', u.length),
      customer: e.customer || '',
      amount: e.amount ?? 0,
      sign_date: e.sign_date || '',
      start_date: e.start_date || '',
      end_date: e.end_date || '',
      status: e.status || 'draft'
    },
    i = u.findIndex((n) => n.id === t.id)
  return i > -1 ? ((u[i] = { ...u[i], ...t }), d(u[i], '编辑合同成功')) : (u.unshift(t), w(t, '新增合同成功'))
}
async function Q(e) {
  await r()
  const t = u.findIndex((i) => i.id === e)
  return (t > -1 && u.splice(t, 1), $('删除合同成功'))
}
async function X(e) {
  await r()
  let t = [...a]
  ;(e.keyword && (t = l(t, e.keyword, ['code', 'customer', 'order_code'])), e.status && (t = t.filter((n) => n.status === e.status)))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function T(e) {
  await r()
  const t = {
      id: e.id || v(),
      code: e.code || b('FP', a.length),
      customer: e.customer || '',
      order_code: e.order_code || '',
      amount: e.amount ?? 0,
      tax_rate: e.tax_rate ?? 13,
      tax_amount: e.tax_amount ?? 0,
      total: e.total ?? 0,
      issue_date: e.issue_date || '',
      status: e.status || 'draft'
    },
    i = a.findIndex((n) => n.id === t.id)
  return i > -1 ? ((a[i] = { ...a[i], ...t }), d(a[i], '编辑发票成功')) : (a.unshift(t), w(t, '新增发票成功'))
}
async function F(e) {
  await r()
  const t = a.find((i) => i.id === e)
  return (t && ((t.status = 'issued'), (t.issue_date = new Date().toISOString().slice(0, 10))), d(t || { id: e }, '发票已开具'))
}
async function G(e) {
  await r()
  let t = [...S]
  ;(e.customer && (t = l(t, e.customer, ['customer'])),
    e.status === 'overdue' && (t = t.filter((n) => n.aging > 0)),
    e.status === 'settled' && (t = t.filter((n) => n.balance === 0)),
    e.status === 'pending' && (t = t.filter((n) => n.balance > 0)),
    e.agingRange &&
      (e.agingRange === '0' && (t = t.filter((n) => n.aging <= 0)),
      e.agingRange === '1' && (t = t.filter((n) => n.aging >= 1 && n.aging <= 30)),
      e.agingRange === '2' && (t = t.filter((n) => n.aging >= 31 && n.aging <= 60)),
      e.agingRange === '3' && (t = t.filter((n) => n.aging >= 61 && n.aging <= 90)),
      e.agingRange === '4' && (t = t.filter((n) => n.aging > 90))))
  const i = p(t, e.pageNum, e.pageSize)
  return y(i.list, i.total, i.pageNum, i.pageSize)
}
async function H(e) {
  await r()
  const t = {
    id: v(),
    code: b('YS', S.length),
    customer: e.customer || '',
    amount: e.amount ?? 0,
    settled: 0,
    balance: e.amount ?? 0,
    due_date: e.date || new Date().toISOString().slice(0, 10),
    aging: 0
  }
  return (S.unshift(t), w(t, '登记回款成功'))
}
async function M(e) {
  return (
    await r(),
    e.items.forEach(({ id: t, amount: i }) => {
      const n = S.find((O) => O.id === t)
      !n || i <= 0 || ((n.settled += i), (n.balance = Math.max(0, n.amount - n.settled)))
    }),
    $('应收核销成功')
  )
}
function E(e) {
  return o ? q(e) : f('/crm/sales-orders', { params: e })
}
function U(e) {
  return o ? R(e) : f(`/crm/sales-orders/${e}`)
}
function Z(e, t) {
  return o ? L(e, t) : g(`/crm/sales-orders/${e}`, t)
}
function j(e) {
  return o ? G(e) : f('/crm/receivables', { params: e })
}
function A(e) {
  return o ? H(e) : _('/crm/receivables', e)
}
function K(e) {
  return o ? N(e) : f('/crm/quotations', { params: e })
}
function V(e) {
  return o ? h(e) : e.id ? g(`/crm/quotations/${e.id}`, e) : _('/crm/quotations', e)
}
function W(e) {
  return o ? z(e) : x(`/crm/quotations/${e}`)
}
function ee(e) {
  return o ? D(e) : f('/crm/opportunities', { params: e })
}
function te(e) {
  return o ? C(e) : e.id ? g(`/crm/opportunities/${e.id}`, e) : _('/crm/opportunities', e)
}
function ie(e) {
  return o ? P(e) : x(`/crm/opportunities/${e}`)
}
function ne(e) {
  return o ? k(e) : g(`/crm/opportunities/${e}/convert`)
}
function oe(e) {
  return o ? B(e) : f('/crm/contracts', { params: e })
}
function re(e) {
  return o ? J(e) : e.id ? g(`/crm/contracts/${e.id}`, e) : _('/crm/contracts', e)
}
function se(e) {
  return o ? Q(e) : x(`/crm/contracts/${e}`)
}
function ue(e) {
  return o ? X(e) : f('/crm/invoices', { params: e })
}
function ce(e) {
  return o ? T(e) : e.id ? g(`/crm/invoices/${e.id}`, e) : _('/crm/invoices', e)
}
function ae(e) {
  return o ? F(e) : g(`/crm/invoices/${e}/issue`)
}
function de(e) {
  return o ? M(e) : _('/crm/receivables/settle', e)
}
export {
  V as _,
  W as a,
  ee as c,
  U as d,
  E as f,
  te as g,
  ce as h,
  ie as i,
  K as l,
  re as m,
  A as n,
  oe as o,
  ae as p,
  se as r,
  ue as s,
  ne as t,
  j as u,
  de as v,
  Z as y
}

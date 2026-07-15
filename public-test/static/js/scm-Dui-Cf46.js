import { C as y, D as p, E as P, M as n, O as h, T as g, b as v, g as s, k as a, w as u, x as c, y as O } from './index-DqMfCNbk.js'
var o = [
    {
      id: '1',
      code: 'PO202501150001',
      supplier: '苏州精工钢材有限公司',
      material: '45号圆钢 D50',
      qty: 500,
      received: 200,
      remain: 300,
      delivery: '2025-01-20',
      status: 'partial'
    },
    {
      id: '2',
      code: 'PO202501140002',
      supplier: '常州轴承制造厂',
      material: '轴承 6308',
      qty: 200,
      received: 0,
      remain: 200,
      delivery: '2025-01-18',
      status: 'sent'
    },
    {
      id: '3',
      code: 'PO202501130003',
      supplier: '无锡标准件有限公司',
      material: '螺栓 M16x60',
      qty: 1200,
      received: 1200,
      remain: 0,
      delivery: '2025-01-16',
      status: 'received'
    },
    {
      id: '4',
      code: 'PO202501120004',
      supplier: '南通铸造供应商',
      material: '泵体铸件',
      qty: 150,
      received: 0,
      remain: 150,
      delivery: '2025-01-14',
      status: 'closed'
    }
  ],
  d = [
    {
      id: '1',
      material: '45号圆钢 D50',
      supplier: '苏州精工钢材有限公司',
      price: 5.8,
      currency: '元',
      valid_from: '2025-01-01',
      valid_to: '2025-06-30',
      source: '年度合同'
    },
    {
      id: '2',
      material: '45号圆钢 D50',
      supplier: '南通钢材贸易公司',
      price: 6.1,
      currency: '元',
      valid_from: '2025-01-01',
      valid_to: '2025-03-31',
      source: '报价单'
    },
    {
      id: '3',
      material: '轴承 6308',
      supplier: '常州轴承制造厂',
      price: 85,
      currency: '元',
      valid_from: '2025-01-01',
      valid_to: '2025-12-31',
      source: '年度合同'
    },
    {
      id: '4',
      material: '螺栓 M16x60',
      supplier: '无锡标准件有限公司',
      price: 2.4,
      currency: '元',
      valid_from: '2024-07-01',
      valid_to: '2025-06-30',
      source: '比价结果'
    },
    {
      id: '5',
      material: '泵体铸件',
      supplier: '南通铸造供应商',
      price: 168,
      currency: '元',
      valid_from: '2025-02-01',
      valid_to: '2025-08-31',
      source: '报价单'
    }
  ],
  l = [
    {
      id: '1',
      code: 'PR202501150001',
      dept: '生产部',
      reason: '生产需求',
      need_date: '2025-01-20',
      status: 'draft',
      source: 'manual',
      created_at: '2025-01-15'
    },
    {
      id: '2',
      code: 'PR202501150002',
      dept: '生产部',
      reason: '安全库存补货',
      need_date: '2025-01-22',
      status: 'approved',
      source: 'mrp',
      created_at: '2025-01-15'
    },
    {
      id: '3',
      code: 'PR202501100003',
      dept: '设备部',
      reason: '设备维修',
      need_date: '2025-01-18',
      status: 'ordered',
      source: 'manual',
      created_at: '2025-01-10'
    },
    {
      id: '4',
      code: 'PR202501080004',
      dept: '研发部',
      reason: '研发试制',
      need_date: '2025-01-25',
      status: 'rejected',
      source: 'manual',
      created_at: '2025-01-08'
    }
  ],
  f = [
    {
      id: '1',
      code: 'PRT20250115001',
      po_code: 'PO202501140002',
      supplier: '常州轴承制造厂',
      material: '轴承 6308',
      qty: 20,
      reason: '尺寸超差',
      status: 'pending'
    },
    {
      id: '2',
      code: 'PRT20250110002',
      po_code: 'PO202501150001',
      supplier: '苏州精工钢材有限公司',
      material: '45号圆钢 D50',
      qty: 100,
      reason: '材质不合格',
      status: 'done'
    },
    {
      id: '3',
      code: 'PRT20250108003',
      po_code: 'PO202501120004',
      supplier: '南通铸造供应商',
      material: '泵体铸件',
      qty: 10,
      reason: '外观缺陷',
      status: 'pending'
    }
  ],
  _ = [
    { id: '1', code: 'PO202501150001', material: '45号圆钢 D50', qty: 500, delivery_date: '2025-01-20', status: 'pending' },
    { id: '2', code: 'PO202501100002', material: '轴承 6308', qty: 200, delivery_date: '2025-01-18', status: 'confirmed' },
    { id: '3', code: 'PO202501080003', material: '螺栓 M16x60', qty: 1500, delivery_date: '2025-01-21', status: 'rejected' }
  ],
  q = [
    { id: '1', code: 'FH20250115001', material: '45号圆钢 D50', qty: 500, carrier: '顺丰物流', tracking_no: 'SF1234567890', confirmed: !1 },
    { id: '2', code: 'FH20250113002', material: '轴承 6308', qty: 200, carrier: '德邦快运', tracking_no: 'DB9876543210', confirmed: !0 }
  ],
  $ = [
    { timestamp: '2025-01-15 09:30', content: '订单 PO202501150001 已创建', color: '#0bbd87', type: 'primary', hollow: !1 },
    { timestamp: '2025-01-15 10:15', content: '供应商已确认订单并计划发货', color: '#0bbd87', type: 'success', hollow: !1 },
    { timestamp: '2025-01-18 14:00', content: '货物已备齐，等待提货', color: '#0bbd87', type: 'primary', hollow: !1 },
    { timestamp: '2025-01-19 08:30', content: '承运商已揽件，运单号 SF1234567890', color: '#e6a23c', type: 'warning', hollow: !1 },
    { timestamp: '2025-01-20 18:00', content: '预计到货并完成收货', color: '#909399', type: 'info', hollow: !0 }
  ],
  w = [
    {
      period: '2025-01',
      order_code: 'PO202501150001',
      material: '45号圆钢 D50',
      order_qty: 500,
      delivered_qty: 500,
      accepted_qty: 480,
      amount: 2784,
      rec_status: 'pending'
    },
    {
      period: '2025-01',
      order_code: 'PO202501100002',
      material: '轴承 6308',
      order_qty: 200,
      delivered_qty: 200,
      accepted_qty: 200,
      amount: 17e3,
      rec_status: 'confirmed'
    }
  ]
async function R(e) {
  await s()
  let r = [...o]
  ;(e.code && (r = u(r, e.code, ['code', 'material'])),
    e.supplier && (r = u(r, e.supplier, ['supplier'])),
    e.status && (r = r.filter((i) => i.status === e.status)))
  const t = y(r, e.pageNum, e.pageSize)
  return v(t.list, t.total, t.pageNum, t.pageSize)
}
async function x(e) {
  await s()
  const r = Number(e.qty || 0),
    t = Number(e.received || 0)
  return (o.unshift({ id: g(), received: t, remain: Math.max(r - t, 0), ...e }), c('采购订单创建成功'))
}
async function S(e, r) {
  await s()
  const t = o.findIndex((i) => String(i.id) === e)
  if (t > -1) {
    const i = o[t],
      m = { ...i, ...r }
    ;((m.remain = Math.max(Number(m.qty || 0) - Number(m.received || 0), 0)), Object.assign(i, m))
  }
  return c('采购订单更新成功')
}
async function D(e) {
  await s()
  const r = o.findIndex((t) => String(t.id) === e)
  return (r > -1 && o.splice(r, 1), c('采购订单删除成功'))
}
async function b(e) {
  await s()
  let r = [...d]
  ;(e.material && (r = u(r, e.material, ['material'])),
    e.supplier && (r = u(r, e.supplier, ['supplier'])),
    e.source && (r = r.filter((i) => i.source === e.source)))
  const t = y(r, e.pageNum, e.pageSize)
  return v(t.list, t.total, t.pageNum, t.pageSize)
}
async function I(e) {
  return (await s(), d.unshift({ id: g(), ...e }), c('价格记录创建成功'))
}
async function N(e, r) {
  await s()
  const t = d.findIndex((i) => String(i.id) === e)
  return (t > -1 && Object.assign(d[t], r), c('价格记录更新成功'))
}
async function j(e) {
  await s()
  const r = d.findIndex((t) => String(t.id) === e)
  return (r > -1 && d.splice(r, 1), c('价格记录删除成功'))
}
async function L(e) {
  await s()
  let r = [...l]
  ;(e.code && (r = u(r, e.code, ['code', 'dept', 'reason'])),
    e.status && (r = r.filter((i) => i.status === e.status)),
    e.source && (r = r.filter((i) => i.source === e.source)))
  const t = y(r, e.pageNum, e.pageSize)
  return v(t.list, t.total, t.pageNum, t.pageSize)
}
async function z(e) {
  return (await s(), l.unshift({ id: g(), created_at: e.created_at || new Date().toISOString().slice(0, 10), ...e }), c('采购申请创建成功'))
}
async function M(e, r) {
  await s()
  const t = l.findIndex((i) => String(i.id) === e)
  return (t > -1 && Object.assign(l[t], r), c('采购申请更新成功'))
}
async function T(e) {
  await s()
  const r = l.findIndex((t) => String(t.id) === e)
  return (r > -1 && l.splice(r, 1), c('采购申请删除成功'))
}
async function k(e) {
  await s()
  let r = [...f]
  ;(e.code && (r = u(r, e.code, ['code', 'po_code', 'supplier', 'material'])), e.status && (r = r.filter((i) => i.status === e.status)))
  const t = y(r, e.pageNum, e.pageSize)
  return v(t.list, t.total, t.pageNum, t.pageSize)
}
async function F(e) {
  return (await s(), f.unshift({ id: g(), ...e }), c('采购退货单创建成功'))
}
async function H(e, r) {
  await s()
  const t = f.findIndex((i) => String(i.id) === e)
  return (t > -1 && Object.assign(f[t], r), c('采购退货单更新成功'))
}
async function B(e) {
  await s()
  const r = f.findIndex((t) => String(t.id) === e)
  return (r > -1 && f.splice(r, 1), c('采购退货单删除成功'))
}
async function C() {
  return (await s(), O({ orders: [..._], deliveries: [...q], timelineItems: [...$], recData: [...w] }))
}
async function E(e) {
  await s()
  const r = _.find((t) => t.id === e)
  return (r && (r.status = 'confirmed'), c('订单已确认'))
}
async function G(e) {
  await s()
  const r = _.find((t) => t.id === e)
  return (r && (r.status = 'rejected'), c('订单已驳回'))
}
async function A(e) {
  await s()
  const r = q.find((t) => t.id === e)
  return (r && (r.confirmed = !0), c(r ? `发货单 ${r.code} 确认成功` : '发货确认成功'))
}
function K(e) {
  return n ? R(e) : p('/scm/purchase-orders', { params: e })
}
function Q(e) {
  return n ? x(e) : h('/scm/purchase-orders', e)
}
function U(e, r) {
  return n ? S(e, r) : a(`/scm/purchase-orders/${e}`, r)
}
function V(e) {
  return n ? D(e) : P(`/scm/purchase-orders/${e}`)
}
function W() {
  return n ? C() : p('/scm/portal')
}
function X(e) {
  return n ? E(e) : a(`/scm/portal/orders/${e}/confirm`)
}
function Y(e) {
  return n ? G(e) : a(`/scm/portal/orders/${e}/reject`)
}
function Z(e) {
  return n ? A(e) : a(`/scm/portal/deliveries/${e}/confirm`)
}
function ee(e) {
  return n ? b(e) : p('/scm/prices', { params: e })
}
function re(e) {
  return n ? I(e) : h('/scm/prices', e)
}
function te(e, r) {
  return n ? N(e, r) : a(`/scm/prices/${e}`, r)
}
function ie(e) {
  return n ? j(e) : P(`/scm/prices/${e}`)
}
function ne(e) {
  return n ? L(e) : p('/scm/purchase-requests', { params: e })
}
function se(e) {
  return n ? z(e) : h('/scm/purchase-requests', e)
}
function ce(e, r) {
  return n ? M(e, r) : a(`/scm/purchase-requests/${e}`, r)
}
function ae(e) {
  return n ? T(e) : P(`/scm/purchase-requests/${e}`)
}
function ue(e) {
  return n ? k(e) : p('/scm/purchase-returns', { params: e })
}
function oe(e) {
  return n ? F(e) : h('/scm/purchase-returns', e)
}
function de(e, r) {
  return n ? H(e, r) : a(`/scm/purchase-returns/${e}`, r)
}
function le(e) {
  return n ? B(e) : P(`/scm/purchase-returns/${e}`)
}
export {
  te as _,
  se as a,
  de as b,
  V as c,
  ee as d,
  K as f,
  Y as g,
  W as h,
  Q as i,
  ae as l,
  ue as m,
  X as n,
  oe as o,
  ne as p,
  re as r,
  ie as s,
  Z as t,
  le as u,
  U as v,
  ce as y
}

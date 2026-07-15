import {
  C as o,
  D as s,
  E as O,
  M as f,
  N as r,
  O as S,
  S as h,
  T as k,
  _ as y,
  b as c,
  g as l,
  k as $,
  v as N,
  w as u,
  x as p
} from './index-DqMfCNbk.js'
import { c as q, d as P, f as x, i as M, l as T, n as H, p as J, r as Y, s as W, t as B, u as E } from './wms-B08sA-A0.js'
var be = g(B),
  G = g(M),
  _ = g(W),
  z = g(q),
  D = g(T),
  I = g(P),
  L = g(E),
  b = g(x)
function g(e) {
  return typeof structuredClone == 'function' ? structuredClone(e) : JSON.parse(JSON.stringify(e))
}
function d(e) {
  return String(e).padStart(2, '0')
}
function K(e = new Date()) {
  return `${e.getFullYear()}-${d(e.getMonth() + 1)}-${d(e.getDate())}`
}
function F(e = new Date()) {
  return `${K(e)} ${d(e.getHours())}:${d(e.getMinutes())}:${d(e.getSeconds())}`
}
function U(e = new Date()) {
  return `${e.getFullYear()}${d(e.getMonth() + 1)}${d(e.getDate())}`
}
function R(e, t) {
  return `${e}${U()}${t.slice(-4).padStart(4, '0')}`
}
function C(e, t) {
  return e.find((n) => String(n.id) === t)
}
function j(e, t) {
  const n = e.findIndex((i) => String(i.id) === t)
  return n > -1 ? (e.splice(n, 1), !0) : !1
}
async function A(e) {
  let t = [...G]
  ;(e.code && (t = u(t, e.code, ['code'])), e.name && (t = u(t, e.name, ['name'])), e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function V(e) {
  let t = [...z]
  ;(e.code && (t = u(t, e.code, ['code'])),
    e.type && (t = t.filter((i) => i.type === e.type)),
    e.supplier && (t = u(t, e.supplier, ['supplier'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function X(e) {
  const t = k(),
    n = {
      id: t,
      code: e.code || R('RK', t),
      type: e.type || 'purchase',
      material: e.material || '',
      qty: Number(e.qty ?? 0),
      warehouse: e.warehouse || '',
      supplier: e.supplier || (e.type === 'production' ? '总装车间完工来源' : '静态来源单据'),
      status: e.status || 'pending',
      created_at: e.created_at || F(),
      ...e
    }
  return (z.unshift(n), N(n, '新增入库单成功'))
}
async function Z(e, t) {
  const n = C(z, e)
  return n ? (Object.assign(n, t), h(n, '入库单更新成功')) : y.fail(404, '入库单不存在', null)
}
async function m(e) {
  return j(z, e) ? p('入库单删除成功') : y.fail(404, '入库单不存在', null)
}
async function ee(e) {
  let t = [..._]
  ;(e.code && (t = u(t, e.code, ['wo_code'])),
    e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function te(e) {
  const t = {
    id: k(),
    wo_code: e.wo_code || e.woCode || '',
    material: e.material || '',
    warehouse: e.warehouse || '',
    status: e.status || 'pending',
    created_at: e.created_at || F()
  }
  return (_.unshift(t), N(t, '新增领料单成功'))
}
async function ne(e, t) {
  const n = C(_, e)
  return n ? (Object.assign(n, t), h(n, '领料单更新成功')) : y.fail(404, '领料单不存在', null)
}
async function ie(e) {
  return j(_, e) ? p('领料单删除成功') : y.fail(404, '领料单不存在', null)
}
async function ue(e) {
  let t = [...b]
  ;(e.code && (t = u(t, e.code, ['code'])),
    e.fromWarehouse && (t = t.filter((i) => i.from_wh === e.fromWarehouse)),
    e.toWarehouse && (t = t.filter((i) => i.to_wh === e.toWarehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function re(e) {
  const t = k(),
    n = {
      id: t,
      code: e.code || R('DB', t),
      material: e.material || '',
      qty: Number(e.qty ?? 0),
      from_wh: e.from_wh || '',
      to_wh: e.to_wh || '',
      status: e.status || 'pending',
      out_time: e.out_time || ''
    }
  return (b.unshift(n), N(n, '新增调拨单成功'))
}
async function oe(e, t) {
  const n = C(b, e)
  return n ? (Object.assign(n, t), h(n, '调拨单更新成功')) : y.fail(404, '调拨单不存在', null)
}
async function ce(e) {
  let t = [...D]
  ;(e.code && (t = u(t, e.code, ['code', 'source'])),
    e.reason && (t = u(t, e.reason, ['reason'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function se(e) {
  const t = k(),
    n = {
      id: t,
      code: e.code || R('TH', t),
      type: e.type || 'return',
      source: e.source || '',
      material: e.material || '',
      qty: Number(e.qty ?? 0),
      reason: e.reason || '',
      status: e.status || 'pending'
    }
  return (D.unshift(n), N(n, '新增退料退货单成功'))
}
async function fe(e, t) {
  const n = C(D, e)
  return n ? (Object.assign(n, t), h(n, '退料退货单更新成功')) : y.fail(404, '退料退货单不存在', null)
}
async function le(e) {
  let t = [...I]
  ;(e.planCode && (t = u(t, e.planCode, ['plan_code'])),
    e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function ge(e) {
  let t = [...L]
  ;(e.planCode && (t = u(t, e.planCode, ['plan_code'])), e.material && (t = u(t, e.material, ['material'])))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function ae(e, t) {
  return (
    I.forEach((n) => {
      if (String(n.plan_code) !== e) return
      const i = t.find((w) => w.location === n.location && w.material === n.material)
      if (!i) return
      const a = Number(i.actual ?? n.actual_qty ?? n.book_qty ?? 0)
      ;((n.actual_qty = a), (n.diff = a - Number(n.book_qty ?? 0)), (n.status = 'completed'))
    }),
    L.forEach((n) => {
      if (String(n.plan_code) !== e) return
      const i = t.find((Q) => Q.material === n.material)
      if (!i) return
      const a = Number(i.actual ?? n.actual_qty ?? n.book_qty ?? 0),
        w = Number(n.book_qty ?? 0),
        v = a - w
      ;((n.actual_qty = a), (n.diff = v), (n.diff_rate = w > 0 ? `${((v / w) * 100).toFixed(2)}%` : '0.00%'))
    }),
    p('盘点结果提交成功')
  )
}
async function de(e, t) {
  return (
    L.forEach((n) => {
      if (String(n.plan_code) !== e) return
      const i = t.find((a) => a.material === n.material)
      i && (n.disposition = i.disposition)
    }),
    p('盘点差异处理已确认')
  )
}
async function we(e) {
  await l()
  let t = [...M]
  ;(e.code && (t = u(t, e.code, ['code'])), e.name && (t = u(t, e.name, ['name'])), e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function ye(e) {
  await l()
  let t = [...J]
  ;(e.code && (t = u(t, e.code, ['code'])), e.name && (t = u(t, e.name, ['name'])))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function Se(e) {
  await l()
  let t = [...q]
  ;(e.code && (t = u(t, e.code, ['code'])),
    e.type && (t = t.filter((i) => i.type === e.type)),
    e.supplier && (t = u(t, e.supplier, ['supplier'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function $e(e) {
  await l()
  let t = [...Y]
  ;(e.code && (t = u(t, e.code, ['code'])),
    e.customer && (t = u(t, e.customer, ['customer'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function he(e) {
  await l()
  let t = [...W]
  ;(e.code && (t = u(t, e.code, ['wo_code'])),
    e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function ke(e) {
  await l()
  let t = [...x]
  ;(e.code && (t = u(t, e.code, ['code'])),
    e.fromWarehouse && (t = t.filter((i) => i.from_wh === e.fromWarehouse)),
    e.toWarehouse && (t = t.filter((i) => i.to_wh === e.toWarehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function Ne(e) {
  await l()
  let t = [...T]
  ;(e.code && (t = u(t, e.code, ['code', 'source'])),
    e.reason && (t = u(t, e.reason, ['reason'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function pe(e) {
  await l()
  let t = [...H]
  ;(e.barcode && (t = u(t, e.barcode, ['barcode'])),
    e.operator && (t = u(t, e.operator, ['operator'])),
    e.startDate && (t = t.filter((i) => String(i.time).slice(0, 10) >= e.startDate)),
    e.endDate && (t = t.filter((i) => String(i.time).slice(0, 10) <= e.endDate)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function _e(e) {
  await l()
  let t = [...B]
  ;(e.code && (t = u(t, e.code, ['wo_code'])),
    e.material && (t = u(t, e.material, ['material'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function ze(e) {
  await l()
  let t = [...P]
  ;(e.planCode && (t = u(t, e.planCode, ['plan_code'])),
    e.warehouse && (t = t.filter((i) => i.warehouse === e.warehouse)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
async function Ce(e) {
  await l()
  let t = [...E]
  ;(e.planCode && (t = u(t, e.planCode, ['plan_code'])), e.material && (t = u(t, e.material, ['material'])))
  const n = o(t, e.pageNum, e.pageSize)
  return c(n.list, n.total, n.pageNum, n.pageSize)
}
function Re(e) {
  return r ? A(e) : f ? we(e) : s('/wms/inventory', { params: e })
}
function ve(e) {
  return f ? ye(e) : s('/wms/materials', { params: e })
}
function Oe(e) {
  return r ? le(e) : f ? ze(e) : s('/wms/stock-counts', { params: e })
}
function qe(e) {
  return r ? ge(e) : f ? Ce(e) : s('/wms/stock-count-diffs', { params: e })
}
function Pe(e) {
  return r ? V(e) : f ? Se(e) : s('/wms/receipts', { params: e })
}
function xe(e) {
  return r ? X(e) : S('/wms/receipts', e)
}
function Me(e, t) {
  return r ? Z(e, t) : $(`/wms/receipts/${e}`, t)
}
function Te(e) {
  return r ? m(e) : O(`/wms/receipts/${e}`)
}
function We(e) {
  return f ? $e(e) : s('/wms/deliveries', { params: e })
}
function Be(e) {
  return r ? ee(e) : f ? he(e) : s('/wms/picking', { params: e })
}
function Ee(e) {
  return r ? te(e) : S('/wms/picking', e)
}
function Ie(e, t) {
  return r ? ne(e, t) : $(`/wms/picking/${e}`, t)
}
function Fe(e) {
  return r ? ie(e) : O(`/wms/picking/${e}`)
}
function je(e) {
  return r ? ue(e) : f ? ke(e) : s('/wms/transfers', { params: e })
}
function Qe(e) {
  return r ? re(e) : S('/wms/transfers', e)
}
function He(e, t) {
  return r ? oe(e, t) : $(`/wms/transfers/${e}`, t)
}
function Je(e) {
  return r ? ce(e) : f ? Ne(e) : s('/wms/returns', { params: e })
}
function Ye(e) {
  return r ? se(e) : S('/wms/returns', e)
}
function Ge(e, t) {
  return r ? fe(e, t) : $(`/wms/returns/${e}`, t)
}
function Ke(e) {
  return f ? _e(e) : s('/wms/backflush', { params: e })
}
function Ue(e, t) {
  return r ? ae(e, t) : S(`/wms/stock-counts/${e}/complete`, { items: t })
}
function Ae(e, t) {
  return r ? de(e, t) : $(`/wms/stock-count-diffs/${e}`, { items: t })
}
function Ve(e) {
  return f ? pe(e) : s('/wms/barcode-scans', { params: e })
}
export {
  He as C,
  Ae as S,
  Oe as _,
  Qe as a,
  Me as b,
  Ke as c,
  Re as d,
  ve as f,
  qe as g,
  Je as h,
  Ye as i,
  Ve as l,
  Pe as m,
  Ee as n,
  Fe as o,
  Be as p,
  xe as r,
  Te as s,
  Ue as t,
  We as u,
  je as v,
  Ge as x,
  Ie as y
}

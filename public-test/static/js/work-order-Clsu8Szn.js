import { C as a, D as _, M as o, N as c, O as R, S as k, T as D, _ as p, b as w, g as s, k as g, v as I, w as h, y as i } from './index-DqMfCNbk.js'
import { a as b, i as N, n as z, o as O, r as f, s as d, t as L } from './work-order-_XyxRvo2.js'
var v = y(d),
  W = y(O),
  M = y(N),
  C = y(z),
  j = y(b),
  ye = y(L)
function y(e) {
  return typeof structuredClone == 'function' ? structuredClone(e) : JSON.parse(JSON.stringify(e))
}
function l(e) {
  return String(e).padStart(2, '0')
}
function q(e = new Date()) {
  return `${e.getFullYear()}-${l(e.getMonth() + 1)}-${l(e.getDate())}`
}
function T(e = new Date()) {
  return `${q(e)} ${l(e.getHours())}:${l(e.getMinutes())}:${l(e.getSeconds())}`
}
function F(e = new Date()) {
  return `${e.getFullYear()}${l(e.getMonth() + 1)}${l(e.getDate())}`
}
function J(e) {
  return `WO${F()}${e.slice(-4).padStart(4, '0')}`
}
function S(e) {
  return v.find((t) => String(t.id) === e)
}
function x(e) {
  return W.find((t) => String(t.id) === e)
}
async function P(e) {
  let t = [...v]
  ;(e.code && (t = h(t, e.code, ['code'])),
    e.status && (t = t.filter((n) => n.status === e.status)),
    e.priority && (t = t.filter((n) => n.priority === e.priority)),
    e.workshopId && (t = t.filter((n) => String(n.workshop_id || n.id) === e.workshopId)),
    e.workshopName && (t = t.filter((n) => String(n.workshop_name || '').includes(e.workshopName))),
    e.startDate && (t = t.filter((n) => String(n.planned_start_date || '') >= e.startDate)),
    e.endDate && (t = t.filter((n) => String(n.planned_end_date || '') <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function Y(e) {
  const t = S(e)
  if (!t) return p.fail(404, '工单不存在', null)
  const r = W.filter((n) => String(n.work_order_id || '') === e)
  return i({ ...t, operations: r })
}
async function G(e) {
  const t = D(),
    r = {
      id: t,
      code: e.code || J(t),
      wo_type: e.wo_type || 'production',
      material_id: e.material_id || e.material_code || '',
      material_code: e.material_code || '',
      material_name: e.material_name || '',
      planned_qty: e.planned_qty ?? 0,
      completed_qty: e.completed_qty ?? 0,
      defective_qty: e.defective_qty ?? 0,
      status: e.status || 'draft',
      priority: e.priority || 'normal',
      workshop_name: e.workshop_name || '',
      planned_start_date: e.planned_start_date || q(),
      planned_end_date: e.planned_end_date || q(),
      created_at: T(),
      ...e
    }
  return (v.unshift(r), I(r, '工单创建成功'))
}
async function U(e, t, r) {
  const n = S(e)
  return n
    ? ((n.status = t ? 'approved' : 'draft'), r && (n.approval_opinion = r), k(n, t ? '审核通过' : '审核驳回'))
    : p.fail(404, '工单不存在', null)
}
async function A(e) {
  const t = S(e)
  return t ? ((t.status = 'released'), k(t, '工单已下发')) : p.fail(404, '工单不存在', null)
}
async function B(e, t) {
  const r = S(e)
  return r
    ? ((r.status = 'closed'), (r.close_type = t.close_type), (r.close_reason = t.reason), (r.wip_disposition = t.wip_disposition), k(r, '工单已关闭'))
    : p.fail(404, '工单不存在', null)
}
async function E(e) {
  return i(W.filter((t) => String(t.work_order_id || '') === e))
}
async function K(e) {
  const t = x(e)
  if (t) return ((t.status = 'running'), (t.actual_start_time = T()), k(t, '工序已开工'))
  const r = (C.assigned || []).find((n) => String(n.id) === e)
  return r ? ((r.status = 'running'), k(r, '任务已开工')) : p.fail(404, '工序不存在', null)
}
async function Q(e, t) {
  const r = x(e)
  if (!r) return p.fail(404, '工序不存在', null)
  const n = T()
  ;((r.status = 'completed'),
    (r.qualified_qty = t.qualified_qty),
    (r.defective_qty = t.defective_qty),
    (r.actual_hours = t.actual_hours),
    (r.actual_end_time = n),
    (r.defect_reasons = t.defect_reasons || []))
  const u = S(String(r.work_order_id || ''))
  if (u) {
    const H = Number(t.qualified_qty || 0) + Number(t.defective_qty || 0)
    ;((u.completed_qty = Number(u.completed_qty || 0) + H),
      (u.defective_qty = Number(u.defective_qty || 0) + Number(t.defective_qty || 0)),
      Number(u.completed_qty || 0) >= Number(u.planned_qty || 0) ? (u.status = 'completed') : u.status !== 'closed' && (u.status = 'in_progress'))
  }
  return (
    M.unshift({
      wo_code: u?.code || '',
      time: n.slice(0, 16),
      status: 'submitted',
      qualified_qty: t.qualified_qty,
      defective_qty: t.defective_qty,
      defect_reasons: (t.defect_reasons || []).join(', '),
      actual_hours: t.actual_hours,
      worker: r.worker || r.assigned_worker_name || '-'
    }),
    k(r, '报工成功')
  )
}
async function V(e) {
  let t = [...M]
  ;(e.workOrderCode && (t = t.filter((n) => String(n.wo_code || '').includes(e.workOrderCode))),
    e.worker && (t = t.filter((n) => String(n.worker || '').includes(e.worker))),
    e.startDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) >= e.startDate)),
    e.endDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function X() {
  return i(C)
}
async function Z(e) {
  let t = [...j]
  ;(e.wo_code && (t = t.filter((n) => String(n.wo_code || '').includes(e.wo_code))),
    e.worker && (t = t.filter((n) => String(n.worker || '').includes(e.worker))),
    e.startDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) >= e.startDate)),
    e.endDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function m(e) {
  await s()
  let t = [...d]
  ;(e.code && (t = h(t, e.code, ['code'])),
    e.status && (t = t.filter((n) => n.status === e.status)),
    e.priority && (t = t.filter((n) => n.priority === e.priority)),
    e.workshopId && (t = t.filter((n) => String(n.workshop_id || n.id) === e.workshopId)),
    e.startDate && (t = t.filter((n) => n.planned_start_date >= e.startDate)),
    e.endDate && (t = t.filter((n) => n.planned_end_date <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function ee(e) {
  await s()
  const t = d.find((n) => String(n.id) === e)
  if (!t) return { code: 404, msg: '工单不存在', data: null }
  const r = O.filter((n) => String(n.work_order_id || '1') === e)
  return i({ ...t, operations: r })
}
async function te(e) {
  await s()
  const t = { id: D(), created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), ...e }
  return (d.unshift(t), i(t, '工单创建成功'))
}
async function re(e, t, r) {
  await s()
  const n = d.find((u) => String(u.id) === e)
  return (n && ((n.status = t ? 'approved' : 'draft'), r && (n.approval_opinion = r)), i(n || null, t ? '审核通过' : '审核驳回'))
}
async function ne(e) {
  await s()
  const t = d.find((r) => String(r.id) === e)
  return (t && (t.status = 'released'), i(t || null, '工单已下发'))
}
async function ie(e, t) {
  await s()
  const r = d.find((n) => String(n.id) === e)
  return (
    r && ((r.status = 'closed'), (r.close_type = t.close_type), (r.close_reason = t.reason), (r.wip_disposition = t.wip_disposition)),
    i(r || null, '工单已关闭')
  )
}
async function oe(e) {
  return (await s(), i(O.filter((t) => String(t.work_order_id || '1') === e)))
}
async function se(e) {
  await s()
  const t = O.find((r) => String(r.id) === e)
  return (t && ((t.status = 'running'), (t.actual_start_time = new Date().toISOString().slice(0, 19).replace('T', ' '))), i(t || null, '工序已开工'))
}
async function ue(e, t) {
  await s()
  const r = O.find((n) => String(n.id) === e)
  return (
    r &&
      ((r.status = 'completed'),
      (r.qualified_qty = t.qualified_qty),
      (r.defective_qty = t.defective_qty),
      (r.actual_hours = t.actual_hours),
      (r.actual_end_time = new Date().toISOString().slice(0, 19).replace('T', ' ')),
      (r.defect_reasons = t.defect_reasons)),
    N.unshift({
      wo_code: d.find((n) => n.id === r?.work_order_id)?.code || '',
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'submitted',
      qualified_qty: t.qualified_qty,
      defective_qty: t.defective_qty,
      defect_reasons: (t.defect_reasons || []).join(', '),
      actual_hours: t.actual_hours * 60,
      worker: r?.worker || '-'
    }),
    i(r || null, '报工成功')
  )
}
async function ce() {
  return (await s(), i(z))
}
async function fe(e) {
  await s()
  let t = [...N]
  ;(e.workOrderCode && (t = t.filter((n) => String(n.wo_code || '').includes(e.workOrderCode))),
    e.worker && (t = t.filter((n) => String(n.worker || '').includes(e.worker))),
    e.startDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) >= e.startDate)),
    e.endDate && (t = t.filter((n) => String(n.time || '').slice(0, 10) <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function de(e) {
  await s()
  let t = [...f]
  ;(e.keyword && (t = h(t, e.keyword, ['code', 'material', 'supplier', 'operation'])),
    e.status && (t = t.filter((n) => n.status === e.status)),
    e.supplier && (t = t.filter((n) => String(n.supplier).includes(e.supplier))))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
async function le(e) {
  await s()
  const t = {
    id: D(),
    code: e.code || '',
    material: e.material || '',
    qty: e.qty ?? 0,
    supplier: e.supplier || '',
    operation: e.operation || '',
    send_date: e.send_date || '',
    due_date: e.due_date || '',
    price: e.price ?? 0,
    status: e.status || 'sent'
  }
  return (f.unshift(t), i(t, '创建委外单成功'))
}
async function ae(e, t) {
  await s()
  const r = f.findIndex((n) => String(n.id) === e)
  return r > -1 ? ((f[r] = { ...f[r], ...t }), i(f[r], '更新委外单成功')) : i({ id: e, ...t }, '更新委外单成功')
}
async function _e(e, t) {
  await s()
  const r = f.findIndex((n) => String(n.id) === e)
  return r > -1 ? ((f[r].status = t), i(f[r], '更新委外状态成功')) : i({ id: e, status: t }, '更新委外状态成功')
}
async function we(e) {
  await s()
  let t = [...b]
  ;(e.wo_code && (t = t.filter((n) => String(n.wo_code).includes(e.wo_code))),
    e.worker && (t = t.filter((n) => String(n.worker).includes(e.worker))),
    e.startDate && (t = t.filter((n) => String(n.time).slice(0, 10) >= e.startDate)),
    e.endDate && (t = t.filter((n) => String(n.time).slice(0, 10) <= e.endDate)))
  const r = a(t, e.pageNum, e.pageSize)
  return w(r.list, r.total, r.pageNum, r.pageSize)
}
function Oe(e) {
  return c ? P(e) : o ? m(e) : _('/work-orders', { params: e })
}
function Se(e) {
  return c ? Y(e) : o ? ee(e) : _(`/work-orders/${e}`)
}
function $e(e) {
  return c ? G(e) : o ? te(e) : R('/work-orders', e)
}
function qe(e, t, r) {
  return c ? U(e, t, r) : o ? re(e, t, r) : g(`/work-orders/${e}/approve`, { approved: t, comment: r })
}
function De(e) {
  return c ? A(e) : o ? ne(e) : g(`/work-orders/${e}/release`)
}
function he(e, t) {
  return c ? B(e, t) : o ? ie(e, t) : g(`/work-orders/${e}/close`, t)
}
function Ne(e) {
  return c ? E(e) : o ? oe(e) : _(`/work-orders/${e}/operations`)
}
function ve(e) {
  return c ? K(e) : o ? se(e) : g(`/operations/${e}/start`)
}
function We(e, t) {
  return c ? Q(e, t) : o ? ue(e, t) : g(`/operations/${e}/report`, t)
}
function Te() {
  return c ? X() : o ? ce() : _('/work-orders/my-tasks')
}
function Re(e) {
  return c ? V(e) : o ? fe(e) : _('/work-orders/report-history', { params: e })
}
function be(e) {
  return o ? de(e) : _('/work-orders/outsource', { params: e })
}
function ze(e) {
  return o ? le(e) : R('/work-orders/outsource', e)
}
function Me(e, t) {
  return o ? ae(e, t) : g(`/work-orders/outsource/${e}`, t)
}
function Ce(e, t) {
  return o ? _e(e, t) : g(`/work-orders/outsource/${e}/status`, { status: t })
}
function xe(e) {
  return c ? Z(e).then($) : o ? we(e).then($) : _('/work-orders/trace-records', { params: e }).then($)
}
function $(e) {
  return { ...e, data: { ...e.data, list: (e.data?.list || []).map(ge) } }
}
function ge(e) {
  return {
    id: String(e.id || ''),
    wo_code: e.wo_code || '',
    operation_name: e.operation_name || e.op_name || '',
    worker: e.worker || '',
    qualified_qty: Number(e.qualified_qty ?? e.qualified ?? 0),
    defective_qty: Number(e.defective_qty ?? e.defective ?? 0),
    defect_reasons: e.defect_reasons || e.reasons || '',
    actual_hours: Number(e.actual_hours ?? e.hours ?? 0),
    time: e.time || ''
  }
}
export {
  Te as a,
  xe as c,
  Ne as d,
  De as f,
  Ce as g,
  Me as h,
  $e as i,
  Se as l,
  ve as m,
  he as n,
  be as o,
  We as p,
  ze as r,
  Re as s,
  qe as t,
  Oe as u
}

import { C as u, D as o, E as M, M as r, O as y, S as f, T as _, b as l, g as i, k as P, v as m, w, x as R, y as p } from './index-DqMfCNbk.js'
import { a as g, i as $, n as a, o as d, r as S, s as h, t as c } from './mrp-1tKwTMFn.js'
async function I(t) {
  return (
    await i(800, 1500),
    p({ runId: `MRP${Date.now()}`, plantId: t?.plantId || 'PLANT-001', startedAt: new Date().toISOString(), status: 'running' })
  )
}
async function N(t, e) {
  await i()
  let n = []
  ;(e.type === 'purchase' && (n = $), e.type === 'production' && (n = S), e.type === 'exception' && (n = c))
  const s = u(n, e.pageNum, e.pageSize)
  return l(s.list, s.total, s.pageNum, s.pageSize)
}
async function x(t, e) {
  return (await i(), R(`已确认 ${e.length} 条建议，运算批次 ${t}`))
}
var F = [
  {
    id: 'MRP202606300001',
    run_time: '2026-06-30 08:00:00',
    operator: '系统',
    scope: '一号工厂',
    date_range: '2026-07-01 ~ 2026-07-31',
    include_safety_stock: !0,
    include_in_transit: !0,
    lead_time_mode: '标准',
    strategy: '全量重算',
    orders: 12,
    purchase_suggestions: 5,
    transfer_suggestions: 2,
    production_suggestions: 4,
    suggestions: 11,
    status: 'completed'
  },
  {
    id: 'MRP202606290001',
    run_time: '2026-06-29 08:10:00',
    operator: '计划员',
    scope: '一号工厂',
    date_range: '2026-07-01 ~ 2026-07-31',
    include_safety_stock: !0,
    include_in_transit: !1,
    lead_time_mode: '标准',
    strategy: '净变更',
    orders: 9,
    purchase_suggestions: 3,
    transfer_suggestions: 1,
    production_suggestions: 2,
    suggestions: 6,
    status: 'completed'
  }
]
async function z(t) {
  await i()
  let e = [...F]
  ;(t.plantId && (e = e.filter((s) => s.scope === t.plantId)), t.status && (e = e.filter((s) => s.status === t.status)))
  const n = u(e, t.pageNum, t.pageSize)
  return l(n.list, n.total, n.pageNum, n.pageSize)
}
async function C(t) {
  await i()
  let e = [...a]
  ;(t.keyword && (e = w(e, t.keyword, ['material_code', 'material_name'])), t.type && (e = e.filter((s) => s.type === t.type)))
  const n = u(e, t.pageNum, t.pageSize)
  return l(n.list, n.total, n.pageNum, n.pageSize)
}
async function D(t) {
  await i()
  const e = { id: _(), ...t }
  return (a.unshift(e), m(e, '新增预测需求成功'))
}
async function k(t, e) {
  await i()
  const n = a.findIndex((s) => s.id === t)
  return n > -1 ? ((a[n] = { ...a[n], ...e }), f(a[n], '编辑预测需求成功')) : f({ id: t, ...e }, '编辑预测需求成功')
}
async function L(t) {
  await i()
  const e = a.findIndex((n) => n.id === t)
  return (e > -1 && a.splice(e, 1), R('删除预测需求成功'))
}
async function T(t) {
  await i()
  const e = t.plantIds || []
  return p({
    plantCapacity: e.length > 0 ? g.filter((n) => e.includes(n.plant)) : g,
    results: u(e.length > 0 ? d.filter((n) => e.includes(n.from_plant) || e.includes(n.to_plant)) : d, t.pageNum, t.pageSize).list
  })
}
async function v(t) {
  return (
    await i(),
    p({
      events: u(t.changeType ? c.filter((e) => e.type === t.changeType) : c, t.pageNum, t.pageSize).list.map((e, n) => ({
        id: e.id,
        type: e.type,
        detail: e.detail,
        time: `2026-06-${String(20 + n).padStart(2, '0')} 10:00:00`
      })),
      affected: h
    })
  )
}
function E(t) {
  return r ? I(t) : y('/mrp/run', t || {})
}
function O(t, e) {
  return r ? N(t, e) : o(`/mrp/runs/${t}/results`, { params: e })
}
function b(t, e) {
  return r ? x(t, e) : P(`/mrp/runs/${t}/confirm`, { ids: e })
}
function G(t) {
  return r ? z(t) : o('/mrp/history', { params: t })
}
function U(t) {
  return r ? C(t) : o('/mrp/forecast', { params: t })
}
function j(t) {
  return r ? D(t) : y('/mrp/forecast', t)
}
function q(t, e) {
  return r ? k(t, e) : P(`/mrp/forecast/${t}`, e)
}
function B(t) {
  return r ? L(t) : M(`/mrp/forecast/${t}`)
}
function J(t) {
  return r ? T(t) : o('/mrp/multi-plant', { params: t })
}
function K(t) {
  return r ? v(t) : o('/mrp/net-change', { params: t })
}
export { G as a, K as c, U as i, E as l, j as n, O as o, B as r, J as s, b as t, q as u }

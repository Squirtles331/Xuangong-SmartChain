import { C as h, D as l, E as w, M as p, O as v, S as m, T as b, b as E, g as c, k as W, v as x, w as D, x as $, y as g } from './index-DqMfCNbk.js'
var o = [
  { id: '1', workshop: '机加工车间', type: '电', usage: 12580, unit: 'kWh', cost: 11322, period: '2026-01', rate: 0.9 },
  { id: '2', workshop: '机加工车间', type: '水', usage: 856, unit: '吨', cost: 3424, period: '2026-01', rate: 4 },
  { id: '3', workshop: '机加工车间', type: '气', usage: 3200, unit: 'm3', cost: 9600, period: '2026-01', rate: 3 },
  { id: '4', workshop: '装配车间', type: '电', usage: 8920, unit: 'kWh', cost: 8028, period: '2026-01', rate: 0.9 },
  { id: '5', workshop: '装配车间', type: '水', usage: 420, unit: '吨', cost: 1680, period: '2026-01', rate: 4 },
  { id: '6', workshop: '装配车间', type: '气', usage: 1800, unit: 'm3', cost: 5400, period: '2026-01', rate: 3 },
  { id: '7', workshop: '热处理车间', type: '电', usage: 15600, unit: 'kWh', cost: 14040, period: '2026-01', rate: 0.9 },
  { id: '8', workshop: '热处理车间', type: '水', usage: 1200, unit: '吨', cost: 4800, period: '2026-01', rate: 4 },
  { id: '9', workshop: '热处理车间', type: '气', usage: 5600, unit: 'm3', cost: 16800, period: '2026-01', rate: 3 },
  { id: '10', workshop: '表面处理车间', type: '电', usage: 7100, unit: 'kWh', cost: 6390, period: '2026-01', rate: 0.9 },
  { id: '11', workshop: '表面处理车间', type: '水', usage: 680, unit: '吨', cost: 2720, period: '2026-01', rate: 4 },
  { id: '12', workshop: '表面处理车间', type: '气', usage: 2400, unit: 'm3', cost: 7200, period: '2026-01', rate: 3 },
  { id: '13', workshop: '机加工车间', type: '电', usage: 11800, unit: 'kWh', cost: 10620, period: '2026-02', rate: 0.9 },
  { id: '14', workshop: '装配车间', type: '电', usage: 9150, unit: 'kWh', cost: 8235, period: '2026-02', rate: 0.9 },
  { id: '15', workshop: '热处理车间', type: '电', usage: 14900, unit: 'kWh', cost: 13410, period: '2026-02', rate: 0.9 },
  { id: '16', workshop: '表面处理车间', type: '电', usage: 7350, unit: 'kWh', cost: 6615, period: '2026-02', rate: 0.9 }
]
function y(e) {
  return e ? (e === 'electricity' ? '电' : e === 'water' ? '水' : e === 'gas' ? '气' : e) : ''
}
async function L(e) {
  await c()
  let t = [...o]
  ;(e.keyword && (t = D(t, e.keyword, ['workshop', 'type', 'period'])),
    e.type && (t = t.filter((a) => a.type === y(e.type))),
    e.period && (t = t.filter((a) => a.period === e.period)))
  const i = h(t, e.pageNum, e.pageSize)
  return E(i.list, i.total, i.pageNum, i.pageSize)
}
async function N(e) {
  await c()
  const t = {
      id: e.id || b(),
      workshop: e.workshop || '',
      type: y(e.type) || '电',
      usage: e.usage ?? 0,
      unit: e.unit || 'kWh',
      cost: e.cost ?? Number((Number(e.usage || 0) * Number(e.rate || 0)).toFixed(2)),
      period: e.period || '',
      rate: e.rate ?? 0
    },
    i = o.findIndex((a) => a.id === t.id)
  return i > -1 ? ((o[i] = { ...o[i], ...t }), m(o[i], '编辑能耗明细成功')) : (o.unshift(t), x(t, '新增能耗明细成功'))
}
async function R(e) {
  await c()
  const t = o.findIndex((i) => i.id === e)
  return (t > -1 && o.splice(t, 1), $('删除能耗明细成功'))
}
async function S(e) {
  await c()
  const t = o.filter((r) => !((e?.start && r.period < e.start) || (e?.end && r.period > e.end))),
    i = t.filter((r) => r.type === '电').reduce((r, s) => r + s.usage, 0),
    a = t.filter((r) => r.type === '水').reduce((r, s) => r + s.usage, 0),
    d = t.filter((r) => r.type === '气').reduce((r, s) => r + s.usage, 0),
    f = Number((i * 785e-6 + d * 0.002).toFixed(2)),
    k = [...new Set(t.map((r) => r.period))].sort().map((r) => {
      const s = t.filter((n) => n.period === r)
      return {
        period: r,
        electricity: s.filter((n) => n.type === '电').reduce((n, u) => n + u.usage, 0),
        water: s.filter((n) => n.type === '水').reduce((n, u) => n + u.usage, 0),
        gas: s.filter((n) => n.type === '气').reduce((n, u) => n + u.usage, 0)
      }
    })
  return g({
    cards: [
      { title: '累计用电', value: i, unit: 'kWh', trend: 5.2 },
      { title: '累计用水', value: a, unit: '吨', trend: -3.1 },
      { title: '累计用气', value: d, unit: 'm3', trend: 8.7 },
      { title: '碳排放', value: f, unit: '吨CO2', trend: 4.6 }
    ],
    trend: k,
    structure: [
      { name: '电', value: i },
      { name: '水', value: a },
      { name: '气', value: d }
    ]
  })
}
async function I() {
  return (
    await c(),
    g({
      electric: {
        unit: 'kWh/件',
        xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
        actual: [12.5, 13.2, 11.8, 12],
        benchmark: [10, 9.8, 9.5, 9.2],
        advanced: [8, 7.8, 7.5, 7.2]
      },
      water: {
        unit: '吨/件',
        xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
        actual: [3.2, 3.5, 2.9, 3.1],
        benchmark: [2.8, 2.7, 2.5, 2.4],
        advanced: [2.2, 2.1, 2, 1.9]
      },
      gas: {
        unit: 'm3/件',
        xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
        actual: [8.5, 9, 7.8, 8.2],
        benchmark: [7, 6.8, 6.5, 6.3],
        advanced: [5.5, 5.3, 5, 4.8]
      }
    })
  )
}
function C(e) {
  return p ? L(e) : l('/energy/details', { params: e })
}
function M(e) {
  return p ? N(e) : e.id ? W(`/energy/details/${e.id}`, e) : v('/energy/details', e)
}
function z(e) {
  return p ? R(e) : w(`/energy/details/${e}`)
}
function B(e) {
  return p ? S(e) : l('/energy/overview', { params: e })
}
function F() {
  return p ? I() : l('/energy/benchmark')
}
export { M as a, B as i, F as n, C as r, z as t }

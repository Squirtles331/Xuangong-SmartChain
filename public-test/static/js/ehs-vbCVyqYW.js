import { C as f, D as p, E as v, M as s, O as u, S as d, T as g, b as h, g as r, k as y, v as E, w as m, x as w } from './index-DqMfCNbk.js'
var l = [
    {
      id: 'hazard-1',
      code: 'YH202606300001',
      location: '机加工一车间',
      desc: '冷却液泄漏，地面有打滑风险',
      level: 'moderate',
      status: 'open',
      finder: '李四',
      found_at: '2026-06-30'
    },
    {
      id: 'hazard-2',
      code: 'YH202606280002',
      location: '装配车间',
      desc: '安全护栏损坏，需立即更换',
      level: 'major',
      status: 'processing',
      finder: '王五',
      found_at: '2026-06-28'
    },
    {
      id: 'hazard-3',
      code: 'YH202606250003',
      location: '热处理车间',
      desc: '排风不畅，局部温度偏高',
      level: 'minor',
      status: 'closed',
      finder: '赵六',
      found_at: '2026-06-25'
    }
  ],
  o = [
    { id: 'emergency-1', name: '火灾爆炸应急预案', type: '火灾', level: 'I', responsible: '安全主管-陈工', last_drill: '2026-05-15' },
    { id: 'emergency-2', name: '危化品泄漏应急预案', type: '危化品', level: 'II', responsible: '车间主任-李四', last_drill: '2026-04-20' },
    { id: 'emergency-3', name: '机械伤害应急预案', type: '机械', level: 'II', responsible: '设备主管-王工', last_drill: '2026-03-10' },
    { id: 'emergency-4', name: '停电应急处置方案', type: '电力', level: 'III', responsible: '电工-张工', last_drill: '2026-02-05' }
  ],
  a = [
    {
      id: 'permit-1',
      code: 'ZYP202606300001',
      type: 'hot',
      location: '机加工一车间',
      applicant: '李四',
      apply_date: '2026-06-30',
      status: 'approved'
    },
    { id: 'permit-2', code: 'ZYP202606290002', type: 'height', location: '装配车间', applicant: '王五', apply_date: '2026-06-29', status: 'pending' },
    {
      id: 'permit-3',
      code: 'ZYP202606270003',
      type: 'confined',
      location: '污水处理区',
      applicant: '赵六',
      apply_date: '2026-06-27',
      status: 'closed'
    }
  ],
  c = [
    {
      id: 'training-1',
      title: '三级安全教育-新员工入厂',
      trainer: '安全主管-陈工',
      trainees: '孙八、周九、吴十',
      plan_date: '2026-06-30',
      status: 'completed'
    },
    { id: 'training-2', title: '消防演练培训', trainer: '消防队长-刘工', trainees: '全员', plan_date: '2026-07-05', status: 'pending' },
    { id: 'training-3', title: '危化品操作培训', trainer: '安全主管-陈工', trainees: '李四、王五、赵六', plan_date: '2026-05-20', status: 'expired' }
  ]
function $(e, t) {
  return `${e}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(t + 1).padStart(4, '0')}`
}
async function z(e) {
  await r()
  let t = [...l]
  ;(e.keyword && (t = m(t, e.keyword, ['desc', 'location', 'code'])),
    e.level && (t = t.filter((n) => n.level === e.level)),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = f(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function I(e) {
  await r()
  const t = {
      id: e.id || g(),
      code: e.code || $('YH', l.length),
      location: e.location || '',
      desc: e.desc || '',
      level: e.level || 'moderate',
      status: e.status || 'open',
      finder: e.finder || '',
      found_at: e.found_at || new Date().toISOString().slice(0, 10)
    },
    i = l.findIndex((n) => n.id === t.id)
  return i > -1 ? ((l[i] = { ...l[i], ...t }), d(l[i], '编辑隐患成功')) : (l.unshift(t), E(t, '新增隐患成功'))
}
async function _(e) {
  await r()
  const t = l.findIndex((i) => i.id === e)
  return (t > -1 && l.splice(t, 1), w('删除隐患成功'))
}
async function S(e) {
  await r()
  let t = [...o]
  ;(e.name && (t = m(t, e.name, ['name'])), e.type && (t = t.filter((n) => n.type === e.type)))
  const i = f(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function x(e) {
  await r()
  const t = {
      id: e.id || g(),
      name: e.name || '',
      type: e.type || '火灾',
      level: e.level || 'II',
      responsible: e.responsible || '',
      last_drill: e.last_drill || ''
    },
    i = o.findIndex((n) => n.id === t.id)
  return i > -1 ? ((o[i] = { ...o[i], ...t }), d(o[i], '编辑预案成功')) : (o.unshift(t), E(t, '新增预案成功'))
}
async function P(e) {
  await r()
  const t = o.find((i) => i.id === e)
  return (t && (t.last_drill = new Date().toISOString().slice(0, 10)), d(t || { id: e }, '应急演练完成'))
}
async function H(e) {
  await r()
  let t = [...a]
  ;(e.keyword && (t = m(t, e.keyword, ['location', 'code'])),
    e.type && (t = t.filter((n) => n.type === e.type)),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = f(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function D(e) {
  await r()
  const t = {
      id: e.id || g(),
      code: e.code || $('ZYP', a.length),
      type: e.type || 'hot',
      location: e.location || '',
      applicant: e.applicant || '',
      apply_date: e.apply_date || new Date().toISOString().slice(0, 10),
      status: e.status || 'pending'
    },
    i = a.findIndex((n) => n.id === t.id)
  return i > -1 ? ((a[i] = { ...a[i], ...t }), d(a[i], '编辑作业票成功')) : (a.unshift(t), E(t, '新增作业票成功'))
}
async function L(e) {
  await r()
  const t = a.findIndex((i) => i.id === e)
  return (t > -1 && a.splice(t, 1), w('删除作业票成功'))
}
async function N(e) {
  await r()
  let t = [...c]
  ;(e.title && (t = m(t, e.title, ['title'])), e.status && (t = t.filter((n) => n.status === e.status)))
  const i = f(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function T(e) {
  await r()
  const t = {
      id: e.id || g(),
      title: e.title || '',
      trainer: e.trainer || '',
      trainees: e.trainees || '',
      plan_date: e.plan_date || '',
      status: e.status || 'pending'
    },
    i = c.findIndex((n) => n.id === t.id)
  return i > -1 ? ((c[i] = { ...c[i], ...t }), d(c[i], '编辑培训记录成功')) : (c.unshift(t), E(t, '新增培训记录成功'))
}
async function Y(e) {
  await r()
  const t = c.find((i) => i.id === e)
  return (t && (t.status = 'completed'), d(t || { id: e }, '培训完成'))
}
function k(e) {
  return s ? z(e) : p('/ehs/hazards', { params: e })
}
function O(e) {
  return s ? I(e) : e.id ? y(`/ehs/hazards/${e.id}`, e) : u('/ehs/hazards', e)
}
function R(e) {
  return s ? _(e) : v(`/ehs/hazards/${e}`)
}
function Z(e) {
  return s ? S(e) : p('/ehs/emergency', { params: e })
}
function C(e) {
  return s ? x(e) : e.id ? y(`/ehs/emergency/${e.id}`, e) : u('/ehs/emergency', e)
}
function M(e) {
  return s ? P(e) : u(`/ehs/emergency/${e}/drill`, {})
}
function j(e) {
  return s ? H(e) : p('/ehs/permits', { params: e })
}
function G(e) {
  return s ? D(e) : e.id ? y(`/ehs/permits/${e.id}`, e) : u('/ehs/permits', e)
}
function U(e) {
  return s ? L(e) : v(`/ehs/permits/${e}`)
}
function q(e) {
  return s ? N(e) : p('/ehs/training', { params: e })
}
function A(e) {
  return s ? T(e) : e.id ? y(`/ehs/training/${e.id}`, e) : u('/ehs/training', e)
}
function B(e) {
  return s ? Y(e) : u(`/ehs/training/${e}/complete`, {})
}
export { k as a, M as c, G as d, A as f, Z as i, C as l, R as n, j as o, U as r, q as s, B as t, O as u }

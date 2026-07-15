import { C as p, D as s, E as w, M as r, O as f, S as d, T as m, b as h, g as a, k as y, v as _, w as k, x as g, y as v } from './index-DqMfCNbk.js'
var l = [
    {
      id: 'emp-1',
      code: 'EMP2026001',
      name: '张建国',
      department: '机加工一车间',
      position: '数控车工',
      phone: '13800138001',
      hire_date: '2022-03-01',
      status: 'active'
    },
    {
      id: 'emp-2',
      code: 'EMP2026002',
      name: '李卫国',
      department: '机加工一车间',
      position: '钻床操作工',
      phone: '13800138002',
      hire_date: '2023-06-15',
      status: 'active'
    },
    {
      id: 'emp-3',
      code: 'EMP2026003',
      name: '王大明',
      department: '装配车间',
      position: '装配工',
      phone: '13800138003',
      hire_date: '2021-09-08',
      status: 'active'
    },
    {
      id: 'emp-4',
      code: 'EMP2026004',
      name: '赵晓明',
      department: '机加工二车间',
      position: '加工中心操作工',
      phone: '13800138004',
      hire_date: '2024-01-10',
      status: 'active'
    },
    {
      id: 'emp-5',
      code: 'EMP2026005',
      name: '陈小丹',
      department: '品质部',
      position: '质检员',
      phone: '13800138005',
      hire_date: '2022-11-20',
      status: 'inactive'
    }
  ],
  u = [
    { id: 'att-1', employee: '张建国', date: '2026-06-28', clock_in: '07:53', clock_out: '17:12', result: 'normal' },
    { id: 'att-2', employee: '李卫国', date: '2026-06-28', clock_in: '08:18', clock_out: '17:05', result: 'late' },
    { id: 'att-3', employee: '王大明', date: '2026-06-28', clock_in: '07:58', clock_out: '17:18', result: 'normal' },
    { id: 'att-4', employee: '赵晓明', date: '2026-06-28', clock_in: '', clock_out: '', result: 'absent' }
  ],
  o = [
    { id: 'piece-1', operation: '下料', unit_price: 2.5, unit: '件', qualified_bonus: 0.5, defective_penalty: 5 },
    { id: 'piece-2', operation: '粗车', unit_price: 8, unit: '件', qualified_bonus: 1, defective_penalty: 15 },
    { id: 'piece-3', operation: '精车', unit_price: 12, unit: '件', qualified_bonus: 1.5, defective_penalty: 20 },
    { id: 'piece-4', operation: '钻孔', unit_price: 3, unit: '件', qualified_bonus: 0.3, defective_penalty: 8 },
    { id: 'piece-5', operation: '磨削', unit_price: 10, unit: '件', qualified_bonus: 1, defective_penalty: 18 },
    { id: 'piece-6', operation: '装配', unit_price: 15, unit: '台', qualified_bonus: 2, defective_penalty: 30 }
  ],
  x = [
    { title: '本月计件工资总额', value: 186500, trend: 8.5 },
    { title: '人均计件工资', value: 9325, trend: 3.2 },
    { title: '合格奖励总额', value: 28500, trend: -2.1 },
    { title: '不良扣款总额', value: 4200, trend: -15.3 }
  ],
  c = [
    { id: 'schedule-1', team: '甲班', shift: 'day', members: '张建国、李卫国、周海峰', leader: '张建国' },
    { id: 'schedule-2', team: '乙班', shift: 'night', members: '王大明、赵晓明、吴春林', leader: '王大明' },
    { id: 'schedule-3', team: '丙班', shift: 'middle', members: '陈小丹、刘志国', leader: '刘志国' }
  ],
  H = [
    {
      id: 'dept-machining-1',
      name: '机加工一车间',
      children: [
        { id: 'emp-1', name: '张建国' },
        { id: 'emp-2', name: '李卫国' }
      ]
    },
    { id: 'dept-machining-2', name: '机加工二车间', children: [{ id: 'emp-4', name: '赵晓明' }] },
    { id: 'dept-assembly', name: '装配车间', children: [{ id: 'emp-3', name: '王大明' }] },
    { id: 'dept-quality', name: '品质部', children: [{ id: 'emp-5', name: '陈小丹' }] }
  ],
  S = {
    'emp-1': [
      { id: 'skill-1', skill_name: '数控车削', level: 5, cert_number: 'NC20230001', expire_date: '2027-12-31' },
      { id: 'skill-2', skill_name: '磨削加工', level: 3, cert_number: '', expire_date: '' }
    ],
    'emp-2': [
      { id: 'skill-3', skill_name: '钻孔加工', level: 4, cert_number: 'DR20240005', expire_date: '2027-06-30' },
      { id: 'skill-4', skill_name: '首件自检', level: 3, cert_number: '', expire_date: '' }
    ],
    'emp-3': [
      { id: 'skill-5', skill_name: '总装作业', level: 5, cert_number: 'AS20220003', expire_date: '2027-08-15' },
      { id: 'skill-6', skill_name: '性能测试', level: 3, cert_number: '', expire_date: '' }
    ],
    'emp-4': [
      { id: 'skill-7', skill_name: '加工中心编程', level: 4, cert_number: 'MC20250002', expire_date: '2028-01-10' },
      { id: 'skill-8', skill_name: '换刀调机', level: 4, cert_number: '', expire_date: '' }
    ],
    'emp-5': [{ id: 'skill-9', skill_name: '来料检验', level: 5, cert_number: 'QI20240001', expire_date: '2027-11-20' }]
  }
async function $(e) {
  await a()
  let t = [...l]
  ;(e.keyword && (t = k(t, e.keyword, ['code', 'name', 'position'])),
    e.department && (t = t.filter((n) => n.department === e.department)),
    e.status && (t = t.filter((n) => n.status === e.status)))
  const i = p(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function b(e) {
  await a()
  const t = { id: m(), code: e.code || `EMP${new Date().getFullYear()}${String(l.length + 1).padStart(3, '0')}`, ...e }
  return (l.unshift(t), _(t, '新增员工成功'))
}
async function E(e, t) {
  await a()
  const i = l.findIndex((n) => n.id === e)
  return i > -1 ? ((l[i] = { ...l[i], ...t }), d(l[i], '编辑员工成功')) : d({ id: e, ...t }, '编辑员工成功')
}
async function P(e) {
  await a()
  const t = l.findIndex((i) => i.id === e)
  return (t > -1 && l.splice(t, 1), g('删除员工成功'))
}
async function M(e) {
  await a()
  let t = [...u]
  ;(e.employee && (t = k(t, e.employee, ['employee'])),
    e.date && (t = t.filter((n) => n.date === e.date)),
    e.result && (t = t.filter((n) => n.result === e.result)))
  const i = p(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function A(e) {
  await a()
  const t = { id: m(), ...e }
  return (u.unshift(t), _(t, '新增考勤成功'))
}
async function I(e, t) {
  await a()
  const i = u.findIndex((n) => n.id === e)
  return i > -1 ? ((u[i] = { ...u[i], ...t }), d(u[i], '编辑考勤成功')) : d({ id: e, ...t }, '编辑考勤成功')
}
async function D(e) {
  await a()
  const t = u.findIndex((i) => i.id === e)
  return (t > -1 && u.splice(t, 1), g('删除考勤成功'))
}
async function L(e) {
  await a()
  let t = [...o]
  e.keyword && (t = k(t, e.keyword, ['operation']))
  const i = p(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function N(e) {
  await a()
  const t = { id: m(), ...e }
  return (o.unshift(t), _(t, '新增计件单价成功'))
}
async function R(e, t) {
  await a()
  const i = o.findIndex((n) => n.id === e)
  return i > -1 ? ((o[i] = { ...o[i], ...t }), d(o[i], '编辑计件单价成功')) : d({ id: e, ...t }, '编辑计件单价成功')
}
async function z() {
  return (await a(), v(x))
}
async function q(e) {
  await a()
  let t = [...c]
  ;(e.team && (t = k(t, e.team, ['team', 'leader', 'members'])), e.shift && (t = t.filter((n) => n.shift === e.shift)))
  const i = p(t, e.pageNum, e.pageSize)
  return h(i.list, i.total, i.pageNum, i.pageSize)
}
async function C(e) {
  await a()
  const t = { id: m(), ...e }
  return (c.unshift(t), _(t, '新增排班成功'))
}
async function T(e, t) {
  await a()
  const i = c.findIndex((n) => n.id === e)
  return i > -1 ? ((c[i] = { ...c[i], ...t }), d(c[i], '编辑排班成功')) : d({ id: e, ...t }, '编辑排班成功')
}
async function B(e) {
  await a()
  const t = c.findIndex((i) => i.id === e)
  return (t > -1 && c.splice(t, 1), g('删除排班成功'))
}
async function F() {
  return (await a(), v({ employees: H, skillsByEmployee: S }))
}
function O(e) {
  return r ? $(e) : s('/hr/employees', { params: e })
}
function Q(e) {
  return r ? b(e) : f('/hr/employees', e)
}
function U(e, t) {
  return r ? E(e, t) : y(`/hr/employees/${e}`, t)
}
function Y(e) {
  return r ? P(e) : w(`/hr/employees/${e}`)
}
function j(e) {
  return r ? M(e) : s('/hr/attendance', { params: e })
}
function J(e) {
  return r ? A(e) : f('/hr/attendance', e)
}
function K(e, t) {
  return r ? I(e, t) : y(`/hr/attendance/${e}`, t)
}
function V(e) {
  return r ? D(e) : w(`/hr/attendance/${e}`)
}
function W(e) {
  return r ? L(e) : s('/hr/piecework', { params: e })
}
function X(e) {
  return r ? N(e) : f('/hr/piecework', e)
}
function Z(e, t) {
  return r ? R(e, t) : y(`/hr/piecework/${e}`, t)
}
function ee() {
  return r ? z() : s('/hr/piecework/summary')
}
function te(e) {
  return r ? q(e) : s('/hr/schedule', { params: e })
}
function ie(e) {
  return r ? C(e) : f('/hr/schedule', e)
}
function ne(e, t) {
  return r ? T(e, t) : y(`/hr/schedule/${e}`, t)
}
function re(e) {
  return r ? B(e) : w(`/hr/schedule/${e}`)
}
function ae() {
  return r ? F() : s('/hr/skill-matrix')
}
export {
  ne as _,
  V as a,
  j as c,
  ee as d,
  te as f,
  Z as g,
  U as h,
  ie as i,
  O as l,
  K as m,
  Q as n,
  Y as o,
  ae as p,
  X as r,
  re as s,
  J as t,
  W as u
}

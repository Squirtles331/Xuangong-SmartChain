import { r as $ } from './rolldown-runtime-b3L32Ng1.js'
import { C as g, D as m, E as h, M as o, O as y, T as O, b as w, g as c, k as S, w as p, x as d, y as N } from './index-DqMfCNbk.js'
import { t as x } from './mock-Ds7FPrnc.js'
var _ = $(x(), 1),
  s = [
    {
      id: '1',
      name: '玄工智链集团',
      code: 'ORG-GROUP-001',
      type: 'group',
      children: [
        {
          id: '2',
          name: '玄工重工有限公司',
          code: 'ORG-COMP-001',
          type: 'company',
          children: [
            {
              id: '3',
              name: '一号工厂',
              code: 'ORG-PLANT-001',
              type: 'plant',
              children: [
                {
                  id: '4',
                  name: '机加工一车间',
                  code: 'ORG-WS-001',
                  type: 'workshop',
                  children: [
                    { id: '41', name: '产线 A', code: 'ORG-LINE-001', type: 'line' },
                    { id: '42', name: '产线 B', code: 'ORG-LINE-002', type: 'line' }
                  ]
                },
                { id: '5', name: '机加工二车间', code: 'ORG-WS-002', type: 'workshop' },
                { id: '6', name: '装配车间', code: 'ORG-WS-003', type: 'workshop' }
              ]
            }
          ]
        }
      ]
    }
  ],
  J = _.default.mock({
    'list|12': [
      {
        'id|+1': 1,
        code: /(01|02|03|04)\.\d{2}\.\d{3}-\d{5}/,
        name: '@pick(["45号圆钢","6308轴承","M16x60螺栓","XJP-100泵体","DS-50传动轴","泵壳","耐磨环","8x7x30键","叶轮铸件","轴承座","46号液压油","VL-300阀门组件"])',
        spec: '@pick(["D50","SKF 6308","M16x60","100m³/h","D50x500","标准件","耐磨型","8x7x30","铸造件","标准型","46号","DN300"])',
        'type|1': ['purchased', 'purchased', 'manufactured', 'manufactured', 'outsourced'],
        unit: '@pick(["千克","件","套","米","升"])',
        category: '@pick(["原材料","钢材","圆钢","钢板","外购件","轴承","紧固件","密封件","半成品","成品","辅料","包装材料"])'
      }
    ]
  }).list,
  a = [
    {
      id: '1',
      code: 'EQ0000000001',
      name: '数控车床',
      model: 'CK6150',
      workshop: '机加工一车间',
      status: 'running',
      purchase_date: '2023-03-12',
      commission_date: '2023-04-01'
    },
    {
      id: '2',
      code: 'EQ0000000002',
      name: '数控车床',
      model: 'CK6150',
      workshop: '机加工一车间',
      status: 'idle',
      purchase_date: '2023-05-20',
      commission_date: '2023-06-08'
    },
    {
      id: '3',
      code: 'EQ0000000003',
      name: '钻床',
      model: 'Z3050',
      workshop: '机加工一车间',
      status: 'running',
      purchase_date: '2022-11-18',
      commission_date: '2022-12-06'
    },
    {
      id: '4',
      code: 'EQ0000000004',
      name: '磨床',
      model: 'M1432',
      workshop: '机加工一车间',
      status: 'repair',
      purchase_date: '2021-09-15',
      commission_date: '2021-10-10'
    },
    {
      id: '5',
      code: 'EQ0000000005',
      name: '加工中心',
      model: 'VMC850',
      workshop: '机加工二车间',
      status: 'maintenance',
      purchase_date: '2024-01-09',
      commission_date: '2024-01-28'
    }
  ]
async function L() {
  return (await c(), N(s))
}
function R(e) {
  return JSON.parse(JSON.stringify(e))
}
function k(e, n, t) {
  return e
    .map((r) => {
      const u = Array.isArray(r.children) ? k(r.children, n, t) : [],
        i = !n || String(r.name).includes(n) || String(r.code || '').includes(n),
        f = !t || r.type === t
      return (i && f) || u.length > 0 ? { ...r, children: u } : null
    })
    .filter(Boolean)
}
function E(e, n = '-') {
  return e.flatMap((t) => [
    {
      id: String(t.id),
      name: String(t.name),
      code: String(t.code || '-'),
      type: String(t.type),
      parentName: n,
      childCount: Array.isArray(t.children) ? t.children.length : 0
    },
    ...(Array.isArray(t.children) ? E(t.children, String(t.name)) : [])
  ])
}
async function T(e) {
  await c()
  const n = R(s),
    t = !e?.keyword && !e?.type ? n : k(n, e?.keyword, e?.type),
    r = E(t),
    u = e?.nodeId ? r.filter((f) => f.id === e.nodeId || A(t, e.nodeId, f.id)) : r,
    i = g(u, e?.pageNum ?? 1, e?.pageSize ?? (u.length || 10))
  return w(i.list, i.total, i.pageNum, i.pageSize)
}
async function I(e) {
  return (await c(), N(l(s, e)))
}
function l(e, n) {
  for (const t of e) {
    if (String(t.id) === n) return t
    if (t.children?.length) {
      const r = l(t.children, n)
      if (r) return r
    }
  }
  return null
}
function A(e, n, t) {
  const r = l(e, n)
  if (!r) return !1
  if (String(r.id) === t) return !0
  const u = [...(r.children || [])]
  for (; u.length; ) {
    const i = u.pop()
    if (i) {
      if (String(i.id) === t) return !0
      i.children?.length && u.push(...i.children)
    }
  }
  return !1
}
function q(e, n) {
  for (let t = 0; t < e.length; t += 1) {
    if (String(e[t].id) === n) return (e.splice(t, 1), !0)
    if (e[t].children?.length && q(e[t].children, n)) return !0
  }
  return !1
}
async function D(e) {
  await c()
  const n = { id: O(), name: e.name, code: e.code, type: e.type, children: [] }
  if (e.parentId) {
    const t = l(s, e.parentId)
    t && (Array.isArray(t.children) || (t.children = []), t.children.push(n))
  } else s.push(n)
  return d('组织节点创建成功')
}
async function G(e, n) {
  await c()
  const t = l(s, e)
  return (t && ((t.name = n.name), (t.code = n.code)), d('组织节点更新成功'))
}
async function M(e) {
  return (await c(), q(s, e), d('组织节点删除成功'))
}
async function C(e) {
  await c()
  let n = [...a]
  ;(e.name && (n = p(n, e.name, ['name'])),
    e.workshop && (n = p(n, e.workshop, ['workshop'])),
    e.status && (n = n.filter((r) => r.status === e.status)))
  const t = g(n, e.pageNum, e.pageSize)
  return w(t.list, t.total, t.pageNum, t.pageSize)
}
async function P(e) {
  await c()
  const n = { id: O(), ...e }
  return (a.unshift(n), d('设备创建成功'))
}
async function v(e, n) {
  await c()
  const t = a.findIndex((r) => String(r.id) === e)
  return (t > -1 && Object.assign(a[t], n), d('设备更新成功'))
}
async function Q(e) {
  await c()
  const n = a.findIndex((t) => String(t.id) === e)
  return (n > -1 && a.splice(n, 1), d('设备删除成功'))
}
function W() {
  return o ? L() : m('/mdm/org-tree')
}
function b(e) {
  return o ? I(e) : m(`/mdm/org-tree/${e}`)
}
function F(e) {
  return o ? T(e) : m('/mdm/org-tree/list', { params: e })
}
function V(e) {
  return o ? D(e) : y('/mdm/org-tree', e)
}
function j(e, n) {
  return o ? G(e, n) : S(`/mdm/org-tree/${e}`, n)
}
function U(e) {
  return o ? M(e) : h(`/mdm/org-tree/${e}`)
}
function X(e) {
  return o ? C(e) : m('/mdm/equipments', { params: e })
}
function Z(e) {
  return o ? P(e) : y('/mdm/equipments', e)
}
function H(e, n) {
  return o ? v(e, n) : S(`/mdm/equipments/${e}`, n)
}
function Y(e) {
  return o ? Q(e) : h(`/mdm/equipments/${e}`)
}
export { X as a, F as c, U as i, H as l, V as n, b as o, Y as r, W as s, Z as t, j as u }

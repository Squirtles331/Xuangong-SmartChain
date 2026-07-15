import { C as m, S as g, T as w, _ as o, b as N, v, w as i, x as S } from './index-DqMfCNbk.js'
var d = [
    {
      id: 'template-1',
      name: '钢材来料检验模板',
      category: 'raw',
      itemCount: 3,
      items: [
        { name: '外观', type: 'sensory', standard: '无锈蚀、无裂纹', required: !0 },
        { name: '直径', type: 'measure', standard: '50.0', required: !0 },
        { name: '材质证明', type: 'count', standard: '齐全', required: !0 }
      ]
    },
    {
      id: 'template-2',
      name: '泵体过程检验模板',
      category: 'semi-finished',
      itemCount: 3,
      items: [
        { name: '尺寸偏差', type: 'measure', standard: '100.0', required: !0 },
        { name: '硬度', type: 'measure', standard: '45.0', required: !0 },
        { name: '表面状态', type: 'sensory', standard: '无磕碰', required: !0 }
      ]
    },
    {
      id: 'template-3',
      name: '成品完工检验模板',
      category: 'finished',
      itemCount: 3,
      items: [
        { name: '流量测试', type: 'measure', standard: '100.0', required: !0 },
        { name: '密封性', type: 'count', standard: '通过', required: !0 },
        { name: '外观清洁', type: 'sensory', standard: '无油污', required: !0 }
      ]
    }
  ],
  k = [
    {
      id: 'inspection-1',
      code: 'IQC-2026070001',
      category: 'incoming',
      material: '45#圆钢 D50',
      lot: 'L2026071001',
      qty: 120,
      status: 'pending',
      verdict: '',
      sourceCode: 'RK-2026071001',
      sourceName: '来料收货单',
      sourceType: 'receipt',
      templateName: '钢材来料检验模板',
      supplier: '华东钢材供应有限公司',
      warehouse: '原材料仓',
      createdAt: '2026-07-10 09:20',
      items: r(d[0].items)
    },
    {
      id: 'inspection-2',
      code: 'IQC-2026070002',
      category: 'incoming',
      material: '轴承 6308',
      lot: 'L2026071103',
      qty: 60,
      status: 'completed',
      verdict: 'pass',
      sourceCode: 'RK-2026071103',
      sourceName: '到货收货单',
      sourceType: 'receipt',
      templateName: '钢材来料检验模板',
      supplier: '苏州轴承制造厂',
      warehouse: '标准件仓',
      createdAt: '2026-07-11 14:35',
      items: r(d[0].items)
    },
    {
      id: 'inspection-3',
      code: 'IPQC-2026070001',
      category: 'process',
      material: '泵壳半成品 XJP-100',
      lot: 'WIP-2026071201',
      qty: 24,
      status: 'in_progress',
      verdict: '',
      sourceCode: 'GX-2026071201',
      sourceName: '工序执行任务',
      sourceType: 'operation',
      templateName: '泵体过程检验模板',
      workOrderCode: 'MO-2026071201',
      operationName: '精加工',
      createdAt: '2026-07-12 10:10',
      items: r(d[1].items)
    },
    {
      id: 'inspection-4',
      code: 'IPQC-2026070002',
      category: 'process',
      material: '密封座组件',
      lot: 'WIP-2026071205',
      qty: 30,
      status: 'completed',
      verdict: 'rework',
      sourceCode: 'GX-2026071205',
      sourceName: '工序执行任务',
      sourceType: 'operation',
      templateName: '泵体过程检验模板',
      workOrderCode: 'MO-2026071203',
      operationName: '装配预检',
      createdAt: '2026-07-12 15:45',
      items: r(d[1].items)
    },
    {
      id: 'inspection-5',
      code: 'FQC-2026070001',
      category: 'final',
      material: '离心泵 XJP-100',
      lot: 'FG-2026071301',
      qty: 12,
      status: 'pending',
      verdict: '',
      sourceCode: 'WG-2026071301',
      sourceName: '完工报检单',
      sourceType: 'completion',
      templateName: '成品完工检验模板',
      workOrderCode: 'MO-2026071008',
      warehouse: '成品仓',
      createdAt: '2026-07-13 08:30',
      items: r(d[2].items)
    },
    {
      id: 'inspection-6',
      code: 'FQC-2026070002',
      category: 'final',
      material: '齿轮箱 GBX-200',
      lot: 'FG-2026071304',
      qty: 8,
      status: 'completed',
      verdict: 'concession',
      sourceCode: 'WG-2026071304',
      sourceName: '完工入库确认',
      sourceType: 'completion',
      templateName: '成品完工检验模板',
      workOrderCode: 'MO-2026071012',
      warehouse: '成品仓',
      createdAt: '2026-07-13 16:20',
      items: r(d[2].items)
    }
  ],
  h = [
    {
      id: 'ncr-1',
      code: 'NCR-2026070001',
      inspectionCode: 'IPQC-2026070002',
      inspectionCategory: 'process',
      material: '密封座组件',
      sourceCode: 'GX-2026071205',
      sourceType: 'operation',
      severity: 'major',
      status: 'reviewing',
      disposition: 'rework',
      owner: '质量工程师',
      issueDesc: '密封面尺寸超差，需要返工修正后复检。',
      followUp: 'MES返工执行',
      createdAt: '2026-07-12 17:10'
    },
    {
      id: 'ncr-2',
      code: 'NCR-2026070002',
      inspectionCode: 'FQC-2026070002',
      inspectionCategory: 'final',
      material: '齿轮箱 GBX-200',
      sourceCode: 'WG-2026071304',
      sourceType: 'completion',
      severity: 'minor',
      status: 'closed',
      disposition: 'concession',
      owner: '质量主管',
      issueDesc: '外观轻微擦伤，评估后让步接收。',
      followUp: 'WMS让步放行',
      createdAt: '2026-07-13 18:00'
    },
    {
      id: 'ncr-3',
      code: 'NCR-2026070003',
      inspectionCode: 'IQC-2026070001',
      inspectionCategory: 'incoming',
      material: '45#圆钢 D50',
      sourceCode: 'RK-2026071001',
      sourceType: 'receipt',
      severity: 'critical',
      status: 'open',
      disposition: 'pending',
      owner: '来料检验员',
      issueDesc: '抽检尺寸波动较大，待质量评审。',
      followUp: '待QMS裁决',
      createdAt: '2026-07-10 11:40'
    }
  ],
  A = [
    {
      id: 'supplier-1',
      supplier: '华东钢材供应有限公司',
      total_batches: 36,
      pass_batches: 34,
      pass_rate: 94.4,
      repeat_issues: 1,
      last_inspection: '2026-07-10'
    },
    {
      id: 'supplier-2',
      supplier: '苏州轴承制造厂',
      total_batches: 28,
      pass_batches: 27,
      pass_rate: 96.4,
      repeat_issues: 0,
      last_inspection: '2026-07-11'
    }
  ],
  T = [
    {
      id: 'concession-1',
      code: 'TP-2026070001',
      inspectionCode: 'FQC-2026070002',
      material: '齿轮箱 GBX-200',
      sourceCode: 'WG-2026071304',
      scope: '外观轻微擦伤，允许本批 8 件让步放行',
      riskNote: '客户端已确认不影响装配和使用寿命',
      owner: '质量主管',
      status: 'released',
      validUntil: '2026-07-31',
      createdAt: '2026-07-13 18:20'
    },
    {
      id: 'concession-2',
      code: 'TP-2026070002',
      inspectionCode: 'IQC-2026070003',
      material: '进口密封圈',
      sourceCode: 'RK-2026071406',
      scope: '仅允许样机验证用 20 件临时放行',
      riskNote: '需要技术和生产共同确认替代风险',
      owner: '质量经理',
      status: 'reviewing',
      validUntil: '2026-07-20',
      createdAt: '2026-07-14 10:30'
    }
  ],
  Q = [
    {
      id: 'rework-1',
      code: 'RW-2026070001',
      ncrCode: 'NCR-2026070001',
      material: '密封座组件',
      workOrderCode: 'MO-2026071203',
      sourceCode: 'GX-2026071205',
      reviewRoute: '返修 -> 尺寸复测 -> 装配复检',
      reinspectionRule: '返工完成后必须重新触发过程检验',
      owner: '质量工程师',
      status: 'reviewing',
      decision: 'approved',
      createdAt: '2026-07-12 17:40'
    },
    {
      id: 'rework-2',
      code: 'RW-2026070002',
      ncrCode: 'NCR-2026070004',
      material: '叶轮组件',
      workOrderCode: 'MO-2026071308',
      sourceCode: 'GX-2026071311',
      reviewRoute: '评审后转报废，不进入返工',
      reinspectionRule: '无需复检',
      owner: '质量主管',
      status: 'closed',
      decision: 'rejected',
      createdAt: '2026-07-13 19:10'
    }
  ],
  q = [
    {
      id: 'scrap-1',
      code: 'BF-2026070001',
      ncrCode: 'NCR-2026070004',
      material: '叶轮组件',
      sourceCode: 'GX-2026071311',
      reason: '铸造缺陷不可修复',
      qty: 6,
      lossAmount: 4800,
      owner: '质量主管',
      status: 'approved',
      createdAt: '2026-07-13 19:20'
    },
    {
      id: 'scrap-2',
      code: 'BF-2026070002',
      ncrCode: 'NCR-2026070005',
      material: '泵轴',
      sourceCode: 'RK-2026071412',
      reason: '硬度异常待确认报废范围',
      qty: 12,
      lossAmount: 3600,
      owner: '质量经理',
      status: 'pending',
      createdAt: '2026-07-14 14:10'
    }
  ],
  _ = [
    {
      id: 'reinspection-1',
      code: 'FJ-2026070001',
      sourceCode: 'RW-2026070001',
      inspectionCode: 'IPQC-2026070002',
      material: '密封座组件',
      previousDecision: '返工',
      unlockAction: 'MES 返工完成后解除质量锁定',
      owner: '过程检验员',
      status: 'executing',
      result: 'pending',
      createdAt: '2026-07-14 09:30'
    },
    {
      id: 'reinspection-2',
      code: 'FJ-2026070002',
      sourceCode: 'TP-2026070001',
      inspectionCode: 'FQC-2026070002',
      material: '齿轮箱 GBX-200',
      previousDecision: '让步接收',
      unlockAction: 'WMS 让步放行后关闭质量闭环',
      owner: '质量主管',
      status: 'closed',
      result: 'pass',
      createdAt: '2026-07-13 18:40'
    }
  ],
  c = R(d),
  u = R(k),
  l = R(h),
  a = R(A),
  p = R(T),
  f = R(Q),
  y = R(q),
  C = R(_)
function R(e) {
  return typeof structuredClone == 'function' ? structuredClone(e) : JSON.parse(JSON.stringify(e))
}
function r(e) {
  return e.map((t) => ({ ...t }))
}
function M(e, t) {
  return `${{ incoming: 'IQC', process: 'IPQC', final: 'FQC' }[e]}-2026${t.slice(-5).padStart(5, '0')}`
}
function D(e) {
  return `NCR-2026${e.slice(-5).padStart(5, '0')}`
}
async function U(e) {
  let t = [...u]
  ;(e.category && (t = t.filter((s) => s.category === e.category)),
    e.code && (t = i(t, e.code, ['code'])),
    e.material && (t = i(t, e.material, ['material'])),
    e.sourceCode && (t = i(t, e.sourceCode, ['sourceCode'])),
    e.status && (t = t.filter((s) => s.status === e.status)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function b(e) {
  const t = w(),
    n = e.category || 'incoming',
    s = c.find((I) => I.name === e.templateName),
    x = {
      id: t,
      code: e.code || M(n, t),
      category: n,
      material: e.material || '',
      lot: e.lot || '',
      qty: Number(e.qty || 0),
      status: e.status || 'pending',
      verdict: e.verdict || '',
      sourceCode: e.sourceCode || '',
      sourceName: e.sourceName || '',
      sourceType: e.sourceType || 'receipt',
      templateName: e.templateName || '',
      supplier: e.supplier || '',
      warehouse: e.warehouse || '',
      workOrderCode: e.workOrderCode || '',
      operationName: e.operationName || '',
      createdAt: e.createdAt || '2026-07-15 09:00',
      items: r(e.items?.length ? e.items : s?.items || d[0].items)
    }
  return (u.unshift(x), v(x, 'Created successfully'))
}
async function z(e, t) {
  const n = u.findIndex((s) => s.id === e)
  return n === -1
    ? o.fail(404, 'Inspection task not found', null)
    : ((u[n] = { ...u[n], ...t, items: t.items?.length ? r(t.items) : u[n].items }), g(u[n], 'Updated successfully'))
}
async function G(e) {
  const t = u.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Inspection task not found', null) : (u.splice(t, 1), S('Deleted successfully'))
}
async function F(e) {
  let t = [...c]
  ;(e.keyword && (t = i(t, e.keyword, ['name'])), e.category && (t = t.filter((s) => s.category === e.category)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function P(e) {
  const t = w(),
    n = r(e.items || []),
    s = { id: t, name: e.name || '', category: e.category || 'raw', itemCount: n.length, items: n }
  return (c.unshift(s), v(s, 'Created successfully'))
}
async function L(e, t) {
  const n = c.findIndex((x) => x.id === e)
  if (n === -1) return o.fail(404, 'Template not found', null)
  const s = r(t.items || c[n].items)
  return ((c[n] = { ...c[n], ...t, itemCount: s.length, items: s }), g(c[n], 'Updated successfully'))
}
async function W(e) {
  const t = c.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Template not found', null) : (c.splice(t, 1), S('Deleted successfully'))
}
async function X(e) {
  let t = [...l]
  ;(e.code && (t = i(t, e.code, ['code'])),
    e.inspectionCode && (t = i(t, e.inspectionCode, ['inspectionCode'])),
    e.status && (t = t.filter((s) => s.status === e.status)),
    e.disposition && (t = t.filter((s) => s.disposition === e.disposition)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function B(e) {
  const t = w(),
    n = {
      id: t,
      code: e.code || D(t),
      inspectionCode: e.inspectionCode || '',
      inspectionCategory: e.inspectionCategory || 'incoming',
      material: e.material || '',
      sourceCode: e.sourceCode || '',
      sourceType: e.sourceType || 'receipt',
      severity: e.severity || 'major',
      status: e.status || 'open',
      disposition: e.disposition || 'pending',
      owner: e.owner || '',
      issueDesc: e.issueDesc || '',
      followUp: e.followUp || '',
      createdAt: e.createdAt || '2026-07-15 09:00'
    }
  return (l.unshift(n), v(n, 'Created successfully'))
}
async function J(e, t) {
  const n = l.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Nonconformance record not found', null) : ((l[n] = { ...l[n], ...t }), g(l[n], 'Updated successfully'))
}
async function $(e) {
  const t = l.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Nonconformance record not found', null) : (l.splice(t, 1), S('Deleted successfully'))
}
async function K(e) {
  let t = [...a]
  e.supplier && (t = i(t, e.supplier, ['supplier']))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function j(e) {
  const t = {
    id: w(),
    supplier: e.supplier || '',
    total_batches: Number(e.total_batches || 0),
    pass_batches: Number(e.pass_batches || 0),
    pass_rate: Number(e.pass_rate || 0),
    repeat_issues: Number(e.repeat_issues || 0),
    last_inspection: e.last_inspection || '2026-07-15'
  }
  return (a.unshift(t), v(t, 'Created successfully'))
}
async function E(e, t) {
  const n = a.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Supplier quality record not found', null) : ((a[n] = { ...a[n], ...t }), g(a[n], 'Updated successfully'))
}
async function H(e) {
  const t = a.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Supplier quality record not found', null) : (a.splice(t, 1), S('Deleted successfully'))
}
async function V(e) {
  let t = [...p]
  ;(e.code && (t = i(t, e.code, ['code'])),
    e.status && (t = t.filter((s) => s.status === e.status)),
    e.inspectionCode && (t = i(t, e.inspectionCode, ['inspectionCode'])))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function Y(e) {
  const t = {
    id: w(),
    code: e.code || `TP-2026${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`,
    inspectionCode: e.inspectionCode || '',
    material: e.material || '',
    sourceCode: e.sourceCode || '',
    scope: e.scope || '',
    riskNote: e.riskNote || '',
    owner: e.owner || '',
    status: e.status || 'draft',
    validUntil: e.validUntil || '2026-07-31',
    createdAt: e.createdAt || '2026-07-15 09:00'
  }
  return (p.unshift(t), v(t, 'Created successfully'))
}
async function Z(e, t) {
  const n = p.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Concession record not found', null) : ((p[n] = { ...p[n], ...t }), g(p[n], 'Updated successfully'))
}
async function ee(e) {
  const t = p.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Concession record not found', null) : (p.splice(t, 1), S('Deleted successfully'))
}
async function te(e) {
  let t = [...f]
  ;(e.code && (t = i(t, e.code, ['code', 'ncrCode', 'workOrderCode'])),
    e.decision && (t = t.filter((s) => s.decision === e.decision)),
    e.status && (t = t.filter((s) => s.status === e.status)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function ne(e) {
  const t = {
    id: w(),
    code: e.code || `RW-2026${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`,
    ncrCode: e.ncrCode || '',
    material: e.material || '',
    workOrderCode: e.workOrderCode || '',
    sourceCode: e.sourceCode || '',
    reviewRoute: e.reviewRoute || '',
    reinspectionRule: e.reinspectionRule || '',
    owner: e.owner || '',
    status: e.status || 'open',
    decision: e.decision || 'pending',
    createdAt: e.createdAt || '2026-07-15 09:00'
  }
  return (f.unshift(t), v(t, 'Created successfully'))
}
async function se(e, t) {
  const n = f.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Rework review not found', null) : ((f[n] = { ...f[n], ...t }), g(f[n], 'Updated successfully'))
}
async function oe(e) {
  const t = f.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Rework review not found', null) : (f.splice(t, 1), S('Deleted successfully'))
}
async function ie(e) {
  let t = [...y]
  ;(e.code && (t = i(t, e.code, ['code', 'ncrCode', 'sourceCode'])), e.status && (t = t.filter((s) => s.status === e.status)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function re(e) {
  const t = {
    id: w(),
    code: e.code || `BF-2026${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`,
    ncrCode: e.ncrCode || '',
    material: e.material || '',
    sourceCode: e.sourceCode || '',
    reason: e.reason || '',
    qty: Number(e.qty || 0),
    lossAmount: Number(e.lossAmount || 0),
    owner: e.owner || '',
    status: e.status || 'pending',
    createdAt: e.createdAt || '2026-07-15 09:00'
  }
  return (y.unshift(t), v(t, 'Created successfully'))
}
async function ce(e, t) {
  const n = y.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Scrap review not found', null) : ((y[n] = { ...y[n], ...t }), g(y[n], 'Updated successfully'))
}
async function ue(e) {
  const t = y.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Scrap review not found', null) : (y.splice(t, 1), S('Deleted successfully'))
}
async function de(e) {
  let t = [...C]
  ;(e.code && (t = i(t, e.code, ['code', 'inspectionCode', 'sourceCode'])),
    e.status && (t = t.filter((s) => s.status === e.status)),
    e.result && (t = t.filter((s) => s.result === e.result)))
  const n = m(t, e.pageNum, e.pageSize)
  return N(n.list, n.total, n.pageNum, n.pageSize)
}
async function le(e) {
  const t = {
    id: w(),
    code: e.code || `FJ-2026${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`,
    sourceCode: e.sourceCode || '',
    inspectionCode: e.inspectionCode || '',
    material: e.material || '',
    previousDecision: e.previousDecision || '',
    unlockAction: e.unlockAction || '',
    owner: e.owner || '',
    status: e.status || 'pending',
    result: e.result || 'pending',
    createdAt: e.createdAt || '2026-07-15 09:00'
  }
  return (C.unshift(t), v(t, 'Created successfully'))
}
async function ae(e, t) {
  const n = C.findIndex((s) => s.id === e)
  return n === -1 ? o.fail(404, 'Re-inspection record not found', null) : ((C[n] = { ...C[n], ...t }), g(C[n], 'Updated successfully'))
}
async function pe(e) {
  const t = C.findIndex((n) => n.id === e)
  return t === -1 ? o.fail(404, 'Re-inspection record not found', null) : (C.splice(t, 1), S('Deleted successfully'))
}
export {
  se as A,
  ie as C,
  J as D,
  z as E,
  E as M,
  L as O,
  te as S,
  Z as T,
  V as _,
  le as a,
  F as b,
  j as c,
  $ as d,
  W as f,
  H as g,
  ue as h,
  P as i,
  ce as j,
  ae as k,
  ee as l,
  oe as m,
  b as n,
  ne as o,
  pe as p,
  B as r,
  re as s,
  Y as t,
  G as u,
  U as v,
  K as w,
  de as x,
  X as y
}

import { C as y, D as u, E as P, M as n, O as h, S as l, T as _, b as m, g as r, k as w, v as F, w as s, x as S, y as g } from './index-DqMfCNbk.js'
var c = [
    {
      id: 'payable-1',
      code: 'AP20250601001',
      supplier: '华东特钢供应有限公司',
      amount: 185e3,
      paid: 9e4,
      balance: 95e3,
      due_date: '2026-07-10',
      status: 'partial'
    },
    {
      id: 'payable-2',
      code: 'AP20250605002',
      supplier: '苏州精密轴承制造厂',
      amount: 126e3,
      paid: 0,
      balance: 126e3,
      due_date: '2026-07-18',
      status: 'open'
    },
    {
      id: 'payable-3',
      code: 'AP20250608003',
      supplier: '宁波工业气体科技有限公司',
      amount: 42800,
      paid: 42800,
      balance: 0,
      due_date: '2026-06-28',
      status: 'paid'
    },
    {
      id: 'payable-4',
      code: 'AP20250612004',
      supplier: '上海自动化电控设备有限公司',
      amount: 96300,
      paid: 3e4,
      balance: 66300,
      due_date: '2026-07-22',
      status: 'partial'
    },
    {
      id: 'payable-5',
      code: 'AP20250615005',
      supplier: '青岛包装材料有限公司',
      amount: 31800,
      paid: 0,
      balance: 31800,
      due_date: '2026-07-25',
      status: 'open'
    }
  ],
  D = [
    { id: 'cost-1', product: '离心泵 XJ-LX-100', material_cost: 12800, labor_cost: 3600, overhead: 1900, total: 18300, period: '2026-06' },
    { id: 'cost-2', product: '离心泵 XJ-LX-150', material_cost: 15600, labor_cost: 4200, overhead: 2300, total: 22100, period: '2026-06' },
    { id: 'cost-3', product: '齿轮泵 XJ-CL-80', material_cost: 9100, labor_cost: 2600, overhead: 1500, total: 13200, period: '2026-06' },
    { id: 'cost-4', product: '液压站 XJ-YY-01', material_cost: 28600, labor_cost: 6800, overhead: 3200, total: 38600, period: '2026-06' },
    { id: 'cost-5', product: '装配组件 XJ-ZP-12', material_cost: 5200, labor_cost: 1900, overhead: 900, total: 8e3, period: '2026-06' }
  ],
  p = [
    { id: 'debit-1', code: '1403', account: '原材料', type: '资产', amount: 126e4 },
    { id: 'debit-2', code: '5001', account: '生产成本', type: '成本', amount: 918e3 },
    { id: 'debit-3', code: '1122', account: '应收账款', type: '资产', amount: 168e4 },
    { id: 'debit-4', code: '6602', account: '管理费用', type: '费用', amount: 286e3 }
  ],
  f = [
    { id: 'credit-1', code: '2202', account: '应付账款', type: '负债', amount: 108e4 },
    { id: 'credit-2', code: '2221', account: '应交税费', type: '负债', amount: 312e3 },
    { id: 'credit-3', code: '6001', account: '主营业务收入', type: '收入', amount: 286e4 },
    { id: 'credit-4', code: '4001', account: '实收资本', type: '权益', amount: 5e6 }
  ],
  b = [
    { id: 'ledger-1', date: '2026-06-03', voucher: 'PZ-202606-001', account: '原材料', debit: 36e4, credit: 0, summary: '采购钢材与铸件' },
    { id: 'ledger-2', date: '2026-06-08', voucher: 'PZ-202606-002', account: '生产成本', debit: 285e3, credit: 0, summary: '生产领料结转' },
    { id: 'ledger-3', date: '2026-06-12', voucher: 'PZ-202606-003', account: '主营业务收入', debit: 0, credit: 82e4, summary: '销售离心泵产品' },
    { id: 'ledger-4', date: '2026-06-18', voucher: 'PZ-202606-004', account: '应付账款', debit: 12e4, credit: 0, summary: '支付供应商货款' },
    { id: 'ledger-5', date: '2026-06-24', voucher: 'PZ-202606-005', account: '管理费用', debit: 56e3, credit: 0, summary: '办公及差旅报销' },
    { id: 'ledger-6', date: '2026-06-29', voucher: 'PZ-202606-006', account: '应收账款', debit: 0, credit: 468e3, summary: '收到客户回款' }
  ],
  L = [
    {
      id: 'rec-1',
      date: '2026-06-03',
      voucher: 'PZ-202606-001',
      debit_account: '原材料',
      credit_account: '银行存款',
      debit: 36e4,
      credit: 36e4,
      diff: 0,
      status: 'matched'
    },
    {
      id: 'rec-2',
      date: '2026-06-12',
      voucher: 'PZ-202606-003',
      debit_account: '银行存款',
      credit_account: '主营业务收入',
      debit: 82e4,
      credit: 82e4,
      diff: 0,
      status: 'matched'
    },
    {
      id: 'rec-3',
      date: '2026-06-18',
      voucher: 'PZ-202606-004',
      debit_account: '应付账款',
      credit_account: '银行存款',
      debit: 12e4,
      credit: 12e4,
      diff: 0,
      status: 'matched'
    },
    {
      id: 'rec-4',
      date: '2026-06-30',
      voucher: 'PZ-202606-007',
      debit_account: '制造费用',
      credit_account: '银行存款',
      debit: 98500,
      credit: 96e3,
      diff: 2500,
      status: 'pending'
    }
  ],
  v = {
    currentMonth: { revenue: 852e3, cost: 628e3, gross: 224e3, receivable: 318e3, payable: 196e3, profit: 146e3 },
    lastMonth: { revenue: 816e3, cost: 606e3, gross: 21e4, receivable: 302e3, payable: 188e3, profit: 138e3 }
  }
async function Z(e) {
  await r()
  let t = [...c]
  ;(e.code && (t = s(t, e.code, ['code'])),
    e.supplier && (t = s(t, e.supplier, ['supplier'])),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const a = y(t, e.pageNum, e.pageSize)
  return m(a.list, a.total, a.pageNum, a.pageSize)
}
async function $(e) {
  await r()
  const t = {
    id: _(),
    code: `AP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(c.length + 1).padStart(3, '0')}`,
    balance: Number(e.amount || 0) - Number(e.paid || 0),
    ...e
  }
  return (c.unshift(t), F(t, '新增应付单成功'))
}
async function R(e, t) {
  await r()
  const a = c.findIndex((i) => i.id === e)
  if (a > -1) {
    const i = { ...c[a], ...t }
    return ((i.balance = Number(i.amount || 0) - Number(i.paid || 0)), (c[a] = i), l(i, '编辑应付单成功'))
  }
  return l({ id: e, ...t }, '编辑应付单成功')
}
async function x(e) {
  await r()
  const t = c.findIndex((a) => a.id === e)
  return (t > -1 && c.splice(t, 1), S('删除应付单成功'))
}
async function A(e) {
  await r()
  let t = [...D]
  ;(e.product && (t = s(t, e.product, ['product'])), e.period && (t = t.filter((i) => i.period === e.period)))
  const a = y(t, e.pageNum, e.pageSize)
  return m(a.list, a.total, a.pageNum, a.pageSize)
}
async function C() {
  await r()
  const e = p.reduce((o, d) => o + d.amount, 0),
    t = f.reduce((o, d) => o + d.amount, 0),
    a = b.reduce((o, d) => o + d.credit, 0),
    i = v.currentMonth.profit
  return g({
    cards: [
      { title: '本期借方合计', value: e },
      { title: '本期贷方合计', value: t },
      { title: '本月收入', value: a },
      { title: '本月利润', value: i }
    ],
    debitData: p,
    creditData: f,
    ledgerData: b,
    recData: L
  })
}
async function N() {
  return (await r(), g(v))
}
function I(e) {
  return n ? Z(e) : u('/finance/payables', { params: e })
}
function M(e) {
  return n ? $(e) : h('/finance/payables', e)
}
function J(e, t) {
  return n ? R(e, t) : w(`/finance/payables/${e}`, t)
}
function z(e) {
  return n ? x(e) : P(`/finance/payables/${e}`)
}
function O(e) {
  return n ? A(e) : u('/finance/cost-details', { params: e })
}
function k() {
  return n ? C() : u('/finance/ledger-overview')
}
function E() {
  return n ? N() : u('/finance/report-summary')
}
export { I as a, k as i, z as n, E as o, O as r, J as s, M as t }

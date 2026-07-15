import {
  An as k,
  Bn as a,
  J as w,
  Mn as N,
  On as p,
  Tn as F,
  Xn as d,
  _ as L,
  an as x,
  dn as e,
  in as c,
  it as S,
  or as A,
  pn as I,
  q as M,
  sn as O,
  sr as l,
  tn as q,
  tt as J,
  un as o,
  v as P
} from './element-plus-CzL7BOKu.js'
import { I as R } from './index-DqMfCNbk.js'
import { i as U } from './finance-C91m7hPG.js'
var X = { class: 'card-title' },
  j = { class: 'card-value' },
  G = I({
    __name: 'index',
    setup(H) {
      const _ = d('ledger'),
        b = d([]),
        g = d([]),
        f = d([]),
        h = d([]),
        v = d([]),
        W = [
          { prop: 'code', label: '科目编码', minWidth: 100 },
          { prop: 'account', label: '科目名称', minWidth: 150 },
          { prop: 'type', label: '科目类型', minWidth: 100, align: 'center' },
          { prop: 'amount', label: '金额', minWidth: 120, align: 'right', slotName: 'amount' }
        ],
        C = [
          { prop: 'date', label: '日期', minWidth: 110 },
          { prop: 'voucher', label: '凭证号', minWidth: 130 },
          { prop: 'account', label: '科目', minWidth: 150 },
          { prop: 'debit', label: '借方金额', minWidth: 120, align: 'right', slotName: 'debit' },
          { prop: 'credit', label: '贷方金额', minWidth: 120, align: 'right', slotName: 'credit' },
          { prop: 'summary', label: '摘要', minWidth: 220 }
        ],
        E = [
          { prop: 'date', label: '日期', minWidth: 110 },
          { prop: 'voucher', label: '凭证号', minWidth: 130 },
          { prop: 'debit_account', label: '借方科目', minWidth: 150 },
          { prop: 'credit_account', label: '贷方科目', minWidth: 150 },
          { prop: 'debit', label: '借方金额', minWidth: 120, align: 'right', slotName: 'debit' },
          { prop: 'credit', label: '贷方金额', minWidth: 120, align: 'right', slotName: 'credit' },
          { label: '差异金额', minWidth: 100, align: 'right', slotName: 'diff' },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' }
        ]
      function n(i) {
        return i.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      async function z() {
        const i = await U()
        ;((b.value = i.data.cards),
          (g.value = i.data.debitData),
          (f.value = i.data.creditData),
          (h.value = i.data.ledgerData),
          (v.value = i.data.recData))
      }
      return (
        F(() => {
          z()
        }),
        (i, r) => {
          const u = J,
            m = M,
            y = w,
            s = N('gi-table'),
            D = L,
            V = S,
            B = P,
            T = N('gi-page-layout')
          return (
            p(),
            x(T, null, {
              default: a(() => [
                e(
                  y,
                  { gutter: 16 },
                  {
                    default: a(() => [
                      (p(!0),
                      O(
                        q,
                        null,
                        k(
                          b.value,
                          (t) => (
                            p(),
                            x(
                              m,
                              { key: t.title, span: 6 },
                              {
                                default: a(() => [
                                  e(
                                    u,
                                    { shadow: 'hover' },
                                    {
                                      default: a(() => [
                                        c('div', X, l(t.title), 1),
                                        c('div', j, [o(l(n(t.value)) + ' ', 1), r[1] || (r[1] = c('span', { class: 'card-unit' }, '元', -1))])
                                      ]),
                                      _: 2
                                    },
                                    1024
                                  )
                                ]),
                                _: 2
                              },
                              1024
                            )
                          )
                        ),
                        128
                      ))
                    ]),
                    _: 1
                  }
                ),
                e(
                  y,
                  { gutter: 16, style: { 'margin-top': '16px' } },
                  {
                    default: a(() => [
                      e(
                        m,
                        { span: 12 },
                        {
                          default: a(() => [
                            e(
                              u,
                              { header: '借方科目' },
                              {
                                default: a(() => [
                                  e(
                                    s,
                                    { columns: W, data: g.value, border: '', stripe: '', size: 'small' },
                                    { amount: a(({ row: t }) => [o(l(n(t.amount)), 1)]), _: 1 },
                                    8,
                                    ['data']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        m,
                        { span: 12 },
                        {
                          default: a(() => [
                            e(
                              u,
                              { header: '贷方科目' },
                              {
                                default: a(() => [
                                  e(
                                    s,
                                    { columns: W, data: f.value, border: '', stripe: '', size: 'small' },
                                    { amount: a(({ row: t }) => [o(l(n(t.amount)), 1)]), _: 1 },
                                    8,
                                    ['data']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                ),
                e(
                  B,
                  { modelValue: _.value, 'onUpdate:modelValue': r[0] || (r[0] = (t) => (_.value = t)), style: { 'margin-top': '16px' } },
                  {
                    default: a(() => [
                      e(
                        D,
                        { label: '总账分录', name: 'ledger' },
                        {
                          default: a(() => [
                            e(
                              s,
                              { columns: C, data: h.value, border: '', stripe: '', size: 'small' },
                              { debit: a(({ row: t }) => [o(l(n(t.debit)), 1)]), credit: a(({ row: t }) => [o(l(n(t.credit)), 1)]), _: 1 },
                              8,
                              ['data']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        D,
                        { label: '对账结果', name: 'reconciliation' },
                        {
                          default: a(() => [
                            e(
                              s,
                              { columns: E, data: v.value, border: '', stripe: '', size: 'small' },
                              {
                                debit: a(({ row: t }) => [o(l(n(t.debit)), 1)]),
                                credit: a(({ row: t }) => [o(l(n(t.credit)), 1)]),
                                diff: a(({ row: t }) => [
                                  c('span', { style: A({ color: t.diff === 0 ? '#67c23a' : '#f56c6c' }) }, l(t.diff === 0 ? '0.00' : n(t.diff)), 5)
                                ]),
                                status: a(({ row: t }) => [
                                  e(
                                    V,
                                    { type: t.status === 'matched' ? 'success' : 'warning' },
                                    { default: a(() => [o(l(t.status === 'matched' ? '已平衡' : '待处理'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['data']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  Z = R(G, [['__scopeId', 'data-v-9b67f233']])
export { Z as default }

import {
  Bn as l,
  Mn as N,
  On as B,
  Tn as F,
  U as z,
  W as E,
  Xn as h,
  an as V,
  dn as o,
  in as v,
  or as d,
  pn as $,
  rn as _,
  sr as t,
  tt as k,
  un as f
} from './element-plus-CzL7BOKu.js'
import { o as w } from './finance-C91m7hPG.js'
var L = $({
    __name: 'index',
    setup(A) {
      const e = h({ revenue: 0, cost: 0, gross: 0, receivable: 0, payable: 0, profit: 0 }),
        r = h({ revenue: 0, cost: 0, gross: 0, receivable: 0, payable: 0, profit: 0 }),
        m = _(() => s(e.value.revenue, r.value.revenue)),
        b = _(() => s(e.value.cost, r.value.cost)),
        y = _(() => s(e.value.gross, r.value.gross)),
        g = _(() => s(e.value.receivable, r.value.receivable)),
        T = _(() => s(e.value.payable, r.value.payable)),
        x = _(() => s(e.value.profit, r.value.profit))
      function s(a, p) {
        return p ? Number((((a - p) / p) * 100).toFixed(1)) : 0
      }
      function u(a) {
        return `￥${a.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
      function c(a) {
        return `${a > 0 ? '+' : ''}${a}%`
      }
      function i(a, p) {
        const n = a >= 0
        return { color: p ? (n ? '#67c23a' : '#f56c6c') : n ? '#f56c6c' : '#67c23a', marginLeft: '8px', fontSize: '12px' }
      }
      async function D() {
        const a = await w()
        ;((e.value = a.data.currentMonth), (r.value = a.data.lastMonth))
      }
      return (
        F(() => {
          D()
        }),
        (a, p) => {
          const n = E,
            M = z,
            S = k,
            C = N('gi-page-layout')
          return (
            B(),
            V(C, null, {
              default: l(() => [
                o(
                  S,
                  { header: '月度经营概览' },
                  {
                    default: l(() => [
                      o(
                        M,
                        { column: 3, border: '' },
                        {
                          default: l(() => [
                            o(
                              n,
                              { label: '营业收入' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.revenue)) + ' ', 1),
                                  v('span', { style: d(i(m.value, !0)) }, '环比 ' + t(c(m.value)), 5)
                                ]),
                                _: 1
                              }
                            ),
                            o(
                              n,
                              { label: '营业成本' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.cost)) + ' ', 1),
                                  v('span', { style: d(i(b.value, !1)) }, '环比 ' + t(c(b.value)), 5)
                                ]),
                                _: 1
                              }
                            ),
                            o(
                              n,
                              { label: '毛利' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.gross)) + ' ', 1),
                                  v('span', { style: d(i(y.value, !0)) }, '环比 ' + t(c(y.value)), 5)
                                ]),
                                _: 1
                              }
                            ),
                            o(
                              n,
                              { label: '应收余额' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.receivable)) + ' ', 1),
                                  v('span', { style: d(i(g.value, !1)) }, '环比 ' + t(c(g.value)), 5)
                                ]),
                                _: 1
                              }
                            ),
                            o(
                              n,
                              { label: '应付余额' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.payable)) + ' ', 1),
                                  v('span', { style: d(i(T.value, !1)) }, '环比 ' + t(c(T.value)), 5)
                                ]),
                                _: 1
                              }
                            ),
                            o(
                              n,
                              { label: '净利润' },
                              {
                                default: l(() => [
                                  f(t(u(e.value.profit)) + ' ', 1),
                                  v('span', { style: d(i(x.value, !0)) }, '环比 ' + t(c(x.value)), 5)
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
                )
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  P = L
export { P as default }

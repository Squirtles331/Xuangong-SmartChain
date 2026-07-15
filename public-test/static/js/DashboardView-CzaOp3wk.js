import {
  An as S,
  Bn as r,
  Cn as D,
  J as k,
  On as f,
  Tn as z,
  Xn as u,
  an as B,
  dn as o,
  in as n,
  or as g,
  pn as V,
  q as O,
  sn as w,
  sr as l,
  tn as I,
  tt as L,
  un as x
} from './element-plus-CzL7BOKu.js'
import { I as R } from './index-DqMfCNbk.js'
import { t as C } from './echarts-BZg-173N.js'
import { n as A, t as N } from './dashboard-ZM2ukubS.js'
var M = { class: 'dashboard-v2' },
  T = { class: 'top-title' },
  q = { class: 'top-unit' },
  F = { class: 'top-trend' },
  H = V({
    __name: 'DashboardView',
    setup(J) {
      const h = u([
          { title: '本月营收', value: 0, unit: '万元', trend: 0, color: '#409eff' },
          { title: '在制工单', value: 0, unit: '单', trend: 0, color: '#67c23a' },
          { title: '设备OEE', value: 0, unit: '%', trend: 0, color: '#e6a23c' },
          { title: '订单交付率', value: 0, unit: '%', trend: 0, color: '#f56c6c' }
        ]),
        c = u(),
        v = u()
      let d = null,
        i = null
      const t = u({ trend: { months: [], revenue: [], cost: [], profit: [] }, order_status: [] })
      function b() {
        ;(c.value &&
          t.value.trend.months.length &&
          ((d ??= C(c.value)),
          d.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['营收', '成本', '利润'] },
            xAxis: { type: 'category', data: t.value.trend.months },
            yAxis: { type: 'value' },
            series: [
              { name: '营收', type: 'line', data: t.value.trend.revenue, smooth: !0, itemStyle: { color: '#409eff' } },
              { name: '成本', type: 'line', data: t.value.trend.cost, smooth: !0, itemStyle: { color: '#e6a23c' } },
              { name: '利润', type: 'line', data: t.value.trend.profit, smooth: !0, itemStyle: { color: '#67c23a' } }
            ],
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: !0 }
          })),
          v.value &&
            t.value.order_status.length &&
            ((i ??= C(v.value)),
            i.setOption({
              tooltip: { trigger: 'item' },
              legend: { orient: 'vertical', left: 'left', top: 'center' },
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '75%'],
                  center: ['55%', '50%'],
                  data: t.value.order_status,
                  label: {
                    formatter: `{b}
{d}%`
                  }
                }
              ]
            })))
      }
      async function E() {
        const [e, s] = await Promise.all([N(), A()])
        ;((h.value = [
          { title: '本月营收', value: e.data.revenue ?? 0, unit: '万元', trend: e.data.revenue_trend ?? 0, color: '#409eff' },
          { title: '在制工单', value: e.data.active_orders ?? 0, unit: '单', trend: e.data.orders_trend ?? 0, color: '#67c23a' },
          { title: '设备OEE', value: e.data.oee ?? 0, unit: '%', trend: e.data.oee_trend ?? 0, color: '#e6a23c' },
          { title: '订单交付率', value: e.data.delivery_rate ?? 0, unit: '%', trend: e.data.delivery_trend ?? 0, color: '#f56c6c' }
        ]),
          (t.value = { trend: s.data.trend || { months: [], revenue: [], cost: [], profit: [] }, order_status: s.data.order_status || [] }),
          b())
      }
      function m() {
        ;(d?.resize(), i?.resize())
      }
      return (
        z(async () => {
          ;(await E(), window.addEventListener('resize', m))
        }),
        D(() => {
          ;(window.removeEventListener('resize', m), d?.dispose(), i?.dispose())
        }),
        (e, s) => {
          const _ = L,
            p = O,
            y = k
          return (
            f(),
            w('div', M, [
              o(
                y,
                { gutter: 16, class: 'top-row' },
                {
                  default: r(() => [
                    (f(!0),
                    w(
                      I,
                      null,
                      S(
                        h.value,
                        (a) => (
                          f(),
                          B(
                            p,
                            { span: 6, key: a.title },
                            {
                              default: r(() => [
                                o(
                                  _,
                                  { shadow: 'hover', class: 'top-card' },
                                  {
                                    default: r(() => [
                                      n('div', T, l(a.title), 1),
                                      n(
                                        'div',
                                        { class: 'top-value', style: g({ color: a.color }) },
                                        [x(l(a.value), 1), n('span', q, l(a.unit), 1)],
                                        4
                                      ),
                                      n('div', F, [
                                        n(
                                          'span',
                                          { style: g({ color: a.trend > 0 ? '#f56c6c' : '#67c23a' }) },
                                          l(a.trend > 0 ? '↑' : '↓') + l(Math.abs(a.trend)) + '% ',
                                          5
                                        ),
                                        s[0] || (s[0] = x(' 较上期 ', -1))
                                      ])
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
              o(
                y,
                { gutter: 16, style: { 'margin-top': '16px' } },
                {
                  default: r(() => [
                    o(
                      p,
                      { span: 16 },
                      {
                        default: r(() => [
                          o(
                            _,
                            { header: '月度营收趋势' },
                            { default: r(() => [n('div', { ref_key: 'revenueChart', ref: c, style: { height: '300px' } }, null, 512)]), _: 1 }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    o(
                      p,
                      { span: 8 },
                      {
                        default: r(() => [
                          o(
                            _,
                            { header: '工单状态分布' },
                            { default: r(() => [n('div', { ref_key: 'orderStatusChart', ref: v, style: { height: '300px' } }, null, 512)]), _: 1 }
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ])
          )
        }
      )
    }
  }),
  G = R(H, [['__scopeId', 'data-v-11fda88a']])
export { G as default }

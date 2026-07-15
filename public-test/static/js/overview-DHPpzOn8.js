import {
  An as M,
  Bn as t,
  Cn as R,
  G as S,
  J as B,
  Mn as V,
  On as f,
  Tn as I,
  Xn as c,
  an as x,
  dn as a,
  ht as O,
  in as o,
  mt as L,
  or as N,
  pn as b,
  q as A,
  sn as F,
  sr as i,
  tn as T,
  tt as D,
  un as U,
  xn as q
} from './element-plus-CzL7BOKu.js'
import { I as G } from './index-DqMfCNbk.js'
import { t as w } from './echarts-BZg-173N.js'
import { i as J } from './energy-Bt4VzB_9.js'
var P = { class: 'card-title' },
  X = { class: 'card-value' },
  j = { class: 'card-unit' },
  H = b({
    __name: 'index',
    setup(K) {
      const d = c(['2026-01', '2026-12']),
        v = c([]),
        p = c(),
        u = c()
      let l = null,
        s = null
      function E(n) {
        ;(p.value &&
          (l || (l = w(p.value)),
          l.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['电', '水', '气'] },
            xAxis: { type: 'category', data: n.trend.map((e) => e.period) },
            yAxis: { type: 'value' },
            series: [
              { name: '电', type: 'bar', data: n.trend.map((e) => e.electricity), itemStyle: { color: '#e6a23c' } },
              { name: '水', type: 'line', data: n.trend.map((e) => e.water), itemStyle: { color: '#409eff' } },
              { name: '气', type: 'line', data: n.trend.map((e) => e.gas), itemStyle: { color: '#67c23a' } }
            ]
          })),
          u.value &&
            (s || (s = w(u.value)),
            s.setOption({
              tooltip: { trigger: 'item' },
              series: [
                {
                  type: 'pie',
                  radius: '70%',
                  data: n.structure.map((e) => ({
                    ...e,
                    itemStyle: { color: e.name === '电' ? '#e6a23c' : e.name === '水' ? '#409eff' : '#67c23a' }
                  }))
                }
              ]
            })))
      }
      async function y() {
        const n = await J({ start: d.value?.[0], end: d.value?.[1] })
        ;((v.value = n.data.cards), await q(), E(n.data))
      }
      function g() {
        ;(l?.resize(), s?.resize())
      }
      return (
        I(() => {
          ;(y(), window.addEventListener('resize', g))
        }),
        R(() => {
          ;(window.removeEventListener('resize', g), l?.dispose(), s?.dispose())
        }),
        (n, e) => {
          const k = S,
            C = O,
            Y = L,
            _ = D,
            m = A,
            h = B,
            z = V('gi-page-layout')
          return (
            f(),
            x(z, null, {
              header: t(() => [
                a(
                  Y,
                  { inline: '' },
                  {
                    default: t(() => [
                      a(
                        C,
                        { label: '时间范围' },
                        {
                          default: t(() => [
                            a(
                              k,
                              {
                                modelValue: d.value,
                                'onUpdate:modelValue': e[0] || (e[0] = (r) => (d.value = r)),
                                type: 'monthrange',
                                'range-separator': '至',
                                'start-placeholder': '起始月',
                                'end-placeholder': '结束月',
                                format: 'YYYY-MM',
                                'value-format': 'YYYY-MM',
                                onChange: y
                              },
                              null,
                              8,
                              ['modelValue']
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
              default: t(() => [
                a(
                  h,
                  { gutter: 16 },
                  {
                    default: t(() => [
                      (f(!0),
                      F(
                        T,
                        null,
                        M(
                          v.value,
                          (r) => (
                            f(),
                            x(
                              m,
                              { key: r.title, span: 6 },
                              {
                                default: t(() => [
                                  a(
                                    _,
                                    { shadow: 'hover' },
                                    {
                                      default: t(() => [
                                        o('div', P, i(r.title), 1),
                                        o('div', X, [U(i(r.value.toLocaleString('zh-CN')), 1), o('span', j, i(r.unit), 1)]),
                                        o(
                                          'div',
                                          { class: 'card-trend', style: N({ color: r.trend > 0 ? '#f56c6c' : '#67c23a' }) },
                                          i(r.trend > 0 ? '↑' : '↓') + i(Math.abs(r.trend)) + '% 较上期 ',
                                          5
                                        )
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
                a(
                  h,
                  { gutter: 16, style: { 'margin-top': '16px' } },
                  {
                    default: t(() => [
                      a(
                        m,
                        { span: 16 },
                        {
                          default: t(() => [
                            a(
                              _,
                              { header: '能耗趋势' },
                              { default: t(() => [o('div', { ref_key: 'chartRef', ref: p, style: { height: '320px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        m,
                        { span: 8 },
                        {
                          default: t(() => [
                            a(
                              _,
                              { header: '能耗结构' },
                              { default: t(() => [o('div', { ref_key: 'pieRef', ref: u, style: { height: '320px' } }, null, 512)]), _: 1 }
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
  ee = G(H, [['__scopeId', 'data-v-39ec085a']])
export { ee as default }

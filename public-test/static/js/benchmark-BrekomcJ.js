import {
  Bn as a,
  Cn as E,
  Mn as z,
  On as O,
  Rn as T,
  Tn as V,
  Xn as o,
  _ as L,
  an as S,
  dn as n,
  in as v,
  pn as A,
  tt as M,
  v as N,
  xn as y
} from './element-plus-CzL7BOKu.js'
import { t as h } from './echarts-BZg-173N.js'
import { n as U } from './energy-Bt4VzB_9.js'
var D = A({
    __name: 'index',
    setup(G) {
      const u = o('electric'),
        c = o(),
        d = o(),
        f = o()
      let r = null,
        l = null,
        i = null
      const e = o(null)
      function p(s, t) {
        return {
          tooltip: { trigger: 'axis' },
          legend: { data: ['实际值', '行业标杆', '先进值'] },
          xAxis: { type: 'category', data: t.xLabels },
          yAxis: { type: 'value', name: s },
          series: [
            { name: '实际值', type: 'bar', data: t.actual, itemStyle: { color: '#409eff' } },
            { name: '行业标杆', type: 'bar', data: t.benchmark, itemStyle: { color: '#67c23a' } },
            { name: '先进值', type: 'bar', data: t.advanced, itemStyle: { color: '#e6a23c' } }
          ]
        }
      }
      function x() {
        !c.value || !e.value || (r || (r = h(c.value)), r.setOption(p(e.value.electric.unit, e.value.electric)))
      }
      function w() {
        !d.value || !e.value || (l || (l = h(d.value)), l.setOption(p(e.value.water.unit, e.value.water)))
      }
      function b() {
        !f.value || !e.value || (i || (i = h(f.value)), i.setOption(p(e.value.gas.unit, e.value.gas)))
      }
      function g() {
        ;(r?.resize(), l?.resize(), i?.resize())
      }
      async function C() {
        ;((e.value = (await U()).data), await y(), x())
      }
      return (
        V(() => {
          ;(C(), window.addEventListener('resize', g))
        }),
        T(u, async (s) => {
          ;(await y(), s === 'water' && w(), s === 'gas' && b())
        }),
        E(() => {
          ;(window.removeEventListener('resize', g), r?.dispose(), l?.dispose(), i?.dispose())
        }),
        (s, t) => {
          const _ = M,
            m = L,
            k = N,
            R = z('gi-page-layout')
          return (
            O(),
            S(R, null, {
              default: a(() => [
                n(
                  k,
                  { modelValue: u.value, 'onUpdate:modelValue': t[0] || (t[0] = (B) => (u.value = B)) },
                  {
                    default: a(() => [
                      n(
                        m,
                        { label: '电耗对标', name: 'electric' },
                        {
                          default: a(() => [
                            n(
                              _,
                              { header: '电耗对标分析', style: { 'margin-top': '16px' } },
                              { default: a(() => [v('div', { ref_key: 'electricChartRef', ref: c, style: { height: '350px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      n(
                        m,
                        { label: '水耗对标', name: 'water' },
                        {
                          default: a(() => [
                            n(
                              _,
                              { header: '水耗对标分析', style: { 'margin-top': '16px' } },
                              { default: a(() => [v('div', { ref_key: 'waterChartRef', ref: d, style: { height: '350px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      n(
                        m,
                        { label: '气耗对标', name: 'gas' },
                        {
                          default: a(() => [
                            n(
                              _,
                              { header: '气耗对标分析', style: { 'margin-top': '16px' } },
                              { default: a(() => [v('div', { ref_key: 'gasChartRef', ref: f, style: { height: '350px' } }, null, 512)]), _: 1 }
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
  j = D
export { j as default }

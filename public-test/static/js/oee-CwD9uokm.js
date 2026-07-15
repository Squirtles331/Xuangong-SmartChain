import {
  An as B,
  Bn as e,
  Cn as D,
  G as M,
  J as V,
  Mn as y,
  O as R,
  On as _,
  Tn as S,
  Xn as l,
  an as E,
  dn as t,
  ht as W,
  in as u,
  mt as I,
  pn as A,
  q as F,
  sn as L,
  sr as x,
  tn as N,
  tt as P,
  un as T
} from './element-plus-CzL7BOKu.js'
import { I as U } from './index-DqMfCNbk.js'
import { t as G } from './echarts-BZg-173N.js'
import { a as J } from './equipment-DTYL7ZbV.js'
var X = { class: 'card-title' },
  j = { class: 'card-value' },
  H = A({
    __name: 'index',
    setup(K) {
      const o = l(['2026-01', '2026-06']),
        d = l(),
        m = l([
          { title: 'OEE综合', value: 0 },
          { title: '设备利用率', value: 0 },
          { title: '性能效率', value: 0 },
          { title: '合格品率', value: 0 }
        ]),
        v = l([]),
        n = l({
          months: ['1月', '2月', '3月', '4月', '5月', '6月'],
          oee: [75, 76, 78, 77, 79, 78.5],
          utilization: [82, 84, 85, 83, 86, 85.2],
          performance: [90, 91, 92, 91, 93, 92.1],
          quality: [97, 98, 97.5, 98.2, 98.5, 98.3]
        }),
        w = [
          { prop: 'equipment', label: '设备', minWidth: 180 },
          { prop: 'oee', label: 'OEE', minWidth: 80, align: 'center' },
          { prop: 'utilization', label: '利用率', minWidth: 80, align: 'center' },
          { prop: 'performance', label: '性能', minWidth: 80, align: 'center' },
          { prop: 'quality', label: '质量', minWidth: 80, align: 'center' }
        ]
      let r = null
      function O() {
        d.value &&
          ((r ??= G(d.value)),
          r.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['OEE', '利用率', '性能', '质量'] },
            xAxis: { type: 'category', data: n.value.months },
            yAxis: { type: 'value', max: 100 },
            series: [
              { name: 'OEE', type: 'line', data: n.value.oee, itemStyle: { color: '#409eff' } },
              { name: '利用率', type: 'line', data: n.value.utilization, itemStyle: { color: '#67c23a' } },
              { name: '性能', type: 'line', data: n.value.performance, itemStyle: { color: '#e6a23c' } },
              { name: '质量', type: 'line', data: n.value.quality, itemStyle: { color: '#f56c6c' } }
            ]
          }))
      }
      async function f() {
        const s = await J({ start_month: o.value?.[0], end_month: o.value?.[1] })
        ;((m.value = s.data.cards), (v.value = s.data.rankData), (n.value = s.data.trendData), O())
      }
      function g() {
        r?.resize()
      }
      return (
        S(async () => {
          ;(await f(), window.addEventListener('resize', g))
        }),
        D(() => {
          ;(window.removeEventListener('resize', g), r?.dispose())
        }),
        (s, i) => {
          const k = M,
            b = W,
            C = I,
            z = R,
            c = P,
            p = F,
            h = V,
            Y = y('gi-table'),
            q = y('gi-page-layout')
          return (
            _(),
            E(q, null, {
              header: e(() => [
                t(
                  C,
                  { inline: '' },
                  {
                    default: e(() => [
                      t(
                        b,
                        { label: '时间范围' },
                        {
                          default: e(() => [
                            t(
                              k,
                              {
                                modelValue: o.value,
                                'onUpdate:modelValue': i[0] || (i[0] = (a) => (o.value = a)),
                                type: 'monthrange',
                                'range-separator': '至',
                                'start-placeholder': '起始月',
                                'end-placeholder': '结束月',
                                format: 'YYYY-MM',
                                'value-format': 'YYYY-MM',
                                onChange: f
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
              default: e(() => [
                t(
                  h,
                  { gutter: 16 },
                  {
                    default: e(() => [
                      (_(!0),
                      L(
                        N,
                        null,
                        B(
                          m.value,
                          (a) => (
                            _(),
                            E(
                              p,
                              { key: a.title, span: 6 },
                              {
                                default: e(() => [
                                  t(
                                    c,
                                    { shadow: 'hover' },
                                    {
                                      default: e(() => [
                                        u('div', X, x(a.title), 1),
                                        u('div', j, [T(x(a.value), 1), i[1] || (i[1] = u('span', { class: 'card-unit' }, '%', -1))]),
                                        t(
                                          z,
                                          {
                                            percentage: a.value,
                                            'stroke-width': 12,
                                            color: a.value >= 85 ? '#67c23a' : a.value >= 70 ? '#e6a23c' : '#f56c6c'
                                          },
                                          null,
                                          8,
                                          ['percentage', 'color']
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
                t(
                  h,
                  { gutter: 16, style: { 'margin-top': '16px' } },
                  {
                    default: e(() => [
                      t(
                        p,
                        { span: 12 },
                        {
                          default: e(() => [
                            t(
                              c,
                              { header: 'OEE 趋势' },
                              { default: e(() => [u('div', { ref_key: 'chartRef', ref: d, style: { height: '300px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      t(
                        p,
                        { span: 12 },
                        {
                          default: e(() => [
                            t(
                              c,
                              { header: '设备 OEE 排行' },
                              {
                                default: e(() => [t(Y, { columns: w, data: v.value, border: '', stripe: '', size: 'small' }, null, 8, ['data'])]),
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
  te = U(H, [['__scopeId', 'data-v-b33293dc']])
export { te as default }

import {
  An as O,
  Bn as t,
  Cn as N,
  G as T,
  J as K,
  Mn as k,
  On as w,
  Rn as q,
  Tn as P,
  U as F,
  W as G,
  Xn as v,
  Yn as H,
  an as J,
  dn as a,
  i as X,
  in as Y,
  nt as Z,
  ot as $,
  pn as Q,
  q as ee,
  rr as h,
  rt as te,
  sn as ae,
  sr as d,
  tn as ne,
  tt as le,
  un as i
} from './element-plus-CzL7BOKu.js'
import { t as oe } from './echarts-BZg-173N.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { u as se } from './iot-C87u5rse.js'
var ie = Q({
    __name: 'index',
    setup(pe) {
      const V = ['数控车床 CK6150', '钻床 Z3050', '加工中心 VMC850'],
        m = v('数控车床 CK6150'),
        C = v([]),
        o = H({ rpm: 0, temp: 0, current: 0, vibration: 0, runtime: 12580 }),
        _ = v([]),
        R = [
          { prop: 'time', label: '时间', minWidth: 160 },
          { prop: 'rpm', label: '转速(rpm)', minWidth: 110, align: 'center' },
          { prop: 'temp', label: '温度(°C)', minWidth: 110, align: 'center' },
          { prop: 'current', label: '电流(A)', minWidth: 110, align: 'center' },
          { prop: 'vibration', label: '振动(mm/s)', minWidth: 120, align: 'center' }
        ],
        {
          tableData: A,
          pagination: B,
          loading: S,
          refresh: U
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: n, size: e }) => {
            const p = await se({ pageNum: n, pageSize: e, device: m.value || void 0 })
            return ((_.value = p.data.list || []), L(_.value), p.data)
          }
        }),
        g = v()
      let f = null
      function L(n) {
        const e = n[n.length - 1]
        e && ((o.rpm = e.rpm), (o.temp = e.temp), (o.current = e.current), (o.vibration = e.vibration))
      }
      function z(n) {
        g.value &&
          ((f ??= oe(g.value)),
          f.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['转速', '温度', '电流'] },
            xAxis: { type: 'category', data: n.map((e) => e.time.slice(11, 16)) },
            yAxis: [
              { type: 'value', name: '转速/温度' },
              { type: 'value', name: '电流(A)' }
            ],
            series: [
              { name: '转速', type: 'line', data: n.map((e) => e.rpm), smooth: !0, itemStyle: { color: '#409eff' } },
              { name: '温度', type: 'line', data: n.map((e) => e.temp), smooth: !0, itemStyle: { color: '#f56c6c' } },
              { name: '电流', type: 'line', yAxisIndex: 1, data: n.map((e) => e.current), smooth: !0, itemStyle: { color: '#67c23a' } }
            ]
          }))
      }
      function x() {
        f?.resize()
      }
      function D() {
        U()
      }
      function W() {
        const n = ['时间', '转速(rpm)', '温度(°C)', '电流(A)', '振动(mm/s)'],
          e = _.value.map((l) => [l.time, l.rpm, l.temp, l.current, l.vibration]),
          p = [n.join(','), ...e.map((l) => l.join(','))].join(`
`),
          y = new Blob(['\uFEFF' + p], { type: 'text/csv;charset=utf-8' }),
          r = URL.createObjectURL(y),
          c = document.createElement('a')
        ;((c.href = r), (c.download = `设备历史数据_${m.value}_2026-06-30.csv`), c.click(), URL.revokeObjectURL(r), X.success('导出成功'))
      }
      return (
        q(_, (n) => {
          z(n)
        }),
        P(() => {
          window.addEventListener('resize', x)
        }),
        N(() => {
          ;(window.removeEventListener('resize', x), f?.dispose())
        }),
        (n, e) => {
          const p = Z,
            y = te,
            r = ee,
            c = T,
            l = $,
            E = K,
            b = le,
            u = G,
            j = F,
            I = k('gi-table'),
            M = k('gi-page-layout')
          return (
            w(),
            J(M, null, {
              header: t(() => [
                a(
                  E,
                  { gutter: 12 },
                  {
                    default: t(() => [
                      a(
                        r,
                        { span: 6 },
                        {
                          default: t(() => [
                            a(
                              y,
                              {
                                modelValue: m.value,
                                'onUpdate:modelValue': e[0] || (e[0] = (s) => (m.value = s)),
                                placeholder: '选择设备',
                                style: { width: '100%' }
                              },
                              {
                                default: t(() => [
                                  (w(),
                                  ae(
                                    ne,
                                    null,
                                    O(V, (s) => a(p, { key: s, label: s, value: s }, null, 8, ['label', 'value'])),
                                    64
                                  ))
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        r,
                        { span: 8 },
                        {
                          default: t(() => [
                            a(
                              c,
                              {
                                modelValue: C.value,
                                'onUpdate:modelValue': e[1] || (e[1] = (s) => (C.value = s)),
                                type: 'daterange',
                                'start-placeholder': '开始日期',
                                'end-placeholder': '结束日期',
                                style: { width: '100%' }
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        r,
                        { span: 4 },
                        {
                          default: t(() => [
                            a(l, { type: 'primary', onClick: D }, { default: t(() => [...(e[2] || (e[2] = [i('查询', -1)]))]), _: 1 })
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              tool: t(() => [a(l, { type: 'primary', onClick: W }, { default: t(() => [...(e[3] || (e[3] = [i('导出 CSV', -1)]))]), _: 1 })]),
              default: t(() => [
                a(
                  E,
                  { gutter: 16 },
                  {
                    default: t(() => [
                      a(
                        r,
                        { span: 16 },
                        {
                          default: t(() => [
                            a(
                              b,
                              { header: '实时趋势' },
                              { default: t(() => [Y('div', { ref_key: 'chartRef', ref: g, style: { height: '350px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        r,
                        { span: 8 },
                        {
                          default: t(() => [
                            a(
                              b,
                              { header: '当前值' },
                              {
                                default: t(() => [
                                  a(
                                    j,
                                    { column: 1, border: '' },
                                    {
                                      default: t(() => [
                                        a(u, { label: '转速' }, { default: t(() => [i(d(o.rpm) + ' rpm', 1)]), _: 1 }),
                                        a(u, { label: '温度' }, { default: t(() => [i(d(o.temp) + ' °C', 1)]), _: 1 }),
                                        a(u, { label: '电流' }, { default: t(() => [i(d(o.current) + ' A', 1)]), _: 1 }),
                                        a(u, { label: '振动' }, { default: t(() => [i(d(o.vibration) + ' mm/s', 1)]), _: 1 }),
                                        a(u, { label: '运行时长' }, { default: t(() => [i(d(o.runtime) + ' h', 1)]), _: 1 })
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
                  }
                ),
                a(
                  b,
                  { header: '历史数据', style: { 'margin-top': '16px' } },
                  {
                    default: t(() => [
                      a(I, { columns: R, data: h(A), pagination: h(B), loading: h(S), border: '', stripe: '', size: 'small' }, null, 8, [
                        'data',
                        'pagination',
                        'loading'
                      ])
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
  _e = ie
export { _e as default }

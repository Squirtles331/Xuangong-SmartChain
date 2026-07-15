import {
  Bn as t,
  Cn as w,
  Mn as d,
  On as C,
  Tn as z,
  Xn as i,
  an as M,
  dn as l,
  i as B,
  in as E,
  it as R,
  ot as W,
  pn as k,
  sr as N,
  tt as P,
  un as m,
  xn as S
} from './element-plus-CzL7BOKu.js'
import { t as T } from './echarts-BZg-173N.js'
import { s as V } from './mrp-CaR7BBur.js'
var A = k({
    __name: 'index',
    setup(D) {
      const s = i(null),
        r = i([]),
        a = i([])
      let n = null
      const _ = [
        { prop: 'material', label: '物料', minWidth: 160 },
        { prop: 'from_plant', label: '调出工厂', minWidth: 120 },
        { prop: 'to_plant', label: '调入工厂', minWidth: 120 },
        { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
        { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
        { prop: 'suggestion', label: '建议', minWidth: 260 }
      ]
      function y() {
        s.value &&
          ((n ??= T(s.value)),
          n.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['总产能', '已使用'] },
            xAxis: { type: 'category', data: a.value.map((e) => e.plant) },
            yAxis: { type: 'value', name: '产能' },
            series: [
              { name: '总产能', type: 'bar', data: a.value.map((e) => e.capacity), itemStyle: { color: '#409eff' }, barGap: '10%' },
              {
                name: '已使用',
                type: 'bar',
                data: a.value.map((e) => e.used),
                itemStyle: { color: '#67c23a' },
                label: { show: !0, position: 'top', formatter: (e) => `${a.value[e.dataIndex]?.utilization ?? 0}%` }
              }
            ]
          }))
      }
      async function p() {
        const e = await V({ pageNum: 1, pageSize: 100 })
        ;((a.value = e.data.plantCapacity || []), (r.value = e.data.results || []), await S(), y())
      }
      async function f() {
        ;(await p(), B.success('多工厂 MRP 已完成'))
      }
      function u() {
        n?.resize()
      }
      return (
        z(async () => {
          ;(await p(), window.addEventListener('resize', u))
        }),
        w(() => {
          ;(window.removeEventListener('resize', u), n?.dispose())
        }),
        (e, c) => {
          const g = W,
            v = P,
            h = R,
            b = d('gi-table'),
            x = d('gi-page-layout')
          return (
            C(),
            M(x, null, {
              tool: t(() => [l(g, { type: 'primary', onClick: f }, { default: t(() => [...(c[0] || (c[0] = [m('执行多工厂 MRP', -1)]))]), _: 1 })]),
              default: t(() => [
                l(
                  v,
                  { header: '工厂产能利用率', shadow: 'never', style: { 'margin-bottom': '16px' } },
                  { default: t(() => [E('div', { ref_key: 'chartRef', ref: s, style: { width: '100%', height: '300px' } }, null, 512)]), _: 1 }
                ),
                l(
                  b,
                  { columns: _, data: r.value, border: '', stripe: '' },
                  {
                    type: t(({ row: o }) => [
                      l(
                        h,
                        { type: o.type === 'transfer' ? 'warning' : o.type === 'purchase' ? 'primary' : 'success', size: 'small' },
                        { default: t(() => [m(N(o.type === 'transfer' ? '调拨' : o.type === 'purchase' ? '采购' : '生产'), 1)]), _: 2 },
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
            })
          )
        }
      )
    }
  }),
  G = A
export { G as default }

import {
  An as b,
  Bn as c,
  Cn as J,
  Mn as U,
  O as W,
  On as n,
  Tn as j,
  Xn as m,
  _ as F,
  an as S,
  dn as _,
  gt as X,
  i as z,
  in as s,
  ir as B,
  it as G,
  on as H,
  or as K,
  ot as Q,
  pn as Y,
  rr as Z,
  sn as i,
  sr as h,
  tn as k,
  tt as aa,
  un as $,
  v as ea
} from './element-plus-CzL7BOKu.js'
import { o as ta } from './vue-chunks-CWn_TkJU.js'
import { I as na } from './index-DqMfCNbk.js'
import { t as sa } from './echarts-BZg-173N.js'
import { a as la, n as oa, r as ra } from './aps-BGoKqO6s.js'
var ia = ta('aps-constraint', () => {
    function D(y, x, E) {
      const u = oa(),
        v = [],
        w = u.molds.find((l) => !l.available && y.includes(l.applicable))
      w && v.push(`模具不可用：${w.name}`)
      const g = u.tools.find((l) => !l.available && x.includes(l.applicable))
      g && v.push(`刀具不可用：${g.name}`)
      const d = u.skills.find((l) => y.includes(l.operation))
      d && d.workers_count < 2 && v.push(`技能人数不足：${d.skill} 当前仅 ${d.workers_count} 人`)
      const f = u.materialShortages.find((l) => E > 0)
      return (f && v.push(`物料短缺：${f.material} 缺口 ${f.qty_short}，预计 ${f.available_date} 到货`), v)
    }
    return { checkConflicts: D }
  }),
  ca = { class: 'aps-header' },
  da = { class: 'gantt-container' },
  ua = { class: 'gantt-sidebar' },
  pa = { class: 'gantt-wo-code' },
  _a = { class: 'gantt-wo-name' },
  va = { class: 'gantt-chart' },
  fa = { class: 'gantt-timeline' },
  ha = ['title'],
  ga = { key: 0, class: 'conflict-badge' },
  ma = { class: 'load-grid' },
  ya = { class: 'load-header' },
  ba = { class: 'load-name' },
  ka = { class: 'load-detail' },
  wa = { key: 1, class: 'conflict-list' },
  Sa = Y({
    __name: 'index',
    setup(D) {
      const y = m('gantt'),
        x = ia(),
        E = Array.from({ length: 21 }, (e, t) => {
          const o = new Date(2025, 0, 11 + t)
          return { label: `1/${11 + t}`, isWeekend: o.getDay() === 0 || o.getDay() === 6 }
        }),
        u = m([]),
        v = m([]),
        w = m([]),
        g = m({ days: [], series: [] }),
        d = m([]),
        f = m()
      let l = null
      function V() {
        f.value &&
          ((l ??= sa(f.value)),
          l.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: g.value.series.map((e) => e.name) },
            xAxis: { type: 'category', data: g.value.days },
            yAxis: { type: 'value', name: '负荷(h)' },
            series: g.value.series.map((e) => ({ name: e.name, type: 'line', data: e.data, itemStyle: { color: e.color } }))
          }))
      }
      async function A() {
        const e = await ra()
        ;((u.value = JSON.parse(JSON.stringify(e.data.ganttData || []))),
          (v.value = e.data.loadData || []),
          (w.value = e.data.scheduleOps || []),
          (g.value = e.data.loadTrend || { days: [], series: [] }),
          V())
      }
      function C() {
        const e = new Set(),
          t = []
        for (const o of w.value) {
          const p = x.checkConflicts(o.op, o.wc, o.qty)
          p.length > 0 && (t.push({ operation: o.op, reasons: p }), e.add(o.op.replace(/^工序\d+:/, '')))
        }
        ;((d.value = t),
          u.value.forEach((o) => {
            o.segments.forEach((p) => {
              p.conflict = e.has(p.name)
            })
          }))
      }
      async function N() {
        const e = await la()
        if ((await A(), C(), d.value.length === 0)) {
          z.success(e.msg || '排程完成，所有约束通过')
          return
        }
        ;(z.warning(`排程完成，发现 ${d.value.length} 个约束冲突`), (y.value = 'conflicts'))
      }
      function P() {
        l?.resize()
      }
      return (
        j(async () => {
          ;(await A(), C(), window.addEventListener('resize', P))
        }),
        J(() => {
          ;(window.removeEventListener('resize', P), l?.dispose())
        }),
        (e, t) => {
          const o = Q,
            p = F,
            M = G,
            R = W,
            O = aa,
            T = X,
            I = ea,
            L = U('gi-page-layout')
          return (
            n(),
            S(L, null, {
              header: c(() => [
                s('div', ca, [
                  t[4] || (t[4] = s('h2', null, 'APS 排程', -1)),
                  s('div', null, [
                    _(o, { type: 'primary', onClick: N }, { default: c(() => [...(t[2] || (t[2] = [$('运行排程', -1)]))]), _: 1 }),
                    _(
                      o,
                      { onClick: t[0] || (t[0] = (a) => e.$router.push('/engineering-plan/planning/aps/history')) },
                      { default: c(() => [...(t[3] || (t[3] = [$('历史版本', -1)]))]), _: 1 }
                    )
                  ])
                ])
              ]),
              default: c(() => [
                _(
                  I,
                  { modelValue: y.value, 'onUpdate:modelValue': t[1] || (t[1] = (a) => (y.value = a)) },
                  {
                    default: c(() => [
                      _(
                        p,
                        { label: '工单甘特图', name: 'gantt' },
                        {
                          default: c(() => [
                            s('div', da, [
                              s('div', ua, [
                                (n(!0),
                                i(
                                  k,
                                  null,
                                  b(
                                    u.value,
                                    (a) => (
                                      n(),
                                      i('div', { key: a.id, class: 'gantt-row-label' }, [s('div', pa, h(a.code), 1), s('div', _a, h(a.material), 1)])
                                    )
                                  ),
                                  128
                                ))
                              ]),
                              s('div', va, [
                                s('div', fa, [
                                  (n(!0),
                                  i(
                                    k,
                                    null,
                                    b(
                                      Z(E),
                                      (a) => (n(), i('div', { key: a.label, class: B(['gantt-day', { weekend: a.isWeekend }]) }, h(a.label), 3))
                                    ),
                                    128
                                  ))
                                ]),
                                (n(!0),
                                i(
                                  k,
                                  null,
                                  b(
                                    u.value,
                                    (a) => (
                                      n(),
                                      i('div', { key: a.id, class: 'gantt-row' }, [
                                        (n(!0),
                                        i(
                                          k,
                                          null,
                                          b(
                                            a.segments,
                                            (r, q) => (
                                              n(),
                                              i(
                                                'div',
                                                {
                                                  key: q,
                                                  class: B(['gantt-bar', { 'gantt-bar-conflict': r.conflict }]),
                                                  style: K({
                                                    left: r.left + '%',
                                                    width: r.width + '%',
                                                    backgroundColor: r.conflict ? '#f56c6c' : r.color
                                                  }),
                                                  title: `${r.name} (${r.wc})${r.conflict ? ' [约束冲突]' : ''}`
                                                },
                                                [$(h(r.name) + ' ', 1), r.conflict ? (n(), i('span', ga, '!')) : H('', !0)],
                                                14,
                                                ha
                                              )
                                            )
                                          ),
                                          128
                                        ))
                                      ])
                                    )
                                  ),
                                  128
                                ))
                              ])
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      _(
                        p,
                        { label: '工作中心负荷', name: 'load' },
                        {
                          default: c(() => [
                            s('div', ma, [
                              (n(!0),
                              i(
                                k,
                                null,
                                b(
                                  v.value,
                                  (a) => (
                                    n(),
                                    S(
                                      O,
                                      { key: a.name, shadow: 'hover', class: 'load-card' },
                                      {
                                        default: c(() => [
                                          s('div', ya, [
                                            s('span', ba, h(a.name), 1),
                                            _(
                                              M,
                                              { type: a.loadPct > 90 ? 'danger' : a.loadPct > 70 ? 'warning' : 'success', size: 'small' },
                                              { default: c(() => [$(h(a.loadPct) + '% ', 1)]), _: 2 },
                                              1032,
                                              ['type']
                                            )
                                          ]),
                                          _(
                                            R,
                                            {
                                              percentage: a.loadPct,
                                              'stroke-width': 16,
                                              color: a.loadPct > 90 ? '#f56c6c' : a.loadPct > 70 ? '#e6a23c' : '#67c23a'
                                            },
                                            null,
                                            8,
                                            ['percentage', 'color']
                                          ),
                                          s('div', ka, h(a.used) + ' / ' + h(a.capacity), 1)
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
                            _(
                              O,
                              { header: '周负荷趋势', shadow: 'never', style: { 'margin-top': '16px' } },
                              { default: c(() => [s('div', { ref_key: 'chartRef', ref: f, style: { height: '300px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      _(
                        p,
                        { label: '约束冲突', name: 'conflicts' },
                        {
                          default: c(() => [
                            d.value.length === 0
                              ? (n(),
                                S(T, {
                                  key: 0,
                                  title: '排程通过',
                                  description: '所有约束检查通过，无冲突',
                                  type: 'success',
                                  'show-icon': '',
                                  closable: !1
                                }))
                              : (n(),
                                i('div', wa, [
                                  (n(!0),
                                  i(
                                    k,
                                    null,
                                    b(
                                      d.value,
                                      (a, r) => (
                                        n(),
                                        S(
                                          T,
                                          {
                                            key: r,
                                            title: a.operation,
                                            description: a.reasons.join('；'),
                                            type: a.reasons.length > 1 ? 'error' : 'warning',
                                            'show-icon': '',
                                            closable: !1,
                                            style: { 'margin-bottom': '8px' }
                                          },
                                          null,
                                          8,
                                          ['title', 'description', 'type']
                                        )
                                      )
                                    ),
                                    128
                                  ))
                                ]))
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
  Ca = na(Sa, [['__scopeId', 'data-v-35e8a7bc']])
export { Ca as default }

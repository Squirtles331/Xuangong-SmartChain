import {
  An as v,
  Bn as o,
  Cn as U,
  J as X,
  Mn as G,
  O as K,
  On as l,
  Tn as Q,
  Vn as Y,
  Xn as T,
  a as Z,
  an as ee,
  dn as i,
  in as e,
  ir as b,
  it as te,
  ot as ae,
  pn as se,
  q as oe,
  rn as h,
  sn as n,
  sr as s,
  tn as p,
  tt as re,
  un as C,
  xn as le
} from './element-plus-CzL7BOKu.js'
import { i as ne } from './vue-chunks-CWn_TkJU.js'
import { I as ie } from './index-DqMfCNbk.js'
import { t as de } from './echarts-BZg-173N.js'
import { r as ue } from './dashboard-ZM2ukubS.js'
var _e = { class: 'hero-card__content' },
  ce = { class: 'hero-copy' },
  ve = { class: 'hero-copy__title' },
  pe = { class: 'hero-copy__summary' },
  he = { class: 'hero-copy__tips' },
  ge = { class: 'hero-actions' },
  me = { class: 'hero-updated' },
  ye = { class: 'hero-actions__buttons' },
  fe = { class: 'workbench-section' },
  be = { class: 'todo-grid' },
  we = ['onClick'],
  ke = { class: 'todo-card__top' },
  Ce = { class: 'todo-card__system' },
  xe = { class: 'todo-card__value' },
  Se = { class: 'todo-card__title' },
  Te = { class: 'todo-card__helper' },
  Re = { class: 'alert-list' },
  $e = ['onClick'],
  Le = { class: 'alert-item__body' },
  Ee = { class: 'alert-item__meta' },
  De = { class: 'alert-item__type' },
  Ve = { class: 'alert-item__owner' },
  ze = { class: 'alert-item__title' },
  Be = { class: 'alert-item__footer' },
  Oe = { class: 'alert-item__action' },
  Ae = { class: 'execution-stats' },
  He = ['onClick'],
  Ie = { class: 'execution-stat__title' },
  Me = { class: 'execution-stat__value' },
  We = { class: 'chart-grid' },
  Ne = { class: 'chart-panel' },
  Pe = { class: 'load-panel' },
  Fe = ['onClick'],
  je = { class: 'load-item__head' },
  qe = { class: 'load-item__rate' },
  Je = { class: 'load-item__foot' },
  Ue = { class: 'domain-grid' },
  Xe = ['onClick'],
  Ge = { class: 'domain-card__head' },
  Ke = { class: 'domain-card__title' },
  Qe = { class: 'domain-card__owner' },
  Ye = { class: 'domain-card__badge' },
  Ze = { class: 'domain-summary' },
  et = { class: 'shortcut-grid' },
  tt = ['onClick'],
  at = { class: 'shortcut-card__badge' },
  st = { class: 'shortcut-card__title' },
  ot = { class: 'shortcut-card__meta' },
  rt = { class: 'workbench-section' },
  lt = { class: 'panel-card__header' },
  nt = { class: 'summary-grid' },
  it = ['onClick'],
  dt = { class: 'summary-metric__title' },
  ut = { class: 'summary-metric__value' },
  _t = se({
    __name: 'HomeView',
    setup(ct) {
      const V = ne(),
        x = T(!1),
        d = T(null),
        S = T()
      let y = null,
        w = null
      const z = h(() => d.value?.todoCards || []),
        R = h(() => d.value?.alerts || []),
        B = h(() => d.value?.executionStats || []),
        O = h(() => d.value?.collaborationDomains || []),
        A = h(() => d.value?.shortcuts || []),
        H = h(() => d.value?.businessSummary || []),
        I = h(() => d.value?.executionCharts.workshopLoad || []),
        M = h(() => R.value.slice(0, 3).map((r) => r.type)),
        W = { normal: 'primary', warning: 'warning', danger: 'danger', info: 'info' }
      function g(r, a) {
        return getComputedStyle(document.documentElement).getPropertyValue(r).trim() || a
      }
      function $(r) {
        return r === 'up' ? 'trend trend--up' : r === 'down' ? 'trend trend--down' : r === 'warning' ? 'trend trend--warning' : 'trend trend--flat'
      }
      function N(r) {
        return r === 'warning'
          ? g('--workbench-progress-warning', '#f97316')
          : r === 'busy'
            ? g('--workbench-progress-busy', '#3b82f6')
            : g('--workbench-progress-ok', '#22c55e')
      }
      function P(r) {
        return r === 'warning' ? '负荷偏高' : r === 'busy' ? '负荷紧张' : '负荷正常'
      }
      function _(r) {
        V.push(r)
      }
      function L() {
        const r = d.value?.executionCharts.statusDistribution || []
        if (!S.value || r.length === 0) return
        const a = g('--workbench-chart-axis', '#d0d7e2'),
          f = g('--workbench-chart-grid', '#eef2f7'),
          c = g('--workbench-chart-label', '#475569')
        ;((y ??= de(S.value)),
          y.setOption({
            tooltip: { trigger: 'item' },
            grid: { left: 12, right: 12, top: 24, bottom: 12, containLabel: !0 },
            xAxis: {
              type: 'category',
              data: r.map((m) => m.label),
              axisTick: { show: !1 },
              axisLine: { lineStyle: { color: a } },
              axisLabel: { color: c }
            },
            yAxis: { type: 'value', axisLabel: { color: c }, splitLine: { lineStyle: { color: f } } },
            series: [
              {
                type: 'bar',
                barWidth: 28,
                data: r.map((m) => ({ value: m.value, itemStyle: { color: m.color, borderRadius: [8, 8, 0, 0] } })),
                label: { show: !0, position: 'top', color: c }
              }
            ]
          }))
      }
      function E() {
        y?.resize()
      }
      async function F() {
        x.value = !0
        try {
          ;((d.value = (await ue()).data), await le(), L())
        } finally {
          x.value = !1
        }
      }
      return (
        Q(async () => {
          ;(await F(),
            window.addEventListener('resize', E),
            (w = new MutationObserver(() => {
              L()
            })),
            w.observe(document.documentElement, { attributes: !0, attributeFilter: ['class'] }))
        }),
        U(() => {
          ;(window.removeEventListener('resize', E), w?.disconnect(), (w = null), y?.dispose(), (y = null))
        }),
        (r, a) => {
          const f = ae,
            c = re,
            m = te,
            k = oe,
            j = K,
            D = X,
            q = G('gi-page-layout'),
            J = Z
          return Y(
            (l(),
            ee(
              q,
              { class: 'workbench-page' },
              {
                default: o(() => [
                  i(
                    c,
                    { class: 'hero-card', shadow: 'never' },
                    {
                      default: o(() => [
                        e('div', _e, [
                          e('div', ce, [
                            a[3] || (a[3] = e('div', { class: 'hero-copy__eyebrow' }, '工作台', -1)),
                            e('h2', ve, s(d.value?.headline || '今天优先处理执行阻塞与待办'), 1),
                            e('p', pe, s(d.value?.prioritySummary || '先处理缺料、停机、待裁决事项，再进入对应业务域继续执行。'), 1),
                            e('div', he, [
                              (l(!0),
                              n(
                                p,
                                null,
                                v(M.value, (t) => (l(), n('span', { key: t, class: 'hero-tip' }, s(t), 1))),
                                128
                              ))
                            ])
                          ]),
                          e('div', ge, [
                            e('div', me, '更新时间：' + s(d.value?.updatedAt || '今天 08:30'), 1),
                            e('div', ye, [
                              i(
                                f,
                                { type: 'primary', onClick: a[0] || (a[0] = (t) => _('/mes/traceability/kanban')) },
                                { default: o(() => [...(a[4] || (a[4] = [C('查看生产看板', -1)]))]), _: 1 }
                              ),
                              i(
                                f,
                                { onClick: a[1] || (a[1] = (t) => _('/bi/dashboard')) },
                                { default: o(() => [...(a[5] || (a[5] = [C('进入经营驾驶舱', -1)]))]), _: 1 }
                              )
                            ])
                          ])
                        ])
                      ]),
                      _: 1
                    }
                  ),
                  e('section', fe, [
                    a[7] ||
                      (a[7] = e(
                        'div',
                        { class: 'section-heading' },
                        [
                          e('div', null, [
                            e('h3', null, '我的待办'),
                            e('p', null, '把需要动作的事项放在最前面，登录后先处理待办，再进入对应业务域继续执行。')
                          ])
                        ],
                        -1
                      )),
                    e('div', be, [
                      (l(!0),
                      n(
                        p,
                        null,
                        v(
                          z.value,
                          (t) => (
                            l(),
                            n(
                              'button',
                              { key: t.id, type: 'button', class: b(['todo-card', `todo-card--${t.severity}`]), onClick: (u) => _(t.targetRoute) },
                              [
                                e('div', ke, [
                                  e('span', Ce, s(t.ownerSystem), 1),
                                  i(
                                    m,
                                    { type: W[t.severity], effect: 'light', round: '' },
                                    { default: o(() => [C(s(t.targetLabel), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                e('div', xe, [e('strong', null, s(t.count), 1), a[6] || (a[6] = e('span', null, '项', -1))]),
                                e('div', Se, s(t.title), 1),
                                e('div', Te, s(t.helperText), 1)
                              ],
                              10,
                              we
                            )
                          )
                        ),
                        128
                      ))
                    ])
                  ]),
                  i(
                    D,
                    { gutter: 16, class: 'section-row' },
                    {
                      default: o(() => [
                        i(
                          k,
                          { xs: 24, lg: 9 },
                          {
                            default: o(() => [
                              i(
                                c,
                                { class: 'panel-card', shadow: 'never' },
                                {
                                  header: o(() => [
                                    ...(a[8] ||
                                      (a[8] = [
                                        e(
                                          'div',
                                          { class: 'panel-card__header' },
                                          [
                                            e('div', null, [
                                              e('h3', null, '今日异常与预警'),
                                              e('p', null, '优先暴露阻塞执行的事项，先锁定、再处置、再放行。')
                                            ])
                                          ],
                                          -1
                                        )
                                      ]))
                                  ]),
                                  default: o(() => [
                                    e('div', Re, [
                                      (l(!0),
                                      n(
                                        p,
                                        null,
                                        v(
                                          R.value,
                                          (t) => (
                                            l(),
                                            n(
                                              'button',
                                              { key: t.id, type: 'button', class: 'alert-item', onClick: (u) => _(t.targetRoute) },
                                              [
                                                e('div', { class: b(['alert-item__indicator', `alert-item__indicator--${t.level}`]) }, null, 2),
                                                e('div', Le, [
                                                  e('div', Ee, [e('span', De, s(t.type), 1), e('span', Ve, s(t.ownerSystem), 1)]),
                                                  e('div', ze, s(t.title), 1),
                                                  e('div', Be, [
                                                    e('span', null, '影响对象：' + s(t.affectedObject), 1),
                                                    e('span', Oe, s(t.actionText), 1)
                                                  ])
                                                ])
                                              ],
                                              8,
                                              $e
                                            )
                                          )
                                        ),
                                        128
                                      ))
                                    ])
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            _: 1
                          }
                        ),
                        i(
                          k,
                          { xs: 24, lg: 15 },
                          {
                            default: o(() => [
                              i(
                                c,
                                { class: 'panel-card', shadow: 'never' },
                                {
                                  header: o(() => [
                                    ...(a[9] ||
                                      (a[9] = [
                                        e(
                                          'div',
                                          { class: 'panel-card__header' },
                                          [
                                            e('div', null, [
                                              e('h3', null, '执行总览'),
                                              e('p', null, '围绕工单、工序任务、WIP 与报工，快速判断今天的执行节奏。')
                                            ])
                                          ],
                                          -1
                                        )
                                      ]))
                                  ]),
                                  default: o(() => [
                                    e('div', Ae, [
                                      (l(!0),
                                      n(
                                        p,
                                        null,
                                        v(
                                          B.value,
                                          (t) => (
                                            l(),
                                            n(
                                              'button',
                                              { key: t.id, type: 'button', class: 'execution-stat', onClick: (u) => _(t.targetRoute) },
                                              [
                                                e('div', Ie, s(t.title), 1),
                                                e('div', Me, [e('strong', null, s(t.value), 1), e('span', null, s(t.unit), 1)]),
                                                e('div', { class: b(['execution-stat__trend', $(t.trendDirection)]) }, s(t.trendText || '—'), 3)
                                              ],
                                              8,
                                              He
                                            )
                                          )
                                        ),
                                        128
                                      ))
                                    ]),
                                    e('div', We, [
                                      e('div', Ne, [
                                        a[10] || (a[10] = e('div', { class: 'chart-panel__title' }, '执行状态分布', -1)),
                                        e('div', { ref_key: 'statusChartRef', ref: S, class: 'chart-panel__chart' }, null, 512)
                                      ]),
                                      e('div', Pe, [
                                        a[11] || (a[11] = e('div', { class: 'chart-panel__title' }, '车间负荷摘要', -1)),
                                        (l(!0),
                                        n(
                                          p,
                                          null,
                                          v(
                                            I.value,
                                            (t) => (
                                              l(),
                                              n(
                                                'button',
                                                { key: t.workshop, type: 'button', class: 'load-item', onClick: (u) => _(t.targetRoute) },
                                                [
                                                  e('div', je, [e('span', null, s(t.workshop), 1), e('span', qe, s(t.utilization) + '%', 1)]),
                                                  i(j, { percentage: t.utilization, 'show-text': !1, color: N(t.status) }, null, 8, [
                                                    'percentage',
                                                    'color'
                                                  ]),
                                                  e('div', Je, [e('span', null, '在制 ' + s(t.wip) + ' 批', 1), e('span', null, s(P(t.status)), 1)])
                                                ],
                                                8,
                                                Fe
                                              )
                                            )
                                          ),
                                          128
                                        ))
                                      ])
                                    ])
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
                  i(
                    D,
                    { gutter: 16, class: 'section-row' },
                    {
                      default: o(() => [
                        i(
                          k,
                          { xs: 24, lg: 14 },
                          {
                            default: o(() => [
                              i(
                                c,
                                { class: 'panel-card', shadow: 'never' },
                                {
                                  header: o(() => [
                                    ...(a[12] ||
                                      (a[12] = [
                                        e(
                                          'div',
                                          { class: 'panel-card__header' },
                                          [
                                            e('div', null, [
                                              e('h3', null, '协同域摘要'),
                                              e('p', null, '看到哪些外围系统正在影响执行中枢，但首页只做聚合，不维护各自真相。')
                                            ])
                                          ],
                                          -1
                                        )
                                      ]))
                                  ]),
                                  default: o(() => [
                                    e('div', Ue, [
                                      (l(!0),
                                      n(
                                        p,
                                        null,
                                        v(
                                          O.value,
                                          (t) => (
                                            l(),
                                            n(
                                              'button',
                                              { key: t.domain, type: 'button', class: 'domain-card', onClick: (u) => _(t.targetRoute) },
                                              [
                                                e('div', Ge, [
                                                  e('div', null, [e('div', Ke, s(t.title), 1), e('div', Qe, s(t.ownerSystem), 1)]),
                                                  e('span', Ye, s(t.domain), 1)
                                                ]),
                                                e('div', Ze, [
                                                  (l(!0),
                                                  n(
                                                    p,
                                                    null,
                                                    v(
                                                      t.summaryItems,
                                                      (u) => (
                                                        l(),
                                                        n('div', { key: u.label, class: 'domain-summary__item' }, [
                                                          e('span', null, s(u.label), 1),
                                                          e('strong', { class: b(`domain-summary__value--${u.level}`) }, s(u.value), 3)
                                                        ])
                                                      )
                                                    ),
                                                    128
                                                  ))
                                                ])
                                              ],
                                              8,
                                              Xe
                                            )
                                          )
                                        ),
                                        128
                                      ))
                                    ])
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            _: 1
                          }
                        ),
                        i(
                          k,
                          { xs: 24, lg: 10 },
                          {
                            default: o(() => [
                              i(
                                c,
                                { class: 'panel-card', shadow: 'never' },
                                {
                                  header: o(() => [
                                    ...(a[13] ||
                                      (a[13] = [
                                        e(
                                          'div',
                                          { class: 'panel-card__header' },
                                          [
                                            e('div', null, [
                                              e('h3', null, '快捷入口'),
                                              e('p', null, '把高频静态页入口放在首页，减少从菜单逐层寻找的成本。')
                                            ])
                                          ],
                                          -1
                                        )
                                      ]))
                                  ]),
                                  default: o(() => [
                                    e('div', et, [
                                      (l(!0),
                                      n(
                                        p,
                                        null,
                                        v(
                                          A.value,
                                          (t) => (
                                            l(),
                                            n(
                                              'button',
                                              { key: t.id, type: 'button', class: 'shortcut-card', onClick: (u) => _(t.targetRoute) },
                                              [
                                                e('span', at, s(t.badge), 1),
                                                e('div', st, s(t.title), 1),
                                                e('div', ot, s(t.group) + ' · ' + s(t.ownerSystem), 1)
                                              ],
                                              8,
                                              tt
                                            )
                                          )
                                        ),
                                        128
                                      ))
                                    ])
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
                  e('section', rt, [
                    i(
                      c,
                      { class: 'panel-card summary-card', shadow: 'never' },
                      {
                        header: o(() => [
                          e('div', lt, [
                            a[15] ||
                              (a[15] = e(
                                'div',
                                null,
                                [
                                  e('h3', null, '经营摘要（轻量）'),
                                  e('p', null, '首页只保留健康度摘要，完整经营趋势、收入、成本与利润分析统一进入经营驾驶舱。')
                                ],
                                -1
                              )),
                            i(
                              f,
                              { onClick: a[2] || (a[2] = (t) => _('/bi/dashboard')) },
                              { default: o(() => [...(a[14] || (a[14] = [C('查看完整经营驾驶舱', -1)]))]), _: 1 }
                            )
                          ])
                        ]),
                        default: o(() => [
                          e('div', nt, [
                            (l(!0),
                            n(
                              p,
                              null,
                              v(
                                H.value,
                                (t) => (
                                  l(),
                                  n(
                                    'button',
                                    { key: t.id, type: 'button', class: 'summary-metric', onClick: (u) => _(t.targetRoute) },
                                    [
                                      e('div', dt, s(t.title), 1),
                                      e('div', ut, [e('strong', null, s(t.value), 1), e('span', null, s(t.unit), 1)]),
                                      e('div', { class: b(['summary-metric__trend', $(t.trendDirection)]) }, s(t.trendText || '—'), 3)
                                    ],
                                    8,
                                    it
                                  )
                                )
                              ),
                              128
                            ))
                          ])
                        ]),
                        _: 1
                      }
                    )
                  ])
                ]),
                _: 1
              }
            )),
            [[J, x.value]]
          )
        }
      )
    }
  }),
  yt = ie(_t, [['__scopeId', 'data-v-e9f77e0d']])
export { yt as default }

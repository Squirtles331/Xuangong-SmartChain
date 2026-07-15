import {
  An as w,
  Bn as n,
  Mn as G,
  O as K,
  On as d,
  Xn as y,
  an as O,
  b as j,
  dn as s,
  gt as H,
  i as J,
  in as l,
  it as Q,
  nt as Y,
  ot as Z,
  pn as $,
  rn as _,
  rr as T,
  rt as ee,
  sn as p,
  sr as o,
  tn as x,
  tt as ae,
  un as g,
  y as le
} from './element-plus-CzL7BOKu.js'
import { I as te } from './index-DqMfCNbk.js'
import { t as W } from './StatusTag-DWd3m1xj.js'
import { c as A, l as E, n as se, r as ne, s as m, u as S } from './second-batch-static-BT92aayT.js'
var oe = { class: 'page-header' },
  re = { class: 'header-actions' },
  ie = { class: 'metric-grid' },
  de = { class: 'metric-value' },
  ue = { class: 'metric-value danger' },
  ve = { class: 'metric-value primary' },
  ce = { class: 'metric-value warning' },
  _e = { class: 'kanban-grid' },
  pe = { class: 'center-grid' },
  ge = { class: 'center-top' },
  me = { class: 'center-meta' },
  ke = { class: 'center-meta' },
  fe = { class: 'signal-list' },
  he = { class: 'signal-main' },
  be = { class: 'signal-sub' },
  we = { class: 'signal-sub' },
  ye = { class: 'stack-list' },
  xe = { class: 'stack-label' },
  Te = { class: 'stack-bar' },
  Ee = { class: 'stack-value' },
  Se = $({
    __name: 'index',
    setup(Pe) {
      const u = y(''),
        P = y(m(E)),
        C = y(m(S)),
        I = y(m(A)),
        V = Array.from(new Set([...E.map((a) => a.workshop_name), ...S.map((a) => a.workshop_name)])),
        k = _(() => P.value.filter((a) => !u.value || a.workshop_name === u.value)),
        h = _(() => C.value.filter((a) => !u.value || a.workshop_name === u.value)),
        B = _(() => I.value.filter((a) => !u.value || a.workshop_name === u.value)),
        b = _(() => ({
          runningTasks: k.value.filter((a) => a.status === 'running').length,
          riskyWip: h.value.filter((a) => a.status === 'frozen' || a.status === 'rework').length,
          awaitingRelease: B.value.filter((a) => a.status === 'awaiting_release').length,
          overdueSignals: k.value.filter((a) => a.delay_hours > 0).length + h.value.filter((a) => a.signal === 'overdue').length
        })),
        M = _(() =>
          Array.from(new Set(k.value.map((a) => a.work_center))).map((a) => {
            const e = k.value.filter((i) => i.work_center === a),
              v = e.filter((i) => i.status === 'running').length,
              r = e.filter((i) => i.blocked).length
            return {
              name: a,
              running: v,
              blocked: r,
              load: Math.min(100, Math.round((v / Math.max(e.length, 1)) * 100 + r * 15)),
              signal: r > 0 || e.some((i) => i.delay_hours > 0) ? (r > 0 ? 'overdue' : 'attention') : 'normal',
              reason: r > 0 ? '存在锁定或待释放任务' : v > 0 ? '需关注报工节拍' : '当前节奏平稳'
            }
          })
        ),
        R = _(() => B.value.filter((a) => a.status !== 'closed').slice(0, 4)),
        z = _(() => {
          const a = h.value.length || 1
          return [
            { key: 'queued', label: '待流转' },
            { key: 'processing', label: '加工中' },
            { key: 'frozen', label: '已冻结' },
            { key: 'rework', label: '返工中' },
            { key: 'completed', label: '已完成' }
          ].map((e) => {
            const v = h.value.filter((r) => r.status === e.key).length
            return { ...e, count: v, percent: Math.round((v / a) * 100) }
          })
        }),
        L = _(() => k.value.filter((a) => a.blocked || a.delay_hours > 0).slice(0, 6))
      function D() {
        ;((P.value = m(E)), (C.value = m(S)), (I.value = m(A)), J.success('生产看板快照已刷新'))
      }
      return (a, e) => {
        const v = Y,
          r = ee,
          i = Z,
          U = H,
          c = ae,
          N = K,
          f = j,
          X = Q,
          q = le,
          F = G('gi-page-layout')
        return (
          d(),
          O(F, null, {
            header: n(() => [
              l('div', oe, [
                e[2] ||
                  (e[2] = l(
                    'div',
                    null,
                    [l('h2', null, '生产看板'), l('p', null, '消费任务池、WIP 与异常信号，形成车间执行快照，不在本页维护源头事务。')],
                    -1
                  )),
                l('div', re, [
                  s(
                    r,
                    {
                      modelValue: u.value,
                      'onUpdate:modelValue': e[0] || (e[0] = (t) => (u.value = t)),
                      clearable: '',
                      placeholder: '全部车间',
                      style: { width: '180px' }
                    },
                    {
                      default: n(() => [
                        (d(!0),
                        p(
                          x,
                          null,
                          w(T(V), (t) => (d(), O(v, { key: t, label: t, value: t }, null, 8, ['label', 'value']))),
                          128
                        ))
                      ]),
                      _: 1
                    },
                    8,
                    ['modelValue']
                  ),
                  s(i, { type: 'primary', onClick: D }, { default: n(() => [...(e[1] || (e[1] = [g('刷新快照', -1)]))]), _: 1 })
                ])
              ])
            ]),
            default: n(() => [
              s(U, {
                type: 'info',
                closable: !1,
                'show-icon': '',
                style: { 'margin-bottom': '16px' },
                title: '静态阶段口径：看板只展示执行快照与关注信号，不承担派工、报工、冻结或放行的源头维护。'
              }),
              l('div', ie, [
                s(
                  c,
                  { shadow: 'never' },
                  {
                    default: n(() => [
                      e[3] || (e[3] = l('div', { class: 'metric-label' }, '执行中任务', -1)),
                      l('div', de, o(b.value.runningTasks), 1),
                      e[4] || (e[4] = l('div', { class: 'metric-tip' }, '来自工序任务池的当前执行量', -1))
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    default: n(() => [
                      e[5] || (e[5] = l('div', { class: 'metric-label' }, '冻结/返工 WIP', -1)),
                      l('div', ue, o(b.value.riskyWip), 1),
                      e[6] || (e[6] = l('div', { class: 'metric-tip' }, '需要重点跟踪回流和释放', -1))
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    default: n(() => [
                      e[7] || (e[7] = l('div', { class: 'metric-label' }, '待放行异常', -1)),
                      l('div', ve, o(b.value.awaitingRelease), 1),
                      e[8] || (e[8] = l('div', { class: 'metric-tip' }, '最接近恢复生产的异常队列', -1))
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    default: n(() => [
                      e[9] || (e[9] = l('div', { class: 'metric-label' }, '逾期信号', -1)),
                      l('div', ce, o(b.value.overdueSignals), 1),
                      e[10] || (e[10] = l('div', { class: 'metric-tip' }, '来自任务与 WIP 的复合关注', -1))
                    ]),
                    _: 1
                  }
                )
              ]),
              l('div', _e, [
                s(
                  c,
                  { shadow: 'never' },
                  {
                    header: n(() => [...(e[11] || (e[11] = [g('工作中心负荷', -1)]))]),
                    default: n(() => [
                      l('div', pe, [
                        (d(!0),
                        p(
                          x,
                          null,
                          w(
                            M.value,
                            (t) => (
                              d(),
                              p('div', { key: t.name, class: 'center-card' }, [
                                l('div', ge, [
                                  l('strong', null, o(t.name), 1),
                                  s(W, { value: t.signal, options: T(ne) }, null, 8, ['value', 'options'])
                                ]),
                                l('div', me, '执行中 ' + o(t.running) + ' 项 · 阻塞 ' + o(t.blocked) + ' 项', 1),
                                s(N, { percentage: t.load, 'stroke-width': 8 }, null, 8, ['percentage']),
                                l('div', ke, '关注原因：' + o(t.reason), 1)
                              ])
                            )
                          ),
                          128
                        ))
                      ])
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    header: n(() => [...(e[12] || (e[12] = [g('异常聚焦', -1)]))]),
                    default: n(() => [
                      l('div', fe, [
                        (d(!0),
                        p(
                          x,
                          null,
                          w(
                            R.value,
                            (t) => (
                              d(),
                              p('div', { key: t.id, class: 'signal-item' }, [
                                l('div', he, [
                                  l('strong', null, o(t.exception_code), 1),
                                  s(W, { value: t.status, options: T(se) }, null, 8, ['value', 'options'])
                                ]),
                                l('div', be, o(t.lock_scope), 1),
                                l('div', we, '放行前提：' + o(t.release_gate), 1)
                              ])
                            )
                          ),
                          128
                        ))
                      ])
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    header: n(() => [...(e[13] || (e[13] = [g('WIP 压力分布', -1)]))]),
                    default: n(() => [
                      l('div', ye, [
                        (d(!0),
                        p(
                          x,
                          null,
                          w(
                            z.value,
                            (t) => (
                              d(),
                              p('div', { key: t.label, class: 'stack-row' }, [
                                l('div', xe, o(t.label), 1),
                                l('div', Te, [s(N, { percentage: t.percent, 'stroke-width': 10, 'show-text': !1 }, null, 8, ['percentage'])]),
                                l('div', Ee, o(t.count), 1)
                              ])
                            )
                          ),
                          128
                        ))
                      ])
                    ]),
                    _: 1
                  }
                ),
                s(
                  c,
                  { shadow: 'never' },
                  {
                    header: n(() => [...(e[14] || (e[14] = [g('逾期与待协调任务', -1)]))]),
                    default: n(() => [
                      s(
                        q,
                        { data: L.value, border: '', size: 'small' },
                        {
                          default: n(() => [
                            s(f, { prop: 'task_code', label: '任务号', 'min-width': '130' }),
                            s(f, { prop: 'wo_code', label: '工单号', width: '140' }),
                            s(f, { prop: 'work_center', label: '工作中心', width: '120' }),
                            s(
                              f,
                              { label: '信号', width: '100', align: 'center' },
                              {
                                default: n(({ row: t }) => [
                                  s(
                                    X,
                                    { type: t.blocked ? 'danger' : 'warning', effect: 'light' },
                                    { default: n(() => [g(o(t.blocked ? '阻塞' : '逾期'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            s(f, { prop: 'release_note', label: '协调说明', 'min-width': '160' })
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
              ])
            ]),
            _: 1
          })
        )
      }
    }
  }),
  Oe = te(Se, [['__scopeId', 'data-v-eedea785']])
export { Oe as default }

import {
  An as W,
  Bn as n,
  Fn as $,
  I as Q,
  Mn as I,
  O as Z,
  On as i,
  Tn as ee,
  Xn as y,
  Yn as N,
  _ as le,
  an as c,
  bn as te,
  dn as t,
  ft as ae,
  i as T,
  in as o,
  it as oe,
  nt as ne,
  ot as re,
  pn as P,
  rn as O,
  rt as ie,
  sn as V,
  sr as r,
  tn as L,
  tt as se,
  un as m,
  v as ue,
  yn as de
} from './element-plus-CzL7BOKu.js'
import { I as pe } from './index-DqMfCNbk.js'
import { t as me } from './TableSetting-BqN9x3yX.js'
import { t as _e } from './CrudFormDialog-1OgQthWb.js'
import { a as ce, m as ve } from './work-order-Clsu8Szn.js'
var fe = P({
    __name: 'ExceptionFormDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} },
    emits: de(['confirm'], ['update:visible', 'update:form']),
    setup(E, { emit: w }) {
      const d = $(E, 'visible'),
        p = $(E, 'form'),
        g = w,
        s = [
          {
            type: 'select-v2',
            label: '异常类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '设备故障', value: 'equipment' },
                { label: '来料不良', value: 'material' },
                { label: '图纸或工艺错误', value: 'process' },
                { label: '其他', value: 'other' }
              ]
            }
          },
          { type: 'textarea', label: '描述', field: 'description', required: !0, props: { rows: 3, maxlength: 200, showWordLimit: !0 } }
        ]
      function u() {
        return !p.value.type || !p.value.description ? (T.warning('请填写异常类型和描述'), !1) : !0
      }
      function v() {
        ;(g('confirm'), (d.value = !1))
      }
      return (h, f) => (
        i(),
        c(
          _e,
          {
            visible: d.value,
            'onUpdate:visible': f[0] || (f[0] = (b) => (d.value = b)),
            form: p.value,
            'onUpdate:form': f[1] || (f[1] = (b) => (p.value = b)),
            title: '异常上报',
            columns: s,
            'label-width': 100,
            width: '500px',
            'before-submit': u,
            onSubmit: v
          },
          null,
          8,
          ['visible', 'form']
        )
      )
    }
  }),
  ye = fe,
  ge = { class: 'search-bar' },
  be = { key: 1, class: 'task-list' },
  we = { class: 'task-header' },
  he = { class: 'task-code' },
  ke = { class: 'task-body' },
  xe = { class: 'task-footer' },
  Ve = { class: 'search-bar' },
  Ee = { key: 1, class: 'task-list' },
  qe = { class: 'task-header' },
  Ce = { class: 'task-code' },
  Te = { class: 'task-body' },
  Me = { class: 'task-footer' },
  Ue = P({
    __name: 'index',
    setup(E) {
      const w = y('assigned'),
        d = y([]),
        p = y([]),
        g = y([]),
        s = N({ keyword: '', priority: '' }),
        u = N({ keyword: '', priority: '' }),
        v = y(!1),
        h = y({ type: 'equipment', description: '' }),
        f = [
          { prop: 'wo_code', label: '工单号', width: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 140 },
          { prop: 'operation_name', label: '工序', width: 100 },
          { prop: 'reported_qty', label: '报工数', minWidth: 80, align: 'center' },
          { label: '状态', minWidth: 80, slotName: 'status', align: 'center' }
        ]
      ee(() => {
        b()
      })
      async function b() {
        try {
          const a = await ce()
          ;((d.value = a.data.assigned || []), (p.value = a.data.running || []), (g.value = a.data.completed || []))
        } catch {
          ;((d.value = []), (p.value = []), (g.value = []))
        }
      }
      const M = O(() => d.value.filter((a) => !((s.keyword && !a.wo_code.includes(s.keyword)) || (s.priority && a.wo_priority !== s.priority)))),
        U = O(() => p.value.filter((a) => !((u.keyword && !a.wo_code.includes(u.keyword)) || (u.priority && a.wo_priority !== u.priority))))
      function A(a) {
        return { urgent: '紧急', high: '高', normal: '普通', low: '低' }[a] || a
      }
      function R(a) {
        return a === 'urgent' ? 'danger' : a === 'high' ? 'warning' : 'info'
      }
      async function X(a) {
        ;(await ve(a.id), (d.value = d.value.filter((l) => l.id !== a.id)), p.value.unshift({ ...a, status: 'running' }), T.success('已开工'))
      }
      function Y(a) {
        ;((h.value = { type: 'equipment', description: '' }), (v.value = !0))
      }
      function j() {
        ;(T.success('异常已上报，维修人员已通知'), (v.value = !1))
      }
      return (a, l) => {
        const B = ae,
          _ = ne,
          F = ie,
          S = Q,
          k = oe,
          q = re,
          D = se,
          C = le,
          G = Z,
          H = I('gi-table'),
          J = ue,
          K = I('gi-page-layout')
        return (
          i(),
          c(K, null, {
            default: n(() => [
              t(
                J,
                { modelValue: w.value, 'onUpdate:modelValue': l[4] || (l[4] = (e) => (w.value = e)) },
                {
                  default: n(() => [
                    t(
                      C,
                      { label: '待开工', name: 'assigned' },
                      {
                        default: n(() => [
                          o('div', ge, [
                            t(
                              B,
                              {
                                modelValue: s.keyword,
                                'onUpdate:modelValue': l[0] || (l[0] = (e) => (s.keyword = e)),
                                placeholder: '搜索工单号',
                                clearable: '',
                                style: { width: '220px' }
                              },
                              null,
                              8,
                              ['modelValue']
                            ),
                            t(
                              F,
                              {
                                modelValue: s.priority,
                                'onUpdate:modelValue': l[1] || (l[1] = (e) => (s.priority = e)),
                                placeholder: '优先级',
                                clearable: '',
                                style: { width: '120px', 'margin-left': '8px' }
                              },
                              {
                                default: n(() => [
                                  t(_, { label: '紧急', value: 'urgent' }),
                                  t(_, { label: '高', value: 'high' }),
                                  t(_, { label: '普通', value: 'normal' }),
                                  t(_, { label: '低', value: 'low' })
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          M.value.length === 0
                            ? (i(), c(S, { key: 0, description: '暂无待开工任务' }))
                            : (i(),
                              V('div', be, [
                                (i(!0),
                                V(
                                  L,
                                  null,
                                  W(
                                    M.value,
                                    (e) => (
                                      i(),
                                      c(
                                        D,
                                        { key: e.id, shadow: 'hover', class: 'task-card' },
                                        {
                                          default: n(() => [
                                            o('div', we, [
                                              o('span', he, r(e.wo_code), 1),
                                              t(
                                                k,
                                                { type: R(e.wo_priority), size: 'small' },
                                                { default: n(() => [m(r(A(e.wo_priority)), 1)]), _: 2 },
                                                1032,
                                                ['type']
                                              )
                                            ]),
                                            o('div', ke, [
                                              o('p', null, [o('strong', null, '工序' + r(e.operation_no) + '：', 1), m(r(e.operation_name), 1)]),
                                              o('p', null, '产品：' + r(e.material_name), 1),
                                              o('p', null, '工作中心：' + r(e.work_center), 1),
                                              o('p', null, '计划数量：' + r(e.planned_qty) + ' 件', 1),
                                              o('p', null, '计划时间：' + r(e.planned_start) + ' ~ ' + r(e.planned_end), 1)
                                            ]),
                                            o('div', xe, [
                                              t(
                                                q,
                                                { type: 'primary', onClick: (x) => X(e) },
                                                { default: n(() => [...(l[7] || (l[7] = [m('开工', -1)]))]), _: 1 },
                                                8,
                                                ['onClick']
                                              )
                                            ])
                                          ]),
                                          _: 2
                                        },
                                        1024
                                      )
                                    )
                                  ),
                                  128
                                ))
                              ]))
                        ]),
                        _: 1
                      }
                    ),
                    t(
                      C,
                      { label: '生产中', name: 'running' },
                      {
                        default: n(() => [
                          o('div', Ve, [
                            t(
                              B,
                              {
                                modelValue: u.keyword,
                                'onUpdate:modelValue': l[2] || (l[2] = (e) => (u.keyword = e)),
                                placeholder: '搜索工单号',
                                clearable: '',
                                style: { width: '220px' }
                              },
                              null,
                              8,
                              ['modelValue']
                            ),
                            t(
                              F,
                              {
                                modelValue: u.priority,
                                'onUpdate:modelValue': l[3] || (l[3] = (e) => (u.priority = e)),
                                placeholder: '优先级',
                                clearable: '',
                                style: { width: '120px', 'margin-left': '8px' }
                              },
                              {
                                default: n(() => [
                                  t(_, { label: '紧急', value: 'urgent' }),
                                  t(_, { label: '高', value: 'high' }),
                                  t(_, { label: '普通', value: 'normal' }),
                                  t(_, { label: '低', value: 'low' })
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          U.value.length === 0
                            ? (i(), c(S, { key: 0, description: '暂无生产中任务' }))
                            : (i(),
                              V('div', Ee, [
                                (i(!0),
                                V(
                                  L,
                                  null,
                                  W(
                                    U.value,
                                    (e) => (
                                      i(),
                                      c(
                                        D,
                                        { key: e.id, shadow: 'hover', class: 'task-card' },
                                        {
                                          default: n(() => [
                                            o('div', qe, [
                                              o('span', Ce, r(e.wo_code), 1),
                                              t(
                                                k,
                                                { type: 'warning', size: 'small' },
                                                { default: n(() => [...(l[8] || (l[8] = [m('进行中', -1)]))]), _: 1 }
                                              )
                                            ]),
                                            o('div', Te, [
                                              o('p', null, [o('strong', null, '工序' + r(e.operation_no) + '：', 1), m(r(e.operation_name), 1)]),
                                              o('p', null, '产品：' + r(e.material_name), 1),
                                              o('p', null, '已报工：' + r(e.reported_qty) + ' / ' + r(e.planned_qty) + ' 件', 1),
                                              t(G, { percentage: Math.round((e.reported_qty / e.planned_qty) * 100), 'stroke-width': 8 }, null, 8, [
                                                'percentage'
                                              ])
                                            ]),
                                            o('div', Me, [
                                              t(
                                                q,
                                                { type: 'success', onClick: (x) => a.$router.push(`/mes/execution/report/${e.wo_id}`) },
                                                { default: n(() => [...(l[9] || (l[9] = [m('报工', -1)]))]), _: 1 },
                                                8,
                                                ['onClick']
                                              ),
                                              t(
                                                q,
                                                { type: 'warning', onClick: (x) => Y(e) },
                                                { default: n(() => [...(l[10] || (l[10] = [m('异常上报', -1)]))]), _: 1 },
                                                8,
                                                ['onClick']
                                              )
                                            ])
                                          ]),
                                          _: 2
                                        },
                                        1024
                                      )
                                    )
                                  ),
                                  128
                                ))
                              ]))
                        ]),
                        _: 1
                      }
                    ),
                    t(
                      C,
                      { label: '已完工', name: 'completed' },
                      {
                        default: n(() => [
                          t(
                            me,
                            { title: '已完工任务', columns: f },
                            {
                              default: n(({ settingColumns: e, tableProps: x }) => [
                                t(
                                  H,
                                  te({ columns: e, data: g.value }, x, { border: '', size: 'small' }),
                                  {
                                    status: n(({ row: z }) => [
                                      z.qc_required && !z.inspected
                                        ? (i(),
                                          c(
                                            k,
                                            { key: 0, type: 'warning', size: 'small' },
                                            { default: n(() => [...(l[11] || (l[11] = [m('待质检', -1)]))]), _: 1 }
                                          ))
                                        : (i(),
                                          c(
                                            k,
                                            { key: 1, type: 'success', size: 'small' },
                                            { default: n(() => [...(l[12] || (l[12] = [m('已完工', -1)]))]), _: 1 }
                                          ))
                                    ]),
                                    _: 1
                                  },
                                  16,
                                  ['columns', 'data']
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
                },
                8,
                ['modelValue']
              ),
              t(
                ye,
                {
                  visible: v.value,
                  'onUpdate:visible': l[5] || (l[5] = (e) => (v.value = e)),
                  form: h.value,
                  'onUpdate:form': l[6] || (l[6] = (e) => (h.value = e)),
                  onConfirm: j
                },
                null,
                8,
                ['visible', 'form']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  We = pe(Ue, [['__scopeId', 'data-v-eaf361ea']])
export { We as default }

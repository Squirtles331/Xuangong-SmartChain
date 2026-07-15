import {
  An as X,
  Bn as t,
  Fn as E,
  J as Y,
  Kn as Q,
  Mn as f,
  On as S,
  Tn as Z,
  Xn as v,
  Yn as $,
  an as D,
  bn as ee,
  dn as a,
  i as M,
  in as x,
  or as te,
  pn as U,
  q as ae,
  rn as oe,
  rr as d,
  sn as ie,
  sr as m,
  tn as ne,
  tt as le,
  un as C,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { I as re } from './index-DqMfCNbk.js'
import { t as se } from './useTable-Hzr4fBAy.js'
import { t as ue } from './TableSetting-BqN9x3yX.js'
import { t as de } from './SearchSetting-RejIVc8W.js'
import { d as me, g as pe, r as ce, u as fe } from './hr-Bw34TP1R.js'
var _e = U({
    __name: 'PieceworkFormDialog',
    props: R({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: b }) {
      const V = g,
        _ = E(g, 'visible'),
        n = E(g, 'form'),
        y = b,
        h = oe(() => (V.mode === 'add' ? '新增计件单价' : '编辑计件单价')),
        r = [
          { type: 'input', label: '工序名称', field: 'operation', required: !0 },
          { type: 'input-number', label: '计件单价(元)', field: 'unit_price', required: !0, props: { min: 0, precision: 2 } },
          { type: 'input', label: '单位', field: 'unit' },
          { type: 'input-number', label: '合格奖励(元)', field: 'qualified_bonus', props: { min: 0, precision: 2 } },
          { type: 'input-number', label: '不良扣款(元)', field: 'defective_penalty', props: { min: 0, precision: 2 } }
        ]
      function p() {
        _.value = !1
      }
      async function o() {
        return (y('submit'), !1)
      }
      return (F, c) => {
        const q = f('gi-form'),
          w = f('gi-dialog')
        return (
          S(),
          D(
            w,
            {
              modelValue: _.value,
              'onUpdate:modelValue': c[1] || (c[1] = (s) => (_.value = s)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': o,
              'on-cancel': p,
              title: h.value,
              width: '600px'
            },
            {
              default: t(() => [
                a(q, { modelValue: n.value, 'onUpdate:modelValue': c[0] || (c[0] = (s) => (n.value = s)), columns: r, 'label-width': 110 }, null, 8, [
                  'modelValue'
                ])
              ]),
              _: 1
            },
            8,
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  ve = _e,
  ge = { class: 'card-title' },
  be = { class: 'card-value' },
  ye = U({
    __name: 'index',
    setup(g) {
      const b = [{ type: 'input', label: '工序名称', field: 'keyword' }],
        V = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        _ = [
          { prop: 'operation', label: '工序名称', minWidth: 140 },
          { prop: 'unit_price', label: '计件单价(元)', minWidth: 120, align: 'right', slotName: 'unit_price' },
          { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
          { prop: 'qualified_bonus', label: '合格奖励(元)', minWidth: 120, align: 'right', slotName: 'qualified_bonus' },
          { prop: 'defective_penalty', label: '不良扣款(元)', minWidth: 120, align: 'right', slotName: 'defective_penalty' },
          { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = $({ keyword: '' })
      const y = v([...b]),
        h = v([]),
        r = v(!1),
        p = v('add'),
        o = v(N()),
        {
          tableData: F,
          pagination: c,
          loading: q,
          search: w,
          refresh: s
        } = se({ rowKey: 'id', listAPI: async ({ page: l, size: i }) => (await fe({ pageNum: l, pageSize: i, keyword: n.keyword || void 0 })).data })
      function N() {
        return { id: '', operation: '', unit_price: 0, unit: '件', qualified_bonus: 0, defective_penalty: 0 }
      }
      function k(l) {
        return l.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      function W(l) {
        y.value = l
      }
      function A() {
        ;(Object.assign(n, { keyword: '' }), w())
      }
      function H() {
        ;((p.value = 'add'), (o.value = N()), (r.value = !0))
      }
      function I(l) {
        ;((p.value = 'edit'), (o.value = { ...l }), (r.value = !0))
      }
      async function B() {
        h.value = (await me()).data
      }
      async function T() {
        if (!o.value.operation) {
          M.warning('请填写工序名称')
          return
        }
        ;(p.value === 'add' ? (await ce(o.value), M.success('新增成功')) : (await pe(o.value.id, o.value), M.success('编辑成功')),
          (r.value = !1),
          await Promise.all([s(), B()]))
      }
      return (
        Z(() => {
          B()
        }),
        (l, i) => {
          const z = f('gi-form'),
            P = f('gi-button'),
            L = le,
            K = ae,
            O = Y,
            j = f('gi-table'),
            G = f('gi-page-layout')
          return (
            S(),
            D(G, null, {
              header: t(() => [
                a(
                  de,
                  { columns: b, 'onUpdate:visibleFields': W },
                  {
                    default: t(() => [
                      a(
                        z,
                        {
                          modelValue: d(n),
                          'onUpdate:modelValue': i[0] || (i[0] = (e) => (Q(n) ? (n.value = e) : (n = e))),
                          columns: y.value,
                          'grid-item-props': V,
                          search: '',
                          onSearch: d(w),
                          onReset: A
                        },
                        null,
                        8,
                        ['modelValue', 'columns', 'onSearch']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              tool: t(() => [
                a(P, { type: 'add', onClick: H }),
                a(P, { type: 'reset', style: { 'margin-left': '8px' }, onClick: d(s) }, null, 8, ['onClick'])
              ]),
              default: t(() => [
                a(
                  O,
                  { gutter: 16, style: { 'margin-bottom': '16px' } },
                  {
                    default: t(() => [
                      (S(!0),
                      ie(
                        ne,
                        null,
                        X(
                          h.value,
                          (e) => (
                            S(),
                            D(
                              K,
                              { key: e.title, span: 6 },
                              {
                                default: t(() => [
                                  a(
                                    L,
                                    { shadow: 'hover' },
                                    {
                                      default: t(() => [
                                        x('div', ge, m(e.title), 1),
                                        x('div', be, [C(m(k(e.value)) + ' ', 1), i[3] || (i[3] = x('span', { class: 'card-unit' }, '元', -1))]),
                                        x(
                                          'div',
                                          { class: 'card-trend', style: te({ color: e.trend > 0 ? '#f56c6c' : '#67c23a' }) },
                                          m(e.trend > 0 ? '上升' : '下降') + ' ' + m(Math.abs(e.trend)) + '% ',
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
                  ue,
                  { title: '计件单价列表', columns: _, onRefresh: d(s) },
                  {
                    default: t(({ settingColumns: e, tableProps: J }) => [
                      a(
                        j,
                        ee({ columns: e, data: d(F), pagination: d(c), loading: d(q) }, J, { border: '', style: { height: '100%' } }),
                        {
                          unit_price: t(({ row: u }) => [C(m(k(u.unit_price)), 1)]),
                          qualified_bonus: t(({ row: u }) => [C(m(k(u.qualified_bonus)), 1)]),
                          defective_penalty: t(({ row: u }) => [C(m(k(u.defective_penalty)), 1)]),
                          actions: t(({ row: u }) => [a(P, { type: 'edit', onClick: (he) => I(u) }, null, 8, ['onClick'])]),
                          _: 1
                        },
                        16,
                        ['columns', 'data', 'pagination', 'loading']
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['onRefresh']
                ),
                a(
                  ve,
                  {
                    visible: r.value,
                    'onUpdate:visible': i[1] || (i[1] = (e) => (r.value = e)),
                    form: o.value,
                    'onUpdate:form': i[2] || (i[2] = (e) => (o.value = e)),
                    mode: p.value,
                    onSubmit: T
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
                )
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  qe = re(ye, [['__scopeId', 'data-v-417a338e']])
export { qe as default }

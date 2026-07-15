import {
  Bn as t,
  Fn as M,
  Kn as G,
  Mn as m,
  On as V,
  Xn as h,
  Yn as L,
  an as S,
  bn as X,
  dn as a,
  i as D,
  it as Y,
  on as $,
  ot as H,
  pn as w,
  rr as r,
  sr as J,
  un as E,
  yn as F
} from './element-plus-CzL7BOKu.js'
import { I as Q } from './index-DqMfCNbk.js'
import { t as Z } from './useTable-Hzr4fBAy.js'
import { t as ee } from './TableSetting-BqN9x3yX.js'
import { t as te } from './SearchSetting-RejIVc8W.js'
import { f as ae, s as le, t as ne } from './ehs-vbCVyqYW.js'
var ie = w({
    __name: 'TrainingFormDialog',
    props: F({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: F(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: v }) {
      const c = M(g, 'visible'),
        _ = M(g, 'form'),
        l = v,
        b = [
          { type: 'input', label: '培训主题', field: 'title', required: !0 },
          { type: 'input', label: '培训人', field: 'trainer', required: !0 },
          { type: 'input', label: '参训人员', field: 'trainees', props: { placeholder: '多人请用顿号或逗号分隔' } },
          { type: 'date-picker', label: '计划日期', field: 'plan_date' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待培训', value: 'pending' },
                { label: '已完成', value: 'completed' },
                { label: '已过期', value: 'expired' }
              ]
            }
          }
        ]
      function u() {
        c.value = !1
      }
      async function f() {
        return (l('submit'), !1)
      }
      return (n, d) => {
        const x = m('gi-form'),
          C = m('gi-dialog')
        return (
          V(),
          S(
            C,
            {
              modelValue: c.value,
              'onUpdate:modelValue': d[1] || (d[1] = (p) => (c.value = p)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': f,
              'on-cancel': u,
              title: g.mode === 'add' ? '新增培训记录' : '编辑培训记录',
              width: '600px'
            },
            {
              default: t(() => [
                a(x, { modelValue: _.value, 'onUpdate:modelValue': d[0] || (d[0] = (p) => (_.value = p)), columns: b, 'label-width': 100 }, null, 8, [
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
  oe = ie,
  se = w({
    __name: 'index',
    setup(g) {
      const v = [
          { type: 'input', label: '培训名称', field: 'title' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '待培训', value: 'pending' },
                { label: '已完成', value: 'completed' },
                { label: '已过期', value: 'expired' }
              ]
            }
          }
        ],
        c = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        _ = [
          { prop: 'title', label: '培训主题', minWidth: 220 },
          { prop: 'trainer', label: '培训人', minWidth: 140 },
          { prop: 'trainees', label: '参训人员', minWidth: 220 },
          { prop: 'plan_date', label: '计划日期', minWidth: 120 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let l = L({ title: '', status: '' })
      const b = h([...v]),
        u = h(!1),
        f = h('add'),
        n = h(T()),
        {
          tableData: d,
          pagination: x,
          loading: C,
          search: p,
          refresh: y
        } = Z({
          rowKey: 'id',
          listAPI: async ({ page: i, size: e }) => (await le({ pageNum: i, pageSize: e, title: l.title || void 0, status: l.status || void 0 })).data
        })
      function T() {
        return { id: '', title: '', trainer: '', trainees: '', plan_date: '', status: 'pending' }
      }
      function N(i) {
        b.value = i
      }
      function U() {
        ;(Object.assign(l, { title: '', status: '' }), p())
      }
      function W() {
        ;((f.value = 'add'), (n.value = T()), (u.value = !0))
      }
      function q(i) {
        ;((f.value = 'edit'), (n.value = { ...i }), (u.value = !0))
      }
      async function B() {
        if (!n.value.title) {
          D.warning('请填写培训主题')
          return
        }
        ;(await ae({ ...n.value, status: n.value.status }), (u.value = !1), await y())
      }
      async function R(i) {
        ;(await ne(i.id), D.success('培训完成'), await y())
      }
      return (i, e) => {
        const I = m('gi-form'),
          k = m('gi-button'),
          P = Y,
          z = H,
          A = m('gi-table'),
          K = m('gi-page-layout')
        return (
          V(),
          S(K, null, {
            header: t(() => [
              a(
                te,
                { columns: v, 'onUpdate:visibleFields': N },
                {
                  default: t(() => [
                    a(
                      I,
                      {
                        modelValue: r(l),
                        'onUpdate:modelValue': e[0] || (e[0] = (o) => (G(l) ? (l.value = o) : (l = o))),
                        columns: b.value,
                        'grid-item-props': c,
                        search: '',
                        onSearch: r(p),
                        onReset: U
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
              a(k, { type: 'add', onClick: W }),
              a(k, { type: 'reset', style: { 'margin-left': '8px' }, onClick: r(y) }, null, 8, ['onClick'])
            ]),
            default: t(() => [
              a(
                ee,
                { title: '培训记录', columns: _, onRefresh: r(y) },
                {
                  default: t(({ settingColumns: o, tableProps: O }) => [
                    a(
                      A,
                      X({ columns: o, data: r(d), pagination: r(x), loading: r(C) }, O, { border: '', style: { height: '100%' } }),
                      {
                        status: t(({ row: s }) => [
                          a(
                            P,
                            { type: s.status === 'completed' ? 'success' : s.status === 'pending' ? 'warning' : 'danger' },
                            { default: t(() => [E(J(s.status === 'completed' ? '已完成' : s.status === 'pending' ? '待培训' : '已过期'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: t(({ row: s }) => [
                          a(k, { type: 'edit', onClick: (j) => q(s) }, null, 8, ['onClick']),
                          s.status === 'pending'
                            ? (V(),
                              S(
                                z,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (j) => R(s) },
                                { default: t(() => [...(e[3] || (e[3] = [E('完成', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : $('', !0)
                        ]),
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
                oe,
                {
                  visible: u.value,
                  'onUpdate:visible': e[1] || (e[1] = (o) => (u.value = o)),
                  form: n.value,
                  'onUpdate:form': e[2] || (e[2] = (o) => (n.value = o)),
                  mode: f.value,
                  onSubmit: B
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
    }
  }),
  fe = Q(se, [['__scopeId', 'data-v-5a7dea8f']])
export { fe as default }

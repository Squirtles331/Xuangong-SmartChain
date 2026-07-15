import {
  Bn as a,
  Fn as E,
  Kn as j,
  Mn as p,
  On as M,
  Xn as h,
  Yn as G,
  an as w,
  bn as L,
  dn as e,
  i as V,
  it as X,
  ot as Y,
  pn as F,
  rr as r,
  sr as H,
  un as S,
  yn as D
} from './element-plus-CzL7BOKu.js'
import { I as J } from './index-DqMfCNbk.js'
import { t as Q } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { t as ee } from './SearchSetting-RejIVc8W.js'
import { c as le, i as ae, l as te } from './ehs-vbCVyqYW.js'
var ne = F({
    __name: 'EmergencyFormDialog',
    props: D({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: D(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: g }) {
      const c = E(f, 'visible'),
        b = E(f, 'form'),
        t = g,
        _ = [
          { type: 'input', label: '预案名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '事故类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '火灾', value: '火灾' },
                { label: '危化品', value: '危化品' },
                { label: '机械', value: '机械' },
                { label: '电力', value: '电力' },
                { label: '其他', value: '其他' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '响应等级',
            field: 'level',
            required: !0,
            props: {
              options: [
                { label: 'I级', value: 'I' },
                { label: 'II级', value: 'II' },
                { label: 'III级', value: 'III' }
              ]
            }
          },
          { type: 'input', label: '负责人', field: 'responsible' },
          { type: 'date-picker', label: '最近演练日期', field: 'last_drill' }
        ]
      function s() {
        c.value = !1
      }
      async function v() {
        return (t('submit'), !1)
      }
      return (n, u) => {
        const I = p('gi-form'),
          x = p('gi-dialog')
        return (
          M(),
          w(
            x,
            {
              modelValue: c.value,
              'onUpdate:modelValue': u[1] || (u[1] = (d) => (c.value = d)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': v,
              'on-cancel': s,
              title: f.mode === 'add' ? '新增预案' : '编辑预案',
              width: '600px'
            },
            {
              default: a(() => [
                e(I, { modelValue: b.value, 'onUpdate:modelValue': u[0] || (u[0] = (d) => (b.value = d)), columns: _, 'label-width': 100 }, null, 8, [
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
  oe = ne,
  ie = F({
    __name: 'index',
    setup(f) {
      const g = [
          { type: 'input', label: '预案名称', field: 'name' },
          {
            type: 'select-v2',
            label: '事故类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '火灾', value: '火灾' },
                { label: '危化品', value: '危化品' },
                { label: '机械', value: '机械' },
                { label: '电力', value: '电力' },
                { label: '其他', value: '其他' }
              ]
            }
          }
        ],
        c = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        b = [
          { prop: 'name', label: '预案名称', minWidth: 220 },
          { prop: 'type', label: '事故类型', minWidth: 120 },
          { label: '响应等级', minWidth: 100, slotName: 'level', align: 'center' },
          { prop: 'responsible', label: '负责人', minWidth: 160 },
          { prop: 'last_drill', label: '最近演练日期', minWidth: 140 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let t = G({ name: '', type: '' })
      const _ = h([...g]),
        s = h(!1),
        v = h('add'),
        n = h(k()),
        {
          tableData: u,
          pagination: I,
          loading: x,
          search: d,
          refresh: y
        } = Q({
          rowKey: 'id',
          listAPI: async ({ page: o, size: l }) => (await ae({ pageNum: o, pageSize: l, name: t.name || void 0, type: t.type || void 0 })).data
        })
      function k() {
        return { id: '', name: '', type: '火灾', level: 'II', responsible: '', last_drill: '' }
      }
      function q(o) {
        _.value = o
      }
      function U() {
        ;(Object.assign(t, { name: '', type: '' }), d())
      }
      function W() {
        ;((v.value = 'add'), (n.value = k()), (s.value = !0))
      }
      function B(o) {
        ;((v.value = 'edit'), (n.value = { ...o }), (s.value = !0))
      }
      async function N() {
        if (!n.value.name) {
          V.warning('请填写预案名称')
          return
        }
        ;(await te({ ...n.value, type: n.value.type, level: n.value.level }), (s.value = !1), await y())
      }
      async function R(o) {
        ;(await le(o.id), V.success(`演练完成: ${o.name}`), await y())
      }
      return (o, l) => {
        const P = p('gi-form'),
          C = p('gi-button'),
          T = X,
          z = Y,
          A = p('gi-table'),
          K = p('gi-page-layout')
        return (
          M(),
          w(K, null, {
            header: a(() => [
              e(
                ee,
                { columns: g, 'onUpdate:visibleFields': q },
                {
                  default: a(() => [
                    e(
                      P,
                      {
                        modelValue: r(t),
                        'onUpdate:modelValue': l[0] || (l[0] = (i) => (j(t) ? (t.value = i) : (t = i))),
                        columns: _.value,
                        'grid-item-props': c,
                        search: '',
                        onSearch: r(d),
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
            tool: a(() => [
              e(C, { type: 'add', onClick: W }),
              e(C, { type: 'reset', style: { 'margin-left': '8px' }, onClick: r(y) }, null, 8, ['onClick'])
            ]),
            default: a(() => [
              e(
                Z,
                { title: '应急预案', columns: b, onRefresh: r(y) },
                {
                  default: a(({ settingColumns: i, tableProps: O }) => [
                    e(
                      A,
                      L({ columns: i, data: r(u), pagination: r(I), loading: r(x) }, O, { border: '', style: { height: '100%' } }),
                      {
                        level: a(({ row: m }) => [
                          e(
                            T,
                            { type: m.level === 'I' ? 'danger' : m.level === 'II' ? 'warning' : 'info' },
                            { default: a(() => [S(H(m.level) + '级响应 ', 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: a(({ row: m }) => [
                          e(C, { type: 'edit', onClick: ($) => B(m) }, null, 8, ['onClick']),
                          e(
                            z,
                            { type: 'primary', link: '', size: 'small', onClick: ($) => R(m) },
                            { default: a(() => [...(l[3] || (l[3] = [S('演练', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          )
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
              e(
                oe,
                {
                  visible: s.value,
                  'onUpdate:visible': l[1] || (l[1] = (i) => (s.value = i)),
                  form: n.value,
                  'onUpdate:form': l[2] || (l[2] = (i) => (n.value = i)),
                  mode: v.value,
                  onSubmit: N
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
  ce = J(ie, [['__scopeId', 'data-v-1833b82c']])
export { ce as default }

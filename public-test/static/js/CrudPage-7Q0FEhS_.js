import {
  An as F,
  Bn as l,
  Fn as A,
  In as X,
  Mn as v,
  On as i,
  Rn as w,
  Xn as x,
  an as c,
  ar as V,
  bn as M,
  c as H,
  cn as y,
  dn as g,
  hn as R,
  in as J,
  jn as u,
  on as b,
  ot as Q,
  pn as I,
  rn as C,
  sn as T,
  sr as B,
  tn as W,
  un as S,
  yn as P
} from './element-plus-CzL7BOKu.js'
import { I as q } from './index-DqMfCNbk.js'
import { t as Y } from './TableSetting-BqN9x3yX.js'
import { t as Z } from './SearchSetting-RejIVc8W.js'
var _ = { class: 'crud-toolbar-actions' },
  ee = I({
    name: 'CrudToolbarActions',
    __name: 'index',
    props: {
      actions: { default: () => [] },
      showAddButton: { type: Boolean, default: !0 },
      showRefreshButton: { type: Boolean, default: !0 },
      addText: { default: '新增' },
      refreshText: { default: '刷新' }
    },
    emits: ['add', 'refresh', 'action'],
    setup(e, { emit: p }) {
      const s = p
      function h(r) {
        if (!(!r || r === 'default')) return r
      }
      return (r, f) => {
        const a = v('gi-button'),
          m = Q
        return (
          i(),
          T('div', _, [
            e.showAddButton
              ? (i(), c(a, { key: 0, type: 'add', onClick: f[0] || (f[0] = (d) => s('add')) }, { default: l(() => [S(B(e.addText), 1)]), _: 1 }))
              : b('', !0),
            e.showRefreshButton
              ? (i(),
                c(a, { key: 1, type: 'reset', onClick: f[1] || (f[1] = (d) => s('refresh')) }, { default: l(() => [S(B(e.refreshText), 1)]), _: 1 }))
              : b('', !0),
            (i(!0),
            T(
              W,
              null,
              F(
                e.actions,
                (d) => (
                  i(),
                  c(
                    m,
                    { key: d.key, type: h(d.tone), disabled: d.disabled, onClick: ($) => s('action', d.key) },
                    { default: l(() => [S(B(d.label), 1)]), _: 2 },
                    1032,
                    ['type', 'disabled', 'onClick']
                  )
                )
              ),
              128
            ))
          ])
        )
      }
    }
  }),
  te = q(ee, [['__scopeId', 'data-v-bdb78408']]),
  oe = { class: 'crud-page__header' },
  ae = { key: 0, class: 'crud-page__segmented' },
  ne = I({
    name: 'CrudPage',
    __name: 'index',
    props: P(
      {
        title: {},
        searchColumns: { default: () => [] },
        columns: { default: () => [] },
        data: { default: () => [] },
        pagination: { default: void 0 },
        loading: { type: Boolean, default: !1 },
        pageAttrs: { default: () => ({}) },
        searchGridItemProps: { default: () => ({ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }) },
        requiredSearchFields: { default: () => [] },
        disabledColumnKeys: { default: () => [] },
        tableAttrs: { default: () => ({ border: !0, style: 'height: 100%' }) },
        showAddButton: { type: Boolean, default: !0 },
        showRefreshButton: { type: Boolean, default: !0 },
        addText: { default: '新增' },
        refreshText: { default: '刷新' },
        toolbarActions: { default: () => [] },
        segmentedOptions: { default: () => [] },
        segmentedProps: { default: () => ({}) },
        segmentedAutoSearch: { type: Boolean, default: !1 }
      },
      {
        searchModel: { required: !0 },
        searchModelModifiers: {},
        segmentedValue: { type: [String, Number, Boolean], default: '' },
        segmentedValueModifiers: {}
      }
    ),
    emits: P(
      ['search', 'reset', 'refresh', 'add', 'toolbarAction', 'selectionChange', 'segmentedChange'],
      ['update:searchModel', 'update:segmentedValue']
    ),
    setup(e, { emit: p }) {
      const s = e,
        h = A(e, 'searchModel'),
        r = A(e, 'segmentedValue'),
        f = X(),
        a = p,
        m = x([...s.searchColumns]),
        d = x(!1),
        $ = C(() => s.segmentedOptions.length > 0 || !!f.segmented),
        N = C(() => s.searchColumns.length > 0),
        O = C(() =>
          Object.keys(f).filter((t) => !['left', 'tool', 'dialog', 'tableToolbarLeft', 'headerTop', 'beforeTable', 'segmented'].includes(t))
        )
      ;(w(
        () => s.searchColumns,
        (t) => {
          m.value = [...t]
        },
        { deep: !0 }
      ),
        w(r, (t) => {
          if (!d.value) {
            d.value = !0
            return
          }
          ;(a('segmentedChange', t), s.segmentedAutoSearch && a('search'))
        }))
      function L(t) {
        m.value = t
      }
      function E(t) {
        a('selectionChange', t)
      }
      return (t, o) => {
        const U = H,
          j = v('gi-form'),
          z = v('gi-table'),
          G = v('gi-page-layout')
        return (
          i(),
          c(
            G,
            V(R(e.pageAttrs)),
            y(
              {
                header: l(() => [
                  J('div', oe, [
                    u(t.$slots, 'headerTop', {}, void 0, !0),
                    $.value
                      ? (i(),
                        T('div', ae, [
                          u(
                            t.$slots,
                            'segmented',
                            {},
                            () => [
                              g(
                                U,
                                M(
                                  {
                                    modelValue: r.value,
                                    'onUpdate:modelValue': o[0] || (o[0] = (n) => (r.value = n)),
                                    options: s.segmentedOptions,
                                    size: 'large'
                                  },
                                  s.segmentedProps
                                ),
                                null,
                                16,
                                ['modelValue', 'options']
                              )
                            ],
                            !0
                          )
                        ]))
                      : b('', !0),
                    N.value
                      ? (i(),
                        c(
                          Z,
                          { key: 1, columns: e.searchColumns, 'required-fields': e.requiredSearchFields, 'onUpdate:visibleFields': L },
                          {
                            default: l(() => [
                              g(
                                j,
                                {
                                  modelValue: h.value,
                                  'onUpdate:modelValue': o[1] || (o[1] = (n) => (h.value = n)),
                                  columns: m.value,
                                  'grid-item-props': e.searchGridItemProps,
                                  search: '',
                                  onSearch: o[2] || (o[2] = (n) => a('search')),
                                  onReset: o[3] || (o[3] = (n) => a('reset'))
                                },
                                null,
                                8,
                                ['modelValue', 'columns', 'grid-item-props']
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['columns', 'required-fields']
                        ))
                      : b('', !0)
                  ])
                ]),
                tool: l(() => [
                  u(
                    t.$slots,
                    'tool',
                    {},
                    () => [
                      g(
                        te,
                        {
                          actions: e.toolbarActions,
                          'show-add-button': e.showAddButton,
                          'show-refresh-button': e.showRefreshButton,
                          'add-text': e.addText,
                          'refresh-text': e.refreshText,
                          onAdd: o[4] || (o[4] = (n) => a('add')),
                          onRefresh: o[5] || (o[5] = (n) => a('refresh')),
                          onAction: o[6] || (o[6] = (n) => a('toolbarAction', n))
                        },
                        null,
                        8,
                        ['actions', 'show-add-button', 'show-refresh-button', 'add-text', 'refresh-text']
                      )
                    ],
                    !0
                  )
                ]),
                default: l(() => [
                  u(t.$slots, 'beforeTable', {}, void 0, !0),
                  g(
                    Y,
                    {
                      title: e.title,
                      columns: e.columns,
                      'disabled-column-keys': e.disabledColumnKeys,
                      onRefresh: o[7] || (o[7] = (n) => a('refresh'))
                    },
                    y(
                      {
                        default: l(({ settingColumns: n, tableProps: K }) => [
                          g(
                            z,
                            M(
                              { columns: n, data: e.data, pagination: e.pagination, loading: e.loading },
                              { ...K, ...e.tableAttrs },
                              { onSelectionChange: E }
                            ),
                            y({ _: 2 }, [F(O.value, (k) => ({ name: k, fn: l((D) => [u(t.$slots, k, V(R(D)), void 0, !0)]) }))]),
                            1040,
                            ['columns', 'data', 'pagination', 'loading']
                          )
                        ]),
                        _: 2
                      },
                      [
                        t.$slots.tableToolbarLeft
                          ? { name: 'toolbar-left', fn: l(() => [u(t.$slots, 'tableToolbarLeft', {}, void 0, !0)]), key: '0' }
                          : void 0
                      ]
                    ),
                    1032,
                    ['title', 'columns', 'disabled-column-keys']
                  ),
                  u(t.$slots, 'dialog', {}, void 0, !0)
                ]),
                _: 2
              },
              [t.$slots.left ? { name: 'left', fn: l(() => [u(t.$slots, 'left', {}, void 0, !0)]), key: '0' } : void 0]
            ),
            1040
          )
        )
      }
    }
  }),
  ue = q(ne, [['__scopeId', 'data-v-fb394d55']])
export { ue as t }

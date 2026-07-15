import {
  Bn as l,
  Fn as M,
  Kn as X,
  Mn as m,
  On as F,
  Xn as k,
  Yn as Y,
  an as B,
  bn as H,
  dn as n,
  i as C,
  in as J,
  it as Z,
  or as ee,
  ot as te,
  pn as U,
  rr as u,
  sr as D,
  un as x,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as ae } from './index-DqMfCNbk.js'
import { t as le } from './useTable-Hzr4fBAy.js'
import { t as ne } from './TableSetting-BqN9x3yX.js'
import { t as oe } from './SearchSetting-RejIVc8W.js'
import { d as ie, p as E, s as se } from './equipment-DTYL7ZbV.js'
var ue = U({
    __name: 'SpareFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(b, { emit: g }) {
      const c = M(b, 'visible'),
        _ = M(b, 'form'),
        o = g,
        v = [
          { type: 'input', label: '备件编码', field: 'code', required: !0 },
          { type: 'input', label: '名称', field: 'name', required: !0 },
          { type: 'input', label: '规格', field: 'spec' },
          { type: 'input', label: '适用设备', field: 'applicable_equipment' },
          { type: 'input-number', label: '库存数量', field: 'qty', props: { min: 0 } },
          { type: 'input-number', label: '安全库存', field: 'safety', props: { min: 1 } },
          { type: 'input', label: '单位', field: 'unit' },
          { type: 'input', label: '库位', field: 'location' }
        ]
      function s() {
        c.value = !1
      }
      async function f() {
        return (o('submit'), !1)
      }
      return (r, d) => {
        const q = m('gi-form'),
          h = m('gi-dialog')
        return (
          F(),
          B(
            h,
            {
              modelValue: c.value,
              'onUpdate:modelValue': d[1] || (d[1] = (p) => (c.value = p)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': f,
              'on-cancel': s,
              title: b.mode === 'add' ? '新增备件' : '编辑备件',
              width: '600px'
            },
            {
              default: l(() => [
                n(q, { modelValue: _.value, 'onUpdate:modelValue': d[0] || (d[0] = (p) => (_.value = p)), columns: v, 'label-width': 100 }, null, 8, [
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
  re = ue,
  de = U({
    __name: 'index',
    setup(b) {
      const g = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '库存状态',
            field: 'stock_status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '充足', value: 'ok' },
                { label: '偏低', value: 'low' },
                { label: '缺货', value: 'out' }
              ]
            }
          }
        ],
        c = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        _ = [
          { prop: 'code', label: '备件编码', minWidth: 140 },
          { prop: 'name', label: '备件名称', minWidth: 160 },
          { prop: 'spec', label: '规格', minWidth: 120 },
          { prop: 'applicable_equipment', label: '适用设备', minWidth: 180 },
          { label: '库存数量', minWidth: 100, slotName: 'qty', align: 'center' },
          { prop: 'safety', label: '安全库存', minWidth: 100, align: 'center' },
          { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'stockStatus', align: 'center' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let o = Y({ keyword: '', stock_status: '' })
      const v = k([...g]),
        s = k(!1),
        f = k('add'),
        r = k(V()),
        {
          tableData: d,
          pagination: q,
          loading: h,
          search: p,
          refresh: y
        } = le({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) =>
            (await se({ pageNum: e, pageSize: a, keyword: o.keyword || void 0, stock_status: o.stock_status || void 0 })).data
        })
      function V() {
        return { id: '', code: '', name: '', spec: '', applicable_equipment: '', qty: 0, safety: 5, unit: '件', location: '' }
      }
      function R(e) {
        v.value = e
      }
      function z() {
        ;(Object.assign(o, { keyword: '', stock_status: '' }), p())
      }
      function I() {
        ;((f.value = 'add'), (r.value = V()), (s.value = !0))
      }
      function P(e) {
        ;((f.value = 'edit'), (r.value = { ...e }), (s.value = !0))
      }
      async function T() {
        ;(await ie({ ...r.value }), (s.value = !1), await y())
      }
      async function $(e) {
        ;(await E(e.id, 1), C.success(`入库 1${e.unit}`), await y())
      }
      async function A(e) {
        if (e.qty <= 0) {
          C.warning('库存不足')
          return
        }
        ;(await E(e.id, -1), C.success(`出库 1${e.unit}`), await y())
      }
      function K({ row: e }) {
        return e.qty < e.safety ? 'safety-warning-row' : ''
      }
      return (e, a) => {
        const O = m('gi-form'),
          S = m('gi-button'),
          j = Z,
          W = te,
          G = m('gi-table'),
          L = m('gi-page-layout')
        return (
          F(),
          B(L, null, {
            header: l(() => [
              n(
                oe,
                { columns: g, 'onUpdate:visibleFields': R },
                {
                  default: l(() => [
                    n(
                      O,
                      {
                        modelValue: u(o),
                        'onUpdate:modelValue': a[0] || (a[0] = (i) => (X(o) ? (o.value = i) : (o = i))),
                        columns: v.value,
                        'grid-item-props': c,
                        search: '',
                        onReset: z,
                        onSearch: u(p)
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
            tool: l(() => [
              n(S, { type: 'add', onClick: I }),
              n(S, { style: { 'margin-left': '8px' }, type: 'reset', onClick: u(y) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              n(
                ne,
                { title: '备件库存', columns: _, onRefresh: u(y) },
                {
                  default: l(({ settingColumns: i, tableProps: Q }) => [
                    n(
                      G,
                      H({ columns: i, data: u(d), pagination: u(q), loading: u(h) }, Q, {
                        border: '',
                        style: { height: '100%' },
                        'row-class-name': K
                      }),
                      {
                        stockStatus: l(({ row: t }) => [
                          n(
                            j,
                            { type: t.qty > t.safety ? 'success' : t.qty > 0 ? 'warning' : 'danger' },
                            { default: l(() => [x(D(t.qty > t.safety ? '充足' : t.qty > 0 ? '偏低' : '缺货'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        qty: l(({ row: t }) => [
                          J(
                            'span',
                            { style: ee({ color: t.qty < t.safety ? '#f56c6c' : '', fontWeight: t.qty < t.safety ? 'bold' : '' }) },
                            D(t.qty),
                            5
                          )
                        ]),
                        actions: l(({ row: t }) => [
                          n(S, { type: 'edit', onClick: (w) => P(t) }, null, 8, ['onClick']),
                          n(
                            W,
                            { type: 'primary', link: '', size: 'small', onClick: (w) => $(t) },
                            { default: l(() => [...(a[3] || (a[3] = [x('入库', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          n(
                            W,
                            { type: 'warning', link: '', size: 'small', onClick: (w) => A(t) },
                            { default: l(() => [...(a[4] || (a[4] = [x('出库', -1)]))]), _: 1 },
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
              n(
                re,
                {
                  visible: s.value,
                  'onUpdate:visible': a[1] || (a[1] = (i) => (s.value = i)),
                  form: r.value,
                  'onUpdate:form': a[2] || (a[2] = (i) => (r.value = i)),
                  mode: f.value,
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
    }
  }),
  ge = ae(de, [['__scopeId', 'data-v-969ab98f']])
export { ge as default }

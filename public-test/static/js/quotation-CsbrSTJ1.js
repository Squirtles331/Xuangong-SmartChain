import {
  Bn as t,
  Fn as D,
  Kn as j,
  Mn as p,
  On as W,
  Xn as _,
  Yn as G,
  an as F,
  bn as X,
  dn as a,
  i as Y,
  it as $,
  pn as T,
  rr as r,
  sr as S,
  un as k,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as H } from './index-DqMfCNbk.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { t as ee } from './SearchSetting-RejIVc8W.js'
import { _ as te, a as ae, l as le } from './crm-Ddpp8fRZ.js'
var oe = T({
    __name: 'QuotationFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: y }) {
      const m = D(v, 'visible'),
        c = D(v, 'form'),
        h = y,
        x = [
          { type: 'input', label: '报价单号', field: 'code', required: !0 },
          { type: 'input', label: '客户名称', field: 'customer', required: !0 },
          { type: 'input', label: '产品名称', field: 'product', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'input-number', label: '单价(元)', field: 'price', required: !0, props: { min: 0 } },
          { type: 'input-number', label: '总价(元)', field: 'amount', props: { disabled: !0 } },
          { type: 'date-picker', label: '有效期', field: 'valid_date' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '已发送', value: 'sent' },
                { label: '已中标', value: 'approved' },
                { label: '已丢单', value: 'lost' }
              ]
            }
          }
        ]
      function l() {
        m.value = !1
      }
      async function b() {
        return (h('submit'), !1)
      }
      return (d, i) => {
        const e = p('gi-form'),
          C = p('gi-dialog')
        return (
          W(),
          F(
            C,
            {
              modelValue: m.value,
              'onUpdate:modelValue': i[1] || (i[1] = (f) => (m.value = f)),
              title: v.mode === 'add' ? '新增报价单' : '编辑报价单',
              footer: !0,
              'lock-scroll': !1,
              width: '600px',
              'on-before-ok': b,
              'on-cancel': l
            },
            {
              default: t(() => [
                a(e, { modelValue: c.value, 'onUpdate:modelValue': i[0] || (i[0] = (f) => (c.value = f)), columns: x, 'label-width': 100 }, null, 8, [
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
  ne = oe,
  ie = T({
    __name: 'index',
    setup(v) {
      const y = { draft: '草稿', sent: '已发送', approved: '已中标', lost: '已丢单' },
        m = { draft: 'info', sent: 'primary', approved: 'success', lost: 'danger' },
        c = [
          { type: 'input', label: '报价单号', field: 'code' },
          { type: 'input', label: '客户名称', field: 'customer' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '草稿', value: 'draft' },
                { label: '已发送', value: 'sent' },
                { label: '已中标', value: 'approved' },
                { label: '已丢单', value: 'lost' }
              ]
            }
          }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        x = [
          { prop: 'code', label: '报价单号', minWidth: 160 },
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { prop: 'product', label: '产品名称', minWidth: 180 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { label: '单价(元)', minWidth: 100, align: 'right', slotName: 'price' },
          { label: '总价(元)', minWidth: 120, align: 'right', slotName: 'amount' },
          { prop: 'valid_date', label: '有效期', minWidth: 120 },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let l = G({ code: '', customer: '', status: '' })
      const b = _([...c]),
        d = _(!1),
        i = _('add'),
        e = _(M()),
        {
          tableData: C,
          pagination: f,
          loading: w,
          search: V,
          refresh: q,
          onDelete: P
        } = J({
          rowKey: 'id',
          listAPI: async ({ page: s, size: o }) =>
            (await le({ pageNum: s, pageSize: o, code: l.code || void 0, customer: l.customer || void 0, status: l.status || void 0 })).data,
          deleteAPI: (s) => Promise.all(s.map((o) => ae(o)))
        })
      function M() {
        return { id: '', code: '', customer: '', product: '', qty: 1, price: 0, amount: 0, valid_date: '', status: 'draft' }
      }
      function Q(s) {
        b.value = s
      }
      function U() {
        ;(Object.assign(l, { code: '', customer: '', status: '' }), V())
      }
      function I() {
        ;((i.value = 'add'), (e.value = M()), (d.value = !0))
      }
      function R(s) {
        ;((i.value = 'edit'), (e.value = { ...s }), (d.value = !0))
      }
      async function B() {
        if (!e.value.customer || !e.value.product) {
          Y.warning('请填写客户名称和产品名称')
          return
        }
        ;((e.value.amount = e.value.qty * e.value.price), await te({ ...e.value, status: e.value.status }), (d.value = !1), await q())
      }
      return (s, o) => {
        const z = p('gi-form'),
          g = p('gi-button'),
          A = $,
          E = p('gi-table'),
          L = p('gi-page-layout')
        return (
          W(),
          F(L, null, {
            header: t(() => [
              a(
                ee,
                { columns: c, 'onUpdate:visibleFields': Q },
                {
                  default: t(() => [
                    a(
                      z,
                      {
                        modelValue: r(l),
                        'onUpdate:modelValue': o[0] || (o[0] = (u) => (j(l) ? (l.value = u) : (l = u))),
                        columns: b.value,
                        'grid-item-props': h,
                        search: '',
                        onSearch: r(V),
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
              a(g, { type: 'add', onClick: I }),
              a(g, { type: 'reset', style: { 'margin-left': '8px' }, onClick: r(q) }, null, 8, ['onClick'])
            ]),
            default: t(() => [
              a(
                Z,
                { title: '报价单列表', columns: x, onRefresh: r(q) },
                {
                  default: t(({ settingColumns: u, tableProps: K }) => [
                    a(
                      E,
                      X({ columns: u, data: r(C), pagination: r(f), loading: r(w) }, K, { border: '', style: { height: '100%' } }),
                      {
                        price: t(({ row: n }) => [k(S(n.price.toLocaleString('zh-CN')), 1)]),
                        amount: t(({ row: n }) => [k(S(n.amount.toLocaleString('zh-CN')), 1)]),
                        status: t(({ row: n }) => [a(A, { type: m[n.status] }, { default: t(() => [k(S(y[n.status]), 1)]), _: 2 }, 1032, ['type'])]),
                        actions: t(({ row: n }) => [
                          a(g, { type: 'edit', onClick: (O) => R(n) }, null, 8, ['onClick']),
                          a(g, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (O) => r(P)(n) }, null, 8, ['onClick'])
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
                ne,
                {
                  visible: d.value,
                  'onUpdate:visible': o[1] || (o[1] = (u) => (d.value = u)),
                  form: e.value,
                  'onUpdate:form': o[2] || (o[2] = (u) => (e.value = u)),
                  mode: i.value,
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
  ce = H(ie, [['__scopeId', 'data-v-7069699b']])
export { ce as default }

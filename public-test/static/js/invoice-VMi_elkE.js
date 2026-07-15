import {
  Bn as a,
  Fn as W,
  Kn as Y,
  Mn as p,
  On as S,
  Rn as $,
  Xn as y,
  Yn as H,
  an as V,
  bn as J,
  dn as n,
  i as D,
  it as Q,
  on as Z,
  ot as ee,
  pn as F,
  rr as d,
  sr as h,
  un as f,
  yn as q
} from './element-plus-CzL7BOKu.js'
import { I as te } from './index-DqMfCNbk.js'
import { t as ae } from './useTable-Hzr4fBAy.js'
import { t as le } from './TableSetting-BqN9x3yX.js'
import { t as oe } from './SearchSetting-RejIVc8W.js'
import { h as ne, p as ie, s as ue } from './crm-Ddpp8fRZ.js'
var se = F({
    __name: 'InvoiceFormDialog',
    props: q({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: q(['submit'], ['update:visible', 'update:form']),
    setup(_, { emit: x }) {
      const c = W(_, 'visible'),
        t = W(_, 'form'),
        k = x,
        C = [
          { type: 'input', label: '发票号码', field: 'code', required: !0 },
          { type: 'input', label: '客户名称', field: 'customer', required: !0 },
          { type: 'input', label: '销售订单', field: 'order_code' },
          { type: 'input-number', label: '不含税金额', field: 'amount', required: !0, props: { min: 0, precision: 2 } },
          { type: 'input-number', label: '税率(%)', field: 'tax_rate', required: !0, props: { min: 0, max: 100 } },
          { type: 'input-number', label: '税额', field: 'tax_amount', props: { disabled: !0 } },
          { type: 'input-number', label: '价税合计', field: 'total', props: { disabled: !0 } },
          { type: 'date-picker', label: '开票日期', field: 'issue_date' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '已开具', value: 'issued' },
                { label: '已作废', value: 'voided' },
                { label: '已红冲', value: 'red' }
              ]
            }
          }
        ]
      $(
        () => [t.value.amount, t.value.tax_rate],
        () => {
          ;((t.value.tax_amount = Math.round(((t.value.amount * t.value.tax_rate) / 100) * 100) / 100),
            (t.value.total = Math.round((t.value.amount + t.value.tax_amount) * 100) / 100))
        }
      )
      function i() {
        c.value = !1
      }
      async function b() {
        return (k('submit'), !1)
      }
      return (m, u) => {
        const e = p('gi-form'),
          w = p('gi-dialog')
        return (
          S(),
          V(
            w,
            {
              modelValue: c.value,
              'onUpdate:modelValue': u[1] || (u[1] = (v) => (c.value = v)),
              title: _.mode === 'add' ? '新增发票' : '编辑发票',
              footer: !0,
              'lock-scroll': !1,
              width: '650px',
              'on-before-ok': b,
              'on-cancel': i
            },
            {
              default: a(() => [
                n(e, { modelValue: t.value, 'onUpdate:modelValue': u[0] || (u[0] = (v) => (t.value = v)), columns: C, 'label-width': 100 }, null, 8, [
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
  re = se,
  de = F({
    __name: 'index',
    setup(_) {
      const x = { draft: '草稿', issued: '已开具', voided: '已作废', red: '已红冲' },
        c = { draft: 'info', issued: 'success', voided: 'danger', red: 'warning' },
        t = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '草稿', value: 'draft' },
                { label: '已开具', value: 'issued' },
                { label: '已作废', value: 'voided' },
                { label: '已红冲', value: 'red' }
              ]
            }
          }
        ],
        k = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        C = [
          { prop: 'code', label: '发票号码', minWidth: 160 },
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { prop: 'order_code', label: '销售订单', minWidth: 160 },
          { label: '不含税金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
          { prop: 'tax_rate', label: '税率(%)', minWidth: 90, align: 'center' },
          { label: '税额(元)', minWidth: 120, align: 'right', slotName: 'taxAmount' },
          { label: '价税合计(元)', minWidth: 130, align: 'right', slotName: 'total' },
          { prop: 'issue_date', label: '开票日期', minWidth: 120 },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 140, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let i = H({ keyword: '', status: '' })
      const b = y([...t]),
        m = y(!1),
        u = y('add'),
        e = y(I()),
        {
          tableData: w,
          pagination: v,
          loading: T,
          search: N,
          refresh: g
        } = ae({
          rowKey: 'id',
          listAPI: async ({ page: s, size: o }) =>
            (await ue({ pageNum: s, pageSize: o, keyword: i.keyword || void 0, status: i.status || void 0 })).data
        })
      function I() {
        return { id: '', code: '', customer: '', order_code: '', amount: 0, tax_rate: 13, tax_amount: 0, total: 0, issue_date: '', status: 'draft' }
      }
      function R(s) {
        b.value = s
      }
      function U() {
        ;(Object.assign(i, { keyword: '', status: '' }), N())
      }
      function z() {
        ;((u.value = 'add'), (e.value = I()), (m.value = !0))
      }
      function B(s) {
        ;((u.value = 'edit'), (e.value = { ...s }), (m.value = !0))
      }
      async function A() {
        if (!e.value.code || !e.value.customer) {
          D.warning('请填写发票号码和客户名称')
          return
        }
        ;((e.value.tax_amount = Math.round(((e.value.amount * e.value.tax_rate) / 100) * 100) / 100),
          (e.value.total = Math.round((e.value.amount + e.value.tax_amount) * 100) / 100),
          await ne({ ...e.value, status: e.value.status }),
          (m.value = !1),
          await g())
      }
      async function E(s) {
        ;(await ie(s.id), D.success('发票已开具'), await g())
      }
      return (s, o) => {
        const L = p('gi-form'),
          M = p('gi-button'),
          P = Q,
          K = ee,
          O = p('gi-table'),
          j = p('gi-page-layout')
        return (
          S(),
          V(j, null, {
            header: a(() => [
              n(
                oe,
                { columns: t, 'onUpdate:visibleFields': R },
                {
                  default: a(() => [
                    n(
                      L,
                      {
                        modelValue: d(i),
                        'onUpdate:modelValue': o[0] || (o[0] = (r) => (Y(i) ? (i.value = r) : (i = r))),
                        columns: b.value,
                        'grid-item-props': k,
                        search: '',
                        onSearch: d(N),
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
              n(M, { type: 'add', onClick: z }),
              n(M, { type: 'reset', style: { 'margin-left': '8px' }, onClick: d(g) }, null, 8, ['onClick'])
            ]),
            default: a(() => [
              n(
                le,
                { title: '发票列表', columns: C, onRefresh: d(g) },
                {
                  default: a(({ settingColumns: r, tableProps: G }) => [
                    n(
                      O,
                      J({ columns: r, data: d(w), pagination: d(v), loading: d(T) }, G, { border: '', style: { height: '100%' } }),
                      {
                        amount: a(({ row: l }) => [f(h(l.amount.toLocaleString('zh-CN')), 1)]),
                        taxAmount: a(({ row: l }) => [f(h(l.tax_amount.toLocaleString('zh-CN')), 1)]),
                        total: a(({ row: l }) => [f(h(l.total.toLocaleString('zh-CN')), 1)]),
                        status: a(({ row: l }) => [n(P, { type: c[l.status] }, { default: a(() => [f(h(x[l.status]), 1)]), _: 2 }, 1032, ['type'])]),
                        actions: a(({ row: l }) => [
                          n(M, { type: 'edit', onClick: (X) => B(l) }, null, 8, ['onClick']),
                          l.status === 'draft'
                            ? (S(),
                              V(
                                K,
                                { key: 0, type: 'success', link: '', size: 'small', onClick: (X) => E(l) },
                                { default: a(() => [...(o[3] || (o[3] = [f('开具', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : Z('', !0)
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
                  visible: m.value,
                  'onUpdate:visible': o[1] || (o[1] = (r) => (m.value = r)),
                  form: e.value,
                  'onUpdate:form': o[2] || (o[2] = (r) => (e.value = r)),
                  mode: u.value,
                  onSubmit: A
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
  be = te(de, [['__scopeId', 'data-v-849ab5bb']])
export { be as default }

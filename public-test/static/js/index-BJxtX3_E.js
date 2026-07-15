import {
  Bn as a,
  Fn as I,
  Kn as $,
  Mn as c,
  On as U,
  Xn as y,
  Yn as H,
  an as q,
  bn as J,
  dn as l,
  i as N,
  it as Q,
  pn as R,
  rn as Z,
  rr as u,
  sr as h,
  un as x,
  yn as W
} from './element-plus-CzL7BOKu.js'
import { I as ee } from './index-DqMfCNbk.js'
import { t as ae } from './useTable-Hzr4fBAy.js'
import { t as te } from './TableSetting-BqN9x3yX.js'
import { t as le } from './SearchSetting-RejIVc8W.js'
import { a as ne, n as ie, s as oe, t as se } from './finance-C91m7hPG.js'
var ue = R({
    __name: 'FinanceIndexFormDialog',
    props: W({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: W(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: F }) {
      const C = g,
        f = I(g, 'visible'),
        b = I(g, 'form'),
        M = F,
        D = [
          { label: '未付款', value: 'open' },
          { label: '已付款', value: 'paid' },
          { label: '部分付款', value: 'partial' }
        ],
        n = Z(() => (C.mode === 'add' ? '新增应付单' : '编辑应付单')),
        v = [
          { type: 'input', label: '应付单号', field: 'code', props: { disabled: !0 } },
          { type: 'input', label: '供应商', field: 'supplier', required: !0 },
          { type: 'input-number', label: '应付金额', field: 'amount', required: !0, props: { min: 0 } },
          { type: 'input-number', label: '已付金额', field: 'paid', props: { min: 0 } },
          { type: 'input-number', label: '未付余额', field: 'balance', props: { min: 0, disabled: !0 } },
          { type: 'date-picker', label: '到期日期', field: 'due_date', props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: D } }
        ]
      function r() {
        f.value = !1
      }
      async function p() {
        return (M('submit'), !1)
      }
      return (e, d) => {
        const k = c('gi-form'),
          S = c('gi-dialog')
        return (
          U(),
          q(
            S,
            {
              modelValue: f.value,
              'onUpdate:modelValue': d[1] || (d[1] = (m) => (f.value = m)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': p,
              'on-cancel': r,
              title: n.value,
              width: '600px'
            },
            {
              default: a(() => [
                l(k, { modelValue: b.value, 'onUpdate:modelValue': d[0] || (d[0] = (m) => (b.value = m)), columns: v, 'label-width': 100 }, null, 8, [
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
  pe = R({
    __name: 'index',
    setup(g) {
      const F = [
          { label: '全部', value: '' },
          { label: '未付款', value: 'open' },
          { label: '已付款', value: 'paid' },
          { label: '部分付款', value: 'partial' }
        ],
        C = { open: 'warning', paid: 'success', partial: 'info' },
        f = { open: '未付款', paid: '已付款', partial: '部分付款' },
        b = [
          { type: 'input', label: '应付单号', field: 'code' },
          { type: 'input', label: '供应商', field: 'supplier' },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: F } }
        ],
        M = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        D = [
          { prop: 'code', label: '应付单号', minWidth: 160 },
          { prop: 'supplier', label: '供应商', minWidth: 180 },
          { prop: 'amount', label: '应付金额', minWidth: 120, align: 'right', slotName: 'amount' },
          { prop: 'paid', label: '已付金额', minWidth: 120, align: 'right', slotName: 'paid' },
          { prop: 'balance', label: '未付余额', minWidth: 120, align: 'right', slotName: 'balance' },
          { prop: 'due_date', label: '到期日期', minWidth: 120, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 110, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = H({ code: '', supplier: '', status: '' })
      const v = y([...b]),
        r = y(!1),
        p = y('add'),
        e = y(w()),
        {
          tableData: d,
          pagination: k,
          loading: S,
          search: m,
          refresh: V,
          onDelete: T
        } = ae({
          rowKey: 'id',
          listAPI: async ({ page: i, size: o }) =>
            (await ne({ pageNum: i, pageSize: o, code: n.code || void 0, supplier: n.supplier || void 0, status: n.status || void 0 })).data,
          deleteAPI: (i) => Promise.all(i.map((o) => ie(o)))
        })
      function w() {
        return { id: '', code: '', supplier: '', amount: 0, paid: 0, balance: 0, due_date: '', status: 'open' }
      }
      function P(i) {
        return i.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      function Y(i) {
        v.value = i
      }
      function A() {
        ;(Object.assign(n, { code: '', supplier: '', status: '' }), m())
      }
      function B() {
        ;((p.value = 'add'), (e.value = w()), (r.value = !0))
      }
      function O(i) {
        ;((p.value = 'edit'), (e.value = { ...i }), (r.value = !0))
      }
      async function E() {
        if (!e.value.supplier) {
          N.warning('请填写供应商')
          return
        }
        ;((e.value.balance = Math.max(e.value.amount - e.value.paid, 0)),
          p.value === 'add' ? (await se(e.value), N.success('新增成功')) : (await oe(e.value.id, e.value), N.success('编辑成功')),
          (r.value = !1),
          await V())
      }
      return (i, o) => {
        const L = c('gi-form'),
          _ = c('gi-button'),
          z = Q,
          K = c('gi-table'),
          j = c('gi-page-layout')
        return (
          U(),
          q(j, null, {
            header: a(() => [
              l(
                le,
                { columns: b, 'onUpdate:visibleFields': Y },
                {
                  default: a(() => [
                    l(
                      L,
                      {
                        modelValue: u(n),
                        'onUpdate:modelValue': o[0] || (o[0] = (s) => ($(n) ? (n.value = s) : (n = s))),
                        columns: v.value,
                        'grid-item-props': M,
                        search: '',
                        onSearch: u(m),
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
            tool: a(() => [
              l(_, { type: 'add', onClick: B }),
              l(_, { type: 'reset', style: { 'margin-left': '8px' }, onClick: u(V) }, null, 8, ['onClick'])
            ]),
            default: a(() => [
              l(
                te,
                { title: '应付管理列表', columns: D, onRefresh: u(V) },
                {
                  default: a(({ settingColumns: s, tableProps: G }) => [
                    l(
                      K,
                      J({ columns: s, data: u(d), pagination: u(k), loading: u(S) }, G, { border: '', style: { height: '100%' } }),
                      {
                        amount: a(({ row: t }) => [x(h(P(t.amount)), 1)]),
                        paid: a(({ row: t }) => [x(h(P(t.paid)), 1)]),
                        balance: a(({ row: t }) => [x(h(P(t.balance)), 1)]),
                        status: a(({ row: t }) => [l(z, { type: C[t.status] }, { default: a(() => [x(h(f[t.status]), 1)]), _: 2 }, 1032, ['type'])]),
                        actions: a(({ row: t }) => [
                          l(_, { type: 'edit', onClick: (X) => O(t) }, null, 8, ['onClick']),
                          l(_, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (X) => u(T)(t) }, null, 8, ['onClick'])
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
              l(
                re,
                {
                  visible: r.value,
                  'onUpdate:visible': o[1] || (o[1] = (s) => (r.value = s)),
                  form: e.value,
                  'onUpdate:form': o[2] || (o[2] = (s) => (e.value = s)),
                  mode: p.value,
                  onSubmit: E
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
  ve = ee(pe, [['__scopeId', 'data-v-d2cdb8e8']])
export { ve as default }

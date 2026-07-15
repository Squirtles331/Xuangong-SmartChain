import {
  An as te,
  Bn as t,
  F as A,
  Fn as N,
  G as le,
  H as O,
  Kn as I,
  Mn as h,
  On as p,
  Xn as C,
  Yn as L,
  an as f,
  b as ae,
  bn as oe,
  dn as l,
  ht as ne,
  i as q,
  in as T,
  it as ie,
  mt as ue,
  nt as se,
  on as re,
  ot as B,
  pn as F,
  rn as de,
  rr as R,
  rt as me,
  sn as pe,
  sr as x,
  tn as ve,
  un as s,
  y as ge,
  yn as W
} from './element-plus-CzL7BOKu.js'
import { I as ce } from './index-DqMfCNbk.js'
import { t as be } from './useTable-Hzr4fBAy.js'
import { t as fe } from './TableSetting-BqN9x3yX.js'
import { t as _e } from './SearchSetting-RejIVc8W.js'
import { n as ye, u as we, v as Ve } from './crm-Ddpp8fRZ.js'
var Re = F({
    __name: 'ReceiptDialog',
    props: W({ customerNames: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: W(['submit'], ['update:visible', 'update:form']),
    setup(_, { emit: k }) {
      const y = N(_, 'visible'),
        r = N(_, 'form'),
        M = k
      return (v, n) => {
        const g = se,
          w = me,
          o = ne,
          d = A,
          m = le,
          c = ue,
          V = B,
          U = O
        return (
          p(),
          f(
            U,
            {
              modelValue: y.value,
              'onUpdate:modelValue': n[6] || (n[6] = (a) => (y.value = a)),
              title: '登记回款',
              width: '500px',
              'lock-scroll': !1
            },
            {
              footer: t(() => [
                l(V, { onClick: n[4] || (n[4] = (a) => (y.value = !1)) }, { default: t(() => [...(n[7] || (n[7] = [s('取消', -1)]))]), _: 1 }),
                l(
                  V,
                  { type: 'primary', onClick: n[5] || (n[5] = (a) => M('submit')) },
                  { default: t(() => [...(n[8] || (n[8] = [s('确认', -1)]))]), _: 1 }
                )
              ]),
              default: t(() => [
                l(
                  c,
                  { model: r.value, 'label-width': '100px' },
                  {
                    default: t(() => [
                      l(
                        o,
                        { label: '客户名称', required: '' },
                        {
                          default: t(() => [
                            l(
                              w,
                              {
                                modelValue: r.value.customer,
                                'onUpdate:modelValue': n[0] || (n[0] = (a) => (r.value.customer = a)),
                                style: { width: '100%' }
                              },
                              {
                                default: t(() => [
                                  (p(!0),
                                  pe(
                                    ve,
                                    null,
                                    te(_.customerNames, (a) => (p(), f(g, { key: a, label: a, value: a }, null, 8, ['label', 'value']))),
                                    128
                                  ))
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        o,
                        { label: '回款金额', required: '' },
                        {
                          default: t(() => [
                            l(
                              d,
                              {
                                modelValue: r.value.amount,
                                'onUpdate:modelValue': n[1] || (n[1] = (a) => (r.value.amount = a)),
                                min: 0,
                                style: { width: '100%' }
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        o,
                        { label: '回款日期', required: '' },
                        {
                          default: t(() => [
                            l(
                              m,
                              {
                                modelValue: r.value.date,
                                'onUpdate:modelValue': n[2] || (n[2] = (a) => (r.value.date = a)),
                                style: { width: '100%' }
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        o,
                        { label: '回款方式', required: '' },
                        {
                          default: t(() => [
                            l(
                              w,
                              {
                                modelValue: r.value.method,
                                'onUpdate:modelValue': n[3] || (n[3] = (a) => (r.value.method = a)),
                                style: { width: '100%' }
                              },
                              {
                                default: t(() => [
                                  l(g, { label: '银行转账', value: 'bank' }),
                                  l(g, { label: '现金', value: 'cash' }),
                                  l(g, { label: '承兑汇票', value: 'draft' })
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['model']
                )
              ]),
              _: 1
            },
            8,
            ['modelValue']
          )
        )
      }
    }
  }),
  ke = Re,
  Se = F({
    __name: 'ReceivableSettleDialog',
    props: W(
      { receiptAmount: {} },
      {
        visible: { type: Boolean, required: !0 },
        visibleModifiers: {},
        rows: { required: !0 },
        rowsModifiers: {},
        selectedRows: { required: !0 },
        selectedRowsModifiers: {},
        amountMap: { required: !0 },
        amountMapModifiers: {}
      }
    ),
    emits: W(['submit'], ['update:visible', 'update:rows', 'update:selectedRows', 'update:amountMap']),
    setup(_, { emit: k }) {
      const y = N(_, 'visible'),
        r = N(_, 'rows'),
        M = N(_, 'selectedRows'),
        v = N(_, 'amountMap'),
        n = k
      function g(w) {
        M.value = w
      }
      return (w, o) => {
        const d = ae,
          m = A,
          c = ge,
          V = B,
          U = O
        return (
          p(),
          f(
            U,
            {
              modelValue: y.value,
              'onUpdate:modelValue': o[2] || (o[2] = (a) => (y.value = a)),
              title: '回款核销',
              width: '650px',
              'lock-scroll': !1
            },
            {
              footer: t(() => [
                l(V, { onClick: o[0] || (o[0] = (a) => (y.value = !1)) }, { default: t(() => [...(o[4] || (o[4] = [s('取消', -1)]))]), _: 1 }),
                l(
                  V,
                  { type: 'primary', onClick: o[1] || (o[1] = (a) => n('submit')) },
                  { default: t(() => [...(o[5] || (o[5] = [s('确认核销', -1)]))]), _: 1 }
                )
              ]),
              default: t(() => [
                T('p', null, [o[3] || (o[3] = s(' 当前回款金额: ', -1)), T('strong', null, x(_.receiptAmount.toLocaleString('zh-CN')) + ' 元', 1)]),
                l(
                  c,
                  { data: r.value, border: '', onSelectionChange: g },
                  {
                    default: t(() => [
                      l(d, { type: 'selection', width: '50' }),
                      l(d, { prop: 'code', label: '应收单号', width: '160' }),
                      l(d, { prop: 'amount', label: '应收金额', width: '120', align: 'right' }),
                      l(d, { prop: 'balance', label: '余额', width: '120', align: 'right' }),
                      l(d, { prop: 'aging', label: '账龄', width: '100' }),
                      l(
                        d,
                        { label: '核销金额', minWidth: '120', align: 'center' },
                        {
                          default: t(({ row: a }) => [
                            l(
                              m,
                              {
                                modelValue: v.value[a.id],
                                'onUpdate:modelValue': (E) => (v.value[a.id] = E),
                                min: 0,
                                max: a.balance,
                                precision: 2,
                                size: 'small',
                                'controls-position': 'right',
                                style: { width: '100%' }
                              },
                              null,
                              8,
                              ['modelValue', 'onUpdate:modelValue', 'max']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['data']
                )
              ]),
              _: 1
            },
            8,
            ['modelValue']
          )
        )
      }
    }
  }),
  Ce = Se,
  xe = F({
    __name: 'index',
    setup(_) {
      const k = ['华东重工集团', '启明精密制造', '鼎盛动力设备'],
        y = [
          { type: 'input', label: '客户名称', field: 'customer' },
          {
            type: 'select-v2',
            label: '账龄',
            field: 'agingRange',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '未到期', value: '0' },
                { label: '逾期 1-30 天', value: '1' },
                { label: '逾期 31-60 天', value: '2' },
                { label: '逾期 61-90 天', value: '3' },
                { label: '逾期 90 天以上', value: '4' }
              ]
            }
          }
        ],
        r = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        M = [
          { prop: 'code', label: '应收单号', minWidth: 160 },
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { label: '应收金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
          { label: '已核销(元)', minWidth: 120, align: 'right', slotName: 'settled' },
          { label: '余额(元)', minWidth: 120, align: 'right', slotName: 'balance' },
          { prop: 'due_date', label: '到期日期', minWidth: 120 },
          { label: '账龄', minWidth: 120, align: 'center', slotName: 'aging' },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 100, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let v = L({ customer: '', agingRange: '' })
      const n = C([...y]),
        g = C(!1),
        w = C(!1),
        o = C([]),
        d = C([])
      let m = L({})
      const c = C({ customer: k[0], amount: 0, date: new Date().toISOString().slice(0, 10), method: 'bank' }),
        {
          tableData: V,
          pagination: U,
          loading: a,
          search: E,
          refresh: D
        } = be({
          rowKey: 'id',
          listAPI: async ({ page: b, size: e }) =>
            (await we({ pageNum: b, pageSize: e, customer: v.customer || void 0, agingRange: v.agingRange || void 0 })).data
        }),
        P = de(() => o.value.filter((b) => b.balance > 0))
      function $(b) {
        n.value = b
      }
      function j() {
        ;(Object.assign(v, { customer: '', agingRange: '' }), E())
      }
      function G() {
        g.value = !0
      }
      async function K() {
        if (!c.value.customer || c.value.amount <= 0) {
          q.warning('请填写客户名称和回款金额')
          return
        }
        ;(await ye({ customer: c.value.customer, amount: c.value.amount }), (g.value = !1), q.success('回款登记成功'), await D())
      }
      function H(b) {
        ;((o.value = V.value.filter((e) => e.customer === b.customer && e.balance > 0)),
          (d.value = [...o.value]),
          Object.keys(m).forEach((e) => delete m[e]),
          o.value.forEach((e) => {
            m[e.id] = 0
          }),
          (w.value = !0))
      }
      async function X() {
        const b = P.value.map((e) => ({ id: e.id, amount: m[e.id] || 0 })).filter((e) => e.amount > 0)
        if (!b.length) {
          q.warning('请输入核销金额')
          return
        }
        ;(await Ve({ items: b }), (w.value = !1), q.success('应收核销成功'), await D())
      }
      return (b, e) => {
        const Y = h('gi-form'),
          z = h('gi-button'),
          S = ie,
          J = B,
          Q = h('gi-table'),
          Z = h('gi-page-layout')
        return (
          p(),
          f(Z, null, {
            header: t(() => [
              l(
                _e,
                { columns: y, 'onUpdate:visibleFields': $ },
                {
                  default: t(() => [
                    l(
                      Y,
                      {
                        modelValue: R(v),
                        'onUpdate:modelValue': e[0] || (e[0] = (i) => (I(v) ? (v.value = i) : (v = i))),
                        columns: n.value,
                        'grid-item-props': r,
                        search: '',
                        onSearch: R(E),
                        onReset: j
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
              l(z, { type: 'add', onClick: G }, { default: t(() => [...(e[7] || (e[7] = [s('登记回款', -1)]))]), _: 1 }),
              l(z, { type: 'reset', style: { 'margin-left': '8px' }, onClick: R(D) }, null, 8, ['onClick'])
            ]),
            default: t(() => [
              l(
                fe,
                { title: '应收台账', columns: M, onRefresh: R(D) },
                {
                  default: t(({ settingColumns: i, tableProps: ee }) => [
                    l(
                      Q,
                      oe({ columns: i, data: R(V), pagination: R(U), loading: R(a) }, ee, { border: '', style: { height: '100%' } }),
                      {
                        amount: t(({ row: u }) => [s(x(u.amount.toLocaleString('zh-CN')), 1)]),
                        settled: t(({ row: u }) => [s(x(u.settled.toLocaleString('zh-CN')), 1)]),
                        balance: t(({ row: u }) => [s(x(u.balance.toLocaleString('zh-CN')), 1)]),
                        aging: t(({ row: u }) => [
                          u.aging <= 0
                            ? (p(), f(S, { key: 0, type: 'success' }, { default: t(() => [...(e[8] || (e[8] = [s('未到期', -1)]))]), _: 1 }))
                            : u.aging <= 30
                              ? (p(), f(S, { key: 1, type: 'warning' }, { default: t(() => [s('逾期 ' + x(u.aging) + ' 天', 1)]), _: 2 }, 1024))
                              : (p(), f(S, { key: 2, type: 'danger' }, { default: t(() => [s('逾期 ' + x(u.aging) + ' 天', 1)]), _: 2 }, 1024))
                        ]),
                        status: t(({ row: u }) => [
                          u.balance === 0
                            ? (p(), f(S, { key: 0, type: 'success' }, { default: t(() => [...(e[9] || (e[9] = [s('已结清', -1)]))]), _: 1 }))
                            : u.settled > 0
                              ? (p(), f(S, { key: 1, type: 'warning' }, { default: t(() => [...(e[10] || (e[10] = [s('部分核销', -1)]))]), _: 1 }))
                              : (p(), f(S, { key: 2, type: 'info' }, { default: t(() => [...(e[11] || (e[11] = [s('未结清', -1)]))]), _: 1 }))
                        ]),
                        actions: t(({ row: u }) => [
                          u.balance > 0
                            ? (p(),
                              f(
                                J,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (Ne) => H(u) },
                                { default: t(() => [...(e[12] || (e[12] = [s('核销', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : re('', !0)
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
                ke,
                {
                  visible: g.value,
                  'onUpdate:visible': e[1] || (e[1] = (i) => (g.value = i)),
                  form: c.value,
                  'onUpdate:form': e[2] || (e[2] = (i) => (c.value = i)),
                  'customer-names': k,
                  onSubmit: K
                },
                null,
                8,
                ['visible', 'form']
              ),
              l(
                Ce,
                {
                  visible: w.value,
                  'onUpdate:visible': e[3] || (e[3] = (i) => (w.value = i)),
                  rows: o.value,
                  'onUpdate:rows': e[4] || (e[4] = (i) => (o.value = i)),
                  'selected-rows': d.value,
                  'onUpdate:selectedRows': e[5] || (e[5] = (i) => (d.value = i)),
                  'amount-map': R(m),
                  'onUpdate:amountMap': e[6] || (e[6] = (i) => (I(m) ? (m.value = i) : (m = i))),
                  'receipt-amount': c.value.amount,
                  onSubmit: X
                },
                null,
                8,
                ['visible', 'rows', 'selected-rows', 'amount-map', 'receipt-amount']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  We = ce(xe, [['__scopeId', 'data-v-d789f887']])
export { We as default }

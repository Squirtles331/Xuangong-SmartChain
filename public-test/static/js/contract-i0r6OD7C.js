import {
  Bn as l,
  Fn as V,
  Kn as G,
  Mn as m,
  On as F,
  Xn as b,
  Yn as X,
  an as N,
  bn as Y,
  dn as e,
  i as $,
  it as H,
  pn as T,
  rr as r,
  sr as M,
  un as D,
  yn as W
} from './element-plus-CzL7BOKu.js'
import { I as J } from './index-DqMfCNbk.js'
import { t as Q } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { t as ee } from './SearchSetting-RejIVc8W.js'
import { m as te, o as ae, r as le } from './crm-Ddpp8fRZ.js'
var oe = T({
    __name: 'ContractFormDialog',
    props: W({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: W(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: y }) {
      const p = V(v, 'visible'),
        c = V(v, 'form'),
        h = y,
        C = [
          { type: 'input', label: '合同编号', field: 'code', required: !0 },
          { type: 'input', label: '客户名称', field: 'customer', required: !0 },
          { type: 'input-number', label: '合同金额', field: 'amount', props: { min: 0 } },
          { type: 'date-picker', label: '签订日期', field: 'sign_date' },
          { type: 'date-picker', label: '生效日期', field: 'start_date' },
          { type: 'date-picker', label: '到期日期', field: 'end_date' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '生效中', value: 'active' },
                { label: '已过期', value: 'expired' },
                { label: '已终止', value: 'terminated' }
              ]
            }
          }
        ]
      function o() {
        p.value = !1
      }
      async function g() {
        return (h('submit'), !1)
      }
      return (d, n) => {
        const t = m('gi-form'),
          x = m('gi-dialog')
        return (
          F(),
          N(
            x,
            {
              modelValue: p.value,
              'onUpdate:modelValue': n[1] || (n[1] = (f) => (p.value = f)),
              title: v.mode === 'add' ? '新增合同' : '编辑合同',
              footer: !0,
              'lock-scroll': !1,
              width: '650px',
              'on-before-ok': g,
              'on-cancel': o
            },
            {
              default: l(() => [
                e(t, { modelValue: c.value, 'onUpdate:modelValue': n[0] || (n[0] = (f) => (c.value = f)), columns: C, 'label-width': 100 }, null, 8, [
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
      const y = { draft: '草稿', active: '生效中', expired: '已过期', terminated: '已终止' },
        p = { draft: 'info', active: 'success', expired: 'warning', terminated: 'danger' },
        c = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '草稿', value: 'draft' },
                { label: '生效中', value: 'active' },
                { label: '已过期', value: 'expired' },
                { label: '已终止', value: 'terminated' }
              ]
            }
          }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        C = [
          { prop: 'code', label: '合同编号', minWidth: 160 },
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { label: '合同金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
          { prop: 'sign_date', label: '签订日期', minWidth: 120 },
          { prop: 'start_date', label: '生效日期', minWidth: 120 },
          { prop: 'end_date', label: '到期日期', minWidth: 120 },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let o = X({ keyword: '', status: '' })
      const g = b([...c]),
        d = b(!1),
        n = b('add'),
        t = b(S()),
        {
          tableData: x,
          pagination: f,
          loading: P,
          search: w,
          refresh: k,
          onDelete: U
        } = Q({
          rowKey: 'id',
          listAPI: async ({ page: i, size: a }) =>
            (await ae({ pageNum: i, pageSize: a, keyword: o.keyword || void 0, status: o.status || void 0 })).data,
          deleteAPI: (i) => Promise.all(i.map((a) => le(a)))
        })
      function S() {
        return { id: '', code: '', customer: '', amount: 0, sign_date: '', start_date: '', end_date: '', status: 'draft' }
      }
      function q(i) {
        g.value = i
      }
      function I() {
        ;(Object.assign(o, { keyword: '', status: '' }), w())
      }
      function R() {
        ;((n.value = 'add'), (t.value = S()), (d.value = !0))
      }
      function B(i) {
        ;((n.value = 'edit'), (t.value = { ...i }), (d.value = !0))
      }
      async function A() {
        if (!t.value.code || !t.value.customer) {
          $.warning('请填写合同编号和客户名称')
          return
        }
        ;(await te({ ...t.value, status: t.value.status }), (d.value = !1), await k())
      }
      return (i, a) => {
        const E = m('gi-form'),
          _ = m('gi-button'),
          z = H,
          K = m('gi-table'),
          L = m('gi-page-layout')
        return (
          F(),
          N(L, null, {
            header: l(() => [
              e(
                ee,
                { columns: c, 'onUpdate:visibleFields': q },
                {
                  default: l(() => [
                    e(
                      E,
                      {
                        modelValue: r(o),
                        'onUpdate:modelValue': a[0] || (a[0] = (s) => (G(o) ? (o.value = s) : (o = s))),
                        columns: g.value,
                        'grid-item-props': h,
                        search: '',
                        onSearch: r(w),
                        onReset: I
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
              e(_, { type: 'add', onClick: R }),
              e(_, { type: 'reset', style: { 'margin-left': '8px' }, onClick: r(k) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              e(
                Z,
                { title: '合同列表', columns: C, onRefresh: r(k) },
                {
                  default: l(({ settingColumns: s, tableProps: O }) => [
                    e(
                      K,
                      Y({ columns: s, data: r(x), pagination: r(f), loading: r(P) }, O, { border: '', style: { height: '100%' } }),
                      {
                        amount: l(({ row: u }) => [D(M(u.amount.toLocaleString('zh-CN')), 1)]),
                        status: l(({ row: u }) => [e(z, { type: p[u.status] }, { default: l(() => [D(M(y[u.status]), 1)]), _: 2 }, 1032, ['type'])]),
                        actions: l(({ row: u }) => [
                          e(_, { type: 'edit', onClick: (j) => B(u) }, null, 8, ['onClick']),
                          e(_, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (j) => r(U)(u) }, null, 8, ['onClick'])
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
                ne,
                {
                  visible: d.value,
                  'onUpdate:visible': a[1] || (a[1] = (s) => (d.value = s)),
                  form: t.value,
                  'onUpdate:form': a[2] || (a[2] = (s) => (t.value = s)),
                  mode: n.value,
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
  ce = J(ie, [['__scopeId', 'data-v-a1d91565']])
export { ce as default }

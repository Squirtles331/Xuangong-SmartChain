import {
  Bn as e,
  Kn as E,
  Mn as r,
  On as g,
  Xn as M,
  Yn as q,
  an as f,
  bn as F,
  dn as s,
  i as K,
  it as L,
  on as U,
  ot as $,
  pn as j,
  rr as l,
  sr as v,
  un as u
} from './element-plus-CzL7BOKu.js'
import { i as A } from './vue-chunks-CWn_TkJU.js'
import { I as G } from './index-DqMfCNbk.js'
import { t as X } from './useTable-Hzr4fBAy.js'
import { t as Y } from './TableSetting-BqN9x3yX.js'
import { t as H } from './SearchSetting-RejIVc8W.js'
import { f as J, y as Q } from './crm-Ddpp8fRZ.js'
var Z = j({
    __name: 'index',
    setup(ee) {
      const b = A(),
        y = { approved: '已审批', in_production: '生产中', pending_delivery: '待发货', completed: '已完成' },
        h = { approved: 'primary', in_production: 'warning', pending_delivery: 'success', completed: 'info' },
        p = [
          { type: 'input', label: '订单编号', field: 'code' },
          { type: 'input', label: '客户名称', field: 'customer_name' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '已审批', value: 'approved' },
                { label: '生产中', value: 'in_production' },
                { label: '待发货', value: 'pending_delivery' },
                { label: '已完成', value: 'completed' }
              ]
            }
          }
        ],
        C = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        x = [
          { prop: 'code', label: '订单编号', minWidth: 160 },
          { prop: 'customer_name', label: '客户名称', minWidth: 160 },
          { prop: 'material_name', label: '产品名称', minWidth: 160 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { label: '金额(元)', minWidth: 120, align: 'right', slotName: 'amount' },
          { prop: 'delivery_date', label: '交期', minWidth: 120 },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let t = q({ code: '', customer_name: '', status: '' })
      const c = M([...p]),
        {
          tableData: S,
          pagination: k,
          loading: N,
          search: m,
          refresh: d
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: n }) =>
            (await J({ pageNum: a, pageSize: n, code: t.code || void 0, customerName: t.customer_name || void 0, status: t.status || void 0 })).data
        })
      function W(a) {
        c.value = a
      }
      function T() {
        ;(Object.assign(t, { code: '', customer_name: '', status: '' }), m())
      }
      function R(a) {
        b.push(`/customer-business/crm/order-change?id=${a.id}`)
      }
      async function V(a) {
        ;(await Q(a.id, { status: 'completed' }), K.success('订单已更新为已完成'), await d())
      }
      return (a, n) => {
        const w = r('gi-form'),
          z = r('gi-button'),
          B = L,
          _ = $,
          I = r('gi-table'),
          O = r('gi-page-layout')
        return (
          g(),
          f(O, null, {
            header: e(() => [
              s(
                H,
                { columns: p, 'onUpdate:visibleFields': W },
                {
                  default: e(() => [
                    s(
                      w,
                      {
                        modelValue: l(t),
                        'onUpdate:modelValue': n[0] || (n[0] = (i) => (E(t) ? (t.value = i) : (t = i))),
                        columns: c.value,
                        'grid-item-props': C,
                        search: '',
                        onSearch: l(m),
                        onReset: T
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
            tool: e(() => [s(z, { type: 'reset', onClick: l(d) }, null, 8, ['onClick'])]),
            default: e(() => [
              s(
                Y,
                { title: '销售订单列表', columns: x, onRefresh: l(d) },
                {
                  default: e(({ settingColumns: i, tableProps: P }) => [
                    s(
                      I,
                      F({ columns: i, data: l(S), pagination: l(k), loading: l(N) }, P, { border: '', style: { height: '100%' } }),
                      {
                        amount: e(({ row: o }) => [u(v(o.amount.toLocaleString('zh-CN')), 1)]),
                        status: e(({ row: o }) => [s(B, { type: h[o.status] }, { default: e(() => [u(v(y[o.status]), 1)]), _: 2 }, 1032, ['type'])]),
                        actions: e(({ row: o }) => [
                          s(
                            _,
                            { type: 'primary', link: '', size: 'small', onClick: (D) => R(o) },
                            { default: e(() => [...(n[1] || (n[1] = [u('订单变更', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          o.status === 'pending_delivery'
                            ? (g(),
                              f(
                                _,
                                { key: 0, type: 'success', link: '', size: 'small', onClick: (D) => V(o) },
                                { default: e(() => [...(n[2] || (n[2] = [u('发货完成', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : U('', !0)
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
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  re = G(Z, [['__scopeId', 'data-v-523f26ae']])
export { re as default }

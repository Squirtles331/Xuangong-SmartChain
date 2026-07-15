import {
  Bn as e,
  Kn as V,
  Mn as p,
  On as k,
  Xn as D,
  Yn as P,
  an as w,
  bn as B,
  dn as l,
  pn as T,
  rr as a,
  sr as c,
  un as d
} from './element-plus-CzL7BOKu.js'
import { t as z } from './useTable-Hzr4fBAy.js'
import { t as A } from './TableSetting-BqN9x3yX.js'
import { t as I } from './SearchSetting-RejIVc8W.js'
import { r as K } from './finance-C91m7hPG.js'
var L = T({
    __name: 'index',
    setup(O) {
      const m = [
          { type: 'input', label: '产品名称', field: 'product' },
          {
            type: 'select-v2',
            label: '核算期间',
            field: 'period',
            props: {
              options: [
                { label: '2026-06', value: '2026-06' },
                { label: '2026-05', value: '2026-05' }
              ]
            }
          }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        f = [
          { prop: 'product', label: '产品名称', minWidth: 180 },
          { prop: 'material_cost', label: '材料成本', minWidth: 120, align: 'right', slotName: 'material_cost' },
          { prop: 'labor_cost', label: '人工成本', minWidth: 120, align: 'right', slotName: 'labor_cost' },
          { prop: 'overhead', label: '制造费用', minWidth: 120, align: 'right', slotName: 'overhead' },
          { prop: 'total', label: '总成本', minWidth: 120, align: 'right', slotName: 'total' },
          { prop: 'period', label: '核算期间', minWidth: 100, align: 'center' }
        ]
      let t = P({ product: '', period: '' })
      const u = D([...m]),
        {
          tableData: b,
          pagination: v,
          loading: x,
          search: g,
          refresh: _
        } = z({
          rowKey: 'id',
          listAPI: async ({ page: n, size: i }) =>
            (await K({ pageNum: n, pageSize: i, product: t.product || void 0, period: t.period || void 0 })).data
        })
      function r(n) {
        return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      function y(n) {
        u.value = n
      }
      function C() {
        ;(Object.assign(t, { product: '', period: '' }), g())
      }
      return (n, i) => {
        const S = p('gi-form'),
          N = p('gi-button'),
          W = p('gi-table'),
          F = p('gi-page-layout')
        return (
          k(),
          w(F, null, {
            header: e(() => [
              l(
                I,
                { columns: m, 'onUpdate:visibleFields': y },
                {
                  default: e(() => [
                    l(
                      S,
                      {
                        modelValue: a(t),
                        'onUpdate:modelValue': i[0] || (i[0] = (s) => (V(t) ? (t.value = s) : (t = s))),
                        columns: u.value,
                        'grid-item-props': h,
                        search: '',
                        onSearch: a(g),
                        onReset: C
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
            tool: e(() => [l(N, { type: 'reset', onClick: a(_) }, null, 8, ['onClick'])]),
            default: e(() => [
              l(
                A,
                { title: '成本明细列表', columns: f, onRefresh: a(_) },
                {
                  default: e(({ settingColumns: s, tableProps: R }) => [
                    l(
                      W,
                      B({ columns: s, data: a(b), pagination: a(v), loading: a(x) }, R, { border: '', style: { height: '100%' } }),
                      {
                        material_cost: e(({ row: o }) => [d(c(r(o.material_cost)), 1)]),
                        labor_cost: e(({ row: o }) => [d(c(r(o.labor_cost)), 1)]),
                        overhead: e(({ row: o }) => [d(c(r(o.overhead)), 1)]),
                        total: e(({ row: o }) => [d(c(r(o.total)), 1)]),
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
  X = L
export { X as default }

import {
  Bn as r,
  Kn as x,
  On as R,
  Xn as k,
  Yn as A,
  an as W,
  dn as d,
  i as T,
  it as C,
  pn as N,
  rr as i,
  sr as P,
  un as S
} from './element-plus-CzL7BOKu.js'
import { t as B } from './useTable-Hzr4fBAy.js'
import { t as D } from './CrudPage-7Q0FEhS_.js'
import { t as E } from './CrudRowActions-Dmc4i_Io.js'
import { r as I, t as K } from './routing-hHkMRJQX.js'
var M = N({
    __name: 'index',
    setup(O) {
      const p = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工序名称 / 产品名称' } },
          {
            type: 'select-v2',
            label: '偏差区间',
            field: 'deviation',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '10%及以下', value: 'low' },
                { label: '10%-20%', value: 'mid' },
                { label: '20%以上', value: 'high' }
              ]
            }
          }
        ],
        c = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        u = [
          { prop: 'operation', label: '工序名称', minWidth: 130 },
          { prop: 'material_name', label: '产品名称', minWidth: 180 },
          { prop: 'std_hours', label: '标准工时(分钟)', minWidth: 130, align: 'center' },
          { prop: 'actual_avg', label: '平均实绩(分钟)', minWidth: 130, align: 'center' },
          { label: '偏差率', minWidth: 100, align: 'center', slotName: 'deviation' },
          { prop: 'samples', label: '样本数', minWidth: 90, align: 'center' },
          { prop: 'suggestion', label: '建议说明', minWidth: 240 },
          { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
        ]
      let t = A({ keyword: '', deviation: '' })
      const m = k([]),
        {
          tableData: g,
          pagination: h,
          loading: f,
          search: s,
          refresh: l
        } = B({
          rowKey: 'id',
          listAPI: async ({ page: e, size: n }) => {
            const o = await I({ pageNum: e, pageSize: n, keyword: t.keyword || void 0, deviation: t.deviation || void 0 })
            return ((m.value = o.data.list), o.data)
          }
        })
      function v() {
        ;(Object.assign(t, { keyword: '', deviation: '' }), s())
      }
      function _(e) {
        return e <= 10 ? 'success' : e <= 20 ? 'warning' : 'danger'
      }
      function b(e) {
        return [{ key: 'adopt', label: '采纳建议', tone: e.deviation > 20 ? 'warning' : 'primary' }]
      }
      async function y(e, n) {
        e === 'adopt' && (await K(n.id), T.success(`已采纳 ${n.operation} 的工时建议`), await l())
      }
      return (e, n) => {
        const o = C
        return (
          R(),
          W(
            D,
            {
              'search-model': i(t),
              'onUpdate:searchModel': n[0] || (n[0] = (a) => (x(t) ? (t.value = a) : (t = a))),
              title: '标准工时学习',
              'search-columns': p,
              'search-grid-item-props': c,
              columns: u,
              data: i(g),
              pagination: i(h),
              loading: i(f),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'show-add-button': !1,
              onSearch: i(s),
              onReset: v,
              onRefresh: i(l)
            },
            {
              deviation: r(({ row: a }) => [
                d(o, { type: _(a.deviation), effect: 'light', round: '' }, { default: r(() => [S(P(a.deviation) + '%', 1)]), _: 2 }, 1032, ['type'])
              ]),
              actions: r(({ row: a }) => [d(E, { actions: b(a), onAction: (w) => y(w, a) }, null, 8, ['actions', 'onAction'])]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  L = M
export { L as default }

import {
  Bn as a,
  Fn as x,
  H as R,
  Kn as M,
  On as g,
  U as T,
  W as V,
  Xn as v,
  Yn as A,
  an as h,
  dn as t,
  pn as w,
  rr as d,
  sr as i,
  un as o,
  yn as C
} from './element-plus-CzL7BOKu.js'
import { t as P } from './useTable-Hzr4fBAy.js'
import { t as Y } from './CrudPage-7Q0FEhS_.js'
import { t as B } from './CrudRowActions-Dmc4i_Io.js'
import { c as N } from './work-order-Clsu8Szn.js'
var S = w({
    __name: 'TraceDetailDialog',
    props: C({ detail: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {} }),
    emits: ['update:visible'],
    setup(l) {
      const u = x(l, 'visible')
      return (f, c) => {
        const e = V,
          s = T,
          p = R
        return (
          g(),
          h(
            p,
            {
              modelValue: u.value,
              'onUpdate:modelValue': c[0] || (c[0] = (m) => (u.value = m)),
              title: '报工详情',
              width: '600px',
              'lock-scroll': !1
            },
            {
              default: a(() => [
                t(
                  s,
                  { column: 2, border: '' },
                  {
                    default: a(() => [
                      t(e, { label: '工单' }, { default: a(() => [o(i(l.detail?.wo_code), 1)]), _: 1 }),
                      t(e, { label: '工序' }, { default: a(() => [o(i(l.detail?.operation_name), 1)]), _: 1 }),
                      t(e, { label: '操作人' }, { default: a(() => [o(i(l.detail?.worker), 1)]), _: 1 }),
                      t(e, { label: '报工时间' }, { default: a(() => [o(i(l.detail?.time), 1)]), _: 1 }),
                      t(e, { label: '合格数量' }, { default: a(() => [o(i(l.detail?.qualified_qty), 1)]), _: 1 }),
                      t(e, { label: '不良数量' }, { default: a(() => [o(i(l.detail?.defective_qty), 1)]), _: 1 }),
                      t(e, { label: '不良原因' }, { default: a(() => [o(i(l.detail?.defect_reasons || '-'), 1)]), _: 1 }),
                      t(e, { label: '工时(分钟)' }, { default: a(() => [o(i(l.detail?.actual_hours), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
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
  U = S,
  E = w({
    __name: 'index',
    setup(l) {
      const u = [{ key: 'detail', label: '详情', tone: 'primary' }],
        f = [
          { type: 'input', label: '工单号', field: 'wo_code', props: { clearable: !0 } },
          { type: 'input', label: '操作人', field: 'worker', props: { clearable: !0 } },
          {
            type: 'date-picker',
            label: '日期范围',
            field: 'date_range',
            props: { type: 'daterange', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'YYYY-MM-DD' }
          }
        ],
        c = [
          { prop: 'wo_code', label: '工单号', minWidth: 170 },
          { prop: 'operation_name', label: '工序', minWidth: 130 },
          { prop: 'worker', label: '操作人', minWidth: 100 },
          { prop: 'qualified_qty', label: '合格数', minWidth: 80, align: 'center' },
          { prop: 'defective_qty', label: '不良数', minWidth: 80, align: 'center' },
          { prop: 'actual_hours', label: '工时(分钟)', minWidth: 100, align: 'center' },
          { prop: 'time', label: '报工时间', minWidth: 150 },
          { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
        ]
      let e = A({ wo_code: '', worker: '', date_range: [] })
      const s = v(!1),
        p = v(null),
        {
          tableData: m,
          pagination: y,
          loading: D,
          search: b,
          refresh: k
        } = P({
          rowKey: 'id',
          listAPI: async ({ page: _, size: n }) =>
            (
              await N({
                pageNum: _,
                pageSize: n,
                wo_code: e.wo_code || void 0,
                worker: e.worker || void 0,
                startDate: e.date_range[0] || void 0,
                endDate: e.date_range[1] || void 0
              })
            ).data
        })
      function W() {
        ;(Object.assign(e, { wo_code: '', worker: '', date_range: [] }), b())
      }
      function q(_) {
        ;((p.value = _), (s.value = !0))
      }
      return (_, n) => (
        g(),
        h(
          Y,
          {
            'search-model': d(e),
            'onUpdate:searchModel': n[1] || (n[1] = (r) => (M(e) ? (e.value = r) : (e = r))),
            title: '报工记录',
            'search-columns': f,
            columns: c,
            data: d(m),
            pagination: d(y),
            loading: d(D),
            'show-add-button': !1,
            onSearch: d(b),
            onReset: W,
            onRefresh: d(k)
          },
          {
            actions: a(({ row: r }) => [t(B, { actions: u, onAction: (F) => q(r) }, null, 8, ['onAction'])]),
            dialog: a(() => [
              t(U, { visible: s.value, 'onUpdate:visible': n[0] || (n[0] = (r) => (s.value = r)), detail: p.value }, null, 8, ['visible', 'detail'])
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  H = E
export { H as default }

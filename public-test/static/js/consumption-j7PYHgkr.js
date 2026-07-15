import {
  B as L,
  Bn as n,
  Kn as j,
  On as k,
  U as X,
  W as Y,
  Xn as m,
  Yn as z,
  an as C,
  dn as s,
  i as f,
  on as F,
  ot as G,
  pn as H,
  rr as d,
  sr as r,
  un as i
} from './element-plus-CzL7BOKu.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as S } from './StatusTag-DWd3m1xj.js'
import { t as Q } from './CrudPage-7Q0FEhS_.js'
import { a as w, n as N, o as b, t as W } from './third-batch-static-CHXUB_05.js'
var Z = H({
    __name: 'index',
    setup(ee) {
      const y = m(w(b)),
        v = m(!1),
        l = m(null),
        p = m(''),
        O = Array.from(new Set(b.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        x = [{ label: '全部', value: '' }, ...W.map((e) => ({ label: e.label, value: e.value }))],
        V = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索记录号 / 工单号 / 物料名称', clearable: !0 } },
          { type: 'select-v2', label: '偏差类型', field: 'variance', props: { options: N, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: O, clearable: !0 } }
        ],
        T = [
          { prop: 'record_code', label: '记录号', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'material_name', label: '物料名称', minWidth: 150 },
          { prop: 'batch_code', label: '批次号', minWidth: 140 },
          { label: '计划/实耗', minWidth: 130, slotName: 'plannedActual', align: 'center' },
          { label: '偏差', minWidth: 100, slotName: 'variance', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'warehouse_ref', label: 'WMS引用', minWidth: 150 },
          { prop: 'last_time', label: '最近记录', minWidth: 150 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let o = z({ keyword: '', variance: '', workshop: '' })
      const {
        tableData: q,
        pagination: M,
        loading: R,
        search: _,
        refresh: h
      } = J({
        rowKey: 'id',
        listAPI: async ({ page: e, size: a }) => {
          const c = y.value.filter(A),
            u = (e - 1) * a
          return { list: c.slice(u, u + a), total: c.length }
        }
      })
      function A(e) {
        const a = o.keyword.trim().toLowerCase()
        return !(
          (a && ![e.record_code, e.wo_code, e.material_name].join(' ').toLowerCase().includes(a)) ||
          (p.value && e.status !== p.value) ||
          (o.variance && e.variance_type !== o.variance) ||
          (o.workshop && e.workshop_name !== o.workshop)
        )
      }
      function D(e) {
        ;((l.value = e), (v.value = !0))
      }
      function I(e) {
        const a = ['draft', 'in_use', 'reconciled', 'closed'],
          c = a.indexOf(e.status)
        ;((e.status = a[Math.min(c + 1, a.length - 1)]), l.value?.id === e.id && (l.value = e), f.success('消耗记录状态已推进'), h())
      }
      function P(e) {
        if (e.variance_type === 'over') {
          ;((e.variance_type = 'normal'), (e.variance_qty = 0), f.success('已复位偏差'), h())
          return
        }
        ;((e.variance_type = 'over'), (e.variance_qty = Math.max(e.variance_qty, 1)), f.success('已标记超耗'), h())
      }
      function U() {
        ;((y.value = w(b)), (v.value = !1), (l.value = null), f.success('投料记录已刷新'), _())
      }
      function B() {
        _()
      }
      function E() {
        ;((o.keyword = ''), (o.variance = ''), (o.workshop = ''), (p.value = ''), _())
      }
      return (e, a) => {
        const c = G,
          u = Y,
          $ = X,
          K = L
        return (
          k(),
          C(
            Q,
            {
              'search-model': d(o),
              'onUpdate:searchModel': a[1] || (a[1] = (t) => (j(o) ? (o.value = t) : (o = t))),
              'segmented-value': p.value,
              'onUpdate:segmentedValue': a[2] || (a[2] = (t) => (p.value = t)),
              title: '投料与消耗',
              'search-columns': V,
              columns: T,
              data: d(q),
              pagination: d(M),
              loading: d(R),
              'show-add-button': !1,
              'segmented-options': x,
              onSearch: d(_),
              onReset: E,
              onRefresh: U,
              onSegmentedChange: B
            },
            {
              plannedActual: n(({ row: t }) => [i(r(t.planned_qty) + ' / ' + r(t.actual_qty) + ' ' + r(t.unit), 1)]),
              variance: n(({ row: t }) => [s(S, { value: t.variance_type, options: d(N) }, null, 8, ['value', 'options'])]),
              status: n(({ row: t }) => [s(S, { value: t.status, options: d(W) }, null, 8, ['value', 'options'])]),
              actions: n(({ row: t }) => [
                s(c, { link: '', type: 'primary', onClick: (g) => D(t) }, { default: n(() => [...(a[3] || (a[3] = [i('详情', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                s(
                  c,
                  { link: '', type: 'warning', onClick: (g) => I(t) },
                  { default: n(() => [...(a[4] || (a[4] = [i('推进状态', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                ),
                s(
                  c,
                  { link: '', type: t.variance_type === 'over' ? 'success' : 'danger', onClick: (g) => P(t) },
                  { default: n(() => [i(r(t.variance_type === 'over' ? '复位偏差' : '标记超耗'), 1)]), _: 2 },
                  1032,
                  ['type', 'onClick']
                )
              ]),
              dialog: n(() => [
                s(
                  K,
                  { modelValue: v.value, 'onUpdate:modelValue': a[0] || (a[0] = (t) => (v.value = t)), title: '投料消耗详情', size: '460px' },
                  {
                    default: n(() => [
                      l.value
                        ? (k(),
                          C(
                            $,
                            { key: 0, column: 1, border: '' },
                            {
                              default: n(() => [
                                s(u, { label: '记录号' }, { default: n(() => [i(r(l.value.record_code), 1)]), _: 1 }),
                                s(u, { label: '工单号' }, { default: n(() => [i(r(l.value.wo_code), 1)]), _: 1 }),
                                s(u, { label: 'WMS引用' }, { default: n(() => [i(r(l.value.warehouse_ref), 1)]), _: 1 }),
                                s(u, { label: '补料引用' }, { default: n(() => [i(r(l.value.supplement_ref || '无'), 1)]), _: 1 }),
                                s(u, { label: '替代料引用' }, { default: n(() => [i(r(l.value.substitute_ref || '无'), 1)]), _: 1 }),
                                s(
                                  u,
                                  { label: '偏差说明' },
                                  {
                                    default: n(() => [i(r(l.value.variance_qty === 0 ? '无偏差' : `${l.value.variance_qty} ${l.value.unit}`), 1)]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            }
                          ))
                        : F('', !0)
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'segmented-value', 'data', 'pagination', 'loading', 'onSearch']
          )
        )
      }
    }
  }),
  se = Z
export { se as default }

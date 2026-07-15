import {
  B as I,
  Bn as o,
  Kn as P,
  On as b,
  U as L,
  W as K,
  Xn as f,
  Yn as M,
  an as h,
  dn as s,
  i as Y,
  on as q,
  ot as F,
  pn as G,
  rr as d,
  sr as r,
  un as i
} from './element-plus-CzL7BOKu.js'
import { t as X } from './useTable-Hzr4fBAy.js'
import { t as y } from './StatusTag-DWd3m1xj.js'
import { t as z } from './CrudPage-7Q0FEhS_.js'
import { a as w, n as k, s as g, t as C } from './fourth-batch-static-CcgL_8sm.js'
var H = G({
    __name: 'index',
    setup(J) {
      const v = f(w(g)),
        p = f(!1),
        n = f(null),
        c = f(''),
        S = Array.from(new Set(g.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        W = [{ label: '全部', value: '' }, ...k.map((e) => ({ label: e.label, value: e.value }))],
        T = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索日志号 / 对象号 / 动作名称', clearable: !0 } },
          { type: 'select-v2', label: '动作分类', field: 'category', props: { options: C, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: S, clearable: !0 } }
        ],
        D = [
          { prop: 'log_code', label: '日志号', minWidth: 150 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '分类', minWidth: 100, slotName: 'category', align: 'center' },
          { prop: 'object_type', label: '对象类型', minWidth: 120 },
          { prop: 'object_code', label: '对象号', minWidth: 150 },
          { prop: 'action_name', label: '动作', minWidth: 130 },
          { label: '状态变化', minWidth: 150, slotName: 'transition' },
          { prop: 'operator_name', label: '操作人', minWidth: 120 },
          { prop: 'happened_at', label: '发生时间', minWidth: 150 },
          { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let l = M({ keyword: '', category: '', workshop: '' })
      const {
        tableData: N,
        pagination: V,
        loading: x,
        search: m
      } = X({
        rowKey: 'id',
        listAPI: async ({ page: e, size: t }) => {
          const _ = v.value.filter(O),
            u = (e - 1) * t
          return { list: _.slice(u, u + t), total: _.length }
        }
      })
      function O(e) {
        const t = l.keyword.trim().toLowerCase()
        return !(
          (t && ![e.log_code, e.object_code, e.action_name].join(' ').toLowerCase().includes(t)) ||
          (c.value && e.status !== c.value) ||
          (l.category && e.category !== l.category) ||
          (l.workshop && e.workshop_name !== l.workshop)
        )
      }
      function R(e) {
        ;((n.value = e), (p.value = !0))
      }
      function U() {
        ;((v.value = w(g)), (p.value = !1), (n.value = null), Y.success('执行日志已刷新'), m())
      }
      function j() {
        m()
      }
      function A() {
        ;((l.keyword = ''), (l.category = ''), (l.workshop = ''), (c.value = ''), m())
      }
      return (e, t) => {
        const _ = F,
          u = K,
          B = L,
          E = I
        return (
          b(),
          h(
            z,
            {
              'search-model': d(l),
              'onUpdate:searchModel': t[1] || (t[1] = (a) => (P(l) ? (l.value = a) : (l = a))),
              'segmented-value': c.value,
              'onUpdate:segmentedValue': t[2] || (t[2] = (a) => (c.value = a)),
              title: '执行日志',
              'search-columns': T,
              columns: D,
              data: d(N),
              pagination: d(V),
              loading: d(x),
              'show-add-button': !1,
              'segmented-options': W,
              onSearch: d(m),
              onReset: A,
              onRefresh: U,
              onSegmentedChange: j
            },
            {
              status: o(({ row: a }) => [s(y, { value: a.status, options: d(k) }, null, 8, ['value', 'options'])]),
              category: o(({ row: a }) => [s(y, { value: a.category, options: d(C) }, null, 8, ['value', 'options'])]),
              transition: o(({ row: a }) => [i(r(a.before_status) + ' -> ' + r(a.after_status), 1)]),
              actions: o(({ row: a }) => [
                s(_, { link: '', type: 'primary', onClick: (Q) => R(a) }, { default: o(() => [...(t[3] || (t[3] = [i('详情', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ])
              ]),
              dialog: o(() => [
                s(
                  E,
                  { modelValue: p.value, 'onUpdate:modelValue': t[0] || (t[0] = (a) => (p.value = a)), title: '执行日志详情', size: '460px' },
                  {
                    default: o(() => [
                      n.value
                        ? (b(),
                          h(
                            B,
                            { key: 0, column: 1, border: '' },
                            {
                              default: o(() => [
                                s(u, { label: '日志号' }, { default: o(() => [i(r(n.value.log_code), 1)]), _: 1 }),
                                s(u, { label: '对象' }, { default: o(() => [i(r(n.value.object_type) + ' / ' + r(n.value.object_code), 1)]), _: 1 }),
                                s(u, { label: '来源页面' }, { default: o(() => [i(r(n.value.source_page), 1)]), _: 1 }),
                                s(u, { label: '班次' }, { default: o(() => [i(r(n.value.shift_name), 1)]), _: 1 }),
                                s(
                                  u,
                                  { label: '状态变化' },
                                  { default: o(() => [i(r(n.value.before_status) + ' -> ' + r(n.value.after_status), 1)]), _: 1 }
                                ),
                                s(u, { label: '备注' }, { default: o(() => [i(r(n.value.remark), 1)]), _: 1 })
                              ]),
                              _: 1
                            }
                          ))
                        : q('', !0)
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
  oe = H
export { oe as default }

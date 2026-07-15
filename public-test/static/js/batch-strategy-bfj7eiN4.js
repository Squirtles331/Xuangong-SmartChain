import {
  Bn as p,
  Kn as E,
  On as m,
  Xn as c,
  Yn as F,
  an as w,
  dn as k,
  i as x,
  pn as N,
  rn as U,
  rr as i,
  sn as K,
  sr as X
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = N({
    __name: 'index',
    setup($) {
      const f = '新增批次策略',
        A = '编辑批次策略',
        D = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '策略编码 / 策略名称 / 适用范围' } }],
        S = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        C = [
          { prop: 'code', label: '策略编码', minWidth: 120 },
          { prop: 'name', label: '策略名称', minWidth: 150 },
          { prop: 'scene', label: '适用场景', minWidth: 140 },
          { prop: 'rule', label: '批次规则', minWidth: 180 },
          { prop: 'traceDepth', label: '追溯深度', minWidth: 100, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        T = [
          { type: 'input', label: '策略编码', field: 'code', required: !0 },
          { type: 'input', label: '策略名称', field: 'name', required: !0 },
          { type: 'input', label: '适用场景', field: 'scene' },
          { type: 'input', label: '批次规则', field: 'rule' },
          { type: 'input', label: '追溯深度', field: 'traceDepth' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        v = ['code', 'name', 'scene'],
        g = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        O = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        s = c([
          {
            id: 'BAT-001',
            code: 'LOT-RCV',
            name: '来料批次',
            scene: '采购收货',
            rule: '按收货单 + 供应商批次生成',
            traceDepth: '批次级',
            status: 'active'
          },
          { id: 'BAT-002', code: 'LOT-WO', name: '工单批次', scene: '制造报工', rule: '按工单号 + 班次生成', traceDepth: '工单级', status: 'active' },
          {
            id: 'BAT-003',
            code: 'LOT-MIX',
            name: '混批策略',
            scene: '半成品流转',
            rule: '限制相同版本混批',
            traceDepth: '容器级',
            status: 'disabled'
          }
        ])
      let r = F({ keyword: '' })
      const o = c(!1),
        d = c('add'),
        l = c(_()),
        b = U(() =>
          s.value.filter((a) =>
            Object.entries(r).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((q) =>
                      String(a[q] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const n = a[t]
              return Array.isArray(n) ? n.map((u) => String(u)).includes(String(e)) : String(n ?? '') === String(e)
            })
          )
        ),
        {
          tableData: R,
          pagination: M,
          loading: W,
          search: h,
          refresh: y,
          onDelete: B
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: b.value.slice(e, n), total: b.value.length }
          },
          deleteAPI: async (a) => {
            s.value = s.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function _() {
        return { id: '', code: '', name: '', scene: '', rule: '', traceDepth: '批次级', status: 'active' }
      }
      function I() {
        ;(Object.assign(r, { keyword: '' }), h())
      }
      function L() {
        ;((d.value = 'add'), (l.value = _()), (o.value = !0))
      }
      function P(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (o.value = !0))
      }
      function V(a, t) {
        if (a === 'edit') {
          P(t)
          return
        }
        a === 'delete' && B(t)
      }
      async function j() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (s.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), x.success('已新增静态数据'))
          : ((s.value = s.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), x.success('已更新静态数据')),
          (o.value = !1),
          await y())
      }
      return (a, t) => (
        m(),
        w(
          J,
          {
            'search-model': i(r),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (E(r) ? (r.value = e) : (r = e))),
            title: '批次策略',
            'search-columns': D,
            'search-grid-item-props': S,
            columns: C,
            data: i(R),
            pagination: i(M),
            loading: i(W),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: i(h),
            onReset: I,
            onRefresh: i(y),
            onAdd: L
          },
          {
            status: p(({ row: e }) => [
              g.length ? (m(), w(Y, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (m(), K('span', Z, X(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [k(Q, { actions: O, onAction: (n) => V(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              k(
                H,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : A,
                  columns: T,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: j
                },
                null,
                8,
                ['visible', 'form', 'title']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  re = z
export { re as default }

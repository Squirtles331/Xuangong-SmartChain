import {
  Bn as c,
  Kn as N,
  On as m,
  Xn as p,
  Yn as U,
  an as w,
  dn as _,
  i as k,
  pn as V,
  rn as K,
  rr as r,
  sn as L,
  sr as G
} from './element-plus-CzL7BOKu.js'
import { t as X } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = V({
    __name: 'index',
    setup($) {
      const f = '新增模具',
        x = '编辑模具',
        R = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '模具编码 / 模具名称 / 模具类型' } }],
        S = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        M = [
          { prop: 'code', label: '模具编码', minWidth: 140 },
          { prop: 'name', label: '模具名称', minWidth: 160 },
          { prop: 'type', label: '模具类型', minWidth: 100, align: 'center' },
          { prop: 'lifeDesign', label: '设计寿命', minWidth: 100, align: 'center' },
          { prop: 'used', label: '已用次数', minWidth: 100, align: 'center' },
          { prop: 'usageRate', label: '寿命使用率', minWidth: 120, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        A = [
          { type: 'input', label: '模具编码', field: 'code', required: !0 },
          { type: 'input', label: '模具名称', field: 'name', required: !0 },
          { type: 'input', label: '模具类型', field: 'type' },
          { type: 'input-number', label: '设计寿命', field: 'lifeDesign', props: { min: 0, precision: 0 } },
          { type: 'input-number', label: '已用次数', field: 'used', props: { min: 0, precision: 0 } },
          { type: 'input', label: '寿命使用率', field: 'usageRate' },
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
        g = ['code', 'name', 'type'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        C = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = p([
          { id: 'MOD-001', code: 'MD0001', name: '泵体铸造模具', type: '铸模', lifeDesign: 1e4, used: 6200, usageRate: '62%', status: 'active' },
          { id: 'MOD-002', code: 'MD0002', name: '叶轮锻模', type: '锻模', lifeDesign: 5e3, used: 2400, usageRate: '48%', status: 'active' },
          { id: 'MOD-003', code: 'MD0003', name: '试制注塑模', type: '注塑模', lifeDesign: 2e3, used: 1800, usageRate: '90%', status: 'disabled' }
        ])
      let s = U({ keyword: '' })
      const o = p(!1),
        d = p('add'),
        n = p(D()),
        b = K(() =>
          l.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (g.length ? g : Object.keys(a)).some((F) =>
                      String(a[F] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const i = a[t]
              return Array.isArray(i) ? i.map((u) => String(u)).includes(String(e)) : String(i ?? '') === String(e)
            })
          )
        ),
        {
          tableData: O,
          pagination: W,
          loading: P,
          search: y,
          refresh: h,
          onDelete: B
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              i = e + t
            return { list: b.value.slice(e, i), total: b.value.length }
          },
          deleteAPI: async (a) => {
            l.value = l.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function D() {
        return { id: '', code: '', name: '', type: '铸模', lifeDesign: 0, used: 0, usageRate: '0%', status: 'active' }
      }
      function I() {
        ;(Object.assign(s, { keyword: '' }), y())
      }
      function T() {
        ;((d.value = 'add'), (n.value = D()), (o.value = !0))
      }
      function j(a) {
        ;((d.value = 'edit'), (n.value = { ...a }), (o.value = !0))
      }
      function q(a, t) {
        if (a === 'edit') {
          j(t)
          return
        }
        a === 'delete' && B(t)
      }
      async function E() {
        const a = String(n.value.id || '')
        ;(d.value === 'add'
          ? (l.value.unshift({ ...n.value, id: a || 'MDM-' + Date.now() }), k.success('已新增静态数据'))
          : ((l.value = l.value.map((t) => (String(t.id) === a ? { ...n.value } : t))), k.success('已更新静态数据')),
          (o.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        w(
          J,
          {
            'search-model': r(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (N(s) ? (s.value = e) : (s = e))),
            title: '模具',
            'search-columns': R,
            'search-grid-item-props': S,
            columns: M,
            data: r(O),
            pagination: r(W),
            loading: r(P),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: r(y),
            onReset: I,
            onRefresh: r(h),
            onAdd: T
          },
          {
            status: c(({ row: e }) => [
              v.length ? (m(), w(Y, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: c(({ row: e }) => [_(Q, { actions: C, onAction: (i) => q(i, e) }, null, 8, ['onAction'])]),
            dialog: c(() => [
              _(
                H,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: n.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (n.value = e)),
                  title: d.value === 'add' ? f : x,
                  columns: A,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: E
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
  se = z
export { se as default }

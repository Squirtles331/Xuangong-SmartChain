import {
  Bn as p,
  Kn as q,
  On as m,
  Xn as c,
  Yn as F,
  an as S,
  dn as w,
  i as _,
  pn as G,
  rn as N,
  rr as l,
  sn as V,
  sr as L
} from './element-plus-CzL7BOKu.js'
import { t as H } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = G({
    __name: 'index',
    setup($) {
      const f = '新增计量单位',
        k = '编辑计量单位',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '单位编码 / 单位名称 / 国际代码' } }],
        A = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        M = [
          { prop: 'code', label: '单位编码', minWidth: 120 },
          { prop: 'name', label: '单位名称', minWidth: 120 },
          { prop: 'symbol', label: '单位符号', minWidth: 100, align: 'center' },
          { prop: 'precision', label: '精度', minWidth: 80, align: 'center' },
          { prop: 'isoCode', label: '国际代码', minWidth: 120, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        D = [
          { type: 'input', label: '单位编码', field: 'code', required: !0 },
          { type: 'input', label: '单位名称', field: 'name', required: !0 },
          { type: 'input', label: '单位符号', field: 'symbol' },
          { type: 'input-number', label: '精度', field: 'precision', props: { min: 0, max: 6, precision: 0 } },
          { type: 'input', label: '国际代码', field: 'isoCode' },
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
        b = ['code', 'name', 'isoCode'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        O = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        n = c([
          { id: 'UOM-001', code: 'PCS', name: '件', symbol: 'pcs', precision: 0, isoCode: 'H87', status: 'active' },
          { id: 'UOM-002', code: 'SET', name: '套', symbol: 'set', precision: 0, isoCode: 'SET', status: 'active' },
          { id: 'UOM-003', code: 'KG', name: '千克', symbol: 'kg', precision: 3, isoCode: 'KGM', status: 'active' }
        ])
      let o = F({ keyword: '' })
      const r = c(!1),
        d = c('add'),
        i = c(C()),
        g = N(() =>
          n.value.filter((a) =>
            Object.entries(o).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (b.length ? b : Object.keys(a)).some((j) =>
                      String(a[j] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const s = a[t]
              return Array.isArray(s) ? s.map((u) => String(u)).includes(String(e)) : String(s ?? '') === String(e)
            })
          )
        ),
        {
          tableData: R,
          pagination: W,
          loading: P,
          search: y,
          refresh: h,
          onDelete: T
        } = H({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              s = e + t
            return { list: g.value.slice(e, s), total: g.value.length }
          },
          deleteAPI: async (a) => {
            n.value = n.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function C() {
        return { id: '', code: '', name: '', symbol: '', precision: 0, isoCode: '', status: 'active' }
      }
      function U() {
        ;(Object.assign(o, { keyword: '' }), y())
      }
      function E() {
        ;((d.value = 'add'), (i.value = C()), (r.value = !0))
      }
      function B(a) {
        ;((d.value = 'edit'), (i.value = { ...a }), (r.value = !0))
      }
      function I(a, t) {
        if (a === 'edit') {
          B(t)
          return
        }
        a === 'delete' && T(t)
      }
      async function K() {
        const a = String(i.value.id || '')
        ;(d.value === 'add'
          ? (n.value.unshift({ ...i.value, id: a || 'MDM-' + Date.now() }), _.success('已新增静态数据'))
          : ((n.value = n.value.map((t) => (String(t.id) === a ? { ...i.value } : t))), _.success('已更新静态数据')),
          (r.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        S(
          J,
          {
            'search-model': l(o),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (q(o) ? (o.value = e) : (o = e))),
            title: '计量单位',
            'search-columns': x,
            'search-grid-item-props': A,
            columns: M,
            data: l(R),
            pagination: l(W),
            loading: l(P),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: l(y),
            onReset: U,
            onRefresh: l(h),
            onAdd: E
          },
          {
            status: p(({ row: e }) => [
              v.length ? (m(), S(X, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), V('span', Z, L(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [w(Q, { actions: O, onAction: (s) => I(s, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              w(
                Y,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: i.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (i.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: D,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: K
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
  oe = z
export { oe as default }

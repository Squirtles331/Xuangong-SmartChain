import {
  Bn as m,
  Kn as F,
  On as p,
  Xn as c,
  Yn as N,
  an as w,
  dn as S,
  i as k,
  pn as U,
  rn as V,
  rr as o,
  sn as K,
  sr as L
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = U({
    __name: 'index',
    setup($) {
      const f = '新增检验项目',
        x = '编辑检验项目',
        A = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '项目编码 / 项目名称 / 检验标准' } }],
        I = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        T = [
          { prop: 'code', label: '项目编码', minWidth: 130 },
          { prop: 'name', label: '项目名称', minWidth: 150 },
          { prop: 'standard', label: '所属标准', minWidth: 160 },
          { prop: 'method', label: '检验方法', minWidth: 140 },
          { prop: 'limit', label: '判定标准', minWidth: 140 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        C = [
          { type: 'input', label: '项目编码', field: 'code', required: !0 },
          { type: 'input', label: '项目名称', field: 'name', required: !0 },
          { type: 'input', label: '所属标准', field: 'standard' },
          { type: 'input', label: '检验方法', field: 'method' },
          { type: 'input', label: '判定标准', field: 'limit' },
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
        v = ['code', 'name', 'standard'],
        g = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        D = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = c([
          {
            id: 'QIT-001',
            code: 'QIT-DIM-01',
            name: '关键尺寸',
            standard: '来料尺寸检验标准',
            method: '卡尺测量',
            limit: '±0.05mm',
            status: 'active'
          },
          {
            id: 'QIT-002',
            code: 'QIT-PRS-01',
            name: '试压稳定性',
            standard: '整机完工检验标准',
            method: '试压台检测',
            limit: '1.5MPa / 5min',
            status: 'active'
          },
          {
            id: 'QIT-003',
            code: 'QIT-APP-01',
            name: '外观完整性',
            standard: '装配过程检验标准',
            method: '目检',
            limit: '无明显划伤',
            status: 'active'
          }
        ])
      let s = N({ keyword: '' })
      const r = c(!1),
        d = c('add'),
        n = c(_()),
        b = V(() =>
          l.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((E) =>
                      String(a[E] ?? '')
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
          tableData: M,
          pagination: P,
          loading: R,
          search: h,
          refresh: y,
          onDelete: W
        } = G({
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
      function _() {
        return { id: '', code: '', name: '', standard: '', method: '', limit: '', status: 'active' }
      }
      function Q() {
        ;(Object.assign(s, { keyword: '' }), h())
      }
      function O() {
        ;((d.value = 'add'), (n.value = _()), (r.value = !0))
      }
      function B(a) {
        ;((d.value = 'edit'), (n.value = { ...a }), (r.value = !0))
      }
      function j(a, t) {
        if (a === 'edit') {
          B(t)
          return
        }
        a === 'delete' && W(t)
      }
      async function q() {
        const a = String(n.value.id || '')
        ;(d.value === 'add'
          ? (l.value.unshift({ ...n.value, id: a || 'MDM-' + Date.now() }), k.success('已新增静态数据'))
          : ((l.value = l.value.map((t) => (String(t.id) === a ? { ...n.value } : t))), k.success('已更新静态数据')),
          (r.value = !1),
          await y())
      }
      return (a, t) => (
        p(),
        w(
          H,
          {
            'search-model': o(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(s) ? (s.value = e) : (s = e))),
            title: '检验项目',
            'search-columns': A,
            'search-grid-item-props': I,
            columns: T,
            data: o(M),
            pagination: o(P),
            loading: o(R),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: o(h),
            onReset: Q,
            onRefresh: o(y),
            onAdd: O
          },
          {
            status: m(({ row: e }) => [
              g.length ? (p(), w(X, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (p(), K('span', Z, L(e.status ?? '-'), 1))
            ]),
            actions: m(({ row: e }) => [S(J, { actions: D, onAction: (i) => j(i, e) }, null, 8, ['onAction'])]),
            dialog: m(() => [
              S(
                Y,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: n.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (n.value = e)),
                  title: d.value === 'add' ? f : x,
                  columns: C,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: q
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

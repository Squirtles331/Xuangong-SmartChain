import {
  Bn as c,
  Kn as F,
  On as m,
  Xn as p,
  Yn as U,
  an as C,
  dn as _,
  i as k,
  pn as V,
  rn as K,
  rr as o,
  sn as L,
  sr as Q
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = V({
    __name: 'index',
    setup($) {
      const f = '新增库区 / 库位',
        x = '编辑库区 / 库位',
        S = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '仓库 / 库区 / 库位编码' } }],
        A = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        N = [
          { prop: 'warehouse', label: '所属仓库', minWidth: 140 },
          { prop: 'areaCode', label: '库区编码', minWidth: 120 },
          { prop: 'areaName', label: '库区名称', minWidth: 140 },
          { prop: 'binCode', label: '库位编码', minWidth: 120 },
          { prop: 'binType', label: '库位类型', minWidth: 120 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        T = [
          { type: 'input', label: '所属仓库', field: 'warehouse', required: !0 },
          { type: 'input', label: '库区编码', field: 'areaCode', required: !0 },
          { type: 'input', label: '库区名称', field: 'areaName' },
          { type: 'input', label: '库位编码', field: 'binCode', required: !0 },
          { type: 'input', label: '库位类型', field: 'binType' },
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
        b = ['warehouse', 'areaCode', 'areaName', 'binCode'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        B = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        n = p([
          { id: 'BIN-001', warehouse: '原材料仓', areaCode: 'A01', areaName: '铝材区', binCode: 'A01-01-01', binType: '托盘位', status: 'active' },
          { id: 'BIN-002', warehouse: '半成品仓', areaCode: 'B02', areaName: '机加件区', binCode: 'B02-03-02', binType: '货架位', status: 'active' },
          { id: 'BIN-003', warehouse: '退货隔离仓', areaCode: 'Q01', areaName: '隔离区', binCode: 'Q01-01-01', binType: '隔离位', status: 'disabled' }
        ])
      let l = U({ keyword: '' })
      const s = p(!1),
        d = p('add'),
        i = p(w()),
        y = K(() =>
          n.value.filter((a) =>
            Object.entries(l).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (b.length ? b : Object.keys(a)).some((E) =>
                      String(a[E] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const r = a[t]
              return Array.isArray(r) ? r.map((u) => String(u)).includes(String(e)) : String(r ?? '') === String(e)
            })
          )
        ),
        {
          tableData: D,
          pagination: R,
          loading: I,
          search: g,
          refresh: h,
          onDelete: M
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              r = e + t
            return { list: y.value.slice(e, r), total: y.value.length }
          },
          deleteAPI: async (a) => {
            n.value = n.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', warehouse: '', areaCode: '', areaName: '', binCode: '', binType: '货架位', status: 'active' }
      }
      function W() {
        ;(Object.assign(l, { keyword: '' }), g())
      }
      function O() {
        ;((d.value = 'add'), (i.value = w()), (s.value = !0))
      }
      function P(a) {
        ;((d.value = 'edit'), (i.value = { ...a }), (s.value = !0))
      }
      function q(a, t) {
        if (a === 'edit') {
          P(t)
          return
        }
        a === 'delete' && M(t)
      }
      async function j() {
        const a = String(i.value.id || '')
        ;(d.value === 'add'
          ? (n.value.unshift({ ...i.value, id: a || 'MDM-' + Date.now() }), k.success('已新增静态数据'))
          : ((n.value = n.value.map((t) => (String(t.id) === a ? { ...i.value } : t))), k.success('已更新静态数据')),
          (s.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        C(
          H,
          {
            'search-model': o(l),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(l) ? (l.value = e) : (l = e))),
            title: '库区 / 库位',
            'search-columns': S,
            'search-grid-item-props': A,
            columns: N,
            data: o(D),
            pagination: o(R),
            loading: o(I),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: o(g),
            onReset: W,
            onRefresh: o(h),
            onAdd: O
          },
          {
            status: c(({ row: e }) => [
              v.length ? (m(), C(X, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), L('span', Z, Q(e.status ?? '-'), 1))
            ]),
            actions: c(({ row: e }) => [_(J, { actions: B, onAction: (r) => q(r, e) }, null, 8, ['onAction'])]),
            dialog: c(() => [
              _(
                Y,
                {
                  visible: s.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (s.value = e)),
                  form: i.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (i.value = e)),
                  title: d.value === 'add' ? f : x,
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
  le = z
export { le as default }

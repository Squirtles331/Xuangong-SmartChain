import {
  Bn as p,
  Kn as j,
  On as m,
  Xn as c,
  Yn as N,
  an as W,
  dn as C,
  i as _,
  pn as U,
  rn as V,
  rr as s,
  sn as G,
  sr as K
} from './element-plus-CzL7BOKu.js'
import { t as L } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = U({
    __name: 'index',
    setup($) {
      const f = '新增仓库主数据',
        k = '编辑仓库主数据',
        x = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '仓库编码 / 仓库名称 / 责任人' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        S = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        A = [
          { prop: 'code', label: '仓库编码', minWidth: 130 },
          { prop: 'name', label: '仓库名称', minWidth: 150 },
          { prop: 'type', label: '仓库类型', minWidth: 120 },
          { prop: 'manager', label: '责任人', minWidth: 100 },
          { prop: 'locationCount', label: '库位数量', minWidth: 100, align: 'center' },
          { prop: 'capacity', label: '容量说明', minWidth: 120 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        R = [
          { type: 'input', label: '仓库编码', field: 'code', required: !0 },
          { type: 'input', label: '仓库名称', field: 'name', required: !0 },
          { type: 'input', label: '仓库类型', field: 'type', required: !0 },
          { type: 'input', label: '责任人', field: 'manager' },
          { type: 'input-number', label: '库位数量', field: 'locationCount', props: { min: 0, precision: 0 } },
          { type: 'input', label: '容量说明', field: 'capacity' },
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
        v = ['code', 'name', 'manager'],
        y = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        D = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = c([
          {
            id: 'WH-001',
            code: 'WH-RM',
            name: '原材料仓',
            type: '原材料仓',
            manager: '赵仓储',
            locationCount: 48,
            capacity: '1200 托位',
            status: 'active'
          },
          {
            id: 'WH-002',
            code: 'WH-WIP',
            name: '半成品仓',
            type: '半成品仓',
            manager: '赵仓储',
            locationCount: 32,
            capacity: '680 托位',
            status: 'active'
          },
          {
            id: 'WH-003',
            code: 'WH-FG',
            name: '成品仓',
            type: '成品仓',
            manager: '李物流',
            locationCount: 26,
            capacity: '520 托位',
            status: 'active'
          },
          {
            id: 'WH-004',
            code: 'WH-RET',
            name: '退货隔离仓',
            type: '退货仓',
            manager: '王质量',
            locationCount: 12,
            capacity: '180 托位',
            status: 'disabled'
          }
        ])
      let o = N({ keyword: '', status: '' })
      const r = c(!1),
        d = c('add'),
        n = c(w()),
        g = V(() =>
          i.value.filter((a) =>
            Object.entries(o).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((F) =>
                      String(a[F] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const l = a[t]
              return Array.isArray(l) ? l.map((u) => String(u)).includes(String(e)) : String(l ?? '') === String(e)
            })
          )
        ),
        {
          tableData: H,
          pagination: M,
          loading: P,
          search: b,
          refresh: h,
          onDelete: I
        } = L({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              l = e + t
            return { list: g.value.slice(e, l), total: g.value.length }
          },
          deleteAPI: async (a) => {
            i.value = i.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', code: '', name: '', type: '原材料仓', manager: '', locationCount: 0, capacity: '', status: 'active' }
      }
      function O() {
        ;(Object.assign(o, { keyword: '', status: '' }), b())
      }
      function T() {
        ;((d.value = 'add'), (n.value = w()), (r.value = !0))
      }
      function q(a) {
        ;((d.value = 'edit'), (n.value = { ...a }), (r.value = !0))
      }
      function B(a, t) {
        if (a === 'edit') {
          q(t)
          return
        }
        a === 'delete' && I(t)
      }
      async function E() {
        const a = String(n.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...n.value, id: a || 'MDM-' + Date.now() }), _.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...n.value } : t))), _.success('已更新静态数据')),
          (r.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        W(
          J,
          {
            'search-model': s(o),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (j(o) ? (o.value = e) : (o = e))),
            title: '仓库主数据',
            'search-columns': x,
            'search-grid-item-props': S,
            columns: A,
            data: s(H),
            pagination: s(M),
            loading: s(P),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(b),
            onReset: O,
            onRefresh: s(h),
            onAdd: T
          },
          {
            status: p(({ row: e }) => [
              y.length ? (m(), W(X, { key: 0, value: e.status, options: y }, null, 8, ['value'])) : (m(), G('span', Z, K(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [C(Q, { actions: D, onAction: (l) => B(l, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              C(
                Y,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: n.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (n.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: R,
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
  oe = z
export { oe as default }

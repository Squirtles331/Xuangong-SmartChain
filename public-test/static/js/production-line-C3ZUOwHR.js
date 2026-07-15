import {
  Bn as p,
  Kn as q,
  On as m,
  Xn as c,
  Yn as F,
  an as k,
  dn as _,
  i as S,
  pn as U,
  rn as V,
  rr as s,
  sn as K,
  sr as G
} from './element-plus-CzL7BOKu.js'
import { t as X } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = U({
    __name: 'index',
    setup($) {
      const f = '新增产线主数据',
        x = '编辑产线主数据',
        A = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '产线编码 / 产线名称 / 车间' } }],
        C = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        I = [
          { prop: 'code', label: '产线编码', minWidth: 130 },
          { prop: 'name', label: '产线名称', minWidth: 160 },
          { prop: 'workshop', label: '所属车间', minWidth: 140 },
          { prop: 'lineType', label: '产线类型', minWidth: 120 },
          { prop: 'capacity', label: '设计产能', minWidth: 120 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        T = [
          { type: 'input', label: '产线编码', field: 'code', required: !0 },
          { type: 'input', label: '产线名称', field: 'name', required: !0 },
          { type: 'input', label: '所属车间', field: 'workshop' },
          { type: 'input', label: '产线类型', field: 'lineType' },
          { type: 'input', label: '设计产能', field: 'capacity' },
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
        y = ['code', 'name', 'workshop'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        N = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = c([
          {
            id: 'LINE-001',
            code: 'LINE-ASM-01',
            name: '供液总成一线',
            workshop: '装配车间',
            lineType: '装配线',
            capacity: '120 套/日',
            status: 'active'
          },
          {
            id: 'LINE-002',
            code: 'LINE-CNC-02',
            name: '壳体机加二线',
            workshop: '机加工二车间',
            lineType: '机加线',
            capacity: '300 件/日',
            status: 'active'
          },
          {
            id: 'LINE-003',
            code: 'LINE-PILOT',
            name: '试制柔性线',
            workshop: '试制车间',
            lineType: '试制线',
            capacity: '20 套/日',
            status: 'disabled'
          }
        ])
      let o = F({ keyword: '' })
      const r = c(!1),
        d = c('add'),
        l = c(w()),
        b = V(() =>
          i.value.filter((a) =>
            Object.entries(o).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (y.length ? y : Object.keys(a)).some((j) =>
                      String(a[j] ?? '')
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
          tableData: E,
          pagination: L,
          loading: D,
          search: g,
          refresh: h,
          onDelete: M
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: b.value.slice(e, n), total: b.value.length }
          },
          deleteAPI: async (a) => {
            i.value = i.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', code: '', name: '', workshop: '', lineType: '装配线', capacity: '', status: 'active' }
      }
      function R() {
        ;(Object.assign(o, { keyword: '' }), g())
      }
      function W() {
        ;((d.value = 'add'), (l.value = w()), (r.value = !0))
      }
      function O(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (r.value = !0))
      }
      function P(a, t) {
        if (a === 'edit') {
          O(t)
          return
        }
        a === 'delete' && M(t)
      }
      async function B() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), S.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), S.success('已更新静态数据')),
          (r.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        k(
          J,
          {
            'search-model': s(o),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (q(o) ? (o.value = e) : (o = e))),
            title: '产线主数据',
            'search-columns': A,
            'search-grid-item-props': C,
            columns: I,
            data: s(E),
            pagination: s(L),
            loading: s(D),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(g),
            onReset: R,
            onRefresh: s(h),
            onAdd: W
          },
          {
            status: p(({ row: e }) => [
              v.length ? (m(), k(Y, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), K('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [_(Q, { actions: N, onAction: (n) => P(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              _(
                H,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : x,
                  columns: T,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: B
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

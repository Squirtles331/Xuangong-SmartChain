import {
  Bn as c,
  Kn as F,
  On as f,
  Xn as p,
  Yn as U,
  an as k,
  dn as C,
  i as _,
  pn as V,
  rn as K,
  rr as s,
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
      const m = '新增工作中心',
        S = '编辑工作中心',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工作中心编码 / 名称 / 车间' } }],
        W = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        A = [
          { prop: 'code', label: '工作中心编码', minWidth: 140 },
          { prop: 'name', label: '工作中心名称', minWidth: 150 },
          { prop: 'workshop', label: '所属车间', minWidth: 140 },
          { prop: 'shift', label: '班次', minWidth: 100, align: 'center' },
          { prop: 'people', label: '人数', minWidth: 80, align: 'center' },
          { prop: 'efficiency', label: '效率(%)', minWidth: 100, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        D = [
          { type: 'input', label: '工作中心编码', field: 'code', required: !0 },
          { type: 'input', label: '工作中心名称', field: 'name', required: !0 },
          { type: 'input', label: '所属车间', field: 'workshop' },
          { type: 'input', label: '班次', field: 'shift' },
          { type: 'input-number', label: '人数', field: 'people', props: { min: 0, precision: 0 } },
          { type: 'input-number', label: '效率', field: 'efficiency', props: { min: 0, max: 100, precision: 0 } },
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
        h = ['code', 'name', 'workshop'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        M = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = p([
          { id: 'WC-001', code: 'WC-ASM-01', name: '主装工位', workshop: '装配车间', shift: '白班', people: 8, efficiency: 92, status: 'active' },
          {
            id: 'WC-002',
            code: 'WC-CNC-02',
            name: '机加二组',
            workshop: '机加工二车间',
            shift: '两班倒',
            people: 12,
            efficiency: 88,
            status: 'active'
          },
          { id: 'WC-003', code: 'WC-TST-01', name: '测试工位', workshop: '测试车间', shift: '白班', people: 4, efficiency: 85, status: 'disabled' }
        ])
      let o = U({ keyword: '' })
      const r = p(!1),
        d = p('add'),
        i = p(w()),
        b = K(() =>
          l.value.filter((a) =>
            Object.entries(o).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (h.length ? h : Object.keys(a)).some((E) =>
                      String(a[E] ?? '')
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
          pagination: T,
          loading: O,
          search: g,
          refresh: y,
          onDelete: P
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: b.value.slice(e, n), total: b.value.length }
          },
          deleteAPI: async (a) => {
            l.value = l.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', code: '', name: '', workshop: '', shift: '白班', people: 0, efficiency: 0, status: 'active' }
      }
      function B() {
        ;(Object.assign(o, { keyword: '' }), g())
      }
      function I() {
        ;((d.value = 'add'), (i.value = w()), (r.value = !0))
      }
      function N(a) {
        ;((d.value = 'edit'), (i.value = { ...a }), (r.value = !0))
      }
      function j(a, t) {
        if (a === 'edit') {
          N(t)
          return
        }
        a === 'delete' && P(t)
      }
      async function q() {
        const a = String(i.value.id || '')
        ;(d.value === 'add'
          ? (l.value.unshift({ ...i.value, id: a || 'MDM-' + Date.now() }), _.success('已新增静态数据'))
          : ((l.value = l.value.map((t) => (String(t.id) === a ? { ...i.value } : t))), _.success('已更新静态数据')),
          (r.value = !1),
          await y())
      }
      return (a, t) => (
        f(),
        k(
          J,
          {
            'search-model': s(o),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(o) ? (o.value = e) : (o = e))),
            title: '工作中心',
            'search-columns': x,
            'search-grid-item-props': W,
            columns: A,
            data: s(R),
            pagination: s(T),
            loading: s(O),
            'add-text': m,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(g),
            onReset: B,
            onRefresh: s(y),
            onAdd: I
          },
          {
            status: c(({ row: e }) => [
              v.length ? (f(), k(Y, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (f(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: c(({ row: e }) => [C(Q, { actions: M, onAction: (n) => j(n, e) }, null, 8, ['onAction'])]),
            dialog: c(() => [
              C(
                H,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: i.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (i.value = e)),
                  title: d.value === 'add' ? m : S,
                  columns: D,
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
  oe = z
export { oe as default }

import {
  Bn as p,
  Kn as F,
  On as m,
  Xn as c,
  Yn as U,
  an as C,
  dn as _,
  i as w,
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
      const f = '新增资源能力',
        x = '编辑资源能力',
        S = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '能力编码 / 资源 / 工艺能力' } }],
        k = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        P = [
          { prop: 'code', label: '能力编码', minWidth: 130 },
          { prop: 'resourceName', label: '资源 / 设备', minWidth: 160 },
          { prop: 'capability', label: '能力项', minWidth: 160 },
          { prop: 'capacity', label: '能力值', minWidth: 120 },
          { prop: 'constraint', label: '约束条件', minWidth: 160 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        N = [
          { type: 'input', label: '能力编码', field: 'code', required: !0 },
          { type: 'input', label: '资源 / 设备', field: 'resourceName', required: !0 },
          { type: 'input', label: '能力项', field: 'capability' },
          { type: 'input', label: '能力值', field: 'capacity' },
          { type: 'input', label: '约束条件', field: 'constraint' },
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
        y = ['code', 'resourceName', 'capability'],
        b = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        M = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        s = c([
          {
            id: 'CAP-001',
            code: 'CAP-CNC-01',
            resourceName: '立式加工中心',
            capability: '最大加工尺寸',
            capacity: '800x500x500',
            constraint: '需白班技师',
            status: 'active'
          },
          {
            id: 'CAP-002',
            code: 'CAP-ASM-02',
            resourceName: '主装配工作台',
            capability: '单班产能',
            capacity: '40 套',
            constraint: '两人协同',
            status: 'active'
          },
          {
            id: 'CAP-003',
            code: 'CAP-TST-01',
            resourceName: '整机试压台',
            capability: '最大试压值',
            capacity: '2.0 MPa',
            constraint: '需质量见证',
            status: 'disabled'
          }
        ])
      let n = U({ keyword: '' })
      const o = c(!1),
        d = c('add'),
        i = c(A()),
        v = K(() =>
          s.value.filter((a) =>
            Object.entries(n).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (y.length ? y : Object.keys(a)).some((E) =>
                      String(a[E] ?? '')
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
          tableData: D,
          pagination: R,
          loading: W,
          search: g,
          refresh: h,
          onDelete: T
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              l = e + t
            return { list: v.value.slice(e, l), total: v.value.length }
          },
          deleteAPI: async (a) => {
            s.value = s.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function A() {
        return { id: '', code: '', resourceName: '', capability: '', capacity: '', constraint: '', status: 'active' }
      }
      function O() {
        ;(Object.assign(n, { keyword: '' }), g())
      }
      function B() {
        ;((d.value = 'add'), (i.value = A()), (o.value = !0))
      }
      function I(a) {
        ;((d.value = 'edit'), (i.value = { ...a }), (o.value = !0))
      }
      function j(a, t) {
        if (a === 'edit') {
          I(t)
          return
        }
        a === 'delete' && T(t)
      }
      async function q() {
        const a = String(i.value.id || '')
        ;(d.value === 'add'
          ? (s.value.unshift({ ...i.value, id: a || 'MDM-' + Date.now() }), w.success('已新增静态数据'))
          : ((s.value = s.value.map((t) => (String(t.id) === a ? { ...i.value } : t))), w.success('已更新静态数据')),
          (o.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        C(
          J,
          {
            'search-model': r(n),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(n) ? (n.value = e) : (n = e))),
            title: '资源能力',
            'search-columns': S,
            'search-grid-item-props': k,
            columns: P,
            data: r(D),
            pagination: r(R),
            loading: r(W),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: r(g),
            onReset: O,
            onRefresh: r(h),
            onAdd: B
          },
          {
            status: p(({ row: e }) => [
              b.length ? (m(), C(Y, { key: 0, value: e.status, options: b }, null, 8, ['value'])) : (m(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [_(Q, { actions: M, onAction: (l) => j(l, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              _(
                H,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: i.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (i.value = e)),
                  title: d.value === 'add' ? f : x,
                  columns: N,
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
  ne = z
export { ne as default }

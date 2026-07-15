import {
  Bn as p,
  Kn as V,
  On as m,
  Xn as c,
  Yn as j,
  an as k,
  dn as S,
  i as _,
  pn as F,
  rn as U,
  rr as n,
  sn as K,
  sr as L
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = F({
    __name: 'index',
    setup($) {
      const f = '新增设备主数据',
        x = '编辑设备主数据',
        A = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '设备编码 / 设备名称 / 所属车间' } }],
        C = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        M = [
          { prop: 'code', label: '设备编码', minWidth: 140 },
          { prop: 'name', label: '设备名称', minWidth: 160 },
          { prop: 'model', label: '设备型号', minWidth: 130 },
          { prop: 'workshop', label: '所属车间', minWidth: 140 },
          { prop: 'ability', label: '能力标签', minWidth: 140 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        E = [
          { type: 'input', label: '设备编码', field: 'code', required: !0 },
          { type: 'input', label: '设备名称', field: 'name', required: !0 },
          { type: 'input', label: '设备型号', field: 'model' },
          { type: 'input', label: '所属车间', field: 'workshop' },
          { type: 'input', label: '能力标签', field: 'ability' },
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
        b = ['code', 'name', 'workshop'],
        v = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        D = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        o = c([
          {
            id: 'EQ-001',
            code: 'EQ-CNC-01',
            name: '立式加工中心',
            model: 'VMC-850',
            workshop: '机加工一车间',
            ability: '机加 / 钻攻',
            status: 'active'
          },
          { id: 'EQ-002', code: 'EQ-ASM-02', name: '主装配工作台', model: 'ASM-200', workshop: '装配车间', ability: '主装 / 预装', status: 'active' },
          { id: 'EQ-003', code: 'EQ-TST-01', name: '整机试压台', model: 'TST-500', workshop: '测试车间', ability: '试压 / 联调', status: 'disabled' }
        ])
      let s = j({ keyword: '' })
      const r = c(!1),
        d = c('add'),
        l = c(w()),
        y = U(() =>
          o.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (b.length ? b : Object.keys(a)).some((N) =>
                      String(a[N] ?? '')
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
          tableData: R,
          pagination: T,
          loading: W,
          search: g,
          refresh: h,
          onDelete: Q
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              i = e + t
            return { list: y.value.slice(e, i), total: y.value.length }
          },
          deleteAPI: async (a) => {
            o.value = o.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', code: '', name: '', model: '', workshop: '', ability: '', status: 'active' }
      }
      function O() {
        ;(Object.assign(s, { keyword: '' }), g())
      }
      function P() {
        ;((d.value = 'add'), (l.value = w()), (r.value = !0))
      }
      function q(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (r.value = !0))
      }
      function B(a, t) {
        if (a === 'edit') {
          q(t)
          return
        }
        a === 'delete' && Q(t)
      }
      async function I() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (o.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), _.success('已新增静态数据'))
          : ((o.value = o.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), _.success('已更新静态数据')),
          (r.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        k(
          H,
          {
            'search-model': n(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (V(s) ? (s.value = e) : (s = e))),
            title: '设备主数据',
            'search-columns': A,
            'search-grid-item-props': C,
            columns: M,
            data: n(R),
            pagination: n(T),
            loading: n(W),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: n(g),
            onReset: O,
            onRefresh: n(h),
            onAdd: P
          },
          {
            status: p(({ row: e }) => [
              v.length ? (m(), k(X, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), K('span', Z, L(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [S(J, { actions: D, onAction: (i) => B(i, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              S(
                Y,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : x,
                  columns: E,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: I
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

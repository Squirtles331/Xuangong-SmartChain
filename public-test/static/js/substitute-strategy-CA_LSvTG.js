import {
  Bn as c,
  Kn as T,
  On as m,
  Xn as p,
  Yn as V,
  an as S,
  dn as _,
  i as w,
  pn as j,
  rn as F,
  rr as o,
  sn as K,
  sr as G
} from './element-plus-CzL7BOKu.js'
import { t as Q } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = j({
    __name: 'index',
    setup($) {
      const f = '新增替代料策略',
        A = '编辑替代料策略',
        k = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '策略编码 / 主料 / 替代料' } }],
        x = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        B = [
          { prop: 'code', label: '策略编码', minWidth: 120 },
          { prop: 'primaryMaterial', label: '主料', minWidth: 150 },
          { prop: 'substituteMaterial', label: '替代料', minWidth: 150 },
          { prop: 'scope', label: '适用范围', minWidth: 120 },
          { prop: 'approvalMode', label: '审批模式', minWidth: 120 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        C = [
          { type: 'input', label: '策略编码', field: 'code', required: !0 },
          { type: 'input', label: '主料', field: 'primaryMaterial', required: !0 },
          { type: 'input', label: '替代料', field: 'substituteMaterial', required: !0 },
          { type: 'input', label: '适用范围', field: 'scope' },
          { type: 'input', label: '审批模式', field: 'approvalMode' },
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
        v = ['code', 'primaryMaterial', 'substituteMaterial'],
        b = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        U = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        r = p([
          {
            id: 'SUB-001',
            code: 'SUB-AL-01',
            primaryMaterial: '6061 铝板 8mm',
            substituteMaterial: '5052 铝板 8mm',
            scope: '临时替代',
            approvalMode: '工艺审批',
            status: 'active'
          },
          {
            id: 'SUB-002',
            code: 'SUB-SEAL-01',
            primaryMaterial: '密封圈 A',
            substituteMaterial: '密封圈 B',
            scope: '常规替代',
            approvalMode: 'QMS + PLM',
            status: 'active'
          },
          {
            id: 'SUB-003',
            code: 'SUB-VAL-01',
            primaryMaterial: '调节阀旧版',
            substituteMaterial: '调节阀新版',
            scope: '版本切换',
            approvalMode: 'ECN 放行',
            status: 'disabled'
          }
        ])
      let s = V({ keyword: '' })
      const n = p(!1),
        d = p('add'),
        i = p(M()),
        y = F(() =>
          r.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((N) =>
                      String(a[N] ?? '')
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
          onDelete: L
        } = Q({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              l = e + t
            return { list: y.value.slice(e, l), total: y.value.length }
          },
          deleteAPI: async (a) => {
            r.value = r.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function M() {
        return { id: '', code: '', primaryMaterial: '', substituteMaterial: '', scope: '', approvalMode: '', status: 'active' }
      }
      function P() {
        ;(Object.assign(s, { keyword: '' }), g())
      }
      function E() {
        ;((d.value = 'add'), (i.value = M()), (n.value = !0))
      }
      function O(a) {
        ;((d.value = 'edit'), (i.value = { ...a }), (n.value = !0))
      }
      function q(a, t) {
        if (a === 'edit') {
          O(t)
          return
        }
        a === 'delete' && L(t)
      }
      async function I() {
        const a = String(i.value.id || '')
        ;(d.value === 'add'
          ? (r.value.unshift({ ...i.value, id: a || 'MDM-' + Date.now() }), w.success('已新增静态数据'))
          : ((r.value = r.value.map((t) => (String(t.id) === a ? { ...i.value } : t))), w.success('已更新静态数据')),
          (n.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        S(
          H,
          {
            'search-model': o(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (T(s) ? (s.value = e) : (s = e))),
            title: '替代料策略',
            'search-columns': k,
            'search-grid-item-props': x,
            columns: B,
            data: o(D),
            pagination: o(R),
            loading: o(W),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: o(g),
            onReset: P,
            onRefresh: o(h),
            onAdd: E
          },
          {
            status: c(({ row: e }) => [
              b.length ? (m(), S(X, { key: 0, value: e.status, options: b }, null, 8, ['value'])) : (m(), K('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: c(({ row: e }) => [_(J, { actions: U, onAction: (l) => q(l, e) }, null, 8, ['onAction'])]),
            dialog: c(() => [
              _(
                Y,
                {
                  visible: n.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (n.value = e)),
                  form: i.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (i.value = e)),
                  title: d.value === 'add' ? f : A,
                  columns: C,
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

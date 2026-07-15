import {
  Bn as p,
  Kn as F,
  On as m,
  Xn as c,
  Yn as U,
  an as w,
  dn as C,
  i as x,
  pn as V,
  rn as K,
  rr as o,
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
      const f = '新增状态字典',
        k = '编辑状态字典',
        D = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码 / 状态值 / 适用对象' } }],
        S = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        A = [
          { prop: 'code', label: '字典编码', minWidth: 130 },
          { prop: 'domain', label: '适用对象', minWidth: 140 },
          { prop: 'value', label: '状态值', minWidth: 120 },
          { prop: 'label', label: '显示文案', minWidth: 140 },
          { prop: 'meaning', label: '状态含义', minWidth: 180 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        T = [
          { type: 'input', label: '字典编码', field: 'code', required: !0 },
          { type: 'input', label: '适用对象', field: 'domain', required: !0 },
          { type: 'input', label: '状态值', field: 'value', required: !0 },
          { type: 'input', label: '显示文案', field: 'label' },
          { type: 'input', label: '状态含义', field: 'meaning' },
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
        v = ['code', 'domain', 'value', 'label'],
        g = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        I = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = c([
          { id: 'DICT-001', code: 'DICT-MAT', domain: '物料', value: 'active', label: '已生效', meaning: '可被下游模块正式引用', status: 'active' },
          {
            id: 'DICT-002',
            code: 'DICT-BOM',
            domain: 'BOM',
            value: 'pending_approval',
            label: '待评审',
            meaning: '等待正式评审与放行',
            status: 'active'
          },
          {
            id: 'DICT-003',
            code: 'DICT-ECN',
            domain: '工程变更',
            value: 'executing',
            label: '执行中',
            meaning: '已进入现场切换执行',
            status: 'active'
          }
        ])
      let s = U({ keyword: '' })
      const r = c(!1),
        d = c('add'),
        l = c(_()),
        b = K(() =>
          i.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((j) =>
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
          tableData: M,
          pagination: R,
          loading: O,
          search: y,
          refresh: h,
          onDelete: W
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
      function _() {
        return { id: '', code: '', domain: '', value: '', label: '', meaning: '', status: 'active' }
      }
      function B() {
        ;(Object.assign(s, { keyword: '' }), y())
      }
      function P() {
        ;((d.value = 'add'), (l.value = _()), (r.value = !0))
      }
      function q(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (r.value = !0))
      }
      function E(a, t) {
        if (a === 'edit') {
          q(t)
          return
        }
        a === 'delete' && W(t)
      }
      async function N() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), x.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), x.success('已更新静态数据')),
          (r.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        w(
          J,
          {
            'search-model': o(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(s) ? (s.value = e) : (s = e))),
            title: '状态字典',
            'search-columns': D,
            'search-grid-item-props': S,
            columns: A,
            data: o(M),
            pagination: o(R),
            loading: o(O),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: o(y),
            onReset: B,
            onRefresh: o(h),
            onAdd: P
          },
          {
            status: p(({ row: e }) => [
              g.length ? (m(), w(Y, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (m(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [C(Q, { actions: I, onAction: (n) => E(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              C(
                H,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: T,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: N
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

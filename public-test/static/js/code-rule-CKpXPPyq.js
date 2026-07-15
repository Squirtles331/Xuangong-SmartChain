import {
  Bn as c,
  Kn as F,
  On as m,
  Xn as p,
  Yn as U,
  an as _,
  dn as w,
  i as O,
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
      const f = '新增编码规则',
        k = '编辑编码规则',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '规则编码 / 规则名称 / 对象类型' } }],
        D = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        R = [
          { prop: 'code', label: '规则编码', minWidth: 130 },
          { prop: 'name', label: '规则名称', minWidth: 150 },
          { prop: 'target', label: '对象类型', minWidth: 120 },
          { prop: 'pattern', label: '编码模式', minWidth: 180 },
          { prop: 'approvalRequired', label: '是否审批', minWidth: 100, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        S = [
          { type: 'input', label: '规则编码', field: 'code', required: !0 },
          { type: 'input', label: '规则名称', field: 'name', required: !0 },
          { type: 'input', label: '对象类型', field: 'target' },
          { type: 'input', label: '编码模式', field: 'pattern' },
          { type: 'input', label: '是否审批', field: 'approvalRequired' },
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
        v = ['code', 'name', 'target'],
        g = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        A = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        n = p([
          {
            id: 'COD-001',
            code: 'COD-MAT',
            name: '物料编码规则',
            target: '物料',
            pattern: 'MAT-{分类}-{流水号}',
            approvalRequired: '否',
            status: 'active'
          },
          {
            id: 'COD-002',
            code: 'COD-BOM',
            name: 'BOM 版本规则',
            target: 'BOM',
            pattern: 'BOM-{产品}-{版本}',
            approvalRequired: '是',
            status: 'active'
          },
          {
            id: 'COD-003',
            code: 'COD-ECN',
            name: '变更单编码规则',
            target: 'ECN',
            pattern: 'ECN-{年月}-{流水号}',
            approvalRequired: '是',
            status: 'active'
          }
        ])
      let i = U({ keyword: '' })
      const o = p(!1),
        d = p('add'),
        l = p(C()),
        b = K(() =>
          n.value.filter((a) =>
            Object.entries(i).every(([t, e]) => {
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
              const r = a[t]
              return Array.isArray(r) ? r.map((u) => String(u)).includes(String(e)) : String(r ?? '') === String(e)
            })
          )
        ),
        {
          tableData: M,
          pagination: q,
          loading: B,
          search: y,
          refresh: h,
          onDelete: W
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              r = e + t
            return { list: b.value.slice(e, r), total: b.value.length }
          },
          deleteAPI: async (a) => {
            n.value = n.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function C() {
        return { id: '', code: '', name: '', target: '', pattern: '', approvalRequired: '否', status: 'active' }
      }
      function E() {
        ;(Object.assign(i, { keyword: '' }), y())
      }
      function N() {
        ;((d.value = 'add'), (l.value = C()), (o.value = !0))
      }
      function T(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (o.value = !0))
      }
      function P(a, t) {
        if (a === 'edit') {
          T(t)
          return
        }
        a === 'delete' && W(t)
      }
      async function I() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (n.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), O.success('已新增静态数据'))
          : ((n.value = n.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), O.success('已更新静态数据')),
          (o.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        _(
          J,
          {
            'search-model': s(i),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(i) ? (i.value = e) : (i = e))),
            title: '编码规则',
            'search-columns': x,
            'search-grid-item-props': D,
            columns: R,
            data: s(M),
            pagination: s(q),
            loading: s(B),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(y),
            onReset: E,
            onRefresh: s(h),
            onAdd: N
          },
          {
            status: c(({ row: e }) => [
              g.length ? (m(), _(Y, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (m(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: c(({ row: e }) => [w(Q, { actions: A, onAction: (r) => P(r, e) }, null, 8, ['onAction'])]),
            dialog: c(() => [
              w(
                H,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: S,
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
  ie = z
export { ie as default }

import {
  Bn as p,
  Kn as F,
  On as m,
  Xn as c,
  Yn as N,
  an as A,
  dn as _,
  i as w,
  pn as V,
  rn as K,
  rr as s,
  sn as L,
  sr as X
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = V({
    __name: 'index',
    setup($) {
      const f = '新增物料分类',
        k = '编辑物料分类',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '分类编码 / 分类名称' } }],
        C = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        P = [
          { prop: 'code', label: '分类编码', minWidth: 130 },
          { prop: 'name', label: '分类名称', minWidth: 150 },
          { prop: 'parent', label: '上级分类', minWidth: 150 },
          { prop: 'batchStrategy', label: '默认批次策略', minWidth: 130 },
          { prop: 'unitPolicy', label: '默认计量单位策略', minWidth: 140 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        M = [
          { type: 'input', label: '分类编码', field: 'code', required: !0 },
          { type: 'input', label: '分类名称', field: 'name', required: !0 },
          { type: 'input', label: '上级分类', field: 'parent' },
          { type: 'input', label: '默认批次策略', field: 'batchStrategy' },
          { type: 'input', label: '单位策略', field: 'unitPolicy' },
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
        y = ['code', 'name', 'parent'],
        g = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        T = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = c([
          {
            id: 'CAT-001',
            code: 'MAT-RM',
            name: '原材料',
            parent: '顶级分类',
            batchStrategy: '来料批次',
            unitPolicy: '主计量单位',
            status: 'active'
          },
          { id: 'CAT-002', code: 'MAT-WIP', name: '半成品', parent: '顶级分类', batchStrategy: '工单批次', unitPolicy: '主辅单位', status: 'active' },
          { id: 'CAT-003', code: 'MAT-AUX', name: '辅料', parent: '原材料', batchStrategy: '按批次继承', unitPolicy: '小数单位', status: 'disabled' }
        ])
      let r = N({ keyword: '' })
      const o = c(!1),
        d = c('add'),
        n = c(S()),
        b = K(() =>
          i.value.filter((a) =>
            Object.entries(r).every(([t, e]) => {
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
          tableData: R,
          pagination: D,
          loading: W,
          search: v,
          refresh: h,
          onDelete: I
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              l = e + t
            return { list: b.value.slice(e, l), total: b.value.length }
          },
          deleteAPI: async (a) => {
            i.value = i.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function S() {
        return { id: '', code: '', name: '', parent: '', batchStrategy: '', unitPolicy: '', status: 'active' }
      }
      function O() {
        ;(Object.assign(r, { keyword: '' }), v())
      }
      function B() {
        ;((d.value = 'add'), (n.value = S()), (o.value = !0))
      }
      function U(a) {
        ;((d.value = 'edit'), (n.value = { ...a }), (o.value = !0))
      }
      function j(a, t) {
        if (a === 'edit') {
          U(t)
          return
        }
        a === 'delete' && I(t)
      }
      async function q() {
        const a = String(n.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...n.value, id: a || 'MDM-' + Date.now() }), w.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...n.value } : t))), w.success('已更新静态数据')),
          (o.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        A(
          J,
          {
            'search-model': s(r),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(r) ? (r.value = e) : (r = e))),
            title: '物料分类',
            'search-columns': x,
            'search-grid-item-props': C,
            columns: P,
            data: s(R),
            pagination: s(D),
            loading: s(W),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(v),
            onReset: O,
            onRefresh: s(h),
            onAdd: B
          },
          {
            status: p(({ row: e }) => [
              g.length ? (m(), A(Y, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (m(), L('span', Z, X(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [_(Q, { actions: T, onAction: (l) => j(l, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              _(
                H,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: n.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (n.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: M,
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
  re = z
export { re as default }

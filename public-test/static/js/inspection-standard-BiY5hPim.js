import {
  Bn as p,
  Kn as q,
  On as f,
  Xn as c,
  Yn as E,
  an as _,
  dn as w,
  i as T,
  pn as N,
  rn as U,
  rr as r,
  sn as K,
  sr as L
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = N({
    __name: 'index',
    setup($) {
      const m = '新增检验标准',
        k = '编辑检验标准',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '标准编码 / 标准名称 / 适用对象' } }],
        C = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        A = [
          { prop: 'code', label: '标准编码', minWidth: 130 },
          { prop: 'name', label: '标准名称', minWidth: 160 },
          { prop: 'target', label: '适用对象', minWidth: 150 },
          { prop: 'inspectionType', label: '检验类型', minWidth: 120 },
          { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        R = [
          { type: 'input', label: '标准编码', field: 'code', required: !0 },
          { type: 'input', label: '标准名称', field: 'name', required: !0 },
          { type: 'input', label: '适用对象', field: 'target' },
          { type: 'input', label: '检验类型', field: 'inspectionType' },
          { type: 'input', label: '版本', field: 'version' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '已生效', value: 'active' },
                { label: '已停用', value: 'disabled' }
              ]
            }
          }
        ],
        v = ['code', 'name', 'target'],
        g = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'active', label: '已生效', type: 'success' },
          { value: 'disabled', label: '已停用', type: 'warning' }
        ],
        D = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = c([
          {
            id: 'QST-001',
            code: 'QST-RCV-01',
            name: '来料尺寸检验标准',
            target: '外购机加件',
            inspectionType: '来料检验',
            version: 'V1.0',
            status: 'active'
          },
          {
            id: 'QST-002',
            code: 'QST-IPQC-01',
            name: '装配过程检验标准',
            target: '总成装配工序',
            inspectionType: '过程检验',
            version: 'V1.2',
            status: 'active'
          },
          {
            id: 'QST-003',
            code: 'QST-FQC-01',
            name: '整机完工检验标准',
            target: '供液控制总成',
            inspectionType: '完工检验',
            version: 'V0.9',
            status: 'draft'
          }
        ])
      let s = E({ keyword: '' })
      const o = c(!1),
        d = c('add'),
        n = c(S()),
        y = U(() =>
          l.value.filter((a) =>
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
              const i = a[t]
              return Array.isArray(i) ? i.map((u) => String(u)).includes(String(e)) : String(i ?? '') === String(e)
            })
          )
        ),
        {
          tableData: Q,
          pagination: V,
          loading: M,
          search: b,
          refresh: h,
          onDelete: W
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              i = e + t
            return { list: y.value.slice(e, i), total: y.value.length }
          },
          deleteAPI: async (a) => {
            l.value = l.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function S() {
        return { id: '', code: '', name: '', target: '', inspectionType: '', version: 'V1.0', status: 'draft' }
      }
      function P() {
        ;(Object.assign(s, { keyword: '' }), b())
      }
      function I() {
        ;((d.value = 'add'), (n.value = S()), (o.value = !0))
      }
      function O(a) {
        ;((d.value = 'edit'), (n.value = { ...a }), (o.value = !0))
      }
      function B(a, t) {
        if (a === 'edit') {
          O(t)
          return
        }
        a === 'delete' && W(t)
      }
      async function F() {
        const a = String(n.value.id || '')
        ;(d.value === 'add'
          ? (l.value.unshift({ ...n.value, id: a || 'MDM-' + Date.now() }), T.success('已新增静态数据'))
          : ((l.value = l.value.map((t) => (String(t.id) === a ? { ...n.value } : t))), T.success('已更新静态数据')),
          (o.value = !1),
          await h())
      }
      return (a, t) => (
        f(),
        _(
          H,
          {
            'search-model': r(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (q(s) ? (s.value = e) : (s = e))),
            title: '检验标准',
            'search-columns': x,
            'search-grid-item-props': C,
            columns: A,
            data: r(Q),
            pagination: r(V),
            loading: r(M),
            'add-text': m,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: r(b),
            onReset: P,
            onRefresh: r(h),
            onAdd: I
          },
          {
            status: p(({ row: e }) => [
              g.length ? (f(), _(X, { key: 0, value: e.status, options: g }, null, 8, ['value'])) : (f(), K('span', Z, L(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [w(J, { actions: D, onAction: (i) => B(i, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              w(
                Y,
                {
                  visible: o.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (o.value = e)),
                  form: n.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (n.value = e)),
                  title: d.value === 'add' ? m : k,
                  columns: R,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: F
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

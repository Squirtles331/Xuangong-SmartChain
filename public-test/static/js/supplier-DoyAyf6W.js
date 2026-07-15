import {
  Bn as p,
  Kn as z,
  On as m,
  Xn as c,
  Yn as E,
  an as w,
  dn as _,
  i as x,
  pn as F,
  rn as N,
  rr as s,
  sn as V,
  sr as K
} from './element-plus-CzL7BOKu.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as X } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as J } from './CrudRowActions-Dmc4i_Io.js'
var Q = { key: 1 },
  Z = F({
    __name: 'index',
    setup($) {
      const f = '新增供应商主数据',
        k = '编辑供应商主数据',
        A = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '供应商编码 / 供应商名称 / 联系人' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '正常', value: 'active' },
                { label: '冻结', value: 'frozen' }
              ]
            }
          }
        ],
        P = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        q = [
          { prop: 'code', label: '供应商编码', minWidth: 150 },
          { prop: 'name', label: '供应商名称', minWidth: 180 },
          { prop: 'contact', label: '联系人', minWidth: 100 },
          { prop: 'phone', label: '联系电话', minWidth: 130 },
          { prop: 'terms', label: '付款条件', minWidth: 120 },
          { prop: 'qualifiedLabel', label: '资质状态', minWidth: 100, align: 'center' },
          { prop: 'score', label: '综合评分', minWidth: 100, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        C = [
          { type: 'input', label: '供应商编码', field: 'code', required: !0 },
          { type: 'input', label: '供应商名称', field: 'name', required: !0 },
          { type: 'input', label: '联系人', field: 'contact' },
          { type: 'input', label: '联系电话', field: 'phone' },
          { type: 'input', label: '付款条件', field: 'terms' },
          { type: 'input', label: '资质状态', field: 'qualifiedLabel' },
          { type: 'input-number', label: '综合评分', field: 'score', props: { min: 0, max: 100, precision: 0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '正常', value: 'active' },
                { label: '冻结', value: 'frozen' }
              ]
            }
          }
        ],
        b = ['code', 'name', 'contact'],
        v = [
          { value: 'active', label: '正常', type: 'success' },
          { value: 'frozen', label: '冻结', type: 'warning' }
        ],
        U = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = c([
          {
            id: 'SUP-001',
            code: 'SUP-001',
            name: '科锐标准件',
            contact: '孙波',
            phone: '13900001234',
            terms: '月结30天',
            qualifiedLabel: '已合格',
            score: 96,
            status: 'active'
          },
          {
            id: 'SUP-002',
            code: 'SUP-002',
            name: '鑫锐热处理',
            contact: '陈立',
            phone: '13900004567',
            terms: '月结45天',
            qualifiedLabel: '已合格',
            score: 88,
            status: 'active'
          },
          {
            id: 'SUP-003',
            code: 'SUP-003',
            name: '华南电气件',
            contact: '何青',
            phone: '13900007890',
            terms: '预付20%',
            qualifiedLabel: '待复审',
            score: 75,
            status: 'frozen'
          }
        ])
      let o = E({ keyword: '', status: '' })
      const r = c(!1),
        d = c('add'),
        l = c(S()),
        g = N(() =>
          i.value.filter((a) =>
            Object.entries(o).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (b.length ? b : Object.keys(a)).some((j) =>
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
          tableData: W,
          pagination: D,
          loading: L,
          search: h,
          refresh: y,
          onDelete: R
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: g.value.slice(e, n), total: g.value.length }
          },
          deleteAPI: async (a) => {
            i.value = i.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function S() {
        return () => ({
          id: '',
          code: '',
          name: '',
          contact: '',
          phone: '',
          terms: '月结30天',
          qualifiedLabel: '已合格',
          score: 90,
          status: 'active'
        })
      }
      function M() {
        ;(Object.assign(o, { keyword: '', status: '' }), h())
      }
      function O() {
        ;((d.value = 'add'), (l.value = S()), (r.value = !0))
      }
      function B(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (r.value = !0))
      }
      function I(a, t) {
        if (a === 'edit') {
          B(t)
          return
        }
        a === 'delete' && R(t)
      }
      async function T() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), x.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), x.success('已更新静态数据')),
          (r.value = !1),
          await y())
      }
      return (a, t) => (
        m(),
        w(
          H,
          {
            'search-model': s(o),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (z(o) ? (o.value = e) : (o = e))),
            title: '供应商主数据',
            'search-columns': A,
            'search-grid-item-props': P,
            columns: q,
            data: s(W),
            pagination: s(D),
            loading: s(L),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(h),
            onReset: M,
            onRefresh: s(y),
            onAdd: O
          },
          {
            status: p(({ row: e }) => [
              v.length ? (m(), w(X, { key: 0, value: e.status, options: v }, null, 8, ['value'])) : (m(), V('span', Q, K(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [_(J, { actions: U, onAction: (n) => I(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              _(
                Y,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : k,
                  columns: C,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: T
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
  oe = Z
export { oe as default }

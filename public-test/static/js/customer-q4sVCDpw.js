import {
  Bn as p,
  Kn as F,
  On as m,
  Xn as u,
  Yn as N,
  an as S,
  dn as w,
  i as C,
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
      const f = '新增客户主数据',
        k = '编辑客户主数据',
        x = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '客户编码 / 客户名称 / 联系人' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '正常', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        A = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        U = [
          { prop: 'code', label: '客户编码', minWidth: 140 },
          { prop: 'name', label: '客户名称', minWidth: 180 },
          { prop: 'contact_person', label: '联系人', minWidth: 120 },
          { prop: 'contact_phone', label: '联系电话', minWidth: 140 },
          { prop: 'payment_terms', label: '付款条件', minWidth: 120 },
          { prop: 'credit_limit_label', label: '信用额度(元)', minWidth: 140, align: 'right' },
          { prop: 'status', label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
        ],
        D = [
          { type: 'input', label: '客户编码', field: 'code', required: !0 },
          { type: 'input', label: '客户名称', field: 'name', required: !0 },
          { type: 'input', label: '联系人', field: 'contact_person' },
          { type: 'input', label: '联系电话', field: 'contact_phone' },
          { type: 'input', label: '付款条件', field: 'payment_terms' },
          { type: 'input', label: '信用额度', field: 'credit_limit_label' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '正常', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        _ = ['code', 'name', 'contact_person'],
        b = [
          { value: 'active', label: '正常', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        R = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = u([
          {
            id: 'CUS-001',
            code: 'CUS-001',
            name: '华东自动化装备',
            contact_person: '张宁',
            contact_phone: '13800001234',
            payment_terms: '月结30天',
            credit_limit: 8e5,
            credit_limit_label: '800,000',
            status: 'active'
          },
          {
            id: 'CUS-002',
            code: 'CUS-002',
            name: '凌云精工',
            contact_person: '刘杰',
            contact_phone: '13800004567',
            payment_terms: '预付30%',
            credit_limit: 5e5,
            credit_limit_label: '500,000',
            status: 'active'
          },
          {
            id: 'CUS-003',
            code: 'CUS-003',
            name: '智造实验线',
            contact_person: '王可',
            contact_phone: '13800007890',
            payment_terms: '货到45天',
            credit_limit: 2e5,
            credit_limit_label: '200,000',
            status: 'disabled'
          }
        ])
      let s = N({ keyword: '', status: '' })
      const r = u(!1),
        d = u('add'),
        l = u(h()),
        v = K(() =>
          i.value.filter((a) =>
            Object.entries(s).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const c = String(e).trim().toLowerCase()
                return c
                  ? (_.length ? _ : Object.keys(a)).some((E) =>
                      String(a[E] ?? '')
                        .toLowerCase()
                        .includes(c)
                    )
                  : !0
              }
              const n = a[t]
              return Array.isArray(n) ? n.map((c) => String(c)).includes(String(e)) : String(n ?? '') === String(e)
            })
          )
        ),
        {
          tableData: W,
          pagination: M,
          loading: O,
          search: y,
          refresh: g,
          onDelete: P
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: v.value.slice(e, n), total: v.value.length }
          },
          deleteAPI: async (a) => {
            i.value = i.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function h() {
        return () => ({
          id: '',
          code: '',
          name: '',
          contact_person: '',
          contact_phone: '',
          payment_terms: '月结30天',
          credit_limit: 0,
          credit_limit_label: '0',
          status: 'active'
        })
      }
      function B() {
        ;(Object.assign(s, { keyword: '', status: '' }), y())
      }
      function I() {
        ;((d.value = 'add'), (l.value = h()), (r.value = !0))
      }
      function T(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (r.value = !0))
      }
      function j(a, t) {
        if (a === 'edit') {
          T(t)
          return
        }
        a === 'delete' && P(t)
      }
      async function q() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (i.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), C.success('已新增静态数据'))
          : ((i.value = i.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), C.success('已更新静态数据')),
          (r.value = !1),
          await g())
      }
      return (a, t) => (
        m(),
        S(
          J,
          {
            'search-model': o(s),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (F(s) ? (s.value = e) : (s = e))),
            title: '客户主数据',
            'search-columns': x,
            'search-grid-item-props': A,
            columns: U,
            data: o(W),
            pagination: o(M),
            loading: o(O),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: o(y),
            onReset: B,
            onRefresh: o(g),
            onAdd: I
          },
          {
            status: p(({ row: e }) => [
              b.length ? (m(), S(Y, { key: 0, value: e.status, options: b }, null, 8, ['value'])) : (m(), L('span', Z, G(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [w(Q, { actions: R, onAction: (n) => j(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              w(
                H,
                {
                  visible: r.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (r.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : k,
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
  se = z
export { se as default }

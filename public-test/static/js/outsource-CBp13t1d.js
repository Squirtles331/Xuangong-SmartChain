import {
  Bn as o,
  Fn as A,
  Kn as H,
  On as D,
  Xn as _,
  Yn as L,
  an as w,
  dn as h,
  i as p,
  in as X,
  it as J,
  on as Q,
  or as Z,
  pn as Y,
  rn as $,
  rr as n,
  sr as S,
  un as x,
  yn as W
} from './element-plus-CzL7BOKu.js'
import { t as ee } from './useTable-Hzr4fBAy.js'
import { t as te } from './CrudFormDialog-1OgQthWb.js'
import { t as ae } from './CrudPage-7Q0FEhS_.js'
import { t as se } from './CrudRowActions-Dmc4i_Io.js'
import { g as R, h as ie, o as re, r as le } from './work-order-Clsu8Szn.js'
var oe = Y({
    __name: 'OutsourceFormDialog',
    props: W({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: W(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: v }) {
      const m = A(c, 'visible'),
        u = A(c, 'form'),
        b = v,
        g = $(() => [
          { type: 'input', label: '工单号', field: 'code', required: !0 },
          { type: 'input', label: '产品', field: 'material', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'input', label: '委外供应商', field: 'supplier', required: !0 },
          { type: 'input', label: '委外工序', field: 'operation', required: !0 },
          { type: 'date-picker', label: '发出日期', field: 'send_date', props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'date-picker', label: '交回日期', field: 'due_date', props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'input-number', label: '加工费(元)', field: 'price', props: { min: 0 } }
        ])
      function y() {
        return u.value.material ? !0 : (p.warning('请填写必填项'), !1)
      }
      return (r, l) => (
        D(),
        w(
          te,
          {
            visible: m.value,
            'onUpdate:visible': l[0] || (l[0] = (i) => (m.value = i)),
            form: u.value,
            'onUpdate:form': l[1] || (l[1] = (i) => (u.value = i)),
            title: c.mode === 'add' ? '新增委外工单' : '编辑委外工单',
            columns: g.value,
            'label-width': 100,
            width: '600px',
            'before-submit': y,
            onSubmit: l[2] || (l[2] = (i) => b('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  ne = oe,
  ue = Y({
    __name: 'index',
    setup(c) {
      const v = [
          { label: '已发出', value: 'sent' },
          { label: '加工中', value: 'processing' },
          { label: '已收回', value: 'received' },
          { label: '已结算', value: 'settled' }
        ],
        m = { sent: '已发出', processing: '加工中', received: '已收回', settled: '已结算' },
        u = { sent: 'warning', processing: 'primary', received: 'success', settled: 'info' },
        b = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工单号、产品、供应商、工序', clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: v, clearable: !0 } }
        ],
        g = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        y = [
          { prop: 'code', label: '工单号', minWidth: 170 },
          { prop: 'material', label: '产品', minWidth: 150 },
          { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
          { prop: 'supplier', label: '委外供应商', minWidth: 160 },
          { prop: 'operation', label: '委外工序', minWidth: 140 },
          { prop: 'send_date', label: '发出日期', minWidth: 100 },
          { label: '交回日期', minWidth: 120, slotName: 'dueDate' },
          { prop: 'price', label: '加工费(元)', minWidth: 110, align: 'right' },
          { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let r = L({ keyword: '', status: '' })
      const l = [{ key: 'export', label: '导出' }],
        i = _(!1),
        d = _('add'),
        s = _(O()),
        {
          tableData: C,
          pagination: F,
          loading: N,
          search: M,
          refresh: f
        } = ee({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) =>
            (await re({ pageNum: e, pageSize: t, keyword: r.keyword || void 0, status: r.status || void 0 })).data
        })
      function O() {
        return { id: '', code: '', material: '', qty: 1, supplier: '', operation: '', send_date: '', due_date: '', price: 0, status: 'sent' }
      }
      function T() {
        ;(Object.assign(r, { keyword: '', status: '' }), M())
      }
      function B(e) {
        e === 'export' && U()
      }
      function U() {
        p.success('导出成功')
      }
      function V() {
        ;((d.value = 'add'), (s.value = O()), (i.value = !0))
      }
      function E(e) {
        ;((d.value = 'edit'), (s.value = { ...e }), (i.value = !0))
      }
      function P(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'send', label: '确认发出', tone: 'secondary', hidden: e.status !== 'sent' },
          { key: 'receive', label: '确认收回', tone: 'success', hidden: e.status !== 'processing' }
        ]
      }
      function z(e, t) {
        if (e === 'edit') {
          E(t)
          return
        }
        if (e === 'send') {
          K(t)
          return
        }
        e === 'receive' && j(t)
      }
      async function I() {
        const e = {
          id: s.value.id,
          code: s.value.code,
          material: s.value.material,
          qty: s.value.qty,
          supplier: s.value.supplier,
          operation: s.value.operation,
          send_date: s.value.send_date,
          due_date: s.value.due_date,
          price: s.value.price,
          status: s.value.status
        }
        ;(d.value === 'add' ? await le(e) : await ie(s.value.id, e),
          (i.value = !1),
          await f(),
          p.success(d.value === 'add' ? '新增成功' : '保存成功'))
      }
      async function K(e) {
        ;(await R(e.id, 'processing'), p.success('已确认发出'), await f())
      }
      async function j(e) {
        ;(await R(e.id, 'received'), p.success('已确认收回'), await f())
      }
      function k(e) {
        if (e.status === 'received' || e.status === 'settled') return !1
        const t = new Date()
        return (t.setHours(0, 0, 0, 0), new Date(e.due_date) < t)
      }
      return (e, t) => {
        const q = J
        return (
          D(),
          w(
            ae,
            {
              'search-model': n(r),
              'onUpdate:searchModel': t[2] || (t[2] = (a) => (H(r) ? (r.value = a) : (r = a))),
              title: '委外工单',
              'search-columns': b,
              'search-grid-item-props': g,
              columns: y,
              data: n(C),
              pagination: n(F),
              loading: n(N),
              'toolbar-actions': l,
              onSearch: n(M),
              onReset: T,
              onRefresh: n(f),
              onAdd: V,
              onToolbarAction: B
            },
            {
              dueDate: o(({ row: a }) => [
                X(
                  'span',
                  { style: Z(k(a) ? 'color: #f56c6c; font-weight: 600' : '') },
                  [
                    x(S(a.due_date) + ' ', 1),
                    k(a)
                      ? (D(),
                        w(
                          q,
                          { key: 0, type: 'danger', size: 'small', style: { 'margin-left': '4px' } },
                          { default: o(() => [...(t[3] || (t[3] = [x('逾期', -1)]))]), _: 1 }
                        ))
                      : Q('', !0)
                  ],
                  4
                )
              ]),
              status: o(({ row: a }) => [h(q, { type: u[a.status] }, { default: o(() => [x(S(m[a.status]), 1)]), _: 2 }, 1032, ['type'])]),
              actions: o(({ row: a }) => [h(se, { actions: P(a), onAction: (G) => z(G, a) }, null, 8, ['actions', 'onAction'])]),
              dialog: o(() => [
                h(
                  ne,
                  {
                    visible: i.value,
                    'onUpdate:visible': t[0] || (t[0] = (a) => (i.value = a)),
                    form: s.value,
                    'onUpdate:form': t[1] || (t[1] = (a) => (s.value = a)),
                    mode: d.value,
                    onSubmit: I
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  be = ue
export { be as default }

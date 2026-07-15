import { Bn as y, Fn as A, On as x, Xn as p, an as S, dn as g, i as M, pn as w, rn as V, rr as u, yn as D } from './element-plus-CzL7BOKu.js'
import { t as z } from './useTable-Hzr4fBAy.js'
import { t as I } from './StatusTag-DWd3m1xj.js'
import { t as K } from './CrudFormDialog-1OgQthWb.js'
import { t as L } from './CrudPage-7Q0FEhS_.js'
import { t as X } from './CrudRowActions-Dmc4i_Io.js'
import { u as $ } from './wms-TgZ5oe41.js'
var j = w({
    __name: 'DeliveryFormDialog',
    props: D({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: D(['submit'], ['update:visible', 'update:form']),
    setup(s, { emit: d }) {
      const o = A(s, 'visible'),
        r = A(s, 'form'),
        c = d,
        f = V(() => [
          { type: 'input', label: '发货单号', field: 'code', required: !0 },
          { type: 'input', label: '销售订单号', field: 'orderCode', required: !0 },
          { type: 'input', label: '客户名称', field: 'customer', required: !0 },
          { type: 'input', label: '产品名称', field: 'material', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } }
        ])
      function v() {
        return !r.value.code || !r.value.orderCode || !r.value.material ? (M.warning('请填写必填项'), !1) : !0
      }
      return (_, l) => (
        x(),
        S(
          K,
          {
            visible: o.value,
            'onUpdate:visible': l[0] || (l[0] = (i) => (o.value = i)),
            form: r.value,
            'onUpdate:form': l[1] || (l[1] = (i) => (r.value = i)),
            title: s.mode === 'add' ? '新增发货单' : '编辑发货单',
            columns: f.value,
            'label-width': 100,
            width: '600px',
            'before-submit': v,
            onSubmit: l[2] || (l[2] = (i) => c('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  G = j,
  H = w({
    __name: 'index',
    setup(s) {
      const d = [
          { value: 'pending', label: '待发货', type: 'warning' },
          { value: 'completed', label: '已发货', type: 'success' }
        ],
        o = p({ code: '', status: '' }),
        r = [
          { type: 'input', label: '发货单号', field: 'code', props: { clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: d.map((e) => ({ label: e.label, value: e.value })), clearable: !0 } }
        ],
        c = [
          { prop: 'code', label: '发货单号', width: 160 },
          { prop: 'orderCode', label: '销售订单号', width: 160 },
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { prop: 'material', label: '产品名称', minWidth: 160 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'createdAt', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        f = [{ key: 'export', label: '导出' }],
        v = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        {
          tableData: _,
          pagination: l,
          loading: i,
          search: h,
          refresh: q,
          onDelete: R
        } = z({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) => {
            const t = await $({ pageNum: e, pageSize: a, code: o.value.code || void 0, status: o.value.status || void 0 })
            return { list: t.data.list.map(F), total: t.data.total }
          }
        }),
        n = p(!1),
        b = p('add'),
        m = p(C())
      function F(e) {
        return {
          id: String(e.id),
          code: e.code || '',
          orderCode: e.order_code || '',
          customer: e.customer || '',
          material: e.material || '',
          qty: Number(e.qty ?? 0),
          status: e.status || '',
          createdAt: e.created_at || ''
        }
      }
      function W() {
        ;((o.value = { code: '', status: '' }), h())
      }
      function k(e) {
        e === 'export' && N()
      }
      function N() {
        M.success('导出成功')
      }
      function C() {
        return { id: '', code: '', orderCode: '', customer: '', material: '', qty: 1, status: 'pending' }
      }
      function U() {
        ;((b.value = 'add'), (m.value = C()), (n.value = !0))
      }
      function B(e) {
        ;((b.value = 'edit'),
          (m.value = { id: e.id, code: e.code, orderCode: e.orderCode, customer: e.customer, material: e.material, qty: e.qty, status: e.status }),
          (n.value = !0))
      }
      function T(e, a) {
        if (e === 'edit') {
          B(a)
          return
        }
        e === 'delete' && P(a)
      }
      async function E() {
        ;((n.value = !1), await q())
      }
      function P(e) {
        R(e)
      }
      return (e, a) => (
        x(),
        S(
          L,
          {
            'search-model': o.value,
            'onUpdate:searchModel': a[2] || (a[2] = (t) => (o.value = t)),
            title: '发货单列表',
            'search-columns': r,
            columns: c,
            data: u(_),
            pagination: u(l),
            loading: u(i),
            'toolbar-actions': f,
            onSearch: u(h),
            onReset: W,
            onRefresh: u(q),
            onAdd: U,
            onToolbarAction: k
          },
          {
            status: y(({ row: t }) => [g(I, { value: t.status, options: d }, null, 8, ['value'])]),
            actions: y(({ row: t }) => [g(X, { actions: v, onAction: (O) => T(O, t) }, null, 8, ['onAction'])]),
            dialog: y(() => [
              g(
                G,
                {
                  visible: n.value,
                  'onUpdate:visible': a[0] || (a[0] = (t) => (n.value = t)),
                  form: m.value,
                  'onUpdate:form': a[1] || (a[1] = (t) => (m.value = t)),
                  mode: b.value,
                  onSubmit: E
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
  }),
  oe = H
export { oe as default }

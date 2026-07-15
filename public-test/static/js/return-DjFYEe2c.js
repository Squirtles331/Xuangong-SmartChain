import {
  Bn as i,
  Fn as R,
  Kn as k,
  On as D,
  Xn as q,
  Yn as z,
  an as A,
  dn as c,
  i as y,
  it as T,
  pn as S,
  rn as V,
  rr as u,
  sr as x,
  un as w,
  yn as E
} from './element-plus-CzL7BOKu.js'
import { t as I } from './useTable-Hzr4fBAy.js'
import { t as K } from './CrudFormDialog-1OgQthWb.js'
import { t as O } from './CrudPage-7Q0FEhS_.js'
import { t as j } from './CrudRowActions-Dmc4i_Io.js'
import { h as G, i as L, x as X } from './wms-TgZ5oe41.js'
var Y = S({
    __name: 'ReturnFormDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} },
    emits: E(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: a }) {
      const p = R(f, 'visible'),
        o = R(f, 'form'),
        b = a,
        v = V(() => [
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '生产退料', value: 'return' },
                { label: '采购退货', value: 'refund' }
              ]
            }
          },
          { type: 'input', label: '来源单号', field: 'source', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'input', label: '原因', field: 'reason' }
        ])
      function g() {
        return !o.value.source || !o.value.material ? (y.warning('请填写来源单号和物料名称'), !1) : !0
      }
      return (_, n) => (
        D(),
        A(
          K,
          {
            visible: p.value,
            'onUpdate:visible': n[0] || (n[0] = (l) => (p.value = l)),
            form: o.value,
            'onUpdate:form': n[1] || (n[1] = (l) => (o.value = l)),
            title: '新建退料/退货单',
            columns: v.value,
            'label-width': 100,
            width: '500px',
            'before-submit': g,
            onSubmit: n[2] || (n[2] = (l) => b('submit'))
          },
          null,
          8,
          ['visible', 'form', 'columns']
        )
      )
    }
  }),
  H = Y,
  J = S({
    __name: 'index',
    setup(f) {
      let a = z({ code: '', reason: '', status: '' })
      const p = [
          { type: 'input', label: '单号', field: 'code', props: { clearable: !0 } },
          { type: 'input', label: '原因', field: 'reason', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              clearable: !0,
              options: [
                { label: '待处理', value: 'pending' },
                { label: '已完成', value: 'completed' }
              ]
            }
          }
        ],
        o = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        b = [
          { prop: 'code', label: '单号', width: 160 },
          { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'source', label: '来源单号', width: 170 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { prop: 'reason', label: '原因', width: 140 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 90, slotName: 'actions', align: 'center' }
        ],
        {
          tableData: v,
          pagination: g,
          loading: _,
          search: n,
          refresh: l
        } = I({
          rowKey: 'id',
          listAPI: async ({ page: e, size: r }) => {
            const d = await G({ pageNum: e, pageSize: r, code: a.code || void 0, reason: a.reason || void 0, status: a.status || void 0 })
            return { list: d.data.list.map(C), total: d.data.total }
          }
        }),
        m = q(!1),
        s = q(h())
      function C(e) {
        return {
          id: String(e.id),
          code: e.code || '',
          type: e.type || '',
          source: e.source || '',
          material: e.material || '',
          qty: Number(e.qty ?? 0),
          reason: e.reason || '',
          status: e.status || ''
        }
      }
      function M() {
        ;(Object.assign(a, { code: '', reason: '', status: '' }), n())
      }
      function h() {
        return { type: 'return', source: '', material: '', qty: 1, reason: '多余退料' }
      }
      function N() {
        ;((s.value = h()), (m.value = !0))
      }
      function F(e) {
        return [{ key: 'confirm', label: '确认', tone: 'primary', hidden: e.status !== 'pending' }]
      }
      function U(e, r) {
        e === 'confirm' && B(r)
      }
      async function W() {
        ;(await L({
          type: s.value.type,
          source: s.value.source,
          material: s.value.material,
          qty: s.value.qty,
          reason: s.value.reason,
          status: 'pending'
        }),
          (m.value = !1),
          y.success('退料退货单已创建'),
          await l())
      }
      async function B(e) {
        ;(await X(e.id, { status: 'completed' }), (e.status = 'completed'), y.success(e.type === 'return' ? '生产退料处理成功' : '采购退货处理成功'))
      }
      return (e, r) => {
        const d = T
        return (
          D(),
          A(
            O,
            {
              'search-model': u(a),
              'onUpdate:searchModel': r[2] || (r[2] = (t) => (k(a) ? (a.value = t) : (a = t))),
              title: '退料退货单列表',
              'search-columns': p,
              'search-grid-item-props': o,
              columns: b,
              data: u(v),
              pagination: u(g),
              loading: u(_),
              'add-text': '新建退料退货单',
              onSearch: u(n),
              onReset: M,
              onRefresh: u(l),
              onAdd: N
            },
            {
              type: i(({ row: t }) => [
                c(
                  d,
                  { type: t.type === 'return' ? 'danger' : 'warning', size: 'small' },
                  { default: i(() => [w(x(t.type === 'return' ? '生产退料' : '采购退货'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              status: i(({ row: t }) => [
                c(
                  d,
                  { type: t.status === 'pending' ? 'warning' : 'success', size: 'small' },
                  { default: i(() => [w(x(t.status === 'pending' ? '待处理' : '已完成'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: i(({ row: t }) => [c(j, { actions: F(t), onAction: (P) => U(P, t) }, null, 8, ['actions', 'onAction'])]),
              dialog: i(() => [
                c(
                  H,
                  {
                    visible: m.value,
                    'onUpdate:visible': r[0] || (r[0] = (t) => (m.value = t)),
                    form: s.value,
                    'onUpdate:form': r[1] || (r[1] = (t) => (s.value = t)),
                    onSubmit: W
                  },
                  null,
                  8,
                  ['visible', 'form']
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
  re = J
export { re as default }

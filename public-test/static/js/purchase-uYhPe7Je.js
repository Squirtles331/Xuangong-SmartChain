import {
  Bn as a,
  F as ie,
  Fn as E,
  Kn as re,
  Mn as h,
  O as se,
  On as q,
  U as ne,
  W as oe,
  Xn as _,
  Yn as ue,
  an as k,
  bn as de,
  dn as r,
  ft as pe,
  ht as me,
  i as O,
  in as T,
  ir as ce,
  it as ve,
  mt as fe,
  on as U,
  ot as be,
  pn as A,
  rr as g,
  sr as V,
  un as v,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { I as ye } from './index-DqMfCNbk.js'
import { t as ge } from './useTable-Hzr4fBAy.js'
import { t as _e } from './TableSetting-BqN9x3yX.js'
import { t as qe } from './SearchSetting-RejIVc8W.js'
import { t as ke } from './StatusTag-DWd3m1xj.js'
import { c as he, f as Ve, i as xe, v as Y } from './scm-Dui-Cf46.js'
var Ce = A({
    __name: 'PurchaseFormDialog',
    props: R({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(o, { emit: x }) {
      const c = E(o, 'visible'),
        s = E(o, 'form'),
        P = x,
        u = [
          { type: 'input', label: '订单编号', field: 'code', required: !0 },
          { type: 'input', label: '供应商', field: 'supplier', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input-number', label: '采购数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'input-number', label: '已收货数量', field: 'received', props: { min: 0 } },
          { type: 'date-picker', label: '交付日期', field: 'delivery', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '已下发', value: 'sent' },
                { label: '部分收货', value: 'partial' },
                { label: '已收货', value: 'received' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ]
      function C() {
        c.value = !1
      }
      async function f() {
        return !s.value.code || !s.value.supplier || !s.value.material ? (O.warning('请填写订单编号、供应商和物料名称'), !1) : (P('submit'), !1)
      }
      return (d, t) => {
        const m = h('gi-form'),
          b = h('gi-dialog')
        return (
          q(),
          k(
            b,
            {
              modelValue: c.value,
              'onUpdate:modelValue': t[1] || (t[1] = (n) => (c.value = n)),
              title: o.mode === 'add' ? '新增采购订单' : '编辑采购订单',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': f,
              'on-cancel': C,
              width: '640px'
            },
            {
              default: a(() => [
                r(m, { modelValue: s.value, 'onUpdate:modelValue': t[0] || (t[0] = (n) => (s.value = n)), columns: u, 'label-width': 110 }, null, 8, [
                  'modelValue'
                ])
              ]),
              _: 1
            },
            8,
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  De = Ce,
  Oe = A({
    __name: 'PurchaseReceiveDialog',
    props: R({ currentOrder: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(o, { emit: x }) {
      const c = E(o, 'visible'),
        s = E(o, 'form'),
        P = x
      function u() {
        c.value = !1
      }
      async function C() {
        return !s.value.qty || s.value.qty <= 0 ? (O.warning('请填写有效的收货数量'), !1) : (P('submit'), !1)
      }
      return (f, d) => {
        const t = oe,
          m = ne,
          b = ie,
          n = me,
          I = pe,
          W = fe,
          z = h('gi-dialog')
        return (
          q(),
          k(
            z,
            {
              modelValue: c.value,
              'onUpdate:modelValue': d[2] || (d[2] = (y) => (c.value = y)),
              title: '采购收货',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': C,
              'on-cancel': u,
              width: '520px'
            },
            {
              default: a(() => [
                r(
                  m,
                  { column: 1, border: '' },
                  {
                    default: a(() => [
                      r(t, { label: '采购订单' }, { default: a(() => [v(V(o.currentOrder?.code || '-'), 1)]), _: 1 }),
                      r(t, { label: '供应商' }, { default: a(() => [v(V(o.currentOrder?.supplier || '-'), 1)]), _: 1 }),
                      r(t, { label: '物料名称' }, { default: a(() => [v(V(o.currentOrder?.material || '-'), 1)]), _: 1 }),
                      r(t, { label: '待收货数量' }, { default: a(() => [v(V(o.currentOrder?.remain ?? 0), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                ),
                r(
                  W,
                  { 'label-width': '100px', style: { 'margin-top': '16px' } },
                  {
                    default: a(() => [
                      r(
                        n,
                        { label: '本次收货' },
                        {
                          default: a(() => [
                            r(
                              b,
                              {
                                modelValue: s.value.qty,
                                'onUpdate:modelValue': d[0] || (d[0] = (y) => (s.value.qty = y)),
                                min: 1,
                                max: o.currentOrder?.remain || 1
                              },
                              null,
                              8,
                              ['modelValue', 'max']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      r(
                        n,
                        { label: '批次号' },
                        {
                          default: a(() => [
                            r(
                              I,
                              {
                                modelValue: s.value.lot,
                                'onUpdate:modelValue': d[1] || (d[1] = (y) => (s.value.lot = y)),
                                placeholder: '按需填写批次号'
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            },
            8,
            ['modelValue']
          )
        )
      }
    }
  }),
  Pe = Oe,
  Me = { class: 'progress-cell' },
  Se = { class: 'progress-text' },
  Fe = A({
    __name: 'index',
    setup(o) {
      const x = [
          { value: 'sent', label: '已下发', type: 'warning' },
          { value: 'partial', label: '部分收货', type: 'primary' },
          { value: 'received', label: '已收货', type: 'success' },
          { value: 'closed', label: '已关闭', type: 'info' }
        ],
        c = [
          { type: 'input', label: '订单编号', field: 'code', props: { clearable: !0 } },
          { type: 'input', label: '供应商', field: 'supplier', props: { clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { clearable: !0, options: x.map((e) => ({ label: e.label, value: e.value })) } }
        ],
        s = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        P = [
          { prop: 'code', label: '订单编号', minWidth: 160 },
          { prop: 'supplier', label: '供应商', minWidth: 160 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '采购数量', minWidth: 100, align: 'center' },
          { label: '收货进度', minWidth: 180, slotName: 'progress' },
          { label: '交期', minWidth: 140, slotName: 'delivery' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let u = ue({ code: '', supplier: '', status: '' })
      const C = _([...c]),
        f = _(!1),
        d = _('add'),
        t = _($()),
        m = _(null),
        b = _(!1),
        n = _({ qty: 1, lot: '' }),
        {
          tableData: I,
          pagination: W,
          loading: z,
          search: y,
          refresh: M,
          onDelete: j
        } = ge({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) =>
            (await Ve({ pageNum: e, pageSize: l, code: u.code || void 0, supplier: u.supplier || void 0, status: u.status || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((l) => he(l)))
        })
      function $() {
        return { id: '', code: '', supplier: '', material: '', qty: 1, received: 0, delivery: '', status: 'sent' }
      }
      function G(e) {
        C.value = e
      }
      function L() {
        ;(Object.assign(u, { code: '', supplier: '', status: '' }), y())
      }
      function X() {
        ;((d.value = 'add'), (t.value = $()), (f.value = !0))
      }
      function H(e) {
        ;((d.value = 'edit'),
          (t.value = {
            id: e.id,
            code: e.code,
            supplier: e.supplier,
            material: e.material,
            qty: e.qty,
            received: e.received,
            delivery: e.delivery,
            status: e.status
          }),
          (f.value = !0))
      }
      async function J() {
        if (!t.value.code || !t.value.supplier || !t.value.material) {
          O.warning('请填写订单编号、供应商和物料名称')
          return
        }
        const e = Number(t.value.received || 0),
          l = Number(t.value.qty || 0),
          D = Math.max(l - e, 0),
          S = t.value.status === 'closed' ? 'closed' : D === 0 ? 'received' : e > 0 ? 'partial' : 'sent',
          F = {
            code: t.value.code,
            supplier: t.value.supplier,
            material: t.value.material,
            qty: l,
            received: e,
            remain: D,
            delivery: t.value.delivery,
            status: S
          }
        ;(d.value === 'add' ? await xe(F) : await Y(t.value.id, F), (f.value = !1), await M())
      }
      function Q(e) {
        ;((m.value = e), (n.value = { qty: e.remain || 1, lot: '' }), (b.value = !0))
      }
      async function Z() {
        if (!m.value) return
        if (n.value.qty <= 0 || n.value.qty > m.value.remain) {
          O.warning('收货数量不合法')
          return
        }
        const e = m.value.received + n.value.qty,
          l = m.value.qty - e,
          D = l === 0 ? 'received' : 'partial'
        ;(await Y(m.value.id, { received: e, remain: l, status: D }), (b.value = !1), O.success('收货完成'), await M())
      }
      async function w(e) {
        ;(await Y(e.id, { status: 'closed' }), O.success('采购订单已关闭'), await M())
      }
      function K(e) {
        return e.status === 'received' || e.status === 'closed' ? !1 : new Date(e.delivery).getTime() < Date.now()
      }
      return (e, l) => {
        const D = h('gi-form'),
          S = h('gi-button'),
          F = se,
          ee = ve,
          N = be,
          le = h('gi-table'),
          te = h('gi-page-layout')
        return (
          q(),
          k(te, null, {
            header: a(() => [
              r(
                qe,
                { columns: c, 'onUpdate:visibleFields': G },
                {
                  default: a(() => [
                    r(
                      D,
                      {
                        modelValue: g(u),
                        'onUpdate:modelValue': l[0] || (l[0] = (p) => (re(u) ? (u.value = p) : (u = p))),
                        columns: C.value,
                        'grid-item-props': s,
                        search: '',
                        onSearch: g(y),
                        onReset: L
                      },
                      null,
                      8,
                      ['modelValue', 'columns', 'onSearch']
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            tool: a(() => [
              r(S, { type: 'add', onClick: X }, { default: a(() => [...(l[5] || (l[5] = [v('新增采购订单', -1)]))]), _: 1 }),
              r(S, { type: 'reset', style: { 'margin-left': '8px' }, onClick: g(M) }, null, 8, ['onClick'])
            ]),
            default: a(() => [
              r(
                _e,
                { title: '采购订单列表', columns: P, onRefresh: g(M) },
                {
                  default: a(({ settingColumns: p, tableProps: ae }) => [
                    r(
                      le,
                      de({ columns: p, data: g(I), pagination: g(W), loading: g(z) }, ae, { border: '', stripe: '', style: { height: '100%' } }),
                      {
                        progress: a(({ row: i }) => [
                          T('div', Me, [
                            r(
                              F,
                              {
                                percentage: i.qty > 0 ? Math.round((i.received / i.qty) * 100) : 0,
                                'stroke-width': 6,
                                color: i.received >= i.qty ? '#67c23a' : '#409eff'
                              },
                              null,
                              8,
                              ['percentage', 'color']
                            ),
                            T('span', Se, V(i.received) + '/' + V(i.qty), 1)
                          ])
                        ]),
                        delivery: a(({ row: i }) => [
                          T('span', { class: ce({ overdue: K(i) }) }, V(i.delivery), 3),
                          K(i)
                            ? (q(),
                              k(
                                ee,
                                { key: 0, type: 'danger', size: 'small', class: 'delivery-tag' },
                                { default: a(() => [...(l[6] || (l[6] = [v('已逾期', -1)]))]), _: 1 }
                              ))
                            : U('', !0)
                        ]),
                        status: a(({ row: i }) => [r(ke, { value: i.status, options: x }, null, 8, ['value'])]),
                        actions: a(({ row: i }) => [
                          r(
                            N,
                            { type: 'primary', link: '', size: 'small', onClick: (B) => H(i) },
                            { default: a(() => [...(l[7] || (l[7] = [v('编辑', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          i.status !== 'received' && i.status !== 'closed'
                            ? (q(),
                              k(
                                N,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (B) => Q(i) },
                                { default: a(() => [...(l[8] || (l[8] = [v(' 收货 ', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : U('', !0),
                          i.status === 'sent' || i.status === 'partial'
                            ? (q(),
                              k(
                                N,
                                { key: 1, type: 'warning', link: '', size: 'small', onClick: (B) => w(i) },
                                { default: a(() => [...(l[9] || (l[9] = [v(' 关闭 ', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : U('', !0),
                          i.status === 'closed'
                            ? (q(),
                              k(
                                N,
                                { key: 2, type: 'danger', link: '', size: 'small', onClick: (B) => g(j)(i) },
                                { default: a(() => [...(l[10] || (l[10] = [v('删除', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : U('', !0)
                        ]),
                        _: 1
                      },
                      16,
                      ['columns', 'data', 'pagination', 'loading']
                    )
                  ]),
                  _: 1
                },
                8,
                ['onRefresh']
              ),
              r(
                De,
                {
                  visible: f.value,
                  'onUpdate:visible': l[1] || (l[1] = (p) => (f.value = p)),
                  form: t.value,
                  'onUpdate:form': l[2] || (l[2] = (p) => (t.value = p)),
                  mode: d.value,
                  onSubmit: J
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              r(
                Pe,
                {
                  visible: b.value,
                  'onUpdate:visible': l[3] || (l[3] = (p) => (b.value = p)),
                  form: n.value,
                  'onUpdate:form': l[4] || (l[4] = (p) => (n.value = p)),
                  'current-order': m.value,
                  onSubmit: Z
                },
                null,
                8,
                ['visible', 'form', 'current-order']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  Be = ye(Fe, [['__scopeId', 'data-v-07ff9dd9']])
export { Be as default }

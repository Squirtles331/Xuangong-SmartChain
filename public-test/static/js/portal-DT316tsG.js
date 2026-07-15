import {
  An as q,
  Bn as t,
  Mn as v,
  On as o,
  Tn as B,
  Xn as h,
  Yn as O,
  _ as $,
  an as d,
  dn as a,
  i as g,
  it as M,
  m as j,
  on as W,
  ot as S,
  p as A,
  pn as F,
  sn as k,
  sr as p,
  tn as L,
  tt as U,
  un as s,
  v as X
} from './element-plus-CzL7BOKu.js'
import { I as Y } from './index-DqMfCNbk.js'
import { g as G, h as H, n as J, t as K } from './scm-Dui-Cf46.js'
var Q = { key: 1, class: 'muted-text' },
  R = F({
    __name: 'index',
    setup(Z) {
      const y = h('orders'),
        r = h(!1),
        n = O({ orders: [], deliveries: [], timelineItems: [], recData: [] }),
        C = [
          { prop: 'code', label: '订单编号', minWidth: 170 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
          { prop: 'delivery_date', label: '交付日期', minWidth: 120 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 140, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        x = [
          { prop: 'code', label: '发货单号', minWidth: 170 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
          { prop: 'carrier', label: '物流公司', minWidth: 120 },
          { prop: 'tracking_no', label: '运单号', minWidth: 160 },
          { label: '确认状态', minWidth: 100, slotName: 'confirmed', align: 'center' },
          { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        D = [
          { prop: 'period', label: '对账周期', minWidth: 120 },
          { prop: 'order_code', label: '订单编号', minWidth: 170 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'order_qty', label: '订单数量', minWidth: 90, align: 'center' },
          { prop: 'delivered_qty', label: '已发货', minWidth: 90, align: 'center' },
          { prop: 'accepted_qty', label: '已验收', minWidth: 90, align: 'center' },
          { prop: 'amount', label: '金额', minWidth: 100, align: 'right' },
          { label: '状态', minWidth: 90, slotName: 'rec_status', align: 'center' }
        ]
      async function c() {
        r.value = !0
        try {
          const l = (await H()).data
          ;((n.orders = l.orders || []),
            (n.deliveries = l.deliveries || []),
            (n.timelineItems = l.timelineItems || []),
            (n.recData = l.recData || []))
        } finally {
          r.value = !1
        }
      }
      async function z(l) {
        ;(await J(l), g.success('订单已确认'), await c())
      }
      async function E(l) {
        ;(await G(l), g.success('订单已驳回'), await c())
      }
      async function N(l) {
        ;(await K(l), g.success('发货确认成功'), await c())
      }
      return (
        B(() => {
          c()
        }),
        (l, i) => {
          const u = M,
            _ = S,
            f = v('gi-table'),
            m = $,
            T = j,
            I = A,
            w = U,
            P = X,
            V = v('gi-page-layout')
          return (
            o(),
            d(V, null, {
              default: t(() => [
                a(
                  P,
                  { modelValue: y.value, 'onUpdate:modelValue': i[0] || (i[0] = (e) => (y.value = e)) },
                  {
                    default: t(() => [
                      a(
                        m,
                        { label: '供应商订单确认', name: 'orders' },
                        {
                          default: t(() => [
                            a(
                              f,
                              { columns: C, data: n.orders, border: '', stripe: '', size: 'small', loading: r.value },
                              {
                                status: t(({ row: e }) => [
                                  a(
                                    u,
                                    { type: e.status === 'confirmed' ? 'success' : e.status === 'pending' ? 'warning' : 'danger', size: 'small' },
                                    {
                                      default: t(() => [s(p(e.status === 'confirmed' ? '已确认' : e.status === 'pending' ? '待确认' : '已驳回'), 1)]),
                                      _: 2
                                    },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                actions: t(({ row: e }) => [
                                  e.status === 'pending'
                                    ? (o(),
                                      d(
                                        _,
                                        { key: 0, type: 'primary', link: '', size: 'small', onClick: (b) => z(e.id) },
                                        { default: t(() => [...(i[1] || (i[1] = [s('确认', -1)]))]), _: 1 },
                                        8,
                                        ['onClick']
                                      ))
                                    : W('', !0),
                                  e.status === 'pending'
                                    ? (o(),
                                      d(
                                        _,
                                        { key: 1, type: 'danger', link: '', size: 'small', onClick: (b) => E(e.id) },
                                        { default: t(() => [...(i[2] || (i[2] = [s('驳回', -1)]))]), _: 1 },
                                        8,
                                        ['onClick']
                                      ))
                                    : W('', !0)
                                ]),
                                _: 1
                              },
                              8,
                              ['data', 'loading']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        m,
                        { label: '发货通知', name: 'deliveries' },
                        {
                          default: t(() => [
                            a(
                              f,
                              { columns: x, data: n.deliveries, border: '', stripe: '', size: 'small', loading: r.value },
                              {
                                confirmed: t(({ row: e }) => [
                                  a(
                                    u,
                                    { type: e.confirmed ? 'success' : 'warning', size: 'small' },
                                    { default: t(() => [s(p(e.confirmed ? '已确认' : '待确认'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                actions: t(({ row: e }) => [
                                  e.confirmed
                                    ? (o(), k('span', Q, '无需处理'))
                                    : (o(),
                                      d(
                                        _,
                                        { key: 0, type: 'primary', link: '', size: 'small', onClick: (b) => N(e.id) },
                                        { default: t(() => [...(i[3] || (i[3] = [s('确认发货', -1)]))]), _: 1 },
                                        8,
                                        ['onClick']
                                      ))
                                ]),
                                _: 1
                              },
                              8,
                              ['data', 'loading']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        m,
                        { label: '订单状态时间线', name: 'timeline' },
                        {
                          default: t(() => [
                            a(
                              w,
                              { header: '订单状态跟踪', shadow: 'never' },
                              {
                                default: t(() => [
                                  a(I, null, {
                                    default: t(() => [
                                      (o(!0),
                                      k(
                                        L,
                                        null,
                                        q(
                                          n.timelineItems,
                                          (e) => (
                                            o(),
                                            d(
                                              T,
                                              {
                                                key: `${e.timestamp}-${e.content}`,
                                                timestamp: e.timestamp,
                                                color: e.color,
                                                type: e.type,
                                                hollow: e.hollow
                                              },
                                              { default: t(() => [s(p(e.content), 1)]), _: 2 },
                                              1032,
                                              ['timestamp', 'color', 'type', 'hollow']
                                            )
                                          )
                                        ),
                                        128
                                      ))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        m,
                        { label: '对账明细', name: 'reconciliation' },
                        {
                          default: t(() => [
                            a(
                              f,
                              { columns: D, data: n.recData, border: '', stripe: '', size: 'small', loading: r.value },
                              {
                                rec_status: t(({ row: e }) => [
                                  a(
                                    u,
                                    { type: e.rec_status === 'confirmed' ? 'success' : 'warning', size: 'small' },
                                    { default: t(() => [s(p(e.rec_status === 'confirmed' ? '已对账' : '待对账'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['data', 'loading']
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
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  le = Y(R, [['__scopeId', 'data-v-72e60756']])
export { le as default }

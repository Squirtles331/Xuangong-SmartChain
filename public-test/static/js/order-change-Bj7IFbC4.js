import {
  Bn as t,
  F,
  G as $,
  Mn as R,
  On as _,
  Tn as z,
  U as G,
  W as P,
  Xn as y,
  Yn as W,
  an as p,
  b as X,
  dn as e,
  ft as Y,
  ht as j,
  i as x,
  in as v,
  mt as A,
  nt as H,
  on as b,
  ot as J,
  pn as K,
  rn as L,
  rr as Q,
  rt as Z,
  sr as s,
  tt as ee,
  un as d,
  y as te
} from './element-plus-CzL7BOKu.js'
import { i as ae, r as le } from './vue-chunks-CWn_TkJU.js'
import { d as ne, y as oe } from './crm-Ddpp8fRZ.js'
var re = { style: { color: '#f56c6c', 'text-decoration': 'line-through' } },
  se = { style: { color: '#67c23a', 'font-weight': '600' } },
  de = K({
    __name: 'index',
    setup(ue) {
      const h = le(),
        w = ae(),
        E = { approved: '已审批', in_production: '生产中', pending_delivery: '待发货', completed: '已完成' },
        n = y(null),
        q = y(!1),
        g = y([]),
        a = W({ type: 'qty', new_qty: 1, new_date: '', reason: '' }),
        k = L(() => (n.value ? E[n.value.status] : '-'))
      z(async () => {
        const r = String(h.query.id || '')
        if (!r) return
        const l = await ne(r)
        l.data && ((n.value = l.data), (a.new_qty = l.data.qty), (a.new_date = l.data.delivery_date))
      })
      function C() {
        if (!n.value) return
        const r = []
        ;(a.type !== 'date' && r.push({ field: '数量', old: `${n.value.qty} 件`, new: `${a.new_qty} 件` }),
          a.type !== 'qty' && r.push({ field: '交期', old: n.value.delivery_date, new: a.new_date }),
          (g.value = r),
          (q.value = !0))
      }
      async function D() {
        if (!n.value) return
        if (!a.reason) {
          x.warning('请填写变更原因')
          return
        }
        const r = {}
        ;(a.type !== 'date' && (r.qty = a.new_qty),
          a.type !== 'qty' && (r.delivery_date = a.new_date),
          await oe(n.value.id, r),
          x.success('订单变更已提交'),
          w.push('/customer-business/crm/order'))
      }
      return (r, l) => {
        const u = P,
          S = G,
          m = X,
          T = te,
          V = ee,
          c = H,
          B = Z,
          i = j,
          I = F,
          N = $,
          U = Y,
          f = J,
          M = A,
          O = R('gi-page-layout')
        return (
          _(),
          p(O, null, {
            header: t(() => [v('h3', null, '销售订单变更 - ' + s(n.value?.code || '--'), 1)]),
            default: t(() => [
              e(
                S,
                { column: 2, border: '', style: { 'margin-bottom': '16px' } },
                {
                  default: t(() => [
                    e(u, { label: '订单编号' }, { default: t(() => [d(s(n.value?.code || '-'), 1)]), _: 1 }),
                    e(u, { label: '客户名称' }, { default: t(() => [d(s(n.value?.customer_name || '-'), 1)]), _: 1 }),
                    e(u, { label: '产品名称' }, { default: t(() => [d(s(n.value?.material_name || '-'), 1)]), _: 1 }),
                    e(u, { label: '原数量' }, { default: t(() => [d(s(n.value?.qty || 0) + ' 件', 1)]), _: 1 }),
                    e(u, { label: '原交期' }, { default: t(() => [d(s(n.value?.delivery_date || '-'), 1)]), _: 1 }),
                    e(u, { label: '当前状态' }, { default: t(() => [d(s(k.value), 1)]), _: 1 })
                  ]),
                  _: 1
                }
              ),
              q.value
                ? (_(),
                  p(
                    V,
                    { key: 0, header: '变更对比', shadow: 'never', style: { 'margin-bottom': '16px' } },
                    {
                      default: t(() => [
                        e(
                          T,
                          { data: g.value, border: '', stripe: '', size: 'small' },
                          {
                            default: t(() => [
                              e(m, { prop: 'field', label: '字段', width: '120' }),
                              e(m, { label: '变更前', width: '180' }, { default: t(({ row: o }) => [v('span', re, s(o.old), 1)]), _: 1 }),
                              e(m, { label: '变更后', width: '180' }, { default: t(({ row: o }) => [v('span', se, s(o.new), 1)]), _: 1 })
                            ]),
                            _: 1
                          },
                          8,
                          ['data']
                        )
                      ]),
                      _: 1
                    }
                  ))
                : b('', !0),
              e(
                V,
                { header: '变更信息', shadow: 'never' },
                {
                  default: t(() => [
                    e(
                      M,
                      { model: a, 'label-width': '120px', style: { 'max-width': '520px' } },
                      {
                        default: t(() => [
                          e(
                            i,
                            { label: '变更类型', required: '' },
                            {
                              default: t(() => [
                                e(
                                  B,
                                  { modelValue: a.type, 'onUpdate:modelValue': l[0] || (l[0] = (o) => (a.type = o)), style: { width: '100%' } },
                                  {
                                    default: t(() => [
                                      e(c, { label: '数量调整', value: 'qty' }),
                                      e(c, { label: '交期调整', value: 'date' }),
                                      e(c, { label: '数量和交期调整', value: 'both' })
                                    ]),
                                    _: 1
                                  },
                                  8,
                                  ['modelValue']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          a.type !== 'date'
                            ? (_(),
                              p(
                                i,
                                { key: 0, label: '新数量', required: '' },
                                {
                                  default: t(() => [
                                    e(
                                      I,
                                      {
                                        modelValue: a.new_qty,
                                        'onUpdate:modelValue': l[1] || (l[1] = (o) => (a.new_qty = o)),
                                        min: 1,
                                        style: { width: '100%' }
                                      },
                                      null,
                                      8,
                                      ['modelValue']
                                    )
                                  ]),
                                  _: 1
                                }
                              ))
                            : b('', !0),
                          a.type !== 'qty'
                            ? (_(),
                              p(
                                i,
                                { key: 1, label: '新交期', required: '' },
                                {
                                  default: t(() => [
                                    e(
                                      N,
                                      {
                                        modelValue: a.new_date,
                                        'onUpdate:modelValue': l[2] || (l[2] = (o) => (a.new_date = o)),
                                        style: { width: '100%' }
                                      },
                                      null,
                                      8,
                                      ['modelValue']
                                    )
                                  ]),
                                  _: 1
                                }
                              ))
                            : b('', !0),
                          e(
                            i,
                            { label: '变更原因', required: '' },
                            {
                              default: t(() => [
                                e(
                                  U,
                                  { modelValue: a.reason, 'onUpdate:modelValue': l[3] || (l[3] = (o) => (a.reason = o)), type: 'textarea', rows: 3 },
                                  null,
                                  8,
                                  ['modelValue']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          e(i, null, {
                            default: t(() => [
                              e(f, { type: 'primary', onClick: C }, { default: t(() => [...(l[5] || (l[5] = [d('预览变更', -1)]))]), _: 1 }),
                              e(f, { type: 'success', onClick: D }, { default: t(() => [...(l[6] || (l[6] = [d('提交变更', -1)]))]), _: 1 }),
                              e(
                                f,
                                { onClick: l[4] || (l[4] = (o) => Q(w).back()) },
                                { default: t(() => [...(l[7] || (l[7] = [d('取消', -1)]))]), _: 1 }
                              )
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      },
                      8,
                      ['model']
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  me = de
export { me as default }

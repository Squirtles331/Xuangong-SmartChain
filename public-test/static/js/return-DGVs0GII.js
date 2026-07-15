import {
  Bn as l,
  Fn as w,
  Kn as X,
  Mn as f,
  On as C,
  Xn as h,
  Yn as Y,
  an as x,
  bn as H,
  dn as o,
  i as S,
  it as J,
  on as W,
  ot as Q,
  pn as U,
  rr as u,
  sr as Z,
  un as k,
  yn as F
} from './element-plus-CzL7BOKu.js'
import { I as ee } from './index-DqMfCNbk.js'
import { t as te } from './useTable-Hzr4fBAy.js'
import { t as ae } from './TableSetting-BqN9x3yX.js'
import { t as le } from './SearchSetting-RejIVc8W.js'
import { b as N, m as oe, o as ne, u as ie } from './scm-Dui-Cf46.js'
var se = U({
    __name: 'ReturnFormDialog',
    props: F({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: F(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: _ }) {
      const v = w(g, 'visible'),
        r = w(g, 'form'),
        n = _,
        b = [
          { type: 'input', label: '退货单号', field: 'code', required: !0 },
          { type: 'input', label: '采购订单', field: 'po_code', required: !0 },
          { type: 'input', label: '供应商', field: 'supplier', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input-number', label: '退货数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'input', label: '退货原因', field: 'reason', required: !0 },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待退货', value: 'pending' },
                { label: '已退货', value: 'done' }
              ]
            }
          }
        ]
      function d() {
        v.value = !1
      }
      async function p() {
        return !r.value.code || !r.value.po_code || !r.value.material ? (S.warning('请填写必填项'), !1) : (n('submit'), !1)
      }
      return (e, m) => {
        const q = f('gi-form'),
          R = f('gi-dialog')
        return (
          C(),
          x(
            R,
            {
              modelValue: v.value,
              'onUpdate:modelValue': m[1] || (m[1] = (c) => (v.value = c)),
              title: g.mode === 'add' ? '新增退货单' : '编辑退货单',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': p,
              'on-cancel': d,
              width: '620px'
            },
            {
              default: l(() => [
                o(q, { modelValue: r.value, 'onUpdate:modelValue': m[0] || (m[0] = (c) => (r.value = c)), columns: b, 'label-width': 100 }, null, 8, [
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
  ue = se,
  re = U({
    __name: 'index',
    setup(g) {
      const _ = [
          { type: 'input', label: '退货单号', field: 'code', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              clearable: !0,
              options: [
                { label: '待退货', value: 'pending' },
                { label: '已退货', value: 'done' }
              ]
            }
          }
        ],
        v = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        r = [
          { prop: 'code', label: '退货单号', minWidth: 160 },
          { prop: 'po_code', label: '采购订单', minWidth: 160 },
          { prop: 'supplier', label: '供应商', minWidth: 150 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
          { prop: 'reason', label: '退货原因', minWidth: 130 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = Y({ code: '', status: '' })
      const b = h([..._]),
        d = h(!1),
        p = h('add'),
        e = h(P()),
        {
          tableData: m,
          pagination: q,
          loading: R,
          search: c,
          refresh: y,
          onDelete: z
        } = te({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => (await oe({ pageNum: a, pageSize: t, code: n.code || void 0, status: n.status || void 0 })).data,
          deleteAPI: (a) => Promise.all(a.map((t) => ie(t)))
        })
      function P() {
        return { id: '', code: '', po_code: '', supplier: '', material: '', qty: 1, reason: '', status: 'pending' }
      }
      function B(a) {
        b.value = a
      }
      function I() {
        ;(Object.assign(n, { code: '', status: '' }), c())
      }
      function E() {
        ;((p.value = 'add'), (e.value = P()), (d.value = !0))
      }
      function T(a) {
        ;((p.value = 'edit'), (e.value = { ...a }), (d.value = !0))
      }
      async function A() {
        if (!e.value.code || !e.value.po_code || !e.value.material) {
          S.warning('请填写退货单号、采购订单和物料名称')
          return
        }
        const a = {
          code: e.value.code,
          po_code: e.value.po_code,
          supplier: e.value.supplier,
          material: e.value.material,
          qty: Number(e.value.qty || 0),
          reason: e.value.reason,
          status: e.value.status
        }
        ;(p.value === 'add' ? await ne(a) : await N(e.value.id, a), (d.value = !1), await y())
      }
      async function K(a) {
        ;(await N(a.id, { status: 'done' }), S.success('采购退货已完成'), await y())
      }
      return (a, t) => {
        const O = f('gi-form'),
          D = f('gi-button'),
          $ = J,
          V = Q,
          j = f('gi-table'),
          G = f('gi-page-layout')
        return (
          C(),
          x(G, null, {
            header: l(() => [
              o(
                le,
                { columns: _, 'onUpdate:visibleFields': B },
                {
                  default: l(() => [
                    o(
                      O,
                      {
                        modelValue: u(n),
                        'onUpdate:modelValue': t[0] || (t[0] = (i) => (X(n) ? (n.value = i) : (n = i))),
                        columns: b.value,
                        'grid-item-props': v,
                        search: '',
                        onSearch: u(c),
                        onReset: I
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
            tool: l(() => [
              o(D, { type: 'add', onClick: E }),
              o(D, { type: 'reset', style: { 'margin-left': '8px' }, onClick: u(y) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              o(
                ae,
                { title: '采购退货单', columns: r, onRefresh: u(y) },
                {
                  default: l(({ settingColumns: i, tableProps: L }) => [
                    o(
                      j,
                      H({ columns: i, data: u(m), pagination: u(q), loading: u(R) }, L, { border: '', stripe: '', style: { height: '100%' } }),
                      {
                        status: l(({ row: s }) => [
                          o(
                            $,
                            { type: s.status === 'pending' ? 'warning' : 'success', size: 'small' },
                            { default: l(() => [k(Z(s.status === 'pending' ? '待退货' : '已退货'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: l(({ row: s }) => [
                          o(
                            V,
                            { type: 'primary', link: '', size: 'small', onClick: (M) => T(s) },
                            { default: l(() => [...(t[3] || (t[3] = [k('编辑', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          s.status === 'pending'
                            ? (C(),
                              x(
                                V,
                                { key: 0, type: 'success', link: '', size: 'small', onClick: (M) => K(s) },
                                { default: l(() => [...(t[4] || (t[4] = [k('确认退货', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : W('', !0),
                          s.status === 'pending'
                            ? (C(),
                              x(
                                V,
                                { key: 1, type: 'danger', link: '', size: 'small', onClick: (M) => u(z)(s) },
                                { default: l(() => [...(t[5] || (t[5] = [k('删除', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : W('', !0)
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
              o(
                ue,
                {
                  visible: d.value,
                  'onUpdate:visible': t[1] || (t[1] = (i) => (d.value = i)),
                  form: e.value,
                  'onUpdate:form': t[2] || (t[2] = (i) => (e.value = i)),
                  mode: p.value,
                  onSubmit: A
                },
                null,
                8,
                ['visible', 'form', 'mode']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  ge = ee(re, [['__scopeId', 'data-v-d0b705e1']])
export { ge as default }

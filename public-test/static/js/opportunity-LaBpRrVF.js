import {
  Bn as a,
  Fn as O,
  Kn as H,
  Mn as d,
  O as J,
  On as W,
  Xn as y,
  Yn as Q,
  an as F,
  bn as Z,
  dn as e,
  i as q,
  it as ee,
  ot as te,
  pn as P,
  rr as u,
  sr as D,
  un as x,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as le } from './index-DqMfCNbk.js'
import { t as ae } from './useTable-Hzr4fBAy.js'
import { t as oe } from './TableSetting-BqN9x3yX.js'
import { t as ne } from './SearchSetting-RejIVc8W.js'
import { c as ie, g as se, i as re, t as ue } from './crm-Ddpp8fRZ.js'
var pe = P({
    __name: 'OpportunityFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: h }) {
      const m = O(f, 'visible'),
        c = O(f, 'form'),
        k = h,
        w = [
          { type: 'input', label: '客户名称', field: 'customer', required: !0 },
          { type: 'input', label: '商机描述', field: 'product', required: !0 },
          { type: 'input-number', label: '预计金额', field: 'amount', props: { min: 0, step: 1e4 } },
          {
            type: 'select-v2',
            label: '阶段',
            field: 'stage',
            props: {
              options: [
                { label: '初步接触', value: 'initial' },
                { label: '方案制定', value: 'solution' },
                { label: '报价中', value: 'quotation' },
                { label: '已成交', value: 'won' }
              ]
            }
          },
          { type: 'input-number', label: '赢单率(%)', field: 'probability', props: { min: 0, max: 100 } },
          { type: 'input', label: '负责人', field: 'owner' },
          { type: 'date-picker', label: '预计成交日期', field: 'close_date' }
        ]
      function i() {
        m.value = !1
      }
      async function b() {
        return (k('submit'), !1)
      }
      return (p, s) => {
        const o = d('gi-form'),
          C = d('gi-dialog')
        return (
          W(),
          F(
            C,
            {
              modelValue: m.value,
              'onUpdate:modelValue': s[1] || (s[1] = (g) => (m.value = g)),
              title: f.mode === 'add' ? '新增商机' : '编辑商机',
              footer: !0,
              'lock-scroll': !1,
              width: '600px',
              'on-before-ok': b,
              'on-cancel': i
            },
            {
              default: a(() => [
                e(o, { modelValue: c.value, 'onUpdate:modelValue': s[0] || (s[0] = (g) => (c.value = g)), columns: w, 'label-width': 100 }, null, 8, [
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
  de = pe,
  me = P({
    __name: 'index',
    setup(f) {
      const h = { initial: '初步接触', solution: '方案制定', quotation: '报价中', won: '已成交' },
        m = { initial: 'info', solution: 'warning', quotation: 'primary', won: 'success' },
        c = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '阶段',
            field: 'stage',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '初步接触', value: 'initial' },
                { label: '方案制定', value: 'solution' },
                { label: '报价中', value: 'quotation' },
                { label: '已成交', value: 'won' }
              ]
            }
          }
        ],
        k = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        w = [
          { prop: 'customer', label: '客户名称', minWidth: 160 },
          { prop: 'product', label: '商机描述', minWidth: 220 },
          { label: '预计金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
          { label: '阶段', minWidth: 120, align: 'center', slotName: 'stage' },
          { label: '赢单率', minWidth: 160, slotName: 'probability' },
          { prop: 'owner', label: '负责人', minWidth: 120 },
          { prop: 'close_date', label: '预计成交日期', minWidth: 140 },
          { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let i = Q({ keyword: '', stage: '' })
      const b = y([...c]),
        p = y(!1),
        s = y('add'),
        o = y(V()),
        {
          tableData: C,
          pagination: g,
          loading: T,
          search: S,
          refresh: v,
          onDelete: U
        } = ae({
          rowKey: 'id',
          listAPI: async ({ page: n, size: t }) =>
            (await ie({ pageNum: n, pageSize: t, keyword: i.keyword || void 0, stage: i.stage || void 0 })).data,
          deleteAPI: (n) => Promise.all(n.map((t) => re(t)))
        })
      function V() {
        return { id: '', customer: '', product: '', amount: 0, stage: 'initial', probability: 20, owner: '', close_date: '' }
      }
      function B(n) {
        b.value = n
      }
      function E() {
        ;(Object.assign(i, { keyword: '', stage: '' }), S())
      }
      function I() {
        ;((s.value = 'add'), (o.value = V()), (p.value = !0))
      }
      function R(n) {
        ;((s.value = 'edit'), (o.value = { ...n }), (p.value = !0))
      }
      async function z() {
        if (!o.value.customer || !o.value.product) {
          q.warning('请填写客户名称和商机描述')
          return
        }
        ;(await se({ ...o.value, stage: o.value.stage }), (p.value = !1), await v())
      }
      async function A(n) {
        ;(await ue(n.id), q.success('商机已转为销售订单'), await v())
      }
      return (n, t) => {
        const K = d('gi-form'),
          _ = d('gi-button'),
          L = ee,
          $ = J,
          j = te,
          G = d('gi-table'),
          X = d('gi-page-layout')
        return (
          W(),
          F(X, null, {
            header: a(() => [
              e(
                ne,
                { columns: c, 'onUpdate:visibleFields': B },
                {
                  default: a(() => [
                    e(
                      K,
                      {
                        modelValue: u(i),
                        'onUpdate:modelValue': t[0] || (t[0] = (r) => (H(i) ? (i.value = r) : (i = r))),
                        columns: b.value,
                        'grid-item-props': k,
                        search: '',
                        onSearch: u(S),
                        onReset: E
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
              e(_, { type: 'add', onClick: I }),
              e(_, { type: 'reset', style: { 'margin-left': '8px' }, onClick: u(v) }, null, 8, ['onClick'])
            ]),
            default: a(() => [
              e(
                oe,
                { title: '商机列表', columns: w, onRefresh: u(v) },
                {
                  default: a(({ settingColumns: r, tableProps: Y }) => [
                    e(
                      G,
                      Z({ columns: r, data: u(C), pagination: u(g), loading: u(T) }, Y, { border: '', style: { height: '100%' } }),
                      {
                        amount: a(({ row: l }) => [x(D(l.amount.toLocaleString('zh-CN')), 1)]),
                        stage: a(({ row: l }) => [e(L, { type: m[l.stage] }, { default: a(() => [x(D(h[l.stage]), 1)]), _: 2 }, 1032, ['type'])]),
                        probability: a(({ row: l }) => [
                          e(
                            $,
                            {
                              percentage: l.probability,
                              'stroke-width': 8,
                              color: l.probability >= 70 ? '#67c23a' : l.probability >= 40 ? '#e6a23c' : '#909399'
                            },
                            null,
                            8,
                            ['percentage', 'color']
                          )
                        ]),
                        actions: a(({ row: l }) => [
                          e(_, { type: 'edit', onClick: (M) => R(l) }, null, 8, ['onClick']),
                          e(_, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (M) => u(U)(l) }, null, 8, ['onClick']),
                          e(
                            j,
                            { type: 'success', link: '', size: 'small', onClick: (M) => A(l) },
                            { default: a(() => [...(t[3] || (t[3] = [x('转订单', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          )
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
              e(
                de,
                {
                  visible: p.value,
                  'onUpdate:visible': t[1] || (t[1] = (r) => (p.value = r)),
                  form: o.value,
                  'onUpdate:form': t[2] || (t[2] = (r) => (o.value = r)),
                  mode: s.value,
                  onSubmit: z
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
  ye = le(me, [['__scopeId', 'data-v-7c024172']])
export { ye as default }

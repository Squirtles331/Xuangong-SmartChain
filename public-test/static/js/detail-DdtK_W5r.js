import {
  Bn as l,
  Fn as N,
  Kn as G,
  Mn as c,
  On as E,
  Rn as M,
  Xn as b,
  Yn as X,
  an as F,
  bn as Y,
  dn as o,
  i as $,
  it as H,
  pn as q,
  rr as p,
  sr as _,
  un as h,
  yn as W
} from './element-plus-CzL7BOKu.js'
import { I as J } from './index-DqMfCNbk.js'
import { t as Q } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { t as ee } from './SearchSetting-RejIVc8W.js'
import { a as te, r as ae, t as le } from './energy-Bt4VzB_9.js'
var ie = q({
    __name: 'EnergyDetailFormDialog',
    props: W({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: W(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: k }) {
      const m = N(f, 'visible'),
        a = N(f, 'form'),
        w = k,
        n = [
          { type: 'input', label: '期间', field: 'period', required: !0, props: { placeholder: '例如 2026-01' } },
          {
            type: 'select-v2',
            label: '能源类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '电', value: 'electricity' },
                { label: '水', value: 'water' },
                { label: '气', value: 'gas' }
              ]
            }
          },
          { type: 'input', label: '车间', field: 'workshop', required: !0 },
          { type: 'input-number', label: '用量', field: 'usage', required: !0, props: { min: 0 } },
          { type: 'input', label: '单位', field: 'unit' },
          { type: 'input-number', label: '单价', field: 'rate', props: { min: 0, precision: 2, step: 0.1 } },
          { type: 'input-number', label: '成本', field: 'cost', props: { disabled: !0, precision: 2 } }
        ]
      ;(M(
        () => [a.value.usage, a.value.rate],
        () => {
          a.value.cost = Number((a.value.usage * a.value.rate).toFixed(2))
        }
      ),
        M(
          () => a.value.type,
          (s) => {
            ;(s === 'electricity' && (a.value.unit = 'kWh'), s === 'water' && (a.value.unit = '吨'), s === 'gas' && (a.value.unit = 'm3'))
          },
          { immediate: !0 }
        ))
      function v() {
        m.value = !1
      }
      async function d() {
        return (w('submit'), !1)
      }
      return (s, e) => {
        const x = c('gi-form'),
          C = c('gi-dialog')
        return (
          E(),
          F(
            C,
            {
              modelValue: m.value,
              'onUpdate:modelValue': e[1] || (e[1] = (g) => (m.value = g)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': d,
              'on-cancel': v,
              title: f.mode === 'add' ? '新增明细' : '编辑明细',
              width: '600px'
            },
            {
              default: l(() => [
                o(x, { modelValue: a.value, 'onUpdate:modelValue': e[0] || (e[0] = (g) => (a.value = g)), columns: n, 'label-width': 100 }, null, 8, [
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
  oe = ie,
  ne = q({
    __name: 'index',
    setup(f) {
      const k = { 电: 'warning', 水: 'primary', 气: 'success' },
        m = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '能源类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '电', value: 'electricity' },
                { label: '水', value: 'water' },
                { label: '气', value: 'gas' }
              ]
            }
          },
          { type: 'input', label: '期间', field: 'period', props: { placeholder: '例如 2026-01' } }
        ],
        a = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        w = [
          { prop: 'period', label: '期间', minWidth: 110 },
          { label: '能源类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'workshop', label: '车间', minWidth: 160 },
          { label: '用量', minWidth: 120, slotName: 'usage', align: 'right' },
          { prop: 'unit', label: '单位', minWidth: 90, align: 'center' },
          { label: '单价', minWidth: 100, slotName: 'rate', align: 'right' },
          { label: '成本', minWidth: 120, slotName: 'cost', align: 'right' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = X({ keyword: '', type: '', period: '' })
      const v = b([...m]),
        d = b(!1),
        s = b('add'),
        e = b(V()),
        {
          tableData: x,
          pagination: C,
          loading: g,
          search: S,
          refresh: D,
          onDelete: P
        } = Q({
          rowKey: 'id',
          listAPI: async ({ page: t, size: r }) =>
            (await ae({ pageNum: t, pageSize: r, keyword: n.keyword || void 0, type: n.type || void 0, period: n.period || void 0 })).data,
          deleteAPI: (t) => Promise.all(t.map((r) => le(r)))
        })
      function V() {
        return { id: '', period: '', type: 'electricity', workshop: '', usage: 0, unit: 'kWh', rate: 0.9, cost: 0 }
      }
      function R(t) {
        v.value = t
      }
      function T() {
        ;(Object.assign(n, { keyword: '', type: '', period: '' }), S())
      }
      function U() {
        ;((s.value = 'add'), (e.value = V()), (d.value = !0))
      }
      function I(t) {
        ;((s.value = 'edit'),
          (e.value = {
            id: t.id,
            period: t.period,
            type: t.type === '电' ? 'electricity' : t.type === '水' ? 'water' : 'gas',
            workshop: t.workshop,
            usage: t.usage,
            unit: t.unit,
            rate: t.rate,
            cost: t.cost
          }),
          (d.value = !0))
      }
      async function B() {
        if (!e.value.period || !e.value.workshop) {
          $.warning('请填写期间和车间')
          return
        }
        ;(await te({
          id: e.value.id,
          period: e.value.period,
          workshop: e.value.workshop,
          type: { electricity: '电', water: '水', gas: '气' }[e.value.type],
          usage: e.value.usage,
          unit: e.value.unit,
          rate: e.value.rate,
          cost: e.value.cost
        }),
          (d.value = !1),
          await D())
      }
      return (t, r) => {
        const z = c('gi-form'),
          y = c('gi-button'),
          A = H,
          L = c('gi-table'),
          K = c('gi-page-layout')
        return (
          E(),
          F(K, null, {
            header: l(() => [
              o(
                ee,
                { columns: m, 'onUpdate:visibleFields': R },
                {
                  default: l(() => [
                    o(
                      z,
                      {
                        modelValue: p(n),
                        'onUpdate:modelValue': r[0] || (r[0] = (u) => (G(n) ? (n.value = u) : (n = u))),
                        columns: v.value,
                        'grid-item-props': a,
                        search: '',
                        onSearch: p(S),
                        onReset: T
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
              o(y, { type: 'add', onClick: U }),
              o(y, { type: 'reset', style: { 'margin-left': '8px' }, onClick: p(D) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              o(
                Z,
                { title: '能耗明细', columns: w, onRefresh: p(D) },
                {
                  default: l(({ settingColumns: u, tableProps: O }) => [
                    o(
                      L,
                      Y({ columns: u, data: p(x), pagination: p(C), loading: p(g) }, O, { border: '', style: { height: '100%' } }),
                      {
                        type: l(({ row: i }) => [o(A, { type: k[i.type] }, { default: l(() => [h(_(i.type), 1)]), _: 2 }, 1032, ['type'])]),
                        usage: l(({ row: i }) => [h(_(i.usage.toLocaleString('zh-CN')), 1)]),
                        cost: l(({ row: i }) => [h(_(i.cost.toLocaleString('zh-CN')), 1)]),
                        rate: l(({ row: i }) => [h(_(i.rate), 1)]),
                        actions: l(({ row: i }) => [
                          o(y, { type: 'edit', onClick: (j) => I(i) }, null, 8, ['onClick']),
                          o(y, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (j) => p(P)(i) }, null, 8, ['onClick'])
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
                oe,
                {
                  visible: d.value,
                  'onUpdate:visible': r[1] || (r[1] = (u) => (d.value = u)),
                  form: e.value,
                  'onUpdate:form': r[2] || (r[2] = (u) => (e.value = u)),
                  mode: s.value,
                  onSubmit: B
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
  ce = J(ne, [['__scopeId', 'data-v-76426a4f']])
export { ce as default }

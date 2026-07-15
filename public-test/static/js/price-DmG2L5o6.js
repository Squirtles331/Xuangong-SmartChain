import {
  Bn as r,
  Cn as oe,
  Fn as F,
  J as ne,
  Kn as ue,
  Mn as c,
  On as E,
  Rn as se,
  Tn as pe,
  Xn as d,
  Yn as de,
  an as U,
  bn as ce,
  dn as t,
  i as B,
  in as me,
  pn as N,
  q as ve,
  rn as fe,
  rr as w,
  tt as _e,
  yn as Y
} from './element-plus-CzL7BOKu.js'
import { I as be } from './index-DqMfCNbk.js'
import { t as ge } from './echarts-BZg-173N.js'
import { t as he } from './useTable-Hzr4fBAy.js'
import { t as ye } from './TableSetting-BqN9x3yX.js'
import { t as we } from './SearchSetting-RejIVc8W.js'
import { _ as xe, d as z, r as Ce, s as q } from './scm-Dui-Cf46.js'
var Me = N({
    __name: 'PriceFormDialog',
    props: Y({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: Y(['submit'], ['update:visible', 'update:form']),
    setup(b, { emit: g }) {
      const m = F(b, 'visible'),
        s = F(b, 'form'),
        x = g,
        i = [
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '供应商', field: 'supplier', required: !0 },
          { type: 'input-number', label: '单价', field: 'price', required: !0, props: { min: 0, precision: 2 } },
          { type: 'input', label: '币种', field: 'currency' },
          { type: 'date-picker', label: '生效日期', field: 'valid_from', props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'date-picker', label: '失效日期', field: 'valid_to', props: { valueFormat: 'YYYY-MM-DD' } },
          {
            type: 'select-v2',
            label: '来源',
            field: 'source',
            props: {
              options: [
                { label: '报价单', value: '报价单' },
                { label: '比价结果', value: '比价结果' },
                { label: '年度合同', value: '年度合同' },
                { label: '历史价格', value: '历史价格' }
              ]
            }
          }
        ]
      function h() {
        m.value = !1
      }
      async function u() {
        return !s.value.material || !s.value.supplier ? (B.warning('请填写物料名称和供应商'), !1) : (x('submit'), !1)
      }
      return (v, e) => {
        const p = c('gi-form'),
          f = c('gi-dialog')
        return (
          E(),
          U(
            f,
            {
              modelValue: m.value,
              'onUpdate:modelValue': e[1] || (e[1] = (o) => (m.value = o)),
              title: b.mode === 'add' ? '新增价格记录' : '编辑价格记录',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': u,
              'on-cancel': h,
              width: '620px'
            },
            {
              default: r(() => [
                t(p, { modelValue: s.value, 'onUpdate:modelValue': e[0] || (e[0] = (o) => (s.value = o)), columns: i, 'label-width': 100 }, null, 8, [
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
  Pe = Me,
  ke = N({
    __name: 'index',
    setup(b) {
      const g = [
          { type: 'input', label: '物料名称', field: 'material', props: { clearable: !0 } },
          { type: 'input', label: '供应商', field: 'supplier', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '来源',
            field: 'source',
            props: { clearable: !0, options: ['报价单', '比价结果', '年度合同', '历史价格'].map((a) => ({ label: a, value: a })) }
          }
        ],
        m = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        s = [
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'supplier', label: '供应商', minWidth: 180 },
          { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
          { prop: 'currency', label: '币种', minWidth: 80, align: 'center' },
          { prop: 'valid_from', label: '生效日期', minWidth: 120 },
          { prop: 'valid_to', label: '失效日期', minWidth: 120 },
          { prop: 'source', label: '来源', minWidth: 100 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        x = [
          { prop: 'material', label: '物料', minWidth: 140 },
          { prop: 'supplier', label: '供应商', minWidth: 160 },
          { prop: 'price', label: '报价', minWidth: 90, align: 'right' },
          { prop: 'source', label: '来源', minWidth: 90 }
        ]
      let i = de({ material: '', supplier: '', source: '' })
      const h = d([...g]),
        u = d(!1),
        v = d('add'),
        e = d(P()),
        p = d([]),
        f = d()
      let o = null
      const {
          tableData: A,
          pagination: I,
          loading: O,
          search: M,
          refresh: L,
          handleDelete: T
        } = he({
          rowKey: 'id',
          listAPI: async ({ page: a, size: l }) =>
            (await z({ pageNum: a, pageSize: l, material: i.material || void 0, supplier: i.supplier || void 0, source: i.source || void 0 })).data,
          deleteAPI: (a) => Promise.all(a.map((l) => q(l)))
        }),
        $ = fe(() => p.value.slice(0, 6))
      se(
        p,
        () => {
          k()
        },
        { deep: !0 }
      )
      function P() {
        return { id: '', material: '', supplier: '', price: 0, currency: '元', valid_from: '', valid_to: '', source: '报价单' }
      }
      function K(a) {
        h.value = a
      }
      function j() {
        return { pageNum: 1, pageSize: 100, material: i.material || void 0, supplier: i.supplier || void 0, source: i.source || void 0 }
      }
      async function _() {
        p.value = (await z(j())).data.list
      }
      function G() {
        ;(M(), _())
      }
      function J() {
        ;(Object.assign(i, { material: '', supplier: '', source: '' }), M(), _())
      }
      function C() {
        ;(L(), _())
      }
      function Q() {
        ;((v.value = 'add'), (e.value = P()), (u.value = !0))
      }
      function X(a) {
        ;((v.value = 'edit'), (e.value = { ...a }), (u.value = !0))
      }
      async function H() {
        if (!e.value.material || !e.value.supplier) {
          B.warning('请填写物料名称和供应商')
          return
        }
        const a = {
          material: e.value.material,
          supplier: e.value.supplier,
          price: Number(e.value.price || 0),
          currency: e.value.currency,
          valid_from: e.value.valid_from,
          valid_to: e.value.valid_to,
          source: e.value.source
        }
        ;(v.value === 'add' ? await Ce(a) : await xe(e.value.id, a), (u.value = !1), C())
      }
      async function Z(a) {
        ;(await T(() => q(a.id))) && (await _())
      }
      function ee() {
        f.value && ((o = ge(f.value)), k(), window.addEventListener('resize', D))
      }
      function k() {
        if (!o) return
        const a = p.value.map((l) => ({
          name: `${l.material}
${l.supplier}`,
          value: l.price
        }))
        o.setOption({
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: 48, right: 20, top: 24, bottom: 70 },
          xAxis: { type: 'category', data: a.map((l) => l.name), axisLabel: { interval: 0, fontSize: 11 } },
          yAxis: { type: 'value', name: '报价' },
          series: [{ type: 'bar', data: a.map((l) => l.value), barWidth: 28, itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] } }]
        })
      }
      function D() {
        o?.resize()
      }
      return (
        pe(() => {
          ;(ee(), _())
        }),
        oe(() => {
          ;(window.removeEventListener('resize', D), o?.dispose())
        }),
        (a, l) => {
          const ae = c('gi-form'),
            y = c('gi-button'),
            S = _e,
            W = ve,
            R = c('gi-table'),
            le = ne,
            te = c('gi-page-layout')
          return (
            E(),
            U(te, null, {
              header: r(() => [
                t(
                  we,
                  { columns: g, 'onUpdate:visibleFields': K },
                  {
                    default: r(() => [
                      t(
                        ae,
                        {
                          modelValue: w(i),
                          'onUpdate:modelValue': l[0] || (l[0] = (n) => (ue(i) ? (i.value = n) : (i = n))),
                          columns: h.value,
                          'grid-item-props': m,
                          search: '',
                          onSearch: G,
                          onReset: J
                        },
                        null,
                        8,
                        ['modelValue', 'columns']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              tool: r(() => [t(y, { type: 'add', onClick: Q }), t(y, { type: 'reset', style: { 'margin-left': '8px' }, onClick: C })]),
              default: r(() => [
                t(
                  le,
                  { gutter: 16 },
                  {
                    default: r(() => [
                      t(
                        W,
                        { xs: 24, lg: 12 },
                        {
                          default: r(() => [
                            t(
                              S,
                              { header: '报价分布', shadow: 'never' },
                              { default: r(() => [me('div', { ref_key: 'priceChartRef', ref: f, style: { height: '320px' } }, null, 512)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      t(
                        W,
                        { xs: 24, lg: 12 },
                        {
                          default: r(() => [
                            t(
                              S,
                              { header: '报价概览', shadow: 'never' },
                              {
                                default: r(() => [t(R, { columns: x, data: $.value, border: '', stripe: '', size: 'small' }, null, 8, ['data'])]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                ),
                t(
                  ye,
                  { title: '价格记录', columns: s, onRefresh: C },
                  {
                    default: r(({ settingColumns: n, tableProps: ie }) => [
                      t(
                        R,
                        ce({ columns: n, data: w(A), pagination: w(I), loading: w(O) }, ie, {
                          border: '',
                          stripe: '',
                          style: { 'margin-top': '16px' }
                        }),
                        {
                          actions: r(({ row: V }) => [
                            t(y, { type: 'edit', onClick: (re) => X(V) }, null, 8, ['onClick']),
                            t(y, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (re) => Z(V) }, null, 8, ['onClick'])
                          ]),
                          _: 1
                        },
                        16,
                        ['columns', 'data', 'pagination', 'loading']
                      )
                    ]),
                    _: 1
                  }
                ),
                t(
                  Pe,
                  {
                    visible: u.value,
                    'onUpdate:visible': l[1] || (l[1] = (n) => (u.value = n)),
                    form: e.value,
                    'onUpdate:form': l[2] || (l[2] = (n) => (e.value = n)),
                    mode: v.value,
                    onSubmit: H
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
      )
    }
  }),
  ze = be(ke, [['__scopeId', 'data-v-cf2f1b57']])
export { ze as default }

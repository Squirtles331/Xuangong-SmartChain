import {
  Bn as n,
  Cn as $,
  Fn as P,
  Kn as H,
  Mn as y,
  On as W,
  Rn as J,
  Tn as Q,
  Xn as _,
  Yn as Z,
  an as z,
  bn as ee,
  dn as l,
  i as S,
  in as te,
  it as ae,
  pn as B,
  rr as u,
  sr as le,
  tt as oe,
  un as ne,
  xn as E,
  yn as U
} from './element-plus-CzL7BOKu.js'
import { t as ie } from './echarts-BZg-173N.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { t as se } from './TableSetting-BqN9x3yX.js'
import { t as de } from './SearchSetting-RejIVc8W.js'
import { i as ue, n as pe, r as me, u as ce } from './mrp-CaR7BBur.js'
var fe = B({
    __name: 'ForecastFormDialog',
    props: U({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: U(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: i }) {
      const r = P(g, 'visible'),
        p = P(g, 'form'),
        o = i,
        b = [
          { type: 'input', label: '产品编码', field: 'material_code', required: !0 },
          { type: 'input', label: '产品名称', field: 'material_name', required: !0 },
          { type: 'input-number', label: '预测数量', field: 'qty', required: !0, props: { min: 1 } },
          { type: 'date-picker', label: '需求日期', field: 'need_date', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            props: {
              options: [
                { label: '销售预测', value: 'sales' },
                { label: '独立需求', value: 'independent' }
              ]
            }
          },
          { type: 'input-number', label: '概率(%)', field: 'probability', props: { min: 0, max: 100 } },
          { type: 'input', label: '备注', field: 'remark' }
        ]
      function h() {
        r.value = !1
      }
      async function x() {
        return (o('submit'), !1)
      }
      return (V, s) => {
        const k = y('gi-form'),
          w = y('gi-dialog')
        return (
          W(),
          z(
            w,
            {
              modelValue: r.value,
              'onUpdate:modelValue': s[1] || (s[1] = (m) => (r.value = m)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': x,
              'on-cancel': h,
              title: g.mode === 'add' ? '新增预测需求' : '编辑预测需求',
              width: '600px'
            },
            {
              default: n(() => [
                l(k, { modelValue: p.value, 'onUpdate:modelValue': s[0] || (s[0] = (m) => (p.value = m)), columns: b, 'label-width': 100 }, null, 8, [
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
  ye = fe,
  ve = B({
    __name: 'index',
    setup(g) {
      let i = Z({ keyword: '', type: '' })
      const r = _(!1),
        p = _('add'),
        o = _(R()),
        b = [
          { type: 'input', label: '关键词', field: 'keyword' },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '销售预测', value: 'sales' },
                { label: '独立需求', value: 'independent' }
              ]
            }
          }
        ],
        h = _([...b]),
        x = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        V = [
          { prop: 'material_name', label: '产品', minWidth: 160 },
          { prop: 'qty', label: '预测数量', minWidth: 100, align: 'center' },
          { prop: 'need_date', label: '需求日期', minWidth: 120 },
          { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'probability', label: '概率(%)', minWidth: 100, align: 'center' },
          { prop: 'remark', label: '备注', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        {
          tableData: s,
          pagination: k,
          loading: w,
          search: m,
          refresh: C,
          onDelete: N
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => (await ue({ pageNum: e, pageSize: t, keyword: i.keyword || void 0, type: i.type || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((t) => me(t)))
        })
      function R() {
        return { id: '', material_code: '', material_name: '', qty: 1, need_date: '', type: 'sales', probability: 80, remark: '' }
      }
      function T(e) {
        h.value = e
      }
      function A() {
        ;(Object.assign(i, { keyword: '', type: '' }), m())
      }
      function Y() {
        ;((p.value = 'add'), (o.value = R()), (r.value = !0))
      }
      function O(e) {
        ;((p.value = 'edit'), (o.value = { ...e }), (r.value = !0))
      }
      async function I() {
        if (!o.value.material_code || !o.value.material_name) {
          S.warning('请填写产品编码和产品名称')
          return
        }
        ;(p.value === 'add' ? (await pe(o.value), S.success('新增成功')) : (await ce(o.value.id, o.value), S.success('编辑成功')),
          (r.value = !1),
          await C())
      }
      const M = _()
      let c = null
      function q() {
        if (!M.value) return
        ;(c && c.dispose(), (c = ie(M.value)))
        const e = {}
        s.value.forEach((a) => {
          ;(e[a.need_date] || (e[a.need_date] = { forecast: 0, actual: 0 }),
            (e[a.need_date].forecast += a.qty),
            (e[a.need_date].actual += Math.round(a.qty * (0.8 + Math.random() * 0.3))))
        })
        const t = Object.keys(e).sort(),
          F = t.map((a) => e[a].forecast),
          f = t.map((a) => e[a].actual)
        ;(c.setOption({
          title: { text: '预测与实际需求对比', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['预测需求', '实际需求'], bottom: 0 },
          grid: { left: 60, right: 30, bottom: 40, top: 50 },
          xAxis: { type: 'category', data: t, boundaryGap: !1 },
          yAxis: { type: 'value', name: '数量(台)' },
          series: [
            { name: '预测需求', type: 'line', data: F, smooth: !0, lineStyle: { color: '#409eff', width: 2 }, itemStyle: { color: '#409eff' } },
            {
              name: '实际需求',
              type: 'line',
              data: f,
              smooth: !0,
              lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
              itemStyle: { color: '#67c23a' }
            }
          ]
        }),
          window.addEventListener('resize', D))
      }
      function D() {
        c?.resize()
      }
      return (
        J(
          s,
          () => {
            E(() => q())
          },
          { deep: !0 }
        ),
        Q(() => {
          E(() => q())
        }),
        $(() => {
          ;(window.removeEventListener('resize', D), c?.dispose())
        }),
        (e, t) => {
          const F = y('gi-form'),
            f = y('gi-button'),
            a = ae,
            j = y('gi-table'),
            G = oe,
            K = y('gi-page-layout')
          return (
            W(),
            z(K, null, {
              header: n(() => [
                l(
                  de,
                  { columns: b, 'onUpdate:visibleFields': T },
                  {
                    default: n(() => [
                      l(
                        F,
                        {
                          modelValue: u(i),
                          'onUpdate:modelValue': t[0] || (t[0] = (d) => (H(i) ? (i.value = d) : (i = d))),
                          columns: h.value,
                          'grid-item-props': x,
                          search: '',
                          onReset: A,
                          onSearch: u(m)
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
              tool: n(() => [
                l(f, { type: 'add', onClick: Y }),
                l(f, { style: { 'margin-left': '8px' }, type: 'reset', onClick: u(C) }, null, 8, ['onClick'])
              ]),
              default: n(() => [
                l(
                  se,
                  { title: '预测需求列表', columns: V, onRefresh: u(C) },
                  {
                    default: n(({ settingColumns: d, tableProps: L }) => [
                      l(
                        j,
                        ee({ columns: d, data: u(s), pagination: u(k), loading: u(w) }, L, { border: '' }),
                        {
                          type: n(({ row: v }) => [
                            l(
                              a,
                              { type: v.type === 'sales' ? 'primary' : 'warning', size: 'small' },
                              { default: n(() => [ne(le(v.type === 'sales' ? '销售预测' : '独立需求'), 1)]), _: 2 },
                              1032,
                              ['type']
                            )
                          ]),
                          actions: n(({ row: v }) => [
                            l(f, { type: 'edit', onClick: (X) => O(v) }, null, 8, ['onClick']),
                            l(f, { style: { 'margin-left': '8px' }, type: 'delete', onClick: (X) => u(N)(v) }, null, 8, ['onClick'])
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
                l(
                  G,
                  { header: '预测与实际需求对比', shadow: 'never', style: { 'margin-top': '16px' } },
                  {
                    default: n(() => [te('div', { ref_key: 'forecastChartRef', ref: M, style: { width: '100%', height: '400px' } }, null, 512)]),
                    _: 1
                  }
                ),
                l(
                  ye,
                  {
                    visible: r.value,
                    'onUpdate:visible': t[1] || (t[1] = (d) => (r.value = d)),
                    form: o.value,
                    'onUpdate:form': t[2] || (t[2] = (d) => (o.value = d)),
                    mode: p.value,
                    onSubmit: I
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
  we = ve
export { we as default }

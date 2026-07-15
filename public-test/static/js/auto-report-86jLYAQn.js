import {
  An as te,
  Bn as e,
  Fn as N,
  J as le,
  Kn as ae,
  Mn as f,
  On as V,
  Xn as x,
  Yn as oe,
  an as D,
  bn as ne,
  dn as l,
  i as R,
  in as A,
  it as se,
  or as ie,
  ot as ue,
  pn as W,
  q as re,
  rn as E,
  rr as r,
  sn as ce,
  sr as v,
  tn as pe,
  tt as de,
  un as S,
  yn as O
} from './element-plus-CzL7BOKu.js'
import { I as me } from './index-DqMfCNbk.js'
import { t as ve } from './useTable-Hzr4fBAy.js'
import { t as fe } from './TableSetting-BqN9x3yX.js'
import { t as _e } from './SearchSetting-RejIVc8W.js'
import { c as ge, n as be, p as T } from './iot-C87u5rse.js'
var ye = W({
    __name: 'AutoReportFormDialog',
    props: O(
      { mode: {}, equipmentOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: O(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: k }) {
      const b = g,
        c = N(g, 'visible'),
        y = N(g, 'form'),
        w = k,
        s = [
          { label: '周期完成', value: 'cycle_complete' },
          { label: '计数到达', value: 'count_reached' },
          { label: '设备停机', value: 'power_off' },
          { label: '连续运行', value: 'continuous' }
        ],
        h = [
          { label: '启用', value: 'active' },
          { label: '停用', value: 'disabled' }
        ],
        u = E(() => (b.mode === 'add' ? '新增规则' : '编辑规则')),
        p = E(() => [
          { type: 'select-v2', label: '设备', field: 'equipment', required: !0, props: { options: b.equipmentOptions } },
          { type: 'select-v2', label: '触发条件', field: 'trigger', required: !0, props: { options: s } },
          { type: 'input-number', label: '阈值', field: 'threshold', props: { min: 0 } },
          {
            type: 'select-v2',
            label: '报工字段',
            field: 'wo_field',
            props: {
              options: [
                { label: '合格数量', value: 'qualified_qty' },
                { label: '不良数量', value: 'defective_qty' },
                { label: '总数量', value: 'total_qty' }
              ]
            }
          },
          { type: 'input-number', label: '默认数量', field: 'default_qty', props: { min: 1 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: h } }
        ])
      function n() {
        c.value = !1
      }
      async function q() {
        return (w('submit'), !1)
      }
      return (F, d) => {
        const C = f('gi-form'),
          m = f('gi-dialog')
        return (
          V(),
          D(
            m,
            {
              modelValue: c.value,
              'onUpdate:modelValue': d[1] || (d[1] = (_) => (c.value = _)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': q,
              'on-cancel': n,
              title: u.value,
              width: '600px'
            },
            {
              default: e(() => [
                l(
                  C,
                  { modelValue: y.value, 'onUpdate:modelValue': d[0] || (d[0] = (_) => (y.value = _)), columns: p.value, 'label-width': 100 },
                  null,
                  8,
                  ['modelValue', 'columns']
                )
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
  he = ye,
  qe = { class: 'stat-label' },
  Ce = { class: 'stat-unit' },
  xe = W({
    __name: 'index',
    setup(g) {
      const k = [
          { label: '数控车床 CK6150', value: '数控车床 CK6150' },
          { label: '钻床 Z3050', value: '钻床 Z3050' },
          { label: '加工中心 VMC850', value: '加工中心 VMC850' }
        ],
        b = { cycle_complete: '周期完成', count_reached: '计数到达', power_off: '设备停机', continuous: '连续运行' },
        c = [
          { type: 'input', label: '设备名称', field: 'equipment' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        y = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        w = [
          { prop: 'equipment', label: '设备', minWidth: 180 },
          { prop: 'trigger', label: '触发条件', minWidth: 120, align: 'center', slotName: 'trigger' },
          { prop: 'threshold', label: '阈值', minWidth: 90, align: 'center' },
          { prop: 'wo_field', label: '报工字段', minWidth: 120 },
          { prop: 'default_qty', label: '默认数量', minWidth: 100, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let s = oe({ equipment: '', status: '' })
      const h = x([...c]),
        u = x(!1),
        p = x('add'),
        n = x(B()),
        {
          tableData: q,
          pagination: F,
          loading: d,
          search: C,
          refresh: m
        } = ve({
          rowKey: 'id',
          listAPI: async ({ page: o, size: a }) =>
            (await ge({ pageNum: o, pageSize: a, equipment: s.equipment || void 0, status: s.status || void 0 })).data
        }),
        _ = E(() => {
          const o = q.value.filter((a) => a.status === 'active')
          return [
            { label: '启用规则数', value: String(o.length), unit: '条', color: '#409eff' },
            { label: '今日报工次数', value: '156', unit: '次', color: '#67c23a' },
            { label: '报工成功率', value: '98.7', unit: '%', color: '#67c23a' },
            { label: '异常次数', value: '2', unit: '次', color: '#f56c6c' }
          ]
        })
      function B() {
        return {
          id: '',
          equipment: '数控车床 CK6150',
          trigger: 'cycle_complete',
          threshold: 1,
          wo_field: 'qualified_qty',
          default_qty: 1,
          status: 'active'
        }
      }
      function U(o) {
        h.value = o
      }
      function K() {
        ;(Object.assign(s, { equipment: '', status: '' }), C())
      }
      function z() {
        ;((p.value = 'add'), (n.value = B()), (u.value = !0))
      }
      function P(o) {
        ;((p.value = 'edit'), (n.value = { ...o }), (u.value = !0))
      }
      async function L() {
        if (!n.value.equipment) {
          R.warning('请选择设备')
          return
        }
        ;(p.value === 'add' ? (await be(n.value), R.success('新增成功')) : (await T(n.value.id, n.value), R.success('编辑成功')),
          (u.value = !1),
          await m())
      }
      async function Z(o) {
        const a = o.status === 'active' ? 'disabled' : 'active'
        ;(await T(o.id, { ...o, status: a }), await m(), R.success(a === 'active' ? '已启用' : '已停用'))
      }
      return (o, a) => {
        const j = f('gi-form'),
          M = f('gi-button'),
          G = de,
          J = re,
          X = le,
          I = se,
          Y = ue,
          $ = f('gi-table'),
          H = f('gi-page-layout')
        return (
          V(),
          D(H, null, {
            header: e(() => [
              l(
                _e,
                { columns: c, 'onUpdate:visibleFields': U },
                {
                  default: e(() => [
                    l(
                      j,
                      {
                        modelValue: r(s),
                        'onUpdate:modelValue': a[0] || (a[0] = (t) => (ae(s) ? (s.value = t) : (s = t))),
                        columns: h.value,
                        'grid-item-props': y,
                        search: '',
                        onSearch: r(C),
                        onReset: K
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
            tool: e(() => [
              l(M, { type: 'add', onClick: z }),
              l(M, { type: 'reset', style: { 'margin-left': '8px' }, onClick: r(m) }, null, 8, ['onClick'])
            ]),
            default: e(() => [
              l(
                X,
                { gutter: 16, style: { 'margin-bottom': '16px' } },
                {
                  default: e(() => [
                    (V(!0),
                    ce(
                      pe,
                      null,
                      te(
                        _.value,
                        (t) => (
                          V(),
                          D(
                            J,
                            { key: t.label, span: 6 },
                            {
                              default: e(() => [
                                l(
                                  G,
                                  { shadow: 'hover', class: 'stat-card' },
                                  {
                                    default: e(() => [
                                      A('div', qe, v(t.label), 1),
                                      A(
                                        'div',
                                        { class: 'stat-value', style: ie({ color: t.color }) },
                                        [S(v(t.value), 1), A('span', Ce, v(t.unit), 1)],
                                        4
                                      )
                                    ]),
                                    _: 2
                                  },
                                  1024
                                )
                              ]),
                              _: 2
                            },
                            1024
                          )
                        )
                      ),
                      128
                    ))
                  ]),
                  _: 1
                }
              ),
              l(
                fe,
                { title: '自动报工规则', columns: w, onRefresh: r(m) },
                {
                  default: e(({ settingColumns: t, tableProps: Q }) => [
                    l(
                      $,
                      ne({ columns: t, data: r(q), pagination: r(F), loading: r(d) }, Q, { border: '', style: { height: '100%' } }),
                      {
                        trigger: e(({ row: i }) => [l(I, { size: 'small' }, { default: e(() => [S(v(b[i.trigger]), 1)]), _: 2 }, 1024)]),
                        status: e(({ row: i }) => [
                          l(
                            I,
                            { type: i.status === 'active' ? 'success' : 'info' },
                            { default: e(() => [S(v(i.status === 'active' ? '启用' : '停用'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: e(({ row: i }) => [
                          l(M, { type: 'edit', onClick: (ee) => P(i) }, null, 8, ['onClick']),
                          l(
                            Y,
                            { type: i.status === 'active' ? 'warning' : 'success', link: '', size: 'small', onClick: (ee) => Z(i) },
                            { default: e(() => [S(v(i.status === 'active' ? '停用' : '启用'), 1)]), _: 2 },
                            1032,
                            ['type', 'onClick']
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
              l(
                he,
                {
                  visible: u.value,
                  'onUpdate:visible': a[1] || (a[1] = (t) => (u.value = t)),
                  form: n.value,
                  'onUpdate:form': a[2] || (a[2] = (t) => (n.value = t)),
                  mode: p.value,
                  'equipment-options': k,
                  onSubmit: L
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
  Ae = me(xe, [['__scopeId', 'data-v-33b0fe12']])
export { Ae as default }

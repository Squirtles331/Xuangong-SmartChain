import {
  Bn as t,
  Fn as q,
  Mn as _,
  On as O,
  Tn as $,
  Xn as m,
  _ as P,
  an as R,
  dn as l,
  i as g,
  it as Z,
  ot as X,
  pn as F,
  r as j,
  rn as D,
  sr as r,
  un as u,
  v as G,
  yn as E
} from './element-plus-CzL7BOKu.js'
import { f as B, i as J, o as Q, s as Y, t as ee } from './iot-C87u5rse.js'
var te = F({
    __name: 'AlertFormDialog',
    props: E(
      { mode: {}, deviceOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: E(['submit'], ['update:visible', 'update:form']),
    setup(y, { emit: h }) {
      const p = y,
        v = q(y, 'visible'),
        b = q(y, 'form'),
        C = h,
        W = [
          { label: '温度', value: 'temp' },
          { label: '转速', value: 'rpm' },
          { label: '振动', value: 'vibration' },
          { label: '电流', value: 'current' }
        ],
        s = [
          { label: '严重', value: 'critical' },
          { label: '预警', value: 'warning' },
          { label: '提示', value: 'info' }
        ],
        d = D(() => (p.mode === 'add' ? '新增规则' : '编辑规则')),
        a = D(() => [
          { type: 'select-v2', label: '设备', field: 'device', required: !0, props: { options: p.deviceOptions } },
          { type: 'select-v2', label: '监测项', field: 'metric', required: !0, props: { options: W } },
          {
            type: 'select-v2',
            label: '运算符',
            field: 'operator',
            required: !0,
            props: {
              options: [
                { label: '>', value: '>' },
                { label: '<', value: '<' },
                { label: '>=', value: '>=' },
                { label: '<=', value: '<=' }
              ]
            }
          },
          { type: 'input-number', label: '阈值', field: 'threshold', required: !0 },
          { type: 'select-v2', label: '等级', field: 'level', required: !0, props: { options: s } }
        ])
      function w() {
        v.value = !1
      }
      async function M() {
        return (C('submit'), !1)
      }
      return (x, i) => {
        const V = _('gi-form'),
          N = _('gi-dialog')
        return (
          O(),
          R(
            N,
            {
              modelValue: v.value,
              'onUpdate:modelValue': i[1] || (i[1] = (f) => (v.value = f)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': M,
              'on-cancel': w,
              title: d.value,
              width: '600px'
            },
            {
              default: t(() => [
                l(
                  V,
                  { modelValue: b.value, 'onUpdate:modelValue': i[0] || (i[0] = (f) => (b.value = f)), columns: a.value, 'label-width': 100 },
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
  le = te,
  ae = F({
    __name: 'index',
    setup(y) {
      const h = { temp: '温度', rpm: '转速', vibration: '振动', current: '电流' },
        p = { critical: '严重', warning: '预警', info: '提示' },
        v = [
          { label: '数控车床 CK6150', value: '数控车床 CK6150' },
          { label: '钻床 Z3050', value: '钻床 Z3050' },
          { label: '加工中心 VMC850', value: '加工中心 VMC850' }
        ],
        b = m('rules'),
        C = m([]),
        W = m([]),
        s = m(!1),
        d = m('add'),
        a = m(x()),
        w = [
          { prop: 'device', label: '设备', minWidth: 160 },
          { label: '监测项', minWidth: 90, slotName: 'metric', align: 'center' },
          { prop: 'actual_value', label: '实际值', minWidth: 90, align: 'center' },
          { prop: 'threshold', label: '阈值', minWidth: 90, align: 'center' },
          { label: '等级', minWidth: 80, slotName: 'level', align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'triggered_at', label: '触发时间', minWidth: 170 },
          { prop: 'recovered_at', label: '恢复时间', minWidth: 170 }
        ],
        M = [
          { prop: 'device', label: '设备', minWidth: 180 },
          { label: '监测项', minWidth: 90, slotName: 'metric', align: 'center' },
          { prop: 'operator', label: '运算符', minWidth: 80, align: 'center' },
          { prop: 'threshold', label: '阈值', minWidth: 90, align: 'center' },
          { label: '等级', minWidth: 80, slotName: 'level', align: 'center' },
          { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      function x() {
        return { id: '', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' }
      }
      async function i() {
        C.value = (await Y()).data || []
      }
      async function V() {
        W.value = (await Q({ pageNum: 1, pageSize: 100 })).data.list || []
      }
      function N() {
        ;((d.value = 'add'), (a.value = x()), (s.value = !0))
      }
      function f(o) {
        ;((d.value = 'edit'), (a.value = { ...o }), (s.value = !0))
      }
      async function I() {
        if (!a.value.device) {
          g.warning('请选择设备')
          return
        }
        ;(d.value === 'add' ? (await ee(a.value), g.success('新增成功')) : (await B(a.value.id, a.value), g.success('编辑成功')),
          (s.value = !1),
          await i())
      }
      async function S(o) {
        const n = o.status === 'active' ? 'disabled' : 'active'
        ;(await B(o.id, { ...o, status: n }), await i(), g.success(n === 'active' ? '规则已启用' : '规则已停用'))
      }
      function U(o) {
        j.confirm('确认删除这条预警规则吗？', '提示', { type: 'warning' })
          .then(async () => {
            ;(await J(o), await i(), g.success('删除成功'))
          })
          .catch(() => {})
      }
      return (
        $(async () => {
          await Promise.all([i(), V()])
        }),
        (o, n) => {
          const k = _('gi-button'),
            c = Z,
            H = X,
            T = _('gi-table'),
            z = P,
            K = G,
            L = _('gi-page-layout')
          return (
            O(),
            R(L, null, {
              tool: t(() => [l(k, { type: 'add', onClick: N }), l(k, { type: 'reset', style: { 'margin-left': '8px' }, onClick: V })]),
              default: t(() => [
                l(
                  K,
                  { modelValue: b.value, 'onUpdate:modelValue': n[0] || (n[0] = (e) => (b.value = e)) },
                  {
                    default: t(() => [
                      l(
                        z,
                        { label: '预警规则', name: 'rules' },
                        {
                          default: t(() => [
                            l(
                              T,
                              { columns: M, data: C.value, border: '', stripe: '' },
                              {
                                metric: t(({ row: e }) => [l(c, { size: 'small' }, { default: t(() => [u(r(h[e.metric]), 1)]), _: 2 }, 1024)]),
                                level: t(({ row: e }) => [
                                  l(
                                    c,
                                    { type: e.level === 'critical' ? 'danger' : e.level === 'warning' ? 'warning' : 'info', size: 'small' },
                                    { default: t(() => [u(r(p[e.level]), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                status: t(({ row: e }) => [
                                  l(
                                    c,
                                    { type: e.status === 'active' ? 'success' : 'info', size: 'small' },
                                    { default: t(() => [u(r(e.status === 'active' ? '启用' : '停用'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                actions: t(({ row: e }) => [
                                  l(k, { type: 'edit', onClick: (A) => f(e) }, null, 8, ['onClick']),
                                  l(
                                    H,
                                    { type: e.status === 'active' ? 'warning' : 'success', link: '', size: 'small', onClick: (A) => S(e) },
                                    { default: t(() => [u(r(e.status === 'active' ? '停用' : '启用'), 1)]), _: 2 },
                                    1032,
                                    ['type', 'onClick']
                                  ),
                                  l(k, { type: 'delete', onClick: (A) => U(e.id) }, null, 8, ['onClick'])
                                ]),
                                _: 1
                              },
                              8,
                              ['data']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        z,
                        { label: '告警历史', name: 'history' },
                        {
                          default: t(() => [
                            l(
                              T,
                              { columns: w, data: W.value, border: '', stripe: '', size: 'small' },
                              {
                                metric: t(({ row: e }) => [l(c, { size: 'small' }, { default: t(() => [u(r(h[e.metric]), 1)]), _: 2 }, 1024)]),
                                level: t(({ row: e }) => [
                                  l(
                                    c,
                                    { type: e.level === 'critical' ? 'danger' : e.level === 'warning' ? 'warning' : 'info', size: 'small' },
                                    { default: t(() => [u(r(p[e.level]), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                status: t(({ row: e }) => [
                                  l(
                                    c,
                                    { type: e.status === 'triggered' ? 'danger' : 'success', size: 'small' },
                                    { default: t(() => [u(r(e.status === 'triggered' ? '已触发' : '已恢复'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['data']
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
                ),
                l(
                  le,
                  {
                    visible: s.value,
                    'onUpdate:visible': n[1] || (n[1] = (e) => (s.value = e)),
                    form: a.value,
                    'onUpdate:form': n[2] || (n[2] = (e) => (a.value = e)),
                    mode: d.value,
                    'device-options': v,
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
  oe = ae
export { oe as default }

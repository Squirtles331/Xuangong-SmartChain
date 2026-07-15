import {
  Bn as o,
  Fn as U,
  H as Z,
  Mn as W,
  On as h,
  Q as ee,
  U as te,
  W as ae,
  X as le,
  Xn as g,
  an as B,
  b as oe,
  dn as l,
  ft as se,
  i as R,
  in as A,
  it as ie,
  ot as ne,
  pn as P,
  rr as D,
  sr as _,
  un as d,
  y as ue,
  yn as w
} from './element-plus-CzL7BOKu.js'
import { I as L } from './index-DqMfCNbk.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { t as F } from './StatusTag-DWd3m1xj.js'
import { n as de } from './status-maps-BEsjyiP9.js'
import { t as me } from './CrudPage-7Q0FEhS_.js'
import { t as pe } from './CrudRowActions-Dmc4i_Io.js'
import { E as O, n as ce, u as ve, v as fe } from './qms-DDSeKvwp.js'
var be = { class: 'result-panel' },
  ge = P({
    __name: 'IncomingInspectionExecuteDialog',
    props: w(
      { task: {} },
      {
        visible: { type: Boolean, required: !0 },
        visibleModifiers: {},
        items: { required: !0 },
        itemsModifiers: {},
        result: { required: !0 },
        resultModifiers: {}
      }
    ),
    emits: w(['submit'], ['update:visible', 'update:items', 'update:result']),
    setup(u, { emit: x }) {
      const p = U(u, 'visible'),
        y = U(u, 'items'),
        m = U(u, 'result'),
        V = x
      function q(i) {
        const e = i
        return e.value ? (E(e) ? 'success' : 'danger') : 'info'
      }
      function I(i) {
        const e = i
        return e.value ? (E(e) ? '合格' : '不合格') : '-'
      }
      function E(i) {
        const e = Number(i.standard),
          n = Number(i.value)
        return !Number.isNaN(e) && !Number.isNaN(n) ? Math.abs(n - e) <= 0.5 : i.value.trim() === i.standard.trim()
      }
      return (i, e) => {
        const n = ae,
          N = te,
          c = oe,
          k = se,
          f = ie,
          C = ue,
          v = le,
          T = ee,
          b = ne,
          M = Z
        return (
          h(),
          B(
            M,
            {
              modelValue: p.value,
              'onUpdate:modelValue': e[3] || (e[3] = (r) => (p.value = r)),
              title: '执行来料检验',
              width: '760px',
              'lock-scroll': !1
            },
            {
              footer: o(() => [
                l(b, { onClick: e[1] || (e[1] = (r) => (p.value = !1)) }, { default: o(() => [...(e[10] || (e[10] = [d('取消', -1)]))]), _: 1 }),
                l(
                  b,
                  { type: 'primary', onClick: e[2] || (e[2] = (r) => V('submit')) },
                  { default: o(() => [...(e[11] || (e[11] = [d('提交', -1)]))]), _: 1 }
                )
              ]),
              default: o(() => [
                l(
                  N,
                  { column: 2, border: '' },
                  {
                    default: o(() => [
                      l(n, { label: '检验单号' }, { default: o(() => [d(_(u.task?.code), 1)]), _: 1 }),
                      l(n, { label: '物料名称' }, { default: o(() => [d(_(u.task?.material), 1)]), _: 1 }),
                      l(n, { label: '收货单号' }, { default: o(() => [d(_(u.task?.sourceCode), 1)]), _: 1 }),
                      l(n, { label: '来源说明' }, { default: o(() => [d(_(u.task?.sourceName), 1)]), _: 1 }),
                      l(n, { label: '检验模板', span: 2 }, { default: o(() => [d(_(u.task?.templateName), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                ),
                l(
                  C,
                  { data: y.value, border: '', style: { 'margin-top': '16px' } },
                  {
                    default: o(() => [
                      l(c, { prop: 'name', label: '检验项目', 'min-width': '140' }),
                      l(c, { prop: 'standard', label: '标准值', 'min-width': '140' }),
                      l(
                        c,
                        { label: '实测值', 'min-width': '160' },
                        {
                          default: o(({ row: r }) => [
                            l(k, { modelValue: r.value, 'onUpdate:modelValue': (S) => (r.value = S), size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        c,
                        { label: '判定', width: '100' },
                        {
                          default: o(({ row: r }) => [
                            l(f, { type: q(r), size: 'small' }, { default: o(() => [d(_(I(r)), 1)]), _: 2 }, 1032, ['type'])
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['data']
                ),
                A('div', be, [
                  e[9] || (e[9] = A('span', { class: 'result-label' }, '裁决结果', -1)),
                  l(
                    T,
                    { modelValue: m.value, 'onUpdate:modelValue': e[0] || (e[0] = (r) => (m.value = r)) },
                    {
                      default: o(() => [
                        l(v, { value: 'pass' }, { default: o(() => [...(e[4] || (e[4] = [d('合格', -1)]))]), _: 1 }),
                        l(v, { value: 'concession' }, { default: o(() => [...(e[5] || (e[5] = [d('让步接收', -1)]))]), _: 1 }),
                        l(v, { value: 'rework' }, { default: o(() => [...(e[6] || (e[6] = [d('返工', -1)]))]), _: 1 }),
                        l(v, { value: 'return' }, { default: o(() => [...(e[7] || (e[7] = [d('退货', -1)]))]), _: 1 }),
                        l(v, { value: 'scrap' }, { default: o(() => [...(e[8] || (e[8] = [d('报废', -1)]))]), _: 1 })
                      ]),
                      _: 1
                    },
                    8,
                    ['modelValue']
                  )
                ])
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
  _e = L(ge, [['__scopeId', 'data-v-f20e3f53']]),
  ye = P({
    __name: 'IncomingInspectionFormDialog',
    props: w({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: w(['submit'], ['update:visible', 'update:form']),
    setup(u, { emit: x }) {
      const p = U(u, 'visible'),
        y = U(u, 'form'),
        m = x,
        V = [
          { type: 'input', label: '检验单号', field: 'code', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '供应商', field: 'supplier', required: !0 },
          { type: 'input', label: '批号', field: 'lot', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', props: { min: 1 } },
          { type: 'input', label: '收货单号', field: 'sourceCode', required: !0 },
          { type: 'input', label: '来源说明', field: 'sourceName', required: !0 },
          { type: 'input', label: '仓库', field: 'warehouse' },
          { type: 'input', label: '检验模板', field: 'templateName', required: !0 }
        ]
      function q() {
        p.value = !1
      }
      async function I() {
        return (m('submit'), !1)
      }
      return (E, i) => {
        const e = W('gi-form'),
          n = W('gi-dialog')
        return (
          h(),
          B(
            n,
            {
              modelValue: p.value,
              'onUpdate:modelValue': i[1] || (i[1] = (N) => (p.value = N)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': I,
              'on-cancel': q,
              title: u.mode === 'add' ? '新增来料检验' : '编辑来料检验',
              width: '680px'
            },
            {
              default: o(() => [
                l(e, { modelValue: y.value, 'onUpdate:modelValue': i[0] || (i[0] = (N) => (y.value = N)), columns: V, 'label-width': 110 }, null, 8, [
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
  Ne = ye,
  Ie = { class: 'source-cell' },
  ke = { class: 'source-main' },
  Ce = { class: 'source-sub' },
  xe = '来料检验',
  $ = 'incoming',
  Ve = P({
    __name: 'index',
    setup(u) {
      const x = [{ key: 'export', label: '导出' }],
        p = [
          { value: 'pending', label: '待检', type: 'warning' },
          { value: 'in_progress', label: '检验中', type: 'primary' },
          { value: 'completed', label: '已完成', type: 'success' }
        ],
        y = [{ value: '', label: '待判定', type: 'info' }, ...de],
        m = g({ code: '', material: '', sourceCode: '', status: '' }),
        V = [
          { type: 'input', label: '检验单号', field: 'code', props: { clearable: !0 } },
          { type: 'input', label: '物料名称', field: 'material', props: { clearable: !0 } },
          { type: 'input', label: '收货单号', field: 'sourceCode', props: { clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: p.map((t) => ({ label: t.label, value: t.value })), clearable: !0 } }
        ],
        q = [
          { prop: 'code', label: '检验单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 160 },
          { prop: 'supplier', label: '供应商', minWidth: 140 },
          { label: '收货单号', minWidth: 200, slotName: 'source' },
          { prop: 'qty', label: '数量', width: 90, align: 'center' },
          { prop: 'templateName', label: '检验模板', minWidth: 150 },
          { label: '状态', width: 100, slotName: 'status', align: 'center' },
          { label: '判定', width: 120, slotName: 'verdict', align: 'center' },
          { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: I,
          pagination: E,
          loading: i,
          search: e,
          refresh: n,
          onDelete: N
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: t, size: a }) =>
            (
              await fe({
                pageNum: t,
                pageSize: a,
                category: $,
                code: m.value.code || void 0,
                material: m.value.material || void 0,
                sourceCode: m.value.sourceCode || void 0,
                status: m.value.status || void 0
              })
            ).data,
          deleteAPI: (t) => Promise.all(t.map((a) => ve(a)))
        }),
        c = g(!1),
        k = g('add'),
        f = g(M()),
        C = g(!1),
        v = g(null),
        T = g([]),
        b = g('pass')
      function M() {
        return {
          id: '',
          code: '',
          category: $,
          material: '',
          lot: '',
          qty: 1,
          status: 'pending',
          verdict: '',
          sourceCode: '',
          sourceName: '',
          sourceType: 'receipt',
          templateName: '钢材来料检验模板',
          supplier: '',
          warehouse: '原材料仓',
          workOrderCode: '',
          operationName: '',
          createdAt: '2026-07-15 09:00',
          items: [
            { name: '外观', type: 'sensory', standard: '无锈蚀、无裂纹', required: !0 },
            { name: '直径', type: 'measure', standard: '50.0', required: !0 },
            { name: '材质证明', type: 'count', standard: '齐全', required: !0 }
          ]
        }
      }
      function r() {
        ;((m.value = { code: '', material: '', sourceCode: '', status: '' }), e())
      }
      function S(t) {
        t === 'export' && R.success(`${xe}静态数据已导出`)
      }
      function z() {
        ;((k.value = 'add'), (f.value = M()), (c.value = !0))
      }
      function X(t) {
        ;((k.value = 'edit'), (f.value = { ...t, items: t.items.map((a) => ({ ...a })) }), (c.value = !0))
      }
      function G(t) {
        return [
          { key: 'inspect', label: t.status === 'completed' ? '复核' : '检验', tone: 'primary' },
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function H(t, a) {
        if (t === 'inspect') {
          Q(a)
          return
        }
        if (t === 'edit') {
          X(a)
          return
        }
        t === 'delete' && N(a)
      }
      async function K() {
        ;(k.value === 'add' ? (await ce(f.value), R.success('新增成功')) : (await O(f.value.id, f.value), R.success('编辑成功')),
          (c.value = !1),
          await n())
      }
      function Q(t) {
        ;((v.value = { code: t.code, material: t.material, sourceCode: t.sourceCode, sourceName: t.sourceName, templateName: t.templateName }),
          (T.value = t.items.map((a) => ({ name: a.name, standard: a.standard, value: '' }))),
          (b.value = t.verdict ? t.verdict : 'pass'),
          (C.value = !0))
      }
      async function j() {
        if (!v.value) return
        const t = I.value.find((a) => a.code === v.value?.code)
        t && (await O(t.id, { status: 'completed', verdict: b.value }), (C.value = !1), R.success(`检验完成：${J(b.value)}`), await n())
      }
      function J(t) {
        return y.find((a) => a.value === t)?.label || t
      }
      return (t, a) => (
        h(),
        B(
          me,
          {
            'search-model': m.value,
            'onUpdate:searchModel': a[5] || (a[5] = (s) => (m.value = s)),
            title: '来料检验',
            'search-columns': V,
            columns: q,
            data: D(I),
            pagination: D(E),
            loading: D(i),
            'toolbar-actions': x,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: D(e),
            onReset: r,
            onRefresh: D(n),
            onAdd: z,
            onToolbarAction: S
          },
          {
            source: o(({ row: s }) => [A('div', Ie, [A('div', ke, _(s.sourceCode), 1), A('div', Ce, _(s.sourceName), 1)])]),
            status: o(({ row: s }) => [l(F, { value: s.status, options: p }, null, 8, ['value'])]),
            verdict: o(({ row: s }) => [l(F, { value: s.verdict || '', options: y }, null, 8, ['value'])]),
            actions: o(({ row: s }) => [l(pe, { actions: G(s), onAction: (Y) => H(Y, s) }, null, 8, ['actions', 'onAction'])]),
            dialog: o(() => [
              l(
                Ne,
                {
                  visible: c.value,
                  'onUpdate:visible': a[0] || (a[0] = (s) => (c.value = s)),
                  form: f.value,
                  'onUpdate:form': a[1] || (a[1] = (s) => (f.value = s)),
                  mode: k.value,
                  onSubmit: K
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              l(
                _e,
                {
                  visible: C.value,
                  'onUpdate:visible': a[2] || (a[2] = (s) => (C.value = s)),
                  items: T.value,
                  'onUpdate:items': a[3] || (a[3] = (s) => (T.value = s)),
                  result: b.value,
                  'onUpdate:result': a[4] || (a[4] = (s) => (b.value = s)),
                  task: v.value,
                  onSubmit: j
                },
                null,
                8,
                ['visible', 'items', 'result', 'task']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  we = L(Ve, [['__scopeId', 'data-v-3c3bcf85']])
export { we as default }

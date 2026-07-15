import {
  An as E,
  Bn as u,
  Fn as M,
  Kn as T,
  Mn as V,
  On as h,
  Xn as b,
  Yn as L,
  an as P,
  dn as y,
  i as O,
  in as X,
  it as G,
  pn as w,
  rr as d,
  sn as K,
  sr as C,
  tn as j,
  un as D,
  yn as q
} from './element-plus-CzL7BOKu.js'
import { I as z } from './index-DqMfCNbk.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as Y } from './CrudPage-7Q0FEhS_.js'
import { t as H } from './CrudRowActions-Dmc4i_Io.js'
import { a as Q, n as Z, o as $ } from './routing-hHkMRJQX.js'
var ee = w({
    __name: 'ParallelFormDialog',
    props: q({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: q(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: R }) {
      const m = M(c, 'visible'),
        r = M(c, 'form'),
        t = R,
        n = [
          { label: '离心泵 XJP-100 标准工艺', value: 'routing-1' },
          { label: '齿轮箱 GBX-200 标准工艺', value: 'routing-2' }
        ],
        p = [
          {
            type: 'select-v2',
            label: '工艺路线',
            field: 'routing_id',
            required: !0,
            props: {
              options: n,
              onChange: (v) => {
                const o = n.find((g) => g.value === v)
                o && (r.value.routing_name = o.label)
              }
            }
          },
          { type: 'input', label: '工艺路线名称', field: 'routing_name', required: !0, props: { disabled: !0 } },
          {
            type: 'select-v2',
            label: '并行工序',
            field: 'operations',
            required: !0,
            props: {
              multiple: !0,
              collapseTags: !0,
              options: [
                { label: '工序10：下料', value: '工序10：下料' },
                { label: '工序20：粗车', value: '工序20：粗车' },
                { label: '工序30：精车', value: '工序30：精车' },
                { label: '工序40：钻孔', value: '工序40：钻孔' },
                { label: '工序50：热处理', value: '工序50：热处理' },
                { label: '工序60：磨削', value: '工序60：磨削' },
                { label: '工序70：装配', value: '工序70：装配' },
                { label: '工序80：试压', value: '工序80：试压' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '汇合规则',
            field: 'merge_rule',
            required: !0,
            props: {
              options: [
                { label: '全部完成后继续', value: '全部完成后继续' },
                { label: '任一完成后继续', value: '任一完成后继续' }
              ]
            }
          },
          { type: 'textarea', label: '备注', field: 'remark', props: { rows: 3, maxlength: 120, showWordLimit: !0 } }
        ]
      function i() {
        m.value = !1
      }
      async function x() {
        return !r.value.routing_id || !r.value.operations.length || !r.value.merge_rule
          ? (O.warning('请填写完整的并行工序配置信息'), !1)
          : (t('submit'), !1)
      }
      return (v, o) => {
        const g = V('gi-form'),
          k = V('gi-dialog')
        return (
          h(),
          P(
            k,
            {
              modelValue: m.value,
              'onUpdate:modelValue': o[1] || (o[1] = (s) => (m.value = s)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': x,
              'on-cancel': i,
              title: c.mode === 'add' ? '新增并行工序配置' : '编辑并行工序配置',
              width: '640px'
            },
            {
              default: u(() => [
                y(g, { modelValue: r.value, 'onUpdate:modelValue': o[0] || (o[0] = (s) => (r.value = s)), columns: p, 'label-width': 110 }, null, 8, [
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
  ae = ee,
  le = { class: 'operation-tags' },
  te = w({
    __name: 'index',
    setup(c) {
      const R = [
          { type: 'input', label: '工艺路线', field: 'routingName', props: { placeholder: '请输入工艺路线名称' } },
          {
            type: 'select-v2',
            label: '汇合规则',
            field: 'mergeRule',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '全部完成后继续', value: '全部完成后继续' },
                { label: '任一完成后继续', value: '任一完成后继续' }
              ]
            }
          }
        ],
        m = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        r = [
          { prop: 'routing_name', label: '工艺路线', minWidth: 220 },
          { label: '并行工序', minWidth: 280, slotName: 'operations' },
          { label: '汇合规则', minWidth: 150, align: 'center', slotName: 'mergeRule' },
          { prop: 'remark', label: '备注', minWidth: 240 },
          { label: '操作', minWidth: 140, align: 'center', fixed: 'right', slotName: 'actions' }
        ]
      let t = L({ routingName: '', mergeRule: '' })
      const n = b(!1),
        p = b('add'),
        i = b(A()),
        x = b([]),
        v = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        {
          tableData: o,
          pagination: g,
          loading: k,
          search: s,
          refresh: N,
          onDelete: B
        } = J({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) => {
            const f = await Q({ pageNum: e, pageSize: a, routingName: t.routingName || void 0, mergeRule: t.mergeRule || void 0 })
            return ((x.value = f.data.list), f.data)
          },
          deleteAPI: (e) => Promise.all(e.map((a) => Z(a)))
        })
      function A() {
        return { id: '', routing_id: '', routing_name: '', operations: [], merge_rule: '全部完成后继续', remark: '' }
      }
      function F() {
        ;(Object.assign(t, { routingName: '', mergeRule: '' }), s())
      }
      function S() {
        ;((p.value = 'add'), (i.value = A()), (n.value = !0))
      }
      function W(e) {
        ;((p.value = 'edit'),
          (i.value = {
            id: e.id,
            routing_id: e.routing_id,
            routing_name: e.routing_name,
            operations: [...e.operations],
            merge_rule: e.merge_rule,
            remark: e.remark || ''
          }),
          (n.value = !0))
      }
      async function I() {
        ;(await $({ ...i.value }), (n.value = !1), await N())
      }
      function U(e, a) {
        if (e === 'edit') {
          W(a)
          return
        }
        e === 'delete' && B(a)
      }
      return (e, a) => {
        const f = G
        return (
          h(),
          P(
            Y,
            {
              'search-model': d(t),
              'onUpdate:searchModel': a[2] || (a[2] = (l) => (T(t) ? (t.value = l) : (t = l))),
              title: '并行工序',
              'search-columns': R,
              'search-grid-item-props': m,
              columns: r,
              data: d(o),
              pagination: d(g),
              loading: d(k),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'add-text': '新增并行规则',
              onSearch: d(s),
              onReset: F,
              onRefresh: d(N),
              onAdd: S
            },
            {
              operations: u(({ row: l }) => [
                X('div', le, [
                  (h(!0),
                  K(
                    j,
                    null,
                    E(l.operations, (_) => (h(), P(f, { key: _, effect: 'light', round: '' }, { default: u(() => [D(C(_), 1)]), _: 2 }, 1024))),
                    128
                  ))
                ])
              ]),
              mergeRule: u(({ row: l }) => [
                y(
                  f,
                  { type: l.merge_rule === '全部完成后继续' ? 'success' : 'warning', effect: 'light', round: '' },
                  { default: u(() => [D(C(l.merge_rule), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: u(({ row: l }) => [y(H, { actions: v, onAction: (_) => U(_, l) }, null, 8, ['onAction'])]),
              dialog: u(() => [
                y(
                  ae,
                  {
                    visible: n.value,
                    'onUpdate:visible': a[0] || (a[0] = (l) => (n.value = l)),
                    form: i.value,
                    'onUpdate:form': a[1] || (a[1] = (l) => (i.value = l)),
                    mode: p.value,
                    onSubmit: I
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  de = z(te, [['__scopeId', 'data-v-7b918ffe']])
export { de as default }

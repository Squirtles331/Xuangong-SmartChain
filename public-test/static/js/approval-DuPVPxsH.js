import {
  An as X,
  Bn as d,
  C as Y,
  Fn as D,
  Kn as H,
  On as g,
  S as J,
  Xn as O,
  Yn as Q,
  an as N,
  dn as f,
  i as y,
  pn as B,
  rn as C,
  rr as p,
  sn as Z,
  sr as z,
  tn as ee,
  un as te,
  yn as M
} from './element-plus-CzL7BOKu.js'
import { t as se } from './useTable-Hzr4fBAy.js'
import { t as ae } from './StatusTag-DWd3m1xj.js'
import { t as le } from './CrudFormDialog-1OgQthWb.js'
import { t as ne } from './CrudPage-7Q0FEhS_.js'
import { t as ie } from './CrudRowActions-Dmc4i_Io.js'
import { o as u } from './static-data-B3FhK4xc.js'
var ue = B({
    __name: 'ApprovalFlowFormDialog',
    props: M({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: M(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: b }) {
      const m = D(v, 'visible'),
        i = D(v, 'form'),
        h = b,
        T = C(() => [
          { type: 'input', label: '审批流名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '关联业务',
            field: 'businessType',
            required: !0,
            props: {
              options: [
                { label: '普通工单', value: 'workOrderNormal' },
                { label: '紧急工单', value: 'workOrderUrgent' },
                { label: 'BOM/工艺', value: 'bomRouting' },
                { label: 'ECN 变更', value: 'ecn' },
                { label: '销售订单', value: 'salesOrder' },
                { label: '采购订单', value: 'purchaseOrder' }
              ]
            }
          },
          { type: 'input', label: '审批节点', field: 'nodes', required: !0, props: { placeholder: '多个节点用逗号分隔，例如：车间主任,生产部长' } }
        ])
      function l() {
        return !i.value.name || !i.value.businessType || !i.value.nodes ? (y.warning('请完善审批流信息'), !1) : !0
      }
      return (o, n) => (
        g(),
        N(
          le,
          {
            visible: m.value,
            'onUpdate:visible': n[0] || (n[0] = (s) => (m.value = s)),
            title: v.mode === 'add' ? '新增审批流' : '编辑审批流',
            form: i.value,
            'onUpdate:form': n[1] || (n[1] = (s) => (i.value = s)),
            columns: T.value,
            'label-width': 120,
            width: '600px',
            'before-submit': l,
            onSubmit: n[2] || (n[2] = (s) => h('submit'))
          },
          null,
          8,
          ['visible', 'title', 'form', 'columns']
        )
      )
    }
  }),
  oe = ue,
  re = B({
    __name: 'index',
    setup(v) {
      const b = [
          { label: '普通工单', value: 'workOrderNormal' },
          { label: '紧急工单', value: 'workOrderUrgent' },
          { label: 'BOM/工艺', value: 'bomRouting' },
          { label: 'ECN 变更', value: 'ecn' },
          { label: '销售订单', value: 'salesOrder' },
          { label: '采购订单', value: 'purchaseOrder' }
        ],
        m = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '停用', value: 'disabled', type: 'info' }
        ],
        i = [
          { type: 'input', label: '审批流名称', field: 'name', props: { clearable: !0 } },
          { type: 'select-v2', label: '关联业务', field: 'businessType', props: { clearable: !0, options: b } },
          { type: 'select-v2', label: '状态', field: 'status', props: { clearable: !0, options: m } }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        T = [
          { prop: 'name', label: '审批流名称', minWidth: 180 },
          { label: '关联业务', minWidth: 140, slotName: 'businessType' },
          { label: '审批节点', minWidth: 280, slotName: 'nodes' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let l = Q({ name: '', businessType: '', status: '' })
      const o = O(!1),
        n = O('add'),
        s = O(R()),
        S = C(() =>
          u.value.filter((e) => {
            const t = !l.name || e.name.includes(l.name),
              r = !l.businessType || e.businessType === l.businessType,
              c = l.status === '' || e.status === l.status
            return t && r && c
          })
        ),
        {
          tableData: w,
          pagination: E,
          loading: U,
          search: x,
          refresh: F,
          onDelete: q
        } = se({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const r = (e - 1) * t,
              c = r + t
            return { list: S.value.slice(r, c), total: S.value.length }
          },
          deleteAPI: async (e) => {
            u.value = u.value.filter((t) => !e.includes(t.id))
          }
        })
      function R() {
        return { id: '', name: '', businessType: '', nodes: '' }
      }
      function _(e) {
        return Array.isArray(e.nodes) ? e.nodes : []
      }
      function W(e) {
        return b.find((t) => t.value === e)?.label || e
      }
      function P(e, t) {
        return e === 0 ? '发起' : e === t - 1 ? '终审' : `第 ${e + 1} 级`
      }
      function $(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'toggle', label: e.status === 'active' ? '停用' : '启用', tone: e.status === 'active' ? 'warning' : 'success' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function I() {
        ;(Object.assign(l, { name: '', businessType: '', status: '' }), x())
      }
      function L() {
        ;((n.value = 'add'), (s.value = R()), (o.value = !0))
      }
      function V(e) {
        ;((n.value = 'edit'), (s.value = { id: e.id, name: e.name, businessType: e.businessType, nodes: e.nodes.join(',') }), (o.value = !0))
      }
      function j(e, t) {
        if (e === 'edit') {
          V(t)
          return
        }
        if (e === 'toggle') {
          G(t)
          return
        }
        e === 'delete' && q(t)
      }
      async function K() {
        if (!s.value.name || !s.value.businessType || !s.value.nodes) {
          y.warning('请填写审批流名称、关联业务和审批节点')
          return
        }
        const e = s.value.nodes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
        ;(n.value === 'add'
          ? u.value.unshift({
              id: `FLOW-${String(u.value.length + 1).padStart(3, '0')}`,
              name: s.value.name,
              businessType: s.value.businessType,
              nodes: e,
              status: 'active'
            })
          : (u.value = u.value.map((t) => (t.id === s.value.id ? { ...t, name: s.value.name, businessType: s.value.businessType, nodes: e } : t))),
          (o.value = !1),
          await F(),
          y.success(n.value === 'add' ? '已新增静态审批流数据' : '已更新静态审批流数据'))
      }
      function G(e) {
        ;((e.status = e.status === 'active' ? 'disabled' : 'active'), y.success(e.status === 'active' ? '审批流已启用' : '审批流已停用'))
      }
      return (e, t) => {
        const r = J,
          c = Y
        return (
          g(),
          N(
            ne,
            {
              'search-model': p(l),
              'onUpdate:searchModel': t[2] || (t[2] = (a) => (H(l) ? (l.value = a) : (l = a))),
              title: '审批流配置',
              'search-columns': i,
              'search-grid-item-props': h,
              columns: T,
              data: p(w),
              pagination: p(E),
              loading: p(U),
              onSearch: p(x),
              onReset: I,
              onRefresh: p(F),
              onAdd: L
            },
            {
              businessType: d(({ row: a }) => [te(z(W(a.businessType)), 1)]),
              status: d(({ row: a }) => [f(ae, { value: a.status, options: m }, null, 8, ['value'])]),
              nodes: d(({ row: a }) => [
                f(
                  c,
                  { active: _(a).length, 'align-center': '', style: { 'max-width': '600px' } },
                  {
                    default: d(() => [
                      (g(!0),
                      Z(
                        ee,
                        null,
                        X(
                          _(a),
                          (A, k) => (
                            g(),
                            N(r, { key: `${a.id}-${k}`, title: A, description: P(Number(k), _(a).length) }, null, 8, ['title', 'description'])
                          )
                        ),
                        128
                      ))
                    ]),
                    _: 2
                  },
                  1032,
                  ['active']
                )
              ]),
              actions: d(({ row: a }) => [f(ie, { actions: $(a), onAction: (A) => j(A, a) }, null, 8, ['actions', 'onAction'])]),
              dialog: d(() => [
                f(
                  oe,
                  {
                    visible: o.value,
                    'onUpdate:visible': t[0] || (t[0] = (a) => (o.value = a)),
                    form: s.value,
                    'onUpdate:form': t[1] || (t[1] = (a) => (s.value = a)),
                    mode: n.value,
                    onSubmit: K
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
  ge = re
export { ge as default }

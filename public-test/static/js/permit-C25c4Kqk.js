import {
  Bn as o,
  Fn as P,
  Kn as j,
  Mn as p,
  On as M,
  Xn as _,
  Yn as G,
  an as D,
  bn as L,
  dn as e,
  i as X,
  it as Y,
  pn as F,
  rr as u,
  sr as $,
  un as H,
  yn as V
} from './element-plus-CzL7BOKu.js'
import { I as J } from './index-DqMfCNbk.js'
import { t as Q } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { t as ee } from './SearchSetting-RejIVc8W.js'
import { d as le, o as te, r as ae } from './ehs-vbCVyqYW.js'
import { t as oe } from './StatusTag-DWd3m1xj.js'
var ie = F({
    __name: 'PermitFormDialog',
    props: V({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: V(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: y }) {
      const m = P(f, 'visible'),
        c = P(f, 'form'),
        h = y,
        k = [
          { type: 'input', label: '作业票编号', field: 'code', required: !0 },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '动火', value: 'hot' },
                { label: '高处', value: 'height' },
                { label: '受限空间', value: 'confined' },
                { label: '临时用电', value: 'electric' }
              ]
            }
          },
          { type: 'input', label: '作业位置', field: 'location', required: !0 },
          { type: 'input', label: '申请人', field: 'applicant' },
          { type: 'date-picker', label: '申请日期', field: 'apply_date' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待审批', value: 'pending' },
                { label: '已批准', value: 'approved' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ]
      function l() {
        m.value = !1
      }
      async function b() {
        return (h('submit'), !1)
      }
      return (r, i) => {
        const t = p('gi-form'),
          x = p('gi-dialog')
        return (
          M(),
          D(
            x,
            {
              modelValue: m.value,
              'onUpdate:modelValue': i[1] || (i[1] = (v) => (m.value = v)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': b,
              'on-cancel': l,
              title: f.mode === 'add' ? '新增作业票' : '编辑作业票',
              width: '600px'
            },
            {
              default: o(() => [
                e(t, { modelValue: c.value, 'onUpdate:modelValue': i[0] || (i[0] = (v) => (c.value = v)), columns: k, 'label-width': 100 }, null, 8, [
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
  ne = ie,
  se = F({
    __name: 'index',
    setup(f) {
      const y = { hot: '动火', height: '高处', confined: '受限空间', electric: '临时用电' },
        m = [
          { value: 'pending', label: '待审批', type: 'warning' },
          { value: 'approved', label: '已批准', type: 'success' },
          { value: 'closed', label: '已关闭', type: 'info' }
        ],
        c = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '动火', value: 'hot' },
                { label: '高处', value: 'height' },
                { label: '受限空间', value: 'confined' },
                { label: '临时用电', value: 'electric' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '待审批', value: 'pending' },
                { label: '已批准', value: 'approved' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        k = [
          { prop: 'code', label: '作业票编号', minWidth: 160 },
          { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'location', label: '作业位置', minWidth: 160 },
          { prop: 'applicant', label: '申请人', minWidth: 100 },
          { prop: 'apply_date', label: '申请日期', minWidth: 120 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let l = G({ keyword: '', type: '', status: '' })
      const b = _([...c]),
        r = _(!1),
        i = _('add'),
        t = _(S()),
        {
          tableData: x,
          pagination: v,
          loading: T,
          search: w,
          refresh: C,
          onDelete: W
        } = Q({
          rowKey: 'id',
          listAPI: async ({ page: n, size: a }) =>
            (await te({ pageNum: n, pageSize: a, keyword: l.keyword || void 0, type: l.type || void 0, status: l.status || void 0 })).data,
          deleteAPI: (n) => Promise.all(n.map((a) => ae(a)))
        })
      function S() {
        return { id: '', code: '', type: 'hot', location: '', applicant: '', apply_date: '', status: 'pending' }
      }
      function q(n) {
        b.value = n
      }
      function E() {
        ;(Object.assign(l, { keyword: '', type: '', status: '' }), w())
      }
      function N() {
        ;((i.value = 'add'), (t.value = S()), (r.value = !0))
      }
      function U(n) {
        ;((i.value = 'edit'), (t.value = { ...n }), (r.value = !0))
      }
      async function I() {
        if (!t.value.location) {
          X.warning('请填写作业位置')
          return
        }
        ;(await le({ ...t.value, type: t.value.type, status: t.value.status }), (r.value = !1), await C())
      }
      return (n, a) => {
        const R = p('gi-form'),
          g = p('gi-button'),
          B = Y,
          A = p('gi-table'),
          O = p('gi-page-layout')
        return (
          M(),
          D(O, null, {
            header: o(() => [
              e(
                ee,
                { columns: c, 'onUpdate:visibleFields': q },
                {
                  default: o(() => [
                    e(
                      R,
                      {
                        modelValue: u(l),
                        'onUpdate:modelValue': a[0] || (a[0] = (s) => (j(l) ? (l.value = s) : (l = s))),
                        columns: b.value,
                        'grid-item-props': h,
                        search: '',
                        onSearch: u(w),
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
            tool: o(() => [
              e(g, { type: 'add', onClick: N }),
              e(g, { type: 'reset', style: { 'margin-left': '8px' }, onClick: u(C) }, null, 8, ['onClick'])
            ]),
            default: o(() => [
              e(
                Z,
                { title: '作业票管理', columns: k, onRefresh: u(C) },
                {
                  default: o(({ settingColumns: s, tableProps: z }) => [
                    e(
                      A,
                      L({ columns: s, data: u(x), pagination: u(v), loading: u(T) }, z, { border: '', style: { height: '100%' } }),
                      {
                        type: o(({ row: d }) => [e(B, { size: 'small' }, { default: o(() => [H($(y[d.type]), 1)]), _: 2 }, 1024)]),
                        status: o(({ row: d }) => [e(oe, { value: d.status, options: m }, null, 8, ['value'])]),
                        actions: o(({ row: d }) => [
                          e(g, { type: 'edit', onClick: (K) => U(d) }, null, 8, ['onClick']),
                          e(g, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (K) => u(W)(d) }, null, 8, ['onClick'])
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
                ne,
                {
                  visible: r.value,
                  'onUpdate:visible': a[1] || (a[1] = (s) => (r.value = s)),
                  form: t.value,
                  'onUpdate:form': a[2] || (a[2] = (s) => (t.value = s)),
                  mode: i.value,
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
    }
  }),
  fe = J(se, [['__scopeId', 'data-v-3d1adb44']])
export { fe as default }

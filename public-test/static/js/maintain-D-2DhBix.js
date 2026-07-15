import {
  Bn as e,
  Fn as C,
  H as Q,
  Kn as Y,
  Mn as M,
  On as D,
  Q as J,
  X as ee,
  Xn as _,
  Yn as te,
  an as U,
  b as le,
  bn as ae,
  dn as t,
  ft as oe,
  ht as ne,
  i as ie,
  it as ue,
  mt as se,
  on as re,
  ot as T,
  pn as R,
  rr as b,
  sr as B,
  un as y,
  y as de,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as me } from './index-DqMfCNbk.js'
import { t as pe } from './useTable-Hzr4fBAy.js'
import { t as ve } from './TableSetting-BqN9x3yX.js'
import { t as fe } from './SearchSetting-RejIVc8W.js'
import { i as ce, l as _e, n as be } from './equipment-DTYL7ZbV.js'
var ye = R({
    __name: 'MaintainFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(p, { emit: g }) {
      const m = C(p, 'visible'),
        k = C(p, 'form'),
        n = g,
        x = [
          { type: 'input', label: '计划编号', field: 'code', required: !0 },
          {
            type: 'select-v2',
            label: '设备',
            field: 'equipment',
            required: !0,
            props: {
              options: [
                { label: '数控车床 CK6150', value: '数控车床 CK6150' },
                { label: '钻床 Z3050', value: '钻床 Z3050' },
                { label: '磨床 M1432', value: '磨床 M1432' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '保养类型',
            field: 'type',
            props: {
              options: [
                { label: '日常保养', value: 'daily' },
                { label: '周保养', value: 'weekly' },
                { label: '大修', value: 'overhaul' }
              ]
            }
          },
          { type: 'date-picker', label: '计划日期', field: 'plan_date' },
          { type: 'input', label: '执行人', field: 'executor' }
        ]
      function v() {
        m.value = !1
      }
      async function l() {
        return (n('submit'), !1)
      }
      return (r, s) => {
        const V = M('gi-form'),
          f = M('gi-dialog')
        return (
          D(),
          U(
            f,
            {
              modelValue: m.value,
              'onUpdate:modelValue': s[1] || (s[1] = (d) => (m.value = d)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': l,
              'on-cancel': v,
              title: p.mode === 'add' ? '新增保养计划' : '编辑保养计划',
              width: '600px'
            },
            {
              default: e(() => [
                t(V, { modelValue: k.value, 'onUpdate:modelValue': s[0] || (s[0] = (d) => (k.value = d)), columns: x, 'label-width': 100 }, null, 8, [
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
  ge = ye,
  ke = R({
    __name: 'MaintainExecuteDialog',
    props: {
      visible: { type: Boolean, required: !0 },
      visibleModifiers: {},
      items: { required: !0 },
      itemsModifiers: {},
      form: { required: !0 },
      formModifiers: {}
    },
    emits: N(['submit'], ['update:visible', 'update:items', 'update:form']),
    setup(p, { emit: g }) {
      const m = C(p, 'visible'),
        k = C(p, 'items'),
        n = C(p, 'form'),
        x = g
      return (v, l) => {
        const r = le,
          s = ee,
          V = J,
          f = de,
          d = oe,
          S = ne,
          F = se,
          E = T,
          w = Q
        return (
          D(),
          U(
            w,
            {
              modelValue: m.value,
              'onUpdate:modelValue': l[3] || (l[3] = (i) => (m.value = i)),
              title: '执行保养',
              width: '500px',
              'lock-scroll': !1
            },
            {
              footer: e(() => [
                t(E, { onClick: l[1] || (l[1] = (i) => (m.value = !1)) }, { default: e(() => [...(l[6] || (l[6] = [y('取消', -1)]))]), _: 1 }),
                t(
                  E,
                  { type: 'primary', onClick: l[2] || (l[2] = (i) => x('submit')) },
                  { default: e(() => [...(l[7] || (l[7] = [y('提交', -1)]))]), _: 1 }
                )
              ]),
              default: e(() => [
                t(
                  f,
                  { data: k.value, border: '', size: 'small' },
                  {
                    default: e(() => [
                      t(r, { prop: 'name', label: '保养项目' }),
                      t(
                        r,
                        { label: '结果', width: '200' },
                        {
                          default: e(({ row: i }) => [
                            t(
                              V,
                              { modelValue: i.result, 'onUpdate:modelValue': (q) => (i.result = q), size: 'small' },
                              {
                                default: e(() => [
                                  t(s, { value: 'done' }, { default: e(() => [...(l[4] || (l[4] = [y('已完成', -1)]))]), _: 1 }),
                                  t(s, { value: 'issue' }, { default: e(() => [...(l[5] || (l[5] = [y('有问题', -1)]))]), _: 1 })
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue', 'onUpdate:modelValue']
                            )
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
                t(
                  F,
                  { 'label-width': '80px', style: { 'margin-top': '12px' } },
                  {
                    default: e(() => [
                      t(
                        S,
                        { label: '备注' },
                        {
                          default: e(() => [
                            t(
                              d,
                              {
                                modelValue: n.value.remark,
                                'onUpdate:modelValue': l[0] || (l[0] = (i) => (n.value.remark = i)),
                                type: 'textarea',
                                rows: 2
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
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
          )
        )
      }
    }
  }),
  xe = ke,
  Ve = R({
    __name: 'index',
    setup(p) {
      const g = [
          { type: 'input', label: '设备名称', field: 'keyword' },
          {
            type: 'select-v2',
            label: '保养类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '日常', value: 'daily' },
                { label: '周保养', value: 'weekly' },
                { label: '大修', value: 'overhaul' }
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
                { label: '待执行', value: 'pending' },
                { label: '已完成', value: 'done' },
                { label: '已逾期', value: 'overdue' }
              ]
            }
          }
        ],
        m = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        k = [
          { prop: 'code', label: '计划编号', minWidth: 160 },
          { prop: 'equipment', label: '设备', minWidth: 160 },
          { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'plan_date', label: '计划日期', minWidth: 120 },
          { prop: 'executor', label: '执行人', minWidth: 100 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
        ]
      let n = te({ keyword: '', type: '', status: '' })
      const x = _([...g]),
        v = _(!1),
        l = _('add'),
        r = _(q()),
        s = _(!1),
        V = _(''),
        f = _({ remark: '' }),
        d = _([
          { name: '清洁设备表面', result: 'done' },
          { name: '检查润滑油', result: 'done' },
          { name: '紧固螺栓', result: 'done' },
          { name: '更换滤芯', result: 'done' },
          { name: '电气检查', result: 'done' }
        ]),
        {
          tableData: S,
          pagination: F,
          loading: E,
          search: w,
          refresh: i
        } = pe({
          rowKey: 'id',
          listAPI: async ({ page: c, size: a }) =>
            (await ce({ pageNum: c, pageSize: a, keyword: n.keyword || void 0, type: n.type || void 0, status: n.status || void 0 })).data
        })
      function q() {
        return { id: '', code: '', equipment: '', type: 'daily', plan_date: '', executor: '', status: 'pending' }
      }
      function h(c) {
        x.value = c
      }
      function P() {
        ;(Object.assign(n, { keyword: '', type: '', status: '' }), w())
      }
      function z() {
        ;((l.value = 'add'), (r.value = q()), (v.value = !0))
      }
      function K(c) {
        ;((l.value = 'edit'), (r.value = { ...c }), (v.value = !0))
      }
      async function $() {
        ;(await _e({ ...r.value, type: r.value.type, status: r.value.status }), (v.value = !1), await i())
      }
      function A(c) {
        ;((V.value = c.id), (f.value = { remark: '' }), (d.value = d.value.map((a) => ({ ...a, result: 'done' }))), (s.value = !0))
      }
      async function G() {
        ;(await be(V.value, { remark: f.value.remark }), (s.value = !1), ie.success('保养完成'), await i())
      }
      return (c, a) => {
        const O = M('gi-form'),
          I = M('gi-button'),
          W = ue,
          X = T,
          Z = M('gi-table'),
          j = M('gi-page-layout')
        return (
          D(),
          U(j, null, {
            header: e(() => [
              t(
                fe,
                { columns: g, 'onUpdate:visibleFields': h },
                {
                  default: e(() => [
                    t(
                      O,
                      {
                        modelValue: b(n),
                        'onUpdate:modelValue': a[0] || (a[0] = (o) => (Y(n) ? (n.value = o) : (n = o))),
                        columns: x.value,
                        'grid-item-props': m,
                        search: '',
                        onReset: P,
                        onSearch: b(w)
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
              t(I, { type: 'add', onClick: z }),
              t(I, { style: { 'margin-left': '8px' }, type: 'reset', onClick: b(i) }, null, 8, ['onClick'])
            ]),
            default: e(() => [
              t(
                ve,
                { title: '保养计划', columns: k, onRefresh: b(i) },
                {
                  default: e(({ settingColumns: o, tableProps: H }) => [
                    t(
                      Z,
                      ae({ columns: o, data: b(S), pagination: b(F), loading: b(E) }, H, { border: '', style: { height: '100%' } }),
                      {
                        type: e(({ row: u }) => [
                          t(
                            W,
                            { type: u.type === 'daily' ? 'info' : u.type === 'weekly' ? 'warning' : 'primary' },
                            { default: e(() => [y(B(u.type === 'daily' ? '日常' : u.type === 'weekly' ? '周保养' : '大修'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        status: e(({ row: u }) => [
                          t(
                            W,
                            { type: u.status === 'pending' ? 'warning' : u.status === 'done' ? 'success' : 'danger' },
                            { default: e(() => [y(B(u.status === 'pending' ? '待执行' : u.status === 'done' ? '已完成' : '已逾期'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: e(({ row: u }) => [
                          u.status === 'pending'
                            ? (D(),
                              U(
                                X,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (L) => A(u) },
                                { default: e(() => [...(a[6] || (a[6] = [y('执行', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : re('', !0),
                          t(I, { type: 'edit', onClick: (L) => K(u) }, null, 8, ['onClick'])
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
              t(
                ge,
                {
                  visible: v.value,
                  'onUpdate:visible': a[1] || (a[1] = (o) => (v.value = o)),
                  form: r.value,
                  'onUpdate:form': a[2] || (a[2] = (o) => (r.value = o)),
                  mode: l.value,
                  onSubmit: $
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              t(
                xe,
                {
                  visible: s.value,
                  'onUpdate:visible': a[3] || (a[3] = (o) => (s.value = o)),
                  items: d.value,
                  'onUpdate:items': a[4] || (a[4] = (o) => (d.value = o)),
                  form: f.value,
                  'onUpdate:form': a[5] || (a[5] = (o) => (f.value = o)),
                  onSubmit: G
                },
                null,
                8,
                ['visible', 'items', 'form']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  Ue = me(Ve, [['__scopeId', 'data-v-da489eaa']])
export { Ue as default }

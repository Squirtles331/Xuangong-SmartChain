import {
  Bn as l,
  Fn as h,
  H as L,
  Kn as Q,
  Mn as C,
  On as w,
  Q as Y,
  X as J,
  Xn as _,
  Yn as ee,
  an as D,
  b as te,
  bn as le,
  dn as t,
  ft as ae,
  ht as oe,
  i as ne,
  it as ue,
  mt as se,
  on as ie,
  ot as W,
  pn as R,
  rr as b,
  sr as re,
  un as V,
  y as de,
  yn as I
} from './element-plus-CzL7BOKu.js'
import { I as me } from './index-DqMfCNbk.js'
import { t as pe } from './useTable-Hzr4fBAy.js'
import { t as ce } from './TableSetting-BqN9x3yX.js'
import { t as ve } from './SearchSetting-RejIVc8W.js'
import { c as fe, r as _e, t as be } from './equipment-DTYL7ZbV.js'
var ge = R({
    __name: 'CheckFormDialog',
    props: I({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: I(['submit'], ['update:visible', 'update:form']),
    setup(m, { emit: g }) {
      const d = h(m, 'visible'),
        y = h(m, 'form'),
        n = g,
        k = [
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
            label: '点检类型',
            field: 'check_type',
            props: {
              options: [
                { label: '日点检', value: '日点检' },
                { label: '周点检', value: '周点检' },
                { label: '月点检', value: '月点检' }
              ]
            }
          },
          { type: 'date-picker', label: '计划日期', field: 'plan_date' },
          { type: 'input', label: '执行人', field: 'executor' }
        ]
      function p() {
        d.value = !1
      }
      async function e() {
        return (n('submit'), !1)
      }
      return (i, s) => {
        const x = C('gi-form'),
          c = C('gi-dialog')
        return (
          w(),
          D(
            c,
            {
              modelValue: d.value,
              'onUpdate:modelValue': s[1] || (s[1] = (r) => (d.value = r)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': e,
              'on-cancel': p,
              title: m.mode === 'add' ? '新增点检计划' : '编辑点检计划',
              width: '600px'
            },
            {
              default: l(() => [
                t(x, { modelValue: y.value, 'onUpdate:modelValue': s[0] || (s[0] = (r) => (y.value = r)), columns: k, 'label-width': 100 }, null, 8, [
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
  ye = ge,
  ke = R({
    __name: 'CheckExecuteDialog',
    props: {
      visible: { type: Boolean, required: !0 },
      visibleModifiers: {},
      items: { required: !0 },
      itemsModifiers: {},
      form: { required: !0 },
      formModifiers: {}
    },
    emits: I(['submit'], ['update:visible', 'update:items', 'update:form']),
    setup(m, { emit: g }) {
      const d = h(m, 'visible'),
        y = h(m, 'items'),
        n = h(m, 'form'),
        k = g
      return (p, e) => {
        const i = te,
          s = J,
          x = Y,
          c = de,
          r = ae,
          U = oe,
          S = se,
          E = W,
          q = L
        return (
          w(),
          D(
            q,
            {
              modelValue: d.value,
              'onUpdate:modelValue': e[3] || (e[3] = (u) => (d.value = u)),
              title: '执行点检',
              width: '500px',
              'lock-scroll': !1
            },
            {
              footer: l(() => [
                t(E, { onClick: e[1] || (e[1] = (u) => (d.value = !1)) }, { default: l(() => [...(e[6] || (e[6] = [V('取消', -1)]))]), _: 1 }),
                t(
                  E,
                  { type: 'primary', onClick: e[2] || (e[2] = (u) => k('submit')) },
                  { default: l(() => [...(e[7] || (e[7] = [V('提交', -1)]))]), _: 1 }
                )
              ]),
              default: l(() => [
                t(
                  c,
                  { data: y.value, border: '', size: 'small' },
                  {
                    default: l(() => [
                      t(i, { prop: 'name', label: '点检项目' }),
                      t(
                        i,
                        { label: '结果', width: '200' },
                        {
                          default: l(({ row: u }) => [
                            t(
                              x,
                              { modelValue: u.result, 'onUpdate:modelValue': (M) => (u.result = M), size: 'small' },
                              {
                                default: l(() => [
                                  t(s, { value: 'normal' }, { default: l(() => [...(e[4] || (e[4] = [V('正常', -1)]))]), _: 1 }),
                                  t(s, { value: 'abnormal' }, { default: l(() => [...(e[5] || (e[5] = [V('异常', -1)]))]), _: 1 })
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
                  S,
                  { 'label-width': '80px', style: { 'margin-top': '12px' } },
                  {
                    default: l(() => [
                      t(
                        U,
                        { label: '备注' },
                        {
                          default: l(() => [
                            t(
                              r,
                              {
                                modelValue: n.value.remark,
                                'onUpdate:modelValue': e[0] || (e[0] = (u) => (n.value.remark = u)),
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
  Ce = R({
    __name: 'index',
    setup(m) {
      const g = [
          { type: 'input', label: '设备名称', field: 'keyword' },
          {
            type: 'select-v2',
            label: '点检类型',
            field: 'check_type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '日点检', value: '日点检' },
                { label: '周点检', value: '周点检' },
                { label: '月点检', value: '月点检' }
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
        d = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        y = [
          { prop: 'code', label: '计划编号', minWidth: 160 },
          { prop: 'equipment', label: '设备', minWidth: 160 },
          { prop: 'check_type', label: '点检类型', minWidth: 100 },
          { prop: 'plan_date', label: '计划日期', minWidth: 120 },
          { prop: 'executor', label: '执行人', minWidth: 100 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
        ]
      let n = ee({ keyword: '', check_type: '', status: '' })
      const k = _([...g]),
        p = _(!1),
        e = _('add'),
        i = _(M()),
        s = _(!1),
        x = _(''),
        c = _({ remark: '' }),
        r = _([
          { name: '设备外观', result: 'normal' },
          { name: '运行声音', result: 'normal' },
          { name: '润滑油位', result: 'normal' },
          { name: '安全防护', result: 'normal' },
          { name: '仪表读数', result: 'normal' }
        ]),
        {
          tableData: U,
          pagination: S,
          loading: E,
          search: q,
          refresh: u
        } = pe({
          rowKey: 'id',
          listAPI: async ({ page: v, size: a }) =>
            (await _e({ pageNum: v, pageSize: a, keyword: n.keyword || void 0, check_type: n.check_type || void 0, status: n.status || void 0 })).data
        })
      function M() {
        return { id: '', code: '', equipment: '', check_type: '日点检', plan_date: '', executor: '', status: 'pending' }
      }
      function B(v) {
        k.value = v
      }
      function N() {
        ;(Object.assign(n, { keyword: '', check_type: '', status: '' }), q())
      }
      function T() {
        ;((e.value = 'add'), (i.value = M()), (p.value = !0))
      }
      function P(v) {
        ;((e.value = 'edit'), (i.value = { ...v }), (p.value = !0))
      }
      async function z() {
        ;(await fe({ ...i.value, check_type: i.value.check_type, status: i.value.status }), (p.value = !1), await u())
      }
      function K(v) {
        ;((x.value = v.id), (c.value = { remark: '' }), (r.value = r.value.map((a) => ({ ...a, result: 'normal' }))), (s.value = !0))
      }
      async function $() {
        ;(await be(x.value, { remark: c.value.remark }), (s.value = !1), ne.success('点检完成'), await u())
      }
      return (v, a) => {
        const A = C('gi-form'),
          F = C('gi-button'),
          G = ue,
          O = W,
          X = C('gi-table'),
          Z = C('gi-page-layout')
        return (
          w(),
          D(Z, null, {
            header: l(() => [
              t(
                ve,
                { columns: g, 'onUpdate:visibleFields': B },
                {
                  default: l(() => [
                    t(
                      A,
                      {
                        modelValue: b(n),
                        'onUpdate:modelValue': a[0] || (a[0] = (o) => (Q(n) ? (n.value = o) : (n = o))),
                        columns: k.value,
                        'grid-item-props': d,
                        search: '',
                        onReset: N,
                        onSearch: b(q)
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
              t(F, { type: 'add', onClick: T }),
              t(F, { style: { 'margin-left': '8px' }, type: 'reset', onClick: b(u) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              t(
                ce,
                { title: '点检计划', columns: y, onRefresh: b(u) },
                {
                  default: l(({ settingColumns: o, tableProps: j }) => [
                    t(
                      X,
                      le({ columns: o, data: b(U), pagination: b(S), loading: b(E) }, j, { border: '', style: { height: '100%' } }),
                      {
                        status: l(({ row: f }) => [
                          t(
                            G,
                            { type: f.status === 'pending' ? 'warning' : f.status === 'done' ? 'success' : 'danger' },
                            { default: l(() => [V(re(f.status === 'pending' ? '待执行' : f.status === 'done' ? '已完成' : '已逾期'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: l(({ row: f }) => [
                          f.status === 'pending'
                            ? (w(),
                              D(
                                O,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (H) => K(f) },
                                { default: l(() => [...(a[6] || (a[6] = [V('执行', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : ie('', !0),
                          t(F, { type: 'edit', onClick: (H) => P(f) }, null, 8, ['onClick'])
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
                ye,
                {
                  visible: p.value,
                  'onUpdate:visible': a[1] || (a[1] = (o) => (p.value = o)),
                  form: i.value,
                  'onUpdate:form': a[2] || (a[2] = (o) => (i.value = o)),
                  mode: e.value,
                  onSubmit: z
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
                  items: r.value,
                  'onUpdate:items': a[4] || (a[4] = (o) => (r.value = o)),
                  form: c.value,
                  'onUpdate:form': a[5] || (a[5] = (o) => (c.value = o)),
                  onSubmit: $
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
  De = me(Ce, [['__scopeId', 'data-v-c0186914']])
export { De as default }

import {
  An as ue,
  Bn as l,
  F as se,
  Fn as I,
  G,
  Kn as ie,
  Mn as x,
  On as k,
  Rn as re,
  U as de,
  V as pe,
  W as me,
  Xn as C,
  Yn as ce,
  an as h,
  b as ve,
  bn as fe,
  dn as e,
  ft as _e,
  ht as be,
  i as D,
  in as j,
  it as ge,
  mt as ye,
  nt as Ve,
  on as Y,
  ot as K,
  pn as A,
  rr as q,
  rt as ke,
  sn as qe,
  sr as T,
  tn as Ce,
  un as _,
  y as he,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as X } from './index-DqMfCNbk.js'
import { t as De } from './useTable-Hzr4fBAy.js'
import { t as Re } from './TableSetting-BqN9x3yX.js'
import { t as xe } from './SearchSetting-RejIVc8W.js'
import { t as Pe } from './StatusTag-DWd3m1xj.js'
import { a as Se, l as Ue, p as Me, y as O } from './scm-Dui-Cf46.js'
var we = A({
    __name: 'PurchaseRequestConvertDialog',
    props: N(
      { currentRequest: {}, suppliers: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(b, { emit: P }) {
      const c = I(b, 'visible'),
        i = I(b, 'form'),
        M = P
      function f() {
        c.value = !1
      }
      async function v() {
        return !i.value.supplier || !i.value.delivery ? (D.warning('请选择供应商和交付日期'), !1) : (M('submit'), !1)
      }
      return (w, r) => {
        const y = me,
          d = de,
          u = Ve,
          s = ke,
          V = be,
          E = G,
          S = ye,
          U = x('gi-dialog')
        return (
          k(),
          h(
            U,
            {
              modelValue: c.value,
              'onUpdate:modelValue': r[3] || (r[3] = (n) => (c.value = n)),
              title: '生成采购订单',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': v,
              'on-cancel': f,
              width: '620px'
            },
            {
              default: l(() => [
                e(
                  d,
                  { column: 2, border: '' },
                  {
                    default: l(() => [
                      e(y, { label: '申请编号' }, { default: l(() => [_(T(b.currentRequest?.code || '-'), 1)]), _: 1 }),
                      e(y, { label: '申请部门' }, { default: l(() => [_(T(b.currentRequest?.dept || '-'), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                ),
                e(
                  S,
                  { 'label-width': '100px', style: { 'margin-top': '16px' } },
                  {
                    default: l(() => [
                      e(
                        V,
                        { label: '供应商', required: '' },
                        {
                          default: l(() => [
                            e(
                              s,
                              {
                                modelValue: i.value.supplier,
                                'onUpdate:modelValue': r[0] || (r[0] = (n) => (i.value.supplier = n)),
                                style: { width: '100%' }
                              },
                              {
                                default: l(() => [
                                  (k(!0),
                                  qe(
                                    Ce,
                                    null,
                                    ue(b.suppliers, (n) => (k(), h(u, { key: n, label: n, value: n }, null, 8, ['label', 'value']))),
                                    128
                                  ))
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        V,
                        { label: '交付日期', required: '' },
                        {
                          default: l(() => [
                            e(
                              E,
                              {
                                modelValue: i.value.delivery,
                                'onUpdate:modelValue': r[1] || (r[1] = (n) => (i.value.delivery = n)),
                                style: { width: '100%' },
                                'value-format': 'YYYY-MM-DD'
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        V,
                        { label: '付款条件' },
                        {
                          default: l(() => [
                            e(
                              s,
                              {
                                modelValue: i.value.terms,
                                'onUpdate:modelValue': r[2] || (r[2] = (n) => (i.value.terms = n)),
                                style: { width: '100%' }
                              },
                              {
                                default: l(() => [
                                  e(u, { label: '月结30天', value: '月结30天' }),
                                  e(u, { label: '月结60天', value: '月结60天' }),
                                  e(u, { label: '款到发货', value: '款到发货' })
                                ]),
                                _: 1
                              },
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
  Ee = we,
  ze = { class: 'lines-header' },
  Fe = A({
    __name: 'PurchaseRequestFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(b, { emit: P }) {
      const c = I(b, 'visible'),
        i = I(b, 'form'),
        M = P,
        f = C([]),
        v = [
          {
            type: 'select-v2',
            label: '申请部门',
            field: 'dept',
            required: !0,
            props: {
              options: [
                { label: '生产部', value: '生产部' },
                { label: '设备部', value: '设备部' },
                { label: '研发部', value: '研发部' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '申请原因',
            field: 'reason',
            required: !0,
            props: {
              options: [
                { label: '生产需求', value: '生产需求' },
                { label: '安全库存补货', value: '安全库存补货' },
                { label: '研发试制', value: '研发试制' },
                { label: '设备维修', value: '设备维修' },
                { label: '其他', value: '其他' }
              ]
            }
          },
          { type: 'date-picker', label: '需求日期', field: 'need_date', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } }
        ]
      re(
        () => c.value,
        (u) => {
          u && (f.value = [{ material: '', qty: 1, unit: '件', need_date: i.value.need_date || '' }])
        }
      )
      function w() {
        f.value.push({ material: '', qty: 1, unit: '件', need_date: i.value.need_date || '' })
      }
      function r(u) {
        if (f.value.length === 1) {
          D.warning('至少保留一条申请明细')
          return
        }
        f.value.splice(u, 1)
      }
      function y() {
        c.value = !1
      }
      async function d() {
        return i.value.need_date
          ? f.value.find((u) => !u.material || !u.need_date || u.qty <= 0)
            ? (D.warning('请完善申请明细'), !1)
            : (M('submit', [...f.value]), !1)
          : (D.warning('请填写需求日期'), !1)
      }
      return (u, s) => {
        const V = x('gi-form'),
          E = pe,
          S = K,
          U = _e,
          n = ve,
          R = se,
          W = G,
          F = he,
          B = x('gi-dialog')
        return (
          k(),
          h(
            B,
            {
              modelValue: c.value,
              'onUpdate:modelValue': s[1] || (s[1] = (o) => (c.value = o)),
              title: b.mode === 'add' ? '新增采购申请' : '编辑采购申请',
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': d,
              'on-cancel': y,
              width: '760px'
            },
            {
              default: l(() => [
                e(V, { modelValue: i.value, 'onUpdate:modelValue': s[0] || (s[0] = (o) => (i.value = o)), columns: v, 'label-width': 100 }, null, 8, [
                  'modelValue'
                ]),
                e(E),
                j('div', ze, [
                  s[3] || (s[3] = j('span', { class: 'lines-title' }, '申请明细', -1)),
                  e(S, { type: 'primary', size: 'small', onClick: w }, { default: l(() => [...(s[2] || (s[2] = [_('新增物料', -1)]))]), _: 1 })
                ]),
                e(
                  F,
                  { data: f.value, border: '', size: 'small', style: { 'margin-top': '12px' } },
                  {
                    default: l(() => [
                      e(
                        n,
                        { prop: 'material', label: '物料名称', 'min-width': '220' },
                        {
                          default: l(({ row: o }) => [
                            e(
                              U,
                              {
                                modelValue: o.material,
                                'onUpdate:modelValue': (g) => (o.material = g),
                                size: 'small',
                                placeholder: '请输入物料名称'
                              },
                              null,
                              8,
                              ['modelValue', 'onUpdate:modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        n,
                        { prop: 'qty', label: '数量', width: '110' },
                        {
                          default: l(({ row: o }) => [
                            e(R, { modelValue: o.qty, 'onUpdate:modelValue': (g) => (o.qty = g), min: 1, size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        n,
                        { prop: 'unit', label: '单位', width: '100' },
                        {
                          default: l(({ row: o }) => [
                            e(U, { modelValue: o.unit, 'onUpdate:modelValue': (g) => (o.unit = g), size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        n,
                        { prop: 'need_date', label: '需求日期', width: '150' },
                        {
                          default: l(({ row: o }) => [
                            e(
                              W,
                              {
                                modelValue: o.need_date,
                                'onUpdate:modelValue': (g) => (o.need_date = g),
                                size: 'small',
                                type: 'date',
                                'value-format': 'YYYY-MM-DD'
                              },
                              null,
                              8,
                              ['modelValue', 'onUpdate:modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        n,
                        { label: '操作', width: '80', align: 'center' },
                        {
                          default: l(({ $index: o }) => [
                            e(
                              S,
                              { type: 'danger', link: '', size: 'small', onClick: (g) => r(o) },
                              { default: l(() => [...(s[4] || (s[4] = [_('删除', -1)]))]), _: 1 },
                              8,
                              ['onClick']
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
  Ye = X(Fe, [['__scopeId', 'data-v-76828d5a']]),
  Ie = A({
    __name: 'index',
    setup(b) {
      const P = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'approved', label: '已审核', type: 'primary' },
          { value: 'ordered', label: '已转订单', type: 'success' },
          { value: 'rejected', label: '已驳回', type: 'warning' }
        ],
        c = ['苏州精工钢材有限公司', '常州轴承制造厂', '无锡标准件有限公司', '南通铸造供应商'],
        i = [
          { type: 'input', label: '申请编号', field: 'code', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { clearable: !0, options: P.map((a) => ({ label: a.label, value: a.value })) }
          },
          {
            type: 'select-v2',
            label: '来源',
            field: 'source',
            props: {
              clearable: !0,
              options: [
                { label: 'MRP', value: 'mrp' },
                { label: '手工', value: 'manual' }
              ]
            }
          }
        ],
        M = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        f = [
          { prop: 'code', label: '申请编号', minWidth: 160 },
          { prop: 'dept', label: '申请部门', minWidth: 120 },
          { prop: 'reason', label: '申请原因', minWidth: 150 },
          { prop: 'need_date', label: '需求日期', minWidth: 120 },
          { label: '来源', minWidth: 90, slotName: 'source', align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'created_at', label: '创建日期', minWidth: 120 },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let v = ce({ code: '', status: '', source: '' })
      const w = C([...i]),
        r = C(!1),
        y = C('add'),
        d = C(F()),
        u = C(!1),
        s = C(null),
        V = C({ supplier: c[0], delivery: '', terms: '月结30天' }),
        {
          tableData: E,
          pagination: S,
          loading: U,
          search: n,
          refresh: R,
          onDelete: W
        } = De({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) =>
            (await Me({ pageNum: a, pageSize: t, code: v.code || void 0, status: v.status || void 0, source: v.source || void 0 })).data,
          deleteAPI: (a) => Promise.all(a.map((t) => Ue(t)))
        })
      function F() {
        return { id: '', dept: '生产部', reason: '生产需求', need_date: '', remark: '' }
      }
      function B(a) {
        w.value = a
      }
      function o() {
        ;(Object.assign(v, { code: '', status: '', source: '' }), n())
      }
      function g() {
        ;((y.value = 'add'), (d.value = F()), (r.value = !0))
      }
      function H(a) {
        ;((y.value = 'edit'), (d.value = { id: a.id, dept: a.dept, reason: a.reason, need_date: a.need_date, remark: '' }), (r.value = !0))
      }
      async function J(a) {
        if (!d.value.need_date) {
          D.warning('请填写需求日期')
          return
        }
        if (!a.length) {
          D.warning('请至少维护一条申请明细')
          return
        }
        const t = {
          dept: d.value.dept,
          reason: d.value.reason,
          need_date: d.value.need_date,
          status: 'draft',
          source: 'manual',
          created_at: new Date().toISOString().slice(0, 10)
        }
        ;(y.value === 'add'
          ? await Se({ code: `PR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-4)}`, ...t })
          : await O(d.value.id, t),
          (r.value = !1),
          await R())
      }
      async function Q(a) {
        ;(await O(a.id, { status: 'approved' }), D.success('采购申请已提交审核'), await R())
      }
      function Z(a) {
        ;((s.value = a), (V.value = { supplier: c[0], delivery: '', terms: '月结30天' }), (u.value = !0))
      }
      async function ee() {
        s.value && (await O(s.value.id, { status: 'ordered' }), (u.value = !1), D.success('已生成采购订单'), await R())
      }
      return (a, t) => {
        const le = x('gi-form'),
          L = x('gi-button'),
          z = K,
          te = ge,
          ae = x('gi-table'),
          ne = x('gi-page-layout')
        return (
          k(),
          h(ne, null, {
            header: l(() => [
              e(
                xe,
                { columns: i, 'onUpdate:visibleFields': B },
                {
                  default: l(() => [
                    e(
                      le,
                      {
                        modelValue: q(v),
                        'onUpdate:modelValue': t[0] || (t[0] = (p) => (ie(v) ? (v.value = p) : (v = p))),
                        columns: w.value,
                        'grid-item-props': M,
                        search: '',
                        onSearch: q(n),
                        onReset: o
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
              e(L, { type: 'add', onClick: g }, { default: l(() => [...(t[6] || (t[6] = [_('手工创建', -1)]))]), _: 1 }),
              e(
                z,
                {
                  type: 'primary',
                  style: { 'margin-left': '8px' },
                  onClick: t[1] || (t[1] = (p) => a.$router.push('/engineering-plan/planning/mrp/result'))
                },
                { default: l(() => [...(t[7] || (t[7] = [_('从 MRP 结果生成', -1)]))]), _: 1 }
              ),
              e(L, { type: 'reset', style: { 'margin-left': '8px' }, onClick: q(R) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              e(
                Re,
                { title: '采购申请列表', columns: f, onRefresh: q(R) },
                {
                  default: l(({ settingColumns: p, tableProps: oe }) => [
                    e(
                      ae,
                      fe({ columns: p, data: q(E), pagination: q(S), loading: q(U) }, oe, { border: '', stripe: '', style: { height: '100%' } }),
                      {
                        source: l(({ row: m }) => [
                          e(
                            te,
                            { type: m.source === 'mrp' ? 'primary' : 'info', size: 'small' },
                            { default: l(() => [_(T(m.source === 'mrp' ? 'MRP' : '手工'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        status: l(({ row: m }) => [e(Pe, { value: m.status, options: P }, null, 8, ['value'])]),
                        actions: l(({ row: m }) => [
                          m.status === 'draft'
                            ? (k(),
                              h(
                                z,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: ($) => Q(m) },
                                { default: l(() => [...(t[8] || (t[8] = [_('提交审核', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : Y('', !0),
                          m.status === 'approved'
                            ? (k(),
                              h(
                                z,
                                { key: 1, type: 'success', link: '', size: 'small', onClick: ($) => Z(m) },
                                { default: l(() => [...(t[9] || (t[9] = [_('转采购订单', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : Y('', !0),
                          m.status === 'draft'
                            ? (k(),
                              h(
                                z,
                                { key: 2, type: 'primary', link: '', size: 'small', onClick: ($) => H(m) },
                                { default: l(() => [...(t[10] || (t[10] = [_('编辑', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : Y('', !0),
                          m.status === 'draft'
                            ? (k(),
                              h(
                                z,
                                { key: 3, type: 'danger', link: '', size: 'small', onClick: ($) => q(W)(m) },
                                { default: l(() => [...(t[11] || (t[11] = [_('删除', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : Y('', !0)
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
                Ye,
                {
                  visible: r.value,
                  'onUpdate:visible': t[2] || (t[2] = (p) => (r.value = p)),
                  form: d.value,
                  'onUpdate:form': t[3] || (t[3] = (p) => (d.value = p)),
                  mode: y.value,
                  onSubmit: J
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              e(
                Ee,
                {
                  visible: u.value,
                  'onUpdate:visible': t[4] || (t[4] = (p) => (u.value = p)),
                  form: V.value,
                  'onUpdate:form': t[5] || (t[5] = (p) => (V.value = p)),
                  'current-request': s.value,
                  suppliers: c,
                  onSubmit: ee
                },
                null,
                8,
                ['visible', 'form', 'current-request']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  Le = X(Ie, [['__scopeId', 'data-v-f29cbe08']])
export { Le as default }

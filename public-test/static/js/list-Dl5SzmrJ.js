import {
  Bn as o,
  Fn as W,
  Kn as ee,
  Mn as c,
  On as N,
  Xn as y,
  Yn as ae,
  an as T,
  bn as te,
  dn as l,
  in as n,
  ot as le,
  pn as B,
  rn as C,
  rr as i,
  sr as w,
  tt as oe,
  un as D,
  yn as F
} from './element-plus-CzL7BOKu.js'
import { i as se } from './vue-chunks-CWn_TkJU.js'
import { I as ne } from './index-DqMfCNbk.js'
import { t as ie } from './useTable-Hzr4fBAy.js'
import { t as ue } from './TableSetting-BqN9x3yX.js'
import { t as re } from './SearchSetting-RejIVc8W.js'
import { t as de } from './StatusTag-DWd3m1xj.js'
import { t as pe } from './status-maps-BEsjyiP9.js'
import { a as me, l as ce, r as ve, t as fe } from './mdm-BuIKfT43.js'
var _e = B({
    __name: 'EquipmentFormDialog',
    props: F({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: F(['submit'], ['update:visible', 'update:form']),
    setup(_, { emit: b }) {
      const p = W(_, 'visible'),
        g = W(_, 'form'),
        q = b,
        s = [
          { type: 'input', label: '设备编码', field: 'code', required: !0 },
          { type: 'input', label: '设备名称', field: 'name', required: !0 },
          { type: 'input', label: '型号', field: 'model' },
          {
            type: 'select-v2',
            label: '车间',
            field: 'workshop',
            required: !0,
            props: {
              options: [
                { label: '机加工一车间', value: '机加工一车间' },
                { label: '机加工二车间', value: '机加工二车间' },
                { label: '装配车间', value: '装配车间' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '运行中', value: 'running' },
                { label: '空闲', value: 'idle' },
                { label: '保养中', value: 'maintenance' },
                { label: '维修中', value: 'repair' }
              ]
            }
          },
          { type: 'date-picker', label: '购置日期', field: 'purchase_date' },
          { type: 'date-picker', label: '投产日期', field: 'commission_date' }
        ]
      function h() {
        p.value = !1
      }
      async function r() {
        return (q('submit'), !1)
      }
      return (v, t) => {
        const d = c('gi-form'),
          x = c('gi-dialog')
        return (
          N(),
          T(
            x,
            {
              modelValue: p.value,
              'onUpdate:modelValue': t[1] || (t[1] = (f) => (p.value = f)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': r,
              'on-cancel': h,
              title: _.mode === 'add' ? '新增设备' : '编辑设备',
              width: '600px'
            },
            {
              default: o(() => [
                l(d, { modelValue: g.value, 'onUpdate:modelValue': t[0] || (t[0] = (f) => (g.value = f)), columns: s, 'label-width': 100 }, null, 8, [
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
  be = _e,
  ge = { class: 'stats-row' },
  he = { class: 'stat-value' },
  ke = { class: 'stat-value' },
  ye = { class: 'stat-value' },
  Ce = { class: 'stat-value' },
  we = B({
    __name: 'index',
    setup(_) {
      const b = se(),
        p = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '车间',
            field: 'workshop',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '机加工一车间', value: '机加工一车间' },
                { label: '机加工二车间', value: '机加工二车间' },
                { label: '装配车间', value: '装配车间' }
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
                { label: '运行中', value: 'running' },
                { label: '空闲', value: 'idle' },
                { label: '保养中', value: 'maintenance' },
                { label: '维修中', value: 'repair' }
              ]
            }
          }
        ],
        g = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        q = [
          { prop: 'code', label: '设备编码', minWidth: 150 },
          { prop: 'name', label: '设备名称', minWidth: 140 },
          { prop: 'model', label: '型号', minWidth: 120 },
          { prop: 'workshop', label: '所属车间', minWidth: 160 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'purchase_date', label: '购置日期', minWidth: 120 },
          { prop: 'commission_date', label: '投产日期', minWidth: 120 },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let s = ae({ keyword: '', workshop: '', status: '' })
      const h = y([...p]),
        r = y(!1),
        v = y('add'),
        t = y(U()),
        {
          tableData: d,
          pagination: x,
          loading: f,
          search: P,
          refresh: S,
          onDelete: I
        } = ie({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) =>
            (await me({ pageNum: e, pageSize: a, name: s.keyword || void 0, workshop: s.workshop || void 0, status: s.status || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((a) => ve(a)))
        }),
        R = C(() => d.value.length),
        z = C(() => d.value.filter((e) => e.status === 'running').length),
        A = C(() => d.value.filter((e) => e.status === 'idle').length),
        $ = C(() => d.value.filter((e) => e.status === 'repair' || e.status === 'maintenance').length)
      function U() {
        return { id: '', code: '', name: '', model: '', workshop: '机加工一车间', status: 'running', purchase_date: '', commission_date: '' }
      }
      function K(e) {
        h.value = e
      }
      function O() {
        ;(Object.assign(s, { keyword: '', workshop: '', status: '' }), P())
      }
      function j() {
        ;((v.value = 'add'), (t.value = U()), (r.value = !0))
      }
      function G(e) {
        ;((v.value = 'edit'),
          (t.value = {
            id: e.id,
            code: e.code,
            name: e.name,
            model: e.model,
            workshop: e.workshop,
            status: e.status,
            purchase_date: e.purchase_date || '',
            commission_date: e.commission_date || ''
          }),
          (r.value = !0))
      }
      function L(e) {
        b.push('/collaboration/equipment-iot/equipment/check')
      }
      function Q(e) {
        b.push('/collaboration/equipment-iot/equipment/maintain')
      }
      async function X() {
        const e = {
          id: t.value.id,
          code: t.value.code,
          name: t.value.name,
          model: t.value.model,
          workshop: t.value.workshop,
          status: t.value.status,
          purchase_date: t.value.purchase_date,
          commission_date: t.value.commission_date
        }
        ;(v.value === 'add' ? await fe(e) : await ce(t.value.id, e), (r.value = !1), await S())
      }
      return (e, a) => {
        const Y = c('gi-form'),
          V = c('gi-button'),
          k = oe,
          E = le,
          H = c('gi-table'),
          J = c('gi-page-layout')
        return (
          N(),
          T(J, null, {
            header: o(() => [
              l(
                re,
                { columns: p, 'onUpdate:visibleFields': K },
                {
                  default: o(() => [
                    l(
                      Y,
                      {
                        modelValue: i(s),
                        'onUpdate:modelValue': a[0] || (a[0] = (u) => (ee(s) ? (s.value = u) : (s = u))),
                        columns: h.value,
                        'grid-item-props': g,
                        search: '',
                        onReset: O,
                        onSearch: i(P)
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
              l(V, { type: 'add', onClick: j }),
              l(V, { style: { 'margin-left': '8px' }, type: 'reset', onClick: i(S) }, null, 8, ['onClick'])
            ]),
            default: o(() => [
              n('div', ge, [
                l(
                  k,
                  { shadow: 'hover', class: 'stat-card' },
                  { default: o(() => [n('div', he, w(R.value), 1), a[3] || (a[3] = n('div', { class: 'stat-label' }, '设备总数', -1))]), _: 1 }
                ),
                l(
                  k,
                  { shadow: 'hover', class: 'stat-card stat-running' },
                  { default: o(() => [n('div', ke, w(z.value), 1), a[4] || (a[4] = n('div', { class: 'stat-label' }, '运行中', -1))]), _: 1 }
                ),
                l(
                  k,
                  { shadow: 'hover', class: 'stat-card stat-idle' },
                  { default: o(() => [n('div', ye, w(A.value), 1), a[5] || (a[5] = n('div', { class: 'stat-label' }, '空闲', -1))]), _: 1 }
                ),
                l(
                  k,
                  { shadow: 'hover', class: 'stat-card stat-repair' },
                  { default: o(() => [n('div', Ce, w($.value), 1), a[6] || (a[6] = n('div', { class: 'stat-label' }, '维修/保养', -1))]), _: 1 }
                )
              ]),
              l(
                ue,
                { title: '设备台账', columns: q, onRefresh: i(S) },
                {
                  default: o(({ settingColumns: u, tableProps: Z }) => [
                    l(
                      H,
                      te({ columns: u, data: i(d), pagination: i(x), loading: i(f) }, Z, { border: '', style: { height: '100%' } }),
                      {
                        status: o(({ row: m }) => [l(de, { value: m.status, options: i(pe) }, null, 8, ['value', 'options'])]),
                        actions: o(({ row: m }) => [
                          l(
                            E,
                            { type: 'primary', link: '', size: 'small', onClick: (M) => G(m) },
                            { default: o(() => [...(a[7] || (a[7] = [D('编辑', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          l(
                            E,
                            { type: 'warning', link: '', size: 'small', onClick: (M) => L(m) },
                            { default: o(() => [...(a[8] || (a[8] = [D('点检', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          l(
                            E,
                            { type: 'success', link: '', size: 'small', onClick: (M) => Q(m) },
                            { default: o(() => [...(a[9] || (a[9] = [D('保养', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          ),
                          l(V, { type: 'delete', onClick: (M) => i(I)(m) }, null, 8, ['onClick'])
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
                be,
                {
                  visible: r.value,
                  'onUpdate:visible': a[1] || (a[1] = (u) => (r.value = u)),
                  form: t.value,
                  'onUpdate:form': a[2] || (a[2] = (u) => (t.value = u)),
                  mode: v.value,
                  onSubmit: X
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
  We = ne(we, [['__scopeId', 'data-v-644224bc']])
export { We as default }

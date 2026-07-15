import {
  Bn as o,
  Fn as S,
  Kn as z,
  Mn as c,
  On as W,
  Xn as k,
  Yn as G,
  an as E,
  bn as L,
  dn as t,
  i as V,
  it as X,
  pn as H,
  rn as F,
  rr as s,
  sr as $,
  un as J,
  yn as I
} from './element-plus-CzL7BOKu.js'
import { I as Q } from './index-DqMfCNbk.js'
import { t as Z } from './useTable-Hzr4fBAy.js'
import { t as ee } from './TableSetting-BqN9x3yX.js'
import { t as te } from './SearchSetting-RejIVc8W.js'
import { h as ae, l as le, n as oe, o as ne } from './hr-Bw34TP1R.js'
var ie = H({
    __name: 'HrIndexFormDialog',
    props: I(
      { mode: {}, departmentOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: I(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: b }) {
      const g = f,
        d = S(f, 'visible'),
        _ = S(f, 'form'),
        C = b,
        a = [
          { label: '在职', value: 'active' },
          { label: '离职', value: 'inactive' }
        ],
        y = F(() => (g.mode === 'add' ? '新增员工' : '编辑员工')),
        r = F(() => [
          { type: 'input', label: '工号', field: 'code', props: { disabled: !0 } },
          { type: 'input', label: '姓名', field: 'name', required: !0 },
          { type: 'select-v2', label: '部门', field: 'department', required: !0, props: { options: g.departmentOptions } },
          { type: 'input', label: '岗位', field: 'position', required: !0 },
          { type: 'input', label: '电话', field: 'phone' },
          { type: 'date-picker', label: '入职日期', field: 'hire_date', props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: a } }
        ])
      function p() {
        d.value = !1
      }
      async function e() {
        return (C('submit'), !1)
      }
      return (D, m) => {
        const w = c('gi-form'),
          h = c('gi-dialog')
        return (
          W(),
          E(
            h,
            {
              modelValue: d.value,
              'onUpdate:modelValue': m[1] || (m[1] = (u) => (d.value = u)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': e,
              'on-cancel': p,
              title: y.value,
              width: '600px'
            },
            {
              default: o(() => [
                t(
                  w,
                  { modelValue: _.value, 'onUpdate:modelValue': m[0] || (m[0] = (u) => (_.value = u)), columns: r.value, 'label-width': 100 },
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
  se = ie,
  re = H({
    __name: 'index',
    setup(f) {
      const b = [
          { label: '机加工一车间', value: '机加工一车间' },
          { label: '机加工二车间', value: '机加工二车间' },
          { label: '装配车间', value: '装配车间' },
          { label: '品质部', value: '品质部' }
        ],
        g = [
          { label: '全部', value: '' },
          { label: '在职', value: 'active' },
          { label: '离职', value: 'inactive' }
        ],
        d = [
          { type: 'input', label: '关键词', field: 'keyword' },
          { type: 'select-v2', label: '部门', field: 'department', props: { options: [{ label: '全部', value: '' }, ...b] } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: g } }
        ],
        _ = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        C = [
          { prop: 'code', label: '工号', minWidth: 130 },
          { prop: 'name', label: '姓名', minWidth: 100 },
          { prop: 'department', label: '部门', minWidth: 140 },
          { prop: 'position', label: '岗位', minWidth: 140 },
          { prop: 'phone', label: '电话', minWidth: 130 },
          { prop: 'hire_date', label: '入职日期', minWidth: 120, align: 'center' },
          { prop: 'status', label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let a = G({ keyword: '', department: '', status: '' })
      const y = k([...d]),
        r = k(!1),
        p = k('add'),
        e = k(M()),
        {
          tableData: D,
          pagination: m,
          loading: w,
          search: h,
          refresh: u,
          onDelete: O
        } = Z({
          rowKey: 'id',
          listAPI: async ({ page: n, size: l }) =>
            (await le({ pageNum: n, pageSize: l, keyword: a.keyword || void 0, department: a.department || void 0, status: a.status || void 0 }))
              .data,
          deleteAPI: (n) => Promise.all(n.map((l) => ne(l)))
        })
      function M() {
        return { id: '', code: '', name: '', department: '机加工一车间', position: '', phone: '', hire_date: '', status: 'active' }
      }
      function q(n) {
        y.value = n
      }
      function P() {
        ;(Object.assign(a, { keyword: '', department: '', status: '' }), h())
      }
      function U() {
        ;((p.value = 'add'), (e.value = M()), (r.value = !0))
      }
      function N(n) {
        ;((p.value = 'edit'), (e.value = { ...n }), (r.value = !0))
      }
      async function R() {
        if (!e.value.name || !e.value.position) {
          V.warning('请填写姓名和岗位')
          return
        }
        ;(p.value === 'add' ? (await oe(e.value), V.success('新增成功')) : (await ae(e.value.id, e.value), V.success('编辑成功')),
          (r.value = !1),
          await u())
      }
      return (n, l) => {
        const Y = c('gi-form'),
          x = c('gi-button'),
          B = X,
          T = c('gi-table'),
          A = c('gi-page-layout')
        return (
          W(),
          E(A, null, {
            header: o(() => [
              t(
                te,
                { columns: d, 'onUpdate:visibleFields': q },
                {
                  default: o(() => [
                    t(
                      Y,
                      {
                        modelValue: s(a),
                        'onUpdate:modelValue': l[0] || (l[0] = (i) => (z(a) ? (a.value = i) : (a = i))),
                        columns: y.value,
                        'grid-item-props': _,
                        search: '',
                        onSearch: s(h),
                        onReset: P
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
              t(x, { type: 'add', onClick: U }),
              t(x, { type: 'reset', style: { 'margin-left': '8px' }, onClick: s(u) }, null, 8, ['onClick'])
            ]),
            default: o(() => [
              t(
                ee,
                { title: '员工档案', columns: C, onRefresh: s(u) },
                {
                  default: o(({ settingColumns: i, tableProps: K }) => [
                    t(
                      T,
                      L({ columns: i, data: s(D), pagination: s(m), loading: s(w) }, K, { border: '', style: { height: '100%' } }),
                      {
                        status: o(({ row: v }) => [
                          t(
                            B,
                            { type: v.status === 'active' ? 'success' : 'info' },
                            { default: o(() => [J($(v.status === 'active' ? '在职' : '离职'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: o(({ row: v }) => [
                          t(x, { type: 'edit', onClick: (j) => N(v) }, null, 8, ['onClick']),
                          t(x, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (j) => s(O)(v) }, null, 8, ['onClick'])
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
                se,
                {
                  visible: r.value,
                  'onUpdate:visible': l[1] || (l[1] = (i) => (r.value = i)),
                  form: e.value,
                  'onUpdate:form': l[2] || (l[2] = (i) => (e.value = i)),
                  mode: p.value,
                  'department-options': b,
                  onSubmit: R
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
  fe = Q(re, [['__scopeId', 'data-v-4d6d4bb4']])
export { fe as default }

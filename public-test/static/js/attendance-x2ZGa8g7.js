import {
  Bn as s,
  Fn as A,
  Kn as E,
  Mn as p,
  On as F,
  Xn as C,
  Yn as K,
  an as Y,
  bn as j,
  dn as l,
  i as D,
  pn as P,
  rn as z,
  rr as i,
  yn as w
} from './element-plus-CzL7BOKu.js'
import { I as G } from './index-DqMfCNbk.js'
import { t as L } from './useTable-Hzr4fBAy.js'
import { t as X } from './TableSetting-BqN9x3yX.js'
import { t as $ } from './SearchSetting-RejIVc8W.js'
import { t as J } from './StatusTag-DWd3m1xj.js'
import { a as Q, c as Z, m as ee, t as le } from './hr-Bw34TP1R.js'
var te = P({
    __name: 'AttendanceFormDialog',
    props: w({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: w(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: g }) {
      const _ = v,
        m = A(v, 'visible'),
        b = A(v, 'form'),
        t = g,
        y = [
          { label: '正常', value: 'normal' },
          { label: '迟到', value: 'late' },
          { label: '缺勤', value: 'absent' }
        ],
        r = z(() => (_.mode === 'add' ? '新增考勤' : '编辑考勤')),
        u = [
          { type: 'input', label: '员工姓名', field: 'employee', required: !0 },
          { type: 'date-picker', label: '日期', field: 'date', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'input', label: '上班打卡', field: 'clock_in' },
          { type: 'input', label: '下班打卡', field: 'clock_out' },
          { type: 'select-v2', label: '考勤结果', field: 'result', props: { options: y } }
        ]
      function a() {
        m.value = !1
      }
      async function M() {
        return (t('submit'), !1)
      }
      return (S, d) => {
        const h = p('gi-form'),
          c = p('gi-dialog')
        return (
          F(),
          Y(
            c,
            {
              modelValue: m.value,
              'onUpdate:modelValue': d[1] || (d[1] = (f) => (m.value = f)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': M,
              'on-cancel': a,
              title: r.value,
              width: '500px'
            },
            {
              default: s(() => [
                l(h, { modelValue: b.value, 'onUpdate:modelValue': d[0] || (d[0] = (f) => (b.value = f)), columns: u, 'label-width': 100 }, null, 8, [
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
  ae = te,
  oe = P({
    __name: 'index',
    setup(v) {
      const g = [
          { value: 'normal', label: '正常', type: 'success' },
          { value: 'late', label: '迟到', type: 'warning' },
          { value: 'absent', label: '缺勤', type: 'danger' }
        ],
        _ = [
          { type: 'input', label: '员工姓名', field: 'employee' },
          { type: 'date-picker', label: '日期', field: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
          {
            type: 'select-v2',
            label: '考勤结果',
            field: 'result',
            props: { options: [{ label: '全部', value: '' }, ...g.map((e) => ({ label: e.label, value: e.value }))] }
          }
        ],
        m = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        b = [
          { prop: 'employee', label: '员工姓名', minWidth: 120 },
          { prop: 'date', label: '日期', minWidth: 120, align: 'center' },
          { prop: 'clock_in', label: '上班打卡', minWidth: 110, align: 'center' },
          { prop: 'clock_out', label: '下班打卡', minWidth: 110, align: 'center' },
          { prop: 'result', label: '考勤结果', minWidth: 100, align: 'center', slotName: 'result' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let t = K({ employee: '', date: '', result: '' })
      const y = C([..._]),
        r = C(!1),
        u = C('add'),
        a = C(V()),
        {
          tableData: M,
          pagination: S,
          loading: d,
          search: h,
          refresh: c,
          onDelete: f
        } = L({
          rowKey: 'id',
          listAPI: async ({ page: e, size: o }) =>
            (await Z({ pageNum: e, pageSize: o, employee: t.employee || void 0, date: t.date || void 0, result: t.result || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((o) => Q(o)))
        })
      function V() {
        return { id: '', employee: '', date: '', clock_in: '08:00', clock_out: '17:00', result: 'normal' }
      }
      function R(e) {
        y.value = e
      }
      function U() {
        ;(Object.assign(t, { employee: '', date: '', result: '' }), h())
      }
      function W() {
        ;((u.value = 'add'), (a.value = V()), (r.value = !0))
      }
      function q(e) {
        ;((u.value = 'edit'), (a.value = { ...e }), (r.value = !0))
      }
      async function I() {
        if (!a.value.employee) {
          D.warning('请填写员工姓名')
          return
        }
        ;(u.value === 'add' ? (await le(a.value), D.success('新增成功')) : (await ee(a.value.id, a.value), D.success('编辑成功')),
          (r.value = !1),
          await c())
      }
      return (e, o) => {
        const B = p('gi-form'),
          k = p('gi-button'),
          H = p('gi-table'),
          N = p('gi-page-layout')
        return (
          F(),
          Y(N, null, {
            header: s(() => [
              l(
                $,
                { columns: _, 'onUpdate:visibleFields': R },
                {
                  default: s(() => [
                    l(
                      B,
                      {
                        modelValue: i(t),
                        'onUpdate:modelValue': o[0] || (o[0] = (n) => (E(t) ? (t.value = n) : (t = n))),
                        columns: y.value,
                        'grid-item-props': m,
                        search: '',
                        onSearch: i(h),
                        onReset: U
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
            tool: s(() => [
              l(k, { type: 'add', onClick: W }),
              l(k, { type: 'reset', style: { 'margin-left': '8px' }, onClick: i(c) }, null, 8, ['onClick'])
            ]),
            default: s(() => [
              l(
                X,
                { title: '考勤记录', columns: b, onRefresh: i(c) },
                {
                  default: s(({ settingColumns: n, tableProps: O }) => [
                    l(
                      H,
                      j({ columns: n, data: i(M), pagination: i(S), loading: i(d) }, O, { border: '', style: { height: '100%' } }),
                      {
                        result: s(({ row: x }) => [l(J, { value: x.result, options: g }, null, 8, ['value'])]),
                        actions: s(({ row: x }) => [
                          l(k, { type: 'edit', onClick: (T) => q(x) }, null, 8, ['onClick']),
                          l(k, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (T) => i(f)(x) }, null, 8, ['onClick'])
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
                ae,
                {
                  visible: r.value,
                  'onUpdate:visible': o[1] || (o[1] = (n) => (r.value = n)),
                  form: a.value,
                  'onUpdate:form': o[2] || (o[2] = (n) => (a.value = n)),
                  mode: u.value,
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
  me = G(oe, [['__scopeId', 'data-v-34713e63']])
export { me as default }

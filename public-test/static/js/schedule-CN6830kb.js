import {
  Bn as o,
  Fn as M,
  Kn as K,
  Mn as c,
  On as w,
  Xn as y,
  Yn as j,
  an as P,
  bn as z,
  dn as e,
  i as k,
  it as G,
  pn as U,
  rn as L,
  rr as s,
  sr as X,
  un as Y,
  yn as F
} from './element-plus-CzL7BOKu.js'
import { I as $ } from './index-DqMfCNbk.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as Q } from './TableSetting-BqN9x3yX.js'
import { t as Z } from './SearchSetting-RejIVc8W.js'
import { _ as ee, f as te, i as le, s as ae } from './hr-Bw34TP1R.js'
var oe = U({
    __name: 'ScheduleFormDialog',
    props: F({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: F(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: _ }) {
      const S = g,
        f = M(g, 'visible'),
        t = M(g, 'form'),
        b = _,
        u = [
          { label: '白班', value: 'day' },
          { label: '夜班', value: 'night' },
          { label: '中班', value: 'middle' }
        ],
        m = L(() => (S.mode === 'add' ? '新增排班' : '编辑排班')),
        l = [
          { type: 'input', label: '班组', field: 'team', required: !0 },
          { type: 'select-v2', label: '班次', field: 'shift', props: { options: u } },
          { type: 'input', label: '成员', field: 'members', props: { placeholder: '多人请用顿号分隔' } },
          { type: 'input', label: '班组长', field: 'leader' }
        ]
      function x() {
        f.value = !1
      }
      async function C() {
        return (b('submit'), !1)
      }
      return (D, r) => {
        const v = c('gi-form'),
          V = c('gi-dialog')
        return (
          w(),
          P(
            V,
            {
              modelValue: f.value,
              'onUpdate:modelValue': r[1] || (r[1] = (p) => (f.value = p)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': C,
              'on-cancel': x,
              title: m.value,
              width: '500px'
            },
            {
              default: o(() => [
                e(v, { modelValue: t.value, 'onUpdate:modelValue': r[0] || (r[0] = (p) => (t.value = p)), columns: l, 'label-width': 100 }, null, 8, [
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
  ie = oe,
  ne = U({
    __name: 'index',
    setup(g) {
      const _ = [
          { type: 'input', label: '班组/负责人', field: 'team' },
          {
            type: 'select-v2',
            label: '班次',
            field: 'shift',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '白班', value: 'day' },
                { label: '夜班', value: 'night' },
                { label: '中班', value: 'middle' }
              ]
            }
          }
        ],
        S = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        f = [
          { prop: 'team', label: '班组', minWidth: 100 },
          { prop: 'shift', label: '班次', minWidth: 100, align: 'center', slotName: 'shift' },
          { prop: 'members', label: '成员', minWidth: 240 },
          { prop: 'leader', label: '班组长', minWidth: 100 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let t = j({ team: '', shift: '' })
      const b = y([..._]),
        u = y(!1),
        m = y('add'),
        l = y(p()),
        {
          tableData: x,
          pagination: C,
          loading: D,
          search: r,
          refresh: v,
          onDelete: V
        } = J({
          rowKey: 'id',
          listAPI: async ({ page: i, size: a }) => (await te({ pageNum: i, pageSize: a, team: t.team || void 0, shift: t.shift || void 0 })).data,
          deleteAPI: (i) => Promise.all(i.map((a) => ae(a)))
        })
      function p() {
        return { id: '', team: '', shift: 'day', members: '', leader: '' }
      }
      function I(i) {
        b.value = i
      }
      function N() {
        ;(Object.assign(t, { team: '', shift: '' }), r())
      }
      function R() {
        ;((m.value = 'add'), (l.value = p()), (u.value = !0))
      }
      function W(i) {
        ;((m.value = 'edit'), (l.value = { ...i }), (u.value = !0))
      }
      async function q() {
        if (!l.value.team) {
          k.warning('请填写班组')
          return
        }
        ;(m.value === 'add' ? (await le(l.value), k.success('新增成功')) : (await ee(l.value.id, l.value), k.success('编辑成功')),
          (u.value = !1),
          await v())
      }
      return (i, a) => {
        const B = c('gi-form'),
          h = c('gi-button'),
          H = G,
          T = c('gi-table'),
          A = c('gi-page-layout')
        return (
          w(),
          P(A, null, {
            header: o(() => [
              e(
                Z,
                { columns: _, 'onUpdate:visibleFields': I },
                {
                  default: o(() => [
                    e(
                      B,
                      {
                        modelValue: s(t),
                        'onUpdate:modelValue': a[0] || (a[0] = (n) => (K(t) ? (t.value = n) : (t = n))),
                        columns: b.value,
                        'grid-item-props': S,
                        search: '',
                        onSearch: s(r),
                        onReset: N
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
              e(h, { type: 'add', onClick: R }),
              e(h, { type: 'reset', style: { 'margin-left': '8px' }, onClick: s(v) }, null, 8, ['onClick'])
            ]),
            default: o(() => [
              e(
                Q,
                { title: '班组排班', columns: f, onRefresh: s(v) },
                {
                  default: o(({ settingColumns: n, tableProps: E }) => [
                    e(
                      T,
                      z({ columns: n, data: s(x), pagination: s(C), loading: s(D) }, E, { border: '', style: { height: '100%' } }),
                      {
                        shift: o(({ row: d }) => [
                          e(
                            H,
                            { type: d.shift === 'day' ? 'warning' : d.shift === 'night' ? 'primary' : 'info' },
                            { default: o(() => [Y(X(d.shift === 'day' ? '白班' : d.shift === 'night' ? '夜班' : '中班'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: o(({ row: d }) => [
                          e(h, { type: 'edit', onClick: (O) => W(d) }, null, 8, ['onClick']),
                          e(h, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (O) => s(V)(d) }, null, 8, ['onClick'])
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
                ie,
                {
                  visible: u.value,
                  'onUpdate:visible': a[1] || (a[1] = (n) => (u.value = n)),
                  form: l.value,
                  'onUpdate:form': a[2] || (a[2] = (n) => (l.value = n)),
                  mode: m.value,
                  onSubmit: q
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
  ce = $(ne, [['__scopeId', 'data-v-a699b645']])
export { ce as default }

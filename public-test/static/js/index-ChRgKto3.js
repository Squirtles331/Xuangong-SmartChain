import {
  Bn as o,
  Fn as V,
  Kn as T,
  Mn as p,
  On as E,
  Xn as _,
  Yn as K,
  an as I,
  bn as L,
  dn as e,
  i as G,
  pn as W,
  rr as u,
  yn as M
} from './element-plus-CzL7BOKu.js'
import { I as X } from './index-DqMfCNbk.js'
import { t as Y } from './useTable-Hzr4fBAy.js'
import { t as $ } from './TableSetting-BqN9x3yX.js'
import { t as J } from './SearchSetting-RejIVc8W.js'
import { a as Q, n as Z, u as ee } from './ehs-vbCVyqYW.js'
import { t as D } from './StatusTag-DWd3m1xj.js'
var le = W({
    __name: 'EhsIndexFormDialog',
    props: M({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: M(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: y }) {
      const m = V(f, 'visible'),
        v = V(f, 'form'),
        h = y,
        x = [
          { type: 'input', label: '隐患编号', field: 'code', required: !0 },
          { type: 'input', label: '位置', field: 'location', required: !0 },
          { type: 'input', label: '隐患描述', field: 'desc', required: !0 },
          {
            type: 'select-v2',
            label: '风险等级',
            field: 'level',
            required: !0,
            props: {
              options: [
                { label: '重大', value: 'major' },
                { label: '一般', value: 'moderate' },
                { label: '低风险', value: 'minor' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待整改', value: 'open' },
                { label: '整改中', value: 'processing' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          },
          { type: 'input', label: '发现人', field: 'finder' },
          { type: 'date-picker', label: '发现日期', field: 'found_at' }
        ]
      function a() {
        m.value = !1
      }
      async function b() {
        return (h('submit'), !1)
      }
      return (r, n) => {
        const l = p('gi-form'),
          k = p('gi-dialog')
        return (
          E(),
          I(
            k,
            {
              modelValue: m.value,
              'onUpdate:modelValue': n[1] || (n[1] = (c) => (m.value = c)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': b,
              'on-cancel': a,
              title: f.mode === 'add' ? '新增隐患' : '编辑隐患',
              width: '600px'
            },
            {
              default: o(() => [
                e(l, { modelValue: v.value, 'onUpdate:modelValue': n[0] || (n[0] = (c) => (v.value = c)), columns: x, 'label-width': 100 }, null, 8, [
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
  ae = le,
  te = W({
    __name: 'index',
    setup(f) {
      const y = [
          { value: 'major', label: '重大', type: 'danger' },
          { value: 'moderate', label: '一般', type: 'warning' },
          { value: 'minor', label: '低风险', type: 'info' }
        ],
        m = [
          { value: 'open', label: '待整改', type: 'danger' },
          { value: 'processing', label: '整改中', type: 'warning' },
          { value: 'closed', label: '已关闭', type: 'success' }
        ],
        v = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '风险等级',
            field: 'level',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '重大', value: 'major' },
                { label: '一般', value: 'moderate' },
                { label: '低风险', value: 'minor' }
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
                { label: '待整改', value: 'open' },
                { label: '整改中', value: 'processing' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        x = [
          { prop: 'code', label: '隐患编号', minWidth: 160 },
          { prop: 'location', label: '位置', minWidth: 140 },
          { prop: 'desc', label: '隐患描述', minWidth: 220 },
          { label: '风险等级', minWidth: 100, slotName: 'level', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'finder', label: '发现人', minWidth: 100 },
          { prop: 'found_at', label: '发现日期', minWidth: 120 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let a = K({ keyword: '', level: '', status: '' })
      const b = _([...v]),
        r = _(!1),
        n = _('add'),
        l = _(S()),
        {
          tableData: k,
          pagination: c,
          loading: q,
          search: w,
          refresh: C,
          onDelete: F
        } = Y({
          rowKey: 'id',
          listAPI: async ({ page: i, size: t }) =>
            (await Q({ pageNum: i, pageSize: t, keyword: a.keyword || void 0, level: a.level || void 0, status: a.status || void 0 })).data,
          deleteAPI: (i) => Promise.all(i.map((t) => Z(t)))
        })
      function S() {
        return { id: '', code: '', location: '', desc: '', level: 'moderate', status: 'open', finder: '', found_at: '' }
      }
      function P(i) {
        b.value = i
      }
      function U() {
        ;(Object.assign(a, { keyword: '', level: '', status: '' }), w())
      }
      function z() {
        ;((n.value = 'add'), (l.value = S()), (r.value = !0))
      }
      function N(i) {
        ;((n.value = 'edit'), (l.value = { ...i }), (r.value = !0))
      }
      async function R() {
        if (!l.value.location || !l.value.desc) {
          G.warning('请填写位置和隐患描述')
          return
        }
        ;(await ee({ ...l.value, level: l.value.level, status: l.value.status }), (r.value = !1), await C())
      }
      return (i, t) => {
        const j = p('gi-form'),
          g = p('gi-button'),
          B = p('gi-table'),
          O = p('gi-page-layout')
        return (
          E(),
          I(O, null, {
            header: o(() => [
              e(
                J,
                { columns: v, 'onUpdate:visibleFields': P },
                {
                  default: o(() => [
                    e(
                      j,
                      {
                        modelValue: u(a),
                        'onUpdate:modelValue': t[0] || (t[0] = (s) => (T(a) ? (a.value = s) : (a = s))),
                        columns: b.value,
                        'grid-item-props': h,
                        search: '',
                        onSearch: u(w),
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
            tool: o(() => [
              e(g, { type: 'add', onClick: z }),
              e(g, { type: 'reset', style: { 'margin-left': '8px' }, onClick: u(C) }, null, 8, ['onClick'])
            ]),
            default: o(() => [
              e(
                $,
                { title: '隐患台账', columns: x, onRefresh: u(C) },
                {
                  default: o(({ settingColumns: s, tableProps: A }) => [
                    e(
                      B,
                      L({ columns: s, data: u(k), pagination: u(c), loading: u(q) }, A, { border: '', style: { height: '100%' } }),
                      {
                        level: o(({ row: d }) => [e(D, { value: d.level, options: y }, null, 8, ['value'])]),
                        status: o(({ row: d }) => [e(D, { value: d.status, options: m }, null, 8, ['value'])]),
                        actions: o(({ row: d }) => [
                          e(g, { type: 'edit', onClick: (H) => N(d) }, null, 8, ['onClick']),
                          e(g, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (H) => u(F)(d) }, null, 8, ['onClick'])
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
                ae,
                {
                  visible: r.value,
                  'onUpdate:visible': t[1] || (t[1] = (s) => (r.value = s)),
                  form: l.value,
                  'onUpdate:form': t[2] || (t[2] = (s) => (l.value = s)),
                  mode: n.value,
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
  pe = X(te, [['__scopeId', 'data-v-880ce622']])
export { pe as default }

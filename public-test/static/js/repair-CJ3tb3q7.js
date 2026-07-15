import {
  Bn as l,
  Fn as W,
  Kn as X,
  Mn as p,
  On as y,
  Xn as _,
  Yn as H,
  an as k,
  bn as J,
  dn as o,
  i as D,
  on as E,
  ot as Q,
  pn as U,
  rr as s,
  un as F,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { I as Z } from './index-DqMfCNbk.js'
import { t as ee } from './useTable-Hzr4fBAy.js'
import { t as te } from './TableSetting-BqN9x3yX.js'
import { t as ae } from './SearchSetting-RejIVc8W.js'
import { t as I } from './StatusTag-DWd3m1xj.js'
import { f as O, o as le, u as oe } from './equipment-DTYL7ZbV.js'
import { r as ie } from './status-maps-BEsjyiP9.js'
var ne = U({
    __name: 'RepairFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: h }) {
      const d = W(f, 'visible'),
        v = W(f, 'form'),
        w = h,
        i = [
          { type: 'input', label: '维修单号', field: 'code', required: !0 },
          { type: 'input', label: '设备', field: 'equipment', required: !0 },
          { type: 'input', label: '故障描述', field: 'fault_desc', required: !0, props: { type: 'textarea', rows: 3 } },
          {
            type: 'select-v2',
            label: '优先级',
            field: 'priority',
            required: !0,
            props: {
              options: [
                { label: '紧急', value: 'urgent' },
                { label: '高', value: 'high' },
                { label: '普通', value: 'normal' }
              ]
            }
          },
          { type: 'input', label: '维修人', field: 'worker' }
        ]
      function g() {
        d.value = !1
      }
      async function u() {
        return (w('submit'), !1)
      }
      return (b, e) => {
        const C = p('gi-form'),
          x = p('gi-dialog')
        return (
          y(),
          k(
            x,
            {
              modelValue: d.value,
              'onUpdate:modelValue': e[1] || (e[1] = (m) => (d.value = m)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': u,
              'on-cancel': g,
              title: f.mode === 'add' ? '新增维修工单' : '编辑维修工单',
              width: '600px'
            },
            {
              default: l(() => [
                o(C, { modelValue: v.value, 'onUpdate:modelValue': e[0] || (e[0] = (m) => (v.value = m)), columns: i, 'label-width': 100 }, null, 8, [
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
  re = ne,
  se = U({
    __name: 'index',
    setup(f) {
      const h = [
          { value: 'pending', label: '待派工', type: 'warning' },
          { value: 'running', label: '维修中', type: 'primary' },
          { value: 'done', label: '已完成', type: 'success' },
          { value: 'verified', label: '已验收', type: 'info' }
        ],
        d = [
          { type: 'input', label: '关键字', field: 'keyword' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '待派工', value: 'pending' },
                { label: '维修中', value: 'running' },
                { label: '已完成', value: 'done' },
                { label: '已验收', value: 'verified' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '优先级',
            field: 'priority',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '紧急', value: 'urgent' },
                { label: '高', value: 'high' },
                { label: '普通', value: 'normal' }
              ]
            }
          }
        ],
        v = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        w = [
          { prop: 'code', label: '维修单号', minWidth: 170 },
          { prop: 'equipment', label: '设备', minWidth: 160 },
          { prop: 'fault_desc', label: '故障描述', minWidth: 220 },
          { label: '优先级', minWidth: 90, slotName: 'priority', align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'worker', label: '维修人', minWidth: 100 },
          { prop: 'created_at', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let i = H({ keyword: '', status: '', priority: '' })
      const g = _([...d]),
        u = _(!1),
        b = _('add'),
        e = _(S()),
        {
          tableData: C,
          pagination: x,
          loading: m,
          search: q,
          refresh: c
        } = ee({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) =>
            (await le({ pageNum: a, pageSize: t, keyword: i.keyword || void 0, status: i.status || void 0, priority: i.priority || void 0 })).data
        })
      function S() {
        return { id: '', code: '', equipment: '', fault_desc: '', priority: 'normal', status: 'pending', worker: '', created_at: '' }
      }
      function B(a) {
        g.value = a
      }
      function P() {
        ;(Object.assign(i, { keyword: '', status: '', priority: '' }), q())
      }
      function T() {
        ;((b.value = 'add'), (e.value = S()), (u.value = !0))
      }
      function z(a) {
        ;((b.value = 'edit'), (e.value = { ...a }), (u.value = !0))
      }
      async function K() {
        ;(await oe({ ...e.value, priority: e.value.priority, status: e.value.status }), (u.value = !1), await c())
      }
      async function A(a) {
        ;(await O(a.id, { status: 'running', worker: a.worker || '张维修' }), D.success('已派工'), await c())
      }
      async function Y(a) {
        ;(await O(a.id, { status: 'done' }), D.success('维修完成，待验收'), await c())
      }
      return (a, t) => {
        const $ = p('gi-form'),
          R = p('gi-button'),
          V = Q,
          j = p('gi-table'),
          G = p('gi-page-layout')
        return (
          y(),
          k(G, null, {
            header: l(() => [
              o(
                ae,
                { columns: d, 'onUpdate:visibleFields': B },
                {
                  default: l(() => [
                    o(
                      $,
                      {
                        modelValue: s(i),
                        'onUpdate:modelValue': t[0] || (t[0] = (r) => (X(i) ? (i.value = r) : (i = r))),
                        columns: g.value,
                        'grid-item-props': v,
                        search: '',
                        onReset: P,
                        onSearch: s(q)
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
              o(R, { type: 'add', onClick: T }),
              o(R, { style: { 'margin-left': '8px' }, type: 'reset', onClick: s(c) }, null, 8, ['onClick'])
            ]),
            default: l(() => [
              o(
                te,
                { title: '维修工单', columns: w, onRefresh: s(c) },
                {
                  default: l(({ settingColumns: r, tableProps: L }) => [
                    o(
                      j,
                      J({ columns: r, data: s(C), pagination: s(x), loading: s(m) }, L, { border: '', style: { height: '100%' } }),
                      {
                        priority: l(({ row: n }) => [o(I, { value: n.priority, options: s(ie) }, null, 8, ['value', 'options'])]),
                        status: l(({ row: n }) => [o(I, { value: n.status, options: h }, null, 8, ['value'])]),
                        actions: l(({ row: n }) => [
                          o(R, { type: 'edit', onClick: (M) => z(n) }, null, 8, ['onClick']),
                          n.status === 'pending'
                            ? (y(),
                              k(
                                V,
                                { key: 0, type: 'primary', link: '', size: 'small', onClick: (M) => A(n) },
                                { default: l(() => [...(t[3] || (t[3] = [F('派工', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : E('', !0),
                          n.status === 'running'
                            ? (y(),
                              k(
                                V,
                                { key: 1, type: 'success', link: '', size: 'small', onClick: (M) => Y(n) },
                                { default: l(() => [...(t[4] || (t[4] = [F('完工', -1)]))]), _: 1 },
                                8,
                                ['onClick']
                              ))
                            : E('', !0)
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
              o(
                re,
                {
                  visible: u.value,
                  'onUpdate:visible': t[1] || (t[1] = (r) => (u.value = r)),
                  form: e.value,
                  'onUpdate:form': t[2] || (t[2] = (r) => (e.value = r)),
                  mode: b.value,
                  onSubmit: K
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
  be = Z(se, [['__scopeId', 'data-v-2e662ddf']])
export { be as default }

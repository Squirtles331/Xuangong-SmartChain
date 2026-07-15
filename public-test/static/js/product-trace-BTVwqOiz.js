import {
  An as F,
  B as K,
  Bn as o,
  Kn as $,
  On as f,
  U as j,
  W as X,
  Xn as v,
  Yn as Y,
  an as z,
  dn as r,
  i as G,
  in as H,
  on as J,
  ot as Q,
  pn as Z,
  rr as u,
  sn as h,
  sr as d,
  tn as w,
  un as i
} from './element-plus-CzL7BOKu.js'
import { i as ee } from './vue-chunks-CWn_TkJU.js'
import { I as ae } from './index-DqMfCNbk.js'
import { t as te } from './useTable-Hzr4fBAy.js'
import { t as k } from './StatusTag-DWd3m1xj.js'
import { t as oe } from './CrudPage-7Q0FEhS_.js'
import { a as y, i as C, o as b, r as W } from './fourth-batch-static-CcgL_8sm.js'
var le = { class: 'trace-nodes' },
  re = Z({
    __name: 'index',
    setup(ne) {
      const S = ee(),
        g = v(y(b)),
        _ = v(!1),
        n = v(null),
        c = v(''),
        O = Array.from(new Set(b.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        R = [{ label: '全部', value: '' }, ...C.map((e) => ({ label: e.label, value: e.value }))],
        T = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索追溯号 / 序列号 / 工单号 / 产品名称', clearable: !0 } },
          { type: 'select-v2', label: '追溯方向', field: 'direction', props: { options: W, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: O, clearable: !0 } }
        ],
        N = [
          { prop: 'trace_code', label: '追溯号', minWidth: 150 },
          { prop: 'serial_code', label: '序列号', minWidth: 170 },
          { prop: 'product_name', label: '产品名称', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { label: '方向', minWidth: 100, slotName: 'direction', align: 'center' },
          { label: '链路状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'material_batch', label: '物料批次', minWidth: 140 },
          { prop: 'impact_scope', label: '影响范围', minWidth: 180 },
          { prop: 'latest_time', label: '最近更新时间', minWidth: 150 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let l = Y({ keyword: '', direction: '', workshop: '' })
      const {
        tableData: V,
        pagination: x,
        loading: E,
        search: m
      } = te({
        rowKey: 'id',
        listAPI: async ({ page: e, size: a }) => {
          const p = g.value.filter(B),
            s = (e - 1) * a
          return { list: p.slice(s, s + a), total: p.length }
        }
      })
      function B(e) {
        const a = l.keyword.trim().toLowerCase()
        return !(
          (a && ![e.trace_code, e.serial_code, e.wo_code, e.product_name].join(' ').toLowerCase().includes(a)) ||
          (c.value && e.status !== c.value) ||
          (l.direction && e.trace_direction !== l.direction) ||
          (l.workshop && e.workshop_name !== l.workshop)
        )
      }
      function D(e) {
        ;((n.value = e), (_.value = !0))
      }
      function I(e) {
        S.push(`/mes/work-order/${{ WO202501150001: '1', WO202501150002: '2', WO202501140003: '3' }[e] || '1'}`)
      }
      function A() {
        ;((g.value = y(b)), (_.value = !1), (n.value = null), G.success('追溯链已刷新'), m())
      }
      function P() {
        m()
      }
      function U() {
        ;((l.keyword = ''), (l.direction = ''), (l.workshop = ''), (c.value = ''), m())
      }
      return (e, a) => {
        const p = Q,
          s = X,
          L = j,
          M = K
        return (
          f(),
          z(
            oe,
            {
              'search-model': u(l),
              'onUpdate:searchModel': a[1] || (a[1] = (t) => ($(l) ? (l.value = t) : (l = t))),
              'segmented-value': c.value,
              'onUpdate:segmentedValue': a[2] || (a[2] = (t) => (c.value = t)),
              title: '产品追溯',
              'search-columns': T,
              columns: N,
              data: u(V),
              pagination: u(x),
              loading: u(E),
              'show-add-button': !1,
              'segmented-options': R,
              onSearch: u(m),
              onReset: U,
              onRefresh: A,
              onSegmentedChange: P
            },
            {
              direction: o(({ row: t }) => [r(k, { value: t.trace_direction, options: u(W) }, null, 8, ['value', 'options'])]),
              status: o(({ row: t }) => [r(k, { value: t.status, options: u(C) }, null, 8, ['value', 'options'])]),
              actions: o(({ row: t }) => [
                r(
                  p,
                  { link: '', type: 'primary', onClick: (q) => D(t) },
                  { default: o(() => [...(a[3] || (a[3] = [i('查看链路', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                ),
                r(p, { link: '', onClick: (q) => I(t.wo_code) }, { default: o(() => [...(a[4] || (a[4] = [i('工单', -1)]))]), _: 1 }, 8, ['onClick'])
              ]),
              dialog: o(() => [
                r(
                  M,
                  { modelValue: _.value, 'onUpdate:modelValue': a[0] || (a[0] = (t) => (_.value = t)), title: '产品追溯链详情', size: '500px' },
                  {
                    default: o(() => [
                      n.value
                        ? (f(),
                          h(
                            w,
                            { key: 0 },
                            [
                              r(
                                L,
                                { column: 1, border: '' },
                                {
                                  default: o(() => [
                                    r(s, { label: '追溯号' }, { default: o(() => [i(d(n.value.trace_code), 1)]), _: 1 }),
                                    r(s, { label: '工单号' }, { default: o(() => [i(d(n.value.wo_code), 1)]), _: 1 }),
                                    r(s, { label: '报工引用' }, { default: o(() => [i(d(n.value.report_ref || '无'), 1)]), _: 1 }),
                                    r(s, { label: '检验引用' }, { default: o(() => [i(d(n.value.inspection_ref || '无'), 1)]), _: 1 }),
                                    r(s, { label: 'WMS引用' }, { default: o(() => [i(d(n.value.warehouse_ref || '无'), 1)]), _: 1 }),
                                    r(s, { label: '设备引用' }, { default: o(() => [i(d(n.value.equipment_ref || '无'), 1)]), _: 1 })
                                  ]),
                                  _: 1
                                }
                              ),
                              H('div', le, [
                                (f(!0),
                                h(
                                  w,
                                  null,
                                  F(n.value.chain_nodes, (t) => (f(), h('div', { key: t, class: 'trace-node' }, d(t), 1))),
                                  128
                                ))
                              ])
                            ],
                            64
                          ))
                        : J('', !0)
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'segmented-value', 'data', 'pagination', 'loading', 'onSearch']
          )
        )
      }
    }
  }),
  me = ae(re, [['__scopeId', 'data-v-27bfe928']])
export { me as default }

import {
  An as R,
  Bn as n,
  Fn as h,
  H as W,
  Kn as A,
  On as s,
  Xn as w,
  Yn as B,
  an as m,
  dn as f,
  in as q,
  ir as E,
  it as S,
  m as $,
  on as D,
  p as M,
  pn as N,
  rr as o,
  sn as k,
  sr as x,
  tn as O,
  un as I
} from './element-plus-CzL7BOKu.js'
import { I as P } from './index-DqMfCNbk.js'
import { t as U } from './useTable-Hzr4fBAy.js'
import { t as z } from './CrudPage-7Q0FEhS_.js'
import { t as F } from './CrudRowActions-Dmc4i_Io.js'
import { d as K } from './wms-TgZ5oe41.js'
var L = { key: 0 },
  j = N({
    __name: 'InventoryTraceDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, traceData: { required: !0 }, traceDataModifiers: {} },
    emits: ['update:visible', 'update:traceData'],
    setup(v) {
      const u = h(v, 'visible'),
        p = h(v, 'traceData')
      return (g, t) => {
        const i = $,
          d = M,
          y = W
        return (
          s(),
          m(
            y,
            {
              modelValue: u.value,
              'onUpdate:modelValue': t[0] || (t[0] = (r) => (u.value = r)),
              title: '批次追溯',
              width: '700px',
              'lock-scroll': !1
            },
            {
              default: n(() => [
                p.value.length
                  ? (s(),
                    k('div', L, [
                      f(d, null, {
                        default: n(() => [
                          (s(!0),
                          k(
                            O,
                            null,
                            R(
                              p.value,
                              (r, _) => (
                                s(),
                                m(i, { key: _, timestamp: r.time, type: r.type }, { default: n(() => [I(x(r.desc), 1)]), _: 2 }, 1032, [
                                  'timestamp',
                                  'type'
                                ])
                              )
                            ),
                            128
                          ))
                        ]),
                        _: 1
                      })
                    ]))
                  : D('', !0)
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
  H = j,
  X = { class: 'qty-cell' },
  Y = N({
    __name: 'index',
    setup(v) {
      const u = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入物料编码或物料名称', clearable: !0 } },
          {
            type: 'select-v2',
            label: '仓库',
            field: 'warehouse',
            props: {
              options: [
                { label: '原材料仓', value: '原材料仓' },
                { label: '标准件仓', value: '标准件仓' },
                { label: '半成品仓', value: '半成品仓' },
                { label: '成品仓', value: '成品仓' }
              ],
              clearable: !0
            }
          }
        ],
        p = [
          { prop: 'code', label: '物料编码', width: 170 },
          { prop: 'name', label: '物料名称', minWidth: 140 },
          { prop: 'spec', label: '规格型号', width: 140 },
          { prop: 'warehouse', label: '仓库', width: 110 },
          { prop: 'location', label: '库位', width: 110 },
          { prop: 'lot', label: '批次号', width: 150 },
          { label: '当前库存', minWidth: 160, slotName: 'qty', align: 'center' },
          { prop: 'safety', label: '安全库存', minWidth: 100, align: 'center' },
          { prop: 'reserved', label: '已预留', minWidth: 90, align: 'center' },
          { prop: 'available', label: '可用库存', minWidth: 100, align: 'center' },
          { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        g = [{ key: 'trace', label: '批次追溯', tone: 'primary' }]
      let t = B({ keyword: '', warehouse: '' })
      const i = w(!1),
        d = w([]),
        {
          tableData: y,
          pagination: r,
          loading: _,
          search: b
        } = U({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => {
            const c = await K({ pageNum: e, pageSize: l, code: t.keyword || void 0, name: t.keyword || void 0, warehouse: t.warehouse || void 0 })
            return { list: c.data.list.map(T), total: c.data.total }
          }
        })
      function T(e) {
        return {
          id: String(e.id),
          code: e.code || '',
          name: e.name || '',
          spec: e.spec || '',
          warehouse: e.warehouse || '',
          location: e.location || '',
          lot: e.lot || '',
          qty: Number(e.qty ?? 0),
          reserved: Number(e.reserved ?? 0),
          available: Number(e.available ?? 0),
          safety: Number(e.safety ?? 0),
          unit: e.unit || ''
        }
      }
      function V() {
        ;(Object.assign(t, { keyword: '', warehouse: '' }), b())
      }
      function C(e) {
        ;((d.value = [
          { time: '2025-01-15 14:00', type: 'primary', desc: `${e.name} 入库 ${e.qty}${e.unit}` },
          { time: '2025-01-14 10:00', type: 'success', desc: '工单 WO202501150001 完工入库' },
          { time: '2025-01-05 08:00', type: 'warning', desc: `批次 ${e.lot} 来源采购单 PO202501010005` }
        ]),
          (i.value = !0))
      }
      return (e, l) => {
        const c = S
        return (
          s(),
          m(
            z,
            {
              'search-model': o(t),
              'onUpdate:searchModel': l[2] || (l[2] = (a) => (A(t) ? (t.value = a) : (t = a))),
              title: '库存台账',
              'search-columns': u,
              columns: p,
              data: o(y),
              pagination: o(r),
              loading: o(_),
              'show-add-button': !1,
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: o(b),
              onReset: V,
              onRefresh: o(b)
            },
            {
              qty: n(({ row: a }) => [
                q('div', X, [
                  q('span', { class: E({ 'qty-warn': a.qty < a.safety }) }, x(a.qty), 3),
                  a.qty < a.safety
                    ? (s(),
                      m(
                        c,
                        { key: 0, type: 'danger', size: 'small', class: 'qty-tag' },
                        { default: n(() => [...(l[3] || (l[3] = [I('低于安全库存', -1)]))]), _: 1 }
                      ))
                    : D('', !0)
                ])
              ]),
              actions: n(({ row: a }) => [f(F, { actions: g, onAction: (G) => C(a) }, null, 8, ['onAction'])]),
              dialog: n(() => [
                f(
                  H,
                  {
                    visible: i.value,
                    'onUpdate:visible': l[0] || (l[0] = (a) => (i.value = a)),
                    'trace-data': d.value,
                    'onUpdate:traceData': l[1] || (l[1] = (a) => (d.value = a))
                  },
                  null,
                  8,
                  ['visible', 'trace-data']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  le = P(Y, [['__scopeId', 'data-v-d3cbe85e']])
export { le as default }

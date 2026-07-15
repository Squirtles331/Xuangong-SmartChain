import {
  Bn as s,
  F as Y,
  Fn as x,
  H as A,
  On as q,
  Xn as _,
  an as M,
  b as B,
  dn as l,
  i as E,
  in as Z,
  it as ee,
  nt as te,
  or as ae,
  ot as P,
  pn as U,
  rr as C,
  rt as le,
  sr as D,
  un as y,
  y as Q,
  yn as T
} from './element-plus-CzL7BOKu.js'
import { t as oe } from './useTable-Hzr4fBAy.js'
import { t as se } from './CrudPage-7Q0FEhS_.js'
import { t as ne } from './CrudRowActions-Dmc4i_Io.js'
import { S as ie, _ as ue, g as re, t as de } from './wms-TgZ5oe41.js'
var pe = U({
    __name: 'StockCountExecuteDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, items: { required: !0 }, itemsModifiers: {} },
    emits: T(['submit'], ['update:visible', 'update:items']),
    setup(g, { emit: w }) {
      const c = x(g, 'visible'),
        k = x(g, 'items'),
        r = w
      return (V, a) => {
        const u = B,
          p = Y,
          b = Q,
          m = P,
          f = A
        return (
          q(),
          M(
            f,
            {
              modelValue: c.value,
              'onUpdate:modelValue': a[2] || (a[2] = (i) => (c.value = i)),
              title: '盘点执行',
              width: '700px',
              'lock-scroll': !1
            },
            {
              footer: s(() => [
                l(m, { onClick: a[0] || (a[0] = (i) => (c.value = !1)) }, { default: s(() => [...(a[3] || (a[3] = [y('保存草稿', -1)]))]), _: 1 }),
                l(
                  m,
                  { type: 'primary', onClick: a[1] || (a[1] = (i) => r('submit')) },
                  { default: s(() => [...(a[4] || (a[4] = [y('提交结果', -1)]))]), _: 1 }
                )
              ]),
              default: s(() => [
                l(
                  b,
                  { data: k.value, border: '', size: 'small' },
                  {
                    default: s(() => [
                      l(u, { prop: 'location', label: '库位', width: '120' }),
                      l(u, { prop: 'material', label: '物料名称', 'min-width': '180' }),
                      l(u, { prop: 'bookQty', label: '账面数量', width: '100', align: 'center' }),
                      l(
                        u,
                        { label: '实盘数量', width: '130' },
                        {
                          default: s(({ row: i }) => [
                            l(p, { modelValue: i.actual, 'onUpdate:modelValue': (n) => (i.actual = n), min: 0, size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
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
            ['modelValue']
          )
        )
      }
    }
  }),
  ce = pe,
  me = U({
    __name: 'StockCountDiffDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, items: { required: !0 }, itemsModifiers: {} },
    emits: T(['submit'], ['update:visible', 'update:items']),
    setup(g, { emit: w }) {
      const c = x(g, 'visible'),
        k = x(g, 'items'),
        r = w
      return (V, a) => {
        const u = B,
          p = te,
          b = le,
          m = Q,
          f = P,
          i = A
        return (
          q(),
          M(
            i,
            {
              modelValue: c.value,
              'onUpdate:modelValue': a[2] || (a[2] = (n) => (c.value = n)),
              title: '盘点差异处理',
              width: '700px',
              'lock-scroll': !1
            },
            {
              footer: s(() => [
                l(f, { onClick: a[0] || (a[0] = (n) => (c.value = !1)) }, { default: s(() => [...(a[3] || (a[3] = [y('取消', -1)]))]), _: 1 }),
                l(
                  f,
                  { type: 'primary', onClick: a[1] || (a[1] = (n) => r('submit')) },
                  { default: s(() => [...(a[4] || (a[4] = [y('确认处理', -1)]))]), _: 1 }
                )
              ]),
              default: s(() => [
                l(
                  m,
                  { data: k.value, border: '', size: 'small' },
                  {
                    default: s(() => [
                      l(u, { prop: 'material', label: '物料名称', 'min-width': '180' }),
                      l(u, { prop: 'bookQty', label: '账面数量', width: '100', align: 'center' }),
                      l(u, { prop: 'actualQty', label: '实盘数量', width: '100', align: 'center' }),
                      l(
                        u,
                        { label: '差异数量', width: '100', align: 'center' },
                        {
                          default: s(({ row: n }) => [
                            Z(
                              'span',
                              { style: ae({ color: n.diff > 0 ? '#f56c6c' : n.diff < 0 ? '#67c23a' : '' }) },
                              D(n.diff > 0 ? '+' : '') + D(n.diff),
                              5
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        u,
                        { label: '处理方式', width: '150' },
                        {
                          default: s(({ row: n }) => [
                            l(
                              b,
                              { modelValue: n.disposition, 'onUpdate:modelValue': (S) => (n.disposition = S), size: 'small' },
                              {
                                default: s(() => [
                                  l(p, { label: '盘盈入账', value: 'profit' }),
                                  l(p, { label: '盘亏出账', value: 'loss' }),
                                  l(p, { label: '忽略差异', value: 'ignore' })
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
  fe = me,
  be = U({
    __name: 'index',
    setup(g) {
      const w = { pending: '待执行', counting: '执行中', completed: '已完成' },
        c = { pending: 'warning', counting: 'primary', completed: 'success' },
        k = [
          { label: '原材料仓', value: '原材料仓' },
          { label: '标准件仓', value: '标准件仓' },
          { label: '半成品仓', value: '半成品仓' },
          { label: '成品仓', value: '成品仓' }
        ],
        r = _({ keyword: '', warehouse: '', status: '' }),
        V = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入盘点计划号', clearable: !0 } },
          { type: 'select-v2', label: '仓库', field: 'warehouse', props: { options: k, clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待执行', value: 'pending' },
                { label: '执行中', value: 'counting' },
                { label: '已完成', value: 'completed' }
              ],
              clearable: !0
            }
          }
        ],
        a = _([]),
        u = _([]),
        p = _([]),
        b = _([]),
        m = _(!1),
        f = _(!1),
        i = _(''),
        n = [
          { prop: 'code', label: '计划号', width: 160 },
          { prop: 'warehouse', label: '仓库', width: 120 },
          { label: '盘点类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'planDate', label: '计划日期', width: 120 },
          { prop: 'executor', label: '执行人', width: 100 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 140, slotName: 'actions', align: 'center' }
        ],
        {
          tableData: S,
          pagination: I,
          loading: L,
          search: R,
          refresh: N
        } = oe({
          rowKey: 'id',
          listAPI: async ({ page: o, size: e }) => {
            const [d, t] = await Promise.all([
              ue({
                pageNum: 1,
                pageSize: 200,
                planCode: r.value.keyword || void 0,
                warehouse: r.value.warehouse || void 0,
                status: r.value.status || void 0
              }),
              re({ pageNum: 1, pageSize: 200, planCode: r.value.keyword || void 0 })
            ])
            ;((a.value = d.data.list.map((v) => ({ ...v, id: String(v.id), actual: Number(v.actual_qty ?? v.book_qty ?? 0) }))),
              (u.value = t.data.list.map((v) => ({ ...v, id: String(v.id), disposition: v.disposition || 'ignore' }))))
            const h = $(a.value),
              z = (o - 1) * e,
              J = z + e
            return { list: h.slice(z, J), total: h.length }
          }
        })
      function $(o) {
        const e = new Map()
        return (
          o.forEach((d) => {
            const t = String(d.plan_code || '')
            !t ||
              e.has(t) ||
              e.set(t, {
                id: t,
                code: t,
                warehouse: d.warehouse || '',
                type: d.type || 'cycle',
                planDate: d.plan_date || '',
                executor: d.executor || '',
                status: d.status || 'pending'
              })
          }),
          Array.from(e.values())
        )
      }
      function O() {
        ;((r.value = { keyword: '', warehouse: '', status: '' }), R())
      }
      function W() {
        E.info('当前为静态演示模式，暂不提供新增盘点计划')
      }
      function F(o) {
        return o.status === 'pending' ? [{ key: 'start', label: '开始盘点', tone: 'primary' }] : [{ key: 'diff', label: '查看差异', tone: 'success' }]
      }
      function H(o, e) {
        if (o === 'start') {
          K(e)
          return
        }
        o === 'diff' && j(e)
      }
      function K(o) {
        ;((i.value = o.code),
          (o.status = 'counting'),
          (p.value = a.value
            .filter((e) => e.plan_code === o.code)
            .map((e) => ({
              location: e.location,
              material: e.material,
              bookQty: Number(e.book_qty ?? 0),
              actual: Number(e.actual_qty ?? e.book_qty ?? 0)
            }))),
          (m.value = !0))
      }
      async function X() {
        await de(i.value, p.value)
        const o = S.value.find((e) => e.code === i.value)
        ;(o && (o.status = 'completed'), (m.value = !1), E.success('盘点结果已提交'), await N())
      }
      function j(o) {
        ;((i.value = o.code),
          (b.value = u.value
            .filter((e) => e.plan_code === o.code)
            .map((e) => ({
              material: e.material,
              bookQty: Number(e.book_qty ?? 0),
              actualQty: Number(e.actual_qty ?? 0),
              diff: Number(e.diff ?? 0),
              disposition: e.disposition || 'ignore'
            }))),
          (f.value = !0))
      }
      async function G() {
        ;(await ie(
          i.value,
          b.value.map((o) => ({ material: o.material, disposition: o.disposition }))
        ),
          (f.value = !1),
          E.success('差异处理已确认'),
          await N())
      }
      return (o, e) => {
        const d = ee
        return (
          q(),
          M(
            se,
            {
              'search-model': r.value,
              'onUpdate:searchModel': e[4] || (e[4] = (t) => (r.value = t)),
              title: '库存盘点计划',
              'search-columns': V,
              columns: n,
              data: C(S),
              pagination: C(I),
              loading: C(L),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: C(R),
              onReset: O,
              onRefresh: C(N),
              onAdd: W
            },
            {
              type: s(({ row: t }) => [
                l(
                  d,
                  { type: t.type === 'full' ? 'danger' : 'warning', size: 'small' },
                  { default: s(() => [y(D(t.type === 'full' ? '全盘' : '循环盘点'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              status: s(({ row: t }) => [
                l(d, { type: c[t.status] || 'info', size: 'small' }, { default: s(() => [y(D(w[t.status] || t.status), 1)]), _: 2 }, 1032, ['type'])
              ]),
              actions: s(({ row: t }) => [l(ne, { actions: F(t), onAction: (h) => H(h, t) }, null, 8, ['actions', 'onAction'])]),
              dialog: s(() => [
                l(
                  ce,
                  {
                    visible: m.value,
                    'onUpdate:visible': e[0] || (e[0] = (t) => (m.value = t)),
                    items: p.value,
                    'onUpdate:items': e[1] || (e[1] = (t) => (p.value = t)),
                    onSubmit: X
                  },
                  null,
                  8,
                  ['visible', 'items']
                ),
                l(
                  fe,
                  {
                    visible: f.value,
                    'onUpdate:visible': e[2] || (e[2] = (t) => (f.value = t)),
                    items: b.value,
                    'onUpdate:items': e[3] || (e[3] = (t) => (b.value = t)),
                    onSubmit: G
                  },
                  null,
                  8,
                  ['visible', 'items']
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
  ke = be
export { ke as default }

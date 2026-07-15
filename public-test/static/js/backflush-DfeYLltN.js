import {
  Bn as s,
  Fn as D,
  On as x,
  Xn as p,
  an as B,
  dn as _,
  i as C,
  in as w,
  it as z,
  or as M,
  pn as Q,
  rn as E,
  rr as u,
  sr as c,
  un as O,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { t as P } from './useTable-Hzr4fBAy.js'
import { t as T } from './CrudFormDialog-1OgQthWb.js'
import { t as I } from './CrudPage-7Q0FEhS_.js'
import { t as K } from './CrudRowActions-Dmc4i_Io.js'
import { c as L } from './wms-TgZ5oe41.js'
var X = Q({
    __name: 'BackflushFormDialog',
    props: N({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: N(['submit'], ['update:visible', 'update:form']),
    setup(r, { emit: n }) {
      const d = D(r, 'visible'),
        i = D(r, 'form'),
        b = n,
        v = E(() => [
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '工单号', field: 'woCode', required: !0 },
          { type: 'input-number', label: 'BOM 用量', field: 'bomQty', required: !0, props: { min: 0 } },
          { type: 'input-number', label: '实际用量', field: 'actualQty', required: !0, props: { min: 0 } },
          { type: 'date-picker', label: '倒冲日期', field: 'backflushDate', props: { valueFormat: 'YYYY-MM-DD' } }
        ])
      function y() {
        return !i.value.material || !i.value.woCode
          ? (C.warning('请填写必填项'), !1)
          : ((i.value.diff = Number(i.value.actualQty || 0) - Number(i.value.bomQty || 0)), !0)
      }
      return (g, o) => (
        x(),
        B(
          T,
          {
            visible: d.value,
            'onUpdate:visible': o[0] || (o[0] = (l) => (d.value = l)),
            form: i.value,
            'onUpdate:form': o[1] || (o[1] = (l) => (i.value = l)),
            title: r.mode === 'add' ? '新增倒冲记录' : '编辑倒冲记录',
            columns: v.value,
            'label-width': 100,
            width: '600px',
            'before-submit': y,
            onSubmit: o[2] || (o[2] = (l) => b('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  $ = X,
  j = Q({
    __name: 'index',
    setup(r) {
      const n = p({ keyword: '', status: '' }),
        d = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入工单号或物料名称', clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待倒冲', value: 'pending' },
                { label: '已倒冲', value: 'completed' }
              ],
              clearable: !0
            }
          }
        ],
        i = [
          { prop: 'material', label: '物料名称', minWidth: 180 },
          { prop: 'woCode', label: '工单号', minWidth: 170 },
          { prop: 'bomQty', label: 'BOM 用量', minWidth: 100, align: 'center' },
          { prop: 'actualQty', label: '实际用量', minWidth: 100, align: 'center' },
          { prop: 'diff', label: '差异数量', minWidth: 90, align: 'center', slotName: 'diff' },
          { label: '差异率', minWidth: 90, slotName: 'diffRate', align: 'center' },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'backflushDate', label: '倒冲日期', minWidth: 110 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        {
          tableData: b,
          pagination: v,
          loading: y,
          search: g,
          refresh: o
        } = P({
          rowKey: 'id',
          listAPI: async ({ page: t, size: a }) => {
            const m = await L({
              pageNum: t,
              pageSize: a,
              code: n.value.keyword || void 0,
              material: n.value.keyword || void 0,
              status: n.value.status || void 0
            })
            return { list: m.data.list.map(R), total: m.data.total }
          }
        }),
        l = p(!1),
        h = p('add'),
        f = p(k())
      function R(t) {
        return {
          id: String(t.id),
          material: t.material || '',
          woCode: t.wo_code || '',
          bomQty: Number(t.bom_qty ?? 0),
          actualQty: Number(t.actual_qty ?? 0),
          diff: Number(t.diff ?? 0),
          status: t.status || '',
          backflushDate: t.backflush_date || ''
        }
      }
      function q() {
        ;((n.value = { keyword: '', status: '' }), g())
      }
      function k() {
        return { id: '', material: '', woCode: '', bomQty: 0, actualQty: 0, diff: 0, status: 'pending', backflushDate: '' }
      }
      function S() {
        ;((h.value = 'add'), (f.value = k()), (l.value = !0))
      }
      function W(t) {
        ;((h.value = 'edit'), (f.value = { ...t }), (l.value = !0))
      }
      function A(t) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'execute', label: '执行倒冲', tone: 'secondary', hidden: t.status !== 'pending' }
        ]
      }
      function F(t, a) {
        if (t === 'edit') {
          W(a)
          return
        }
        t === 'execute' && V(a)
      }
      async function U() {
        ;((l.value = !1), await o())
      }
      function V(t) {
        ;((t.status = 'completed'), C.success('倒冲完成，库存已同步更新'))
      }
      return (t, a) => {
        const m = z
        return (
          x(),
          B(
            I,
            {
              'search-model': n.value,
              'onUpdate:searchModel': a[2] || (a[2] = (e) => (n.value = e)),
              title: '倒冲记录',
              'search-columns': d,
              columns: i,
              data: u(b),
              pagination: u(v),
              loading: u(y),
              onSearch: u(g),
              onReset: q,
              onRefresh: u(o),
              onAdd: S
            },
            {
              status: s(({ row: e }) => [
                _(
                  m,
                  { type: e.status === 'pending' ? 'warning' : 'success', size: 'small' },
                  { default: s(() => [O(c(e.status === 'pending' ? '待倒冲' : '已倒冲'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              diff: s(({ row: e }) => [
                w(
                  'span',
                  { style: M({ color: e.diff > 0 ? '#f56c6c' : e.diff < 0 ? '#67c23a' : '#909399' }) },
                  c(e.diff > 0 ? '+' : '') + c(e.diff),
                  5
                )
              ]),
              diffRate: s(({ row: e }) => [
                w(
                  'span',
                  { style: M({ color: e.diff > 0 ? '#f56c6c' : e.diff < 0 ? '#67c23a' : '#909399' }) },
                  c(e.bomQty > 0 ? ((Math.abs(e.diff) / e.bomQty) * 100).toFixed(2) : '0.00') + '% ',
                  5
                )
              ]),
              actions: s(({ row: e }) => [_(K, { actions: A(e), onAction: (Y) => F(Y, e) }, null, 8, ['actions', 'onAction'])]),
              dialog: s(() => [
                _(
                  $,
                  {
                    visible: l.value,
                    'onUpdate:visible': a[0] || (a[0] = (e) => (l.value = e)),
                    form: f.value,
                    'onUpdate:form': a[1] || (a[1] = (e) => (f.value = e)),
                    mode: h.value,
                    onSubmit: U
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
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
  ae = j
export { ae as default }

import {
  Bn as c,
  Fn as P,
  On as D,
  Xn as v,
  an as M,
  dn as y,
  i as f,
  it as V,
  pn as S,
  rn as z,
  rr as r,
  sr as I,
  un as O,
  yn as x
} from './element-plus-CzL7BOKu.js'
import { t as K } from './useTable-Hzr4fBAy.js'
import { t as L } from './CrudFormDialog-1OgQthWb.js'
import { t as X } from './CrudPage-7Q0FEhS_.js'
import { t as $ } from './CrudRowActions-Dmc4i_Io.js'
import { n as j, o as G, p as H, y as J } from './wms-TgZ5oe41.js'
var Q = S({
    __name: 'PickingFormDialog',
    props: x({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: x(['submit'], ['update:visible', 'update:form']),
    setup(d, { emit: b }) {
      const o = P(d, 'visible'),
        s = P(d, 'form'),
        g = b,
        w = z(() => [
          { type: 'input', label: '工单号', field: 'woCode', required: !0 },
          { type: 'input', label: '产品名称', field: 'material', required: !0 },
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
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待拣料', value: 'pending' },
                { label: '已拣料', value: 'picked' },
                { label: '已出库', value: 'completed' }
              ]
            }
          }
        ])
      function h() {
        return !s.value.woCode || !s.value.material ? (f.warning('请填写必填项'), !1) : !0
      }
      return (_, i) => (
        D(),
        M(
          L,
          {
            visible: o.value,
            'onUpdate:visible': i[0] || (i[0] = (u) => (o.value = u)),
            form: s.value,
            'onUpdate:form': i[1] || (i[1] = (u) => (s.value = u)),
            title: d.mode === 'add' ? '新增领料单' : '编辑领料单',
            columns: w.value,
            'label-width': 100,
            width: '600px',
            'before-submit': h,
            onSubmit: i[2] || (i[2] = (u) => g('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  Y = Q,
  Z = S({
    __name: 'index',
    setup(d) {
      const b = [
          { label: '原材料仓', value: '原材料仓' },
          { label: '标准件仓', value: '标准件仓' },
          { label: '半成品仓', value: '半成品仓' },
          { label: '成品仓', value: '成品仓' }
        ],
        o = v({ woCode: '', status: '' }),
        s = [
          { type: 'input', label: '工单号', field: 'woCode', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '待拣料', value: 'pending' },
                { label: '已拣料', value: 'picked' },
                { label: '已出库', value: 'completed' }
              ],
              clearable: !0
            }
          }
        ],
        g = [
          { prop: 'woCode', label: '工单号', width: 170 },
          { prop: 'material', label: '产品名称', minWidth: 160 },
          { prop: 'warehouse', label: '仓库', width: 110 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'createdAt', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        w = [{ key: 'export', label: '导出' }],
        h = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        {
          tableData: _,
          pagination: i,
          loading: u,
          search: C,
          refresh: k,
          onDelete: R
        } = K({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const m = await H({ pageNum: e, pageSize: t, code: o.value.woCode || void 0, status: o.value.status || void 0 })
            return { list: m.data.list.map(F), total: m.data.total }
          },
          deleteAPI: (e) => Promise.all(e.map((t) => G(t)))
        }),
        n = v(!1),
        p = v('add'),
        a = v(A())
      function F(e) {
        return {
          id: String(e.id),
          woCode: e.wo_code || '',
          material: e.material || '',
          warehouse: e.warehouse || '',
          status: e.status || '',
          createdAt: e.created_at || ''
        }
      }
      function q() {
        ;((o.value = { woCode: '', status: '' }), C())
      }
      function N(e) {
        e === 'export' && f.success('导出成功')
      }
      function A() {
        return { id: '', woCode: '', material: '', warehouse: b[0].value, status: 'pending' }
      }
      function T() {
        ;((p.value = 'add'), (a.value = A()), (n.value = !0))
      }
      function U(e) {
        ;((p.value = 'edit'),
          (a.value = { id: e.id, woCode: e.woCode, material: e.material, warehouse: e.warehouse, status: e.status }),
          (n.value = !0))
      }
      function B(e, t) {
        if (e === 'edit') {
          U(t)
          return
        }
        e === 'delete' && R(t)
      }
      async function W() {
        ;(p.value === 'add'
          ? (await j({ woCode: a.value.woCode, material: a.value.material, warehouse: a.value.warehouse, status: a.value.status }),
            f.success('领料单创建成功'))
          : (await J(a.value.id, { wo_code: a.value.woCode, material: a.value.material, warehouse: a.value.warehouse, status: a.value.status }),
            f.success('领料单更新成功')),
          (n.value = !1),
          await k())
      }
      return (e, t) => {
        const m = V
        return (
          D(),
          M(
            X,
            {
              'search-model': o.value,
              'onUpdate:searchModel': t[2] || (t[2] = (l) => (o.value = l)),
              title: '生产领料单列表',
              'search-columns': s,
              columns: g,
              data: r(_),
              pagination: r(i),
              loading: r(u),
              'toolbar-actions': w,
              onSearch: r(C),
              onReset: q,
              onRefresh: r(k),
              onAdd: T,
              onToolbarAction: N
            },
            {
              status: c(({ row: l }) => [
                y(
                  m,
                  { type: l.status === 'pending' ? 'warning' : l.status === 'picked' ? 'primary' : 'success', size: 'small' },
                  { default: c(() => [O(I(l.status === 'pending' ? '待拣料' : l.status === 'picked' ? '已拣料' : '已出库'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: c(({ row: l }) => [y($, { actions: h, onAction: (E) => B(E, l) }, null, 8, ['onAction'])]),
              dialog: c(() => [
                y(
                  Y,
                  {
                    visible: n.value,
                    'onUpdate:visible': t[0] || (t[0] = (l) => (n.value = l)),
                    form: a.value,
                    'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
                    mode: p.value,
                    onSubmit: W
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
  se = Z
export { se as default }

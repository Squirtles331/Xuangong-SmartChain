import { Bn as v, Fn as R, On as S, Xn as m, an as M, dn as b, i as f, pn as C, rn as V, rr as n, yn as x } from './element-plus-CzL7BOKu.js'
import { t as z } from './useTable-Hzr4fBAy.js'
import { t as D } from './StatusTag-DWd3m1xj.js'
import { t as K } from './CrudFormDialog-1OgQthWb.js'
import { t as L } from './CrudPage-7Q0FEhS_.js'
import { t as X } from './CrudRowActions-Dmc4i_Io.js'
import { b as $, m as j, r as G, s as H } from './wms-TgZ5oe41.js'
var J = C({
    __name: 'ReceiptFormDialog',
    props: x({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: x(['submit'], ['update:visible', 'update:form']),
    setup(d, { emit: p }) {
      const i = R(d, 'visible'),
        s = R(d, 'form'),
        y = p,
        g = V(() => [
          { type: 'input', label: '入库单号', field: 'code', required: !0 },
          {
            type: 'select-v2',
            label: '入库类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '采购入库', value: 'purchase' },
                { label: '生产入库', value: 'production' }
              ]
            }
          },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } },
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
          }
        ])
      function h() {
        return !s.value.code || !s.value.material ? (f.warning('请填写必填项'), !1) : !0
      }
      return (w, l) => (
        S(),
        M(
          K,
          {
            visible: i.value,
            'onUpdate:visible': l[0] || (l[0] = (u) => (i.value = u)),
            title: d.mode === 'add' ? '新增入库单' : '编辑入库单',
            form: s.value,
            'onUpdate:form': l[1] || (l[1] = (u) => (s.value = u)),
            columns: g.value,
            'label-width': 100,
            width: '600px',
            'before-submit': h,
            onSubmit: l[2] || (l[2] = (u) => y('submit'))
          },
          null,
          8,
          ['visible', 'title', 'form', 'columns']
        )
      )
    }
  }),
  Q = J,
  Y = C({
    __name: 'index',
    setup(d) {
      const p = [
          { value: 'purchase', label: '采购入库', type: 'primary' },
          { value: 'production', label: '生产入库', type: 'success' }
        ],
        i = [
          { value: 'pending', label: '待入库', type: 'warning' },
          { value: 'completed', label: '已入库', type: 'success' }
        ],
        s = [
          { label: '原材料仓', value: '原材料仓' },
          { label: '标准件仓', value: '标准件仓' },
          { label: '半成品仓', value: '半成品仓' },
          { label: '成品仓', value: '成品仓' }
        ],
        y = [
          { type: 'input', label: '入库单号', field: 'code', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '入库类型',
            field: 'type',
            props: { options: p.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: i.map((e) => ({ label: e.label, value: e.value })), clearable: !0 } }
        ],
        g = [
          { prop: 'code', label: '入库单号', width: 160 },
          { label: '入库类型', minWidth: 110, slotName: 'type', align: 'center' },
          { prop: 'material', label: '物料名称', minWidth: 160 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { prop: 'warehouse', label: '仓库', width: 110 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { prop: 'createdAt', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        h = [{ key: 'export', label: '导出' }],
        w = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = m({ code: '', type: '', status: '' }),
        {
          tableData: u,
          pagination: F,
          loading: N,
          search: q,
          refresh: _,
          onDelete: W
        } = z({
          rowKey: 'id',
          listAPI: async ({ page: e, size: o }) => {
            const a = await j({
              pageNum: e,
              pageSize: o,
              code: l.value.code || void 0,
              type: l.value.type || void 0,
              status: l.value.status || void 0
            })
            return { list: a.data.list.map(k), total: a.data.total }
          },
          deleteAPI: (e) => Promise.all(e.map((o) => H(o)))
        }),
        r = m(!1),
        c = m('add'),
        t = m(A())
      function k(e) {
        return {
          id: String(e.id),
          code: e.code || '',
          type: e.type || '',
          material: e.material || '',
          qty: Number(e.qty ?? 0),
          warehouse: e.warehouse || '',
          status: e.status || '',
          createdAt: e.created_at || ''
        }
      }
      function P() {
        ;((l.value = { code: '', type: '', status: '' }), q())
      }
      function T(e) {
        e === 'export' && f.success('导出成功')
      }
      function A() {
        return { id: '', code: '', type: 'purchase', material: '', qty: 1, warehouse: s[0].value, status: 'pending' }
      }
      function U() {
        ;((c.value = 'add'), (t.value = A()), (r.value = !0))
      }
      function B(e) {
        ;((c.value = 'edit'),
          (t.value = { id: e.id, code: e.code, type: e.type, material: e.material, qty: e.qty, warehouse: e.warehouse, status: e.status }),
          (r.value = !0))
      }
      function O(e, o) {
        if (e === 'edit') {
          B(o)
          return
        }
        e === 'delete' && W(o)
      }
      async function E() {
        ;(c.value === 'add'
          ? (await G({
              code: t.value.code,
              type: t.value.type,
              material: t.value.material,
              qty: t.value.qty,
              warehouse: t.value.warehouse,
              status: t.value.status
            }),
            f.success('入库单创建成功'))
          : (await $(t.value.id, {
              code: t.value.code,
              type: t.value.type,
              material: t.value.material,
              qty: t.value.qty,
              warehouse: t.value.warehouse,
              status: t.value.status
            }),
            f.success('入库单更新成功')),
          (r.value = !1),
          await _())
      }
      return (e, o) => (
        S(),
        M(
          L,
          {
            'search-model': l.value,
            'onUpdate:searchModel': o[2] || (o[2] = (a) => (l.value = a)),
            title: '收货入库单列表',
            'search-columns': y,
            columns: g,
            data: n(u),
            pagination: n(F),
            loading: n(N),
            'toolbar-actions': h,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: n(q),
            onReset: P,
            onRefresh: n(_),
            onAdd: U,
            onToolbarAction: T
          },
          {
            type: v(({ row: a }) => [b(D, { value: a.type, options: p }, null, 8, ['value'])]),
            status: v(({ row: a }) => [b(D, { value: a.status, options: i }, null, 8, ['value'])]),
            actions: v(({ row: a }) => [b(X, { actions: w, onAction: (I) => O(I, a) }, null, 8, ['onAction'])]),
            dialog: v(() => [
              b(
                Q,
                {
                  visible: r.value,
                  'onUpdate:visible': o[0] || (o[0] = (a) => (r.value = a)),
                  form: t.value,
                  'onUpdate:form': o[1] || (o[1] = (a) => (t.value = a)),
                  mode: c.value,
                  onSubmit: E
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
  }),
  ue = Y
export { ue as default }

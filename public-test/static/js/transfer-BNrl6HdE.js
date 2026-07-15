import {
  Bn as m,
  Fn as w,
  Kn as O,
  On as x,
  Xn as q,
  Yn as P,
  an as D,
  dn as _,
  i as f,
  it as z,
  pn as T,
  rn as I,
  rr as n,
  sr as V,
  un as E,
  yn as K
} from './element-plus-CzL7BOKu.js'
import { t as L } from './useTable-Hzr4fBAy.js'
import { t as j } from './CrudFormDialog-1OgQthWb.js'
import { t as G } from './CrudPage-7Q0FEhS_.js'
import { t as X } from './CrudRowActions-Dmc4i_Io.js'
import { C as W, a as Y, v as H } from './wms-TgZ5oe41.js'
var J = T({
    __name: 'TransferFormDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} },
    emits: K(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: s }) {
      const u = w(c, 'visible'),
        l = w(c, 'form'),
        v = s,
        b = I(() => [
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input-number', label: '数量', field: 'qty', required: !0, props: { min: 1 } },
          {
            type: 'select-v2',
            label: '调出仓库',
            field: 'from_wh',
            required: !0,
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
            label: '调入仓库',
            field: 'to_wh',
            required: !0,
            props: {
              options: [
                { label: '机加工线边仓', value: '机加工线边仓' },
                { label: '装配线边仓', value: '装配线边仓' },
                { label: '发货暂存区', value: '发货暂存区' },
                { label: '成品仓', value: '成品仓' }
              ]
            }
          }
        ])
      function h() {
        return !l.value.material || !l.value.from_wh || !l.value.to_wh ? (f.warning('请填写必填项'), !1) : !0
      }
      return (g, o) => (
        x(),
        D(
          j,
          {
            visible: u.value,
            'onUpdate:visible': o[0] || (o[0] = (r) => (u.value = r)),
            form: l.value,
            'onUpdate:form': o[1] || (o[1] = (r) => (l.value = r)),
            title: '新建调拨单',
            columns: b.value,
            'label-width': 100,
            width: '550px',
            'before-submit': h,
            onSubmit: o[2] || (o[2] = (r) => v('submit'))
          },
          null,
          8,
          ['visible', 'form', 'columns']
        )
      )
    }
  }),
  Q = J,
  Z = T({
    __name: 'index',
    setup(c) {
      let s = P({ code: '', fromWarehouse: '', toWarehouse: '', status: '' })
      const u = ['原材料仓', '标准件仓', '半成品仓', '成品仓', '机加线边仓', '装配线边仓', '发货暂存区'].map((e) => ({ label: e, value: e })),
        l = [
          { type: 'input', label: '调拨单号', field: 'code', props: { clearable: !0 } },
          { type: 'select-v2', label: '调出仓库', field: 'fromWarehouse', props: { options: u, clearable: !0 } },
          { type: 'select-v2', label: '调入仓库', field: 'toWarehouse', props: { options: u, clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              clearable: !0,
              options: [
                { label: '待调出', value: 'pending' },
                { label: '在途', value: 'transit' },
                { label: '已完成', value: 'completed' }
              ]
            }
          }
        ],
        v = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        {
          tableData: b,
          pagination: h,
          loading: g,
          search: o,
          refresh: r
        } = L({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const p = await H({
              pageNum: e,
              pageSize: t,
              code: s.code || void 0,
              fromWarehouse: s.fromWarehouse || void 0,
              toWarehouse: s.toWarehouse || void 0,
              status: s.status || void 0
            })
            return { list: p.data.list.map(R), total: p.data.total }
          }
        }),
        C = [
          { prop: 'code', label: '调拨单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 160 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { prop: 'from_wh', label: '调出仓库', width: 120 },
          { prop: 'to_wh', label: '调入仓库', width: 120 },
          { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 180, slotName: 'actions', align: 'center' }
        ],
        d = q(!1),
        i = q(y())
      function R(e) {
        return {
          id: String(e.id),
          code: e.code || '',
          material: e.material || '',
          qty: Number(e.qty ?? 0),
          from_wh: e.from_wh || '',
          to_wh: e.to_wh || '',
          status: e.status || '',
          out_time: e.out_time || ''
        }
      }
      function y() {
        return { material: '', qty: 1, from_wh: '原材料仓', to_wh: '机加线边仓' }
      }
      function S() {
        ;(Object.assign(s, { code: '', fromWarehouse: '', toWarehouse: '', status: '' }), o())
      }
      function A() {
        ;((i.value = y()), (d.value = !0))
      }
      function M(e) {
        return [
          { key: 'out', label: '调出确认', tone: 'primary', hidden: e.status !== 'pending' },
          { key: 'in', label: '调入确认', tone: 'success', hidden: e.status !== 'transit' }
        ]
      }
      function N(e, t) {
        if (e === 'out') {
          U(t)
          return
        }
        e === 'in' && k(t)
      }
      async function F() {
        ;(await Y({ material: i.value.material, qty: i.value.qty, from_wh: i.value.from_wh, to_wh: i.value.to_wh, status: 'pending', out_time: '' }),
          (d.value = !1),
          f.success('调拨单已创建'),
          await r())
      }
      async function U(e) {
        const t = new Date().toLocaleString('zh-CN')
        ;(await W(e.id, { status: 'transit', out_time: t }), (e.status = 'transit'), (e.out_time = t), f.success('调出确认成功'))
      }
      async function k(e) {
        ;(await W(e.id, { status: 'completed' }), (e.status = 'completed'), f.success('调入确认成功，库存已更新'))
      }
      return (e, t) => {
        const p = z
        return (
          x(),
          D(
            G,
            {
              'search-model': n(s),
              'onUpdate:searchModel': t[2] || (t[2] = (a) => (O(s) ? (s.value = a) : (s = a))),
              title: '库存调拨单列表',
              'search-columns': l,
              'search-grid-item-props': v,
              columns: C,
              data: n(b),
              pagination: n(h),
              loading: n(g),
              'add-text': '新建库存调拨单',
              onSearch: n(o),
              onReset: S,
              onRefresh: n(r),
              onAdd: A
            },
            {
              status: m(({ row: a }) => [
                _(
                  p,
                  { type: a.status === 'pending' ? 'warning' : a.status === 'transit' ? 'primary' : 'success', size: 'small' },
                  { default: m(() => [E(V(a.status === 'pending' ? '待调出' : a.status === 'transit' ? '在途' : '已完成'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: m(({ row: a }) => [_(X, { actions: M(a), onAction: (B) => N(B, a) }, null, 8, ['actions', 'onAction'])]),
              dialog: m(() => [
                _(
                  Q,
                  {
                    visible: d.value,
                    'onUpdate:visible': t[0] || (t[0] = (a) => (d.value = a)),
                    form: i.value,
                    'onUpdate:form': t[1] || (t[1] = (a) => (i.value = a)),
                    onSubmit: F
                  },
                  null,
                  8,
                  ['visible', 'form']
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
  le = Z
export { le as default }

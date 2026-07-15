import {
  Bn as D,
  Fn as k,
  Kn as Q,
  Mn as $,
  On as A,
  Xn as _,
  Yn as Z,
  an as F,
  dn as p,
  i as g,
  in as ee,
  it as te,
  pn as N,
  r as P,
  rn as K,
  rr as h,
  sr as ae,
  un as L,
  yn as x
} from './element-plus-CzL7BOKu.js'
import { I as le } from './index-DqMfCNbk.js'
import { t as ie } from './useTable-Hzr4fBAy.js'
import { t as se } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as oe } from './CrudPage-7Q0FEhS_.js'
import { t as ne } from './CrudRowActions-Dmc4i_Io.js'
import { l as u, u as y } from './static-data-B3FhK4xc.js'
var ue = N({
    __name: 'DictItemDialog',
    props: x({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: x(['submit'], ['update:visible', 'update:form']),
    setup(r, { emit: I }) {
      const f = k(r, 'visible'),
        d = k(r, 'form'),
        c = I,
        m = [
          { type: 'input', label: '编码', field: 'code', required: !0 },
          { type: 'input', label: '名称', field: 'name', required: !0 },
          { type: 'input-number', label: '排序', field: 'sortOrder', props: { min: 1 } },
          {
            type: 'select-v2',
            label: '标签样式',
            field: 'cssClass',
            props: {
              options: [
                { label: '默认', value: '' },
                { label: '红色(danger)', value: 'danger' },
                { label: '橙色(warning)', value: 'warning' },
                { label: '绿色(success)', value: 'success' },
                { label: '灰色(info)', value: 'info' }
              ]
            }
          }
        ]
      return (n, i) => (
        A(),
        F(
          Y,
          {
            visible: f.value,
            'onUpdate:visible': i[0] || (i[0] = (a) => (f.value = a)),
            form: d.value,
            'onUpdate:form': i[1] || (i[1] = (a) => (d.value = a)),
            title: r.mode === 'add' ? '新增字典项' : '编辑字典项',
            columns: m,
            'label-width': 100,
            width: '500px',
            onSubmit: i[2] || (i[2] = (a) => c('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title']
        )
      )
    }
  }),
  re = ue,
  de = { class: 'dict-items-header' },
  ce = N({
    __name: 'DictItemsDialog',
    props: x({ dictTypeName: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, items: { required: !0 }, itemsModifiers: {} }),
    emits: x(['close', 'createItem', 'updateItem', 'deleteItem'], ['update:visible', 'update:items']),
    setup(r, { emit: I }) {
      const f = r,
        d = k(r, 'visible'),
        c = k(r, 'items'),
        m = I,
        n = _(!1),
        i = _('add'),
        a = _(U()),
        b = K(() => `字典项管理 - ${f.dictTypeName || ''}`),
        R = [
          { type: 'index', label: '#', width: 50 },
          { prop: 'code', label: '编码', width: 140 },
          { prop: 'name', label: '名称', width: 140 },
          { prop: 'sortOrder', label: '排序', minWidth: 80, align: 'center' },
          { prop: 'cssClass', label: '样式', width: 100 },
          { label: '状态', minWidth: 80, slotName: 'status' },
          { label: '操作', minWidth: 160, slotName: 'itemActions', align: 'center' }
        ]
      function U() {
        return { id: '', code: '', name: '', sortOrder: 1, cssClass: '' }
      }
      function V() {
        ;((i.value = 'add'), (a.value = U()), (n.value = !0))
      }
      function O(C) {
        ;((i.value = 'edit'),
          (a.value = { id: C.id, code: C.code, name: C.name, sortOrder: C.sortOrder, cssClass: C.cssClass || '' }),
          (n.value = !0))
      }
      function M() {
        i.value === 'add' ? m('createItem', a.value) : m('updateItem', a.value)
      }
      function q() {
        m('close')
      }
      return (C, v) => {
        const S = $('gi-button'),
          B = te,
          W = $('gi-table'),
          E = $('gi-dialog')
        return (
          A(),
          F(
            E,
            {
              modelValue: d.value,
              'onUpdate:modelValue': v[2] || (v[2] = (s) => (d.value = s)),
              footer: !1,
              'lock-scroll': !1,
              title: b.value,
              width: '800px',
              onClose: q
            },
            {
              default: D(() => [
                ee('div', de, [
                  p(S, { type: 'add', size: 'small', onClick: V }, { default: D(() => [...(v[3] || (v[3] = [L('新增字典项', -1)]))]), _: 1 })
                ]),
                p(
                  W,
                  { columns: R, data: c.value, border: '', size: 'small', style: { 'margin-top': '12px' } },
                  {
                    status: D(({ row: s }) => [
                      p(
                        B,
                        { type: s.status === 'active' ? 'success' : 'info', size: 'small' },
                        { default: D(() => [L(ae(s.status === 'active' ? '启用' : '禁用'), 1)]), _: 2 },
                        1032,
                        ['type']
                      )
                    ]),
                    itemActions: D(({ row: s }) => [
                      p(S, { type: 'edit', size: 'small', onClick: (o) => O(s) }, null, 8, ['onClick']),
                      p(S, { type: 'delete', size: 'small', onClick: (o) => m('deleteItem', s.id) }, null, 8, ['onClick'])
                    ]),
                    _: 1
                  },
                  8,
                  ['data']
                ),
                p(
                  re,
                  {
                    visible: n.value,
                    'onUpdate:visible': v[0] || (v[0] = (s) => (n.value = s)),
                    form: a.value,
                    'onUpdate:form': v[1] || (v[1] = (s) => (a.value = s)),
                    mode: i.value,
                    onSubmit: M
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
                )
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
  me = le(ce, [['__scopeId', 'data-v-e215eea7']]),
  ve = N({
    __name: 'DictTypeDialog',
    props: x({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: x(['submit'], ['update:visible', 'update:form']),
    setup(r, { emit: I }) {
      const f = k(r, 'visible'),
        d = k(r, 'form'),
        c = I,
        m = [
          { type: 'input', label: '字典编码', field: 'code', required: !0, props: { placeholder: '如：work_order_priority' } },
          { type: 'input', label: '字典名称', field: 'name', required: !0, props: { placeholder: '如：工单优先级' } },
          { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } }
        ]
      function n() {
        return !d.value.code || !d.value.name ? (g.warning('请填写字典编码和字典名称'), !1) : !0
      }
      return (i, a) => (
        A(),
        F(
          Y,
          {
            visible: f.value,
            'onUpdate:visible': a[0] || (a[0] = (b) => (f.value = b)),
            form: d.value,
            'onUpdate:form': a[1] || (a[1] = (b) => (d.value = b)),
            title: r.mode === 'add' ? '新增字典类型' : '编辑字典类型',
            columns: m,
            'label-width': 100,
            'before-submit': n,
            onSubmit: a[2] || (a[2] = (b) => c('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title']
        )
      )
    }
  }),
  pe = ve,
  fe = N({
    __name: 'index',
    setup(r) {
      const I = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码 / 字典名称', clearable: !0 } }],
        f = [
          { prop: 'code', label: '字典编码', minWidth: 180 },
          { prop: 'name', label: '字典名称', minWidth: 150 },
          { prop: 'description', label: '说明', minWidth: 220 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        d = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'items', label: '字典项', tone: 'secondary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      let c = Z({ keyword: '' })
      const m = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '停用', value: 'disabled', type: 'info' }
        ],
        n = _(!1),
        i = _('add'),
        a = _(q()),
        b = K(() => {
          const e = c.keyword.trim().toLowerCase()
          return e ? y.value.filter((t) => t.code.toLowerCase().includes(e) || t.name.toLowerCase().includes(e)) : y.value
        }),
        {
          tableData: R,
          pagination: U,
          loading: V,
          search: O,
          refresh: M
        } = ie({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const l = (e - 1) * t,
              w = l + t
            return { list: b.value.slice(l, w), total: b.value.length }
          }
        })
      function q() {
        return { id: '', code: '', name: '', description: '' }
      }
      function C() {
        ;(Object.assign(c, { keyword: '' }), O())
      }
      function v() {
        ;((i.value = 'add'), (a.value = q()), (n.value = !0))
      }
      function S(e) {
        ;((i.value = 'edit'), (a.value = { id: e.id, code: e.code, name: e.name, description: e.description }), (n.value = !0))
      }
      function B(e, t) {
        if (e === 'edit') {
          S(t)
          return
        }
        if (e === 'items') {
          j(t)
          return
        }
        e === 'delete' && E(t)
      }
      async function W() {
        if (!a.value.code || !a.value.name) {
          g.warning('请填写字典编码和字典名称')
          return
        }
        if (i.value === 'add')
          (y.value.unshift({
            id: `DICT-TYPE-${String(y.value.length + 1).padStart(3, '0')}`,
            code: a.value.code,
            name: a.value.name,
            description: a.value.description,
            status: 'active'
          }),
            (u.value[a.value.code] = []))
        else {
          const e = y.value.find((t) => t.id === a.value.id)?.code
          if (
            ((y.value = y.value.map((t) =>
              t.id === a.value.id ? { ...t, code: a.value.code, name: a.value.name, description: a.value.description } : t
            )),
            e && e !== a.value.code)
          ) {
            const t = u.value[e] || []
            ;(delete u.value[e], (u.value[a.value.code] = t.map((l) => ({ ...l, dictTypeCode: a.value.code }))))
          }
        }
        ;((n.value = !1), await M(), g.success(i.value === 'add' ? '已新增静态字典类型' : '已更新静态字典类型'))
      }
      async function E(e) {
        ;(await P.confirm('删除字典类型将同时删除其下所有字典项，确认删除？', '警告', { type: 'warning' }),
          (y.value = y.value.filter((t) => t.id !== e.id)),
          delete u.value[e.code],
          g.success('删除成功'),
          await M())
      }
      const s = _(!1),
        o = _(null),
        T = _([])
      async function j(e) {
        ;((o.value = e), (T.value = [...(u.value[e.code] || [])]), (s.value = !0))
      }
      async function X(e) {
        if (!e.code || !e.name || !o.value) {
          g.warning('请填写字典项编码和字典项名称')
          return
        }
        const t = o.value.code,
          l = o.value.id,
          w = u.value[t] || []
        ;((u.value[t] = [
          ...w,
          {
            id: `DICT-ITEM-${String(w.length + 1).padStart(3, '0')}`,
            dictTypeId: l,
            dictTypeCode: t,
            code: e.code,
            name: e.name,
            sortOrder: e.sortOrder,
            cssClass: e.cssClass || void 0,
            status: 'active'
          }
        ]),
          g.success('新增成功'),
          await z())
      }
      async function G(e) {
        if (!e.code || !e.name || !o.value) {
          g.warning('请填写字典项编码和字典项名称')
          return
        }
        const t = o.value.code
        ;((u.value[t] = (u.value[t] || []).map((l) =>
          l.id === e.id ? { ...l, code: e.code, name: e.name, sortOrder: e.sortOrder, cssClass: e.cssClass || void 0 } : l
        )),
          g.success('编辑成功'),
          await z())
      }
      async function H(e) {
        o.value &&
          (await P.confirm('确定删除该字典项？', '提示', { type: 'warning' }),
          (u.value[o.value.code] = (u.value[o.value.code] || []).filter((t) => t.id !== e)),
          (T.value = T.value.filter((t) => t.id !== e)),
          g.success('删除成功'))
      }
      async function z() {
        o.value && (T.value = [...(u.value[o.value.code] || [])])
      }
      function J() {
        ;((o.value = null), (T.value = []))
      }
      return (e, t) => (
        A(),
        F(
          oe,
          {
            'search-model': h(c),
            'onUpdate:searchModel': t[4] || (t[4] = (l) => (Q(c) ? (c.value = l) : (c = l))),
            title: '字典类型管理',
            'search-columns': I,
            columns: f,
            data: h(R),
            pagination: h(U),
            loading: h(V),
            'table-attrs': { border: !0, style: 'height: 100%' },
            onSearch: h(O),
            onReset: C,
            onRefresh: h(M),
            onAdd: v
          },
          {
            status: D(({ row: l }) => [p(se, { value: l.status, options: m }, null, 8, ['value'])]),
            actions: D(({ row: l }) => [p(ne, { actions: d, onAction: (w) => B(w, l) }, null, 8, ['onAction'])]),
            dialog: D(() => [
              p(
                pe,
                {
                  visible: n.value,
                  'onUpdate:visible': t[0] || (t[0] = (l) => (n.value = l)),
                  form: a.value,
                  'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
                  mode: i.value,
                  onSubmit: W
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              p(
                me,
                {
                  visible: s.value,
                  'onUpdate:visible': t[2] || (t[2] = (l) => (s.value = l)),
                  items: T.value,
                  'onUpdate:items': t[3] || (t[3] = (l) => (T.value = l)),
                  'dict-type-name': o.value?.name || '',
                  onClose: J,
                  onCreateItem: X,
                  onUpdateItem: G,
                  onDeleteItem: H
                },
                null,
                8,
                ['visible', 'items', 'dict-type-name']
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
  we = fe
export { we as default }

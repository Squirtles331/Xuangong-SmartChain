import {
  Bn as f,
  Fn as x,
  Kn as N,
  On as D,
  Xn as b,
  Yn as O,
  an as I,
  dn as g,
  i as C,
  pn as M,
  rn as w,
  rr as r,
  yn as A
} from './element-plus-CzL7BOKu.js'
import { t as K } from './useTable-Hzr4fBAy.js'
import { t as T } from './StatusTag-DWd3m1xj.js'
import { t as V } from './CrudFormDialog-1OgQthWb.js'
import { t as G } from './CrudPage-7Q0FEhS_.js'
import { t as X } from './CrudRowActions-Dmc4i_Io.js'
import { g as o } from './static-data-B3FhK4xc.js'
var Y = M({
    __name: 'RoleFormDialog',
    props: A({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: A(['submit'], ['update:visible', 'update:form']),
    setup(u, { emit: p }) {
      const d = x(u, 'visible'),
        m = x(u, 'form'),
        i = p,
        c = w(() => [
          { type: 'input', label: '角色编码', field: 'code', required: !0 },
          { type: 'input', label: '角色名称', field: 'name', required: !0 },
          { type: 'input', label: '描述', field: 'description', props: { type: 'textarea', rows: 2 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'disabled' }
              ]
            }
          }
        ])
      return (n, s) => (
        D(),
        I(
          V,
          {
            visible: d.value,
            'onUpdate:visible': s[0] || (s[0] = (a) => (d.value = a)),
            form: m.value,
            'onUpdate:form': s[1] || (s[1] = (a) => (m.value = a)),
            title: u.mode === 'add' ? '新增角色' : '编辑角色',
            columns: c.value,
            'label-width': 100,
            onSubmit: s[2] || (s[2] = (a) => i('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  $ = Y,
  j = M({
    __name: 'index',
    setup(u) {
      const p = [{ type: 'input', label: '角色名称', field: 'name', props: { placeholder: '角色编码/角色名称' } }],
        d = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        m = [
          { type: 'index', label: '#', width: 60 },
          { prop: 'code', label: '角色编码', minWidth: 140 },
          { prop: 'name', label: '角色名称', minWidth: 140 },
          { prop: 'description', label: '描述', minWidth: 220 },
          { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'userCount', label: '用户数', minWidth: 90, align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let i = O({ name: '' })
      const c = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '禁用', value: 'disabled', type: 'info' }
        ],
        n = b(!1),
        s = b('add'),
        a = b(R()),
        S = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        y = w(() => {
          const e = i.name.trim().toLowerCase()
          return e ? o.value.filter((t) => t.code.toLowerCase().includes(e) || t.name.toLowerCase().includes(e)) : o.value
        }),
        {
          tableData: F,
          pagination: W,
          loading: k,
          search: h,
          refresh: _,
          onDelete: q
        } = K({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const l = (e - 1) * t,
              v = l + t
            return { list: y.value.slice(l, v), total: y.value.length }
          },
          deleteAPI: async (e) => {
            o.value = o.value.filter((t) => !e.includes(t.id))
          }
        })
      function R() {
        return { id: '', code: '', name: '', description: '', status: 'active', permissionIds: [] }
      }
      function P() {
        ;((i.name = ''), h())
      }
      function U() {
        ;((s.value = 'add'), (a.value = R()), (n.value = !0))
      }
      function B(e) {
        ;((s.value = 'edit'),
          (a.value = {
            id: e.id,
            code: e.code,
            name: e.name,
            description: e.description,
            status: e.status,
            permissionIds: e.permissionIds ? [...e.permissionIds] : []
          }),
          (n.value = !0))
      }
      function L(e, t) {
        if (e === 'edit') {
          B(t)
          return
        }
        e === 'delete' && q(t)
      }
      async function E() {
        if (!a.value.code || !a.value.name) {
          C.warning('请填写角色编码和角色名称')
          return
        }
        const e = {
          code: a.value.code,
          name: a.value.name,
          description: a.value.description,
          status: a.value.status,
          permissionIds: a.value.permissionIds
        }
        ;(s.value === 'add'
          ? o.value.unshift({ id: `ROLE-${String(o.value.length + 1).padStart(3, '0')}`, ...e, userCount: 0 })
          : (o.value = o.value.map((t) => (t.id === a.value.id ? { ...t, ...e } : t))),
          (n.value = !1),
          await _(),
          C.success(s.value === 'add' ? '已新增静态角色数据' : '已更新静态角色数据'))
      }
      return (e, t) => (
        D(),
        I(
          G,
          {
            'search-model': r(i),
            'onUpdate:searchModel': t[2] || (t[2] = (l) => (N(i) ? (i.value = l) : (i = l))),
            title: '角色列表',
            'search-columns': p,
            'search-grid-item-props': d,
            columns: m,
            data: r(F),
            pagination: r(W),
            loading: r(k),
            onSearch: r(h),
            onReset: P,
            onRefresh: r(_),
            onAdd: U
          },
          {
            status: f(({ row: l }) => [g(T, { value: l.status, options: c }, null, 8, ['value'])]),
            actions: f(({ row: l }) => [g(X, { actions: S, onAction: (v) => L(v, l) }, null, 8, ['onAction'])]),
            dialog: f(() => [
              g(
                $,
                {
                  visible: n.value,
                  'onUpdate:visible': t[0] || (t[0] = (l) => (n.value = l)),
                  form: a.value,
                  'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
                  mode: s.value,
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
  ae = j
export { ae as default }

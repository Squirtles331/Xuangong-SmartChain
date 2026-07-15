import {
  Bn as i,
  Fn as P,
  Kn as X,
  On as S,
  Xn as C,
  Yn as Y,
  an as D,
  dn as k,
  i as x,
  ot as j,
  pn as W,
  rn as g,
  rr as d,
  sr as v,
  un as f,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { i as z } from './vue-chunks-CWn_TkJU.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as L } from './CrudRowActions-Dmc4i_Io.js'
import { i as Q, m as u, r as Z } from './static-data-B3FhK4xc.js'
var ee = W({
    __name: 'PrintTemplateCategoryDialog',
    props: R(
      { mode: {}, parentOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: h }) {
      const r = c,
        y = P(c, 'visible'),
        b = P(c, 'form'),
        _ = h,
        s = g(() => [
          { type: 'select-v2', label: '上级分类', field: 'parentId', props: { options: r.parentOptions, clearable: !0 } },
          { type: 'input', label: '分类名称', field: 'name', required: !0 },
          { type: 'input', label: '分类编码', field: 'code', required: !0 }
        ])
      return (p, l) => (
        S(),
        D(
          H,
          {
            visible: y.value,
            'onUpdate:visible': l[0] || (l[0] = (m) => (y.value = m)),
            form: b.value,
            'onUpdate:form': l[1] || (l[1] = (m) => (b.value = m)),
            title: c.mode === 'add' ? '新增打印模板分类' : '编辑打印模板分类',
            columns: s.value,
            'label-width': 110,
            width: '620px',
            onSubmit: l[2] || (l[2] = (m) => _('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  te = ee,
  ae = W({
    __name: 'index',
    setup(c) {
      const h = z()
      let r = Y({ keyword: '' })
      const y = [{ type: 'input', label: '分类名称', field: 'keyword', props: { placeholder: '请输入分类名称 / 编码', clearable: !0 } }],
        b = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'name', label: '分类名称', minWidth: 160, slotName: 'name' },
          { prop: 'code', label: '分类编码', minWidth: 180 },
          { prop: 'parentName', label: '上级分类', minWidth: 140, slotName: 'parentName' },
          { prop: 'level', label: '层级', minWidth: 80, align: 'center' },
          { prop: 'createdBy', label: '创建人', minWidth: 120 },
          { prop: 'createdAt', label: '创建时间', minWidth: 180 },
          { prop: 'updatedBy', label: '修改人', minWidth: 120, slotName: 'updatedBy' },
          { prop: 'updatedAt', label: '修改时间', minWidth: 180, slotName: 'updatedAt' },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        _ = [
          { key: 'templates', label: '模板设置', tone: 'secondary' },
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        s = C(!1),
        p = C('add'),
        l = C(w()),
        m = g(() => Q()),
        M = g(() => {
          const t = [{ label: '无上级分类', value: null }]
          function a(n, e = '') {
            n.forEach((o) => {
              ;(t.push({ label: `${e}${o.name}`, value: o.id }), o.children?.length && a(o.children, `${e}${o.name} / `))
            })
          }
          return (a(m.value), t)
        }),
        I = g(() => Z().filter((t) => !r.keyword || t.name.includes(r.keyword) || t.code.includes(r.keyword))),
        {
          tableData: $,
          pagination: A,
          loading: q,
          search: B,
          refresh: T,
          onDelete: E
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: t, size: a }) => {
            const n = (t - 1) * a,
              e = n + a
            return { list: I.value.slice(n, e), total: I.value.length }
          },
          deleteAPI: async (t) => {
            const a = new Set(t)
            let n = !0
            for (; n; )
              ((n = !1),
                u.value.forEach((e) => {
                  e.parentId && a.has(e.parentId) && !a.has(e.id) && (a.add(e.id), (n = !0))
                }))
            u.value = u.value.filter((e) => !a.has(e.id))
          }
        })
      function w() {
        return { id: '', parentId: null, name: '', code: '' }
      }
      function U() {
        ;((r.keyword = ''), B())
      }
      function O() {
        ;((p.value = 'add'), (l.value = w()), (s.value = !0))
      }
      function F(t) {
        ;((p.value = 'edit'), (l.value = { id: t.id, parentId: t.parentId, name: t.name, code: t.code }), (s.value = !0))
      }
      function N(t) {
        h.push({ name: 'printTemplateSettings', params: { categoryId: t.id } })
      }
      function V(t, a) {
        if (t === 'templates') {
          N(a)
          return
        }
        if (t === 'edit') {
          F(a)
          return
        }
        t === 'delete' && E(a)
      }
      async function K() {
        if (!l.value.name || !l.value.code) {
          x.warning('请填写分类名称和分类编码')
          return
        }
        const t = l.value.parentId ? u.value.find((n) => n.id === l.value.parentId) : null,
          a = t ? t.level + 1 : 1
        ;(p.value === 'add'
          ? u.value.unshift({
              id: `PTC-${String(u.value.length + 1).padStart(3, '0')}`,
              parentId: l.value.parentId,
              name: l.value.name,
              code: l.value.code,
              level: a,
              createdBy: '当前用户',
              createdAt: '2026-07-13 16:45',
              updatedBy: '当前用户',
              updatedAt: '2026-07-13 16:45'
            })
          : (u.value = u.value.map((n) =>
              n.id === l.value.id
                ? {
                    ...n,
                    parentId: l.value.parentId,
                    name: l.value.name,
                    code: l.value.code,
                    level: a,
                    updatedBy: '当前用户',
                    updatedAt: '2026-07-13 16:45'
                  }
                : n
            )),
          (s.value = !1),
          await T(),
          x.success(p.value === 'add' ? '已新增静态打印模板分类' : '已更新静态打印模板分类'))
      }
      return (t, a) => {
        const n = j
        return (
          S(),
          D(
            J,
            {
              'search-model': d(r),
              'onUpdate:searchModel': a[2] || (a[2] = (e) => (X(r) ? (r.value = e) : (r = e))),
              title: '打印模板分类',
              'search-columns': y,
              columns: b,
              data: d($),
              pagination: d(A),
              loading: d(q),
              'table-attrs': { border: !0, style: 'height: 100%' },
              onSearch: d(B),
              onReset: U,
              onRefresh: d(T),
              onAdd: O
            },
            {
              index: i(({ $index: e }) => [f(v(e + 1 + (d(A).currentPage - 1) * d(A).pageSize), 1)]),
              name: i(({ row: e }) => [
                k(n, { link: '', type: 'primary', onClick: (o) => N(e) }, { default: i(() => [f(v(e.name), 1)]), _: 2 }, 1032, ['onClick'])
              ]),
              parentName: i(({ row: e }) => [f(v(e.parentName || '-'), 1)]),
              updatedBy: i(({ row: e }) => [f(v(e.updatedBy || '-'), 1)]),
              updatedAt: i(({ row: e }) => [f(v(e.updatedAt || '-'), 1)]),
              actions: i(({ row: e }) => [k(L, { actions: _, onAction: (o) => V(o, e) }, null, 8, ['onAction'])]),
              dialog: i(() => [
                k(
                  te,
                  {
                    visible: s.value,
                    'onUpdate:visible': a[0] || (a[0] = (e) => (s.value = e)),
                    form: l.value,
                    'onUpdate:form': a[1] || (a[1] = (e) => (l.value = e)),
                    mode: p.value,
                    'parent-options': M.value,
                    onSubmit: K
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode', 'parent-options']
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
  se = ae
export { se as default }

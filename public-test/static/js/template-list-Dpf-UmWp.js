import {
  Bn as o,
  Fn as M,
  Kn as te,
  Mn as ae,
  On as O,
  Rn as le,
  Xn as D,
  Yn as ie,
  an as U,
  d as ne,
  dn as p,
  i as A,
  in as w,
  it as se,
  ot as oe,
  pn as V,
  rn as v,
  rr as r,
  sr as E,
  un as y,
  x as re,
  yn as $
} from './element-plus-CzL7BOKu.js'
import { i as ue, r as de } from './vue-chunks-CWn_TkJU.js'
import { I as me } from './index-DqMfCNbk.js'
import { t as pe } from './useTable-Hzr4fBAy.js'
import { t as ce } from './CrudFormDialog-1OgQthWb.js'
import { t as fe } from './CrudPage-7Q0FEhS_.js'
import { t as ye } from './CrudRowActions-Dmc4i_Io.js'
import { a as q, h as u, i as ve } from './static-data-B3FhK4xc.js'
var ge = V({
    __name: 'PrintTemplateDialog',
    props: $(
      { mode: {}, categoryOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: $(['submit'], ['update:visible', 'update:form']),
    setup(g, { emit: h }) {
      const _ = g,
        n = M(g, 'visible'),
        k = M(g, 'form'),
        C = h,
        I = v(() => [
          { type: 'select-v2', label: '模板分类', field: 'categoryId', required: !0, props: { options: _.categoryOptions, filterable: !0 } },
          { type: 'input', label: '模板名称', field: 'name', required: !0 },
          { type: 'switch', label: '系统内置模板', field: 'systemBuiltin' },
          { type: 'switch', label: '默认模板', field: 'isDefault' },
          { type: 'textarea', label: '备注', field: 'remark', props: { rows: 4, maxlength: 200, showWordLimit: !0 } }
        ])
      return (d, s) => (
        O(),
        U(
          ce,
          {
            visible: n.value,
            'onUpdate:visible': s[0] || (s[0] = (m) => (n.value = m)),
            form: k.value,
            'onUpdate:form': s[1] || (s[1] = (m) => (k.value = m)),
            title: g.mode === 'add' ? '新增打印模板' : '编辑打印模板',
            columns: I.value,
            'label-width': 110,
            width: '680px',
            onSubmit: s[2] || (s[2] = (m) => C('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  be = ge,
  he = { class: 'tree-wrapper' },
  _e = { class: 'tree-header' },
  ke = V({
    __name: 'template-list',
    setup(g) {
      const h = ue(),
        _ = de()
      let n = ie({ keyword: '', systemBuiltin: '' })
      const k = [
          { type: 'input', label: '模板名称', field: 'keyword', props: { placeholder: '请输入模板名称 / 备注', clearable: !0 } },
          {
            type: 'select-v2',
            label: '系统内置',
            field: 'systemBuiltin',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '是', value: 'true' },
                { label: '否', value: 'false' }
              ]
            }
          }
        ],
        C = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'categoryName', label: '模板分类', minWidth: 140 },
          { prop: 'name', label: '模板名称', minWidth: 180 },
          { prop: 'systemBuiltin', label: '系统内置模板', minWidth: 120, slotName: 'systemBuiltin', align: 'center' },
          { prop: 'isDefault', label: '默认模板', minWidth: 100, slotName: 'isDefault', align: 'center' },
          { prop: 'remark', label: '备注', minWidth: 180 },
          { prop: 'createdBy', label: '创建人', minWidth: 120 },
          { prop: 'createdAt', label: '创建时间', minWidth: 180 },
          { prop: 'updatedBy', label: '修改人', minWidth: 120 },
          { prop: 'updatedAt', label: '修改时间', minWidth: 180 },
          { label: '操作', minWidth: 260, slotName: 'actions', fixed: 'right', align: 'center' }
        ],
        I = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'designer', label: '编辑模板', tone: 'secondary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        d = D(String(_.params.categoryId || '')),
        s = D(!1),
        m = D('add'),
        i = D(S()),
        N = v(() => ve()),
        P = v(() => (d.value ? q(d.value) : '')),
        F = v(() => {
          const t = []
          function e(a, c = '') {
            a.forEach((f) => {
              ;(t.push({ label: `${c}${f.name}`, value: f.id }), f.children?.length && e(f.children, `${c}${f.name} / `))
            })
          }
          return (e(N.value), t)
        }),
        K = v(() => (P.value ? `${P.value}模板列表` : '打印模板列表')),
        R = v(() =>
          u.value.filter((t) => {
            const e = !d.value || t.categoryId === d.value,
              a = !n.keyword || t.name.includes(n.keyword) || t.remark.includes(n.keyword),
              c = n.systemBuiltin === '' || (n.systemBuiltin === 'true' ? t.systemBuiltin : !t.systemBuiltin)
            return e && a && c
          })
        ),
        {
          tableData: j,
          pagination: x,
          loading: z,
          search: B,
          refresh: b,
          onDelete: L
        } = pe({
          rowKey: 'id',
          listAPI: async ({ page: t, size: e }) => {
            const a = (t - 1) * e,
              c = a + e
            return { list: R.value.slice(a, c), total: R.value.length }
          },
          deleteAPI: async (t) => {
            u.value = u.value.filter((e) => !t.includes(e.id))
          }
        })
      le(
        () => _.params.categoryId,
        (t) => {
          ;((d.value = String(t || '')), B())
        }
      )
      function S() {
        return { id: '', categoryId: d.value || '', name: '', systemBuiltin: !1, isDefault: !1, remark: '' }
      }
      function X() {
        ;(Object.assign(n, { keyword: '', systemBuiltin: '' }), B())
      }
      function Y(t) {
        ;((d.value = t.id), B())
      }
      function W() {
        ;((m.value = 'add'), (i.value = { ...S(), categoryId: d.value || '' }), (s.value = !0))
      }
      function G(t) {
        ;((m.value = 'edit'),
          (i.value = { id: t.id, categoryId: t.categoryId, name: t.name, systemBuiltin: t.systemBuiltin, isDefault: t.isDefault, remark: t.remark }),
          (s.value = !0))
      }
      function H(t, e) {
        if (t === 'edit') {
          G(e)
          return
        }
        if (t === 'designer') {
          h.push({ name: 'printTemplateDesigner', params: { id: e.id } })
          return
        }
        t === 'delete' && L(e)
      }
      async function J(t, e) {
        if (!e) {
          t.isDefault = !0
          return
        }
        ;((u.value = u.value.map((a) => ({ ...a, isDefault: a.categoryId === t.categoryId ? a.id === t.id : a.isDefault }))),
          A.success('默认模板已更新'),
          await b())
      }
      async function Q() {
        if (!i.value.categoryId || !i.value.name) {
          A.warning('请选择模板分类并填写模板名称')
          return
        }
        const t = q(i.value.categoryId),
          e = {
            categoryId: i.value.categoryId,
            categoryName: t,
            name: i.value.name,
            systemBuiltin: i.value.systemBuiltin,
            isDefault: i.value.isDefault,
            remark: i.value.remark,
            templateData: { version: 'static-demo', title: i.value.name, blocks: ['header', 'detail', 'footer'] },
            createdBy: '当前用户',
            createdAt: '2026-07-13 16:50',
            updatedBy: '当前用户',
            updatedAt: '2026-07-13 16:50'
          }
        ;(e.isDefault && (u.value = u.value.map((a) => ({ ...a, isDefault: a.categoryId === e.categoryId ? !1 : a.isDefault }))),
          m.value === 'add'
            ? u.value.unshift({ id: `PT-${String(u.value.length + 1).padStart(3, '0')}`, ...e })
            : (u.value = u.value.map((a) => (a.id === i.value.id ? { ...a, ...e, createdBy: a.createdBy, createdAt: a.createdAt } : a))),
          (s.value = !1),
          await b(),
          A.success(m.value === 'add' ? '已新增静态打印模板' : '已更新静态打印模板'))
      }
      return (t, e) => {
        const a = oe,
          c = ne,
          f = ae('gi-button'),
          Z = se,
          ee = re
        return (
          O(),
          U(
            fe,
            {
              'search-model': r(n),
              'onUpdate:searchModel': e[3] || (e[3] = (l) => (te(n) ? (n.value = l) : (n = l))),
              title: K.value,
              'page-attrs': { size: 280, style: 'height: calc(100vh - 120px)' },
              'search-columns': k,
              columns: C,
              data: r(j),
              pagination: r(x),
              loading: r(z),
              'table-attrs': { border: !0, style: 'height: 100%' },
              onSearch: r(B),
              onReset: X,
              onRefresh: r(b),
              onAdd: W
            },
            {
              left: o(() => [
                w('div', he, [
                  w('div', _e, [
                    e[5] || (e[5] = w('span', { class: 'tree-title' }, '打印模板分类', -1)),
                    p(a, { link: '', type: 'primary', onClick: r(b) }, { default: o(() => [...(e[4] || (e[4] = [y('刷新', -1)]))]), _: 1 }, 8, [
                      'onClick'
                    ])
                  ]),
                  p(
                    c,
                    {
                      data: N.value,
                      props: { children: 'children', label: 'name' },
                      'node-key': 'id',
                      'default-expand-all': '',
                      'highlight-current': '',
                      'current-node-key': d.value || void 0,
                      'expand-on-click-node': !1,
                      onNodeClick: Y
                    },
                    null,
                    8,
                    ['data', 'current-node-key']
                  )
                ])
              ]),
              tool: o(() => [
                p(f, { type: 'add', onClick: W }, { default: o(() => [...(e[6] || (e[6] = [y('新增', -1)]))]), _: 1 }),
                p(f, { type: 'reset', onClick: r(b) }, { default: o(() => [...(e[7] || (e[7] = [y('刷新', -1)]))]), _: 1 }, 8, ['onClick']),
                p(
                  a,
                  { onClick: e[0] || (e[0] = (l) => r(h).push({ name: 'printTemplate' })) },
                  { default: o(() => [...(e[8] || (e[8] = [y('返回分类', -1)]))]), _: 1 }
                )
              ]),
              index: o(({ $index: l }) => [y(E(l + 1 + (r(x).currentPage - 1) * r(x).pageSize), 1)]),
              systemBuiltin: o(({ row: l }) => [
                p(Z, { type: l.systemBuiltin ? 'primary' : 'info' }, { default: o(() => [y(E(l.systemBuiltin ? '是' : '否'), 1)]), _: 2 }, 1032, [
                  'type'
                ])
              ]),
              isDefault: o(({ row: l }) => [p(ee, { 'model-value': l.isDefault, onChange: (T) => J(l, T) }, null, 8, ['model-value', 'onChange'])]),
              actions: o(({ row: l }) => [p(ye, { actions: I, onAction: (T) => H(T, l) }, null, 8, ['onAction'])]),
              dialog: o(() => [
                p(
                  be,
                  {
                    visible: s.value,
                    'onUpdate:visible': e[1] || (e[1] = (l) => (s.value = l)),
                    form: i.value,
                    'onUpdate:form': e[2] || (e[2] = (l) => (i.value = l)),
                    mode: m.value,
                    'category-options': F.value,
                    onSubmit: Q
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode', 'category-options']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'title', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  Ne = me(ke, [['__scopeId', 'data-v-01d5663f']])
export { Ne as default }

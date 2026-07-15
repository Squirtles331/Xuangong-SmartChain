import {
  Bn as i,
  Fn as D,
  Mn as z,
  On as N,
  V as Q,
  Xn as _,
  an as R,
  b as W,
  dn as a,
  ft as $,
  i as E,
  in as I,
  nt as K,
  ot as L,
  pn as F,
  rr as g,
  rt as X,
  un as S,
  x as j,
  y as G,
  yn as B
} from './element-plus-CzL7BOKu.js'
import { I as H } from './index-DqMfCNbk.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as Z } from './CrudPage-7Q0FEhS_.js'
import { t as ee } from './CrudRowActions-Dmc4i_Io.js'
import { O as ae, b as le, f as te, i as oe } from './qms-DDSeKvwp.js'
var ne = { class: 'items-header' },
  ie = F({
    __name: 'TemplateFormDialog',
    props: B(
      { mode: {} },
      {
        visible: { type: Boolean, required: !0 },
        visibleModifiers: {},
        form: { required: !0 },
        formModifiers: {},
        items: { required: !0 },
        itemsModifiers: {}
      }
    ),
    emits: B(['submit'], ['update:visible', 'update:form', 'update:items']),
    setup(f, { emit: h }) {
      const v = D(f, 'visible'),
        b = D(f, 'form'),
        r = D(f, 'items'),
        V = h,
        w = [
          { type: 'input', label: '模板名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '类别',
            field: 'category',
            required: !0,
            props: {
              options: [
                { label: '原材料', value: 'raw' },
                { label: '外购件', value: 'purchased' },
                { label: '半成品', value: 'semi-finished' },
                { label: '成品', value: 'finished' }
              ]
            }
          }
        ]
      function C() {
        r.value.push({ name: '', type: 'measure', standard: '', required: !0 })
      }
      function k() {
        v.value = !1
      }
      async function x() {
        return (V('submit'), !1)
      }
      return (T, o) => {
        const U = z('gi-form'),
          m = Q,
          p = L,
          d = $,
          s = W,
          c = K,
          y = X,
          A = j,
          M = G,
          q = z('gi-dialog')
        return (
          N(),
          R(
            q,
            {
              modelValue: v.value,
              'onUpdate:modelValue': o[1] || (o[1] = (l) => (v.value = l)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': x,
              'on-cancel': k,
              title: f.mode === 'add' ? '新增检验模板' : '编辑检验模板',
              width: '650px'
            },
            {
              default: i(() => [
                a(U, { modelValue: b.value, 'onUpdate:modelValue': o[0] || (o[0] = (l) => (b.value = l)), columns: w, 'label-width': 100 }, null, 8, [
                  'modelValue'
                ]),
                a(m),
                I('div', ne, [
                  o[3] || (o[3] = I('strong', null, '检验项目', -1)),
                  a(p, { type: 'primary', size: 'small', onClick: C }, { default: i(() => [...(o[2] || (o[2] = [S('新增', -1)]))]), _: 1 })
                ]),
                a(
                  M,
                  { data: r.value, border: '', size: 'small', style: { 'margin-top': '8px' } },
                  {
                    default: i(() => [
                      a(
                        s,
                        { label: '项目', width: '160' },
                        {
                          default: i(({ row: l }) => [
                            a(d, { modelValue: l.name, 'onUpdate:modelValue': (u) => (l.name = u), size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        s,
                        { label: '类型', width: '120' },
                        {
                          default: i(({ row: l }) => [
                            a(
                              y,
                              { modelValue: l.type, 'onUpdate:modelValue': (u) => (l.type = u), size: 'small' },
                              {
                                default: i(() => [
                                  a(c, { label: '测量', value: 'measure' }),
                                  a(c, { label: '计数', value: 'count' }),
                                  a(c, { label: '感官', value: 'sensory' })
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue', 'onUpdate:modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        s,
                        { label: '标准值', width: '160' },
                        {
                          default: i(({ row: l }) => [
                            a(d, { modelValue: l.standard, 'onUpdate:modelValue': (u) => (l.standard = u), size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        s,
                        { label: '必检', width: '90' },
                        {
                          default: i(({ row: l }) => [
                            a(A, { modelValue: l.required, 'onUpdate:modelValue': (u) => (l.required = u), size: 'small' }, null, 8, [
                              'modelValue',
                              'onUpdate:modelValue'
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      a(
                        s,
                        { label: '操作', width: '80' },
                        {
                          default: i(({ $index: l }) => [
                            a(
                              p,
                              { type: 'danger', link: '', size: 'small', onClick: (u) => r.value.splice(l, 1) },
                              { default: i(() => [...(o[4] || (o[4] = [S('删除', -1)]))]), _: 1 },
                              8,
                              ['onClick']
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
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  se = H(ie, [['__scopeId', 'data-v-4a496d4c']]),
  ue = F({
    __name: 'index',
    setup(f) {
      const h = [{ key: 'export', label: '导出' }],
        v = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        b = [
          { value: 'raw', label: '原材料', type: 'warning' },
          { value: 'purchased', label: '外购件', type: 'primary' },
          { value: 'semi-finished', label: '半成品', type: 'success' },
          { value: 'finished', label: '成品', type: 'info' }
        ],
        r = _({ keyword: '', category: '' }),
        V = [
          { type: 'input', label: '模板名称', field: 'keyword', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '类别',
            field: 'category',
            props: { options: b.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          }
        ],
        w = [
          { prop: 'name', label: '模板名称', minWidth: 220 },
          { label: '类别', width: 120, slotName: 'category', align: 'center' },
          { prop: 'itemCount', label: '检验项目数', width: 120, align: 'center' },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: C,
          pagination: k,
          loading: x,
          search: T,
          refresh: o,
          onDelete: U
        } = J({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) =>
            (await le({ pageNum: e, pageSize: t, keyword: r.value.keyword || void 0, category: r.value.category || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((t) => te(t)))
        }),
        m = _(!1),
        p = _('add'),
        d = _(y()),
        s = _([])
      function c(e = 1) {
        return Array.from({ length: e }, (t, n) => ({ name: `检验项目${n + 1}`, type: 'measure', standard: '', required: !0 }))
      }
      function y() {
        return { id: '', name: '', category: 'raw', items: [] }
      }
      function A() {
        ;((r.value = { keyword: '', category: '' }), T())
      }
      function M(e) {
        e === 'export' && E.success('检验模板静态数据已导出')
      }
      function q() {
        ;((p.value = 'add'), (d.value = y()), (s.value = c()), (m.value = !0))
      }
      function l(e) {
        ;((p.value = 'edit'),
          (d.value = { id: e.id, name: e.name, category: e.category, items: e.items || [] }),
          (s.value = e.items?.length ? e.items.map((t) => ({ ...t })) : c(Math.max(1, e.itemCount))),
          (m.value = !0))
      }
      function u(e, t) {
        if (e === 'edit') {
          l(t)
          return
        }
        e === 'delete' && U(t)
      }
      async function P() {
        const e = { ...d.value, items: s.value }
        ;(p.value === 'add' ? (await oe(e), E.success('新增成功')) : (await ae(d.value.id, e), E.success('编辑成功')), (m.value = !1), await o())
      }
      return (e, t) => (
        N(),
        R(
          Z,
          {
            'search-model': r.value,
            'onUpdate:searchModel': t[3] || (t[3] = (n) => (r.value = n)),
            title: '检验模板列表',
            'search-columns': V,
            columns: w,
            data: g(C),
            pagination: g(k),
            loading: g(x),
            'toolbar-actions': h,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: g(T),
            onReset: A,
            onRefresh: g(o),
            onAdd: q,
            onToolbarAction: M
          },
          {
            category: i(({ row: n }) => [a(Y, { value: n.category, options: b }, null, 8, ['value'])]),
            actions: i(({ row: n }) => [a(ee, { actions: v, onAction: (O) => u(O, n) }, null, 8, ['onAction'])]),
            dialog: i(() => [
              a(
                se,
                {
                  visible: m.value,
                  'onUpdate:visible': t[0] || (t[0] = (n) => (m.value = n)),
                  form: d.value,
                  'onUpdate:form': t[1] || (t[1] = (n) => (d.value = n)),
                  items: s.value,
                  'onUpdate:items': t[2] || (t[2] = (n) => (s.value = n)),
                  mode: p.value,
                  onSubmit: P
                },
                null,
                8,
                ['visible', 'form', 'items', 'mode']
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
  be = ue
export { be as default }

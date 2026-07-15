import {
  Bn as o,
  Ct as ne,
  Fn as M,
  Kn as oe,
  Mn as S,
  Mt as ie,
  Nt as re,
  On as s,
  Rt as R,
  St as se,
  Xn as v,
  Yn as de,
  _t as ue,
  an as u,
  d as pe,
  dn as d,
  en as ce,
  i as A,
  in as b,
  it as me,
  jt as fe,
  pn as W,
  rr as n,
  sn as V,
  sr as I,
  un as z,
  yn as P
} from './element-plus-CzL7BOKu.js'
import { I as ve } from './index-DqMfCNbk.js'
import { t as ge } from './useTable-Hzr4fBAy.js'
import { c as ye, i as _e, n as be, o as B, s as he, u as ke } from './mdm-BuIKfT43.js'
import { t as we } from './CrudPage-7Q0FEhS_.js'
import { t as xe } from './CrudRowActions-Dmc4i_Io.js'
var Ne = W({
    __name: 'OrganizationFormDialog',
    props: P({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: P(['submit'], ['update:visible', 'update:form']),
    setup(h, { emit: k }) {
      const r = M(h, 'visible'),
        y = M(h, 'form'),
        c = k,
        m = [
          { type: 'input', label: '名称', field: 'name', required: !0 },
          { type: 'input', label: '编码', field: 'code', required: !0 },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '集团', value: 'group' },
                { label: '公司', value: 'company' },
                { label: '工厂', value: 'plant' },
                { label: '车间', value: 'workshop' },
                { label: '产线', value: 'line' }
              ]
            }
          }
        ]
      function l() {
        r.value = !1
      }
      async function p() {
        return (c('submit'), !1)
      }
      return (T, i) => {
        const w = S('gi-form'),
          x = S('gi-dialog')
        return (
          s(),
          u(
            x,
            {
              modelValue: r.value,
              'onUpdate:modelValue': i[1] || (i[1] = (_) => (r.value = _)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': p,
              'on-cancel': l,
              title: h.mode === 'add' ? '新增组织节点' : '编辑组织节点',
              width: '600px'
            },
            {
              default: o(() => [
                d(w, { modelValue: y.value, 'onUpdate:modelValue': i[0] || (i[0] = (_) => (y.value = _)), columns: m, 'label-width': 100 }, null, 8, [
                  'modelValue'
                ])
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
  Ce = Ne,
  Oe = { class: 'tree-wrapper' },
  Ie = { class: 'tree-node' },
  Te = ['onClick'],
  De = { key: 1, class: 'tree-toggle tree-toggle--empty' },
  Me = W({
    __name: 'index',
    setup(h) {
      const k = v([]),
        r = v(null),
        y = v(null),
        c = v(!1),
        m = v('add'),
        l = v(j()),
        p = v(''),
        T = { size: 260 }
      let i = de({ keyword: '', type: '' })
      const w = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '组织名称/组织编码', clearable: !0 } },
          {
            type: 'select-v2',
            label: '组织类型',
            field: 'type',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '集团', value: 'group' },
                { label: '公司', value: 'company' },
                { label: '工厂', value: 'plant' },
                { label: '车间', value: 'workshop' },
                { label: '产线', value: 'line' }
              ]
            }
          }
        ],
        x = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        _ = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'name', label: '组织名称', minWidth: 180 },
          { prop: 'code', label: '组织编码', minWidth: 160 },
          { label: '组织类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'parentName', label: '上级组织', minWidth: 180 },
          { prop: 'childCount', label: '下级节点数', minWidth: 100, align: 'center' },
          { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: q,
          pagination: N,
          loading: E,
          search: C,
          refresh: D,
          onDelete: U
        } = ge({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) =>
            (await ye({ pageNum: e, pageSize: a, keyword: i.keyword || void 0, type: i.type || void 0, nodeId: p.value || void 0 })).data,
          deleteAPI: ae,
          onSuccess: ee
        }),
        F = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      K()
      async function K() {
        await O()
      }
      async function O() {
        const e = await he()
        k.value = JSON.parse(JSON.stringify(e.data))
      }
      function j() {
        return { id: '', parentId: '', name: '', code: '', type: 'group' }
      }
      function J() {
        ;(Object.assign(i, { keyword: '', type: '' }), C())
      }
      async function L(e) {
        ;((r.value = { ...e }), (p.value = e.id), C())
      }
      function $(e) {
        return `${e.toUpperCase()}-${Date.now().toString().slice(-6)}`
      }
      function G(e) {
        return { group: '集团', company: '公司', plant: '工厂', workshop: '车间', line: '产线' }[e]
      }
      function X(e) {
        return e === 'group' ? 'danger' : e === 'company' ? 'primary' : e === 'plant' ? 'success' : 'warning'
      }
      function Y() {
        const e = r.value,
          a = e ? { group: 'company', company: 'plant', plant: 'workshop', workshop: 'line', line: 'line' }[e.type] : 'group'
        ;((m.value = 'add'), (l.value = { id: '', parentId: e?.id || '', name: '', code: $(a), type: a }), (c.value = !0))
      }
      function H(e) {
        ;((m.value = 'edit'), (l.value = { id: e.id, parentId: '', name: e.name, code: e.code === '-' ? '' : e.code, type: e.type }), (c.value = !0))
      }
      function Q(e, a) {
        if (e === 'edit') {
          H(a)
          return
        }
        e === 'delete' && U(a)
      }
      async function Z() {
        if (!l.value.name || !l.value.code) {
          A.warning('请填写名称和编码')
          return
        }
        if (
          (m.value === 'add'
            ? await be({ parentId: l.value.parentId || void 0, name: l.value.name, code: l.value.code, type: l.value.type })
            : await ke(l.value.id, { name: l.value.name, code: l.value.code, type: l.value.type }),
          (c.value = !1),
          await Promise.all([O(), D()]),
          r.value?.id)
        ) {
          const e = await B(r.value.id)
          r.value = e.data ? { ...e.data } : null
        }
        A.success(m.value === 'add' ? '新增成功' : '保存成功')
      }
      async function ee() {
        if (!p.value) return
        const e = await B(p.value)
        r.value = e.data ? { ...e.data } : null
      }
      async function ae(e) {
        ;(await Promise.all(e.map((a) => _e(a))),
          e.includes(p.value) && ((p.value = ''), (r.value = null), y.value?.setCurrentKey(void 0)),
          await O())
      }
      return (e, a) => {
        const g = ue,
          te = pe,
          le = me
        return (
          s(),
          u(
            we,
            {
              'search-model': n(i),
              'onUpdate:searchModel': a[2] || (a[2] = (t) => (oe(i) ? (i.value = t) : (i = t))),
              title: '组织主数据',
              'search-columns': w,
              'search-grid-item-props': x,
              columns: _,
              data: n(q),
              pagination: n(N),
              loading: n(E),
              'page-attrs': T,
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: n(C),
              onReset: J,
              onRefresh: n(D),
              onAdd: Y
            },
            {
              left: o(() => [
                b('div', Oe, [
                  a[3] || (a[3] = b('div', { class: 'tree-header' }, [b('div', { class: 'tree-title' }, '工厂组织架构')], -1)),
                  d(
                    te,
                    {
                      ref_key: 'treeRef',
                      ref: y,
                      data: k.value,
                      props: { children: 'children', label: 'name' },
                      'node-key': 'id',
                      'expand-on-click-node': !1,
                      'highlight-current': '',
                      onNodeClick: L
                    },
                    {
                      default: o(({ node: t, data: f }) => [
                        b('span', Ie, [
                          t.childNodes?.length
                            ? (s(),
                              V(
                                'span',
                                { key: 0, class: 'tree-toggle', onClick: ce((Se) => (t.expanded = !t.expanded), ['stop']) },
                                [
                                  d(
                                    g,
                                    null,
                                    { default: o(() => [t.expanded ? (s(), u(n(se), { key: 1 })) : (s(), u(n(ne), { key: 0 }))]), _: 2 },
                                    1024
                                  )
                                ],
                                8,
                                Te
                              ))
                            : (s(), V('span', De)),
                          f.type === 'group'
                            ? (s(), u(g, { key: 2, class: 'tree-icon' }, { default: o(() => [d(n(R))]), _: 1 }))
                            : f.type === 'company'
                              ? (s(), u(g, { key: 3, class: 'tree-icon' }, { default: o(() => [d(n(R))]), _: 1 }))
                              : f.type === 'plant'
                                ? (s(), u(g, { key: 4, class: 'tree-icon' }, { default: o(() => [d(n(ie))]), _: 1 }))
                                : f.type === 'workshop'
                                  ? (s(), u(g, { key: 5, class: 'tree-icon' }, { default: o(() => [d(n(fe))]), _: 1 }))
                                  : (s(), u(g, { key: 6, class: 'tree-icon' }, { default: o(() => [d(n(re))]), _: 1 })),
                          b('span', null, I(f.name), 1)
                        ])
                      ]),
                      _: 1
                    },
                    8,
                    ['data']
                  )
                ])
              ]),
              index: o(({ $index: t }) => [z(I(t + 1 + (n(N).currentPage - 1) * n(N).pageSize), 1)]),
              type: o(({ row: t }) => [d(le, { size: 'small', type: X(t.type) }, { default: o(() => [z(I(G(t.type)), 1)]), _: 2 }, 1032, ['type'])]),
              actions: o(({ row: t }) => [d(xe, { actions: F, onAction: (f) => Q(f, t) }, null, 8, ['onAction'])]),
              dialog: o(() => [
                d(
                  Ce,
                  {
                    visible: c.value,
                    'onUpdate:visible': a[0] || (a[0] = (t) => (c.value = t)),
                    form: l.value,
                    'onUpdate:form': a[1] || (a[1] = (t) => (l.value = t)),
                    mode: m.value,
                    onSubmit: Z
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
  We = ve(Me, [['__scopeId', 'data-v-0687a64f']])
export { We as default }

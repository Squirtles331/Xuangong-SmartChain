import {
  An as oe,
  Bn as n,
  Et as ne,
  Fn as W,
  H as ie,
  I as re,
  Kn as se,
  Nn as $,
  On as u,
  Xn as b,
  Yn as de,
  _t as K,
  an as f,
  d as ue,
  dn as i,
  ft as pe,
  ht as ce,
  i as q,
  in as m,
  ir as me,
  kt as ve,
  on as fe,
  ot as G,
  pn as j,
  rn as V,
  rr as v,
  sn as N,
  sr as X,
  tn as ye,
  un as T,
  yn as z,
  zt as be
} from './element-plus-CzL7BOKu.js'
import { I as Y } from './index-DqMfCNbk.js'
import { t as _e } from './useTable-Hzr4fBAy.js'
import { t as H } from './StatusTag-DWd3m1xj.js'
import { t as he } from './CrudFormDialog-1OgQthWb.js'
import { t as ge } from './CrudPage-7Q0FEhS_.js'
import { t as Ce } from './CrudRowActions-Dmc4i_Io.js'
import { f as h, n as ke, t as we } from './static-data-B3FhK4xc.js'
var Me = { class: 'icon-preview' },
  Se = { class: 'icon-preview__content' },
  Ie = { key: 1, class: 'icon-preview__empty' },
  Fe = { class: 'icon-grid' },
  Te = ['onClick'],
  xe = { class: 'icon-name' },
  De = j({
    __name: 'MenuFormDialog',
    props: z({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: z(['submit'], ['update:visible', 'update:form']),
    setup(w, { emit: x }) {
      const M = W(w, 'visible'),
        y = W(w, 'form'),
        D = x,
        R = [
          { type: 'input', label: '名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '目录', value: 'directory' },
                { label: '菜单', value: 'menu' },
                { label: '按钮', value: 'button' }
              ]
            }
          },
          { type: 'input', label: '路由路径', field: 'path' },
          { type: 'input', label: '组件路径', field: 'component' },
          { type: 'input', label: '权限编码', field: 'permissionCode', required: !0 },
          { type: 'input', label: '图标', field: 'icon' },
          { type: 'input-number', label: '排序', field: 'sortOrder', props: { min: 0 } },
          { type: 'switch', label: '是否可见', field: 'visible' }
        ],
        g = b(''),
        s = b(!1),
        k = b([
          'HomeFilled',
          'Setting',
          'User',
          'Lock',
          'Key',
          'List',
          'Grid',
          'Menu',
          'Document',
          'Folder',
          'FolderOpened',
          'Edit',
          'Delete',
          'Plus',
          'Minus',
          'Check',
          'Close',
          'Search',
          'Refresh',
          'Upload',
          'Download',
          'Share',
          'Message',
          'Bell',
          'Warning',
          'InfoFilled',
          'CircleCheck',
          'Clock',
          'Calendar',
          'Picture',
          'VideoCamera',
          'Monitor',
          'DataAnalysis',
          'TrendCharts',
          'Histogram',
          'PieChart',
          'Connection',
          'Link',
          'Switch',
          'Operation',
          'Tools',
          'Platform',
          'Management',
          'Promotion',
          'Collection',
          'Tickets',
          'Postcard',
          'Box',
          'Goods',
          'ShoppingBag',
          'ShoppingCart',
          'PriceTag',
          'Coin',
          'Money',
          'Wallet',
          'CreditCard',
          'BankCard',
          'MapLocation',
          'Position',
          'LocationFilled',
          'Aim',
          'Compass',
          'ChatDotRound',
          'ChatLineRound',
          'ChatLineSquare',
          'ChatRound',
          'Service',
          'Headset',
          'Phone',
          'PhoneFilled',
          'MessageBox',
          'View',
          'Hide',
          'Unlock',
          'Finished',
          'More',
          'MoreFilled',
          'Star',
          'StarFilled',
          'Thumb',
          'Pointer',
          'Flag',
          'Sell',
          'Filter',
          'Sort',
          'Rank',
          'Guide',
          'Opportunity'
        ]),
        p = V(() => {
          if (!g.value) return k.value
          const c = g.value.toLowerCase()
          return k.value.filter((t) => t.toLowerCase().includes(c))
        })
      function _(c) {
        ;((y.value.icon = c), (s.value = !1))
      }
      return (c, t) => {
        const S = K,
          I = G,
          E = ce,
          O = pe,
          P = re,
          C = ie
        return (
          u(),
          f(
            he,
            {
              visible: M.value,
              'onUpdate:visible': t[3] || (t[3] = (a) => (M.value = a)),
              form: y.value,
              'onUpdate:form': t[4] || (t[4] = (a) => (y.value = a)),
              title: w.mode === 'add' ? '新增菜单节点' : '编辑菜单节点',
              columns: R,
              'label-width': 100,
              width: '600px',
              onSubmit: t[5] || (t[5] = (a) => D('submit'))
            },
            {
              default: n(() => [
                m('div', Me, [
                  i(
                    E,
                    { label: '图标预览' },
                    {
                      default: n(() => [
                        m('div', Se, [
                          y.value.icon
                            ? (u(), f(S, { key: 0, size: 28 }, { default: n(() => [(u(), f($(y.value.icon)))]), _: 1 }))
                            : (u(), N('span', Ie, '未选择')),
                          i(
                            I,
                            { link: '', type: 'primary', onClick: t[0] || (t[0] = (a) => (s.value = !0)) },
                            { default: n(() => [...(t[6] || (t[6] = [T('选择图标', -1)]))]), _: 1 }
                          )
                        ])
                      ]),
                      _: 1
                    }
                  )
                ]),
                i(
                  C,
                  {
                    modelValue: s.value,
                    'onUpdate:modelValue': t[2] || (t[2] = (a) => (s.value = a)),
                    title: '选择图标',
                    width: '700px',
                    'append-to-body': '',
                    'lock-scroll': !1
                  },
                  {
                    default: n(() => [
                      i(
                        O,
                        {
                          modelValue: g.value,
                          'onUpdate:modelValue': t[1] || (t[1] = (a) => (g.value = a)),
                          placeholder: '搜索图标名称...',
                          clearable: '',
                          style: { 'margin-bottom': '12px' }
                        },
                        null,
                        8,
                        ['modelValue']
                      ),
                      m('div', Fe, [
                        (u(!0),
                        N(
                          ye,
                          null,
                          oe(
                            p.value,
                            (a) => (
                              u(),
                              N(
                                'div',
                                { key: a, class: me(['icon-item', { active: y.value.icon === a }]), onClick: (A) => _(a) },
                                [i(S, { size: 24 }, { default: n(() => [(u(), f($(a)))]), _: 2 }, 1024), m('span', xe, X(a), 1)],
                                10,
                                Te
                              )
                            )
                          ),
                          128
                        ))
                      ]),
                      p.value.length ? fe('', !0) : (u(), f(P, { key: 0, description: '未找到匹配图标' }))
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            },
            8,
            ['visible', 'form', 'title']
          )
        )
      }
    }
  }),
  Re = Y(De, [['__scopeId', 'data-v-2d0f078b']]),
  Ee = { class: 'tree-wrapper' },
  Oe = { class: 'tree-header' },
  Pe = { class: 'tree-node' },
  Le = { class: 'tree-toolbar' },
  Ne = j({
    __name: 'index',
    setup(w) {
      const x = [
          { label: '目录', value: 'directory' },
          { label: '菜单', value: 'menu' },
          { label: '按钮', value: 'button' }
        ],
        M = [
          { label: '目录', value: 'directory', type: 'info' },
          { label: '菜单', value: 'menu', type: 'primary' },
          { label: '按钮', value: 'button', type: 'warning' }
        ],
        y = [
          { label: '显示', value: !0, type: 'success' },
          { label: '隐藏', value: !1, type: 'info' }
        ],
        D = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '菜单名称 / 路由 / 权限编码', clearable: !0 } },
          { type: 'select-v2', label: '类型', field: 'type', props: { options: x, clearable: !0 } }
        ],
        R = [
          { type: 'index', label: '#', width: 60 },
          { prop: 'name', label: '菜单名称', minWidth: 160 },
          { prop: 'parentName', label: '上级节点', minWidth: 140 },
          { prop: 'type', label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'path', label: '路由路径', minWidth: 180 },
          { prop: 'permissionCode', label: '权限编码', minWidth: 200 },
          { prop: 'sortOrder', label: '排序', minWidth: 80, align: 'center' },
          { prop: 'visible', label: '显示状态', minWidth: 100, slotName: 'visible', align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        g = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      let s = de({ keyword: '', type: '' })
      const k = b([]),
        p = b(null),
        _ = b(!1),
        c = b('add'),
        t = b(B()),
        S = V(() => we()),
        I = V(() => {
          const l = s.keyword.trim().toLowerCase()
          return S.value.filter((e) => {
            const d =
                !l || e.name.toLowerCase().includes(l) || (e.path || '').toLowerCase().includes(l) || e.permissionCode.toLowerCase().includes(l),
              r = !s.type || e.type === s.type,
              L = !p.value?.id || e.parentId === p.value.id || e.id === p.value.id
            return d && r && L
          })
        }),
        {
          tableData: E,
          pagination: O,
          loading: P,
          search: C,
          refresh: a,
          onDelete: A
        } = _e({
          rowKey: 'id',
          listAPI: async ({ page: l, size: e }) => {
            const d = (l - 1) * e,
              r = d + e
            return { list: I.value.slice(d, r), total: I.value.length }
          },
          deleteAPI: async (l) => {
            const e = new Set(l)
            let d = !0
            for (; d; )
              ((d = !1),
                h.value.forEach((r) => {
                  r.parentId && e.has(r.parentId) && !e.has(r.id) && (e.add(r.id), (d = !0))
                }))
            ;((h.value = h.value.filter((r) => !e.has(r.id))), F())
          }
        })
      F()
      function B() {
        return { id: '', parentId: null, name: '', type: 'menu', path: '', component: '', permissionCode: '', icon: '', sortOrder: 1, visible: !0 }
      }
      function J() {
        ;(Object.assign(s, { keyword: '', type: '' }), (p.value = null), C())
      }
      function F() {
        k.value = ke()
      }
      function Q(l) {
        ;((p.value = l), C())
      }
      function Z() {
        ;((p.value = null), C())
      }
      function U(l) {
        ;((c.value = 'add'),
          (t.value = { ...B(), parentId: l?.id || null, type: l ? (l.type === 'button' ? 'button' : 'menu') : 'directory' }),
          (_.value = !0))
      }
      function ee(l) {
        ;((c.value = 'edit'),
          (t.value = {
            id: l.id,
            parentId: l.parentId,
            name: l.name,
            type: l.type,
            path: l.path || '',
            component: l.component || '',
            permissionCode: l.permissionCode,
            icon: l.icon || '',
            sortOrder: l.sortOrder,
            visible: l.visible
          }),
          (_.value = !0))
      }
      function te(l, e) {
        if (l === 'edit') {
          ee(e)
          return
        }
        l === 'delete' && A(e)
      }
      async function le() {
        if (!t.value.name || !t.value.permissionCode) {
          q.warning('请填写菜单名称和权限编码')
          return
        }
        const l = {
          parentId: t.value.parentId,
          name: t.value.name,
          type: t.value.type,
          path: t.value.path || void 0,
          component: t.value.component || void 0,
          permissionCode: t.value.permissionCode,
          icon: t.value.icon || void 0,
          sortOrder: t.value.sortOrder,
          visible: t.value.visible
        }
        ;(c.value === 'add'
          ? h.value.push({ id: `MENU-${String(h.value.length + 1).padStart(3, '0')}`, ...l })
          : (h.value = h.value.map((e) => (e.id === t.value.id ? { ...e, ...l } : e))),
          (_.value = !1),
          F(),
          await a(),
          q.success(c.value === 'add' ? '已新增静态菜单数据' : '已更新静态菜单数据'))
      }
      return (l, e) => {
        const d = G,
          r = K,
          L = ue
        return (
          u(),
          f(
            ge,
            {
              'search-model': v(s),
              'onUpdate:searchModel': e[3] || (e[3] = (o) => (se(s) ? (s.value = o) : (s = o))),
              title: '菜单列表',
              'page-attrs': { size: 320, style: 'height: calc(100vh - 120px)' },
              'search-columns': D,
              columns: R,
              data: v(E),
              pagination: v(O),
              loading: v(P),
              'table-attrs': { border: !0, style: 'height: 100%' },
              onSearch: v(C),
              onReset: J,
              onRefresh: v(a),
              onAdd: e[4] || (e[4] = (o) => U(p.value))
            },
            {
              left: n(() => [
                m('div', Ee, [
                  m('div', Oe, [
                    e[6] || (e[6] = m('span', { class: 'tree-title' }, '菜单树', -1)),
                    i(d, { link: '', type: 'primary', onClick: F }, { default: n(() => [...(e[5] || (e[5] = [T('刷新', -1)]))]), _: 1 })
                  ]),
                  i(
                    L,
                    {
                      data: k.value,
                      props: { children: 'children', label: 'name' },
                      'node-key': 'id',
                      'expand-on-click-node': !1,
                      'highlight-current': '',
                      onNodeClick: Q
                    },
                    {
                      default: n(({ data: o }) => [
                        m('span', Pe, [
                          o.type === 'directory'
                            ? (u(), f(r, { key: 0 }, { default: n(() => [i(v(ve))]), _: 1 }))
                            : o.type === 'menu'
                              ? (u(), f(r, { key: 1 }, { default: n(() => [i(v(ne))]), _: 1 }))
                              : (u(), f(r, { key: 2 }, { default: n(() => [i(v(be))]), _: 1 })),
                          m('span', null, X(o.name), 1)
                        ])
                      ]),
                      _: 1
                    },
                    8,
                    ['data']
                  ),
                  m('div', Le, [
                    i(
                      d,
                      { type: 'primary', size: 'small', onClick: e[0] || (e[0] = (o) => U(null)) },
                      { default: n(() => [...(e[7] || (e[7] = [T('新增根节点', -1)]))]), _: 1 }
                    ),
                    i(d, { size: 'small', onClick: Z }, { default: n(() => [...(e[8] || (e[8] = [T('查看全部', -1)]))]), _: 1 })
                  ])
                ])
              ]),
              type: n(({ row: o }) => [i(H, { value: o.type, options: M }, null, 8, ['value'])]),
              visible: n(({ row: o }) => [i(H, { value: o.visible, options: y }, null, 8, ['value'])]),
              actions: n(({ row: o }) => [i(Ce, { actions: g, onAction: (ae) => te(ae, o) }, null, 8, ['onAction'])]),
              dialog: n(() => [
                i(
                  Re,
                  {
                    visible: _.value,
                    'onUpdate:visible': e[1] || (e[1] = (o) => (_.value = o)),
                    form: t.value,
                    'onUpdate:form': e[2] || (e[2] = (o) => (t.value = o)),
                    mode: c.value,
                    onSubmit: le
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
  He = Y(Ne, [['__scopeId', 'data-v-96cdb175']])
export { He as default }

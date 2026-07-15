import {
  A as P,
  An as T,
  Bn as _,
  Mn as E,
  Nn as R,
  On as t,
  Ot as N,
  Tt as V,
  _t as L,
  an as $,
  ct as A,
  dn as n,
  in as a,
  ir as B,
  on as f,
  ot as D,
  pn as S,
  rn as y,
  rr as p,
  sn as r,
  sr as g,
  st as F,
  tn as C,
  un as I
} from './element-plus-CzL7BOKu.js'
import { i as O } from './vue-chunks-CWn_TkJU.js'
import { I as k } from './index-DqMfCNbk.js'
import { t as q } from './layout-CiBjgsjA.js'
import { a as z, i as M, n as j, r as G, t as J } from './AffixTabs-mp_EnY58.js'
var K = { class: 'double-column-header' },
  Q = { class: 'header-left' },
  U = { class: 'brand' },
  W = ['src'],
  X = { key: 0, class: 'header-center' },
  Y = S({
    __name: 'Header',
    props: { breadcrumbs: {} },
    setup(e) {
      const c = q(),
        d = y(() => c.showBreadcrumb)
      return (h, s) => {
        const i = A,
          u = F
        return (
          t(),
          r('header', K, [
            a('div', Q, [
              a('div', U, [
                a('img', { class: 'brand-logo', src: p(M), alt: '玄工智链' }, null, 8, W),
                s[0] ||
                  (s[0] = a(
                    'div',
                    { class: 'brand-copy' },
                    [a('span', { class: 'brand-title' }, '玄工智链'), a('span', { class: 'brand-subtitle' }, '制造运营协同平台')],
                    -1
                  ))
              ])
            ]),
            d.value
              ? (t(),
                r('div', X, [
                  n(
                    u,
                    { separator: '/' },
                    {
                      default: _(() => [
                        n(i, { to: { path: '/' } }, { default: _(() => [...(s[1] || (s[1] = [I('工作台', -1)]))]), _: 1 }),
                        (t(!0),
                        r(
                          C,
                          null,
                          T(
                            e.breadcrumbs,
                            (o) => (t(), $(i, { key: o.path, to: o.path }, { default: _(() => [I(g(o.title), 1)]), _: 2 }, 1032, ['to']))
                          ),
                          128
                        ))
                      ]),
                      _: 1
                    }
                  )
                ]))
              : f('', !0),
            n(z)
          ])
        )
      }
    }
  }),
  Z = k(Y, [['__scopeId', 'data-v-fae9ace4']]),
  ee = { class: 'primary-rail' },
  te = { class: 'rail-head' },
  ae = ['src'],
  se = { class: 'rail-body' },
  le = ['onClick'],
  oe = { class: 'rail-label' },
  re = S({
    __name: 'PrimaryRail',
    props: { topLevelItems: {}, activeTopLevelPath: {} },
    emits: ['select-top-level'],
    setup(e, { emit: c }) {
      const d = c,
        h = (s) => {
          const i = V
          return (s && i[s]) || i.Document
        }
      return (s, i) => {
        const u = L
        return (
          t(),
          r('aside', ee, [
            a('div', te, [a('img', { class: 'rail-logo', src: p(M), alt: '玄工智链' }, null, 8, ae)]),
            a('div', se, [
              (t(!0),
              r(
                C,
                null,
                T(
                  e.topLevelItems,
                  (o) => (
                    t(),
                    r(
                      'button',
                      {
                        key: o.path,
                        type: 'button',
                        class: B(['rail-item', { 'is-active': o.path === e.activeTopLevelPath }]),
                        onClick: (v) => d('select-top-level', o.path)
                      },
                      [
                        n(
                          u,
                          { class: 'rail-icon' },
                          { default: _(() => [(t(), $(R(h(o.icon || (o.path === '/' ? 'House' : 'Menu')))))]), _: 2 },
                          1024
                        ),
                        a('span', oe, g(o.title), 1)
                      ],
                      10,
                      le
                    )
                  )
                ),
                128
              ))
            ])
          ])
        )
      }
    }
  }),
  ie = k(re, [['__scopeId', 'data-v-a1a87c3f']]),
  ne = { class: 'sidebar-head' },
  de = { class: 'sidebar-title' },
  ce = { key: 0, class: 'sidebar-hint' },
  ue = { key: 0, class: 'sidebar-menu-wrap' },
  ve = { key: 1, class: 'sidebar-empty' },
  me = { class: 'sidebar-footer' },
  _e = { key: 0, class: 'sidebar-footer-text' },
  be = S({
    __name: 'SecondarySidebar',
    props: { items: {}, activeMenu: {}, collapsed: { type: Boolean }, show: { type: Boolean }, sectionTitle: {}, sectionHint: {} },
    emits: ['select', 'toggle-collapse'],
    setup(e, { emit: c }) {
      const d = c
      return (h, s) => {
        const i = P,
          u = L,
          o = D
        return (
          t(),
          r(
            'aside',
            { class: B(['secondary-sidebar', { collapsed: e.collapsed, show: e.show }]) },
            [
              a('div', ne, [a('div', de, g(e.sectionTitle || '导航目录'), 1), e.sectionHint ? (t(), r('div', ce, g(e.sectionHint), 1)) : f('', !0)]),
              e.items.length
                ? (t(),
                  r('div', ue, [
                    n(
                      i,
                      {
                        class: 'sidebar-menu',
                        'default-active': e.activeMenu,
                        collapse: e.collapsed,
                        'unique-opened': !0,
                        router: '',
                        'background-color': 'transparent',
                        'text-color': 'var(--layout-sidebar-text)',
                        'active-text-color': 'var(--layout-sidebar-active-text)',
                        onSelect: s[0] || (s[0] = (v) => d('select'))
                      },
                      {
                        default: _(() => [
                          (t(!0),
                          r(
                            C,
                            null,
                            T(e.items, (v) => (t(), $(G, { key: v.path, item: v, 'leaf-icon': !0 }, null, 8, ['item']))),
                            128
                          ))
                        ]),
                        _: 1
                      },
                      8,
                      ['default-active', 'collapse']
                    )
                  ]))
                : (t(), r('div', ve, '当前一级菜单下没有二级导航，可以直接在内容区操作。')),
              a('div', me, [
                e.collapsed ? f('', !0) : (t(), r('span', _e, '收起目录')),
                n(
                  o,
                  { text: '', class: 'collapse-toggle', onClick: s[1] || (s[1] = (v) => d('toggle-collapse')) },
                  { default: _(() => [n(u, null, { default: _(() => [n(p(N))]), _: 1 })]), _: 1 }
                )
              ])
            ],
            2
          )
        )
      }
    }
  }),
  pe = k(be, [['__scopeId', 'data-v-b6c4a23f']]),
  he = { class: 'double-column-layout' },
  fe = { class: 'layout-body' },
  ye = { class: 'layout-main' },
  ge = { class: 'app-content-shell' },
  $e = { class: 'app-content' },
  Se = S({
    __name: 'Layout',
    props: {
      breadcrumbs: {},
      activeMenu: {},
      sidebarCollapsed: { type: Boolean },
      sidebarShow: { type: Boolean },
      isMobile: { type: Boolean },
      tabs: {},
      activeTab: {}
    },
    emits: ['select-menu', 'toggle-sidebar', 'remove-tab', 'tab-click'],
    setup(e) {
      const c = O(),
        { topLevelItems: d, activeTopLevelPath: h, activeTopLevelItem: s, currentSidebarItems: i, resolveFirstPath: u } = j(),
        o = y(() => i.value.length > 0),
        v = y(() => s.value?.title || '导航目录'),
        x = y(() => (i.value.length ? `当前一级域下共 ${i.value.length} 项菜单` : ''))
      function H(m) {
        const l = d.value.find((w) => w.path === m)
        l && c.push(l.kind === 'group' ? u(l) : l.path)
      }
      return (m, l) => {
        const w = E('router-view')
        return (
          t(),
          r('div', he, [
            n(Z, { breadcrumbs: e.breadcrumbs }, null, 8, ['breadcrumbs']),
            a('div', fe, [
              a(
                'div',
                { class: B(['dual-sidebar', { show: e.sidebarShow && e.isMobile }]) },
                [
                  n(ie, { 'top-level-items': p(d), 'active-top-level-path': p(h), onSelectTopLevel: H }, null, 8, [
                    'top-level-items',
                    'active-top-level-path'
                  ]),
                  o.value
                    ? (t(),
                      $(
                        pe,
                        {
                          key: 0,
                          items: p(i),
                          'active-menu': e.activeMenu,
                          collapsed: e.sidebarCollapsed,
                          show: e.sidebarShow,
                          'section-title': v.value,
                          'section-hint': x.value,
                          onSelect: l[0] || (l[0] = (b) => m.$emit('select-menu')),
                          onToggleCollapse: l[1] || (l[1] = (b) => m.$emit('toggle-sidebar'))
                        },
                        null,
                        8,
                        ['items', 'active-menu', 'collapsed', 'show', 'section-title', 'section-hint']
                      ))
                    : f('', !0)
                ],
                2
              ),
              e.sidebarShow && e.isMobile
                ? (t(), r('div', { key: 0, class: 'sidebar-mask', onClick: l[2] || (l[2] = (b) => m.$emit('toggle-sidebar')) }))
                : f('', !0),
              a('main', ye, [
                n(
                  J,
                  {
                    tabs: e.tabs,
                    'active-tab': e.activeTab,
                    onRemoveTab: l[3] || (l[3] = (b) => m.$emit('remove-tab', b)),
                    onTabClick: l[4] || (l[4] = (b) => m.$emit('tab-click', b))
                  },
                  null,
                  8,
                  ['tabs', 'active-tab']
                ),
                a('div', ge, [a('div', $e, [n(w)])])
              ])
            ])
          ])
        )
      }
    }
  }),
  Ie = k(Se, [['__scopeId', 'data-v-c4b90007']])
export { Ie as default }

import {
  A as H,
  An as g,
  Bn as d,
  M as L,
  Mn as N,
  Nn as x,
  On as a,
  Ot as D,
  Tt as V,
  _t as A,
  an as _,
  ct as O,
  dn as r,
  in as e,
  ir as R,
  j,
  on as m,
  ot as q,
  pn as $,
  rn as z,
  rr as b,
  sn as n,
  sr as v,
  st as F,
  tn as y,
  un as M
} from './element-plus-CzL7BOKu.js'
import { I as w } from './index-DqMfCNbk.js'
import { t as G } from './layout-CiBjgsjA.js'
import { a as J, i as S, n as K, r as P, t as Q } from './AffixTabs-mp_EnY58.js'
var U = { class: 'app-header' },
  W = { class: 'header-left' },
  X = { class: 'brand' },
  Y = ['src'],
  Z = { key: 0, class: 'header-center' },
  ee = $({
    __name: 'Header',
    props: { breadcrumbs: {} },
    setup(t) {
      const i = G(),
        l = z(() => i.showBreadcrumb)
      return (p, o) => {
        const f = O,
          h = F
        return (
          a(),
          n('header', U, [
            e('div', W, [
              e('div', X, [
                e('img', { class: 'brand-logo', src: b(S), alt: '玄工智链' }, null, 8, Y),
                o[0] ||
                  (o[0] = e(
                    'div',
                    { class: 'brand-copy' },
                    [e('span', { class: 'brand-title' }, '玄工智链'), e('span', { class: 'brand-subtitle' }, '制造运营协同平台')],
                    -1
                  ))
              ])
            ]),
            l.value
              ? (a(),
                n('div', Z, [
                  r(
                    h,
                    { separator: '/' },
                    {
                      default: d(() => [
                        r(f, { to: { path: '/' } }, { default: d(() => [...(o[1] || (o[1] = [M('工作台', -1)]))]), _: 1 }),
                        (a(!0),
                        n(
                          y,
                          null,
                          g(
                            t.breadcrumbs,
                            (u) => (a(), _(f, { key: u.path, to: u.path }, { default: d(() => [M(v(u.title), 1)]), _: 2 }, 1032, ['to']))
                          ),
                          128
                        ))
                      ]),
                      _: 1
                    }
                  )
                ]))
              : m('', !0),
            r(J)
          ])
        )
      }
    }
  }),
  ae = w(ee, [['__scopeId', 'data-v-7df5b15e']]),
  te = { class: 'sidebar-top' },
  se = { class: 'sidebar-brand' },
  le = ['src'],
  oe = { class: 'menu-title-wrap' },
  re = { class: 'menu-title' },
  ne = { key: 0, class: 'menu-tag' },
  de = { class: 'menu-title-wrap' },
  ie = { class: 'menu-title' },
  ue = { key: 0, class: 'menu-tag' },
  ce = { class: 'sidebar-footer' },
  _e = { key: 0, class: 'sidebar-footer-text' },
  be = $({
    __name: 'Sidebar',
    props: { activeMenu: {}, collapsed: { type: Boolean }, show: { type: Boolean } },
    emits: ['select', 'toggle-collapse'],
    setup(t, { emit: i }) {
      const l = i,
        { singleItems: p, groups: o } = K(),
        f = () => l('select'),
        h = (u) => {
          const c = V
          return (u && c[u]) || c.Document
        }
      return (u, c) => {
        const k = A,
          C = j,
          T = L,
          I = H,
          E = q
        return (
          a(),
          n(
            'aside',
            { class: R(['app-sidebar', { collapsed: t.collapsed, show: t.show }]) },
            [
              e('div', te, [
                e('div', se, [
                  e('img', { class: 'sidebar-brand-logo', src: b(S), alt: '玄工智链' }, null, 8, le),
                  c[1] ||
                    (c[1] = e(
                      'div',
                      { class: 'sidebar-brand-copy' },
                      [e('div', { class: 'sidebar-brand-title' }, '玄工智链'), e('div', { class: 'sidebar-brand-subtitle' }, '业务导航')],
                      -1
                    ))
                ])
              ]),
              r(
                I,
                {
                  class: 'sidebar-menu',
                  'default-active': t.activeMenu,
                  collapse: t.collapsed,
                  'unique-opened': !0,
                  router: '',
                  'background-color': 'var(--layout-sidebar-bg)',
                  'text-color': 'var(--layout-sidebar-text)',
                  'active-text-color': 'var(--layout-sidebar-active-text)',
                  onSelect: f
                },
                {
                  default: d(() => [
                    (a(!0),
                    n(
                      y,
                      null,
                      g(
                        b(p),
                        (s) => (
                          a(),
                          _(
                            C,
                            { key: s.path, index: s.path },
                            {
                              default: d(() => [
                                r(k, null, { default: d(() => [(a(), _(x(h(s.icon || (s.path === '/' ? 'House' : 'Document')))))]), _: 2 }, 1024),
                                e('span', oe, [e('span', re, v(s.title), 1), s.menuTag ? (a(), n('span', ne, v(s.menuTag), 1)) : m('', !0)])
                              ]),
                              _: 2
                            },
                            1032,
                            ['index']
                          )
                        )
                      ),
                      128
                    )),
                    (a(!0),
                    n(
                      y,
                      null,
                      g(
                        b(o),
                        (s) => (
                          a(),
                          _(
                            T,
                            { key: s.path, index: s.path },
                            {
                              title: d(() => [
                                r(k, null, { default: d(() => [(a(), _(x(h(s.icon || 'Menu'))))]), _: 2 }, 1024),
                                e('span', de, [e('span', ie, v(s.title), 1), s.menuTag ? (a(), n('span', ue, v(s.menuTag), 1)) : m('', !0)])
                              ]),
                              default: d(() => [
                                (a(!0),
                                n(
                                  y,
                                  null,
                                  g(s.children, (B) => (a(), _(P, { key: B.path, item: B }, null, 8, ['item']))),
                                  128
                                ))
                              ]),
                              _: 2
                            },
                            1032,
                            ['index']
                          )
                        )
                      ),
                      128
                    ))
                  ]),
                  _: 1
                },
                8,
                ['default-active', 'collapse']
              ),
              e('div', ce, [
                t.collapsed ? m('', !0) : (a(), n('span', _e, '收起导航')),
                r(
                  E,
                  { text: '', class: 'collapse-toggle', onClick: c[0] || (c[0] = (s) => l('toggle-collapse')) },
                  { default: d(() => [r(k, null, { default: d(() => [r(b(D))]), _: 1 })]), _: 1 }
                )
              ])
            ],
            2
          )
        )
      }
    }
  }),
  ve = w(be, [['__scopeId', 'data-v-78a40d3a']]),
  me = { class: 'app-layout' },
  pe = { class: 'app-body' },
  fe = { class: 'app-main' },
  he = { class: 'app-content-shell' },
  ge = { class: 'app-content' },
  ye = $({
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
    setup(t) {
      return (i, l) => {
        const p = N('router-view')
        return (
          a(),
          n('div', me, [
            r(ae, { breadcrumbs: t.breadcrumbs }, null, 8, ['breadcrumbs']),
            e('div', pe, [
              r(
                ve,
                {
                  'active-menu': t.activeMenu,
                  collapsed: t.sidebarCollapsed,
                  show: t.sidebarShow,
                  onSelect: l[0] || (l[0] = (o) => i.$emit('select-menu')),
                  onToggleCollapse: l[1] || (l[1] = (o) => i.$emit('toggle-sidebar'))
                },
                null,
                8,
                ['active-menu', 'collapsed', 'show']
              ),
              t.sidebarShow && t.isMobile
                ? (a(), n('div', { key: 0, class: 'sidebar-mask', onClick: l[2] || (l[2] = (o) => i.$emit('toggle-sidebar')) }))
                : m('', !0),
              e('main', fe, [
                r(
                  Q,
                  {
                    tabs: t.tabs,
                    'active-tab': t.activeTab,
                    onRemoveTab: l[3] || (l[3] = (o) => i.$emit('remove-tab', o)),
                    onTabClick: l[4] || (l[4] = (o) => i.$emit('tab-click', o))
                  },
                  null,
                  8,
                  ['tabs', 'active-tab']
                ),
                e('div', he, [e('div', ge, [r(p)])])
              ])
            ])
          ])
        )
      }
    }
  }),
  xe = w(ye, [['__scopeId', 'data-v-a7389a83']])
export { xe as default }

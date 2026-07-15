import {
  A as D,
  An as E,
  Bn as b,
  Cn as V,
  Mn as A,
  Nn as F,
  On as s,
  Ot as X,
  Rn as Y,
  Tn as q,
  Tt as U,
  Xn as x,
  _t as W,
  an as M,
  bt as j,
  ct as G,
  dn as r,
  in as o,
  ir as $,
  on as f,
  ot as J,
  pn as R,
  rn as B,
  rr as y,
  sn as n,
  sr as L,
  st as K,
  tn as H,
  un as N,
  xn as P,
  yt as Q
} from './element-plus-CzL7BOKu.js'
import { i as Z } from './vue-chunks-CWn_TkJU.js'
import { I as z } from './index-DqMfCNbk.js'
import { t as ee } from './layout-CiBjgsjA.js'
import { a as te, i as ae, n as le, r as se, t as oe } from './AffixTabs-mp_EnY58.js'
var ne = { class: 'double-row-header' },
  re = { class: 'header-main' },
  ie = { class: 'header-left' },
  ue = { class: 'brand' },
  de = ['src'],
  ce = { key: 0, class: 'header-center' },
  ve = { class: 'header-nav-row' },
  be = ['disabled'],
  me = ['onClick'],
  pe = { class: 'top-nav-title' },
  _e = { key: 0, class: 'top-nav-tag' },
  he = ['disabled'],
  fe = R({
    __name: 'Header',
    props: { breadcrumbs: {}, topLevelItems: {}, activeTopLevelPath: {} },
    emits: ['select-top-level'],
    setup(e, { emit: k }) {
      const m = e,
        T = k,
        p = ee(),
        _ = B(() => p.showBreadcrumb),
        u = x(null),
        c = x(!1),
        d = x(!1),
        S = x(!1)
      let g = null
      const v = (l) => {
          const a = U
          return (l && a[l]) || a.Document
        },
        t = () => {
          const l = u.value
          if (!l) return
          const a = Math.max(l.scrollWidth - l.clientWidth, 0)
          ;((c.value = a > 4), (d.value = l.scrollLeft > 4), (S.value = l.scrollLeft < a - 4))
        },
        w = (l) => {
          const a = u.value
          if (!a) return
          const C = l === 'next' ? 240 : -240
          a.scrollBy({ left: C, behavior: 'smooth' })
        },
        h = (l) => {
          const a = u.value
          a && (Math.abs(l.deltaY) <= Math.abs(l.deltaX) || a.scrollWidth <= a.clientWidth || ((a.scrollLeft += l.deltaY), t(), l.preventDefault()))
        }
      return (
        q(() => {
          P(t)
          const l = u.value
          ;(l?.addEventListener('scroll', t, { passive: !0 }),
            'ResizeObserver' in window && l ? ((g = new ResizeObserver(() => t())), g.observe(l)) : window.addEventListener('resize', t))
        }),
        V(() => {
          ;(u.value?.removeEventListener('scroll', t), g?.disconnect(), (g = null), window.removeEventListener('resize', t))
        }),
        Y(
          () => [m.topLevelItems.length, m.activeTopLevelPath],
          () => {
            P(t)
          },
          { immediate: !0 }
        ),
        (l, a) => {
          const C = G,
            O = K,
            I = W
          return (
            s(),
            n('header', ne, [
              o('div', re, [
                o('div', ie, [
                  o('div', ue, [
                    o('img', { class: 'brand-logo', src: y(ae), alt: '玄工智链' }, null, 8, de),
                    a[2] ||
                      (a[2] = o(
                        'div',
                        { class: 'brand-copy' },
                        [o('span', { class: 'brand-title' }, '玄工智链'), o('span', { class: 'brand-subtitle' }, '制造运营协同平台')],
                        -1
                      ))
                  ])
                ]),
                _.value
                  ? (s(),
                    n('div', ce, [
                      r(
                        O,
                        { separator: '/' },
                        {
                          default: b(() => [
                            r(C, { to: { path: '/' } }, { default: b(() => [...(a[3] || (a[3] = [N('工作台', -1)]))]), _: 1 }),
                            (s(!0),
                            n(
                              H,
                              null,
                              E(
                                e.breadcrumbs,
                                (i) => (s(), M(C, { key: i.path, to: i.path }, { default: b(() => [N(L(i.title), 1)]), _: 2 }, 1032, ['to']))
                              ),
                              128
                            ))
                          ]),
                          _: 1
                        }
                      )
                    ]))
                  : f('', !0),
                r(te)
              ]),
              o('div', ve, [
                c.value
                  ? (s(),
                    n(
                      'button',
                      {
                        key: 0,
                        type: 'button',
                        class: $(['scroll-arrow', { 'is-disabled': !d.value }]),
                        disabled: !d.value,
                        'aria-label': '向左查看一级菜单',
                        onClick: a[0] || (a[0] = (i) => w('prev'))
                      },
                      [r(I, null, { default: b(() => [r(y(Q))]), _: 1 })],
                      10,
                      be
                    ))
                  : f('', !0),
                o(
                  'div',
                  { ref_key: 'navScrollRef', ref: u, class: 'nav-scroll', onWheel: h },
                  [
                    (s(!0),
                    n(
                      H,
                      null,
                      E(
                        e.topLevelItems,
                        (i) => (
                          s(),
                          n(
                            'button',
                            {
                              key: i.path,
                              type: 'button',
                              class: $(['top-nav-item', { 'is-active': i.path === e.activeTopLevelPath }]),
                              onClick: (Re) => T('select-top-level', i.path)
                            },
                            [
                              r(
                                I,
                                { class: 'top-nav-icon' },
                                { default: b(() => [(s(), M(F(v(i.icon || (i.path === '/' ? 'House' : 'Menu')))))]), _: 2 },
                                1024
                              ),
                              o('span', pe, L(i.title), 1),
                              i.menuTag ? (s(), n('span', _e, L(i.menuTag), 1)) : f('', !0)
                            ],
                            10,
                            me
                          )
                        )
                      ),
                      128
                    ))
                  ],
                  544
                ),
                c.value
                  ? (s(),
                    n(
                      'button',
                      {
                        key: 1,
                        type: 'button',
                        class: $(['scroll-arrow', { 'is-disabled': !S.value }]),
                        disabled: !S.value,
                        'aria-label': '向右查看一级菜单',
                        onClick: a[1] || (a[1] = (i) => w('next'))
                      },
                      [r(I, null, { default: b(() => [r(y(j))]), _: 1 })],
                      10,
                      he
                    ))
                  : f('', !0)
              ])
            ])
          )
        }
      )
    }
  }),
  ye = z(fe, [['__scopeId', 'data-v-064a6848']]),
  ge = { class: 'sidebar-head' },
  we = { class: 'sidebar-title' },
  ke = { key: 0, class: 'sidebar-hint' },
  Se = { key: 0, class: 'sidebar-menu-wrap' },
  $e = { key: 1, class: 'sidebar-empty' },
  Le = { class: 'sidebar-footer' },
  Te = { key: 0, class: 'sidebar-footer-text' },
  Ce = R({
    __name: 'Sidebar',
    props: { items: {}, activeMenu: {}, collapsed: { type: Boolean }, show: { type: Boolean }, sectionTitle: {}, sectionHint: {} },
    emits: ['select', 'toggle-collapse'],
    setup(e, { emit: k }) {
      const m = k
      return (T, p) => {
        const _ = D,
          u = W,
          c = J
        return (
          s(),
          n(
            'aside',
            { class: $(['double-row-sidebar', { collapsed: e.collapsed, show: e.show, 'is-empty': !e.items.length }]) },
            [
              o('div', ge, [o('div', we, L(e.sectionTitle || '导航目录'), 1), e.sectionHint ? (s(), n('div', ke, L(e.sectionHint), 1)) : f('', !0)]),
              e.items.length
                ? (s(),
                  n('div', Se, [
                    r(
                      _,
                      {
                        class: 'sidebar-menu',
                        'default-active': e.activeMenu,
                        collapse: e.collapsed,
                        'unique-opened': !0,
                        router: '',
                        'background-color': 'transparent',
                        'text-color': 'var(--layout-sidebar-text)',
                        'active-text-color': 'var(--layout-sidebar-active-text)',
                        onSelect: p[0] || (p[0] = (d) => m('select'))
                      },
                      {
                        default: b(() => [
                          (s(!0),
                          n(
                            H,
                            null,
                            E(e.items, (d) => (s(), M(se, { key: d.path, item: d, 'leaf-icon': !0 }, null, 8, ['item']))),
                            128
                          ))
                        ]),
                        _: 1
                      },
                      8,
                      ['default-active', 'collapse']
                    )
                  ]))
                : (s(), n('div', $e, '当前一级菜单下没有二级导航，可以直接在内容区操作。')),
              o('div', Le, [
                e.collapsed ? f('', !0) : (s(), n('span', Te, '收起目录')),
                r(
                  c,
                  { text: '', class: 'collapse-toggle', onClick: p[1] || (p[1] = (d) => m('toggle-collapse')) },
                  { default: b(() => [r(u, null, { default: b(() => [r(y(X))]), _: 1 })]), _: 1 }
                )
              ])
            ],
            2
          )
        )
      }
    }
  }),
  xe = z(Ce, [['__scopeId', 'data-v-7d98192e']]),
  Be = { class: 'double-row-layout' },
  Me = { class: 'layout-body' },
  Ie = { class: 'app-content-shell' },
  Ee = { class: 'app-content' },
  He = R({
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
      const k = Z(),
        { topLevelItems: m, activeTopLevelPath: T, activeTopLevelItem: p, currentSidebarItems: _, resolveFirstPath: u } = le(),
        c = B(() => _.value.length > 0),
        d = B(() => p.value?.title || '导航目录'),
        S = B(() => (_.value.length ? `当前一级域下共 ${_.value.length} 项菜单` : ''))
      function g(v) {
        const t = m.value.find((w) => w.path === v)
        t && k.push(t.kind === 'group' ? u(t) : t.path)
      }
      return (v, t) => {
        const w = A('router-view')
        return (
          s(),
          n('div', Be, [
            r(ye, { breadcrumbs: e.breadcrumbs, 'top-level-items': y(m), 'active-top-level-path': y(T), onSelectTopLevel: g }, null, 8, [
              'breadcrumbs',
              'top-level-items',
              'active-top-level-path'
            ]),
            o('div', Me, [
              c.value
                ? (s(),
                  M(
                    xe,
                    {
                      key: 0,
                      items: y(_),
                      'active-menu': e.activeMenu,
                      collapsed: e.sidebarCollapsed,
                      show: e.sidebarShow,
                      'section-title': d.value,
                      'section-hint': S.value,
                      onSelect: t[0] || (t[0] = (h) => v.$emit('select-menu')),
                      onToggleCollapse: t[1] || (t[1] = (h) => v.$emit('toggle-sidebar'))
                    },
                    null,
                    8,
                    ['items', 'active-menu', 'collapsed', 'show', 'section-title', 'section-hint']
                  ))
                : f('', !0),
              c.value && e.sidebarShow && e.isMobile
                ? (s(), n('div', { key: 1, class: 'sidebar-mask', onClick: t[2] || (t[2] = (h) => v.$emit('toggle-sidebar')) }))
                : f('', !0),
              o(
                'main',
                { class: $(['layout-main', { 'layout-main--full': !c.value }]) },
                [
                  r(
                    oe,
                    {
                      tabs: e.tabs,
                      'active-tab': e.activeTab,
                      onRemoveTab: t[3] || (t[3] = (h) => v.$emit('remove-tab', h)),
                      onTabClick: t[4] || (t[4] = (h) => v.$emit('tab-click', h))
                    },
                    null,
                    8,
                    ['tabs', 'active-tab']
                  ),
                  o('div', Ie, [o('div', Ee, [r(w)])])
                ],
                2
              )
            ])
          ])
        )
      }
    }
  }),
  De = z(He, [['__scopeId', 'data-v-c23eb826']])
export { De as default }

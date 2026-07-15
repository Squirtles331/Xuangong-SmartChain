const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'static/js/Layout-UvL1Km7U.js',
      'static/js/element-plus-CzL7BOKu.js',
      'static/js/rolldown-runtime-b3L32Ng1.js',
      'static/css/element-plus-Db3gwZhn.css',
      'static/js/vue-chunks-CWn_TkJU.js',
      'static/js/index-DqMfCNbk.js',
      'static/css/index-Co48uWkv.css',
      'static/js/layout-CiBjgsjA.js',
      'static/js/AffixTabs-mp_EnY58.js',
      'static/css/AffixTabs-B62VdvYa.css',
      'static/css/Layout-CSDKHaEp.css',
      'static/js/Layout-D0_fkOQ8.js',
      'static/css/Layout-DL1A2y1b.css',
      'static/js/Layout-CYX3usNf.js',
      'static/css/Layout-DF0ntB-c.css'
    ])
) => i.map((i) => d[i])
import { Cn as w, Nn as C, On as E, Rn as A, Tn as k, Xn as l, an as M, fn as v, pn as g, rn as d } from './element-plus-CzL7BOKu.js'
import { i as x, r as D } from './vue-chunks-CWn_TkJU.js'
import { F as m } from './index-DqMfCNbk.js'
import { t as I } from './layout-CiBjgsjA.js'
var O = g({
    __name: 'AppLayout',
    setup(z) {
      const a = D(),
        r = x(),
        b = I(),
        f = (e) => (e === a.path && a.meta?.title ? a.meta.title : r.getRoutes().find((t) => t.path === e)?.meta?.title || '未知页面'),
        i = l(!1),
        u = l(!1),
        s = l(!1),
        o = l([{ title: '工作台', path: '/' }]),
        c = l('/')
      A(
        () => a.path,
        (e) => {
          const t = f(e)
          ;(!o.value.find((n) => n.path === e) && e !== '/' && o.value.push({ title: t, path: e }), (c.value = e))
        },
        { immediate: !0 }
      )
      const _ = d(() => a.matched.filter((e) => e.meta?.title).map((e) => ({ title: e.meta.title, path: e.path }))),
        h = d(() => a.meta?.activeMenu || a.path),
        T = () => {
          if (s.value) {
            u.value = !u.value
            return
          }
          i.value = !i.value
        },
        L = () => {
          s.value && (u.value = !1)
        },
        p = () => {
          ;((s.value = window.innerWidth <= 768), s.value || (u.value = !1))
        }
      ;(k(() => {
        ;(p(), window.addEventListener('resize', p))
      }),
        w(() => {
          window.removeEventListener('resize', p)
        }))
      const y = (e) => {
          if (e === '/') return
          const t = o.value.findIndex((n) => n.path === e)
          if (t !== -1 && (o.value.splice(t, 1), c.value === e)) {
            const n = o.value[t - 1] || o.value[0]
            n && r.push(n.path)
          }
        },
        R = (e) => {
          r.push(e)
        },
        S = d(() => {
          switch (b.mode) {
            case 'double-row':
              return v(() => m(() => import('./Layout-UvL1Km7U.js'), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])))
            case 'double-column':
              return v(() => m(() => import('./Layout-D0_fkOQ8.js'), __vite__mapDeps([11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12])))
            default:
              return v(() => m(() => import('./Layout-CYX3usNf.js'), __vite__mapDeps([13, 1, 2, 3, 5, 4, 6, 7, 8, 9, 14])))
          }
        })
      return (e, t) => (
        E(),
        M(
          C(S.value),
          {
            breadcrumbs: _.value,
            'active-menu': h.value,
            'sidebar-collapsed': i.value,
            'sidebar-show': u.value,
            'is-mobile': s.value,
            tabs: o.value,
            'active-tab': c.value,
            onSelectMenu: L,
            onToggleSidebar: T,
            onRemoveTab: y,
            onTabClick: R
          },
          null,
          40,
          ['breadcrumbs', 'active-menu', 'sidebar-collapsed', 'sidebar-show', 'is-mobile', 'tabs', 'active-tab']
        )
      )
    }
  }),
  U = O
export { U as default }

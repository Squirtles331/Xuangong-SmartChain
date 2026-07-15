import {
  Bn as r,
  En as N,
  Mn as x,
  On as C,
  Tn as w,
  Xn as n,
  an as S,
  dn as y,
  i,
  in as s,
  ot as b,
  pn as I,
  rn as M,
  rr as V,
  sr as h,
  un as T
} from './element-plus-CzL7BOKu.js'
import { i as z, r as A } from './vue-chunks-CWn_TkJU.js'
import { I as O } from './index-DqMfCNbk.js'
import { h as d } from './static-data-B3FhK4xc.js'
var P = { class: 'designer-header' },
  U = { class: 'designer-title' },
  X = { class: 'designer-subtitle' },
  $ = { class: 'print-designer-page' },
  j = I({
    __name: 'designer',
    setup(q) {
      const E = A(),
        B = z(),
        t = n(null),
        o = n(!1),
        v = n(!1),
        p = n(''),
        c = n(''),
        u = n(null),
        l = M(() => String(E.params.id || ''))
      function D() {
        t.value?.setTheme('light')
      }
      function f() {
        !v.value || !t.value || !u.value || t.value.loadTemplateData(u.value)
      }
      function g() {
        const e = t.value
        e && ((v.value = !0), e.setTheme('light'), e.setBranding({ title: '打印模板设计器', showTitle: !0, showLogo: !1 }), e.setLanguage('zh'), f())
      }
      function m(e) {
        const a = e.detail
        i.error(a?.error ? String(a.error) : '打印设计器发生错误')
      }
      function L() {
        if (!l.value) return
        const e = d.value.find((a) => a.id === l.value)
        if (!e) {
          i.warning('未找到对应的静态模板数据')
          return
        }
        ;((p.value = e.name), (c.value = e.categoryName || ''), (u.value = e.templateData || null), f())
      }
      async function R() {
        if (!(!l.value || !t.value)) {
          o.value = !0
          try {
            ;((d.value = d.value.map((e) =>
              e.id === l.value ? { ...e, templateData: t.value?.getTemplateData(), updatedBy: '当前用户', updatedAt: '2026-07-13 16:55' } : e
            )),
              i.success('打印模板设计已保存到静态数据'))
          } finally {
            o.value = !1
          }
        }
      }
      return (
        w(() => {
          const e = t.value
          e && (D(), e.addEventListener('ready', g), e.addEventListener('error', m), L())
        }),
        N(() => {
          const e = t.value
          e && (e.removeEventListener('ready', g), e.removeEventListener('error', m))
        }),
        (e, a) => {
          const _ = b,
            k = x('gi-page-layout')
          return (
            C(),
            S(k, null, {
              header: r(() => [s('div', P, [s('div', U, h(p.value || '打印模板设计'), 1), s('div', X, h(c.value || '打印模板设计器'), 1)])]),
              tool: r(() => [
                y(_, { onClick: a[0] || (a[0] = (F) => V(B).back()) }, { default: r(() => [...(a[1] || (a[1] = [T('返回', -1)]))]), _: 1 }),
                y(_, { type: 'primary', loading: o.value, onClick: R }, { default: r(() => [...(a[2] || (a[2] = [T('保存设计', -1)]))]), _: 1 }, 8, [
                  'loading'
                ])
              ]),
              default: r(() => [s('div', $, [s('print-designer', { ref_key: 'designerRef', ref: t, class: 'pd' }, null, 512)])]),
              _: 1
            })
          )
        }
      )
    }
  }),
  Q = O(j, [['__scopeId', 'data-v-af04a012']])
export { Q as default }

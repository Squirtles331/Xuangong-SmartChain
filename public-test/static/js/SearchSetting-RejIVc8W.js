import {
  $ as J,
  An as P,
  B as Q,
  Bn as n,
  Kt as W,
  On as p,
  Rn as F,
  Vt as Y,
  Xn as v,
  _t as Z,
  an as ee,
  dn as l,
  dt as te,
  gt as ae,
  in as u,
  it as le,
  jn as se,
  on as C,
  ot as ne,
  pn as ie,
  pt as re,
  rn as g,
  rr as y,
  sn as h,
  sr as w,
  tn as oe,
  un as _,
  xn as de
} from './element-plus-CzL7BOKu.js'
import { I as ue } from './index-DqMfCNbk.js'
import { n as ce } from './TableSetting-BqN9x3yX.js'
var _e = { class: 'search-setting' },
  fe = { key: 0, class: 'search-setting__body' },
  pe = { class: 'search-setting__actions' },
  ve = { class: 'search-setting__drawer' },
  ge = { class: 'search-setting__drawer-header' },
  he = { class: 'search-setting__drawer-title' },
  me = { class: 'search-setting__drawer-actions' },
  be = { class: 'search-setting__drag-handle' },
  ye = { class: 'search-setting__drawer-footer' },
  we = ie({
    name: 'SearchSetting',
    __name: 'SearchSetting',
    props: { columns: { default: () => [] }, requiredFields: { default: () => [] } },
    emits: ['update:visibleFields'],
    setup(B, { emit: E }) {
      const m = B,
        x = E,
        c = v(!1),
        b = v(!0),
        d = v([]),
        i = v([])
      function k(e, t) {
        return e.field != null && e.field !== '' ? String(e.field) : typeof e.label == 'string' && e.label ? e.label : `__search_${t}__`
      }
      function D(e) {
        const t = e.label
        return typeof t == 'string' && t ? t : e.field != null ? String(e.field) : ''
      }
      function z(e) {
        return !!e.field
      }
      const S = g(() => {
        const e = m.columns ?? [],
          t = []
        return (
          e.forEach((a, s) => {
            if (!z(a)) return
            const r = k(a, s)
            t.push({ key: r, title: D(a), show: !0, disabled: m.requiredFields.includes(r) })
          }),
          t
        )
      })
      function f(e) {
        return e.map((t) => ({ ...t }))
      }
      function L(e, t) {
        if (e.length === 0 || e.length !== t.length) return !1
        const a = new Set(e.map((r) => r.key)),
          s = new Set(t.map((r) => r.key))
        return a.size === s.size && [...s].every((r) => a.has(r))
      }
      F(
        S,
        (e) => {
          if (e.length === 0) {
            ;((d.value = []), (i.value = []))
            return
          }
          if (!L(d.value, e)) d.value = f(e)
          else {
            const t = new Map(e.map((a) => [a.key, a]))
            d.value = d.value.map((a) => {
              const s = t.get(a.key)
              return s ? { ...a, title: s.title, disabled: s.disabled } : a
            })
          }
          c.value || (i.value = f(d.value))
        },
        { immediate: !0 }
      )
      const M = g(() => {
          const e = m.columns ?? []
          return new Map(e.map((t, a) => [k(t, a), t]))
        }),
        V = g(() =>
          d.value
            .filter((e) => e.show)
            .map((e) => M.value.get(e.key))
            .filter(Boolean)
        ),
        T = g(() => i.value.filter((e) => e.show).length)
      F(
        V,
        (e) => {
          x('update:visibleFields', e)
        },
        { immediate: !0 }
      )
      function I() {
        ;(N(), (c.value = !0))
      }
      function K() {
        c.value = !1
      }
      function N() {
        i.value = f(d.value)
      }
      function U() {
        i.value = i.value.map((e) => ({ ...e, show: !0 }))
      }
      function A() {
        i.value = f(S.value)
      }
      async function $() {
        ;((b.value = !1), await de(), (b.value = !0))
      }
      async function q() {
        ;((d.value = f(i.value)), (c.value = !1), await $())
      }
      return (e, t) => {
        const a = Z,
          s = ne,
          r = re,
          X = ae,
          j = J,
          O = le,
          R = te,
          G = Q
        return (
          p(),
          h('div', _e, [
            b.value ? (p(), h('div', fe, [se(e.$slots, 'default', { visibleFields: V.value }, void 0, !0)])) : C('', !0),
            u('div', pe, [
              l(
                r,
                { content: '查询条件配置', placement: 'top' },
                {
                  default: n(() => [
                    l(
                      s,
                      { class: 'search-setting__icon-btn', bg: '', text: '', circle: '', onClick: I },
                      { default: n(() => [l(a, { size: 14 }, { default: n(() => [l(y(W))]), _: 1 })]), _: 1 }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            l(
              G,
              {
                modelValue: c.value,
                'onUpdate:modelValue': t[1] || (t[1] = (o) => (c.value = o)),
                title: '查询条件配置',
                direction: 'rtl',
                size: '360px',
                'append-to-body': '',
                'lock-scroll': !1
              },
              {
                footer: n(() => [
                  u('div', ye, [
                    l(s, { onClick: K }, { default: n(() => [...(t[5] || (t[5] = [_('取消', -1)]))]), _: 1 }),
                    l(s, { type: 'primary', onClick: q }, { default: n(() => [...(t[6] || (t[6] = [_('应用', -1)]))]), _: 1 })
                  ])
                ]),
                default: n(() => [
                  u('div', ve, [
                    u('div', ge, [
                      u('div', he, '已显示 ' + w(T.value) + ' / ' + w(i.value.length), 1),
                      u('div', me, [
                        l(s, { link: '', type: 'primary', onClick: U }, { default: n(() => [...(t[2] || (t[2] = [_('全选', -1)]))]), _: 1 }),
                        l(s, { link: '', onClick: A }, { default: n(() => [...(t[3] || (t[3] = [_('重置', -1)]))]), _: 1 })
                      ])
                    ]),
                    l(X, {
                      title: '默认展示全部查询条件，可勾选控制显示，并拖拽调整查询条件顺序。',
                      type: 'info',
                      closable: !1,
                      'show-icon': '',
                      class: 'search-setting__drawer-tip'
                    }),
                    l(
                      R,
                      { class: 'search-setting__draggable', 'wrap-style': { overflowX: 'hidden' } },
                      {
                        default: n(() => [
                          l(
                            y(ce),
                            {
                              modelValue: i.value,
                              'onUpdate:modelValue': t[0] || (t[0] = (o) => (i.value = o)),
                              animation: 150,
                              handle: '.search-setting__drag-handle'
                            },
                            {
                              default: n(() => [
                                (p(!0),
                                h(
                                  oe,
                                  null,
                                  P(
                                    i.value,
                                    (o) => (
                                      p(),
                                      h('div', { key: o.key, class: 'search-setting__draggable-item' }, [
                                        u('span', be, [l(a, { size: 14 }, { default: n(() => [l(y(Y))]), _: 1 })]),
                                        l(
                                          j,
                                          {
                                            modelValue: o.show,
                                            'onUpdate:modelValue': (H) => (o.show = H),
                                            disabled: o.disabled,
                                            class: 'search-setting__checkbox'
                                          },
                                          { default: n(() => [_(w(o.title), 1)]), _: 2 },
                                          1032,
                                          ['modelValue', 'onUpdate:modelValue', 'disabled']
                                        ),
                                        o.disabled
                                          ? (p(),
                                            ee(
                                              O,
                                              { key: 0, size: 'small', type: 'danger' },
                                              { default: n(() => [...(t[4] || (t[4] = [_('必选', -1)]))]), _: 1 }
                                            ))
                                          : C('', !0)
                                      ])
                                    )
                                  ),
                                  128
                                ))
                              ]),
                              _: 1
                            },
                            8,
                            ['modelValue']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ])
                ]),
                _: 1
              },
              8,
              ['modelValue']
            )
          ])
        )
      }
    }
  }),
  Fe = ue(we, [['__scopeId', 'data-v-707219ae']])
export { Fe as t }

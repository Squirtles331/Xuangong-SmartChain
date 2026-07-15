import {
  $n as jt,
  Gn as st,
  Hn as ot,
  Jn as Lt,
  Kn as de,
  Qn as Mt,
  Rn as at,
  Un as It,
  Xn as je,
  Yn as ct,
  Zn as Tt,
  _n as Nt,
  gn as it,
  kn as we,
  pn as lt,
  qn as ut,
  rn as H,
  rr as ne,
  tr as Ht,
  vn as V,
  xn as ft
} from './element-plus-CzL7BOKu.js'
var $t = typeof window < 'u',
  ht,
  pe = (e) => (ht = e),
  dt = Symbol()
function Ce(e) {
  return e && typeof e == 'object' && Object.prototype.toString.call(e) === '[object Object]' && typeof e.toJSON != 'function'
}
var re
;(function (e) {
  ;((e.direct = 'direct'), (e.patchObject = 'patch object'), (e.patchFunction = 'patch function'))
})(re || (re = {}))
var $e =
  typeof window == 'object' && window.window === window
    ? window
    : typeof self == 'object' && self.self === self
      ? self
      : typeof global == 'object' && global.global === global
        ? global
        : typeof globalThis == 'object'
          ? globalThis
          : { HTMLElement: null }
function Bt(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)
    ? new Blob(['\uFEFF', e], { type: e.type })
    : e
}
function Le(e, t, r) {
  const n = new XMLHttpRequest()
  ;(n.open('GET', e),
    (n.responseType = 'blob'),
    (n.onload = function () {
      Ut(n.response, t, r)
    }),
    (n.onerror = function () {
      console.error('could not download file')
    }),
    n.send())
}
function pt(e) {
  const t = new XMLHttpRequest()
  t.open('HEAD', e, !1)
  try {
    t.send()
  } catch {}
  return t.status >= 200 && t.status <= 299
}
function fe(e) {
  try {
    e.dispatchEvent(new MouseEvent('click'))
  } catch {
    const r = new MouseEvent('click', {
      bubbles: !0,
      cancelable: !0,
      view: window,
      detail: 0,
      screenX: 80,
      screenY: 20,
      clientX: 80,
      clientY: 20,
      ctrlKey: !1,
      altKey: !1,
      shiftKey: !1,
      metaKey: !1,
      button: 0,
      relatedTarget: null
    })
    e.dispatchEvent(r)
  }
}
var he = typeof navigator == 'object' ? navigator : { userAgent: '' },
  mt = /Macintosh/.test(he.userAgent) && /AppleWebKit/.test(he.userAgent) && !/Safari/.test(he.userAgent),
  Ut = $t ? (typeof HTMLAnchorElement < 'u' && 'download' in HTMLAnchorElement.prototype && !mt ? Kt : 'msSaveOrOpenBlob' in he ? qt : zt) : () => {}
function Kt(e, t = 'download', r) {
  const n = document.createElement('a')
  ;((n.download = t),
    (n.rel = 'noopener'),
    typeof e == 'string'
      ? ((n.href = e), n.origin !== location.origin ? (pt(n.href) ? Le(e, t, r) : ((n.target = '_blank'), fe(n))) : fe(n))
      : ((n.href = URL.createObjectURL(e)),
        setTimeout(function () {
          URL.revokeObjectURL(n.href)
        }, 4e4),
        setTimeout(function () {
          fe(n)
        }, 0)))
}
function qt(e, t = 'download', r) {
  if (typeof e == 'string')
    if (pt(e)) Le(e, t, r)
    else {
      const n = document.createElement('a')
      ;((n.href = e),
        (n.target = '_blank'),
        setTimeout(function () {
          fe(n)
        }))
    }
  else navigator.msSaveOrOpenBlob(Bt(e, r), t)
}
function zt(e, t, r, n) {
  if (((n = n || open('', '_blank')), n && (n.document.title = n.document.body.innerText = 'downloading...'), typeof e == 'string'))
    return Le(e, t, r)
  const s = e.type === 'application/octet-stream',
    l = /constructor/i.test(String($e.HTMLElement)) || 'safari' in $e,
    i = /CriOS\/[\d]+/.test(navigator.userAgent)
  if ((i || (s && l) || mt) && typeof FileReader < 'u') {
    const p = new FileReader()
    ;((p.onloadend = function () {
      let a = p.result
      if (typeof a != 'string') throw ((n = null), new Error('Wrong reader.result type'))
      ;((a = i ? a : a.replace(/^data:[^;]*;/, 'data:attachment/file;')), n ? (n.location.href = a) : location.assign(a), (n = null))
    }),
      p.readAsDataURL(e))
  } else {
    const p = URL.createObjectURL(e)
    ;(n ? n.location.assign(p) : (location.href = p),
      (n = null),
      setTimeout(function () {
        URL.revokeObjectURL(p)
      }, 4e4))
  }
}
var { assign: Xn } = Object
function Yn() {
  const e = ot(!0),
    t = e.run(() => je({}))
  let r = [],
    n = []
  const s = ut({
    install(l) {
      ;(pe(s), (s._a = l), l.provide(dt, s), (l.config.globalProperties.$pinia = s), n.forEach((i) => r.push(i)), (n = []))
    },
    use(l) {
      return (this._a ? r.push(l) : n.push(l), this)
    },
    _p: r,
    _a: null,
    _e: e,
    _s: new Map(),
    state: t
  })
  return s
}
var vt = () => {}
function Be(e, t, r, n = vt) {
  e.add(t)
  const s = () => {
    e.delete(t) && n()
  }
  return (!r && It() && Lt(s), s)
}
function X(e, ...t) {
  e.forEach((r) => {
    r(...t)
  })
}
var Gt = (e) => e(),
  Ue = Symbol(),
  Se = Symbol()
function ke(e, t) {
  e instanceof Map && t instanceof Map ? t.forEach((r, n) => e.set(n, r)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e)
  for (const r in t) {
    if (!t.hasOwnProperty(r)) continue
    const n = t[r],
      s = e[r]
    Ce(s) && Ce(n) && e.hasOwnProperty(r) && !de(n) && !st(n) ? (e[r] = ke(s, n)) : (e[r] = n)
  }
  return e
}
var Vt = Symbol()
function Dt(e) {
  return !Ce(e) || !Object.prototype.hasOwnProperty.call(e, Vt)
}
var { assign: z } = Object
function Wt(e) {
  return !!(de(e) && e.effect)
}
function Ft(e, t, r, n) {
  const { state: s, actions: l, getters: i } = t,
    p = r.state.value[e]
  let a
  function h() {
    return (
      p || (r.state.value[e] = s ? s() : {}),
      z(
        Ht(r.state.value[e]),
        l,
        Object.keys(i || {}).reduce(
          (d, c) => (
            (d[c] = ut(
              H(() => {
                pe(r)
                const u = r._s.get(e)
                return i[c].call(u, u)
              })
            )),
            d
          ),
          {}
        )
      )
    )
  }
  return ((a = gt(e, h, t, r, n, !0)), a)
}
function gt(e, t, r = {}, n, s, l) {
  let i
  const p = z({ actions: {} }, r),
    a = { deep: !0 }
  let h,
    d,
    c = new Set(),
    u = new Set(),
    f
  const E = n.state.value[e]
  ;(!l && !E && (n.state.value[e] = {}), je({}))
  let P
  function k(w) {
    let y
    ;((h = d = !1),
      typeof w == 'function'
        ? (w(n.state.value[e]), (y = { type: re.patchFunction, storeId: e, events: f }))
        : (ke(n.state.value[e], w), (y = { type: re.patchObject, payload: w, storeId: e, events: f })))
    const N = (P = Symbol())
    ;(ft().then(() => {
      P === N && (h = !0)
    }),
      (d = !0),
      X(c, y, n.state.value[e]))
  }
  const A = l
    ? function () {
        const { state: y } = r,
          N = y ? y() : {}
        this.$patch((B) => {
          z(B, N)
        })
      }
    : vt
  function b() {
    ;(i.stop(), c.clear(), u.clear(), n._s.delete(e))
  }
  const _ = (w, y = '') => {
      if (Ue in w) return ((w[Se] = y), w)
      const N = function () {
        pe(n)
        const B = Array.from(arguments),
          K = new Set(),
          F = new Set()
        function ie(M) {
          K.add(M)
        }
        function D(M) {
          F.add(M)
        }
        X(u, { args: B, name: N[Se], store: x, after: ie, onError: D })
        let W
        try {
          W = w.apply(this && this.$id === e ? this : x, B)
        } catch (M) {
          throw (X(F, M), M)
        }
        return W instanceof Promise ? W.then((M) => (X(K, M), M)).catch((M) => (X(F, M), Promise.reject(M))) : (X(K, W), W)
      }
      return ((N[Ue] = !0), (N[Se] = y), N)
    },
    x = ct({
      _p: n,
      $id: e,
      $onAction: Be.bind(null, u),
      $patch: k,
      $reset: A,
      $subscribe(w, y = {}) {
        const N = Be(c, w, y.detached, () => B()),
          B = i.run(() =>
            at(
              () => n.state.value[e],
              (K) => {
                ;(y.flush === 'sync' ? d : h) && w({ storeId: e, type: re.direct, events: f }, K)
              },
              z({}, a, y)
            )
          )
        return N
      },
      $dispose: b
    })
  n._s.set(e, x)
  const T = ((n._a && n._a.runWithContext) || Gt)(() => n._e.run(() => (i = ot()).run(() => t({ action: _ }))))
  for (const w in T) {
    const y = T[w]
    ;(de(y) && !Wt(y)) || st(y)
      ? l || (E && Dt(y) && (de(y) ? (y.value = E[w]) : ke(y, E[w])), (n.state.value[e][w] = y))
      : typeof y == 'function' && ((T[w] = _(y, w)), (p.actions[w] = y))
  }
  return (
    z(x, T),
    z(jt(x), T),
    Object.defineProperty(x, '$state', {
      get: () => n.state.value[e],
      set: (w) => {
        k((y) => {
          z(y, w)
        })
      }
    }),
    n._p.forEach((w) => {
      z(
        x,
        i.run(() => w({ store: x, app: n._a, pinia: n, options: p }))
      )
    }),
    E && l && r.hydrate && r.hydrate(x.$state, E),
    (h = !0),
    (d = !0),
    x
  )
}
function Zn(e, t, r) {
  let n
  const s = typeof t == 'function'
  n = s ? r : t
  function l(i, p) {
    const a = Nt()
    return ((i = i || (a ? V(dt, null) : null)), i && pe(i), (i = ht), i._s.has(e) || (s ? gt(e, t, n, i) : Ft(e, n, i)), i._s.get(e))
  }
  return ((l.$id = e), l)
}
var Y = typeof document < 'u'
function yt(e) {
  return typeof e == 'object' || 'displayName' in e || 'props' in e || '__vccOpts' in e
}
function Qt(e) {
  return e.__esModule || e[Symbol.toStringTag] === 'Module' || (e.default && yt(e.default))
}
var C = Object.assign
function be(e, t) {
  const r = {}
  for (const n in t) {
    const s = t[n]
    r[n] = $(s) ? s.map(e) : e(s)
  }
  return r
}
var se = () => {},
  $ = Array.isArray,
  Rt = /#/g,
  Xt = /&/g,
  Yt = /\//g,
  Zt = /=/g,
  Jt = /\?/g,
  Et = /\+/g,
  en = /%5B/g,
  tn = /%5D/g,
  wt = /%5E/g,
  nn = /%60/g,
  St = /%7B/g,
  rn = /%7C/g,
  bt = /%7D/g,
  sn = /%20/g
function Me(e) {
  return encodeURI('' + e)
    .replace(rn, '|')
    .replace(en, '[')
    .replace(tn, ']')
}
function on(e) {
  return Me(e).replace(St, '{').replace(bt, '}').replace(wt, '^')
}
function Oe(e) {
  return Me(e)
    .replace(Et, '%2B')
    .replace(sn, '+')
    .replace(Rt, '%23')
    .replace(Xt, '%26')
    .replace(nn, '`')
    .replace(St, '{')
    .replace(bt, '}')
    .replace(wt, '^')
}
function an(e) {
  return Oe(e).replace(Zt, '%3D')
}
function cn(e) {
  return Me(e).replace(Rt, '%23').replace(Jt, '%3F')
}
function ln(e) {
  return e == null ? '' : cn(e).replace(Yt, '%2F')
}
function ae(e) {
  try {
    return decodeURIComponent('' + e)
  } catch {}
  return '' + e
}
var un = /\/$/,
  fn = (e) => e.replace(un, '')
function Pe(e, t, r = '/') {
  let n,
    s = {},
    l = '',
    i = ''
  const p = t.indexOf('#')
  let a = t.indexOf('?')
  return (
    p < a && p >= 0 && (a = -1),
    a > -1 && ((n = t.slice(0, a)), (l = t.slice(a + 1, p > -1 ? p : t.length)), (s = e(l))),
    p > -1 && ((n = n || t.slice(0, p)), (i = t.slice(p, t.length))),
    (n = mn(n ?? t, r)),
    { fullPath: n + (l && '?') + l + i, path: n, query: s, hash: ae(i) }
  )
}
function hn(e, t) {
  const r = t.query ? e(t.query) : ''
  return t.path + (r && '?') + r + (t.hash || '')
}
function Ke(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || '/'
}
function dn(e, t, r) {
  const n = t.matched.length - 1,
    s = r.matched.length - 1
  return n > -1 && n === s && Z(t.matched[n], r.matched[s]) && Pt(t.params, r.params) && e(t.query) === e(r.query) && t.hash === r.hash
}
function Z(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t)
}
function Pt(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1
  for (const r in e) if (!pn(e[r], t[r])) return !1
  return !0
}
function pn(e, t) {
  return $(e) ? qe(e, t) : $(t) ? qe(t, e) : e === t
}
function qe(e, t) {
  return $(t) ? e.length === t.length && e.every((r, n) => r === t[n]) : e.length === 1 && e[0] === t
}
function mn(e, t) {
  if (e.startsWith('/')) return e
  if (!e) return t
  const r = t.split('/'),
    n = e.split('/'),
    s = n[n.length - 1]
  ;(s === '..' || s === '.') && n.push('')
  let l = r.length - 1,
    i,
    p
  for (i = 0; i < n.length; i++)
    if (((p = n[i]), p !== '.'))
      if (p === '..') l > 1 && l--
      else break
  return r.slice(0, l).join('/') + '/' + n.slice(i).join('/')
}
var q = { path: '/', name: void 0, params: {}, query: {}, hash: '', fullPath: '/', matched: [], meta: {}, redirectedFrom: void 0 },
  ce
;(function (e) {
  ;((e.pop = 'pop'), (e.push = 'push'))
})(ce || (ce = {}))
var oe
;(function (e) {
  ;((e.back = 'back'), (e.forward = 'forward'), (e.unknown = ''))
})(oe || (oe = {}))
function vn(e) {
  if (!e)
    if (Y) {
      const t = document.querySelector('base')
      ;((e = (t && t.getAttribute('href')) || '/'), (e = e.replace(/^\w+:\/\/[^\/]+/, '')))
    } else e = '/'
  return (e[0] !== '/' && e[0] !== '#' && (e = '/' + e), fn(e))
}
var gn = /^[^#]+#/
function yn(e, t) {
  return e.replace(gn, '#') + t
}
function Rn(e, t) {
  const r = document.documentElement.getBoundingClientRect(),
    n = e.getBoundingClientRect()
  return { behavior: t.behavior, left: n.left - r.left - (t.left || 0), top: n.top - r.top - (t.top || 0) }
}
var me = () => ({ left: window.scrollX, top: window.scrollY })
function En(e) {
  let t
  if ('el' in e) {
    const r = e.el,
      n = typeof r == 'string' && r.startsWith('#'),
      s = typeof r == 'string' ? (n ? document.getElementById(r.slice(1)) : document.querySelector(r)) : r
    if (!s) return
    t = Rn(s, e)
  } else t = e
  'scrollBehavior' in document.documentElement.style
    ? window.scrollTo(t)
    : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY)
}
function ze(e, t) {
  return (history.state ? history.state.position - t : -1) + e
}
var Ae = new Map()
function wn(e, t) {
  Ae.set(e, t)
}
function Sn(e) {
  const t = Ae.get(e)
  return (Ae.delete(e), t)
}
var bn = () => location.protocol + '//' + location.host
function _t(e, t) {
  const { pathname: r, search: n, hash: s } = t,
    l = e.indexOf('#')
  if (l > -1) {
    let i = s.includes(e.slice(l)) ? e.slice(l).length : 1,
      p = s.slice(i)
    return (p[0] !== '/' && (p = '/' + p), Ke(p, ''))
  }
  return Ke(r, e) + n + s
}
function Pn(e, t, r, n) {
  let s = [],
    l = [],
    i = null
  const p = ({ state: u }) => {
    const f = _t(e, location),
      E = r.value,
      P = t.value
    let k = 0
    if (u) {
      if (((r.value = f), (t.value = u), i && i === E)) {
        i = null
        return
      }
      k = P ? u.position - P.position : 0
    } else n(f)
    s.forEach((A) => {
      A(r.value, E, { delta: k, type: ce.pop, direction: k ? (k > 0 ? oe.forward : oe.back) : oe.unknown })
    })
  }
  function a() {
    i = r.value
  }
  function h(u) {
    s.push(u)
    const f = () => {
      const E = s.indexOf(u)
      E > -1 && s.splice(E, 1)
    }
    return (l.push(f), f)
  }
  function d() {
    const { history: u } = window
    u.state && u.replaceState(C({}, u.state, { scroll: me() }), '')
  }
  function c() {
    for (const u of l) u()
    ;((l = []), window.removeEventListener('popstate', p), window.removeEventListener('beforeunload', d))
  }
  return (
    window.addEventListener('popstate', p),
    window.addEventListener('beforeunload', d, { passive: !0 }),
    { pauseListeners: a, listen: h, destroy: c }
  )
}
function Ge(e, t, r, n = !1, s = !1) {
  return { back: e, current: t, forward: r, replaced: n, position: window.history.length, scroll: s ? me() : null }
}
function _n(e) {
  const { history: t, location: r } = window,
    n = { value: _t(e, r) },
    s = { value: t.state }
  s.value || l(n.value, { back: null, current: n.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0)
  function l(a, h, d) {
    const c = e.indexOf('#'),
      u = c > -1 ? (r.host && document.querySelector('base') ? e : e.slice(c)) + a : bn() + e + a
    try {
      ;(t[d ? 'replaceState' : 'pushState'](h, '', u), (s.value = h))
    } catch (f) {
      ;(console.error(f), r[d ? 'replace' : 'assign'](u))
    }
  }
  function i(a, h) {
    ;(l(a, C({}, t.state, Ge(s.value.back, a, s.value.forward, !0), h, { position: s.value.position }), !0), (n.value = a))
  }
  function p(a, h) {
    const d = C({}, s.value, t.state, { forward: a, scroll: me() })
    ;(l(d.current, d, !0), l(a, C({}, Ge(n.value, a, null), { position: d.position + 1 }, h), !1), (n.value = a))
  }
  return { location: n, state: s, push: p, replace: i }
}
function Jn(e) {
  e = vn(e)
  const t = _n(e),
    r = Pn(e, t.state, t.location, t.replace)
  function n(l, i = !0) {
    ;(i || r.pauseListeners(), history.go(l))
  }
  const s = C({ location: '', base: e, go: n, createHref: yn.bind(null, e) }, t, r)
  return (
    Object.defineProperty(s, 'location', { enumerable: !0, get: () => t.location.value }),
    Object.defineProperty(s, 'state', { enumerable: !0, get: () => t.state.value }),
    s
  )
}
function Cn(e) {
  return typeof e == 'string' || (e && typeof e == 'object')
}
function Ct(e) {
  return typeof e == 'string' || typeof e == 'symbol'
}
var kt = Symbol(''),
  Ve
;(function (e) {
  ;((e[(e.aborted = 4)] = 'aborted'), (e[(e.cancelled = 8)] = 'cancelled'), (e[(e.duplicated = 16)] = 'duplicated'))
})(Ve || (Ve = {}))
function J(e, t) {
  return C(new Error(), { type: e, [kt]: !0 }, t)
}
function U(e, t) {
  return e instanceof Error && kt in e && (t == null || !!(e.type & t))
}
var De = '[^/]+?',
  kn = { sensitive: !1, strict: !1, start: !0, end: !0 },
  On = /[.+*?^${}()[\]/\\]/g
function An(e, t) {
  const r = C({}, kn, t),
    n = []
  let s = r.start ? '^' : ''
  const l = []
  for (const h of e) {
    const d = h.length ? [] : [90]
    r.strict && !h.length && (s += '/')
    for (let c = 0; c < h.length; c++) {
      const u = h[c]
      let f = 40 + (r.sensitive ? 0.25 : 0)
      if (u.type === 0) (c || (s += '/'), (s += u.value.replace(On, '\\$&')), (f += 40))
      else if (u.type === 1) {
        const { value: E, repeatable: P, optional: k, regexp: A } = u
        l.push({ name: E, repeatable: P, optional: k })
        const b = A || De
        if (b !== De) {
          f += 10
          try {
            new RegExp(`(${b})`)
          } catch (x) {
            throw new Error(`Invalid custom RegExp for param "${E}" (${b}): ` + x.message)
          }
        }
        let _ = P ? `((?:${b})(?:/(?:${b}))*)` : `(${b})`
        ;(c || (_ = k && h.length < 2 ? `(?:/${_})` : '/' + _),
          k && (_ += '?'),
          (s += _),
          (f += 20),
          k && (f += -8),
          P && (f += -20),
          b === '.*' && (f += -50))
      }
      d.push(f)
    }
    n.push(d)
  }
  if (r.strict && r.end) {
    const h = n.length - 1
    n[h][n[h].length - 1] += 0.7000000000000001
  }
  ;(r.strict || (s += '/?'), r.end ? (s += '$') : r.strict && (s += '(?:/|$)'))
  const i = new RegExp(s, r.sensitive ? '' : 'i')
  function p(h) {
    const d = h.match(i),
      c = {}
    if (!d) return null
    for (let u = 1; u < d.length; u++) {
      const f = d[u] || '',
        E = l[u - 1]
      c[E.name] = f && E.repeatable ? f.split('/') : f
    }
    return c
  }
  function a(h) {
    let d = '',
      c = !1
    for (const u of e) {
      ;((!c || !d.endsWith('/')) && (d += '/'), (c = !1))
      for (const f of u)
        if (f.type === 0) d += f.value
        else if (f.type === 1) {
          const { value: E, repeatable: P, optional: k } = f,
            A = E in h ? h[E] : ''
          if ($(A) && !P) throw new Error(`Provided param "${E}" is an array but it is not repeatable (* or + modifiers)`)
          const b = $(A) ? A.join('/') : A
          if (!b)
            if (k) u.length < 2 && (d.endsWith('/') ? (d = d.slice(0, -1)) : (c = !0))
            else throw new Error(`Missing required param "${E}"`)
          d += b
        }
    }
    return d || '/'
  }
  return { re: i, score: n, keys: l, parse: p, stringify: a }
}
function xn(e, t) {
  let r = 0
  for (; r < e.length && r < t.length; ) {
    const n = t[r] - e[r]
    if (n) return n
    r++
  }
  return e.length < t.length ? (e.length === 1 && e[0] === 80 ? -1 : 1) : e.length > t.length ? (t.length === 1 && t[0] === 80 ? 1 : -1) : 0
}
function Ot(e, t) {
  let r = 0
  const n = e.score,
    s = t.score
  for (; r < n.length && r < s.length; ) {
    const l = xn(n[r], s[r])
    if (l) return l
    r++
  }
  if (Math.abs(s.length - n.length) === 1) {
    if (We(n)) return 1
    if (We(s)) return -1
  }
  return s.length - n.length
}
function We(e) {
  const t = e[e.length - 1]
  return e.length > 0 && t[t.length - 1] < 0
}
var jn = { type: 0, value: '' },
  Ln = /[a-zA-Z0-9_]/
function Mn(e) {
  if (!e) return [[]]
  if (e === '/') return [[jn]]
  if (!e.startsWith('/')) throw new Error(`Invalid path "${e}"`)
  function t(f) {
    throw new Error(`ERR (${r})/"${h}": ${f}`)
  }
  let r = 0,
    n = r
  const s = []
  let l
  function i() {
    ;(l && s.push(l), (l = []))
  }
  let p = 0,
    a,
    h = '',
    d = ''
  function c() {
    h &&
      (r === 0
        ? l.push({ type: 0, value: h })
        : r === 1 || r === 2 || r === 3
          ? (l.length > 1 && (a === '*' || a === '+') && t(`A repeatable param (${h}) must be alone in its segment. eg: '/:ids+.`),
            l.push({ type: 1, value: h, regexp: d, repeatable: a === '*' || a === '+', optional: a === '*' || a === '?' }))
          : t('Invalid state to consume buffer'),
      (h = ''))
  }
  function u() {
    h += a
  }
  for (; p < e.length; ) {
    if (((a = e[p++]), a === '\\' && r !== 2)) {
      ;((n = r), (r = 4))
      continue
    }
    switch (r) {
      case 0:
        a === '/' ? (h && c(), i()) : a === ':' ? (c(), (r = 1)) : u()
        break
      case 4:
        ;(u(), (r = n))
        break
      case 1:
        a === '(' ? (r = 2) : Ln.test(a) ? u() : (c(), (r = 0), a !== '*' && a !== '?' && a !== '+' && p--)
        break
      case 2:
        a === ')' ? (d[d.length - 1] == '\\' ? (d = d.slice(0, -1) + a) : (r = 3)) : (d += a)
        break
      case 3:
        ;(c(), (r = 0), a !== '*' && a !== '?' && a !== '+' && p--, (d = ''))
        break
      default:
        t('Unknown state')
        break
    }
  }
  return (r === 2 && t(`Unfinished custom RegExp for param "${h}"`), c(), i(), s)
}
function In(e, t, r) {
  const n = C(An(Mn(e.path), r), { record: e, parent: t, children: [], alias: [] })
  return (t && !n.record.aliasOf == !t.record.aliasOf && t.children.push(n), n)
}
function Tn(e, t) {
  const r = [],
    n = new Map()
  t = Ye({ strict: !1, end: !0, sensitive: !1 }, t)
  function s(c) {
    return n.get(c)
  }
  function l(c, u, f) {
    const E = !f,
      P = Qe(c)
    P.aliasOf = f && f.record
    const k = Ye(t, c),
      A = [P]
    if ('alias' in c) {
      const x = typeof c.alias == 'string' ? [c.alias] : c.alias
      for (const T of x) A.push(Qe(C({}, P, { components: f ? f.record.components : P.components, path: T, aliasOf: f ? f.record : P })))
    }
    let b, _
    for (const x of A) {
      const { path: T } = x
      if (u && T[0] !== '/') {
        const w = u.record.path,
          y = w[w.length - 1] === '/' ? '' : '/'
        x.path = u.record.path + (T && y + T)
      }
      if (
        ((b = In(x, u, k)),
        f ? f.alias.push(b) : ((_ = _ || b), _ !== b && _.alias.push(b), E && c.name && !Xe(b) && i(c.name)),
        At(b) && a(b),
        P.children)
      ) {
        const w = P.children
        for (let y = 0; y < w.length; y++) l(w[y], b, f && f.children[y])
      }
      f = f || b
    }
    return _
      ? () => {
          i(_)
        }
      : se
  }
  function i(c) {
    if (Ct(c)) {
      const u = n.get(c)
      u && (n.delete(c), r.splice(r.indexOf(u), 1), u.children.forEach(i), u.alias.forEach(i))
    } else {
      const u = r.indexOf(c)
      u > -1 && (r.splice(u, 1), c.record.name && n.delete(c.record.name), c.children.forEach(i), c.alias.forEach(i))
    }
  }
  function p() {
    return r
  }
  function a(c) {
    const u = $n(c, r)
    ;(r.splice(u, 0, c), c.record.name && !Xe(c) && n.set(c.record.name, c))
  }
  function h(c, u) {
    let f,
      E = {},
      P,
      k
    if ('name' in c && c.name) {
      if (((f = n.get(c.name)), !f)) throw J(1, { location: c })
      ;((k = f.record.name),
        (E = C(
          Fe(
            u.params,
            f.keys
              .filter((_) => !_.optional)
              .concat(f.parent ? f.parent.keys.filter((_) => _.optional) : [])
              .map((_) => _.name)
          ),
          c.params &&
            Fe(
              c.params,
              f.keys.map((_) => _.name)
            )
        )),
        (P = f.stringify(E)))
    } else if (c.path != null) ((P = c.path), (f = r.find((_) => _.re.test(P))), f && ((E = f.parse(P)), (k = f.record.name)))
    else {
      if (((f = u.name ? n.get(u.name) : r.find((_) => _.re.test(u.path))), !f)) throw J(1, { location: c, currentLocation: u })
      ;((k = f.record.name), (E = C({}, u.params, c.params)), (P = f.stringify(E)))
    }
    const A = []
    let b = f
    for (; b; ) (A.unshift(b.record), (b = b.parent))
    return { name: k, path: P, params: E, matched: A, meta: Hn(A) }
  }
  e.forEach((c) => l(c))
  function d() {
    ;((r.length = 0), n.clear())
  }
  return { addRoute: l, resolve: h, removeRoute: i, clearRoutes: d, getRoutes: p, getRecordMatcher: s }
}
function Fe(e, t) {
  const r = {}
  for (const n of t) n in e && (r[n] = e[n])
  return r
}
function Qe(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: Nn(e),
    children: e.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in e ? e.components || null : e.component && { default: e.component }
  }
  return (Object.defineProperty(t, 'mods', { value: {} }), t)
}
function Nn(e) {
  const t = {},
    r = e.props || !1
  if ('component' in e) t.default = r
  else for (const n in e.components) t[n] = typeof r == 'object' ? r[n] : r
  return t
}
function Xe(e) {
  for (; e; ) {
    if (e.record.aliasOf) return !0
    e = e.parent
  }
  return !1
}
function Hn(e) {
  return e.reduce((t, r) => C(t, r.meta), {})
}
function Ye(e, t) {
  const r = {}
  for (const n in e) r[n] = n in t ? t[n] : e[n]
  return r
}
function $n(e, t) {
  let r = 0,
    n = t.length
  for (; r !== n; ) {
    const l = (r + n) >> 1
    Ot(e, t[l]) < 0 ? (n = l) : (r = l + 1)
  }
  const s = Bn(e)
  return (s && (n = t.lastIndexOf(s, n - 1)), n)
}
function Bn(e) {
  let t = e
  for (; (t = t.parent); ) if (At(t) && Ot(e, t) === 0) return t
}
function At({ record: e }) {
  return !!(e.name || (e.components && Object.keys(e.components).length) || e.redirect)
}
function Un(e) {
  const t = {}
  if (e === '' || e === '?') return t
  const r = (e[0] === '?' ? e.slice(1) : e).split('&')
  for (let n = 0; n < r.length; ++n) {
    const s = r[n].replace(Et, ' '),
      l = s.indexOf('='),
      i = ae(l < 0 ? s : s.slice(0, l)),
      p = l < 0 ? null : ae(s.slice(l + 1))
    if (i in t) {
      let a = t[i]
      ;($(a) || (a = t[i] = [a]), a.push(p))
    } else t[i] = p
  }
  return t
}
function Ze(e) {
  let t = ''
  for (let r in e) {
    const n = e[r]
    if (((r = an(r)), n == null)) {
      n !== void 0 && (t += (t.length ? '&' : '') + r)
      continue
    }
    ;($(n) ? n.map((s) => s && Oe(s)) : [n && Oe(n)]).forEach((s) => {
      s !== void 0 && ((t += (t.length ? '&' : '') + r), s != null && (t += '=' + s))
    })
  }
  return t
}
function Kn(e) {
  const t = {}
  for (const r in e) {
    const n = e[r]
    n !== void 0 && (t[r] = $(n) ? n.map((s) => (s == null ? null : '' + s)) : n == null ? n : '' + n)
  }
  return t
}
var qn = Symbol(''),
  Je = Symbol(''),
  ve = Symbol(''),
  Ie = Symbol(''),
  xe = Symbol('')
function te() {
  let e = []
  function t(n) {
    return (
      e.push(n),
      () => {
        const s = e.indexOf(n)
        s > -1 && e.splice(s, 1)
      }
    )
  }
  function r() {
    e = []
  }
  return { add: t, list: () => e.slice(), reset: r }
}
function G(e, t, r, n, s, l = (i) => i()) {
  const i = n && (n.enterCallbacks[s] = n.enterCallbacks[s] || [])
  return () =>
    new Promise((p, a) => {
      const h = (u) => {
          u === !1
            ? a(J(4, { from: r, to: t }))
            : u instanceof Error
              ? a(u)
              : Cn(u)
                ? a(J(2, { from: t, to: u }))
                : (i && n.enterCallbacks[s] === i && typeof u == 'function' && i.push(u), p())
        },
        d = l(() => e.call(n && n.instances[s], t, r, h))
      let c = Promise.resolve(d)
      ;(e.length < 3 && (c = c.then(h)), c.catch((u) => a(u)))
    })
}
function _e(e, t, r, n, s = (l) => l()) {
  const l = []
  for (const i of e)
    for (const p in i.components) {
      let a = i.components[p]
      if (!(t !== 'beforeRouteEnter' && !i.instances[p]))
        if (yt(a)) {
          const h = (a.__vccOpts || a)[t]
          h && l.push(G(h, r, n, i, p, s))
        } else {
          let h = a()
          l.push(() =>
            h.then((d) => {
              if (!d) throw new Error(`Couldn't resolve component "${p}" at "${i.path}"`)
              const c = Qt(d) ? d.default : d
              ;((i.mods[p] = d), (i.components[p] = c))
              const u = (c.__vccOpts || c)[t]
              return u && G(u, r, n, i, p, s)()
            })
          )
        }
    }
  return l
}
function et(e) {
  const t = V(ve),
    r = V(Ie),
    n = H(() => {
      const a = ne(e.to)
      return t.resolve(a)
    }),
    s = H(() => {
      const { matched: a } = n.value,
        { length: h } = a,
        d = a[h - 1],
        c = r.matched
      if (!d || !c.length) return -1
      const u = c.findIndex(Z.bind(null, d))
      if (u > -1) return u
      const f = tt(a[h - 2])
      return h > 1 && tt(d) === f && c[c.length - 1].path !== f ? c.findIndex(Z.bind(null, a[h - 2])) : u
    }),
    l = H(() => s.value > -1 && Vn(r.params, n.value.params)),
    i = H(() => s.value > -1 && s.value === r.matched.length - 1 && Pt(r.params, n.value.params))
  function p(a = {}) {
    return Gn(a) ? t[ne(e.replace) ? 'replace' : 'push'](ne(e.to)).catch(se) : Promise.resolve()
  }
  return { route: n, href: H(() => n.value.href), isActive: l, isExactActive: i, navigate: p }
}
var zn = lt({
  name: 'RouterLink',
  compatConfig: { MODE: 3 },
  props: {
    to: { type: [String, Object], required: !0 },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: { type: String, default: 'page' }
  },
  useLink: et,
  setup(e, { slots: t }) {
    const r = ct(et(e)),
      { options: n } = V(ve),
      s = H(() => ({
        [nt(e.activeClass, n.linkActiveClass, 'router-link-active')]: r.isActive,
        [nt(e.exactActiveClass, n.linkExactActiveClass, 'router-link-exact-active')]: r.isExactActive
      }))
    return () => {
      const l = t.default && t.default(r)
      return e.custom
        ? l
        : it('a', { 'aria-current': r.isExactActive ? e.ariaCurrentValue : null, href: r.href, onClick: r.navigate, class: s.value }, l)
    }
  }
})
function Gn(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute('target')
      if (/\b_blank\b/i.test(t)) return
    }
    return (e.preventDefault && e.preventDefault(), !0)
  }
}
function Vn(e, t) {
  for (const r in t) {
    const n = t[r],
      s = e[r]
    if (typeof n == 'string') {
      if (n !== s) return !1
    } else if (!$(s) || s.length !== n.length || n.some((l, i) => l !== s[i])) return !1
  }
  return !0
}
function tt(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : ''
}
var nt = (e, t, r) => e ?? t ?? r,
  Dn = lt({
    name: 'RouterView',
    inheritAttrs: !1,
    props: { name: { type: String, default: 'default' }, route: Object },
    compatConfig: { MODE: 3 },
    setup(e, { attrs: t, slots: r }) {
      const n = V(xe),
        s = H(() => e.route || n.value),
        l = V(Je, 0),
        i = H(() => {
          let h = ne(l)
          const { matched: d } = s.value
          let c
          for (; (c = d[h]) && !c.components; ) h++
          return h
        }),
        p = H(() => s.value.matched[i.value])
      ;(we(
        Je,
        H(() => i.value + 1)
      ),
        we(qn, p),
        we(xe, s))
      const a = je()
      return (
        at(
          () => [a.value, p.value, e.name],
          ([h, d, c], [u, f, E]) => {
            ;(d &&
              ((d.instances[c] = h),
              f &&
                f !== d &&
                h &&
                h === u &&
                (d.leaveGuards.size || (d.leaveGuards = f.leaveGuards), d.updateGuards.size || (d.updateGuards = f.updateGuards))),
              h && d && (!f || !Z(d, f) || !u) && (d.enterCallbacks[c] || []).forEach((P) => P(h)))
          },
          { flush: 'post' }
        ),
        () => {
          const h = s.value,
            d = e.name,
            c = p.value,
            u = c && c.components[d]
          if (!u) return rt(r.default, { Component: u, route: h })
          const f = c.props[d],
            E = f ? (f === !0 ? h.params : typeof f == 'function' ? f(h) : f) : null,
            k = it(
              u,
              C({}, E, t, {
                onVnodeUnmounted: (A) => {
                  A.component.isUnmounted && (c.instances[d] = null)
                },
                ref: a
              })
            )
          return rt(r.default, { Component: k, route: h }) || k
        }
      )
    }
  })
function rt(e, t) {
  if (!e) return null
  const r = e(t)
  return r.length === 1 ? r[0] : r
}
var Wn = Dn
function er(e) {
  const t = Tn(e.routes, e),
    r = e.parseQuery || Un,
    n = e.stringifyQuery || Ze,
    s = e.history,
    l = te(),
    i = te(),
    p = te(),
    a = Mt(q)
  let h = q
  Y && e.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
  const d = be.bind(null, (o) => '' + o),
    c = be.bind(null, ln),
    u = be.bind(null, ae)
  function f(o, v) {
    let m, g
    return (Ct(o) ? ((m = t.getRecordMatcher(o)), (g = v)) : (g = o), t.addRoute(g, m))
  }
  function E(o) {
    const v = t.getRecordMatcher(o)
    v && t.removeRoute(v)
  }
  function P() {
    return t.getRoutes().map((o) => o.record)
  }
  function k(o) {
    return !!t.getRecordMatcher(o)
  }
  function A(o, v) {
    if (((v = C({}, v || a.value)), typeof o == 'string')) {
      const R = Pe(r, o, v.path),
        L = t.resolve({ path: R.path }, v),
        ee = s.createHref(R.fullPath)
      return C(R, L, { params: u(L.params), hash: ae(R.hash), redirectedFrom: void 0, href: ee })
    }
    let m
    if (o.path != null) m = C({}, o, { path: Pe(r, o.path, v.path).path })
    else {
      const R = C({}, o.params)
      for (const L in R) R[L] == null && delete R[L]
      ;((m = C({}, o, { params: c(R) })), (v.params = c(v.params)))
    }
    const g = t.resolve(m, v),
      O = o.hash || ''
    g.params = d(u(g.params))
    const j = hn(n, C({}, o, { hash: on(O), path: g.path })),
      S = s.createHref(j)
    return C({ fullPath: j, hash: O, query: n === Ze ? Kn(o.query) : o.query || {} }, g, { redirectedFrom: void 0, href: S })
  }
  function b(o) {
    return typeof o == 'string' ? Pe(r, o, a.value.path) : C({}, o)
  }
  function _(o, v) {
    if (h !== o) return J(8, { from: v, to: o })
  }
  function x(o) {
    return y(o)
  }
  function T(o) {
    return x(C(b(o), { replace: !0 }))
  }
  function w(o) {
    const v = o.matched[o.matched.length - 1]
    if (v && v.redirect) {
      const { redirect: m } = v
      let g = typeof m == 'function' ? m(o) : m
      return (
        typeof g == 'string' && ((g = g.includes('?') || g.includes('#') ? (g = b(g)) : { path: g }), (g.params = {})),
        C({ query: o.query, hash: o.hash, params: g.path != null ? {} : o.params }, g)
      )
    }
  }
  function y(o, v) {
    const m = (h = A(o)),
      g = a.value,
      O = o.state,
      j = o.force,
      S = o.replace === !0,
      R = w(m)
    if (R) return y(C(b(R), { state: typeof R == 'object' ? C({}, O, R.state) : O, force: j, replace: S }), v || m)
    const L = m
    L.redirectedFrom = v
    let ee
    return (
      !j && dn(n, g, m) && ((ee = J(16, { to: L, from: g })), Ne(g, g, !0, !1)),
      (ee ? Promise.resolve(ee) : K(L, g))
        .catch((I) => (U(I) ? (U(I, 2) ? I : ye(I)) : ge(I, L, g)))
        .then((I) => {
          if (I) {
            if (U(I, 2)) return y(C({ replace: S }, b(I.to), { state: typeof I.to == 'object' ? C({}, O, I.to.state) : O, force: j }), v || L)
          } else I = ie(L, g, !0, S, O)
          return (F(L, g, I), I)
        })
    )
  }
  function N(o, v) {
    const m = _(o, v)
    return m ? Promise.reject(m) : Promise.resolve()
  }
  function B(o) {
    const v = ue.values().next().value
    return v && typeof v.runWithContext == 'function' ? v.runWithContext(o) : o()
  }
  function K(o, v) {
    let m
    const [g, O, j] = Fn(o, v)
    m = _e(g.reverse(), 'beforeRouteLeave', o, v)
    for (const R of g)
      R.leaveGuards.forEach((L) => {
        m.push(G(L, o, v))
      })
    const S = N.bind(null, o, v)
    return (
      m.push(S),
      Q(m)
        .then(() => {
          m = []
          for (const R of l.list()) m.push(G(R, o, v))
          return (m.push(S), Q(m))
        })
        .then(() => {
          m = _e(O, 'beforeRouteUpdate', o, v)
          for (const R of O)
            R.updateGuards.forEach((L) => {
              m.push(G(L, o, v))
            })
          return (m.push(S), Q(m))
        })
        .then(() => {
          m = []
          for (const R of j)
            if (R.beforeEnter)
              if ($(R.beforeEnter)) for (const L of R.beforeEnter) m.push(G(L, o, v))
              else m.push(G(R.beforeEnter, o, v))
          return (m.push(S), Q(m))
        })
        .then(() => (o.matched.forEach((R) => (R.enterCallbacks = {})), (m = _e(j, 'beforeRouteEnter', o, v, B)), m.push(S), Q(m)))
        .then(() => {
          m = []
          for (const R of i.list()) m.push(G(R, o, v))
          return (m.push(S), Q(m))
        })
        .catch((R) => (U(R, 8) ? R : Promise.reject(R)))
    )
  }
  function F(o, v, m) {
    p.list().forEach((g) => B(() => g(o, v, m)))
  }
  function ie(o, v, m, g, O) {
    const j = _(o, v)
    if (j) return j
    const S = v === q,
      R = Y ? history.state : {}
    ;(m && (g || S ? s.replace(o.fullPath, C({ scroll: S && R && R.scroll }, O)) : s.push(o.fullPath, O)), (a.value = o), Ne(o, v, m, S), ye())
  }
  let D
  function W() {
    D ||
      (D = s.listen((o, v, m) => {
        if (!He.listening) return
        const g = A(o),
          O = w(g)
        if (O) {
          y(C(O, { replace: !0 }), g).catch(se)
          return
        }
        h = g
        const j = a.value
        ;(Y && wn(ze(j.fullPath, m.delta), me()),
          K(g, j)
            .catch((S) =>
              U(S, 12)
                ? S
                : U(S, 2)
                  ? (y(S.to, g)
                      .then((R) => {
                        U(R, 20) && !m.delta && m.type === ce.pop && s.go(-1, !1)
                      })
                      .catch(se),
                    Promise.reject())
                  : (m.delta && s.go(-m.delta, !1), ge(S, g, j))
            )
            .then((S) => {
              ;((S = S || ie(g, j, !1)), S && (m.delta && !U(S, 8) ? s.go(-m.delta, !1) : m.type === ce.pop && U(S, 20) && s.go(-1, !1)), F(g, j, S))
            })
            .catch(se))
      }))
  }
  let M = te(),
    Te = te(),
    le
  function ge(o, v, m) {
    ye(o)
    const g = Te.list()
    return (g.length ? g.forEach((O) => O(o, v, m)) : console.error(o), Promise.reject(o))
  }
  function xt() {
    return le && a.value !== q
      ? Promise.resolve()
      : new Promise((o, v) => {
          M.add([o, v])
        })
  }
  function ye(o) {
    return (le || ((le = !o), W(), M.list().forEach(([v, m]) => (o ? m(o) : v())), M.reset()), o)
  }
  function Ne(o, v, m, g) {
    const { scrollBehavior: O } = e
    if (!Y || !O) return Promise.resolve()
    const j = (!m && Sn(ze(o.fullPath, 0))) || ((g || !m) && history.state && history.state.scroll) || null
    return ft()
      .then(() => O(o, v, j))
      .then((S) => S && En(S))
      .catch((S) => ge(S, o, v))
  }
  const Re = (o) => s.go(o)
  let Ee
  const ue = new Set(),
    He = {
      currentRoute: a,
      listening: !0,
      addRoute: f,
      removeRoute: E,
      clearRoutes: t.clearRoutes,
      hasRoute: k,
      getRoutes: P,
      resolve: A,
      options: e,
      push: x,
      replace: T,
      go: Re,
      back: () => Re(-1),
      forward: () => Re(1),
      beforeEach: l.add,
      beforeResolve: i.add,
      afterEach: p.add,
      onError: Te.add,
      isReady: xt,
      install(o) {
        const v = this
        ;(o.component('RouterLink', zn),
          o.component('RouterView', Wn),
          (o.config.globalProperties.$router = v),
          Object.defineProperty(o.config.globalProperties, '$route', { enumerable: !0, get: () => ne(a) }),
          Y && !Ee && a.value === q && ((Ee = !0), x(s.location).catch((O) => {})))
        const m = {}
        for (const O in q) Object.defineProperty(m, O, { get: () => a.value[O], enumerable: !0 })
        ;(o.provide(ve, v), o.provide(Ie, Tt(m)), o.provide(xe, a))
        const g = o.unmount
        ;(ue.add(o),
          (o.unmount = function () {
            ;(ue.delete(o), ue.size < 1 && ((h = q), D && D(), (D = null), (a.value = q), (Ee = !1), (le = !1)), g())
          }))
      }
    }
  function Q(o) {
    return o.reduce((v, m) => v.then(() => B(m)), Promise.resolve())
  }
  return He
}
function Fn(e, t) {
  const r = [],
    n = [],
    s = [],
    l = Math.max(t.matched.length, e.matched.length)
  for (let i = 0; i < l; i++) {
    const p = t.matched[i]
    p && (e.matched.find((h) => Z(h, p)) ? n.push(p) : r.push(p))
    const a = e.matched[i]
    a && (t.matched.find((h) => Z(h, a)) || s.push(a))
  }
  return [r, n, s]
}
function tr() {
  return V(ve)
}
function nr(e) {
  return V(Ie)
}
export { Yn as a, tr as i, Jn as n, Zn as o, nr as r, er as t }

import { a as T, c as P, d as k, f as C, i as S, l as I, m as g, p as O, s as _, u as N } from './index-DqMfCNbk.js'
var W = Object.defineProperty,
  z = Object.defineProperties,
  A = Object.getOwnPropertyDescriptors,
  V = Object.getOwnPropertySymbols,
  B = Object.prototype.hasOwnProperty,
  H = Object.prototype.propertyIsEnumerable,
  b = (e, t, a) => (t in e ? W(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (e[t] = a)),
  h = (e, t) => {
    for (var a in t || (t = {})) B.call(t, a) && b(e, a, t[a])
    if (V) for (var a of V(t)) H.call(t, a) && b(e, a, t[a])
    return e
  },
  q = (e, t) => z(e, A(t)),
  m = { wrapper: { display: 'flex', position: 'relative', textAlign: 'initial' }, fullWidth: { width: '100%' }, hide: { display: 'none' } }
function G(e, t) {
  return {
    wrapperStyle: S(() => {
      const { width: a, height: r } = e
      return q(h({}, m.wrapper), { width: a, height: r })
    }),
    containerStyle: S(() => h(h({}, m.fullWidth), !t.value && m.hide))
  }
}
function J() {
  const e = O(P.__getMonacoInstance()),
    t = C(!1)
  let a
  return (
    N(() => {
      e.value ||
        ((a = P.init()),
        a
          .then((l) => (e.value = l))
          .catch((l) => {
            l?.type !== 'cancelation' && ((t.value = !0), console.error('Monaco initialization error:', l))
          }))
    }),
    { monacoRef: e, unload: () => a?.cancel(), isLoadFailed: t }
  )
}
function $(e) {
  return typeof e == 'function' ? e() : e
}
function M(e) {
  return e === void 0
}
function L(e, t, a, r) {
  return K(e, r) || Q(e, t, a, r)
}
function K(e, t) {
  return e.editor.getModel(U(e, t))
}
function Q(e, t, a, r) {
  return e.editor.createModel(t, a, r ? U(e, r) : void 0)
}
function U(e, t) {
  return e.Uri.parse(t)
}
var X = Object.defineProperty,
  E = Object.getOwnPropertySymbols,
  Y = Object.prototype.hasOwnProperty,
  Z = Object.prototype.propertyIsEnumerable,
  j = (e, t, a) => (t in e ? X(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (e[t] = a)),
  R = (e, t) => {
    for (var a in t || (t = {})) Y.call(t, a) && j(e, a, t[a])
    if (E) for (var a of E(t)) Z.call(t, a) && j(e, a, t[a])
    return e
  },
  ee = { display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  ue = T({
    name: 'VueMonacoEditor',
    model: { prop: 'value', event: 'update:value' },
    props: {
      defaultValue: String,
      defaultPath: String,
      defaultLanguage: String,
      value: String,
      language: String,
      path: String,
      theme: { type: String, default: 'vs' },
      line: Number,
      options: { type: Object, default: () => ({}) },
      overrideServices: { type: Object, default: () => ({}) },
      saveViewState: { type: Boolean, default: !0 },
      width: { type: [Number, String], default: '100%' },
      height: { type: [Number, String], default: '100%' },
      className: String
    },
    emits: ['update:value', 'beforeMount', 'mount', 'change', 'validate'],
    setup(e, t) {
      const a = new Map(),
        r = O(null),
        { monacoRef: l, unload: s, isLoadFailed: i } = J(),
        { editorRef: u } = te(t, e, l, r),
        { disposeValidator: v } = ae(t, e, l, u),
        d = S(() => !!l.value && !!u.value),
        { wrapperStyle: o, containerStyle: p } = G(e, d)
      return (
        k(() => {
          var n, c
          ;((n = v.value) == null || n.call(v), u.value ? ((c = u.value.getModel()) == null || c.dispose(), u.value.dispose()) : s())
        }),
        g([() => e.path, () => e.value, () => e.language, () => e.line], ([n, c, y, f], [w, le, x, D]) => {
          if (d.value) {
            if (n !== w) {
              const F = L(l.value, c || e.defaultValue || '', y || e.defaultLanguage || '', n || e.defaultPath || '')
              ;(e.saveViewState && a.set(w, u.value.saveViewState()),
                u.value.setModel(F),
                e.saveViewState && u.value.restoreViewState(a.get(n)),
                M(f) || u.value.revealLine(f))
              return
            }
            ;(u.value.getValue() !== c && u.value.setValue(c),
              y !== x && l.value.editor.setModelLanguage(u.value.getModel(), y),
              !M(f) && f !== D && u.value.revealLine(f))
          }
        }),
        g(
          () => e.options,
          (n) => u.value && u.value.updateOptions(n),
          { deep: !0 }
        ),
        g(
          () => e.theme,
          (n) => l.value && l.value.editor.setTheme(n)
        ),
        { containerRef: r, isEditorReady: d, isLoadFailed: i, wrapperStyle: o, containerStyle: p }
      )
    },
    render() {
      const { $slots: e, isEditorReady: t, isLoadFailed: a, wrapperStyle: r, containerStyle: l, className: s } = this
      return _('div', { style: r }, [
        !t && _('div', { style: ee }, a ? (e.failure ? $(e.failure) : 'load failed') : e.default ? $(e.default) : 'loading...'),
        _('div', { ref: 'containerRef', key: 'monaco_editor_container', style: l, class: s })
      ])
    }
  })
function te({ emit: e }, t, a, r) {
  const l = O(null)
  N(() => {
    const i = g(
      a,
      () => {
        r.value && a.value && (I(() => i()), s())
      },
      { immediate: !0 }
    )
  })
  function s() {
    var i
    if (!r.value || !a.value || l.value) return
    e('beforeMount', a.value)
    const u = t.path || t.defaultPath,
      v = L(a.value, t.value || t.defaultValue || '', t.language || t.defaultLanguage || '', u || '')
    ;((l.value = a.value.editor.create(
      r.value,
      R({ model: v, theme: t.theme, automaticLayout: !0, autoIndent: 'brackets', formatOnPaste: !0, formatOnType: !0 }, t.options),
      t.overrideServices
    )),
      (i = l.value) == null ||
        i.onDidChangeModelContent((d) => {
          const o = l.value.getValue()
          o !== t.value && (e('update:value', o), e('change', o, d))
        }),
      l.value && !M(t.line) && l.value.revealLine(t.line),
      e('mount', l.value, a.value))
  }
  return { editorRef: l }
}
function ae({ emit: e }, t, a, r) {
  const l = C(null),
    s = g([a, r], () => {
      if (a.value && r.value) {
        I(() => s())
        const i = a.value.editor.onDidChangeMarkers((u) => {
          var v, d
          const o = (d = (v = r.value) == null ? void 0 : v.getModel()) == null ? void 0 : d.uri
          o && u.find((p) => p.path === o.path) && e('validate', a.value.editor.getModelMarkers({ resource: o }))
        })
        l.value = () => i?.dispose()
      }
    })
  return { disposeValidator: l }
}
export { ue as Editor, ue as VueMonacoEditor, ue as default }

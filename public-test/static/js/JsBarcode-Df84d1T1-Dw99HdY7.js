import { o as Ft } from './index-DqMfCNbk.js'
function Ht(v, f) {
  for (var o = 0; o < f.length; o++) {
    const l = f[o]
    if (typeof l != 'string' && !Array.isArray(l)) {
      for (const c in l)
        if (c !== 'default' && !(c in v)) {
          const h = Object.getOwnPropertyDescriptor(l, c)
          h && Object.defineProperty(v, c, h.get ? h : { enumerable: !0, get: () => l[c] })
        }
    }
  }
  return Object.freeze(Object.defineProperty(v, Symbol.toStringTag, { value: 'Module' }))
}
var X = {},
  j = {},
  z = {},
  Ie
function x() {
  if (Ie) return z
  ;((Ie = 1), Object.defineProperty(z, '__esModule', { value: !0 }))
  function v(f, o) {
    if (!(f instanceof o)) throw new TypeError('Cannot call a class as a function')
  }
  return (
    (z.default = function f(o, l) {
      ;(v(this, f), (this.data = o), (this.text = l.text || o), (this.options = l))
    }),
    z
  )
}
var De
function Ut() {
  if (De) return j
  ;((De = 1), Object.defineProperty(j, '__esModule', { value: !0 }), (j.CODE39 = void 0))
  var v = (function () {
      function _(s, y) {
        for (var p = 0; p < y.length; p++) {
          var g = y[p]
          ;((g.enumerable = g.enumerable || !1), (g.configurable = !0), 'value' in g && (g.writable = !0), Object.defineProperty(s, g.key, g))
        }
      }
      return function (s, y, p) {
        return (y && _(s.prototype, y), p && _(s, p), s)
      }
    })(),
    f = o(x())
  function o(_) {
    return _ && _.__esModule ? _ : { default: _ }
  }
  function l(_, s) {
    if (!(_ instanceof s)) throw new TypeError('Cannot call a class as a function')
  }
  function c(_, s) {
    if (!_) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return s && (typeof s == 'object' || typeof s == 'function') ? s : _
  }
  function h(_, s) {
    if (typeof s != 'function' && s !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof s)
    ;((_.prototype = Object.create(s && s.prototype, { constructor: { value: _, enumerable: !1, writable: !0, configurable: !0 } })),
      s && (Object.setPrototypeOf ? Object.setPrototypeOf(_, s) : (_.__proto__ = s)))
  }
  var i = (function (_) {
      h(s, _)
      function s(y, p) {
        return (l(this, s), (y = y.toUpperCase()), p.mod43 && (y += a(d(y))), c(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this, y, p)))
      }
      return (
        v(s, [
          {
            key: 'encode',
            value: function () {
              for (var p = r('*'), g = 0; g < this.data.length; g++) p += r(this.data[g]) + '0'
              return ((p += r('*')), { data: p, text: this.text })
            }
          },
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1
            }
          }
        ]),
        s
      )
    })(f.default),
    t = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '-',
      '.',
      ' ',
      '$',
      '/',
      '+',
      '%',
      '*'
    ],
    e = [
      20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301,
      30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477,
      17489, 17681, 20753, 35770
    ]
  function r(_) {
    return n(u(_))
  }
  function n(_) {
    return e[_].toString(2)
  }
  function a(_) {
    return t[_]
  }
  function u(_) {
    return t.indexOf(_)
  }
  function d(_) {
    for (var s = 0, y = 0; y < _.length; y++) s += u(_[y])
    return ((s = s % 43), s)
  }
  return ((j.CODE39 = i), j)
}
var A = {},
  V = {},
  J = {},
  b = {},
  ke
function $() {
  if (ke) return b
  ;((ke = 1), Object.defineProperty(b, '__esModule', { value: !0 }))
  var v
  function f(e, r, n) {
    return (r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : (e[r] = n), e)
  }
  var o = (b.SET_A = 0),
    l = (b.SET_B = 1),
    c = (b.SET_C = 2)
  b.SHIFT = 98
  var h = (b.START_A = 103),
    i = (b.START_B = 104),
    t = (b.START_C = 105)
  return (
    (b.MODULO = 103),
    (b.STOP = 106),
    (b.FNC1 = 207),
    (b.SET_BY_CODE = ((v = {}), f(v, h, o), f(v, i, l), f(v, t, c), v)),
    (b.SWAP = { 101: o, 100: l, 99: c }),
    (b.A_START_CHAR = 'Ð'),
    (b.B_START_CHAR = 'Ñ'),
    (b.C_START_CHAR = 'Ò'),
    (b.A_CHARS = '[\0-_È-Ï]'),
    (b.B_CHARS = '[ -È-Ï]'),
    (b.C_CHARS = '(Ï*[0-9]{2}Ï*)'),
    (b.BARS = [
      11011001100, 11001101100, 11001100110, 10010011e3, 10010001100, 10001001100, 10011001e3, 10011000100, 10001100100, 11001001e3, 11001000100,
      11000100100, 10110011100, 10011011100, 10011001110, 10111001100, 10011101100, 10011100110, 11001110010, 11001011100, 11001001110, 11011100100,
      11001110100, 11101101110, 11101001100, 11100101100, 11100100110, 11101100100, 11100110100, 11100110010, 11011011e3, 11011000110, 11000110110,
      10100011e3, 10001011e3, 10001000110, 10110001e3, 10001101e3, 10001100010, 11010001e3, 11000101e3, 11000100010, 10110111e3, 10110001110,
      10001101110, 10111011e3, 10111000110, 10001110110, 11101110110, 11010001110, 11000101110, 11011101e3, 11011100010, 11011101110, 11101011e3,
      11101000110, 11100010110, 11101101e3, 11101100010, 11100011010, 11101111010, 11001000010, 11110001010, 1010011e4, 10100001100, 1001011e4,
      10010000110, 10000101100, 10000100110, 1011001e4, 10110000100, 1001101e4, 10011000010, 10000110100, 10000110010, 11000010010, 1100101e4,
      11110111010, 11000010100, 10001111010, 10100111100, 10010111100, 10010011110, 10111100100, 10011110100, 10011110010, 11110100100, 11110010100,
      11110010010, 11011011110, 11011110110, 11110110110, 10101111e3, 10100011110, 10001011110, 10111101e3, 10111100010, 11110101e3, 11110100010,
      10111011110, 10111101110, 11101011110, 11110101110, 11010000100, 1101001e4, 11010011100, 1100011101011
    ]),
    b
  )
}
var qe
function Ae() {
  if (qe) return J
  ;((qe = 1), Object.defineProperty(J, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = l(x()),
    o = $()
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (J.default = (function (t) {
      i(e, t)
      function e(r, n) {
        c(this, e)
        var a = h(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r.substring(1), n))
        return (
          (a.bytes = r.split('').map(function (u) {
            return u.charCodeAt(0)
          })),
          a
        )
      }
      return (
        v(
          e,
          [
            {
              key: 'valid',
              value: function () {
                return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data)
              }
            },
            {
              key: 'encode',
              value: function () {
                var n = this.bytes,
                  a = n.shift() - 105,
                  u = o.SET_BY_CODE[a]
                if (u === void 0) throw new RangeError('The encoding does not start with a start character.')
                this.shouldEncodeAsEan128() === !0 && n.unshift(o.FNC1)
                var d = e.next(n, 1, u)
                return {
                  text: this.text === this.data ? this.text.replace(/[^\x20-\x7E]/g, '') : this.text,
                  data: e.getBar(a) + d.result + e.getBar((d.checksum + a) % o.MODULO) + e.getBar(o.STOP)
                }
              }
            },
            {
              key: 'shouldEncodeAsEan128',
              value: function () {
                var n = this.options.ean128 || !1
                return (typeof n == 'string' && (n = n.toLowerCase() === 'true'), n)
              }
            }
          ],
          [
            {
              key: 'getBar',
              value: function (n) {
                return o.BARS[n] ? o.BARS[n].toString() : ''
              }
            },
            {
              key: 'correctIndex',
              value: function (n, a) {
                if (a === o.SET_A) {
                  var u = n.shift()
                  return u < 32 ? u + 64 : u - 32
                } else return a === o.SET_B ? n.shift() - 32 : (n.shift() - 48) * 10 + n.shift() - 48
              }
            },
            {
              key: 'next',
              value: function (n, a, u) {
                if (!n.length) return { result: '', checksum: 0 }
                var d = void 0,
                  _ = void 0
                if (n[0] >= 200) {
                  _ = n.shift() - 105
                  var s = o.SWAP[_]
                  s !== void 0
                    ? (d = e.next(n, a + 1, s))
                    : ((u === o.SET_A || u === o.SET_B) &&
                        _ === o.SHIFT &&
                        (n[0] = u === o.SET_A ? (n[0] > 95 ? n[0] - 96 : n[0]) : n[0] < 32 ? n[0] + 96 : n[0]),
                      (d = e.next(n, a + 1, u)))
                } else ((_ = e.correctIndex(n, u)), (d = e.next(n, a + 1, u)))
                var y = e.getBar(_),
                  p = _ * a
                return { result: y + d.result, checksum: p + d.checksum }
              }
            }
          ]
        ),
        e
      )
    })(f.default)),
    J
  )
}
var Y = {},
  je
function Xt() {
  if (je) return Y
  ;((je = 1), Object.defineProperty(Y, '__esModule', { value: !0 }))
  var v = $(),
    f = function (t) {
      return t.match(new RegExp('^' + v.A_CHARS + '*'))[0].length
    },
    o = function (t) {
      return t.match(new RegExp('^' + v.B_CHARS + '*'))[0].length
    },
    l = function (t) {
      return t.match(new RegExp('^' + v.C_CHARS + '*'))[0]
    }
  function c(i, t) {
    var e = t ? v.A_CHARS : v.B_CHARS,
      r = i.match(new RegExp('^(' + e + '+?)(([0-9]{2}){2,})([^0-9]|$)'))
    if (r) return r[1] + 'Ì' + h(i.substring(r[1].length))
    var n = i.match(new RegExp('^' + e + '+'))[0]
    return n.length === i.length ? i : n + String.fromCharCode(t ? 205 : 206) + c(i.substring(n.length), !t)
  }
  function h(i) {
    var t = l(i),
      e = t.length
    if (e === i.length) return i
    i = i.substring(e)
    var r = f(i) >= o(i)
    return t + String.fromCharCode(r ? 206 : 205) + c(i, r)
  }
  return (
    (Y.default = function (i) {
      var t = void 0
      if (l(i).length >= 2) t = v.C_START_CHAR + h(i)
      else {
        var e = f(i) > o(i)
        t = (e ? v.A_START_CHAR : v.B_START_CHAR) + c(i, e)
      }
      return t.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function (r, n) {
        return 'Ë' + n
      })
    }),
    Y
  )
}
var Le
function zt() {
  if (Le) return V
  ;((Le = 1), Object.defineProperty(V, '__esModule', { value: !0 }))
  var v = o(Ae()),
    f = o(Xt())
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (V.default = (function (i) {
      h(t, i)
      function t(e, r) {
        if ((l(this, t), /^[\x00-\x7F\xC8-\xD3]+$/.test(e)))
          var n = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, (0, f.default)(e), r))
        else var n = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r))
        return c(n)
      }
      return t
    })(v.default)),
    V
  )
}
var Q = {},
  Be
function Vt() {
  if (Be) return Q
  ;((Be = 1), Object.defineProperty(Q, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = l(Ae()),
    o = $()
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (Q.default = (function (t) {
      i(e, t)
      function e(r, n) {
        return (c(this, e), h(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, o.A_START_CHAR + r, n)))
      }
      return (
        v(e, [
          {
            key: 'valid',
            value: function () {
              return new RegExp('^' + o.A_CHARS + '+$').test(this.data)
            }
          }
        ]),
        e
      )
    })(f.default)),
    Q
  )
}
var W = {},
  Ce
function Jt() {
  if (Ce) return W
  ;((Ce = 1), Object.defineProperty(W, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = l(Ae()),
    o = $()
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (W.default = (function (t) {
      i(e, t)
      function e(r, n) {
        return (c(this, e), h(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, o.B_START_CHAR + r, n)))
      }
      return (
        v(e, [
          {
            key: 'valid',
            value: function () {
              return new RegExp('^' + o.B_CHARS + '+$').test(this.data)
            }
          }
        ]),
        e
      )
    })(f.default)),
    W
  )
}
var Z = {},
  Ne
function Yt() {
  if (Ne) return Z
  ;((Ne = 1), Object.defineProperty(Z, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = l(Ae()),
    o = $()
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (Z.default = (function (t) {
      i(e, t)
      function e(r, n) {
        return (c(this, e), h(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, o.C_START_CHAR + r, n)))
      }
      return (
        v(e, [
          {
            key: 'valid',
            value: function () {
              return new RegExp('^' + o.C_CHARS + '+$').test(this.data)
            }
          }
        ]),
        e
      )
    })(f.default)),
    Z
  )
}
var Ge
function Qt() {
  if (Ge) return A
  ;((Ge = 1), Object.defineProperty(A, '__esModule', { value: !0 }), (A.CODE128C = A.CODE128B = A.CODE128A = A.CODE128 = void 0))
  var v = c(zt()),
    f = c(Vt()),
    o = c(Jt()),
    l = c(Yt())
  function c(h) {
    return h && h.__esModule ? h : { default: h }
  }
  return ((A.CODE128 = v.default), (A.CODE128A = f.default), (A.CODE128B = o.default), (A.CODE128C = l.default), A)
}
var m = {},
  K = {},
  T = {},
  $e
function F() {
  return (
    $e ||
      (($e = 1),
      Object.defineProperty(T, '__esModule', { value: !0 }),
      (T.SIDE_BIN = '101'),
      (T.MIDDLE_BIN = '01010'),
      (T.BINARIES = {
        L: ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'],
        G: ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'],
        R: ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'],
        O: ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'],
        E: ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
      }),
      (T.EAN2_STRUCTURE = ['LL', 'LG', 'GL', 'GG']),
      (T.EAN5_STRUCTURE = ['GGLLL', 'GLGLL', 'GLLGL', 'GLLLG', 'LGGLL', 'LLGGL', 'LLLGG', 'LGLGL', 'LGLLG', 'LLGLG']),
      (T.EAN13_STRUCTURE = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'])),
    T
  )
}
var ee = {},
  te = {},
  Fe
function H() {
  if (Fe) return te
  ;((Fe = 1), Object.defineProperty(te, '__esModule', { value: !0 }))
  var v = F()
  return (
    (te.default = function (o, l, c) {
      var h = o
        .split('')
        .map(function (t, e) {
          return v.BINARIES[l[e]]
        })
        .map(function (t, e) {
          return t ? t[o[e]] : ''
        })
      if (c) {
        var i = o.length - 1
        h = h.map(function (t, e) {
          return e < i ? t + c : t
        })
      }
      return h.join('')
    }),
    te
  )
}
var He
function Dt() {
  if (He) return ee
  ;((He = 1), Object.defineProperty(ee, '__esModule', { value: !0 }))
  var v = (function () {
      function e(r, n) {
        for (var a = 0; a < n.length; a++) {
          var u = n[a]
          ;((u.enumerable = u.enumerable || !1), (u.configurable = !0), 'value' in u && (u.writable = !0), Object.defineProperty(r, u.key, u))
        }
      }
      return function (r, n, a) {
        return (n && e(r.prototype, n), a && e(r, a), r)
      }
    })(),
    f = F(),
    o = c(H()),
    l = c(x())
  function c(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function h(e, r) {
    if (!(e instanceof r)) throw new TypeError('Cannot call a class as a function')
  }
  function i(e, r) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return r && (typeof r == 'object' || typeof r == 'function') ? r : e
  }
  function t(e, r) {
    if (typeof r != 'function' && r !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof r)
    ;((e.prototype = Object.create(r && r.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : (e.__proto__ = r)))
  }
  return (
    (ee.default = (function (e) {
      t(r, e)
      function r(n, a) {
        h(this, r)
        var u = i(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, n, a))
        return (
          (u.fontSize = !a.flat && a.fontSize > a.width * 10 ? a.width * 10 : a.fontSize),
          (u.guardHeight = a.height + u.fontSize / 2 + a.textMargin),
          u
        )
      }
      return (
        v(r, [
          {
            key: 'encode',
            value: function () {
              return this.options.flat ? this.encodeFlat() : this.encodeGuarded()
            }
          },
          {
            key: 'leftText',
            value: function (a, u) {
              return this.text.substr(a, u)
            }
          },
          {
            key: 'leftEncode',
            value: function (a, u) {
              return (0, o.default)(a, u)
            }
          },
          {
            key: 'rightText',
            value: function (a, u) {
              return this.text.substr(a, u)
            }
          },
          {
            key: 'rightEncode',
            value: function (a, u) {
              return (0, o.default)(a, u)
            }
          },
          {
            key: 'encodeGuarded',
            value: function () {
              var a = { fontSize: this.fontSize },
                u = { height: this.guardHeight }
              return [
                { data: f.SIDE_BIN, options: u },
                { data: this.leftEncode(), text: this.leftText(), options: a },
                { data: f.MIDDLE_BIN, options: u },
                { data: this.rightEncode(), text: this.rightText(), options: a },
                { data: f.SIDE_BIN, options: u }
              ]
            }
          },
          {
            key: 'encodeFlat',
            value: function () {
              return { data: [f.SIDE_BIN, this.leftEncode(), f.MIDDLE_BIN, this.rightEncode(), f.SIDE_BIN].join(''), text: this.text }
            }
          }
        ]),
        r
      )
    })(l.default)),
    ee
  )
}
var Ue
function Wt() {
  if (Ue) return K
  ;((Ue = 1), Object.defineProperty(K, '__esModule', { value: !0 }))
  var v = (function () {
      function r(n, a) {
        for (var u = 0; u < a.length; u++) {
          var d = a[u]
          ;((d.enumerable = d.enumerable || !1), (d.configurable = !0), 'value' in d && (d.writable = !0), Object.defineProperty(n, d.key, d))
        }
      }
      return function (n, a, u) {
        return (a && r(n.prototype, a), u && r(n, u), n)
      }
    })(),
    f = function r(n, a, u) {
      n === null && (n = Function.prototype)
      var d = Object.getOwnPropertyDescriptor(n, a)
      if (d === void 0) {
        var _ = Object.getPrototypeOf(n)
        return _ === null ? void 0 : r(_, a, u)
      } else {
        if ('value' in d) return d.value
        var s = d.get
        return s === void 0 ? void 0 : s.call(u)
      }
    },
    o = F(),
    l = c(Dt())
  function c(r) {
    return r && r.__esModule ? r : { default: r }
  }
  function h(r, n) {
    if (!(r instanceof n)) throw new TypeError('Cannot call a class as a function')
  }
  function i(r, n) {
    if (!r) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return n && (typeof n == 'object' || typeof n == 'function') ? n : r
  }
  function t(r, n) {
    if (typeof n != 'function' && n !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof n)
    ;((r.prototype = Object.create(n && n.prototype, { constructor: { value: r, enumerable: !1, writable: !0, configurable: !0 } })),
      n && (Object.setPrototypeOf ? Object.setPrototypeOf(r, n) : (r.__proto__ = n)))
  }
  var e = function (n) {
    return (
      (10 -
        (n
          .substr(0, 12)
          .split('')
          .map(function (a) {
            return +a
          })
          .reduce(function (a, u, d) {
            return d % 2 ? a + u * 3 : a + u
          }, 0) %
          10)) %
      10
    )
  }
  return (
    (K.default = (function (r) {
      t(n, r)
      function n(a, u) {
        ;(h(this, n), a.search(/^[0-9]{12}$/) !== -1 && (a += e(a)))
        var d = i(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this, a, u))
        return ((d.lastChar = u.lastChar), d)
      }
      return (
        v(n, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9]{13}$/) !== -1 && +this.data[12] === e(this.data)
            }
          },
          {
            key: 'leftText',
            value: function () {
              return f(n.prototype.__proto__ || Object.getPrototypeOf(n.prototype), 'leftText', this).call(this, 1, 6)
            }
          },
          {
            key: 'leftEncode',
            value: function () {
              var u = this.data.substr(1, 6),
                d = o.EAN13_STRUCTURE[this.data[0]]
              return f(n.prototype.__proto__ || Object.getPrototypeOf(n.prototype), 'leftEncode', this).call(this, u, d)
            }
          },
          {
            key: 'rightText',
            value: function () {
              return f(n.prototype.__proto__ || Object.getPrototypeOf(n.prototype), 'rightText', this).call(this, 7, 6)
            }
          },
          {
            key: 'rightEncode',
            value: function () {
              var u = this.data.substr(7, 6)
              return f(n.prototype.__proto__ || Object.getPrototypeOf(n.prototype), 'rightEncode', this).call(this, u, 'RRRRRR')
            }
          },
          {
            key: 'encodeGuarded',
            value: function () {
              var u = f(n.prototype.__proto__ || Object.getPrototypeOf(n.prototype), 'encodeGuarded', this).call(this)
              return (
                this.options.displayValue &&
                  (u.unshift({ data: '000000000000', text: this.text.substr(0, 1), options: { textAlign: 'left', fontSize: this.fontSize } }),
                  this.options.lastChar &&
                    (u.push({ data: '00' }), u.push({ data: '00000', text: this.options.lastChar, options: { fontSize: this.fontSize } }))),
                u
              )
            }
          }
        ]),
        n
      )
    })(l.default)),
    K
  )
}
var re = {},
  Xe
function Zt() {
  if (Xe) return re
  ;((Xe = 1), Object.defineProperty(re, '__esModule', { value: !0 }))
  var v = (function () {
      function e(r, n) {
        for (var a = 0; a < n.length; a++) {
          var u = n[a]
          ;((u.enumerable = u.enumerable || !1), (u.configurable = !0), 'value' in u && (u.writable = !0), Object.defineProperty(r, u.key, u))
        }
      }
      return function (r, n, a) {
        return (n && e(r.prototype, n), a && e(r, a), r)
      }
    })(),
    f = function e(r, n, a) {
      r === null && (r = Function.prototype)
      var u = Object.getOwnPropertyDescriptor(r, n)
      if (u === void 0) {
        var d = Object.getPrototypeOf(r)
        return d === null ? void 0 : e(d, n, a)
      } else {
        if ('value' in u) return u.value
        var _ = u.get
        return _ === void 0 ? void 0 : _.call(a)
      }
    },
    o = l(Dt())
  function l(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function c(e, r) {
    if (!(e instanceof r)) throw new TypeError('Cannot call a class as a function')
  }
  function h(e, r) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return r && (typeof r == 'object' || typeof r == 'function') ? r : e
  }
  function i(e, r) {
    if (typeof r != 'function' && r !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof r)
    ;((e.prototype = Object.create(r && r.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : (e.__proto__ = r)))
  }
  var t = function (r) {
    return (
      (10 -
        (r
          .substr(0, 7)
          .split('')
          .map(function (n) {
            return +n
          })
          .reduce(function (n, a, u) {
            return u % 2 ? n + a : n + a * 3
          }, 0) %
          10)) %
      10
    )
  }
  return (
    (re.default = (function (e) {
      i(r, e)
      function r(n, a) {
        return (c(this, r), n.search(/^[0-9]{7}$/) !== -1 && (n += t(n)), h(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, n, a)))
      }
      return (
        v(r, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9]{8}$/) !== -1 && +this.data[7] === t(this.data)
            }
          },
          {
            key: 'leftText',
            value: function () {
              return f(r.prototype.__proto__ || Object.getPrototypeOf(r.prototype), 'leftText', this).call(this, 0, 4)
            }
          },
          {
            key: 'leftEncode',
            value: function () {
              var a = this.data.substr(0, 4)
              return f(r.prototype.__proto__ || Object.getPrototypeOf(r.prototype), 'leftEncode', this).call(this, a, 'LLLL')
            }
          },
          {
            key: 'rightText',
            value: function () {
              return f(r.prototype.__proto__ || Object.getPrototypeOf(r.prototype), 'rightText', this).call(this, 4, 4)
            }
          },
          {
            key: 'rightEncode',
            value: function () {
              var a = this.data.substr(4, 4)
              return f(r.prototype.__proto__ || Object.getPrototypeOf(r.prototype), 'rightEncode', this).call(this, a, 'RRRR')
            }
          }
        ]),
        r
      )
    })(o.default)),
    re
  )
}
var ne = {},
  ze
function Kt() {
  if (ze) return ne
  ;((ze = 1), Object.defineProperty(ne, '__esModule', { value: !0 }))
  var v = (function () {
      function r(n, a) {
        for (var u = 0; u < a.length; u++) {
          var d = a[u]
          ;((d.enumerable = d.enumerable || !1), (d.configurable = !0), 'value' in d && (d.writable = !0), Object.defineProperty(n, d.key, d))
        }
      }
      return function (n, a, u) {
        return (a && r(n.prototype, a), u && r(n, u), n)
      }
    })(),
    f = F(),
    o = c(H()),
    l = c(x())
  function c(r) {
    return r && r.__esModule ? r : { default: r }
  }
  function h(r, n) {
    if (!(r instanceof n)) throw new TypeError('Cannot call a class as a function')
  }
  function i(r, n) {
    if (!r) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return n && (typeof n == 'object' || typeof n == 'function') ? n : r
  }
  function t(r, n) {
    if (typeof n != 'function' && n !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof n)
    ;((r.prototype = Object.create(n && n.prototype, { constructor: { value: r, enumerable: !1, writable: !0, configurable: !0 } })),
      n && (Object.setPrototypeOf ? Object.setPrototypeOf(r, n) : (r.__proto__ = n)))
  }
  var e = function (n) {
    return (
      n
        .split('')
        .map(function (a) {
          return +a
        })
        .reduce(function (a, u, d) {
          return d % 2 ? a + u * 9 : a + u * 3
        }, 0) % 10
    )
  }
  return (
    (ne.default = (function (r) {
      t(n, r)
      function n(a, u) {
        return (h(this, n), i(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this, a, u)))
      }
      return (
        v(n, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9]{5}$/) !== -1
            }
          },
          {
            key: 'encode',
            value: function () {
              var u = f.EAN5_STRUCTURE[e(this.data)]
              return { data: '1011' + (0, o.default)(this.data, u, '01'), text: this.text }
            }
          }
        ]),
        n
      )
    })(l.default)),
    ne
  )
}
var ie = {},
  Ve
function er() {
  if (Ve) return ie
  ;((Ve = 1), Object.defineProperty(ie, '__esModule', { value: !0 }))
  var v = (function () {
      function e(r, n) {
        for (var a = 0; a < n.length; a++) {
          var u = n[a]
          ;((u.enumerable = u.enumerable || !1), (u.configurable = !0), 'value' in u && (u.writable = !0), Object.defineProperty(r, u.key, u))
        }
      }
      return function (r, n, a) {
        return (n && e(r.prototype, n), a && e(r, a), r)
      }
    })(),
    f = F(),
    o = c(H()),
    l = c(x())
  function c(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function h(e, r) {
    if (!(e instanceof r)) throw new TypeError('Cannot call a class as a function')
  }
  function i(e, r) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return r && (typeof r == 'object' || typeof r == 'function') ? r : e
  }
  function t(e, r) {
    if (typeof r != 'function' && r !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof r)
    ;((e.prototype = Object.create(r && r.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : (e.__proto__ = r)))
  }
  return (
    (ie.default = (function (e) {
      t(r, e)
      function r(n, a) {
        return (h(this, r), i(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, n, a)))
      }
      return (
        v(r, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9]{2}$/) !== -1
            }
          },
          {
            key: 'encode',
            value: function () {
              var a = f.EAN2_STRUCTURE[parseInt(this.data) % 4]
              return { data: '1011' + (0, o.default)(this.data, a, '01'), text: this.text }
            }
          }
        ]),
        r
      )
    })(l.default)),
    ie
  )
}
var L = {},
  Je
function kt() {
  if (Je) return L
  ;((Je = 1), Object.defineProperty(L, '__esModule', { value: !0 }))
  var v = (function () {
    function r(n, a) {
      for (var u = 0; u < a.length; u++) {
        var d = a[u]
        ;((d.enumerable = d.enumerable || !1), (d.configurable = !0), 'value' in d && (d.writable = !0), Object.defineProperty(n, d.key, d))
      }
    }
    return function (n, a, u) {
      return (a && r(n.prototype, a), u && r(n, u), n)
    }
  })()
  L.checksum = e
  var f = l(H()),
    o = l(x())
  function l(r) {
    return r && r.__esModule ? r : { default: r }
  }
  function c(r, n) {
    if (!(r instanceof n)) throw new TypeError('Cannot call a class as a function')
  }
  function h(r, n) {
    if (!r) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return n && (typeof n == 'object' || typeof n == 'function') ? n : r
  }
  function i(r, n) {
    if (typeof n != 'function' && n !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof n)
    ;((r.prototype = Object.create(n && n.prototype, { constructor: { value: r, enumerable: !1, writable: !0, configurable: !0 } })),
      n && (Object.setPrototypeOf ? Object.setPrototypeOf(r, n) : (r.__proto__ = n)))
  }
  var t = (function (r) {
    i(n, r)
    function n(a, u) {
      ;(c(this, n), a.search(/^[0-9]{11}$/) !== -1 && (a += e(a)))
      var d = h(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this, a, u))
      return (
        (d.displayValue = u.displayValue),
        u.fontSize > u.width * 10 ? (d.fontSize = u.width * 10) : (d.fontSize = u.fontSize),
        (d.guardHeight = u.height + d.fontSize / 2 + u.textMargin),
        d
      )
    }
    return (
      v(n, [
        {
          key: 'valid',
          value: function () {
            return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == e(this.data)
          }
        },
        {
          key: 'encode',
          value: function () {
            return this.options.flat ? this.flatEncoding() : this.guardedEncoding()
          }
        },
        {
          key: 'flatEncoding',
          value: function () {
            var u = ''
            return (
              (u += '101'),
              (u += (0, f.default)(this.data.substr(0, 6), 'LLLLLL')),
              (u += '01010'),
              (u += (0, f.default)(this.data.substr(6, 6), 'RRRRRR')),
              (u += '101'),
              { data: u, text: this.text }
            )
          }
        },
        {
          key: 'guardedEncoding',
          value: function () {
            var u = []
            return (
              this.displayValue &&
                u.push({ data: '00000000', text: this.text.substr(0, 1), options: { textAlign: 'left', fontSize: this.fontSize } }),
              u.push({ data: '101' + (0, f.default)(this.data[0], 'L'), options: { height: this.guardHeight } }),
              u.push({ data: (0, f.default)(this.data.substr(1, 5), 'LLLLL'), text: this.text.substr(1, 5), options: { fontSize: this.fontSize } }),
              u.push({ data: '01010', options: { height: this.guardHeight } }),
              u.push({ data: (0, f.default)(this.data.substr(6, 5), 'RRRRR'), text: this.text.substr(6, 5), options: { fontSize: this.fontSize } }),
              u.push({ data: (0, f.default)(this.data[11], 'R') + '101', options: { height: this.guardHeight } }),
              this.displayValue &&
                u.push({ data: '00000000', text: this.text.substr(11, 1), options: { textAlign: 'right', fontSize: this.fontSize } }),
              u
            )
          }
        }
      ]),
      n
    )
  })(o.default)
  function e(r) {
    var n = 0,
      a
    for (a = 1; a < 11; a += 2) n += parseInt(r[a])
    for (a = 0; a < 11; a += 2) n += parseInt(r[a]) * 3
    return (10 - (n % 10)) % 10
  }
  return ((L.default = t), L)
}
var ae = {},
  Ye
function tr() {
  if (Ye) return ae
  ;((Ye = 1), Object.defineProperty(ae, '__esModule', { value: !0 }))
  var v = (function () {
      function u(d, _) {
        for (var s = 0; s < _.length; s++) {
          var y = _[s]
          ;((y.enumerable = y.enumerable || !1), (y.configurable = !0), 'value' in y && (y.writable = !0), Object.defineProperty(d, y.key, y))
        }
      }
      return function (d, _, s) {
        return (_ && u(d.prototype, _), s && u(d, s), d)
      }
    })(),
    f = c(H()),
    o = c(x()),
    l = kt()
  function c(u) {
    return u && u.__esModule ? u : { default: u }
  }
  function h(u, d) {
    if (!(u instanceof d)) throw new TypeError('Cannot call a class as a function')
  }
  function i(u, d) {
    if (!u) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return d && (typeof d == 'object' || typeof d == 'function') ? d : u
  }
  function t(u, d) {
    if (typeof d != 'function' && d !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof d)
    ;((u.prototype = Object.create(d && d.prototype, { constructor: { value: u, enumerable: !1, writable: !0, configurable: !0 } })),
      d && (Object.setPrototypeOf ? Object.setPrototypeOf(u, d) : (u.__proto__ = d)))
  }
  var e = [
      'XX00000XXX',
      'XX10000XXX',
      'XX20000XXX',
      'XXX00000XX',
      'XXXX00000X',
      'XXXXX00005',
      'XXXXX00006',
      'XXXXX00007',
      'XXXXX00008',
      'XXXXX00009'
    ],
    r = [
      ['EEEOOO', 'OOOEEE'],
      ['EEOEOO', 'OOEOEE'],
      ['EEOOEO', 'OOEEOE'],
      ['EEOOOE', 'OOEEEO'],
      ['EOEEOO', 'OEOOEE'],
      ['EOOEEO', 'OEEOOE'],
      ['EOOOEE', 'OEEEOO'],
      ['EOEOEO', 'OEOEOE'],
      ['EOEOOE', 'OEOEEO'],
      ['EOOEOE', 'OEEOEO']
    ],
    n = (function (u) {
      t(d, u)
      function d(_, s) {
        h(this, d)
        var y = i(this, (d.__proto__ || Object.getPrototypeOf(d)).call(this, _, s))
        if (((y.isValid = !1), _.search(/^[0-9]{6}$/) !== -1))
          ((y.middleDigits = _), (y.upcA = a(_, '0')), (y.text = s.text || '' + y.upcA[0] + _ + y.upcA[y.upcA.length - 1]), (y.isValid = !0))
        else if (_.search(/^[01][0-9]{7}$/) !== -1)
          if (((y.middleDigits = _.substring(1, _.length - 1)), (y.upcA = a(y.middleDigits, _[0])), y.upcA[y.upcA.length - 1] === _[_.length - 1]))
            y.isValid = !0
          else return i(y)
        else return i(y)
        return (
          (y.displayValue = s.displayValue),
          s.fontSize > s.width * 10 ? (y.fontSize = s.width * 10) : (y.fontSize = s.fontSize),
          (y.guardHeight = s.height + y.fontSize / 2 + s.textMargin),
          y
        )
      }
      return (
        v(d, [
          {
            key: 'valid',
            value: function () {
              return this.isValid
            }
          },
          {
            key: 'encode',
            value: function () {
              return this.options.flat ? this.flatEncoding() : this.guardedEncoding()
            }
          },
          {
            key: 'flatEncoding',
            value: function () {
              var s = ''
              return ((s += '101'), (s += this.encodeMiddleDigits()), (s += '010101'), { data: s, text: this.text })
            }
          },
          {
            key: 'guardedEncoding',
            value: function () {
              var s = []
              return (
                this.displayValue && s.push({ data: '00000000', text: this.text[0], options: { textAlign: 'left', fontSize: this.fontSize } }),
                s.push({ data: '101', options: { height: this.guardHeight } }),
                s.push({ data: this.encodeMiddleDigits(), text: this.text.substring(1, 7), options: { fontSize: this.fontSize } }),
                s.push({ data: '010101', options: { height: this.guardHeight } }),
                this.displayValue && s.push({ data: '00000000', text: this.text[7], options: { textAlign: 'right', fontSize: this.fontSize } }),
                s
              )
            }
          },
          {
            key: 'encodeMiddleDigits',
            value: function () {
              var s = this.upcA[0],
                y = this.upcA[this.upcA.length - 1],
                p = r[parseInt(y)][parseInt(s)]
              return (0, f.default)(this.middleDigits, p)
            }
          }
        ]),
        d
      )
    })(o.default)
  function a(u, d) {
    for (var _ = e[parseInt(u[u.length - 1])], s = '', y = 0, p = 0; p < _.length; p++) {
      var g = _[p]
      g === 'X' ? (s += u[y++]) : (s += g)
    }
    return ((s = '' + d + s), '' + s + (0, l.checksum)(s))
  }
  return ((ae.default = n), ae)
}
var Qe
function rr() {
  if (Qe) return m
  ;((Qe = 1), Object.defineProperty(m, '__esModule', { value: !0 }), (m.UPCE = m.UPC = m.EAN2 = m.EAN5 = m.EAN8 = m.EAN13 = void 0))
  var v = i(Wt()),
    f = i(Zt()),
    o = i(Kt()),
    l = i(er()),
    c = i(kt()),
    h = i(tr())
  function i(t) {
    return t && t.__esModule ? t : { default: t }
  }
  return ((m.EAN13 = v.default), (m.EAN8 = f.default), (m.EAN5 = o.default), (m.EAN2 = l.default), (m.UPC = c.default), (m.UPCE = h.default), m)
}
var M = {},
  ue = {},
  D = {},
  We
function nr() {
  return (
    We ||
      ((We = 1),
      Object.defineProperty(D, '__esModule', { value: !0 }),
      (D.START_BIN = '1010'),
      (D.END_BIN = '11101'),
      (D.BINARIES = ['00110', '10001', '01001', '11000', '00101', '10100', '01100', '00011', '10010', '01010'])),
    D
  )
}
var Ze
function qt() {
  if (Ze) return ue
  ;((Ze = 1), Object.defineProperty(ue, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = nr(),
    o = l(x())
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (ue.default = (function (t) {
      i(e, t)
      function e() {
        return (c(this, e), h(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)))
      }
      return (
        v(e, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^([0-9]{2})+$/) !== -1
            }
          },
          {
            key: 'encode',
            value: function () {
              var n = this,
                a = this.data
                  .match(/.{2}/g)
                  .map(function (u) {
                    return n.encodePair(u)
                  })
                  .join('')
              return { data: f.START_BIN + a + f.END_BIN, text: this.text }
            }
          },
          {
            key: 'encodePair',
            value: function (n) {
              var a = f.BINARIES[n[1]]
              return f.BINARIES[n[0]]
                .split('')
                .map(function (u, d) {
                  return (u === '1' ? '111' : '1') + (a[d] === '1' ? '000' : '0')
                })
                .join('')
            }
          }
        ]),
        e
      )
    })(o.default)),
    ue
  )
}
var oe = {},
  Ke
function ir() {
  if (Ke) return oe
  ;((Ke = 1), Object.defineProperty(oe, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = o(qt())
  function o(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function l(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function c(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function h(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  var i = function (e) {
    var r = e
      .substr(0, 13)
      .split('')
      .map(function (n) {
        return parseInt(n, 10)
      })
      .reduce(function (n, a, u) {
        return n + a * (3 - (u % 2) * 2)
      }, 0)
    return Math.ceil(r / 10) * 10 - r
  }
  return (
    (oe.default = (function (t) {
      h(e, t)
      function e(r, n) {
        return (l(this, e), r.search(/^[0-9]{13}$/) !== -1 && (r += i(r)), c(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n)))
      }
      return (
        v(e, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[0-9]{14}$/) !== -1 && +this.data[13] === i(this.data)
            }
          }
        ]),
        e
      )
    })(f.default)),
    oe
  )
}
var et
function ar() {
  if (et) return M
  ;((et = 1), Object.defineProperty(M, '__esModule', { value: !0 }), (M.ITF14 = M.ITF = void 0))
  var v = o(qt()),
    f = o(ir())
  function o(l) {
    return l && l.__esModule ? l : { default: l }
  }
  return ((M.ITF = v.default), (M.ITF14 = f.default), M)
}
var S = {},
  fe = {},
  tt
function U() {
  if (tt) return fe
  ;((tt = 1), Object.defineProperty(fe, '__esModule', { value: !0 }))
  var v = (function () {
      function e(r, n) {
        for (var a = 0; a < n.length; a++) {
          var u = n[a]
          ;((u.enumerable = u.enumerable || !1), (u.configurable = !0), 'value' in u && (u.writable = !0), Object.defineProperty(r, u.key, u))
        }
      }
      return function (r, n, a) {
        return (n && e(r.prototype, n), a && e(r, a), r)
      }
    })(),
    f = o(x())
  function o(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function l(e, r) {
    if (!(e instanceof r)) throw new TypeError('Cannot call a class as a function')
  }
  function c(e, r) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return r && (typeof r == 'object' || typeof r == 'function') ? r : e
  }
  function h(e, r) {
    if (typeof r != 'function' && r !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof r)
    ;((e.prototype = Object.create(r && r.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : (e.__proto__ = r)))
  }
  var i = (function (e) {
    h(r, e)
    function r(n, a) {
      return (l(this, r), c(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, n, a)))
    }
    return (
      v(r, [
        {
          key: 'encode',
          value: function () {
            for (var a = '110', u = 0; u < this.data.length; u++) {
              var d = parseInt(this.data[u]).toString(2)
              d = t(d, 4 - d.length)
              for (var _ = 0; _ < d.length; _++) a += d[_] == '0' ? '100' : '110'
            }
            return ((a += '1001'), { data: a, text: this.text })
          }
        },
        {
          key: 'valid',
          value: function () {
            return this.data.search(/^[0-9]+$/) !== -1
          }
        }
      ]),
      r
    )
  })(f.default)
  function t(e, r) {
    for (var n = 0; n < r; n++) e = '0' + e
    return e
  }
  return ((fe.default = i), fe)
}
var ce = {},
  B = {},
  rt
function Pe() {
  if (rt) return B
  ;((rt = 1), Object.defineProperty(B, '__esModule', { value: !0 }), (B.mod10 = v), (B.mod11 = f))
  function v(o) {
    for (var l = 0, c = 0; c < o.length; c++) {
      var h = parseInt(o[c])
      ;(c + o.length) % 2 === 0 ? (l += h) : (l += ((h * 2) % 10) + Math.floor((h * 2) / 10))
    }
    return (10 - (l % 10)) % 10
  }
  function f(o) {
    for (var l = 0, c = [2, 3, 4, 5, 6, 7], h = 0; h < o.length; h++) {
      var i = parseInt(o[o.length - 1 - h])
      l += c[h % c.length] * i
    }
    return (11 - (l % 11)) % 11
  }
  return B
}
var nt
function ur() {
  if (nt) return ce
  ;((nt = 1), Object.defineProperty(ce, '__esModule', { value: !0 }))
  var v = o(U()),
    f = Pe()
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (ce.default = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e + (0, f.mod10)(e), r)))
      }
      return t
    })(v.default)),
    ce
  )
}
var le = {},
  it
function or() {
  if (it) return le
  ;((it = 1), Object.defineProperty(le, '__esModule', { value: !0 }))
  var v = o(U()),
    f = Pe()
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (le.default = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e + (0, f.mod11)(e), r)))
      }
      return t
    })(v.default)),
    le
  )
}
var he = {},
  at
function fr() {
  if (at) return he
  ;((at = 1), Object.defineProperty(he, '__esModule', { value: !0 }))
  var v = o(U()),
    f = Pe()
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (he.default = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), (e += (0, f.mod10)(e)), (e += (0, f.mod10)(e)), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r)))
      }
      return t
    })(v.default)),
    he
  )
}
var de = {},
  ut
function cr() {
  if (ut) return de
  ;((ut = 1), Object.defineProperty(de, '__esModule', { value: !0 }))
  var v = o(U()),
    f = Pe()
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (de.default = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), (e += (0, f.mod11)(e)), (e += (0, f.mod10)(e)), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r)))
      }
      return t
    })(v.default)),
    de
  )
}
var ot
function lr() {
  if (ot) return S
  ;((ot = 1), Object.defineProperty(S, '__esModule', { value: !0 }), (S.MSI1110 = S.MSI1010 = S.MSI11 = S.MSI10 = S.MSI = void 0))
  var v = h(U()),
    f = h(ur()),
    o = h(or()),
    l = h(fr()),
    c = h(cr())
  function h(i) {
    return i && i.__esModule ? i : { default: i }
  }
  return ((S.MSI = v.default), (S.MSI10 = f.default), (S.MSI11 = o.default), (S.MSI1010 = l.default), (S.MSI1110 = c.default), S)
}
var C = {},
  ft
function hr() {
  if (ft) return C
  ;((ft = 1), Object.defineProperty(C, '__esModule', { value: !0 }), (C.pharmacode = void 0))
  var v = (function () {
      function i(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r]
          ;((n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n))
        }
      }
      return function (t, e, r) {
        return (e && i(t.prototype, e), r && i(t, r), t)
      }
    })(),
    f = o(x())
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (C.pharmacode = (function (i) {
      h(t, i)
      function t(e, r) {
        l(this, t)
        var n = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r))
        return ((n.number = parseInt(e, 10)), n)
      }
      return (
        v(t, [
          {
            key: 'encode',
            value: function () {
              for (var r = this.number, n = ''; !isNaN(r) && r != 0; )
                r % 2 === 0 ? ((n = '11100' + n), (r = (r - 2) / 2)) : ((n = '100' + n), (r = (r - 1) / 2))
              return ((n = n.slice(0, -2)), { data: n, text: this.text })
            }
          },
          {
            key: 'valid',
            value: function () {
              return this.number >= 3 && this.number <= 131070
            }
          }
        ]),
        t
      )
    })(f.default)),
    C
  )
}
var N = {},
  ct
function dr() {
  if (ct) return N
  ;((ct = 1), Object.defineProperty(N, '__esModule', { value: !0 }), (N.codabar = void 0))
  var v = (function () {
      function i(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r]
          ;((n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n))
        }
      }
      return function (t, e, r) {
        return (e && i(t.prototype, e), r && i(t, r), t)
      }
    })(),
    f = o(x())
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (N.codabar = (function (i) {
      h(t, i)
      function t(e, r) {
        ;(l(this, t), e.search(/^[0-9\-\$\:\.\+\/]+$/) === 0 && (e = 'A' + e + 'A'))
        var n = c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e.toUpperCase(), r))
        return ((n.text = n.options.text || n.text.replace(/[A-D]/g, '')), n)
      }
      return (
        v(t, [
          {
            key: 'valid',
            value: function () {
              return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1
            }
          },
          {
            key: 'encode',
            value: function () {
              for (var r = [], n = this.getEncodings(), a = 0; a < this.data.length; a++)
                (r.push(n[this.data.charAt(a)]), a !== this.data.length - 1 && r.push('0'))
              return { text: this.text, data: r.join('') }
            }
          },
          {
            key: 'getEncodings',
            value: function () {
              return {
                0: '101010011',
                1: '101011001',
                2: '101001011',
                3: '110010101',
                4: '101101001',
                5: '110101001',
                6: '100101011',
                7: '100101101',
                8: '100110101',
                9: '110100101',
                '-': '101001101',
                $: '101100101',
                ':': '1101011011',
                '/': '1101101011',
                '.': '1101101101',
                '+': '1011011011',
                A: '1011001001',
                B: '1001001011',
                C: '1010010011',
                D: '1010011001'
              }
            }
          }
        ]),
        t
      )
    })(f.default)),
    N
  )
}
var I = {},
  ve = {},
  k = {},
  lt
function vr() {
  return (
    lt ||
      ((lt = 1),
      Object.defineProperty(k, '__esModule', { value: !0 }),
      (k.SYMBOLS = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '-',
        '.',
        ' ',
        '$',
        '/',
        '+',
        '%',
        '($)',
        '(%)',
        '(/)',
        '(+)',
        'ÿ'
      ]),
      (k.BINARIES = [
        '100010100',
        '101001000',
        '101000100',
        '101000010',
        '100101000',
        '100100100',
        '100100010',
        '101010000',
        '100010010',
        '100001010',
        '110101000',
        '110100100',
        '110100010',
        '110010100',
        '110010010',
        '110001010',
        '101101000',
        '101100100',
        '101100010',
        '100110100',
        '100011010',
        '101011000',
        '101001100',
        '101000110',
        '100101100',
        '100010110',
        '110110100',
        '110110010',
        '110101100',
        '110100110',
        '110010110',
        '110011010',
        '101101100',
        '101100110',
        '100110110',
        '100111010',
        '100101110',
        '111010100',
        '111010010',
        '111001010',
        '101101110',
        '101110110',
        '110101110',
        '100100110',
        '111011010',
        '111010110',
        '100110010',
        '101011110'
      ]),
      (k.MULTI_SYMBOLS = {
        '\0': ['(%)', 'U'],
        '': ['($)', 'A'],
        '': ['($)', 'B'],
        '': ['($)', 'C'],
        '': ['($)', 'D'],
        '': ['($)', 'E'],
        '': ['($)', 'F'],
        '\x07': ['($)', 'G'],
        '\b': ['($)', 'H'],
        '	': ['($)', 'I'],
        '\n': ['($)', 'J'],
        '\v': ['($)', 'K'],
        '\f': ['($)', 'L'],
        '\r': ['($)', 'M'],
        '': ['($)', 'N'],
        '': ['($)', 'O'],
        '': ['($)', 'P'],
        '': ['($)', 'Q'],
        '': ['($)', 'R'],
        '': ['($)', 'S'],
        '': ['($)', 'T'],
        '': ['($)', 'U'],
        '': ['($)', 'V'],
        '': ['($)', 'W'],
        '': ['($)', 'X'],
        '': ['($)', 'Y'],
        '': ['($)', 'Z'],
        '\x1B': ['(%)', 'A'],
        '': ['(%)', 'B'],
        '': ['(%)', 'C'],
        '': ['(%)', 'D'],
        '': ['(%)', 'E'],
        '!': ['(/)', 'A'],
        '"': ['(/)', 'B'],
        '#': ['(/)', 'C'],
        '&': ['(/)', 'F'],
        "'": ['(/)', 'G'],
        '(': ['(/)', 'H'],
        ')': ['(/)', 'I'],
        '*': ['(/)', 'J'],
        ',': ['(/)', 'L'],
        ':': ['(/)', 'Z'],
        ';': ['(%)', 'F'],
        '<': ['(%)', 'G'],
        '=': ['(%)', 'H'],
        '>': ['(%)', 'I'],
        '?': ['(%)', 'J'],
        '@': ['(%)', 'V'],
        '[': ['(%)', 'K'],
        '\\': ['(%)', 'L'],
        ']': ['(%)', 'M'],
        '^': ['(%)', 'N'],
        _: ['(%)', 'O'],
        '`': ['(%)', 'W'],
        a: ['(+)', 'A'],
        b: ['(+)', 'B'],
        c: ['(+)', 'C'],
        d: ['(+)', 'D'],
        e: ['(+)', 'E'],
        f: ['(+)', 'F'],
        g: ['(+)', 'G'],
        h: ['(+)', 'H'],
        i: ['(+)', 'I'],
        j: ['(+)', 'J'],
        k: ['(+)', 'K'],
        l: ['(+)', 'L'],
        m: ['(+)', 'M'],
        n: ['(+)', 'N'],
        o: ['(+)', 'O'],
        p: ['(+)', 'P'],
        q: ['(+)', 'Q'],
        r: ['(+)', 'R'],
        s: ['(+)', 'S'],
        t: ['(+)', 'T'],
        u: ['(+)', 'U'],
        v: ['(+)', 'V'],
        w: ['(+)', 'W'],
        x: ['(+)', 'X'],
        y: ['(+)', 'Y'],
        z: ['(+)', 'Z'],
        '{': ['(%)', 'P'],
        '|': ['(%)', 'Q'],
        '}': ['(%)', 'R'],
        '~': ['(%)', 'S'],
        '': ['(%)', 'T']
      })),
    k
  )
}
var ht
function jt() {
  if (ht) return ve
  ;((ht = 1), Object.defineProperty(ve, '__esModule', { value: !0 }))
  var v = (function () {
      function t(e, r) {
        for (var n = 0; n < r.length; n++) {
          var a = r[n]
          ;((a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a))
        }
      }
      return function (e, r, n) {
        return (r && t(e.prototype, r), n && t(e, n), e)
      }
    })(),
    f = vr(),
    o = l(x())
  function l(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function c(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function h(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return e && (typeof e == 'object' || typeof e == 'function') ? e : t
  }
  function i(t, e) {
    if (typeof e != 'function' && e !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof e)
    ;((t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e)))
  }
  return (
    (ve.default = (function (t) {
      i(e, t)
      function e(r, n) {
        return (c(this, e), h(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n)))
      }
      return (
        v(
          e,
          [
            {
              key: 'valid',
              value: function () {
                return /^[0-9A-Z\-. $/+%]+$/.test(this.data)
              }
            },
            {
              key: 'encode',
              value: function () {
                var n = this.data.split('').flatMap(function (_) {
                    return f.MULTI_SYMBOLS[_] || _
                  }),
                  a = n
                    .map(function (_) {
                      return e.getEncoding(_)
                    })
                    .join(''),
                  u = e.checksum(n, 20),
                  d = e.checksum(n.concat(u), 15)
                return { text: this.text, data: e.getEncoding('ÿ') + a + e.getEncoding(u) + e.getEncoding(d) + e.getEncoding('ÿ') + '1' }
              }
            }
          ],
          [
            {
              key: 'getEncoding',
              value: function (n) {
                return f.BINARIES[e.symbolValue(n)]
              }
            },
            {
              key: 'getSymbol',
              value: function (n) {
                return f.SYMBOLS[n]
              }
            },
            {
              key: 'symbolValue',
              value: function (n) {
                return f.SYMBOLS.indexOf(n)
              }
            },
            {
              key: 'checksum',
              value: function (n, a) {
                var u = n
                  .slice()
                  .reverse()
                  .reduce(function (d, _, s) {
                    var y = (s % a) + 1
                    return d + e.symbolValue(_) * y
                  }, 0)
                return e.getSymbol(u % 47)
              }
            }
          ]
        ),
        e
      )
    })(o.default)),
    ve
  )
}
var _e = {},
  dt
function _r() {
  if (dt) return _e
  ;((dt = 1), Object.defineProperty(_e, '__esModule', { value: !0 }))
  var v = (function () {
      function i(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r]
          ;((n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n))
        }
      }
      return function (t, e, r) {
        return (e && i(t.prototype, e), r && i(t, r), t)
      }
    })(),
    f = o(jt())
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (_e.default = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r)))
      }
      return (
        v(t, [
          {
            key: 'valid',
            value: function () {
              return /^[\x00-\x7f]+$/.test(this.data)
            }
          }
        ]),
        t
      )
    })(f.default)),
    _e
  )
}
var vt
function sr() {
  if (vt) return I
  ;((vt = 1), Object.defineProperty(I, '__esModule', { value: !0 }), (I.CODE93FullASCII = I.CODE93 = void 0))
  var v = o(jt()),
    f = o(_r())
  function o(l) {
    return l && l.__esModule ? l : { default: l }
  }
  return ((I.CODE93 = v.default), (I.CODE93FullASCII = f.default), I)
}
var G = {},
  _t
function yr() {
  if (_t) return G
  ;((_t = 1), Object.defineProperty(G, '__esModule', { value: !0 }), (G.GenericBarcode = void 0))
  var v = (function () {
      function i(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r]
          ;((n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n))
        }
      }
      return function (t, e, r) {
        return (e && i(t.prototype, e), r && i(t, r), t)
      }
    })(),
    f = o(x())
  function o(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function l(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function c(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function h(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  return (
    (G.GenericBarcode = (function (i) {
      h(t, i)
      function t(e, r) {
        return (l(this, t), c(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r)))
      }
      return (
        v(t, [
          {
            key: 'encode',
            value: function () {
              return { data: '10101010101010101010101010101010101010101', text: this.text }
            }
          },
          {
            key: 'valid',
            value: function () {
              return !0
            }
          }
        ]),
        t
      )
    })(f.default)),
    G
  )
}
var st
function pr() {
  if (st) return X
  ;((st = 1), Object.defineProperty(X, '__esModule', { value: !0 }))
  var v = Ut(),
    f = Qt(),
    o = rr(),
    l = ar(),
    c = lr(),
    h = hr(),
    i = dr(),
    t = sr(),
    e = yr()
  return (
    (X.default = {
      CODE39: v.CODE39,
      CODE128: f.CODE128,
      CODE128A: f.CODE128A,
      CODE128B: f.CODE128B,
      CODE128C: f.CODE128C,
      EAN13: o.EAN13,
      EAN8: o.EAN8,
      EAN5: o.EAN5,
      EAN2: o.EAN2,
      UPC: o.UPC,
      UPCE: o.UPCE,
      ITF14: l.ITF14,
      ITF: l.ITF,
      MSI: c.MSI,
      MSI10: c.MSI10,
      MSI11: c.MSI11,
      MSI1010: c.MSI1010,
      MSI1110: c.MSI1110,
      pharmacode: h.pharmacode,
      codabar: i.codabar,
      CODE93: t.CODE93,
      CODE93FullASCII: t.CODE93FullASCII,
      GenericBarcode: e.GenericBarcode
    }),
    X
  )
}
var se = {},
  yt
function Te() {
  if (yt) return se
  ;((yt = 1), Object.defineProperty(se, '__esModule', { value: !0 }))
  var v =
    Object.assign ||
    function (f) {
      for (var o = 1; o < arguments.length; o++) {
        var l = arguments[o]
        for (var c in l) Object.prototype.hasOwnProperty.call(l, c) && (f[c] = l[c])
      }
      return f
    }
  return (
    (se.default = function (f, o) {
      return v({}, f, o)
    }),
    se
  )
}
var ye = {},
  pt
function gr() {
  if (pt) return ye
  ;((pt = 1), Object.defineProperty(ye, '__esModule', { value: !0 }), (ye.default = v))
  function v(f) {
    var o = []
    function l(c) {
      if (Array.isArray(c)) for (var h = 0; h < c.length; h++) l(c[h])
      else ((c.text = c.text || ''), (c.data = c.data || ''), o.push(c))
    }
    return (l(f), o)
  }
  return ye
}
var pe = {},
  gt
function Or() {
  if (gt) return pe
  ;((gt = 1), Object.defineProperty(pe, '__esModule', { value: !0 }), (pe.default = v))
  function v(f) {
    return (
      (f.marginTop = f.marginTop || f.margin),
      (f.marginBottom = f.marginBottom || f.margin),
      (f.marginRight = f.marginRight || f.margin),
      (f.marginLeft = f.marginLeft || f.margin),
      f
    )
  }
  return pe
}
var ge = {},
  Oe = {},
  Ee = {},
  Ot
function Lt() {
  if (Ot) return Ee
  ;((Ot = 1), Object.defineProperty(Ee, '__esModule', { value: !0 }), (Ee.default = v))
  function v(f) {
    var o = ['width', 'height', 'textMargin', 'fontSize', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight']
    for (var l in o) o.hasOwnProperty(l) && ((l = o[l]), typeof f[l] == 'string' && (f[l] = parseInt(f[l], 10)))
    return (typeof f.displayValue == 'string' && (f.displayValue = f.displayValue != 'false'), f)
  }
  return Ee
}
var be = {},
  Et
function Bt() {
  return (
    Et ||
      ((Et = 1),
      Object.defineProperty(be, '__esModule', { value: !0 }),
      (be.default = {
        width: 2,
        height: 100,
        format: 'auto',
        displayValue: !0,
        fontOptions: '',
        font: 'monospace',
        text: void 0,
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        fontSize: 20,
        background: '#ffffff',
        lineColor: '#000000',
        margin: 10,
        marginTop: void 0,
        marginBottom: void 0,
        marginLeft: void 0,
        marginRight: void 0,
        valid: function () {}
      })),
    be
  )
}
var bt
function Er() {
  if (bt) return Oe
  ;((bt = 1), Object.defineProperty(Oe, '__esModule', { value: !0 }))
  var v = o(Lt()),
    f = o(Bt())
  function o(c) {
    return c && c.__esModule ? c : { default: c }
  }
  function l(c) {
    var h = {}
    for (var i in f.default)
      f.default.hasOwnProperty(i) &&
        (c.hasAttribute('jsbarcode-' + i.toLowerCase()) && (h[i] = c.getAttribute('jsbarcode-' + i.toLowerCase())),
        c.hasAttribute('data-' + i.toLowerCase()) && (h[i] = c.getAttribute('data-' + i.toLowerCase())))
    return ((h.value = c.getAttribute('jsbarcode-value') || c.getAttribute('data-value')), (h = (0, v.default)(h)), h)
  }
  return ((Oe.default = l), Oe)
}
var we = {},
  me = {},
  R = {},
  wt
function Ct() {
  if (wt) return R
  ;((wt = 1),
    Object.defineProperty(R, '__esModule', { value: !0 }),
    (R.getTotalWidthOfEncodings = R.calculateEncodingAttributes = R.getBarcodePadding = R.getEncodingHeight = R.getMaximumHeightOfEncodings = void 0))
  var v = f(Te())
  function f(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function o(e, r) {
    return r.height + (r.displayValue && e.text.length > 0 ? r.fontSize + r.textMargin : 0) + r.marginTop + r.marginBottom
  }
  function l(e, r, n) {
    if (n.displayValue && r < e) {
      if (n.textAlign == 'center') return Math.floor((e - r) / 2)
      if (n.textAlign == 'left') return 0
      if (n.textAlign == 'right') return Math.floor(e - r)
    }
    return 0
  }
  function c(e, r, n) {
    for (var a = 0; a < e.length; a++) {
      var u = e[a],
        d = (0, v.default)(r, u.options),
        _
      d.displayValue ? (_ = t(u.text, d, n)) : (_ = 0)
      var s = u.data.length * d.width
      ;((u.width = Math.ceil(Math.max(_, s))), (u.height = o(u, d)), (u.barcodePadding = l(_, s, d)))
    }
  }
  function h(e) {
    for (var r = 0, n = 0; n < e.length; n++) r += e[n].width
    return r
  }
  function i(e) {
    for (var r = 0, n = 0; n < e.length; n++) e[n].height > r && (r = e[n].height)
    return r
  }
  function t(e, r, n) {
    var a
    if (n) a = n
    else if (typeof document < 'u') a = document.createElement('canvas').getContext('2d')
    else return 0
    a.font = r.fontOptions + ' ' + r.fontSize + 'px ' + r.font
    var u = a.measureText(e)
    return u ? u.width : 0
  }
  return (
    (R.getMaximumHeightOfEncodings = i),
    (R.getEncodingHeight = o),
    (R.getBarcodePadding = l),
    (R.calculateEncodingAttributes = c),
    (R.getTotalWidthOfEncodings = h),
    R
  )
}
var mt
function br() {
  if (mt) return me
  ;((mt = 1), Object.defineProperty(me, '__esModule', { value: !0 }))
  var v = (function () {
      function h(i, t) {
        for (var e = 0; e < t.length; e++) {
          var r = t[e]
          ;((r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(i, r.key, r))
        }
      }
      return function (i, t, e) {
        return (t && h(i.prototype, t), e && h(i, e), i)
      }
    })(),
    f = l(Te()),
    o = Ct()
  function l(h) {
    return h && h.__esModule ? h : { default: h }
  }
  function c(h, i) {
    if (!(h instanceof i)) throw new TypeError('Cannot call a class as a function')
  }
  return (
    (me.default = (function () {
      function h(i, t, e) {
        ;(c(this, h), (this.canvas = i), (this.encodings = t), (this.options = e))
      }
      return (
        v(h, [
          {
            key: 'render',
            value: function () {
              if (!this.canvas.getContext) throw new Error('The browser does not support canvas.')
              this.prepareCanvas()
              for (var t = 0; t < this.encodings.length; t++) {
                var e = (0, f.default)(this.options, this.encodings[t].options)
                ;(this.drawCanvasBarcode(e, this.encodings[t]), this.drawCanvasText(e, this.encodings[t]), this.moveCanvasDrawing(this.encodings[t]))
              }
              this.restoreCanvas()
            }
          },
          {
            key: 'prepareCanvas',
            value: function () {
              var t = this.canvas.getContext('2d')
              ;(t.save(), (0, o.calculateEncodingAttributes)(this.encodings, this.options, t))
              var e = (0, o.getTotalWidthOfEncodings)(this.encodings),
                r = (0, o.getMaximumHeightOfEncodings)(this.encodings)
              ;((this.canvas.width = e + this.options.marginLeft + this.options.marginRight),
                (this.canvas.height = r),
                t.clearRect(0, 0, this.canvas.width, this.canvas.height),
                this.options.background && ((t.fillStyle = this.options.background), t.fillRect(0, 0, this.canvas.width, this.canvas.height)),
                t.translate(this.options.marginLeft, 0))
            }
          },
          {
            key: 'drawCanvasBarcode',
            value: function (t, e) {
              var r = this.canvas.getContext('2d'),
                n = e.data,
                a
              ;(t.textPosition == 'top' ? (a = t.marginTop + t.fontSize + t.textMargin) : (a = t.marginTop), (r.fillStyle = t.lineColor))
              for (var u = 0; u < n.length; u++) {
                var d = u * t.width + e.barcodePadding
                n[u] === '1' ? r.fillRect(d, a, t.width, t.height) : n[u] && r.fillRect(d, a, t.width, t.height * n[u])
              }
            }
          },
          {
            key: 'drawCanvasText',
            value: function (t, e) {
              var r = this.canvas.getContext('2d'),
                n = t.fontOptions + ' ' + t.fontSize + 'px ' + t.font
              if (t.displayValue) {
                var a, u
                ;(t.textPosition == 'top' ? (u = t.marginTop + t.fontSize - t.textMargin) : (u = t.height + t.textMargin + t.marginTop + t.fontSize),
                  (r.font = n),
                  t.textAlign == 'left' || e.barcodePadding > 0
                    ? ((a = 0), (r.textAlign = 'left'))
                    : t.textAlign == 'right'
                      ? ((a = e.width - 1), (r.textAlign = 'right'))
                      : ((a = e.width / 2), (r.textAlign = 'center')),
                  r.fillText(e.text, a, u))
              }
            }
          },
          {
            key: 'moveCanvasDrawing',
            value: function (t) {
              this.canvas.getContext('2d').translate(t.width, 0)
            }
          },
          {
            key: 'restoreCanvas',
            value: function () {
              this.canvas.getContext('2d').restore()
            }
          }
        ]),
        h
      )
    })()),
    me
  )
}
var Se = {},
  St
function wr() {
  if (St) return Se
  ;((St = 1), Object.defineProperty(Se, '__esModule', { value: !0 }))
  var v = (function () {
      function i(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r]
          ;((n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n))
        }
      }
      return function (t, e, r) {
        return (e && i(t.prototype, e), r && i(t, r), t)
      }
    })(),
    f = l(Te()),
    o = Ct()
  function l(i) {
    return i && i.__esModule ? i : { default: i }
  }
  function c(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  var h = 'http://www.w3.org/2000/svg'
  return (
    (Se.default = (function () {
      function i(t, e, r) {
        ;(c(this, i), (this.svg = t), (this.encodings = e), (this.options = r), (this.document = r.xmlDocument || document))
      }
      return (
        v(i, [
          {
            key: 'render',
            value: function () {
              var e = this.options.marginLeft
              this.prepareSVG()
              for (var r = 0; r < this.encodings.length; r++) {
                var n = this.encodings[r],
                  a = (0, f.default)(this.options, n.options),
                  u = this.createGroup(e, a.marginTop, this.svg)
                ;(this.setGroupOptions(u, a), this.drawSvgBarcode(u, a, n), this.drawSVGText(u, a, n), (e += n.width))
              }
            }
          },
          {
            key: 'prepareSVG',
            value: function () {
              for (; this.svg.firstChild; ) this.svg.removeChild(this.svg.firstChild)
              ;(0, o.calculateEncodingAttributes)(this.encodings, this.options)
              var e = (0, o.getTotalWidthOfEncodings)(this.encodings),
                r = (0, o.getMaximumHeightOfEncodings)(this.encodings),
                n = e + this.options.marginLeft + this.options.marginRight
              ;(this.setSvgAttributes(n, r),
                this.options.background && this.drawRect(0, 0, n, r, this.svg).setAttribute('fill', this.options.background))
            }
          },
          {
            key: 'drawSvgBarcode',
            value: function (e, r, n) {
              var a = n.data,
                u
              r.textPosition == 'top' ? (u = r.fontSize + r.textMargin) : (u = 0)
              for (var d = 0, _ = 0, s = 0; s < a.length; s++)
                ((_ = s * r.width + n.barcodePadding),
                  a[s] === '1' ? d++ : d > 0 && (this.drawRect(_ - r.width * d, u, r.width * d, r.height, e), (d = 0)))
              d > 0 && this.drawRect(_ - r.width * (d - 1), u, r.width * d, r.height, e)
            }
          },
          {
            key: 'drawSVGText',
            value: function (e, r, n) {
              var a = this.document.createElementNS(h, 'text')
              if (r.displayValue) {
                var u, d
                ;(a.setAttribute('font-family', r.font),
                  a.setAttribute('font-size', r.fontSize),
                  r.fontOptions.includes('bold') && a.setAttribute('font-weight', 'bold'),
                  r.fontOptions.includes('italic') && a.setAttribute('font-style', 'italic'),
                  r.textPosition == 'top' ? (d = r.fontSize - r.textMargin) : (d = r.height + r.textMargin + r.fontSize),
                  r.textAlign == 'left' || n.barcodePadding > 0
                    ? ((u = 0), a.setAttribute('text-anchor', 'start'))
                    : r.textAlign == 'right'
                      ? ((u = n.width - 1), a.setAttribute('text-anchor', 'end'))
                      : ((u = n.width / 2), a.setAttribute('text-anchor', 'middle')),
                  a.setAttribute('x', u),
                  a.setAttribute('y', d),
                  a.appendChild(this.document.createTextNode(n.text)),
                  e.appendChild(a))
              }
            }
          },
          {
            key: 'setSvgAttributes',
            value: function (e, r) {
              var n = this.svg
              ;(n.setAttribute('width', e + 'px'),
                n.setAttribute('height', r + 'px'),
                n.setAttribute('x', '0px'),
                n.setAttribute('y', '0px'),
                n.setAttribute('viewBox', '0 0 ' + e + ' ' + r),
                n.setAttribute('xmlns', h),
                n.setAttribute('version', '1.1'))
            }
          },
          {
            key: 'createGroup',
            value: function (e, r, n) {
              var a = this.document.createElementNS(h, 'g')
              return (a.setAttribute('transform', 'translate(' + e + ', ' + r + ')'), n.appendChild(a), a)
            }
          },
          {
            key: 'setGroupOptions',
            value: function (e, r) {
              e.setAttribute('fill', r.lineColor)
            }
          },
          {
            key: 'drawRect',
            value: function (e, r, n, a, u) {
              var d = this.document.createElementNS(h, 'rect')
              return (d.setAttribute('x', e), d.setAttribute('y', r), d.setAttribute('width', n), d.setAttribute('height', a), u.appendChild(d), d)
            }
          }
        ]),
        i
      )
    })()),
    Se
  )
}
var Re = {},
  Rt
function mr() {
  if (Rt) return Re
  ;((Rt = 1), Object.defineProperty(Re, '__esModule', { value: !0 }))
  var v = (function () {
    function o(l, c) {
      for (var h = 0; h < c.length; h++) {
        var i = c[h]
        ;((i.enumerable = i.enumerable || !1), (i.configurable = !0), 'value' in i && (i.writable = !0), Object.defineProperty(l, i.key, i))
      }
    }
    return function (l, c, h) {
      return (c && o(l.prototype, c), h && o(l, h), l)
    }
  })()
  function f(o, l) {
    if (!(o instanceof l)) throw new TypeError('Cannot call a class as a function')
  }
  return (
    (Re.default = (function () {
      function o(l, c, h) {
        ;(f(this, o), (this.object = l), (this.encodings = c), (this.options = h))
      }
      return (
        v(o, [
          {
            key: 'render',
            value: function () {
              this.object.encodings = this.encodings
            }
          }
        ]),
        o
      )
    })()),
    Re
  )
}
var xt
function Sr() {
  if (xt) return we
  ;((xt = 1), Object.defineProperty(we, '__esModule', { value: !0 }))
  var v = l(br()),
    f = l(wr()),
    o = l(mr())
  function l(c) {
    return c && c.__esModule ? c : { default: c }
  }
  return ((we.default = { CanvasRenderer: v.default, SVGRenderer: f.default, ObjectRenderer: o.default }), we)
}
var q = {},
  At
function Nt() {
  if (At) return q
  ;((At = 1), Object.defineProperty(q, '__esModule', { value: !0 }))
  function v(i, t) {
    if (!(i instanceof t)) throw new TypeError('Cannot call a class as a function')
  }
  function f(i, t) {
    if (!i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    return t && (typeof t == 'object' || typeof t == 'function') ? t : i
  }
  function o(i, t) {
    if (typeof t != 'function' && t !== null) throw new TypeError('Super expression must either be null or a function, not ' + typeof t)
    ;((i.prototype = Object.create(t && t.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(i, t) : (i.__proto__ = t)))
  }
  var l = (function (i) {
      o(t, i)
      function t(e, r) {
        v(this, t)
        var n = f(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
        return (
          (n.name = 'InvalidInputException'),
          (n.symbology = e),
          (n.input = r),
          (n.message = '"' + n.input + '" is not a valid input for ' + n.symbology),
          n
        )
      }
      return t
    })(Error),
    c = (function (i) {
      o(t, i)
      function t() {
        v(this, t)
        var e = f(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
        return ((e.name = 'InvalidElementException'), (e.message = 'Not supported type to render on'), e)
      }
      return t
    })(Error),
    h = (function (i) {
      o(t, i)
      function t() {
        v(this, t)
        var e = f(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
        return ((e.name = 'NoElementException'), (e.message = 'No element to render on.'), e)
      }
      return t
    })(Error)
  return ((q.InvalidInputException = l), (q.InvalidElementException = c), (q.NoElementException = h), q)
}
var Pt
function Rr() {
  if (Pt) return ge
  ;((Pt = 1), Object.defineProperty(ge, '__esModule', { value: !0 }))
  var v =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (e) {
            return typeof e
          }
        : function (e) {
            return e && typeof Symbol == 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e
          },
    f = c(Er()),
    o = c(Sr()),
    l = Nt()
  function c(e) {
    return e && e.__esModule ? e : { default: e }
  }
  function h(e) {
    if (typeof e == 'string') return i(e)
    if (Array.isArray(e)) {
      for (var r = [], n = 0; n < e.length; n++) r.push(h(e[n]))
      return r
    } else {
      if (typeof HTMLCanvasElement < 'u' && e instanceof HTMLImageElement) return t(e)
      if ((e && e.nodeName && e.nodeName.toLowerCase() === 'svg') || (typeof SVGElement < 'u' && e instanceof SVGElement))
        return { element: e, options: (0, f.default)(e), renderer: o.default.SVGRenderer }
      if (typeof HTMLCanvasElement < 'u' && e instanceof HTMLCanvasElement)
        return { element: e, options: (0, f.default)(e), renderer: o.default.CanvasRenderer }
      if (e && e.getContext) return { element: e, renderer: o.default.CanvasRenderer }
      if (e && (typeof e > 'u' ? 'undefined' : v(e)) === 'object' && !e.nodeName) return { element: e, renderer: o.default.ObjectRenderer }
      throw new l.InvalidElementException()
    }
  }
  function i(e) {
    var r = document.querySelectorAll(e)
    if (r.length !== 0) {
      for (var n = [], a = 0; a < r.length; a++) n.push(h(r[a]))
      return n
    }
  }
  function t(e) {
    var r = document.createElement('canvas')
    return {
      element: r,
      options: (0, f.default)(e),
      renderer: o.default.CanvasRenderer,
      afterRender: function () {
        e.setAttribute('src', r.toDataURL())
      }
    }
  }
  return ((ge.default = h), ge)
}
var xe = {},
  Tt
function xr() {
  if (Tt) return xe
  ;((Tt = 1), Object.defineProperty(xe, '__esModule', { value: !0 }))
  var v = (function () {
    function o(l, c) {
      for (var h = 0; h < c.length; h++) {
        var i = c[h]
        ;((i.enumerable = i.enumerable || !1), (i.configurable = !0), 'value' in i && (i.writable = !0), Object.defineProperty(l, i.key, i))
      }
    }
    return function (l, c, h) {
      return (c && o(l.prototype, c), h && o(l, h), l)
    }
  })()
  function f(o, l) {
    if (!(o instanceof l)) throw new TypeError('Cannot call a class as a function')
  }
  return (
    (xe.default = (function () {
      function o(l) {
        ;(f(this, o), (this.api = l))
      }
      return (
        v(o, [
          {
            key: 'handleCatch',
            value: function (c) {
              if (c.name === 'InvalidInputException')
                if (this.api._options.valid !== this.api._defaults.valid) this.api._options.valid(!1)
                else throw c.message
              else throw c
              this.api.render = function () {}
            }
          },
          {
            key: 'wrapBarcodeCall',
            value: function (c) {
              try {
                var h = c.apply(void 0, arguments)
                return (this.api._options.valid(!0), h)
              } catch (i) {
                return (this.handleCatch(i), this.api)
              }
            }
          }
        ]),
        o
      )
    })()),
    xe
  )
}
var Me, Mt
function Ar() {
  if (Mt) return Me
  Mt = 1
  var v = r(pr()),
    f = r(Te()),
    o = r(gr()),
    l = r(Or()),
    c = r(Rr()),
    h = r(Lt()),
    i = r(xr()),
    t = Nt(),
    e = r(Bt())
  function r(p) {
    return p && p.__esModule ? p : { default: p }
  }
  var n = function () {},
    a = function (g, w, O) {
      var E = new n()
      if (typeof g > 'u') throw Error('No element to render on was provided.')
      return (
        (E._renderProperties = (0, c.default)(g)),
        (E._encodings = []),
        (E._options = e.default),
        (E._errorHandler = new i.default(E)),
        typeof w < 'u' && ((O = O || {}), O.format || (O.format = s()), E.options(O)[O.format](w, O).render()),
        E
      )
    }
  a.getModule = function (p) {
    return v.default[p]
  }
  for (var u in v.default) v.default.hasOwnProperty(u) && d(v.default, u)
  function d(p, g) {
    n.prototype[g] =
      n.prototype[g.toUpperCase()] =
      n.prototype[g.toLowerCase()] =
        function (w, O) {
          var E = this
          return E._errorHandler.wrapBarcodeCall(function () {
            O.text = typeof O.text > 'u' ? void 0 : '' + O.text
            var P = (0, f.default)(E._options, O)
            P = (0, h.default)(P)
            var Gt = p[g],
              $t = _(w, Gt, P)
            return (E._encodings.push($t), E)
          })
        }
  }
  function _(p, g, w) {
    p = '' + p
    var O = new g(p, w)
    if (!O.valid()) throw new t.InvalidInputException(O.constructor.name, p)
    var E = O.encode()
    E = (0, o.default)(E)
    for (var P = 0; P < E.length; P++) E[P].options = (0, f.default)(w, E[P].options)
    return E
  }
  function s() {
    return v.default.CODE128 ? 'CODE128' : Object.keys(v.default)[0]
  }
  ;((n.prototype.options = function (p) {
    return ((this._options = (0, f.default)(this._options, p)), this)
  }),
    (n.prototype.blank = function (p) {
      var g = new Array(p + 1).join('0')
      return (this._encodings.push({ data: g }), this)
    }),
    (n.prototype.init = function () {
      if (this._renderProperties) {
        Array.isArray(this._renderProperties) || (this._renderProperties = [this._renderProperties])
        var p
        for (var g in this._renderProperties) {
          p = this._renderProperties[g]
          var w = (0, f.default)(this._options, p.options)
          ;(w.format == 'auto' && (w.format = s()),
            this._errorHandler.wrapBarcodeCall(function () {
              var O = w.value,
                E = v.default[w.format.toUpperCase()],
                P = _(O, E, w)
              y(p, P, w)
            }))
        }
      }
    }),
    (n.prototype.render = function () {
      if (!this._renderProperties) throw new t.NoElementException()
      if (Array.isArray(this._renderProperties))
        for (var p = 0; p < this._renderProperties.length; p++) y(this._renderProperties[p], this._encodings, this._options)
      else y(this._renderProperties, this._encodings, this._options)
      return this
    }),
    (n.prototype._defaults = e.default))
  function y(p, g, w) {
    g = (0, o.default)(g)
    for (var O = 0; O < g.length; O++) ((g[O].options = (0, f.default)(w, g[O].options)), (0, l.default)(g[O].options))
    ;(0, l.default)(w)
    var E = p.renderer
    ;(new E(p.element, g, w).render(), p.afterRender && p.afterRender())
  }
  return (
    typeof window < 'u' && (window.JsBarcode = a),
    typeof jQuery < 'u' &&
      (jQuery.fn.JsBarcode = function (p, g) {
        var w = []
        return (
          jQuery(this).each(function () {
            w.push(this)
          }),
          a(w, p, g)
        )
      }),
    (Me = a),
    Me
  )
}
var It = Ar(),
  Tr = Ht({ __proto__: null, default: Ft(It) }, [It])
export { Tr as J }

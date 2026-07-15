import { o as ee } from './index-DqMfCNbk.js'
function ne(r, o) {
  for (var i = 0; i < o.length; i++) {
    const e = o[i]
    if (typeof e != 'string' && !Array.isArray(e)) {
      for (const t in e)
        if (t !== 'default' && !(t in r)) {
          const n = Object.getOwnPropertyDescriptor(e, t)
          n && Object.defineProperty(r, t, n.get ? n : { enumerable: !0, get: () => e[t] })
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }))
}
var z = {},
  G,
  pt
function re() {
  return (
    pt ||
      ((pt = 1),
      (G = function () {
        return typeof Promise == 'function' && Promise.prototype && Promise.prototype.then
      })),
    G
  )
}
var Q = {},
  _ = {},
  Bt
function D() {
  if (Bt) return _
  Bt = 1
  let r
  const o = [
    0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828,
    1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
  ]
  return (
    (_.getSymbolSize = function (e) {
      if (!e) throw new Error('"version" cannot be null or undefined')
      if (e < 1 || e > 40) throw new Error('"version" should be in range from 1 to 40')
      return e * 4 + 17
    }),
    (_.getSymbolTotalCodewords = function (e) {
      return o[e]
    }),
    (_.getBCHDigit = function (i) {
      let e = 0
      for (; i !== 0; ) (e++, (i >>>= 1))
      return e
    }),
    (_.setToSJISFunction = function (e) {
      if (typeof e != 'function') throw new Error('"toSJISFunc" is not a valid function.')
      r = e
    }),
    (_.isKanjiModeEnabled = function () {
      return typeof r < 'u'
    }),
    (_.toSJIS = function (e) {
      return r(e)
    }),
    _
  )
}
var W = {},
  At
function wt() {
  return (
    At ||
      ((At = 1),
      (function (r) {
        ;((r.L = { bit: 1 }), (r.M = { bit: 0 }), (r.Q = { bit: 3 }), (r.H = { bit: 2 }))
        function o(i) {
          if (typeof i != 'string') throw new Error('Param is not a string')
          switch (i.toLowerCase()) {
            case 'l':
            case 'low':
              return r.L
            case 'm':
            case 'medium':
              return r.M
            case 'q':
            case 'quartile':
              return r.Q
            case 'h':
            case 'high':
              return r.H
            default:
              throw new Error('Unknown EC Level: ' + i)
          }
        }
        ;((r.isValid = function (e) {
          return e && typeof e.bit < 'u' && e.bit >= 0 && e.bit < 4
        }),
          (r.from = function (e, t) {
            if (r.isValid(e)) return e
            try {
              return o(e)
            } catch {
              return t
            }
          }))
      })(W)),
    W
  )
}
var Z, Rt
function oe() {
  if (Rt) return Z
  Rt = 1
  function r() {
    ;((this.buffer = []), (this.length = 0))
  }
  return (
    (r.prototype = {
      get: function (o) {
        const i = Math.floor(o / 8)
        return ((this.buffer[i] >>> (7 - (o % 8))) & 1) === 1
      },
      put: function (o, i) {
        for (let e = 0; e < i; e++) this.putBit(((o >>> (i - e - 1)) & 1) === 1)
      },
      getLengthInBits: function () {
        return this.length
      },
      putBit: function (o) {
        const i = Math.floor(this.length / 8)
        ;(this.buffer.length <= i && this.buffer.push(0), o && (this.buffer[i] |= 128 >>> (this.length % 8)), this.length++)
      }
    }),
    (Z = r),
    Z
  )
}
var X, Nt
function ie() {
  if (Nt) return X
  Nt = 1
  function r(o) {
    if (!o || o < 1) throw new Error('BitMatrix size must be defined and greater than 0')
    ;((this.size = o), (this.data = new Uint8Array(o * o)), (this.reservedBit = new Uint8Array(o * o)))
  }
  return (
    (r.prototype.set = function (o, i, e, t) {
      const n = o * this.size + i
      ;((this.data[n] = e), t && (this.reservedBit[n] = !0))
    }),
    (r.prototype.get = function (o, i) {
      return this.data[o * this.size + i]
    }),
    (r.prototype.xor = function (o, i, e) {
      this.data[o * this.size + i] ^= e
    }),
    (r.prototype.isReserved = function (o, i) {
      return this.reservedBit[o * this.size + i]
    }),
    (X = r),
    X
  )
}
var x = {},
  Pt
function ue() {
  return (
    Pt ||
      ((Pt = 1),
      (function (r) {
        const o = D().getSymbolSize
        ;((r.getRowColCoords = function (e) {
          if (e === 1) return []
          const t = Math.floor(e / 7) + 2,
            n = o(e),
            u = n === 145 ? 26 : Math.ceil((n - 13) / (2 * t - 2)) * 2,
            s = [n - 7]
          for (let a = 1; a < t - 1; a++) s[a] = s[a - 1] - u
          return (s.push(6), s.reverse())
        }),
          (r.getPositions = function (e) {
            const t = [],
              n = r.getRowColCoords(e),
              u = n.length
            for (let s = 0; s < u; s++)
              for (let a = 0; a < u; a++) (s === 0 && a === 0) || (s === 0 && a === u - 1) || (s === u - 1 && a === 0) || t.push([n[s], n[a]])
            return t
          }))
      })(x)),
    x
  )
}
var $ = {},
  It
function se() {
  if (It) return $
  It = 1
  const r = D().getSymbolSize,
    o = 7
  return (
    ($.getPositions = function (e) {
      const t = r(e)
      return [
        [0, 0],
        [t - o, 0],
        [0, t - o]
      ]
    }),
    $
  )
}
var tt = {},
  Tt
function ae() {
  return (
    Tt ||
      ((Tt = 1),
      (function (r) {
        r.Patterns = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 }
        const o = { N1: 3, N2: 3, N3: 40, N4: 10 }
        ;((r.isValid = function (t) {
          return t != null && t !== '' && !isNaN(t) && t >= 0 && t <= 7
        }),
          (r.from = function (t) {
            return r.isValid(t) ? parseInt(t, 10) : void 0
          }),
          (r.getPenaltyN1 = function (t) {
            const n = t.size
            let u = 0,
              s = 0,
              a = 0,
              c = null,
              h = null
            for (let B = 0; B < n; B++) {
              ;((s = a = 0), (c = h = null))
              for (let w = 0; w < n; w++) {
                let l = t.get(B, w)
                ;(l === c ? s++ : (s >= 5 && (u += o.N1 + (s - 5)), (c = l), (s = 1)),
                  (l = t.get(w, B)),
                  l === h ? a++ : (a >= 5 && (u += o.N1 + (a - 5)), (h = l), (a = 1)))
              }
              ;(s >= 5 && (u += o.N1 + (s - 5)), a >= 5 && (u += o.N1 + (a - 5)))
            }
            return u
          }),
          (r.getPenaltyN2 = function (t) {
            const n = t.size
            let u = 0
            for (let s = 0; s < n - 1; s++)
              for (let a = 0; a < n - 1; a++) {
                const c = t.get(s, a) + t.get(s, a + 1) + t.get(s + 1, a) + t.get(s + 1, a + 1)
                ;(c === 4 || c === 0) && u++
              }
            return u * o.N2
          }),
          (r.getPenaltyN3 = function (t) {
            const n = t.size
            let u = 0,
              s = 0,
              a = 0
            for (let c = 0; c < n; c++) {
              s = a = 0
              for (let h = 0; h < n; h++)
                ((s = ((s << 1) & 2047) | t.get(c, h)),
                  h >= 10 && (s === 1488 || s === 93) && u++,
                  (a = ((a << 1) & 2047) | t.get(h, c)),
                  h >= 10 && (a === 1488 || a === 93) && u++)
            }
            return u * o.N3
          }),
          (r.getPenaltyN4 = function (t) {
            let n = 0
            const u = t.data.length
            for (let s = 0; s < u; s++) n += t.data[s]
            return Math.abs(Math.ceil((n * 100) / u / 5) - 10) * o.N4
          }))
        function i(e, t, n) {
          switch (e) {
            case r.Patterns.PATTERN000:
              return (t + n) % 2 === 0
            case r.Patterns.PATTERN001:
              return t % 2 === 0
            case r.Patterns.PATTERN010:
              return n % 3 === 0
            case r.Patterns.PATTERN011:
              return (t + n) % 3 === 0
            case r.Patterns.PATTERN100:
              return (Math.floor(t / 2) + Math.floor(n / 3)) % 2 === 0
            case r.Patterns.PATTERN101:
              return ((t * n) % 2) + ((t * n) % 3) === 0
            case r.Patterns.PATTERN110:
              return (((t * n) % 2) + ((t * n) % 3)) % 2 === 0
            case r.Patterns.PATTERN111:
              return (((t * n) % 3) + ((t + n) % 2)) % 2 === 0
            default:
              throw new Error('bad maskPattern:' + e)
          }
        }
        ;((r.applyMask = function (t, n) {
          const u = n.size
          for (let s = 0; s < u; s++) for (let a = 0; a < u; a++) n.isReserved(a, s) || n.xor(a, s, i(t, a, s))
        }),
          (r.getBestMask = function (t, n) {
            const u = Object.keys(r.Patterns).length
            let s = 0,
              a = 1 / 0
            for (let c = 0; c < u; c++) {
              ;(n(c), r.applyMask(c, t))
              const h = r.getPenaltyN1(t) + r.getPenaltyN2(t) + r.getPenaltyN3(t) + r.getPenaltyN4(t)
              ;(r.applyMask(c, t), h < a && ((a = h), (s = c)))
            }
            return s
          }))
      })(tt)),
    tt
  )
}
var H = {},
  Mt
function Wt() {
  if (Mt) return H
  Mt = 1
  const r = wt(),
    o = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10,
      11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17,
      23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31,
      43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49,
      68, 81
    ],
    i = [
      7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110,
      160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408,
      480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900,
      300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200,
      1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980,
      630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430
    ]
  return (
    (H.getBlocksCount = function (t, n) {
      switch (n) {
        case r.L:
          return o[(t - 1) * 4 + 0]
        case r.M:
          return o[(t - 1) * 4 + 1]
        case r.Q:
          return o[(t - 1) * 4 + 2]
        case r.H:
          return o[(t - 1) * 4 + 3]
        default:
          return
      }
    }),
    (H.getTotalCodewordsCount = function (t, n) {
      switch (n) {
        case r.L:
          return i[(t - 1) * 4 + 0]
        case r.M:
          return i[(t - 1) * 4 + 1]
        case r.Q:
          return i[(t - 1) * 4 + 2]
        case r.H:
          return i[(t - 1) * 4 + 3]
        default:
          return
      }
    }),
    H
  )
}
var et = {},
  V = {},
  bt
function ce() {
  if (bt) return V
  bt = 1
  const r = new Uint8Array(512),
    o = new Uint8Array(256)
  return (
    (function () {
      let e = 1
      for (let t = 0; t < 255; t++) ((r[t] = e), (o[e] = t), (e <<= 1), e & 256 && (e ^= 285))
      for (let t = 255; t < 512; t++) r[t] = r[t - 255]
    })(),
    (V.log = function (e) {
      if (e < 1) throw new Error('log(' + e + ')')
      return o[e]
    }),
    (V.exp = function (e) {
      return r[e]
    }),
    (V.mul = function (e, t) {
      return e === 0 || t === 0 ? 0 : r[o[e] + o[t]]
    }),
    V
  )
}
var St
function fe() {
  return (
    St ||
      ((St = 1),
      (function (r) {
        const o = ce()
        ;((r.mul = function (e, t) {
          const n = new Uint8Array(e.length + t.length - 1)
          for (let u = 0; u < e.length; u++) for (let s = 0; s < t.length; s++) n[u + s] ^= o.mul(e[u], t[s])
          return n
        }),
          (r.mod = function (e, t) {
            let n = new Uint8Array(e)
            for (; n.length - t.length >= 0; ) {
              const u = n[0]
              for (let a = 0; a < t.length; a++) n[a] ^= o.mul(t[a], u)
              let s = 0
              for (; s < n.length && n[s] === 0; ) s++
              n = n.slice(s)
            }
            return n
          }),
          (r.generateECPolynomial = function (e) {
            let t = new Uint8Array([1])
            for (let n = 0; n < e; n++) t = r.mul(t, new Uint8Array([1, o.exp(n)]))
            return t
          }))
      })(et)),
    et
  )
}
var nt, Lt
function le() {
  if (Lt) return nt
  Lt = 1
  const r = fe()
  function o(i) {
    ;((this.genPoly = void 0), (this.degree = i), this.degree && this.initialize(this.degree))
  }
  return (
    (o.prototype.initialize = function (e) {
      ;((this.degree = e), (this.genPoly = r.generateECPolynomial(this.degree)))
    }),
    (o.prototype.encode = function (e) {
      if (!this.genPoly) throw new Error('Encoder not initialized')
      const t = new Uint8Array(e.length + this.degree)
      t.set(e)
      const n = r.mod(t, this.genPoly),
        u = this.degree - n.length
      if (u > 0) {
        const s = new Uint8Array(this.degree)
        return (s.set(n, u), s)
      }
      return n
    }),
    (nt = o),
    nt
  )
}
var rt = {},
  ot = {},
  it = {},
  vt
function Zt() {
  return (
    vt ||
      ((vt = 1),
      (it.isValid = function (o) {
        return !isNaN(o) && o >= 1 && o <= 40
      })),
    it
  )
}
var L = {},
  qt
function Xt() {
  if (qt) return L
  qt = 1
  const r = '[0-9]+',
    o = '[A-Z $%*+\\-./:]+'
  let i =
    '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+'
  i = i.replace(/u/g, '\\u')
  const e =
    '(?:(?![A-Z0-9 $%*+\\-./:]|' +
    i +
    `)(?:.|[\r
]))+`
  ;((L.KANJI = new RegExp(i, 'g')),
    (L.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g')),
    (L.BYTE = new RegExp(e, 'g')),
    (L.NUMERIC = new RegExp(r, 'g')),
    (L.ALPHANUMERIC = new RegExp(o, 'g')))
  const t = new RegExp('^' + i + '$'),
    n = new RegExp('^[0-9]+$'),
    u = new RegExp('^[A-Z0-9 $%*+\\-./:]+$')
  return (
    (L.testKanji = function (a) {
      return t.test(a)
    }),
    (L.testNumeric = function (a) {
      return n.test(a)
    }),
    (L.testAlphanumeric = function (a) {
      return u.test(a)
    }),
    L
  )
}
var _t
function U() {
  return (
    _t ||
      ((_t = 1),
      (function (r) {
        const o = Zt(),
          i = Xt()
        ;((r.NUMERIC = { id: 'Numeric', bit: 1, ccBits: [10, 12, 14] }),
          (r.ALPHANUMERIC = { id: 'Alphanumeric', bit: 2, ccBits: [9, 11, 13] }),
          (r.BYTE = { id: 'Byte', bit: 4, ccBits: [8, 16, 16] }),
          (r.KANJI = { id: 'Kanji', bit: 8, ccBits: [8, 10, 12] }),
          (r.MIXED = { bit: -1 }),
          (r.getCharCountIndicator = function (n, u) {
            if (!n.ccBits) throw new Error('Invalid mode: ' + n)
            if (!o.isValid(u)) throw new Error('Invalid version: ' + u)
            return u >= 1 && u < 10 ? n.ccBits[0] : u < 27 ? n.ccBits[1] : n.ccBits[2]
          }),
          (r.getBestModeForData = function (n) {
            return i.testNumeric(n) ? r.NUMERIC : i.testAlphanumeric(n) ? r.ALPHANUMERIC : i.testKanji(n) ? r.KANJI : r.BYTE
          }),
          (r.toString = function (n) {
            if (n && n.id) return n.id
            throw new Error('Invalid mode')
          }),
          (r.isValid = function (n) {
            return n && n.bit && n.ccBits
          }))
        function e(t) {
          if (typeof t != 'string') throw new Error('Param is not a string')
          switch (t.toLowerCase()) {
            case 'numeric':
              return r.NUMERIC
            case 'alphanumeric':
              return r.ALPHANUMERIC
            case 'kanji':
              return r.KANJI
            case 'byte':
              return r.BYTE
            default:
              throw new Error('Unknown mode: ' + t)
          }
        }
        r.from = function (n, u) {
          if (r.isValid(n)) return n
          try {
            return e(n)
          } catch {
            return u
          }
        }
      })(ot)),
    ot
  )
}
var Dt
function ge() {
  return (
    Dt ||
      ((Dt = 1),
      (function (r) {
        const o = D(),
          i = Wt(),
          e = wt(),
          t = U(),
          n = Zt(),
          u = 7973,
          s = o.getBCHDigit(u)
        function a(w, l, N) {
          for (let I = 1; I <= 40; I++) if (l <= r.getCapacity(I, N, w)) return I
        }
        function c(w, l) {
          return t.getCharCountIndicator(w, l) + 4
        }
        function h(w, l) {
          let N = 0
          return (
            w.forEach(function (I) {
              const S = c(I.mode, l)
              N += S + I.getBitsLength()
            }),
            N
          )
        }
        function B(w, l) {
          for (let N = 1; N <= 40; N++) if (h(w, N) <= r.getCapacity(N, l, t.MIXED)) return N
        }
        ;((r.from = function (l, N) {
          return n.isValid(l) ? parseInt(l, 10) : N
        }),
          (r.getCapacity = function (l, N, I) {
            if (!n.isValid(l)) throw new Error('Invalid QR Code version')
            typeof I > 'u' && (I = t.BYTE)
            const S = (o.getSymbolTotalCodewords(l) - i.getTotalCodewordsCount(l, N)) * 8
            if (I === t.MIXED) return S
            const y = S - c(I, l)
            switch (I) {
              case t.NUMERIC:
                return Math.floor((y / 10) * 3)
              case t.ALPHANUMERIC:
                return Math.floor((y / 11) * 2)
              case t.KANJI:
                return Math.floor(y / 13)
              case t.BYTE:
              default:
                return Math.floor(y / 8)
            }
          }),
          (r.getBestVersionForData = function (l, N) {
            let I
            const S = e.from(N, e.M)
            if (Array.isArray(l)) {
              if (l.length > 1) return B(l, S)
              if (l.length === 0) return 1
              I = l[0]
            } else I = l
            return a(I.mode, I.getLength(), S)
          }),
          (r.getEncodedBits = function (l) {
            if (!n.isValid(l) || l < 7) throw new Error('Invalid QR Code version')
            let N = l << 12
            for (; o.getBCHDigit(N) - s >= 0; ) N ^= u << (o.getBCHDigit(N) - s)
            return (l << 12) | N
          }))
      })(rt)),
    rt
  )
}
var ut = {},
  Ut
function de() {
  if (Ut) return ut
  Ut = 1
  const r = D(),
    o = 1335,
    i = 21522,
    e = r.getBCHDigit(o)
  return (
    (ut.getEncodedBits = function (n, u) {
      const s = (n.bit << 3) | u
      let a = s << 10
      for (; r.getBCHDigit(a) - e >= 0; ) a ^= o << (r.getBCHDigit(a) - e)
      return ((s << 10) | a) ^ i
    }),
    ut
  )
}
var st = {},
  at,
  kt
function he() {
  if (kt) return at
  kt = 1
  const r = U()
  function o(i) {
    ;((this.mode = r.NUMERIC), (this.data = i.toString()))
  }
  return (
    (o.getBitsLength = function (e) {
      return 10 * Math.floor(e / 3) + (e % 3 ? (e % 3) * 3 + 1 : 0)
    }),
    (o.prototype.getLength = function () {
      return this.data.length
    }),
    (o.prototype.getBitsLength = function () {
      return o.getBitsLength(this.data.length)
    }),
    (o.prototype.write = function (e) {
      let t, n, u
      for (t = 0; t + 3 <= this.data.length; t += 3) ((n = this.data.substr(t, 3)), (u = parseInt(n, 10)), e.put(u, 10))
      const s = this.data.length - t
      s > 0 && ((n = this.data.substr(t)), (u = parseInt(n, 10)), e.put(u, s * 3 + 1))
    }),
    (at = o),
    at
  )
}
var ct, Ft
function me() {
  if (Ft) return ct
  Ft = 1
  const r = U(),
    o = [
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
      ' ',
      '$',
      '%',
      '*',
      '+',
      '-',
      '.',
      '/',
      ':'
    ]
  function i(e) {
    ;((this.mode = r.ALPHANUMERIC), (this.data = e))
  }
  return (
    (i.getBitsLength = function (t) {
      return 11 * Math.floor(t / 2) + 6 * (t % 2)
    }),
    (i.prototype.getLength = function () {
      return this.data.length
    }),
    (i.prototype.getBitsLength = function () {
      return i.getBitsLength(this.data.length)
    }),
    (i.prototype.write = function (t) {
      let n
      for (n = 0; n + 2 <= this.data.length; n += 2) {
        let u = o.indexOf(this.data[n]) * 45
        ;((u += o.indexOf(this.data[n + 1])), t.put(u, 11))
      }
      this.data.length % 2 && t.put(o.indexOf(this.data[n]), 6)
    }),
    (ct = i),
    ct
  )
}
var ft, zt
function we() {
  if (zt) return ft
  zt = 1
  const r = U()
  function o(i) {
    ;((this.mode = r.BYTE), typeof i == 'string' ? (this.data = new TextEncoder().encode(i)) : (this.data = new Uint8Array(i)))
  }
  return (
    (o.getBitsLength = function (e) {
      return e * 8
    }),
    (o.prototype.getLength = function () {
      return this.data.length
    }),
    (o.prototype.getBitsLength = function () {
      return o.getBitsLength(this.data.length)
    }),
    (o.prototype.write = function (i) {
      for (let e = 0, t = this.data.length; e < t; e++) i.put(this.data[e], 8)
    }),
    (ft = o),
    ft
  )
}
var lt, Vt
function ye() {
  if (Vt) return lt
  Vt = 1
  const r = U(),
    o = D()
  function i(e) {
    ;((this.mode = r.KANJI), (this.data = e))
  }
  return (
    (i.getBitsLength = function (t) {
      return t * 13
    }),
    (i.prototype.getLength = function () {
      return this.data.length
    }),
    (i.prototype.getBitsLength = function () {
      return i.getBitsLength(this.data.length)
    }),
    (i.prototype.write = function (e) {
      let t
      for (t = 0; t < this.data.length; t++) {
        let n = o.toSJIS(this.data[t])
        if (n >= 33088 && n <= 40956) n -= 33088
        else if (n >= 57408 && n <= 60351) n -= 49472
        else
          throw new Error(
            'Invalid SJIS character: ' +
              this.data[t] +
              `
Make sure your charset is UTF-8`
          )
        ;((n = ((n >>> 8) & 255) * 192 + (n & 255)), e.put(n, 13))
      }
    }),
    (lt = i),
    lt
  )
}
var gt = { exports: {} },
  Kt
function Ee() {
  return (
    Kt ||
      ((Kt = 1),
      (function (r) {
        var o = {
          single_source_shortest_paths: function (i, e, t) {
            var n = {},
              u = {}
            u[e] = 0
            var s = o.PriorityQueue.make()
            s.push(e, 0)
            for (var a, c, h, B, w, l, N, I, S; !s.empty(); ) {
              ;((a = s.pop()), (c = a.value), (B = a.cost), (w = i[c] || {}))
              for (h in w)
                w.hasOwnProperty(h) &&
                  ((l = w[h]), (N = B + l), (I = u[h]), (S = typeof u[h] > 'u'), (S || I > N) && ((u[h] = N), s.push(h, N), (n[h] = c)))
            }
            if (typeof t < 'u' && typeof u[t] > 'u') {
              var y = ['Could not find a path from ', e, ' to ', t, '.'].join('')
              throw new Error(y)
            }
            return n
          },
          extract_shortest_path_from_predecessor_list: function (i, e) {
            for (var t = [], n = e; n; ) (t.push(n), i[n], (n = i[n]))
            return (t.reverse(), t)
          },
          find_path: function (i, e, t) {
            var n = o.single_source_shortest_paths(i, e, t)
            return o.extract_shortest_path_from_predecessor_list(n, t)
          },
          PriorityQueue: {
            make: function (i) {
              var e = o.PriorityQueue,
                t = {},
                n
              i = i || {}
              for (n in e) e.hasOwnProperty(n) && (t[n] = e[n])
              return ((t.queue = []), (t.sorter = i.sorter || e.default_sorter), t)
            },
            default_sorter: function (i, e) {
              return i.cost - e.cost
            },
            push: function (i, e) {
              var t = { value: i, cost: e }
              ;(this.queue.push(t), this.queue.sort(this.sorter))
            },
            pop: function () {
              return this.queue.shift()
            },
            empty: function () {
              return this.queue.length === 0
            }
          }
        }
        r.exports = o
      })(gt)),
    gt.exports
  )
}
var Ht
function Ce() {
  return (
    Ht ||
      ((Ht = 1),
      (function (r) {
        const o = U(),
          i = he(),
          e = me(),
          t = we(),
          n = ye(),
          u = Xt(),
          s = D(),
          a = Ee()
        function c(y) {
          return unescape(encodeURIComponent(y)).length
        }
        function h(y, T, P) {
          const E = []
          let b
          for (; (b = y.exec(P)) !== null; ) E.push({ data: b[0], index: b.index, mode: T, length: b[0].length })
          return E
        }
        function B(y) {
          const T = h(u.NUMERIC, o.NUMERIC, y),
            P = h(u.ALPHANUMERIC, o.ALPHANUMERIC, y)
          let E, b
          return (
            s.isKanjiModeEnabled() ? ((E = h(u.BYTE, o.BYTE, y)), (b = h(u.KANJI, o.KANJI, y))) : ((E = h(u.BYTE_KANJI, o.BYTE, y)), (b = [])),
            T.concat(P, E, b)
              .sort(function (f, A) {
                return f.index - A.index
              })
              .map(function (f) {
                return { data: f.data, mode: f.mode, length: f.length }
              })
          )
        }
        function w(y, T) {
          switch (T) {
            case o.NUMERIC:
              return i.getBitsLength(y)
            case o.ALPHANUMERIC:
              return e.getBitsLength(y)
            case o.KANJI:
              return n.getBitsLength(y)
            case o.BYTE:
              return t.getBitsLength(y)
          }
        }
        function l(y) {
          return y.reduce(function (T, P) {
            const E = T.length - 1 >= 0 ? T[T.length - 1] : null
            return E && E.mode === P.mode ? ((T[T.length - 1].data += P.data), T) : (T.push(P), T)
          }, [])
        }
        function N(y) {
          const T = []
          for (let P = 0; P < y.length; P++) {
            const E = y[P]
            switch (E.mode) {
              case o.NUMERIC:
                T.push([E, { data: E.data, mode: o.ALPHANUMERIC, length: E.length }, { data: E.data, mode: o.BYTE, length: E.length }])
                break
              case o.ALPHANUMERIC:
                T.push([E, { data: E.data, mode: o.BYTE, length: E.length }])
                break
              case o.KANJI:
                T.push([E, { data: E.data, mode: o.BYTE, length: c(E.data) }])
                break
              case o.BYTE:
                T.push([{ data: E.data, mode: o.BYTE, length: c(E.data) }])
            }
          }
          return T
        }
        function I(y, T) {
          const P = {},
            E = { start: {} }
          let b = ['start']
          for (let f = 0; f < y.length; f++) {
            const A = y[f],
              R = []
            for (let m = 0; m < A.length; m++) {
              const C = A[m],
                g = '' + f + m
              ;(R.push(g), (P[g] = { node: C, lastCount: 0 }), (E[g] = {}))
              for (let p = 0; p < b.length; p++) {
                const d = b[p]
                P[d] && P[d].node.mode === C.mode
                  ? ((E[d][g] = w(P[d].lastCount + C.length, C.mode) - w(P[d].lastCount, C.mode)), (P[d].lastCount += C.length))
                  : (P[d] && (P[d].lastCount = C.length), (E[d][g] = w(C.length, C.mode) + 4 + o.getCharCountIndicator(C.mode, T)))
              }
            }
            b = R
          }
          for (let f = 0; f < b.length; f++) E[b[f]].end = 0
          return { map: E, table: P }
        }
        function S(y, T) {
          let P
          const E = o.getBestModeForData(y)
          if (((P = o.from(T, E)), P !== o.BYTE && P.bit < E.bit))
            throw new Error(
              '"' +
                y +
                '" cannot be encoded with mode ' +
                o.toString(P) +
                `.
 Suggested mode is: ` +
                o.toString(E)
            )
          switch ((P === o.KANJI && !s.isKanjiModeEnabled() && (P = o.BYTE), P)) {
            case o.NUMERIC:
              return new i(y)
            case o.ALPHANUMERIC:
              return new e(y)
            case o.KANJI:
              return new n(y)
            case o.BYTE:
              return new t(y)
          }
        }
        ;((r.fromArray = function (T) {
          return T.reduce(function (P, E) {
            return (typeof E == 'string' ? P.push(S(E, null)) : E.data && P.push(S(E.data, E.mode)), P)
          }, [])
        }),
          (r.fromString = function (T, P) {
            const E = I(N(B(T, s.isKanjiModeEnabled())), P),
              b = a.find_path(E.map, 'start', 'end'),
              f = []
            for (let A = 1; A < b.length - 1; A++) f.push(E.table[b[A]].node)
            return r.fromArray(l(f))
          }),
          (r.rawSplit = function (T) {
            return r.fromArray(B(T, s.isKanjiModeEnabled()))
          }))
      })(st)),
    st
  )
}
var Jt
function pe() {
  if (Jt) return Q
  Jt = 1
  const r = D(),
    o = wt(),
    i = oe(),
    e = ie(),
    t = ue(),
    n = se(),
    u = ae(),
    s = Wt(),
    a = le(),
    c = ge(),
    h = de(),
    B = U(),
    w = Ce()
  function l(f, A) {
    const R = f.size,
      m = n.getPositions(A)
    for (let C = 0; C < m.length; C++) {
      const g = m[C][0],
        p = m[C][1]
      for (let d = -1; d <= 7; d++)
        if (!(g + d <= -1 || R <= g + d))
          for (let M = -1; M <= 7; M++)
            p + M <= -1 ||
              R <= p + M ||
              ((d >= 0 && d <= 6 && (M === 0 || M === 6)) || (M >= 0 && M <= 6 && (d === 0 || d === 6)) || (d >= 2 && d <= 4 && M >= 2 && M <= 4)
                ? f.set(g + d, p + M, !0, !0)
                : f.set(g + d, p + M, !1, !0))
    }
  }
  function N(f) {
    const A = f.size
    for (let R = 8; R < A - 8; R++) {
      const m = R % 2 === 0
      ;(f.set(R, 6, m, !0), f.set(6, R, m, !0))
    }
  }
  function I(f, A) {
    const R = t.getPositions(A)
    for (let m = 0; m < R.length; m++) {
      const C = R[m][0],
        g = R[m][1]
      for (let p = -2; p <= 2; p++)
        for (let d = -2; d <= 2; d++)
          p === -2 || p === 2 || d === -2 || d === 2 || (p === 0 && d === 0) ? f.set(C + p, g + d, !0, !0) : f.set(C + p, g + d, !1, !0)
    }
  }
  function S(f, A) {
    const R = f.size,
      m = c.getEncodedBits(A)
    let C, g, p
    for (let d = 0; d < 18; d++)
      ((C = Math.floor(d / 3)), (g = (d % 3) + R - 8 - 3), (p = ((m >> d) & 1) === 1), f.set(C, g, p, !0), f.set(g, C, p, !0))
  }
  function y(f, A, R) {
    const m = f.size,
      C = h.getEncodedBits(A, R)
    let g, p
    for (g = 0; g < 15; g++)
      ((p = ((C >> g) & 1) === 1),
        g < 6 ? f.set(g, 8, p, !0) : g < 8 ? f.set(g + 1, 8, p, !0) : f.set(m - 15 + g, 8, p, !0),
        g < 8 ? f.set(8, m - g - 1, p, !0) : g < 9 ? f.set(8, 15 - g - 1 + 1, p, !0) : f.set(8, 15 - g - 1, p, !0))
    f.set(m - 8, 8, 1, !0)
  }
  function T(f, A) {
    const R = f.size
    let m = -1,
      C = R - 1,
      g = 7,
      p = 0
    for (let d = R - 1; d > 0; d -= 2)
      for (d === 6 && d--; ; ) {
        for (let M = 0; M < 2; M++)
          if (!f.isReserved(C, d - M)) {
            let k = !1
            ;(p < A.length && (k = ((A[p] >>> g) & 1) === 1), f.set(C, d - M, k), g--, g === -1 && (p++, (g = 7)))
          }
        if (((C += m), C < 0 || R <= C)) {
          ;((C -= m), (m = -m))
          break
        }
      }
  }
  function P(f, A, R) {
    const m = new i()
    R.forEach(function (p) {
      ;(m.put(p.mode.bit, 4), m.put(p.getLength(), B.getCharCountIndicator(p.mode, f)), p.write(m))
    })
    const C = (r.getSymbolTotalCodewords(f) - s.getTotalCodewordsCount(f, A)) * 8
    for (m.getLengthInBits() + 4 <= C && m.put(0, 4); m.getLengthInBits() % 8 !== 0; ) m.putBit(0)
    const g = (C - m.getLengthInBits()) / 8
    for (let p = 0; p < g; p++) m.put(p % 2 ? 17 : 236, 8)
    return E(m, f, A)
  }
  function E(f, A, R) {
    const m = r.getSymbolTotalCodewords(A),
      C = m - s.getTotalCodewordsCount(A, R),
      g = s.getBlocksCount(A, R),
      p = g - (m % g),
      d = Math.floor(m / g),
      M = Math.floor(C / g),
      k = M + 1,
      yt = d - M,
      $t = new a(yt)
    let J = 0
    const K = new Array(g),
      Et = new Array(g)
    let O = 0
    const te = new Uint8Array(f.buffer)
    for (let F = 0; F < g; F++) {
      const Y = F < p ? M : k
      ;((K[F] = te.slice(J, J + Y)), (Et[F] = $t.encode(K[F])), (J += Y), (O = Math.max(O, Y)))
    }
    const j = new Uint8Array(m)
    let Ct = 0,
      v,
      q
    for (v = 0; v < O; v++) for (q = 0; q < g; q++) v < K[q].length && (j[Ct++] = K[q][v])
    for (v = 0; v < yt; v++) for (q = 0; q < g; q++) j[Ct++] = Et[q][v]
    return j
  }
  function b(f, A, R, m) {
    let C
    if (Array.isArray(f)) C = w.fromArray(f)
    else if (typeof f == 'string') {
      let M = A
      if (!M) {
        const k = w.rawSplit(f)
        M = c.getBestVersionForData(k, R)
      }
      C = w.fromString(f, M || 40)
    } else throw new Error('Invalid data')
    const g = c.getBestVersionForData(C, R)
    if (!g) throw new Error('The amount of data is too big to be stored in a QR Code')
    if (!A) A = g
    else if (A < g)
      throw new Error(
        `
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` +
          g +
          `.
`
      )
    const p = P(A, R, C),
      d = new e(r.getSymbolSize(A))
    return (
      l(d, A),
      N(d),
      I(d, A),
      y(d, R, 0),
      A >= 7 && S(d, A),
      T(d, p),
      isNaN(m) && (m = u.getBestMask(d, y.bind(null, d, R))),
      u.applyMask(m, d),
      y(d, R, m),
      { modules: d, version: A, errorCorrectionLevel: R, maskPattern: m, segments: C }
    )
  }
  return (
    (Q.create = function (A, R) {
      if (typeof A > 'u' || A === '') throw new Error('No input text')
      let m = o.M,
        C,
        g
      return (
        typeof R < 'u' &&
          ((m = o.from(R.errorCorrectionLevel, o.M)),
          (C = c.from(R.version)),
          (g = u.from(R.maskPattern)),
          R.toSJISFunc && r.setToSJISFunction(R.toSJISFunc)),
        b(A, C, m, g)
      )
    }),
    Q
  )
}
var dt = {},
  ht = {},
  Ot
function xt() {
  return (
    Ot ||
      ((Ot = 1),
      (function (r) {
        function o(i) {
          if ((typeof i == 'number' && (i = i.toString()), typeof i != 'string')) throw new Error('Color should be defined as hex string')
          let e = i.slice().replace('#', '').split('')
          if (e.length < 3 || e.length === 5 || e.length > 8) throw new Error('Invalid hex color: ' + i)
          ;((e.length === 3 || e.length === 4) &&
            (e = Array.prototype.concat.apply(
              [],
              e.map(function (n) {
                return [n, n]
              })
            )),
            e.length === 6 && e.push('F', 'F'))
          const t = parseInt(e.join(''), 16)
          return { r: (t >> 24) & 255, g: (t >> 16) & 255, b: (t >> 8) & 255, a: t & 255, hex: '#' + e.slice(0, 6).join('') }
        }
        ;((r.getOptions = function (e) {
          ;(e || (e = {}), e.color || (e.color = {}))
          const t = typeof e.margin > 'u' || e.margin === null || e.margin < 0 ? 4 : e.margin,
            n = e.width && e.width >= 21 ? e.width : void 0,
            u = e.scale || 4
          return {
            width: n,
            scale: n ? 4 : u,
            margin: t,
            color: { dark: o(e.color.dark || '#000000ff'), light: o(e.color.light || '#ffffffff') },
            type: e.type,
            rendererOpts: e.rendererOpts || {}
          }
        }),
          (r.getScale = function (e, t) {
            return t.width && t.width >= e + t.margin * 2 ? t.width / (e + t.margin * 2) : t.scale
          }),
          (r.getImageWidth = function (e, t) {
            const n = r.getScale(e, t)
            return Math.floor((e + t.margin * 2) * n)
          }),
          (r.qrToImageData = function (e, t, n) {
            const u = t.modules.size,
              s = t.modules.data,
              a = r.getScale(u, n),
              c = Math.floor((u + n.margin * 2) * a),
              h = n.margin * a,
              B = [n.color.light, n.color.dark]
            for (let w = 0; w < c; w++)
              for (let l = 0; l < c; l++) {
                let N = (w * c + l) * 4,
                  I = n.color.light
                if (w >= h && l >= h && w < c - h && l < c - h) {
                  const S = Math.floor((w - h) / a),
                    y = Math.floor((l - h) / a)
                  I = B[s[S * u + y] ? 1 : 0]
                }
                ;((e[N++] = I.r), (e[N++] = I.g), (e[N++] = I.b), (e[N] = I.a))
              }
          }))
      })(ht)),
    ht
  )
}
var jt
function Be() {
  return (
    jt ||
      ((jt = 1),
      (function (r) {
        const o = xt()
        function i(t, n, u) {
          ;(t.clearRect(0, 0, n.width, n.height),
            n.style || (n.style = {}),
            (n.height = u),
            (n.width = u),
            (n.style.height = u + 'px'),
            (n.style.width = u + 'px'))
        }
        function e() {
          try {
            return document.createElement('canvas')
          } catch {
            throw new Error('You need to specify a canvas element')
          }
        }
        ;((r.render = function (n, u, s) {
          let a = s,
            c = u
          ;(typeof a > 'u' && (!u || !u.getContext) && ((a = u), (u = void 0)), u || (c = e()), (a = o.getOptions(a)))
          const h = o.getImageWidth(n.modules.size, a),
            B = c.getContext('2d'),
            w = B.createImageData(h, h)
          return (o.qrToImageData(w.data, n, a), i(B, c, h), B.putImageData(w, 0, 0), c)
        }),
          (r.renderToDataURL = function (n, u, s) {
            let a = s
            ;(typeof a > 'u' && (!u || !u.getContext) && ((a = u), (u = void 0)), a || (a = {}))
            const c = r.render(n, u, a),
              h = a.type || 'image/png',
              B = a.rendererOpts || {}
            return c.toDataURL(h, B.quality)
          }))
      })(dt)),
    dt
  )
}
var mt = {},
  Yt
function Ae() {
  if (Yt) return mt
  Yt = 1
  const r = xt()
  function o(t, n) {
    const u = t.a / 255,
      s = n + '="' + t.hex + '"'
    return u < 1 ? s + ' ' + n + '-opacity="' + u.toFixed(2).slice(1) + '"' : s
  }
  function i(t, n, u) {
    let s = t + n
    return (typeof u < 'u' && (s += ' ' + u), s)
  }
  function e(t, n, u) {
    let s = '',
      a = 0,
      c = !1,
      h = 0
    for (let B = 0; B < t.length; B++) {
      const w = Math.floor(B % n),
        l = Math.floor(B / n)
      ;(!w && !c && (c = !0),
        t[B]
          ? (h++,
            (B > 0 && w > 0 && t[B - 1]) || ((s += c ? i('M', w + u, 0.5 + l + u) : i('m', a, 0)), (a = 0), (c = !1)),
            (w + 1 < n && t[B + 1]) || ((s += i('h', h)), (h = 0)))
          : a++)
    }
    return s
  }
  return (
    (mt.render = function (n, u, s) {
      const a = r.getOptions(u),
        c = n.modules.size,
        h = n.modules.data,
        B = c + a.margin * 2,
        w = a.color.light.a ? '<path ' + o(a.color.light, 'fill') + ' d="M0 0h' + B + 'v' + B + 'H0z"/>' : '',
        l = '<path ' + o(a.color.dark, 'stroke') + ' d="' + e(h, c, a.margin) + '"/>',
        N = 'viewBox="0 0 ' + B + ' ' + B + '"',
        I =
          '<svg xmlns="http://www.w3.org/2000/svg" ' +
          (a.width ? 'width="' + a.width + '" height="' + a.width + '" ' : '') +
          N +
          ' shape-rendering="crispEdges">' +
          w +
          l +
          `</svg>
`
      return (typeof s == 'function' && s(null, I), I)
    }),
    mt
  )
}
var Gt
function Re() {
  if (Gt) return z
  Gt = 1
  const r = re(),
    o = pe(),
    i = Be(),
    e = Ae()
  function t(n, u, s, a, c) {
    const h = [].slice.call(arguments, 1),
      B = h.length,
      w = typeof h[B - 1] == 'function'
    if (!w && !r()) throw new Error('Callback required as last argument')
    if (w) {
      if (B < 2) throw new Error('Too few arguments provided')
      B === 2
        ? ((c = s), (s = u), (u = a = void 0))
        : B === 3 && (u.getContext && typeof c > 'u' ? ((c = a), (a = void 0)) : ((c = a), (a = s), (s = u), (u = void 0)))
    } else {
      if (B < 1) throw new Error('Too few arguments provided')
      return (
        B === 1 ? ((s = u), (u = a = void 0)) : B === 2 && !u.getContext && ((a = s), (s = u), (u = void 0)),
        new Promise(function (l, N) {
          try {
            l(n(o.create(s, a), u, a))
          } catch (I) {
            N(I)
          }
        })
      )
    }
    try {
      const l = o.create(s, a)
      c(null, n(l, u, a))
    } catch (l) {
      c(l)
    }
  }
  return (
    (z.create = o.create),
    (z.toCanvas = t.bind(null, i.render)),
    (z.toDataURL = t.bind(null, i.renderToDataURL)),
    (z.toString = t.bind(null, function (n, u, s) {
      return e.render(n, s)
    })),
    z
  )
}
var Qt = Re(),
  Pe = ne({ __proto__: null, default: ee(Qt) }, [Qt])
export { Pe as b }

import { Bn as o, On as r, an as p, it as f, pn as i, rn as n, sr as c, un as _ } from './element-plus-CzL7BOKu.js'
var v = i({
    __name: 'StatusTag',
    props: { value: { type: [String, Number, Boolean] }, options: { default: () => [] }, size: { default: 'small' }, effect: { default: 'light' } },
    setup(a) {
      const e = a,
        s = n(() => e.options.find((t) => t.value === e.value)?.label ?? e.value),
        u = n(() => e.options.find((t) => t.value === e.value)?.type || 'info')
      return (t, d) => {
        const l = f
        return (
          r(),
          p(l, { type: u.value, size: a.size, effect: a.effect }, { default: o(() => [_(c(s.value), 1)]), _: 1 }, 8, ['type', 'size', 'effect'])
        )
      }
    }
  }),
  m = v
export { m as t }

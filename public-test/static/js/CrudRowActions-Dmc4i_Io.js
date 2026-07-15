import { An as c, Bn as _, On as n, an as p, ot as m, pn as f, rn as v, sn as s, sr as y, tn as k, un as b } from './element-plus-CzL7BOKu.js'
import { I as x } from './index-DqMfCNbk.js'
var B = { class: 'crud-row-actions' },
  C = f({
    name: 'CrudRowActions',
    __name: 'index',
    props: { actions: { default: () => [] } },
    emits: ['action'],
    setup(a, { emit: r }) {
      const o = a,
        i = r,
        l = v(() => o.actions.filter((e) => !e.hidden))
      function d(e) {
        return !e || e === 'secondary' ? 'primary' : e
      }
      return (e, h) => {
        const u = m
        return (
          n(),
          s('div', B, [
            (n(!0),
            s(
              k,
              null,
              c(
                l.value,
                (t) => (
                  n(),
                  p(
                    u,
                    { key: t.key, link: '', size: 'small', type: d(t.tone), disabled: t.disabled, onClick: (w) => i('action', t.key) },
                    { default: _(() => [b(y(t.label), 1)]), _: 2 },
                    1032,
                    ['type', 'disabled', 'onClick']
                  )
                )
              ),
              128
            ))
          ])
        )
      }
    }
  }),
  E = x(C, [['__scopeId', 'data-v-69dd4bc6']])
export { E as t }

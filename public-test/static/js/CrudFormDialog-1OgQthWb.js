import { Bn as w, Fn as u, Mn as d, On as r, an as s, jn as y, on as C, pn as F, yn as m } from './element-plus-CzL7BOKu.js'
var V = F({
    name: 'CrudFormDialog',
    __name: 'index',
    props: m(
      {
        title: {},
        columns: { default: () => [] },
        labelWidth: { default: 100 },
        width: { default: void 0 },
        showFooter: { type: Boolean, default: !0 },
        beforeSubmit: { type: Function, default: void 0 }
      },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: m(['submit', 'cancel'], ['update:visible', 'update:form']),
    setup(e, { emit: f }) {
      const n = e,
        o = u(e, 'visible'),
        l = u(e, 'form'),
        i = f
      function c() {
        ;((o.value = !1), i('cancel'))
      }
      async function b() {
        return ((n.beforeSubmit && !(await n.beforeSubmit(l.value))) || i('submit'), !1)
      }
      return (v, t) => {
        const h = d('gi-form'),
          g = d('gi-dialog')
        return (
          r(),
          s(
            g,
            {
              modelValue: o.value,
              'onUpdate:modelValue': t[1] || (t[1] = (a) => (o.value = a)),
              footer: e.showFooter,
              'lock-scroll': !1,
              title: e.title,
              width: e.width,
              'on-before-ok': e.showFooter ? b : void 0,
              'on-cancel': c
            },
            {
              default: w(() => [
                e.columns.length
                  ? (r(),
                    s(
                      h,
                      {
                        key: 0,
                        modelValue: l.value,
                        'onUpdate:modelValue': t[0] || (t[0] = (a) => (l.value = a)),
                        columns: e.columns,
                        'label-width': e.labelWidth
                      },
                      null,
                      8,
                      ['modelValue', 'columns', 'label-width']
                    ))
                  : C('', !0),
                y(v.$slots, 'default')
              ]),
              _: 3
            },
            8,
            ['modelValue', 'footer', 'title', 'width', 'on-before-ok']
          )
        )
      }
    }
  }),
  p = V
export { p as t }

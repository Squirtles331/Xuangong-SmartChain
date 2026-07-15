import {
  An as v,
  Bn as t,
  F as L,
  Mn as U,
  On as l,
  Tn as $,
  Xn as i,
  an as f,
  dn as n,
  ht as z,
  i as d,
  in as r,
  mt as A,
  nt as D,
  on as O,
  or as T,
  ot as P,
  pn as Q,
  rt as W,
  sn as _,
  sr as w,
  tn as g,
  tt as X,
  un as x
} from './element-plus-CzL7BOKu.js'
import { I as j } from './index-DqMfCNbk.js'
import { f as q } from './wms-TgZ5oe41.js'
var G = { class: 'barcode-grid' },
  H = { class: 'barcode-lines' },
  J = { class: 'barcode-text' },
  K = { class: 'barcode-info' },
  R = Q({
    __name: 'index',
    setup(Y) {
      const c = i([]),
        s = i(''),
        p = i(1),
        u = i([])
      function C() {
        if (!s.value) {
          d.warning('请先选择物料')
          return
        }
        const o = c.value.find((a) => a.id === s.value)
        o &&
          (u.value = Array.from({ length: p.value }, () => ({
            barcode: `BC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            name: o.name
          })))
      }
      function V(o) {
        return [2, 3, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 2, 1, 3, 1, 2, 3][o - 1] || 2
      }
      function k() {
        if (!u.value.length) {
          d.warning('请先生成条码预览')
          return
        }
        ;(window.print(), d.success('条码打印任务已发送'))
      }
      async function B() {
        try {
          c.value = (await q({ pageNum: 1, pageSize: 200 })).data.list
        } catch {
          d.error('获取物料列表失败')
        }
      }
      return (
        $(() => {
          B()
        }),
        (o, a) => {
          const b = P,
            E = D,
            M = W,
            m = z,
            N = L,
            S = A,
            y = X,
            F = U('gi-page-layout')
          return (
            l(),
            f(F, null, {
              tool: t(() => [n(b, { type: 'primary', onClick: k }, { default: t(() => [...(a[2] || (a[2] = [x('打印', -1)]))]), _: 1 })]),
              default: t(() => [
                n(
                  y,
                  { shadow: 'never', style: { 'margin-bottom': '16px' } },
                  {
                    default: t(() => [
                      n(
                        S,
                        { inline: !0 },
                        {
                          default: t(() => [
                            n(
                              m,
                              { label: '选择物料' },
                              {
                                default: t(() => [
                                  n(
                                    M,
                                    {
                                      modelValue: s.value,
                                      'onUpdate:modelValue': a[0] || (a[0] = (e) => (s.value = e)),
                                      placeholder: '请选择物料',
                                      filterable: '',
                                      style: { width: '280px' }
                                    },
                                    {
                                      default: t(() => [
                                        (l(!0),
                                        _(
                                          g,
                                          null,
                                          v(
                                            c.value,
                                            (e) => (
                                              l(),
                                              f(E, { key: e.id, label: `${e.code} - ${e.name}`, value: e.id }, null, 8, ['label', 'value'])
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
                            ),
                            n(
                              m,
                              { label: '打印数量' },
                              {
                                default: t(() => [
                                  n(
                                    N,
                                    { modelValue: p.value, 'onUpdate:modelValue': a[1] || (a[1] = (e) => (p.value = e)), min: 1, max: 100 },
                                    null,
                                    8,
                                    ['modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            n(m, null, {
                              default: t(() => [
                                n(b, { type: 'primary', onClick: C }, { default: t(() => [...(a[3] || (a[3] = [x('生成预览', -1)]))]), _: 1 })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                ),
                u.value.length
                  ? (l(),
                    f(
                      y,
                      { key: 0, shadow: 'never', header: '条码预览' },
                      {
                        default: t(() => [
                          r('div', G, [
                            (l(!0),
                            _(
                              g,
                              null,
                              v(
                                u.value,
                                (e, I) => (
                                  l(),
                                  _('div', { key: I, class: 'barcode-item' }, [
                                    r('div', H, [
                                      (l(),
                                      _(
                                        g,
                                        null,
                                        v(20, (h) => r('div', { key: h, class: 'barcode-bar', style: T({ width: V(h) + 'px' }) }, null, 4)),
                                        64
                                      ))
                                    ]),
                                    r('div', J, w(e.barcode), 1),
                                    r('div', K, w(e.name), 1)
                                  ])
                                )
                              ),
                              128
                            ))
                          ])
                        ]),
                        _: 1
                      }
                    ))
                  : O('', !0)
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  ae = j(R, [['__scopeId', 'data-v-c7a68f7a']])
export { ae as default }

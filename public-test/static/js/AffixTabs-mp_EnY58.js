import {
  An as q,
  At as de,
  B as ce,
  Bn as o,
  Cn as pe,
  En as K,
  Ft as j,
  Gt as J,
  H as le,
  It as ve,
  Kt as me,
  L as _e,
  Lt as fe,
  M as he,
  Mn as ge,
  Nn as Z,
  On as m,
  R as be,
  Rn as X,
  Tn as W,
  Tt as we,
  Xn as T,
  Yn as ee,
  _t as U,
  an as M,
  bt as ye,
  dn as n,
  en as ne,
  ft as oe,
  ht as ke,
  i as se,
  in as t,
  ir as D,
  it as xe,
  j as $e,
  lt as Te,
  mt as Ve,
  n as Ce,
  on as F,
  ot as O,
  pn as A,
  qt as Ee,
  r as Me,
  rn as L,
  rr as E,
  sn as x,
  sr as S,
  tn as N,
  un as z,
  wt as Se,
  xn as te,
  xt as Ie,
  yt as Le,
  z as Ae
} from './element-plus-CzL7BOKu.js'
import { i as re, r as De } from './vue-chunks-CWn_TkJU.js'
import { I as B, P as Be, h as ie, n as Y, r as ae, t as G } from './index-DqMfCNbk.js'
import { t as Pe } from './layout-CiBjgsjA.js'
var ze = A({
    __name: 'GlobalSearch',
    setup(c) {
      const f = T(''),
        r = T(!1),
        v = T(''),
        i = L(() => 'Ctrl + K'),
        _ = () => {
          r.value = !0
        }
      return (u, s) => {
        const d = oe,
          g = le
        return (
          m(),
          x('div', null, [
            n(
              d,
              {
                modelValue: f.value,
                'onUpdate:modelValue': s[0] || (s[0] = (h) => (f.value = h)),
                size: 'small',
                class: 'global-search',
                placeholder: '搜索页面 / 菜单  ' + i.value,
                readonly: '',
                'prefix-icon': E(J),
                onClick: _,
                onKeydown: s[1] || (s[1] = ne(() => {}, ['stop', 'prevent']))
              },
              null,
              8,
              ['modelValue', 'placeholder', 'prefix-icon']
            ),
            n(
              g,
              { modelValue: r.value, 'onUpdate:modelValue': s[3] || (s[3] = (h) => (r.value = h)), title: '全局搜索', width: '600px' },
              {
                default: o(() => [
                  n(
                    d,
                    {
                      modelValue: v.value,
                      'onUpdate:modelValue': s[2] || (s[2] = (h) => (v.value = h)),
                      'prefix-icon': E(J),
                      placeholder: '输入菜单名称、功能名称或关键词'
                    },
                    null,
                    8,
                    ['modelValue', 'prefix-icon']
                  ),
                  s[4] || (s[4] = t('div', { class: 'search-result' }, '静态阶段暂未接入搜索索引', -1))
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
  Re = B(ze, [['__scopeId', 'data-v-724f590b']]),
  Fe = A({
    __name: 'ThemeToggle',
    setup(c) {
      const f = document.documentElement,
        r = T(Y() === 'night-shift-dark'),
        v = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        i = 'startViewTransition' in document,
        _ = (s) => {
          const d = r.value ? 'light' : 'night-shift-dark'
          if (!i || v) {
            r.value = G(d) !== 'light'
            return
          }
          const g = innerWidth,
            h = innerHeight,
            k = s?.clientX ?? g / 2,
            b = s?.clientY ?? h / 2,
            $ = d === 'light',
            V = $ ? g - k : k,
            l = $ ? h - b : b
          document
            .startViewTransition(() => {
              r.value = G(d) !== 'light'
            })
            .ready.then(() => {
              const p = Math.hypot(Math.max(V, g - V), Math.max(l, h - l))
              document.documentElement.animate(
                d === 'light'
                  ? { clipPath: [`circle(0px at ${V}px ${l}px)`, `circle(${p}px at ${V}px ${l}px)`] }
                  : { clipPath: [`circle(0px at ${V}px ${l}px)`, `circle(${p}px at ${V}px ${l}px)`] },
                { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
              )
            })
        }
      let u = null
      return (
        W(() => {
          ;((u = new MutationObserver(() => {
            r.value = Y() === 'night-shift-dark'
          })),
            u.observe(f, { attributes: !0, attributeFilter: ['class'] }))
        }),
        K(() => {
          ;(u?.disconnect(), (u = null))
        }),
        (s, d) => {
          const g = U,
            h = O
          return (
            m(),
            M(
              h,
              { type: 'text', circle: '', class: 'icon-btn', onClick: d[0] || (d[0] = (k) => _(k)) },
              {
                default: o(() => [
                  r.value
                    ? (m(), M(g, { key: 0 }, { default: o(() => [n(E(fe))]), _: 1 }))
                    : (m(), M(g, { key: 1 }, { default: o(() => [n(E(Ee))]), _: 1 }))
                ]),
                _: 1
              }
            )
          )
        }
      )
    }
  }),
  Ue = B(Fe, [['__scopeId', 'data-v-6ce5de91']]),
  Oe = A({
    __name: 'FullscreenButton',
    setup(c) {
      const f = async () => {
        document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen()
      }
      return (r, v) => {
        const i = U,
          _ = O
        return (m(), M(_, { type: 'text', circle: '', onClick: f }, { default: o(() => [n(i, null, { default: o(() => [n(E(de))]), _: 1 })]), _: 1 }))
      }
    }
  }),
  We = Oe,
  Ne = { class: 'notify-panel' },
  He = { class: 'notify-top' },
  Xe = { class: 'notify-middle' },
  Ye = { class: 'notify-left' },
  Ge = { class: 'notify-content' },
  qe = { class: 'notify-label' },
  Ke = { class: 'notify-text' },
  Qe = { class: 'notify-time' },
  je = { key: 0, class: 'notify-empty' },
  Je = { class: 'notify-bottom' },
  Ze = A({
    __name: 'NotificationsPopover',
    setup(c) {
      const f = T(!1),
        r = T([
          { id: 1, label: '审批提醒', text: '采购申请单 SRM-20260713-018 待业务负责人审批。', time: '2026-07-13 09:24' },
          { id: 2, label: '库存预警', text: '电子仓 A 区连接器库存低于安全线，请及时补料。', time: '2026-07-13 08:42' },
          { id: 3, label: '设备告警', text: '2 号产线贴片机状态异常，EAM 工单已自动创建。', time: '2026-07-13 07:58' }
        ]),
        v = () => {
          r.value = []
        },
        i = () => {
          ;((f.value = !1), se.info('通知中心静态页将在系统平台阶段统一建设'))
        }
      return (_, u) => {
        const s = U,
          d = O,
          g = Ce
        return (
          m(),
          M(
            g,
            { visible: f.value, 'onUpdate:visible': u[0] || (u[0] = (h) => (f.value = h)), placement: 'bottom-end', width: '360', trigger: 'click' },
            {
              reference: o(() => [
                n(d, { text: '', circle: '', class: 'icon-btn' }, { default: o(() => [n(s, null, { default: o(() => [n(E(Ie))]), _: 1 })]), _: 1 })
              ]),
              default: o(() => [
                t('div', Ne, [
                  t('div', He, [
                    u[1] || (u[1] = t('span', { class: 'notify-title' }, '通知中心', -1)),
                    n(s, null, { default: o(() => [n(E(ve))]), _: 1 })
                  ]),
                  t('div', Xe, [
                    (m(!0),
                    x(
                      N,
                      null,
                      q(
                        r.value,
                        (h) => (
                          m(),
                          x('div', { key: h.id, class: 'notify-item' }, [
                            t('div', Ye, [n(s, null, { default: o(() => [n(E(Se))]), _: 1 })]),
                            t('div', Ge, [t('div', qe, S(h.label), 1), t('div', Ke, S(h.text), 1), t('div', Qe, S(h.time), 1)]),
                            u[2] || (u[2] = t('span', { class: 'notify-dot' }, null, -1))
                          ])
                        )
                      ),
                      128
                    )),
                    r.value.length === 0 ? (m(), x('div', je, '暂无消息')) : F('', !0)
                  ]),
                  t('div', Je, [
                    n(d, { text: '', onClick: v }, { default: o(() => [...(u[3] || (u[3] = [z('清空', -1)]))]), _: 1 }),
                    n(d, { type: 'primary', size: 'small', onClick: i }, { default: o(() => [...(u[4] || (u[4] = [z('查看全部', -1)]))]), _: 1 })
                  ])
                ])
              ]),
              _: 1
            },
            8,
            ['visible']
          )
        )
      }
    }
  }),
  et = B(Ze, [['__scopeId', 'data-v-a61b5746']]),
  tt = { class: 'drawer-body' },
  at = { class: 'section' },
  lt = { class: 'card-grid' },
  nt = { class: 'section' },
  ot = { class: 'card-grid theme-grid' },
  st = { class: 'drawer-footer' },
  rt = A({
    __name: 'SettingsDrawer',
    props: { modelValue: { type: Boolean } },
    emits: ['update:modelValue'],
    setup(c, { emit: f }) {
      const r = c,
        v = f,
        i = L({ get: () => r.modelValue, set: (e) => v('update:modelValue', e) }),
        _ = Pe(),
        u = T(_.mode),
        s = T(ae()),
        d = document.documentElement,
        g = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        h = 'startViewTransition' in document,
        k = (e) => {
          s.value = G(e)
        },
        b = (e) => {
          ;(_.setMode(e), (u.value = e))
        },
        $ = (e, a) => {
          if (!h || g) {
            k(e)
            return
          }
          const w = window.innerWidth,
            I = window.innerHeight,
            y = a?.clientX ?? w / 2,
            R = a?.clientY ?? I / 2,
            H = Math.hypot(Math.max(y, w - y), Math.max(R, I - R))
          document
            .startViewTransition?.(() => k(e))
            ?.ready.then(() => {
              d.animate(
                { clipPath: [`circle(0px at ${y}px ${R}px)`, `circle(${H}px at ${y}px ${R}px)`] },
                { duration: 450, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
              )
            })
        },
        V = ie(),
        l = () => {
          ;($('light'), b('classic'))
        },
        p = () => {
          ;(V.clearAuth({ clearPreferences: !0 }), v('update:modelValue', !1))
        }
      ;(X(
        () => r.modelValue,
        (e) => {
          e && ((u.value = _.mode), (s.value = ae()))
        }
      ),
        X(
          () => _.mode,
          (e) => {
            u.value = e
          }
        ))
      let C = null
      return (
        W(() => {
          ;((C = new MutationObserver(() => {
            s.value = Y()
          })),
            C.observe(d, { attributes: !0, attributeFilter: ['class'] }))
        }),
        K(() => {
          ;(C?.disconnect(), (C = null))
        }),
        (e, a) => {
          const w = O,
            I = ce
          return (
            m(),
            M(
              I,
              {
                modelValue: i.value,
                'onUpdate:modelValue': a[5] || (a[5] = (y) => (i.value = y)),
                direction: 'rtl',
                size: '420',
                'lock-scroll': !1,
                'with-header': !0,
                'custom-class': 'settings-drawer'
              },
              {
                header: o(() => [...(a[6] || (a[6] = [t('div', { class: 'drawer-header' }, '界面设置', -1)]))]),
                footer: o(() => [
                  t('div', st, [
                    n(w, { onClick: l }, { default: o(() => [...(a[14] || (a[14] = [z('恢复默认设置', -1)]))]), _: 1 }),
                    n(w, { type: 'primary', onClick: p }, { default: o(() => [...(a[15] || (a[15] = [z('清除缓存并退出', -1)]))]), _: 1 })
                  ])
                ]),
                default: o(() => [
                  t('div', tt, [
                    t('div', at, [
                      a[10] || (a[10] = t('div', { class: 'section-title' }, '布局模式', -1)),
                      t('div', lt, [
                        t(
                          'div',
                          { class: D(['option-card', { active: u.value === 'classic' }]), onClick: a[0] || (a[0] = (y) => b('classic')) },
                          [
                            ...(a[7] ||
                              (a[7] = [
                                t('div', { class: 'preview layout-classic' }, [t('div', { class: 'page' })], -1),
                                t('div', { class: 'label' }, '经典布局', -1)
                              ]))
                          ],
                          2
                        ),
                        t(
                          'div',
                          { class: D(['option-card', { active: u.value === 'double-row' }]), onClick: a[1] || (a[1] = (y) => b('double-row')) },
                          [
                            ...(a[8] ||
                              (a[8] = [
                                t('div', { class: 'preview layout-double-row' }, [t('div', { class: 'page' })], -1),
                                t('div', { class: 'label' }, '顶侧双排', -1)
                              ]))
                          ],
                          2
                        ),
                        t(
                          'div',
                          { class: D(['option-card', { active: u.value === 'double-column' }]), onClick: a[2] || (a[2] = (y) => b('double-column')) },
                          [
                            ...(a[9] ||
                              (a[9] = [
                                t('div', { class: 'preview layout-double-column' }, [t('div', { class: 'page' })], -1),
                                t('div', { class: 'label' }, '左侧双列', -1)
                              ]))
                          ],
                          2
                        )
                      ])
                    ]),
                    t('div', nt, [
                      a[13] || (a[13] = t('div', { class: 'section-title' }, '全局主题', -1)),
                      t('div', ot, [
                        t(
                          'div',
                          { class: D(['option-card', { active: s.value === 'light' }]), onClick: a[3] || (a[3] = (y) => $('light', y)) },
                          [
                            ...(a[11] ||
                              (a[11] = [
                                t('div', { class: 'preview theme-light' }, [t('div', { class: 'page' })], -1),
                                t('div', { class: 'label' }, '工业蓝灰', -1)
                              ]))
                          ],
                          2
                        ),
                        t(
                          'div',
                          {
                            class: D(['option-card', { active: s.value === 'night-shift-dark' }]),
                            onClick: a[4] || (a[4] = (y) => $('night-shift-dark', y))
                          },
                          [
                            ...(a[12] ||
                              (a[12] = [
                                t('div', { class: 'preview theme-night-shift-dark' }, [t('div', { class: 'page' })], -1),
                                t('div', { class: 'label' }, '夜班深蓝', -1)
                              ]))
                          ],
                          2
                        )
                      ])
                    ])
                  ])
                ]),
                _: 1
              },
              8,
              ['modelValue']
            )
          )
        }
      )
    }
  }),
  it = B(rt, [['__scopeId', 'data-v-9928fdbb']]),
  ut = { class: 'user-top' },
  dt = { class: 'user-meta' },
  ct = { class: 'user-row' },
  pt = { class: 'user-name' },
  vt = { class: 'user-email' },
  mt = { class: 'user-middle' },
  _t = { class: 'lock-dialog' },
  ft = { class: 'lock-name' },
  ht = { class: 'lock-footer' },
  gt = A({
    __name: 'UserDropdown',
    setup(c) {
      const f = ee({ name: '系统管理员', role: '平台管理员', email: 'admin@xgzl.local' }),
        r = T(!1),
        v = T(!1),
        i = ee({ pwd: '' }),
        _ = T(),
        u = re(),
        s = Be(),
        d = ie(),
        g = async () => {
          try {
            ;(await Me.confirm('退出后将返回登录页，当前未保存的内容可能丢失。是否继续退出？', '退出登录', {
              type: 'warning',
              confirmButtonText: '退出',
              cancelButtonText: '取消'
            }),
              await d.doLogout())
          } catch {}
        },
        h = async () => {
          if ((await _.value?.validate?.(), !i.pwd)) {
            se.error('请输入锁屏密码')
            return
          }
          ;(s.lock(i.pwd), (v.value = !1), (i.pwd = ''), u.push('/lock'))
        },
        k = () => {
          v.value = !0
        },
        b = () => {
          g()
        },
        $ = () => {
          ;((i.pwd = ''), (v.value = !1))
        }
      return (
        W(() => {
          ;(window.addEventListener('lock-open', k), window.addEventListener('logout-open', b))
        }),
        K(() => {
          ;(window.removeEventListener('lock-open', k), window.removeEventListener('logout-open', b))
        }),
        (V, l) => {
          const p = Te,
            C = xe,
            e = U,
            a = be,
            w = Ae,
            I = _e,
            y = oe,
            R = ke,
            H = Ve,
            Q = O,
            ue = le
          return (
            m(),
            x(
              N,
              null,
              [
                n(
                  I,
                  { trigger: 'click' },
                  {
                    dropdown: o(() => [
                      n(
                        w,
                        { class: 'user-dropdown' },
                        {
                          default: o(() => [
                            t('div', ut, [
                              n(p, { class: 'user-avatar', size: 'large', src: '' }),
                              t('div', dt, [
                                t('div', ct, [
                                  t('span', pt, S(f.name), 1),
                                  n(C, { class: 'user-tag', size: 'small', type: 'info' }, { default: o(() => [z(S(f.role), 1)]), _: 1 })
                                ]),
                                t('div', vt, S(f.email), 1)
                              ]),
                              l[5] || (l[5] = t('span', { class: 'status-dot' }, null, -1))
                            ]),
                            t('div', mt, [
                              n(
                                a,
                                { onClick: l[0] || (l[0] = (P) => (v.value = !0)) },
                                {
                                  default: o(() => [
                                    n(e, null, { default: o(() => [n(E(j))]), _: 1 }),
                                    l[6] || (l[6] = t('span', null, '锁定屏幕', -1))
                                  ]),
                                  _: 1
                                }
                              ),
                              n(
                                a,
                                { onClick: l[1] || (l[1] = (P) => (r.value = !0)) },
                                {
                                  default: o(() => [
                                    n(e, null, { default: o(() => [n(E(me))]), _: 1 }),
                                    l[7] || (l[7] = t('span', null, '界面设置', -1))
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            n(
                              a,
                              { class: 'user-bottom', divided: '', onClick: g },
                              {
                                default: o(() => [
                                  ...(l[8] || (l[8] = [t('span', null, '退出登录', -1), t('span', { class: 'shortcut' }, 'Alt + Q', -1)]))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    default: o(() => [n(p, { class: 'avatar', size: 'small', src: '' })]),
                    _: 1
                  }
                ),
                n(it, { modelValue: r.value, 'onUpdate:modelValue': l[2] || (l[2] = (P) => (r.value = P)) }, null, 8, ['modelValue']),
                n(
                  ue,
                  {
                    modelValue: v.value,
                    'onUpdate:modelValue': l[4] || (l[4] = (P) => (v.value = P)),
                    title: '锁定屏幕',
                    width: '380px',
                    'close-on-click-modal': !1,
                    'close-on-press-escape': !0,
                    'show-close': !0,
                    'lock-scroll': !1
                  },
                  {
                    footer: o(() => [
                      t('div', ht, [
                        n(Q, { onClick: $ }, { default: o(() => [...(l[9] || (l[9] = [z('取消', -1)]))]), _: 1 }),
                        n(Q, { type: 'primary', onClick: h }, { default: o(() => [...(l[10] || (l[10] = [z('确认锁定', -1)]))]), _: 1 })
                      ])
                    ]),
                    default: o(() => [
                      t('div', _t, [
                        n(p, { class: 'lock-avatar', size: 'large', src: '' }),
                        t('div', ft, S(f.name), 1),
                        n(
                          H,
                          { ref_key: 'lockFormRef', ref: _, model: i },
                          {
                            default: o(() => [
                              n(
                                R,
                                { prop: 'pwd', rules: [{ required: !0, message: '请输入锁屏密码' }] },
                                {
                                  default: o(() => [
                                    n(
                                      y,
                                      {
                                        modelValue: i.pwd,
                                        'onUpdate:modelValue': l[3] || (l[3] = (P) => (i.pwd = P)),
                                        type: 'password',
                                        'show-password': '',
                                        placeholder: '请输入锁屏密码'
                                      },
                                      { prefix: o(() => [n(e, null, { default: o(() => [n(E(j))]), _: 1 })]), _: 1 },
                                      8,
                                      ['modelValue']
                                    )
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['model']
                        )
                      ])
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ],
              64
            )
          )
        }
      )
    }
  }),
  bt = B(gt, [['__scopeId', 'data-v-08e56809']]),
  wt = { class: 'header-right' },
  yt = A({
    __name: 'HeaderRight',
    setup(c) {
      return (f, r) => (m(), x('div', wt, [n(Re), n(Ue), n(We), n(et), n(bt)]))
    }
  }),
  Ot = B(yt, [['__scopeId', 'data-v-51e67473']]),
  Wt = '/gitlab-pages-check/static/png/logo-DLmbDXJo.png',
  kt = { class: 'menu-title-wrap' },
  xt = { class: 'menu-title' },
  $t = { key: 0, class: 'menu-tag' },
  Tt = { class: 'menu-title-wrap' },
  Vt = { class: 'menu-title' },
  Ct = { key: 0, class: 'menu-tag' },
  Et = A({
    __name: 'SidebarMenuItem',
    props: { item: {}, leafIcon: { type: Boolean, default: !1 } },
    setup(c) {
      const f = (r) => {
        const v = we
        return (r && v[r]) || v.Document
      }
      return (r, v) => {
        const i = U,
          _ = ge('SidebarMenuItem', !0),
          u = he,
          s = $e
        return c.item.children && c.item.children.length
          ? (m(),
            M(
              u,
              { key: 0, index: c.item.path },
              {
                title: o(() => [
                  n(i, null, { default: o(() => [(m(), M(Z(f(c.item.icon || 'Menu'))))]), _: 1 }),
                  t('span', kt, [t('span', xt, S(c.item.title), 1), c.item.menuTag ? (m(), x('span', $t, S(c.item.menuTag), 1)) : F('', !0)])
                ]),
                default: o(() => [
                  (m(!0),
                  x(
                    N,
                    null,
                    q(c.item.children, (d) => (m(), M(_, { key: d.path, item: d, 'leaf-icon': c.leafIcon }, null, 8, ['item', 'leaf-icon']))),
                    128
                  ))
                ]),
                _: 1
              },
              8,
              ['index']
            ))
          : (m(),
            M(
              s,
              { key: 1, index: c.item.path },
              {
                default: o(() => [
                  c.leafIcon ? (m(), M(i, { key: 0 }, { default: o(() => [(m(), M(Z(f(c.item.icon || 'Document'))))]), _: 1 })) : F('', !0),
                  t('span', Tt, [t('span', Vt, S(c.item.title), 1), c.item.menuTag ? (m(), x('span', Ct, S(c.item.menuTag), 1)) : F('', !0)])
                ]),
                _: 1
              },
              8,
              ['index']
            ))
      }
    }
  }),
  Nt = B(Et, [['__scopeId', 'data-v-cf59fe44']])
function Ht() {
  const c = re(),
    f = De(),
    r = (e, a) => (e.meta?.order ?? 0) - (a.meta?.order ?? 0),
    v = (e) => !!e.meta?.hidden,
    i = (e) => Array.isArray(e.children),
    _ = (e) => (e ? (e.startsWith('/') ? e : `/${e}`) : '/'),
    u = (e) => e.replace(/\/:[^/]+/g, ''),
    s = (e) => u(e).replace(/\/+/g, '/').replace(/\/+$/, '') || '/',
    d = (e, a) => e.meta?.title ?? e.name ?? e.path ?? a,
    g = L(() => {
      const e = c.options,
        a = (Array.isArray(e?.routes) ? e.routes : []).find((w) => w.path === '/')
      return (Array.isArray(a?.children) ? a.children : []).slice().sort(r)
    }),
    h = L(() =>
      g.value.filter((e) => !v(e) && !i(e)).map((e) => ({ path: _(e.path), title: d(e, _(e.path)), icon: e.meta?.icon, menuTag: e.meta?.menuTag }))
    ),
    k = (e, a) =>
      (e.children || [])
        .filter((w) => !v(w))
        .sort(r)
        .map((w) => {
          const I = s(`${a}/${w.path}`),
            y = { path: I, title: d(w, I), icon: w.meta?.icon, menuTag: w.meta?.menuTag }
          return (i(w) && (y.children = k(w, I)), y)
        }),
    b = L(() =>
      g.value.filter(i).map((e) => {
        const a = _(e.path)
        return { path: a, title: d(e, a), icon: e.meta?.icon, menuTag: e.meta?.menuTag, children: k(e, a) }
      })
    ),
    $ = L(() =>
      g.value
        .filter((e) => !v(e))
        .map((e) => {
          if (i(e)) {
            const a = _(e.path)
            return { path: a, title: d(e, a), icon: e.meta?.icon, menuTag: e.meta?.menuTag, children: k(e, a), kind: 'group' }
          }
          return { path: _(e.path), title: d(e, _(e.path)), icon: e.meta?.icon, menuTag: e.meta?.menuTag, kind: 'single' }
        })
    ),
    V = (e) => (Array.isArray(e.children) && e.children.length > 0 ? V(e.children[0]) : e.path),
    l = L(() => s((f.meta?.activeMenu || f.path) ?? '/')),
    p = L(() => {
      const e = l.value
      return $.value.find((a) => e === a.path || e.startsWith(`${a.path}/`))?.path || '/'
    }),
    C = L(() => $.value.find((e) => e.path === p.value) || null)
  return {
    singleItems: h,
    groups: b,
    topLevelItems: $,
    activeTopLevelPath: p,
    activeTopLevelItem: C,
    currentSidebarItems: L(() => {
      const e = C.value
      return !e || e.kind !== 'group' ? [] : e.children || []
    }),
    resolveFirstPath: V
  }
}
var Mt = { class: 'route-tabs' },
  St = ['disabled'],
  It = ['onClick'],
  Lt = { class: 'tab-title' },
  At = { key: 0, class: 'tab-affix' },
  Dt = ['onClick'],
  Bt = ['disabled'],
  Pt = A({
    __name: 'AffixTabs',
    props: { tabs: {}, activeTab: {}, homePath: {} },
    emits: ['remove-tab', 'tab-click'],
    setup(c, { emit: f }) {
      const r = c,
        v = f,
        i = T(null),
        _ = T(!1),
        u = T(!1),
        s = T(!1)
      let d = null
      const g = (l) => l.path === (r.homePath ?? '/'),
        h = (l) => v('remove-tab', l),
        k = (l) => v('tab-click', l),
        b = () => {
          const l = i.value
          if (!l) return
          const p = Math.max(l.scrollWidth - l.clientWidth, 0)
          ;((_.value = p > 4), (u.value = l.scrollLeft > 4), (s.value = l.scrollLeft < p - 4))
        },
        $ = (l) => {
          const p = i.value
          if (!p) return
          const C = l === 'next' ? 240 : -240
          p.scrollBy({ left: C, behavior: 'smooth' })
        },
        V = (l) => {
          const p = i.value
          p && (Math.abs(l.deltaY) <= Math.abs(l.deltaX) || p.scrollWidth <= p.clientWidth || ((p.scrollLeft += l.deltaY), b(), l.preventDefault()))
        }
      return (
        W(() => {
          te(b)
          const l = i.value
          ;(l?.addEventListener('scroll', b, { passive: !0 }),
            'ResizeObserver' in window && l ? ((d = new ResizeObserver(() => b())), d.observe(l)) : window.addEventListener('resize', b))
        }),
        pe(() => {
          ;(i.value?.removeEventListener('scroll', b), d?.disconnect(), (d = null), window.removeEventListener('resize', b))
        }),
        X(
          () => [r.tabs.length, r.activeTab],
          () => {
            te(b)
          },
          { immediate: !0 }
        ),
        (l, p) => {
          const C = U
          return (
            m(),
            x('div', Mt, [
              _.value
                ? (m(),
                  x(
                    'button',
                    {
                      key: 0,
                      type: 'button',
                      class: D(['scroll-arrow', { 'is-disabled': !u.value }]),
                      disabled: !u.value,
                      'aria-label': '向左查看页签',
                      onClick: p[0] || (p[0] = (e) => $('prev'))
                    },
                    [n(C, null, { default: o(() => [n(E(Le))]), _: 1 })],
                    10,
                    St
                  ))
                : F('', !0),
              t(
                'div',
                { ref_key: 'tabsBarRef', ref: i, class: 'route-tabs__bar', onWheel: V },
                [
                  (m(!0),
                  x(
                    N,
                    null,
                    q(
                      c.tabs,
                      (e) => (
                        m(),
                        x(
                          'div',
                          { key: e.path, class: D(['route-tab', { active: e.path === c.activeTab }]), onClick: (a) => k(e.path) },
                          [
                            t('span', Lt, S(e.title), 1),
                            g(e)
                              ? (m(), x('span', At))
                              : (m(),
                                x(
                                  'button',
                                  { key: 1, type: 'button', class: 'tab-close', onClick: ne((a) => h(e.path), ['stop']) },
                                  [...(p[2] || (p[2] = [t('span', { 'aria-hidden': 'true' }, '×', -1)]))],
                                  8,
                                  Dt
                                ))
                          ],
                          10,
                          It
                        )
                      )
                    ),
                    128
                  ))
                ],
                544
              ),
              _.value
                ? (m(),
                  x(
                    'button',
                    {
                      key: 1,
                      type: 'button',
                      class: D(['scroll-arrow', { 'is-disabled': !s.value }]),
                      disabled: !s.value,
                      'aria-label': '向右查看页签',
                      onClick: p[1] || (p[1] = (e) => $('next'))
                    },
                    [n(C, null, { default: o(() => [n(E(ye))]), _: 1 })],
                    10,
                    Bt
                  ))
                : F('', !0)
            ])
          )
        }
      )
    }
  }),
  Xt = B(Pt, [['__scopeId', 'data-v-bea3e2c2']])
export { Ot as a, Wt as i, Ht as n, Nt as r, Xt as t }

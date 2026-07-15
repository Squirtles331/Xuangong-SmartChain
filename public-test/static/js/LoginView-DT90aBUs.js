import {
  $ as C,
  Bn as s,
  Ht as L,
  N as B,
  On as M,
  Xn as d,
  Yn as N,
  _t as T,
  dn as t,
  ft as U,
  ht as X,
  i,
  in as a,
  ln as D,
  mt as F,
  nt as q,
  ot as R,
  pn as Y,
  rr as f,
  rt as A,
  sn as O,
  sr as P,
  un as m
} from './element-plus-CzL7BOKu.js'
import { i as j } from './vue-chunks-CWn_TkJU.js'
import { I as H } from './index-DqMfCNbk.js'
var J = '/gitlab-pages-check/static/png/login-Bkkvjgjf.png',
  W = { class: 'login-container' },
  $ = { class: 'login-left-panel', 'aria-label': '登录区域' },
  z = { class: 'login-card' },
  G = { class: 'captcha-wrapper' },
  K = { class: 'captcha-text' },
  Q = { class: 'form-options' },
  Z = { class: 'login-right-panel', 'aria-label': '平台介绍' },
  ee = { class: 'right-content' },
  ae = { class: 'illustration-wrapper' },
  oe = ['src'],
  te = Y({
    __name: 'LoginView',
    setup(se) {
      const v = j(),
        _ = d(),
        c = d(!1),
        o = N({ company: 'company1', username: 'admin', password: '123456', captcha: '', remember: !1 }),
        p = d('9 7 3'),
        h = {
          company: [{ required: !0, message: '请选择租户/组织', trigger: 'change' }],
          username: [{ required: !0, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: !0, message: '请输入密码', trigger: 'blur' }],
          captcha: [{ required: !0, message: '请输入验证码', trigger: 'blur' }]
        },
        b = () => {
          const l = ['9 7 3', '5 2 8', '1 4 6', '7 3 9', '2 8 4']
          p.value = l[Math.floor(Math.random() * l.length)]
        },
        y = async () => {
          try {
            ;(await _.value.validate(),
              (c.value = !0),
              (await k()) &&
                (i.success('登录成功'),
                o.remember && localStorage.setItem('remembered_username', o.username),
                localStorage.setItem('mock_login', 'true'),
                v.push('/')))
          } catch (l) {
            ;(console.error('登录失败:', l), i.error('登录失败，请检查表单填写'))
          } finally {
            c.value = !1
          }
        }
      function k() {
        return new Promise((l) => {
          setTimeout(() => {
            if (o.captcha.replace(/\s/g, '') !== p.value.replace(/\s/g, '')) {
              ;(i.error('验证码错误'), l(!1))
              return
            }
            o.username && o.password
              ? (localStorage.setItem('access_token', 'mock_token_' + Date.now()),
                localStorage.setItem('refresh_token', 'mock_refresh_token'),
                localStorage.setItem(
                  'user_info',
                  JSON.stringify({ id: '1', username: o.username, real_name: o.username, roles: ['super_admin'], permissions: ['*'] })
                ),
                l(!0))
              : (i.error('请输入用户名和密码'), l(!1))
          }, 500)
        })
      }
      return (l, e) => {
        const g = q,
          V = A,
          n = X,
          u = U,
          w = T,
          x = C,
          S = B,
          E = R,
          I = F
        return (
          M(),
          O('div', W, [
            a('section', $, [
              a('div', z, [
                e[9] ||
                  (e[9] = D(
                    '<header class="brand-header" data-v-08845846><div class="logo" data-v-08845846><span class="logo-icon" aria-hidden="true" data-v-08845846></span><span class="logo-text" data-v-08845846>玄工智链 · XIC 平台</span></div></header><div class="login-header" data-v-08845846><h1 class="welcome-title" data-v-08845846>欢迎来到玄工智链</h1><p class="login-hint" data-v-08845846>使用邮箱/手机号登录</p></div>',
                    2
                  )),
                t(
                  I,
                  { ref_key: 'loginFormRef', ref: _, model: o, rules: h, class: 'login-form' },
                  {
                    default: s(() => [
                      t(
                        n,
                        { prop: 'company' },
                        {
                          default: s(() => [
                            t(
                              V,
                              {
                                modelValue: o.company,
                                'onUpdate:modelValue': e[0] || (e[0] = (r) => (o.company = r)),
                                placeholder: '请选择租户/组织',
                                class: 'form-select'
                              },
                              {
                                default: s(() => [
                                  t(g, { label: 'XXX有限公司', value: 'company1' }),
                                  t(g, { label: 'YYY科技有限公司', value: 'company2' })
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
                      t(
                        n,
                        { prop: 'username' },
                        {
                          default: s(() => [
                            t(
                              u,
                              {
                                modelValue: o.username,
                                'onUpdate:modelValue': e[1] || (e[1] = (r) => (o.username = r)),
                                placeholder: '请输入邮箱/手机号',
                                'prefix-icon': 'User',
                                class: 'form-input'
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      t(
                        n,
                        { prop: 'password' },
                        {
                          default: s(() => [
                            t(
                              u,
                              {
                                modelValue: o.password,
                                'onUpdate:modelValue': e[2] || (e[2] = (r) => (o.password = r)),
                                type: 'password',
                                placeholder: '请输入密码（SM4 加密传输）',
                                'prefix-icon': 'Lock',
                                'show-password': '',
                                class: 'form-input'
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      t(
                        n,
                        { prop: 'captcha', class: 'captcha-item' },
                        {
                          default: s(() => [
                            a('div', G, [
                              t(
                                u,
                                {
                                  modelValue: o.captcha,
                                  'onUpdate:modelValue': e[3] || (e[3] = (r) => (o.captcha = r)),
                                  placeholder: '请输入验证码',
                                  class: 'captcha-input'
                                },
                                null,
                                8,
                                ['modelValue']
                              ),
                              a('button', { type: 'button', class: 'captcha-box', 'aria-label': '刷新验证码', onClick: b }, [
                                a('span', K, P(p.value), 1),
                                t(w, { class: 'refresh-icon' }, { default: s(() => [t(f(L))]), _: 1 })
                              ])
                            ])
                          ]),
                          _: 1
                        }
                      ),
                      a('div', Q, [
                        t(
                          x,
                          { modelValue: o.remember, 'onUpdate:modelValue': e[4] || (e[4] = (r) => (o.remember = r)), class: 'remember-checkbox' },
                          { default: s(() => [...(e[5] || (e[5] = [m('记住我', -1)]))]), _: 1 },
                          8,
                          ['modelValue']
                        ),
                        t(S, { type: 'primary', class: 'forgot-link' }, { default: s(() => [...(e[6] || (e[6] = [m('找回密码', -1)]))]), _: 1 })
                      ]),
                      t(
                        E,
                        { type: 'primary', class: 'login-button', loading: c.value, onClick: y },
                        { default: s(() => [...(e[7] || (e[7] = [m('登录', -1)]))]), _: 1 },
                        8,
                        ['loading']
                      ),
                      e[8] ||
                        (e[8] = a(
                          'div',
                          { class: 'social-login' },
                          [
                            a('p', { class: 'social-title' }, '第三方登录（钉钉 / 企业微信 / AD）'),
                            a('div', { class: 'social-icons', 'aria-label': '第三方登录方式' }, [
                              a('button', { type: 'button', class: 'social-icon icon-wechat', 'aria-label': '企业微信登录' }, 'W'),
                              a('button', { type: 'button', class: 'social-icon icon-github', 'aria-label': '钉钉登录' }, 'D'),
                              a('button', { type: 'button', class: 'social-icon icon-google', 'aria-label': 'AD 登录' }, 'A')
                            ])
                          ],
                          -1
                        ))
                    ]),
                    _: 1
                  },
                  8,
                  ['model']
                ),
                e[10] ||
                  (e[10] = a(
                    'footer',
                    { class: 'login-footer' },
                    [a('p', { class: 'copyright' }, '© 2026 玄工智链 · XIC Platform｜遵循等保三级，HTTPS+JWT，密码国密 SM4')],
                    -1
                  ))
              ])
            ]),
            a('aside', Z, [
              a('div', ee, [
                e[11] ||
                  (e[11] = a(
                    'div',
                    { class: 'promo-header' },
                    [
                      a('h2', { class: 'promo-title' }, '面向离散制造的 MES 中枢型一体化平台'),
                      a('p', { class: 'promo-subtitle' }, '以事件驱动和状态控制为核心 · 实现多系统协同闭环')
                    ],
                    -1
                  )),
                a('div', ae, [a('img', { src: f(J), alt: '玄工智链一体化平台', class: 'illustration-image' }, null, 8, oe)])
              ])
            ])
          ])
        )
      }
    }
  }),
  ie = H(te, [['__scopeId', 'data-v-08845846']])
export { ie as default }

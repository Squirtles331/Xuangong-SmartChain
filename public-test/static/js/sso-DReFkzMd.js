import {
  Bn as p,
  Fn as C,
  Kn as $,
  On as O,
  Xn as A,
  Yn as j,
  an as k,
  dn as m,
  i as b,
  pn as U,
  rn as P,
  rr as u,
  sr as G,
  un as X,
  yn as x
} from './element-plus-CzL7BOKu.js'
import { t as Y } from './useTable-Hzr4fBAy.js'
import { t as M } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
import { _ as r } from './static-data-B3FhK4xc.js'
var Z = U({
    __name: 'SsoFormDialog',
    props: x({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: x(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: v }) {
      const s = C(f, 'visible'),
        i = C(f, 'form'),
        y = v,
        g = P(() => [
          { type: 'input', label: '配置名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: 'SSO 协议',
            field: 'protocol',
            required: !0,
            props: {
              options: [
                { label: 'OAuth 2.0', value: 'oauth2' },
                { label: 'OIDC', value: 'oidc' },
                { label: 'SAML 2.0', value: 'saml' },
                { label: 'LDAP/AD', value: 'ldap' }
              ]
            }
          },
          { type: 'input', label: '认证服务地址', field: 'url', required: !0 },
          { type: 'input', label: 'Client ID', field: 'clientId', required: !0 },
          { type: 'input', label: 'Client Secret', field: 'clientSecret' },
          { type: 'input', label: '回调地址', field: 'redirectUri' },
          { type: 'input', label: '默认角色', field: 'defaultRole' },
          { type: 'switch', label: '启用', field: 'enabled' }
        ])
      function h() {
        return !i.value.name || !i.value.url || !i.value.clientId ? (b.warning('请完善单点登录配置'), !1) : !0
      }
      return (D, t) => (
        O(),
        k(
          H,
          {
            visible: s.value,
            'onUpdate:visible': t[0] || (t[0] = (n) => (s.value = n)),
            title: f.mode === 'add' ? '新增单点登录配置' : '编辑单点登录配置',
            form: i.value,
            'onUpdate:form': t[1] || (t[1] = (n) => (i.value = n)),
            columns: g.value,
            'label-width': 120,
            width: '680px',
            'before-submit': h,
            onSubmit: t[2] || (t[2] = (n) => y('submit'))
          },
          null,
          8,
          ['visible', 'title', 'form', 'columns']
        )
      )
    }
  }),
  z = Z,
  ee = U({
    __name: 'index',
    setup(f) {
      const v = [
          { label: 'OAuth 2.0', value: 'oauth2' },
          { label: 'OIDC', value: 'oidc' },
          { label: 'SAML 2.0', value: 'saml' },
          { label: 'LDAP/AD', value: 'ldap' }
        ],
        s = [
          { label: '启用', value: !0, type: 'success' },
          { label: '停用', value: !1, type: 'info' }
        ],
        i = [
          { label: '在线', value: 'online', type: 'success' },
          { label: '离线', value: 'offline', type: 'danger' }
        ],
        y = { oauth2: 'OAuth 2.0', oidc: 'OIDC', saml: 'SAML 2.0', ldap: 'LDAP/AD' },
        g = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '配置名称 / 认证地址 / Client ID', clearable: !0 } },
          { type: 'select-v2', label: '协议', field: 'protocol', props: { options: v, clearable: !0 } },
          { type: 'select-v2', label: '启用状态', field: 'enabled', props: { options: s, clearable: !0 } }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        D = [
          { prop: 'name', label: '配置名称', minWidth: 160 },
          { prop: 'protocol', label: '协议', minWidth: 120, slotName: 'protocol' },
          { prop: 'url', label: '认证地址', minWidth: 240 },
          { prop: 'defaultRole', label: '默认角色', minWidth: 120 },
          { prop: 'enabled', label: '启用状态', minWidth: 100, slotName: 'enabled', align: 'center' },
          { prop: 'status', label: '连接状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'lastSyncAt', label: '最后同步时间', minWidth: 180 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let t = j({ keyword: '', protocol: '', enabled: '' })
      const n = A(!1),
        d = A('add'),
        o = A(R()),
        W = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'test', label: '测试连接', tone: 'secondary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        I = P(() =>
          r.value.filter((e) => {
            const l = !t.keyword || e.name.includes(t.keyword) || e.url.includes(t.keyword) || e.clientId.includes(t.keyword),
              a = !t.protocol || e.protocol === t.protocol,
              c = t.enabled === '' || e.enabled === t.enabled
            return l && a && c
          })
        ),
        {
          tableData: q,
          pagination: L,
          loading: F,
          search: _,
          refresh: S,
          onDelete: N
        } = Y({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => {
            const a = (e - 1) * l,
              c = a + l
            return { list: I.value.slice(a, c), total: I.value.length }
          },
          deleteAPI: async (e) => {
            r.value = r.value.filter((l) => !e.includes(l.id))
          }
        })
      function R() {
        return { id: '', name: '', protocol: 'oauth2', url: '', clientId: '', clientSecret: '', redirectUri: '', defaultRole: '', enabled: !1 }
      }
      function w() {
        ;(Object.assign(t, { keyword: '', protocol: '', enabled: '' }), _())
      }
      function B() {
        ;((d.value = 'add'), (o.value = R()), (n.value = !0))
      }
      function T(e) {
        ;((d.value = 'edit'),
          (o.value = {
            id: e.id,
            name: e.name,
            protocol: e.protocol,
            url: e.url,
            clientId: e.clientId,
            clientSecret: e.clientSecret,
            redirectUri: e.redirectUri,
            defaultRole: e.defaultRole,
            enabled: e.enabled
          }),
          (n.value = !0))
      }
      function E(e, l) {
        if (e === 'edit') {
          T(l)
          return
        }
        if (e === 'test') {
          V(l)
          return
        }
        e === 'delete' && N(l)
      }
      async function K() {
        if (!o.value.name || !o.value.url || !o.value.clientId) {
          b.warning('请填写配置名称、认证地址和 Client ID')
          return
        }
        const e = {
          name: o.value.name,
          protocol: o.value.protocol,
          url: o.value.url,
          clientId: o.value.clientId,
          clientSecret: o.value.clientSecret,
          redirectUri: o.value.redirectUri,
          defaultRole: o.value.defaultRole,
          enabled: o.value.enabled,
          status: o.value.enabled ? 'online' : 'offline',
          lastSyncAt: o.value.enabled ? '2026-07-13 16:35' : ''
        }
        ;(d.value === 'add'
          ? r.value.unshift({ id: `SSO-${String(r.value.length + 1).padStart(3, '0')}`, ...e })
          : (r.value = r.value.map((l) => (l.id === o.value.id ? { id: l.id, ...e } : l))),
          (n.value = !1),
          await S(),
          b.success(d.value === 'add' ? '已新增静态单点登录配置' : '已更新静态单点登录配置'))
      }
      async function V(e) {
        ;((e.status = e.enabled ? 'online' : 'offline'),
          (e.lastSyncAt = e.enabled ? '2026-07-13 16:40' : e.lastSyncAt),
          b.success(`连接测试完成：${e.name}`),
          await S())
      }
      return (e, l) => (
        O(),
        k(
          J,
          {
            'search-model': u(t),
            'onUpdate:searchModel': l[2] || (l[2] = (a) => ($(t) ? (t.value = a) : (t = a))),
            title: '单点登录配置',
            'search-columns': g,
            'search-grid-item-props': h,
            columns: D,
            data: u(q),
            pagination: u(L),
            loading: u(F),
            onSearch: u(_),
            onReset: w,
            onRefresh: u(S),
            onAdd: B
          },
          {
            protocol: p(({ row: a }) => [X(G(y[a.protocol]), 1)]),
            enabled: p(({ row: a }) => [m(M, { value: a.enabled, options: s }, null, 8, ['value'])]),
            status: p(({ row: a }) => [m(M, { value: a.status, options: i }, null, 8, ['value'])]),
            actions: p(({ row: a }) => [m(Q, { actions: W, onAction: (c) => E(c, a) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              m(
                z,
                {
                  visible: n.value,
                  'onUpdate:visible': l[0] || (l[0] = (a) => (n.value = a)),
                  form: o.value,
                  'onUpdate:form': l[1] || (l[1] = (a) => (o.value = a)),
                  mode: d.value,
                  onSubmit: K
                },
                null,
                8,
                ['visible', 'form', 'mode']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  ue = ee
export { ue as default }

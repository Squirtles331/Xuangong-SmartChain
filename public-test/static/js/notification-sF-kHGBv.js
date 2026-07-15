import {
  Bn as f,
  Fn as U,
  Kn as V,
  On as z,
  Xn as k,
  Yn as $,
  an as C,
  dn as m,
  i as p,
  pn as N,
  rn as A,
  rr as r,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { t as j } from './useTable-Hzr4fBAy.js'
import { t as x } from './StatusTag-DWd3m1xj.js'
import { t as G } from './CrudFormDialog-1OgQthWb.js'
import { t as X } from './CrudPage-7Q0FEhS_.js'
import { t as Y } from './CrudRowActions-Dmc4i_Io.js'
import { p as o } from './static-data-B3FhK4xc.js'
var H = N({
    __name: 'NotificationRuleFormDialog',
    props: R({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: b }) {
      const d = U(v, 'visible'),
        i = U(v, 'form'),
        h = b,
        y = A(() => [
          {
            type: 'select-v2',
            label: '业务类型',
            field: 'bizType',
            required: !0,
            props: {
              options: [
                { label: '工单审批', value: '工单审批' },
                { label: '工序派工', value: '工序派工' },
                { label: '质检通知', value: '质检通知' },
                { label: '异常上报', value: '异常上报' },
                { label: 'ECN 生效', value: 'ECN 生效' },
                { label: '应收逾期', value: '应收逾期' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '通知渠道',
            field: 'channel',
            required: !0,
            props: {
              options: [
                { label: '企业微信', value: 'wecom' },
                { label: '钉钉', value: 'dingtalk' },
                { label: '站内信', value: 'internal' }
              ]
            }
          },
          { type: 'input', label: 'Webhook 地址', field: 'webhookUrl', props: { placeholder: '企业微信/钉钉机器人 webhook' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ])
      function n() {
        return !i.value.bizType || !i.value.channel ? (p.warning('请完善通知规则信息'), !1) : !0
      }
      return (u, s) => (
        z(),
        C(
          G,
          {
            visible: d.value,
            'onUpdate:visible': s[0] || (s[0] = (a) => (d.value = a)),
            title: v.mode === 'add' ? '新增通知规则' : '编辑通知规则',
            form: i.value,
            'onUpdate:form': s[1] || (s[1] = (a) => (i.value = a)),
            columns: y.value,
            'label-width': 100,
            width: '600px',
            'before-submit': n,
            onSubmit: s[2] || (s[2] = (a) => h('submit'))
          },
          null,
          8,
          ['visible', 'title', 'form', 'columns']
        )
      )
    }
  }),
  J = H,
  L = N({
    __name: 'index',
    setup(v) {
      const b = [
          { label: '企业微信', value: 'wecom', type: 'success' },
          { label: '钉钉', value: 'dingtalk', type: 'primary' },
          { label: '站内消息', value: 'internal', type: 'warning' }
        ],
        d = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '停用', value: 'disabled', type: 'info' }
        ],
        i = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '业务类型 / Webhook 地址', clearable: !0 } },
          { type: 'select-v2', label: '通知渠道', field: 'channel', props: { options: b, clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: d, clearable: !0 } }
        ],
        h = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        y = [
          { prop: 'bizType', label: '业务类型', minWidth: 160 },
          { label: '通知渠道', minWidth: 100, slotName: 'channel', align: 'center' },
          { prop: 'webhookUrl', label: 'Webhook 地址', minWidth: 320 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = $({ keyword: '', channel: '', status: '' })
      const u = k(!1),
        s = k('add'),
        a = k(_()),
        w = A(() =>
          o.value.filter((e) => {
            const l = !n.keyword || e.bizType.includes(n.keyword) || e.webhookUrl.includes(n.keyword),
              t = !n.channel || e.channel === n.channel,
              c = !n.status || e.status === n.status
            return l && t && c
          })
        ),
        {
          tableData: D,
          pagination: M,
          loading: S,
          search: T,
          refresh: g,
          onDelete: W
        } = j({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => {
            const t = (e - 1) * l,
              c = t + l
            return { list: w.value.slice(t, c), total: w.value.length }
          },
          deleteAPI: async (e) => {
            o.value = o.value.filter((l) => !e.includes(l.id))
          }
        })
      function _() {
        return { id: '', bizType: '工单审批', channel: 'wecom', webhookUrl: '', status: 'active' }
      }
      function F() {
        ;(Object.assign(n, { keyword: '', channel: '', status: '' }), T())
      }
      function q() {
        ;((s.value = 'add'), (a.value = _()), (u.value = !0))
      }
      function E(e) {
        ;((s.value = 'edit'),
          (a.value = { id: e.id, bizType: e.bizType, channel: e.channel, webhookUrl: e.webhookUrl, status: e.status }),
          (u.value = !0))
      }
      function O(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'test', label: '发送测试', tone: 'secondary' },
          { key: 'toggle', label: e.status === 'active' ? '停用' : '启用', tone: e.status === 'active' ? 'warning' : 'success' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function P(e, l) {
        if (e === 'edit') {
          E(l)
          return
        }
        if (e === 'test') {
          I(l)
          return
        }
        if (e === 'toggle') {
          K(l)
          return
        }
        e === 'delete' && W(l)
      }
      async function B() {
        if (!a.value.bizType) {
          p.warning('请填写业务类型')
          return
        }
        ;(s.value === 'add'
          ? o.value.unshift({
              id: `NOTICE-${String(o.value.length + 1).padStart(3, '0')}`,
              bizType: a.value.bizType,
              channel: a.value.channel,
              webhookUrl: a.value.webhookUrl,
              status: a.value.status
            })
          : (o.value = o.value.map((e) =>
              e.id === a.value.id
                ? { ...e, bizType: a.value.bizType, channel: a.value.channel, webhookUrl: a.value.webhookUrl, status: a.value.status }
                : e
            )),
          (u.value = !1),
          await g(),
          p.success(s.value === 'add' ? '已新增静态通知规则数据' : '已更新静态通知规则数据'))
      }
      async function I(e) {
        p.success(`已发送静态测试消息：${e.bizType}`)
      }
      async function K(e) {
        ;((e.status = e.status === 'active' ? 'disabled' : 'active'), p.success(e.status === 'active' ? '规则已启用' : '规则已停用'), await g())
      }
      return (e, l) => (
        z(),
        C(
          X,
          {
            'search-model': r(n),
            'onUpdate:searchModel': l[2] || (l[2] = (t) => (V(n) ? (n.value = t) : (n = t))),
            title: '通知规则',
            'search-columns': i,
            'search-grid-item-props': h,
            columns: y,
            data: r(D),
            pagination: r(M),
            loading: r(S),
            onSearch: r(T),
            onReset: F,
            onRefresh: r(g),
            onAdd: q
          },
          {
            channel: f(({ row: t }) => [m(x, { value: t.channel, options: b }, null, 8, ['value'])]),
            status: f(({ row: t }) => [m(x, { value: t.status, options: d }, null, 8, ['value'])]),
            actions: f(({ row: t }) => [m(Y, { actions: O(t), onAction: (c) => P(c, t) }, null, 8, ['actions', 'onAction'])]),
            dialog: f(() => [
              m(
                J,
                {
                  visible: u.value,
                  'onUpdate:visible': l[0] || (l[0] = (t) => (u.value = t)),
                  form: a.value,
                  'onUpdate:form': l[1] || (l[1] = (t) => (a.value = t)),
                  mode: s.value,
                  onSubmit: B
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
  se = L
export { se as default }

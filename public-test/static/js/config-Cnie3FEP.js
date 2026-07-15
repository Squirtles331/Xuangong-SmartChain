import {
  Bn as e,
  Fn as V,
  Kn as j,
  Mn as m,
  On as A,
  Xn as h,
  Yn as G,
  an as D,
  bn as L,
  dn as t,
  i as k,
  it as X,
  pn as O,
  rn as Y,
  rr as i,
  sr as I,
  un as P,
  yn as w
} from './element-plus-CzL7BOKu.js'
import { I as $ } from './index-DqMfCNbk.js'
import { t as H } from './useTable-Hzr4fBAy.js'
import { t as J } from './TableSetting-BqN9x3yX.js'
import { t as Z } from './SearchSetting-RejIVc8W.js'
import { a as ee, l as te, m as le, r as oe } from './iot-C87u5rse.js'
var ae = O({
    __name: 'IoTConfigFormDialog',
    props: w({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: w(['submit'], ['update:visible', 'update:form']),
    setup(b, { emit: _ }) {
      const T = b,
        f = V(b, 'visible'),
        l = V(b, 'form'),
        y = _,
        u = [
          { label: '已连接', value: 'connected' },
          { label: '已断开', value: 'disconnected' }
        ],
        p = Y(() => (T.mode === 'add' ? '新增连接配置' : '编辑连接配置')),
        o = [
          { type: 'input', label: '设备名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '通信协议',
            field: 'protocol',
            required: !0,
            props: {
              options: [
                { label: 'OPC UA', value: 'OPC UA' },
                { label: 'MQTT', value: 'MQTT' },
                { label: 'Modbus', value: 'Modbus' }
              ]
            }
          },
          { type: 'input', label: '连接地址', field: 'address', required: !0 },
          { type: 'input-number', label: '端口', field: 'port', required: !0, props: { min: 1, max: 65535 } },
          { type: 'input', label: '采集间隔', field: 'interval' },
          { type: 'select-v2', label: '连接状态', field: 'status', props: { options: u } }
        ]
      function x() {
        f.value = !1
      }
      async function v() {
        return (y('submit'), !1)
      }
      return (S, d) => {
        const g = m('gi-form'),
          M = m('gi-dialog')
        return (
          A(),
          D(
            M,
            {
              modelValue: f.value,
              'onUpdate:modelValue': d[1] || (d[1] = (c) => (f.value = c)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': v,
              'on-cancel': x,
              title: p.value,
              width: '600px'
            },
            {
              default: e(() => [
                t(g, { modelValue: l.value, 'onUpdate:modelValue': d[0] || (d[0] = (c) => (l.value = c)), columns: o, 'label-width': 110 }, null, 8, [
                  'modelValue'
                ])
              ]),
              _: 1
            },
            8,
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  ne = ae,
  ie = O({
    __name: 'index',
    setup(b) {
      const _ = [
          { type: 'input', label: '关键词', field: 'keyword' },
          {
            type: 'select-v2',
            label: '通信协议',
            field: 'protocol',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: 'OPC UA', value: 'OPC UA' },
                { label: 'MQTT', value: 'MQTT' },
                { label: 'Modbus', value: 'Modbus' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '连接状态',
            field: 'status',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '已连接', value: 'connected' },
                { label: '已断开', value: 'disconnected' }
              ]
            }
          }
        ],
        T = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        f = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'name', label: '设备名称', minWidth: 180 },
          { prop: 'protocol', label: '通信协议', minWidth: 100, align: 'center', slotName: 'protocol' },
          { prop: 'address', label: '连接地址', minWidth: 220 },
          { prop: 'port', label: '端口', minWidth: 80, align: 'center' },
          { prop: 'interval', label: '采集间隔', minWidth: 100, align: 'center' },
          { prop: 'status', label: '连接状态', minWidth: 100, align: 'center', slotName: 'status' },
          { label: '操作', minWidth: 180, align: 'center', slotName: 'actions' }
        ]
      let l = G({ keyword: '', protocol: '', status: '' })
      const y = h([..._]),
        u = h(!1),
        p = h('add'),
        o = h(c()),
        {
          tableData: x,
          pagination: v,
          loading: S,
          search: d,
          refresh: g,
          onDelete: M
        } = H({
          rowKey: 'id',
          listAPI: async ({ page: s, size: n }) =>
            (await te({ pageNum: s, pageSize: n, keyword: l.keyword || void 0, protocol: l.protocol || void 0, status: l.status || void 0 })).data,
          deleteAPI: (s) => Promise.all(s.map((n) => ee(n)))
        })
      function c() {
        return { id: '', name: '', protocol: 'OPC UA', address: '', port: 4840, interval: '1s', status: 'connected' }
      }
      function W(s) {
        y.value = s
      }
      function q() {
        ;(Object.assign(l, { keyword: '', protocol: '', status: '' }), d())
      }
      function F() {
        ;((p.value = 'add'), (o.value = c()), (u.value = !0))
      }
      function N(s) {
        ;((p.value = 'edit'), (o.value = { ...s }), (u.value = !0))
      }
      async function Q() {
        if (!o.value.name || !o.value.address) {
          k.warning('请填写设备名称和连接地址')
          return
        }
        ;(p.value === 'add' ? (await oe(o.value), k.success('新增成功')) : (await le(o.value.id, o.value), k.success('编辑成功')),
          (u.value = !1),
          await g())
      }
      return (s, n) => {
        const R = m('gi-form'),
          C = m('gi-button'),
          U = X,
          B = m('gi-table'),
          E = m('gi-page-layout')
        return (
          A(),
          D(E, null, {
            header: e(() => [
              t(
                Z,
                { columns: _, 'onUpdate:visibleFields': W },
                {
                  default: e(() => [
                    t(
                      R,
                      {
                        modelValue: i(l),
                        'onUpdate:modelValue': n[0] || (n[0] = (r) => (j(l) ? (l.value = r) : (l = r))),
                        columns: y.value,
                        'grid-item-props': T,
                        search: '',
                        onSearch: i(d),
                        onReset: q
                      },
                      null,
                      8,
                      ['modelValue', 'columns', 'onSearch']
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            tool: e(() => [
              t(C, { type: 'add', onClick: F }),
              t(C, { type: 'reset', style: { 'margin-left': '8px' }, onClick: i(g) }, null, 8, ['onClick'])
            ]),
            default: e(() => [
              t(
                J,
                { title: 'IoT 连接配置', columns: f, onRefresh: i(g) },
                {
                  default: e(({ settingColumns: r, tableProps: z }) => [
                    t(
                      B,
                      L({ columns: r, data: i(x), pagination: i(v), loading: i(S) }, z, { border: '', style: { height: '100%' } }),
                      {
                        index: e(({ $index: a }) => [P(I(a + 1 + (i(v).currentPage - 1) * i(v).pageSize), 1)]),
                        protocol: e(({ row: a }) => [
                          t(
                            U,
                            { type: a.protocol === 'OPC UA' ? 'primary' : a.protocol === 'MQTT' ? 'success' : 'warning' },
                            { default: e(() => [P(I(a.protocol), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        status: e(({ row: a }) => [
                          t(
                            U,
                            { type: a.status === 'connected' ? 'success' : 'danger' },
                            { default: e(() => [P(I(a.status === 'connected' ? '已连接' : '已断开'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: e(({ row: a }) => [
                          t(C, { type: 'edit', onClick: (K) => N(a) }, null, 8, ['onClick']),
                          t(C, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (K) => i(M)(a) }, null, 8, ['onClick'])
                        ]),
                        _: 1
                      },
                      16,
                      ['columns', 'data', 'pagination', 'loading']
                    )
                  ]),
                  _: 1
                },
                8,
                ['onRefresh']
              ),
              t(
                ne,
                {
                  visible: u.value,
                  'onUpdate:visible': n[1] || (n[1] = (r) => (u.value = r)),
                  form: o.value,
                  'onUpdate:form': n[2] || (n[2] = (r) => (o.value = r)),
                  mode: p.value,
                  onSubmit: Q
                },
                null,
                8,
                ['visible', 'form', 'mode']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  me = $(ie, [['__scopeId', 'data-v-1493f20a']])
export { me as default }

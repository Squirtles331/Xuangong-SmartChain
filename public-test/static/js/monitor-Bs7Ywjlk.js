import {
  An as M,
  Bn as n,
  En as C,
  Fn as F,
  H as k,
  Mn as E,
  On as p,
  Tn as N,
  U as V,
  W as z,
  Xn as b,
  an as f,
  dn as o,
  in as a,
  ir as I,
  it as x,
  on as B,
  or as T,
  pn as D,
  sn as S,
  sr as l,
  tn as U,
  tt as A,
  un as d,
  yn as L
} from './element-plus-CzL7BOKu.js'
import { I as O } from './index-DqMfCNbk.js'
import { d as q } from './iot-C87u5rse.js'
var H = D({
    __name: 'DeviceDetailDialog',
    props: L({ device: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {} }),
    emits: ['update:visible'],
    setup(s) {
      const c = F(s, 'visible')
      return (_, v) => {
        const i = z,
          m = x,
          g = V,
          y = k
        return (
          p(),
          f(
            y,
            {
              modelValue: c.value,
              'onUpdate:modelValue': v[0] || (v[0] = (u) => (c.value = u)),
              title: s.device?.name || '设备详情',
              width: '500px',
              'lock-scroll': !1
            },
            {
              default: n(() => [
                s.device
                  ? (p(),
                    f(
                      g,
                      { key: 0, column: 2, border: '' },
                      {
                        default: n(() => [
                          o(i, { label: '设备' }, { default: n(() => [d(l(s.device.name), 1)]), _: 1 }),
                          o(
                            i,
                            { label: '在线状态' },
                            {
                              default: n(() => [
                                o(
                                  m,
                                  { type: s.device.online ? 'success' : 'danger', size: 'small' },
                                  { default: n(() => [d(l(s.device.online ? '在线' : '离线'), 1)]), _: 1 },
                                  8,
                                  ['type']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          o(
                            i,
                            { label: '运行状态' },
                            {
                              default: n(() => [
                                o(
                                  m,
                                  { type: s.device.running ? 'success' : 'info', size: 'small' },
                                  { default: n(() => [d(l(s.device.running ? '运行中' : '空闲'), 1)]), _: 1 },
                                  8,
                                  ['type']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          o(i, { label: '转速' }, { default: n(() => [d(l(s.device.rpm) + ' rpm', 1)]), _: 1 }),
                          o(i, { label: '温度' }, { default: n(() => [d(l(s.device.temp.toFixed(1)) + ' °C', 1)]), _: 1 }),
                          o(i, { label: '电流' }, { default: n(() => [d(l(s.device.current.toFixed(1)) + ' A', 1)]), _: 1 }),
                          o(i, { label: '最近上报', span: 2 }, { default: n(() => [d(l(s.device.last_report), 1)]), _: 1 })
                        ]),
                        _: 1
                      }
                    ))
                  : B('', !0)
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
  W = H,
  X = { class: 'iot-grid' },
  $ = { class: 'iot-header' },
  j = { class: 'iot-name' },
  G = { class: 'iot-body' },
  J = { class: 'iot-row' },
  K = { class: 'iot-row' },
  P = { class: 'iot-row' },
  Q = { class: 'iot-row' },
  R = { class: 'iot-footer' },
  Y = D({
    __name: 'index',
    setup(s) {
      const c = b([]),
        _ = b(!1),
        v = b(null)
      let i = null
      function m(u) {
        ;((v.value = u), (_.value = !0))
      }
      async function g() {
        const u = await q({ pageNum: 1, pageSize: 100 }),
          e = '2026-06-30 12:00:00'
        c.value = u.data.list.map((r) => ({
          id: r.id,
          name: r.name,
          online: r.status !== 'maintenance',
          running: r.status === 'running',
          rpm: Number(r.rpm || 0),
          temp: Number(r.temp || 0),
          current: Number(r.power || 0),
          last_report: e
        }))
      }
      function y() {
        i = setInterval(() => {
          const u = new Date().toISOString().slice(0, 19).replace('T', ' ')
          c.value.forEach((e) => {
            e.online &&
              (e.running
                ? ((e.rpm = Math.max(0, Math.round(e.rpm + (Math.random() - 0.5) * 20))),
                  (e.temp = +(e.temp + (Math.random() - 0.5) * 0.8).toFixed(1)),
                  (e.current = Math.max(0, +(e.current + (Math.random() - 0.5) * 0.3).toFixed(1))))
                : ((e.temp = +(e.temp + (Math.random() - 0.5) * 0.3).toFixed(1)), (e.current = +(0.3 + Math.random() * 0.4).toFixed(1))),
              (e.last_report = u))
          })
        }, 3e3)
      }
      return (
        N(async () => {
          ;(await g(), y())
        }),
        C(() => {
          i && clearInterval(i)
        }),
        (u, e) => {
          const r = x,
            h = A,
            w = E('gi-page-layout')
          return (
            p(),
            f(w, null, {
              default: n(() => [
                a('div', X, [
                  (p(!0),
                  S(
                    U,
                    null,
                    M(
                      c.value,
                      (t) => (
                        p(),
                        f(
                          h,
                          { key: t.id, shadow: 'hover', class: I(['iot-card', t.online ? 'online' : 'offline']), onClick: (Z) => m(t) },
                          {
                            default: n(() => [
                              a('div', $, [
                                a('span', j, l(t.name), 1),
                                o(
                                  r,
                                  { type: t.online ? 'success' : 'danger', size: 'small' },
                                  { default: n(() => [d(l(t.online ? '在线' : '离线'), 1)]), _: 2 },
                                  1032,
                                  ['type']
                                )
                              ]),
                              a('div', G, [
                                a('div', J, [
                                  e[1] || (e[1] = a('span', null, '运行状态', -1)),
                                  o(
                                    r,
                                    { type: t.running ? 'success' : 'info', size: 'small' },
                                    { default: n(() => [d(l(t.running ? '运行中' : '空闲'), 1)]), _: 2 },
                                    1032,
                                    ['type']
                                  )
                                ]),
                                a('div', K, [e[2] || (e[2] = a('span', null, '转速', -1)), a('strong', null, l(t.rpm) + ' rpm', 1)]),
                                a('div', P, [
                                  e[3] || (e[3] = a('span', null, '温度', -1)),
                                  a('strong', { style: T({ color: t.temp > 60 ? '#f56c6c' : '' }) }, l(t.temp.toFixed(1)) + ' °C', 5)
                                ]),
                                a('div', Q, [e[4] || (e[4] = a('span', null, '电流', -1)), a('strong', null, l(t.current.toFixed(1)) + ' A', 1)])
                              ]),
                              a('div', R, '最近上报 ' + l(t.last_report), 1)
                            ]),
                            _: 2
                          },
                          1032,
                          ['class', 'onClick']
                        )
                      )
                    ),
                    128
                  ))
                ]),
                o(W, { visible: _.value, 'onUpdate:visible': e[0] || (e[0] = (t) => (_.value = t)), device: v.value }, null, 8, ['visible', 'device'])
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  ne = O(Y, [['__scopeId', 'data-v-4e4e1f00']])
export { ne as default }

import { C as d, D as l, E as w, M as o, O as p, S as c, T as g, b as f, g as n, k as v, v as y, w as I, x as T, y as h } from './index-DqMfCNbk.js'
var u = [
    {
      id: 'config-1',
      name: '数控车床 CK6150',
      protocol: 'OPC UA',
      address: 'opc.tcp://192.168.1.10',
      port: 4840,
      interval: '1s',
      status: 'connected'
    },
    { id: 'config-2', name: '钻床 Z3050', protocol: 'MQTT', address: 'mqtt://192.168.1.11', port: 1883, interval: '5s', status: 'connected' },
    {
      id: 'config-3',
      name: '加工中心 VMC850',
      protocol: 'OPC UA',
      address: 'opc.tcp://192.168.1.12',
      port: 4840,
      interval: '1s',
      status: 'connected'
    },
    { id: 'config-4', name: '磨床 M1432', protocol: 'Modbus', address: '192.168.1.13', port: 502, interval: '2s', status: 'connected' },
    { id: 'config-5', name: '铣床 X5032', protocol: 'MQTT', address: 'mqtt://192.168.1.14', port: 1883, interval: '10s', status: 'disconnected' }
  ],
  a = [
    {
      id: 'report-1',
      equipment: '数控车床 CK6150',
      trigger: 'cycle_complete',
      threshold: 1,
      wo_field: 'qualified_qty',
      default_qty: 1,
      status: 'active'
    },
    {
      id: 'report-2',
      equipment: '钻床 Z3050',
      trigger: 'count_reached',
      threshold: 100,
      wo_field: 'qualified_qty',
      default_qty: 100,
      status: 'active'
    },
    {
      id: 'report-3',
      equipment: '加工中心 VMC850',
      trigger: 'power_off',
      threshold: 0,
      wo_field: 'qualified_qty',
      default_qty: 1,
      status: 'disabled'
    }
  ],
  s = [
    { id: 'alert-1', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' },
    { id: 'alert-2', device: '钻床 Z3050', metric: 'current', operator: '>', threshold: 20, level: 'critical', status: 'active' },
    { id: 'alert-3', device: '加工中心 VMC850', metric: 'vibration', operator: '>', threshold: 4, level: 'warning', status: 'disabled' }
  ],
  m = [
    {
      id: 'history-1',
      device: '数控车床 CK6150',
      metric: 'temp',
      actual_value: 63.5,
      threshold: 60,
      level: 'warning',
      status: 'triggered',
      triggered_at: '2026-06-29 10:12:00',
      recovered_at: ''
    },
    {
      id: 'history-2',
      device: '钻床 Z3050',
      metric: 'current',
      actual_value: 21.2,
      threshold: 20,
      level: 'critical',
      status: 'recovered',
      triggered_at: '2026-06-29 14:26:00',
      recovered_at: '2026-06-29 14:31:00'
    },
    {
      id: 'history-3',
      device: '加工中心 VMC850',
      metric: 'vibration',
      actual_value: 4.3,
      threshold: 4,
      level: 'warning',
      status: 'triggered',
      triggered_at: '2026-06-30 08:05:00',
      recovered_at: ''
    }
  ],
  R = [
    { id: 'device-1', name: '数控车床 CK6150', type: '机加工设备', status: 'running', rpm: 1520, temp: 54.2, power: 18.6 },
    { id: 'device-2', name: '钻床 Z3050', type: '机加工设备', status: 'idle', rpm: 0, temp: 37.8, power: 0.6 },
    { id: 'device-3', name: '加工中心 VMC850', type: '机加工设备', status: 'running', rpm: 1260, temp: 49.5, power: 16.8 },
    { id: 'device-4', name: '热处理炉 HT-01', type: '热处理设备', status: 'maintenance', rpm: 0, temp: 0, power: 0 }
  ],
  C = Array.from({ length: 24 }, (e, t) => ({
    id: `log-${t + 1}`,
    device: '数控车床 CK6150',
    time: `2026-06-30 ${String(8 + Math.floor(t / 4)).padStart(2, '0')}:${String((t % 4) * 15).padStart(2, '0')}:00`,
    rpm: 1460 + (t % 5) * 15,
    temp: 50 + (t % 6),
    current: Number((17.2 + (t % 4) * 0.4).toFixed(1)),
    vibration: Number((2 + (t % 3) * 0.2).toFixed(2))
  }))
async function A(e) {
  await n()
  let t = [...u]
  ;(e.keyword && (t = I(t, e.keyword, ['name', 'address', 'protocol'])),
    e.protocol && (t = t.filter((r) => r.protocol === e.protocol)),
    e.status && (t = t.filter((r) => r.status === e.status)))
  const i = d(t, e.pageNum, e.pageSize)
  return f(i.list, i.total, i.pageNum, i.pageSize)
}
async function _(e) {
  await n()
  const t = { id: g(), ...e }
  return (u.unshift(t), y(t, '新增连接配置成功'))
}
async function $(e, t) {
  await n()
  const i = u.findIndex((r) => r.id === e)
  return i > -1 ? ((u[i] = { ...u[i], ...t }), c(u[i], '编辑连接配置成功')) : c({ id: e, ...t }, '编辑连接配置成功')
}
async function q(e) {
  await n()
  const t = u.findIndex((i) => i.id === e)
  return (t > -1 && u.splice(t, 1), T('删除连接配置成功'))
}
async function S(e) {
  await n()
  let t = [...a]
  ;(e.equipment && (t = I(t, e.equipment, ['equipment'])), e.status && (t = t.filter((r) => r.status === e.status)))
  const i = d(t, e.pageNum, e.pageSize)
  return f(i.list, i.total, i.pageNum, i.pageSize)
}
async function M(e) {
  await n()
  const t = { id: g(), ...e }
  return (a.unshift(t), y(t, '新增自动报工规则成功'))
}
async function N(e, t) {
  await n()
  const i = a.findIndex((r) => r.id === e)
  return i > -1 ? ((a[i] = { ...a[i], ...t }), c(a[i], '编辑自动报工规则成功')) : c({ id: e, ...t }, '编辑自动报工规则成功')
}
async function x() {
  return (await n(), h(s))
}
async function z(e) {
  await n()
  const t = { id: g(), ...e }
  return (s.unshift(t), y(t, '新增预警规则成功'))
}
async function L(e, t) {
  await n()
  const i = s.findIndex((r) => r.id === e)
  return i > -1 ? ((s[i] = { ...s[i], ...t }), c(s[i], '编辑预警规则成功')) : c({ id: e, ...t }, '编辑预警规则成功')
}
async function b(e) {
  await n()
  const t = s.findIndex((i) => i.id === e)
  return (t > -1 && s.splice(t, 1), T('删除预警规则成功'))
}
async function D(e) {
  await n()
  let t = [...m]
  ;(e.device && (t = I(t, e.device, ['device'])), e.level && (t = t.filter((r) => r.level === e.level)))
  const i = d(t, e.pageNum, e.pageSize)
  return f(i.list, i.total, i.pageNum, i.pageSize)
}
async function H(e) {
  await n()
  let t = [...R]
  ;(e.status && (t = t.filter((r) => r.status === e.status)), e.type && (t = t.filter((r) => r.type === e.type)))
  const i = d(t, e.pageNum, e.pageSize)
  return f(i.list, i.total, i.pageNum, i.pageSize)
}
async function K(e) {
  await n()
  let t = [...C]
  e.device && (t = t.filter((r) => r.device === e.device))
  const i = d(t, e.pageNum, e.pageSize)
  return f(i.list, i.total, i.pageNum, i.pageSize)
}
function Z(e) {
  return o ? A(e) : l('/iot/configs', { params: e })
}
function k(e) {
  return o ? _(e) : p('/iot/configs', e)
}
function P(e, t) {
  return o ? $(e, t) : v(`/iot/configs/${e}`, t)
}
function O(e) {
  return o ? q(e) : w(`/iot/configs/${e}`)
}
function U(e) {
  return o ? S(e) : l('/iot/auto-reports', { params: e })
}
function F(e) {
  return o ? M(e) : p('/iot/auto-reports', e)
}
function Q(e, t) {
  return o ? N(e, t) : v(`/iot/auto-reports/${e}`, t)
}
function E() {
  return o ? x() : l('/iot/alert-rules')
}
function G(e) {
  return o ? z(e) : p('/iot/alert-rules', e)
}
function X(e, t) {
  return o ? L(e, t) : v(`/iot/alert-rules/${e}`, t)
}
function j(e) {
  return o ? b(e) : w(`/iot/alert-rules/${e}`)
}
function B(e) {
  return o ? D(e) : l('/iot/alert-history', { params: e })
}
function J(e) {
  return o ? H(e) : l('/iot/devices', { params: e })
}
function W(e) {
  return o ? K(e) : l('/iot/history', { params: e })
}
export { O as a, U as c, J as d, X as f, j as i, Z as l, P as m, F as n, B as o, Q as p, k as r, E as s, G as t, W as u }

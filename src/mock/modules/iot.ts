export const iotConfigs = [
  { id: 'config-1', name: '数控车床 CK6150', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.10', port: 4840, interval: '1s', status: 'connected' },
  { id: 'config-2', name: '钻床 Z3050', protocol: 'MQTT', address: 'mqtt://192.168.1.11', port: 1883, interval: '5s', status: 'connected' },
  { id: 'config-3', name: '加工中心 VMC850', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.12', port: 4840, interval: '1s', status: 'connected' },
  { id: 'config-4', name: '磨床 M1432', protocol: 'Modbus', address: '192.168.1.13', port: 502, interval: '2s', status: 'connected' },
  { id: 'config-5', name: '铣床 X5032', protocol: 'MQTT', address: 'mqtt://192.168.1.14', port: 1883, interval: '10s', status: 'disconnected' }
]

export const iotAutoReportRules = [
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
]

export const iotAlertRules = [
  { id: 'alert-1', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' },
  { id: 'alert-2', device: '钻床 Z3050', metric: 'current', operator: '>', threshold: 20, level: 'critical', status: 'active' },
  { id: 'alert-3', device: '加工中心 VMC850', metric: 'vibration', operator: '>', threshold: 4, level: 'warning', status: 'disabled' }
]

export const iotAlertHistory = [
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
]

export const iotDevices = [
  { id: 'device-1', name: '数控车床 CK6150', type: '机加工设备', status: 'running', rpm: 1520, temp: 54.2, power: 18.6 },
  { id: 'device-2', name: '钻床 Z3050', type: '机加工设备', status: 'idle', rpm: 0, temp: 37.8, power: 0.6 },
  { id: 'device-3', name: '加工中心 VMC850', type: '机加工设备', status: 'running', rpm: 1260, temp: 49.5, power: 16.8 },
  { id: 'device-4', name: '热处理炉 HT-01', type: '热处理设备', status: 'maintenance', rpm: 0, temp: 0, power: 0 }
]

export const iotHistoryLogs = Array.from({ length: 24 }, (_, index) => ({
  id: `log-${index + 1}`,
  device: '数控车床 CK6150',
  time: `2026-06-30 ${String(8 + Math.floor(index / 4)).padStart(2, '0')}:${String((index % 4) * 15).padStart(2, '0')}:00`,
  rpm: 1460 + (index % 5) * 15,
  temp: 50 + (index % 6),
  current: Number((17.2 + (index % 4) * 0.4).toFixed(1)),
  vibration: Number((2 + (index % 3) * 0.2).toFixed(2))
}))

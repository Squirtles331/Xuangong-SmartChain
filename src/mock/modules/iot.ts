// IoT mock data
export const iotConfigs = [
  { id: '1', name: '数控车床 CK6150', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.10', port: 4840, interval: '1s', status: 'connected' },
  { id: '2', name: '钻床 Z3050', protocol: 'MQTT', address: 'mqtt://192.168.1.11', port: 1883, interval: '5s', status: 'connected' },
  { id: '3', name: '加工中心 VMC850', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.12', port: 4840, interval: '1s', status: 'connected' },
  { id: '4', name: '磨床 M1432', protocol: 'Modbus', address: '192.168.1.13', port: 502, interval: '2s', status: 'connected' },
  { id: '5', name: '铣床 X5032', protocol: 'MQTT', address: 'mqtt://192.168.1.14', port: 1883, interval: '10s', status: 'disconnected' },
  { id: '6', name: '镗床 T611B', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.15', port: 4840, interval: '1s', status: 'connected' },
  { id: '7', name: '热处理炉', protocol: 'Modbus', address: '192.168.1.16', port: 502, interval: '5s', status: 'disconnected' }
]

export const iotAutoReportRules = [
  { id: '1', equipment: '数控车床 CK6150', trigger: 'cycle_complete', threshold: 1, wo_field: 'qualified_qty', default_qty: 1, status: 'active' },
  { id: '2', equipment: '钻床 Z3050', trigger: 'count_reached', threshold: 100, wo_field: 'qualified_qty', default_qty: 100, status: 'active' },
  { id: '3', equipment: '加工中心 VMC850', trigger: 'power_off', threshold: 0, wo_field: 'qualified_qty', default_qty: 1, status: 'disabled' }
]

export const iotHistoryLogs = Array.from({ length: 20 }, (_, i) => ({
  time: `2025-01-15 ${String(8 + Math.floor(i / 4)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
  rpm: 1400 + Math.floor(Math.random() * 200),
  temp: 48 + Math.floor(Math.random() * 10),
  current: +(16 + Math.random() * 5).toFixed(1),
  vibration: +(2 + Math.random() * 1).toFixed(2)
}))

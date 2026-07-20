import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/mock/shared/response'

const REFERENCE_NOW = '2026-07-16 10:30:00'

export type IotProtocol = 'OPC UA' | 'MQTT' | 'Modbus TCP' | 'HTTP'
export type IotConnectionStatus = 'connected' | 'disconnected' | 'error' | 'maintenance'
export type IotPointMetric = 'temperature' | 'rpm' | 'current' | 'vibration' | 'pressure' | 'count' | 'status'
export type IotPointStatus = 'active' | 'disabled' | 'error'
export type IotRunStatus = 'running' | 'idle' | 'stopped' | 'maintenance'
export type IotAlarmLevel = 'critical' | 'warning' | 'info'
export type IotAlarmStatus = 'triggered' | 'acknowledged' | 'recovered' | 'closed'

export interface IotConnectionRecord {
  id: string
  code: string
  equipment_code: string
  equipment_name: string
  workshop: string
  line: string
  protocol: IotProtocol
  gateway: string
  endpoint: string
  collect_interval: number
  status: IotConnectionStatus
  last_heartbeat: string
  owner: string
}

export interface IotConnectionQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  protocol?: IotProtocol
  status?: IotConnectionStatus
}

export interface IotPointRecord {
  id: string
  code: string
  name: string
  connection_id: string
  equipment_code: string
  equipment_name: string
  metric: IotPointMetric
  unit: string
  address: string
  collect_interval: number
  lower_limit: number | null
  upper_limit: number | null
  status: IotPointStatus
}

export interface IotPointQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  metric?: IotPointMetric
  status?: IotPointStatus
}

export interface IotMonitorSnapshot {
  id: string
  equipment_code: string
  equipment_name: string
  workshop: string
  line: string
  connection_status: IotConnectionStatus
  run_status: IotRunStatus
  sample_time: string
  rpm: number
  temperature: number
  current: number
  vibration: number
  gateway: string
  alarm_count: number
}

export interface IotMonitorQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  run_status?: IotRunStatus
  connection_status?: IotConnectionStatus
}

export interface IotPointSample {
  id: string
  equipment_code: string
  point_code: string
  point_name: string
  value: number | string
  unit: string
  status: 'normal' | 'warning' | 'error'
  sampled_at: string
}

export interface IotAlarmRecord {
  id: string
  code: string
  equipment_code: string
  equipment_name: string
  point_name: string
  metric: IotPointMetric
  level: IotAlarmLevel
  trigger_value: number
  threshold_desc: string
  status: IotAlarmStatus
  triggered_at: string
  recovered_at: string
  handler: string
  source: string
  related_repair: string
}

export interface IotAlarmQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  level?: IotAlarmLevel
  status?: IotAlarmStatus
}

export const iotProtocolOptions = [
  { label: 'OPC UA', value: 'OPC UA' },
  { label: 'MQTT', value: 'MQTT' },
  { label: 'Modbus TCP', value: 'Modbus TCP' },
  { label: 'HTTP', value: 'HTTP' }
]

export const iotConnectionStatusOptions = [
  { value: 'connected', label: '已连接', type: 'success' as const },
  { value: 'disconnected', label: '已断开', type: 'info' as const },
  { value: 'error', label: '异常', type: 'danger' as const },
  { value: 'maintenance', label: '维护中', type: 'warning' as const }
]

export const iotPointMetricOptions = [
  { label: '温度', value: 'temperature' },
  { label: '转速', value: 'rpm' },
  { label: '电流', value: 'current' },
  { label: '振动', value: 'vibration' },
  { label: '压力', value: 'pressure' },
  { label: '计数', value: 'count' },
  { label: '状态', value: 'status' }
]

export const iotPointStatusOptions = [
  { value: 'active', label: '启用', type: 'success' as const },
  { value: 'disabled', label: '停用', type: 'info' as const },
  { value: 'error', label: '异常', type: 'danger' as const }
]

export const iotRunStatusOptions = [
  { value: 'running', label: '运行中', type: 'success' as const },
  { value: 'idle', label: '待机', type: 'info' as const },
  { value: 'stopped', label: '停机', type: 'warning' as const },
  { value: 'maintenance', label: '维护中', type: 'danger' as const }
]

export const iotAlarmLevelOptions = [
  { value: 'critical', label: '严重', type: 'danger' as const },
  { value: 'warning', label: '预警', type: 'warning' as const },
  { value: 'info', label: '提示', type: 'info' as const }
]

export const iotAlarmStatusOptions = [
  { value: 'triggered', label: '已触发', type: 'danger' as const },
  { value: 'acknowledged', label: '已确认', type: 'warning' as const },
  { value: 'recovered', label: '已恢复', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const connectionState: IotConnectionRecord[] = [
  {
    id: 'iot-conn-001',
    code: 'IOT-CN-001',
    equipment_code: 'EQ-CK6150-01',
    equipment_name: '数控车床 CK6150',
    workshop: '机加一车间',
    line: '车削产线 A',
    protocol: 'OPC UA',
    gateway: '边缘网关 GW-A01',
    endpoint: 'opc.tcp://192.168.10.21:4840',
    collect_interval: 1,
    status: 'connected',
    last_heartbeat: '2026-07-16 10:29:41',
    owner: '周采集'
  },
  {
    id: 'iot-conn-002',
    code: 'IOT-CN-002',
    equipment_code: 'EQ-Z3050-02',
    equipment_name: '摇臂钻床 Z3050',
    workshop: '机加二车间',
    line: '钻攻单元 B',
    protocol: 'MQTT',
    gateway: '边缘网关 GW-B02',
    endpoint: 'mqtt://192.168.10.34:1883/equipment/z3050',
    collect_interval: 5,
    status: 'connected',
    last_heartbeat: '2026-07-16 10:29:36',
    owner: '刘采集'
  },
  {
    id: 'iot-conn-003',
    code: 'IOT-CN-003',
    equipment_code: 'EQ-M1432-03',
    equipment_name: '外圆磨床 M1432',
    workshop: '装配车间',
    line: '磨削单元 C',
    protocol: 'Modbus TCP',
    gateway: '边缘网关 GW-C03',
    endpoint: '192.168.10.45:502',
    collect_interval: 2,
    status: 'error',
    last_heartbeat: '2026-07-16 10:18:05',
    owner: '王采集'
  },
  {
    id: 'iot-conn-004',
    code: 'IOT-CN-004',
    equipment_code: 'EQ-HT01-04',
    equipment_name: '箱式热处理炉 HT-01',
    workshop: '热处理车间',
    line: '热处理产线',
    protocol: 'OPC UA',
    gateway: '边缘网关 GW-H01',
    endpoint: 'opc.tcp://192.168.10.61:4840',
    collect_interval: 1,
    status: 'maintenance',
    last_heartbeat: '2026-07-16 09:45:12',
    owner: '陈采集'
  }
]

const pointState: IotPointRecord[] = [
  {
    id: 'iot-point-001',
    code: 'PT-CK6150-RPM',
    name: '主轴转速',
    connection_id: 'iot-conn-001',
    equipment_code: 'EQ-CK6150-01',
    equipment_name: '数控车床 CK6150',
    metric: 'rpm',
    unit: 'rpm',
    address: 'ns=2;s=Spindle.Speed',
    collect_interval: 1,
    lower_limit: 0,
    upper_limit: 3000,
    status: 'active'
  },
  {
    id: 'iot-point-002',
    code: 'PT-CK6150-TEMP',
    name: '主轴温度',
    connection_id: 'iot-conn-001',
    equipment_code: 'EQ-CK6150-01',
    equipment_name: '数控车床 CK6150',
    metric: 'temperature',
    unit: 'degC',
    address: 'ns=2;s=Spindle.Temp',
    collect_interval: 1,
    lower_limit: 0,
    upper_limit: 60,
    status: 'active'
  },
  {
    id: 'iot-point-003',
    code: 'PT-Z3050-CURRENT',
    name: '主电机电流',
    connection_id: 'iot-conn-002',
    equipment_code: 'EQ-Z3050-02',
    equipment_name: '摇臂钻床 Z3050',
    metric: 'current',
    unit: 'A',
    address: 'z3050/main/current',
    collect_interval: 5,
    lower_limit: 0,
    upper_limit: 18,
    status: 'active'
  },
  {
    id: 'iot-point-004',
    code: 'PT-M1432-VIB',
    name: '主轴振动',
    connection_id: 'iot-conn-003',
    equipment_code: 'EQ-M1432-03',
    equipment_name: '外圆磨床 M1432',
    metric: 'vibration',
    unit: 'mm/s',
    address: '40021',
    collect_interval: 2,
    lower_limit: 0,
    upper_limit: 4,
    status: 'error'
  },
  {
    id: 'iot-point-005',
    code: 'PT-HT01-TEMP',
    name: '二区炉温',
    connection_id: 'iot-conn-004',
    equipment_code: 'EQ-HT01-04',
    equipment_name: '箱式热处理炉 HT-01',
    metric: 'temperature',
    unit: 'degC',
    address: 'ns=2;s=Zone2.Temp',
    collect_interval: 1,
    lower_limit: 820,
    upper_limit: 880,
    status: 'active'
  }
]

const alarmState: IotAlarmRecord[] = [
  {
    id: 'iot-alarm-001',
    code: 'ALM-20260716-001',
    equipment_code: 'EQ-HT01-04',
    equipment_name: '箱式热处理炉 HT-01',
    point_name: '二区炉温',
    metric: 'temperature',
    level: 'critical',
    trigger_value: 902,
    threshold_desc: '> 880 degC',
    status: 'acknowledged',
    triggered_at: '2026-07-16 09:46:28',
    recovered_at: '',
    handler: '陈采集',
    source: '边缘网关 GW-H01',
    related_repair: 'RP-202607-001'
  },
  {
    id: 'iot-alarm-002',
    code: 'ALM-20260716-002',
    equipment_code: 'EQ-M1432-03',
    equipment_name: '外圆磨床 M1432',
    point_name: '主轴振动',
    metric: 'vibration',
    level: 'warning',
    trigger_value: 4.6,
    threshold_desc: '> 4 mm/s',
    status: 'triggered',
    triggered_at: '2026-07-16 10:18:05',
    recovered_at: '',
    handler: '',
    source: '边缘网关 GW-C03',
    related_repair: '待转维修'
  },
  {
    id: 'iot-alarm-003',
    code: 'ALM-20260715-006',
    equipment_code: 'EQ-CK6150-01',
    equipment_name: '数控车床 CK6150',
    point_name: '主轴温度',
    metric: 'temperature',
    level: 'warning',
    trigger_value: 63.5,
    threshold_desc: '> 60 degC',
    status: 'recovered',
    triggered_at: '2026-07-15 14:08:31',
    recovered_at: '2026-07-15 14:16:22',
    handler: '周采集',
    source: '边缘网关 GW-A01',
    related_repair: ''
  }
]

function buildCode(prefix: string, size: number) {
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(size + 1).padStart(3, '0')}`
}

function getConnectionById(id?: string) {
  return connectionState.find((item) => item.id === id) || connectionState[0]
}

function normalizeConnection(data: Partial<IotConnectionRecord>, current?: IotConnectionRecord): IotConnectionRecord {
  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('IOT-CN', connectionState.length),
    equipment_code: data.equipment_code || current?.equipment_code || 'EQ-NEW',
    equipment_name: data.equipment_name || current?.equipment_name || '',
    workshop: data.workshop || current?.workshop || '机加一车间',
    line: data.line || current?.line || '设备采集单元',
    protocol: (data.protocol || current?.protocol || 'OPC UA') as IotProtocol,
    gateway: data.gateway || current?.gateway || '',
    endpoint: data.endpoint || current?.endpoint || '',
    collect_interval: Number(data.collect_interval ?? current?.collect_interval ?? 1),
    status: (data.status || current?.status || 'connected') as IotConnectionStatus,
    last_heartbeat: data.last_heartbeat || current?.last_heartbeat || REFERENCE_NOW,
    owner: data.owner || current?.owner || '采集管理员'
  }
}

function normalizePoint(data: Partial<IotPointRecord>, current?: IotPointRecord): IotPointRecord {
  const connection = getConnectionById(data.connection_id || current?.connection_id)

  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('PT', pointState.length),
    name: data.name || current?.name || '',
    connection_id: connection.id,
    equipment_code: connection.equipment_code,
    equipment_name: connection.equipment_name,
    metric: (data.metric || current?.metric || 'temperature') as IotPointMetric,
    unit: data.unit || current?.unit || '',
    address: data.address || current?.address || '',
    collect_interval: Number(data.collect_interval ?? current?.collect_interval ?? connection.collect_interval),
    lower_limit: data.lower_limit ?? current?.lower_limit ?? null,
    upper_limit: data.upper_limit ?? current?.upper_limit ?? null,
    status: (data.status || current?.status || 'active') as IotPointStatus
  }
}

function filterConnections(params: Omit<IotConnectionQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...connectionState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'equipment_code', 'equipment_name', 'gateway', 'endpoint', 'owner'])
  }
  if (params.protocol) {
    filtered = filtered.filter((item) => item.protocol === params.protocol)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterPoints(params: Omit<IotPointQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...pointState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'name', 'equipment_code', 'equipment_name', 'address'])
  }
  if (params.metric) {
    filtered = filtered.filter((item) => item.metric === params.metric)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterMonitor(params: Omit<IotMonitorQuery, 'pageNum' | 'pageSize'>) {
  let filtered = buildMonitorSnapshots()

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['equipment_code', 'equipment_name', 'workshop', 'line', 'gateway'])
  }
  if (params.run_status) {
    filtered = filtered.filter((item) => item.run_status === params.run_status)
  }
  if (params.connection_status) {
    filtered = filtered.filter((item) => item.connection_status === params.connection_status)
  }

  return filtered
}

function filterAlarms(params: Omit<IotAlarmQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...alarmState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'equipment_code', 'equipment_name', 'point_name', 'source', 'related_repair'])
  }
  if (params.level) {
    filtered = filtered.filter((item) => item.level === params.level)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function buildMonitorSnapshots(): IotMonitorSnapshot[] {
  return connectionState.map((connection, index) => {
    const alarmCount = alarmState.filter((alarm) => alarm.equipment_code === connection.equipment_code && alarm.status !== 'closed').length
    const runStatus: IotRunStatus =
      connection.status === 'maintenance' ? 'maintenance' : connection.status === 'error' ? 'stopped' : index % 2 === 0 ? 'running' : 'idle'

    return {
      id: `monitor-${connection.id}`,
      equipment_code: connection.equipment_code,
      equipment_name: connection.equipment_name,
      workshop: connection.workshop,
      line: connection.line,
      connection_status: connection.status,
      run_status: runStatus,
      sample_time: connection.last_heartbeat,
      rpm: runStatus === 'running' ? 1450 + index * 35 : 0,
      temperature: connection.equipment_code === 'EQ-HT01-04' ? 902 : 46 + index * 4,
      current: runStatus === 'running' ? Number((16.2 + index * 0.7).toFixed(1)) : 0.6,
      vibration: Number((2.1 + index * 0.8).toFixed(1)),
      gateway: connection.gateway,
      alarm_count: alarmCount
    }
  })
}

export function getIotConnectionOptions() {
  return connectionState.map((item) => ({
    label: `${item.equipment_name} (${item.code})`,
    value: item.id
  }))
}

export async function getIotConnectionList(params: IotConnectionQuery) {
  const filtered = filterConnections(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveIotConnection(data: Partial<IotConnectionRecord>) {
  const index = connectionState.findIndex((item) => item.id === data.id)
  const record = normalizeConnection(data, index >= 0 ? connectionState[index] : undefined)

  if (index >= 0) {
    connectionState[index] = record
    return wrapUpdatedResponse(record, '设备连接已更新')
  }

  connectionState.unshift(record)
  return wrapCreatedResponse(record, '设备连接已新增')
}

export async function deleteIotConnection(id: string) {
  const index = connectionState.findIndex((item) => item.id === id)
  if (index >= 0) {
    connectionState.splice(index, 1)
  }
  return wrapSuccessResponse('设备连接已删除')
}

export async function getIotPointList(params: IotPointQuery) {
  const filtered = filterPoints(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveIotPoint(data: Partial<IotPointRecord>) {
  const index = pointState.findIndex((item) => item.id === data.id)
  const record = normalizePoint(data, index >= 0 ? pointState[index] : undefined)

  if (index >= 0) {
    pointState[index] = record
    return wrapUpdatedResponse(record, '采集点位已更新')
  }

  pointState.unshift(record)
  return wrapCreatedResponse(record, '采集点位已新增')
}

export async function deleteIotPoint(id: string) {
  const index = pointState.findIndex((item) => item.id === id)
  if (index >= 0) {
    pointState.splice(index, 1)
  }
  return wrapSuccessResponse('采集点位已删除')
}

export async function getIotMonitorList(params: IotMonitorQuery) {
  const filtered = filterMonitor(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIotPointSamples(equipmentCode: string) {
  const points = pointState.filter((point) => point.equipment_code === equipmentCode)
  const samples: IotPointSample[] = points.map((point, index) => {
    const alarm = alarmState.find((item) => item.equipment_code === equipmentCode && item.point_name === point.name && item.status !== 'closed')
    const value =
      alarm?.trigger_value ??
      (point.metric === 'rpm' ? 1480 : point.metric === 'temperature' ? 52 + index * 2 : point.metric === 'current' ? 16.8 : 2.4)
    return {
      id: `sample-${point.id}`,
      equipment_code: equipmentCode,
      point_code: point.code,
      point_name: point.name,
      value,
      unit: point.unit,
      status: alarm ? (alarm.level === 'critical' ? 'error' : 'warning') : 'normal',
      sampled_at: REFERENCE_NOW
    }
  })

  return wrapListResponse(samples, samples.length, 1, Math.max(samples.length, 1))
}

export async function getIotAlarmList(params: IotAlarmQuery) {
  const filtered = filterAlarms(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function updateIotAlarmStatus(id: string, status: IotAlarmStatus, handler?: string) {
  const target = alarmState.find((item) => item.id === id)
  if (target) {
    target.status = status
    target.handler = handler || target.handler || '当前用户'
    if (status === 'recovered' || status === 'closed') {
      target.recovered_at = target.recovered_at || REFERENCE_NOW
    }
    return wrapUpdatedResponse(target, '报警状态已更新')
  }

  return wrapUpdatedResponse(null, '报警状态已更新')
}

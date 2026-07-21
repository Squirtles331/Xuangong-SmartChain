import { deleteIotConnection, getIotAlarmList, getIotConnectionList, getIotMonitorList, saveIotConnection } from '@/static/services/iot'
import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/static/utils/response'

type ApiIotRecord = Record<string, any>

const autoReportRuleState: ApiIotRecord[] = [
  {
    id: 'iot-auto-001',
    equipment: '鏁版帶杞﹀簥 CK6150',
    trigger: 'cycle_complete',
    threshold: 1,
    wo_field: 'qualified_qty',
    default_qty: 1,
    status: 'active'
  },
  {
    id: 'iot-auto-002',
    equipment: '閽诲簥 Z3050',
    trigger: 'count_reached',
    threshold: 20,
    wo_field: 'qualified_qty',
    default_qty: 20,
    status: 'disabled'
  }
]

const alertRuleState: ApiIotRecord[] = [
  {
    id: 'iot-rule-001',
    device: '鏁版帶杞﹀簥 CK6150',
    metric: 'temp',
    operator: '>=',
    threshold: 60,
    level: 'warning',
    status: 'active'
  },
  {
    id: 'iot-rule-002',
    device: '澶栧渾纾ㄥ簥 M1432',
    metric: 'vibration',
    operator: '>',
    threshold: 4,
    level: 'critical',
    status: 'active'
  }
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function parseEndpoint(endpoint: string) {
  const normalized = String(endpoint || '')
    .replace(/^opc\.tcp:\/\//, '')
    .replace(/^mqtt:\/\//, '')
    .replace(/^https?:\/\//, '')
  const [address = '', portText = '0'] = normalized.split(':')
  const port = Number(portText.split('/')[0] || 0)
  return { address, port }
}

function buildEndpoint(address: string, port: number, protocol: string) {
  if (protocol === 'OPC UA') return `opc.tcp://${address}:${port || 4840}`
  if (protocol === 'MQTT') return `mqtt://${address}:${port || 1883}`
  if (protocol === 'HTTP') return `http://${address}:${port || 80}`
  return `${address}:${port || 502}`
}

function mapConnectionToConfig(item: ApiIotRecord) {
  const parsed = parseEndpoint(item.endpoint)
  return {
    id: item.id,
    name: item.equipment_name,
    protocol: item.protocol,
    address: parsed.address,
    port: parsed.port,
    interval: String(item.collect_interval ?? 1),
    status: item.status === 'error' || item.status === 'maintenance' ? 'disconnected' : item.status
  }
}

function mapMonitorToDevice(item: ApiIotRecord) {
  return {
    id: item.id,
    name: item.equipment_name,
    type: String(item.equipment_code || '').includes('HT') ? 'furnace' : String(item.equipment_code || '').includes('CK') ? 'lathe' : 'machine',
    status: item.run_status === 'stopped' ? 'maintenance' : item.run_status,
    rpm: Number(item.rpm ?? 0),
    temp: Number(item.temperature ?? 0),
    power: Number((Number(item.current ?? 0) * 0.38).toFixed(1))
  }
}

async function loadConnections(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  const response = await getIotConnectionList(params as any)
  return response.data.list as ApiIotRecord[]
}

async function loadMonitors() {
  const response = await getIotMonitorList({ pageNum: 1, pageSize: 100 } as any)
  return response.data.list as ApiIotRecord[]
}

async function loadAlarms(params: { device?: string; level?: string }) {
  const response = await getIotAlarmList({
    pageNum: 1,
    pageSize: 100,
    keyword: params.device,
    level: params.level as any
  } as any)
  return response.data.list as ApiIotRecord[]
}

function buildConnectionPayload(data: ApiIotRecord, current?: ApiIotRecord) {
  const parsed = parseEndpoint(current?.endpoint || '')
  const protocol = data.protocol || current?.protocol || 'MQTT'
  const address = data.address || parsed.address || '127.0.0.1'
  const port = Number(data.port ?? parsed.port ?? 1883)

  return {
    id: current?.id || data.id,
    code: current?.code,
    equipment_code: current?.equipment_code || `EQ-IOT-${String(Date.now()).slice(-4)}`,
    equipment_name: data.name || current?.equipment_name || 'IoT Device',
    workshop: current?.workshop || '数字工厂',
    line: current?.line || '采集产线',
    protocol,
    gateway: current?.gateway || '边缘网关',
    endpoint: buildEndpoint(address, port, protocol),
    collect_interval: Number(data.interval ?? current?.collect_interval ?? 1),
    status: data.status === 'disconnected' ? 'disconnected' : data.status || current?.status || 'connected',
    last_heartbeat: current?.last_heartbeat || '2026-07-21 09:30:00',
    owner: current?.owner || '系统管理员'
  }
}

export async function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  const list = (await loadConnections(params)).map(mapConnectionToConfig)
  const result = paginate(list, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTConfig(data: ApiIotRecord) {
  const response = await saveIotConnection(buildConnectionPayload(data) as any)
  return wrapCreatedResponse(mapConnectionToConfig(response.data as ApiIotRecord))
}

export async function updateIoTConfig(id: string, data: ApiIotRecord) {
  const current = (await loadConnections({ pageNum: 1, pageSize: 100 })).find((item) => item.id === id)
  const response = await saveIotConnection(buildConnectionPayload(data, current) as any)
  return wrapUpdatedResponse(mapConnectionToConfig(response.data as ApiIotRecord))
}

export async function deleteIoTConfig(id: string) {
  await deleteIotConnection(id)
  return wrapSuccessResponse('IoT config deleted')
}

export async function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  let filtered = [...autoReportRuleState]

  if (params.equipment) {
    filtered = searchItems(filtered, params.equipment, ['equipment'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTAutoReportRule(data: ApiIotRecord) {
  const record: ApiIotRecord = {
    id: data.id || generateId(),
    equipment: data.equipment || '',
    trigger: data.trigger || 'cycle_complete',
    threshold: Number(data.threshold ?? 0),
    wo_field: data.wo_field || 'qualified_qty',
    default_qty: Number(data.default_qty ?? 1),
    status: data.status || 'active'
  }
  autoReportRuleState.unshift(record)
  return wrapCreatedResponse(record)
}

export async function updateIoTAutoReportRule(id: string, data: ApiIotRecord) {
  const index = autoReportRuleState.findIndex((item) => item.id === id)
  const current = index >= 0 ? autoReportRuleState[index] : {}
  const record = {
    ...current,
    ...data,
    id,
    threshold: Number(data.threshold ?? current.threshold ?? 0),
    default_qty: Number(data.default_qty ?? current.default_qty ?? 1)
  }

  if (index >= 0) {
    autoReportRuleState[index] = record
  } else {
    autoReportRuleState.unshift(record)
  }

  return wrapUpdatedResponse(record)
}

export async function getIoTAlertRuleList() {
  return wrapDetailResponse([...alertRuleState])
}

export async function createIoTAlertRule(data: ApiIotRecord) {
  const record: ApiIotRecord = {
    id: data.id || generateId(),
    device: data.device || '',
    metric: data.metric || 'temp',
    operator: data.operator || '>=',
    threshold: Number(data.threshold ?? 0),
    level: data.level || 'warning',
    status: data.status || 'active'
  }
  alertRuleState.unshift(record)
  return wrapCreatedResponse(record)
}

export async function updateIoTAlertRule(id: string, data: ApiIotRecord) {
  const index = alertRuleState.findIndex((item) => item.id === id)
  const current = index >= 0 ? alertRuleState[index] : {}
  const record = {
    ...current,
    ...data,
    id,
    threshold: Number(data.threshold ?? current.threshold ?? 0)
  }

  if (index >= 0) {
    alertRuleState[index] = record
  } else {
    alertRuleState.unshift(record)
  }

  return wrapUpdatedResponse(record)
}

export async function deleteIoTAlertRule(id: string) {
  const index = alertRuleState.findIndex((item) => item.id === id)
  if (index >= 0) {
    alertRuleState.splice(index, 1)
  }
  return wrapSuccessResponse('IoT alert rule deleted')
}

export async function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  const list = (await loadAlarms(params)).map((item) => ({
    id: item.id,
    device: item.equipment_name,
    metric: item.metric === 'temperature' ? 'temp' : item.metric,
    actual_value: Number(item.trigger_value ?? 0),
    threshold: Number(String(item.threshold_desc || '').replace(/[^\d.]/g, '') || 0),
    level: item.level,
    status: item.status === 'acknowledged' || item.status === 'closed' ? 'recovered' : 'triggered',
    triggered_at: item.triggered_at,
    recovered_at: item.recovered_at || ''
  }))
  const result = paginate(list, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceList(params: { pageNum: number; pageSize: number; status?: string; type?: string }) {
  let list = (await loadMonitors()).map(mapMonitorToDevice)

  if (params.status) {
    list = list.filter((item) => item.status === params.status)
  }
  if (params.type) {
    list = list.filter((item) => item.type === params.type)
  }

  const result = paginate(list, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  const monitors = await loadMonitors()
  const targets = params.device ? monitors.filter((item) => item.equipment_name === params.device) : monitors
  const seed = new Date('2026-07-21T09:30:00')

  const rows = targets.flatMap((item, equipmentIndex) =>
    Array.from({ length: 24 }, (_, index) => {
      const time = new Date(seed)
      time.setMinutes(time.getMinutes() - (23 - index) * 5)

      return {
        id: `${item.id}-${index}`,
        device: item.equipment_name,
        time: formatTime(time),
        rpm: Math.max(Number(item.rpm ?? 0) - 60 + index * 3 + equipmentIndex * 5, 0),
        temp: Number((Number(item.temperature ?? 0) - 4 + index * 0.2).toFixed(1)),
        current: Number((Number(item.current ?? 0) - 1.2 + index * 0.05).toFixed(1)),
        vibration: Number((Number(item.vibration ?? 0) - 0.4 + index * 0.03).toFixed(1))
      }
    })
  )

  const result = paginate(rows, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

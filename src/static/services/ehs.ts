import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/static/utils/response'

const hazards = [
  {
    id: 'hazard-1',
    code: 'YH202606300001',
    location: 'Machining Workshop 1',
    desc: 'Coolant leakage may cause slipping risk.',
    level: 'moderate' as const,
    status: 'open' as const,
    finder: 'Li Si',
    found_at: '2026-06-30'
  },
  {
    id: 'hazard-2',
    code: 'YH202606280002',
    location: 'Assembly Workshop',
    desc: 'Safety guard is damaged and needs replacement.',
    level: 'major' as const,
    status: 'processing' as const,
    finder: 'Wang Wu',
    found_at: '2026-06-28'
  },
  {
    id: 'hazard-3',
    code: 'YH202606250003',
    location: 'Heat Treatment Workshop',
    desc: 'Ventilation is insufficient in the local area.',
    level: 'minor' as const,
    status: 'closed' as const,
    finder: 'Zhao Liu',
    found_at: '2026-06-25'
  }
]

const emergencyPlans = [
  { id: 'emergency-1', name: 'Fire Emergency Plan', type: '火灾' as const, level: 'I' as const, responsible: 'Chen Gong', last_drill: '2026-05-15' },
  { id: 'emergency-2', name: 'Chemical Leakage Plan', type: '危化品' as const, level: 'II' as const, responsible: 'Li Si', last_drill: '2026-04-20' },
  {
    id: 'emergency-3',
    name: 'Mechanical Injury Plan',
    type: '机械' as const,
    level: 'II' as const,
    responsible: 'Wang Gong',
    last_drill: '2026-03-10'
  },
  { id: 'emergency-4', name: 'Power Failure Plan', type: '电力' as const, level: 'III' as const, responsible: 'Zhang Gong', last_drill: '2026-02-05' }
]

const permits = [
  {
    id: 'permit-1',
    code: 'ZYP202606300001',
    type: 'hot' as const,
    location: 'Machining Workshop 1',
    applicant: 'Li Si',
    apply_date: '2026-06-30',
    status: 'approved' as const
  },
  {
    id: 'permit-2',
    code: 'ZYP202606290002',
    type: 'height' as const,
    location: 'Assembly Workshop',
    applicant: 'Wang Wu',
    apply_date: '2026-06-29',
    status: 'pending' as const
  },
  {
    id: 'permit-3',
    code: 'ZYP202606270003',
    type: 'confined' as const,
    location: 'Wastewater Area',
    applicant: 'Zhao Liu',
    apply_date: '2026-06-27',
    status: 'closed' as const
  }
]

const trainingRecords = [
  {
    id: 'training-1',
    title: 'New Employee Safety Orientation',
    trainer: 'Chen Gong',
    trainees: 'Sun Ba, Zhou Jiu, Wu Shi',
    plan_date: '2026-06-30',
    status: 'completed' as const
  },
  { id: 'training-2', title: 'Fire Drill Training', trainer: 'Liu Gong', trainees: 'All Staff', plan_date: '2026-07-05', status: 'pending' as const },
  {
    id: 'training-3',
    title: 'Hazmat Operation Training',
    trainer: 'Chen Gong',
    trainees: 'Li Si, Wang Wu, Zhao Liu',
    plan_date: '2026-05-20',
    status: 'expired' as const
  }
]

function createCode(prefix: string, size: number) {
  return `${prefix}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(size + 1).padStart(4, '0')}`
}

export async function getEhsHazardList(params: { pageNum: number; pageSize: number; keyword?: string; level?: string; status?: string }) {
  let filtered = [...hazards]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['desc', 'location', 'code'])
  if (params.level) filtered = filtered.filter((item) => item.level === params.level)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsHazard(data: any) {
  const payload = {
    id: data.id || generateId('hazard'),
    code: data.code || createCode('YH', hazards.length),
    location: data.location || '',
    desc: data.desc || '',
    level: data.level || 'moderate',
    status: data.status || 'open',
    finder: data.finder || '',
    found_at: data.found_at || new Date().toISOString().slice(0, 10)
  }

  const index = hazards.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    hazards[index] = { ...hazards[index], ...payload }
    return wrapUpdatedResponse(hazards[index], 'Hazard updated')
  }

  hazards.unshift(payload)
  return wrapCreatedResponse(payload, 'Hazard created')
}

export async function deleteEhsHazard(id: string) {
  const index = hazards.findIndex((item) => item.id === id)

  if (index > -1) {
    hazards.splice(index, 1)
  }

  return wrapSuccessResponse('Hazard deleted')
}

export async function getEhsEmergencyList(params: { pageNum: number; pageSize: number; name?: string; type?: string }) {
  let filtered = [...emergencyPlans]

  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsEmergency(data: any) {
  const payload = {
    id: data.id || generateId('emergency'),
    name: data.name || '',
    type: data.type || '火灾',
    level: data.level || 'II',
    responsible: data.responsible || '',
    last_drill: data.last_drill || ''
  }

  const index = emergencyPlans.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    emergencyPlans[index] = { ...emergencyPlans[index], ...payload }
    return wrapUpdatedResponse(emergencyPlans[index], 'Emergency plan updated')
  }

  emergencyPlans.unshift(payload)
  return wrapCreatedResponse(payload, 'Emergency plan created')
}

export async function runEhsEmergencyDrill(id: string) {
  const target = emergencyPlans.find((item) => item.id === id)

  if (target) {
    target.last_drill = new Date().toISOString().slice(0, 10)
  }

  return wrapUpdatedResponse(target || { id }, 'Emergency drill completed')
}

export async function getEhsPermitList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  let filtered = [...permits]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['location', 'code'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsPermit(data: any) {
  const payload = {
    id: data.id || generateId('permit'),
    code: data.code || createCode('ZYP', permits.length),
    type: data.type || 'hot',
    location: data.location || '',
    applicant: data.applicant || '',
    apply_date: data.apply_date || new Date().toISOString().slice(0, 10),
    status: data.status || 'pending'
  }

  const index = permits.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    permits[index] = { ...permits[index], ...payload }
    return wrapUpdatedResponse(permits[index], 'Permit updated')
  }

  permits.unshift(payload)
  return wrapCreatedResponse(payload, 'Permit created')
}

export async function deleteEhsPermit(id: string) {
  const index = permits.findIndex((item) => item.id === id)

  if (index > -1) {
    permits.splice(index, 1)
  }

  return wrapSuccessResponse('Permit deleted')
}

export async function getEhsTrainingList(params: { pageNum: number; pageSize: number; title?: string; status?: string }) {
  let filtered = [...trainingRecords]

  if (params.title) filtered = searchItems(filtered, params.title, ['title'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsTraining(data: any) {
  const payload = {
    id: data.id || generateId('training'),
    title: data.title || '',
    trainer: data.trainer || '',
    trainees: data.trainees || '',
    plan_date: data.plan_date || '',
    status: data.status || 'pending'
  }

  const index = trainingRecords.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    trainingRecords[index] = { ...trainingRecords[index], ...payload }
    return wrapUpdatedResponse(trainingRecords[index], 'Training updated')
  }

  trainingRecords.unshift(payload)
  return wrapCreatedResponse(payload, 'Training created')
}

export async function completeEhsTraining(id: string) {
  const target = trainingRecords.find((item) => item.id === id)

  if (target) {
    target.status = 'completed'
  }

  return wrapUpdatedResponse(target || { id }, 'Training completed')
}

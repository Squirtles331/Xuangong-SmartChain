import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { MockResponse, wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/mock/shared/response'
import type {
  ConcessionRecord,
  InspectionCategory,
  InspectionTask,
  NonconformanceRecord,
  QCTemplate,
  QCTemplateItem,
  ReInspectionRecord,
  ReworkReviewRecord,
  ScrapReviewRecord,
  SupplierQuality
} from '@/types/qms'

type InspectionTaskRecord = InspectionTask
type TemplateRecord = QCTemplate
type NcrRecord = NonconformanceRecord
type SupplierQualityRecord = SupplierQuality
type ConcessionReviewRecord = ConcessionRecord
type ReworkRecord = ReworkReviewRecord
type ScrapRecord = ScrapReviewRecord
type ReInspectionClosureRecord = ReInspectionRecord

const templateSeed: TemplateRecord[] = [
  {
    id: 'template-1',
    name: '钢材来料检验模板',
    category: 'raw',
    itemCount: 3,
    items: [
      { name: '外观', type: 'sensory', standard: '无锈蚀、无裂纹', required: true },
      { name: '直径', type: 'measure', standard: '50.0', required: true },
      { name: '材质证明', type: 'count', standard: '齐全', required: true }
    ]
  },
  {
    id: 'template-2',
    name: '泵体过程检验模板',
    category: 'semi-finished',
    itemCount: 3,
    items: [
      { name: '尺寸偏差', type: 'measure', standard: '100.0', required: true },
      { name: '硬度', type: 'measure', standard: '45.0', required: true },
      { name: '表面状态', type: 'sensory', standard: '无磕碰', required: true }
    ]
  },
  {
    id: 'template-3',
    name: '成品完工检验模板',
    category: 'finished',
    itemCount: 3,
    items: [
      { name: '流量测试', type: 'measure', standard: '100.0', required: true },
      { name: '密封性', type: 'count', standard: '通过', required: true },
      { name: '外观清洁', type: 'sensory', standard: '无油污', required: true }
    ]
  }
]

const inspectionTaskSeed: InspectionTaskRecord[] = [
  {
    id: 'inspection-1',
    code: 'IQC-2026070001',
    category: 'incoming',
    material: '45#圆钢 D50',
    lot: 'L2026071001',
    qty: 120,
    status: 'pending',
    verdict: '',
    sourceCode: 'RK-2026071001',
    sourceName: '来料收货单',
    sourceType: 'receipt',
    templateName: '钢材来料检验模板',
    supplier: '华东钢材供应有限公司',
    warehouse: '原材料仓',
    createdAt: '2026-07-10 09:20',
    items: cloneItems(templateSeed[0].items)
  },
  {
    id: 'inspection-2',
    code: 'IQC-2026070002',
    category: 'incoming',
    material: '轴承 6308',
    lot: 'L2026071103',
    qty: 60,
    status: 'completed',
    verdict: 'pass',
    sourceCode: 'RK-2026071103',
    sourceName: '到货收货单',
    sourceType: 'receipt',
    templateName: '钢材来料检验模板',
    supplier: '苏州轴承制造厂',
    warehouse: '标准件仓',
    createdAt: '2026-07-11 14:35',
    items: cloneItems(templateSeed[0].items)
  },
  {
    id: 'inspection-3',
    code: 'IPQC-2026070001',
    category: 'process',
    material: '泵壳半成品 XJP-100',
    lot: 'WIP-2026071201',
    qty: 24,
    status: 'in_progress',
    verdict: '',
    sourceCode: 'GX-2026071201',
    sourceName: '工序执行任务',
    sourceType: 'operation',
    templateName: '泵体过程检验模板',
    workOrderCode: 'MO-2026071201',
    operationName: '精加工',
    createdAt: '2026-07-12 10:10',
    items: cloneItems(templateSeed[1].items)
  },
  {
    id: 'inspection-4',
    code: 'IPQC-2026070002',
    category: 'process',
    material: '密封座组件',
    lot: 'WIP-2026071205',
    qty: 30,
    status: 'completed',
    verdict: 'rework',
    sourceCode: 'GX-2026071205',
    sourceName: '工序执行任务',
    sourceType: 'operation',
    templateName: '泵体过程检验模板',
    workOrderCode: 'MO-2026071203',
    operationName: '装配预检',
    createdAt: '2026-07-12 15:45',
    items: cloneItems(templateSeed[1].items)
  },
  {
    id: 'inspection-5',
    code: 'FQC-2026070001',
    category: 'final',
    material: '离心泵 XJP-100',
    lot: 'FG-2026071301',
    qty: 12,
    status: 'pending',
    verdict: '',
    sourceCode: 'WG-2026071301',
    sourceName: '完工报检单',
    sourceType: 'completion',
    templateName: '成品完工检验模板',
    workOrderCode: 'MO-2026071008',
    warehouse: '成品仓',
    createdAt: '2026-07-13 08:30',
    items: cloneItems(templateSeed[2].items)
  },
  {
    id: 'inspection-6',
    code: 'FQC-2026070002',
    category: 'final',
    material: '齿轮箱 GBX-200',
    lot: 'FG-2026071304',
    qty: 8,
    status: 'completed',
    verdict: 'concession',
    sourceCode: 'WG-2026071304',
    sourceName: '完工入库确认',
    sourceType: 'completion',
    templateName: '成品完工检验模板',
    workOrderCode: 'MO-2026071012',
    warehouse: '成品仓',
    createdAt: '2026-07-13 16:20',
    items: cloneItems(templateSeed[2].items)
  }
]

const ncrSeed: NcrRecord[] = [
  {
    id: 'ncr-1',
    code: 'NCR-2026070001',
    inspectionCode: 'IPQC-2026070002',
    inspectionCategory: 'process',
    material: '密封座组件',
    sourceCode: 'GX-2026071205',
    sourceType: 'operation',
    severity: 'major',
    status: 'reviewing',
    disposition: 'rework',
    owner: '质量工程师',
    issueDesc: '密封面尺寸超差，需要返工修正后复检。',
    followUp: 'MES返工执行',
    createdAt: '2026-07-12 17:10'
  },
  {
    id: 'ncr-2',
    code: 'NCR-2026070002',
    inspectionCode: 'FQC-2026070002',
    inspectionCategory: 'final',
    material: '齿轮箱 GBX-200',
    sourceCode: 'WG-2026071304',
    sourceType: 'completion',
    severity: 'minor',
    status: 'closed',
    disposition: 'concession',
    owner: '质量主管',
    issueDesc: '外观轻微擦伤，评估后让步接收。',
    followUp: 'WMS让步放行',
    createdAt: '2026-07-13 18:00'
  },
  {
    id: 'ncr-3',
    code: 'NCR-2026070003',
    inspectionCode: 'IQC-2026070001',
    inspectionCategory: 'incoming',
    material: '45#圆钢 D50',
    sourceCode: 'RK-2026071001',
    sourceType: 'receipt',
    severity: 'critical',
    status: 'open',
    disposition: 'pending',
    owner: '来料检验员',
    issueDesc: '抽检尺寸波动较大，待质量评审。',
    followUp: '待QMS裁决',
    createdAt: '2026-07-10 11:40'
  }
]

const supplierQualitySeed: SupplierQualityRecord[] = [
  {
    id: 'supplier-1',
    supplier: '华东钢材供应有限公司',
    total_batches: 36,
    pass_batches: 34,
    pass_rate: 94.4,
    repeat_issues: 1,
    last_inspection: '2026-07-10'
  },
  {
    id: 'supplier-2',
    supplier: '苏州轴承制造厂',
    total_batches: 28,
    pass_batches: 27,
    pass_rate: 96.4,
    repeat_issues: 0,
    last_inspection: '2026-07-11'
  }
]

const concessionSeed: ConcessionReviewRecord[] = [
  {
    id: 'concession-1',
    code: 'TP-2026070001',
    inspectionCode: 'FQC-2026070002',
    material: '齿轮箱 GBX-200',
    sourceCode: 'WG-2026071304',
    scope: '外观轻微擦伤，允许本批 8 件让步放行',
    riskNote: '客户端已确认不影响装配和使用寿命',
    owner: '质量主管',
    status: 'released',
    validUntil: '2026-07-31',
    createdAt: '2026-07-13 18:20'
  },
  {
    id: 'concession-2',
    code: 'TP-2026070002',
    inspectionCode: 'IQC-2026070003',
    material: '进口密封圈',
    sourceCode: 'RK-2026071406',
    scope: '仅允许样机验证用 20 件临时放行',
    riskNote: '需要技术和生产共同确认替代风险',
    owner: '质量经理',
    status: 'reviewing',
    validUntil: '2026-07-20',
    createdAt: '2026-07-14 10:30'
  }
]

const reworkSeed: ReworkRecord[] = [
  {
    id: 'rework-1',
    code: 'RW-2026070001',
    ncrCode: 'NCR-2026070001',
    material: '密封座组件',
    workOrderCode: 'MO-2026071203',
    sourceCode: 'GX-2026071205',
    reviewRoute: '返修 -> 尺寸复测 -> 装配复检',
    reinspectionRule: '返工完成后必须重新触发过程检验',
    owner: '质量工程师',
    status: 'reviewing',
    decision: 'approved',
    createdAt: '2026-07-12 17:40'
  },
  {
    id: 'rework-2',
    code: 'RW-2026070002',
    ncrCode: 'NCR-2026070004',
    material: '叶轮组件',
    workOrderCode: 'MO-2026071308',
    sourceCode: 'GX-2026071311',
    reviewRoute: '评审后转报废，不进入返工',
    reinspectionRule: '无需复检',
    owner: '质量主管',
    status: 'closed',
    decision: 'rejected',
    createdAt: '2026-07-13 19:10'
  }
]

const scrapSeed: ScrapRecord[] = [
  {
    id: 'scrap-1',
    code: 'BF-2026070001',
    ncrCode: 'NCR-2026070004',
    material: '叶轮组件',
    sourceCode: 'GX-2026071311',
    reason: '铸造缺陷不可修复',
    qty: 6,
    lossAmount: 4800,
    owner: '质量主管',
    status: 'approved',
    createdAt: '2026-07-13 19:20'
  },
  {
    id: 'scrap-2',
    code: 'BF-2026070002',
    ncrCode: 'NCR-2026070005',
    material: '泵轴',
    sourceCode: 'RK-2026071412',
    reason: '硬度异常待确认报废范围',
    qty: 12,
    lossAmount: 3600,
    owner: '质量经理',
    status: 'pending',
    createdAt: '2026-07-14 14:10'
  }
]

const reInspectionSeed: ReInspectionClosureRecord[] = [
  {
    id: 'reinspection-1',
    code: 'FJ-2026070001',
    sourceCode: 'RW-2026070001',
    inspectionCode: 'IPQC-2026070002',
    material: '密封座组件',
    previousDecision: '返工',
    unlockAction: 'MES 返工完成后解除质量锁定',
    owner: '过程检验员',
    status: 'executing',
    result: 'pending',
    createdAt: '2026-07-14 09:30'
  },
  {
    id: 'reinspection-2',
    code: 'FJ-2026070002',
    sourceCode: 'TP-2026070001',
    inspectionCode: 'FQC-2026070002',
    material: '齿轮箱 GBX-200',
    previousDecision: '让步接收',
    unlockAction: 'WMS 让步放行后关闭质量闭环',
    owner: '质量主管',
    status: 'closed',
    result: 'pass',
    createdAt: '2026-07-13 18:40'
  }
]

const qcTemplates = cloneSeed(templateSeed)
const inspectionTasks = cloneSeed(inspectionTaskSeed)
const ncrRecords = cloneSeed(ncrSeed)
const supplierQualityList = cloneSeed(supplierQualitySeed)
const concessionRecords = cloneSeed(concessionSeed)
const reworkReviews = cloneSeed(reworkSeed)
const scrapReviews = cloneSeed(scrapSeed)
const reInspectionRecords = cloneSeed(reInspectionSeed)

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

function cloneItems(items: QCTemplateItem[]) {
  return items.map((item) => ({ ...item }))
}

function createInspectionCode(category: InspectionCategory, id: string) {
  const prefixMap: Record<InspectionCategory, string> = {
    incoming: 'IQC',
    process: 'IPQC',
    final: 'FQC'
  }

  return `${prefixMap[category]}-2026${id.slice(-5).padStart(5, '0')}`
}

function createNcrCode(id: string) {
  return `NCR-2026${id.slice(-5).padStart(5, '0')}`
}

export async function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  category?: InspectionCategory
  code?: string
  material?: string
  sourceCode?: string
  status?: string
}) {
  let filtered = [...inspectionTasks]

  if (params.category) {
    filtered = filtered.filter((item) => item.category === params.category)
  }

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.material) {
    filtered = searchItems(filtered, params.material, ['material'])
  }

  if (params.sourceCode) {
    filtered = searchItems(filtered, params.sourceCode, ['sourceCode'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createInspectionTask(data: Partial<InspectionTaskRecord>) {
  const id = generateId()
  const category = data.category || 'incoming'
  const template = qcTemplates.find((item) => item.name === data.templateName)
  const next: InspectionTaskRecord = {
    id,
    code: data.code || createInspectionCode(category, id),
    category,
    material: data.material || '',
    lot: data.lot || '',
    qty: Number(data.qty || 0),
    status: data.status || 'pending',
    verdict: data.verdict || '',
    sourceCode: data.sourceCode || '',
    sourceName: data.sourceName || '',
    sourceType: data.sourceType || 'receipt',
    templateName: data.templateName || '',
    supplier: data.supplier || '',
    warehouse: data.warehouse || '',
    workOrderCode: data.workOrderCode || '',
    operationName: data.operationName || '',
    createdAt: data.createdAt || '2026-07-15 09:00',
    items: cloneItems(data.items?.length ? data.items : template?.items || templateSeed[0].items)
  }

  inspectionTasks.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateInspectionTask(id: string, data: Partial<InspectionTaskRecord>) {
  const index = inspectionTasks.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Inspection task not found', null)
  }

  inspectionTasks[index] = {
    ...inspectionTasks[index],
    ...data,
    items: data.items?.length ? cloneItems(data.items) : inspectionTasks[index].items
  }

  return wrapUpdatedResponse(inspectionTasks[index], 'Updated successfully')
}

export async function deleteInspectionTask(id: string) {
  const index = inspectionTasks.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Inspection task not found', null)
  }

  inspectionTasks.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getQCTemplateList(params: { pageNum: number; pageSize: number; keyword?: string; category?: string }) {
  let filtered = [...qcTemplates]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['name'])
  }

  if (params.category) {
    filtered = filtered.filter((item) => item.category === params.category)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createQCTemplate(data: Partial<TemplateRecord>) {
  const id = generateId()
  const items = cloneItems(data.items || [])
  const next: TemplateRecord = {
    id,
    name: data.name || '',
    category: (data.category as TemplateRecord['category']) || 'raw',
    itemCount: items.length,
    items
  }

  qcTemplates.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateQCTemplate(id: string, data: Partial<TemplateRecord>) {
  const index = qcTemplates.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Template not found', null)
  }

  const items = cloneItems(data.items || qcTemplates[index].items)
  qcTemplates[index] = {
    ...qcTemplates[index],
    ...data,
    itemCount: items.length,
    items
  }

  return wrapUpdatedResponse(qcTemplates[index], 'Updated successfully')
}

export async function deleteQCTemplate(id: string) {
  const index = qcTemplates.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Template not found', null)
  }

  qcTemplates.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getNcrList(params: {
  pageNum: number
  pageSize: number
  code?: string
  inspectionCode?: string
  status?: string
  disposition?: string
}) {
  let filtered = [...ncrRecords]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.inspectionCode) {
    filtered = searchItems(filtered, params.inspectionCode, ['inspectionCode'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  if (params.disposition) {
    filtered = filtered.filter((item) => item.disposition === params.disposition)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createNcr(data: Partial<NcrRecord>) {
  const id = generateId()
  const next: NcrRecord = {
    id,
    code: data.code || createNcrCode(id),
    inspectionCode: data.inspectionCode || '',
    inspectionCategory: data.inspectionCategory || 'incoming',
    material: data.material || '',
    sourceCode: data.sourceCode || '',
    sourceType: data.sourceType || 'receipt',
    severity: data.severity || 'major',
    status: data.status || 'open',
    disposition: data.disposition || 'pending',
    owner: data.owner || '',
    issueDesc: data.issueDesc || '',
    followUp: data.followUp || '',
    createdAt: data.createdAt || '2026-07-15 09:00'
  }

  ncrRecords.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateNcr(id: string, data: Partial<NcrRecord>) {
  const index = ncrRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Nonconformance record not found', null)
  }

  ncrRecords[index] = {
    ...ncrRecords[index],
    ...data
  }

  return wrapUpdatedResponse(ncrRecords[index], 'Updated successfully')
}

export async function deleteNcr(id: string) {
  const index = ncrRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Nonconformance record not found', null)
  }

  ncrRecords.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getSupplierQualityList(params: { pageNum: number; pageSize: number; supplier?: string }) {
  let filtered = [...supplierQualityList]

  if (params.supplier) {
    filtered = searchItems(filtered, params.supplier, ['supplier'])
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSupplierQuality(data: Partial<SupplierQualityRecord>) {
  const next = {
    id: generateId(),
    supplier: data.supplier || '',
    total_batches: Number(data.total_batches || 0),
    pass_batches: Number(data.pass_batches || 0),
    pass_rate: Number(data.pass_rate || 0),
    repeat_issues: Number(data.repeat_issues || 0),
    last_inspection: data.last_inspection || '2026-07-15'
  }

  supplierQualityList.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateSupplierQuality(id: string, data: Partial<SupplierQualityRecord>) {
  const index = supplierQualityList.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Supplier quality record not found', null)
  }

  supplierQualityList[index] = {
    ...supplierQualityList[index],
    ...data
  }

  return wrapUpdatedResponse(supplierQualityList[index], 'Updated successfully')
}

export async function deleteSupplierQuality(id: string) {
  const index = supplierQualityList.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Supplier quality record not found', null)
  }

  supplierQualityList.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getConcessionList(params: { pageNum: number; pageSize: number; code?: string; status?: string; inspectionCode?: string }) {
  let filtered = [...concessionRecords]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  if (params.inspectionCode) {
    filtered = searchItems(filtered, params.inspectionCode, ['inspectionCode'])
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createConcession(data: Partial<ConcessionReviewRecord>) {
  const next: ConcessionReviewRecord = {
    id: generateId(),
    code: data.code || `TP-2026${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    inspectionCode: data.inspectionCode || '',
    material: data.material || '',
    sourceCode: data.sourceCode || '',
    scope: data.scope || '',
    riskNote: data.riskNote || '',
    owner: data.owner || '',
    status: data.status || 'draft',
    validUntil: data.validUntil || '2026-07-31',
    createdAt: data.createdAt || '2026-07-15 09:00'
  }

  concessionRecords.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateConcession(id: string, data: Partial<ConcessionReviewRecord>) {
  const index = concessionRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Concession record not found', null)
  }

  concessionRecords[index] = {
    ...concessionRecords[index],
    ...data
  }

  return wrapUpdatedResponse(concessionRecords[index], 'Updated successfully')
}

export async function deleteConcession(id: string) {
  const index = concessionRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Concession record not found', null)
  }

  concessionRecords.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getReworkReviewList(params: { pageNum: number; pageSize: number; code?: string; decision?: string; status?: string }) {
  let filtered = [...reworkReviews]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'ncrCode', 'workOrderCode'])
  }

  if (params.decision) {
    filtered = filtered.filter((item) => item.decision === params.decision)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReworkReview(data: Partial<ReworkRecord>) {
  const next: ReworkRecord = {
    id: generateId(),
    code: data.code || `RW-2026${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    ncrCode: data.ncrCode || '',
    material: data.material || '',
    workOrderCode: data.workOrderCode || '',
    sourceCode: data.sourceCode || '',
    reviewRoute: data.reviewRoute || '',
    reinspectionRule: data.reinspectionRule || '',
    owner: data.owner || '',
    status: data.status || 'open',
    decision: data.decision || 'pending',
    createdAt: data.createdAt || '2026-07-15 09:00'
  }

  reworkReviews.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateReworkReview(id: string, data: Partial<ReworkRecord>) {
  const index = reworkReviews.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Rework review not found', null)
  }

  reworkReviews[index] = {
    ...reworkReviews[index],
    ...data
  }

  return wrapUpdatedResponse(reworkReviews[index], 'Updated successfully')
}

export async function deleteReworkReview(id: string) {
  const index = reworkReviews.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Rework review not found', null)
  }

  reworkReviews.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getScrapReviewList(params: { pageNum: number; pageSize: number; code?: string; status?: string }) {
  let filtered = [...scrapReviews]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'ncrCode', 'sourceCode'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createScrapReview(data: Partial<ScrapRecord>) {
  const next: ScrapRecord = {
    id: generateId(),
    code: data.code || `BF-2026${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    ncrCode: data.ncrCode || '',
    material: data.material || '',
    sourceCode: data.sourceCode || '',
    reason: data.reason || '',
    qty: Number(data.qty || 0),
    lossAmount: Number(data.lossAmount || 0),
    owner: data.owner || '',
    status: data.status || 'pending',
    createdAt: data.createdAt || '2026-07-15 09:00'
  }

  scrapReviews.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateScrapReview(id: string, data: Partial<ScrapRecord>) {
  const index = scrapReviews.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Scrap review not found', null)
  }

  scrapReviews[index] = {
    ...scrapReviews[index],
    ...data
  }

  return wrapUpdatedResponse(scrapReviews[index], 'Updated successfully')
}

export async function deleteScrapReview(id: string) {
  const index = scrapReviews.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Scrap review not found', null)
  }

  scrapReviews.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

export async function getReInspectionList(params: { pageNum: number; pageSize: number; code?: string; status?: string; result?: string }) {
  let filtered = [...reInspectionRecords]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'inspectionCode', 'sourceCode'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  if (params.result) {
    filtered = filtered.filter((item) => item.result === params.result)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReInspection(data: Partial<ReInspectionClosureRecord>) {
  const next: ReInspectionClosureRecord = {
    id: generateId(),
    code: data.code || `FJ-2026${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    sourceCode: data.sourceCode || '',
    inspectionCode: data.inspectionCode || '',
    material: data.material || '',
    previousDecision: data.previousDecision || '',
    unlockAction: data.unlockAction || '',
    owner: data.owner || '',
    status: data.status || 'pending',
    result: data.result || 'pending',
    createdAt: data.createdAt || '2026-07-15 09:00'
  }

  reInspectionRecords.unshift(next)
  return wrapCreatedResponse(next, 'Created successfully')
}

export async function updateReInspection(id: string, data: Partial<ReInspectionClosureRecord>) {
  const index = reInspectionRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Re-inspection record not found', null)
  }

  reInspectionRecords[index] = {
    ...reInspectionRecords[index],
    ...data
  }

  return wrapUpdatedResponse(reInspectionRecords[index], 'Updated successfully')
}

export async function deleteReInspection(id: string) {
  const index = reInspectionRecords.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Re-inspection record not found', null)
  }

  reInspectionRecords.splice(index, 1)
  return wrapSuccessResponse('Deleted successfully')
}

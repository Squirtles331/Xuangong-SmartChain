import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'

const reports = [
  { id: 1, name: 'Production Daily Report', category: 'Production', createdAt: '2026-07-21 08:30', creator: 'System Admin', status: 'generated' },
  { id: 2, name: 'Quality Weekly Report', category: 'Quality', createdAt: '2026-07-20 17:10', creator: 'Quality Manager', status: 'generated' },
  { id: 3, name: 'Inventory Risk List', category: 'Inventory', createdAt: '2026-07-20 15:20', creator: 'Warehouse Lead', status: 'processing' },
  { id: 4, name: 'Energy Exception Tracking', category: 'Energy', createdAt: '2026-07-19 10:45', creator: 'Energy Specialist', status: 'generated' }
]

export async function getReportList(params: { pageNum: number; pageSize: number; name?: string }) {
  let filtered = [...reports]

  if (params.name) {
    filtered = searchItems(filtered, params.name, ['name', 'category'])
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function previewReport(id: number) {
  const report = reports.find((item) => item.id === id)

  return wrapDetailResponse({
    id,
    name: report?.name || '',
    previewUrl: `/static/report-preview/${id}`
  })
}

export async function downloadReport(id: number) {
  const report = reports.find((item) => item.id === id)
  return wrapSuccessResponse(`Download prepared: ${report?.name || id}`)
}

export async function deleteReport(id: number) {
  const index = reports.findIndex((item) => item.id === id)

  if (index > -1) {
    reports.splice(index, 1)
  }

  return wrapSuccessResponse('Deleted successfully')
}

import { reports } from '../modules/analysis'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getReportList(params: { pageNum: number; pageSize: number; name?: string }) {
  await simulateDelay()
  let filtered = [...reports]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function previewReport(id: number) {
  await simulateDelay()
  const report = reports.find((item) => item.id === id)
  return wrapDetailResponse({
    id,
    preview_url: `/mock/report-preview/${id}`,
    name: report?.name || ''
  })
}

export async function downloadReport(id: number) {
  await simulateDelay()
  const report = reports.find((item) => item.id === id)
  return wrapSuccessResponse(`已准备下载报表：${report?.name || id}`)
}

export async function deleteReport(id: number) {
  await simulateDelay()
  const index = reports.findIndex((item) => item.id === id)
  if (index > -1) reports.splice(index, 1)
  return wrapSuccessResponse('删除成功')
}

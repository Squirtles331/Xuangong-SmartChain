import { apsScheduleData } from '../modules/aps'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse, wrapSuccessResponse } from '../shared/response'

export async function getApsScheduleData() {
  await simulateDelay()
  return wrapDetailResponse(apsScheduleData)
}

export async function runApsSchedule() {
  await simulateDelay(500, 900)
  return wrapSuccessResponse('排程已重新计算')
}

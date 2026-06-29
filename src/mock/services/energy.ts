import { energyDetails } from '../modules/energy'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'

export async function getEnergyDetailList() {
  await simulateDelay()
  return wrapDetailResponse(energyDetails)
}

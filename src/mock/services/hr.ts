import { employeeSkillDetails, skillTree } from '../modules/hr'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'

export async function getSkillMatrixData() {
  await simulateDelay()
  return wrapDetailResponse({
    employees: skillTree,
    skillsByEmployee: employeeSkillDetails
  })
}

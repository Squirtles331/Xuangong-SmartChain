import { defineStore } from 'pinia'
import { getApsConstraintSnapshot } from '@/api/aps'

export const useConstraintStore = defineStore('aps-constraint', () => {
  function checkConflicts(operation: string, workCenter: string, plannedQty: number) {
    const constraintData = getApsConstraintSnapshot()
    const conflicts: string[] = []

    const unavailableMold = constraintData.molds.find((item) => !item.available && operation.includes(item.applicable))
    if (unavailableMold) {
      conflicts.push(`模具不可用：${unavailableMold.name}`)
    }

    const unavailableTool = constraintData.tools.find((item) => !item.available && workCenter.includes(item.applicable))
    if (unavailableTool) {
      conflicts.push(`刀具不可用：${unavailableTool.name}`)
    }

    const skillConstraint = constraintData.skills.find((item) => operation.includes(item.operation))
    if (skillConstraint && skillConstraint.workers_count < 2) {
      conflicts.push(`技能人数不足：${skillConstraint.skill} 当前仅 ${skillConstraint.workers_count} 人`)
    }

    const shortage = constraintData.materialShortages.find((item) => plannedQty > 0)
    if (shortage) {
      conflicts.push(`物料短缺：${shortage.material} 缺口 ${shortage.qty_short}，预计 ${shortage.available_date} 到货`)
    }

    return conflicts
  }

  return {
    checkConflicts
  }
})

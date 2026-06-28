/**
 * APS 约束数据共享 Store
 * constraint 页面修改数据 → schedule 页面读取约束 → 排程算法应用
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MoldConstraint {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
}
export interface ToolConstraint {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
}
export interface SkillConstraint {
  id: string
  operation: string
  skill: string
  min_level: number
  workers_count: number
}
export interface MaterialConstraint {
  id: string
  material: string
  wo_code: string
  available_date: string
  qty_short: number
}

export const useConstraintStore = defineStore('aps-constraint', () => {
  const molds = ref<MoldConstraint[]>([
    { id: '1', code: 'MD0000000001', name: '泵体铸造模具', applicable: '泵体铸件', life: '10000模次', available: true },
    { id: '2', code: 'MD0000000002', name: '叶轮锻模', applicable: '叶轮铸件', life: '5000模次', available: true }
  ])
  const tools = ref<ToolConstraint[]>([
    { id: '1', code: 'TL00001', name: '车刀 CNMG120408', applicable: '数控车床', life: '500件', available: true },
    { id: '2', code: 'TL00002', name: '钻头 φ10', applicable: '钻床', life: '300件', available: true }
  ])
  const skills = ref<SkillConstraint[]>([
    { id: '1', operation: '精车', skill: '数控车床操作', min_level: 3, workers_count: 4 },
    { id: '2', operation: '装配', skill: '装配钳工', min_level: 4, workers_count: 3 }
  ])
  const materialShortages = ref<MaterialConstraint[]>([
    { id: '1', material: '轴承 6308', wo_code: 'WO202501150001', available_date: '2025-01-18', qty_short: 50 }
  ])

  // 排程时检查约束，返回冲突列表
  function checkConflicts(operation: string, workCenter: string, plannedQty: number) {
    const conflicts: string[] = []

    // 1. 模具约束：检查是否有可用模具
    const mold = molds.value.find((m) => m.applicable && operation.includes(m.applicable))
    if (mold && !mold.available) {
      conflicts.push(`🔧 模具冲突: ${mold.name} 不可用`)
    }

    // 2. 刀具约束
    const tool = tools.value.find((t) => workCenter.includes(t.applicable))
    if (tool && !tool.available) {
      conflicts.push(`🔪 刀具冲突: ${tool.name} 不可用`)
    }

    // 3. 人员技能约束
    const skill = skills.value.find((s) => operation.includes(s.operation))
    if (skill && skill.workers_count < 2) {
      conflicts.push(`👤 技能约束: ${skill.skill} 等级${skill.min_level} 仅${skill.workers_count}人可用`)
    }

    // 4. 物料约束
    const mat = materialShortages.value.find((m) => operation.includes(m.material) || plannedQty > 0)
    if (mat) {
      conflicts.push(`📦 物料约束: ${mat.material} 缺${mat.qty_short}件, 预计${mat.available_date}到货`)
    }

    return conflicts
  }

  return { molds, tools, skills, materialShortages, checkConflicts }
})

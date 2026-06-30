<template>
  <gi-page-layout :size="240" style="height: calc(100vh - 120px)">
    <template #left>
      <el-tree
        :data="employees"
        :props="{ children: 'children', label: 'name' }"
        node-key="id"
        default-expand-all
        highlight-current
        @node-click="onNodeClick"
      />
    </template>

    <template #header>
      <h3 style="margin: 0">{{ currentEmployee?.name || '请选择员工' }} 技能矩阵</h3>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>

    <gi-table :columns="columns" :data="skills" border stripe size="small">
      <template #level="{ row }">
        <el-rate v-model="row.level" :max="5" disabled size="small" />
      </template>

      <template #actions="{ row }">
        <gi-button type="edit" size="small" @click="openEdit(row)" />
        <gi-button type="delete" size="small" @click="removeSkill(row.id)" />
      </template>
    </gi-table>

    <SkillMatrixFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="mode" @submit="submit" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { getSkillMatrixData, type HrSkillItem, type HrSkillTreeNode } from '@/api/hr'
import SkillMatrixFormDialog, { type SkillMatrixFormModel } from './SkillMatrixFormDialog.vue'

const employees = ref<HrSkillTreeNode[]>([])
const currentEmployee = ref<HrSkillTreeNode | null>(null)
const skills = ref<HrSkillItem[]>([])
const skillsByEmployee = ref<Record<string, HrSkillItem[]>>({})
const dialogVisible = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const formModel = ref<SkillMatrixFormModel>(createDefaultForm())

const columns: TableColumnItem<HrSkillItem>[] = [
  { prop: 'skill_name', label: '技能名称', minWidth: 180 },
  { label: '技能等级', minWidth: 160, slotName: 'level' },
  { prop: 'cert_number', label: '证书编号', minWidth: 150 },
  { prop: 'expire_date', label: '到期日期', minWidth: 120, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

function createDefaultForm(): SkillMatrixFormModel {
  return {
    id: '',
    skill_name: '',
    level: 1,
    cert_number: '',
    expire_date: ''
  }
}

function findFirstEmployee(nodes: HrSkillTreeNode[]): HrSkillTreeNode | null {
  for (const node of nodes) {
    if (node.children?.length) {
      const child = findFirstEmployee(node.children)
      if (child) return child
    } else if (node.id) {
      return node
    }
  }
  return null
}

async function loadData() {
  const response = await getSkillMatrixData()
  employees.value = response.data.employees || []
  skillsByEmployee.value = response.data.skillsByEmployee || {}

  const firstEmployee = findFirstEmployee(employees.value)
  if (firstEmployee) onNodeClick(firstEmployee)
}

function onNodeClick(node: HrSkillTreeNode) {
  if (node.children?.length) return
  currentEmployee.value = node
  skills.value = [...(skillsByEmployee.value[node.id] || [])]
}

function openAdd() {
  if (!currentEmployee.value) {
    ElMessage.warning('请先选择员工')
    return
  }

  mode.value = 'add'
  editingId.value = ''
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(skill: HrSkillItem) {
  mode.value = 'edit'
  editingId.value = skill.id
  formModel.value = { ...skill }
  dialogVisible.value = true
}

async function submit() {
  if (!formModel.value.skill_name) {
    ElMessage.warning('请填写技能名称')
    return false
  }

  const employeeId = currentEmployee.value?.id
  if (!employeeId) return false

  const target = skillsByEmployee.value[employeeId] || []
  if (mode.value === 'add') {
    target.unshift({ ...formModel.value, id: Date.now().toString() })
  } else {
    const index = target.findIndex((item) => item.id === editingId.value)
    if (index > -1) Object.assign(target[index], formModel.value)
  }

  skillsByEmployee.value[employeeId] = target
  skills.value = [...target]
  dialogVisible.value = false
  return true
}

function removeSkill(id: string) {
  const employeeId = currentEmployee.value?.id
  if (!employeeId) return

  ElMessageBox.confirm('确认删除该技能记录吗？', '提示', { type: 'warning' })
    .then(() => {
      const target = skillsByEmployee.value[employeeId] || []
      skillsByEmployee.value[employeeId] = target.filter((item) => item.id !== id)
      skills.value = [...skillsByEmployee.value[employeeId]]
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

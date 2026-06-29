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
      <h3 style="margin: 0">{{ currentEmployee?.name || 'Select Employee' }} Skill Matrix</h3>
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
import { getSkillMatrixData } from '@/api/hr'
import SkillMatrixFormDialog, { type SkillMatrixFormModel } from './SkillMatrixFormDialog.vue'

interface SkillItem {
  id: string
  skill_name: string
  level: number
  cert_number: string
  expire_date: string
}

const employees = ref<any[]>([])
const currentEmployee = ref<any>(null)
const skills = ref<SkillItem[]>([])
const skillsByEmployee = ref<Record<string, SkillItem[]>>({})
const dialogVisible = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const formModel = ref<SkillMatrixFormModel>(createDefaultForm())

const columns: TableColumnItem<SkillItem>[] = [
  { prop: 'skill_name', label: 'Skill', minWidth: 180 },
  { label: 'Level', minWidth: 180, slotName: 'level' },
  { prop: 'cert_number', label: 'Certificate', minWidth: 150 },
  { prop: 'expire_date', label: 'Expire Date', minWidth: 120 },
  { label: 'Actions', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
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

function flattenFirstEmployee(nodes: any[]): any | null {
  for (const node of nodes) {
    if (Array.isArray(node.children) && node.children.length > 0) {
      const child = flattenFirstEmployee(node.children)
      if (child) return child
    } else if (node.id) {
      return node
    }
  }
  return null
}

async function loadData() {
  const res = await getSkillMatrixData()
  employees.value = res.data.employees || []
  skillsByEmployee.value = res.data.skillsByEmployee || {}

  const firstEmployee = flattenFirstEmployee(employees.value)
  if (firstEmployee) onNodeClick(firstEmployee)
}

function onNodeClick(node: any) {
  if (Array.isArray(node.children) && node.children.length > 0) return
  currentEmployee.value = node
  skills.value = [...(skillsByEmployee.value[node.id] || [])]
}

function openAdd() {
  if (!currentEmployee.value) {
    ElMessage.warning('Select an employee first')
    return
  }

  mode.value = 'add'
  editingId.value = ''
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(skill: SkillItem) {
  mode.value = 'edit'
  editingId.value = skill.id
  formModel.value = { ...skill }
  dialogVisible.value = true
}

async function submit() {
  if (!formModel.value.skill_name) {
    ElMessage.warning('Skill is required')
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

  ElMessageBox.confirm('Delete this skill?', 'Warning', { type: 'warning' })
    .then(() => {
      const target = skillsByEmployee.value[employeeId] || []
      skillsByEmployee.value[employeeId] = target.filter((item) => item.id !== id)
      skills.value = [...skillsByEmployee.value[employeeId]]
      ElMessage.success('Deleted')
    })
    .catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

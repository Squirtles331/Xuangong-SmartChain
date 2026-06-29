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

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? 'Add Skill' : 'Edit Skill'" width="500px">
      <gi-form v-model="form" :columns="formColumns" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getSkillMatrixData } from '@/api/hr'

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

const form = reactive<SkillItem>({
  id: '',
  skill_name: '',
  level: 1,
  cert_number: '',
  expire_date: ''
})

const columns: TableColumnItem<SkillItem>[] = [
  { prop: 'skill_name', label: 'Skill', minWidth: 180 },
  { label: 'Level', minWidth: 180, slotName: 'level' },
  { prop: 'cert_number', label: 'Certificate', minWidth: 150 },
  { prop: 'expire_date', label: 'Expire Date', minWidth: 120 },
  { label: 'Actions', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const formColumns: FormColumnItem[] = [
  { type: 'input', label: 'Skill', field: 'skill_name', required: true },
  {
    type: 'input-number',
    label: 'Level',
    field: 'level',
    required: true,
    props: { min: 1, max: 5 } as any
  },
  { type: 'input', label: 'Certificate', field: 'cert_number' },
  { type: 'date-picker', label: 'Expire Date', field: 'expire_date' }
]

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
  Object.assign(form, { id: '', skill_name: '', level: 1, cert_number: '', expire_date: '' })
  dialogVisible.value = true
}

function openEdit(skill: SkillItem) {
  mode.value = 'edit'
  editingId.value = skill.id
  Object.assign(form, skill)
  dialogVisible.value = true
}

async function submit() {
  if (!form.skill_name) {
    ElMessage.warning('Skill is required')
    return false
  }

  const employeeId = currentEmployee.value?.id
  if (!employeeId) return false

  const target = skillsByEmployee.value[employeeId] || []
  if (mode.value === 'add') {
    const item = { ...form, id: Date.now().toString() }
    target.unshift(item)
  } else {
    const index = target.findIndex((item) => item.id === editingId.value)
    if (index > -1) Object.assign(target[index], form)
  }

  skillsByEmployee.value[employeeId] = target
  skills.value = [...target]
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

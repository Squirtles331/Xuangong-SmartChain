<template>
  <gi-page-layout :bordered="true" :size="240" style="height: calc(100vh - 120px)">
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
    <template #header
      ><h3 style="margin: 0">{{ currentEmp?.name || '请选择员工' }} 技能矩阵</h3></template
    >
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="skills" border stripe size="small">
      <template #level="{ row }"><el-rate v-model="row.level" :max="5" disabled size="small" /></template>
      <template #actions="{ row }"
        ><gi-button type="edit" size="small" @click="openEdit(row)" /><gi-button type="delete" size="small" @click="del(row.id)"
      /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增技能' : '编辑技能'" width="500px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Skill {
  id: string
  skill_name: string
  level: number
  cert_number: string
  expire_date: string
}
const employees = ref([
  { id: '1', name: '李四', children: [] },
  { id: '2', name: '王五', children: [] },
  { id: '3', name: '赵六', children: [] },
  { id: '4', name: '孙八', children: [] }
])
const currentEmp = ref<any>(null)
const skills = ref<Skill[]>([])
const allSkills: Record<string, Skill[]> = {
  '1': [
    { id: 's1', skill_name: '数控车床操作', level: 4, cert_number: 'NC20230001', expire_date: '2026-12-31' },
    { id: 's2', skill_name: '锯床操作', level: 3, cert_number: '', expire_date: '' },
    { id: 's3', skill_name: '钳工', level: 2, cert_number: '', expire_date: '' }
  ],
  '2': [
    { id: 's4', skill_name: '钻床操作', level: 4, cert_number: 'DR20230001', expire_date: '2025-06-30' },
    { id: 's5', skill_name: '磨床操作', level: 2, cert_number: '', expire_date: '' }
  ],
  '3': [
    { id: 's6', skill_name: '装配钳工', level: 5, cert_number: 'AS20220001', expire_date: '2027-03-15' },
    { id: 's7', skill_name: '测试操作', level: 3, cert_number: '', expire_date: '' }
  ],
  '4': [
    { id: 's8', skill_name: '加工中心操作', level: 4, cert_number: 'MC20240001', expire_date: '2027-01-10' },
    { id: 's9', skill_name: '数控车床操作', level: 3, cert_number: '', expire_date: '' }
  ]
}
const cols: TableColumnItem<Skill>[] = [
  { prop: 'skill_name', label: '技能名称', minWidth: 160 },
  { label: '等级', minWidth: 180, slotName: 'level' },
  { prop: 'cert_number', label: '证书编号', minWidth: 150 },
  { prop: 'expire_date', label: '有效期至', minWidth: 120 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
function onNodeClick(d: any) {
  currentEmp.value = d
  skills.value = allSkills[d.id] || []
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ skill_name: '', level: 1, cert_number: '', expire_date: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '技能名称', field: 'skill_name', required: true },
  { type: 'input-number', label: '等级(1-5)', field: 'level', required: true, props: { min: 1, max: 5 } as any },
  { type: 'input', label: '证书编号', field: 'cert_number' },
  { type: 'date-picker', label: '有效期至', field: 'expire_date' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { skill_name: '', level: 1, cert_number: '', expire_date: '' })
  vis.value = true
}
function openEdit(r: Skill) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.skill_name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    skills.value.unshift({ id: Date.now().toString(), ...form } as Skill)
  } else {
    const i = skills.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(skills.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      skills.value = skills.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

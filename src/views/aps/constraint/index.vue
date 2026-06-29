<template>
  <gi-page-layout>
    <template #header><h3>约束理论排程配置</h3></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="模具约束" name="mold">
        <template #tool><gi-button type="add" @click="openAdd('mold')" /></template>
        <gi-table
          :columns="moldCols"
          :data="moldData"
          :pagination="moldPagination"
          :loading="moldLoading"
          border
          stripe
          size="small"
        >
          <template #available="{ row }">
            <el-tag :type="row.available ? 'success' : 'danger'" size="small">{{ row.available ? '是' : '否' }}</el-tag>
          </template>
          <template #utilization="{ row }">
            <el-progress :percentage="getMoldUtil(row)" :stroke-width="8" :color="utilColor(getMoldUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('mold', row)" />
            <gi-button type="delete" @click="delMold(row)" />
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="刀具约束" name="tool">
        <template #tool><gi-button type="add" @click="openAdd('tool')" /></template>
        <gi-table
          :columns="toolCols"
          :data="toolData"
          :pagination="toolPagination"
          :loading="toolLoading"
          border
          stripe
          size="small"
        >
          <template #available="{ row }">
            <el-tag :type="row.available ? 'success' : 'danger'" size="small">{{ row.available ? '是' : '否' }}</el-tag>
          </template>
          <template #utilization="{ row }">
            <el-progress :percentage="getToolUtil(row)" :stroke-width="8" :color="utilColor(getToolUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('tool', row)" />
            <gi-button type="delete" @click="delTool(row)" />
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="人员技能约束" name="skill">
        <template #tool><gi-button type="add" @click="openAdd('skill')" /></template>
        <gi-table
          :columns="skillCols"
          :data="skillData"
          :pagination="skillPagination"
          :loading="skillLoading"
          border
          stripe
          size="small"
        >
          <template #utilization="{ row }">
            <el-progress :percentage="getSkillUtil(row)" :stroke-width="8" :color="utilColor(getSkillUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('skill', row)" />
            <gi-button type="delete" @click="delSkill(row)" />
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>

    <ConstraintFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :constraint-type="currentConstraintType"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { useConstraintStore } from '@/stores/constraint'
import { useTable } from '@/hooks/useTable'
import ConstraintFormDialog, { type ConstraintFormModel } from './ConstraintFormDialog.vue'

const store = useConstraintStore()
const tab = ref('mold')

const moldCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '模具编码', minWidth: 150 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'applicable', label: '适用物料', minWidth: 120 },
  { prop: 'life', label: '设计寿命', minWidth: 100 },
  { label: '可用', minWidth: 70, slotName: 'available', align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const toolCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '刀具编码', minWidth: 130 },
  { prop: 'name', label: '名称', minWidth: 160 },
  { prop: 'applicable', label: '适用设备', minWidth: 140 },
  { prop: 'life', label: '寿命', minWidth: 80 },
  { label: '可用', minWidth: 70, slotName: 'available', align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const skillCols: TableColumnItem<any>[] = [
  { prop: 'operation', label: '工序', minWidth: 100 },
  { prop: 'skill', label: '技能要求', minWidth: 160 },
  { prop: 'min_level', label: '最低等级', minWidth: 80, align: 'center' },
  { prop: 'workers_count', label: '具备人数', minWidth: 80, align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

// ==================== useTable ====================
const { tableData: moldData, pagination: moldPagination, loading: moldLoading, refresh: refreshMolds } = useTable<any>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return {
      list: store.molds.slice(start, start + size),
      total: store.molds.length
    }
  }
})

const { tableData: toolData, pagination: toolPagination, loading: toolLoading, refresh: refreshTools } = useTable<any>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return {
      list: store.tools.slice(start, start + size),
      total: store.tools.length
    }
  }
})

const { tableData: skillData, pagination: skillPagination, loading: skillLoading, refresh: refreshSkills } = useTable<any>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return {
      list: store.skills.slice(start, start + size),
      total: store.skills.length
    }
  }
})

// ==================== 利用率计算 ====================
function getMoldUtil(row: any): number {
  const lifeNum = parseInt(row.life) || 100
  const used = Math.floor(Math.random() * lifeNum * 0.8)
  return Math.round((used / lifeNum) * 100)
}
function getToolUtil(row: any): number {
  const lifeNum = parseInt(row.life) || 100
  const used = Math.floor(Math.random() * lifeNum * 0.7)
  return Math.round((used / lifeNum) * 100)
}
function getSkillUtil(row: any): number {
  const assigned = Math.max(1, row.workers_count - Math.floor(Math.random() * 2))
  return Math.round((assigned / row.workers_count) * 100)
}
function utilColor(pct: number): string {
  if (pct >= 80) return '#f56c6c'
  if (pct >= 60) return '#e6a23c'
  return '#67c23a'
}

// ==================== 对话框 ====================
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const currentConstraintType = ref<'mold' | 'tool' | 'skill'>('mold')
const editingId = ref('')
const formModel = ref<ConstraintFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ConstraintFormModel {
  return { id: '', code: '', name: '', applicable: '', life: '' }
}

function openAdd(type: 'mold' | 'tool' | 'skill') {
  currentConstraintType.value = type
  dialogMode.value = 'add'
  editingId.value = ''
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(type: 'mold' | 'tool' | 'skill', row: any) {
  currentConstraintType.value = type
  dialogMode.value = 'edit'
  editingId.value = row.id
  formModel.value = { ...row }
  dialogVisible.value = true
}

function submitDialog() {
  const listMap: Record<string, any[]> = {
    mold: store.molds,
    tool: store.tools,
    skill: store.skills
  }
  const list = listMap[currentConstraintType.value]
  if (!list) return

  if (dialogMode.value === 'add') {
    list.unshift({ id: Date.now().toString(), ...formModel.value })
  } else {
    const idx = list.findIndex((e: any) => e.id === editingId.value)
    if (idx > -1) Object.assign(list[idx], formModel.value)
  }
  dialogVisible.value = false
  refreshAll()
}

function refreshAll() {
  refreshMolds()
  refreshTools()
  refreshSkills()
}

function delMold(row: any) {
  const idx = store.molds.findIndex((e: any) => e.id === row.id)
  if (idx > -1) store.molds.splice(idx, 1)
  refreshMolds()
}
function delTool(row: any) {
  const idx = store.tools.findIndex((e: any) => e.id === row.id)
  if (idx > -1) store.tools.splice(idx, 1)
  refreshTools()
}
function delSkill(row: any) {
  const idx = store.skills.findIndex((e: any) => e.id === row.id)
  if (idx > -1) store.skills.splice(idx, 1)
  refreshSkills()
}
</script>

<template>
  <gi-page-layout>
    <template #header>
      <div class="page-title">APS 约束配置</div>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="模具约束" name="mold" />
      <el-tab-pane label="刀具约束" name="tool" />
      <el-tab-pane label="人员技能约束" name="skill" />
    </el-tabs>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refreshCurrent" />
    </template>

    <gi-table
      :columns="currentColumns"
      :data="currentData"
      :pagination="currentPagination"
      :loading="currentLoading"
      border
      stripe
      style="height: 100%"
    >
      <template #available="{ row }">
        <el-tag :type="row.available ? 'success' : 'danger'" size="small">
          {{ row.available ? '是' : '否' }}
        </el-tag>
      </template>

      <template #utilization="{ row }">
        <el-progress :percentage="row.utilization || 0" :stroke-width="8" :color="utilColor(row.utilization || 0)" />
      </template>

      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" style="margin-left: 8px" @click="remove(row)" />
      </template>
    </gi-table>

    <ConstraintFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" :constraint-type="tab" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { deleteConstraint, getConstraintList, saveConstraint, type MoldConstraint, type SkillConstraint, type ToolConstraint } from '@/api/aps'
import { useTable } from '@/hooks/useTable'
import ConstraintFormDialog, { type ConstraintFormModel } from './ConstraintFormDialog.vue'

const tab = ref<'mold' | 'tool' | 'skill'>('mold')

const moldColumns: TableColumnItem<MoldConstraint>[] = [
  { prop: 'code', label: '模具编码', minWidth: 150 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'applicable', label: '适用物料', minWidth: 140 },
  { prop: 'life', label: '设计寿命', minWidth: 120 },
  { label: '是否可用', minWidth: 100, align: 'center', slotName: 'available' },
  { label: '利用率', minWidth: 160, slotName: 'utilization' },
  { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
]

const toolColumns: TableColumnItem<ToolConstraint>[] = [
  { prop: 'code', label: '刀具编码', minWidth: 140 },
  { prop: 'name', label: '名称', minWidth: 160 },
  { prop: 'applicable', label: '适用设备', minWidth: 140 },
  { prop: 'life', label: '寿命', minWidth: 100 },
  { label: '是否可用', minWidth: 100, align: 'center', slotName: 'available' },
  { label: '利用率', minWidth: 160, slotName: 'utilization' },
  { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
]

const skillColumns: TableColumnItem<SkillConstraint>[] = [
  { prop: 'operation', label: '工序', minWidth: 120 },
  { prop: 'skill', label: '技能要求', minWidth: 180 },
  { prop: 'min_level', label: '最低等级', minWidth: 90, align: 'center' },
  { prop: 'workers_count', label: '具备人数', minWidth: 90, align: 'center' },
  { label: '利用率', minWidth: 160, slotName: 'utilization' },
  { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
]

const {
  tableData: moldData,
  pagination: moldPagination,
  loading: moldLoading,
  refresh: refreshMolds,
  onDelete: onDeleteMold
} = useTable<MoldConstraint>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getConstraintList<MoldConstraint>({ type: 'mold', pageNum: page, pageSize: size })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteConstraint('mold', id)))
})

const {
  tableData: toolData,
  pagination: toolPagination,
  loading: toolLoading,
  refresh: refreshTools,
  onDelete: onDeleteTool
} = useTable<ToolConstraint>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getConstraintList<ToolConstraint>({ type: 'tool', pageNum: page, pageSize: size })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteConstraint('tool', id)))
})

const {
  tableData: skillData,
  pagination: skillPagination,
  loading: skillLoading,
  refresh: refreshSkills,
  onDelete: onDeleteSkill
} = useTable<SkillConstraint>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getConstraintList<SkillConstraint>({ type: 'skill', pageNum: page, pageSize: size })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteConstraint('skill', id)))
})

const currentColumns = computed(() => {
  if (tab.value === 'mold') return moldColumns
  if (tab.value === 'tool') return toolColumns
  return skillColumns
})

const currentData = computed(() => {
  if (tab.value === 'mold') return moldData.value
  if (tab.value === 'tool') return toolData.value
  return skillData.value
})

const currentPagination = computed(() => {
  if (tab.value === 'mold') return moldPagination
  if (tab.value === 'tool') return toolPagination
  return skillPagination
})

const currentLoading = computed(() => {
  if (tab.value === 'mold') return moldLoading.value
  if (tab.value === 'tool') return toolLoading.value
  return skillLoading.value
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ConstraintFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ConstraintFormModel {
  return {
    id: '',
    code: '',
    name: '',
    applicable: '',
    life: '',
    available: true,
    utilization: 0,
    operation: '',
    skill: '',
    min_level: 1,
    workers_count: 1
  }
}

function utilColor(pct: number) {
  if (pct >= 80) return '#f56c6c'
  if (pct >= 60) return '#e6a23c'
  return '#67c23a'
}

function refreshCurrent() {
  if (tab.value === 'mold') return refreshMolds()
  if (tab.value === 'tool') return refreshTools()
  return refreshSkills()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: any) {
  dialogMode.value = 'edit'
  formModel.value = {
    ...createDefaultFormModel(),
    ...row
  }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveConstraint({
    ...formModel.value,
    type: tab.value
  })
  dialogVisible.value = false
  await refreshCurrent()
}

function remove(row: any) {
  if (tab.value === 'mold') return onDeleteMold(row)
  if (tab.value === 'tool') return onDeleteTool(row)
  return onDeleteSkill(row)
}
</script>

<style scoped>
.page-title {
  font-size: 18px;
  font-weight: 600;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
